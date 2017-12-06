var args = arguments[0] || {};
var client = require('http_client');
var rideFares = {};

var timeUtil = require('util');

var Account_ID = args._Account_ID_;
var ManagedId;
if (args.ManagedID == undefined || args.ManagedID == "") {
} else {
	ManagedId = args.ManagedID;
}

function load() {
	Alloy.Globals.openWindows.push({
		'payForRide' : $.pay
	});
	Ti.App.Properties.setString('window', 'PAY_NOW');
	FareAPICall();
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                   Payment Receipt";
			}
		}
	}
}

function FareAPICall() {
	var xhr = Titanium.Network.createHTTPClient();
	if (Ti.App.Properties.getBool('isCarpoolRide') == false) {
		xhr.open("GET", "https://api.ucorsa.com/api/rides/uRideFare");
	} else {
		xhr.open("GET", "https://api.ucorsa.com/api/carpool/uCarpoolFare");
	}
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.onload = function() {
		var Fare = JSON.parse(this.responseText);
		var num = Fare[0].RideFareAmount;
		// cent to dollar
		num /= 100;
		$.amount.text = "Charge for your Ride: $" + num.toLocaleString("en-US", {
			style : "currency",
			currency : "USD"
		}) + ".00";
	};
	xhr.send();
}

function show() {
	$.dialog.show();
}

function submit() {
	if ($.mytips.value == "") {
		var MyValue = "0.00";
	} else {
		// var MyValue = $.mytips.value;
		var pts = $.mytips.value.indexOf(".");
		var lgth = $.mytips.value.length;
		Ti.API.error("Length = " + lgth);
		Ti.API.error("Decimal Points = " + pts);

		if ($.mytips.value.indexOf(".") > 0) {
			if (lgth - (pts + 1) == 2) {
				MyValue = $.mytips.value;
			} else {
				alert("Extra Amount entered in wrong format.  Please enter the amount in x.xx format.");
				$.mytips.value = "";
				return;
			}
		} else {
			alert("Extra Amount entered in wrong format.  Please enter the amount in x.xx format.");
			$.mytips.value = "";
			return;
		}
	}
	var collection = Alloy.createCollection("PaymentReceipt");
	var post = {};
	if (ManagedId == undefined || ManagedId == "") {
		post = {
			ride_id : Ti.App.Properties.getString('_Save_RideID_'), //Saved_RideID
			tip : MyValue,
			account_id : Account_ID
		};
	} else {
		post = {
			ride_id : Ti.App.Properties.getString('_Save_RideID_'), //Saved_RideID
			tip : MyValue,
			account_id : Account_ID,
			managedId : ManagedId
		};
	}
	collection.create(post, {
		success : function(collection, response) {
			closeWindow();
			// alert(response.message);
			Alloy.createController('uPaymentTabGroup').getView().open();
		},
		error : function(err, response) {
			alert("Payment Failed ... service failed to load");
			var parseResponse = JSON.parse(response);
			alert("session expired, please log back.");
			if (parseResponse.status == 401) {
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

// get the ride fare details
function getuRideFare() {
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.pay.close();
	$.pay = null;
}

$.pay.open();
