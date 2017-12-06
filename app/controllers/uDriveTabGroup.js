var args = arguments[0] || {};
/////////////////////////////
//window onload
/////////////////////////////

function load() {
	Alloy.Globals.openWindows.push({
		'uDriveTabGroup' : $.uDriveTabGroupId
	});

	//Ti.App.Properties.setString('window', 'uDriveTAB');
	if (OS_ANDROID) {
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;
		if (actionBar) {
			actionBar.title = "                          uDrive";
		}

		// set the active tab
		$.uDriveTabGroupId.setActiveTab(0);

		// menu to display in this tab group
		var menuItem = null;
		activity.onCreateOptionsMenu = function(e) {
			if ($.uDriveTabGroupId.activeTab.title === "Schedule") {
				menuItem = e.menu.add({
					icon : "/common/add.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem.addEventListener("click", function(e) {
					Alloy.createController('uDriveSignup1').getView().open();
				});
			}
		};
		activity.invalidateOptionsMenu();

		// this forces the menu to update when the tab changes
		$.uDriveTabGroupId.addEventListener('blur', function(_event) {
			//Ti.API.info("uDriveTabGroup ... blur() event called.");
			$.getView().activity.invalidateOptionsMenu();
		});
	}
}

function androidBackEventHandler(_event) {
	//Ti.API.info("AndroidBackEvent called on uDriveTabGroup Controller.");
	Alloy.Globals.openWindows.pop();
	$.uDriveTabGroupId.close();
}
