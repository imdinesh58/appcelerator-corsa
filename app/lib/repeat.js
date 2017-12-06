var CustomModal = function() {
	
	var list = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];
	var daysSelectedIndex = [];
	var specialVar1;
	
	var topPosition = 0;
	var eleHeight = 11;
	var topLocation;

	var myModal = Ti.UI.createWindow({
		title : '',
		backgroundColor : 'transparent',
		windowSoftInputMode : "Titanium.UI.Android.SOFT_INPUT_ADJUST_PAN"
	});

	var wrapperView = Ti.UI.createView();
	
	var containerView = Ti.UI.createView({// Set height appropriately
		height : '80%',
		width : '80%',
		backgroundColor : '#F2EFE8',
		borderColor : '#001E45',
		borderWidth : 2	
	});
		
	var toplabelo = Ti.UI.createLabel({
		text : 'Select days to repeat ride',
		top : '0%',
		left : '0%',
		height : '10%',
		width : '100%',
		color : 'white',
		textAlign : 'center',
		backgroundColor : '#001E45',
		font : {
			fontSize : '16sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});
	containerView.add(toplabelo);

	var save = Ti.UI.createLabel({
		text : 'Done',
		bottom : '0%',
		left : '0%',
		height : '10%',
		width : '100%',
		textAlign : 'center',
		color : 'white',
		backgroundColor : '#001E45',
		font : {
			fontSize : '16sp',
			fontFamily : 'Fira Sans',
			fontWeight : 'bold'
		},
		borderRadius : 1
	});
	containerView.add(save);

	var view_ = [];
	for (var i = 0; i < list.length; i++) {
		topPosition += eleHeight;
		topLocation = topPosition + '%';
		view_[i] = Ti.UI.createLabel({
			id : i,
			top : topLocation,
			left : '0%',
			height : '10%',
			width : '100%',
			text : list[i],
			textAlign : 'center',
			font : {
				fontWeight : 'bold',
				fontSize : '16sp'
			},
			color : 'black',
			backgroundColor : 'white',
			borderRadius : 1,
			borderColor : '#F2EFE8'
		});
		containerView.add(view_[i]);
	}
	
	// Event listener on the container view ...	
	myModal.addEventListener('singletap', function(e) {
		if (e.source.backgroundColor == "white") {
			e.source.backgroundColor = "#BEB0A3";
			e.source.color = "white";
			daysSelectedIndex.push(e.source.id);
		} else {
			// delete the unselected entry from the arrays
			e.source.backgroundColor = "white";
			e.source.color = "black";
			var idx = daysSelectedIndex.indexOf(e.source.id);
			if (idx > -1) {
				daysSelectedIndex.splice(idx, 1);
			}
		}
		// sort the selected days
		daysSelectedIndex.sort();
		var specialArray1 = [];
		for( var k = 0; k < daysSelectedIndex.length; k++ ) {
			specialArray1.push( list[ daysSelectedIndex[k] ] );
		}
		var daysOrdered = specialArray1.join(",");
		specialVar1 = daysOrdered;
		// Ti.API.error("Selected Index : " + daysSelectedIndex );
		// Ti.API.error("Days Selected: " + specialVar1);
		Ti.App.Properties.setString("VARiable", specialVar1);
	});

	myModal.addEventListener('androidback', function() {
		//myModal.close();
	});

	// wrapperView.add(backgroundView);
	wrapperView.add(containerView);

	myModal.add(wrapperView);

	myModal.open({
		animate : true,
		modal : true
	});

	return {
		myModal : myModal,
		save : save,
		specialVar1 : specialVar1
	};
};

module.exports = CustomModal;
