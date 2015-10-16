import numpy as np 
import re

def splitData(data, split=0.9):
    trainSize = int(len(data)*split)
    return data[0:trainSize], data[trainSize:]


def splitUpper(item):
    regexp = ' |\^|/|,|\.|\+|_|\(|\)|-'        
    return [u.upper() for u in re.split(regexp,  item)]



def shingler(item):
    shingleLength = 3
    start = splitUpper(item)
    string = ''.join(start)
    if len(string) < shingleLength:
        string = "{0}XXX".format(string)
    return [string[i:i+shingleLength] for i in range(len(string) - shingleLength + 1 )]

def getTermCount(featureMap, dataSet):
    termCount = dict()
    for item in dataSet:
        values = featureMap.getValues(item)
        for value in values:
            termCount[value] = termCount.get(value, 0) + 1    
    return termCount

def getCommonTerms(featureMap, dataSet, minCount = None, size = None):    
    termCount = getTermCount(featureMap, dataSet)    
    sortedTerms = sorted(termCount.items(), key = lambda x: x[1], reverse = True)
    
    if not minCount:
        minCount = -1        
    if not size:
        size = len(sortedTerms)

    def commonGenerator():
        count = 0
        for t in sortedTerms:
            # As soon as the predicate is true, we stop
            # generating.
            if t[1] < minCount or count >= size:
                return
            count += 1
            yield t[0]
    
    return [t for t in commonGenerator()]
    
class FeatureMapBase(object):
    def __init__(self, accessorFunc, valueFunc):
        self._dimension = 0
        self._range = 0        
        if not accessorFunc:
            accessorFunc = lambda x: x
        if not valueFunc:
            valueFunc = lambda x: x
        self.accessorFunc = accessorFunc
        self.valueFunc = valueFunc
    
    def getValues(self, item):
        return self.valueFunc(self.accessorFunc(item))

    @property
    def dimension(self):
        return self._dimension
    
    @property
    def range(self):
        return self._range

    def build(self, data):
        raise NotImplementedError()

    def map(self, item):
        raise NotImplementedError()

class BagOfItemsMap(FeatureMapBase):
    def __init__(self, accessorFunc, valueFunc):
        super().__init__(accessorFunc, valueFunc)
        self.dictionary = dict()
                
    def getUniqueValues(self, dataSet):
        # Build a unique set of items.
        uniqueSet = set()
        for sample in dataSet:            
            values = self.getValues(sample)
            for value in values:
                uniqueSet.add(value)
        return uniqueSet

    def buildIndexDictionary(self, terms):
        # With the set of terms we can build a dictionary
        self.dictionary = dict()
        index = 0
        for term in terms:
            self.dictionary[term] = index
            index += 1

    def build(self, terms):
        self.buildIndexDictionary(terms)
        size = len(self.dictionary)
        self._dimension = size
        self._range = size

    def getIndexes(self, item):
        values = self.getValues(item)
        uniqueIndexes = set()
        for value in values:
            index = self.dictionary.get(value)
            if not (index is None):
                uniqueIndexes.add(index)
        result = [v for v in uniqueIndexes]
        return result

    def map(self, item):
        result = np.zeros(self.dimension, dtype='float32')
        indexes = self.getIndexes(item)
        result[indexes] = 1.0
        return result

class NumberMap(FeatureMapBase):
    def __init__(self, dimension, accessorFunc, valueFunc):
        super().__init__(accessorFunc, valueFunc)
        self._dimension = dimension
        self._range = None
    
    def build(self, data):
        pass

    def map(self, item):
        values = self.getValues(item)
        result = np.asarray(values, dtype='float32')
        return result

class LabelMap(BagOfItemsMap):
    def __init__(self, accessorFunc, valueFunc):
        super().__init__(accessorFunc, valueFunc)
        self.inverseDictionary = dict()
    
    def build(self, labels):
        super().build(labels)
        self._dimension = 1
        for key, value in self.dictionary.items():
            self.inverseDictionary[value] = key
    
    def map(self, item):
        result = np.zeros(self.dimension, dtype='float32')
        # Use the item index as value
        result[:] = self.getIndexes(item)
        return result

    def inverseMap(self, index):
        result = self.inverseDictionary.get(index)
        if result is None:
            raise ValueError()
        return result

