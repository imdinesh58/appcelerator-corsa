// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// $.username.value = Ti.App.Properties.getString('User_NAME', '');
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
/////////////////////////////
//google + button onclick
/////////////////////////////
function glogin() {
	if (Titanium.Network.online) {
		refreshObject.trigger('GOOGLEPLUS', {
			'Test' : 'Test'
		});
		Alloy.createController('google+').getView().open();
	} else {
		alert("Internet not connected...Turn it On");
	}
}

/////////////////////////////
//login button onclick
/////////////////////////////
function flogin() {
	if (Titanium.Network.online) {
		refreshObject.trigger('FACEBOOK', {
			'Test' : 'Test'
		});
		Alloy.createController('facebook').getView().open();
	} else {
		alert("Internet not connected...Turn it On");
	}
}

/////////////////////////////
//forgotpass button onclick
/////////////////////////////
function forgotpassword() {
	Alloy.createController('forgotpass').getView().open();
}

////////////////////////////////////
/////  field check
////////////////////////////////////
function field_Validation() {
	Ti.API.info("Validating login entries.");
	if ($.username.value == "" && $.password.value == "") {
		alert('email and password missing. Please enter credentials.');
	} else if ($.username.value == "") {
		alert('email is missing. Please enter email.');
	} else if ($.password.value == "") {
		alert('password is missing. Please enter password.');
	} else {
		//Ti.App.Properties.setString('User_NAME', $.username.value);
		login_ServiceCall();
	}
}

/////////////////////////////
//service call - login
/////////////////////////////
function login_ServiceCall() {
	Ti.API.info("Start - login_ServiceCall ");
	var params = {
		userId : $.username.value,
		password : $.password.value,
	};
	var aUser = Alloy.createModel("login");
	Ti.API.info("calling login.save : " + JSON.stringify(params));
	aUser.save(params, {
		success : function(model, response) {
			Ti.API.info("Login response  " + JSON.stringify(response));
			// var push = require('pushNotifications');
			// push.registerForNotification();
			// Ti.API.info("Done with RegisterForNotification.");
			Ti.App.Properties.setString('tokenaccess', "");
			Ti.App.Properties.setString('tokenaccess', response.token);
			Ti.App.Properties.setString('username_', $.username.value);
			Ti.App.Properties.setString('loginType', "UCORSA");
			Ti.App.Properties.setString('User_NAME', $.username.value);
			Ti.API.info("login_ServiceCall - calling saveDeviceToken.");
			saveDeviceToken($.username.value);
		},
		error : function(err, response) {
			alert('email and password does not match. Please try again.');
			$.username.value = "";
			$.password.value = "";
		}
	});
	Ti.API.info("Done - login_ServiceCall ");
}

//////////////////////////////////////////////////////////
//// save notifications backend
//////////////////////////////////////////////////////////
function saveDeviceToken(_username) {
	Ti.API.info("Start - saveDeviceToken ");
	var save_ = Alloy.createModel("notification_backend");
	var params = {
		username : _username,
	};
	params.data = {
		device_id : Titanium.Platform.getId() ? Titanium.Platform.getId() : "null",
		device_os : Titanium.Platform.getOsname(),
		notification_id : Ti.App.Properties.getString('deviceToken', "")
	};
	
	Ti.API.info("saveDeviceToken : " + JSON.stringify(params));
	
	if( params.data.notification_id === "" ) {
		// device token not found.
		var push = require('pushNotifications');
		push.registerForNotification();
		Ti.API.info("Done with RegisterForNotification.");
	}
	
	Ti.API.info("saveDeviceToken : " + JSON.stringify(params));
	Ti.API.info("Calling DeviceToken save ...");
	save_.save(params, {
		success : function(model, response) {
			Ti.API.info("saveDeviceToken successful - Event model : " + JSON.stringify(model));
			Ti.API.info("saveDeviceToken successful - Event response : " + JSON.stringify(response));
			Ti.API.info("Going to HOME page.");
			Alloy.createController('home1').getView().open();
		},
		error : function(err, response) {
			Ti.API.info("saveDeviceToken Error - Event model : " + JSON.stringify(model));
			Ti.API.info("saveDeviceToken Error - Event response : " + JSON.stringify(response));
			alert("Error connecting to uCorsa service.  Please try at a later time.");
		}
	});
	Ti.API.info("Done - saveDeviceToken ");
}