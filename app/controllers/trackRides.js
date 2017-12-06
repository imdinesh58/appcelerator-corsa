var args = arguments[0] || {};
//var win_id = "winTrackRides";
/////////////////////////////
//cleanup textfield values
/////////////////////////////
var myUtils = require('util');
var moment = require('moment-with-locales.min');
var collection = Alloy.createCollection("trackRides");

/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var refreshObject = myUtils.refreshEvent();
refreshObject.on('refreshtrackRide', function(msg) {
	service_call();
});

var count;
function ShowIndicator() {
	count = 0;
	Ti.App.Properties.setString('window', 'trackothersmapview');
	Alloy.Globals.openWindows.push({
		'trackRide' : $.win2
	});
	$.nodata.hide();
	try {
		service_call();
	} catch(err) {
	}
	$.tableview.show();
}

/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
function service_call() {
	try {
		collection.fetch({
			success : function(collection, response) {
				Ti.API.error("response " + JSON.stringify(response));
				Ti.API.error("collection " + JSON.stringify(collection));
				var data = [];
				_.each(collection.models, function(element, index, list) {
					$.nodata.hide();
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
					myUtils.closeAllOpenWindows();
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
function show_all_messages(response) {
	//Ti.API.info("response TRACKKKKK   " + JSON.stringify(response));
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
		var img1 = Ti.UI.createButton({
			objName : 'del',
			right : '10%',
			top : '5%',
			width : 30,
			bottom : '5%',
			height : 30,
			ID__ : response.id,
			isYes : true,
			backgroundImage : '/icons/track_ride.png',
			status : response.ride_status
		});
		if (response.ride_status == "Ended" || response.ride_status == "Started" ) {
			line1View.add(img1);
		}
		if (response.ride_time != null) {
			var Rtype = Ti.UI.createLabel({
				text : response.uRideType == "R" ? " Single Ride" : " Recurring Ride",
				top : '3%',
				left : '5%',
				width : response.uRideType == "R" ? '23%' : '26%',
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
			var localTime = moment.utc(response.end_date).format('YYYY-MM-DD') + "T" + response.ride_time;
			var dsplyTime = moment.utc(response.end_date).format('MMMM Do, YYYY') + "   " + moment(localTime).format('LT');
			var dateLabel = Ti.UI.createLabel({
				text : response.uRideType == "R" ? dsplyTime : response.frequency + " " + customTime + converted_Time,
				top : '10%',
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
		Ti.API.error("Ride ID: " + response.id);
		
		rows.add(line1View);
		
		//From location
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
		
		//To location		
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
		
		//comment
		height = toLocation.length <= 50 ? height + 20 : height + 30;
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
		
		// Drivers
		height = height + 35;
		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var driver = Ti.UI.createLabel({
			text : "Driver:",
			top : '0%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '13sp',
				fontWeight : 'bold'
			}
		});
		line4View.add(driver);
		var drivers = collection.get(response.id).attributes.drivers;
		Ti.API.error("Driver: " + JSON.stringify(drivers));
		var fDriver;
		try {
			for ( i = 0; i < drivers.length; i++) {
				if (drivers[i].Ride_Status == "7") {
					fDrivers = drivers[i].first_name;
				}
			}
			Ti.API.error("fDrivers: " + fDrivers);
			var driver_name = Ti.UI.createLabel({
				text : fDrivers,
				top : '0%',
				left : '20%',
				width : '95%',
				color : '#726859',
				font : {
					fontSize : '11sp',
					fontWeight : 'bold'
				}
			});
			line4View.add(driver_name);
		} catch(err) {
		}
		rows.add(line4View);
		
		//Responses
		height = height + 35;
		var line5View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		
		var statusLabel = Ti.UI.createLabel({
			text : response.ride_status.toString().toUpperCase(),
			top : '0%',
			left : '20%',
			width : '45%',
			color : '#B7ACA0',
			font : {
				fontSize : '20sp',
				fontWeight : 'bold'
			},
			textAlign : 'center'
		});
		line5View.add(statusLabel);
		rows.add(line5View);
		
		// Status
		height = height + 50;
		if (response.uRideType == "C") {
			Ti.API.info("(response.frequencies  " + JSON.stringify(response.frequencies));
			if (response.frequencies) {
				var img = Ti.UI.createImageView({
					objName : 'exp',
					right : '5%',
					top : '0%',
					width : 30,
					height : 45,
					click : 'no',
					ID__ : response.id,
					Rider_ID : response.rider,
					TYPE : response.uRideType
				});
				if (OS_IOS) {
					img.image = "/common/section.png";
				}
				if (OS_ANDROID) {
					img.image = "/common/section.png";
				}
				line5View.add(img);
			}
		}
		rows.add(line5View);
		height = height + 60;
		rows.height = height;
		
		
		///row click
		rows.addEventListener('click', function(e) {
			Ti.API.error("Event Details: " + JSON.stringify(e));
			Ti.API.error("Selected Row: " + JSON.stringify(e.row));
			Ti.API.error("Selected Row Children: " + JSON.stringify(e.row.children));
			Ti.API.error("Selected Row Children[0]: " + JSON.stringify(e.row.children[0]));
			if (e.source.isYes == true) {
				e.source.setEnabled(false);
				Alloy.createController('trackothersmapview', {
					_Track_ID_ : e.source.ID__,
					status : e.source.status
				}).getView().open();
				setTimeout(function() {
					e.source.setEnabled(true);
				}, 3000);
			} else if (e.source.objName == 'exp') {
				if (e.source.click == 'no') {
					e.source.click = 'yes';
					var frequencies = collection.get(e.source.ID__).attributes.frequencies;
					var ride_id = e.source.ID__;
					var rider_id = e.source.Rider_ID;
					var TYPE = e.source.TYPE;
					length = e.index;
					if (OS_IOS) {
						e.source.image = "/common/section2.png";
					}
					if (OS_ANDROID) {
						e.source.image = "/common/section2.png";
					}
					for ( i = 0; i < frequencies.length; i++) {
						// reset color
						$.tableview.insertRowAfter(length, populateData(frequencies[i], ride_id, rider_id, TYPE));
						line1View.backgroundColor = "#F1EEE7";
						line2View.backgroundColor = "#F1EEE7";
						line3View.backgroundColor = "#F1EEE7";
						line4View.backgroundColor = "#F1EEE7";
						line5View.backgroundColor = "#F1EEE7";
						length = length + 1;
					}
				} else {
					if (e.source.click == 'yes') {
						e.source.click = 'no';
						var frequencies = collection.get(e.source.ID__).attributes.frequencies;
						if (OS_IOS) {
							e.source.image = "/common/section.png";
						}
						if (OS_ANDROID) {
							e.source.image = "/common/section.png";
						}
						length = frequencies.length;
						for ( i = 0; i < frequencies.length; i++) {
							//add color
							$.tableview.deleteRow(e.index + 1);
							line1View.backgroundColor = "#E3DED6";
							line2View.backgroundColor = "#E3DED6";
							line3View.backgroundColor = "#E3DED6";
							line4View.backgroundColor = "#E3DED6";
							line5View.backgroundColor = "#E3DED6";
						}
					}
				}
			}
		});
		return rows;
	} catch(err) {
		alert(err);
	}
}

function populateData(frequencies, ride_id, rider_id, TYPE) {
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 80,
		backgroundColor : '#F1EEE7',
		selectedColor : 'white'
	});
	var line2View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height,
		left : '0%',
		width : '100%'
	});

	var _date_ = moment();
	var currentDate = moment(_date_).format('YYYY-MM-DD');
	var availableFreq = moment.utc(frequencies.date).format('YYYY-MM-DD');
	
	var track = Ti.UI.createLabel({
		top : '15%',
		backgroundImage : '/icons/track_ride.png',
		right : '20%',
		width : 35,
		height : 35,
		isYes : true,
		fId : frequencies.id,
		Cid : frequencies.carpool_id,
		ride_status : frequencies.ride_status
	});

	if (moment(availableFreq).isSameOrBefore(currentDate) == true || currentDate == availableFreq) {
		// date is past
		line2View.add(track);
	}

	var dateLabel = Ti.UI.createLabel({
		text : moment.utc(frequencies.date).format('MMM Do'),
		top : '30%',
		left : '40%',
		width : '20%',
		color : '#726859',
		font : {
			fontSize : '11sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(dateLabel);

	rows.add(line2View);
	height = height + 50;
	rows.height = height;

	rows.addEventListener('click', function(e) {
		if (e.source.isYes == true) {
			e.source.setEnabled(false);
			Alloy.createController('trackothersmapview', {
				_Fre_ID_ : e.row.children[0].children[0].fId,
				_Track_ID_ : e.row.children[0].children[0].Cid,
				status : e.row.children[0].children[0].ride_status
			}).getView().open();
			setTimeout(function() {
				e.source.setEnabled(true);
			}, 3000);
		}
	});

	return rows;
}

function closeWindow() {
	try {
		refreshObject.off('refreshtrackRide');
		Alloy.Globals.openWindows.pop();
		$.win2.close();
		$.win2 = null;
	} catch(err) {
	}
}

$.win2.open();
