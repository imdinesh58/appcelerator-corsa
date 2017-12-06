exports.isAuthenticated = function() {
	//Alloy.Globals.display_on_screen("Adding doLogin callback listener ...", Ti.UI.NOTIFICATION_DURATION_SHORT);
	Ti.App.addEventListener('doLogin', _doLoginCallback);
	// check for global access token
	return Ti.App.Properties.getString('tokenaccess', "");
	
};
// callbacks implementation`
function _doLoginCallback(data) {
	//Alloy.Globals.display_on_screen("Start ... _doLoginCallback() ", Ti.UI.NOTIFICATION_DURATION_SHORT);
	//Alloy.Globals.display_on_screen("Launching SignIn View", Ti.UI.NOTIFICATION_DURATION_SHORT);
	Alloy.createController('signin').getView().open();
	//Alloy.Globals.display_on_screen("End ... _doLoginCallback() ", Ti.UI.NOTIFICATION_DURATION_SHORT);
};

exports.logout_facebook = function() {
	//Alloy.Globals.Facebook.addEventListener('logout', function(e) {
	//	alert('Logged out');
	//});
	Alloy.Globals.Facebook.logout();
};


