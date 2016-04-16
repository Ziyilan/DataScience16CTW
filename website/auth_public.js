module.exports = {
	'FACEBOOK_APP_ID' : process.env.FACEBOOK_APP_ID,
	'FACEBOOK_APP_SECRET' : process.env.FACEBOOK_APP_SECRET,
	'FACEBOOK_CALLBACK_URL': process.env.FACEBOOK_CALLBACK_URL,
	'NYTIMES_API_KEY' : process.env.NYTIMES_API_KEY,
	'MONGO_URI' : process.env.MONGO_URI}

// Why do you need a file which collects all of the process.env variables together?
// Could just use them directly in your app.js file.

// It also looks like it's not possible to run your app locally -- the environment
// variables will be missing, yeah? This npm module is a nice way to deal with that problem:
// https://github.com/bkeepers/dotenv
