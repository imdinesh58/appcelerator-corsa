var args = arguments[0] || {};
/////////////////////////////
//create Model
/////////////////////////////
var client = require('http_client');
var address = Alloy.Models.instance('authentication');
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

var uie = require('UActivityIndicator');
var indicator = uie.createIndicatorWindow({top:60});

/////////////////////////////
//window onload
/////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'editAddress' : $.win1
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                    Add Address";
			}
		}
	}
}

/////////////////////////////////
// service call
////////////////////////////////
var address_obj = {};
function add_address_call() {
	////Ti.API.info('Start...Service call....add_address_call()');
	var uri = "/api/address";
	address.set('address1', $.address1.value);
	address.set('address2', $.address2.value);
	address.set('city', $.city.value);
	address.set('state', $.state.value);
	address.set('zip', $.zipcode.value);
	address.set('latitude', "12.8");
	address.set('longitude', "80.1");
	address_obj.address = address;
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", address_obj, handleHttpClientResponse);
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
			alert("Address added.");
	    	refreshObject.trigger('LoadAddress', {
				'Test' : 'Test'
			});
			closeWindow();
		}
	},500);
	Ti.API.error("End the timer for wait");
}

///validate check //
function check() {
	if ($.address1.value == "" || $.city.value == "" || $.state.value == "" || $.zipcode.value == "") {
		alert('Enter Mandatory Fields');
	} else {
		add_address_call();
		//var dispatcher = require('dispatcher');
    	//dispatcher.trigger('LoadAddress');
	}
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;

}

$.win1.open();

