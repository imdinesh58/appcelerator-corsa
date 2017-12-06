exports.checkConnectivity = function() {
	if (!internet_check()) {
		return false;
	}
	return true;
};

exports.checkLocation = function() {
	// internet is enabled, now check for gps
	if (!gps_check()) {
		return false;
	}
	return true;
};

function internet_check() {
	////Ti.API.info('Start.... internet_check()');
	////Ti.API.info(Ti.Network.getNetworkTypeName());
	if (Titanium.Network.online && (Ti.Network.getNetworkType() == Ti.Network.NETWORK_MOBILE || Ti.Network.getNetworkType() == Ti.Network.NETWORK_WIFI)) {
		//Alloy.Globals.display_on_screen("Internet Enabled via Mobile.", Ti.UI.NOTIFICATION_DURATION_SHORT);
		return true;
	} else {
		//Alloy.Globals.display_on_screen("Internet Not Enabled via Mobile.", Ti.UI.NOTIFICATION_DURATION_SHORT);
		return false;
	}
}

function gps_check() {
	////Ti.API.info('Start.... gps_check()');
	if (Titanium.Geolocation.locationServicesEnabled) {
		//Alloy.Globals.display_on_screen("GPS Enabled", Ti.UI.NOTIFICATION_DURATION_SHORT);
		return true;
	} else {
		//Alloy.Globals.display_on_screen("GPS Not Enabled", Ti.UI.NOTIFICATION_DURATION_SHORT);
		return false;
	}
}
