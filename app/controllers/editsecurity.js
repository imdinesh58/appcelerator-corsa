var args = arguments[0] || {};
/////////////////////////////////
// window onload
////////////////////////////////

Ti.App.addEventListener('Fire_Security_win', load);

function load() {
	Alloy.Globals.openWindows.push({
		'editSecurity' : $.win1
	});
	$.oldpassword.blur();
	$.newpassword.blur();
	$.password.blur();
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                        Change Password";
			}
		}
	}
}

/////////////////////////////////
// Service Call
////////////////////////////////
var post;
function updatetodatabase() {
	var url = Alloy.CFG.url + "/api/auth";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		//alert(this.responseText);
		var response = JSON.parse(this.responseText);
		alert(response.message);
	};
	xhr.onerror = function() {
		alert(this.responseText);
		alert("API error status:" + xhr.status + ". " + xhr.statusText);
		if (xhr.status == 401) {
			var timeUtil = require('util');
			timeUtil.closeAllOpenWindows();
		}
	};
	xhr.open("PUT", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	var random_generated_token = Ti.App.Properties.getString('tokenaccess', '');
	xhr.setRequestHeader('access-token', random_generated_token);
	post = {
		authentication : {
			old_password : $.oldpassword.value,
			new_password : $.password.value
		}
	};
	xhr.send(JSON.stringify(post));
}

/////////////////////////////////
// save security details
////////////////////////////////
function save() {
	//Alloy.Globals.display_on_screen("Started... EditSecurity.js....svae()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	if ($.oldpassword.value == "") {
		alert('Enter old password');
	} else if ($.newpassword.value == "") {
		alert('Enter new password');
	} else if ($.oldpassword.value == $.newpassword.value) {
		alert('Old password & New password must not be same');
		$.newpassword.value = "";
		$.password.value = "";
		$.newpassword.focus();
	} else if ($.password.value == "") {
		alert('Enter confirm password');
	} else if ($.newpassword.value != $.password.value) {
		alert("Password mismatching");
		$.newpassword.value = "";
		$.password.value = "";
		$.newpassword.focus();
	} else {
		updatetodatabase();
		$.oldpassword.value = "";
		$.newpassword.value = "";
		$.password.value = "";
		$.oldpassword.focus();
	}
}

function WindowClose() {
	Alloy.Globals.openWindows.pop();
	$.win1.close();
	$.win1 = null;

}

$.win1.open(); 