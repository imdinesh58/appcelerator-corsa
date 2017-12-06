var args = arguments[0] || {};
var getData_Push = require('pushNotifications');

var send_message = function(uri, operation, msg, callback) {
	var xhr = Titanium.Network.createHTTPClient();
	var url = "https://api.ucorsa.com" + uri;
	xhr.onload = function() {
		var response = JSON.parse(this.responseText);
		Ti.API.error("http_client - Response : " + JSON.stringify(response));	
		callback(null, response.message);
	};
	xhr.onerror = function() {
		var errResponse = JSON.parse(this.responseText);
		Ti.API.error("http_client - Error Response : " + JSON.stringify(errResponse));	
		callback(errResponse, null);
	}; 

	xhr.open(operation, url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	var random_generated_token = Ti.App.Properties.getString('tokenaccess', '');
	xhr.setRequestHeader('access-token', random_generated_token);
	xhr.send(JSON.stringify(msg));
};

exports.send_message = send_message;
