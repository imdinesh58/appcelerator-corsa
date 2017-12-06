 var args = arguments[0] || {};

var collection_contacts = new Array();
var collection = Alloy.createCollection("phoneContacts");
var Check = false;
var checkedContacts = [];

var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

///// Search Bar for phone contacts
var searchBar = Titanium.UI.createSearchBar({
	top : 0,
	height : 50,
	showCancel : true,
	hintText : "Search",
	color : '#001E45',
	backgroundColor : '#FFFFFF',
	borderColor : '#001E45',
	borderWidth : 5,
	borderRadius : 0
});
searchBar.addEventListener('change', function(e) {
	Ti.API.error('Change Event - User searching for: ' + e.value);
});
searchBar.addEventListener('return', function(e) {
	Ti.API.error('Return Event - User searching for: ' + e.value);
	searchBar.blur();
});
searchBar.addEventListener('cancel', function(e) {
	Ti.API.error('Cancel Event - User searching for: ' + e.value);
	searchBar.blur();
});

$.tableContacts.search = searchBar;
$.tableContacts.filterAttribute = 'title';

searchBar.blur();

function loadContacts() {
	setTimeout(Access_Contacts, 2000);
	searchBar.blur();
	$.activityIndicator.show();
}

function Access_Contacts() {

	if (Ti.Contacts.hasContactsPermissions()) {
		////Ti.API.info("Has Permission to access contacts. Getting Phone Contacts ....");
		generateContactList();
	} else {
		Ti.Contacts.requestContactsPermissions(function(e) {
			if (e.success) {
				////Ti.API.info("Request to access contacts is successful. Getting Phone Contacts ....");
				generateContactList();
			} else {
				//alert("Accessing Phone contacts restricted");
				////Ti.API.info("Contact Request is NOT Success");
			}
		});
	}
}

Ti.Contacts.addEventListener('reload', function(e) {
	loadContacts();
});

// get unique mobile no's from default phone contacts
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function compare(a, b) {
	if (a.name.toUpperCase() < b.name.toUpperCase())
		return -1;
	if (a.name.toUpperCase() > b.name.toUpperCase())
		return 1;
	return 0;
}

function contactEquals(contact1, contact2) {
	return (contact1.name === contact2.name && contact1.phone === contact2.phone);
}

function arrayContains(arr, val, equals) {
	var i = arr.length;
	while (i--) {
		if (equals(arr[i], val)) {
			return true;
		}
	}
	return false;
}

/////////////////////////////////////////////////////
//load phone contacts - table view
//////////////////////////////////////////////////////
function generateContactList() {
	var contacts = Titanium.Contacts.getAllPeople();

	for (var i = 0; i < contacts.length; i++) {
		var phoneObj = contacts[i].phone;
		// Ti.API.error("Contact info: " + JSON.stringify(contacts[i]));
		if (phoneObj != null && phoneObj != undefined) {
			//home
			var mobileNumbers = phoneObj.home;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "Home: " + mobileNumbers[j],
							// image : contacts[i].image == null ? contacts[i].fullName : contacts[i].image,
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
			//work
			var mobileNumbers = phoneObj.work;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "Work: " + mobileNumbers[j],
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
			//iPhone
			var mobileNumbers = phoneObj.iPhone;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "iPhone: " + mobileNumbers[j],
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
			//mobile
			var mobileNumbers = phoneObj.mobile;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "Mobile: " + mobileNumbers[j],
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
			//main
			var mobileNumbers = phoneObj.main;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "Main: " + mobileNumbers[j],
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
			//other
			var mobileNumbers = phoneObj.other;
			if (mobileNumbers != null && mobileNumbers != undefined && mobileNumbers.length > 0) {
				for (var j = 0; j < mobileNumbers.length; j++) {
					mobileNumbers[j] = mobileNumbers[j].replace(/[^+\d]+/g, "");
					if (mobileNumbers[j].length >= 10) {
						var myContact = {
							id : i,
							name : contacts[i].fullName,
							phone : "Other: " + mobileNumbers[j],
							invite : 'false'
						};
						////Ti.API.warn("******Contact***** " + JSON.stringify(myContact));
						if (!arrayContains(collection_contacts, myContact, contactEquals)) {
							collection_contacts.push(myContact);
						} else {
							////Ti.API.warn(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skipping Contact: " + JSON.stringify(myContact));
						}
					} else {
						////Ti.API.warn(contacts[i].fullName + " ******Invalid Phone Number******* " + mobileNumbers[0]);
					}
				}
			}
		}
	}
	// now show the contacts ...
	showContacts();
}

