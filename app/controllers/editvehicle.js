var args = arguments[0] || {};
var collection = Alloy.createCollection("myVehicle");
var timeUtil = require('util');
/////////////////////////////////
//window onload
////////////////////////////////

var refreshObject = timeUtil.refreshEvent();
refreshObject.on('LoadVehicles',function(msg) {
  loadfromservice();
});

function loadfromservice() {
	try{
	Alloy.Globals.openWindows.push({
		'editVehicle' : $.win1
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                        Vehicles";
			}
		}
	}
	collection.fetch({
		success : function(collection, response) {	
			var data = [];
			_.each(collection.models, function(element, index, list) {
				data.push(loaddata(element.attributes));
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
	}catch(err){}
}

function loaddata(response) {
	try{
	//Alloy.Globals.display_on_screen("Started... EditVehicle.js....loaddata()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	$.nodata.hide();
	var rows = Ti.UI.createTableViewRow({
		height : 100,
		backgroundColor : '#E3DED6',
		borderWidth : 2
	});
	var title2 = Ti.UI.createLabel({
		text : 'Make:  ' + response.car_make + '  Model:  ' + response.car_model,
		top : '20%',
		left : '22%',
		color : '#786658',
		font : {
			fontSize : '14sp'
		}
	});
	rows.add(title2);
	var title3 = Ti.UI.createLabel({
		text : 'Miles: ' + response.car_mileage + ' Year: ' + response.car_year + ' Seats: ' + response.car_seats,
		top : '60%',
		left : '22%',
		color : '#786658',
		font : {
			fontSize : '14sp'
		}
	});
	rows.add(title3);
	var image3 = Ti.UI.createImageView({
		top : '30%',
		width : 40,
		height : 40,
		left : '4%',
		backgroundImage : '/icons/u_drive_reverse.png'
	});
	rows.add(image3);
	var delete_ = Ti.UI.createImageView({
		top : '15%',
		right : '1%',
		width : '30dp',
		height : '30dp',
		backgroundImage : '/icons/delete.png',
		objName : 'del',
		ID__ : response.id
	});
	rows.add(delete_);
	rows.addEventListener('click', function(e) {
		if (e.source.objName == 'del') {
			delete_vehicle(e.source.ID__);
			$.tableview.deleteRow(e.row);
		}
	});
	return rows;
	}catch(err){}
}

//////////////////////////////////////////
//delete vehicle
///////////////////////////////////////////
function delete_vehicle(ID) {
	//Alloy.Globals.display_on_screen("Started... EditVehicle.js....deleteVehicle()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var gModel = collection.get(ID);
	gModel.destroy({
		success : function(collection, response) {
			//alert("Vehicle Deleted");
			loadfromservice();
		},
		error : function() {
			//alert("Failed to delete datas from Service - this is not good!");
		}
	});
}

Ti.App.addEventListener('AddNewVehicle', function() {
	Alloy.createController('addVehicle').getView().open();
});

function add() {
	//Ti.Media.vibrate();
	Alloy.createController('addVehicle').getView().open();
}

function WindowClose() {
	//dispatcher.off('LoadVehicles', loadfromservice);
	refreshObject.off('LoadVehicles');
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;

}

$.win1.open();
