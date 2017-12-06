function Registration() { 
	this.user = {};
	this.authentication = {};
};

Registration.prototype.setUser = function(user) {
	this.user = user;
};

Registration.prototype.setAuthentication = function(authentication) {
	this.authentication = authentication;
};

Registration.prototype.print = function( ) {
	
};

module.exports = Registration;