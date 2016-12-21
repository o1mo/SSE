const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {

  if (req.headers.accept == 'text/event-stream') {
    if (req.url == '/events') {
      sendSSE(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(__dirname + '/sse-node.html'));
    res.end();
  }
}).listen(3000);

console.log('listening');

function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });

  var id = 0;

  setInterval(function() {
    id++;
    constructSSE(res, id, (new Date()).toLocaleTimeString());
  }, 1000);

  constructSSE(res, id, (new Date()).toLocaleTimeString());
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  if(id % 2 === 0){
    res.write('event: ' + 'specialEvent' + '\n');
  }
  res.write("data: " + data + '\n\n');
}
