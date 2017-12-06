var args = arguments[0] || {};
/////////////////////////////
//creating model
/////////////////////////////
var client = require('http_client');
var moment = require('moment-with-locales.min');
///////
if (OS_ANDROID) {
	var Dialogs = require("yy.tidialogs");
}
var Ridedata = Alloy.Models.instance('carpool');
var geo = require('geoL');

var moment = require('moment-with-locales.min');
var IOS_day;
// var IOS_time;
var DaySelect = false;
var TimeSelect = false;
Ti.App.Properties.setBool('Drivers2', false);
var rideData = {};
var date;
var startDate;
var endDate;
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

////get values
var cnames = function(name) {
	$.drivers.text = name.contact_Name;
	$.drivers.color = '#786658';
	$.drivers.backgroundColor = 'white';
};

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
var LOC_A;
var LOC_B;

refreshObject.on('locations', function(msg) {
	LocationRefresh(msg);
});

refreshObject.on('CONTACT_Name', function(msg) {
	cnames(msg);
});

refreshObject.on('CONTACT_ID_TYPE', function(msg) {
	csplit(msg);
});
//Ti.App.addEventListener('LocationAB', listener__);

/////////////////////////////
//window onload
/////////////////////////////
var time;
function load() {
	//Ti.API.info('Loading ucarpool.js....');
	$.send.hide();
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			// if (actionBar) {
				// actionBar.title = "                      uCarpool";
			// }
		}
	}
	$.IMG2.show();
	$.IMG3.show();
	time = moment();
	resetTimeField();
}


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

var startDateClicked;
var startdateSelected = false;
var enddateSelected = false;

function begin() {
	startDateClicked = true;
	date_popup();
}

function end() {
	startDateClicked = false;
	date_popup();
}

function date_popup() {
	if (OS_ANDROID) {
		var picker = Dialogs.createDatePicker({
			value : new Date(),
			okButtonTitle : "Done",
			cancelButtonTitle : ' '
		});
		picker.addEventListener('click', function(e) {
			if (!e.cancel) {
				if (startDateClicked == true) {
					startDate = e.value;
					setStartDateField();
				} else {
					endDate = e.value;
					setEndDateField();
				}
				validateDates();
				makeSendButtonVisible();
			}
		});
		// Cancel listener
		picker.addEventListener('cancel', function() {
		});
		picker.show();
	}
	if (OS_IOS) {
		var modal = require('IOS_Date_picker');
		var MY_Model = new modal();
		var DatePicker = MY_Model.Datepicker;
		DatePicker.addEventListener('change', function(e) {
			date = e.value;
		});
		MY_Model.saveButton.addEventListener('click', function() {
			if (startDateClicked == true) {
				startDate = date;
				setStartDateField();
			} else {
				endDate = date;
				setEndDateField();
			}
			MY_Model.myModal.close();
			validateDates();
			makeSendButtonVisible();
		});
		MY_Model.closeButton.addEventListener('click', function() {
			MY_Model.myModal.close();
		});
	}
};

function validateDates() {
	// check if the start date is valid
	var today = moment().format('YYYY-MM-DD');
	Ti.API.error("Today: " + today);
	Ti.API.error("startdateSelected: " + startdateSelected);
	Ti.API.error("enddateSelected: " + enddateSelected);
	
	if( startdateSelected == true && (enddateSelected == false) ) {
		var sDate = moment(startDate).format('YYYY-MM-DD') ;
		Ti.API.error("SDate: " + sDate);
		if (moment(sDate).isBefore(today)) {
			alert("Current Date: " + today + "\n" + "Start Date: " + sDate + "\n" + "Select a Future Date.");
			resetStartDateField();
		}
	}
	if( enddateSelected == true && (startdateSelected == false) ) {
		var eDate = moment(endDate).format('YYYY-MM-DD') ;
		Ti.API.error("EDate: " + eDate);
		if (moment(eDate).isSameOrBefore(today)) {
			alert("Current Date: " + today + "\n" + "End Date: " + eDate + "\n" + "Select a Future Date.");
			resetEndDateField();
		}
	}
	if( enddateSelected == true && startdateSelected == true ) {
		var sDate = moment(startDate).format('YYYY-MM-DD') ;
		var eDate = moment(endDate).format('YYYY-MM-DD') ;
		
		Ti.API.error("SDate: " + sDate);
		Ti.API.error("EDate: " + eDate);
		if (moment(sDate).isBefore(today)) {
			alert("Current Date: " + today + "\n" + "Start Date: " + sDate + "\n" + "Select a Future Date.");
			resetStartDateField();
		}
		if (moment(eDate).isSameOrBefore(today)) {
			alert("Current Date: " + today + "\n" + "End Date: " + eDate + "\n" + "Select a Future Date.");
			resetEndDateField();
		}
		if (moment(eDate).isSameOrBefore(sDate)) {
			alert("Start Date: " + sDate + "\n" + "End Date: " + eDate + "\n" + "Select an End Date later than the Start Date.");
			resetStartDateField();
			resetEndDateField();
		}
	}
}

