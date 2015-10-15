import numpy

import theano
import theano.tensor as T
import theano.tensor.shared_randomstreams

from Layers.ConvNet import LeNetConvPoolLayer

from Layers.LogisticRegression import LogisticRegression
from Layers.LinearRegression import LinearRegression

def rectify(x):
    return T.maximum(x, 0.)

def dropout(rng, x, p=0.5):

    """ Zero-out random values in x with probability p using rng """

    if p > 0. and p < 1.:
        seed = rng.randint(2 ** 30)
        srng = theano.tensor.shared_randomstreams.RandomStreams(seed)
        mask = srng.binomial(n=1, p=1.-p, size=x.shape, dtype=theano.config.floatX)
        return x * mask

    return x


class ParameterFactory(object):
    def __init__(self, rng):
        self.rng = rng
    # Get a weight matrix
    def create_weights(self, shape):
        return numpy.zeros(shape, dtype=theano.config.floatX)
    # Get biases
    def create_biases(self, shape):
        return numpy.zeros(shape, dtype=theano.config.floatX)

class NormalParameters(ParameterFactory):
    def __init__(self, rng, a = 0.0, mu = 0.0, var = 1.0):
        super().__init__(rng)
        self.a = a
        self.mu = mu
        self.var = var
    # Get a weight matrix
    def create_weights(self, shape):
        return numpy.asarray(self.rng.normal(self.mu, self.var, size=shape), dtype=theano.config.floatX)
    # Get biases
    def create_biases(self, shape):
        return self.a*numpy.ones(shape, dtype=theano.config.floatX)
    

class TanhParameters(ParameterFactory):
    def __init__(self, rng):
        super().__init__(rng)
    
    # Override to provide weights.
    def create_weights(self, shape):
        return numpy.asarray(self.rng.uniform(
                low=-numpy.sqrt(6. / (shape[0] + shape[1])),
                high=numpy.sqrt(6. / (shape[0] + shape[1])),
                size=shape), dtype=theano.config.floatX)


class BaseLayer(object):
    def __init__(self, input, n_in, n_out, parameterFactory, W=None, b=None):
        self.input = input
        self.input_size = n_in
        self.output_size = n_out

        if W is None:
            W_values = parameterFactory.create_weights((self.input_size, self.output_size))
            W = theano.shared(value=W_values, name='W', borrow=True)
        if b is None:
            b_values = parameterFactory.create_biases((self.output_size,))
            b = theano.shared(value=b_values, name='b', borrow=True)

        self.W = W
        self.b = b
        self.output = T.dot(self.input, self.W) + self.b

        # parameters of the model
        self.params = [self.W, self.b]
    def dropout_copy(self, input, weight_scale):
        return self.ctor(None, input, self.input_size, self.output_size, self.W*weight_scale, self.b)

class LinearLayer(BaseLayer):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None):
        super().__init__(input, n_in, n_out, ParameterFactory(rng), W, b)
        self.ctor = LinearLayer

class TanhLayer(BaseLayer):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None):
        super().__init__(input, n_in, n_out, TanhParameters(rng), W, b)
        self.ctor = TanhLayer
        # Redefine the output
        self.output = T.tanh(self.output)


class ReluLayer(BaseLayer):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None):
        super().__init__(input, n_in, n_out, NormalParameters(rng, 1.0, 0.0, 0.01), W, b)
        self.ctor = ReluLayer
        # Redefine the output
        self.output = rectify(self.output)
 

class LinearRegressionLayer(BaseLayer):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None):
        super().__init__(input, n_in, n_out, ParameterFactory(rng), W, b)        
        self.ctor = LinearRegressionLayer
        # Use the output as prediction.
        self.y_pred = self.output

    def errors(self, y):
        # check if y has same dimension of y_pred
        if y.ndim != self.y_pred.ndim:
            raise TypeError('y should have the same shape as self.y_pred',                
                            ('y', target.type, 'y_pred', self.y_pred.type))

        diff = self.y_pred - y
        return T.sum(diff**2, axis=1)

    def cost(self, y):
        return T.mean(self.errors(y))


class LogisticRegressionLayer(LinearRegressionLayer):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None):
        super().__init__(rng, input, n_in, n_out, W, b)
        self.ctor = LogisticRegressionLayer

        # compute vector of class-membership probabilities in symbolic form
        self.p_y_given_x = T.nnet.softmax(self.output)

        # compute prediction as class whose probability is maximal in
        # symbolic form
        self.y_pred = T.argmax(self.p_y_given_x, axis=1)
    
    def errors(self, y):
        # check if y has same dimension of y_pred
        if y.ndim != self.y_pred.ndim:
            raise TypeError('y should have the same shape as self.y_pred',
                ('y', target.type, 'y_pred', self.y_pred.type))
        # check if y is of the correct datatype
        if y.dtype.startswith('int'):
            # the T.neq operator returns a vector of 0s and 1s, where 1
            # represents a mistake in prediction
            return T.mean(T.neq(self.y_pred, y))
        else:
            raise NotImplementedError()

    def cost(self, y):        
        return -T.mean(T.log(self.p_y_given_x)[T.arange(y.shape[0]), y])         



class MLPReg(object):
    def __init__(self, rng, input, topology):


        self.hiddenLayers = []
        self.input = input
        self.rng = rng

        # Create [(in, h1), (h1, h2), ..., (hn, log)]
        layerDefinitions = list(zip(
            [l[1] for l in topology[1:]],
            [l[0] for l in topology[:-1]], 
            [l[0] for l in topology[1:]]))
       
        to_layer = input        
        for layerDefinition in layerDefinitions[:-1]:           
            layer_type = layerDefinition[0]
            layer_in = layerDefinition[1]
            layer_out = layerDefinition[2]
            layer=layer_type(rng=rng, input=to_layer, n_in=layer_in, n_out=layer_out)
            self.hiddenLayers.append(layer)
            to_layer = layer.output

        
        # The output layer gets as input the hidden units
        # of the hidden layer
        output_type = layerDefinitions[-1][0]
        layer_in = layerDefinitions[-1][1]
        layer_out = layerDefinitions[-1][2]
        self.outputLayer = output_type(rng=rng, 
                                                 input=to_layer, 
                                                 n_in=layer_in, 
                                                 n_out = layer_out)
       
        # Create regularization expressions        
        self.L1 = abs(self.outputLayer.W).sum()
        self.L2_sqr = (self.outputLayer.W ** 2).sum()
        for hl in self.hiddenLayers:
            self.L1 += abs(hl.W).sum()
            self.L2_sqr += (hl.W ** 2).sum()

      
        
        # same holds for the function computing the number of errors
        self.errors = self.outputLayer.errors

        # Get the prediction
        self.y_pred = self.outputLayer.y_pred

        # Compute the distance
        self.cost = self.outputLayer.cost
        self.cost_drop = self.dropout_cost([0.2, 0.5])


        # the parameters of the model are the parameters of the two layer it is
        # made out of        
        self.params = self.outputLayer.params
        for hl in self.hiddenLayers:
            self.params += hl.params

    # Build the dropout cost.
    def dropout_cost(self, rates):
        # Expand the last entry of the rates list to the remaining layers.
        expandedRates = []
        for i in range(len(self.hiddenLayers) +1):
            rateIndex = min(i, len(rates) - 1)
            expandedRates.append(rates[rateIndex])
        
        dr = expandedRates[0]
        dr_input = dropout(self.rng, self.input, dr)
        weight_scale = 1./(1.-dr)
        for l, dr in zip(self.hiddenLayers, expandedRates[1:]):
            droplayer = l.dropout_copy(dr_input, weight_scale)
            dr_input = dropout(self.rng, droplayer.output, dr)
            weight_scale = 1./(1.-dr)
        droplayer = self.outputLayer.dropout_copy(dr_input, weight_scale)
        return droplayer.cost

