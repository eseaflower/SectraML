import os

class Loader(object):

    def __init__(self):
        return

    def lineSplit(self, line, sep):
        return [t.strip() for t in line.split(sep)]

    def removeBOM(self, line):
        return line.replace(u'\ufeff', '')

    def Load(self, filename, sep=';'):
        fh = open(filename, 'r', encoding='utf-8')
        allLines = fh.readlines()
        allLines[0] = self.removeBOM(allLines[0])
        fh.close()                
        resultArray = [self.lineSplit(l, sep) for l in allLines]
        return resultArray[0], resultArray[1:]

    def LoadTrunc(self, filename, sep=';', size=-1):
        if size < 0:
            return self.Load(filename, sep)
        headers = None
        rows = []
        with open(filename, "r", encoding="utf-8") as fh:
            # Read header
            headerLine = self.removeBOM(fh.readline())
            headers = self.lineSplit(headerLine, sep)
            for i in range(size):
                line = fh.readline()
                rows.append(self.lineSplit(line, sep))

        return headers, rows