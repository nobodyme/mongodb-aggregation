const db = require('./communityModel');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User, Community } = require('./communityModel');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create User
app.post('/createuser', async (req, res) => {
	const email = req.body.email;

	if (!email) {
		return res.status(400).json({ error: 'invalid data' });
	}

	try {
		const newUser = new User({ email });
		const savedUser = await newUser.save({ email });
		res.status(200).json({ user: savedUser });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});


// create Community
app.post('/createcommunity', async (req, res) => {
	const name = req.body.name;

	if (!name) {
		return res.status(400).json({ error: 'invalid data' });
	}

	try {
		const newCommunity = new Community({ name });
		const savedCommunity = await newCommunity.save({ name });
		res.status(200).json({ community: savedCommunity });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// User joins community
app.post('/joincommunity', async (req, res) => {

	const name = req.body.communityname;
	const email = req.body.useremail;

	if (!name || !email) {
		return res.status(400).json({ error: 'invalid data' });
	}

	try {
		const person = await User.findOne({ email });
		const community = await Community.findOne({ name });
		community.members.push(person);
		const modifiedCommunity = await community.save();
		res.status(200).json({ community: modifiedCommunity });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// list communities user is in
app.get('/listusercommunity', async (req, res) => {

	const email = req.query.email;

	if (!email) {
		return res.status(400).json({ error: 'invalid data' });
	}

	try {
		const communities = await Community.find({}, { name: 1, _id: 0, members: 0 }).populate({ path: 'members', email });
		res.status(200).json(communities);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// list all members of the community
app.get('/listcommunitymembers', async (req, res) => {

	const name = req.query.name;

	if (!name) {
		return res.status(400).json({ error: 'invalid data' });
	}

	try {
		const members = await Community.find({ name }, { members: 1, _id: 0 }).populate('members');
		res.status(200).json(members);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});
app.listen(3000, () => console.log('server is running'));
