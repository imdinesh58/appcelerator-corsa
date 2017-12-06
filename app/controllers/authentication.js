var args = arguments[0] || {};
var reg = require('registration');
var regObject = new reg();
var client = require('http_client');
///////
var reg2 = require('registration2');
var regObject2 = new reg2();

var payment = {};
var campaignId;

var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

var uie = require('UActivityIndicator');
var indicator = uie.createIndicatorWindow({
	top : 60
});

var isValidEmail = false;
var validateEmail = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/g;
/////////////////////////////
//remove Duplicates by using properties
/////////////////////////////
var auth_cleanup = require('cleanup');
if (args.test) {
	auth_cleanup.authcleanup();
}
/////////////////////////////
//creating model to store user datas
/////////////////////////////
var user = Alloy.Models.instance('user');
var auth = Alloy.Models.instance('authentication');
/////////////////////////////
//window onload
/////////////////////////////
refreshObject.on('completeSignUp', function(msg) {
	Ti.API.info("Got Trigger completeSignUp ... Msg : " + JSON.stringify(msg));
	showCreditCardDetailsInField();
});

function load() {
	Alloy.Globals.openWindows.push({
		'authenticate' : $.win
	});
	update();
	campaignServiceCall();
}

function campaignServiceCall() {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("GET", "https://api.ucorsa.com/matching");
	xhr.onload = function() {
		Ti.API.error("Campaign Matching Response: " + JSON.stringify(this.responseText));
		var campaignCode = JSON.parse(this.responseText);
		if (campaignCode.length) {
			$.affiliation.value = campaignCode[0].acode;
			$.affiliation.enabled = false;
		} else {
			$.affiliation.enabled = true;
		}
	};
	xhr.error = function() {
		Ti.API.error("Campaign Matching Error Response: " + JSON.stringify(this.responseText));
		alert('matching error ' + this.responseText);
	};
	xhr.send();
}

/////////////////////////////
//maintain textfield data's entered session - using properties
/////////////////////////////
function update() {
	if (OS_ANDROID) {
		if (Ti.App.Properties.hasProperty('Fname')) {
			$.Fname.value = Ti.App.Properties.getString('Fname', '');
		}
		if (Ti.App.Properties.hasProperty('Lname')) {
			$.Lname.value = Ti.App.Properties.getString('Lname', '');
		}
		if (Ti.App.Properties.hasProperty('phone')) {
			$.phone.value = Ti.App.Properties.getString('phone', '');
		}
		if (Ti.App.Properties.hasProperty('email')) {
			$.email.value = Ti.App.Properties.getString('email', '');
		}
		if (Ti.App.Properties.hasProperty('password')) {
			$.password.value = Ti.App.Properties.getString('password', '');
		}
		if (Ti.App.Properties.hasProperty('confirmpassword')) {
			$.confirmpassword.value = Ti.App.Properties.getString('confirmpassword', '');
		}
	}
}

///////////////////////////////////////////////////////////
//set textfield - out of focus - maintain textfield session
///////////////////////////////////////////////////////////
function blurPhone() {
	Ti.App.Properties.setString('phone', $.phone.value);
}

function blurAffliation() {
	Ti.App.Properties.setString('affiliation', $.affiliation.value);
}

function blurEmail() {
	Ti.App.Properties.setString('email', $.email.value);
}

function blurPassword() {
	Ti.App.Properties.setString('password', $.password.value);
}

function blurConfirmPwd() {
	Ti.App.Properties.setString('confirmpassword', $.confirmpassword.value);
}

/////////////////////////////
//validate email
/////////////////////////////
function validateInput() {
	if (validateEmail.test($.email.value) && $.email.value !== '') {
		isValidEmail = true;
	} else {
		if ($.email.value === '') {
			//alert('Enter a valid E-mail ');
		} else {
			alert($.email.value + ' is invalid E-mail.\nPlease enter a valid E-mail ');
		}
		$.email.value = "";
		$.email.focus();
	}
}

