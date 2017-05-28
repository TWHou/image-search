var express = require('express');
var path = require('path');
var func = require('./functions.js');

var app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/api/:term', function (req, res) {
  var term = req.params.term;
  var offset = req.query.offset || 0;
  func.search(term, offset)
  .then(function(data){
    func.save(term);
    res.send(data);
  })
  .catch(function(error){
    res.send(error);
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Node.js listening on port ' + (process.env.PORT || 8080));
});
