var args = arguments[0] || {};
/////////////////////////////////////////////////////
//window onload
//////////////////////////////////////////////////////
var myUtils = require('util');
var ucorsaCommissionForSingleRide = 0;
var ucorsaCommissionForCarPool = 0;

function load() {
	$.nodata.hide();
	getuCorsaCommissionRateForSingleRide();
}

function service_call() {
	var collection = Alloy.createCollection("TodaysPayment");
	try {
		collection.fetch({
			success : function(collection, response) {
				var data = [];
				// Ti.API.error("Today Payment Response: " + JSON.stringify(response));
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
//var DD;

var TIPS;
function show_all_messages(response) {
	try {
		// Ti.API.error("Payment " + JSON.stringify(response));
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
		
		if( response.role == "Rider" ) {
			var acceptLabel = Ti.UI.createLabel({
				isYes : true,
				rideId : response.id,
				text : "Add more $",
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
		
		height = height + 20;
		var line44View = Ti.UI.createView({
			backgroundColor : '#E3DED6',
			top : height,
			left : '0%',
			width : '100%'
		});

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

		var amt;
		if( (response.amount).toString() == '0') {
			amt = "0.00";
		} else {
			amt =  (response.amount).toString().substr(0, (response.amount).toString().length-2)+"."+ (response.amount).toString().substr((response.amount).toString().length-2);
		}
		Ti.API.error("Amount : " + amt);
		
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
		Ti.API.error("Tips : " + tps);
				
		if( response.role == "Rider" ) {
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
		} else {
			var driverPay = parseFloat(amt) + parseFloat(tps);
			Ti.API.info("DriverPay: " + driverPay );
			if( response.uRideType == "R" ) {
				var commission = parseFloat(ucorsaCommissionForSingleRide);
				Ti.API.info("commission: " + commission );
				commission = commission / 100.0;
				Ti.API.info("commission: " + commission );
				commission = 1.0 - commission;
				Ti.API.info("commissiong: " + commission );
				driverPay = driverPay * commission ;
				Ti.API.info("DriverPay: " + driverPay );
			} else {
				driverPay = driverPay * (1.0 - parseFloat(ucorsaCommissionForCarPool)/100.0);
			}
			Ti.API.info("DriverPay: " + driverPay );
			// Math.round(num + "e+2")  + "e-2"
			// var numb = 123.23454;
			// numb = numb.toFixed(2);
			//
			// rounding to the nearest 2 digits
			
			driverPay = driverPay.toFixed(2);
			Ti.API.info("DriverPay Rounded to 2 decimal digits : " + driverPay );
			
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
		
		var statusMsg;
		if( response.role == "Rider" ) {
			statusMsg = "Card will be Charged Tonight";
		} else {
			statusMsg = "You will be paid in the next cycle";
		}

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
		height = height + 35;
		rows.height = height;

		rows.addEventListener('click', function(e) {
			if (e.source.isYes) {
				Ti.App.Properties.setString('RIDE__ID', e.source.rideId);
				//popupTips.js
				var PopUP = require('popupTips');
				var MY_Model = new PopUP();
				
				MY_Model.closeButton.addEventListener('click', function() {
					MY_Model.myModal.close();
					MY_Model.myModal = null;
				});

				MY_Model.doneButton.addEventListener('click', function() {
					if (MY_Model.textFIELD.value == "") {
						TIPS = "0.00";
					} else {
						var pts = MY_Model.textFIELD.value.indexOf(".");
						var lgth = MY_Model.textFIELD.value.length;
						
						if( MY_Model.textFIELD.value.indexOf(".") > 0 ) {
							if( lgth - (pts+1) == 2 ) {
								TIPS = MY_Model.textFIELD.value;
								// choose(TIPS);
								POST(TIPS, Ti.App.Properties.getString('RIDE__ID', ''));
								MY_Model.myModal.close();
								MY_Model.myModal = null;
							} else {
								alert("Extra Amount entered in wrong format.  Please enter the amount in x.xx format.");
								MY_Model.textFIELD.value = "";
							}
						} else {
							alert("Extra Amount entered in wrong format.  Please enter the amount in x.xx format.");
							MY_Model.textFIELD.value = "";
						}
					}
				});
			}
		});
		return rows;
	} catch(err) {
		//alert(err);
	}
}

function choose(myTips) {
	var ID__ = Ti.App.Properties.getString('RIDE__ID', '');
	POST(myTips, ID__);
}

function POST(MyTips_, ID___) {
	var aUser = Alloy.createModel("AddTips");
	var params = {
		transactionId : ID___,
		tip : MyTips_
	};
	Ti.API.error("Tip Amount to DB: " + MyTips_);
	aUser.save(params, {
		success : function(model, response) {
			//alert(response.message);
			Ti.API.error("Save to DB success, Calling the back end service");
			service_call();
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
	//Ti.API.info("closeWindow event called in uPaymentCurrent Tab.");

	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
	Alloy.createController('home1').getView().open();
}
