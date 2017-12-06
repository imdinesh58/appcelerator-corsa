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
		borderRadius : 2
	});
	
	var topLabel = Ti.UI.createLabel({
		top : 0,
		left : '0%',
		height : '10%',
		width : '100%',
		text : 'Enter Additional Notes',
		textAlign : 'center',
		color : 'white',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
	});
	
    var TexT = Ti.UI.createTextArea({
		top : '20%',
		left : '10%',
		height : '50%',
		width : '80%',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		color : '#786658',
		backgroundColor : '#cccccc',
		textAlign : "left",
		borderRadius : 0,
		borderColor : '#001E45',
	});
	
	var saveButton = Ti.UI.createLabel({
		text : 'Add',
		bottom : '10%',
		left : '20%',
		height : '10%',
		width : '25%',
		color : '#f2efe8',
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
		bottom : '10%',
		right : '20%',
		width : '25%',
		height : '10%',
		color : '#f2efe8',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	
	
	containerView.add(topLabel);
	containerView.add(TexT);
	containerView.add(saveButton);
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
		TexT : TexT,
		saveButton : saveButton,
		closeButton : closeButton
	};
};

module.exports = CustomModal;
