var args = arguments[0] || {};

/////////////////////////////
//cleanup textfield values
/////////////////////////////
var cleanups = require('cleanup');
var collection_contact = Alloy.createCollection("Model_Contact");
var collection = Alloy.createCollection("Model_Group");
var collection_members = Alloy.createCollection("Model_Member");
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

function load() {
	Ti.API.error("Loading the Contacts Tab ...");
	Alloy.Globals.openWindows.push({
		'uContactsTabGroup' : $.uContactsTabGroupId
	});
	if (OS_ANDROID) {
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;
		if (actionBar) {
			actionBar.title = "                          Contacts";
		}
		var inviteItem = null;
		var menuItem = null;
		var menuItem2 = null;
		var menuItem3 = null;
		activity.onCreateOptionsMenu = function(e) {
			if ($.uContactsTabGroupId.activeTab.title === "phone") {
				// inviteItem = e.menu.add({
					// icon : "/common/Invite2.png",
					// //icon : Ti.Android.R.drawable.ic_menu_add
					// showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				// });
				menuItem = e.menu.add({
					icon : "/common/invite.png",
					//icon : Ti.Android.R.drawable.ic_menu_add
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem.addEventListener("click", function(e) {
					Ti.API.error("Triggering Event - Connect");
					// alert("Clicked Add.");
					refreshObject.trigger('Connect', {
						'Test' : 'Test'
					});
				});
				menuItem3 = e.menu.add({
					icon : "/common/manual.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem3.addEventListener("click", function(e) {
					e.source.setEnabled(false);
					Ti.API.error("Triggering AddManually");
					refreshObject.trigger('Add_Manually', {
						'Test' : 'Test'
					});
					setTimeout(function() {
						e.source.setEnabled(true);
					}, 4000);
				});
			} else if ($.uContactsTabGroupId.activeTab.title === "circles") {
				menuItem2 = e.menu.add({
					icon : "/images/add.png",
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
				});
				menuItem2.addEventListener("click", function(e) {
					Ti.API.error("Triggering Add New Group");
					refreshObject.trigger('AddNewGROUP', {
						'Test' : 'Test'
					});
				});
			}
		};
		activity.invalidateOptionsMenu();
		$.uContactsTabGroupId.addEventListener('blur', function(_event) {
			$.getView().activity.invalidateOptionsMenu();
		});
	}
}

refreshObject.on('Close_ContactsTab', function(msg) {
	androidBackEventHandler();
});

function androidBackEventHandler(_event) {
	Ti.API.error("Contacts Tab - Handling Android Back button pressed event.");
	Alloy.Globals.openWindows.pop();
	$.uContactsTabGroupId.close();
	$.uContactsTabGroupId = null;
	refreshObject.off('Close_ContactsTab');
	Ti.API.error("Connect Event - Off");
	refreshObject.off('Connect');
}

