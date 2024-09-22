const http = require('http');
const { addQuery, getQuery } = require('./dbService.js');
const PORT = 3300;
const headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": '*', //req.headers.origin, //or the specific origin you want to give access to,
  "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
};

const httpServer = http.createServer(async (request, response) => {

  const url = request.url.toUpperCase();

  console.log(url);

  console.log(url === '/USERS' || url === '/USER');
  console.log(request.method);

  if (url === '/USERS' || url === '/USER' ) {

    if  ((url === '/USER'  && request.method === 'POST') || 
         (url === '/USER'  && request.method === 'GET') ||
         (url === '/USERS'  && request.method === 'GET')) {

      let inputJson = '';

      request.on('data', (data) => {
        inputJson += data;
      });

      request.on('end', () => {
        console.log(inputJson);
      });

      await inputJson;

      processData(request.method, response, inputJson, url);
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
    let urlPath = url.split('/');
    inputJson = {mobile:urlPath[1]};
    console.log(inputJson);
    outputJson = await getQuery(inputJson);
    console.log("output received"+outputJson);
    }

  //outputJson = { output: "data", status: "success" };

  response.writeHead(200,headers);
  response.write(JSON.stringify(outputJson));
  response.end();

}


