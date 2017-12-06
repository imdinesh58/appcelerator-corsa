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
		width : 330,
		borderRadius : 10
	});

	var saveButton = Ti.UI.createLabel({
		text : 'Add',
		bottom : 20,
		color : '#f2efe8',
		width : '25%',
		height : '10%',
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
		bottom : 20,
		color : '#f2efe8',
		width : '25%',
		height : '10%',
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
	
	if(OS_ANDROID){
	var RIDER = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_PLAIN,
		top : "20%",
		width :  Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : "30%",
		borderRadius : 7,
		textAlign : 'center',
		transform : Titanium.UI.create2DMatrix().scale(1.3),
		useSpinner : true
	});
	}
	if(OS_IOS){
		var RIDER = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_PLAIN,
		top : "5%",
		width :  Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : "1%",
		textAlign : 'center',
		backgroundColor : "#00548A",
		borderColor : "#001E45",
		align : 'center',
		borderRadius : 7,
		transform : Titanium.UI.create2DMatrix().scale(1),
		useSpinner : true
	});
	}
	
	var day = ['Pick No of Riders','1','2', '3', '4', '5', '6', '7', '8', '9'];

var column = Ti.UI.createPickerColumn({
		backgroundColor : "#9E958C"
	});
	for (var i = 0, ilen = day.length; i < ilen; i++) {
		var row3 = Ti.UI.createPickerRow({
			title : day[i],
			custom_day : day[i],
			color : '#786658'
		});
		column.addRow(row3);
	}
	RIDER.add(column);

	containerView.add(RIDER);

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
		RIDER : RIDER,
		saveButton : saveButton,
		closeButton : closeButton
	};
};

module.exports = CustomModal;
