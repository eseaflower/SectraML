import tornado.ioloop
import tornado.web
import os.path
import json

class LoginHandler(tornado.web.RequestHandler):
    def post(self):
        t_data = self.get_argument("Testdata")
        if t_data == "123":
            self.write(json.dumps({"user_id":321}))
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
