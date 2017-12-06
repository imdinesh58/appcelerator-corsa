/////////////////////////////////////////////////////
// cancel ride event listener - Service call
//////////////////////////////////////////////////////


exports.Cancel = function (data) {

	var collection = Alloy.createModel("rider_cancel_carpool");

	var post = {
		reply : {
			carpool_id : data
		}
	};

	collection.save(post, {
		success : function(model, response) {
			//alert(JSON.stringify(response));
			//alert(response.message);
		},
		error : function(err) {
			alert(JSON.stringify(err));
		}
	});

	//Alloy.Globals.display_on_screen("Cancel API called. Ride ID  = " + data, Ti.UI.NOTIFICATION_DURATION_LONG);
};
///////////////////////////////////////////
//confirm ride button click - SERVICE CALL
///////////////////////////////////////////

exports.Confirm = function (riderid,driverid) {
var collection = Alloy.createModel("rider_confirm_carpool");

	var post = {
		reply : {
			carpool_id : riderid,
			driver_id : driverid
		}
	};

	collection.save(post, {
		success : function(model, response) {
			//alert(JSON.stringify(response));
			//alert(response.message);
		},
		error : function(err) {
			alert(JSON.stringify(err));
		}
	});

	//Alloy.Globals.display_on_screen("Confirm API called.    " + riderid + ' ' + driverid, Ti.UI.NOTIFICATION_DURATION_LONG);
};
