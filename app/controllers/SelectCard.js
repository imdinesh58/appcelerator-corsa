var args = arguments[0] || {};

var collection = Alloy.createCollection("get_Credit_Card");

var timeUtil = require('util');

var refreshObject = timeUtil.refreshEvent();
var RideID_fromLib;
var managedID;
/////////////////////////////////
// Service Call
////////////////////////////////
function loadfromservice() {
	Alloy.Globals.openWindows.push({
		'selectCard' : $.win
	});
	Ti.App.Properties.setString('window', '_ListCard_');
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Select Card to Add Tips";
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
}

var MID = Alloy.Models.instance('managedID');

refreshObject.on('_SelectCard_', function(msg) {
	RideID_fromLib = msg._RIDE_ID;
	if (msg.Managed_ID == undefined || msg.Managed_ID == "") {
	} else {
		//managedID = msg.Managed_ID;
		managedID = MID.get('managedID');
	}
	loadfromservice();
});

function loaddata(response) {
	try {
		$.nodata.hide();
		var rows = Ti.UI.createTableViewRow({
			height : 90,
			backgroundColor : '#E3DED6',
			borderWidth : 5,
			objName : 'RowClick',
			ID__ : response.id
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
				_ID_ : response.id
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
				_ID_ : response.id
			});
			rows.add(checkbox);
		}
		/////row click event Listener////
		rows.addEventListener('change', function(e) {
			Alloy.createController('payForRide', {
				_Account_ID_ : e.source._ID_,
				ManagedID : managedID
			}).getView().open();
		});

		if (response.account_type == "creditCard") {
			var title1 = Ti.UI.createLabel({
				text : response.account_type,
				ID__ : response.id,
				top : '20%',
				left : '25%',
				color : '#786658',
				font : {
					fontSize : '20sp',
					fontWeight : 'bold',
				},
				objName : 'RowClick',
				ID__ : response.id,
			});
			rows.add(title1);
		}

		if (response.account_type == "creditCard") {
			var title3 = Ti.UI.createLabel({
				text : "**** **** **** " + response.last4digits,
				top : '60%',
				left : '25%',
				color : '#786658',
				font : {
					fontSize : '15sp',
					//fontStyle : 'italic'
				},
				objName : 'RowClick',
				ID__ : response.id
			});
			rows.add(title3);
		}
		var image3 = Ti.UI.createImageView({
			top : '25%',
			width : 40,
			height : 40,
			left : '1%',
			backgroundImage : '/icons/pay_reverse.png'
		});
		rows.add(image3);
		return rows;
	} catch(err) {
	}
}

//////////////////////////////////////////
//delete vehicle
///////////////////////////////////////////
function delete_card(ID) {
	//Alloy.Globals.display_on_screen("Started... ListcardDetails.js....delete_card()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var gModel = collection.get(ID);
	gModel.destroy({
		success : function(collection, response) {
			alert("Card Details Deleted");
			loadfromservice();
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
}

/////////////////////////////////
// Add new card Details
////////////////////////////////
function AddPay() {
	Ti.App.Properties.setBool("Card_SETTINGS", false);
	// Alloy.createController('AddNewCard_Bank').getView().open();
	var win = Alloy.createController('uCreditCard', {  parentWindow : "SelectCard" } ).getView();
	win.open({
		modal : true
	});
}

function WindowClose() {
	refreshObject.off('_SelectCard_');
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;

}

$.win.open();
