var args = arguments[0] || {};
args = args.attributes;
var type = args.type;
if (type == "U") {
	var NAME = args.first_name;
	$.photo.text = NAME.toString().charAt(0).toUpperCase();
	$.name.text = args.first_name;
	$.phone.text = args.phone;
	$.email.text = args.email;
}
/////////////////////////////////
// window onload
////////////////////////////////
function load() {
	Alloy.Globals.openWindows.push({
		'editFriend' : $.edit
	});
	if (Ti.Platform.osname === "android") {
		if (!$.getView().activity) {
		} else {
			var activity = $.getView().activity;
			var actionBar = activity.actionBar;
			if (actionBar) {
				actionBar.title = "                          Contacts";
			}
		}
		//}
	}
}

function closeWindow() {
	Alloy.Globals.openWindows.pop();
	$.edit.close();
	$.edit = null;

}

$.edit.open(); 