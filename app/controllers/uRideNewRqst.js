var args = arguments[0] || {};
///////////////////////////////
var client = require('http_client');

///////
if (OS_ANDROID) {
	var Dialogs = require("yy.tidialogs");
}
/////////////////////////////
//creating model
/////////////////////////////
var Ridedata = Alloy.Models.instance('ride');
var rideData = {};
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();
var moment = require('moment-with-locales.min');
var dateSelected = false;
var date;
var time;
var timeSelected = false;
Ti.App.Properties.setBool('Drivers', false);
var geo = require('geoL');
var LOC_A;
var LOC_B;
///////////////////

//////////
//window onload
/////////////////////////////
function load() {
	$.accessView.hide();
	$.Refresh.show();
	if (Titanium.Geolocation.locationServicesEnabled) {
		AccessToRideScreen();
	} else {
		var alertDlg = Titanium.UI.createAlertDialog({
			message : 'GPS is OFF.  Enable it in Settings.',
			buttonNames : ['Open Settings']
		});
		alertDlg.show();
		alertDlg.addEventListener('click', function() {
			if (OS_ANDROID) {
				var settingsIntent = Titanium.Android.createIntent({
					action : 'android.settings.APPLICATION_SETTINGS'
				});
				Ti.Android.currentActivity.startActivity(settingsIntent);
			} else {
				Ti.Platform.openURL('app-settings:');
				//ios
			}
		});
	}
};

function AccessToRideScreen() {
	$.Refresh.hide();
	$.accessView.show();
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			// if (actionBar) {
				// actionBar.title = "                      uRide";
			// }
		}
	}
	$.send.hide();
	$.IMG2.show();
	$.IMG3.show();
	//Currentdate();
	date = moment();
	time = date;
	$.date.text = moment(date).format('MMMM Do, YYYY');
	$.time.text = moment(time).format('LT');
};

function ReloadScreen() {
	if (Titanium.Geolocation.locationServicesEnabled) {
		AccessToRideScreen();
	} else {
		alert("GPS Still Not Enabled :(");
	}
};

refreshObject.on('locations', function(msg) {
	LocationRefresh(msg);
});

refreshObject.on('CONTACT_Name', function(msg) {
	cnames(msg);
});

refreshObject.on('CONTACT_ID_TYPE', function(msg) {
	csplit(msg);
});

/////////////////////////////
//get driver name
/////////////////////////////
var cnames = function(name) {
	$.drivers.text = name.contact_Name;
	$.drivers.color = '#786658';
	$.drivers.backgroundColor = 'white';
	makeSendButtonVisible();
};

/////////////////////////////
//get driver id
/////////////////////////////
var drivers_List = [];
var csplit = function(e) {
	var split_ID = e.contact_Id.split(",");
	var split_type = e.contact_Type.split(",");
	////Ti.API.info('split_ID '+split_ID);
	for (var i = 0; i < split_ID.length; i++) {
		var contact_ = {
			id : split_ID[i],
			type : split_type[i]
		};
		drivers_List.push(contact_);
	}
};

/////////////////////////////
//get location A
/////////////////////////////
function LocationRefresh(e) {
	Ti.API.info('Fired Location Event from Map : ' + e.from + e.to );
	if( e.from == undefined || e.from != "" ) {
		$.ridefrom.text = e.from;
		LOC_A = e.from;
		$.IMG2.hide();
		$.IMG3.hide();
		$.ridefrom.color = '#786658';
		$.ridefrom.backgroundColor = 'white';
		DeviceLocalTime(e.from);
	}
	////Ti.API.info('Fired Location B  ' + e.to);
	if( e.to == undefined || e.to != "" ) {
		$.rideto.text = e.to;
		LOC_B = e.to;
		$.IMG2.hide();
		$.IMG3.hide();
		$.rideto.color = '#786658';
		$.rideto.backgroundColor = 'white';
	}
	makeSendButtonVisible();
};

