import CSVLoader
from serverutil import JsonSerializable

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
    availableTypes = ["Ignore", "BagOfItems", "Raw", "Label"]
    return ExperimentDescriptor(555, headers, rows, availableTypes)    

