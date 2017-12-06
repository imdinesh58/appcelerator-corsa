// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var authcleanup_ = require('cleanup');
////////////////////////////////////
// call back attached to the buttons
////////////////////////////////////
function signin() {
	Alloy.createController('signin').getView().open();
}
/////////////////////////////
// sign up onclick
/////////////////////////////
function register() {
	authcleanup_.authcleanup();
	Alloy.createController('authentication').getView().open();
}
