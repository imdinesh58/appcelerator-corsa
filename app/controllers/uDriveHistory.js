var args = arguments[0] || {};
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var myUtils = require('util');
var collection = Alloy.createCollection("driveshistory");

function load() {
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "              uDrive History";
			}
		}
	}

	service_call();
	$.tableview.hide();
	$.loadmore.hide();
	//}
}

/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
var flag = false;
function LoadMore() {
	flag = true;
	service_call();
}

function hide() {
	if (OS_IOS) {
		$.tableview.height = "88%";
	}
	if (OS_ANDROID) {
		$.tableview.height = "88%";
	}
	$.loadmore.show();
}

var count = 1;
function service_call() {
	try {
		collection.fetch({
			urlparams : {
				page : count++
			},
			success : function(collection, response) {
				//////Ti.API.error("The success page is : ***************  " + JSON.stringify(response));
				////Ti.API.error("The success page is : ***************  " + response.nextPage);
				var data_ = [];
				if (response.hasOwnProperty("message")) {
					if (flag == false) {
						if (response.nextPage == undefined) {
							nodata_();
						} else if (response.nextPage >= 1) {
							$.tableview.show();
							if (OS_IOS) {
								$.tableview.height = "88%";
							}
							if (OS_ANDROID) {
								$.tableview.height = "88%";
							}
							$.loadmore.show();
						}
					} else {
						if (response.nextPage == undefined) {
							$.tableview.show();
							//$.tableview2.hide();
							$.loadmore.hide();
							$.tableview.height = "100%";
						} else if (response.nextPage >= 1) {
							$.tableview.show();
							if (OS_IOS) {
								$.tableview.height = "88%";
							}
							if (OS_ANDROID) {
								$.tableview.height = "88%";
							}
							$.loadmore.show();
						}
					}
				} else {
					if (count == 1) {
						_.each(collection.models, function(element, index, list) {
							data_.push(show_all_messages(element.attributes));
						});
						$.tableview.setData(data_);
						$.tableview.show();
						//$.tableview.height = "100%";
						$.loadmore.hide();
					} else if (count > 1) {
						_.each(collection.models, function(element, index, list) {
							data_.push(show_all_messages(element.attributes));
						});
						$.tableview.appendRow(data_);
						$.tableview.show();
						//$.tableview.height = '100%';
						$.loadmore.hide();
					}
				}
			},
			error : function(err, response) {
				var parseResponse = JSON.parse(response);
				alert("session expired, please log back.");
				if (parseResponse.status == 401) {
					myUtils.closeAllOpenWindows();
					Alloy.createController('signin').getView().open();
				}
			}
		});
	} catch(err) {
	}
}

var nodata = [];
function nodata_() {
	////Ti.API.error("no DATA called");
	$.tableview.show();
	//$.tableview2.show();
	$.loadmore.hide();
	$.tableview.top = "40%";
	var rows = Ti.UI.createTableViewRow({
		height : 70,
		backgroundColor : '#F2EFE8'
	});
	nodata.push(rows);
	var title2 = Ti.UI.createLabel({
		text : 'No uDrive History found',
		top : '5%',
		left : '0%',
		width : '100%',
		textAlign : 'center',
		color : '#001E45',
		font : {
			fontSize : '20sp',
			fontWeight : 'bold'
		}
	});
	rows.add(title2);
	$.tableview.setData(nodata);
	return nodata;
}

/////////////////////////////////////////////////////
// table view contents
//////////////////////////////////////////////////////
function show_all_messages(response) {
	try {
		//Ti.API.info("Started... driveHistory.js.  " + JSON.stringify(response));
		$.tableview.show();
		//$.tableview2.hide();
		$.loadmore.show();

		var height = 0;
		var rows = Ti.UI.createTableViewRow({
			height : 430,
			width : Ti.UI.SIZE,
			backgroundColor : '#F2EFE8'
		});
		
		height = height + 5;
		var line1View = Ti.UI.createView({
			backgroundColor : '#E3DED6', //'#E1DCD7',
			top : height,
			left : '0%',
			width : '100%'
		});
		
		var Rtype = Ti.UI.createLabel({
			text : response.uRideType == "C" ? " Recurring Ride" : " Single Ride",
			top : '3%',
			left : '5%',
			width : response.uRideType == "C" ? '26%' : '20%',
			color : 'white',
			backgroundColor : "#726859",
			borderRadius : 1,
			textAlign : 'left',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		line1View.add(Rtype);
			
		if (response.uRideType == "R") {
			//Ti.API.info("response.uRideType  " + response.uRideType);
			if (response.end_date && response.ride_time != null) {
				//date
				var default_date = response.end_date.substring(0, 10);
				var split = default_date.split('-');
				var MM = myUtils.MONTH(split[1]);
				var converted_Date = MM + ' ' + split[2] + ', ' + split[0];
				//time
				var default_time = myUtils.amPmFormat(response.ride_time);
				var converted_Time = default_time.toString().toLowerCase();
				var unsplit = myUtils.timeFormat(response.ride_time);
				var split = unsplit.split(':');
				var customTime;
				if (split[0].length == 1) {
					customTime = "0" + split[0] + ':' + split[1];
				} else {
					customTime = split[0] + ':' + split[1];
				}
				var dateLabel = Ti.UI.createLabel({
					text : converted_Date + "   " + customTime + converted_Time,
					top : '15%',
					left : '5%',
					width : '80%',
					color : '#726859',
					font : {
						fontSize : '11sp',
						fontWeight : 'bold'
					}
				});
				line1View.add(dateLabel);
			}
		}
		if (response.uRideType == "C") {
			//time
			var default_time = myUtils.amPmFormat(response.ride_time);
			var converted_Time = default_time.toString().toLowerCase();
			var unsplit = myUtils.timeFormat(response.ride_time);
			var split = unsplit.split(':');
			var customTime;
			if (split[0].length == 1) {
				customTime = "0" + split[0] + ':' + split[1];
			} else {
				customTime = split[0] + ':' + split[1];
			}
	
			var timelabel = Ti.UI.createLabel({
				text : response.frequency + " " + customTime + converted_Time,
				top : '15%',
				left : '5%',
				width : '80%',
				color : '#726859',
				font : {
					fontSize : '11sp',
					fontWeight : 'bold'
				}
			});
			line1View.add(timelabel);
		}
		
		var stsLabel = Ti.UI.createLabel({
			text : ' ' + response.ride_status.toString().toUpperCase(),
			top : '3%',
			left : '55%',
			width : response.ride_status.toString().toUpperCase() == "ENDED" ? '16%' : '25%',
			color : 'white',
			backgroundColor : "#726859",
			borderRadius : 1,
			textAlign : 'left',
			font : {
				fontSize : '15sp',
				fontWeight : 'bold'
			}
		});
		line1View.add(stsLabel);
		rows.add(line1View);
		
		height = height + 50;
		var line2View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var from = Ti.UI.createLabel({
			text : "From:",
			top : '1%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		line2View.add(from);
		
		var fromLocation = myUtils.resetCountryCodeInAddress(response.from_location);
		var fromLabel = Ti.UI.createLabel({
			text : fromLocation,
			top : '1%',
			left : '20%',
			width : '95%',
			color : '#726859',
			font : {
				fontSize : '11sp',
				fontWeight : 'bold'
			}
		});
		line2View.add(fromLabel);
		rows.add(line2View);
		
		
		height = fromLocation.length <= 50 ? height + 20 : height + 30;
		var line3View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var to = Ti.UI.createLabel({
			text : "To:",
			top : '1%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		
		var toLocation = myUtils.resetCountryCodeInAddress(response.to_location);
		var toLabel = Ti.UI.createLabel({
			text : toLocation,
			top : '1%',
			left : '20%',
			width : '95%',
			color : '#726859',
			font : {
				fontSize : '11sp',
				fontWeight : 'bold'
			}
		});
		line3View.add(to);
		line3View.add(toLabel);
		rows.add(line3View);
		
		
		height = toLocation.length <= 50 ? height + 20 : height + 30;
		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var rider = Ti.UI.createLabel({
			text : "Rider:",
			top : '1%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		line4View.add(rider);
		
		var rider_name = Ti.UI.createLabel({
			text : response.first_name,
			top : '2%',
			left : '20%',
			width : 'auto',
			height : 'auto',
			color : '#786658',
			font : {
				fontSize : '11sp',
				fontWeight : 'bold'
			}
		});
		line4View.add(rider_name);
		rows.add(line4View);
		
		height = height + 20;
		//comment
		var line6View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var comm = Ti.UI.createLabel({
			text : "Comments:",
			top : '1%',
			left : '5%',
			width : '25%',
			color : '#B6B398',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		var comm2 = Ti.UI.createLabel({
			text : response.Description,
			top : '2%',
			left : '30%',
			width : 'auto',
			height : 'auto',
			color : '#786658',
			font : {
				fontSize : '11sp',
				fontWeight : 'bold'
			}
		});
		line6View.add(comm);
		line6View.add(comm2);
		rows.add(line6View);
	
		height = height + 30;	
		rows.height = height;
		return rows;
	} catch(err) {
		//Ti.API.error(err);
	}
}

/////////////////////////////////
// Android Back button click
////////////////////////////////
function closeWindow() {
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}
