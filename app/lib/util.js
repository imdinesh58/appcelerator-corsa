exports.convert_to_24h = function(time_str) {
	// Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]
	var time = time_str.match(/(\d+):(\d+):(\d+) (\w)/);
	var hours = Number(time[1]);
	var minutes = Number(time[2]);
	var seconds = Number(time[3]);
	var meridian = time[4].toLowerCase();

	if (meridian == 'p' && hours < 12) {
		hours = hours + 12;
	} else if (meridian == 'a' && hours == 12) {
		hours = hours - 12;
	}
	return [hours, minutes, seconds];
};

exports.amPmFormat = function(time) {
	var time = time.substring(0,2);
	if(time >= 12){
		return 'PM';
	} else {
		return 'AM';
	}
};
	
exports.timeFormat = function(time) {
	var tQualifier = time.substring(0,2);
	if (tQualifier > 12){
		tQualifier = tQualifier -12;
		tQualifier = tQualifier + time.substring(2,5);
	} else {
		tQualifier = time.substring(0,5);
	}
	return tQualifier;
};
var uDriveEvent = {};
			_(uDriveEvent).extend(Backbone.Events);

/// Test code			
var refreshObject = {};
_.extend(refreshObject, Backbone.Events);
exports.refreshEvent = function(){
	return refreshObject;
};

//test code end

exports.fireEvent = function(message){
	uDriveEvent.trigger(message); 
};

exports.returnFireEvent = function(){
	return uDriveEvent;
};

exports.convertMonth = function(months){
	var _converted_month;
		if (months == "Jan")
			_converted_month = "01";
		else if (months == "Feb")
			_converted_month = "02";
		else if (months == "Mar")
			_converted_month = "03";
		else if (months == "Apr")
			_converted_month = "04";
		else if (months == "May")
			_converted_month = "05";
		else if (months == "Jun")
			_converted_month = "06";
		else if (months == "Jul")
			_converted_month = "07";
		else if (months == "Aug")
			_converted_month = "08";
		else if (months == "Sep")
			_converted_month = "09";
		else if (months == "Oct")
			_converted_month = "10";
		else if (months == "Nov")
			_converted_month = "11";
		else
			_converted_month = "12";
		return _converted_month;
};

exports.convered_Month = function(months){
	var _converted_month;
		if (months == "01")
			_converted_month = "Jan";
		else if (months == "02")
			_converted_month = "Feb";
		else if (months == "03")
			_converted_month = "Mar";
		else if (months == "04")
			_converted_month = "Apr";
		else if (months == "05")
			_converted_month = "May";
		else if (months == "06")
			_converted_month = "Jun";
		else if (months == "07")
			_converted_month = "Jul";
		else if (months == "08")
			_converted_month = "Aug";
		else if (months == "09")
			_converted_month = "Sep";
		else if (months == "10")
			_converted_month = "Oct";
		else if (months == "11")
			_converted_month = "Nov";
		else
			_converted_month = "Dec";
		return _converted_month;
};
exports.convered_Month_forPicker = function(months){
	var _converted_month;
		if (months == "01")
			_converted_month = "Jan";
		else if (months == "02")
			_converted_month = "Feb";
		else if (months == "03")
			_converted_month = "Mar";
		else if (months == "04")
			_converted_month = "Apr";
		else if (months == "05")
			_converted_month = "May";
		else if (months == "06")
			_converted_month = "Jun";
		else if (months == "07")
			_converted_month = "Jul";
		else if (months == "08")
			_converted_month = "Aug";
		else if (months == "09")
			_converted_month = "Sep";
		else if (months == "10")
			_converted_month = "Oct";
		else if (months == "11")
			_converted_month = "Nov";
		else if (months == "12")
			_converted_month = "Dec";
		return _converted_month;
};




exports.MonthConvert = function(months){
	var _converted_month;
		if (months == "January")
			_converted_month = "01";
		else if (months == "February")
			_converted_month = "02";
		else if (months == "March")
			_converted_month = "03";
		else if (months == "April")
			_converted_month = "04";
		else if (months == "May")
			_converted_month = "05";
		else if (months == "June")
			_converted_month = "06";
		else if (months == "July")
			_converted_month = "07";
		else if (months == "August")
			_converted_month = "08";
		else if (months == "September")
			_converted_month = "09";
		else if (months == "October")
			_converted_month = "10";
		else if (months == "November")
			_converted_month = "11";
		else
			_converted_month = "12";
		return _converted_month;
};

exports.uDriveMonth = function(months){
	var _converted_month;
		if (months == "January")
			_converted_month = "0";
		else if (months == "February")
			_converted_month = "1";
		else if (months == "March")
			_converted_month = "2";
		else if (months == "April")
			_converted_month = "3";
		else if (months == "May")
			_converted_month = "4";
		else if (months == "June")
			_converted_month = "5";
		else if (months == "July")
			_converted_month = "6";
		else if (months == "August")
			_converted_month = "7";
		else if (months == "September")
			_converted_month = "8";
		else if (months == "October")
			_converted_month = "9";
		else if (months == "November")
			_converted_month = "11";
		else
			_converted_month = "12";
		return _converted_month;
};

