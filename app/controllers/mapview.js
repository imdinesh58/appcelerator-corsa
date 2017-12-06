var args = arguments[0] || {};
/////////////////////////////////
Alloy.Globals.Map = require('ti.map');
var geo = require('geo');

var table_data = [];
var last_search = null;
var currentLattitude;
var currentLongitude;
/////////////////////////////////
//window onload
////////////////////////////////
var region = geo.CurrentLocation();
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

function load() {
	$.container.hide();
	$.container2.hide();
	$.txtrideFrom.value = args.from;
	// value passed from the parent screen
	$.txtrideTo.value = args.to;
	// value passed from the parent screen
	Alloy.Globals.openWindows.push({
		'mapView' : $.ridefrom
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Pick Locations";
			}
		}
	}
	if (OS_ANDROID) {
		$.ridefrom.activity.onCreateOptionsMenu = function(e) {
			var menuitem = e.menu.add({
				title : "DONE",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			menuitem.addEventListener("click", function(e) {
				CloseWindow();
			});
		};
		$.ridefrom.getActivity().invalidateOptionsMenu();
		$.map1.setRegion(region);
		currentLattitude = region.latitude;
		currentLongitude = region.longitude;
	}
	//alert("region 2 " + JSON.stringify(region));
	//alert("LON  " + region.latitude + "   LAT " + region.longitude);
	if (OS_IOS) {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			try {
				currentLattitude = e.coords.latitude;
				currentLongitude = e.coords.longitude;
				$.map1.setLocation({
					latitude : e.coords.latitude,
					longitude : e.coords.longitude,
					regionFit : true,
					animate : true,
					userLocation : true,
					latitudeDelta : 0.01,
					longitudeDelta : 0.01
				});
			} catch(err) {
			}
		});
	}
}

//////////////////////////////////////////////////////
//map view onclick to add annotaions - event listeners
/////////////////////////////////////////////////////

var addNewAnnotation = function(lat, lng, location) {
	Titanium.Geolocation.reverseGeocoder(lat, lng, function(evt) {
		if (evt.success) {
			var places = evt.places;
			if (places && places.length) {
				getAnnotation(places[0].address, lat, lng, location);
			}
		} else {
			Ti.UI.createAlertDialog({
				title : 'Map services not found',
				message : evt.error
			}).show();
		}
	});
};

/////////////////////////////////
// long ress to add annotation
////////////////////////////////
$.map1.addEventListener('longclick', function(e) {
	if ($.txtrideFrom.value == '') {
		//Ti.API.info('longclick  inside from  ' + $.txtrideFrom.value);
		addNewAnnotation(e.latitude, e.longitude, 'from');
	} else if ($.txtrideTo.value == '') {
		//Ti.API.info('longclick  inside  to ' + $.txtrideTo.value);
		addNewAnnotation(e.latitude, e.longitude, 'to');
	}
});

$.swap.addEventListener('click', function(e) {
	swap();
});

function swap() {
	var temp = $.txtrideFrom.value;
	$.txtrideFrom.value = $.txtrideTo.value;
	$.txtrideTo.value = temp;

	var annotations = $.map1.getAnnotations();

	temp = annotations[0].title;
	annotations[0].title = annotations[1].title;
	annotations[1].title = temp;

	temp = annotations[0].image;
	annotations[0].image = annotations[1].image;
	annotations[1].image = temp;

}

$.mapView.addEventListener('android:back', function(e) {
	clear();
	closeWindow();
});
/////////////////////////////////////////////////////
////////////// ride from ////////////////////////////////
/////////////////////////////////////////////////////
//AUTOCOMPLETE TABLE

function FromLocation(e) {
	if ($.txtrideFrom.value.length > 2) {
		last_search = $.txtrideFrom.value;
		get_locations($.txtrideFrom.value, 'from');
	}
};
/////////////////////////////////////////////////////
//////////////ride to////////////////////////////////
/////////////////////////////////////////////////////
//AUTOCOMPLETE TABLE
function ToLocation(e) {
	if ($.txtrideTo.value.length > 2) {
		last_search = $.txtrideTo.value;
		get_locations($.txtrideTo.value, 'to');
	}
};

function GetLocation1(e) {
	get_place(e.row.place_id, 'from');
};

function GetLocation2(e) {
	get_place(e.row.place_id, 'to');
};

function get_locations(query, location) {

	var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + query + "&location=" + region.latitude + "," + region.longitude + "&key=AIzaSyDU3GIU7hCtC0tXCl3_yCrXUzlhOdorDj4";

	Ti.API.error("AutoLocation URL: " + url);

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			var obj = JSON.parse(this.responseText);
			Ti.API.error("Autocomplete Response: " + JSON.stringify(obj));
			var predictions = obj.predictions;
			table_data = [];

			//if(predictions!= null || predictions!= undefined || predictions.length > 0){
			for (var i = 0; i < predictions.length; i++) {
				var row = Ti.UI.createTableViewRow({
					height : 40,
					title : predictions[i].description,
					place_id : predictions[i].place_id,
					font : {
						fontSize : '12sp'
					},
					color : '#001E45',
					backgroundColor : '#E2DDCC',
					width : 'auto'
				});
				table_data.push(row);
			}
			if (location == 'from') {
				$.autocomplete_table.removeAllChildren();
				$.autocomplete_table.setHeight(Ti.UI.SIZE);
				$.autocomplete_table.setData(table_data);
				//$.autocomplete_table.setHeight(0);
				$.container.show();
			} else {
				$.autocomplete_table2.removeAllChildren();
				$.autocomplete_table2.setHeight(Ti.UI.SIZE);
				$.autocomplete_table2.setData(table_data);
				//$.autocomplete_table2.setHeight(0);
				$.container2.show();
			}

		}
	});
	client.open("GET", url);
	client.send();
}

