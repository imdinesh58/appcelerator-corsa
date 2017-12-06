// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var myUtil = require('util');
var refreshObject = myUtil.refreshEvent();

var errorMsg = "";
var city;
var state;
var zip;
var newDob;

const dateRegex = /^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/?|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:(?:0?2)(\/?|-|\.)(?:29)\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/?|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
const BANRegex = /^[0-9]+$/g;
const BRNRegex = /^[0-9]{9}$/g;
const SSNRegex = /^[0-9]{4}$/g;
const ZIPRegex = /^[0-9]{5}(?:[-\s][0-9]{4})?$/g;

function onload() {
	Alloy.Globals.openWindows.push({
		'bankDetails' : $.bankDetails
	});
	showStripeAgreement();
}

function getCountry(address) {
	Ti.API.error("Address: " + JSON.stringify(address));
	var numOfElements = address.length;
	var countryElement = address[numOfElements-1];
	if( countryElement.types[0] == "country" ) {
		return countryElement.long_name;
	} else {
		return "Not a country";
	}
}

function populateAddress() {
	$.postalCode.value = $.postalCode.value.trim();
	if ($.postalCode.value.length > 4) {
		var URL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + $.postalCode.value + "&sensor=true";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				var obj = JSON.parse(this.responseText);
				// Ti.API.error("ZipCode Response: " + JSON.stringify(this.responseText));
				// Ti.API.error("ZipCode Response Parsed: " + JSON.stringify(obj));
				if( obj.status == "OK" && obj.results.length > 0 && 
					obj.results[0].types[0] == "postal_code" && 
					getCountry(obj.results[0].address_components) == "United States" ) {
					try {
						zip = obj.results[0].address_components[0].long_name;
						city = obj.results[0].address_components[1].long_name;
						state = obj.results[0].address_components[3].short_name;						
						$.postalCode.value = obj.results[0].formatted_address;
					} catch(err) {
						Ti.API.info("err ", err);
					}
				} else {
					alert("Invalid Postal Code. Verify the postal code and try again.");
					$.postalCode.value = "";
				}
			},
			onerror : function(e) {
				//alert(this.responseText);
				alert("Enter a valid United States Postal Code.");
				$.postalCode.value = "";
			}
		});
		client.open("GET", URL);
		client.send();
	} else {
		alert("Invalid Postal Code. Try again later");
		//$.postalCode.focus();
		$.postalCode.value = "";
	}
}

function showStripeAgreement() {
	var modal = require('Agreement');
	var MY_Model = new modal();
	var termsAccept = false;
	// click handler for Accept button
	MY_Model.accept.addEventListener('click', function(e) {
		termsAccept = true;
		MY_Model.myModal.close();
		// Select_bank();
	});
	// click handler for close button
	MY_Model.closeButton.addEventListener('click', function() {
		MY_Model.myModal.close();
		closeWindow();
	});
	// click handler for android back button
	MY_Model.myModal.addEventListener('android:back', function(e) {
		MY_Model.myModal.close();
		closeWindow();
	});
}

function doCancel() {
	closeWindow();
}

function doSave() {
	validate();
	if (errorMsg == "") {
		tokenizeBankDetails(handleStripeResponse);
	} else {
		alert(errorMsg);
	}
}

function validate() {
	errorMsg = "";
	validateBankNumber();
	validateBankRoutingNumber();
	validatePostalCode();
	validateDOB();
	validateSSN();
}

function validateBankNumber() {
	$.bankNumber.value = $.bankNumber.value.trim();
	if ($.bankNumber.value == "") {
		errorMsg += "\nEnter bank account number";
	} else if( $.bankNumber.value.length == 0 ) {
		errorMsg += "\nEnter a valid bank account number";
	} else if( $.bankNumber.value.match(BANRegex) == null ) {
		errorMsg += "\nBank account number contains non numeric digits.  Please verify.";
	} else {
		
	}
}

function validateBankRoutingNumber() {
	$.bankRoutingNumber.value = $.bankRoutingNumber.value.trim();
	if ($.bankRoutingNumber.value == "") {
		errorMsg += "\nEnter bank routing number";
	} else if( $.bankRoutingNumber.value.length < 9 ) {
		errorMsg += "\nBank Routing Number must be 9 digits long.";
	} else if( $.bankRoutingNumber.value.match(BRNRegex) == null ) {
		errorMsg += "\nBank Routing Number validation fails.  Please enter a 9 digit number.";
	} else {
		
	}
}

