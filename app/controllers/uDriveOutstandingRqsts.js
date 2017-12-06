var args = arguments[0] || {};
var service;
//var timer;
var moment = require('moment-with-locales.min');
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var geo = require('geo');
var MID = Alloy.Models.instance('managedID');

var collection = Alloy.createCollection("uDrive");
var uDrives = require('RideRequest');
var myUtils = require('util');
var refreshObject = myUtils.refreshEvent();
var count;

Ti.API.error("Opening uDriveOutstandingRequests Tab.");

function load() {
	count = 0;
	//Ti.App.Properties.setString('window', 'uDriveOutReq');
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "uDrive";
				actionBar.subtitle = "Outstanding Requests";
			}
		}
	}
	$.nodata.hide();
	service_call();
	$.activityIndicator.show();
}

/////////////////////////////////////////////////////
/////////// service call - all ride requests\\\\\\\\\\\\
/////////////////////////////////////////////////////
function service_call() {
	Ti.API.error("At service_call ...");
	try {
		collection.fetch({
			success : function(collection, response) {
				Ti.API.error("Fetch Successful - Response : " + JSON.stringify(response));
				var data = [];
				_.each(collection.models, function(element, index, list) {
					data.push(show_all_messages(element.attributes));
				});
				$.tableview.setData(data);
				if (data.length == 0) {
					$.nodata.show();
				}
				$.activityIndicator.hide();
			},
			error : function(err, response) {
				var parseResponse = JSON.parse(response);
				//alert("session expired, please log back.");
				if (parseResponse.status == 401) {
					myUtils.closeAllOpenWindows();
					Alloy.createController('signin').getView().open();
				}
			}
		});
	} catch(err) {
	}
};

