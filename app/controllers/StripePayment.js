var args = arguments[0] || {};
var user = Alloy.Models.instance('user');
var auth = Alloy.Models.instance('authentication');
//////////////////////////////////////////////////////////////////////////////////////////////
//creating a global object for registration process
//////////////////////////////////////////////////////////////////////////////////////////////
var reg = require('registration');
var regObject = new reg();
var client = require('http_client');
///////
var reg2 = require('registration2');
var regObject2 = new reg2();

var uie = require('UActivityIndicator');
var indicator = uie.createIndicatorWindow({top:60});

if (args.Selected_role) {
	var selected_role = args.Selected_role;
}

function load() {
	Alloy.Globals.openWindows.push({
		'stripe' : $.pay
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                        SignUp!";
			}
		}
	}
	$.BankName.hide();
	$.Banknumber.hide();
	$.Routenumber.hide();
	SelectedRole();
	checkCard();
	//}
}

function checkCard() {
	if (Ti.App.Properties.getBool('_Selected_Card_', '') == true) {
		$.img2.backgroundImage = '/checked.png';
		flag = true;
		CardSelected = true;
	} else {
		$.img2.backgroundImage = '/unchecked.png';
	}
}

function SelectedRole() {
	if (selected_role == "RIDER") {
		$.paypal.left = "40%";
		$.paypal.text = "CreditCard";
		$.img2.left = "30%";
		$.netbank.visible = false;
		$.img3.visible = false;

	} else {
		$.paypal.text = "DebitCard";
		$.paypal.left = "25%";
		$.img2.left = "15%";
		$.netbank.visible = true;
		$.img3.visible = true;
	}
}

///////////////////////////////////////////////////////////
/////////////////////////////// payment mode /////////////
///////////////////////////////////////////////////////////
var flag = false;
var CardSelected = false;
function Select_card() {
	flag = true;
	CardSelected = true;
	$.img2.backgroundImage = '/checked.png';
	$.img3.backgroundImage = '/unchecked.png';
	$.number.show();
	$.month.show();
	$.year.show();
	$.cvv.show();
	$.BankName.hide();
	$.Banknumber.hide();
	$.Routenumber.hide();
}

function Select_bank() {
	flag = true;
	CardSelected = false;
	$.img3.backgroundImage = '/checked.png';
	$.img2.backgroundImage = '/unchecked.png';
	$.number.hide();
	$.month.hide();
	$.year.hide();
	$.cvv.hide();
	$.BankName.show();
	$.Banknumber.show();
	$.Routenumber.show();
}

function check() {
	if ($.month.value > 12) {
		$.month.value = "";
		$.month.focus();
		alert('Invalid Month');
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// SAVE BUTTON ONCLICK ///
function validateYear() {
	if (CardSelected == true) {
		if ($.year.value < 2016 || $.year.value > 2050) {
			$.year.value = "";
			$.year.focus();
			alert('Invalid Year');
		} else {
			PaymentMode();
		}
	} else {
		PaymentMode();
	}
}

function Validation() {
	if (flag == false) {
		alert('Select Payment Mode');
	} else {
		validateYear();
	}
}

function PaymentMode() {
	//set reg object for User & Auth
	auth.set('user_login', args.userLogin);
	auth.set('user_password', args.userPassword);
	user.set('first_name', args.firstName);
	user.set('last_name', args.lastName);
	user.set('phone', args.phoneNo);
	user.set('email', args.eMail);
	user.set('affiliation', args.affiliation);
	regObject.setUser(user);
	regObject.setAuthentication(auth);
	regObject2.setUser(user);
	regObject2.setAuthentication(auth); 
	///
	if (CardSelected == true) {
		//alert('Credit Card Selected');
		Card();
	} else {
		//alert('Bank Selected');
		Bank();
	}
}

///card
function Card() {
	if ($.number.value == "" || $.month.value == "" || $.year.value == "") {
		alert("Enter all mandatory fields");
	} else if ($.number.value.length <= 14) {
		alert('Enter a valid  card');
	} else {
		//alert('Processing please wait.....');
		if (selected_role == "RIDER") {
			role_Rider_Card();
		} else if (selected_role == "DRIVER") {
			role_Driver_Card();
		} else {
			role_both_Card();
		}
	}
}

///bank
function Bank() {
	if ($.Banknumber.value == "" || $.Routenumber.value == "") {
		alert("Enter all mandatory fields");
	} else {
		//alert('Processing please wait.....');
		if (selected_role == "DRIVER") {
			role_Driver_Bank();
		} else {
			role_both_Bank();
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// implemented without Model / Rest API coz POST wont work on REST :(  ////
///card  Main Service Call Call to get token ///
function cardDetails_testing(callback) {
	var xhr = Titanium.Network.createHTTPClient();
	var _saveToken = {
		"card[number]" : $.number.value,
		"card[exp_month]" : $.month.value,
		"card[exp_year]" : $.year.value,
		"card[currency]" : "usd"
	};
	xhr.open("POST", "https://api.stripe.com/v1/tokens");
	xhr.onload = function() {
		//alert('onload '+this.responseText);
		var response = JSON.parse(xhr.responseText);
		//alert("RESPONSE card token " + response.id);
		////Ti.API.info("RESPONSE card token " + response.id);
		callback(null, response.id);
		//return response.id;
	};
	xhr.onerror = function() {
		//alert('error '+this.responseText);
		var Res = JSON.parse(this.responseText);
		alert(Res.error.message);
		callback(Res.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(_saveToken);
}

/// bank Main Service Call Call to get token///
function bankDetails_testing(callback) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....bankDetailsTesting()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var xhr = Titanium.Network.createHTTPClient();
	var _saveToken = {
		"bank_account[country]" : "US",
		"bank_account[currency]" : "usd",
		"bank_account[routing_number]" : $.Routenumber.value,
		"bank_account[account_number]" : $.Banknumber.value,
	};
	xhr.open("POST", "https://api.stripe.com/v1/tokens");
	xhr.onload = function() {
		//alert('onload '+this.responseText);
		var response = JSON.parse(xhr.responseText);
		//alert("RESPONSE bank token  " + response.id);
		callback(null, response.id);
	};
	xhr.onerror = function() {
		var Res = JSON.parse(this.responseText);
		//this.responseText;
		alert(Res.error.message);
		callback(Res.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(_saveToken);
}

//rider - creditcard
function Payment_Card_Rider(Token1) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....Payment_Card_Rider()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "creditCard",
		token1 : Token1
	};
	var post = {
		role : "Rider",
		card : Card_
	};
	//alert("Set object " + JSON.stringify(post));
	regObject.setPayment(post);
	//alert('regObject  in submission   =  ' + JSON.stringify(regObject));
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject, handleHttpClientResponse);
}

function handleHttpClientResponse(err, response) {
	Ti.API.error("Start the timer for wait");
	// stop the spinner
	setTimeout(function() {
		Ti.API.error("Timer popped ... ");
		indicator.closeIndicator(); 
		if( err ) {
			Ti.API.error("handleHttpClientResponse - Error Response Text : " + JSON.stringify(err));
			alert(JSON.stringify(err));
		} else {
			Ti.API.info("handleHttpClientResponse - Register Response: " + JSON.stringify(response));
			Alloy.createController('signin').getView().open();
		}
	},500);
	Ti.API.error("End the timer for wait");
}

//driver - debit
function Payment_Card_Driver(Token1) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....payment_card_Driver()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "debitCard",
		token1 : Token1
	};
	var post = {
		role : "Driver",
		card : Card_
	};
	//alert("Set object " + JSON.stringify(post));
	regObject.setPayment(post);
	//Ti.API.warn(JSON.stringify(regObject));
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject, handleHttpClientResponse);
}

/// driver - bank
function Payment_Bank_Driver(Token1) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....Payment_BAnk_Driver()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var B_last4no = ($.Banknumber.value).toString();
	var Bank_ = {
		number : B_last4no.slice(B_last4no.length - 4),
		account_type : "bank",
		token1 : Token1
	};
	var post = {
		role : "Driver",
		bank : Bank_
	};
	regObject.setPayment(post);
	//alert(JSON.stringify(regObject));
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject, handleHttpClientResponse);
}

