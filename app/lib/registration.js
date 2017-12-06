function Registration() { 
	this.user = {};
	this.authentication = {};
	this.accounts = {};
};

Registration.prototype.setUser = function(user) {
	this.user = user;
};

Registration.prototype.setAuthentication = function(authentication) {
	this.authentication = authentication;
};

Registration.prototype.setPayment = function(account) {
	this.accounts = account;
};

Registration.prototype.print = function( ) {
	
};

module.exports = Registration;