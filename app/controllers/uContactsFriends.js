var args = arguments[0] || {};
var collection = Alloy.createCollection("uCarpool_Contacts");

var createHeaderView = function(args) {
	var headerView = Ti.UI.createView({
		top : 0,
		left : 0,
		height : 50,
		width : 768,
		backgroundColor : '#322110' //322110
	});
	var text1 = Ti.UI.createLabel({
		text : args.title,
		top : 2,
		left : 20,
		height : 45,
		color : 'white',
		font : {
			fontSize : '20sp',
			fontWeight : 'bold'
		}
	});
	headerView.add(text1);
	return headerView;
};

var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

var uCorsa;
var Invite;
var uCorsaCheck = false;
var inviteCheck = false;

var friends;
function loadFriends() {
	try{
		Ti.API.error("Started... friends.js....loadFriends()");
		var Network = require('networkCheck');
		// if( !Network.checkConnectivity()) {
		// Alloy.createController('internet_check').getView().open();
		// } else {
		collection.fetch({
			urlparams : {
				search : "contacts"
			},
			success : function(collection, response) {
				var data = [];
				var ucorsaSection = Ti.UI.createTableViewSection({
					headerView : createHeaderView({
						title : 'Friends',
						uCorsa_ : uCorsa
					})
				});
				var inviteSection = Ti.UI.createTableViewSection({
					headerView : createHeaderView({
						title : 'Invited Friends',
						Invite_ : Invite
					})
				});
				_.each(collection.models, function(element, index, list) {
					Ti.API.error('LoadFriends - element : ' + JSON.stringify(element.attributes));
					if (element.attributes.type == 'U') {
						uCorsaCheck = true;
						ucorsaSection.add(populateTableData(element.attributes));
					} else if (element.attributes.type == 'IN') {
						inviteCheck = true;
						inviteSection.add(populateTableData(element.attributes));
					}
				});
				if (!uCorsaCheck) {
					ucorsaSection.add(populateData());
				} else if (!inviteCheck) {
					inviteSection.add(populateData());
				}
				data.push(ucorsaSection);
				data.push(inviteSection);
				$.tableFriends.data = [ucorsaSection, inviteSection];
			},
			error : function(err, response) {
				var parseResponse = JSON.parse(response);
				alert("session expired, please log back.");
				if (parseResponse.status == 401) {
					myUtil.closeAllOpenWindows();
					Alloy.createController('signin').getView().open();
				}
			}
		});
	}catch(err){}
}

refreshObject.on('RefreshFriends',function(msg) {
	Ti.API.error("Got RefreshFriends Trigger.");
	loadFriends();
});

function populateData() {
	friends = "NoFriends";
	Ti.App.Properties.setString('_ListFriends_', friends);
	//Alloy.Globals.display_on_screen("Started... friends.js....populateData()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var tableRowView = Ti.UI.createView({
		top : '1%', // 10
		left : 10,
		right : 10,
		backgroundColor : '#F2EFE8'
	});
	var nodata = Ti.UI.createLabel({
		text : 'none',
		top : 1, //2
		left : 40,
		height : 45,
		color : 'black',
		font : {
			fontSize : '20sp'
		}
	});
	tableRowView.add(nodata);
	var row = Ti.UI.createTableViewRow({
		height : 40
	});
	row.add(tableRowView);
	return row;
};

