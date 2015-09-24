import tornado.ioloop
import tornado.web
import os.path


if __name__ == "__main__":
    dist_path = os.path.join(os.path.dirname(__file__), "../../dist")
    print(dist_path)
    tornado.web.Application([],
        static_path= dist_path,
        static_url_prefix=r"/").listen(8888)
    tornado.ioloop.IOLoop.current().start()
