var xsenv = require('@sap/xsenv');
var agent = require('superagent');

// Base64 encoding
function btoa(str) {
	return new Buffer(str).toString('base64');
};

// Base64 decoding
function atob(str) {
	return new Buffer(str, 'base64').toString();
};

var getConnectivityToken = () => {
	return new Promise((resolve, reject) => {
		var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
		var connectivity = vcap_services.connectivity[0].credentials;
		agent.post(connectivity.url + '/oauth/token')
			.set('Authorization', 'Basic ' + btoa(connectivity.clientid + ":" + connectivity.clientsecret))
			.send('client_id=' + connectivity.clientid)
			.send('grant_type=client_credentials')
			.then(res => {
				var token = res.body.access_token;
				return resolve(token);
			})
			.catch(err => {
				return reject(err);
			})
	})
}

var getDestination = (destinationName) => {
	return new Promise((resolve, reject) => {
		var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
		var destination = vcap_services.destination[0].credentials;

		agent.post(destination.url + '/oauth/token')
			.set('Authorization', 'Basic ' + btoa(destination.clientid + ":" + destination.clientsecret))
			.send('client_id=' + destination.clientid)
			.send('grant_type=client_credentials')
			.then(res => {
				var token = res.body.access_token;
				agent.get(destination.uri + '/destination-configuration/v1/destinations/' + destinationName)
					.set('Authorization', 'Bearer ' + token)
					.send()
					.then(response => {
						return resolve(response.body.destinationConfiguration);
					})
					.catch(err => {
						return reject(err);
					})
			})
			.catch(err => {
				return reject(err);
			})
	})
}

var readAvailableVacationDays = function (req, res) {
	
	return new Promise((resolve, reject) => {
		var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
		var connectivity = vcap_services.connectivity[0].credentials;
		getDestination("ef1_backend")
			.then(oDestination => {
				getConnectivityToken()
					.then(sToken => {
						const agent = require('superagent');
						require('superagent-proxy')(agent)
						agent.get(oDestination.URL + "/sap/opu/odata/sap/HCMFAB_LEAVE_REQUEST_CR_SRV/TimeAccountSet?$format=json")
							.set("Proxy-Authorization", "Bearer " + sToken)
							.proxy("http://" + connectivity.onpremise_proxy_host + ":" + connectivity.onpremise_proxy_port)
							.set("Authorization", "Basic " + btoa(oDestination.User + ":" + oDestination.Password))
							.then(response => {
							
								
								/*var aMessages = [];
								
								var r = {
									"type": "list",
									"content": {
										"elements": []
									}
								};
								
								for(var i = 0; i < x.length; i++){
									var e = {
										"title": x[i].A0D_PH1_T,
										"imageUrl": "sap-icon://product",
										"subtitle": x[i].A00O2TLK10QDXZWWL6Z66ZSTK3 + " " + x[i].A00O2TLK10QDXZWWL6Z66ZSTK3_E,
										"buttons": [{
											"title": "Show Details",
											"type": "web_url",
											"value": "www.google.com"
										}]
									};
									
									r.content.elements.push(e);
								}
							
								var t = {
									type: "text",
									content: "The customer name is " + x[0].A0D_CUSTOMER_T
								}
								aMessages.push(t);
								aMessages.push(r);
								return resolve(aMessages);*/
								
								return resolve(response);
								
								
								
							})
					})
			})
	}).catch(err => {
		console.log(err)
		res.send(JSON.stringify(err))
	})
};

var readBwTableSingle = function (req, res) {
	return new Promise((resolve, reject) => {
		var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
		var connectivity = vcap_services.connectivity[0].credentials;
		getDestination("abapBackend1")
			.then(oDestination => {
				getConnectivityToken()
					.then(sToken => {
						const agent = require('superagent');
						require('superagent-proxy')(agent)
						agent.get(oDestination.URL + "/sap/opu/odata/sap/Z_RIEDEL_SRV/ZSALES_TABLESet('1')?$format=json")
							.set("Proxy-Authorization", "Bearer " + sToken)
							.proxy("http://" + connectivity.onpremise_proxy_host + ":" + connectivity.onpremise_proxy_port)
							.set("Authorization", "Basic " + btoa(oDestination.User + ":" + oDestination.Password))
							.then(response => {
								var x = response.body.d;
								var aMessages = [];
								var r = {
									"type": "list",
									"content": {
										"elements": [{
										"title": x.CustomerKey,
										"imageUrl": "sap-icon://product",
										"subtitle": x.ProductKey + ", " + x.Quantity + " Pieces",
										"buttons": [{
											"title": "Show Details",
											"type": "web_url",
											"value": "www.google.com"
										}]
									}]
									}
								};
								aMessages.push(r);
								return resolve(aMessages);
							})
					})
			})
	}).catch(err => {
		console.log(err)
		res.send(JSON.stringify(err))
	})
};

module.exports = {
	readAvailableVacationDays,
	readBwTableSingle
}