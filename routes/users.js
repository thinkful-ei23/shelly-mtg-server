const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.post('/', function(req, res, next) {
	console.log('create user');
	const { username, password } = req.body;
	// console.log(req.body);
	const newAcct = { username, password };
	console.log(newAcct);
	if (!newAcct.username) {
		const err = new Error('Username missing');
		err.status = 400;
		return next(err);
	}
	if (!newAcct.password) {
		const err = new Error('Password missing');
		err.status = 400;
		return next(err);
	}
	knex('users')
		.insert(newAcct)
		.into('users')
		.returning(['username'])
		.then(user => res.json(user))
		.catch(err => next(err));
});

module.exports = router;
