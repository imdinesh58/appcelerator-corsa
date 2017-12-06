var args = arguments[0] || {};
/////////////////////////////////////////////////////////
///////////////////////  Require Modules ///////////////////
/////////////////////////////////////////////////////////
var moment = require('moment-with-locales.min');
if (OS_ANDROID) {
	var Dialogs = require("yy.tidialogs");
}

var Month_convert = require('util');
var refreshObject = Month_convert.refreshEvent();

var scheduledEvent = Alloy.createModel('scheduledEvents');
var dateFormat1 = moment().format('YYYY-MM-DD');
///////////////////////////////////////////////////////////////
///////////////////////// onload //////////////////////////
///////////////////////////////////////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'uDriveSignup' : $.uDriveSignupWin
	});
	if (OS_ANDROID) {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                   uDrive Signup";
			}
		}
		$.uDriveSignupWin.activity.onCreateOptionsMenu = function(e) {
			var menuitem = e.menu.add({
				title : "DONE",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			menuitem.addEventListener("click", function(e) {
				Validate();
			});
		};
		$.uDriveSignupWin.getActivity().invalidateOptionsMenu();
	}
	//}
}

///////////////////////////////////////////////////////////////
////////////////////// Date Picker 1 /////////////////////
///////////////////////////////////////////////////////////////

$.startdate.text = moment().format('MMM Do, YYYY');
$.starttime.text = moment().format('LT');
$.enddate.text = moment().format('MMM Do, YYYY');
$.endtime.text = moment().format('LT');

function date_picker(evt) {
	var picker = Dialogs.createDatePicker({
		value : new Date(),
		okButtonTitle : "Done",
		cancelButtonTitle : ' '
	});
	picker.addEventListener('click', function(e) {
		if (!e.cancel) {
			evt.source.text = moment(e.value).format('MMM Do, YYYY');
			dateFormat1 = moment(e.value).format('YYYY-MM-DD');
			evt.source.color = '#786658';
			evt.source.backgroundColor = 'white';
			DateSelect = true;
		}
	});
	// Cancel listener
	picker.addEventListener('cancel', function() {
	});
	picker.show();
};

function time_picker(evt) {
	// Add the click listener
	var picker = Dialogs.createTimePicker({
		value : new Date(),
		okButtonTitle : "Done",
		cancelButtonTitle : ' '
	});
	picker.addEventListener('click', function(e) {
		if (!e.cancel) {
			evt.source.text = moment(e.value).format('LT');
			evt.source.color = '#786658';
			evt.source.backgroundColor = 'white';
			TimeSelect = true;
		}
	});
	picker.show();
};

function date_popup(evt) {
	var date;
	var modal = require('IOS_Date_picker');
	var MY_Model = new modal();
	var DatePicker = MY_Model.Datepicker;
	DatePicker.addEventListener('change', function(e) {
		date = e.value;
	});
	MY_Model.saveButton.addEventListener('click', function() {
		evt.source.text = moment(date).format('MMM Do, YYYY');
		dateFormat1 = moment(date).format('YYYY-MM-DD');
		evt.source.color = '#786658';
		evt.source.backgroundColor = 'white';
		MY_Model.myModal.close();
	});
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
	});
};

function time_popup(evt) {
	var time;
	var modal = require('IOS_Time_picker');
	var MY_Model = new modal();
	var TimePicker = MY_Model.Timepicker;

	TimePicker.addEventListener('change', function(e) {
		time = moment(e.value);
	});

	MY_Model.saveButton.addEventListener('click', function() {
		timeSelected = true;
		evt.source.text = moment(time).format('LT');
		evt.source.color = '#786658';
		evt.source.backgroundColor = 'white';
		MY_Model.myModal.close();
	});
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
	});
};

///////////////////////////////////////////////////////////////
/////////////////// Data validation //////////////////
///////////////////////////////////////////////////////////////

function Validate() {
	var start = $.startdate.text + ' ' + $.starttime.text;
	// Ti.API.error("Start Date Time : " + start);
	// Ti.API.error("Start : " + moment(start, "MMM Do, YYYY HH:mm A"));
	var end = $.enddate.text + ' ' + $.endtime.text;
	// Ti.API.error("End Date Time : " + end);
	// Ti.API.error("End : " + moment(end, "MMM Do, YYYY HH:mm A"));
	// Ti.API.error("Now Date Time : " + moment().format('LT'));
	// Ti.API.error("Now : " + moment());

	if( moment() < moment(start, "MMM Do, YYYY HH:mm A") && 
		moment(start, "MMM Do, YYYY HH:mm A") < moment(end, "MMM Do, YYYY HH:mm A") ) {
		save();
	} else {
		 alert("Start Date Time and End Date Time is not correct.");
	}
}

///////////////////////////////////////////////////////////////
/////////////////// save request //////////////////
///////////////////////////////////////////////////////////////
function save() {
	var req = buildRequest();
	scheduledEvent.save(buildParams(req), {
		success : function(scheduledEvent, response) {
			closeWindow();
			refreshObject.trigger("refresh-Listdata", {
				date : req.drive_date
			});
		},
		error : function(err) {
			alert(err);
		}
	});
}

///////////////////////////////////////////////////////////////
/////////////////// build request //////////////////
///////////////////////////////////////////////////////////////
var eventDetails = null;
var operation = null;
function buildRequest() {
	var req = {};
	req.description = "";
	if (eventDetails !== null) {
		req.scheduleId = eventDetails.scheduleId;
	}
	req.drive_date = dateFormat1;
	req.start_time = $.starttime.text;
	req.end_time = $.endtime.text;
	return req;
}

///////////////////////////////////////////////////////////////
/////////////////// build params //////////////////
///////////////////////////////////////////////////////////////
function buildParams(req) {
	if (operation !== null && 'edit' === operation) {
		return {
			scheduledId : req.scheduleId,
			description : req.description,
			drive_date : req.drive_date,
			start_time : req.start_time,
			end_time : req.end_time
		};
	} else {
		return {
			description : req.description,
			drive_date : req.drive_date,
			start_time : req.start_time,
			end_time : req.end_time
		};
	}
}

///////////////////////////////////////////////////////////////
/////////////////// close window //////////////////
///////////////////////////////////////////////////////////////
function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.uDriveSignupWin.close();
	$.uDriveSignupWin = null;
}

$.uDriveSignupWin.open();
