/////////////////////////////
//window onload
/////////////////////////////
var Network = require('networkCheck');

function load() {
	Ti.API.error("At Index Page ...");
	Alloy.Globals.openWindows.push({
		'index' : $.indexWinId
	});
	if (!Titanium.Network.online) {
		Alloy.createController('internet_check_index').getView().open();
		return;
	} else {
		checkGeolocationPermissions_New();
	}
}

function checkGeolocationPermissions_New() {
	Ti.API.error("Checking Location services ...");
	if( isLocationEnabledAtAppLevel() ) {
		Ti.API.error("Location services ...Enabled at App Level.");
		if( isLocationEnabledAtDeviceLevel() ) {
			Ti.API.error("Location services ...Enabled at Device Level.");
			goToHomePage();
		} else {
			Ti.API.error("Location services ... Not Enabled at Device Level.");
			enableLocationAtDeviceLevel();
		}
	} else {
		Ti.API.error("Location services ... Not Enabled at App Level.");
		enableLocationAtAppLevel();
	}
};

function enableLocationAtDeviceLevel() {
	Ti.API.error("At EnabledLocationAtDeviceLevel ... ");
	var alertDlg = Titanium.UI.createAlertDialog({
		message : 'Location is turned OFF at Device Level.  Enable it in Settings.',
		buttonNames : ['Open Settings']
	});
	alertDlg.show();
	alertDlg.addEventListener('click', function() {
		if (OS_ANDROID) {
			var settingsIntent = Titanium.Android.createIntent({
				action : 'android.settings.SETTINGS'
			});
			Ti.Android.currentActivity.startActivity(settingsIntent);
			// how to relaunch the page ... TODO ...
			closeWindow();
		} else {
			Ti.Platform.openURL('settings:');
			//ios
		}
	});
}

function isLocationEnabledAtDeviceLevel() {
	Ti.API.info("Device Level Location Services Enabled : " + Titanium.Geolocation.locationServicesEnabled );
	return Titanium.Geolocation.locationServicesEnabled;
}

function isLocationEnabledAtAppLevel() {
	Ti.API.info("App Level Location Services Enabled : " + Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS) );
	return Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
}

function enableLocationAtAppLevel() {
	// On iOS we can get information on the reason why we might not have permission
	if (OS_IOS) {
		// Map constants to names
		var map = {};
		map[Ti.Geolocation.AUTHORIZATION_ALWAYS] = 'AUTHORIZATION_ALWAYS';
		map[Ti.Geolocation.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Geolocation.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Geolocation.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Geolocation.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';
		map[Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE] = 'AUTHORIZATION_WHEN_IN_USE';
		
		var locationServicesAuthorization = Ti.Geolocation.locationServicesAuthorization;
		
		if (locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			goToHomePage();
		} else if (locationServicesAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title : 'You denied permission before',
				message : 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback : editPermissions
			});
		}
	}

	Ti.API.error("At EnabledLocationAtAppLevel ... ");
	// The new cross-platform way to request permissions
	// The first argument is required on iOS and ignored on other platforms
	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		if( e.success ) {
			if( isLocationEnabledAtDeviceLevel() ) {
				goToHomePage();
			} else {
				enableLocationAtDeviceLevel();
			}
		}
		if( e.error ) {
			alert("Error Requesting Location Permission");
		}
	});
}

//====================== begin code ==========================
// self executing function to check on the geo permissions
function checkGeolocationPermissions() {
	// Let's include some related properties for iOS we already had
	if (OS_IOS) {
		// Available since Ti 5.0
		//alert('Ti.Geolocation.allowsBackgroundLocationUpdates = ' + Ti.Geolocation.allowsBackgroundLocationUpdates);
		// Available since Ti 0.x,
		// Always returns true on Android>2.2
		//alert('Ti.Geolocation.locationServicesEnabled = ' + Ti.Geolocation.locationServicesEnabled);
	}
	// The new cross-platform way to check permissions
	// The first argument is required on iOS and ignored on other platforms
	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	//alert('Ti.Geolocation.hasLocationPermissions = ' + hasLocationPermissions);

	if (hasLocationPermissions) {
		return;
	}
	// On iOS we can get information on the reason why we might not have permission
	if (OS_IOS) {
		// Map constants to names
		var map = {};
		map[Ti.Geolocation.AUTHORIZATION_ALWAYS] = 'AUTHORIZATION_ALWAYS';
		map[Ti.Geolocation.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Geolocation.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Geolocation.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Geolocation.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';
		map[Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE] = 'AUTHORIZATION_WHEN_IN_USE';
		// Available since Ti 0.8 for iOS and Ti 4.1 for Windows
		// Always returns AUTHORIZATION_UNKNOWN on iOS<4.2
		var locationServicesAuthorization = Ti.Geolocation.locationServicesAuthorization;
		//alert('Ti.Geolocation.locationServicesAuthorization ' + 'Ti.Geolocation. = ' + map[locationServicesAuthorization]);

		if (locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			return;
		} else if (locationServicesAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title : 'You denied permission before',
				message : 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback : editPermissions
			});
		}
	}

	// The new cross-platform way to request permissions
	// The first argument is required on iOS and ignored on other platforms
	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		//alert('Ti.Geolocation.requestLocationPermissions E: ' + JSON.stringify(e));

		if (e.success) {
			// Instead, probably call the same method you call if hasLocationPermissions() is true
			//alert('You granted permission.');

		} else if (OS_ANDROID) {
			//alert('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');
			alert("Location Services Enabled: " + Titanium.Geolocation.locationServicesEnabled);
			// if (Titanium.Geolocation.locationServicesEnabled == false) {
				// var alertDlg = Titanium.UI.createAlertDialog({
					// message : 'Location Services is OFF. Enable it in Settings.',
					// buttonNames : ['Open Settings']
				// });
				// alertDlg.show();
				// alertDlg.addEventListener('click', function() {
					// if (OS_ANDROID) {
						// var settingsIntent = Titanium.Android.createIntent({
							// action : 'android.settings.APPLICATION_SETTINGS'
						// });
						// Ti.Android.currentActivity.startActivity(settingsIntent);
					// } else {
						// Ti.Platform.openURL('app-settings:');    //ios
					// }
				// });
			// }

		} else {
			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
		}
	});
};

// self executing function to get the current location and set the map to that location
function getCurrentLocation() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (e.error) {
			//if mapping location doesn't work, show an alert
			alert('Sorry, but it seems geo location is not available on your device!');
			return;
		}
		//alert("Latitude: " + e.coords.latitude + "\n" + "Longitude: " + e.coords.longitude);
		//apply the lat and lon properties to our mapvie
	});
};
//====================== end code ============================

/////////////////////////////
//android back clicked
/////////////////////////////
function goToHomePage() {
	Ti.API.error("Going to Home Page ...");
	// check if auto signin can be done
	if (Ti.App.Properties.getString('tokenaccess', "") == null || Ti.App.Properties.getString('tokenaccess', "") == "") {
		// stay in this screen.
	} else {
		// access tokens exists, go to home page directly
		if (OS_IOS) {
			closeWindow();
		}
		Alloy.createController('home1').getView().open();
	}
}

function showDialog() {
	$.dialog.show();
}

function doClick(e) {
	if (e.index === 0) {
		closeWindow();
	}
};

function closeWindow() {
	try {
		$.indexWinId.close();
		$.indexWinId = null;
	} catch(err) {
	}
	Alloy.Globals.openWindows.pop();
}

$.indexWinId.open();

