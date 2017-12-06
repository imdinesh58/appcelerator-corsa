///////////////////open windows/////////////////////
Alloy.Globals.openWindows = [];
////////////////////////////////////////////////
var push = require('pushNotifications');
if (OS_ANDROID) {
	push.addListener();
}

///IOS Current Location Code
if (OS_IOS) {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		//alert("ALLOY    Latitude: " + e.coords.latitude + "\n" + "Longitude: " + e.coords.longitude);
		//apply the lat and lon properties to our mapview
		try {
			Alloy.Globals.LATITUDE = e.coords.latitude;
			Alloy.Globals.LONGITUDE = e.coords.longitude;
		} catch(err) {
			//Ti.API.info("Alloy" + err);
		}
	});
}

Alloy.Globals.Facebook = require('facebook');

Alloy.Globals.configurationDone = false;