import tornado.ioloop
import tornado.web
import os.path
import json
from serverutil import jsonarg, ServerException, toJsArgs

class LoginHandler(tornado.web.RequestHandler):
    @jsonarg
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
        self.render("index.html", entry="entry", args=toJsArgs("content"))


if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")
    print(dist_path)
    tornado.web.Application([                
        tornado.web.url("/login", LoginHandler),
        tornado.web.url("/user/([0-9]+)", UserHandler),
        tornado.web.url("/", MainHandler),
        tornado.web.url(r"/(.*)", tornado.web.StaticFileHandler, {"path":dist_path}),
        ],
        template_path = dist_path,
        debug=True
        ).listen(8888)
    tornado.ioloop.IOLoop.current().start()
