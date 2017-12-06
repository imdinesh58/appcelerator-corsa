var args = arguments[0] || {};

var collection = Alloy.createCollection("Model_Group");

var timeUtil = require('util');
var refreshObject = timeUtil.refreshEvent();

refreshObject.on('AddNewGROUP', function(msg) {
	addNewCircle();
});

function showCircles() {
	Ti.API.info("showCircles called");
	var circles = [];
	collection.fetch({
		success : function(collection, response) {
			_.each(collection.models, function(element, index, list) {
				circles.push(Alloy.createController('uContactsCircle', {
					id : index,
					data : element.attributes
				}).getView());
			});

			if (!circles.length) {
				$.nodata.show();
			} else {
				$.nodata.hide();
			}

			$.tableCircles.data = circles;
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
}

refreshObject.on('LoadMember', function(msg) {
	showCircles();
});

function onClick(event) {
	if (event.source.id == 'showMbrs') {
		onClickedShowMembers(event);
	} else if (event.source.id == 'addMbr') {
		onClickedAddMember(event);
	} else if (event.source.id == 'updtCircle') {
		onClickedUpdateCircle(event);
	} else if (event.source.id == 'delCircle') {
		onClickedDeleteCircle(event);
	} else if (event.source.id == 'delMember') {
		onClickedDeleteMember(event);
	}
}

function onClickedShowMembers(event) {
	var mbrs = collection.models[event.index].get('members');
	// alert("Members: " + JSON.stringify(mbrs));
	if (event.source.click == 'no') {
		event.source.click = 'yes';
		event.source.image = '/common/S2.png';
		// change the image from downarrow to uparrow
		var insertAfterRow = event.index;
		for ( i = 0; i < mbrs.length; i++) {
			var mbrRowView = Alloy.createController('uContactsCircleMember', {
				id : i,
				data : mbrs[i]
			}).getView();
			$.tableCircles.insertRowAfter(insertAfterRow, mbrRowView);
			insertAfterRow = insertAfterRow + 1;
		}
	} else {
		if (event.source.click == 'yes') {
			event.source.click = 'no';
			event.source.image = "/common/S1.png";
			// change the image from downarrow to uparrow
			for ( i = 0; i < mbrs.length; i++) {
				$.tableCircles.deleteRow(event.index + 1);
			}
		}
	}
}

function onClickedAddMember(rowIndex) {
	if (rowIndex.source.isAddMember) {
		Alloy.createController('groupmembers', {
			G_ID : rowIndex.source.circleId
		}).getView().open();
	}
}

function onClickedUpdateCircle(rowIndex) {
	if (rowIndex.source.isUpdate) {
		UpdateCircle(rowIndex.source.circleId);
	}
}

function onClickedDeleteCircle(rowIndex) {
	if (rowIndex.source.objName == 'delCircle') {
		deleteCircle(rowIndex.source.circleId);
		// $.tableCircles.deleteRow(rowIndex);
	}
}

function onClickedDeleteMember(rowIndex) {
	if (rowIndex.source.objName == 'delMember') {
		deleteMember(rowIndex.source.circleMemberId);
		// $.tableCircles.deleteRow(rowIndex);
	}
}

////////////////////////////////////////////
/////////// Expand \\\\\\
////////////////////////////////////////////
function createMemberRowView(mbrId) {
	var height = 0;
	var rows = Ti.UI.createTableViewRow({
		height : 50,
		backgroundColor : '#F2EFE8'
	});
	var line3View = Ti.UI.createView({
		backgroundColor : '#F2EFE8',
		top : height + 5,
		left : '0%',
		height : 'auto'
	});
	var Name = Ti.UI.createLabel({
		text : group.first_name,
		phone : group.phone,
		left : '20%',
		height : 'auto',
		bottom : '50%',
		color : '#786658',
		font : {
			fontSize : '14sp',
			fontWeight : 'bold'
		}
	});
	var Number_ = Ti.UI.createLabel({
		text : group.phone,
		phone : group.phone,
		left : '20%',
		height : 'auto',
		bottom : '5%',
		color : '#786658',
		font : {
			fontSize : '14sp'
			//fontStyle : 'italic'
		}
	});
	var delete_ = Ti.UI.createLabel({
		objName : 'del',
		GroupMemberID_ : group.GroupMemberID,
		bottom : '30%',
		right : '1%',
		width : '20dp',
		height : '20dp',
		backgroundImage : '/icons/delete.png'
	});
	line3View.add(Name);
	line3View.add(Number_);
	line3View.add(delete_);
	rows.add(line3View);
	rows.addEventListener('click', function(e) {
		if (e.source.objName == 'del') {
			var mModel = Alloy.createModel("Model_Member");
			mModel.set("id", e.source.GroupMemberID_);
			mModel.destroy({
				success : function(collection, response) {
					$.tableCircles.deleteRow(e.row);
				},
				error : function() {
				}
			});
		}
	});
	return rows;
}

////////////////////////////////////////////
/////////// add New Circle \\\\\\\\\\\\\\\\\\
////////////////////////////////////////////
function addNewCircle() {
	var guideView = Ti.UI.createView({
		opacity : 1,
		zindex : 20,
		height : 200,
		backgroundColor : '#F2EFE8', //F2EFE8
		width : '90%',
		borderRadius : 10,
		borderColor : '#001E45',
		top : '0%',
		left : '5%'
	});
	$.winCircles.add(guideView);
	var text = Ti.UI.createTextField({
		top : '40%',
		width : '60%',
		left : '20%',
		height : '20%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'light'
		},
		hintTextColor : '#786658',
		color : '#786658',
		tintColor : '#786658',
		backgroundColor : '#cccccc',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius : 6,
		borderColor : '#001E45',
		hintText : 'Enter circle name'
	});
	var saveButton = Ti.UI.createLabel({
		text : 'Save',
		bottom : 5,
		color : '#f2efe8',
		width : '25%',
		height : '20%',
		left : '20%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	var closeButton = Ti.UI.createLabel({
		text : 'Cancel',
		bottom : 5,
		color : '#f2efe8',
		width : '25%',
		height : '20%',
		right : '20%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	var topLabel = Ti.UI.createLabel({
		text : 'Add Circle',
		top : 0,
		color : 'white',
		width : '100%',
		height : '20%',
		left : '0%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});
	guideView.add(topLabel);
	guideView.add(text);
	guideView.add(saveButton);
	guideView.add(closeButton);
	saveButton.addEventListener('click', function() {
		if (text.value == "") {
			alert("Enter Circle Name");
		} else {
			serviceCallAddNewCircle(text.value);
			showCircles();
			guideView.hide();
			guideView = null;
		}
	});
	closeButton.addEventListener('click', function() {
		guideView.hide();
		guideView = null;
	});
};

function serviceCallAddNewCircle(gname) {
	var grp = Alloy.createModel("Model_Group");
	var params = {
		name : gname
	};
	grp.save(params, {
		success : function(model, response) {
			grp.set("id", response.id);
			collection.add(model);

			var Ncircle = [];
			_.each(collection.models, function(element, index, list) {
				Ncircle.push(Alloy.createController('uContactsCircle', {
					id : index,
					data : element.attributes
				}).getView());
			});
			$.tableCircles.setData(Ncircle);
			showCircles();
		},
		error : function(err) {
			alert(JSON.stringify(err));
		}
	});
}

//////////////////////////////////////////
//Update Circle
///////////////////////////////////////////
function UpdateCircle(ID_Group) {
	if (OS_IOS) {
		var guideView = Ti.UI.createView({
			opacity : 1,
			zindex : 20,
			height : 200,
			backgroundColor : '#F2EFE8', //F2EFE8
			width : '90%',
			borderRadius : 10,
			borderColor : '#001E45',
			top : '0%',
			left : '5%'
		});
	}
	if (OS_ANDROID) {
		var guideView = Ti.UI.createView({
			opacity : 1,
			zindex : 20,
			height : 200,
			backgroundColor : '#F2EFE8', //F2EFE8
			width : '90%',
			borderRadius : 10,
			borderColor : '#001E45',
			top : '25%',
			left : '5%'
		});
	}
	$.winCircles.add(guideView);
	var text = Ti.UI.createTextField({
		top : '40%',
		width : '60%',
		left : '20%',
		height : '20%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'light'
		},
		hintTextColor : '#786658',
		color : '#786658',
		tintColor : '#786658',
		backgroundColor : '#cccccc',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius : 6,
		borderColor : '#001E45',
		hintText : 'Enter New Circle Name'
	});
	var saveButton = Ti.UI.createLabel({
		text : 'Update',
		bottom : 5,
		color : '#f2efe8',
		width : '25%',
		height : '20%',
		left : '20%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	var closeButton = Ti.UI.createLabel({
		text : 'Cancel',
		bottom : 5,
		color : '#f2efe8',
		width : '25%',
		height : '20%',
		right : '20%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	var topLabel = Ti.UI.createLabel({
		text : 'Update Circle',
		top : 0,
		color : 'white',
		width : '100%',
		height : '20%',
		left : '0%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	guideView.add(topLabel);
	guideView.add(text);
	guideView.add(saveButton);
	guideView.add(closeButton);
	saveButton.addEventListener('click', function() {
		if (text.value == "") {
			alert("Enter New Circle Name");
		} else {
			serviceCallUpdateGroup(ID_Group, text.value);
			guideView.hide();
			guideView = null;
		}
	});
	closeButton.addEventListener('click', function() {
		guideView.hide();
		guideView = null;
	});
}

function serviceCallUpdateGroup(ID_Group, Update) {
	var grp = Alloy.createModel("Model_Group");
	var params = {
		id : ID_Group,
		name : Update
	};
	grp.save(params, {
		success : function(model, response) {
			collection.get(ID_Group).set("name", Update);
			var Ucircle = [];
			_.each(collection.models, function(element, index, list) {
				Ucircle.push(Alloy.createController('uContactsCircle', {
					id : index,
					data : element.attributes
				}).getView());
			});
			$.tableCircles.setData(Ucircle);
			showCircles();
		},
		error : function(err) {
			alert(JSON.stringify(err));
		}
	});
}

//////////////////////////////////////////
//delete Circle
///////////////////////////////////////////
function deleteCircle(id) {
	var gModel = collection.get(id);
	gModel.destroy({
		success : function(collection, response) {
			showCircles();
		},
		error : function(err, response) {
			alert("error " + response);
		}
	});
}

//////////////////////////////////////////
//delete Member
///////////////////////////////////////////
function deleteMember(id) {
	var mModel = Alloy.createModel("Model_Member");
	mModel.set("id", id);
	mModel.destroy({
		success : function(collection, response) {
			showCircles();
		},
		error : function(err, response) {
			alert("error " + response);
		}
	});
}

function closeWindow() {
	refreshObject.off('LoadMember');
	refreshObject.off('AddNewGROUP');
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}

