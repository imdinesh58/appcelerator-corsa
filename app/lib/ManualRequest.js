var CustomModal = function() {
	var myModal = Ti.UI.createWindow({
		title : '',
		backgroundColor : 'transparent'
	});

	var wrapperView = Ti.UI.createView();
	
	var containerView = Ti.UI.createView({// Set height appropriately
		height : '80%',
		width : '80%',
		backgroundColor : '#F2EFE8',
		borderColor : '#001E45',
		borderWidth : 2	
	});
	
	var topLabel = Ti.UI.createLabel({
		text : 'Add Contacts',
		top : 0,
		left : '0%',
		width : '100%',
		height : '10%',
		textAlign : 'center',
		color : 'white',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});

	var name_ = Ti.UI.createTextField({
		top : '25%',
		left : '12%',
		width : '75%',
		height : '10%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'light'
		},
		color : '#786658',
		tintColor : '#786658',
		backgroundColor : '#cccccc',
		borderColor : '#001E45',
		hintText : 'Name',
		hintTextColor : '#786658'
	});
	
	var mobile_ = Ti.UI.createTextField({
		top : '40%',
		left : '12%',
		width : '75%',
		height : '10%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'light'
		},
		color : '#786658',
		tintColor : '#786658',
		backgroundColor : '#cccccc',
		borderColor : '#001E45',
		hintText : 'Mobile No',
		hintTextColor : '#786658',
		keyboardType : Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD,
		returnKeyType : Titanium.UI.RETURNKEY_DONE,
		suppressReturn : true
	});

	var closeText = Ti.UI.createLabel({
		text : 'Cancel',
		top : '55%',
		right : '12%',
		width : '30%',
		height : '10%',
		color : 'white',
		backgroundColor : '#001E45',
		textAlign : 'center',
		font : {
			fontSize : '16sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 7
	});
	
	var InviteText = Ti.UI.createLabel({
		text : 'Done',
		top : '55%',
		left : '12%',
		width : '30%',
		height : '10%',
		color : 'white',
		backgroundColor : '#001E45',
		textAlign : 'center',
		font : {
			fontSize : '16sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 7
	});

	containerView.add(topLabel);
	containerView.add(name_);
	containerView.add(mobile_);
	containerView.add(InviteText);
	containerView.add(closeText);
	wrapperView.add(containerView);
	myModal.add(wrapperView);
	myModal.open({
		animate : true,
		modal : true
	});

	return {
		myModal : myModal,
		closeText : closeText,
		name_ : name_,
		mobile_ : mobile_,
		InviteText : InviteText
	};
};

module.exports = CustomModal;
