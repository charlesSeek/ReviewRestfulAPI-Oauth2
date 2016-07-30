var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var Review = require('./app/models/review');
var User = require('./app/models/user');
var auth = require('./app/controllers/authentication');
var reviewController = require('./app/controllers/review');
var userController = require('./app/controllers/user');
var passport = require('passport');
var authController = require('./app/controllers/authentication');
var clientController = require('./app/controllers/client');
var ejs = require('ejs');
var session = require('express-session');
var oauth2Controller = require('./app/controllers/oauth2');

//log all request in the apache combined format to stdout
app.use(morgan('combined'));

//mongodb config
var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1/reviews';
mongoose.connect(dbUrl);

//use body-parser middleware to get post data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:'*/*'}));

var port = process.env.PORT||8000;
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.set('views','./app/views');
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));


/*
	route for CURD
 */
var router = express.Router();
router.route('/reviews')
	.get(authController.isAuthenticated,reviewController.getAllReviews)
	.post(authController.isAuthenticated,reviewController.postReview);

router.route('/reviews/:id')
	.get(authController.isAuthenticated,reviewController.getOneReview)
	.put(authController.isAuthenticated,reviewController.putReview)
	.delete(authController.isAuthenticated,reviewController.deleteReview);

router.route('/signup')
	.post(userController.signup);

router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authController.isAuthenticated, oauth2Controller.token);
app.use('/api',router);
app.listen(port);
console.log('the server is running on '+port );
