var passport = require('passport');
var authStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

//user password authentication
passport.use(new authStrategy(
	function(username,password,cb){
		User.findOne({username:username},function(err,user){
			if (err){
				return cb(err)
			}
			if (!user) {
				return cb(null,false);
			}
			user.comparePassword(password,function(err,isMatch){
				if (err){
					return cb(err);
				}
				if(!isMatch){
					return cb(null,false);
				}
				return cb(null,user);
			});
		});
	}
));
exports.isAuthenticated = passport.authenticate('basic',{session:false});