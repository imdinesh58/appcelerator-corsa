var args = arguments[0] || {};
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();
var uie = require('UActivityIndicator');


function load() {
	Alloy.Globals.openWindows.push({
		'bankCard' : $.pay
	});
	Role();
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                Add Details";
			}
		}
	}
	$.BankName.hide();
	$.Banknumber.hide();
	$.Routenumber.hide();
	$.number.focus();
}

function Role() {
	if (Ti.App.Properties.getBool("Card_SETTINGS", '') == true) {
		var modal = require('Agreement');
		var MY_Model = new modal();

		var termsAccept = false;
		MY_Model.accept.addEventListener('click', function(e) {
			termsAccept = true;
			MY_Model.myModal.close();
			//debitCard_();
			///
			$.img2.hide();
			$.img3.left = "30%";
			$.paypal.hide();
			$.netbank.left = "40%";
			Select_bank();
		});

		MY_Model.myModal.addEventListener('android:back', function(e) {
			MY_Model.myModal.close();
			closeWindow();
		});

		MY_Model.closeButton.addEventListener('click', function() {
			MY_Model.myModal.close();
			closeWindow();
		});
	} else {
		$.city.hide();
		$.line1.hide();
		$.postal_code.hide();
		$.state.hide();
		$.dob.hide();
		$.ssn.hide();
		$.save.top = "45%";
		creditCard_();
	}
}

function debitCard_() {
	$.paypal.text = "DebitCard";
	$.paypal.left = "25%";
	$.img2.left = "15%";
	$.netbank.visible = true;
	$.img3.visible = true;
	$.city.show();
	$.line1.show();
	$.postal_code.show();
	$.state.show();
	$.dob.show();
	$.ssn.show();
}

function creditCard_() {
	$.paypal.left = "40%";
	$.paypal.text = "CreditCard";
	$.img2.backgroundImage = "/checked.png";
	$.img2.left = "30%";
	$.netbank.visible = false;
	$.img3.visible = false;
	flag = true;
	CardSelected = true;
	Select_card();
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
	$.city.show();
	$.line1.show();
	$.postal_code.show();
	$.state.show();
	$.dob.show();
	$.ssn.show();
}

function focus() {
	$.number.focus();
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
//// SAVE BUTTON ONCLICK ///
function Validation() {
	if (flag == false) {
		alert('Select Payment Mode');
	} else {
		validateYear();
	}
}

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

function ChangeDob(e) {
	if ($.dob.value.length == 2 || $.dob.value.length == 5) {
		$.dob.value += "-";
	}
	e.source.setSelection($.dob.value.length, $.dob.value.length);
}

function PaymentMode() {
	if (CardSelected == true) {
		Card();
	} else {
		Bank();
	}
}

///card
function Card() {
	if ($.paypal.text == "DebitCard") {
		if ($.city.value == "" || $.line1.value == "" || $.postal_code.value == "" || $.state.value == "" || $.dob.value == "" || $.ssn.value == "") {
			alert("Enter all mandatory fields");
		} else {
			alert('Processing....');
			if ($.paypal.text == "CreditCard") {
				role_Rider_Card();
				//Ti.API.info('creditcredit');
			} else if ($.paypal.text == "DebitCard") {
				role_Driver_Card();
				//Ti.API.info('debitdebit');
			}
		}
	} else if ($.paypal.text == "CreditCard") {
		if ($.number.value == "" || $.month.value == "" || $.year.value == "") {
			alert("Enter all mandatory fields");
		} else if ($.number.value.length <= 14) {
			alert('Enter a valid card');
		} else {
			alert('Processing....');
			if ($.paypal.text == "CreditCard") {
				role_Rider_Card();
				//Ti.API.info('creditcredit');
			} else if ($.paypal.text == "DebitCard") {
				role_Driver_Card();
				//Ti.API.info('debitdebit');
			}
		}
	}else{
		
	}
}

///bank
function Bank() {
	if ($.netbank.text = "Banking") {
		if ($.Banknumber.value == "" || $.Routenumber.value == "") {
			alert("Enter all mandatory fields");
		} else {
			//alert('Processing....');
			
			//TODO spinner
			role_Driver_Bank();
		};
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//rider only // 1 & only card no bank
function role_Rider_Card() {
	cardDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
		} else {
			//Ti.API.info("_token1  " + token1);
			Payment_Card_Rider(token1);
		}
	});
}

