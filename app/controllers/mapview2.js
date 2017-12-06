var args = arguments[0] || {};

var client = require('http_client');
Alloy.Globals.Map = require('ti.map');
var geo = require('geo');
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();

var uie = require('UActivityIndicator');
var indicator = uie.createIndicatorWindow({top:60});

var table_data = [];
var last_search = null;
var region = geo.CurrentLocation();

////window load
function load() {
	Alloy.Globals.openWindows.push({
		'mapView2' : $.ridefrom
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Pick Address";
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
				done();
			});
		};
		$.ridefrom.getActivity().invalidateOptionsMenu();
	}
	$.container.visible = false;
	$.txtrideFrom.value = "";
	if (OS_ANDROID) {
		$.map1.setRegion(region);
	}
	//alert("region 2 " + JSON.stringify(region));
	//alert("LON  " + region.latitude + "   LAT " + region.longitude);
	if (OS_IOS) {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			try {
				LATT = e.coords.latitude;
				LONN = e.coords.longitude;
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

/////////////////////////////////
// long ress to add annotation
////////////////////////////////
$.map1.addEventListener('longclick', function(e) {
	if ($.txtrideFrom.value == '') {
		addNewAnnotation(e.latitude, e.longitude, 'from');
	}
});

$.mapView.addEventListener('android:back', function(e) {
	closeWindow();
});

//////////////////////////////////////////////////////
//map view onclick to add annotaions - event listeners
/////////////////////////////////////////////////////
var addNewAnnotation = function(lat, lng) {
	Titanium.Geolocation.reverseGeocoder(lat, lng, function(evt) {
		if (evt.success) {
			var places = evt.places;
			if (places && places.length) {
				getAnnotation(places[0].address, lat, lng, "from");
			}
		} else {
			Ti.UI.createAlertDialog({
				title : 'Map services not found',
				message : evt.error
			}).show();
		}
	});
};

function getAnnotation(address, latitude, longitude, location) {
	var annotation = Alloy.Globals.Map.createAnnotation({
		latitude : latitude,
		longitude : longitude,
		latitudeDelta : 0.5,
		longitudeDelta : 0.5,
		regionFit : true,
		id : 1
	});
	if (location == 'from') {
		$.txtrideFrom.value = address;
		$.container.visible = false;
		annotation.title = 'My Address';
		if (OS_ANDROID) {
			annotation.image = '/car.png';
		}
		if (OS_IOS) {
			annotation.image = '/car2.png';
		}
	}
	$.map1.addAnnotation(annotation);
	$.map1.setLocation({
		latitude : latitude,
		longitude : longitude,
		latitudeDelta : 0.5,
		longitudeDelta : 0.5
	});
}

/////////////////////////////////
//clear - annotations event Listener
////////////////////////////////
function clear() {
	$.txtrideFrom.value = "";
	$.map1.removeAllAnnotations();
	$.container.visible = false;
}

/////////////////////////////////////////////////////
////////////// ride from ////////////////////////////////
/////////////////////////////////////////////////////
function GetLocation1(e) {
	get_place(e.row.place_id, 'from');
};

function get_place(place_id, location) {
	var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&key=AIzaSyDU3GIU7hCtC0tXCl3_yCrXUzlhOdorDj4";
	//Ti.API.error('url :' + url);
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			var obj = JSON.parse(this.responseText);
			var result = obj.result;
			getAnnotation(result.formatted_address, result.geometry.location.lat, result.geometry.location.lng, location);
		}
	});
	client.open("GET", url);
	client.send();
}

//AUTOCOMPLETE TABLE
function FromLocation(e) {
	if ($.txtrideFrom.value.length > 2 && $.txtrideFrom.value.length < 8) {
		last_search = $.txtrideFrom.value;
		get_locations($.txtrideFrom.value, 'from');
	}
};

function get_locations(query, location) {
	if (OS_ANDROID) {
		var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + query + "&location=" + region.latitude + "," + region.longitude + "&radius=500" + "&key=AIzaSyDU3GIU7hCtC0tXCl3_yCrXUzlhOdorDj4";
	}
	if (OS_IOS) {
		var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + query + "&location=" + LATT + "," + LONN + "&radius=500" + "&key=AIzaSyDU3GIU7hCtC0tXCl3_yCrXUzlhOdorDj4";
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			////Ti.API.info("Received text2 : " + this.responseText);
			var obj = JSON.parse(this.responseText);
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
			table_data.push({
				description : 'Powered by google'
			});
			if (location == 'from') {
				$.autocomplete_table.removeAllChildren();
				$.autocomplete_table.setHeight(Ti.UI.SIZE);
				$.autocomplete_table.setData(table_data);
				$.container.visible = true;
			}
		}
	});
	client.open("GET", url);
	client.send();
}

/////////////////////////////////
// android back button
////////////////////////////////
function done() {
	if (OS_IOS || OS_ANDROID) {
		if ($.txtrideFrom.value == "") {
			alert('Add address');
		} else {
			add_address_call();
		}
	}
}

function add_address_call() {
	var uri = "/api/address";
	var address = Alloy.Models.instance('authentication');
	address.set('address1', $.txtrideFrom.value);
	address.set('address2', '');
	address.set('city', '');
	address.set('state', '');
	address.set('zip', '');
	address.set('latitude', "12.8");
	address.set('longitude', "80.1");
	var address_obj = {};
	address_obj.address = address;
    // Create an instance of an indicator window
	indicator.openIndicator();
	client.send_message(uri, "POST", address_obj, handleHttpClientResponse);
}

function handleHttpClientResponse(err, response) {
	Ti.API.error("Start the timer for wait");
	// stop the spinner
	setTimeout(function() {
		Ti.API.error("Timer popped ... ");
		indicator.closeIndicator(); 
		if( err ) {
			Ti.API.error("handleHttpClientResponse - Error Response Text : " + JSON.stringify(err));
			alert(JSON.stringify(err));
		} else {
			Ti.API.info("handleHttpClientResponse - Register Response: " + JSON.stringify(response));
			alert("Address added.");
	    	refreshObject.trigger('LoadAddress', {
				'Test' : 'Test'
			});
			closeWindow();
		}
	},500);
	Ti.API.error("End the timer for wait");
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.ridefrom.close();
	$.ridefrom = null;

}

$.ridefrom.open();
