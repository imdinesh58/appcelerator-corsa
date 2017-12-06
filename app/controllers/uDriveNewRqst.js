var args = arguments[0] || {};

var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
function load() {
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "uDrive";
			}
		}
	}
	$.nodata.hide();
	service_call();
}

refreshObject.on('refresh-Listdata', function(msg) {
	load();
});

var searchBar = Titanium.UI.createSearchBar({
	top : 0,
	height : 50,
	showCancel : true,
	hintText : "Search by day",
	color : '#001E45',
	backgroundColor : '#FFFFFF',
	borderColor : '#001E45',
	borderWidth : 5,
	borderRadius : 0,
	keyboardType : Titanium.UI.KEYBOARD_DECIMAL_PAD,
	returnKeyType : Titanium.UI.RETURNKEY_DONE
});

searchBar.addEventListener('change', function() {
});

//when the return key is hit, remove focus from //our searchBar
searchBar.addEventListener('return', function() {
	searchBar.blur();
});
//from our searchBar
searchBar.addEventListener('cancel', function() {
	searchBar.blur();
});

$.tableview.search = searchBar;
$.tableview.filterAttribute = 'filter';

var collection = Alloy.createCollection("listdriveSchedules");
var uDrives = require('RideRequest');
var timeUtil = require('util');

var currentTime = new Date();
var month = currentTime.getMonth() + 1;
var day = currentTime.getDate();
var year = currentTime.getFullYear();
var DD___;
var MM___;
if (day >= 1 && day <= 9) {
	DD___ = "0" + day;
} else {
	DD___ = day;
}
//month
if (month >= 1 && month <= 9) {
	MM___ = "0" + month;
} else {
	MM___ = month;
}

var customDate = year + '-' + MM___ + '-' + DD___;
/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
function service_call() {
	try {
		collection.fetch({
			success : function(collection, response) {
				var data = [];
				_.each(collection.models, function(element, index, list) {
					data.push(show_all_messages(element.attributes));
				});
				$.tableview.setData(data);
				if (!data.length) {
					$.nodata.show();
				}
			},
			error : function(err, response) {
				var parseResponse = JSON.parse(response);
				alert("session expired, please log back.");
				if (parseResponse.status == 401) {
					timeUtil.closeAllOpenWindows();
					Alloy.createController('signin').getView().open();
				}
			}
		});
	} catch(err) {
	}
}

