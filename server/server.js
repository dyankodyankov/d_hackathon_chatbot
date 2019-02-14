/*eslint no-console: 0*/
"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bot = require('./bot')
const leave = require('./leaveRequest')

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

// Run Express server, on right port
app.listen(app.get('port'), () => {
	console.log('Our bot is running on port', app.get('port'))
})