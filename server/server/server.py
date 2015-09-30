import tornado.ioloop
import tornado.web
import os.path
import json

def jsonarg(member):
    def inner(self):
        jsonArgument = self.get_argument("args")
        deserialized = json.loads(jsonArgument)
        return member(self, deserialized)
    return inner


class LoginHandler(tornado.web.RequestHandler):
    @jsonarg
    def post(self, args):
        t_data = args["username"]
        if t_data == "eseaflower@hotmail.com":
            self.write(json.dumps({"userId":321}))
        else:
            self.send_error(403)
    get = post


if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")
    print(dist_path)
    tornado.web.Application([                
        tornado.web.url("/login", LoginHandler),
        tornado.web.url(r"/(.*)", tornado.web.StaticFileHandler, {"path":dist_path}),
        ],
        ).listen(8888)
    tornado.ioloop.IOLoop.current().start()
