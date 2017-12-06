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
		height : 300,
		backgroundColor : '#F2EFE8',
		width : 300,
		borderRadius : 10
	});
	}
	if(OS_IOS){
	var containerView = Ti.UI.createView({// Set height appropriately
		height : 300,
		backgroundColor : '#F2EFE8',
		width : 330,
		borderRadius : 10
	});
	}

	var saveButton = Ti.UI.createLabel({
		text : 'Save',
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
	if(OS_ANDROID){
		var Daypicker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_PLAIN,
		top : "15%",
		width :  Titanium.UI.SIZE,
		height : Titanium.UI.SIZE,
		left : "30%",
		transform : Titanium.UI.create2DMatrix().scale(1.5), //1.5
		useSpinner : true,
		textAlign : 'center'
	});
	}
	
	if(OS_IOS){
	var Daypicker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_PLAIN,
		top : "5%",
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : "0%",
		backgroundColor : "#00548A",
		borderColor : "#001E45",
		borderRadius : 7,
		transform : Titanium.UI.create2DMatrix().scale(1)
	});
	}
	
	var day = ['Car Model Year','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979','1980',
	'1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999',	
	'2000','2001', '2002', '2003', '2004', '2005', '2006', '2007'
	,'2008','2009', '2010', '2010', '2011', '2012', '2013', '2014'
	,'2015','2016','2017'];

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
	Daypicker.add(column);

	containerView.add(Daypicker);
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
		Daypicker : Daypicker,
		saveButton : saveButton,
		closeButton : closeButton
	};
};

module.exports = CustomModal;
