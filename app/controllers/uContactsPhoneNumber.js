// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// Ti.API.error("uContactsCircle Data: " + args.data.name.charAt(0).toUpperCase());
// Ti.API.error("uContactsCircle Name: " + args.data.name);
// Ti.API.error("uContactsCircle Phone: " + args.data.phone);
// Ti.API.error("uContactsCircle addCheckBox: " + args.addCheckBox);

$.cImage.text = args.data.name.charAt(0).toUpperCase();
$.cName.text = args.data.name;
$.cNumber.text = args.data.phone;

if( args.addCheckBox == false ) {
	$.cCheckBox.visible = false;
}
$.cPhoneNumber.filter = args.data.name;