//driver only - CARD
function role_Driver_Card() {
	cardDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
		} else {
			//Ti.API.info("_token1   " + token1);
			Payment_Card_Driver(token1);
		}
	});
}

// driver - bank
function role_Driver_Bank() {
	bankDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
		} else {
			Payment_Bank_Driver(token1);
		}
	});
}

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
		//alert(this.responseText);
		var response = JSON.parse(xhr.responseText);
		//alert("RESPONSE card token " + response.id);
		////Ti.API.info("RESPONSE card token " + response.id);
		callback(null, response.id);
		//return response.id;
	};
	xhr.onerror = function() {
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
	var xhr = Titanium.Network.createHTTPClient();
	var _saveToken = {
		"bank_account[country]" : "US",
		"bank_account[currency]" : "usd",
		"bank_account[routing_number]" : $.Routenumber.value,
		"bank_account[account_number]" : $.Banknumber.value,
	};
	xhr.open("POST", "https://api.stripe.com/v1/tokens");
	xhr.onload = function() {
		var response = JSON.parse(xhr.responseText);
		callback(null, response.id);
		Token = response.id;

		return Token;
	};
	xhr.onerror = function() {
		var Res = JSON.parse(this.responseText);
		alert(Res.error.message);
		callback(Res.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(_saveToken);
}

//rider - creditcard
function Payment_Card_Rider(Token1) {
	var collection_ = Alloy.createCollection("Add_Rider_Role");
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "creditCard",
		token1 : Token1,
		expiry : $.month.value + "/" + $.year.value
	};
	var post = {
		role : "Rider",
		card : Card_
	};
	var params = {};
	params.accounts = post;

	collection_.create(params, {
		success : function(collection, response) {
			//alert(response.message);
			refreshObject.trigger('Reload_CardDetails_credit', {
				'Test' : 'Test'
			});
			closeWindow();
		},
		error : function(err, response) {
			alert("Invalid Credit Card Details...");
		}
	});
}

//driver - debit
function Payment_Card_Driver(Token1) {
	var collection_ = Alloy.createCollection("Add_Driver_Role");
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "debitCard",
		token1 : Token1,
		expiry : $.month.value + "/" + $.year.value,
		ssn : $.ssn.value
	};
	var post = {
		role : "Driver",
		card : Card_,
	};
	var params = {};
	params.accounts = post;
	params.dob = $.dob.value;

	params.address = {
		city : $.city.value,
		line1 : $.line1.value,
		postal_code : $.postal_code.value,
		state : $.state.value
	};

	collection_.create(params, {
		success : function(collection, response) {
			//alert(response.message);
			refreshObject.trigger('Reload_CardDetails_debit', {
				'Test' : 'Test'
			});
			closeWindow();
		},
		error : function(err, response) {
			alert("Error.\n" + JSON.stringify(response));
			alert("Invalid Credit Card Details...");
		}
	});
}

/// driver - bank
function Payment_Bank_Driver(Token1) {
	var collection_ = Alloy.createCollection("Add_Driver_Role");
	var B_last4no = ($.Banknumber.value).toString();
	var Bank_ = {
		number : B_last4no.slice(B_last4no.length - 4),
		account_type : "bank",
		token1 : Token1,
		ssn : $.ssn.value
	};
	var post = {
		role : "Driver",
		bank : Bank_
	};
	var params = {};
	params.accounts = post;
	params.dob = $.dob.value;
	params.address = {
		city : $.city.value,
		line1 : $.line1.value,
		postal_code : $.postal_code.value,
		state : $.state.value
	};
    // Create an instance of an indicator window
    var indicator = uie.createIndicatorWindow({top:60});
	indicator.openIndicator();
	collection_.create(params, {
		success : function(collection, response) {
			//alert(response.message);
			refreshObject.trigger('Reload_CardDetails_debit', {
				'Test' : 'Test'
			});
			indicator.closeIndicator();
			closeWindow();
		},
		error : function(err, response) {
			alert("Invalid Bank Details...");
		}
	});
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.pay.close();
	$.pay = null;
}

$.pay.open();

