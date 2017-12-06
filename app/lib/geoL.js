var GOOGLE_BASE_URL = 'http://maps.google.com/maps/api/geocode/json?address=';

// geocode = grants permission for App to access google L & S for accurate coordinates, 

//var GOOGLE_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json?route=';

//var GOOGLE_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json?origin=Chennai,MA&destination=Velachery,MA&waypoints=Porur,MA|via:Guindy,MA&key=API_KEY';
var ERROR_MESSAGE = 'There was an error geocoding. Please try again.';
 exports.LATITUDE_BASE =  12.975971;
 exports.LONGITUDE_BASE = 80.22120919999999;



var GeoData = function(title, latitude, longitude) {
	this.title = title;
	this.coords = {
		latitude: latitude,
		
	longitude: longitude
	};
};

exports.forwardGeocode = function(address, callback) {
	if (Ti.Platform.osname === 'mobileweb') {
		//if (Ti.Platform.osname === 'ios') {
		forwardGeocodeWeb(address, callback);
		
	} else {
		forwardGeocodeNative(address, callback);
		 //route(origin, destination, callback) ;
	}
};

var forwardGeocodeNative = function(address, callback) {
	var url = GOOGLE_BASE_URL + address.replace(' ', '+');
	url += "&sensor=" + (Titanium.Geolocation.locationServicesEnabled);
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET', url);
	xhr.onload = function() {
		var json = JSON.parse(this.responseText);
		if (json.status != 'OK') {
			//alert('Unable to geocode the address');
			return;
		}

		callback(new GeoData(
			address,
			json.results[0].geometry.location.lat,
			json.results[0].geometry.location.lng
		));
	};
	xhr.onerror = function(e) {
		//Ti.API.error(e.error);
		alert(ERROR_MESSAGE);
	};
	xhr.send();
};

var forwardGeocodeWeb = function(address, callback) {
	var geocoder = new google.maps.Geocoder();
	
	//Geocoder()	= Creates a new instance of a Geocoder that sends geocode requests to Google servers.
	
	if (geocoder) {
		geocoder.geocode({
			'address': address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				callback(new GeoData(
					address,
					results[0].geometry.location.lat(),
					results[0].geometry.location.lng()
				));
			} else {
				//Ti.API.error(status);
				alert(ERROR_MESSAGE);
			}
		});
	} else {
		alert('Google Maps Geocoder not supported');
	}
};




