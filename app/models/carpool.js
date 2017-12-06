exports.definition = {
	config: {
            "columns" : {
			"from_location" : "String",
			"to_location" : "String",
			"repeatby" : "String",
			"ride_time" : "String",
			"ride_type" : "String",
			"recurring" : "String",
			"trip_type" : "String",
			"ride_request_to" : "String"
		},
		adapter: {
			type: "properties",
			collection_name: "carpool"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};