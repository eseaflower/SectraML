import pickle

class PersistenceManager(object):
    def __init__(self):
        pass    
    
    def set_filename(self, filename):
        self.filename = filename
    
    def set_model(self, *args):
        self.model = args
    
    def save_model(self):
        with open(self.filename, 'wb') as f:
            pickle.dump(self.model, f)

    def load_model(self):
        with open(self.filename, 'rb') as f:
            return pickle.load(f)