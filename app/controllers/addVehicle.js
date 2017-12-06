var args = arguments[0] || {};
var client = require('http_client');
/////////////////////////////////
// creating Alloy model
////////////////////////////////
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
var vehicle = Alloy.Models.instance('vehicle');

var uie = require('UActivityIndicator');
var indicator = uie.createIndicatorWindow({top:60});

/////////////////////////////////
//window onload
////////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'addVehicle' : $.win1
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                    Add Vehicle";
			}
		}
	}
}

function Validatemiles() {
	if ($.carmileage.value < 50 || $.carmileage.value > 275000) {
		alert('Car Mileage must be between 50 - 275000 miles');
	}
}

/////////////////////////////////
// service call
////////////////////////////////
var vehicle_obj = {};
function add_vehicle_call() {
	var uri = "/api/vehicle";
	vehicle.set('car_make', $.carmake.value);
	vehicle.set('car_model', $.carmodel.value);
	vehicle.set('car_mileage', $.carmileage.value);
	vehicle.set('car_year', $.caryear.value);
	vehicle.set('car_seats', $.carseats.value);
	vehicle_obj.vehicles = vehicle;
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", vehicle_obj, handleHttpClientResponse);
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
			alert(JSON.stringify("Vehicle added."));
			refreshObject.trigger('LoadVehicles', {
				'Test' : 'Test'
			});
			closeWindow();
		}
	},500);
	Ti.API.error("End the timer for wait");
}

function Validatecarseats() {
	if ($.carseats.value < 2 || $.carseats.value > 15) {
		alert('Car seats must be between 2-15');
	} else {
		fieldCheck();
	}
}

//// validate check ////
function fieldCheck() {
	if ($.carmake.value == "" || $.carmodel.value == "" || $.carmileage.value == "" || $.caryear.value == "" || $.carseats.value == "") {
		alert('Enter all Car Details');
	} else {
		add_vehicle_call();
	}
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;
}

$.win1.open();