var deviceTimeZone = null;
function DeviceLocalTime(address) {
	geo.forwardGeocode(address, function(e) {
		var currentTime = moment.utc();
		var toDate = new Date(currentTime);
		var convertString = currentTime.valueOf().toString();
		var subString = convertString.substr(0, 10);

		if (OS_IOS) {
			Titanium.Geolocation.getCurrentPosition(function(e) {
				Ti.API.error("uRideNewRqst - DeviceLocalTime - Event Details : " + JSON.stringify(e));
				currentLattitude = e.coords.latitude;
				currentLongitude = e.coords.longitude;
			});
		} else {
			var geo = require('geo');
			var region = geo.CurrentLocation();
			Ti.API.error("uRideNewRqst - DeviceLocalTime - Region : " + JSON.stringify(region));
			currentLattitude = region.latitude;
			currentLongitude = region.longitude;
		}

		var url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + currentLattitude + "," + currentLongitude + "&timestamp=" + subString + "&key=AIzaSyDszYzccEgeIyu3-aqRbkLR3whUoc4MZVs";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				var obj = JSON.parse(this.responseText);
				deviceTimeZone = obj.timeZoneId;
			}
		});
		client.open("GET", url);
		client.send();
	});
};

// Ti.App.addEventListener('LocationAB', listener__);

/////////////////////////////
//date popup
/////////////////////////////
function date_picker() {
	var picker = Dialogs.createDatePicker({
		value : new Date(),
		okButtonTitle : "Done",
		cancelButtonTitle : ' '
	});
	picker.addEventListener('click', function(e) {
		if (!e.cancel) {
			date = e.value;
			setDateField();
			validateDate();
			makeSendButtonVisible();
		}
	});
	// Cancel listener
	picker.addEventListener('cancel', function() {
	});
	picker.show();
};

function date_popup() {
	//flag = true;
	var modal = require('IOS_Date_picker');
	var MY_Model = new modal();
	var DatePicker = MY_Model.Datepicker;
	DatePicker.addEventListener('change', function(e) {
		date = e.value;
		//Ti.API.error("Date E.Value = " + e.value);
	});
	MY_Model.saveButton.addEventListener('click', function() {
		setDateField();
		MY_Model.myModal.close();
		validateDate();
		makeSendButtonVisible();
	});
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
	});
};

function validateDate() {
	// check if the start date is valid
	var today = moment().format('YYYY-MM-DD');
	Ti.API.error("Today: " + today);
	
	if( dateSelected == true ) {
		var sDate = moment(date).format('YYYY-MM-DD') ;
		Ti.API.error("SDate: " + sDate);
		if (moment(sDate).isBefore(today)) {
			alert("Current Date: " + today + "\n" + "Selected Date: " + sDate + "\n" + "Select a Future Date.");
			resetDateField();
		}
	}
}

function resetDateField() {
	$.date.text = moment().format('MMMM Do, YYYY');
	$.date.color = '#f2efe8';
	$.date.backgroundColor = '#BEB0A3';
	dateSelected = false;
}

function setDateField() {
	$.date.text = moment(date).format('MMMM Do, YYYY');
	$.date.color = '#786658';
	$.date.backgroundColor = 'white';
	dateSelected = true;
}

/////////////////////////////
// Time picker
/////////////////////////////
function time_picker() {
	// Add the click listener
	var picker = Dialogs.createTimePicker({
		value : new Date(),
		okButtonTitle : "Done",
		cancelButtonTitle : ' '
	});
	picker.addEventListener('click', function(e) {
		if (!e.cancel) {
			time = moment(e.value);
			setTimeField();
			validateTime();
			makeSendButtonVisible();
		}
	});
	picker.show();
};

function time_popup() {
	var modal = require('IOS_Time_picker');
	var MY_Model = new modal();
	var TimePicker = MY_Model.Timepicker;

	TimePicker.addEventListener('change', function(e) {
		time = moment(e.value);
	});

	MY_Model.saveButton.addEventListener('click', function() {
		MY_Model.myModal.close();
		setTimeField();
		validateTime();
		makeSendButtonVisible();
	});
	
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
	});
};

