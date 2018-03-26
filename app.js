// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');
	var path = require('path');
	var index = require('./routes/index');

    AWS.config.region = process.env.REGION

    var sns = new AWS.SNS();
    var ddb = new AWS.DynamoDB();

    var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();
	
	app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
	app.use('/public', express.static('public'))
	

	// All input URL parameter will be converted to lower case 
	app.use(function(req, res, next) {
	  for (var key in req.query) { 
		req.query[key.toLowerCase()] = req.query[key];
	  }
	  next();
	});
	app.use('/', index);    	
		
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	if (app.get('env') == 'development') {
		app.locals.pretty = true;
	}

	// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};
	  // render the error page
	  res.status(err.status || 500);
	  res.render('error', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	  });
	});

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}