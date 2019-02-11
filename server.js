var express = require("express");
var logfmt = require("logfmt");
var path    = require("path");
var fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());
app.use(logfmt.requestLogger());

//block all access to server.js file 
app.all('/server.js', function (req,res, next) {
   res.status(403).send({
      message: 'Access Forbidden'
   });
});
app.use('/server.js',express.static(path.join(__dirname, 'server.js')));

//allow css style
app.use(express.static(__dirname));

//MULTER CONFIG: to get file photos to temp server storage
var fileName;

const multerConfig = {
storage: multer.diskStorage({
 //Setup where the user's file will go
 destination: function(req, file, next){
   next(null, './imgs');
   },   
    
    //Then give the file a unique name
    filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        fileName = file.fieldname + '-' + Date.now() + '.'+ ext
        next(null, fileName);
      }
    }),   
    
    //A means of ensuring only images are uploaded. 
    fileFilter: function(req, file, next){
          if(!file){
          	console.log('no photo');
            next();
          }
        const image = file.mimetype.startsWith('image/');
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported");
          
          //TODO:  A better message response to user on failure.
          return next();
        }
    }
};

//router
app.get('/register', function(req, res) {
   res.sendFile(path.join(__dirname+'/form.html'));
});

var upload = multer(multerConfig).single('face');
app.post('/upload',function(req,res){
	fs.readdir(path.join(__dirname+'/imgs'), function(err, items) {
    	if(items.length < 10){
    		console.log("length is " + items.length + ",can add new photo");
    		 upload(req, res, function (err) {
			    if (err) {
			         return  console.log(err);
			    } 
			  });
    		res.send('Register Complete!');
    	}
    	else{
    		console.log("length is " + items.length + ",cannot add new photo");
    		res.send('Database was full! Cannot register!');
    	}
	});
});

//port set up
var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening on " + port);
});