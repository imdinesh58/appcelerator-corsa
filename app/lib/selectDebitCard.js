var CustomModal = function() {
	var myModal = Ti.UI.createWindow({
		title : '',
		backgroundColor : 'transparent'
	});

	var wrapperView = Ti.UI.createView();
	// Full screen
	var backgroundView = Ti.UI.createView({// Also full screen
		backgroundColor : '#F2EFE8',
		opacity : 0.5
	});

	var containerView = Ti.UI.createView({// Set height appropriately
		height : 600,
		backgroundColor : '#F2EFE8',
		width : 350
	});

	var toplabel = Ti.UI.createLabel({
		text : 'Select Debit Card',
		top : 0,
		color : 'white',
		width : '100%',
		height : '7%',
		left : '0%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '20sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});
	containerView.add(toplabel);

	var closeButton = Ti.UI.createLabel({
		text : 'Close',
		bottom : 0,
		color : 'white',
		width : '100%',
		height : '7%',
		left : '0%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '20sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});

	containerView.add(closeButton);

	wrapperView.add(backgroundView);
	wrapperView.add(containerView);

	myModal.add(wrapperView);

	myModal.open({
		animate : true,
		modal : true
	});

	return {
		myModal : myModal,
		closeButton : closeButton,
		containerView : containerView
	};
};

module.exports = CustomModal;
