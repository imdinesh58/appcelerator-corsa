
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
		height : 300,
		backgroundColor : '#F2EFE8',
		width : 350,
		borderRadius : 10
	});
	var message = Ti.UI.createLabel({
			text : "",
			top : '10%',
			left : '15%',
			width : '75%',
			color : '#001E45',
			height : '60%',
			font : {
				fontSize : '20sp',
				fontStyle : 'italic',
				fontWeight : 'bold'
			}
		});
		containerView.add(message);
		
	var saveButton = Ti.UI.createLabel({
		text : 'Accept',
		bottom : 10,
		color : '#f2efe8',
		width : '20%',
		height : '20%',
		left : '15%',
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
		text : 'Reject',
		bottom : 10,
		color : '#f2efe8',
		width : '20%',
		height : '20%',
		left : '40%',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 6
	});
	var laterButton = Ti.UI.createLabel({
		text : 'Later',
		bottom : 10,
		color : '#f2efe8',
		width : '20%',
		height : '20%',
		right : '15%',
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
		text : 'uCarpool Request',
		top : 0,
		color : 'white',
		width : '100%',
		height : '15%',
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
	containerView.add(topLabel);
	containerView.add(laterButton);
	containerView.add(saveButton);
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
			message : message,
			saveButton : saveButton,
			closeButton : closeButton,
			laterButton : laterButton
		};
 };
 
	module.exports = CustomModal;

