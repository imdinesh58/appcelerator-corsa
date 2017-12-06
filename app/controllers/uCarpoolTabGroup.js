var args = arguments[0] || {};
/////////////////////////////
//window onload
/////////////////////////////

function load() {
	//Ti.API.info("uCarpoolTabGroup Controller load().");
	Alloy.Globals.openWindows.push({
		'uCarpoolTabGroup' : $.uCarpoolTabGroupId
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Recurring Ride";
			}
		}
	}

}

function androidBackEventHandler(_event) {
	//Ti.API.info("AndroidBackEvent called on uCarpoolTabGroup Controller.");
	$.uCarpoolTabGroupId.close();
}
