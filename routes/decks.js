const express = require('express');
const knex = require('../knex');
const passport = require('passport');

const router = express.Router();

router.use(
	'/',
	passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/', function(req, res, next) {
	const userId = req.user.id;
	// console.log('deck request', userId);
	knex('cards')
		.where('users_id', userId)
		.then(result => {
			// console.info(result);
			res.json(result);
		})
		.catch(err => next(err));
});

// router.get('/cards', function(req, res, next) {
// 	console.log('req.body', req.user.id);
// 	const { userId } = req.user.id;
// 	// const name = deckname;
// 	// let user;
// 	knex('decks')
// 		.where('users_id', userId)
// 		// .select('users_id')
// 		.then(result => {
// 			console.log(result);
// 			res.json(result);
// 		})
// 		.catch(err => next(err));
// });

router.post('/cards', function(req, res, next) {
	console.log(req.body);
	const { mtg_cards } = req.body;
	// console.info(req.body);
	const newCard = {
		mtg_cards,
		decks_name: 'super deck'
	};
	// console.info(newCard);
	if (newCard.mtg_cards === '[]') {
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

module.exports = router;