class DAE(object):
    def __init__(self, rng, trainLayer, dr):        
        noised_input = dropout(rng, trainLayer.input, dr)
        weight_scale = 1#1./(1.-dr)
        self.hiddenLayer = trainLayer.dropout_copy(noised_input, weight_scale) 
        self.reconstructLayer = LinearRegression(self.hiddenLayer.output, self.hiddenLayer.output_size, self.hiddenLayer.input_size)
        # The parameters are the training layer parameters and the reconstruction layer parameters.
        # The hiddenLayer parameters are a function of the training layer parameters!
        self.params = trainLayer.params + self.reconstructLayer.params
        self.cost = self.reconstructLayer.distance(trainLayer.input)

class ConvNet(object):
    def __init__(self, rng, input, input_dimensions, kernel_dimensions, rectified=False):
        activation = T.tanh
        if rectified:
            activation = rectify
        
        n_variates = 1 #Assume monochrome image in
        # The batch size is optional
        input_dimension_index = 0
        batch_size = None
        if len(input_dimensions) == 3:
            batch_size = input_dimensions[input_dimension_index]
            input_dimension_index += 1
        sizeY = input_dimensions[input_dimension_index]
        sizeX = input_dimensions[input_dimension_index + 1]
        
        # Reshape the input
        if batch_size:
            # Get the batch size from parameters.
            tensor_input = input.reshape((batch_size, n_variates, sizeY, sizeX))
        else:        
            # Get the batch size from data.
            tensor_input = input.reshape((input.shape[0], n_variates, sizeY, sizeX))
        
        # Create the layers list.
        self.layers = []
        for kern in kernel_dimensions:
            # Unwrap dimensions to 4D tensors.
            filter_dimensions = (kern[0], n_variates, kern[1], kern[2])
            # Don't specify  the batch size
            feature_map_dimensions = (batch_size, n_variates, sizeY, sizeX)

            # Construct layer
            layer = LeNetConvPoolLayer(rng, tensor_input, 
                                       filter_shape=filter_dimensions,
                                       image_shape = feature_map_dimensions,
                                       activation = activation)
            self.layers.append(layer)
            # Update
            tensor_input = layer.output
            n_variates = filter_dimensions[0]
            sizeY = int((feature_map_dimensions[2] - filter_dimensions[2] + 1)/2)
            sizeX = int((feature_map_dimensions[3] - filter_dimensions[3] + 1)/2)
       
        self.output_size = n_variates*sizeY*sizeX
        self.output = self.layers[-1].output.flatten(2)
        self.L2_sqr = T.constant(0)
        self.params = []
        for l in self.layers:
            self.L2_sqr += (l.W ** 2).sum()
            self.params += l.params





class HiddenLayer(object):
    def __init__(self, rng, input, n_in, n_out, W=None, b=None,
                 activation=T.tanh):
        """
        Typical hidden layer of a MLP: units are fully-connected and have
        sigmoidal activation function. Weight matrix W is of shape (n_in,n_out)
        and the bias vector b is of shape (n_out,).

        NOTE : The nonlinearity used here is tanh

        Hidden unit activation is given by: tanh(dot(input,W) + b)

        :type rng: numpy.random.RandomState
        :param rng: a random number generator used to initialize weights

        :type input: theano.tensor.dmatrix
        :param input: a symbolic tensor of shape (n_examples, n_in)

        :type n_in: int
        :param n_in: dimensionality of input

        :type n_out: int
        :param n_out: number of hidden units

        :type activation: theano.Op or function
        :param activation: Non linearity to be applied in the hidden
                           layer
        """
        self.input = input
        self.input_size = n_in
        self.output_size = n_out

        # `W` is initialized with `W_values` which is uniformely sampled
        # from sqrt(-6./(n_in+n_hidden)) and sqrt(6./(n_in+n_hidden))
        # for tanh activation function
        # the output of uniform if converted using asarray to dtype
        # theano.config.floatX so that the code is runable on GPU
        # Note : optimal initialization of weights is dependent on the
        #        activation function used (among other things).
        #        For example, results presented in [Xavier10] suggest that you
        #        should use 4 times larger initial weights for sigmoid
        #        compared to tanh
        #        We have no info for other function, so we use the same as
        #        tanh.
        if W is None:
            W_values = numpy.asarray(rng.uniform(
                    low=-numpy.sqrt(6. / (n_in + n_out)),
                    high=numpy.sqrt(6. / (n_in + n_out)),
                    size=(n_in, n_out)), dtype=theano.config.floatX)
            if activation == theano.tensor.nnet.sigmoid:
                W_values *= 4
            W = theano.shared(value=W_values, name='W', borrow=True)

        if b is None:
            b_values = numpy.zeros((n_out,), dtype=theano.config.floatX)
            b = theano.shared(value=b_values, name='b', borrow=True)

        self.W = W
        self.b = b
        
        self.activation = activation
        lin_output = T.dot(input, self.W) + self.b
        self.output = (lin_output if activation is None
                       else activation(lin_output))
        # parameters of the model
        self.params = [self.W, self.b]


