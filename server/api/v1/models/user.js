'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

//Create the schema
var usersSchema = Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Pease provide the first name',
		trim: true,
		lowercase: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please provide the last name',
		trim: true,
		lowercase: true
	},
	gender: {
		type: String,
		default: 'Not specified',
		enum: ['male', 'female', 'other', 'Not specified'],
		lowercase: true,
		trim: true
	},
	birthdate: {
		type: Date			
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill the email field',
		trim: true,
		unique: true,
		lowercase: true,
		sparse: true,
		match: [/.+\@.+\..+/, 'Please provide a valid email address']
	},
	mobilePhone: {
		type: String,
		unique: true,
		sparse: true
	},
	address: {
		type: String,
		trim: true,
		default: ''
	},
	role: {
		type: String,
		lowercase: true,
		enum: ['customer', 'admin'],
		default: ['customer']
	},
	password: {
		type: String,
		default: '',
		required: 'Please provide the password',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	removed: {
		type: Boolean,
		default: 'false'
	},
	removeUser: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
}, {strict: true});


usersSchema.pre('save', function (next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) next(err);
			user.password = hash;
			next();
		});
	});
});

usersSchema.methods.comparePasswords = function (toBeCompared, callBack) {
	bcrypt.compare(toBeCompared, this.password, function (err, isMatch) {
		if(err) return callBack(err);
		callBack(null, isMatch);
	});
}

module.exports = mongoose.model('user', usersSchema);