
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
		width : 340,
		borderRadius : 10
	});
	
	  var vehicle = Ti.UI.createLabel({
		top : "0%", //'25%',
		left : "0%", //'3%',
		width : '100%',
		textAlign : 'center',
		height : "10%",
		color : 'white',
		font : {
			fontSize : '15sp',
			fontWeight : 'bold'
		},
		text : "Car Details",
		backgroundColor : "#786658"
	});
	
   	var tableView = Ti.UI.createTableView({
		top : '24%',
		height : '55%',
		backgroundColor : "#E3DED6",
		scrollable : true,
		separatorColor : 'white'
	});
	var closeButton = Ti.UI.createLabel({
		text : 'Close',
		bottom : 0,
		color : 'white',
		width : '100%',
		height : '10%',
		left : '0%',
		textAlign : 'center',
		backgroundColor : "#786658",
		font : {
			fontSize : '15sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		}
	});
	
	
	containerView.add(vehicle);
containerView.add(tableView);
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
		vehicle : vehicle,
		tableView : tableView,

		closeButton : closeButton
	};
};

module.exports = CustomModal;
