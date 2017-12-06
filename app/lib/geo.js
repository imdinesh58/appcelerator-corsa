function decodeLine(encoded) {
	try {
		var len = encoded.length;
		var index = 0;
		var array = [];
		var lat = 0;
		var lng = 0;
		while (index < len) {
			var b;
			var shift = 0;
			var result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += dlat;
			shift = 0;
			result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lng += dlng;
			array.push([lat * 1e-5, lng * 1e-5]);
		}
		return array;
	} catch(err) {

	}
};

////////////////////////////////////////////////////////////////////////////////////////////
// Get device currrent lat , lon - using below function
////////////////////////////////////////////////////////////////////////////////////////////
exports.CurrentLocation = function() {
	var region = "";
	if (Titanium.Geolocation.locationServicesEnabled == false) {
		Titanium.UI.createAlertDialog({
			message : 'Your device has geo turned off - turn it on.'
		}).show();
	} else {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				Titanium.UI.createAlertDialog({
					message : 'Device Current Location Not Found....    :('
				}).show();
				return;
			}
			region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				regionFit : true,
				animate : true,
				userLocation : true,
				latitudeDelta : 0.001, //0.01
				longitudeDelta : 0.001 //0.01
			};
		});
	}
	return region;
};

exports.getPointsForMapRoute = function(origin, destination, _callBack) {
	var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&mode=walking&sensor=false";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET', url);
	xhr.onload = function() {
		var points;
		var response = JSON.parse(this.responseText);
		if (this.responseText != null && response.routes.length > 0) {
			var step = JSON.parse(this.responseText).routes[0].legs[0].steps;
			var intStep = 0,
			    points = [];
			var decodedPolyline = 0,
			    intPoint = 0;
			for ( intStep = 0; intStep < step.length; intStep++) {
				decodedPolyline = decodeLine(step[intStep].polyline.points);
				for ( intPoint = 0; intPoint < decodedPolyline.length; intPoint++) {
					if (decodedPolyline[intPoint] != null) {
						points.push({
							latitude : decodedPolyline[intPoint][0],
							longitude : decodedPolyline[intPoint][1]
						});
					}
				}
			}
			_callBack(points);
		}
	};
	xhr.onerror = function(e) {
		//Ti.API.error('i am in onerror');
	};
	xhr.send();
};

exports.getLocation = function() {
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;  //ACCURACY_HUNDRED_METERS //ACCURACY_BEST
	Titanium.Geolocation.purpose = 'Get Current Location';
	Titanium.Geolocation.distanceFilter = 0;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
	// PROVIDER_GPS
	//Ti.Geolocation.trackSignificantLocationChange = true;
	Titanium.Geolocation.getCurrentPosition(function(e) {
		if (!e.success || e.error) {
			Titanium.UI.createAlertDialog({
				message : 'Device Location Not Found'
			}).show();
			return;
		}
		var Lat = e.coords.latitude;
		var Lon = e.coords.longitude;
		updateDBWithCurrentLocation(Lat, Lon);
		//alert(Lat + " " + Lon + "  Accuracy " + Acc);
	});
	Titanium.Geolocation.addEventListener('location', function(e) {
		if (!e.success || e.error) {		
			return;
		}
		var Lat = e.coords.latitude;
		var Lon = e.coords.longitude;
		Ti.API.error("Location Changed: " + Lat + ", " + Lon);
		updateDBWithCurrentLocation(Lat, Lon);
		//alert(Lat + " " + Lon + "  Accuracy " + Acc);
	});
	Titanium.Geolocation.addEventListener('locationupdatepaused', function(e) {
		if (e.error) {		
			return;
		}
		var Lat = e.coords.latitude;
		var Lon = e.coords.longitude;
		Ti.API.error("location Update Paused : " + Lat + ", " + Lon);
		updateDBWithCurrentLocation(Lat, Lon);
	});
	Titanium.Geolocation.addEventListener('locationupdateresumed', function(e) {
		if (e.error) {
			return;
		}
		var Lat = e.coords.latitude;
		var Lon = e.coords.longitude;
		Ti.API.error("location Update Resumed : " + Lat + ", " + Lon);
		updateDBWithCurrentLocation(Lat, Lon);
	});
};

function updateDBWithCurrentLocation(lat, lng) {
	var url = "https://api.ucorsa.com/api/tracking";
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		// alert("response " + this.responseText);
	};
	xhr.onerror = function() {
		// alert("response error " + this.responseText);
	};
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	if (Ti.App.Properties.getString('type') == "C") {
		var post = {
			tracking : {
				'ride_id' : Ti.App.Properties.getString('rideId', ''),
				'carpoolFrequency_id' : Ti.App.Properties.getString('FreqId', ''),
				'latitude' : lat,
				'longitude' : lng
			}
		};
	} else {
		var post = {
			tracking : {
				'ride_id' : Ti.App.Properties.getString('rideId', ''),
				'latitude' : lat,
				'longitude' : lng
			}
		};
	}
	xhr.send(JSON.stringify(post));
};
