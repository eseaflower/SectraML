import CSVLoader
from serverutil import JsonSerializable
import featuremapping
import theano
import theano.tensor as T
from Layers import LogisticRegression
from Layers import nnlayer
from Trainer.Trainer import MLPBatchTrainer, VariableAndData
import random
import matplotlib.pyplot as plt
import numpy as np
import os
import pickle
import cloudpickle


class ExperimentFactory(object):
    def __init__(self, experimentId):
        self.id = experimentId
    
    def createDataMapping(self, data):
        return saveDatamapping(self.id, data)

    def createNetwork(self, data):
        return saveHiddenTopology(data)

    def train(self, trainArgs):
        # Load stored experiment data.
        dataMapping = loadDatamapping(self.id)
        data, headers = getDataFile(self.id)

        #Split data into train/validation/test
        trainData, testData = featuremapping.splitData(data, split=0.99)
        trainData, validationData = featuremapping.splitData(trainData, split=0.99)
        
        #Build the mapper based on the training data.
        itemMapper = buildMapper(trainData, headers, dataMapping)
    

        print("Beginning mapping of {0} samples".format(len(trainData)))
        mappedTrainX, mappedTrainY = itemMapper.map(trainData)
        mappedValidationX, mappedValidationY = itemMapper.map(validationData)

        #Normalize
        #mu = np.mean(mappedTrainX, axis=0)
        #sdev = np.std(mappedTrainX, axis=0) + 1e-5
        #mappedTrainX = (mappedTrainX - mu) / sdev
        #mappedValidationX = (mappedValidationX - mu) / sdev

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


        # Check the train args for layers.
        layerArgs = trainArgs["hiddenLayers"]        
        # Start with input
        selectedLayers = [(input_dimension,)]
        for l in layerArgs:
            selectedLayers.append((l, nnlayer.ReluLayer))
        # Add regression layer
        selectedLayers.append((output_dimension, nnlayer.LogisticRegressionLayer))

        classifier = nnlayer.MLPReg(rng=rng, input=x, topology=selectedLayers)
        
#        classifier = nnlayer.MLPReg(rng=rng, input=x, topology=[(input_dimension,),
#                                                                (100, nnlayer.ReluLayer),
#                                                               (output_dimension, nnlayer.LogisticRegressionLayer)])

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

        experimentDir = getCreateExperimentDir(self.id)
        modelFilename = "{0}/model.pkl".format(experimentDir)
        # Save all relevant model data, include normalization if this is used.
        save(modelFilename, x, y, classifier, itemMapper)


    def predict(self, data):
        experimentDir = getCreateExperimentDir(self.id)
        modelFilename = "{0}/model.pkl".format(experimentDir)
        x, y, classifier, itemMapper = load(modelFilename)
            
        predict_func = theano.function(inputs=[x],
                                        outputs=classifier.y_pred)
            
        # Map the data via the mapper.
        predictionData = itemMapper.mapFeatures(data)
        npResult = predict_func(predictionData)
        labels = [itemMapper.labelMapper.inverseMap(i) for i in npResult.tolist()]
        return labels


class ExperimentDescriptor(JsonSerializable):
    def __init__(self, id, columns, rows, availableTypes):
        self.id = id
        self.columns = columns
        self.rows = rows
        self.availableTypes = availableTypes
    
def createExperiment(filename, userId):
    print("Creating experiment for user {0}".format(userId))
    loader = CSVLoader.Loader()
    headers, rows = loader.LoadTrunc(filename, size=5)
    availableTypes = ["Ignore", "BagOfItems","BagOfShingles", "Number", "Label"]
    return ExperimentDescriptor(555, headers, rows, availableTypes)    


def toLookup(filename):
    loader = CSVLoader.Loader()
    headers, data = loader.Load(filename)
    numberOfHeaders = len(headers)
    result = []
    for row in data:
        item = dict()
        for i in range(len(headers)):
            key = headers[i]
            value = row[i]
            item[key] = value
        result.append(item)
    return result, set(headers)
    

def save(filename, *args):
    with open(filename, "wb") as f:
        cloudpickle.dump(args, f)
def load(filename):
    with open(filename, "rb") as f:
        return pickle.load(f)

def getRawFilename(experimentId):
    return "./uploaded/tmp.dat"

def getExperimentDir(experimentId):
    return r"./experiment_{0}".format(experimentId)

def getCreateExperimentDir(experimentId):
    dir = getExperimentDir(experimentId)
    if not os.path.exists(dir):
        os.makedirs(dir)
    return dir

