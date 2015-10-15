import CSVLoader
import pickle
import numpy as np
import featuremapping as fm 
import os
import theano
import theano.tensor as T
from Layers import LogisticRegression
from Layers import nnlayer
from Trainer.Trainer import MLPBatchTrainer, VariableAndData
import random
import time
import sys
import matplotlib.pyplot as plt


def getModalitySet():
    result = ["CT", "US", "CR", "IO", "MG", "DX", "NM", "RG", "OT", "MR", "XA", "SC", "DR"]
    return set(result)

def filterRawData(data, labelIndex=None):
    x = []
    y = []       
    if not labelIndex:
        labelIndex = len(data[0])-1

    for e in data:
        if e[labelIndex].upper() != "UNKNOWN":
            x.append(e[0:labelIndex])
            y.append(e[labelIndex])
    return x, y


def getUnknown(data, labelIndex = None, size=100):
    x = []
    if not labelIndex:
        labelIndex = len(data[0])-1
    for e in data:
        if e[labelIndex].upper() == "UNKNOWN":
            x.append(e)            
    nSamples = min(size, len(x))
    return x[0:nSamples]


def split(x, y, factor):
    totalSize = len(x)
    trainSize = int(totalSize*factor)
    testSize = totalSize - trainSize

    trainX = x[0:trainSize]
    trainY = y[0:trainSize]
    testX = x[trainSize:]
    testY = y[trainSize:]
    return trainX, trainY, testX, testY


def splitData(data, split=0.9):
    trainSize = int(len(data)*split)
    return data[0:trainSize], data[trainSize:]


