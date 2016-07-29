var Review = require('../models/review');

//Get all reviews
exports.getAllReviews = function(req,res){
	Review.find(function(err,reviews){
		if (err){
			res.status(500).json(err);
		}
		res.json(reviews);
	});
};

//Get one review by id
exports.getOneReview = function(req,res){
	Review.findById(req.params.id,function(err,review){
		if (err){
			res.status(500).json(err);
		}else {
			res.json(review);
		}
	});
};

//create a new review
exports.postReview = function(req,res){
	var review = new Review();
	var username = req.body.username;
	var content = req.body.content;
	if (!username||!content){
		res.status(422).json({message:'username and content can not be empty'});
	}else {
		review.username = username;
		review.content = content;
		review.save(function(err){
			if (err){
				res.status(500).json(err);
			}else {
				res.json({message:'new review is successfully created'});
			}
		});
	}
};

//update a review (if no review to create a new one)
exports.putReview = function(req,res){
	var username = req.body.username;
	var content = req.body.content;
	if (!username||!content){
		res.status(422).json({message:'username and content can not be empty'});
	}else{
		Review.findById(req.params.id,function(err,review){
			if (err){
				res.status(500).json(err)
			}else{
				if(!review){
					review = new Review();
					review.username = username;
					review.content = content;
					review.save(function(err){
						if(err){
							res.status(500).json(err);
						}else{
							res.json({message:'new review is successfully created'});
						}
					})
				}else{
					review.username = username;
					review.content = content;
					review.updatedAt = new Date();
					review.save(function(err){
						if(err){
							res.status(500).json(err);
						}else{
							res.json({message:'the review is successfully updated'});
						}
					});
				}
			}
		});
	}
};

//delete one review by id
exports.deleteReview = function(req,res){
	Review.remove({_id:req.params.id},function(err,review){
		if (err){
			res.status(500).json(err);
		}else{
			res.json({message:'the review is successfully deleted'});
		}
	});
}