function validateTime() {
	var dateTime = moment().format('YYYY-MM-DD') + ' ' + moment(time).format('HH:mm');
	var curDateTime = moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm');
	Ti.API.error("Time Now: " + curDateTime);
	Ti.API.error("Time Selected: " + dateTime);
	Ti.API.error("Date Selected: " + dateSelected);
		
	if( dateSelected == true ) {
		var sDate = moment(date).format('YYYY-MM-DD') ;
		Ti.API.error("SDate: " + sDate);
		var today = moment().format('YYYY-MM-DD');
		Ti.API.error("Today Date: " + today);
		
		if( moment(sDate).isSame(today)) {
			Ti.API.error("Start Date same.");
			if( moment(dateTime).isBefore(curDateTime) ) {
				Ti.API.error("Selected Time is earlier than current time.");
				alert("Pick a time that is later than current time.");
				resetTimeField();
			} else {
				Ti.API.error("Selected Time is later than current time.");
			}
		} else {
			Ti.API.error("Start Date different from today.");
		}
	}	
}

function resetTimeField() {
	$.time.text = moment().format('LT');
	$.time.color = '#f2efe8';
	$.time.backgroundColor = '#BEB0A3';
	timeSelected = false;
}

function setTimeField() {
	$.time.text = moment(time).format('LT');
	$.time.color = '#786658';
	$.time.backgroundColor = 'white';
	timeSelected = true;
}
//////////////////////////////////
//Ride from
//Ride To
//////////////////////////////////
function showMap(e) {
	e.source.setEnabled(false);
	var fromAddress = "";
	var toAddress = "";
	if( $.ridefrom.text == undefined || $.ridefrom.text != "Ride From" ) {
		fromAddress = $.ridefrom.text;
	}
	if( $.rideto.text == undefined || $.rideto.text != "Ride To" ) {
		toAddress = $.rideto.text;
	}
	Ti.API.error("FromAddress: " + fromAddress);
	Ti.API.error("ToAddress: " + toAddress);
	
	Alloy.createController('mapview', { from :  fromAddress, to : toAddress } ).getView().open();
		
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
};
//////////////////////////////////
//drivers
//////////////////////////////////
$.drivers.addEventListener('click', function(e) {
	drivers_List = [];
	if (timeSelected == false) {
		alert('Select time');
	} else {
		var sendData = {
			search : "ride",
			date : moment(date).format('YYYY-MM-DD'),
			time : moment(time).format('HH:mm:ss')
		};
		//alert(JSON.stringify(sendData));
		e.source.setEnabled(false);
		Alloy.createController('DriverContacts', sendData).getView().open();
		setTimeout(function() {
			e.source.setEnabled(true);
		}, 3000);
	}
});

//////////////////////////////////
// Riders
//////////////////////////////////
var ridersSelected = false;
var RiderText;
function pickRiders() {
	var dialog = Ti.UI.createOptionDialog({
		options : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Cancel'],
		title : 'No of Riders',
		width : '10%'
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if (e.index >= 0 && e.index <= 8) {
			$.riders.text = e.index + 1;
			makeSendButtonVisible();
		} else {
		}
		ridersSelected = true;
		$.riders.color = '#786658';
		$.riders.backgroundColor = 'white';
		dialog.hide();
		// check if the SEND button must be made visible
		//Ti.API.error("Calling makeSendButtonVisible() ... from pickRiders()");
		makeSendButtonVisible();
	});
};

function makeSendButtonVisible() {
	var dateTime = moment(date).format('YYYY-MM-DD') + ' ' + moment(time).format('HH:mm');
	var curDateTime = moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm');

	if (moment(dateTime).isBefore(curDateTime)) {
		//alert(" Current DateTime: " + moment().format('YYYY-MM-DD h:mma') + "\n" + "Selected DateTime: " + dateTime + "\n" + "Select a Future Date & Time.");
	}
	
	Ti.API.error("Time Selected : " + timeSelected);
	Ti.API.error("ridefrom : " + $.ridefrom.text);
	Ti.API.error("rideTo : " + $.rideto.text);
	Ti.API.error("Driver(s) : " + $.drivers.text);
	Ti.API.error("Riders : " + $.riders.text);
	
	if (timeSelected && $.ridefrom.text != 'Ride From' && $.rideto.text != 'Ride To' && $.drivers.text != 'Available Drivers' && $.riders.text != '# of Riders') {
		Ti.API.error("Displaying the SEND button");
		$.send.show();
	}
};

