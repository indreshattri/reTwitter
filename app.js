const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const tweetsRoutes = require('./api/routes/tweets');
const userRoutes = require('./api/routes/users');


//Database Connection via mongoose
mongoose.connect('mongodb://indreshattri:1234@retwitter-shard-00-00-i0s8x.mongodb.net:27017,retwitter-shard-00-01-i0s8x.mongodb.net:27017,retwitter-shard-00-02-i0s8x.mongodb.net:27017/test?ssl=true&replicaSet=reTwitter-shard-0&authSource=admin&retryWrites=true', {
	useNewUrlParser: true
}).then(() => {
		console.log('Database Connected');
	})
	.catch(err => { 
        console.error(err.stack);
        process.exit(1);
    });



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// To avoid CORS errors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin","*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);

	if(req.methods === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, PATCH');
		return res.status(200).json({});
	}

	next();
});

app.use('/tweets', tweetsRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Welcome to reTwitter'
	});
});


//Error Handling for main page
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
