const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('./knex');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');

const deckRouter = require('./routes/decks');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Create an Express application
const app = express();

// Log all requests
app.use(morgan('dev'));

// Create a static webserver
app.use(express.static('public'));

//CORS support
app.use(cors({ origin: CLIENT_ORIGIN }));

// Parse request body
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/decks', deckRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Custom Error Handler
app.use((err, req, res) => {
	if (err.status) {
		const errBody = Object.assign({}, err, { message: err.message });
		res.status(err.status).json(errBody);
	} else {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

// Listen for incoming connections
app
	.listen(PORT, function() {
		console.info(`Server listening on ${this.address().port}`);
	})
	.on('error', err => {
		console.error(err);
	});