//both - Debit card
function Payment_Card_both(Token1, Token2) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....Payment_Crad_both()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "debitCard",
		token1 : Token1,
		token2 : Token2
	};
	var post = {
		role : "Both",
		card : Card_
	};
	//alert("Set object " + JSON.stringify(post));
	regObject.setPayment(post);
	//alert(JSON.stringify(regObject));
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject, handleHttpClientResponse);
}

//both - bank
function Payment_Bank_both(Token1, Token2) {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....payment_Bank_both()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var B_last4no = ($.Banknumber.value).toString();
	var Bank_ = {
		number : B_last4no.slice(B_last4no.length - 4),
		account_type : "bank",
		token1 : Token1,
		token2 : Token2
	};
	var post = {
		role : "Both",
		bank : Bank_
	};
	regObject.setPayment(post);
	//alert(JSON.stringify(regObject));
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject, handleHttpClientResponse);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//rider only // 1 & only card no bank
function ServiceCall() {
	var uri = "/register";
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", regObject2, handleHttpClientResponse);
	// Alloy.createController('signin').getView().open();
}

function role_Rider_Card() {
	cardDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
			//ServiceCall();
			//return;
		} else {
			Payment_Card_Rider(token1);
		}
	});
}

//driver only - CARD
function role_Driver_Card() {
	cardDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
			//ServiceCall();
			//return;
		} else {
			Payment_Card_Driver(token1);
			// Alloy.createController('signin').getView().open();
		}
	});
}

// driver - bank
function role_Driver_Bank() {
	bankDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
			//ServiceCall();
			//return;
		} else {
			Payment_Bank_Driver(token1);
			// Alloy.createController('signin').getView().open();
		}
	});
}

//for both - card
function role_both_Card() {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....role_both_card()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	cardDetails_testing(function(err, token1) {
		if (!err) {
			//// generate second card token using stripe API key for linking managed account to bank account
			cardDetails_testing(function(err, token2) {
				if (!err) {
					////Ti.API.info("_token1   _token   " + token1 + +token2);
					Payment_Card_both(token1, token2);
				}
			});
		}
	});
}

//for both - bank
function role_both_Bank() {
	//Alloy.Globals.display_on_screen("Started... StripePayment.js....role_both_bank()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	bankDetails_testing(function(err, token1) {
		if (!err) {
			//// generate second card token using stripe API key for linking managed account to bank account
			bankDetails_testing(function(err, token2) {
				if (!err) {
					////Ti.API.info("_token1   _token   " + token1 + +token2);
					Payment_Bank_both(token1, token2);
				}
			});
		}
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.pay.close();
	$.pay = null;

}

$.pay.open();
