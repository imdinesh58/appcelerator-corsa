// Notifications for Android and iOS /////////////////////////////////////////////////////////////////////
var Cloud = require('ti.cloud');
var myUtil = require('util');
//var dispatcher = require('dispatcher');
//_.extend($, Backbone.Events);
//var eventObject = _.extend({}, Backbone.Events);
var refreshObject = myUtil.refreshEvent();
var uDrives = require('RideRequest');
var uRides = require('RideConfirm');
var uCarpool_req = require('RideRequest');
var uCarpool_con = require('RideConfirm');

var AndroidPush = OS_ANDROID ? require('ti.cloudpush') : null;

var set_RideDetails = Alloy.Models.instance('Notification_title_message');
var set_title = Alloy.Models.instance('save_title');

if (OS_ANDROID) {
	AndroidPush.debug = false;
	AndroidPush.enabled = true;
	AndroidPush.showTrayNotificationsWhenFocused = true;
	AndroidPush.showTrayNotification = true;
	AndroidPush.showAppOnTrayClick = true;
	AndroidPush.focusAppOnPush = true;
}

exports.registerForNotification = function() {
	//// For All ANDROID Versions
	if (OS_ANDROID) {
		Ti.API.error("Android Device - Registering for Notifications.");
		AndroidPush.retrieveDeviceToken({
			success : deviceTokenSuccess,
			error : deviceTokenError
		});
	} else {
		registerForPushNotifications();
	}
};

/* global log */

// Turns the string 8.4.1 into 8 to use in the code
var OS_VERSION = parseInt(Ti.Platform.version.split('.')[0], 10);

// Only enable code if the acs-api-key is set in tiapp.xml
var PUSH_ENABLED = !!Ti.App.Properties.getString('acs-api-key');

/**
 * Self-executing function containing all code that is executed when this module
 * is first required, apart from dependencies and variables declared above. Just
 * for readability, much like a class constructor.
 */
(function constructor(args) {

	if (OS_IOS) {
		// Register for push notifications first because on iOS 8+ it will wait for
		// the usernotificationsettings-event to actual do the registration.
		registerForPushNotifications();

		registerUserNotificationSettings();

		registerForLocalNotifications();
	}

})();

/**
 * Register both local and push notification settings
 */
function registerUserNotificationSettings() {

	// Only for iOS 8 and up
	if (OS_VERSION < 8) {
		return;
		//Ti.API.info('Skipped: registerUserNotificationSettings (requires iOS8 or later).');
	}

	/**
	 * Actions for the TEST_CATEGORY
	 */

	// Launches the app in the foreground
	// Will not be used for Apple Watch notifications
	var fore = Ti.App.iOS.createUserNotificationAction({
		identifier : 'FORE',
		title : 'FORE',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
		destructive : false,

		// Authentication will still be required when used for lock screen notifications
		authenticationRequired : false
	});

	// Launches the app in the background
	var back = Ti.App.iOS.createUserNotificationAction({
		identifier : 'BACK',
		title : 'BACK',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
		destructive : false,
		authenticationRequired : false
	});

	// Launches the app in the background and is styled as destructive
	var backDestr = Ti.App.iOS.createUserNotificationAction({
		identifier : 'BACK_DESTR',
		title : 'BACK + DESTR',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,

		// Will display in red on lock screen and Apple Watch notifications
		destructive : true,

		authenticationRequired : false
	});

	// Launches the app in the foreground and requires the device to be unlocked
	var backAuth = Ti.App.iOS.createUserNotificationAction({
		identifier : 'BACK_AUTH',
		title : 'BACK + AUTH',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
		destructive : false,

		// Authentication will not be required when used for Apple Watch notifications
		authenticationRequired : true
	});

	var testCategory = Ti.App.iOS.createUserNotificationCategory({
		identifier : 'TEST_CATEGORY',

		// The first four of these actions will be used for alert and Apple Watch notifications.
		// Apple Watch will only use actions with background activationMode.
		// Actions are displayed top down and destructive actions should come last (displayed last).
		actionsForDefaultContext : [fore, back, backAuth, backDestr],

		// The first two of these actions will be used for banner and lock screen notifications.
		// Actions are displayed RTL and destructive actions should come first (displayed last).
		actionsForMinimalContext : [backDestr, fore]

	});

	/**
	 * Actions for the CHAT_CATEGORY
	 */

	var replyOK = Ti.App.iOS.createUserNotificationAction({
		identifier : 'OK',

		// Yes, you can use emojies (CTRL+CMD+SPACE on Mac OS X)
		title : 'ok',

		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
		destructive : false,
		authenticationRequired : false
	});

	var reply;

	if (Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_TEXTINPUT) {
		reply = Ti.App.iOS.createUserNotificationAction({
			identifier : 'REPLY',
			title : 'Reply',
			activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,

			// New in Titanium 5.1 is the option to ask the user for input
			behavior : Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_TEXTINPUT,

			destructive : false,
			authenticationRequired : false
		});

	} else {
		reply = Ti.App.iOS.createUserNotificationAction({
			identifier : 'REPLY',
			title : 'Reply',
			activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
			destructive : false,
			authenticationRequired : false
		});
	}

	var markAsRead = Ti.App.iOS.createUserNotificationAction({
		identifier : 'READ',
		title : 'Mark as Read',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
		destructive : false,
		authenticationRequired : false
	});

	var deleteMessage = Ti.App.iOS.createUserNotificationAction({
		identifier : 'DELETE',
		title : 'Delete',
		activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
		destructive : true,
		authenticationRequired : false
	});

	var chatCategory = Ti.App.iOS.createUserNotificationCategory({
		identifier : 'CHAT_CATEGORY',
		actionsForDefaultContext : [replyOK, reply, markAsRead, deleteMessage],

		// We could have left this one undefined as it will default to the first 2 of the above
		actionsForMinimalContext : [replyOK, reply]
	});

	/// Register the notification types and categories
	Ti.App.iOS.registerUserNotificationSettings({
		types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
		categories : [testCategory, chatCategory]
	});

}

