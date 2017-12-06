var args = arguments[0] || {};
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
var collection = Alloy.createCollection("get_Debit_Card");
/////////////////////////////////
//window onload
////////////////////////////////
//var dispatcher = require('dispatcher');
function loadfromservice() {
	Alloy.Globals.openWindows.push({
		'Debit' : $.win
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Bank Details";
			}
			var menuItem2 = null;
			activity.onCreateOptionsMenu = function(e) {
				menuItem2 = e.menu.add({
					icon : "/common/add.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem2.addEventListener("click", function(e) {
					AddPay();
				});
			};
			try {
				activity.invalidateOptionsMenu();
			} catch(err) {
				Ti.API.info(err);
			}
		}
	}
	SeviceCall();
	Ti.App.Properties.setBool("Card_SETTINGS", true);
	//}
}

refreshObject.on('saveBankDetails', function(msg) {
	Ti.API.info("Got Trigger saveBankDetails ... Msg : " + JSON.stringify(msg));
	saveBankDetails();
});

//bind event\\
//dispatcher.on('Reload_CardDetails_debit', SeviceCall);
// refreshObject.on('Reload_CardDetails_debit',function(msg) {
  // SeviceCall();
// });

function SeviceCall() {
	try{
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
			alert("Login session expired, please login again.");
			if (parseResponse.status == 401) {	
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
	}catch(err){
		Ti.API.info(err);
	}
}

function loaddata(response) {
	try{
	$.nodata.hide();
	// alert(JSON.stringify(response));
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
	if (response.account_type == "debitCard") {
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
	if (response.account_type == "debitCard") {
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
			//text : "********" + response.last4digits + '   Routing No: ' + response.routing_number,
			text : "********" + response.last4digits,
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
		} else if (e.source.objName == 'RowClick') {
		}
	});
	return rows;
	}catch(err){
		Ti.API.info(err);
	}
}

function help(){
	alert('Add Bank Details to get paid for rides you drive.');
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
			// alert("Server Status : " + response.status);
			if (response.status == 401) {
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
	Ti.App.Properties.setBool("Card_SETTINGS", true);
	var win = Alloy.createController('uBankDetails', { parentWindow : "ListBankAccounts" } ).getView();
	win.open({
		modal : true
	});
}


function saveBankDetails() {
	
	var bankTokenDetails = Ti.App.Properties.getObject('bankTokenDetails', "");
	if( bankTokenDetails != undefined && bankTokenDetails != null ) {
		var mdlObject = {};
		mdlObject.dob = bankTokenDetails.dob,
		mdlObject.address = bankTokenDetails.userAddress,
		mdlObject.accounts = {
			role : "Driver",
			bank : {
				number : bankTokenDetails.bankLast4Digits,
				account_type : "bank",
				token1 : bankTokenDetails.stripeToken,
				ssn : bankTokenDetails.ssnLast4Digits
			}
		};
		
		Ti.API.info("Bank Account Object : " + JSON.stringify(mdlObject));
		
		var collection_ = Alloy.createCollection("Add_Driver_Role");
		collection_.create( mdlObject, {
			success : function( collection, response ) {
			  SeviceCall();
			},
			error : function(err, response) {
				Ti.API.error("Error adding bank details ... Error = " + JSON.stringify(response));
				alert("Invalid bank details.  Please verify the details and try again.");
			}
		});
	} else {
		Ti.API.error("Bank Details Not available. Please provide bank details.");
		alert("Bank Details not found. Please provide bank details.");
	}
}

function WindowClose() {
	//dispatcher.off('Reload_CardDetails_debit', SeviceCall);
	// refreshObject.off('Reload_CardDetails_debit');
	refreshObject.off('saveBankDetails');
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;
}

$.win.open();

