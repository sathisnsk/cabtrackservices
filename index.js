const http = require('http');
const { addQuery, getQuery } = require('./dbService.js');
const PORT = 3300;
const headers = {
  "Access-Control-Allow-Headers": "content-type, Authorization",
  "Access-Control-Allow-Origin": '*', //req.headers.origin, //or the specific origin you want to give access to,
  "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
};

const httpServer = http.createServer(async (request, response) => {

  const url = request.url.toUpperCase();

  console.log(url);

  console.log(url === '/GETUSERS' || url === '/GETUSER' || url === '/ADDUSER');
  console.log(request.method);

  if (url === '/GETUSERS' || url === '/GETUSER' || url === '/ADDUSER') {

    if  ((url === '/ADDUSER'  && request.method === 'POST') || 
         (url === '/GETUSERS' && request.method === 'GET') ||
         (url === '/GETUSER'  && request.method === 'GET')) {

      let inputJson = '';

      request.on('data', (data) => {
        inputJson += data;
      });

      request.on('end', () => {
        console.log(inputJson);
      });

      await inputJson;

      processData(request.method, response, inputJson);
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200,headers);   //Prefetch flight response
      response.end();
    }
     else {
      response.writeHead('405');   //method not allowed
      response.end();
    }

  } else {

    response.writeHead('404');    //resource not found  
    response.end();
  }

}

);

httpServer.listen(PORT || 3300, (err) => {
  console.log("server listening at Port:" + PORT);
});


async function processData(requestMethod, response, inputJson) {
  let outputJson = '';
  console.log("inside function");
  console.log("inside function" + inputJson);
  
  if (requestMethod === 'POST') {
   outputJson = await addQuery(inputJson);
  }
  
  if (requestMethod === 'GET') {
    outputJson = await getQuery(inputJson);
    console.log("output received"+outputJson);
    }

  //outputJson = { output: "data", status: "success" };

  response.writeHead(200,headers);
  response.write(JSON.stringify(outputJson));
  response.end();

}


