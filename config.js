module.exports = {
	PORT: process.env.PORT || 8080,
	DATABASE_URL: process.env.DATABASE_URL || 'postgres://localhost/mtg-server',
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
	JWT_SECRET: process.env.JWT_SECRET || 'NEEEEEERRRRRRDDDDSSSS!!!',
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