class MLP(object):
    """Multi-Layer Perceptron Class

    A multilayer perceptron is a feedforward artificial neural network model
    that has one layer or more of hidden units and nonlinear activations.
    Intermediate layers usually have as activation function tanh or the
    sigmoid function (defined here by a ``HiddenLayer`` class)  while the
    top layer is a softamx layer (defined here by a ``LogisticRegression``
    class).
    """

    def __init__(self, rng, input, topology, rectified=False, dropout_rate=0.5):
        """Initialize the parameters for the multilayer perceptron

        :type rng: numpy.random.RandomState
        :param rng: a random number generator used to initialize weights

        :type input: theano.tensor.TensorType
        :param input: symbolic variable that describes the input of the
        architecture (one minibatch)

        :type topology: List of ints of layer sizes [in, h1, h2,..., log]
        """

        # Create [(in, h1), (h1, h2), ..., (hn, log)]
        inout = list(zip(topology[:-1], topology[1:]))


        toLayer = input
        toLayer_drop = dropout(rng, input, 0.2)
        weight_scale = 1. / (1. - 0.2)
        self.hiddenLayers = []
        self.dropoutLayers = []
        activation_function = T.tanh
        if rectified:
            activation_function = rectify
        
        for io in inout[:-1]:
            l=HiddenLayer(rng=rng, input=toLayer, n_in=io[0], n_out=io[1], activation=activation_function)
            self.hiddenLayers.append(l)
            toLayer = l.output
            
            l_d=HiddenLayer(rng=rng, input=toLayer_drop, n_in=io[0], n_out=io[1], activation=activation_function, W=l.W*weight_scale, b=l.b*weight_scale)
            self.dropoutLayers.append(l_d)            
            
            weight_scale = 1. / (1. - dropout_rate)
            toLayer_drop = dropout(rng, l_d.output, dropout_rate)


        
        # The logistic regression layer gets as input the hidden units
        # of the hidden layer
        self.logRegressionLayer = LogisticRegressionLayer(rng,
            input=toLayer,
            n_in=inout[-1][0],
            n_out=inout[-1][1])

        # The dropout path
        self.logRegressionLayer_drop = LogisticRegression(
            input=toLayer_drop,
            n_in=inout[-1][0],
            n_out=inout[-1][1],
            W = self.logRegressionLayer.W * weight_scale,
            b = self.logRegressionLayer.b * weight_scale)

       
        # Create regularization expressions        
        self.L1 = abs(self.logRegressionLayer.W).sum()
        self.L2_sqr = (self.logRegressionLayer.W ** 2).sum()
        for hl in self.hiddenLayers:
            self.L1 += abs(hl.W).sum()
            self.L2_sqr += (hl.W ** 2).sum()

      
        # negative log likelihood of the MLP is given by the negative
        # log likelihood of the output of the model, computed in the
        # logistic regression layer
        self.negative_log_likelihood = self.logRegressionLayer.cost
        
        # Drop path
        self.negative_log_likelihood_drop = self.logRegressionLayer_drop.negative_log_likelihood
        
        # same holds for the function computing the number of errors
        self.errors = self.logRegressionLayer.errors

        # Get the prediction
        self.y_pred = self.logRegressionLayer.y_pred

        # the parameters of the model are the parameters of the two layer it is
        # made out of
        #self.params = self.hiddenLayer.params + self.logRegressionLayer.params
        self.params = self.logRegressionLayer.params
        for hl in self.hiddenLayers:
            self.params += hl.params
