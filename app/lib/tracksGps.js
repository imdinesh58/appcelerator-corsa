var service = Ti.Android.currentService;
var serviceIntent = service.getIntent();

var rideData = JSON.parse(serviceIntent.getStringExtra('customData'));

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 0;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
Titanium.Geolocation.purpose = 'Get Current Location';

if (Ti.Geolocation.locationServicesEnabled) {
	var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
		name : Ti.Geolocation.PROVIDER_NETWORK,
		minUpdateDistance : 0
	});
	Ti.Geolocation.Android.addLocationProvider(gpsProvider);
	var gpsRule = Ti.Geolocation.Android.createLocationRule({
		provider : Ti.Geolocation.PROVIDER_NETWORK,
		// Updates should be accurate to 100m
		// But  no more frequent than once per 10 seconds
		minAge : 10000
	});
	Ti.Geolocation.Android.addLocationRule(gpsRule);

	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.purpose = 'Get Current Location';
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
	//Ti.Geolocation.trackSignificantLocationChange = false;
	/*Titanium.Geolocation.getCurrentPosition(function(e) {
	 if (!e.success || e.error) {
	 Titanium.UI.createAlertDialog({
	 message : 'Device Location Not Found'
	 }).show();
	 return;
	 }
	 updateDBWithCurrentLocation(e.coords.latitude, e.coords.longitude);
	 });*/
	Ti.Geolocation.addEventListener('location', function(e) {
		if (!e.success || e.error) {
			//Ti.API.info("Error Code translation: " + translateErrorCode(e.code));
			return;
		}
		//alert("LAT LON ", e.coords.latitude + e.coords.longitude);
		updateDBWithCurrentLocation(e.coords.latitude, e.coords.longitude);
	});
}

if (Ti.App.Properties.getString('GPSStatus', '') == "STARTED" || Ti.App.Properties.getString('GPSStatus', '') == undefined || Ti.App.Properties.getString('GPSStatus', '') == "") {
	//alert("adding New Alarm");
	var _alarmModule = require('bencoding.alarmmanager').createAlarmManager();
	_alarmModule.addAlarmService({
		service : 'com.www.ucorsa.TracksGpsService',
		second : 2,
		interval : 100000,
		customData : JSON.stringify(rideData) // pass JSON string to service
	});
} else {
	_alarmModule.cancelAlarmService();
	Ti.Android.stopService(serviceIntent);
}

Ti.Android.stopService(serviceIntent);

function updateDBWithCurrentLocation(lat, lng) {
	var url = "https://api.ucorsa.com/api/tracking";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		var response = JSON.parse(this.responseText);
		//alert("updateDBWithCurrentLocation  " + this.responseText);
	};
	xhr.onerror = function() {
		alert("Error  " + this.responseText);
	};
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', rideData.token);
	if (Ti.App.Properties.getString('type') == "C") {
		var post = {
			tracking : {
				'ride_id' : rideData.rideId,
				'carpoolFrequency_id' : rideData.carpoolFrequency_id,
				'latitude' : lat,
				'longitude' : lng
			}
		};
	} else {
		var post = {
			tracking : {
				'ride_id' : rideData.rideId,
				'latitude' : lat,
				'longitude' : lng
			}
		};
	}
	xhr.send(JSON.stringify(post));
}

