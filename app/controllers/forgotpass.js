var args = arguments[0] || {};
/////////////////////////////////
//Create Model
////////////////////////////////
var reset = Alloy.Models.instance('resetpassword');
/////////////////////////////////
//window load
////////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'forgotpass' : $.forgotpasswin
	});

	$.mail.show();
	$.send.show();
}

var resetPassword = {};
function reset_pass() {
	$.mail.hide();
	$.send.hide();
	var pass = Alloy.createModel("forgotPass");
	reset.set('user_login', $.mail.value);
	resetPassword.resetPassword = reset;
	pass.save(resetPassword, {
		success : function(model, response) {
			//alert(response.message);
			if (response.message == "Invalid username") {
				$.mail.show();
				$.send.show();
				$.mail.value = "";
				alert("Invalid E-mail. Please enter your registered E-mail.");
			} else {
				closeWindow();
				alert("New Password has been sent to your registered E-mail.");
			}
		},
		error : function(err, response) {
			alert(JSON.stringify(response));
		}
	});
}

////////////////////////////////
//service call
////////////////////////////////
function Validate() {
	if ($.mail.value == "") {
		alert('Enter username');
	} else {
		reset_pass();
	}
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.forgotpasswin.close();
	$.forgotpasswin = null;
}

$.forgotpasswin.open(); 