var requestify = require('requestify');

var reply = (request, response) => {
	return new Promise(
		function (resolve, reject) {

			var text = request.body['question'];
			var convid = request.body['convid'];

			return requestify.request(`https://api.recast.ai/build/v1/users/mkocaoglu/bots/weanswer/builders/v1/conversation_states/${convid}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Token f7b5119766dba3a42247b34dd909635a'
				},
				dataType: 'json'
			}).then((r) => {
				var memory = r.getBody().results.memory;
				return requestify.request('https://api.recast.ai/build/v1/dialog', {
					method: 'POST',
					body: {
						'message': {
							'type': 'text',
							'content': text
						},
						'conversation_id': convid,
						'memory': memory
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Token 2821a4dd7f9951354985024ce90288a9'
					},
					dataType: 'json'
				}).then(function (response) {
					var obj = response.getBody();
					return resolve(obj.results.messages);
				});
			}).catch((res) => {
				return requestify.request('https://api.recast.ai/build/v1/dialog', {
					method: 'POST',
					body: {
						'message': {
							'type': 'text',
							'content': text
						},
						'conversation_id': convid
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Token 2821a4dd7f9951354985024ce90288a9'
					},
					dataType: 'json'

				}).then(function (response) {
					var obj = response.getBody();
					return resolve(obj.results.messages);
				});
			});
		});
}

module.exports = {
	reply
}