/////////////////////////////////////////////////////
// table view contents
//////////////////////////////////////////////////////
var DD;
var dateLabel;
var converted_Date;
var converted_Date_;
function show_all_messages(response) {
	try {
		Ti.API.info('drive new req response ' + JSON.stringify(response));
		if (response.drive_date != null && response.start_time != null && response.end_time != null) {
			//date
			var default_date = response.drive_date.substring(0, 10);
			var split = default_date.split('-');
			var MM = timeUtil.MONTH(split[1]);
			converted_Date = MM + ' ' + split[2] + ', ' + split[0];
			DD = split[2];
			//
			converted_Date_ = split[0] + '-' + split[1] + '-' + split[2];
			//time
			//
			var unsplit = timeUtil.timeFormat(response.start_time);
			var split = unsplit.split(':');
			var customTime;
			if (split[0].length == 1) {
				customTime = "0" + split[0] + ':' + split[1];
			} else {
				customTime = split[0] + ':' + split[1];
			}

			var unsplit2 = timeUtil.timeFormat(response.end_time);
			var split2 = unsplit2.split(':');
			var customTime2;
			if (split2[0].length == 1) {
				customTime2 = "0" + split2[0] + ':' + split2[1];
			} else {
				customTime2 = split2[0] + ':' + split2[1];
			}

			var startTime = customTime + ' ' + timeUtil.amPmFormat(response.start_time);
			var endTime = customTime2 + ' ' + timeUtil.amPmFormat(response.end_time);
		}

		var height = 0;
		var rows = Ti.UI.createTableViewRow({
			filter : DD,
			height : 380,
			width : Ti.UI.SIZE,
			backgroundColor : '#F2EFE8'
		});
		height = height + 5;
		var line1View = Ti.UI.createView({
			backgroundColor : '#E3DED6', //'#E1DCD7',
			top : height,
			left : '0%',
			width : '100%',
			ID : response.id,
			obj : "del"
		});

		var cancelLabel = Ti.UI.createLabel({
			backgroundImage : '/images/trash.png',
			top : '5%',
			right : '5%',
			width : 30,
			height : 30,
			ID : response.id,
			obj : "del"
		});
		if (OS_IOS) {
			cancelLabel.backgroundImage = "/converted/trash.png";
		}
		if (OS_ANDROID) {
			cancelLabel.backgroundImage = "/images/trash.png";
		}
		line1View.add(cancelLabel);
		if (converted_Date_ != customDate) {
			dateLabel = Ti.UI.createLabel({
				text : converted_Date,
				top : '10%',
				left : '20%',
				width : '80%',
				color : '#726859',
				font : {
					fontSize : '17sp',
					fontWeight : 'bold'
				},
			ID : response.id,
			obj : "del"
			});
		} else {
			dateLabel = Ti.UI.createLabel({
				text : 'Today',
				top : '10%',
				left : '20%',
				width : '80%',
				color : '#726859',
				font : {
					fontSize : '17sp',
					fontWeight : 'bold'
				},
			ID : response.id,
			obj : "del"
			});
		}
		line1View.add(dateLabel);
		rows.add(line1View);
		height = height + 50;
		//25
		var line2View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%',
			ID : response.id,
			obj : "del"
		});
		rows.add(line2View);
		var from = Ti.UI.createLabel({
			text : "Start Time:",
			top : '0%',
			left : '20%',
			width : '30%',
			color : '#B6B398',
			font : {
				fontSize : '15sp'
			},
			ID : response.id,
			obj : "del"
		});
		line2View.add(from);
		var fromLabel = Ti.UI.createLabel({
			text : startTime,
			top : '2%',
			left : '50%',
			width : 'auto',
			color : '#726859',
			font : {
				fontSize : '14sp',
			},
			ID : response.id,
			obj : "del"
		});
		line2View.add(fromLabel);
		height = height + 35;
		var line3View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%',
			ID : response.id,
			obj : "del"
		});
		var to = Ti.UI.createLabel({
			text : "End Time:",
			top : '0%',
			left : '20%',
			width : '30%',
			color : '#B6B398',
			font : {
				fontSize : '15sp',
			},
			ID : response.id,
			obj : "del"
		});
		var toLabel = Ti.UI.createLabel({
			text : endTime,
			top : '2%',
			left : '50%',
			width : 'auto',
			color : '#726859',
			font : {
				fontSize : '14sp'
			},
			ID : response.id,
			obj : "del"
		});
		line3View.add(to);
		line3View.add(toLabel);
		rows.add(line3View);
		height = height + 35;

		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%',
			ID : response.id,
			obj : "del"
		});
		var desc = Ti.UI.createLabel({
			text : "Title:",
			top : '0%',
			left : '20%',
			width : '30%',
			color : '#B6B398',
			font : {
				fontSize : '15sp',
			},
			ID : response.id,
			obj : "del"
		});
		//line4View.add(desc);
		var desc_ = Ti.UI.createLabel({
			text : response.description,
			top : '0%',
			left : '50%',
			width : '45%',
			color : '#001E45',
			font : {
				fontSize : '15sp',
			},
			ID : response.id,
			obj : "del"
		});
		//line4View.add(desc_);
		rows.add(line4View);

		height = height + 35;
		rows.height = height;

		rows.addEventListener('click', function(e) {
			//alert(e.source.obj);
			if (e.source.obj == "del") {
				delete_S(e.source.ID);
				$.tableview.deleteRow(e.row);
			}
		});

		return rows;
	} catch(err) {
		Ti.API.info(err);
	}
}

function delete_S(ID) {
	//alert(ID);
	var gModel = collection.get(ID);
	gModel.destroy({
		success : function(collection, response) {
			Ti.API.info(">> " +JSON.stringify(response));
			service_call();
		},
		error : function(err,response) {
			Ti.API.info(">> " +JSON.stringify(response));
		}
	});
}

function addScheduleEvent() {
	Alloy.createController('uDriveSignup1').getView().open();
}

function closeWindow() {
	refreshObject.off('refresh-Listdata');
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}
