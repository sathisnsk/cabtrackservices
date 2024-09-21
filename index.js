const http = require('http');
const { addQuery, getQuery } = require('./dbService.js');
const PORT = 3300;

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
    } else {
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

  //let outputJson = { output: "data", status: "success" };

  response.writeHead('200',{"Content-Type":"application/json"});
  response.write(JSON.stringify(outputJson));
  response.end();

}


