'use strict';

const http = require('http');
const url = require('url');

const server = http.createServer((request, response) => {
  // start a timer
  let start = process.hrtime();
  // initialize an object which we will attach to our response
  let echo = {};
  echo.httpVersion = request.httpVersion;
  echo.method = request.method;
  echo.url = url.parse(request.url, true);
  let keys = Object.keys(echo.url);
  keys.forEach((key) => {
    if (echo.url[key] === null) {
      delete echo.url[key];
    }
  });
  echo.headers = request.headers;
  echo.data = '';
  request.on('data', (chunk) => {
    echo.data += chunk;
  });
  request.on('end', () => {
    let echoJSON = JSON.stringify(echo);
    response.writeHead(200, 'OK', {
      'Content-Length': echoJSON.length,
      'Content-Type': 'application/json',
    });
    response.write(echoJSON);
    response.end();
    // stop the timer
    let elapsed = process.hrtime(start);
    // log the time it took
    console.log(`Request processed in ${elapsed[0] * 1e9 + elapsed[1]} nanoseconds`);
  });
});

server.on('listening', () => {
  console.log('echo server listening');
});

server.listen(3000);
