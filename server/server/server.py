# -*- coding: latin-1 -*-
import tornado.ioloop
import tornado.web
import os.path
import json
from serverutil import jsonarg, jsonreturn, jsonmethod, ServerException, toJsArgs
from experiment import createExperiment, runExperiment, ExperimentFactory
import time
from inspect import getargspec


class LoginHandler(tornado.web.RequestHandler):    
    @jsonmethod
    def post(self, args):
        username = args["username"]
        if username == "eseaflower@hotmail.com":
            returnData = {
                "userId":321, 
                "redirectUrl":"/user/{0}".format(321)
                }
            return returnData
        else:
           raise ServerException("Unknown user", 403)            
    get = post


class UserHandler(tornado.web.RequestHandler):
    def get(self, userId):
        self.render("index.html", entry="user", args=toJsArgs("content", int(userId)))


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html", entry="login", args=toJsArgs("content"))


class UploadHandler(tornado.web.RequestHandler):
    def initialize(self, uploadRoot):
        self.uploadRoot = uploadRoot
        return super().initialize()
    
    def getUploadFilename(self, filename):
        return os.path.join(self.uploadRoot, filename)

    def saveFile(self, filename, data):
        if not os.path.exists(self.uploadRoot):
            os.makedirs(self.uploadRoot)
        filePath = self.getUploadFilename(filename)
        with open(filePath, "wb") as f:
            f.write(data)

    @jsonreturn
    def post(self, userId):
        fileinfo = self.request.files['datafile'][0]
        filename = "tmp.dat"
        self.saveFile(filename, fileinfo.body)
        return createExperiment(self.getUploadFilename(filename), userId)
                                           

class RpcHandler(tornado.web.RequestHandler):    
    def initialize(self, factory):
        self.factory = factory
        # Split the args into constructor arguments
        # and function arguments.
        spec = getargspec(self.factory)
        # Remove the 'self' argument
        self.numCtorArgs = len(spec.args) - 1
        return super().initialize()
    
    def dispatch(self, *args):
        ctorArgs = args[:self.numCtorArgs]
        #There should be a single additional argument
        if len(args) != (self.numCtorArgs + 1):
            raise ServerException("There should be {0} constructor arguments and a single method argument".format(numCtorArgs))
                
        instance = self.factory(*ctorArgs)
        # Get the method call data.
        methodData = args[-1]
        methodName = methodData["type"]
        method = getattr(instance, methodName)        
        if method:
            return method(methodData["data"])
        else:
            raise ServerException("Method {0} not found on instance".format(methodName))
    
    @jsonmethod
    def post(self, *args):
        return self.dispatch(*args)        
    get=post

if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")    
    print(dist_path)
    uploadPath = os.path.join(os.path.dirname(__file__), "uploaded")    
    tornado.web.Application([                
        tornado.web.url("/login", LoginHandler),
        tornado.web.url("/user/([0-9]+)", UserHandler),
        tornado.web.url("/user/([0-9]+)/upload", UploadHandler, {"uploadRoot":uploadPath}),
        tornado.web.url("/experiment/([0-9]+)", RpcHandler, {"factory":ExperimentFactory}),
        tornado.web.url("/", MainHandler),
        tornado.web.url(r"/(.*)", tornado.web.StaticFileHandler, {"path":dist_path}),
        ],
        template_path = dist_path,
        debug=True
        ).listen(8888)
    tornado.ioloop.IOLoop.current().start()
