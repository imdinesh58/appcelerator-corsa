// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var timeUtil = require('util');
var moment = require('moment-with-locales.min');

var SendFlag = false;
var POS;
var ChatUser = Ti.App.Properties.getString('imRider', '');
var presenceCheck = 1;
var Occupancy = 0;
var channel = args.RideId + '-' + args.DriverId + '-' + args.Rider_Id;

function rnd_hex(light) {
	return Math.ceil(Math.random() * 9);
}

function rnd_color() {
	return '#' + pubnub.map(Array(3).join().split(','), rnd_hex).join('');
}

// INIT PUBNUB
var pubnub = require('pubnub')({
	publish_key : 'pub-c-94102861-2aae-4f59-bb5e-8c4cf8542656',
	subscribe_key : 'sub-c-95292610-eca1-11e4-8401-0619f8945a4f',
	ssl : true,
	origin : 'pubsub.pubnub.com',
	native_tcp_socket : false,
	uuid : Ti.App.Properties.getString('User_NAME')
});

pubnub.subscribe({
	channel : channel,
	presence : function(presence) {
		////Ti.API.info("PRESENCE  " + JSON.stringify(presence));
		var userPres = presence.action;
		///join, leave, and timeout
		if (userPres == "join") {
			Ti.App.Properties.setBool("isLeft", false);
			Occupancy = Occupancy + 1;
		}
		if (userPres == "leave") {
			Occupancy = Occupancy - 1;
			Ti.App.Properties.setBool("isLeft", true);
		}
	},
	callback : receiveMessage,
	error : receiveMessage,
	withPresence : true
});

// Text Chat History
function loadWin() {
	Ti.App.Properties.setString('ChannelWindow', channel);

	Alloy.Globals.openWindows.push({
		'chat' : $.win
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "Messages";
			}
		}
	}
	//alert("onload  " + ChatUser);
	if (ChatUser == 'fromuride') {
		RiderHistory();
	}
	if (ChatUser == 'fromudrive') {
		DriverHistory();
	}
};

function HereNow() {
	//here now
	pubnub.here_now({
		channel : channel,
		callback : function(m) {
			//alert("HERE now  " + JSON.stringify(m));
			Occupancy = m.occupancy;
		}
	});
};

// Append First Row (Blank)
$.table.appendRow(Ti.UI.createTableViewRow({
	className : "pubnub_chat",
	height : 80, //80
	backgroundColor : "#E3DED6"
}));

// Listen for Send Button Touch
function send() {
	if (presenceCheck) {
		HereNow();
		presenceCheck = 0;
	}
	SendFlag = true;
	if ($.textfield.value == "") {
		alert('Enter Your message.... !!!');
	} else {
		if (Occupancy > 1) {//user joined in chat room
			saveChat($.textfield.value);
		} else {//occ == 1
			if (Ti.App.Properties.getBool("isLeft") == true) {
				if (ChatUser == 'fromuride') {//user not joined or left chat room so notify your message & save yours msge
					notifyRider();
				} else if (ChatUser == 'fromudrive') {//user not joined or left chat room so notify your message & save yours msge
					notifyDriver();
				}
			} else if (Ti.App.Properties.getBool("isLeft") == undefined || Ti.App.Properties.getBool("isLeft") == "" || Ti.App.Properties.getBool("isLeft") == null) {
				if (ChatUser == 'fromuride') {//user not joined or left chat room so notify your message & save yours msge
					notifyRider();
				} else if (ChatUser == 'fromudrive') {//user not joined or left chat room so notify your message & save yours msge
					notifyDriver();
				}
			} else {
				saveChat($.textfield.value);
			}
		}
	}
};