function validate_phone() {
	if ($.phone.value != null || $.phone.value != "") {
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("POST", Alloy.CFG.url + "/checkphone");
		xhr.onload = function() {
			if (this.responseText == "False") {
				alert('Phone number ' + $.phone.value + ' already exists. Please re-enter.');
				$.phone.value = "";
				$.phone.focus();
			} else {
				validate_user();
			}
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
		xhr.send(JSON.stringify({
			phone : $.phone.value
		}));
	}
}

function validate_user() {
	if ($.email.value != null || $.email.value != "") {
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("POST", Alloy.CFG.url + "/checkuserlogin");
		xhr.onload = function() {
			if (this.responseText == "False") {
				alert('Email ' + $.email.value + ' already exists.  Please re-enter.');
				$.email.value = "";
				$.email.focus();
			} else {
				save();
			}
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
		xhr.send(JSON.stringify({
			user_login : $.email.value
		}));
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//submit///
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function verify() {
	if ($.Fname.value == "" || $.Lname.value == "" || $.phone.value == "" || $.password.value == "" || $.confirmpassword.value == "") {
		alert("Enter all Credentials");
	} else if ($.phone.value.length <= 9) {
		alert('Enter a valid 10-digit phone number');
		$.phone.value = "";
		$.phone.focus();
	} else if ($.affiliation.enabled == true && $.affiliation.value == "") {
		alert("Company/Affiliation is Mandatory.  Please enter a value.");
	} else if ($.email.value == "" || isValidEmail == false) {
		validateInput();
	} else if ($.password.value != $.confirmpassword.value) {
		alert("Password Mismatching");
		$.confirmpassword.value = "";
		$.password.value = "";
		$.password.focus();
	} else {
		validate_phone();
	}
}

var ROLE;
Ti.App.Properties.setBool('_Selected_Card_', false);
function chooseRole(e) {
	if (e.index == 0) {
		ROLE = "RIDER";
		Ti.App.Properties.setBool('_Selected_Card_', true);
		Alloy.createController('StripePayment', {
			Selected_role : ROLE,
			userLogin : $.email.value,
			userPassword : $.password.value,
			firstName : $.Fname.value,
			lastName : $.Lname.value,
			phoneNo : $.phone.value,
			eMail : $.email.value,
			affiliation : $.affiliation.value
		}).getView().open();
	} else {
		$.dialog.hide();
	}
	isValidEmail = false;
}

function getCreditCardDetails() {
	Ti.App.Properties.setBool('_Selected_Card_', true);
		var win = Alloy.createController('uCreditCard',{
			parentWindow : "Signup"
	}).getView();
	win.open({
		modal : true
	});
	
	Ti.API.error("Got Credit Card Details.");
}

function showCreditCardDetailsInField() {
	Ti.API.info("In showCreditCardDetailsInField ... ");
	ccObj = Ti.App.Properties.getObject('creditCardTokenDetails', "");
	Ti.API.info("ccDetails : " + JSON.stringify(ccObj));
	$.creditCard.text = "Card ending with " + ccObj.ccLast4Digits + " ...";
}

function save() {
	user.set('first_name', $.Fname.value);
	user.set('last_name', $.Lname.value);
	user.set('phone', $.phone.value);
	user.set('affiliation', $.affiliation.value);
	user.set('email', $.email.value);
	auth.set('user_login', $.email.value);
	auth.set('user_password', $.password.value);
	var ccObj = {};
	payment = "";
	ccObj = Ti.App.Properties.getObject('creditCardTokenDetails', "");
	if (ccObj != undefined && ccObj != null && ccObj != "") {
		payment = {
			role : "Rider",
			card : {
				number : ccObj.ccLast4Digits,
				account_type : "creditCard",
				token1 : ccObj.stripeToken,
				expiry : ccObj.ccExpiryDate
			}
		};
	} else {
		Ti.API.error("Payment Details Not found. Adding user without payment details.");
		payment = {
			role : "Rider",
			card : null
		};
	}
	Ti.API.error("CCObj : " + JSON.stringify(ccObj));
	Ti.API.error("Payment : " + JSON.stringify(payment));
	// register the user
	registerUser();
}

function registerUser() {
	var reg = require('registration');
	var regObject = new reg();
	var uie = require('UActivityIndicator');

	regObject.setUser(user);
	regObject.setAuthentication(auth);
	regObject.setPayment(payment);

	// Create an instance of an indicator window
	indicator.openIndicator();

	Ti.API.info("Register Request Object: " + JSON.stringify(regObject));
	var client = require('http_client');
	var uri = "/register";
	// async call
	client.send_message(uri, "POST", regObject, handleRegisterUserResponse);
}

function handleRegisterUserResponse(err, response) {
	Ti.API.error("Start the timer for wait");
	// stop the spinner
	setTimeout(function() {
		Ti.API.error("Timer popped ... ");
		indicator.closeIndicator();
		if (err) {
			Ti.API.error("handleRegisterUserResponse - Error Response Text : " + JSON.stringify(err));
			alert(JSON.stringify(err));
		} else {
			Ti.API.info("handleRegisterUserResponse - Register Response: " + JSON.stringify(response));
			// clean up the save strip token
			Ti.App.Properties.removeProperty('creditCardTokenDetails');
			closeWindow();
			alert(JSON.stringify(response));
		}
	}, 500);
	Ti.API.error("End the timer for wait");
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;
}

$.win.open();