/////////////////////////////////////////////////////
// table view contents
//////////////////////////////////////////////////////
var start;
var stop;
var statusLabel;
function show_all_messages(response) {
	Ti.API.error("At uDriveOutstandingRqsts - show_al_messages for Response : " + JSON.stringify(response));
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
		width : '25%',
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

	var cancelLabel = Ti.UI.createLabel({
		id : "DeleteIcon",
		objName : "DeleteLbl",
		backgroundImage : OS_ANDROID ? '/images/trash.png' : "/converted/trash.png",
		top : '2%',
		right : '5%',
		width : 30,
		height : 30,
		isNo : true,
		rider_Type : response.uRideType,
		rideIdno : response.id
	});
	line1View.add(cancelLabel);
	rows.add(line1View);

	height = height + 50;
	Ti.API.error("From Height: " + height);
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

	height = toLocation <= 50 ? height + 20 : height + 30;
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

	// rider info
	height = height + 30;
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

	var chat__ = Ti.UI.createButton({
		id : "ChatIcon",
		objName : "startCHAT",
		Name : response.first_name,
		top : '0%',
		right : '20%',
		width : 30,
		height : 30,
		ID__ : response.id,
		backgroundImage : '/common/chat.png',
		RIDER_ID : response.rider,
		DRIVER_ID : response.Driver_id
	});
	line4View.add(chat__);

	var acceptLabel = Ti.UI.createLabel({
		id : "AcceptIcon",
		objName : "AcceptLbl",
		isYes : true,
		rideIdyes : response.id,
		top : '0%',
		right : '5%',
		width : 30,
		height : 30,
		rider_Type : response.uRideType,
		backgroundImage : '/images/confirm.png'
	});
	line4View.add(acceptLabel);
	rows.add(line4View);

	// action info
	height = height + 40;
	var line5View = Ti.UI.createView({
		backgroundColor : '#E3DED6',
		top : height,
		left : '0%',
		width : '100%'
	});

	start = Ti.UI.createLabel({
		id : "DriveStartIcon",
		objName : "DriveStartLbl",
		obj : "STRT",
		ID__ : response.id,
		top : '5%',
		left : '25%',
		width : 50,
		height : 60,
		backgroundImage : "/common/st.png"
	});

	stop = Ti.UI.createLabel({
		id : "DriveStopIcon",
		objName : "DriveStopLbl",
		obej : "STOP",
		ID__ : response.id,
		top : '5%',
		left : '5%',
		width : 50,
		height : 60,
		backgroundImage : "/common/sp.png"
	});

	if (response.uRideType == "R") {
		var currentDate = moment().format('YYYY-MM-DD');
		var rideDate = moment.utc(response.end_date).format('YYYY-MM-DD');
		if (currentDate == rideDate) {
			line5View.add(start);
			line5View.add(stop);
		}
	}

	if (response.uRideType == "C") {
		////alert("came on uRideType  " + response.uRideType);
		if (response.frequencies) {
			var img = Ti.UI.createImageView({
				id : "ExpandCPIcon",
				objName : 'exp',
				top : '5%',
				right : '5%',
				width : 45,
				height : 55,
				click : 'no',
				image : "/common/F1.png",
				ID__ : response.id,
				Rider_ID : response.rider,
				frequency : response.frequency,
				TYPE : response.uRideType
			});
			line5View.add(img);
		}
	}
	rows.add(line5View);
	height = height + 60;
	rows.height = height;

	if (response.ride_status == "Requested" || response.ride_status == "REQUESTED") {
		acceptLabel.visible = true;
		cancelLabel.visible = false;
		start.visible = false;
		stop.visible = false;
	} else if (response.ride_status == "Cancelled" || response.ride_status == "Ended") {
		acceptLabel.visible = false;
		cancelLabel.visible = false;
		start.visible = false;
		stop.visible = false;
	} else if (response.ride_status == "Confirmed") {// frequencies.ride_status
		if (currentDate == rideDate) {
			acceptLabel.visible = false;
			cancelLabel.visible = true;
			start.visible = true;
			stop.visible = false;
		} else {
			acceptLabel.visible = false;
			cancelLabel.visible = true;
			start.visible = false;
			stop.visible = false;
		}
	} else if (response.ride_status == "ACCEPTED" || response.ride_status == "Accepted") {
		acceptLabel.visible = false;
		cancelLabel.visible = true;
		start.visible = false;
		stop.visible = false;
	} else if (response.ride_status == "Started") {
		if (currentDate == rideDate) {
			acceptLabel.visible = false;
			cancelLabel.visible = false;
			start.visible = false;
			stop.visible = true;
		} else {
			acceptLabel.visible = false;
			cancelLabel.visible = false;
			start.visible = false;
			stop.visible = false;
		}
	}
	//}

	// rows.addEventListener('click', function(e) {
		// //date
		// var currentTime = new Date();
		// var month = currentTime.getMonth() + 1;
		// var day = currentTime.getDate();
// 
		// if (day >= 1 && day <= 9) {
			// DD = "0" + day;
		// } else {
			// DD = day;
		// }
		// var year = currentTime.getFullYear();
		// var _MM_ = myUtils.MONTH(month);
		// var DD__ = _MM_ + ' ' + DD + ', ' + year;
// 
		// if (e.source.isYes) {
			// Ti.API.error("Saving Driver Confirming the ride.");
			// uDrives.Accept(e.source.rideIdyes);
			// Ti.API.error("Post save ... success or failure ??????");
			// //statusLabel.text = '';
			// //statusLabel.text = 'ACCEPTED';
			// //hide the cancel button
			// // e.row.children[0].children[0].show();
			// // e.row.children[3].children[0].hide();
			// // e.row.children[0].children[3].text = "";
			// // e.row.children[0].children[3].text = "ACCEPTED";
		// } else if (e.source.isNo) {
			// uDrives.Reject(e.source.rideIdno);
			// $.tableview.deleteRow(e.row);
		// } else if (e.source.obj == "STRT") {
			// Ti.API.error("Clicked START Button : " + JSON.stringify(e));
			// // Todo ... code to start gps tracking
			// //if (Ti.App.Properties.getBool('isGPS_Ride_started', '') == false) {
			// var bank_ = Alloy.createCollection("get_Debit_Card");
			// bank_.fetch({
				// success : function(bank_, response) {
					// var data = [];
// 
					// Ti.API.error("Got Bank Info : " + JSON.stringify(response));
					// Ti.API.error("Got Bank Info : " + JSON.stringify(bank_));
// 
					// if (bank_.length == 0) {
						// Ti.App.Properties.setBool("OnlyCreditCard", false);
						// Ti.App.Properties.setBool("UDrive", true);
						// Alloy.createController('ListDebit_Bank').getView().open();
					// } else if (bank_.length == 1) {
						// e.row.children[5].children[0].hide();
						// e.row.children[5].children[1].show();
						// e.row.children[0].children[0].hide();
						// e.row.children[0].children[3].text = '';
						// e.row.children[0].children[3].text = 'STARTED';
						// Ti.API.error("Starting GPS Service For Ride ID : " + e.row.children[5].children[0].ID__);
						// startGpService(e.row.children[5].children[0].ID__);
					// } else if (bank_.length > 1) {
						// Ti.API.info("else >> 1  " + e.row.children[5].children[0].ID__);
						// showDebitCards(response, e.row.children[5].children[0].ID__);
					// }
				// },
				// error : function(err, response) {
					// var parseResponse = JSON.parse(response);
					// alert("session expired, please log back.");
					// if (parseResponse.status == 401) {
						// myUtils.closeAllOpenWindows();
						// Alloy.createController('signin').getView().open();
					// }
				// }
			// });
		// } else if (e.source.obej == "STOP") {
			// //alert("stop click " + e.row.children[4].children[2].ID__);
			// Ti.App.Properties.setString('GPSStatus', 'STOPPED');
			// var Type = "R";
			// stopGPService(e.row.children[5].children[1].ID__, Type);
		// } else if (e.source.objName == "startCHAT") {
			// Ti.App.Properties.setBool('RiderTrue', false);
			// Ti.App.Properties.setString('imRider', 'fromudrive');
			// ///start chat
			// Ti.App.Properties.setString('NAMEE', e.source.Name);
			// e.source.setEnabled(false);
			// Alloy.createController('chat', {
				// "RideId" : e.source.ID__,
				// "Rider_Id" : e.source.RIDER_ID,
				// "DriverId" : e.source.DRIVER_ID,
				// "SenderId" : e.source.ID__
			// }).getView().open();
			// setTimeout(function() {
				// e.source.setEnabled(true);
			// }, 3000);
		// } else if (e.source.objName == 'exp') {
			// if (e.source.click == 'no') {
				// e.source.click = 'yes';
				// var frequencies = collection.get(e.source.ID__).attributes.frequencies;
				// e.source.image = "/common/F2.png";
				// length = e.index;
				// for ( i = 0; i < frequencies.length; i++) {
					// $.tableview.insertRowAfter(length, populateData(frequencies[i], e.source.ID__, e.source.Rider_ID, e.source.TYPE));
					// length = length + 1;
					// // line1View.backgroundColor = "#F1EEE7";
					// // line2View.backgroundColor = "#F1EEE7";
					// // line3View.backgroundColor = "#F1EEE7";
					// // line4View.backgroundColor = "#F1EEE7";
					// // line5View.backgroundColor = "#F1EEE7";
					// // line6View.backgroundColor = "#F1EEE7";
				// }
			// } else {
				// if (e.source.click == 'yes') {
					// e.source.click = 'no';
					// var frequencies = collection.get(e.source.ID__).attributes.frequencies;
					// e.source.image = "/common/F1.png";
					// length = frequencies.length;
					// for ( i = 0; i < frequencies.length; i++) {
						// $.tableview.deleteRow(e.index + 1);
						// // line1View.backgroundColor = "#E3DED6";
						// // line2View.backgroundColor = "#E3DED6";
						// // line3View.backgroundColor = "#E3DED6";
						// // line4View.backgroundColor = "#E3DED6";
						// // line5View.backgroundColor = "#E3DED6";
						// // line6View.backgroundColor = "#E3DED6";
					// }
				// }
			// }
		// }
	// });

	return rows;
}


