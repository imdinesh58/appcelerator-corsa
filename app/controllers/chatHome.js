// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var timeUtil = require('util');
var moment = require('moment-with-locales.min');

//bind event\\
timeUtil.returnFireEvent().bind('LoadChatSummary', function() {
	chatMessages();
});

// Text Chat History
function loadWin() {
	Alloy.Globals.openWindows.push({
		'chatHome' : $.win
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Summary";
			}
		}
	}
	chatMessages();
}

///$.table.data[0].rows.length - 1

function chatMessages() {
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function() {
		var responses = JSON.parse(this.responseText);

		//Ti.API.error("RESPONSES " + responses.length);
		if (responses.length == 0) {
			alert("No Chat History Found");
		} else {
			showMessages(responses);
		}
	};
	xhr.onerror = function() {
		alert('Service down...please try again');
		if (xhr.status == 401) {
			timeUtil.closeAllOpenWindows();
			Alloy.createController('signin').getView().open();
		}
		if (xhr.status == 500) {
			alert("Internal Server Error");
		}
	};
	//xhr.open('GET', 'https://api.ucorsa.com/api/messages?ride_id=' + args.RideId + '&driver_id=' + args.DriverId);
	xhr.open('GET', 'https://api.ucorsa.com/api/chat/summary');
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
};

function showMessages(Res) {
	try {
		var tblRows = [];
		//Ti.API.error("showMessages before *****   " + JSON.stringify(Res));
		//Ti.API.error("showMessages before length *****   " + Res.length);
		//for (var j = 0; j < Res.length; j++) {
		var rows = Ti.UI.createTableViewRow({
			height : 80,
			width : Ti.UI.SIZE,
			backgroundColor : '#F2EFE8'
		});
		tblRows.push(rows);
		var user = Ti.UI.createLabel({
			text : Res.name,
			top : '20%',
			left : '25%',
			color : '#786658',
			font : {
				fontSize : '15sp',
				fontWeight : 'bold'
			},
			obj : 'click',
			ID__ : Res.rideid,
			Rider_id : Res.rider_id,
			DriverId : Res.driver_id
		});
		rows.add(user);
		var msge = Ti.UI.createLabel({
			text : Res.message,
			top : '50%',
			left : '25%',
			width : '70%',
			height : 'auto',
			color : '#786658',
			font : {
				fontSize : '15sp'
			},
			obj : 'click',
			ID__ : Res.rideid,
			Rider_id : Res.rider_id,
			DriverId : Res.driver_id
		});
		rows.add(msge);
		var img = Ti.UI.createLabel({
			left : "1%",
			width : 70,
			height : 70,
			backgroundImage : '/icons/contact_reverse.png',
			obj : 'click',
			ID__ : Res.rideid,
			Rider_id : Res.rider_id,
			DriverId : Res.driver_id
		});
		rows.add(img);
		var date = Ti.UI.createLabel({
			text : moment(Res.ts).format('MMMM Do, YYYY, h:mm A'),
			top : '22%',
			right : '0%',
			width : "auto",
			color : '#786658',
			font : {
				fontSize : '9sp'
			},
			obj : 'click',
			ID__ : Res.rideid,
			Rider_id : Res.rider_id,
			DriverId : Res.driver_id
		});
		rows.add(date);

		rows.addEventListener('click', function(e) {
			if (e.source.obj == "click") {
				Ti.App.Properties.setString('imRider', 'fromChatHome');
				Alloy.createController('chat', {
					"RideId" : e.source.ID__,
					"RiderId" : e.source.Rider_id,
					"DriverId" : e.source.DriverId,
					"SenderId" : e.source.Rider_id
				}).getView().open();
			}
		});
		//}
		$.table.setData(tblRows);
	} catch(err) {
	}
}

function Close() {
	Alloy.Globals.openWindows.pop();
	$.win.close();
	$.win = null;
}

$.win.open();
