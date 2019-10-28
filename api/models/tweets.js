const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	content: { type: String, required: true },
	author: { type: String, required: true }
});


module.exports = mongoose.model('Tweet',tweetSchema);