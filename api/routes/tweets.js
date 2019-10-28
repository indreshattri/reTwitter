const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tweet = require('../models/tweets');
const validate = require('../validate');

//read all tweets
router.get('/' , validate, (req, res, next) => {

  	Tweet.find() 
  		.select('content author _id')
		.exec()
		.then(result => {
			if(result.length > 0) {
				console.log(result);
				res.status(200).json({
					count: result.length,
					tweets: result
				});
			} else {
				res.status(404).json({
					message: 'No Tweets found'
				});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

//create new tweet
router.post('/' , validate, (req, res, next) => {

	const tweet = new Tweet ({
		_id: new mongoose.Types.ObjectId(),
		content: req.body.content,
		author: req.body.author
	});
	tweet
		.save()
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	res.status(201).json({
		message: "You've tweeted!",
		newTweet: tweet
	});
});


//To delete a tweet
router.delete('/:tweetId', validate, (req, res, next) => {
	const id = req.params.tweetId;
	Tweet.remove({_id:id}) 
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;