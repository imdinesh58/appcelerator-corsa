var args = arguments[0] || {};
/////////////////////////////////
// import from lib folder
////////////////////////////////
if (OS_ANDROID) {
	var googleplus = require('googleplusConfig');
	var googleAuth = new googleplus();
}
if (OS_IOS) {
	var Google = require('ti.googlesignin');
}
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
/////////////////////////////////
//window load
////////////////////////////////
function loadgoogleplus() {
	Alloy.Globals.openWindows.push({
		'google' : $.home
	});
	if (OS_ANDROID) {
		googleAuth.authorize(function() {
			loaddata();
		});
	}
	if (OS_IOS) {
		Google.initialize({
			clientID : '465816298376-ucfcgteslkam3t5vd5q86hv4bq01gnur.apps.googleusercontent.com',
			// Optional properties:
			scopes : ['https://www.googleapis.com/auth/plus.login'] // See https://developers.google.com/identity/protocols/googlescopes for more
		});
		Google.signIn();
		iosLogin();
	}
}

function iosLogin() {
	Google.addEventListener('login', function(e) {
		var Fname = e.user.profile.name;
		Ti.API.info("EVENT  " + JSON.stringify(e));
		Ti.API.info("GOOGLE PLUS  " + JSON.stringify(e.user));
		var params = {
			"type" : "G",
			"first_name" : e.user.profile.givenName ? e.user.profile.givenName : "",
			"last_name" : e.user.profile.familyName ? e.user.profile.familyName : "",
			"email" : e.user.profile.email ? e.user.profile.email : "",
			"phone" : ""
		};
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("POST", "https://api.ucorsa.com/login/social");
		xhr.onload = function() {
			var response = JSON.parse(this.responseText);
			Ti.API.info(response.token);
			Ti.App.Properties.setString('tokenaccess', response.token);
			Ti.App.Properties.setString('User_NAME', e.user.profile.givenName);
			save_DeviceToken_Backend(e.user.profile.email);
			Alloy.createController('home1').getView().open();
		};
		xhr.onerror = function() {
			CLOSE();
			alert(this.responseText);
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('token', e.user.authentication.accessToken);
		xhr.send(JSON.stringify(params));
	});
}

function loaddata() {
	var xhrList = Ti.Network.createHTTPClient({
		onload : function(e) {
			var resp = JSON.parse(this.responseText);
			Ti.API.info("googleAuth.getAccessToken() " + googleAuth.getAccessToken());
			var Fname = resp.given_name;

			var params = {
				"type" : "G",
				"first_name" : resp.given_name ? resp.given_name : "",
				"last_name" : resp.family_name ? resp.family_name : "",
				"email" : resp.email ? resp.email : "",
				"phone" : ""
			};

			var xhr = Titanium.Network.createHTTPClient();
			xhr.open("POST", "https://api.ucorsa.com/login/social");
			xhr.onload = function() {
				//alert("API SUCCESS " + this.responseText);
				var response = JSON.parse(this.responseText);
				Ti.API.info(response.token);
				Ti.App.Properties.setString('tokenaccess', response.token);
				//Ti.App.Properties.setString('username_', Fname);
				Ti.App.Properties.setString('User_NAME', Fname);
				save_DeviceToken_Backend(resp.email);
				Alloy.createController('home1').getView().open();
			};
			xhr.onerror = function() {
				googleAuth.deAuthorize();
				CLOSE();
				alert(this.responseText);
			};
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('token', googleAuth.getAccessToken());
			xhr.send(JSON.stringify(params));
		},
		onerror : function(e) {
			Titanium.UI.createAlertDialog({
				title : 'Error in accessing account'
			});
		}
	});
	xhrList.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + googleAuth.getAccessToken() + '&alt=json&v=2');
	xhrList.send();
}

function save_DeviceToken_Backend(email) {
	var save_ = Alloy.createModel("notification_backend");
	var params = {
		username : email,
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

refreshObject.on('GOOGLEPLUS', function(msg) {
	if (OS_ANDROID) {
		googleAuth.deAuthorize();
	}
	if (OS_IOS) {
		Google.addEventListener('disconnect', function(e) {
			Google.disconnect();
		});
	}
});

function CLOSE() {
	try {
		refreshObject.off('GOOGLEPLUS');
		Alloy.Globals.openWindows.pop();
		if (OS_ANDROID) {
			$.home.close();
			$.home = null;
		} else {
			$.home1.close();
			$.home1 = null;
		}
	} catch(err) {
	}
}

if (OS_IOS) {
	$.home1.open();
} else {
	$.home.open();
}

