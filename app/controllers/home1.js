var args = arguments[0] || {};
/////////////////////////////
///load window
/////////////////////////////
var Network = require('networkCheck');
var logout = require('auth');
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
function load() {
	Alloy.Globals.openWindows.push({
		'home1' : $.win
	});

	$.Details.hide();
	$.mainview.show();

	var _username_ = Ti.App.Properties.getString('User_NAME', '');

	if (OS_IOS) {
		$.win.title = Ti.App.Properties.getString('User_NAME', '');
	}

	Ti.App.Properties.setString('window', 'home1');

	// show the action bar
	if (OS_ANDROID) {
		try {
			if (!$.getView().activity) {
			} else {
				var activity = $.getView().activity;
				var actionBar = activity.actionBar;
				if (actionBar) {
					actionBar.icon = '/home.png';
					actionBar.title = _username_;
				}
			}
			$.win.activity.onCreateOptionsMenu = function(e) {
				var menu = e.menu;
				var menuitem = menu.add({
					title : "LOG OUT",
					icon : "/skip.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuitem.addEventListener("click", function(e) {
					goBack();
				});
			};
			$.win.getActivity().invalidateOptionsMenu();
		} catch(err) {

		}
	}
}

///// hide details ///
function hide() {
	$.Details.hide();
	$.btnView.show();
}

////Open Popup //
function Show() {
	try {
		$.btnView.hide();
		$.Details.show();
	} catch(err) {
		//Ti.API.info(err);
	}
}

function uRide(e) {
	e.source.setEnabled(false);
	Alloy.createController('uRideTabGroup').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function uDrive(e) {
	e.source.setEnabled(false);
	Alloy.createController('uDriveTabGroup').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function uCarpool(e) {
	e.source.setEnabled(false);
	Alloy.createController('uCarpoolTabGroup').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function getContacts(e) {
	e.source.setEnabled(false);
	Alloy.createController('uContactsTabGroup').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function TrackRides(e) {
	e.source.setEnabled(false);
	Alloy.createController('trackRides').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function paymentTab(e) {
	e.source.setEnabled(false);
	Alloy.createController('uPaymentTabGroup').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

/////////////////////////////
//overflow menu - Android onclick's
/////////////////////////////
function getAccounts(e) {
	e.source.setEnabled(false);
	Alloy.createController('Settings').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

/////////////////////////////
//android/Ios back click
/////////////////////////////
function showDialog() {
	$.dialog.show();
}

function doClick(e) {
	if (e.index === 0) {
		goBack();
	}
};

function goBack() {
	try {
		Ti.App.Properties.setString('tokenaccess', "");
		//Ti.App.Properties.setString('deviceToken', "");
		refreshObject.trigger('GOOGLEPLUS', {
			'Test' : 'Test'
		});
		refreshObject.trigger('FACEBOOK', {
			'Test' : 'Test'
		});
		Alloy.Globals.openWindows.pop();
		if (OS_ANDROID) {
			$.win.close();
			$.win = null;
		}
		if (OS_IOS) {
			$.Navwin.close();
			$.Navwin = null;
		}
		Alloy.createController('index').getView().open();
	} catch(err) {
		Ti.API.error("logout " + err);
	}
}

if (OS_ANDROID) {
	$.win.open();
}
if (OS_IOS) {
	$.Navwin.open();
}