function showContacts() {
	var data = [];
	var index = [];
	var element;
	var sectionLetter = '';
	var currLetter = '';
	var currSection = '';
	// lastL,
	// l,
	// currSection,
	//alert(collection_contacts.length + '  Contacts loaded');

	if (OS_IOS) {
		collection_contacts.sort(compare);
	}

	for (var i = 0; i < collection_contacts.length; i++) {

		currLetter = collection_contacts[i].name.substr(0, 1).toUpperCase();

		if (sectionLetter != currLetter) {
			sectionLetter = collection_contacts[i].name.substr(0, 1).toUpperCase();
			index.push({
				title : sectionLetter,
				index : i
			});
			currSection = Ti.UI.createTableViewSection({
				headerView : Alloy.createController('uContactsSectionView', {
					title : sectionLetter
				}).getView()
			});
			data.push(currSection);
		}

		// set the invite to false so that the check box is not checked.
		collection_contacts[i].invite = false;
		var rows = Alloy.createController('uContactsPhoneNumber', {
			id : i,
			data : collection_contacts[i],
			addCheckBox : true
		}).getView();
		rows.title = collection_contacts[i];
		currSection.add(rows);
		$.activityIndicator.hide();
	}

	$.tableContacts.setData(data);
	$.tableContacts.index = index;
	return data;
}

function onClick(event) {
	Ti.API.error("Clicked Index: " + event.index + "\n" + "Event Source : " + event.source.id);
	if (event.source.id == 'cImage') {
		onClickedContactImage(event);
	} else if (event.source.id == 'cName') {
		onClickedContactName(event);
	} else if (event.source.id == 'cNumber') {
		onClickedContactPhone(event);
	} else if (event.source.id == 'cCheckBox') {
		onClickedCheckBox(event);
	} else {
		onClickedSomethingElse(event);
	}
}

function onClickedContactImage(event) {
	// alert("Clicked the Image.");
}

function onClickedContactName(event) {
	// alert("Clicked the Name.");
}

function onClickedContactPhone(event) {
	// alert("Clicked the Phone.");
}

function onClickedCheckBox(event) {
	var contactSelected = collection_contacts[event.index];
	Ti.API.error("Contact Selected: " + JSON.stringify(contactSelected));

	if (contactSelected.invite == true) {
		contactSelected.invite = false;
		checkedContacts = checkedContacts.filter(function(e1) {
			return e1.invite;
		});
		// return only the element with invite set to true
	} else {
		contactSelected.invite = true;
		var cPhone = contactSelected.phone;
		var cPhoneNumberOnly = cPhone.substring( cPhone.indexOf(":")+1, cPhone.length ).trim();
		var lgth = cPhoneNumberOnly.length;
		if( lgth > 10 ) {
			cPhoneNumberOnly = cPhoneNumberOnly.substring( lgth - 10, lgth );
		}
		Ti.API.error("Contact Selected Phone: " + cPhoneNumberOnly);
		contactSelected.phone = cPhoneNumberOnly;
		checkedContacts.push(contactSelected);
	}
	Ti.API.error("Contact End: " + JSON.stringify(checkedContacts));
}

function onClickedSomethingElse(event) {
	// alert("Clicked something else.");
}

refreshObject.on('Connect', function(msg) {
	Ti.API.error("Connect Event - On");
	Ti.API.error("Iam here in refreshObj Connect method.  Checked Contacts: " + checkedContacts.length );
	Ti.API.error("OS is Android : " + OS_ANDROID );
	if (OS_ANDROID) {
		if (checkedContacts.length == 0) {
			alert("Pick one or more contacts to add as friends.");
		} else {
			Ti.API.error("Sending the selected list for verification.");
			sendListForVerification();
		}
	}
});

