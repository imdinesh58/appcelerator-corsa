var args = arguments[0] || {};
//////////////////////////////////////////
// importing js from lib folder
///////////////////////////////////////////
var client = require('http_client');
var address_ = Alloy.createCollection("myAddress");
var user_ = Alloy.createModel("updateUsers_Account");
//////////////////////////////////////////
// window load
///////////////////////////////////////////
var Network = require('networkCheck');
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();

function load() {
	Alloy.Globals.openWindows.push({
		'userProfile' : $.win1
	});
	ReadOnly();
	////Ti.API.info('Loading userprofile.js....');
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                    Address";
			}
		}
	}
	loadfromservice();
	getAddress();
	//}
}

refreshObject.on('LoadAddress',function(msg) {
  getAddress();
});

function ReadOnly() {
	$.firstname.enabled = false;
	$.phone.enabled = false;
	$.email.enabled = false;
	$.update.visible = false;
	//
	$.firstname.blur();
	$.phone.blur();
	$.email.blur();
}

//////////////////////////////////////////
//  text field - Read only disable
///////////////////////////////////////////
function readonlydisable() {
	Ti.Media.vibrate();
	$.firstname.focus();
	$.update.visible = true;
	$.firstname.enabled = true;
	$.email.enabled = true;
}

/////////////////////////////////
// Add new address - event listener
////////////////////////////////
function addaddress() {
	//alert("You clicked address");
	Alloy.createController('mapview2').getView().open();
}

/////////////////////////////
//validate email
/////////////////////////////
var isValidEmail = false;
var validateEmail;
function validateInput() {
	//Alloy.Globals.display_on_screen("Started... userprofile.js....validateInput()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var _email = $.email.value;
	validateEmail = /([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/g;
	if (validateEmail.test(_email) && _email !== '') {
		isValidEmail = true;
	} else {
		if (_email === '') {
			alert('Enter a valid E-mail ');
			$.email.value = "";
			$.email.focus();
		} else {
			alert(_email + ' is invalid E-mail.\nPlease enter a valid E-mail ');
			$.email.value = "";
			$.email.focus();
		}
	}
}

///// validate check /////
function save() {
	//Alloy.Globals.display_on_screen("Started... userprofile.js....save()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	if ($.firstname.value == "") {
		alert("Enter name");
		$.firstname.focus();
	} else if ($.email.value == "") {
		alert("Enter mail id");
		$.email.focus();
	} else if (isValidEmail == false) {
		validateInput();
	} else {
		updatetodatabase();
		$.firstname.enabled = false;
		$.email.enabled = false;
		$.update.visible = false;
	}
}

//////////////////////////////////////////
//  service call - get
///////////////////////////////////////////
function loadfromservice() {
	//Alloy.Globals.display_on_screen("Started... userprofile.js....loadfromservice()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	user_.fetch({
		success : function(model, response) {
			$.firstname.value = response.first_name;
			$.phone.value = response.phone;
			$.email.value = response.email;
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			//alert("session expired, please log back.");
			if (parseResponse.status == 401) {	
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

function updatetodatabase() {
	//Alloy.Globals.display_on_screen("Started... userprofile.js....updatetodatabase()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var url = Alloy.CFG.url + "/api/users";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		var response = JSON.parse(this.responseText);
		alert(response.message);
	};
	xhr.onerror = function() {
		alert(this.responseText);
		//alert("API error status:" + xhr.status + ". " + xhr.statusText);
		if (xhr.status == 401) {
			var timeUtil = require('util');
			timeUtil.closeAllOpenWindows();
			Alloy.createController('signin').getView().open();
		}
	};
	xhr.open("PUT", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	var random_generated_token = Ti.App.Properties.getString('tokenaccess', '');
	xhr.setRequestHeader('access-token', random_generated_token);
	var post = {
		user : {
			first_name : $.firstname.value,
			email : $.email.value
		}
	};
	xhr.send(JSON.stringify(post));
	//Alloy.Globals.display_on_screen("User Details Updated", Ti.UI.NOTIFICATION_DURATION_LONG);
}

////get getAddress();
function getAddress() {
	address_.fetch({
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
			//alert("session expired, please log back.");
			if (parseResponse.status == 401) {	
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

/// populate data in tableview
function loaddata(response) {
	$.nodata.hide();
	var rows = Ti.UI.createTableViewRow({
		//title : sss.contacts[i].name,
		height : 50,
		backgroundColor : '#E3DED6',
		borderWidth : 2
	});
	var title2 = Ti.UI.createLabel({
		//text : response.address1+'          '+response.address2,
		text : response.address1,
		top : '30%',
		left : '22%',
		color : '#786658',
		font : {
			fontSize : '11sp'
		},
		height : 'auto',
		width : '70%',
		textAlign : 'left'
	});
	rows.add(title2);
	if (OS_ANDROID) {
		var image3 = Ti.UI.createImageView({
			top : '15%',
			width : 50,
			height : 50,
			left : '1%',
			backgroundImage : '/icons/profile2.png'
		});
	}
	if (OS_IOS) {
		var image3 = Ti.UI.createImageView({
			top : '5%',
			width : 50,
			height : 50,
			left : '1%',
			backgroundImage : '/icons/profile2.png'
		});
	}
	rows.add(image3);
	if(OS_IOS){
	var delete_ = Ti.UI.createImageView({
		top : '25%',
		right : '1%',
		width : '30dp',
		height : '30dp',
		backgroundImage : '/icons/delete.png',
		objName : 'del',
		ID__ : response.id
	});
	}
	if(OS_ANDROID){
	var delete_ = Ti.UI.createImageView({
		top : '15%',
		right : '1%',
		width : '30dp',
		height : '30dp',
		backgroundImage : '/icons/delete.png',
		objName : 'del',
		ID__ : response.id
	});
	}
	rows.add(delete_);
	rows.addEventListener('click', function(e) {
		if (e.source.objName == 'del') {
			delete_address(e.source.ID__);
			$.tableview.deleteRow(e.row);
		}
	});
	return rows;
}

//////////////////////////////////////////
//delete vehicle
///////////////////////////////////////////
function delete_address(ID) {
	//Alloy.Globals.display_on_screen("Started... userprofile.js....delete_address()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var gModel = address_.get(ID);
	gModel.destroy({
		success : function(collection, response) {
			getAddress();
			//alert('Address Deleted');
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			//alert("session expired, please log back.");
			if (parseResponse.status == 401) {	
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

function WindowClose() {
	//dispatcher.off('LoadAddress', load);
	refreshObject.off('LoadAddress');
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;
}

$.win1.open();
