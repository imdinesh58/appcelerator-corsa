module.exports = function(){
	var config = require('googleAuth');
	var gplus =  new config({
	clientId : '533122259018-2af78f7d00okfssi8i550k4ngnm28qhk.apps.googleusercontent.com',
	clientSecret : 'iNv2LVqGe0rFGZcFYjoU0kUN',
	propertyName : 'googleToken',
	quiet : false,
	scope : ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly', 'https://www.googleapis.com/auth/plus.login', 'profile', 'email', 'openid' ,'https://www.googleapis.com/auth/plus.me']
});
return gplus;
};