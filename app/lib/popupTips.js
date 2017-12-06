var CustomModal = function() {
	var myModal = Ti.UI.createWindow({
		title : '',
		backgroundColor : 'transparent'
	});

	var wrapperView = Ti.UI.createView();
	// Full screen
	// var backgroundView = Ti.UI.createView({// Also full screen
		// backgroundColor : '#F2EFE8',
		// opacity : 0.5
	// });

	var containerView = Ti.UI.createView({// Set height appropriately
		height : '80%',
		width : '80%',
		backgroundColor : '#F2EFE8',
		borderColor : '#001E45',
		borderWidth : 2
	});
	
	var toplabel = Ti.UI.createLabel({
		top : 0,
		left : '0%',
		height : '10%',
		width : '100%',
		text : 'Addt’l. $',
		textAlign : 'center',
		color : 'white',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
	});
	containerView.add(toplabel);
	
	var textFIELD = Ti.UI.createTextField({
		top : '25%',
		left : '10%',
		width : '80%',
		height : '10%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'light'
		},
		hintTextColor : '#786658',
		tintColor: "black",
		color : '#786658',
		backgroundColor : '#cccccc',
		textAlign : "center",
		borderRadius : 1,
		borderColor : '#001E45',
		hintText : 'Addt’l. $'
	});
	
	containerView.add(textFIELD);

	var doneButton = Ti.UI.createLabel({
		bottom : '10%',
		left : '10%',
		width : '25%',
		height : '10%',
		text : "Done",
		color : 'white',
		backgroundColor : '#001E45',
		textAlign : 'center',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 7
	});
	containerView.add(doneButton);

	var closeButton = Ti.UI.createLabel({
		bottom : '10%',
		left : '60%',
		width : '25%',
		height : '10%',
		color : 'white',
		text : 'Cancel',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 7
	});
	containerView.add(closeButton);

	// wrapperView.add(backgroundView);
	wrapperView.add(containerView);

	myModal.add(wrapperView);

	myModal.open({
		animate : true,
		modal : true
	});

	return {
		myModal : myModal,
		textFIELD : textFIELD,
		closeButton : closeButton,
		doneButton : doneButton
	};
};

module.exports = CustomModal;
