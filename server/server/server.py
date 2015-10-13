# -*- coding: latin-1 -*-
import tornado.ioloop
import tornado.web
import os.path
import json
from serverutil import jsonarg, jsonreturn, jsonmethod, ServerException, toJsArgs
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
    
    def saveFile(self, filename, data):
        if not os.path.exists(self.uploadRoot):
            os.makedirs(self.uploadRoot)
        filePath = os.path.join(self.uploadRoot, filename)
        with open(filePath, "wb") as f:
            f.write(data)

    @jsonreturn
    def post(self):
        fileinfo = self.request.files['datafile'][0]
        self.saveFile("tmp.dat", fileinfo.body)
               
        return {
            "Columns":["Count", "Code", "Bodypart", "Description", "Label"],
            "Rows":[
                ["123", "32000", "Chest", "Chest xray", "CHEST"],
                ["5235", "MRT00", "Head", "Head with contrast", "HEAD"],
                ["834", "65100", "Fotled", "Ankle compression", "FOOT"],
                ["3432", "72002", "Knee", "Knä med belastn.", "KNEE"]
                ]
            }


if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")    
    print(dist_path)
    uploadPath = os.path.join(os.path.dirname(__file__), "uploaded")    
    tornado.web.Application([                
        tornado.web.url("/login", LoginHandler),
        tornado.web.url("/user/([0-9]+)", UserHandler),
        tornado.web.url("/upload", UploadHandler, {"uploadRoot":uploadPath}),
        tornado.web.url("/", MainHandler),
        tornado.web.url(r"/(.*)", tornado.web.StaticFileHandler, {"path":dist_path}),
        ],
        template_path = dist_path,
        debug=True
        ).listen(8888)
    tornado.ioloop.IOLoop.current().start()