function validatePostalCode() {
	$.postalCode.value = $.postalCode.value.trim();
	if ($.postalCode.value == "") {
		errorMsg += "\nEnter Postal Code for the address";
	} else if( $.postalCode.value.match( ZIPRegex ) ) {
		errorMsg += "\nZip is invalid.  Please enter a 5 digit ZIP or 9 digit ZIP in nnnnn-nnnn format.";
	} else {
		
	}
}

function validateDOB() {
	$.dob.value = $.dob.value.trim();
	Ti.API.info("DOB : " + JSON.stringify($.dob.value));
	if ($.dob.value == "") {
		errorMsg += "\nEnter your Date of Birth.";
	} else {
		Ti.API.info("Regex : " + dateRegex);
		var rslt = $.dob.value.match(dateRegex);
		Ti.API.info("Rslt : " + rslt);
		if( rslt == null ) {
			$.dob.value = "";
			errorMsg += "\nDOB is not valid.  Please enter in MM-DD-YYYY format.";
		} else {
			var dob = $.dob.value.split("-");
			newDob = dob[1] + "-" + dob[0] + "-" + dob[2];  // converting to dd-mm-yyyy format
			
			if( dob[0].length != 2 ) {
				errorMsg += "\nThe month must be 2 digits. Please enter the DOB in MM-DD-YYYY format.";
			}
			if( dob[1].length != 2 ) {
				errorMsg += "\nThe day must be 2 digits. Please enter the DOB in MM-DD-YYYY format.";
			}
			if( dob[2].length != 4 ) {
				errorMsg += "\nThe year must be 4 digits. Please enter the DOB in MM-DD-YYYY format.";
			}
			
			Ti.API.info("New DOB : " + JSON.stringify(newDob));
		}
	}
}

function validateSSN() {
	$.ssn.value = $.ssn.value.trim();
	if ($.ssn.value == "") {
		errorMsg += "\nEnter the last 4 digits of your SSN";
	} else if( $.ssn.value == "0000" ) {
		errorMsg += "\n0000 is not a valid SSN digits. Please verify.";
	} else if( $.ssn.value.match( SSNRegex ) == null ) {
		errorMsg += "\nLast 4 of SSN is invalid.  Please verify.";
	} else {
		
	}
}

function ChangeDob(e) {
	if ($.dob.value.length == 2 || $.dob.value.length == 5) {
		$.dob.value += "-";
	}
	e.source.setSelection($.dob.value.length, $.dob.value.length);
}

function tokenizeBankDetails(callback) {
	$.bankRoutingNumber.value = $.bankRoutingNumber.value.trim();
	$.bankNumber.value = $.bankNumber.value.trim();
	
	var xhr = Titanium.Network.createHTTPClient();
	var bankDetail = {
		"bank_account[country]" : "US",
		"bank_account[currency]" : "usd",
		"bank_account[routing_number]" : $.bankRoutingNumber.value,
		"bank_account[account_number]" : $.bankNumber.value,
	};
	xhr.open("POST", "https://api.stripe.com/v1/tokens");
	xhr.onload = function() {
		var response = JSON.parse(xhr.responseText);
		Ti.API.info("Token Response From Stripe: " + response);
		callback(null, response);
	};
	xhr.onerror = function() {
		var errResponse = JSON.parse(this.responseText);
		Ti.API.error(errResponse.error.message);
		callback(errResponse.error.message, null);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", Alloy.CFG.stripeKey);
	xhr.send(bankDetail);
}

function handleStripeResponse(err, response) {
	if (err) {
		Ti.API.error("Error response from Stripe: " + JSON.stringify(err));
		alert("Error Processing the Credit Card.  Please try later.");
	} else {
		Ti.API.info("Saving the Bank Details.");
		var bankNum = $.bankNumber.value.trim();
		var bankTokenObj = {
			bankLast4Digits : bankNum.slice(bankNum.length - 4),
			stripeToken : response.id,
			bankRouting : $.bankRoutingNumber.value.trim(),
			userAddress : {
				line1 : $.line1.value.trim(),
				city : city,
				state : state,
				postal_code : zip
			},
			ssnLast4Digits : $.ssn.value.trim(),
			dob : newDob
		};
		Ti.App.Properties.setObject('bankTokenDetails', bankTokenObj);

		if (args.parentWindow == "Signup") {
			refreshObject.trigger('completeSignUp', {
				bankDetails : bankTokenObj,
				parentWindow : "completeSignUp"
			});
		} else if (args.parentWindow == "ListBankAccounts") {
			refreshObject.trigger('saveBankDetails', {
				bankDetails : bankTokenObj,
				parentWindow : "saveBankDetails"
			});
		}

		closeWindow();
	}
}

function closeWindow() {
	$.bankDetails.close();
	$.bankDetails = null;
}

$.bankDetails.open();

