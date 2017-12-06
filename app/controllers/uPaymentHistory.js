var args = arguments[0] || {};
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var myUtils = require('util');
var collection = Alloy.createCollection("PaymentHistory");
var ucorsaCommissionForSingleRide = 0;
var ucorsaCommissionForCarPool = 0;

function load() {
	var Network = require('networkCheck');
	getuCorsaCommissionRateForSingleRide();
	$.nodata.hide();
}

function service_call() {
	try {
		collection.fetch({
			success : function(collection, response) {
				var data = [];
				_.each(collection.models, function(element, index, list) {
					data.push(show_all_messages(element.attributes));
				});

				if (data.length) {
					$.tableview.setData(data);
				} else {
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
	try {
		Ti.API.error("Here 1");
		// Ti.API.error("Payment " + JSON.stringify(response));
		var height = 0;
		var rows = Ti.UI.createTableViewRow({
			height : 230,
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
		
		Ti.API.error("RType: " + response.uRideType );
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
			Ti.API.error("End Date: " + response.end_date);
			Ti.API.error("Ride Time: " + response.ride_time);
			if (response.end_date != null && response.ride_time != null) {
				//date
				var default_date = response.end_date.substring(0, 10);
				Ti.API.error("default date: " + default_date);
				var split = default_date.split('-');
				Ti.API.error("Split: " + split );
				var MM = myUtils.MONTH(split[1]);
				Ti.API.error("MM: " + MM);
				var converted_Date = MM + ' ' + split[2] + ', ' + split[0];
				Ti.API.error("Converted Date: " + converted_Date);
				//time
				var default_time = myUtils.amPmFormat(response.ride_time);
				var converted_Time = default_time.toString().toLowerCase();
				Ti.API.error("Converted Time: " + converted_Time);
				var unsplit = myUtils.timeFormat(response.ride_time);
				var split = unsplit.split(':');
				var customTime;
				if (split[0].length == 1) {
					customTime = "0" + split[0] + ':' + split[1];
				} else {
					customTime = split[0] + ':' + split[1];
				}
				Ti.API.error("Custom Time: " + customTime);
				
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
			Ti.API.error("Here too ....");
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
		Ti.API.error("Role : " + JSON.stringify(response) );
		var stsLabel = Ti.UI.createLabel({
			text : response.role == "Rider" ? " Rider" : " Driver",
			top : '3%',
			left : '55%',
			width : '13%',
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

		Ti.API.error("Here 1");

		height = height + 50;
		//25
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
		if( fromLocation.length <= 55 ) {
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
		} else {
			Ti.API.error("FromLocation1: " + fromLocation.substring(0,55));
			Ti.API.error("FromLocation2: " + fromLocation.substring(55, fromLocation.length));
			var fromLabel1 = Ti.UI.createLabel({
				text : fromLocation.substring(0,55),
				top : '1%',
				left : '20%',
				width : '95%',
				color : '#726859',
				font : {
					fontSize : '11sp',
					fontWeight : 'bold'
				}
			});
			var fromLabel2 = Ti.UI.createLabel({
				text : fromLocation.substring(55, fromLocation.length),
				top : '7%',
				left : '20%',
				width : '95%',
				color : '#726859',
				font : {
					fontSize : '11sp',
					fontWeight : 'bold'
				}
			});
			line2View.add(fromLabel1);
			line2View.add(fromLabel2);
			rows.add(line2View);
		}
		Ti.API.error("Here 2");
		
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
		
		Ti.API.error("Here 3");
		
		height = toLocation.lenght <= 50 ? height + 20 : height + 30;
		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var rider = Ti.UI.createLabel({
			text : response.role == "Rider" ? "Rider:" : "Driver: ",
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
			top : '1%',
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
		
		if( response.role == "Rider" ) {
			var acceptLabel = Ti.UI.createLabel({
				isYes : true,
				rideId : response.id,
				text : "Addt’l. $",
				top : '0%',
				left : '60%',
				width : '20%',
				textAlign : 'center',
				color : 'white',
				font : {
					fontSize : '15sp',
					fontWeight : 'bold'
				},
				backgroundColor : '#001E45',
				borderRadius : 1
			});
			line4View.add(acceptLabel);
		}
		rows.add(line4View);
		
		Ti.API.error("Here 4");
		
		height = height + 20;
		var line44View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});

		var amt;
		if( (response.amount).toString() == '0') {
			amt = "0.00";
		} else {
			if( (response.amount).toString().length > 2 ) {
				amt =  (response.amount).toString().substr(0, (response.amount).toString().length-2)+"."+ (response.amount).toString().substr((response.amount).toString().length-2);
			} else {
				amt = "0." + (response.amount).toString().substr(0, (response.amount).toString().length-2);
			}
		}
		Ti.API.error("Amount: " + amt);
		
		var tps;
		if((response.tip).toString() == "0" ) {
			tps = "0.00";
		} else {
			if( (response.tip).toString().length > 2 ) {
				tps = (response.tip).toString().substr(0, (response.tip).toString().length-2)+"."+ (response.tip).toString().substr((response.tip).toString().length-2);
			} else {
				tps = "0." + (response.tip).toString().substr((response.tip).toString().length-2);
			}
		}
		Ti.API.error("Tips: " + tps);
		
		var driverPay = 0;
		if( response.role == "Rider" ) {
			// Don't do any calculations ...
			var amountLbl = Ti.UI.createLabel({
				text : "Amount:",
				top : '0%',
				left : '5%',
				width : '20%',
				color : '#B6B398',
				font : {
					fontSize : '15sp',
				}
			});
			line44View.add(amountLbl);
			
			var amount = Ti.UI.createLabel({
				text : amt,
				top : '0%',
				left : '25%',
				width : 'auto',
				height : 'auto',
				color : '#786658',
				font : {
					fontSize : '14sp'
				}
			});
			line44View.add(amount);
			
			var tipsLbl = Ti.UI.createLabel({
				text : "Addt’l. $:",
				top : '0%',
				left : '50%',
				width : '20%',
				color : '#B6B398',
				font : {
					fontSize : '15sp',
				}
			});
			line44View.add(tipsLbl);
			
			var tipsAmount = Ti.UI.createLabel({
				text : tps,
				top : '0%',
				left : '70%',
				width : 'auto',
				height : 'auto',
				color : '#786658',
				font : {
					fontSize : '14sp'
				}
			});
			line44View.add(tipsAmount);
		} else {
			var driverPay = parseFloat(amt) + parseFloat(tps);
			Ti.API.info("DriverPay: " + driverPay );
			if( response.uRideType == "R" ) {
				driverPay = driverPay * (1.0 - parseFloat(ucorsaCommissionForSingleRide)/100.0);
			} else {
				driverPay = driverPay * (1.0 - parseFloat(ucorsaCommissionForCarPool)/100.0);
			}
			Ti.API.info("DriverPay: " + driverPay );			
			driverPay = driverPay.toFixed(2);
			Ti.API.info("DriverPay Rounded to 2 decimal digits : " + driverPay );
			
			var amountLbl = Ti.UI.createLabel({
				text : "Amount:",
				top : '0%',
				left : '5%',
				width : '20%',
				color : '#B6B398',
				font : {
					fontSize : '15sp',
				}
			});
			line44View.add(amountLbl);
			
			var amount = Ti.UI.createLabel({
				text : "$"+driverPay,
				top : '0%',
				left : '25%',
				width : 'auto',
				height : 'auto',
				color : '#786658',
				font : {
					fontSize : '14sp'
				}
			});
			line44View.add(amount);
		}
		rows.add(line44View);

		height = height + 35;
		var line5View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		
		var statusMsg = response.status;
		Ti.API.error("StatusMsg : " + statusMsg );

		var statusLabel = Ti.UI.createLabel({
			text : statusMsg,
			top : '0%',
			left : '10%',
			width : '90%',
			color : '#786658',
			font : {
				fontSize : '15sp',
				fontWeight : 'bold'
			},
			textAlign : 'center'
		});
		line5View.add(statusLabel);
		rows.add(line5View);
		return rows;
	} catch(err) {
		//alert(err);
	}
}



function show_all_messages_orig(response) {
	try {
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
		if (response.uRideType == "R") {
			if (response.end_date && response.ride_time != null) {
				//date
				var default_date = response.end_date.substring(0, 10);
				//alert('default_date '+ default_date);
				var split = default_date.split('-');
				var MM = myUtils.MONTH(split[1]);
				var converted_Date = MM + ' ' + split[2] + ', ' + split[0];
				//time
				var default_time = myUtils.amPmFormat(response.ride_time);
				var converted_Time = default_time.toString().toLowerCase();
				var dateLabel = Ti.UI.createLabel({
					text : converted_Date + "   " + myUtils.timeFormat(response.ride_time) + converted_Time,
					top : '10%',
					left : '5%',
					width : '80%',
					color : '#726859',
					font : {
						fontSize : '17sp',
						fontWeight : 'bold'
					}
				});
				line1View.add(dateLabel);
			}
		}
		if (response.uRideType == "C") {
			var Rtype = Ti.UI.createLabel({
				text : "C",
				top : '7.5%',
				left : '5%',
				width : '6%',
				color : 'white',
				backgroundColor : "#001E45",
				borderRadius : 1,
				textAlign : 'center',
				font : {
					fontSize : '18sp',
					fontWeight : 'bold'
				}
			});
			line1View.add(Rtype);
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
				text : customTime + converted_Time,
				top : '8%',
				left : '15%',
				width : '35%',
				color : '#726859',
				font : {
					fontSize : '17sp',
					fontWeight : 'bold'
				}
			});
			line1View.add(timelabel);
		}
		rows.add(line1View);
		height = height + 50;
		//25
		var line2View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		rows.add(line2View);
		var from = Ti.UI.createLabel({
			text : "From:",
			top : '0%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '15sp'
			}
		});
		line2View.add(from);
		var fromLabel = Ti.UI.createLabel({
			text : response.from_location,
			top : '0%',
			left : '25%',
			width : '70%',
			color : '#726859',
			font : {
				fontSize : '12sp',
			}
		});
		line2View.add(fromLabel);
		height = height + 35;
		var line3View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});
		var to = Ti.UI.createLabel({
			text : "To:",
			top : '0%',
			left : '5%',
			width : '15%',
			color : '#B6B398',
			font : {
				fontSize : '15sp',
			}
		});
		var toLabel = Ti.UI.createLabel({
			text : response.to_location,
			top : '0%',
			left : '25%',
			width : '70%',
			color : '#726859',
			font : {
				fontSize : '12sp'
			}
		});
		line3View.add(to);
		line3View.add(toLabel);
		rows.add(line3View);
		height = height + 35;
		var line4View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});

		var rider = Ti.UI.createLabel({
			text : "Rider:",
			top : '0%',
			left : '5%',
			width : '20%',
			color : '#B6B398',
			font : {
				fontSize : '15sp',
			}
		});
		line4View.add(rider);
		var rider_name = Ti.UI.createLabel({
			text : response.first_name,
			top : '0%',
			left : '25%',
			width : 'auto',
			height : 'auto',
			color : '#786658',
			font : {
				fontSize : '14sp'
			}
		});
		line4View.add(rider_name);
		rows.add(line4View);
		height = height + 35;
		var line44View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});

		var amount_ = Ti.UI.createLabel({
			text : "Amount:",
			top : '0%',
			left : '5%',
			width : '20%',
			color : '#B6B398',
			font : {
				fontSize : '15sp',
			}
		});
		line44View.add(amount_);
		var amt;
		if( (response.amount).toString() == '0') {
			amt = "0.00";
		} else {
			amt =  (response.amount).toString().substr(0, (response.amount).toString().length-2)+"."+ (response.amount).toString().substr((response.amount).toString().length-2);
		}
		var tps;
		if((response.tip).toString() == "0" ) {
			tps = "0.00";
		} else {
			tps = (response.tip).toString().substr(0, (response.tip).toString().length-2)+"."+ (response.tip).toString().substr((response.tip).toString().length-2);
		}
		var amount = Ti.UI.createLabel({
			text : amt + '     ' + 'Addt’l. $:  ' + tps,
			top : '0%',
			left : '25%',
			width : 'auto',
			height : 'auto',
			color : '#786658',
			font : {
				fontSize : '14sp'
			}
		});
		line44View.add(amount);

		rows.add(line44View);
		height = height + 35;
		var line5View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});

		var statusLabel = Ti.UI.createLabel({
			text : response.status,
			top : '0%',
			right : '15%',
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
		height = height + 35;
		rows.height = height;

		rows.addEventListener('click', function(e) {
			if (e.source.isYes) {
				$.dialog.show();
			}
		});
		return rows;
	} catch(err) {
		//alert(err);
	}
}

function getuCorsaCommissionRateForSingleRide() {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("GET", "https://api.ucorsa.com/api/rides/uRideFare");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.onload = function() {
		var rows = JSON.parse(this.responseText);
		Ti.API.error("Rows[0] : " + JSON.stringify(rows[0]));
		ucorsaCommissionForSingleRide = rows[0].Ride_ucorsa_fee_percent; 
		Ti.API.error("uComission For Single Ride : " + ucorsaCommissionForSingleRide);
		getuCorsaCommissionRateForCarPool();
	};
	xhr.send();
}

function getuCorsaCommissionRateForCarPool() {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("GET", "https://api.ucorsa.com/api/carpool/uCarpoolFare");
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.onload = function() {
		var rows = JSON.parse(this.responseText);
		Ti.API.error("Rows[0] : " + JSON.stringify(rows[0]));
		ucorsaCommissionForCarPool = rows[0].Ride_ucorsa_fee_percent; 
		Ti.API.error("uComission For Car Pool : " + ucorsaCommissionForCarPool);
		service_call();
	};
	xhr.send();
}

/////////////////////////////////
// Android Back button click
////////////////////////////////
function closeWindow() {
	//Ti.API.info("closeWindow event called in uPaymentHistory Tab.");

	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
	Alloy.createController('home1').getView().open();
}
