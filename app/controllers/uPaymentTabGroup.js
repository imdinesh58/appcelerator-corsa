var args = $.args;

function load() {
	Alloy.Globals.openWindows.push({
		'uPaymentTabGroup' : $.uPaymentTabGroupId
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                        Payments";
			}
		}
	}
	
}

function androidBackEventHandler(_event) {
	//Ti.API.info("AndroidBackEvent called on uPaymentTabGroup Controller.");
	Alloy.Globals.openWindows.pop();
	$.uPaymentTabGroupId.close();
}

