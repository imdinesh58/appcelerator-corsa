var args = arguments[0] || {};
function load() {
	Alloy.Globals.openWindows.push({
		'saveCredit' : $.pay
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "              Add Credit Card Details";
			}
		}
	}
}

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

function check() {
	if ($.month.value > 12) {
		$.month.value = "";
		$.month.focus();
		alert('Invalid Month');
	}
}

function validate() {
	if ($.number.value == "" || $.month.value == "" || $.year.value == "") {
		alert("Enter all mandatory fields");
	} else if ($.number.value.length <= 14) {
		alert('Enter a valid 16-digit card');
	} else if ($.year.value < 2016 || $.year.value > 2030) {
		$.year.value = "";
		$.year.focus();
		alert('Invalid Year');
	} else {
		Save_creditCard();
	}
}

function Save_creditCard() {
	cardDetails_testing(function(err, token1) {
		if (err) {
			alert(err);
		} else {
			////Ti.API.info("_token1  " + token1);
			Saved_creditCard_token(token1);
		}
	});
}

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
		var response = JSON.parse(xhr.responseText);

		callback(null, response.id);
		//return response.id;
	};
	xhr.onerror = function() {
		//alert(this.responseText);
		var Res = JSON.parse(this.responseText);
		alert(Res.error.message);
		callback(Res.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(_saveToken);
}

function Saved_creditCard_token(Token1) {
	var C_last4no = ($.number.value).toString();
	var Card_ = {
		number : C_last4no.slice(C_last4no.length - 4),
		account_type : "creditCard",
		token1 : Token1
	};
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
