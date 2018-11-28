const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/', function(req, res, next) {
	console.log('create user');
	const { username, password } = req.body;
	//include filtering bad usernames & passwords and trimming white space

	bcrypt
		.hash(password, 10)
		.then(digest => {
			console.log(digest);
			const newAcct = {
				username,
				password: digest
			};
			return knex('users')
				.insert(newAcct)
				.returning(['username']);
		})
		.then(result => res.json(result))
		.catch(err => next(err));
});

module.exports = router;
