/*eslint no-console: 0*/
"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bot = require('./bot')
const leave = require('./leaveRequest')
const mail = require('./sendMail')
const mail_lr = require('./sendMailLeaveRequest')
const mail_rf = require('./sendMailReferFriend')
const mail_sl = require('./sendMailSickLeave')

// Start Express server
const app = express()
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.options('*', cors());

//Description of API
app.get('/', function (req, res) {
	res.send('This is the API of a recast.ai chatbot.');
})

// ask question and forward it to recast.ai
app.post('/api/askQuestion', (req, res) => {
	bot.reply(req, res)
		.then(success => {
			for (var x = 0; x < success.length; x++) {
				success[x].author = "bot";
			}
			res.status(200).send(success);
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/leave/showVacationDays', (req, res) => {
	leave.readAvailableVacationDays(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/job/showJobReq', (req, res) => {
	leave.readJobReqs(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/job/searchSingleJob', (req, res) => {
	leave.readSingleJobReq(req, res)
		.then(success => {
			res.status(200).send({
				replies: success.reply,
				conversation: {
					memory: success.memory
				}
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/mail/sendMail', (req, res) => {
	mail.sendMailFunction(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/mail_lr/sendMailLeaveRequest', (req, res) => {
	mail_lr.sendMailFunction(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/mail_rf/sendMailReferFriend', (req, res) => {
	mail_rf.sendMailFunction(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

app.post('/api/mail_sl/sendMailSickLeave', (req, res) => {
	mail_sl.sendMailFunction(req, res)
		.then(success => {
			res.status(200).send({
				replies: success
			})
		}).catch(error => {
			console.log('Error in your bot:', error)
			if (!res.headersSent) {
				res.sendStatus(400)
			}
		})
});

// Run Express server, on right port
app.listen(app.get('port'), () => {
	console.log('Our bot is running on port', app.get('port'))
})