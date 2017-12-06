// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

var errorMsg = "";

function onload() {
	Ti.API.info("Args : " + JSON.stringify(args));
	Alloy.Globals.openWindows.push({
		'creditCard' : $.creditCard
	});
}

function doCancel() {
	closeWindow();
}

function doSave() {
	validate();
	if( errorMsg == "" ) {
		tokenizeCreditCardDetails(handleStripeResponse);
	} else {
		alert(errorMsg);
	}
}

function validate() {
	errorMsg = "";
	validateCreditCardNumber();
	validateYear();
	validateMonth();
}

function validateCreditCardNumber() {
	if( $.ccNumber.value == "" ) {
		errorMsg = "Enter Credit Card Number";
	} else if ($.ccNumber.value.length <= 14) {
		errorMsg += "\nEnter a valid card number";
	} else {
	}
}

function validateMonth() {
	if( $.ccExpMonth.value == "" ) {
		errorMsg += "\nEnter Card Expiry Month";
	} else {
		if ($.ccExpMonth.value < 00 || $.ccExpMonth.value > 12) {
			$.ccExpMonth.value = "";
			$.ccExpMonth.focus();
			errorMsg += "\nInvalid Month";
		}
	}
}

function validateYear() {
	if( $.ccExpYear.value == "" ) {
		errorMsg += "\nEnter Card Expiry Year";
	} else {
		if ($.ccExpYear.value < 2016 || $.ccExpYear.value > 2050) {
			$.ccExpYear.value = "";
			$.ccExpYear.focus();
			errorMsg = "\nInvalid Year";
		}
	}
}

function tokenizeCreditCardDetails(callback) {
	var xhr = Titanium.Network.createHTTPClient();
	var ccDetails = {
		"card[number]" : $.ccNumber.value,
		"card[exp_month]" : $.ccExpMonth.value,
		"card[exp_year]" : $.ccExpYear.value,
		"card[currency]" : "usd"
	};
	xhr.open("POST", "https://api.stripe.com/v1/tokens");
	xhr.onload = function() {
		var response = JSON.parse(xhr.responseText);
		Ti.API.info("Token Response From Stripe: " + response);
		callback(null, response);
	};
	xhr.onerror = function() {
		var errResponse = JSON.parse(this.responseText);
		Ti.API.error(errResponse.error.message);
		callback(errResponse.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(ccDetails);
}

function handleStripeResponse(err, response) {
	if (err) {
		Ti.API.error("Error response from Stripe: " + JSON.stringify(err));
		alert("Error processing the Credit Card.  Please try later.");
	} else {
		Ti.API.info("Saving the Credit Card Details.");
		var ccNum = $.ccNumber.value;
		var creditCardTokenObj = {
			ccLast4Digits : ccNum.slice(ccNum.length - 4),
			stripeToken : response.id,
			accountType : "creditCard",
			ccExpiryDate : $.ccExpMonth.value + "/" + $.ccExpYear.value
		};
		Ti.App.Properties.setObject('creditCardTokenDetails', creditCardTokenObj);
		if( args.parentWindow == "Signup" ) {
			refreshObject.trigger('completeSignUp', {
				ccDetails : creditCardTokenObj,
				parentWindow : "Signup"
			});
		} else if( args.parentWindow == "ListCreditCards" ) {
			refreshObject.trigger('saveCreditCardDetails', {
				ccDetails : creditCardTokenObj,
				parentWindow : "ListCreditCards"
			});
		} else if( args.parentWindow == "SelectCard" ) {
			refreshObject.trigger('saveCreditCardDetails', {
				ccDetails : creditCardTokenObj,
				parentWindow : "SelectCard"
			});
		}
		closeWindow();
	}
}

function closeWindow() {
	$.creditCard.close();
	$.creditCard = null;
}

//$.creditCard.open();

