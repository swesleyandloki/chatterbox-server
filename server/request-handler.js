/*************************************************************
You should implement your request handler function in this file.
requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.
You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.
*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/
var url = require('url');
var fs = require('fs');
var exports = module.exports = {};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

var idMachine = 1;

var messages = {
  results: [
    {
      username: "carl'sjr",
      text: "hellweo",
      roomname: "the well"
    }
  ]
};

var getRequest = function(request, response, way){
  if(way==='/favicon.ico'){return}
  if(url.parse(way).pathname=== '/' || ''){
  fs.readFile('//Users/student/Desktop/2014-10-chatterbox-server/client/index.html', function(err, data){
    if(err){
      throw err;
    }else if(data){
      fancyHeaders = headers;
      fancyHeaders['Content-Type'] = "text/html";
      responder(response, data, 200, fancyHeaders);
    }
  });
  } else if (url.parse(way).pathname === '/message'){
    fancyHeaders = headers;
    fancyHeaders['Content-Type'] = 'application/json';
    responder(response, JSON.stringify(messages), 200, fancyHeaders);
  } else if(url.parse(way).pathname.slice(-3)==='css'){
    fs.readFile('//Users/student/Desktop/2014-10-chatterbox-server/client'+url.parse(way).pathname, function(err, data){
    if(err){
      throw err;
    }else if(data){
      fancyHeaders = headers;
      fancyHeaders['Content-Type'] = "text/css";
      responder(response, data, 200, fancyHeaders);
    }
  });
  }else {
    var filePath = '//Users/student/Desktop/2014-10-chatterbox-server/client' + url.parse(way).pathname;
    fs.readFile(filePath, function(err, data){
      if(err){
        throw err;
      } else if(data){

        responder(response, data, 200, headers);
      }
    })
  };
}

var postRequest = function(request, response, way){
  fatResult = '';
  request.on('data', function(chunk){
    fatResult+= chunk;
  });
  request.on('end', function(){
    fatResult = JSON.parse(fatResult);
    fatResult.objectId = idMachine ++;
    messages.results.push(fatResult);
    responder(response, JSON.stringify(messages), 201);
  })
}

var optionsRequest = function(request, response, way){
  responder(response, messages, 200);
}

var responder = function(response, data, statusCode, fancyHeaders){
  fancyHeaders = fancyHeaders || headers;
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

var requests = {
  'GET': getRequest,
  'POST': postRequest,
  'OPTIONS': optionsRequest
}


var requestHandler = function(request, response) {

  var way = request.url;
  console.log('show me the way', way);

  requests[request.method](request, response, way);



  console.log("Serving request type " + request.method + " for url " + request.url);



};

exports.requestHandler = requestHandler;


