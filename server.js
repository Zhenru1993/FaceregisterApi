var ps = require('python-shell')
var express = require("express");
var logfmt = require("logfmt");
var path    = require("path");
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser')
var uuid = require('uuid/v1');
var app = express();

//block all access to server.js and source files 
app.all(['/server.js', '/face-recognition-opencv/*'], function (req,res, next) {
   res.status(403).send({
      message: 'Access Forbidden'
   });
});
app.use('/server.js',express.static(path.join(__dirname, 'server.js')));
app.use('/face-recognition-opencv',express.static(path.join(__dirname, 'face-recognition-opencv')));


//use body parser
app.use(bodyParser.urlencoded({ extended: true })); 
//allow css style
app.use(express.static(__dirname));

//fileName use as argument for python
var fileName;

var multerConfig = {
storage: multer.diskStorage({
 //Setup where the user's file will go
 destination: function(req, file, next){
   next(null, './face-recognition-opencv');
   },   
    
    //Then give the file a unique name
    filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        fileName = file.fieldname + '-' + uuid() + '.'+ ext
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
          return next();
        }
    }
};

//router
app.get('/register', function(req, res) {
   res.sendFile(path.join(__dirname+'/form.html'));
});

app.get('/recognize', function(req, res) {
   res.sendFile(path.join(__dirname+'/recognize.html'));
});

app.post('/upload',function(req,res){
  var name;
  var password;
  const PWD = "midea"
	fs.readdir(path.join(__dirname+'/face-recognition-opencv/dataset'), function(err, items) {
    	if(items.length < 10){
        	var upload = multer(multerConfig).single('face');
    		console.log("length is " + items.length + ",can add new photo");
    		upload(req, res, function (err) {
           		name = req.body.userName;
           		password = req.body.password;
           		//password check
           		if (password != PWD) {
           			console.log("wrong password");
           			res.send("Access Denied: Invalid Credentials");
           			fs.unlink(__dirname+'/face-recognition-opencv/'+fileName, (err) => {
  						if (err) {
    						    console.error(err)
  						}
           			})
				}
           		else {//python function here
           			var options = {
            			pythonPath: '/usr/bin/python3',
             			scriptPath: path.join(__dirname+'/face-recognition-opencv'),
             			args: ['--user', name, '--image', fileName]
           			};
           			ps.PythonShell.run('encode_faces.py', options, function (err, results) {
	            		if (err) throw err;
    	          		// results is an array consisting of messages collected during execution
              			console.log('results: %j', results);
           			});
           		res.send('Register Complete!');
           		}
				if (err) {
	        		    console.log(err);
				} 
			});
    	}
    	
    	else{
    		console.log("length is " + items.length + ",cannot add new photo");
    		res.send('Database was full! Cannot register!');
    	}
	});
});

//recongnite event
app.post('/recognize',function(req,res){
	var upload = multer(multerConfig).single('face');
    upload(req, res, function (err) {  
    	var options = {
        	pythonPath: '/usr/bin/python3',
        	scriptPath: path.join(__dirname+'/face-recognition-opencv'),
        	args: ['--image', fileName]
    	};  
    	ps.PythonShell.run('recognize_faces_image.py', options, function (err, results) {
        	if (err) throw err;
        	// results is an array consisting of messages collected during execution
        	console.log(results);
        	res.send(results);
    	});       
        if (err) {
            console.log(err);
        } 
    });
});


//port set up
var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
