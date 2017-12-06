var args = arguments[0] || {};
/////////////////////////////
//window onload
/////////////////////////////
function load() {
	// add this tabgroup to the list
	Alloy.Globals.openWindows.push({
		'uRideTabGroup' : $.uRideTabGroupId
	});

	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                           uRide";
			}
		}
	}

	// setting the active tab
	$.uRideTabGroupId.setActiveTab(0);
}

function androidBackEventHandler(_event) {
	Alloy.Globals.openWindows.pop();
	$.uRideTabGroupId.close();
	$.uRideTabGroupId = null;
}

