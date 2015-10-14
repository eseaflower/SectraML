import json

def jsonarg(member):
    def inner(self, *args, **kwargs):
        jsonArgument = self.get_argument("args")
        deserialized = json.loads(jsonArgument)
        newArgs = args + tuple([deserialized])
        return member(self, *newArgs, **kwargs)
    return inner

def jsonreturn(member):
    def inner(self, *args, **kwargs):
        try:
            returnData = member(self, *args, **kwargs)
        except ServerException as se:
            returnData = se.asSerializable()
            self.set_status(se.statusCode)
        
        # Write response in json
        if returnData:
            jsonReturnData = json.dumps(returnData)
            self.write(jsonReturnData)        
    return inner

def jsonmethod(member):
    return jsonreturn(jsonarg(member))



class ServerException(Exception):
    def __init__(self, message, statusCode=500):
        super().__init__(self, message)
        self.message = message
        self.statusCode = statusCode
    def asSerializable(self):
        return self.__dict__

def toJsArgs(*args):
    escaped = []
    for argument in args:
        if isinstance(argument, str):
            argument = "\"{0}\"".format(argument)
        escaped.append(str(argument))
    return ",".join(escaped)
