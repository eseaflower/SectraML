# -*- coding: latin-1 -*-
import tornado.ioloop
import tornado.web
import os.path
import json
from serverutil import jsonarg, jsonreturn, jsonmethod, ServerException, toJsArgs
from experiment import getDataDescription
import time


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
    def post(self):
        fileinfo = self.request.files['datafile'][0]
        filename = "tmp.dat"
        self.saveFile(filename, fileinfo.body)
        return getDataDescription(self.getUploadFilename(filename))
                                           

class DataTypeHandler(tornado.web.RequestHandler):
    @jsonmethod
    def post(self, userId, args):
        for desc in args:
            print(desc)
        return args
    get=post

if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")    
    print(dist_path)
    uploadPath = os.path.join(os.path.dirname(__file__), "uploaded")    
    tornado.web.Application([                
        tornado.web.url("/login", LoginHandler),
        tornado.web.url("/user/([0-9]+)", UserHandler),
        tornado.web.url("/upload", UploadHandler, {"uploadRoot":uploadPath}),
        tornado.web.url("/user/([0-9]+)/datatypes", DataTypeHandler),
        tornado.web.url("/", MainHandler),
        tornado.web.url(r"/(.*)", tornado.web.StaticFileHandler, {"path":dist_path}),
        ],
        template_path = dist_path,
        debug=True
        ).listen(8888)
    tornado.ioloop.IOLoop.current().start()
