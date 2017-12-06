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
	if(OS_ANDROID){
	var containerView = Ti.UI.createView({// Set height appropriately
		height : 310,
		backgroundColor : '#F2EFE8',
		width : 300, //390
		borderRadius : 10
	});
	}
	if(OS_IOS){
		var containerView = Ti.UI.createView({// Set height appropriately
		height : 310,
		backgroundColor : '#F2EFE8',
		width : 340, //390
		borderRadius : 10
	});
	}

	var saveButton = Ti.UI.createLabel({
		text : 'Update',
		bottom : 10,
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
		bottom : 10,
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
	
	//date
	var currentTime = new Date();
	var month = currentTime.getMonth();
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	//time
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();

    if(OS_ANDROID){
	var Datepicker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		minDate : new Date(2016, 1, 1),
		maxDate : new Date(2050, 1, 1),
		value : new Date(year , month ,day),
		top : "35%",
		width : Titanium.UI.SIZE, //Titanium.UI.SIZE
		height : Titanium.UI.SIZE,
		left : "35%",
		transform : Titanium.UI.create2DMatrix().scale(3), ///3
		useSpinner : true,
		textAlign : 'center'	
	});
	}
	if(OS_IOS){
		var Datepicker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		minDate : new Date(2016, 1, 1),
		maxDate : new Date(2050, 1, 1),
		value : new Date(year , month ,day),
		top : "0%",
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : "0%",
		backgroundColor : "#00548A",
		borderColor : "#001E45",
		borderRadius : 7,
		transform : Titanium.UI.create2DMatrix().scale(0.9),  //0.8
		useSpinner : true
	});
	}

	containerView.add(Datepicker);
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
		Datepicker : Datepicker,
		saveButton : saveButton,
		closeButton : closeButton
	};
};

module.exports = CustomModal;