function Connect() {
	Ti.API.error("Iam here in Connect() method.  Checked Contacts: " + checkedContacts.length );
	Ti.API.error("OS is Android ? : " + OS_ANDROID );
	if (OS_IOS) {
		if (checkedContacts.length == 0) {
			alert("Pick one or more contacts to add as friends.");
		} else {
			Ti.API.error("Sending the selected list for verification.");
			sendListForVerification();
		}
	}
}

refreshObject.on('Add_Manually', function(msg) {
	Ti.API.error("Got Add Manually Trigger.");
	if( OS_ANDROID ) {
		AddManually();
	}
});

refreshObject.on('Manual_Add_Done', function(msg) {
	Ti.API.error("Got Manual-Add-Done Trigger.");
	if( OS_ANDROID ) {
		handlePostAdd();
	}
});

function AddManually() {
	Ti.API.error("Begin of Manually adding a contact.");
	var manualAddWindow = Alloy.createController('uContactsManualAdd', {
		'name' : 'Sethu',
		'phone' : '4022018787'
	}).getView();
	manualAddWindow.open( {modal : true } );
	Ti.API.error("Done with Manually adding a contact.");
};

function handlePostAdd() {
	var mContact = {};
	var responseStatus;
	// get the properties saved
	if( Ti.App.Properties.hasProperty('manualContact')) {
		Ti.API.error("Getting manualContact property");
		mContact = Ti.App.Properties.getObject('manualContact');
		Ti.API.error("mContact : " + mContact);
	}
	if( Ti.App.Properties.hasProperty('responseStatus')) {
		Ti.API.error("Getting responseStatus property");
		responseStatus = Ti.App.Properties.getString('responseStatus');
		Ti.API.error("responseStatus : " + responseStatus);
	}
	
	if( responseStatus == "Done" ) {
		// an ucorsa using contact was added.
		// refresh the friends page.
	} else {
		// all other status such as
		// cancel, SMS_*, etc
	}
	refreshObject.on('Add_Manually', function(msg) {
		Ti.API.error("Setting Add Manually Trigger ON.");
		if( OS_ANDROID ) {
			AddManually();
		}
	});
	refreshObject.trigger('RefreshFriends', {
		'Test' : 'Test'
	});
}


