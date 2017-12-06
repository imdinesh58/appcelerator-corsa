var args = arguments[0] || {};
var _Track_ID_ = args._Track_ID_;
var status = args.status;
Ti.API.error("TrackothersMap - Track ID : " + _Track_ID_);
Ti.API.error("TrackothersMap - Status : " + status);
var _Fre_ID_ = args._Fre_ID_;
var points = [];
var annotations = [];
var polylines = [];
var circles = [];

/////////////////////////////////
// require map module
////////////////////////////////
Alloy.Globals.Map = require('ti.map');
var geo = require('geo');
var timer;
var offset = 0;
var counter = 0;
var stopIndicator = 0;
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
refreshObject.on('refreshTrackOthers', function(msg) {
	_Track_ID_ = msg._TrackID_;
	load();
});

//////////////////////////////////////////
//window onload
///////////////////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'trackOthersMapView' : $.showRide
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                   Track Rides";
			}
		}
	}
	if ( status == 'Started') {
		try {
			// call getRideCoordinates every 10 seconds
			Ti.API.error("Calling getRideCoordinates : " + new Date());
			var myTimer = setInterval(function() { 
				Ti.API.error("Calling getRideCoordinates from inside setInterval : " + new Date());
				counter++;
				if( stopIndicator == 0 ) {
					getRideCoordinates(); 
				} else {
					// stop the loop, go back to the home screen ???
					clearInterval(myTimer);
				}
			}, 10000);
		} catch(err) {
		}
	} else {
		try {
			getRideCoordinates();
		} catch(err) {
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
// serviuce call - GET to get lat lon fron DATABASE Backend
////////////////////////////////////////////////////////////////////////////////////////////////
//var TrackID = 0;
function getRideCoordinates() {
	var collection = Alloy.createCollection("getTracking");
	Ti.API.error("Track ID: " + _Track_ID_);
	Ti.API.error("T_Id : " + offset);
	collection.fetch({
		urlparams : {
			ride_Id : _Track_ID_,
			t_Id : offset
		},
		success : function(collection, response) {
			Ti.API.error("Locations to Map Response: " + JSON.stringify(response));
			Ti.API.error("Locations to Map Response Length: " + response.length);
			Ti.API.error("Locations to Map Collection: " + JSON.stringify(collection));
			Ti.API.error("Locations to Map Collection Length: " + collection.length);
// [ERROR] :  Track ID: 1134
// [ERROR] :  T_Id : 0
// [ERROR] :  Locations to Map Response: []
// [ERROR] :  Locations to Map Response Length: 0
// [ERROR] :  Locations to Map Collection: []
// [ERROR] :  Locations to Map Collection Length: 0
//
// [ERROR] :  Track ID: 1141
// [ERROR] :  T_Id : 0
// [ERROR] :  Locations to Map Response: {"id":42604,"ride_id":1141,"latitude":"0","longitude":"0","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:16:48.000Z","update_user":"admin"}
// [ERROR] :  Locations to Map Response Length: undefined
// [ERROR] :  Locations to Map Collection: [{"id":42604,"ride_id":1141,"latitude":"0","longitude":"0","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:16:48.000Z","update_user":"admin"}]
// [ERROR] :  Locations to Map Collection Length: 1
//
// [ERROR] :  Track ID: 1142
// [ERROR] :  T_Id : 0
// [ERROR] :  Locations to Map Response: [{"id":42605,"ride_id":1142,"latitude":"12.9793914","longitude":"80.2215002","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:29:08.000Z","update_user":"admin"},{"id":42606,"ride_id":1142,"latitude":"12.9793814","longitude":"80.2215009","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:29:08.000Z","update_user":"admin"}]
// [ERROR] :  Locations to Map Response Length: 2
// [ERROR] :  Locations to Map Collection: [{"id":42605,"ride_id":1142,"latitude":"12.9793914","longitude":"80.2215002","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:29:08.000Z","update_user":"admin"},{"id":42606,"ride_id":1142,"latitude":"12.9793814","longitude":"80.2215009","carpoolFrequency_id":null,"update_ts":"2017-07-18T04:29:08.000Z","update_user":"admin"}]
// [ERROR] :  Locations to Map Collection Length: 2
// [ERROR] :  ShowRouteOnMap - Response Length : 2

			if (response.length == undefined && collection.length == 1) {
				// there is only one point (collection is an array, while response is an struct)
				var rsp = [];
				rsp.push(response);
				showRouteOnMap(rsp);
			} else if (response.length == 0) {
				// there is not points
				showRouteOnMap(response);
			} else {
				// there is more than one point
				showRouteOnMap(response);
			}
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			Ti.API.error("Locations to Map Error: " + JSON.stringify(err));
			Ti.API.error("Locations to Map Error Response: " + JSON.stringify(response));
			alert("session expired, please log back.");
			if (parseResponse.status == 401) {
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

var img;
function showRouteOnMap(response) {
	Ti.API.error("ShowRouteOnMap - Response Length : " + response.length);
	Ti.API.error("ShowRouteOnMap - Response: " + JSON.stringify(response));
	if (OS_IOS) {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			currentLattitude = e.coords.latitude;
			currentLongitude = e.coords.longitude;
		});
	} else {
		var region = geo.CurrentLocation();
		currentLattitude = region.latitude;
		currentLongitude = region.longitude;
	}
	
	if (response.length == undefined) {
		//alert("response " + JSON.stringify(response));
		offset = response.id;
		img = OS_ANDROID ? '/common/flag.png' : '/common/flag2.png';
		addAnnotation(response);
		$.map1.setRegion({
			latitude : response.latitude == 0 ?  currentLattitude : response.latitude,
			longitude : response.longitude == 0 ?  currentLongitude : response.longititude,
			latitudeDelta : 0.001, //0.05
			longitudeDelta : 0.001 //0.05
		});
		// show the annotations on the map
		$.map1.addAnnotations(annotations);
	} else if (response.length == 0) {
		var anno = Alloy.Globals.Map.createAnnotation({
			latitude : currentLattitude,
			longitude : currentLongitude,
			latitudeDelta : 0.001,
			longitudeDelta : 0.001,
			regionFit : true,
			image : "/common/redCircle2.png"
		});
		$.map1.addAnnotation(anno);
		$.map1.setRegion({
			latitude : currentLattitude,
			longitude : currentLongitude,
			latitudeDelta : 0.001,
			longitudeDelta : 0.001
		});
		return;
	} else if (response.length == 1) {
		//alert("response " + JSON.stringify(response));
		if( response[0].id == offset && counter >= 10 ) {
			// the coordinates did not change for 5 mins, stop the loop
			stopIndicator = 1;
		}
		offset = response[0].id;
		if( response[0].latitude == 0 ) {
			response[0].latitude == currentLattitude;
		}
		if( response[0].longitude == 0 ) {
			response[0].longitude == currentLongitude;
		}
		img = OS_ANDROID ? '/common/flag.png' : '/common/flag2.png';
		addAnnotation(response[0]);
		
		// setting the region so that the appropriate region of the map is visible
		$.map1.setRegion({
			latitude : response[0].latitude == 0 ? currentLattitude : response[0].latitude,
			longitude : response[0].longitude == 0 ? currentLongitude : response[0].longitude,
			latitudeDelta : 0.001, //0.05
			longitudeDelta : 0.001 //0.05
		});
		// show the annotations on the map
		$.map1.addAnnotations(annotations);
	} else if (response.length > 1) {
		offset = response[response.length - 1].id;
		var points_ = [];
		_.each(response, function(element, index, list) {
			Ti.API.error("Index = " + index);
			if (index == 0 || index == response.length - 1) { 
				img = OS_ANDROID ? '/common/flag.png' : '/common/flag2.png';
				addAnnotation(element);
			} else {
				img = OS_ANDROID ? '/common/redCircle.png' : '/common/redCircle3.png';
				addAnnotation(element);
			}
			points_.push({
				latitude : response[index].latitude,
				longitude : response[index].longitude
			});
		});
			// var origin = points_[0].latitude + ',' + points_[0].longitude;
			// var dest = points_[points_.length - 1].latitude + ',' + points_[points_.length - 1].longitude;
			// geo.getPointsForMapRoute(origin, dest, _pointsCallBack);
		// setting the region so that the appropriate region of the map is visible
		$.map1.setRegion({
			latitude : response[0].latitude == 0 ? currentLattitude : response[0].latitude,
			longitude : response[0].longitude == 0 ? currentLongitude : response[0].longitude,
			latitudeDelta : 0.001, //0.05
			longitudeDelta : 0.001 //0.05
		});
		// show the annotations on the map
		$.map1.addAnnotations(annotations);
	}
};

function addAnnotation(position) {
	//alert("addAnnotation: " + position.latitude, position.longitude);
	annotations.push(Alloy.Globals.Map.createAnnotation({
		latitude : position.latitude,
		longitude : position.longitude,
		regionFit : true,
		animate : true,
		userLocation : true,
		image : img
	}));
}

function addPolyline(pos1, pos2) {
	Ti.API.error("Adding a polyline for : " + pos1.latitude + "," + pos1.longitude + " - " + pos2.latitude + "," + pos2.longitude);
	var lPoints = [];
	lPoints.push(pos1);
	lPoints.push(pos2);
	var pl = Alloy.Globals.Map.createPolyline();
	pl.setPoints(lPoints);
	polylines.push(pl);
}

function _pointsCallBack(_p_) {
	var route = Alloy.Globals.Map.createRoute({
		points : _p_,
		name : 'Walking Mode',
		color : "#786658",
		width : 5
	});
	$.map1.addRoute(route);
};

function closeWindow() {
	try {
		refreshObject.off('refreshTrackOthers');
		Alloy.Globals.openWindows.pop();
		//clearInterval(this.timer);
		clearInterval(this.timer);
		this.timer = null;
		$.showRide.close();
	} catch(err) {
	}
};

$.showRide.open();
