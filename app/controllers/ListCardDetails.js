var args = arguments[0] || {};
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
var Network = require('networkCheck');
var collection = Alloy.createCollection("get_Credit_Card");
/////////////////////////////////
//window onload
////////////////////////////////

function loadfromservice() {
	Alloy.Globals.openWindows.push({
		'ListCardDetails' : $.win
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Add Credit Card";
			}
			var menuItem = null;
			activity.onCreateOptionsMenu = function(e) {
				menuItem = e.menu.add({
					icon : "/common/add.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem.addEventListener("click", function(e) {
					AddPay();
				});
			};
			try {
				activity.invalidateOptionsMenu();
			} catch(err) {
			}
		}
	}
	try {
		ServiceCall();
	} catch(err) {
		Ti.API.info(err);
	}
	Ti.App.Properties.setBool("Card_SETTINGS", false);
	//}
}

// refreshObject.on('Reload_CardDetails_credit', function(msg) {
	// ServiceCall();
// });

refreshObject.on('saveCreditCardDetails', function(msg) {
	Ti.API.info("Got Trigger saveCreditCardDetails ... Msg : " + JSON.stringify(msg));
	saveCreditCardDetails();
});

function ServiceCall() {
	try {
		collection.fetch({
			success : function(collection, response) {
				//alert(JSON.stringify(response));
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
	} catch(err) {
		Ti.API.info(err);
	}
}

function loaddata(response) {
	try {
		//Alloy.Globals.display_on_screen("Started... ListcardDetails.js....loaddata()", Ti.UI.NOTIFICATION_DURATION_SHORT);
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
			//rows.add(checkbox);
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
			//rows.add(checkbox);
		}
		/////row click event Listener////
		rows.addEventListener('change', function(e) {
			e.row.value = !e.row.value;
			if (e.row.value == true) {
				var _id_ = e.source._ID_;
				Alloy.createController('payForRide', {
					_Account_ID_ : _id_
				}).getView().open();
			} else {
				//alert('unchecked');
			}
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
		if (response.account_type == "bank") {
			var title2 = Ti.UI.createLabel({
				text : response.account_type,
				ID__ : response.id,
				top : '20%',
				left : '25%',
				color : '#786658',
				font : {
					fontSize : '20sp',
					fontWeight : 'bold',
					//fontStyle : 'italic'
				},
				objName : 'RowClick',
				ID__ : response.id,
			});
			rows.add(title2);
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
		if (response.account_type == "bank") {
			var title4 = Ti.UI.createLabel({
				text : "********" + response.last4digits + '   Routing No: ' + response.routing_number,
				top : '60%',
				left : '25%',
				color : '#786658',
				font : {
					fontSize : '15sp',
				},
				objName : 'RowClick',
				ID__ : response.id
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
		var delete_ = Ti.UI.createImageView({
			top : '33%',
			right : '1%',
			width : '30dp',
			height : '30dp',
			backgroundImage : '/icons/delete.png',
			objName : 'del',
			ID__ : response.id
		});
		rows.add(delete_);
		var edit_ = Ti.UI.createImageView({
			bottom : '5%',
			right : '15%',
			width : '30dp',
			height : '30dp',
			backgroundImage : '/editcard.png',
			objName : 'edit',
			ID__ : response.id
		});
		rows.addEventListener('click', function(e) {
			if (e.source.objName == 'del') {
				delete_card(e.source.ID__);
				$.tableview.deleteRow(e.row);
			} else if (e.source.objName == 'edit') {
				var model = collection.get(e.source.ID__);
				Alloy.createController('existingCard', model).getView().open();
			}
		});
		return rows;
	} catch(err) {
		Ti.API.info(err);
	}
}

//////////////////////////////////////////
//delete vehicle
///////////////////////////////////////////
function delete_card(ID) {
	var gModel = collection.get(ID);
	gModel.destroy({
		success : function(collection, response) {
			//alert("Card Details Deleted");
			loadfromservice();
		},
		error : function(err, response) {
		}
	});
}

function help() {
	alert('Credit Card is Needed to Pay for Rides.');
}

/////////////////////////////////
// Add new card Details
////////////////////////////////

// Ti.App.addEventListener('AddNewCreditCard', function() {
// Ti.App.Properties.setBool("Card_SETTINGS", false);
// Alloy.createController('AddNewCard_Bank').getView().open();
// });

function AddPay() {
	Ti.App.Properties.setBool("Card_SETTINGS", false);
	var win = Alloy.createController('uCreditCard', { parentWindow : "ListCreditCards" }).getView();
	win.open({
		modal : true
	});
}

function saveCreditCardDetails() {
	Ti.API.info("Done with adding a credit card. Continue with processing.");
	
	var ccTokenDetails = Ti.App.Properties.getObject('creditCardTokenDetails', "");
	
	Ti.API.info("ccTokenDetails : " + JSON.stringify(ccTokenDetails));
	
	if( ccTokenDetails != undefined && ccTokenDetails != null ) {
		
		var mdlObject = {
			accounts : {
				role : "Rider",
				card : {
					number : ccTokenDetails.ccLast4Digits,
					account_type : "creditCard",
					token1 : ccTokenDetails.stripeToken,
					expiry : ccTokenDetails.ccExpiryDate
				}
			}
		};	
		Ti.API.info("Credit Card Object : " + JSON.stringify(mdlObject));
		var collection_ = Alloy.createCollection("Add_Rider_Role");
		collection_.create( mdlObject, {
			success : function(collection, response) {
				Ti.API.info("Added Credit Card entry in table successfully.");
				ServiceCall();
			},
			error : function(err, response) {
				Ti.API.info("Error adding Credit Card entry in table. " + JSON.stringify(response));
				alert("Invalid Credit Card Details...");
			}
		});
	} else {
		Ti.API.error("Credit Card details not found.");
		alert("Credit Card details not found.  Please enter credit card details.");
	}
}

function WindowClose() {
	//dispatcher.off('Reload_CardDetails_credit', ServiceCall);
	// refreshObject.off('Reload_CardDetails_credit');
	refreshObject.off('saveCreditCardDetails');
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;
}

$.win.open();