/**
 * Register for local notifications
 *
 * See http://docs.appcelerator.com/platform/latest/#!/guide/iOS_Local_Notifications-section-40929226_iOSLocalNotifications-RegisterforLocalNotifications
 */
function registerForLocalNotifications() {

	/**
	 * Fired when the app is opened via a local notification and the user did not
	 * select an action. Also fired when the app was in the foreground when the
	 * local notification was received. There's no flag to tell the difference.
	 * @param  {Object} e See http://docs.appcelerator.com/platform/latest/#!/api/Titanium.App.iOS-event-notification
	 */
	Ti.App.iOS.addEventListener('notification', function onNotification(e) {
		////Ti.API.info('Ti.App.iOS:notification', e);

		if (e.category === 'CHAT_CATEGORY') {
			Alloy.Events.trigger('action', {
				id : e.userInfo.id,
				action : 'REPLY'
			});
		}
	});

	// Local notification actions are for iOS 8 and later only
	if (OS_VERSION < 8) {
		return;
		//Ti.API.info('Skipped: Ti.App.iOS:localnotificationaction (requires iOS8 or later).');
	}

	/**
	 * Fired when a user selects an action for an interactive local notification.
	 * @param  {Object} e See http://docs.appcelerator.com/platform/latest/#!/api/Titanium.App.iOS-event-localnotificationaction
	 */
	Ti.App.iOS.addEventListener('localnotificationaction', function onLocalnotificationaction(e) {
		if (e.category === 'CHAT_CATEGORY') {
			Alloy.Events.trigger('action', {
				id : e.userInfo.id,
				action : e.identifier,

				// New in Ti 5.1 when the action's behavior is Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_TEXTINPUT
				typedText : e.typedText
			});
		}
	});
}

function registerForPushNotifications() {
	//alert("registerForPushNotifications");
	function onSuccess(e) {
		Ti.App.Properties.setString('deviceToken', e.deviceToken);	
		require('ti.cloud').PushNotifications.subscribeToken({
			device_token : e.deviceToken,
			channel : 'alert8',
			type : 'ios'
		}, function(e) {
		});
	}

	function onError(e) {
		//alert("onError");
	}

	function onPush(e) {
		parseMessage(e.data);
	}

	if (OS_VERSION >= 8) {
		// Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush(e) {

			// Remove event listener once registered for push notifications
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

			Ti.Network.registerForPushNotifications({
				success : onSuccess,
				error : onError,
				callback : onPush
			});
		});
		Ti.App.iOS.addEventListener('remotenotificationaction', function onRemotenotificationaction(e) {
			////Ti.API.info('Ti.App.iOS:remotenotificationaction', e);

			if (e.category === 'CHAT_CATEGORY') {
				Alloy.Events.trigger('action', {
					id : e.data.id,
					action : e.identifier
				});
			}
		});
	} else {
		// Before iOS8 the types we needed to be set here
		Ti.Network.registerForPushNotifications({
			types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success : onSuccess,
			error : onError,
			callback : onPush
		});
	}
}