function resetStartDateField() {
	$.startdate.text = "Start Date";
	$.startdate.color = '#f2efe8';
	$.startdate.backgroundColor = '#BEB0A3';
	startdateSelected = false;
}

function resetEndDateField() {
	$.enddate.text = "End Date";
	$.enddate.color = '#f2efe8';
	$.enddate.backgroundColor = '#BEB0A3';
	enddateSelected = false;
}

function setStartDateField() {
	$.startdate.text = moment(startDate).format('MMMM Do, YYYY');
	$.startdate.color = '#786658';
	$.startdate.backgroundColor = 'white';
	startdateSelected = true;
}

function setEndDateField() {
	$.enddate.text = moment(endDate).format('MMMM Do, YYYY');
	$.enddate.color = '#786658';
	$.enddate.backgroundColor = 'white';
	enddateSelected = true;
}

var dateSelected = false;
function DAY_popup() {
	Ti.App.Properties.setString("VARiable", "");
	var modal = require('repeat');
	var MY_Model_ = new modal();
	MY_Model_.save.addEventListener('click', function() {
		if (Ti.App.Properties.getString("VARiable") == "") {
		} else {
			MY_Model_.myModal.close();
			setDateField();
			validateSelectedRecurringDays();
			validateTime();
			makeSendButtonVisible();
		}
	});
}

function validateSelectedRecurringDays() {

	var daysSelected = [];
	var daySelectedError = false;
	
	daysSelected = $.date.text.split(',');
	// Ti.API.error("Recurring Days : " + daysSelected);

	if( startdateSelected == true  && enddateSelected == true ) {
		var sDate = moment(startDate).format('YYYY-MM-DD') ;
		var eDate = moment(endDate).format('YYYY-MM-DD') ;
		// Ti.API.error("SDate: " + sDate);
		// Ti.API.error("EDate: " + eDate);
		
		if( moment(eDate).diff(sDate, 'days') < 7) {
			// check if the selected days out of the range.
			var beginDayOfWeek = moment(startDate).format('d');
			var endDayOfWeek = moment(endDate).format('d');
			Ti.API.error("beginDayOfWeek: " + beginDayOfWeek);
			Ti.API.error("endDayOfWeek: " + endDayOfWeek);
			
			var dayOfWeek;
			for( var k = 0; k < daysSelected.length; k++ ) {
				dayOfWeek = getDayOfWeek( daysSelected[k] );
				Ti.API.error("dayOfWeek: " + dayOfWeek);
				if( dayOfWeek >= beginDayOfWeek && dayOfWeek <= endDayOfWeek ) {
					Ti.API.error("Selected Day " + daysSelected[k] + "is in the Range");
				} else {
					Ti.API.error("Selected Day " + daysSelected[k] + " is NOT in the Range");
					alert("Selected Day : " + daysSelected[k] + "\n" +
					"is NOT in the Date Range : " + "\n" + 
					"Start Date : " +  sDate + " ( " + moment(startDate).format('dddd')  + " ) " + "\n" +
					"End Date   : " +  eDate + " ( " + moment(endDate).format('dddd')  + " ) "
					);
					daySelectedError = true;
				}
			}
			if( daySelectedError == true ) {
				resetDateField();
			}
		}
	}
}