exports.Month_Picker = function(months){
	var _converted_month;
			if (months == "0")
			_converted_month = "Jan";
		else if (months == "1")
			_converted_month = "Feb";
		else if (months == "2")
			_converted_month = "Mar";
		else if (months == "3")
			_converted_month = "Apr";
		else if (months == "4")
			_converted_month = "May";
		else if (months == "5")
			_converted_month = "Jun";
		else if (months == "6")
			_converted_month = "Jul";
		else if (months == "7")
			_converted_month = "Aug";
		else if (months == "8")
			_converted_month = "Sep";
		else if (months == "9")
			_converted_month = "Oct";
		else if (months == "10")
			_converted_month = "Nov";
		else
			_converted_month = "Dec";
		return _converted_month;
};

exports.uDriveMonth__ = function(months){
	var _converted_month;
		if (months == "January")
			_converted_month = "01";
		else if (months == "February")
			_converted_month = "02";
		else if (months == "March")
			_converted_month = "03";
		else if (months == "April")
			_converted_month = "04";
		else if (months == "May")
			_converted_month = "05";
		else if (months == "June")
			_converted_month = "06";
		else if (months == "July")
			_converted_month = "07";
		else if (months == "August")
			_converted_month = "08";
		else if (months == "September")
			_converted_month = "09";
		else if (months == "October")
			_converted_month = "10";
		else if (months == "November")
			_converted_month = "11";
		else
			_converted_month = "12";
		return _converted_month;
};


exports.uDriveMonth_Android = function(months){
	var _converted_month;
		if (months == "January")
			_converted_month = "1";
		else if (months == "February")
			_converted_month = "2";
		else if (months == "March")
			_converted_month = "3";
		else if (months == "April")
			_converted_month = "4";
		else if (months == "May")
			_converted_month = "5";
		else if (months == "June")
			_converted_month = "6";
		else if (months == "July")
			_converted_month = "7";
		else if (months == "August")
			_converted_month = "8";
		else if (months == "September")
			_converted_month = "9";
		else if (months == "October")
			_converted_month = "10";
		else if (months == "November")
			_converted_month = "11";
		else
			_converted_month = "12";
		return _converted_month;
};

exports.MONTH = function(months){
	var _converted_month;
		if (months == "01")
			_converted_month = "January";
		else if (months == "02")
			_converted_month = "February";
		else if (months == "03")
			_converted_month = "March";
		else if (months == "04")
			_converted_month = "April";
		else if (months == "05")
			_converted_month = "May";
		else if (months == "06")
			_converted_month = "June";
		else if (months == "07")
			_converted_month = "July";
		else if (months == "08")
			_converted_month = "August";
		else if (months == "09")
			_converted_month = "September";
		else if (months == "10")
			_converted_month = "October";
		else if (months == "11")
			_converted_month = "November";
		else
			_converted_month = "December";
		return _converted_month;
};

exports.MONTH = function(months){
	var _converted_month;
		if (months == "01")
			_converted_month = "January";
		else if (months == "02")
			_converted_month = "February";
		else if (months == "03")
			_converted_month = "March";
		else if (months == "04")
			_converted_month = "April";
		else if (months == "05")
			_converted_month = "May";
		else if (months == "06")
			_converted_month = "June";
		else if (months == "07")
			_converted_month = "July";
		else if (months == "08")
			_converted_month = "August";
		else if (months == "09")
			_converted_month = "September";
		else if (months == "10")
			_converted_month = "October";
		else if (months == "11")
			_converted_month = "November";
		else if (months == "12")
			_converted_month = "December";
		return _converted_month;
};

exports.closeAllOpenWindows = function() {
	var winArray = Alloy.Globals.openWindows;
	while (winArray.length) {
		var tempWindow = winArray.pop();
		if(Object.keys(tempWindow) == 'index' ){
			Alloy.Globals.openWindows.push(tempWindow);
			break;
		} else {
			tempWindow[Object.keys(tempWindow)].close();
			tempWindow[Object.keys(tempWindow)] = null;
			
		}
	}
};

exports.closeWindow = function(windowName) {
	var winArray = Alloy.Globals.openWindows.reverse();
	for( i = 0; i < winArray.length; i++ ) {
		var tempWindow = winArray[i];
		if(Object.keys(tempWindow) == windowName ){
			winArray.splice(i, 1);
			tempWindow.close();
			tempWindow = null;
			break;
		}
	}
};

exports.resetCountryCodeInAddress =  function( address ) {
	var idx = address.indexOf("United States of America");
	var location = idx > 0 ? address.substring(0, idx) + " USA" : address ;
	return location;
};
