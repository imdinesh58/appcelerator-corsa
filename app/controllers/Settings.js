function load() {
	Alloy.Globals.openWindows.push({
		'settings' : $.win
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Settings";
			}
		}
	}
}

function getcreditCard(e) {
	Ti.App.Properties.setBool("Card_SETTINGS", false);
	e.source.setEnabled(false);
	Alloy.createController('ListCardDetails').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function getdebitCard(e) {
	Ti.App.Properties.setBool("Card_SETTINGS", true);
	e.source.setEnabled(false);
	Alloy.createController('ListDebit_Bank').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function getSecurity(e) {
	e.source.setEnabled(false);
	Alloy.createController('editsecurity').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function getUser(e) {
	e.source.setEnabled(false);
	Alloy.createController('userprofile').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function getVehicle(e) {
	e.source.setEnabled(false);
	Alloy.createController('editvehicle').getView().open();
	setTimeout(function() {
		e.source.setEnabled(true);
	}, 3000);
}

function Close() {
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;
}

$.win.open();
