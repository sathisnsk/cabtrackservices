const http = require('http');
const PORT = 3300;

const httpServer = http.createServer((request, response) => {


const url = request.url;
console.log(url);

let inputJson = '';

request.on('data',(data)=>{
 inputJson += data; 
});

request.on('end',()=>{
  console.log(inputJson);
});

//let outputJson = {"output":"data", "status":"success"};
let outputJson = {output:"data", status:"success"};

response.write("your input: " + JSON.stringify(outputJson));
response.end();


}

);

httpServer.listen(PORT||3300,(err)=> {
  console.log("server listening at Port:"+PORT);
})