def getDataFile(experimentId):
    dir = getCreateExperimentDir(experimentId)
    dataFilename = "{0}/data.pkl".format(dir)
    data = None
    if not os.path.exists(dataFilename):
        filename = getRawFilename(experimentId)
        data = toLookup(filename)
        save(dataFilename, data)
    else:
        data = load(dataFilename)[0]
    return data

def buildMapper(data, headers, dataMapping):
    description = []
    for mapping in dataMapping:
        if mapping["column"] in headers:
            # We have this column
            datatype = mapping["datatype"]
            if datatype != "Ignore":
                description.append({"type":datatype, "key":mapping["column"], "custom":mapping["custom"]})

    builder = featuremapping.ItemMapperBuilder(description)
    pipe = builder.build(data)
    return pipe


def saveDatamapping(experimentId, dataMapping):
    experimentDir = getCreateExperimentDir(experimentId)
    mappingFilename = "{0}/datamapping.pkl".format(experimentDir)
    save(mappingFilename, dataMapping)
    return dataMapping
def loadDatamapping(experimentId):
    experimentDir = getExperimentDir(experimentId)
    mappingFilename = "{0}/datamapping.pkl".format(experimentDir)
    return load(mappingFilename)[0]

def saveHiddenTopology(experimentId, hiddenLayers):
    experimentDir = getCreateExperimentDir(experimentId)
    mappingFilename = "{0}/hiddentopology.pkl".format(experimentDir)
    save(mappingFilename, hiddenLayers)
    return hiddenLayers
def loadHiddenTopology(experimentId):
    experimentDir = getExperimentDir(experimentId)
    mappingFilename = "{0}/hiddentopology.pkl".format(experimentDir)
    return load(mappingFilename)



def train(experimentId, trainingArgs):

    # Load stored experiment data.
    dataMapping = loadDatamapping(experimentId)
    data, headers = getDataFile(experimentId)

    #Split data into train/validation/test
    trainData, testData = featuremapping.splitData(data, split=0.99)
    trainData, validationData = featuremapping.splitData(trainData, split=0.99)
        
    #Build the mapper based on the training data.
    itemMapper = buildMapper(trainData, headers, dataMapping)
    
    print("Beginning mapping of {0} samples".format(len(trainData)))
    mappedTrainX, mappedTrainY = itemMapper.map(trainData)
    mappedValidationX, mappedValidationY = itemMapper.map(validationData)

    #Normalize
    #mu = np.mean(mappedTrainX, axis=0)
    #sdev = np.std(mappedTrainX, axis=0) + 1e-5
    #mappedTrainX = (mappedTrainX - mu) / sdev
    #mappedValidationX = (mappedValidationX - mu) / sdev

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

    experimentDir = getCreateExperimentDir(experimentId)
    modelFilename = "{0}/model.pkl".format(experimentDir)
    # Save all relevant model data, include normalization if this is used.
    save(modelFilename, x, y, classifier, itemMapper)


def runExperiment(experimentId, runArgs):
    
    type = runArgs["type"]
    if type == "create_datamapping":        
        return saveDatamapping(experimentId, runArgs["data"])
    elif type == "train":
        return train(experimentId, runArgs["data"])

    # Load stored experiment data.
    dataMapping = loadDatamapping(experimentId)
    data, headers = getDataFile(experimentId)


    #Split data into train/validation/test
    trainData, testData = featuremapping.splitData(data, split=0.99)
    trainData, validationData = featuremapping.splitData(trainData, split=0.99)
        
    #Build the mapper based on the training data.
    itemMapper = buildMapper(trainData, headers, dataMapping)
    
    print("Beginning mapping of {0} samples".format(len(trainData)))
    mappedTrainX, mappedTrainY = itemMapper.map(trainData)
    mappedValidationX, mappedValidationY = itemMapper.map(validationData)

    #Normalize
    #mu = np.mean(mappedTrainX, axis=0)
    #sdev = np.std(mappedTrainX, axis=0) + 1e-5
    #mappedTrainX = (mappedTrainX - mu) / sdev
    #mappedValidationX = (mappedValidationX - mu) / sdev

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
    plt.plot(validation_scores, 'g')
    plt.plot(train_scorees, 'r')
    plt.show()


    mappedTestX, mappedTestY = itemMapper.map(testData)
    #Normalize
    #mappedTestX = (mappedTestX - mu)/sdev

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
            print("Error: {0}, Predicted:{1}".format(testData[i], itemMapper.labelMapper.inverseMap(int(errorVector[i][1]))))

    print("Avg: {0}".format(errCount / len(errorVector)))
