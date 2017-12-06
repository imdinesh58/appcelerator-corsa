/////////////////////////////////////////////////////
// accept ride event listener - Service call
//////////////////////////////////////////////////////
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

exports.Accept = function(id) {
	var collection = Alloy.createModel("Model_driveAccept");
	var post = {
		ride : {
			ride_id : id
		}
	};
	Ti.API.error("RideRequestjs - Accepting a Ride Request " + id);
	collection.save(post, {
		success : function(model, response) {
			// Ti.API.error("RideRequestjs - Success model : " + JSON.stringify(model));
			// Ti.API.error("RideRequestjs - Success Response : " + JSON.stringify(response));
// RideRequestjs - Success model : {"ride":{"ride_id":1120},"message":"Ride replied","id":"c12781c1-ca7e-7c1a-3f89-3d1d28087902"}
// RideRequestjs - Success Response : {"message":"Ride replied","id":"c12781c1-ca7e-7c1a-3f89-3d1d28087902"}
			Ti.API.error("RideRequest - Triggering RefreshDrive for Drivers for success response");
			refreshObject.trigger( 'RefreshDrive', { 'Status' : 'success' } );
		},
		error : function(err, response) {
			// Ti.API.error("RideRequestjs - Error model : " + JSON.stringify(model));
			// Ti.API.error("RideRequestjs - Error Response : " + JSON.stringify(response));
			// Ti.API.error("Called Refresh Trigger for Drivers for error response");
			refreshObject.trigger( 'RefreshDrive', { 'Status' : 'error' } );
		}
	});
	// send a trigger to refresh the screen
};

/////////////////////////////////////////////////////
// cancel ride event listener - Service call
//////////////////////////////////////////////////////

exports.Reject = function(ID) {
	var collection = Alloy.createModel("Model_driveCancel");
	var post = {
		reply : {
			ride_id : ID
		}
	};
	collection.save(post, {
		success : function(model, response) {
			//Ti.API.info(JSON.stringify(response));
		},
		error : function(err, response) {
			//Ti.API.info(JSON.stringify(response));
		}
	});
	//Ti.API.info("Cancel API called. " + ID);
};

//
exports.FrequencyReject = function (FId , cID) {
	var collection = Alloy.createModel("Model_driveCancel_Freq");
	var post = {
		reply : {
			carpoolFrequency_id : FId,
			ride_id : cID
		}
	};
	collection.save(post, {
		success : function(model, response) {
			//Ti.API.info(JSON.stringify(response));
		},
		error : function(err, response) {
			//Ti.API.info(JSON.stringify(response));
		}
	});
	
};
