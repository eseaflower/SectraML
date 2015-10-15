import numpy

import theano
import theano.tensor as T


class LinearRegression(object):

    def __init__(self, input, n_in, n_out, W = None, b = None):
                
        if W is None:
            # initialize with 0 the weights W as a matrix of shape (n_in, n_out)
            W = theano.shared(value=numpy.zeros((n_in, n_out),                                                     
                                                dtype=theano.config.floatX),                                    
                                                name='W', borrow=True)
        if b is None:
            # initialize the baises b as a vector of n_out 0s
            b = theano.shared(value=numpy.zeros((n_out,),                                                     
                                                dtype=theano.config.floatX),
                                                name='b', borrow=True)

        self.W = W
        self.b = b

        self.y_pred = T.dot(input, self.W) + self.b

        # parameters of the model
        self.params = [self.W, self.b]

    def hinge_loss(self, x, cutoff):
        return T.maximum(x-cutoff, 0.)

    def errors(self, y):

        # check if y has same dimension of y_pred
        if y.ndim != self.y_pred.ndim:
            raise TypeError('y should have the same shape as self.y_pred',                
                            ('y', target.type, 'y_pred', self.y_pred.type))

        diff = self.y_pred - y
        return T.sum(diff**2, axis=1)
        #return T.sum(self.hinge_loss(abs(diff), 0.02), axis = 1)
        #return T.sum(abs(diff), axis=1)
    
    def distance(self, y):
        return T.mean(self.errors(y))            
        