var Description = "";
function comment() {
	var modal = require('Comment');
	var MY_Model = new modal();

	MY_Model.saveButton.addEventListener('click', function() {
		Description = MY_Model.TexT.value;
		//Ti.API.info(MY_Model.TexT.value);
		MY_Model.myModal.close();
		$.comment.text = MY_Model.TexT.value;
		$.comment.color = "#786658";
		$.comment.backgroundColor = 'white';
	});
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
		$.comment.text = "Additional Notes";
	});
};

///////////////////////////////////
//service call - Ride Request
///////////////////////////////////
function postservice_call() {
	try {
		var Ridedata = Alloy.createModel("ride");
		Ridedata.set("from_location", $.ridefrom.text);
		Ridedata.set("to_location", $.rideto.text);
		Ridedata.set("end_date", moment(date).format('YYYY-MM-DD'));
		Ridedata.set("time", moment(time).format('HH:mm:ss'));
		Ridedata.set("ride_type", "O");
		Ridedata.set("deviceTimeZone", deviceTimeZone);
		Ridedata.set("no_of_riders", $.riders.text);
		Ridedata.set("ride_request_to", drivers_List);
		Ridedata.set("uRideType", "R");
		Ridedata.set("Description", Description ? Description : '-');
	
		Ridedata.save({}, {
			success : function(model, response) {
				//
				resetDateField();
				resetTimeField();
				//
				$.drivers.text = "Available Drivers";
				$.drivers.color = "white";
				$.drivers.backgroundColor = '#BEB0A3';
				//
				$.ridefrom.text = "Ride From";
				$.ridefrom.color = "white";
				$.ridefrom.backgroundColor = '#BEB0A3';
				//
				$.rideto.text = "Ride To";
				$.rideto.color = "white";
				$.rideto.backgroundColor = '#BEB0A3';
				//
				$.riders.text = "# of Riders";
				$.riders.color = "white";
				$.riders.backgroundColor = '#BEB0A3';
				//
				$.comment.text = "Additional Notes";
				$.comment.color = "white";
				$.comment.backgroundColor = '#BEB0A3';
				//
				$.send.hide();
				////
				refreshObject.trigger('RefreshRide', {
					'Status' : 'SingleRideRequested'
				});	
				alert('Ride Request Successful');	
			},
			error : function(err, response) {
				Ti.API.info("Response : " + JSON.stringify(response));
				Ti.API.error("Error : " + JSON.stringify(err));
				alert("Server Error, Please try at a later time.");
			}
		});
	} catch (err) {
		//alert(err);
	}
};



/////////////////////////////
//Submit - ride Details
/////////////////////////////
function send_rideDetails(e) {
	var credit_card_exists = false;
	var Collection = Alloy.createCollection("get_Credit_Card");
	Collection.fetch({
		success : function(collection, response) {
			//Ti.API.info('res   ' + JSON.stringify(response));

			for ( i = 0; i < response.length; i++) {
				//Ti.API.info("Account Type came on response = " + response[i].account_type);
				if (response[i].account_type == "creditCard") {
					credit_card_exists = true;
				}
			}
			if (response.account_type == "creditCard") {
				credit_card_exists = true;
			}

			if (credit_card_exists == false) {
				//Ti.API.info('credit_card_exists  if  ' + credit_card_exists);
				// Rider does not have credit card, force to enter credit card details.
				Ti.App.Properties.setBool("OnlyCreditCard", true);
				Ti.App.Properties.setBool("UriDe", true);
				Alloy.createController('ListCardDetails').getView().open();
			} else {
				//Ti.API.info('credit_card_exists  ' + credit_card_exists);
				// Rider has credit card, process the ride request
				if ($.ridefrom.text == 'Ride From' || $.rideto.text == 'Ride To' || $.drivers.text == 'Available Drivers' || $.riders.text == 'Number of Riders') {
					alert("Enter Fields");
				} else {
					//alert("service call");							
					postservice_call();
				}
			}
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			if (parseResponse.status == 401) {
				alert("Session Expired, Please log back.");
				myUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			} else {
				alert("Server Error, Please try at a later time.");
			}
		}
	});
};

function closeWindow() {
	refreshObject.off('locations');
	refreshObject.off('CONTACT_Name');
	refreshObject.off('CONTACT_ID_TYPE');
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
};