function get_place(place_id, location) {
	var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&key=AIzaSyDU3GIU7hCtC0tXCl3_yCrXUzlhOdorDj4";
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			var obj = JSON.parse(this.responseText);
			var result = obj.result;
			try {
				getAnnotation(result.formatted_address, result.geometry.location.lat, result.geometry.location.lng, location);
			} catch(err) {
			}
		}
	});
	client.open("GET", url);
	client.send();
}

function getAnnotation(address, latitude, longitude, location) {
	//Ti.API.error('latitude : ' + latitude);
	//Ti.API.error('longitude : ' + longitude);
	var annotation = Alloy.Globals.Map.createAnnotation({
		latitude : latitude,
		longitude : longitude,
		latitudeDelta : 0.01,
		longitudeDelta : 0.01,
		regionFit : true,
		id : 1
	});
	if (location == 'from') {
		$.txtrideFrom.value = address;
		$.container.hide();
		$.container2.hide();
		if (OS_ANDROID) {
			$.autocomplete_table.hide();
		}
		annotation.title = 'Location A';
		if (OS_ANDROID) {
			annotation.image = '/A.png';
		}
		if (OS_IOS) {
			annotation.image = '/A2.png';
		}
	} else {
		$.txtrideTo.value = address;
		$.container.hide();
		$.container2.hide();
		if (OS_ANDROID) {
		$.autocomplete_table2.hide();
		}
		annotation.title = 'Location B';
		//set image B
		if (OS_ANDROID) {
			annotation.image = '/B.png';
		}
		if (OS_IOS) {
			annotation.image = '/B2.png';
		}
	}
	$.map1.addAnnotation(annotation);
	$.map1.setLocation({
		latitude : latitude,
		longitude : longitude,
		latitudeDelta : 0.01,
		longitudeDelta : 0.01
	});

	if ($.txtrideFrom.value != '' && $.txtrideTo.value != '') {
		addroute();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// ROUTE //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
function addroute(geodata) {
	//Ti.API.info('adding route called()');
	var annotations = $.map1.getAnnotations();
	if (annotations != null && annotations.length > 0) {
		calculatedistance(annotations);
		var origin = annotations[0].latitude + ',' + annotations[0].longitude;
		var dest = annotations[1].latitude + ',' + annotations[1].longitude;
		geo.getPointsForMapRoute(origin, dest, _pointsCallBack);
	}
}

function _pointsCallBack(points) {
	//Ti.API.error('points : ' + points);
	var route = Alloy.Globals.Map.createRoute({
		points : points,
		name : 'Driving Mode',
		color : "#001E45"
	});
	if (OS_ANDROID) {
		route.width = 20;
	}
	if (OS_IOS) {
		route.width = 10;
	}
	$.map1.addRoute(route);
}

function calculatedistance(annotations) {
	try {
		/////Ti.API.error('calculatedistance ()-> ' + JSON.stringify(annotations));
		Number.prototype.toDeg = function() {
			return this * 180 / Math.PI;
		};
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		};
		var R = 6371;
		var dLat = (annotations[1].latitude - annotations[0].latitude).toRad();
		var dLon = (annotations[1].longitude - annotations[0].longitude).toRad();
		////Ti.API.error(" **** 0 *** " + annotations[0].latitude + "__" + annotations[0].longitude);
		////Ti.API.error(" **** 1 *** " + annotations[1].latitude + "__" + annotations[1].longitude);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(annotations[0].latitude.toRad()) * Math.cos(annotations[1].latitude.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = (R * c) / 1.6;
		// if miles needed // var d = (R * c ) / 1.6;
		var dis = d.toString().substring(0, 5);
		alert('Location A to B Distance is ' + dis + " miles");
	} catch(err) {
		//Ti.API.info('calculatedistance ' + err);
	}
}

/////////////////////////////////
//clear - annotations event Listener
////////////////////////////////
function clear() {
	try {
		$.txtrideFrom.value = "";
		$.txtrideTo.value = "";
		$.map1.removeAllAnnotations();
		$.map1.removeRoute(route);
		$.autocomplete_table.removeAllChildren();
		$.autocomplete_table.setData([]);
		$.autocomplete_table2.removeAllChildren();
		$.autocomplete_table2.setData([]);
		$.container.hide();
		$.container2.hide();
	} catch(err) {
	}
}

function CloseWindow() {
	Alloy.Globals.openWindows.pop();
	$.ridefrom.close();
	$.ridefrom = null;
	refreshObject.trigger('locations', {
		'from' : $.txtrideFrom.value,
		'to' : $.txtrideTo.value
	});
}

//$.ridefrom.open();

