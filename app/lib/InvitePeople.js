
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
		// height : 401,
		// backgroundColor : '#F2EFE8',
		// width : 330,
		// borderRadius : 10
		height : '80%',
		width : '80%',
		backgroundColor : '#F2EFE8',
		borderColor : '#001E45',
		borderWidth : 2
	});
	var tableView = Ti.UI.createTableView({
		top : '10%',
		height : '100%',
		backgroundColor : "#E3DED6",
		scrollable : true,
		separatorColor : 'white'
	});
	var InviteButton = Ti.UI.createLabel({
		left : '30%',
		bottom : '10%',
		width : 40,
		height : 40,
		color : '#f2efe8',
		backgroundImage : '/icons/invite.png'
	});
	var InviteText = Ti.UI.createLabel({
		text : 'Invite',
		bottom : '4%',
		left : '23.8%',
		color : '#BEB0A3',
		width : '25%',
		height : '8%',
		textAlign : 'center',
		font : {
			fontSize : '13sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		}
	});
	
	var closeButton = Ti.UI.createLabel({
		bottom : '10%',
		right : '30%',
		width : 40,
		height : 40,
		backgroundImage : '/icons/closeicon.png'
	});
	var closeText = Ti.UI.createLabel({
		text : 'Cancel',
		bottom : '4%',
		right : '23%',
		color : '#BEB0A3',
		width : '25%',
		height : '8%',
		textAlign : 'center',
		font : {
			fontSize : '13sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		}
	});
	
		var topLabel = Ti.UI.createLabel({
		top : 0,
		left : '0%',
		height : '10%',
		width : '100%',
		text : 'Send Invite',
		textAlign : 'center',
		color : 'white',
		backgroundColor : '#001E45',
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		// borderRadius : 6
	});
	
	containerView.add(tableView);
	containerView.add(InviteButton);
	containerView.add(closeButton);	
	containerView.add(InviteText);
	containerView.add(closeText);
	containerView.add(topLabel);
	
	// wrapperView.add(backgroundView);
	wrapperView.add(containerView);
	myModal.add(wrapperView);
	myModal.open({
		animate : true,
		modal : true
	});

    return {
			myModal : myModal,
			closeButton : closeButton,
			tableView : tableView,
			InviteButton : InviteButton
		};
 };
 
	module.exports = CustomModal;