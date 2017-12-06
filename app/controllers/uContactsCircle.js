// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.circleName.text = args.data.name;

Ti.API.error("uContactsCircle Data: " + JSON.stringify(args.data));

if (args.data.members == "" || args.data.members == undefined) {
	$.showMbrs.hide();
} else {
	$.showMbrs.show();
}

$.delCircle.circleId = args.data.id;
$.updtCircle.circleId = args.data.id;
$.addMbr.circleId = args.data.id;
$.showMbrs.circleId = args.data.id;