function AddManually_old() {
	var modal = require('ManualRequest');
	var MY_Model = new modal();
	MY_Model.closeText.addEventListener('click', function() {
		MY_Model.myModal.close();
		MY_Model = null;
		modal = null;
		if (OS_IOS) {
			closeWindow();
			Alloy.createController('uContactsTabGroup').getView().open();
		}
	});

	MY_Model.InviteText.addEventListener('click', function() {
		if (MY_Model.name_.value == "") {
			alert('Enter Name');
		} else if (MY_Model.mobile_.value == "") {
			alert('Enter Mobile Number');
		} else {
			var post = {};
			var SingleObj = {
				"contacts" : [{
					"name" : MY_Model.name_.value,
					"phone" : MY_Model.mobile_.value.slice(-10)
				}]
			};
			var Obj = {
				"name" : MY_Model.name_.value,
				"phone" : MY_Model.mobile_.value.slice(-10)
			};
			checkedContacts = [];
			checkedContacts.push(Obj);
			post.contacts = checkedContacts;

			var aUser = Alloy.createModel("Sync");
			aUser.save(post, {
				success : function(model, response) {
					if (response.length != 0) {
						var post = Alloy.createModel("Invite");
						post.save(SingleObj, {
							success : function(model, response) {
								MY_Model.myModal.close();
								Ti.API.error("In ManualAdd ... Triggering RefreshObj with RefreshFriends ... ");
								refreshObject.trigger('RefreshFriends', {
									'Test' : 'Test'
								});
								if (OS_ANDROID) {
									closeWindow();
									Alloy.createController('uContactsTabGroup').getView().open();
									
									var intent = Ti.Android.createIntent({
										action : Ti.Android.ACTION_VIEW,
										type : 'vnd.android-dir/mms-sms'
									});
									intent.putExtra('sms_body', 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store');
									intent.putExtra('address', MY_Model.mobile_.value);
									Ti.Android.currentActivity.startActivity(intent);
								}
								
								if (OS_IOS) {
									var module = require('com.omorandi');
									var smsDialog = module.createSMSDialog();
									smsDialog.recipients = [MY_Model.mobile_.value];
									smsDialog.messageBody = 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store';
									smsDialog.addEventListener('complete', function(e) {
										if (e.result == smsDialog.SENT) {
											closeWindow();
											Alloy.createController('uContactsTabGroup').getView().open();
											checkedContacts = [];
											collection_contacts = [];
										} else if (e.result == smsDialog.FAILED) {
											closeWindow();
											Alloy.createController('uContactsTabGroup').getView().open();
											checkedContacts = [];
											collection_contacts = [];
										} else if (e.result == smsDialog.CANCELLED) {
											closeWindow();
											Alloy.createController('uContactsTabGroup').getView().open();
											checkedContacts = [];
											collection_contacts = [];
											Ti.API.error("Contact List: " + JSON.stringify(collection_contacts));
											Ti.API.error("Checked List: " + JSON.stringify(checkedContacts));
										}
									});
									smsDialog.open({
										animated : true
									});
								};
							},
							// invite.save error
							error : function(err, response) {
								alert('Failed in sending request ... try again');
								try {
									if (response.status == 401) {
										var timeUtil = require('util');
										timeUtil.closeAllOpenWindows();
										Alloy.createController('signin').getView().open();
									}
								} catch(err) {
								}
							}
						});
					} else {
						MY_Model.myModal.close();
						if (OS_IOS) {
							closeWindow();
							Alloy.createController('uContactsTabGroup').getView().open();
						}
						alert("uCorsa friend added");
					}
				},
				//aUser.save error case
				error : function(err, response) {
					if (response.status == 401) {
						var timeUtil = require('util');
						timeUtil.closeAllOpenWindows();
						Alloy.createController('signin').getView().open();
					}
				}
			});
		}
	});
}

function sendListForVerification() {
	var post = {};
	post.contacts = checkedContacts;
	var aUser = Alloy.createModel("Sync");

	Ti.API.error("Iam here to add contacts as friends.");

	aUser.save(post, {
		success : function(model, response) {
			Ti.API.error("Model Length : " + model.length);
			Ti.API.error("Response Length : " + response.length);
			Ti.API.error("Contacts Length : " + checkedContacts.length);
			if( response.length != 0 ) {
				// one or more contact is not using ucorsa, send an invitation.
				sendInvitation(response);
			} else {
				// contact is using ucorsa, refresh this screen
				alert("uCorsa friend added");
				closeWindow();
				Alloy.createController('uContactsTabGroup').getView().open();
			}
		},
		error : function(err, response) {
			alert("Error Adding contact as friend.  Please try at a later time.");
			Ti.API.error("Error Adding Contact as Friend : " + JSON.stringify(err));
			Ti.API.error("Error Response Adding Contact as Friend : " + JSON.stringify(response));
			closeWindow(); // back to home screen.
			try {
				if (response.status == 401) {
					var timeUtil = require('util');
					timeUtil.closeAllOpenWindows();
				}
			} catch(err) {
				Ti.API.error("Error parsing the error response when adding Contact as Friend : " + JSON.stringify(err));
			}
		}
	});
}


function sendInvitation(response) {
	Ti.API.error("Sending invitation to these contacts: " + JSON.stringify(response));

	var invitedList = [];
	var invitedPhoneNumbers = [];
	var invitedNamePhones = [];

	if (response.length > 0) {
		
		for (var j = 0; j < response.length; j++) {
			var invitedContact = Alloy.createController('uContactsPhoneNumber', {
				id : j,
				data : response[j],
				addCheckBox : false
			}).getView();
			invitedList.push(invitedContact);
			invitedPhoneNumbers.push(response[j].phone);
			invitedNamePhones.push( { "name" : response[j].name, "phone" : response[j].phone } );
		}
		
		var modalWindow = require('InvitePeople');
		var sendInvitationWindow = new modalWindow();
		sendInvitationWindow.tableView.setData(invitedList);
		
		sendInvitationWindow.closeButton.addEventListener('click', function() {
			sendInvitationWindow.myModal.close();
			// Ti.API.error("uContactsPhoneNumbers - sendInvitation() - closeButton - Connect Event - Off");
			// refreshObject.off('Connect');
			checkedContacts = [];
			showContacts();
		});
		
		var sendObj = {};
		sendInvitationWindow.InviteButton.addEventListener('click', function() {
			var aUser = Alloy.createModel("Invite");
			aUser.save({ "contacts" : invitedNamePhones }, {
				success : function(model, response) {
					Ti.API.error("SendInvitation - Model Length : " + model.length);
					Ti.API.error("SendInvitation - Response Length : " + JSON.stringify(response.length));
					checkedContacts = [];
					sendInvitationWindow.myModal.close();
					
					if (OS_ANDROID) {
						
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							type : 'vnd.android-dir/mms-sms'
						});
						// TODO:
						// Get the link used by the user logged in to download the app and send that link
						// in this sms (this is for the parent-child campaign)
						intent.putExtra('sms_body', 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store');
						intent.putExtra('address', invitedPhoneNumbers);
						Ti.Android.currentActivity.startActivity(intent);
						
						refreshObject.trigger('RefreshFriends', {
							'Test' : 'Test'
						});
						closeWindow();
						Alloy.createController('uContactsTabGroup').getView().open();
					}
					if (OS_IOS) {
						var module = require('com.omorandi');
						var smsDialog = module.createSMSDialog();
						smsDialog.recipients = invitedPhoneNumbers;
						// TODO:
						// Get the link used by the user logged in to download the app and send that link
						// in this sms (this is for the parent-child campaign)
						smsDialog.messageBody = 'Check out uCorsa App for your smartphone. Download it from Apple Store or Google Play Store';
						smsDialog.addEventListener('complete', function(e) {

							if (e.result == smsDialog.SENT) {
								closeWindow();
								Alloy.createController('uContactsTabGroup').getView().open();
							} else if (e.result == smsDialog.FAILED) {
								closeWindow();
								Alloy.createController('uContactsTabGroup').getView().open();
							} else if (e.result == smsDialog.CANCELLED) {
								closeWindow();
								Alloy.createController('uContactsTabGroup').getView().open();
							}
						});
						//open the SMS dialog window with slide-up animation
						smsDialog.open({
							animated : true
						});
						//close
						closeWindow();
						Alloy.createController('uContactsTabGroup').getView().open();
					};

				},

				error : function(err, response) {
					Ti.API.error("Error sending invitation : " + JSON.stringify(err));
					Ti.API.error("Error response when sending invitation : " + JSON.stringify(response));
					Ti.API.error("uContactsPhoneNumbers - sendInvitation() - Invite Button - Connect Event - Off");
					refreshObject.off('Connect');
					try {
						if (response.status == 401) {
							var timeUtil = require('util');
							timeUtil.closeAllOpenWindows();
						}
					} catch(err) {
						Ti.API.error("Error parsing sending invitation error : " + JSON.stringify(err));
					}
				}
			});
		});
	}
}

//	if (response.length < checkedContacts.length) {
//		if (OS_ANDROID) {
//			closeWindow();
//			Alloy.createController('uContactsTabGroup').getView().open();
//		}
//		if (OS_IOS) {
//			alert('uCorsa App using friend added');
//		}
//	}

function closeWindow() {
	refreshObject.off('Add_Manually');
	refreshObject.off('RefreshFriends');
	Ti.API.error("uContactsPhoneNumbers - closeWindow() - Connect Event - Off");
	refreshObject.off('Connect');
	refreshObject.off('Manual_Add_Done');
	if (OS_ANDROID) {
		refreshObject.trigger('Close_ContactsTab', {
			'Test' : 'Test'
		});
	}
	if (OS_IOS) {
		var tabWindow = Alloy.Globals.openWindows.pop();
		tabWindow[Object.keys(tabWindow)].close();
		tabWindow[Object.keys(tabWindow)] = null;
		tabWindow = null;
	}
}

