var args = arguments[0] || {};

function load() {
	Alloy.Globals.openWindows.push({
		'internetCheck' : $.win1
	});
}

/////////////////////////////////
// Refresh to connect again - event listener
////////////////////////////////
function retry() {
	if (Titanium.Network.online) {
		CLoseWindow();
	} else {
		Titanium.UI.createAlertDialog({
			message : 'Internet still not enabled...Please Enable'
		}).show();
	}
}

/////////////////////////////////
//Android back button click
////////////////////////////////

function Dialog() {
	Titanium.UI.createAlertDialog({
		message : 'Internet still not enabled...Please Enable'
	}).show();
}

//});

function CLoseWindow() {
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;

}

$.win1.open();

