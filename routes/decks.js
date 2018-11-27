const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/:uniqueUrl', function(req, res, next) {
	console.log('backend');
	const unique_url = req.params.uniqueUrl;
	knex
		.first('mtg_cards')
		.from('cards')
		.where('unique_url', unique_url)
		.then(result => res.json(result))
		.catch(err => next(err));
});

router.get('/', function(req, res, next) {
	knex('cards')
		.select('mtg_cards', 'unique_url')
		.then(results => {
			res.json(results);
		})
		.catch(err => next(err));
});
router.post('/', function(req, res, next) {
	console.log(req.body);
	const { mtg_cards, unique_url } = req.body;
	// console.info(req.body);
	const newCard = {
		mtg_cards,
		unique_url,
		decks_id: 1
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
