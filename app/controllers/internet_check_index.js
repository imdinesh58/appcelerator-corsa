var args = arguments[0] || {};

function load() {
	Alloy.Globals.openWindows.push({
		'internetCheckIndex' : $.win1
	});
}

/////////////////////////////////
// Refresh to connect again - event listener
////////////////////////////////
function retry() {
	if (Titanium.Network.online) {
		////Ti.API.info('Internet Enabled.');
		Alloy.createController('index').getView().open();
		closeWindow();
	} else {
		Titanium.UI.createAlertDialog({
			message : 'Internet still not enabled...Please Enable'
		}).show();

	}
}

/////////////////////////////////
//Android back button click
////////////////////////////////

function Dialog_show() {

	var confirmClear = Titanium.UI.createAlertDialog({
		message : 'Exit App?',
		buttonNames : ['Yes', 'No']
	}).show();
	confirmClear.addEventListener('click', function(e) {
		if (e.index === 0) {
			closeWindow();
		}
	});
}

//});

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;

}

$.win1.open();

