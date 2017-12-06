/////////////////////////////////////////////////////
// accept ride event listener - Service call
//////////////////////////////////////////////////////

exports.Accept = function(id) {

	var collection = Alloy.createModel("Model_carpoolAccept");

	var post = {
		ride : {
			carpool_id : id
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

	//Alloy.Globals.display_on_screen("Accept API called. " + id, Ti.UI.NOTIFICATION_DURATION_LONG);
};

/////////////////////////////////////////////////////
// cancel ride event listener - Service call
//////////////////////////////////////////////////////

exports.Reject = function(ID) {

	var collection = Alloy.createModel("Model_carpoolCancel");

	var post = {
		reply : {
			carpool_id : ID
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

	//Alloy.Globals.display_on_screen("Cancel API called. " + ID, Ti.UI.NOTIFICATION_DURATION_LONG);
};
