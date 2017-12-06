var args = arguments[0] || {};

////////////////////////////////
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();

var fb = Alloy.Globals.Facebook;

///webview
if (OS_ANDROID) {
	$.home.fbProxy = Alloy.Globals.Facebook.createActivityWorker({
		lifecycleContainer : $.home
	});
}

function loadfacebook() {
	try {
		// var client = Titanium.Network.createHTTPClient();
		// client.clearCookies('https://login.facebook.com');
		fb.permissions = ['email'];
		fb.appid = "514936425347785";
		fb.initialize();
		fb.authorize();

		fb.addEventListener('login', function(e) {
			Ti.API.info("login " + JSON.stringify(e));
			if (e.success) {
				Ti.API.info("e.success " + JSON.stringify(e));
				fb.requestWithGraphPath('me', {'fields':'name,email,first_name,last_name'}, 'GET', function(e) {
					Ti.API.info("GET " + JSON.stringify(e));
					if (e.success) {
						Ti.API.info("Save Credentials " + JSON.stringify(e));
						saveUserCredentails(e);
					} else {
						alert("Login Failed.");
						Close();
					}
				});
			}else{
				Ti.API.info("login failed " + JSON.stringify(e));
				alert("Login Failed.");
				Close();
			}
		});
	} catch(err) {
		Ti.API.info("Err " + JSON.stringify(err));
		alert("Catch exception : " + err);
	}
}

function saveUserCredentails(e) {
	Ti.App.Properties.setString('User_NAME', JSON.parse(e.result).name);
	var params = {
		"type" : "F",
		"first_name" : JSON.parse(e.result).first_name,
		"last_name" : JSON.parse(e.result).last_name,
		"email" : JSON.parse(e.result).email,
		"phone" : ""
	};
	
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("POST", "https://api.ucorsa.com/login/social");
	xhr.onload = function() {
		Ti.App.Properties.setString('tokenaccess', JSON.parse(this.responseText).token);
		saveDeviceToken(e.result.email);
		Alloy.createController('home1').getView().open();
	};
	xhr.onerror = function() {
		alert("Error during login");
		Close();
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('token', fb.getAccessToken());
	xhr.send(JSON.stringify(params));
}

function saveDeviceToken(email) {
	var save_ = Alloy.createModel("notification_backend");
	var params = {
		username : email
	};
	params.data = {
		device_id : Titanium.Platform.getId() ? Titanium.Platform.getId() : "null",
		device_os : Titanium.Platform.getOsname(),
		notification_id : Ti.App.Properties.getString('deviceToken', '')
	};
	save_.save(params, {
		success : function(model, response) {
		},
		error : function(err, response) {
		}
	});
}

refreshObject.on('FACEBOOK', function(msg) {
	fb.logout();
	var client = Titanium.Network.createHTTPClient();
	client.clearCookies('https://login.facebook.com');
});

function Close() {
	try {
		refreshObject.off('FACEBOOK');
		$.home.close();
	} catch(err) {
	}
}

