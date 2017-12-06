exports.definition = {
	
	config: {		
		"URL": Alloy.CFG.url+"/api/drives/history",
		adapter: {
			"type": "restapi",
			collection_name: "driveshistory",
			"idAttribute": "id"
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
			parse: function(response) {
          		/////Ti.API.info("Response : " + JSON.stringify(response));
          		/////Ti.API.info("next Page : " + JSON.stringify(response.nextPage));
          		return response.model || response;
       		}
		});

		return Collection;
	}
};