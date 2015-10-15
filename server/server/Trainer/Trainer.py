import numpy
import theano
import theano.tensor as T
import time
import matplotlib.pyplot as plt


class VariableAndData(object):
    def __init__(self, variable, data, size = None):
        self.variable = variable
        self.data = data
        if not size:
            #If size is not given assume it is a shared variable
            size = self.data.get_value(borrow=True).shape[0]
        self.dataSize = size
    def slice(self, start, end):
        return self.data[start:end]

class StateManager(object):
    def __init__(self, params):
        self.params = params
        self.storedState = None

    def restore(self):
        if self.storedState:
            for paramIndex in range(len(self.params)):
                param = self.params[paramIndex]
                value = self.storedState[paramIndex]
                param.set_value(value)
    
    def save(self):
        # Get the current value of the parameters and store them
        self.storedState = []
        for param in self.params:
            # Assume they are all theano.shared
            self.storedState.append(param.get_value())

class MLPBatchTrainer(object):
    def __init__(self):
        return
    
    def getUpdates(self, cost, params, lr, rms=True):

        # compute the gradient of cost with respect to theta (sotred in params)
        # the resulting gradients will be stored in a list gparams
        gparams = []
        for param in params:
            gparam = T.grad(cost, param)
            gparams.append(gparam)
                            
        # specify how to update the parameters of the model as a list of
        # (variable, update expression) pairs
        rho = 0.9
        eps = 1e-6
        updates = []
        if rms:
            # Use RMSProp (scale the gradient).
            for param, gparam in zip(params, gparams):
                acc = theano.shared(param.get_value() * 0.)
                acc_new  = rho*acc + (1.0-rho)*gparam**2
                g_scale = T.sqrt(acc_new + eps)
                gparam = gparam/g_scale
                updates.append((acc, acc_new)) 
                updates.append((param, param - lr * gparam)) 
        else:                    
            # given two list the zip A = [a1, a2, a3, a4] and B = [b1, b2, b3, b4] of
            # same length, zip generates a list C of same size, where each element
            # is a pair formed from the two lists :
            #    C = [(a1, b1), (a2, b2), (a3, b3), (a4, b4)]
            for param, gparam in zip(params, gparams):
                updates.append((param, param - lr * gparam)) 
        
        return updates            




    def getMinibatchTrainer(self, costFunction, variableToData, rms=True):
        # define params        
        lr = T.fscalar('lr')    
        start = T.iscalar('start')
        end = T.iscalar('end')

        # Get the cost and its parameters.
        params = costFunction[0]
        cost = costFunction[1]

        # Get the updates.
        updates = self.getUpdates(cost, params, lr, rms)
        # Store all state variables.
        stateManager = StateManager([u[0] for u in updates])

        # Slice the data
        givens = dict()
        for item in variableToData:
            givens[item.variable] = item.slice(start,end)
        
                
        # Define the training function.
        train_model = theano.function(inputs=[theano.Param(start, borrow = True), 
                                              theano.Param(end, borrow=True), 
                                              theano.Param(lr, borrow=True)],
                                        outputs=theano.Out(cost, borrow=True),
                                        updates=updates,
                                        givens=givens)

        
        return train_model, stateManager

    def getEpochTrainer(self, costFunction, variableToData, batch_size = 512, rms=True):        
        miniBatchFunction, stateManager = self.getMinibatchTrainer(costFunction, variableToData, rms)        
        n_samples = variableToData[0].dataSize
        batch_size = min(batch_size, n_samples)
        n_batches = int(n_samples / batch_size)

        # Define function that runs one epoch
        def runEpoch(lr):                
            accumulated_cost = 0.
            #c = []
            for index in range(n_batches):
                minibatchCost = miniBatchFunction(index * batch_size,
                                                  (index + 1) * batch_size,                                                  
                                                  lr)                
                #c.append(minibatchCost)
                accumulated_cost += minibatchCost                    
            
            #plt.plot(c)    
            #plt.show()                
            return accumulated_cost / n_batches
        return runEpoch, stateManager

    def train(self, x, y, costFunction, train_set_x, train_set_y, batch_size=512, learning_rate=0.1, epochs=10, max_batches = -1, weight=None, train_weight = None, rms=True):
        """
        classifier: The classifier to train.
        x: Symbolic input
        y: Symbolic labels
        costFunction: tuple, (params, expression of cost to optimize)
        train_set_x: Input training set
        train_set_y: Input training labels
        """       

        # Get the cost and its parameters.
        params = costFunction[0]
        cost = costFunction[1]

        # compute the gradient of cost with respect to theta (sotred in params)
        # the resulting gradients will be stored in a list gparams
        gparams = []
        for param in params:
            gparam = T.grad(cost, param)
            gparams.append(gparam)

        # specify how to update the parameters of the model as a list of
        # (variable, update expression) pairs
        rho = 0.9
        eps = 1e-6
        updates = []
        if rms:
            # Use RMSProp (scale the gradient).
            for param, gparam in zip(params, gparams):
                acc = theano.shared(param.get_value() * 0.)
                acc_new  = rho*acc + (1.0-rho)*gparam**2
                g_scale = T.sqrt(acc_new + eps)
                gparam = gparam/g_scale
                updates.append((acc, acc_new)) 
                updates.append((param, param - learning_rate * gparam)) 
        else:                    
            # given two list the zip A = [a1, a2, a3, a4] and B = [b1, b2, b3, b4] of
            # same length, zip generates a list C of same size, where each element
            # is a pair formed from the two lists :
            #    C = [(a1, b1), (a2, b2), (a3, b3), (a4, b4)]
            for param, gparam in zip(params, gparams):
                updates.append((param, param - learning_rate * gparam)) 
                


        # Compute actual batch size
        n_samples = train_set_x.get_value(borrow=True).shape[0]
        batch_size = min(batch_size, n_samples)

        index = T.lscalar()  # index to a [mini]batch
        if not weight:
            # Define the training function.
            train_model = theano.function(inputs=[theano.Param(index, borrow=True)],
                                          outputs=theano.Out(cost, borrow=True),
                                          updates=updates,
                                          givens={
                                               x: train_set_x[index * batch_size:(index + 1) * batch_size],
                                               y: train_set_y[index * batch_size:(index + 1) * batch_size]})
        else:
            # Define the training function.
            train_model = theano.function(inputs=[index],
                                          outputs=cost,
                                          updates=updates,
                                          givens={
                                               x: train_set_x[index * batch_size:(index + 1) * batch_size],
                                               y: train_set_y[index * batch_size:(index + 1) * batch_size],
                                               weight: train_weight[index * batch_size:(index + 1) * batch_size]})

        # Compute number of batches to run.
        n_batches = int(n_samples / batch_size)
        if max_batches != -1:
            n_batches = min(max_batches, n_batches)
        
            
        #print(train_model.maker.fgraph.toposort())
        #input('Press smthn')

        print("Batches: ", n_batches)
               
        prev_cost= 0.
        result = []
        for e in range(epochs):
            print("Startng epoch ", e)
            avg_cost = 0.
            for i in range(n_batches):
                c = train_model(i)                
                avg_cost += c
                #print "Cost: ", c
            avg_cost /= n_batches
            print("Average cost {0}, Cost diff {1}".format(avg_cost, prev_cost - avg_cost))
            prev_cost = avg_cost
            result.append(avg_cost)

        return result


    def trainALR(self, train_function, validation_function, 
                 initial_learning_rate=0.001, epochs=100, 
                 convergence_criteria=0.001,
                 max_runs = 30,
                 state_manager = None):            
        """
           train_function - Function that has the current learning rate as parameter.
           validation_function - Function that returns a validation score.
           initial_learning_rate - The initial guess for the learning rate.
           epochs - The number of epochs to run before each validation.
           convergence_criteria - If the validation score is below this value the function returns.
           max_runs - The maximum number of runs to make.
        """

        best_score = None        
        current_learning_rate = initial_learning_rate
        
        # Keep track of when we started.
        t0 = time.time()

        learning_rate_eps = 1e-8
        max_learning_rate = 0.9
        min_learning_rate = 1e-9

        training_statistics = []
        improve_eps = 1e-6
        improve_fraction = 1e-4
        for i in range(max_runs):
            
            # Do the first training
            epoch_costs = [train_function(current_learning_rate) for i in range(epochs)]
            
            validation_score = validation_function()[0]                             

            if validation_score < convergence_criteria:
                print("Converged")
                break

            if not best_score:
                # Update the previous to get a baseline
                print("First iteration. Baseline: {0}".format(validation_score))
                best_score = validation_score
                if state_manager:
                    print("Saving baseline parameters")
                    state_manager.save()
                    print("Done writing state")
                continue

            # Compute score delta
            score_delta = best_score - validation_score
            relative_score_delta = score_delta / (current_learning_rate*best_score)
            iteration_statistics = {"training_costs":epoch_costs, 
                                    "validation_score":validation_score, 
                                    "learning_rate": current_learning_rate,
                                    "score_delta":score_delta}
            
            delta_fraction = score_delta / best_score
            print("{0} of {1} - Score: {2}, Delta: {3}".format(i, max_runs, validation_score, score_delta))

            training_statistics.append(iteration_statistics)
            
            if state_manager:
                if score_delta > 0:
                    # Save a new best state
                    print("Overwriting state with new best values.")
                    state_manager.save()
                    print("Done writing state")
                elif score_delta < 0:
                    print("Restoring state to previous best values")
                    state_manager.restore()
                    print("Done restore")
            
            if score_delta > 0:
                # Set previous to current
                best_score = validation_score
            
            # Update learning rate based on relative validation score delta.
            previous_learning_rate = current_learning_rate            
            #if score_delta < improve_eps:
            if delta_fraction < improve_fraction:
                print("Delta fraction: {0} below {1}".format(delta_fraction, improve_fraction))
                current_learning_rate *= 0.3                
            # Cap the learning rate.
            current_learning_rate = float(numpy.max([numpy.min([current_learning_rate, max_learning_rate]), min_learning_rate]))        
        
            if current_learning_rate != previous_learning_rate:
                print("Learning rate {0} -> {1}".format(previous_learning_rate, current_learning_rate))

            # Exit if the learning rate is too small.
            if current_learning_rate < 1e-8:
                print("Learning rate vanished")
                break
                
        # Training time
        t1 = time.time()
        training_time = t1 - t0
        return training_statistics