function getDayOfWeek( day ) {
	if( day == 'Sundays' ) return 0;
	if( day == 'Mondays' ) return 1;
	if( day == 'Tuesdays' ) return 2;
	if( day == 'Wednesdays' ) return 3;
	if( day == 'Thursdays' ) return 4;
	if( day == 'Fridays' ) return 5;
	if( day == 'Saturdays' ) return 6;
}

function setDateField() {
	$.date.text = Ti.App.Properties.getString("VARiable");
	$.date.color = '#786658';
	$.date.backgroundColor = 'white';
	dateSelected = true;
}

function resetDateField() {
	$.date.text = "Ride Frequency";
	$.date.color = '#f2efe8';
	$.date.backgroundColor = '#BEB0A3';
	dateSelected = false;
}

//time picker
var timeSelected = false;
function time_picker() {
	// Add the click listener
	var picker = Dialogs.createTimePicker({
		okButtonTitle : 'Done', // <-- optional, default "Done"
		cancelButtonTitle : ' ', // <-- optional, default "Cancel"
		value : new Date()
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
}

function time_popup() {
	//Alloy.Globals.display_on_screen("Started... uCarpool.js....timepopup()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var modal = require('IOS_Time_picker');
	var MY_Model = new modal();
	var TimePicker = MY_Model.Timepicker;
	
	TimePicker.addEventListener('change', function(e) {
		//Ti.API.error("Time E.Value = " + e.value);
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
}

function validateTime() {

	var dateTime = moment().format('YYYY-MM-DD') + ' ' + moment(time).format('HH:mm');
	var curDateTime = moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm');
	Ti.API.error("Time Now: " + curDateTime);
	Ti.API.error("Time Selected: " + dateTime);
		
	var today = moment().format('YYYY-MM-DD');
	var curDay = moment().format('dddd');
	Ti.API.error("Today Date: " + today);
	Ti.API.error("Today Day: " + curDay);
	Ti.API.error("dateSelected: " + dateSelected);
	Ti.API.error("startdateSelected: " + startdateSelected);
	Ti.API.error("enddateSelected: " + enddateSelected);
		
	if( startdateSelected == true ) {
		var sDate = moment(startDate).format('YYYY-MM-DD') ;
		Ti.API.error("SDate: " + sDate);
		
		if( moment(sDate).isSame(today)) {
			Ti.API.error("Start Date same.");
			
			if( dateSelected == true ) {
				var daysSelected = [];
				daysSelected = $.date.text.split(',');
				Ti.API.error("Recurring Days : " + daysSelected);
				
				if( daysSelected.indexOf(curDay+'s') != -1 ) {
					Ti.API.error("Ride scheduled today.");
					
					if( moment(dateTime).isBefore(curDateTime) ) {
						Ti.API.error("Selected Time is earlier than current time.");
						alert("Pick a time that is later than current time.");
						resetTimeField();
					} else {
						Ti.API.error("Selected Time is later than current time.");
					}
				} else {
					Ti.API.error("No Ride scheduled today.");
				}
			} else {
				Ti.API.error("Recurring Days Not selected.");
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
//Map icons, contact icon on-click
//////////////////////////////////
var rideFromSelected = false;
var rideToSelected = false;
function RideFrom(e) {
	e.source.setEnabled(false);
	var fromAddress = "";
	var toAddress = "";
	if( $.ridefrom.text == undefined || $.ridefrom.text != "Ride From" ) {
		fromAddress = $.ridefrom.text;
	}
	if( $.rideto.text == undefined || $.rideto.text != "Ride To" ) {
		toAddress = $.rideto.text;
	}
	Alloy.createController('mapview', { from :  fromAddress, to : toAddress } ).getView().open();
	rideFromSelected = true;
	rideToSelected = true;
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
};

function RideTo(e) {
	e.source.setEnabled(false);
	var fromAddress = "";
	var toAddress = "";
	if( $.ridefrom.text == undefined || $.ridefrom.text != "Ride From" ) {
		fromAddress = $.ridefrom.text;
	}
	if( $.rideto.text == undefined || $.rideto.text != "Ride To" ) {
		toAddress = $.rideto.text;
	}
	Alloy.createController('mapview', { from :  fromAddress, to : toAddress } ).getView().open();
	rideFromSelected = true;
	rideToSelected = true;
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
};

var selectedDrivers = false;
var driversSelected = false;
$.drivers.addEventListener('click', function(e) {
	drivers_List = [];
	var sendData = {
		search : "ride",
		date : moment(date).format('YYYY-MM-DD'),
		time : moment(time).format('HH:mm:ss')
	};

	if (startdateSelected == false) {
		alert('Select Start Date');
	} else if (enddateSelected == false) {
		alert('Select End Date');
	} else if (dateSelected == false) {
		alert('Select Event');
	} else if (timeSelected == false) {
		alert('Select Time');
	} else {
		driversSelected = true;
		e.source.setEnabled(false);
		Alloy.createController('DriverContacts', sendData).getView().open();
		selectedDrivers = true;
		setTimeout(function() {
			e.source.setEnabled(true);
		}, 3000);
	}
});
/////////////////////////////
//get location A
/////////////////////////////
function LocationRefresh(e) {
	//alert('Fired Location A  ' + e.from + "  "+e.to);
	if( e.from == undefined || e.from != "" ) {
		$.ridefrom.text = e.from;
		LOC_A = e.from;
		$.IMG2.hide();
		$.IMG3.hide();
		$.ridefrom.color = '#786658';
		$.ridefrom.backgroundColor = 'white';
		DeviceLocalTime(e.from);
	}
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
		var url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + e.coords.latitude + "," + e.coords.longitude + "&timestamp=" + subString + "&key=AIzaSyDszYzccEgeIyu3-aqRbkLR3whUoc4MZVs";
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

var riderSelect = false;
var NoOfriders;
var ridersSelected = false;
var RiderText;
var carpool_fare_set = false;
var carpool_fare_freq_set = false;

function pickRiders() {
	var dialog = Ti.UI.createOptionDialog({
		options : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Cancel'],
		title : 'No of Riders',
		width : '10%'
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		ridersSelected = true;
		if (e.index >= 0 && e.index <= 8) {
			$.riders.text = e.index + 1;
			ridersSelected = true;
			$.riders.color = '#786658';
			$.riders.backgroundColor = 'white';
			dialog.hide();
		} 
		makeSendButtonVisible();
	});
}

function setRideFee() {
	var fee = $.rideFee.value;
	$.rideFee.backgroundColor = 'white';
	$.rideFee.color = '#786658';
	carpool_fare_set = true;
	makeSendButtonVisible();
}


function setPayoutFrequency() {
	var dialog = Ti.UI.createOptionDialog({
		options : ['Per Ride', 'Per Week', 'Per Month', 'Cancel'],
		title : ' ',
		width : '10%'
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if (e.cancel == true) {
			carpool_fare_freq_set = false;
			dialog.hide();
		}else {
			carpool_fare_freq_set = true;
			if(e.index == 0){
				$.payoutFreq.text = "Pay Per Ride";
			}else if (e.index == 1){
				$.payoutFreq.text = "Pay Per Week";
			} else if (e.index == 2) {
				$.payoutFreq.text = "Pay Per Month";
			}
			
			$.payoutFreq.color = '#786658';
			$.payoutFreq.backgroundColor = 'white';
			dialog.hide();
		}
		makeSendButtonVisible();
	});
}

function makeSendButtonVisible() {
	//Ti.API.error("In makeSendButtonVisible() ... ");
	if (dateSelected && timeSelected && driversSelected && rideFromSelected && rideToSelected && ridersSelected && carpool_fare_set && carpool_fare_freq_set) {
		$.send.show();
		//Ti.API.error("Send Button made visible");
	}
}

/////////////////////////////
//Save uCarpool Details
/////////////////////////////
function save_Carpool() {
	//alert("In send_carpoolDetails() ... ");
	var credit_card_exists = false;
	var Collection = Alloy.createCollection("get_Credit_Card");
	Collection.fetch({
		success : function(collection, response) {
			//alert('res   ' + JSON.stringify(response));
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
				// Rider does not have credit card, force to enter credit card details.
				Ti.App.Properties.setBool("OnlyCreditCard", true);
				Ti.App.Properties.setBool("UriDe", true);
				Alloy.createController('ListCardDetails').getView().open();
			} else {
				// Rider has credit card, process the ride request
				if ($.ridefrom.text == 'Ride From' || $.rideto.text == 'Ride To' || $.drivers.text == 'Available Drivers' || $.riders.text == 'Number of Riders') {
					alert("Enter Fields");
				} else {
					postservice_call();
				}
			}
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			alert("Session Expired, Please Log in again.");
			if (parseResponse.status == 401) {
				myUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

///////////////////////////////////
//service call  //IOS_day
///////////////////////////////////

function postservice_call() {
	//var uri = "/api/rides";
	var Ridedata = Alloy.createModel("ride");
	var freq = [];
	var sortedFreq = [];
	freq = ($.date.text).split(",");
	for( var i = 0; i < freq.length; i++ ) {
		if( freq[i] == "Sundays" ) {
			sortedFreq.push("SUN");
		}
		if( freq[i] == "Mondays" ) {
			sortedFreq.push("MON");
		}
		if( freq[i] == "Tuesdays" ) {
			sortedFreq.push("TUE");
		}
		if( freq[i] == "Wednesdays" ) {
			sortedFreq.push("WED");
		}
		if( freq[i] == "Thursdays" ) {
			sortedFreq.push("THU");
		}
		if( freq[i] == "Fridays" ) {
			sortedFreq.push("FRI");
		}
		if( freq[i] == "Saturdays" ) {
			sortedFreq.push("SAT");
		}
	}

	Ridedata.set("Description", Description ? Description : '-');
	Ridedata.set("start_date", moment(startDate).format('YYYY-MM-DD'));
	Ridedata.set("end_date", moment(endDate).format('YYYY-MM-DD'));
	Ridedata.set("frequency", sortedFreq.join(","));
	Ridedata.set("time", moment(time).format('HH:mm:ss'));
	Ridedata.set("ride_type", "O");
	Ridedata.set("uRideType", "C");
	Ridedata.set("ride_request_to", drivers_List);
	Ridedata.set("from_location", $.ridefrom.text);
	Ridedata.set("to_location", $.rideto.text);
	Ridedata.set("deviceTimeZone", deviceTimeZone);
	Ridedata.set("no_of_riders", $.riders.text);
	Ridedata.set("carpool_fare", $.rideFee.value);
	Ridedata.set("carpool_fare_freq", $.payoutFreq.text);
	Ti.API.error("Ridedata " + JSON.stringify(Ridedata));
	Ridedata.save({}, {
		success : function(model, response) {
			
			resetStartDateField();
			resetEndDateField();
			resetDateField();
			resetTimeField();
			//
			$.drivers.text = "Available Drivers";
			$.drivers.color = "#f2efe8";
			$.drivers.backgroundColor = '#BEB0A3';
			//
			$.ridefrom.text = "Ride From";
			$.ridefrom.color = "#f2efe8";
			$.ridefrom.backgroundColor = '#BEB0A3';
			//
			$.rideto.text = "Ride To";
			$.rideto.color = "#f2efe8";
			$.rideto.backgroundColor = '#BEB0A3';
			//
			$.riders.text = "# of Riders";
			$.riders.color = "#f2efe8";
			$.riders.backgroundColor = '#BEB0A3';
			//
			$.comment.text = "Additional Notes";
			$.comment.color = "#f2efe8";
			$.comment.backgroundColor = 'BEB0A3';
			//
			$.rideFee.text = "$ / Ride";
			$.rideFee.color = "white";
			$.rideFee.backgroundColor = '#BEB0A3';
			//
			$.payoutFreq.text = "Pay Frequency";
			$.payoutFreq.color = "white";
			$.payoutFreq.backgroundColor = '#BEB0A3';
			//
			$.send.hide();
			////
			refreshObject.trigger('RefreshCarpool', {
				'Test' : 'Test'
			});
			alert('Carpool Request Successful');
		},
		error : function(err, response) {
			Ti.API.info(JSON.stringify(response));
			alert("Server Error. Please try at a later time.");
		}
	});
}

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
}
