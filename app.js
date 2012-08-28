
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , format = require('util').format
  , fs = require('fs')
  , conf = require(__dirname+'/config/config.js')
  , email = require('emailjs');
  ;

var mailserver  = email.server.connect({
   user:    conf.google.account.user, 
   password:conf.google.account.password, 
   host:    conf.google.account.host, 
   ssl:     true

});

var app = express();
var upload_path = __dirname + '/public/uploads';
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(upload_path));
  app.use(express.bodyParser({uploadDir: upload_path}));
  app.use(express.methodOverride());
  app.use(app.router);
});
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', { title: 'Datei Upload'});
});

app.post('/', function(req, res, next){
  //console.log(req.body);
  //console.log(req.files.uploadingFile);

  var uploadingFile = req.files.uploadingFile;
  var tmpPath = uploadingFile.path;
  var targetPath = upload_path + '/' + uploadingFile.name;

  fs.rename(tmpPath, targetPath, function(err) {
    if (err) throw err;
    fs.unlink(tmpPath, function() {
      if (err) throw err;
      // the uploaded file can be found as `req.files.uploadingFile` and the
      // title field as `req.body.title`
      res.send(format('\nuploaded %s (%d Kb) to %s as %s'
        //, req.files.uploadingFile.name
        , req.files.uploadingFile.name
        , req.files.uploadingFile.size / 1024 | 0 
        , req.files.uploadingFile.path
        , req.body.title));
      mailserver.send({
         text:    conf.server.domain+"/uploads/"+uploadingFile.name, 
         from:    conf.google.target.from,
         to:      conf.google.target.to,
         subject: "Bugwelder Fileupload: " + req.files.uploadingFile.name
      }, function(err, message) { console.log(err || message); });

    });
  });
});

http.createServer(app).listen(3000, '127.0.0.1');

console.log("Express server listening on port 3000");