function notifyRider() {
	var chat__ = Alloy.createCollection("startchat_rider");
	var params = {
		driver_id : args.DriverId,
		channel_id : channel,
		message : $.textfield.value
	};
	chat__.create(params, {
		success : function(collection, response) {
			//Ti.API.info("response " + JSON.stringify(response));
			saveChat($.textfield.value);
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			alert("session expired, please log back.");
			if (parseResponse.status == 401) {
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
};

function notifyDriver() {
	var chat = Alloy.createCollection("startchat_driver");
	var params = {
		rider_id : args.Rider_Id,
		channel_id : channel,
		message : $.textfield.value
	};
	chat.create(params, {
		success : function(collection, response) {
			//Ti.API.info("response " + JSON.stringify(response));
			saveChat($.textfield.value);
		},
		error : function(err, response) {
			var parseResponse = JSON.parse(response);
			alert("session expired, please log back.");
			if (parseResponse.status == 401) {
				timeUtil.closeAllOpenWindows();
				Alloy.createController('signin').getView().open();
			}
		}
	});
}

function saveChat(message) {
	var mdl = Alloy.createModel("chatSendRider");
	if (Ti.App.Properties.getBool('RiderTrue', '') == true) {
		var sendBy = "R";
	} else {
		var sendBy = "D";
	}
	var params = {
		"RIDE_ID" : args.RideId,
		"RIDER_ID" : args.Rider_Id,
		"DRIVER_ID" : args.DriverId,
		"MESSAGE" : message,
		"SEND_BY" : sendBy
		//Ti.App.Properties.getBool('RiderTrue', '') == true ? "R" : "D"
	};
	mdl.save(params, {
		success : function(model, response) {
			SendFlag == false;
			publishMessage(message);
		},
		error : function(err, response) {
			alert('Error in sending your message....');
		}
	});
}

var MessageSent;
function publishMessage(msg) {
	$.textfield.value = "";
	$.textfield.blur();
	if (OS_IOS) {
		$.table.height = '90%';
		$.textfield.top = '92%';
		$.button.top = '92%';
	}
	//Ti.API.error("channel PUBLISH " + channel);
	pubnub.publish({
		channel : channel,
		message : {
			text : msg
		},
		callback : function(m) {
			//alert('callback ' + JSON.stringify(m));
		},
		error : function(m) {
			//alert('Error ' + JSON.stringify(e));
		}
	});
	//Ti.App.Properties.setBool('MessageSent', true);
	MessageSent = true;
};

// receive Messages
function receiveMessage(obj) {
	var tblRows = [];
	if (MessageSent == true) {
		POS = "right";
		MessageSent = false;
	} else {
		POS = "left";
	}

	var row = Alloy.createController('chatTableviewRow', {
		sendText : obj.text,
		sendDate : moment().format('LT'),
		position : POS
	}).getView();

	tblRows.push(row);
	$.table.appendRow(tblRows);

	$.table.scrollToIndex($.table.data[0].rows.length - 1, {
		animated : Titanium.UI.ANIMATION_CURVE_EASE_OUT
	});
}

function RiderHistory() {
	//alert('RiderHistory  ' + args.RideId + "-" + args.DriverId);
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = displayChatHistory;
	xhr.onerror = function() {
		alert('Service down...please try again');
		if (xhr.status == 401) {
			timeUtil.closeAllOpenWindows();
			Alloy.createController('signin').getView().open();
		}
	};
	xhr.open('GET', 'https://api.ucorsa.com/api/messages?ride_id=' + args.RideId + '&driver_id=' + args.DriverId);
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
};

function DriverHistory() {
	//Ti.API.info('DriverHistory');
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = displayChatHistory;
	xhr.onerror = function() {
		alert('Service down...please try again');
		if (xhr.status == 401) {
			timeUtil.closeAllOpenWindows();
			Alloy.createController('signin').getView().open();
		}
	};
	xhr.open('GET', 'https://api.ucorsa.com/api/messages?ride_id=' + args.RideId);
	xhr.setRequestHeader('access-token', Ti.App.Properties.getString('tokenaccess', ''));
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
}

function displayChatHistory(response) {
	try {
		var response = JSON.parse(this.responseText);
		//alert("Response  " + JSON.stringify(response));
		if (response.length > 0) {
			var tblRows = [];
			for (var j = 0; j < response.length; j++) {
				var pos = 'right';
				//alert('displayChatHistory  -->  ' + ChatUser + "  &&  " + response[j].SEND_BY);
				if ((ChatUser == 'fromuride') && (response[j].SEND_BY == "D")) {
					pos = 'left';
				}
				if ((ChatUser == 'fromudrive') && (response[j].SEND_BY == "R")) {
					pos = 'left';
				}
				var row = Alloy.createController('chatTableviewRow', {
					sendText : response[j].MESSAGE,
					sendDate : moment(response[j].update_ts).format('MMMM Do, YYYY, h:mm A'),
					position : pos
				}).getView();

				tblRows.push(row);
			}
			//end loop
			$.table.data = tblRows;
		}
	} catch(err) {
	}
};

function focusKey() {
	if ($.textfield.value.length > 0) {
		$.table.height = '33%';
		//93
		$.textfield.top = '40%';
		$.button.top = '40%';
	} else {
		$.table.height = '90%';
		//93
		$.textfield.bottom = '0%';
		$.button.bottom = '0%';
	}
};

function Close() {
	try {
		Ti.App.Properties.setString('ChannelWindow', '');
		// Unsubscribe from 'my_channel'
		pubnub.unsubscribe({
			channel : channel
		});
		Alloy.Globals.openWindows.pop();
		$.win.close();
		$.win = null;
	} catch(err) {
	}
}

$.win.open();
