import numpy
import theano
from theano import tensor as T
from theano.tensor.signal import downsample
from theano.tensor.nnet import conv

class LeNetConvPoolLayer(object):

    def __init__(self, rng, input, filter_shape, image_shape, activation = T.tanh, poolsize=(2, 2)):
        """
        Allocate a LeNetConvPoolLayer with shared variable internal parameters.

        :type rng: numpy.random.RandomState
        :param rng: a random number generator used to initialize weights

        :type input: theano.tensor.dtensor4
        :param input: symbolic image tensor, of shape image_shape

        :type filter_shape: tuple or list of length 4
        :param filter_shape: (number of filters, num input feature maps,
                              filter height,filter width)

        :type image_shape: tuple or list of length 4
        :param image_shape: (batch size, num input feature maps,
                             image height, image width)

        :type poolsize: tuple or list of length 2
        :param poolsize: the downsampling (pooling) factor (#rows,#cols)
        """
        assert image_shape[1] == filter_shape[1]
        self.input = input

        # initialize weight values: the fan-in of each hidden neuron is
        # restricted by the size of the receptive fields.
        fan_in =  numpy.prod(filter_shape[1:])
        if activation == T.tanh:
            W_values = numpy.asarray(rng.uniform(
                  low=-numpy.sqrt(3./fan_in),
                  high=numpy.sqrt(3./fan_in),
                  size=filter_shape), dtype=theano.config.floatX)        
            # the bias is a 1D tensor -- one bias per output feature map
            b_values = numpy.zeros((filter_shape[0],), dtype=theano.config.floatX)        
        else:
            W_values = numpy.asarray(rng.normal(0.0, 0.01, size=filter_shape), dtype=theano.config.floatX)
            # the bias is a 1D tensor -- one bias per output feature map            
            b_values = 1.0*numpy.ones((filter_shape[0],), dtype=theano.config.floatX)        
            
        # Create shared variables.
        self.W = theano.shared(value=W_values, name='W')
        self.b = theano.shared(value=b_values, name='b')

        # convolve input feature maps with filters
        conv_out = conv.conv2d(input, self.W,
                filter_shape=filter_shape, image_shape=image_shape)

        # downsample each feature map individually, using maxpooling
        pooled_out = downsample.max_pool_2d(conv_out, poolsize, ignore_border=True)

        # add the bias term. Since the bias is a vector (1D array), we first
        # reshape it to a tensor of shape (1, n_filters, 1, 1). Each bias will thus
        # be broadcasted across mini-batches and feature map width & height        
        self.activation = activation
        self.output = self.activation(pooled_out + self.b.dimshuffle('x', 0, 'x', 'x'))

        # store parameters of this layer
        self.params = [self.W, self.b]

    def set_params(self, W, b):
        self.W.set_value(W)
        self.b.set_value(b)