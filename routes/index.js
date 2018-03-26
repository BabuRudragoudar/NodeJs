var express = require('express');
var router = express.Router();
var product = require("../controllers/ProductController.js");
/*
router.get('/', function(req, res, next) {  
  console.log("Request query : ", req.query);	  
  product.showMPID(res); 
});*/

router.get('/', function(req, res) {
	res.render('index', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/register', function(req, res) {
	res.render('register', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/about', function(req, res) {
	res.render('about', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/faq', function(req, res) {
	res.render('faq', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/login', function(req, res) {
	res.render('login', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/blog', function(req, res) {
	res.render('blog', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.get('/contact', function(req, res) {
	res.render('contact', {
		static_path: 'public',
		theme: process.env.THEME || 'default',
		flask_debug: process.env.FLASK_DEBUG || 'false'
	});
});

router.post('/signup', function(req, res) {
	var item = {
		'email': {'S': req.body.email},
		'name': {'S': req.body.name},
		'preview': {'S': req.body.previewAccess},
		'theme': {'S': req.body.theme}
	};

	ddb.putItem({
		'TableName': ddbTable,
		'Item': item,
		'Expected': { email: { Exists: false } }        
	}, function(err, data) {
		if (err) {
			var returnStatus = 500;

			if (err.code === 'ConditionalCheckFailedException') {
				returnStatus = 409;
			}

			res.status(returnStatus).end();
			console.log('DDB Error: ' + err);
		} else {
			sns.publish({
				'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email 
									+ "\r\nPreviewAccess: " + req.body.previewAccess 
									+ "\r\nTheme: " + req.body.theme,
				'Subject': 'New user sign up!!!',
				'TopicArn': snsTopic
			}, function(err, data) {
				if (err) {
					res.status(500).end();
					console.log('SNS Error: ' + err);
				} else {
					res.status(201).end();
				}
			});            
		}
	});
});
	
module.exports = router;