var U_NAME;
var I_NAME;
function populateTableData(data) {
	try{
	friends = "Friends";
	Ti.App.Properties.setString('_ListFriends_', friends);
	//Alloy.Globals.display_on_screen("Started... friends.js....populateTableData()", Ti.UI.NOTIFICATION_DURATION_SHORT);
	var tableRowView = Ti.UI.createView({
		top : 0,
		left : 10,
		right : 10,
		backgroundColor : '#E3DED6'
	});

	var text1 = Ti.UI.createLabel({
		text : data.first_name,
		mail : data.email,
		top : 5, //'25%',
		left : '22%', //'3%',
		height : 32,
		color : 'black',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		}
	});
	tableRowView.add(text1);
	var phone = Ti.UI.createLabel({
		text : data.phone,
		bottom : 15, //'25%',
		left : '22%', //'3%',
		height : 32,
		color : 'black',
		font : {
			fontSize : '15sp',
			fontWeight : 'light'
		}
	});
	tableRowView.add(phone);
	var text2 = Ti.UI.createLabel({
		text : data.name,
		top : 5, //'25%',
		left : '22%', //'3%',
		height : 32,
		color : 'black',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		}
	});
	tableRowView.add(text2);
	if (data.type == "U") {
		var delete_ = Ti.UI.createLabel({
			objName : 'del',
			_ID_ : data.id,
			top : 20,
			right : '1%',
			width : 30,
			height : 30
		});
		if (OS_IOS) {
			delete_.backgroundImage = '/converted/trash.png';
		}
		if (OS_ANDROID) {
			delete_.backgroundImage = '/images/trash.png';
		}
		tableRowView.add(delete_);
		var edit = Ti.UI.createLabel({
			objName : 'edit',
			_ID_ : data.id,
			top : 14,
			right : '15%',
			width : 37,
			height : 37
			//backgroundImage : '/icons/friends_edit.png'
		});
		if (OS_IOS) {
			edit.backgroundImage = '/converted/friends_edit.png';
		}
		if (OS_ANDROID) {
			edit.backgroundImage = '/images/friends_edit.png';
		}
		tableRowView.add(edit);

		var U = data.first_name;
		U_NAME = U.toString().charAt(0).toUpperCase();
		var customLabel = Ti.UI.createLabel({
			_ID_ : data.id,
			top : 5,
			left : '1%',
			width : 60,
			height : 60,
			text : U_NAME,
			//borderRadius : 40,
			color : 'white',
			backgroundColor : '#BEB0A3',
			textAlign : 'center',
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			font : {
				fontSize : '30sp',
				fontWeight : 'bold'
			}
		});
		if (OS_ANDROID) {
			customLabel.borderRadius = 40;
		}
		if (OS_IOS) {
			customLabel.borderRadius = 30;
		}
		tableRowView.add(customLabel);
	}
	if (data.type == "IN") {
		var I = data.name;
		I_NAME = I.toString().charAt(0).toUpperCase();
		var customLabel2 = Ti.UI.createLabel({
			_ID_ : data.id,
			top : 5,
			left : '1%',
			width : 60,
			height : 60,
			text : I_NAME,
			color : 'white',
			backgroundColor : '#BEB0A3',
			//borderRadius : 40,
			textAlign : 'center',
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			font : {
				fontSize : '35sp',
				fontWeight : 'bold'
			},
			borderColor : '#BEB0A3'
		});
		if (OS_ANDROID) {
			customLabel2.borderRadius = 40;
		}
		if (OS_IOS) {
			customLabel2.borderRadius = 30;
		}
		tableRowView.add(customLabel2);

		var deleteInviteFriends = Ti.UI.createLabel({
			objName : 'delIn',
			_ID_ : data.id,
			top : 20,
			right : '1%',
			width : 30,
			height : 30
		});
		if (OS_IOS) {
			deleteInviteFriends.backgroundImage = '/converted/trash.png';
		}
		if (OS_ANDROID) {
			deleteInviteFriends.backgroundImage = '/images/trash.png';
		}
		tableRowView.add(deleteInviteFriends);
	}

	////check box  - for picking all members from header click
	var row = Ti.UI.createTableViewRow({
		height : 80
	});
	row.add(tableRowView);
	row.addEventListener('click', function(e) {
		if (e.source.objName == 'del') {
			//call service
			////Ti.API.info("***************The delete id is : ***************" + e.source._ID_);
			var model = collection.get(e.source._ID_);
			model.destroy({
				success : function() {
					loadFriends();
				},
				error : function() {
				}
			});
			$.tableFriends.deleteRow(e.row);
		} else if (e.source.objName == 'edit') {
			var model_ = collection.get(e.source._ID_);
			Alloy.createController('editFriend', model_).getView().open();
		} else if (e.source.objName == 'delIn') {
			try{
			//Ti.API.error("***************The delete Friend id is :  " + e.source._ID_);
			var model = collection.get(e.source._ID_);
			model.destroy({
				success : function(response) {
					//Ti.API.error("Delete Success " + JSON.stringify(response));
					loadFriends();
				},
				error : function(err,response) {
					//Ti.API.error("Delete Error " + JSON.stringify(response));
				}
			});
			}catch(err){}
		}
	});
	return row;
	}catch(err){}
};

function closeWindow() {
	//Ti.API.info("closeWindow event called in uContactsFriends Tab.");

	refreshObject.off('RefreshFriends');

	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}
