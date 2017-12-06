var args = arguments[0] || {};
///Network
///login model
function load() {
	Alloy.Globals.openWindows.push({
		'signin' : $.signInWinId
	});
	// show the action bar
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                     " + "Sign In";
			}
		}
	}
	//set push
	//Subscribe for notifications
	Ti.API.info("Signin.js - Require pushNotification");
	var push = require('pushNotifications');
	push.registerForNotification();
	Ti.API.info("Signin.js - Done pushNotification");
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	try {
		$.signInWinId.close();
		$.signInWinId = null;
	} catch(err) {
	}
}

$.signInWinId.open();