// Process incoming push notifications
function receivePush(e) {
	// alert('Received push: ' + JSON.stringify(e));
	//IOS_Payload(e.data);
	parseMessage(e.data);
}

// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
	////////Ti.App.Properties.setBool('TokenPush', true);
	Ti.API.info('DeviceTokenSuccess() ... Event Details : ' + JSON.stringify(e));
	subscribeToChannel(e.deviceToken);
}

function deviceTokenError(e) {
	alert('Failed to register for push notifications! ' + e.error);
}

function subscribeToChannel(deviceToken) {
	// Subscribes the device to the 'alert8' channel
	// Specify the push type as either 'android' for Android or 'ios' for iOS
	Ti.API.info("Start - SubscribeToChannel ...");
	Cloud.PushNotifications.subscribeToken({
		device_token : deviceToken,
		channel : 'alert8',
		type : Ti.Platform.name == 'android' ? 'android' : 'ios'
	}, function(e) {
		if (e.success) {
			Ti.API.info("SubscribeToken Success : " + JSON.stringify(e));
			Ti.App.Properties.setString('deviceToken', deviceToken);
			Ti.UI.createNotification({ message : deviceToken, duration : Ti.UI.NOTIFICATION_DURATION_SHORT }).show();
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
	Ti.API.info("Done - SubscribeToChannel ...");
}

// adding listeners
function _callBackFunction(data) {

}

function _callBackTrayClickLaunched(data) {
	parseMessage(data);
}

function _callBackTrayFocused(data) {
	parseMessage(data);
}

///ANDROID Payload
function parseMessage(data) {
	var _data = data;
	if (OS_ANDROID) {
		_data = JSON.parse(JSON.stringify(JSON.parse(data.payload).android));
	}
	var title_ = _data.title;
	var message_ = _data.alert;
	var splitted_message_ride_id = message_.split(';');
	var Received_Message = splitted_message_ride_id[0];
	var Ride_ID = splitted_message_ride_id[1];
	var Driver_ID = splitted_message_ride_id[2];
	var Managed_ID = splitted_message_ride_id[3];
	//"RideStopped;RideID;DriverID;MId"

	if (title_ == "Ride Request") {
		var accept = Titanium.UI.createAlertDialog({
			message : Received_Message,
			buttonNames : ['Accept', 'Reject', 'Later']
		});
		accept.show();
		accept.addEventListener('click', function(e) {
			if (e.index === 0) {
				uDrives.Accept(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						tg.setActiveTab(0);
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Accept ");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Accept'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Accept 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Accept'
						});
						;
					}
				} else {
					Alloy.createController('uDriveTabGroup').getView().open();
				}
			} else if (e.index === 1) {
				uDrives.Reject(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Reject ");
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Reject'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Reject 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Reject'
						});
					}
				} else {
					Alloy.createController('uDriveTabGroup').getView().open();
				}
			} else if (e.index === 2) {
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Later ");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Later'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Later 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Later'
						});
					}
				}
			}
		});
	} else if (title_ == "Reply") {
		var confirm = Titanium.UI.createAlertDialog({
			message : Received_Message,
			buttonNames : ['Confirm', 'Cancel', 'Later']
		});
		confirm.show();
		confirm.addEventListener('click', function(e) {
			if (e.index === 0) {
				uRides.Confirm(Ride_ID, Driver_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uRideTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "RIDE REQUESTS") {
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshRide', {
							'Choice' : 'Confirm'
						});
					} else {
						refreshObject.trigger('RefreshRide', {
							'Choice' : 'Confirm'
						});
					}
				} else {
					Alloy.createController('uRideTabGroup').getView().open();
				}
			} else if (e.index === 1) {
				uRides.Cancel(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uRideTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "RIDE REQUESTS") {
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshRide', {
							'Choice' : 'Cancel'
						});
					} else {
						refreshObject.trigger('RefreshRide', {
							'Choice' : 'Cancel'
						});
					}
				} else {
					Alloy.createController('uRideTabGroup').getView().open();
				}
			}
		});
	} else if (title_ == "Ride Confirmation") {
		var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
		if (last_window.hasOwnProperty('uDriveTabGroup')) {
			var keys = Object.keys(last_window);
			var tg = last_window[keys[0]];
			if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
				tg.setActiveTab(0);
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Confirm ");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'Confirm'
				});
			} else {
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = Confirm 1");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'Confirm'
				});
			}
		} else {
			Alloy.createController('uDriveTabGroup').getView().open();
		}
	} else if (title_ == "Ride Started" || title_ == "Carpool Started") {
		refreshObject.trigger('refreshTrackOthers', {
			'_TrackID_' : Ride_ID
		});
		var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
		if (last_window.hasOwnProperty('trackRide')) {
			//refresh
		} else {
			Alloy.createController('trackothersmapview', {
				'_Track_ID_' : Ride_ID
			}).getView().open();
		}
	} else if (title_ == "Ride Cancel") {
		var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
		if (last_window.hasOwnProperty('uDriveTabGroup')) {
			var keys = Object.keys(last_window);
			var tg = last_window[keys[0]];
			if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
				tg.setActiveTab(0);
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = RideCancel ");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'RideCancel'
				});
				;
			} else {
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - Choice = RideCancel 1");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'RideCancel'
				});
				;
			}
		} else {
			Alloy.createController('uDriveTabGroup').getView().open();
		}
	} else if (title_ == "Ride Stopped" || title_ == "Carpool Stopped") {
		Ti.App.Properties.setString('_Save_RideID_', Ride_ID);
		if (Ti.App.Properties.getString('window') == '_ListCard_') {

			if (Managed_ID == undefined || Managed_ID == "") {
				refreshObject.trigger('_SelectCard_', {
					'_RIDE_ID' : Ride_ID
				});
			} else {
				refreshObject.trigger('_SelectCard_', {
					'_RIDE_ID' : Ride_ID,
					'Managed_ID' : Managed_ID
				});
			}
		}
		Alloy.createController('SelectCard').getView().open();
	} else if (title_ == "Carpool Request") {
		var accept = Titanium.UI.createAlertDialog({
			message : Received_Message,
			buttonNames : ['Accept', 'Reject', 'Later']
		});
		accept.show();
		accept.addEventListener('click', function(e) {
			if (e.index === 0) {
				uCarpool_req.Accept(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						tg.setActiveTab(0);
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Accept ");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Accept'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Accept 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Accept'
						});
					}
				} else {
					Alloy.createController('uDriveTabGroup').getView().open();
				}
			} else if (e.index === 1) {
				uCarpool_req.Reject(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						tg.setActiveTab(0);
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Reject ");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Reject'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Reject 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Reject'
						});
					}
				} else {
					Alloy.createController('uDriveTabGroup').getView().open();
				}
			} else if (e.index === 2) {
				uCarpool_req.Reject(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uDriveTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
						tg.setActiveTab(0);
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Later ");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Later'
						});
					} else {
						Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Later 1");
						refreshObject.trigger('RefreshDrive', {
							'Choice' : 'Later'
						});
					}
				} else {
					Alloy.createController('uDriveTabGroup').getView().open();
				}
			} else {
				// Todo ????
			}
		});
	} else if (title_ == "Carpool Reply") {
		var accept = Titanium.UI.createAlertDialog({
			message : Received_Message,
			buttonNames : ['Confirm', 'Cancel', 'Later']
		});
		accept.show();
		accept.addEventListener('click', function(e) {
			if (e.index === 0) {
				uCarpool_con.Confirm(Ride_ID, Driver_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uCarpoolTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "CARPOOL REQUESTS") {
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Confirm'
						});
					} else {
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Confirm'
						});
					}
				} else {
					Alloy.createController('uCarpoolTabGroup').getView().open();
				}
			} else if (e.index === 1) {
				uCarpool_con.Cancel(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uCarpoolTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "CARPOOL REQUESTS") {
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Cancel'
						});
					} else {
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Cancel'
						});
					}
				} else {
					Alloy.createController('uCarpoolTabGroup').getView().open();
				}
			} else if (e.index === 2) {
				uCarpool_con.Cancel(Ride_ID);
				var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
				if (last_window.hasOwnProperty('uCarpoolTabGroup')) {
					var keys = Object.keys(last_window);
					var tg = last_window[keys[0]];
					if (tg.getActiveTab().getTitle() != "CARPOOL REQUESTS") {
						tg.setActiveTab(0);
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Later'
						});
					} else {
						refreshObject.trigger('RefreshCarpool', {
							'Choice' : 'Later'
						});
					}
				} else {
					Alloy.createController('uCarpoolTabGroup').getView().open();
				}
			} else {
				// Todo ????
			}
		});
	} else if (title_ == "Carpool Confirmation") {
		var last_window = Alloy.Globals.openWindows[Alloy.Globals.openWindows.length - 1];
		if (last_window.hasOwnProperty('uDriveTabGroup')) {
			var keys = Object.keys(last_window);
			var tg = last_window[keys[0]];
			if (tg.getActiveTab().getTitle() != "DRIVE REQUESTS") {
				tg.setActiveTab(0);
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Confirm ");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'Confirm'
				});
			} else {
				Ti.API.info("PushNotification - parseMessage() - Triggering RefreshDrive - CarPool - Choice = Confirm 1");
				refreshObject.trigger('RefreshDrive', {
					'Choice' : 'Confirm'
				});
			}
		} else {
			Alloy.createController('uDriveTabGroup').getView().open();
		}
	} else if (title_.indexOf(" ") == 0) {//else if (title_.toString().includes(' Chat:') == true)
		Ti.App.Properties.setBool('RiderTrue', false);
		Ti.App.Properties.setString('imRider', 'fromudrive');
		var split1 = title_.split(",");
		var reSplit = split1[1].split("-");
		if (Ti.App.Properties.getString('ChannelWindow') == split1[1]) {// if already one win opened
			Alloy.Globals.openWindows.pop().close();
			Alloy.createController('chat', {
				"RideId" : reSplit[0],
				"Rider_Id" : reSplit[2],
				"DriverId" : reSplit[1],
				"SenderId" : reSplit[2]
			}).getView().open();
		} else if (Ti.App.Properties.getString('ChannelWindow') == "" || Ti.App.Properties.getString('ChannelWindow') == undefined) {//if chat window not opened
			Alloy.createController('chat', {
				"RideId" : reSplit[0],
				"Rider_Id" : reSplit[2],
				"DriverId" : reSplit[1],
				"SenderId" : reSplit[2]
			}).getView().open();
		} else {
			//none or staying at chat room
		}
	} else if (title_.indexOf("c") == 0) {//else if (title_.includes('chat:') == true) {
		Ti.App.Properties.setBool('RiderTrue', true);
		Ti.App.Properties.setString('imRider', 'fromuride');
		var split1 = title_.split(",");
		var reSplit = split1[1].split("-");
		if (Ti.App.Properties.getString('ChannelWindow') == split1[1]) {// if already one win opened
			Alloy.Globals.openWindows.pop().close();
			Alloy.createController('chat', {
				"RideId" : reSplit[0],
				"Rider_Id" : reSplit[2],
				"DriverId" : reSplit[1],
				"SenderId" : reSplit[2]
			}).getView().open();
		} else if (Ti.App.Properties.getString('ChannelWindow') == "" || Ti.App.Properties.getString('ChannelWindow') == undefined) {//if chat window not opened
			Alloy.createController('chat', {
				"RideId" : reSplit[0],
				"Rider_Id" : reSplit[2],
				"DriverId" : reSplit[1],
				"SenderId" : reSplit[2]
			}).getView().open();
		} else {
			//none or staying at chat room
		}
	}
}

exports.addListener = function() {
	Ti.API.info("Start adding push notification listeners");
	AndroidPush.addEventListener('callback', _callBackFunction);
	AndroidPush.addEventListener('trayClickLaunchedApp', _callBackTrayClickLaunched);
	AndroidPush.addEventListener('trayClickFocusedApp', _callBackTrayFocused);
	Ti.API.info("Done adding push notification listeners");
};