def buildData(filename, outName, resultSize):
    loader = CSVLoader.Loader()
    headers, rawData = loader.Load(filename)
    
    idIndex = None
    labelIndex = None
    cnt = 0
    for h in headers:
        if h.upper() == 'ID':
            idIndex = cnt            
        elif h.upper() == 'LABEL':
            labelIndex = cnt
        cnt += 1
    

    #rawData = rawData[:100]


    rawData = sorted(rawData, key=lambda x:int(x[0]), reverse=True)
    labeledData = [item for item in rawData if not (item[labelIndex].upper() == 'UNKNOWN')]
    trainData, testData = splitData(labeledData, split=0.99)
    trainData, validationData = splitData(trainData, split=0.99)
    print("Train {0}, Test {1}, Validation {2}".format(len(trainData), len(testData), len(validationData)))
    
    modality = fm.BagOfItemsMap(lambda x: x[1], fm.splitUpper)
    modality.build(modality.getUniqueValues(trainData))
    code = fm.BagOfItemsMap(lambda x: x[2], lambda x: [p[0:min(len(p), 3)] for p in fm.splitUpper(x)])
    code.build(code.getUniqueValues(trainData))
    body = fm.BagOfItemsMap(lambda x: x[3], fm.splitUpper)
    body.build(fm.getCommonTerms(body, trainData, minCount = None, size = 200))
    description = fm.BagOfItemsMap(lambda x: x[4], fm.splitUpper)
    description.build(fm.getCommonTerms(description, trainData, minCount = 10, size = None))
    label = fm.LabelMap(lambda x: x[labelIndex], fm.splitUpper)
    label.build(label.getUniqueValues(trainData))

    itemMapper =  fm.ItemMapper([modality, code, body, description], label)
    print("Beginning mapping of {0} samples".format(len(trainData)))
    mappedTrainX, mappedTrainY = itemMapper.map(trainData)
    mappedValidationX, mappedValidationY = itemMapper.map(validationData)
    
    
    print("Map completed")    



        

    mu = np.mean(mappedTrainX, axis=0)
    sdev = np.std(mappedTrainX, axis=0) + 1e-5
    mappedTrainX = (mappedTrainX - mu) / sdev
    mappedValidationX = (mappedValidationX - mu) / sdev

    # Create Theano shared data
    train_x = theano.shared(mappedTrainX, borrow=True)    
    train_y = T.cast(theano.shared(mappedTrainY, borrow=True), 'int32')
    validation_x = theano.shared(mappedValidationX, borrow=True)    
    validation_y = T.cast(theano.shared(mappedValidationY, borrow=True), 'int32')
        

    rng = np.random.RandomState(1234)

    # allocate symbolic variables for the data
    x = T.matrix('x')  # the data is presented as rasterized images
    y = T.ivector('y')  # the labels are presented as 1D vector of
                        # [int] labels
    

    # the cost we minimize during training is the negative log likelihood of
    # the model in symbolic format
    input_dimension = itemMapper.dimension
    output_dimension = itemMapper.range
    classifier = nnlayer.MLPReg(rng=rng, input=x, topology=[(input_dimension,),
                                                            (100, nnlayer.ReluLayer),
                                                           (output_dimension, nnlayer.LogisticRegressionLayer)])

    cost = classifier.cost(y) + 0.0001*classifier.L2_sqr
    costParams = []
    costParams.extend(classifier.params)
    costFunction = (costParams, cost)

    cum_dim = 0
    for p in classifier.params:    
        cum_dim += p.get_value(borrow=True).size
    print("Model dimension: {0}".format(cum_dim))

    # Create validation function.
    valid_func = theano.function(inputs = [],
                        outputs = [classifier.cost(y)],
                        givens = {x:validation_x, y:validation_y})                            

    # Create trainer
    tt = MLPBatchTrainer()
    
    variableAndData = (VariableAndData(x, train_x), VariableAndData(y, train_y, size=len(trainData)))
    epochFunction, stateMananger = tt.getEpochTrainer(costFunction, variableAndData, batch_size=64, rms = True)        
        
    # Train with adaptive learning rate.
    stats = tt.trainALR(epochFunction, 
                        valid_func, 
                        initial_learning_rate=0.01, 
                        epochs=2, 
                        convergence_criteria=0.0001, 
                        max_runs=10,
                        state_manager = stateMananger)


    validation_scores = [item["validation_score"] for item in stats]
    train_scorees = [item["training_costs"][-1] for item in stats]
    #train_scorees = stats[0]["training_costs"]
    plt.plot(validation_scores, 'g')
    plt.plot(train_scorees, 'r')
    plt.show()
        
    input("Enter to continue:>")

    mappedTestX, mappedTestY = itemMapper.map(testData)
    #Normalize
    mappedTestX = (mappedTestX - mu)/sdev

    # Create Theano shared data
    test_x = theano.shared(mappedTestX, borrow=True)    
    test_y = T.cast(theano.shared(mappedTestY, borrow=True), 'int32')

    # Setup test function
    batch_size=1
    index = T.lscalar()  # index to a [mini]batch
    test_model = theano.function(inputs=[index],
            outputs=(classifier.errors(y), classifier.y_pred),
            givens={
                x: test_x[index * batch_size: (index + 1) * batch_size],
                y: test_y[index * batch_size: (index + 1) * batch_size]})

    n_test_batch = int(test_x.get_value(borrow=True).shape[0] / batch_size)
    errorVector = [test_model(i) for i in range(n_test_batch)]

    #print("Avg. error {0}".format(np.average(errorVector)))
    errCount = 0    
    for i in range(len(errorVector)):
        if errorVector[i][0] > 0.0:
            errCount += 1
            print("Error: {0}, Label:{1}, Predicted:{2}".format(testData[i], testData[i][labelIndex], label.inverseMap(int(errorVector[i][1]))))

    print("Avg: {0}".format(errCount / len(errorVector)))

    input("Enter to continue")

    
    #unknown = getUnknown(rawData, labelIndex, size=resultSize)
    #mappedUnknownX = pipe.mapX(unknown)
    #unknown_x = theano.shared(mappedUnknownX, borrow=True)    
    #n_unknown_batches = int(unknown_x.get_value(borrow=True).shape[0] / batch_size)

    #predict_model = theano.function(inputs=[index],
    #        outputs=classifier.y_pred,
    #        givens={x: unknown_x[index * batch_size: (index + 1) * batch_size]})

    
    #if outFile:
    #    ofh = open("./AnatomyData/{0}.txt".format(outFile), "w")
    #    ofh.write("Id;Prediction;\n")
    #    preds = ["{0};{1}\n".format(unknown[i][idIndex],  labelMapper.inverseMap(predict_model(i))) for i in range(n_unknown_batches)]
    #    for l in preds:
    #        ofh.write(l)
    #    ofh.close()
    #else:
    #    preds = ["{0}, Prediction:{1}".format(unknown[i],  labelMapper.inverseMap(predict_model(i))) for i in range(n_unknown_batches)]
    #    for l in preds:
    #        print(l)

    

if __name__ == "__main__":
    inFile = r"..\Data\Anatomy\mod2All.txt"#"mod2All"
    outFile = None#"nikresult"
    resultSize = 100
    if len(sys.argv) == 4:
        inFile = sys.argv[1]
        outFile = sys.argv[2]
        resultSize = int(sys.argv[3])
    buildData(inFile, outFile, resultSize)
