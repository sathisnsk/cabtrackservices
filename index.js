const http = require('http');
const { addQuery, getQuery } = require('./dbService.js');
const PORT = 3300;

const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": '*', //req.headers.origin, //or the specific origin you want to give access to,
  "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
};

const httpServer = http.createServer(async (request, response) => {

  const url = request.url.toUpperCase();

  console.log("url: " + url + "host: " + request.host + "method: " + request.method + "path: " + request.path);

  const urlPath = url.split('/');
  console.log(`url path split by '/' ${urlPath}`);
  //console.log(urlPath[1] === 'USERS' || urlPath[1] === 'USER'|| urlPath[1] === 'REGISTER');
  //console.log(request.method);

  if (urlPath[1] === 'USERS' || urlPath[1] === 'USER' || urlPath[1] === 'REGISTER' ) {
  
    if  ((urlPath[1] === 'REGISTER'   && request.method === 'POST') || 
         (urlPath[1] === 'USER'       && request.method === 'GET') ||
         (urlPath[1] === 'USERS'      && request.method === 'GET')) {

      let inputJson = '';

      request.on('data', (data) => {
        inputJson += data;
      });

      request.on('end', () => {
        console.log("input: \n" + inputJson);
      });

      await inputJson;

      processData(request.method, response, inputJson, urlPath);
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, responseHeaders);   //Prefetch flight response
      response.end();
    }
     else {
      response.writeHead(405);   //method not allowed
      response.end();
    }

  } else {

    response.writeHead(404);    //resource not found  
    response.end();
  }

}

);

httpServer.listen(PORT || 3300, (err) => {
  console.log("server listening at Port:" + PORT);
});


async function processData(requestMethod, response, inputJson,urlPath) {
  let outputJson = '';
  
  if (requestMethod === 'POST') {
   outputJson = await addQuery(inputJson);
  }
  
  if (requestMethod === 'GET') {
    inputJson = `{"mobile":${urlPath[2]}}`;
    console.log(`formed JSON for GET request:\n ${inputJson}`);
    outputJson = await getQuery(inputJson);
    console.log("output received:\n "+outputJson);
    }

  //outputJson = { output: "data", status: "success" };

  response.writeHead(200,headers);
  response.write(JSON.stringify(outputJson));
  response.end();

}


