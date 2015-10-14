import CSVLoader

def getDataDescription(filename):
    loader = CSVLoader.Loader()
    headers, rows = loader.LoadTrunc(filename, size=5)
    return {"Columns":headers, "Rows":rows}


