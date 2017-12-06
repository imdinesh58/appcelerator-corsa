/////////////////////////////////////////////////////
// cancel ride event listener - Service call
//////////////////////////////////////////////////////
exports.Cancel = function (data) {
	var collection = Alloy.createModel("Model_urideCancel");
	var post = {
		reply : {
			ride_id : data
		}
	};
	collection.save(post, {
		success : function(model, response) {
			//Ti.API.info(JSON.stringify(response));
			//alert(response.message);
		},
		error : function(err,response) {
			//alert(JSON.stringify(response));
		}
	});
	//Ti.API.info("Cancel API called. Ride ID  = " + data);
};
///////////////////////////////////////////
//confirm ride button click - SERVICE CALL
///////////////////////////////////////////

exports.Confirm = function (riderid,driverid) {
var collection = Alloy.createModel("Model_urideConfirm");
	var post = {
		reply : {
			ride_id : riderid,
			driver_id : driverid
		}
	};
	collection.save(post, {
		success : function(model, response) {
			//Ti.API.info(JSON.stringify(response));
			//alert(response.message);
		},
		error : function(err,response) {
			//alert('Confirm Error  ' + JSON.stringify(response));
		}
	});
	//Ti.API.info("Confirm API called.    " + riderid + ' ' + driverid);
};


exports.FrequencyReject = function (FId , cID) {
	var collection = Alloy.createModel("Model_riderCancel_Freq");
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