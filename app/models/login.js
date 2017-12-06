exports.definition = {
	config: {		
		"URL": Alloy.CFG.url+"/login",
		adapter: {
			"type": "restapi",
			collection_name: "login",
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
		});

		return Collection;
	}
};