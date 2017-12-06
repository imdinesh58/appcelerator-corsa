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
		height : '80%',
		width : '80%',
		backgroundColor : '#F2EFE8',
		borderRadius : 0
	});

	var toplabel = Ti.UI.createLabel({
		top : 0,
		left : '0%',
		width : '100%',
		height : '10%',
		color : 'white',
		text : 'Stripe Services Agreement',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 0
	});
	containerView.add(toplabel);

	var label = Ti.UI.createLabel({
		top : '15%',
		left : '10%',
		width : '80%',
		height : 'auto',
		text : "Payment processing services for drivers on uCorsa are provided by Stripe and are subject to the Stripe Connected Account Agreement, which includes the Stripe Terms of Service. By agreeing to these terms or continuing to operate as a on uCorsa, you agree to be bound by the Stripe Services Agreement, as the same may be modified by Stripe from time to time. As a condition of uCorsa enabling payment processing services through Stripe, you agree to provide uCorsa accurate and complete information about you and your business, and you authorize uCorsa to share it and transaction information related to your use of the payment processing services provided by Stripe.",
		color : '#92857A',
		textAlign : 'left',
		font : {
			fontSize : '12sp'
		}
	});
	containerView.add(label);

	var accept = Ti.UI.createLabel({
		bottom : '10%',
		left : '10%',
		width : '25%',
		height : '10%',
		text : "Accept",
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
	containerView.add(accept);

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

	wrapperView.add(backgroundView);
	wrapperView.add(containerView);

	myModal.add(wrapperView);	
	
	myModal.open({
		animate : true,
		modal : true
	});

	return {
		myModal : myModal,
		accept : accept,
		closeButton : closeButton
	};
};

module.exports = CustomModal;
