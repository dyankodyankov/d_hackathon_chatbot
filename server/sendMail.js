var nodemailer = require('nodemailer');

var sendMailFunction = function (req, res) {

	var memory = req.body.conversation.memory;

	return new Promise((resolve, reject) => {

		var aMessage = [];

		var email = memory.recruiter_mail;

		var applicantName = memory.person.fullname;

		var recruiterName = memory.recruiter;

		var jobDesc = memory.jobDescription;

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'miketestsend@gmail.com',
				pass: 'Test_1234'
			}
		});

		var mailOptions = {
			from: 'miketestsend@gmail.com',
			to: 'miketestsend@gmail.com',
			subject: 'Build the team new candidate ' + applicantName,
			text: 'Hello ' + recruiterName + ", we have a new referal for you: " + applicantName + " for following position " + jobDesc +
				". Please get in contact with miketestsend@gmail.com"
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {

				var btnE = {
					"type": "quickReplies",
					"content": {
						"title": "Unfortunately the message hasn't been sent. Do you want to try it again?",
						"buttons": [{
							"title": "Yes",
							"value": "Yes"
						}, {
							"title": "No",
							"value": "No"
						}]
					}
				}

				aMessage.push(btnE);

				return resolve(aMessage);

			} else {

				var btn = {
					"type": "quickReplies",
					"content": {
						"title": "Perfect, it has been sent. Do you want to learn more about the program in general?",
						"buttons": [{
							"title": "Learn More",
							"value": "Learn more about the employee referral program"
						}, {
							"title": "No",
							"value": "No"
						}]
					}
				}

				aMessage.push(btn);

				return resolve(aMessage);
			}
		});
	}).catch(err => {
		console.log(err)
		res.send(JSON.stringify(err))
	})
};

module.exports = {
	sendMailFunction
}