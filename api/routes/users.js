const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../validate');
const User = require('../models/users');


//signup
router.post('/signup', (req, res, next) => {
	User.find({ email: req.body.email})

		.exec()
		.then(result => {
			//console.log(req.body.username);
			if(result.length > 0) {
				return res.status(409).json({
					message: 'Email Already exists'
				});
			} else {
				User.find({username: req.body.username})
					.exec()
					.then(result => {
						if(result.length > 0) {
							return res.status(409).json({
								message: 'username Already exists'
							});
						} else {
							//console.log(req.body.password);
							bcrypt.hash(req.body.password, 0, (err, hash) => {
								if(err) {
									console.log(err);
									return res.status(500).json({
										error: err,
										message: 'Not working'
									});
								} else {
									const user = new User ({
										_id: new mongoose.Types.ObjectId(),
										username: req.body.username,
										email: req.body.email,
										password: hash
									});
									user
										.save()
										.then(result => {
											console.log(result);
											res.status(201).json({
												message: 'User created',
												newUser: result
											});
										})
										.catch(err => {
											console.log(err);
											res.status(500).json({
												error: err
											});
										});
								}
							});
						}
					})
					.catch(err => {
						res.status(500).json({
							error: err
						});
					});
				
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
	 
});


//login
router.post('/login', (req, res , next) => {
	User.find({username: req.body.username}) 	
		.exec()
		.then( result => {
			if(result.length < 1) {
				return res.status(401).json({
					message: 'Auth Failed'
				});
			}
			bcrypt.compare(req.body.password, result[0].password, (err, result1) => {
				console.log(req.body.password + " " +  result[0].password);
				console.log(result1);
				if(err) {
					return res.status(401).json({
						message: 'Auth Failed'
					})
				}
				if(result1) {
					const token = jwt.sign(
						{
							username: result[0].username,
							userId: result[0]._id
						},
						'tokenParam',
						{
							expiresIn: '1h'
						}

					);
					return res.status(200).json({
						message: 'Auth Successful',
						token: token
					})
				}
				return res.status(401).json({
					message: 'Auth Failed'
				})
			});

		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});


//FOLLOW 
router.patch('/:username', validate, (req, res, next) =>  {
	const token = req.headers.authorization.split(" ")[1];
    const verified = jwt.verify(token, 'tokenParam');
    const connectionUsername = req.params.username;
	const adminUsername = verified.username;
	const adminId = verified.userId;
	User.findOneAndUpdate({username: adminUsername}, {$push: {followers: connectionUsername}})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'You are now following ' + connectionUsername,
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});


//UNFOLLOW 
router.delete('/:username', validate, (req, res, next) =>  {
	const token = req.headers.authorization.split(" ")[1];
    const verified = jwt.verify(token, 'tokenParam');
    const connectionUsername = req.params.username;
	const adminUsername = verified.username;
	const adminId = verified.userId;
	User.findOneAndUpdate({username: adminUsername}, {$pull: {followers: connectionUsername}})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'You have unfollowed ' + connectionUsername,
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});


//To view self Profile
router.get('/me', (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
    const verified = jwt.verify(token, 'tokenParam');
	const adminId = verified.userId;
	User.findById(adminId)
		.exec()
		.then(result => {
			res.status(200).json({
				result: result
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});

});

module.exports = router;