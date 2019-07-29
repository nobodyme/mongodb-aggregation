const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/embeddedtest", { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error'));

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});

const User = mongoose.model('User', userSchema);

const communitySchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	members: [{
		type: mongoose.Schema.Types.ObjectId, ref: User
	}]
});

const Community = mongoose.model('Community', communitySchema);

module.exports = { User, Community };