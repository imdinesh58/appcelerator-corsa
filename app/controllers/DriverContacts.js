var args = arguments[0] || {};
Ti.App.Properties.setBool('Drivers', false);
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
var moment = require('moment-with-locales.min');
var collection = Alloy.createCollection("Scheduled_drivers");
/////////////////////////////
//window onload
/////////////////////////////
function Contacts() {
	Alloy.Globals.openWindows.push({
		'DriverContacts' : $.winContacts
	});
	setTimeout(service_call_scheduledDrivers, 1000);
}

var createHeaderView = function(args) {
	var headerView = Ti.UI.createView({
		top : 0,
		left : 0,
		height : 50,
		width : 768,
		backgroundColor : '#322110'
	});
	var text1 = Ti.UI.createLabel({
		text : args.title,
		top : 2,
		left : 20,
		height : 50,
		color : 'white',
		font : {
			fontSize : '20sp',
			fontWeight : 'bold',
		}
	});
	headerView.add(text1);
	return headerView;
};

var Schedule;
var Individual;
var Group;
var sCheck = false;
var iCheck = false;
var gCheck = false;
function service_call_scheduledDrivers() {
	try {
		collection.fetch({
			urlparams : {
				search : args.search,
				date : args.date,
				time : args.time
			},
			success : function(collection, response) {
				var data = [];
				var scheduleSection = Ti.UI.createTableViewSection({
					headerView : createHeaderView({
						title : 'Scheduled',
						Schedule_ : Schedule
					})
				});
				var groupSection = Ti.UI.createTableViewSection({
					headerView : createHeaderView({
						title : 'Groups',
						Group_ : Group
					})
				});
				var individualSection = Ti.UI.createTableViewSection({
					headerView : createHeaderView({
						title : 'Individuals',
						Individual_ : Individual
					})
				});
				if( collection.length == 1 ) {
						Ti.API.error('Response : ' + JSON.stringify(response));
						if (response.type == 'G') {
							gCheck = true;
							groupSection.add(populateTableData(response));
						}
						if (response.type == 'I') {
							iCheck = true;
							individualSection.add(populateTableData(response));
						}
						if (response.type == 'S') {
							sCheck = true;
							scheduleSection.add(populateTableData(response));
						}
				} else {
					for( var i = 0 ; i < response.length; i++ ) {
						var obj = response[i];
						Ti.API.error('element ' + i + ' : ' + JSON.stringify(response[i]));
						if (obj.type == 'G') {
							gCheck = true;
							groupSection.add(populateTableData(obj));
						}
						if (obj.type == 'I') {
							iCheck = true;
							individualSection.add(populateTableData(obj));
						}
						if (obj.type == 'S') {
							sCheck = true;
							scheduleSection.add(populateTableData(obj));
						}
					};
				}
				if (!gCheck) {
					groupSection.add(populateData());
				}
				if (!sCheck) {
					scheduleSection.add(populateData());
				}
				if (!iCheck) {
					individualSection.add(populateData());
				}
				data.push(scheduleSection);
				data.push(individualSection);
				data.push(groupSection);

				$.tableview.setData([scheduleSection, individualSection, groupSection]);
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

function populateData() {
	var tableRowView = Ti.UI.createView({
		top : 0,
		left : 10,
		right : 10
	});
	var nodata = Ti.UI.createLabel({
		text : 'no drivers available',
		top : 2,
		left : 40,
		height : 40,
		color : '#786658',
		font : {
			fontSize : '20sp'
		}
	});
	tableRowView.add(nodata);
	var row = Ti.UI.createTableViewRow({
		height : 50
	});
	row.add(tableRowView);
	return row;
};
var ContactName;
var ContactId;
var ContactType;
var titleArray = [];
var idArray = [];
var typeArray = [];
var pickContact = 0;

function populateTableData(data) {
	try {
		var tableRowView = Ti.UI.createView({
			top : 0,
			left : 10,
			right : 10
		});
		var text1 = Ti.UI.createLabel({
			obj : "driver",
			text : data.firstName,
			ID : data.id,
			Lastname : data.lastName,
			TYPE : data.type,
			top : '25%',
			left : 60, //'3%',
			height : 32,
			color : '#786658',
			font : {
				fontSize : '12sp',
				fontWeight : 'bold'
			},
			isYes : true
		});
		tableRowView.add(text1);

		var image3 = Ti.UI.createImageView({
			TYPE : data.type,
			obj : "driver",
			ID : data.id,
			top : '25%',
			width : 30,
			height : 30,
			left : 15,
			backgroundImage : '/icons/u_drive_reverse.png'
		});
		if (data.type == "I" || data.type == "S") {
			tableRowView.add(image3);
		}

		var image4 = Ti.UI.createImageView({
			TYPE : data.type,
			obj : "driver",
			ID : data.id,
			top : '25%',
			width : 30,
			height : 30,
			right : "18%",
			backgroundImage : '/common/carr.png'
		});
		if (data.type == "I" || data.type == "S") {
			tableRowView.add(image4);
		}

		if (data.type == "I" || data.type == "S") {
			if (data.scheduledDrivers.length) {
				var img = Ti.UI.createImageView({
					objName : 'exp',
					right : '30%',
					top : '25%',
					width : 40,
					height : 40,
					ID__ : data.id,
					click : 'no',
					image : "/common/S1.png",
					DRIVERS : data.scheduledDrivers
				});
				tableRowView.add(img);
			}
		}

		var row = Ti.UI.createTableViewRow({
			height : 50,
			filter : data.firstName
		});
		row.add(tableRowView);

		if (OS_ANDROID) {
			var checkbox = Ti.UI.createSwitch({
				style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
				value : false,
				right : '1%',
				height : '30%',
				width : '5%',
				borderColor : '#786658',
				borderWidth : 2,
				width : '30dp',
				height : '30dp'
			});
			row.add(checkbox);
		}
		if (OS_IOS) {
			var checkbox = Ti.UI.createSwitch({
				value : false,
				right : '1%',
				height : '30%',
				width : '5%',
				width : '30dp',
				height : '30dp'
			});
			row.add(checkbox);
		}
		///
		row.addEventListener('click', function(e) {
			if (e.source.obj == "driver") {
				if (data.type == "I" || data.type == "S") {
					var collection = Alloy.createCollection("CarInfo");
					collection.fetch({
						urlparams : {
							user_id : e.source.ID
						},
						success : function(collection, response) {
							//alert('response ' + collection.length);
								if (collection.length == 0) {
									alert("Driver not added Vehicle info...");
								} else if (collection.length == 1) {							
									//alert("JSON " + JSON.stringify(response));								
									var height = 0;
									var rows = Titanium.UI.createTableViewRow({
										height : 380,
										backgroundColor : '#E3DED6',
										borderColor : '#001E45',
										borderWidth : 2
									});
									height = height + 5;

									var line1View = Ti.UI.createView({
										backgroundColor : '#E3DED6', //'#E1DCD7',
										top : height,
										left : '0%',
										width : '100%'
									});

									var make_ = Ti.UI.createLabel({
										text : "Car Make:",
										top : '10%',
										left : '20%',
										width : '30%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line1View.add(make_);

									var make = Ti.UI.createLabel({
										text : response.car_make,
										top : '10%',
										left : '50%',
										width : '50%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line1View.add(make);

									rows.add(line1View);
									height = height + 35;
									var line2View = Ti.UI.createView({
										backgroundColor : '#E3DED6',
										top : height,
										left : '0%',
										width : '100%'
									});
									var model_ = Ti.UI.createLabel({
										text : "Car Model:",
										top : '10%',
										left : '20%',
										width : '30%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line2View.add(model_);

									var model = Ti.UI.createLabel({
										text : response.car_model,
										top : '10%',
										left : '50%',
										width : '50%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line2View.add(model);

									rows.add(line2View);
									height = height + 30;
									var line3View = Ti.UI.createView({
										backgroundColor : '#E3DED6',
										top : height,
										left : '0%',
										width : '100%'
									});
									var yr = Ti.UI.createLabel({
										text : "Year:",
										top : '10%',
										left : '20%',
										width : '30%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line3View.add(yr);

									var yr_ = Ti.UI.createLabel({
										text : response.car_year,
										top : '10%',
										left : '50%',
										width : '50%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line3View.add(yr_);
									rows.add(line3View);
									height = height + 30;

									var line4View = Ti.UI.createView({
										backgroundColor : '#E3DED6',
										top : height,
										left : '0%',
										width : '100%'
									});
									var make_ = Ti.UI.createLabel({
										text : "Mileage:",
										top : '10%',
										left : '20%',
										width : '30%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line4View.add(make_);

									var make = Ti.UI.createLabel({
										text : response.car_mileage,
										top : '10%',
										left : '50%',
										width : '50%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line4View.add(make);
									rows.add(line4View);
									height = height + 30;

									//comment
									var line5View = Ti.UI.createView({
										backgroundColor : '#E3DED6',
										top : height,
										left : '0%',
										width : '100%'
									});
									var seats = Ti.UI.createLabel({
										text : "Seats:",
										top : '10%',
										left : '20%',
										width : '30%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line5View.add(seats);

									var seatss = Ti.UI.createLabel({
										text : response.car_seats,
										top : '10%',
										left : '50%',
										width : '50%',
										color : 'black',
										font : {
											fontSize : '16sp',
											fontWeight : 'bold'
										}
									});
									line5View.add(seatss);
									rows.add(line5View);
									height = height + 40;
									rows.height = height;
									
									var modal = require('carinfo');
									var MY_Model = new modal();
									MY_Model.tableView.appendRow(rows);
									MY_Model.closeButton.addEventListener('click', function() {
										MY_Model.myModal.close();
									});
								} else {
									//alert("response " + response.length);
									var _data_ = [];
									for (var i = 0; i < response.length; i++) {
										//alert('collection ' + JSON.stringify(collection[i]));
										var height = 0;
										var rows = Titanium.UI.createTableViewRow({
											height : 380,
											backgroundColor : '#E3DED6',
											borderColor : '#001E45',
											borderWidth : 2
										});
										_data_.push(rows);
										height = height + 5;

										var line1View = Ti.UI.createView({
											backgroundColor : '#E3DED6', //'#E1DCD7',
											top : height,
											left : '0%',
											width : '100%'
										});

										var make_ = Ti.UI.createLabel({
											text : "Car Make:",
											top : '10%',
											left : '20%',
											width : '30%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line1View.add(make_);

										var make = Ti.UI.createLabel({
											text : response[i].car_make,
											top : '10%',
											left : '50%',
											width : '50%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line1View.add(make);

										rows.add(line1View);
										height = height + 35;
										var line2View = Ti.UI.createView({
											backgroundColor : '#E3DED6',
											top : height,
											left : '0%',
											width : '100%'
										});
										var model_ = Ti.UI.createLabel({
											text : "Car Model:",
											top : '10%',
											left : '20%',
											width : '30%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line2View.add(model_);

										var model = Ti.UI.createLabel({
											text : response[i].car_model,
											top : '10%',
											left : '50%',
											width : '50%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line2View.add(model);

										rows.add(line2View);
										height = height + 30;
										var line3View = Ti.UI.createView({
											backgroundColor : '#E3DED6',
											top : height,
											left : '0%',
											width : '100%'
										});
										var yr = Ti.UI.createLabel({
											text : "Year:",
											top : '10%',
											left : '20%',
											width : '30%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line3View.add(yr);

										var yr_ = Ti.UI.createLabel({
											text : response[i].car_year,
											top : '10%',
											left : '50%',
											width : '50%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line3View.add(yr_);
										rows.add(line3View);
										height = height + 30;

										var line4View = Ti.UI.createView({
											backgroundColor : '#E3DED6',
											top : height,
											left : '0%',
											width : '100%'
										});
										var make_ = Ti.UI.createLabel({
											text : "Mileage:",
											top : '10%',
											left : '20%',
											width : '30%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line4View.add(make_);

										var make = Ti.UI.createLabel({
											text : response[i].car_mileage,
											top : '10%',
											left : '50%',
											width : '50%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line4View.add(make);
										rows.add(line4View);
										height = height + 30;

										//comment
										var line5View = Ti.UI.createView({
											backgroundColor : '#E3DED6',
											top : height,
											left : '0%',
											width : '100%'
										});
										var seats = Ti.UI.createLabel({
											text : "Seats:",
											top : '10%',
											left : '20%',
											width : '30%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line5View.add(seats);

										var seatss = Ti.UI.createLabel({
											text : response[i].car_seats,
											top : '10%',
											left : '50%',
											width : '50%',
											color : 'black',
											font : {
												fontSize : '16sp',
												fontWeight : 'bold'
											}
										});
										line5View.add(seatss);
										rows.add(line5View);
										height = height + 40;
										rows.height = height;

									}
									var modal = require('carinfo');
									var MY_Model = new modal();
									MY_Model.tableView.setData(_data_);
									MY_Model.closeButton.addEventListener('click', function() {
										MY_Model.myModal.close();
									});
								}
						},
						error : function(err, response) {
						}
					});
				}
			} else if (e.source.objName == 'exp') {
				if (e.source.click == 'no') {
					e.source.click = 'yes';
					var frequencies = e.source.DRIVERS;
					length = e.index;
					e.source.image = "/common/S2.png";
					Ti.API.info("frequencies  " + JSON.stringify(frequencies));
					for ( i = 0; i < frequencies.length; i++) {
						// reset color
						$.tableview.insertRowAfter(length, populateList(frequencies[i]));
						length = length + 1;
					}
				} else {
					if (e.source.click == 'yes') {
						e.source.click = 'no';
						var frequencies = e.source.DRIVERS;
						e.source.image = "/common/S1.png";
						length = frequencies.length;
						for ( i = 0; i < frequencies.length; i++) {
							//add color
							$.tableview.deleteRow(e.index + 1);
						}
					}
				}
			}
		});

		/////row click event Listener////
		row.addEventListener('change', function(e) {
			e.row.value = !e.row.value;

			if (e.row.value == true) {
				pickContact += 1;
				titleArray.push(e.row.children[0].children[0].text);
				idArray.push(e.row.children[0].children[0].ID);
				typeArray.push(e.row.children[0].children[0].TYPE);
			} else {
				pickContact -= 1;
				var idx;
				// delete the unselected entry from the arrays
				idx = titleArray.indexOf(e.row.children[0].children[0].text);
				if (idx > -1) {
					titleArray.splice(idx, 1);
				}
				idx = idArray.indexOf(e.row.children[0].children[0].ID);
				if (idx > -1) {
					idArray.splice(idx, 1);
				}
				idx = typeArray.indexOf(e.row.children[0].children[0].TYPE);
				if (idx > -1) {
					typeArray.splice(idx, 1);
				}
			}
			ContactName = titleArray.join(",");
			ContactId = idArray.join(",");
			ContactType = typeArray.join(",");
		});
		return row;
	} catch(err) {
		Ti.API.error(err);
	}
};

function populateList(lists) {
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

	var default_response = lists.type;
	var RESPONS = default_response.toString().toUpperCase();

	//time 1
	Ti.API.info("lists " + lists.start_time + "  >>> " + lists.end_time);

	//time
	var unsplit = timeUtil.timeFormat(lists.start_time);
	var split = unsplit.split(':');
	var customTime;
	if (split[0].length == 1) {
		customTime = "0" + split[0] + ':' + split[1];
	} else {
		customTime = split[0] + ':' + split[1];
	}

	var unsplit2 = timeUtil.timeFormat(lists.end_time);
	var split2 = unsplit2.split(':');
	var customTime2;
	if (split2[0].length == 1) {
		customTime2 = "0" + split2[0] + ':' + split2[1];
	} else {
		customTime2 = split2[0] + ':' + split2[1];
	}

	var startTime = customTime + ' ' + timeUtil.amPmFormat(lists.start_time);
	var endTime = customTime2 + ' ' + timeUtil.amPmFormat(lists.end_time);
	var dateLabela = Ti.UI.createLabel({
		text : "Status: " + RESPONS + " - " + lists.description + "        Date: " + moment.utc(lists.drive_date).format('MMM Do') + "       Time: " + startTime + " to " + endTime,
		top : '35%',
		left : '1%',
		width : '99%',
		color : '#726859',
		height : 'auto',
		textAlign : 'center',
		font : {
			fontSize : '10sp',
			fontWeight : 'bold'
		}
	});
	line2View.add(dateLabela);

	rows.add(line2View);
	height = height + 60;
	rows.height = height;

	return rows;
}

function done() {
	if (pickContact == 0) {
		alert('You must pick atleast one');
	} else {
		closeWindow();
		refreshObject.trigger('CONTACT_Name', {
			'contact_Name' : ContactName
		});
		refreshObject.trigger('CONTACT_ID_TYPE', {
			'contact_Id' : ContactId,
			'contact_Type' : ContactType
		});
	}
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.winContacts.close();
	$.winContacts = null;
}

function add() {
	done();
}

$.winContacts.open();
