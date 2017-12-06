//Ti.API.info("This line was executed from a background service!");

var alertCount = 0;
var notification = null;

function notify(){
	// This creates the notification alert on a 'paused' app
	notification = Ti.App.iOS.scheduleLocalNotification({
		alertBody:"GPS Track Running",
		alertAction:"OK",
		userInfo:{"hello":"world"},
		badge:alertCount
	});
}

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
Titanium.Geolocation.purpose = 'Get Current Location';
Titanium.Geolocation.distanceFilter = 0;
//Ti.Geolocation.trackSignificantLocationChange = false;

function getLocation() {
	alertCount++;
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.purpose = 'Get Current Location';
		Titanium.Geolocation.distanceFilter = 0;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
		//Ti.Geolocation.trackSignificantLocationChange = false;
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				Titanium.UI.createAlertDialog({
					message : 'Device Location Not Found'
				}).show();
				return;
			}
			updateDBWithCurrentLocation(e.coords.latitude, e.coords.longitude);
		});
		Ti.Geolocation.addEventListener('location', function(e) {
			if (!e.success || e.error) {
				return;
			}
			updateDBWithCurrentLocation(e.coords.latitude, e.coords.longitude);
		});
	}
}


Ti.App.iOS.addEventListener('notification',function(){
	//Ti.API.info('background event received = '+notification);
	Ti.App.currentService.stop();
	Ti.App.currentService.unregister();
});

var timer = setInterval(getLocation, 1000);

function updateDBWithCurrentLocation(lat, lon) {
	var url = "https://api.ucorsa.com/api/tracking";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		var response = JSON.parse(this.responseText);
	};
	xhr.onerror = function() {
	};
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	if (Ti.App.Properties.getString('type') == "C") {
	var post = {
		tracking : {
			'ride_id' : Ti.App.Properties.getString('rideId', ''),
			'carpoolFrequency_id' : Ti.App.Properties.getString('FreqId'),
			'latitude' : lat,
			'longitude' : lon
		}
	};
	}else{
		var post = {
		tracking : {
			'ride_id' : Ti.App.Properties.getString('rideId', ''),
			'latitude' : lat,
			'longitude' : lon
		}
	};
	}
	xhr.send(JSON.stringify(post));
}