function onClick(event) {
	Ti.API.error("Clicked Index: " + event.index + "\n" + "Event Source : " + event.source.id);
	if (event.source.id == 'DeleteIcon') {
		onClickedDeleteIcon(event);
	} else if (event.source.id == 'AcceptIcon') {
		onClickedAcceptIcon(event);
	} else if (event.source.id == 'ChatIcon') {
		onClickedChatIcon(event);
	} else if (event.source.id == 'DriveStartIcon') {
		onClickedDriveStartIcon(event);
	} else if (event.source.id == 'DriveStopIcon') {
		onClickedDriveStopIcon(event);
	} else if (event.source.id == 'ExpandCPIcon') {
		onClickedExpandCarPoolIcon(event);
	} else if (event.source.id == 'StartCPIcon') {
		onClickedStartCapPoolIcon(event);
	} else if (event.source.id == 'StopCPIcon') {
		onClickedStopCarPoolIcon(event);
	} else if (event.source.id == 'DeleteCPIcon') {
		onClickedDeleteCarPoolIcon(event);
	} else {
		onClickedSomethingElse(event);
	}
}

function onClickedDeleteIcon(event) {
	uDrives.Reject(event.source.rideIdno);
	$.tableview.deleteRow(event.row);
}

function onClickedAcceptIcon(event) {
	Ti.API.error("Saving Driver Confirming the ride.");
	uDrives.Accept(event.source.rideIdyes);
	Ti.API.error("Post save ... success or failure ??????");
}

function onClickedChatIcon(event) {
	Ti.App.Properties.setBool('RiderTrue', false);
	Ti.App.Properties.setString('imRider', 'fromudrive');
	///start chat
	Ti.App.Properties.setString('NAMEE', event.source.Name);
	event.source.setEnabled(false);
	Alloy.createController('chat', {
		"RideId" : event.source.ID__,
		"Rider_Id" : event.source.RIDER_ID,
		"DriverId" : event.source.DRIVER_ID,
		"SenderId" : event.source.ID__
	}).getView().open();
	setTimeout(function() {
		event.source.setEnabled(true);
	}, 3000);
}

