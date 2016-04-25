'use strict';

var mandrill = require('mandrill-api/mandrill.js'),
	mandrillClient = new mandrill.Mandrill('GaPcAziEdCK77u1876Sb8g'),
	_ = require('lodash');

module.exports.sendEmail = function (recipients) {
	if(recipients){
		//remove duplicated values
		var emailRecipients = _.uniq(recipients);
		//save each person data here
		var data = [];

		//emails sender
		var sender = function (data) {
			var info = {
				template_name: "cartpoolOrder",
				name: "cartpool Team",
				subject: 'New Order',
				to: data
			}

			var message = {
				"html": "<p>Example HTML content</p>",
				"text": "Example text content",
				"subject": info.subject,
				"from_email": "info@cartpool.com",
				"from_name": info.name,
				"to": info.to,
				"headers": {
					"Reply-To": "message.reply@example.com"
				},
				"important": false,
				"track_opens": null,
				"track_clicks": null,
				"auto_text": null,
				"auto_html": null,
				"inline_css": null,
				"url_strip_qs": null,
				"preserve_recipients": null,
				"view_content_link": null,
				"bcc_address": null,
				"tracking_domain": null,
				"signing_domain": null,
				"return_path_domain": null,
				"merge": true,
				"merge_language": "mailchimp",
				"global_merge_vars": [],
				"merge_vars": [],
				"tags": ['test'],
				"subaccount": null,
				"google_analytics_domains": [],
				"google_analytics_campaign": null,
				"metadata": null,
				"recipient_metadata": [],
				"attachments": [],
				"images": []
			};
			var async = false;
			var ip_pool = null;
			var send_at = null;
			mandrillClient.messages.sendTemplate({"template_name": info.template_name, "template_content": null, "message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
				console.log('Email sent');
		    /*
		    [{
		            "email": "recipient.email@example.com",
		            "status": "sent",
		            "reject_reason": "hard-bounce",
		            "_id": "abc123abc123abc123abc123abc123"
		        }]
		        */
		    }, function(e) {
			    // Mandrill returns the error as an object with name and message keys
			    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
			    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			});
		}

		//loop through recipients to get each data create object with users data
		emailRecipients.forEach(function (person) {
			data.push({
				"email": person.email,
				"name": person.firstName + ' ' + person.lastName,
				"type": "to" 
			});
		});

		//send the emails
		sender(data);
	}
}