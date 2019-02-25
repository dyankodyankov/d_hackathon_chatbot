var requestify = require('requestify');

var reply = (request, response) => {
	return new Promise(
		function (resolve, reject) {

			var text = request.body['question'];
			var convid = request.body['convid'];

			// return requestify.request(`https://api.recast.ai/build/v1/users/dyankod/bots/weanswer-dd/builders/v1/conversation_states/${convid}`, {
			return requestify.request(`https://api.recast.ai/build/v1/users/dyankod/bots/weanswer-dd-mv1/builders/v1/conversation_states/${convid}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Token 6f060e208bbc18e5f8dab28fae171b75' //developer token
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
						'Authorization': 'Token 777665ac6183e1d8006d4fdba1c8c568' // request token
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
						'Authorization': 'Token 777665ac6183e1d8006d4fdba1c8c568' // request token
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