function onClickedDriveStartIcon(event) {
	Ti.API.error("Clicked START Button : " + JSON.stringify(event));
	var bank_ = Alloy.createCollection("get_Debit_Card");
	bank_.fetch({
		success : function(bank_, response) {
			var data = [];

			Ti.API.error("Got Bank Info : " + JSON.stringify(response));
			Ti.API.error("Got Bank Info : " + JSON.stringify(bank_));

			if (bank_.length == 0) {
				Ti.App.Properties.setBool("OnlyCreditCard", false);
				Ti.App.Properties.setBool("UDrive", true);
				Alloy.createController('ListDebit_Bank').getView().open();
			} else if (bank_.length == 1) {
				event.row.children[5].children[0].hide();
				event.row.children[5].children[1].show();
				event.row.children[0].children[0].hide();
				event.row.children[0].children[3].text = '';
				event.row.children[0].children[3].text = 'STARTED';
				Ti.API.error("Starting GPS Service For Ride ID : " + event.row.children[5].children[0].ID__);
				startGpService(event.row.children[5].children[0].ID__);
			} else if (bank_.length > 1) {
				Ti.API.info("else >> 1  " + event.row.children[5].children[0].ID__);
				showDebitCards(response, event.row.children[5].children[0].ID__);
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
}

function onClickedDriveStopIcon(event) {
	Ti.App.Properties.setString('GPSStatus', 'STOPPED');
	stopGPService(event.row.children[5].children[1].ID__, "R");
}

function onClickedExpandCarPoolIcon(event) {
	if (event.source.click == 'no') {
		event.source.click = 'yes';
		var frequencies = collection.get(event.source.ID__).attributes.frequencies;
		event.source.image = "/common/F2.png";
		length = event.index;
		for ( i = 0; i < frequencies.length; i++) {
			$.tableview.insertRowAfter(length, populateData(frequencies[i], event.source.ID__, event.source.Rider_ID, event.source.TYPE));
			length = length + 1;
		}
	} else {
		if (event.source.click == 'yes') {
			event.source.click = 'no';
			var frequencies = collection.get(event.source.ID__).attributes.frequencies;
			event.source.image = "/common/F1.png";
			length = frequencies.length;
			for ( i = 0; i < frequencies.length; i++) {
				$.tableview.deleteRow(event.index + 1);
			}
		}
	}
}

function onClickedStartCarPoolIcon(event) {
	// Todo ... code to start gps tracking
	Ti.API.error("uDriveOutstandingRqsts - CarPool - Clicked the Ride STRT button");
	Ti.API.error("uDriveOutstandingRqsts - CarPool - Event Details : " + JSON.stringify(event));
	var bank_ = Alloy.createCollection("get_Debit_Card");
	bank_.fetch({
		success : function(bank_, response) {
			Ti.API.error("uDriveOutstandingRqsts - get_debit_card - Success - Response : " + JSON.stringify(response));
			Ti.API.error("uDriveOutstandingRqsts - get_debit_card - Success - bank_ : " + JSON.stringify(bank_));
			if (bank_.length == 0) {
				Ti.API.error("No Bank Detail found. Showing screen to add bank details");
				Ti.App.Properties.setBool("OnlyCreditCard", false);
				Ti.App.Properties.setBool("UDrive", true);
				Alloy.createController('ListDebit_Bank').getView().open();
			} else if (bank_.length == 1) {
				Ti.API.error("One Bank Detail found. ");
				event.row.children[0].children[2].hide();
				event.row.children[0].children[3].show();
				event.row.children[0].children[4].hide();
				event.row.children[0].children[0].text = '';
				event.row.children[0].children[0].text = 'STARTED';
				Ti.API.error("uDriveOutstandingRqsts - CarPool - Staring the GPS service");
				startGpService(event.source.fCId, event.source.fId, event.source.Type);
			} else if (bank_.length > 1) {
				Ti.API.error("Multiple Bank Details found. Listing the bank details");
				Ti.API.info("else >> 1  " + event.source.fCId + " - " + event.source.fId + " - " + event.source.Type);
				showDebitCards(response, event.source.fCId, event.source.fId, event.source.Type);
			}
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			//alert("session expired, please log back.");
			if (parseResponse.status == 401) {
				myUtils.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

function onClickedStopCarPoolIcon(event) {
	Ti.API.error("uDriveOutstandingRqsts - CarPool - Clicked the Ride STOP button");
	Ti.API.error("uDriveOutstandingRqsts - CarPool - Event Details : " + JSON.stringify(event));
	Ti.App.Properties.setString('GPSStatus', 'STOPPED');
	stopGPService(event.row.children[0].children[3].fCId, event.row.children[0].children[3].fId, event.source.Type);
}

function onClickedDeleteCarPoolIcon(event) {
	uDrives.FrequencyReject(event.source.fId, event.source.fCId);
	event.row.children[0].children[0].text = 'REJECTED';
	event.row.children[0].children[1].hide();
	event.row.children[0].children[2].hide();
	$.tableview.deleteRow(event.row);
}

function onClickedSomethingElse(event) {
	// alert("Clicked something else.");
}

////////////////////////////////////////////
/////////// Drivers Lists
////////////////////////////////////////////
var start2;
var stop2;
var trash;
function populateData(frequencies, ride_id, rider_id, TYPE) {
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 300,
		backgroundColor : '#F1EEE7',
		selectedColor : 'white'
	});

	var line2View = Ti.UI.createView({
		top : height + 5,
		left : '5%',
		width : '100%',
		backgroundColor : '#F2EFE8'
	});

	var dateLabela = Ti.UI.createLabel({
		text : moment.utc(frequencies.date).format('MMMM Do'),
		top : '5%',
		left : '5%',
		width : '15%',
		fId : frequencies.id,
		fCId : frequencies.carpool_id,
		color : '#726859',
		font : {
			fontSize : '11sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(dateLabela);

	var stats = Ti.UI.createLabel({
		text : ' ' + frequencies.ride_status.toString().toUpperCase(),
		top : '5%',
		left : '25%',
		width : '25%',
		fId : frequencies.id,
		fCId : frequencies.carpool_id,
		color : '#726859',
		font : {
			fontSize : '11sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(stats);

	start2 = Ti.UI.createLabel({
		id : "StartCPIcon",
		objName : "StartCPLbl",
		obj : "STRT",
		top : '10%',
		right : '20%',
		width : 50,
		height : 60,
		fId : frequencies.id,
		fCId : frequencies.carpool_id,
		backgroundImage : "/common/st.png",
		Type : TYPE
	});

	var _date_ = moment();
	var currentDate = moment(_date_).format('YYYY-MM-DD');
	var availableFreq = moment.utc(frequencies.date).format('YYYY-MM-DD');

	if (moment(availableFreq).isSameOrBefore(currentDate) == true) {
		// date is past & current
		line2View.add(start2);
	}

	stop2 = Ti.UI.createLabel({
		id : "StopCPIcon",
		objName : "StopCPLbl",
		obj : "STOP",
		top : '10%',
		right : '35%',
		width : 50,
		height : 60,
		fId : frequencies.id,
		fCId : frequencies.carpool_id,
		backgroundImage : "/common/sp.png",
		Type : TYPE
	});
	line2View.add(stop2);

	if (moment(availableFreq).isSameOrBefore(currentDate) == true) {
		// date is past & current
		line2View.add(stop2);
	}

	trash = Ti.UI.createLabel({
		id : "DeleteCPIcon",
		objName : "DeleteCPLbl",
		top : '15%',
		right : '5%',
		width : 30,
		height : 30,
		obj : "No",
		fId : frequencies.id,
		fCId : frequencies.carpool_id,
		backgroundImage : OS_IOS ? "/converted/trash.png" : "/images/trash.png",
	});
	line2View.add(trash);

	rows.add(line2View);
	height = height + 50;
	rows.height = height;

	if (frequencies.ride_status == "Requested" || frequencies.ride_status == "REQUESTED") {
		trash.visible = false;
		start2.visible = false;
		stop2.visible = false;
	} else if (frequencies.ride_status == "Cancelled" || frequencies.ride_status == "Ended") {
		trash.visible = false;
		start2.visible = false;
		stop2.visible = false;
	} else if (frequencies.ride_status == "Confirmed" || frequencies.ride_status == "CONFIRMED") {
		trash.visible = true;
		start2.visible = true;
		stop2.visible = false;
	} else if (frequencies.ride_status == "ACCEPTED" || frequencies.ride_status == "Accepted") {
		trash.visible = true;
		start2.visible = false;
		stop2.visible = false;
	} else if (frequencies.ride_status == "Started") {
		trash.visible = false;
		start2.visible = false;
		stop2.visible = true;
	}

	// rows.addEventListener('click', function(e) {
		// if (e.source.obj == "No") {
			// uDrives.FrequencyReject(e.source.fId, e.source.fCId);
			// e.row.children[0].children[0].text = 'REJECTED';
			// e.row.children[0].children[1].hide();
			// e.row.children[0].children[2].hide();
			// $.tableview.deleteRow(e.row);
		// } else if (e.source.obj == "STRT") {
			// // Todo ... code to start gps tracking
			// Ti.API.error("uDriveOutstandingRqsts - populateData - Clicked the Ride STRT button");
			// Ti.API.error("uDriveOutstandingRqsts - populateData - Event Details : " + JSON.stringify(e));
			// var bank_ = Alloy.createCollection("get_Debit_Card");
			// bank_.fetch({
				// success : function(bank_, response) {
					// Ti.API.error("uDriveOutstandingRqsts - get_debit_card - Success - Response : " + JSON.stringify(response));
					// Ti.API.error("uDriveOutstandingRqsts - get_debit_card - Success - bank_ : " + JSON.stringify(bank_));
					// if (bank_.length == 0) {
						// Ti.API.error("No Bank Detail found. Showing screen to add bank details");
						// Ti.App.Properties.setBool("OnlyCreditCard", false);
						// Ti.App.Properties.setBool("UDrive", true);
						// Alloy.createController('ListDebit_Bank').getView().open();
					// } else if (bank_.length == 1) {
						// Ti.API.error("One Bank Detail found. ");
						// e.row.children[0].children[2].hide();
						// e.row.children[0].children[3].show();
						// e.row.children[0].children[4].hide();
						// e.row.children[0].children[0].text = '';
						// e.row.children[0].children[0].text = 'STARTED';
						// Ti.API.error("uDriveOutstandingRqsts - populateData - Staring the GPS service");
						// startGpService(e.source.fCId, e.source.fId, e.source.Type);
					// } else if (bank_.length > 1) {
						// Ti.API.error("Multiple Bank Details found. Listing the bank details");
						// Ti.API.info("else >> 1  " + e.source.fCId + " - " + e.source.fId + " - " + e.source.Type);
						// showDebitCards(response, e.source.fCId, e.source.fId, e.source.Type);
					// }
				// },
				// error : function(err, response) {
					// var parseResponse = JSON.parse(response);
					// //alert("session expired, please log back.");
					// if (parseResponse.status == 401) {
						// myUtils.closeAllOpenWindows();
						// Alloy.createController('signin').getView().open();
					// }
				// }
			// });
			// //} else {
			// //	alert("Already one ride is started");
			// //}
		// } else if (e.source.obj == "STOP") {
			// Ti.API.error("uDriveOutstandingRqsts - populateData - Clicked the Ride STOP button");
			// Ti.API.error("uDriveOutstandingRqsts - populateData - Event Details : " + JSON.stringify(e));
			// Ti.App.Properties.setString('GPSStatus', 'STOPPED');
			// stopGPService(e.row.children[0].children[3].fCId, e.row.children[0].children[3].fId, e.source.Type);
		// }
	// });

	return rows;
}

var multiCardSelect = false;
function showDebitCards(debitCardInfo, Cid, Fid, T) {
	Ti.API.info("addDebitRow " + JSON.stringify(debitCardInfo));
	//Ti.API.info("id's  " + Cid + " - " + Fid + " - " + T);
	try {
		var modal = require('selectDebitCard');
		var MY_Model = new modal();
		var table = Ti.UI.createTableView({
			top : '10%',
			left : '0%',
			height : '60%',
			width : '100%',
			scrollable : true,
			separatorColor : 'white',
			backgroundColor : '#F2EFE8'
		});

		for (var i = 0; i < debitCardInfo.length; i++) {
			var rows = Ti.UI.createTableViewRow({
				height : 90,
				backgroundColor : '#E3DED6',
				borderWidth : 5,
				objName : 'RowClick',
				_ID_ : debitCardInfo[i].id
			});
			if (OS_ANDROID) {
				var checkbox = Ti.UI.createSwitch({
					style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
					value : false,
					right : '15%',
					borderColor : '#786658',
					borderWidth : 2,
					width : '25dp',
					height : '25dp',
					_ID_ : debitCardInfo[i].id
				});
				rows.add(checkbox);
			}
			if (OS_IOS) {
				var checkbox = Ti.UI.createSwitch({
					value : false,
					right : '15%',
					height : '20%',
					width : '25dp',
					height : '25dp',
					_ID_ : debitCardInfo[i].id
				});
				rows.add(checkbox);
			}
			/////row click event Listener////
			rows.addEventListener('change', function(e) {
				e.row.value = !e.row.value;
				//send e.source._ID_
				if (e.row.value == true) {
					multiCardSelect = true;
					Ti.API.error(e.source._ID_);
					MID.set('managedID', e.source._ID_);
					if (T == "C") {
						startGpService(Cid, Fid, T);
					} else {
						startGpService(Cid);
					}
					MY_Model.myModal.close();
					service_call();
				}
			});
			if (debitCardInfo[i].account_type == "debitCard") {
				var title1 = Ti.UI.createLabel({
					text : debitCardInfo[i].account_type,
					ID__ : debitCardInfo[i].id,
					top : '20%',
					left : '25%',
					color : '#786658',
					font : {
						fontSize : '20sp',
						fontWeight : 'bold',
					},
					objName : 'RowClick',
					ID__ : debitCardInfo[i].id,
				});
				rows.add(title1);
			}
			if (debitCardInfo[i].account_type == "bank") {
				var title2 = Ti.UI.createLabel({
					text : debitCardInfo[i].account_type,
					ID__ : debitCardInfo[i].id,
					top : '20%',
					left : '25%',
					color : '#786658',
					font : {
						fontSize : '20sp',
						fontWeight : 'bold',
						//fontStyle : 'italic'
					},
					objName : 'RowClick',
					ID__ : debitCardInfo[i].id,
				});
				rows.add(title2);
			}
			if (debitCardInfo[i].account_type == "debitCard") {
				var title3 = Ti.UI.createLabel({
					text : "**** **** **** " + debitCardInfo[i].last4digits,
					top : '60%',
					left : '25%',
					color : '#786658',
					font : {
						fontSize : '15sp'
						//fontStyle : 'italic'
					},
					objName : 'RowClick',
					ID__ : debitCardInfo[i].id
				});
				rows.add(title3);
			}
			if (debitCardInfo[i].account_type == "bank") {
				var title4 = Ti.UI.createLabel({
					text : "********" + debitCardInfo[i].last4digits + '   Routing No: ' + debitCardInfo[i].routing_number,
					top : '60%',
					left : '25%',
					color : '#786658',
					font : {
						fontSize : '15sp',
					},
					objName : 'RowClick',
					ID__ : debitCardInfo[i].id
				});
				rows.add(title4);
			}
			var image3 = Ti.UI.createImageView({
				top : '25%',
				width : 40,
				height : 40,
				left : '1%',
				backgroundImage : '/icons/pay_reverse.png'
			});
			rows.add(image3);

			table.appendRow(rows);
		}

		MY_Model.containerView.add(table);

		MY_Model.closeButton.addEventListener('click', function() {
			MY_Model.myModal.close();
		});

		return rows;
	} catch(err) {
		Ti.API.info(err);
	}
}

var alarmModule;
function startGpService(rideId, FreqId, type) {
	Ti.API.error("At startGpService() ....");
	start.hide();
	Ti.App.Properties.setString('FreqId', FreqId);
	Ti.App.Properties.setString('type', type);
	if (type == "C") {
		notifyStartRideToRider(rideId, FreqId, type);
	} else {
		Ti.API.error("Notifying the Rider : " + rideId );
		notifyStartRideToRider(rideId);
	}
}

function stopGPService(rideId, FreqId, type) {
	Ti.API.error("StopGPSService \n  Ride ID: " + rideId + "\n Freq ID: " + FreqId + " Type = " + type );
	if (type == "C") {
		Ti.App.Properties.setBool('isCarpoolRide', true);
		getPaymentsCall(rideId, FreqId);
		notifyEndRideToRider(rideId, FreqId, type);
	} else {
		Ti.App.Properties.setBool('isCarpoolRide', false);
		notifyEndRideToRider(rideId, FreqId);
	}
};

function locationListener(locCallBack) {
	if (locCallBack.success) {
		// alert(locCallBack.coords.latitude+ "  "+ locCallBack.coords.longitude);
		updateDBWithCurrentLocation(locCallBack.coords.latitude,locCallBack.coords.longitude);
	} else {
		alert("Error occured while fetching location.");
	}
}

Ti.App.addEventListener('resume', function(e) {
	////alert("App is resuming from the background");
	ToDoTask();
});

Ti.App.addEventListener('resumed', function(e) {
	////alert("App is resumed from the background");
	ToDoTask();
});

Ti.App.addEventListener('pause', function(e) {
	////alert("App was paused from the foreground");
	ToDoTask();
});

Ti.App.addEventListener('paused', function(e) {
	////alert("App was paused from the foreground");
	ToDoTask();
});

function ToDoTask() {
	if (OS_IOS) {
		if (Ti.App.Properties.getString('GPSStatus', '') == "STARTED") {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = 10;
			Ti.Geolocation.activityType = Ti.Geolocation.ACTIVITYTYPE_AUTOMOTIVE_NAVIGATION;
			Ti.Geolocation.addEventListener('location', locationListener);
		}
	}
};

function updateDBWithCurrentLocation(lat, lng) {
	var url = "https://api.ucorsa.com/api/tracking";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		 //alert("response " + this.responseText);
	};
	xhr.onerror = function() {
		 alert("response error " + this.responseText);
	};
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	if (Ti.App.Properties.getString('type') == "C") {
		var post = {
			tracking : {
				'ride_id' : Ti.App.Properties.getString('rideId', ''),
				'carpoolFrequency_id' : Ti.App.Properties.getString('FreqId', ''),
				'latitude' : lat,
				'longitude' : lng
			}
		};
	} else {
		var post = {
			tracking : {
				'ride_id' : Ti.App.Properties.getString('rideId', ''),
				'latitude' : lat,
				'longitude' : lng
			}
		};
	}
	xhr.send(JSON.stringify(post));
};

//getPaymentsCall
function getPaymentsCall(rideId, FreqId) {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("GET", Alloy.CFG.url + "/api/carpool/payments/" + FreqId + "/" + rideId);
	xhr.onload = function() {
		var rows = JSON.parse(this.responseText);
		Ti.API.error("Carpool Freq: " + JSON.stringify(rows));
		if (rows.carpool_make_payment == "0") {
			// driver will not get paid for this ride.
			var msg = 'You Opted to get Paid on a ' + rows.carpool_payout_options + ' basis';
			alert(msg);
		} else {
			// driver will get paid for this ride.
			alert("You will be paid for this ride.");
		}
	};
	xhr.error = function() {
		alert('getPaymentsCall ' + this.responseText);
	};
	xhr.send();
}

///Starting Ride
function notifyStartRideToRider(rideId, FreqId, type) {
	Ti.API.error("At notifyStartRideToRider for : " + rideId, FreqId, type);
	if (type == "C") {
		var start = Alloy.createModel("StartRide_C");
		var params = {
			rideId : rideId,
			carpoolFrequency_id : FreqId
		};
	} else {
		var start = Alloy.createModel("StartRide");
		var params = {
			rideId : rideId
		};
	}
	Ti.API.error("Calling the StartRide model Save Operation ... ");
	start.save(params, {
		success : function(model, response) {
			Ti.API.error("Success on start Notify " + JSON.stringify(response));
			startTrackingTheRide( rideId, FreqId, type );
//			service_call();
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			Ti.API.error("Error during start.save call.  Response : " + JSON.stringify(response));
			Ti.API.error("Error during start.save call.  Error : " + JSON.stringify(err));
			if (parseResponse.status == 401) {
				myUtils.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
};

function notifyEndRideToRider(rideId, FreqId, type) {
	try {
		if (FreqId == "R") {
			var stopServiceCall_R = Alloy.createModel("StopRide");

			if (MID.get('managedID') == undefined || MID.get('managedID') == "") {
				var params = {
					ride_id : rideId
				};
			} else {
				var params = {
					ride_id : rideId,
					managedId : MID.get('managedID')
				};
			}
			stopServiceCall_R.save(params, {
				success : function(model, response) {
					//alert("R " + JSON.stringify(response));
					// stop tracking.
					stopTrackingTheRide();
				},
				error : function(err, response) {
					var parseResponse = JSON.parse(response);
					//alert("Server Status : " + parseResponse.status);
					if (parseResponse.status == 401) {
						myUtils.closeAllOpenWindows();
						Alloy.createController('signin').getView().open();
					}
				}
			});
		}

		if (type == "C") {
			var stopServiceCall_C = Alloy.createModel("StopRide_C");
			if (MID.get('managedID') == undefined || MID.get('managedID') == "") {
				var params = {
					rideId : rideId,
					carpoolFrequency_id : FreqId
				};
			} else {
				var params = {
					rideId : rideId,
					carpoolFrequency_id : FreqId,
					managedId : MID.get('managedID')
				};
			}

			stopServiceCall_C.save(params, {
				success : function(model, response) {
					//alert("R " + JSON.stringify(response));
					// stop tracking.
					stopTrackingTheRide();
				},
				error : function(err, response) {
					var parseResponse = JSON.parse(response);
					//alert("Server Status : " + parseResponse.status);
					if (parseResponse.status == 401) {
						myUtils.closeAllOpenWindows();
						Alloy.createController('signin').getView().open();
					}
				}
			});
		}
		MID.set('managedID', "");
	} catch(err) {
		alert("Exception " + err);
	}
};

function updateDBWithLocation(lat, lng) {
	
	var rideData = Ti.App.Properties.getObject('rideData', null);
	
	if( rideData == null || lat == undefined || lng == undefined || lat == 0 || lng == 0 ) {
		Ti.API.error("Error retrieving data.  Cannot persist data to DB.");
		return;
	}
	
	var url = "https://api.ucorsa.com/api/tracking";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		var response = JSON.parse(this.responseText);
		// Ti.API.error("updateDBWithLocation Successful ... Response " + JSON.stringify(this.responseText));
	};
	xhr.onerror = function() {
		alert("Error  " + this.responseText);
	};
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', rideData.token);
	if (Ti.App.Properties.getString('type') == "C") {
		var post = {
			tracking : {
				'ride_id' : rideData.rideId,
				'carpoolFrequency_id' : rideData.carpoolFrequency_id,
				'latitude' : lat,
				'longitude' : lng
			}
		};
	} else {
		var post = {
			tracking : {
				'ride_id' : rideData.rideId,
				'latitude' : lat,
				'longitude' : lng
			}
		};
	}
	Ti.API.error("Posting Location : " + JSON.stringify(post));
	xhr.send(JSON.stringify(post));
}

var locationAdded = false;
var handleLocation = function(e) {
    if (!e.error) {
        Ti.API.info("uDriveOutstandingRqsts - hanldeLocation() - " + JSON.stringify(e.coords));
        var loc = {
        	"Latitude" : e.coords.latitude, 
        	"Longitude" : e.coords.longitude
        };
		// Ti.UI.createNotification({
		    // message: JSON.stringify(loc),
		    // duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		// }).show();
		
		var rideStatus = Ti.App.Properties.getString('GPSStatus', "");
		if( rideStatus === 'STOPPED' ) {
			Ti.API.info("Ride Stopped.  Not updating the DB with Location");
			// Ti.UI.createNotification({
			    // message: "Ride Stopped",
			    // duration: Ti.UI.NOTIFICATION_DURATION_SHORT
			// }).show();
      	} else {
	        updateDBWithLocation(e.coords.latitude, e.coords.longitude);
      	}
    }
};

var addHandler = function() {
    if (!locationAdded) {
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
};
var removeHandler = function() {
    if (locationAdded) {
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    } else {
    	alert("Trying to LOCATION removeEventListener before Adding the listener.");
    	Ti.API.error("Trying to LOCATION removeEventListener before Adding the listener.");
    }
};

function trackLocationForAndroidDevices() {	
	
	Ti.API.error("In trackLocationForAndroidDevices() ... ");

	if (Ti.Geolocation.locationServicesEnabled) {
		var providerGps = Ti.Geolocation.Android.createLocationProvider({
		    name: Ti.Geolocation.PROVIDER_GPS,
		    minUpdateDistance: 100.0,
		    minUpdateTime: 60
		});
		Ti.Geolocation.Android.addLocationProvider(providerGps);
		Ti.Geolocation.Android.manualMode = true;
		
		// adding location rule ....
		/*var gpsRule = Ti.Geolocation.Android.createLocationRule({
		    provider: Ti.Geolocation.PROVIDER_GPS,
		    // Updates should be accurate to 100m
		    accuracy: 100,
		    // Updates should be no older than 5m
		    maxAge: 300000,
		    // But  no more frequent than once per 60 seconds
		    minAge: 60000
		}); */
		//Ti.Geolocation.Android.addLocationRule(gpsRule);

	    addHandler();
	 
	    var activity = Ti.Android.currentActivity;
	    activity.addEventListener('destroy', removeHandler);
	    activity.addEventListener('pause', removeHandler);
	    activity.addEventListener('resume', addHandler);
	    
	} else {
	    alert('Please enable location services');
	}
}

function startTrackingTheRide(rideId, FreqId, type ) {
	Ti.API.error("Start of startTrackingTheRide() ...");
	if (OS_ANDROID) {
		Ti.API.error("GPS collection for Android devices ... ");
		if (type == "C") {
			var rideData = {};
			rideData.rideStarted = 'true';
			rideData.rideId = JSON.stringify(rideId);
			rideData.carpoolFrequency_id = JSON.stringify(FreqId);
			rideData.token = Ti.App.Properties.getString('tokenaccess', '');
		} else {
			var rideData = {};
			rideData.rideStarted = 'true';
			rideData.rideId = JSON.stringify(rideId);
			rideData.token = Ti.App.Properties.getString('tokenaccess', '');
		}
		Ti.App.Properties.setObject('rideData', rideData);
		Ti.API.error("calling track location for Android devices ... ");
		trackLocationForAndroidDevices();
		// Ti.API.error("Adding alarm service ... Ride Data : " + JSON.stringify(rideData));
		// alarmModule = require('bencoding.alarmmanager').createAlarmManager();
		// alarmModule.addAlarmService({
			// service : 'com.www.ucorsa.TracksGpsService',
			// second : 2,
			// minute : 0,
			// interval : 100000,
			// forceRestart : true,
			// customData : JSON.stringify(rideData) // pass JSON string to service
		// });
		// Ti.App.Properties.setBool('isGPS_Ride_started', true);
		// Ti.App.Properties.setString('GPSStatus', 'STARTED');
	} else {
		Ti.App.Properties.setString('rideId', rideId);
		//NEW CODE
		if (!Alloy.Globals.configurationDone) {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = 10;
			Ti.Geolocation.activityType = Ti.Geolocation.ACTIVITYTYPE_AUTOMOTIVE_NAVIGATION;
			Ti.Geolocation.addEventListener('location', locationListener);
		}
		Ti.App.Properties.setString('GPSStatus', 'STARTED');
		Alloy.Globals.configurationDone = true;
	}
}

function stopTrackingTheRide() {
	if (OS_ANDROID) {
		var rideData = {};
		rideData.rideStarted = 'false';
		Ti.App.Properties.setObject('rideData', rideData);
		// try {
			// ////alert(alarmModule);
			// alarmModule.cancelAlarmService();
		// } catch(err) {
		// }
		Ti.App.Properties.setBool('isGPS_Ride_started', false);
		Ti.App.Properties.setString('GPSStatus', 'STOPPED');
		//alert('Ride Stopped');
		// remove the handler
		removeHandler();
		// refresh the screen.
		service_call();

	} else {
		//NEW CODE
		Ti.Geolocation.removeEventListener('location', locationListener);
		Alloy.Globals.configurationDone = false;
		//OLD CODE
		timer = null;
		Ti.App.Properties.setString('rideId', null);
		Ti.App.Properties.setString('FreqId', null);
		Ti.App.Properties.setString('type', null);
		Ti.App.Properties.setBool('isGPS_Ride_started', false);
		Ti.App.Properties.setString('GPSStatus', 'STOPPED');
	}
}

refreshObject.on('RefreshDrive', function(msg) {
	Ti.API.error("Got a RefreshDrive trigger. Msg: " + JSON.stringify(msg.Status));
	// alert("Refresh Drive - Msg : " + JSON.stringify(msg));
	if (msg.Status == "success") {
		Ti.API.error("Calling service_call due to Refresh Drive trigger");
		service_call();
	} else if ( msg.Status == "RideAccepted" ) {
		Ti.API.error("Calling service_call due to Refresh Drive trigger");
		service_call();
	} else if (msg.Choice == "Accept" || msg.Choice == "Reject" || msg.Choice == "Later" || msg.Choice == "Confirm") {
		Ti.API.error("Calling service_call due to Refresh Drive trigger");
		service_call();
	} else {
		Ti.API.error("Calling ???? due to Refresh Drive trigger");
		// Todo ... ???
	}
});

function closeWindow() {
	try {
		refreshObject.off('RefreshDrive');
		//$.off();
		if (OS_IOS) {
			var tabWindow = Alloy.Globals.openWindows.pop();
			tabWindow[Object.keys(tabWindow)].close();
			tabWindow[Object.keys(tabWindow)] = null;
			tabWindow = null;
		}
	} catch(err) {

	}
}