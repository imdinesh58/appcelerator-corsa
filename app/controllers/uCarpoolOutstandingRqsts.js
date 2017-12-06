var args = arguments[0] || {};
/////////////////////////////
//cleanup textfield values
/////////////////////////////
var cleanups = require('cleanup');
var myUtils = require('util');
var uRides = require('RideConfirm');
var uCarpool = require('uCarpoolConfirm');
var moment = require('moment-with-locales.min');
var uDrives = require('RideConfirm');
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var collection = Alloy.createCollection("uCarpool_Request");
var refreshObject = myUtils.refreshEvent();
function load() {
	//Ti.API.info("uCarpoolOutstandingRequest Tab .... load().");
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Recurring Ride";
			}
		}
	}
	$.nodata.hide();
	service_call();
	//}
}

/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
function service_call() {
	collection.fetch({
		success : function(collection, response) {
			var data = [];
			_.each(collection.models, function(element, index, list) {
				$.nodata.hide();
				//Ti.API.error("element CARPOOL ******  " + JSON.stringify(element));
				data.push(show_all_messages(element.attributes));
				//data.push(show_all_messages(element.attributes.carPools[0], element.attributes.carPools[0].drivers));
			});
			$.tableview.setData(data);
			////Ti.API.info("data length " +  data.length);
			if (data.length == 0) {
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
};

refreshObject.on('RefreshCarpool', function(msg) {
	service_call();
});

/////////////////////////////////////////////////////
// table view contents
/////////////////////////////////////////////////////
var RESPONSE;
function show_all_messages(response , multiDrivers) {
	//Ti.API.info("outstanding req  " + JSON.stringify(response));
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
		
		var img1 = Ti.UI.createButton({
			objName : 'del',
			right : '10%',
			top : '5%',
			width : 30,
			bottom : '5%',
			height : 30,
			ID__ : response.id,
			backgroundImage : OS_IOS ? "/converted/trash.png" : "/images/trash.png",
		});

		if (response.ride_status == "Requested") {
			line1View.add(img1);
		} else if (response.ride_status == "Confirmed") {
			line1View.add(img1);
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
			img1.visible = true;
			statusLabel.color = '#726859';
		}
		
		
		rows.addEventListener('click', function(e) {
			if (e.source.objName == 'exp') {
				if (e.source.click == 'no') {
					e.source.click = 'yes';
					var drivers = collection.get(e.source.ID__).attributes.drivers;
					//Ti.API.info("Drivv  " + JSON.stringify(drivers));
					var ride_id = collection.get(e.source.ID__).attributes.id;
					var rider_id = e.source.Rider_ID;
					//Ti.API.info("**** " + JSON.stringify(drivers) + "  &&&  " + ride_id);
					length = e.index;
					if (OS_IOS) {
						e.source.image = "/common/section2.png";
					}
					if (OS_ANDROID) {
						e.source.image = "/common/section2.png";
					}
					for ( i = 0; i < drivers.length; i++) {
						// reset color
						//Ti.API.info("drivers[i]  " + JSON.stringify(drivers[i]));
						$.tableview.insertRowAfter(length, populateData(drivers[i], ride_id, rider_id));
						//$.tableview.height = '100%';
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
						var drivers = collection.get(e.source.ID__).attributes.drivers;
						//e.source.image = '/common/section.png';
						if (OS_IOS) {
							e.source.image = "/common/section.png";
						}
						if (OS_ANDROID) {
							e.source.image = "/common/section.png";
						}
						length = drivers.length;
						for ( i = 0; i < drivers.length; i++) {
							//add color
							$.tableview.deleteRow(e.index + 1);
							//$.tableview.height = '100%'; //80
							line1View.backgroundColor = "#E3DED6";
							line2View.backgroundColor = "#E3DED6";
							line3View.backgroundColor = "#E3DED6";
							line4View.backgroundColor = "#E3DED6";
							line5View.backgroundColor = "#E3DED6";
						}
					}
				}
			} else if (e.source.objName == 'del') {
				//pass ride id
				uRides.Cancel(e.source.ID__);
				//hide the cancel button
				//e.row.children[0].children[0].hide();
				$.tableview.deleteRow(e.row);
				//load();
			} else if (e.source.objName == 'Fexp') {
				if (e.source.click == 'no') {
					e.source.click = 'yes';
					e.source.image = "/common/F2.png";
					var frequencies = collection.get(e.source.ID__).attributes.frequencies;
					var ride_id = e.source.ID__;
					var rider_id = e.source.Rider_ID;
					length = e.index;

					for ( i = 0; i < frequencies.length; i++) {
						// reset color
						$.tableview.insertRowAfter(length, populateData2(frequencies[i], ride_id, rider_id));
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
						e.source.image = "/common/F1.png";
						var frequencies = collection.get(e.source.ID__).attributes.frequencies;
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
	}
}

function showFulltable() {
	$.tableview.height = "100%";
}

////////////////////////////////////////////
/////////// Drivers Lists
////////////////////////////////////////////
function populateData(driver, ride_id, rider_id) {
	//Ti.API.info("^^^^   " + driver.ride_status);
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 80,
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
	var RESPONSE = default_response.toString().toUpperCase();
	var Status = Ti.UI.createLabel({
		text : RESPONSE,
		right : '20%',
		height : 'auto',
		top : '5%',
		width : '40%',
		textAlign : 'center',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		}
	});
	var confirm = Ti.UI.createLabel({
		isYes : true,
		driverId : driver.Driver_id,
		ID__ : ride_id,
		top : '0%',
		right : '5%',
		width : 25,
		height : 25,
		backgroundImage : '/images/confirm.png'
	});
	line3View.add(statusLabel);
	line3View.add(Status);
	line3View.add(confirm);
	rows.add(line3View);
	height = height + 50;

	var line6View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height,
		left : '0%',
		width : '100%'
	});

	var chat = Ti.UI.createButton({
		objName : 'startChat',
		top : '5%',
		width : 50,
		height : 50,
		left : "43%",
		driverId : driver.Driver_id,
		ID__ : ride_id,
		backgroundImage : '/common/chat.png',
		name : driver.first_name
	});
	line6View.add(chat);
	height = height + 50;
	rows.add(line6View);

	var line5View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height,
		left : '0%',
		width : '100%'
	});
	var _chat_ = Ti.UI.createLabel({
		//objName : 'startChat',
		text : "Chat",
		left : '0%',
		height : 'auto',
		width : "100%",
		textAlign : 'center',
		driverId : driver.Driver_id,
		ID__ : ride_id,
		RiderID : rider_id,
		top : '1%',
		color : '#786658',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		},
		name : driver.first_name
	});
	line5View.add(_chat_);

	//2
	rows.add(line5View);
	height = height + 50;

	rows.height = height;

	rows.addEventListener('click', function(e) {
		if (e.source.isYes) {
			//service call
			uRides.Confirm(e.source.ID__, e.source.driverId);
			///change status to confirmed
			e.row.children[0].children[1].text = 'CONFIRMED';
			e.row.children[0].children[1].borderColor = '#786658';
			e.row.children[0].children[1].color = 'white';
			e.row.children[0].children[1].borderRadius = 6;
			//hide the cancel button
			e.row.children[0].children[2].hide();
		} else if (e.source.objName == "startChat") {
			Ti.App.Properties.setBool('RiderTrue', true);
			Ti.App.Properties.setString('imRider', 'fromuride');
			e.source.setEnabled(false);
			Alloy.createController('chat', {
				"RideId" : e.source.ID__,
				"Rider_Id" : e.row.children[2].children[0].RiderID,
				"DriverId" : e.source.driverId,
				"SenderId" : e.row.children[2].children[0].RiderID
			}).getView().open();
			setTimeout(function() {
				e.source.setEnabled(true);
			}, 3000);
		}
	});
	if (driver.ride_status == "Requested") {
		confirm.visible = false;
		Status.backgroundColor = '#E3DED6';
		Status.color = '#B7ACA0';
		Status.borderRadius = 6;
	} else if (driver.ride_status == "Rejected") {
		confirm.visible = false;
		Status.backgroundColor = '#E3DED6';
		Status.color = '#B7ACA0';
		Status.borderRadius = 6;
	} else if (driver.ride_status == "Accepted") {
		confirm.visible = true;
		Status.backgroundColor = '#786658';
		Status.color = 'white';
		Status.borderRadius = 6;
	} else if (driver.ride_status == "Confirmed") {
		confirm.visible = false;
		Status.backgroundColor = '#786658';
		Status.color = 'white';
		Status.borderRadius = 6;
	} else {
		confirm.visible = false;
		Status.backgroundColor = '#786658';
		Status.color = 'white';
		Status.borderRadius = 6;
	}
	return rows;
}

function populateData2(frequencies, ride_id, rider_id) {
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 70,
		backgroundColor : '#F1EEE7',
		selectedColor : 'white'
	});
	var line2View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height,
		left : '0%',
		width : '100%'
	});

	var default_response = frequencies.ride_status;
	var RESPONS = default_response.toString().toUpperCase();
	var stats = Ti.UI.createLabel({
		text : RESPONS,
		top : '30%',
		left : '45%',
		width : '25%',
		color : '#726859',
		font : {
			fontSize : '11sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(stats);

	var dateLabel = Ti.UI.createLabel({
		text : moment.utc(frequencies.date).format('MMM Do'),
		top : '30%',
		left : '20%',
		width : '20%',
		color : '#726859',
		font : {
			fontSize : '11sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(dateLabel);

	var trash = Ti.UI.createImageView({
		image : '/images/trash.png',
		top : '15%',
		right : '10%',
		width : 30,
		height : 30,
		obj : "No",
		fId : frequencies.id,
		fCId : frequencies.carpool_id
	});
	if (OS_IOS) {
		trash.image = "/converted/trash.png";
	}
	if (OS_ANDROID) {
		trash.image = "/images/trash.png";
	}
	line2View.add(trash);

	rows.add(line2View);
	height = height + 50;
	rows.height = height;
	
	if (frequencies.ride_status == "Requested" || frequencies.ride_status == "REQUESTED") {
		trash.visible = true;
	} else if (frequencies.ride_status == "Cancelled" || frequencies.ride_status == "Ended") {
		trash.visible = false;
	} else if (frequencies.ride_status == "Confirmed" || frequencies.ride_status == "CONFIRMED") {
		trash.visible = true;
	} else if (frequencies.ride_status == "ACCEPTED" || frequencies.ride_status == "Accepted") {
		trash.visible = true;
	} else if (frequencies.ride_status == "Started") {
		trash.visible = false;
	}

	rows.addEventListener('click', function(e) {
		if (e.source.obj == "No") {
			uDrives.FrequencyReject(e.source.fId, e.source.fCId);
			//e.row.children[0].children[2].hide();
			$.tableview.deleteRow(e.row);
		} 
	});

	return rows;
}

refreshObject.on('RefreshCarpool', function(msg) {
	service_call();
});

function closeWindow() {
	try {
		//Ti.API.info("closeWindow event called in uCarpoolOutstandingRequest Tab.");
		refreshObject.off('RefreshCarpool');
		if (OS_IOS) {
			var tabWindow = Alloy.Globals.openWindows.pop();
			tabWindow[Object.keys(tabWindow)].close();
			tabWindow[Object.keys(tabWindow)] = null;
			tabWindow = null;
		}
	} catch(err) {
	}
}
