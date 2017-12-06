var args = arguments[0] || {};
/////////////////////////////////
//window onload
////////////////////////////////
var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();
var searchBar = Titanium.UI.createSearchBar({
	top : 0,
	height : 50,
	showCancel : true,
	hintText : "Search",
	color : '#001E45',
	backgroundColor : '#FFFFFF',
	borderWidth : 5,
	borderRadius : 0
});
var listener = function(e) {
	searchBar.blur();
};

searchBar.addEventListener('return', listener);
searchBar.addEventListener('cancel', listener);

$.tableview.search = searchBar;
$.tableview.filterAttribute = 'filter';

function load() {
	Alloy.Globals.openWindows.push({
		'groupmember' : $.contact
	});
	searchBar.blur();
	$.nodata.hide();
	loadMembers();
	// }
}

/////////////////////////////////
//service call - table view contents
////////////////////////////////
function loadMembers() {
	try{
	var collection = Alloy.createCollection("loadMember");
	collection.fetch({
		success : function(collection, response) {

			var data = [];
			_.each(collection.models, function(element, index, list) {
				data.push(loadfromservice(element.attributes));
			});
			$.tableview.setData(data);
			if (!data.length) {
				$.nodata.show();
			}
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			alert("session expired, please log back.");
			if (parseResponse.status == 401) {	
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
	}catch(err){}
}

var sss;
var phoneArray;
var idArray;
var Check = false;
function loadfromservice(response) {
	try{
	$.nodata.hide();
	var rows = Ti.UI.createTableViewRow({
		//title : sss.contacts[i].name,
		filter : response.name,
		phone : response.phone,
		height : 80,
		backgroundColor : '#F2EFE8',
		borderWidth : 2
	});
	var title2 = Ti.UI.createLabel({
		text : response.name,
		phone : response.phone,
		ID : response.userId,
		top : '20%',
		left : '20%',
		color : '#786658',
		font : {
			fontSize : '20sp',
			fontWeight : 'bold'
		}
	});
	rows.add(title2);
	var title3 = Ti.UI.createLabel({
		text : response.formatedPhoneNumber,
		phone : response.phone,
		top : '55%',
		left : '20%',
		color : '#786658',
		font : {
			fontSize : '15sp'
		}
	});
	rows.add(title3);
	var image3 = Ti.UI.createImageView({
		top : '15%',
		width : 60,
		height : 60,
		left : '1%',
		image : '/icons/contact_reverse.png'
	});
	rows.add(image3);
	if (OS_ANDROID) {
		var checkbox = Ti.UI.createSwitch({
			style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
			value : false,
			right : '10%',
			height : '30%',
			width : '5%',
			borderColor : '#786658',
			borderWidth : 2,
			height : '30dp',
			width : '30dp'
		});
		rows.add(checkbox);
	}
	if (OS_IOS) {
		var checkbox = Ti.UI.createSwitch({
			value : false,
			right : '5%',
			height : '30%',
			width : '5%',
			height : '30dp',
			width : '30dp'
		});
		rows.add(checkbox);
	}
	var titleArray = [];
	phoneArray = [];
	idArray = [];
	rows.addEventListener('change', function(e) {
		e.row.value = !e.row.value;
		if (e.row.value == true) {
			Check = true;
			titleArray.push(e.row.children[0].text);
			phoneArray.push(e.row.children[0].phone);
			idArray.push(e.row.children[0].ID);
		} else {
			titleArray.pop(e.row.children[0].text);
			phoneArray.pop(e.row.children[0].phone);
			idArray.pop(e.row.children[0].ID);
		}
		Ti.App.Properties.setString('groupmember_ID', idArray.join(','));
	});
	return rows;
	}catch(err){}
}

/////////////////////////////////////
var drivers_List = [];
var contact_;
var post_data;
var GROUPID;
var USERID_;
function add_members() {
	////Ti.API.info('Start...... addmembers()');
	USERID_ = Ti.App.Properties.getString('groupmember_ID', idArray.join(','));
	if (args.G_ID) {
		GROUPID = args.G_ID;
		//Alloy.Globals.display_on_screen("ANOTHER MEMBER      " + GROUPID, Ti.UI.NOTIFICATION_DURATION_LONG);
	} else {
		GROUPID = Ti.App.Properties.getString('GROUP_ID', '');
		//Alloy.Globals.display_on_screen("From MEMBERS . " + GROUPID, Ti.UI.NOTIFICATION_DURATION_LONG);
	}
	var split_ID = USERID_.split(",");
	//if(split_ID != null || split_ID != undefined || split_ID.length >0){
	for (var i = 0; i < split_ID.length; i++) {
		contact_ = {
			userId : split_ID[i]
		};
		drivers_List.push(contact_);
		post_data = {
			GroupId : GROUPID,
			members : drivers_List
		};
	}
	//}
	var grp = Alloy.createModel("Member");
	grp.save(post_data, {
		success : function(model, response) {
			//alert(JSON.stringify(response));
			//alert(response.message);
			refreshObject.trigger('LoadMember', {
			'Test' : 'Test'
		});
		},
		error : function(err) {
			//alert(JSON.stringify(err));
		}
	});
	//Alloy.Globals.display_on_screen("DATA =  " + JSON.stringify(post_data), Ti.UI.NOTIFICATION_DURATION_SHORT);
}

/////////////////////////////////
//  done button click
////////////////////////////////
function done() {
	////Ti.API.info('Start....done().');
	if (Check == false) {
		alert("Select Members");
	} else {
		add_members();
    	
    	Ti.API.info("Refresh Member");
    	refreshObject.trigger('LoadMember', {
			'Test' : 'Test'
		});
		CloseWindow();
	}
}

function CloseWindow() {
	Alloy.Globals.openWindows.pop();
	$.contact.close();
	$.contact = null;

	searchBar.removeEventListener('return', listener);
	searchBar.removeEventListener('cancel', listener);
}
