exports.cleanup_ride = function() {
	Ti.App.Properties.removeProperty('RideFrom');
	Ti.App.Properties.removeProperty('RideTo');
};

exports.authcleanup = function() {
	Ti.App.Properties.removeProperty('name');
	Ti.App.Properties.removeProperty('username');
	Ti.App.Properties.removeProperty('password');
	Ti.App.Properties.removeProperty('confirmpassword');
	Ti.App.Properties.removeProperty('phone');
	Ti.App.Properties.removeProperty('email');
};

exports.pay_cleanup = function() {
	Ti.App.Properties.removeProperty('credit_card_name');
	Ti.App.Properties.removeProperty('credit_card_number');
	Ti.App.Properties.removeProperty('creditCardTokenDetails');
	Ti.App.Properties.removeProperty('bankTokenDetails');
};
