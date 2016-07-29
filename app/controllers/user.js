var User = require('../models/user');
exports.signup = function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	if (!username||!password){
		res.status(422).json({message:'the username and password are not empty'});
	}else{
		User.find({username:username},function(err,users){
			if(err){
				res.status(500).json(err);
			}else{
				if (users.length>=1){
					res.json({message:'the user is existed'});
				}else {
					var user = new User();
					user.username = username;
					user.password = password;
					user.save(function(err,user){
						if (err){
							res.status(500).json(err);
						}else{
							res.json({message:'user is successfully created'});
						}
					})
				}
			}
		})
	}
};