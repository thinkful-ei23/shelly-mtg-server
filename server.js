const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('./knex');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-knex');

// Create an Express application
const app = express();

// Log all requests
app.use(
	morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
		skip: (req, res) => process.env.NODE_ENV === 'test'
	})
);

// Create a static webserver
app.use(express.static('public'));

//CORS support
app.use(cors({ origin: CLIENT_ORIGIN }));

// Parse request body
app.use(express.json());

//create route handler
app.get('/api/cards/:uniqueUrl', function(req, res, next) {
	const unique_url = req.params.uniqueUrl;
	knex
		.first('mtg_cards_id')
		.from('cards')
		.where('unique_url', unique_url)
		.then(result => res.json(result))
		.catch(err => next(err));
});

app.get('/api/cards', function(req, res, next) {
	knex('cards')
		.select('mtg_cards_id', 'unique_url')
		.then(results => {
			res.json(results);
		})
		.catch(err => next(err));
});
app.post('/api/cards', function(req, res, next) {
	const { mtg_cards_id, unique_url } = req.body;
	// console.info(req.body);
	const newCard = {
		mtg_cards_id: mtg_cards_id,
		unique_url: unique_url,
		decks_id: 1
	};
	// console.info(newCard);
	if (newCard.mtg_cards_id === '[]') {
		const err = new Error('Please add a card');
		err.status = 400;
		return next(err);
	}
	knex('cards')
		.insert(newCard)
		.into('cards')
		.returning(['unique_url'])
		.then(card => {
			res.json(card[0]);
		})
		.catch(err => {
			next(err);
		});
});

// Custom 404 Not Found route handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
	if (err.status) {
		const errBody = Object.assign({}, err, { message: err.message });
		res.status(err.status).json(errBody);
	} else {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

// Listen for incoming connections
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };