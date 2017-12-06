var args = arguments[0] || {};
/////////////////////////////
//cleanup textfield values
/////////////////////////////
var myUtils = require('util');
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var collection = Alloy.createCollection("carpoolhistory");

function load() {
	var Network = require('networkCheck');

	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.logo = "/logo.png";
				actionBar.icon = "/menu1.png";
				actionBar.title = "        Carpool History";
				actionBar.setDisplayHomeAsUp(false);
				actionBar.setDisplayShowHomeEnabled(true);
				actionBar.displayHomeAsUp = false;
				actionBar.homeButtonEnabled = true;
			}
		}
	}
	setTimeout(service_call, 2000);
	$.tableview.hide();
	$.loadmore.hide();
}

/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
var flag = false;
function LoadMore() {
	flag = true;
	service_call();
}

function showLoadMore() {
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
				var data_ = [];
				////Ti.API.info('response ' + JSON.stringify(response));
				if (response.hasOwnProperty("message")) {
					if (flag == false) {
						if (response.nextPage == undefined || response.nextPage == 0) {
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
						if (response.nextPage == undefined || response.nextPage == 0) {
							$.tableview.show();
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
							data_.push(show_all_messages(element.attributes ));
						});
						$.tableview.setData(data_);
						$.tableview.show();
						$.tableview.height = "100%";
						$.loadmore.hide();
					} else if (count > 1) {
						_.each(collection.models, function(element, index, list) {
							data_.push(show_all_messages(element.attributes));
						});
						$.tableview.appendRow(data_);
						$.tableview.show();
						$.tableview.height = '100%';
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
	//$.tableview.hide();
	$.tableview.show();
	$.loadmore.hide();
	$.tableview.top = "40%";
	var rows = Ti.UI.createTableViewRow({
		height : 70,
		backgroundColor : '#F2EFE8'
	});
	nodata.push(rows);
	var title2 = Ti.UI.createLabel({
		text : 'No uCarpool History found',
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
var RESPONSE;
function show_all_messages(response) {
	Ti.API.info("HIS " + JSON.stringify(response));
	try {
		var height = 0;
		var rows = Ti.UI.createTableViewRow({
			height : 430,
			width : Ti.UI.SIZE,
			backgroundColor : '#F2EFE8',
			isNo : true
		});
		
		height = height + 5;
		var line1View = Ti.UI.createView({
			backgroundColor : '#E3DED6', //'#E1DCD7',
			top : height,
			left : '0%',
			width : '100%'
		});
		
		if (response.ride_time != null) {
			
			var Rtype = Ti.UI.createLabel({
				text : " Recurring Ride",
				top : '3%',
				left : '5%',
				width : '26%',
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
			line1View.add(dateLabel);
		}
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
		//comment
		var line5View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var comm = Ti.UI.createLabel({
			text : "Comments:",
			top : '5%',
			left : '5%',
			width : '23%',
			color : '#B6B398',
			font : {
				fontSize : '14sp'
			}
		});
		var comm2 = Ti.UI.createLabel({
			text : response.Description,
			top : '5%',
			left : '28%',
			width : 'auto',
			color : '#001E45', //001E45
			font : {
				fontSize : '12sp'
			}
		});
		line5View.add(comm);
		line5View.add(comm2);
		rows.add(line5View);
		
		height = height + 30;
		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var drivers = response.drivers;
		if (drivers.length) {
			RESPONSE = "RESPONSES";
		}
		var statusLabel = Ti.UI.createLabel({
			text : RESPONSE,
			top : '6%',
			right : '35%',
			width : '45%',
			font : {
				fontSize : '17sp',
				fontWeight : 'bold'
			},
			textAlign : 'center'
		});
		line4View.add(statusLabel);
		var img = Ti.UI.createImageView({
			objName : 'exp',
			right : '25%',
			top : '0%',
			width : 45,
			height : 60,
			click : 'no',
			ID__ : response.id,
			Rider_ID : response.rider,
			DDD : multiDrivers
		});
		
		if (OS_IOS) {
			img.image = "/common/section.png";
		}
		if (OS_ANDROID) {
			img.image = "/common/section.png";
		}
		line4View.add(img);
		
		var img2 = Ti.UI.createImageView({
			objName : 'Fexp',
			right : '5%',
			top : '0%',
			width : 50,
			height : 60,
			click : 'no',
			ID__ : response.id,
			image : "/common/F1.png",
			Rider_ID : response.rider
		});
		var frequencie = response.frequencies;
		if (frequencie.length) {
		  line4View.add(img2);	
		}
		rows.add(line4View);
		height = height + 70;
		rows.height = height;

		if (RESPONSE == "RESPONSES") {
			statusLabel.color = '#726859';
		}
		
		rows.addEventListener('click', function(e) {
			if (e.source.objName == 'exp') {
				if (e.source.click == 'no') {
					e.source.click = 'yes';
					try {
						var drivers = collection.get(e.source.ID__).attributes.drivers;
						length = e.index;
					} catch(err) {
					}

					if (OS_IOS) {
						e.source.image = "/common/section2.png";
					}
					if (OS_ANDROID) {
						e.source.image = "/common/section2.png";
					}
					try {
						for ( i = 0; i < drivers.length; i++) {
							// reset color
							$.tableview.insertRowAfter(length, populateData(drivers[i]));
							line1View.backgroundColor = "#F1EEE7";
							line2View.backgroundColor = "#F1EEE7";
							line3View.backgroundColor = "#F1EEE7";
							line4View.backgroundColor = "#F1EEE7";
							line5View.backgroundColor = "#F1EEE7";
							$.tableview.height = '100%';
							length = length + 1;
						}
					} catch(err) {
						//Ti.API.info(err);
					}
				} else {
					if (e.source.click == 'yes') {
						e.source.click = 'no';
						try {
							var drivers = collection.get(e.source.ID__).attributes.drivers;
							length = drivers.length;
						} catch(err) {
						}
						if (OS_IOS) {
							e.source.image = "/common/section.png";
						}
						if (OS_ANDROID) {
							e.source.image = "/common/section.png";
						}

						try {
							for ( i = 0; i < drivers.length; i++) {
								//set color
								$.tableview.deleteRow(e.index + 1);
								$.tableview.height = '80%';
								$.tableview.height = "100%";
								line1View.backgroundColor = "#E3DED6";
								line2View.backgroundColor = "#E3DED6";
								line3View.backgroundColor = "#E3DED6";
								line4View.backgroundColor = "#E3DED6";
								line5View.backgroundColor = "#E3DED6";
							}
						} catch(err) {
							//Ti.API.info(err);
						}
					}
				}
			}
		}); 
		return rows;
	} catch(err) {
		Ti.API.info("H E " +err);
	}
}

///////////////////////////////////
//////drivers Lists///////////////
//////////////////////////////////
function populateData(driver) {
	//Alloy.Globals.display_on_screen("Started... rideHistory.js....populateData()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 40,
		backgroundColor : '#F1EEE7'
	});
	var line3View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height + 5,
		left : '0%',
		height : 'auto'
	});
	var statusLabel = Ti.UI.createLabel({
		text : driver.first_name,
		left : '5%',
		height : 'auto',
		top : '5%',
		color : '#786658',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		}
	});

	var default_response = driver.ride_status;
	var RESPONS = default_response.toString().toUpperCase();
	//Ti.API.info(RESPONS);
	var Status = Ti.UI.createLabel({
		text : RESPONS,
		right : '10%',
		height : 'auto',
		top : '5%',
		width : '45%',
		textAlign : 'center',
		backgroundColor : '#786658',
		color : "white",
		borderRadius : 6,
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		}
	});
	line3View.add(statusLabel);
	line3View.add(Status);
	rows.add(line3View);
	return rows;
}

function closeWindow() {
	//Ti.API.info("closeWindow event called in uRideHistory Tab.");
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}

