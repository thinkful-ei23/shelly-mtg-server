const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const knex = require('../knex');

const validatePassword = (password, user) => {
	return new Promise((resolve, reject) =>
		bcrypt.compare(password, user.password, (err, res) => {
			if (err) {
				reject(err);
			} else if (res) {
				resolve(res);
			} else {
				reject(new Error('Password incorrect'));
			}
		})
	);
};

const localStrategy = new LocalStrategy((username, password, done) => {
	let user;
	knex('users')
		.where({ username })
		.then(results => {
			user = results[0];
			// console.log(user);
			if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username',
					location: 'username'
				});
			}
			return validatePassword(password, user);
		})
		.then(isValid => {
			if (!isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect password',
					location: 'password'
				});
			}
			return done(null, user);
		})
		.catch(err => {
			if (err.reason === 'LoginError') {
				return done(null, false);
			}
			return done(err);
		});
});
module.exports = localStrategy;
