'use stric';

// Dependencies
var twilio = require('twilio'),
	_ = require('lodash');

module.exports.sendMsg = function (userMobilePhone) {
	if(userMobilePhone){
		var sender = function (number) {
			// Create a new REST API client to make authenticated requests against the
			// twilio back end
			var client = new twilio.RestClient('key', 'secret');

			// Pass in parameters to the REST API using an object literal notation. The
			// REST client will handle authentication and response serialzation for you.
			client.sms.messages.create({
				to: number, //test number: +15005550006
				from:'+12019031427',
				body:'CongratulationsYou!!! you have recieved a new order! , visit cartpool.com to view the order details.'
			}, function(error, message) {
			    // The HTTP request to Twilio will run asynchronously. This callback
			    // function will be called when a response is received from Twilio
			    // The "error" variable will contain error information, if any.
			    // If the request was successful, this value will be "falsy"
			    if (!error) {
			        // The second argument to the callback will contain the information
			        // sent back by Twilio for the request. In this case, it is the
			        // information about the text messsage you just sent:
			        // console.log('Success! The SID for this SMS message is:');
			        // console.log(message.sid);
			        console.log('Message has been sent');

			        // console.log('Message sent on:');
			        // console.log(message.dateCreated);
			    } else {
			    	console.log(error);
			    }
			});
		}

		//remove duplicated values
		var numbers = _.uniq(userMobilePhone);

		//send the message to every mobile number
		for(var i=0;i < numbers.length;i++){
			var mp = numbers[i].substring(1);
			console.log(mp);
			sender('+971'+mp);
		}

	}
}