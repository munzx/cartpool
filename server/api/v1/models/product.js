var mongoose = require('mongoose'),
_ = require('lodash'),
moment = require('moment'),
Schema = mongoose.Schema,
orderSchema,
productSchema;

orderSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'user'},
	quantity: {
		type: Number,
		default: 0,
		required: 'Please provide the order quantity'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

productSchema = new Schema({
	name: {
		type: String,
		trim: true,
		lowercase: true,
		required: 'Product name is required'
	},
	desc: {
		type: String,
		default: ''
	},
	availiable: {
		type: Number,
		default: 0
	},
	initialPrice: {
		type: Number,
		required: 'Product initial price is required'
	},
	lowestPrice: {
		type: Number,
		default: ''
	},
	currentPrice: {
		type: Number,
		default: 0
	},
	percentageToLowestPrice: {
		type: String,
		default: '100'
	},
	image: {
		type: String,
		required: 'Product image is required',
		default: ''
	},
	orders: [orderSchema],
	totalOrdersQty: {
		type: Number,
		default: 0
	},
	openUntil: Date,
	minutesToClose: { //minutes to close after the product prices reaches the lowest price
		type: Number,
		default: 2
	},
	timerStarted: {
		type: Boolean,
		default: false
	},
	startTime: Date,
	created: {
		type: Date,
		default: Date.now
	},
	inStore: {
		type: Boolean,
		default: false
	},
	closed: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('product', productSchema);