class ItemMapper(object):
    def __init__(self, features, label):
        self.featureMappers = [f.mapper for f in features]
        self.labelMapper = label.mapper
        self._dimension = sum([m.dimension for m in self.featureMappers])
        self._range = self.labelMapper.range
        
    @property
    def dimension(self):
        return self._dimension
    
    @property
    def range(self):
        return self._range

    def mapFeatures(self, dataSet):
        numberOfSamples = len(dataSet)
        result = np.zeros((numberOfSamples, self.dimension), dtype = 'float32')
        for i in range(numberOfSamples):
            if not i % 100:
                print("Sample {0}".format(i))
            item = dataSet[i]
            itemFeatures = [m.map(item) for m in self.featureMappers]
            result[i] = np.concatenate(itemFeatures)
        return result

    def mapLabels(self, dataSet):
        numberOfSamples = len(dataSet)
        result = np.zeros((numberOfSamples, ), dtype = 'float32')
        for i in range(numberOfSamples):
            item = dataSet[i]            
            result[i] = self.labelMapper.map(item)
        return result

    def map(self, dataSet):
        return self.mapFeatures(dataSet), self.mapLabels(dataSet)



class FieldDescriptor(object):
    def __init__(self, key, mapper):
        self._key = key
        self._mapper = mapper
    
    @property
    def key(self):
        return self._key    
    @property
    def mapper(self):
        return self._mapper

class DictionaryField(FieldDescriptor):
    def __init__(self, key, minCount = None, size = None):        
        super().__init__(key, BagOfItemsMap(lambda x: x[key], splitUpper))            
        self.minCount = minCount
        self.maxSize = size
    
    def build(self, dataSet):
        self.mapper.build(getCommonTerms(self.mapper, dataSet, self.minCount, self.maxSize))


class ShingleField(FieldDescriptor):
    def __init__(self, key, minCount = None, size = None):        
        super().__init__(key, BagOfItemsMap(lambda x: x[key], shingler))            
        self.minCount = minCount
        self.maxSize = size
    
    def build(self, dataSet):
        self.mapper.build(getCommonTerms(self.mapper, dataSet, self.minCount, self.maxSize))


class NumberField(FieldDescriptor):
    def __init__(self, key, dimension):
        super().__init__(key, NumberMap(lambda x: x[key], lambda x: float(x)))
    
    def build(self, dataSet):
        pass

class LabelField(FieldDescriptor):
    def __init__(self, key):
        super().__init__(key, LabelMap(lambda x: x[key], splitUpper))    
    def build(self, dataSet):
        self.mapper.build(self.mapper.getUniqueValues(dataSet))

class ItemMapperBuilder(object):
    def __init__(self, description):
        self.description = description        

    def build(self, dataSet):
        features = []
        label = None
        for field in self.description:
            typeField = self.createField(field)
            typeField.build(dataSet)
            if  type(typeField) is LabelField:
                if label is not None:
                    raise AssertionError()
                label = typeField
            else:
                features.append(typeField)

        return ItemMapper(features, label)

    def createField(self, field):
        result = None
        type = field["type"]
        key = field["key"]        
        custom = field.get("custom", {})
        if type == "BagOfItems":            
            minCount = custom.get("minCount")
            if minCount:
                minCount = int(minCount)
            size = custom.get("size")
            if size:
                size = int(size)
            result = DictionaryField(key, minCount, size)
        elif type == "BagOfShingles":
            minCount = custom.get("minCount")
            if minCount:
                minCount = int(minCount)
            size = custom.get("size")
            if size:
                size = int(size)
            result = ShingleField(key, minCount, size)
        elif type == "Number":
            dim = int(custom["dim"])
            result = NumberField(key, dim)
        elif type == "Label":
            #filter = custom.get("filter", None)
            result = LabelField(key)        
        else:
            raise NotImplementedError()
        return result