const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/', function(req, res, next) {
	console.log('create user');
	const { email, username, password } = req.body;
	//include filtering bad usernames & passwords and trimming white space
	const requiredFields = ['email', 'username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if (missingField) {
		const err = new Error(`Missing ${missingField}`);
		err.status = 422;
		return next(err);
	}

	const stringField = ['email', 'username', 'password'];
	const notStringField = stringField.find(
		field => field in req.body && typeof req.body[field] !== 'string'
	);
	if (notStringField) {
		const err = new Error(`Invalid ${notStringField} entered`);
		err.status = 422;
		return next(err);
	}

	const trimmedField = ['email', 'username', 'password'];
	const notTrimmedField = trimmedField.find(
		field => req.body[field].trim() !== req.body[field]
	);
	if (notTrimmedField) {
		const err = new Error('There is whitespace at the beginning or end');
		err.status = 422;
		return next(err);
	}

	const minMaxChar = {
		username: { min: 3 },
		password: { min: 8, max: 72 }
	};
	const notEnoughChar = Object.keys(minMaxChar).find(
		field =>
			'min' in minMaxChar[field] &&
			req.body[field].trim().length < minMaxChar[field].min
	);
	const tooMuchChar = Object.keys(minMaxChar).find(
		field =>
			'max' in minMaxChar[field] &&
			req.body[field].trim().length > minMaxChar[field].max
	);
	if (notEnoughChar || tooMuchChar) {
		return res.status(422).json({
			code: 422,
			reason: 'Validation Error',
			message: notEnoughChar
				? `Must be at least ${minMaxChar[notEnoughChar].min} characters long`
				: `Must be less than ${minMaxChar[tooMuchChar].max} characters long`,
			location: notEnoughChar || tooMuchChar
		});
	}

	bcrypt
		.hash(password, 10)
		.then(digest => {
			// console.log(digest);
			const newAcct = {
				email,
				username,
				password: digest
			};
			return knex('users')
				.insert(newAcct)
				.returning(['username']);
		})
		.then(result => {
			// console.log(result);
			res
				.location(`${req.originalUrl}/${result.id}`)
				.status(201)
				.json(result);
		})
		.catch(err => next(err));
});

module.exports = router;
