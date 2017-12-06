// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var msg = {};

Ti.API.error("Manual Add - Name: " + args.name);
Ti.API.error("Manual Add - Phone: " + args.phone);

var phoneNumber;

function addContact(e) {
	Ti.API.error("Clicked the Add Button");
	if( $.nameTxtFld.value == "" && $.mobileNumberTxtFld.value == "" ) {
		alert("Please enter name and phone number for the contact to add.");
	} else if( $.nameTxtFld.value == "" ) {
		alert("Please enter name for the contact to add.");
	} else if( $.mobileNumberTxtFld.value == "" ) {
		alert("Please enter phone number for the contact.");
	} else {
		Ti.API.error("Manual Add - Validating the phone number");
		validatePhoneNumber($.mobileNumberTxtFld.value);
	} 
}

function cancelAdd(e) {
	Ti.API.error("Clicked the Cancel Button");
	msg = { "Status" : "Cancel" };
	closeModalWindow();
}

function closeModalWindow() {
	var myUtil = require('util');
	var refreshObject = myUtil.refreshEvent();
	Ti.API.error("Setting Add Manually Trigger OFF.");
	refreshObject.off('Add_Manually');
	if (OS_ANDROID) {
		Ti.API.error("Triggering Manually Add Done Trigger.");
		refreshObject.trigger('Manual_Add_Done', msg);
	}
	$.manualAddWin.close();
	$.manualAddWin = null;
}

// validates by given phone number.
// removes the formatting and extracts the last 10 digits only
// sets the global variable to the phone number
function validatePhoneNumber(number) {
	if (number != null && number != undefined && number.length > 0) {
		phoneNumber = number.replace(/[^+\d]+/g, "");
		var lgth = phoneNumber.length;
		if( lgth >= 10 ) {
			phoneNumber = number.substring( lgth - 10, lgth );
			Ti.API.error("Saving the contact");
			saveContact();
		} else {
			alert("Phone Number " + number + " is less than 10 digits long.  Please verify and enter a valid phone number.");
			$.mobileNumberTxtFld.value = "";
		}
	} else {
		alert("Phone Number " + number + " is not valid.  Please verify and enter a valid phone number.");
		$.mobileNumberTxtFld.value = "";
	}
}

function saveContact() {
	var post = {};
	var contacts = [];
	contacts.push({
		"name" : $.nameTxtFld.value,
		"phone" : phoneNumber
	});
	post.contacts = contacts;
	
	Ti.App.Properties.setObject('manualContact', {
		"name" : $.nameTxtFld.value,
		"phone" : phoneNumber
	});
	
	Ti.API.error("Data Entered : " + JSON.stringify(post));
	var aUser = Alloy.createModel("Sync");
	aUser.save(post, {
		success : function(model, response) {
			Ti.API.error("Model: " + JSON.stringify(model) );
			Ti.API.error("Response: " + JSON.stringify(response) );
			if( response.length != 0 ) {
				// contact is not using ucorsa, send an invitation.
				sendInvitation();
			} else {
				// contact is using ucorsa, close this screen and refresh the friends page.
				msg = { "Status" : "Done" };
				closeModalWindow();
				alert("uCorsa friend added");
			}
		},
		error : function(err, response) {
			Ti.API.error("Error saving contact: " + JSON.stringify(err));
			handleErrors(response);
		}
	});
}

function sendInvitation(response) {
	var inviteData = {
		"contacts" : [{
			"name" : $.nameTxtFld.value,
			"phone" : phoneNumber
		}]
	};
	Ti.API.error("Invitation Data : " + JSON.stringify(inviteData));
	var post = Alloy.createModel("Invite");
	post.save(inviteData, {
		success : function(model, response) {
			Ti.API.error("Invite Success. Model: " + JSON.stringify(model) );
			Ti.API.error("Invite Success. Response: " + JSON.stringify(response) );
			Ti.App.Properties.setString('responseStatus', response.status);
			if( OS_ANDROID ) {
				sendSMSFromAndroidPhones();
			}
			if( OS_IOS ) {
				sendSMSFromIosPhones();
			}
		},
		error : function(err, response) {
			Ti.API.error("Error sending Invitation: " + JSON.stringify(err));
			Ti.API.error("Error Inviting. Response: " + JSON.stringify(response) );
			handleErrors(response);
		}
	});
}

function handleErrors(response) {
	Ti.App.Properties.setString('responseStatus', response.status);
	try {
		if (response.status != 401) {
			msg = { "Status" : "Error" };
			closeModalWindow();
			alert("Error adding contact manually, please try later.");
		} else {
			var timeUtil = require('util');
			timeUtil.closeAllOpenWindows();
			Alloy.createController('signin').getView().open();
			alert("Session expired, please signin again.");
		}
	} catch(err) {
		Ti.API.error("Error parsing the Invitation Error Response : " + JSON.stringify(err));
		msg = { "Status" : "Error" };
		closeModalWindow();
	}
}

function sendSMSFromAndroidPhones() {
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_VIEW,
		type : 'vnd.android-dir/mms-sms'
	});
	intent.putExtra('sms_body', 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store');
	intent.putExtra('address', phoneNumber);
	Ti.Android.currentActivity.startActivity(intent);
	msg = { "Status" : "SMSSent" };
	closeModalWindow();
}

function sendSMSFromIosPhones() {
	var module = require('com.omorandi');
	var smsDialog = module.createSMSDialog();
	smsDialog.recipients = [phoneNumber];
	smsDialog.messageBody = 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store';
	smsDialog.addEventListener('complete', function(e) {
		if (e.result == smsDialog.SENT) {
			msg = { "Status" : "SMSSent" };
			closeModalWindow();
		} else if (e.result == smsDialog.FAILED) {
			msg = { "Status" : "SMSFailed" };
			closeModalWindow();
		} else if (e.result == smsDialog.CANCELLED) {
			msg = { "Status" : "SMSCancel" };
			closeModalWindow();
		}
	});
	smsDialog.open({
		animated : true
	});
}
