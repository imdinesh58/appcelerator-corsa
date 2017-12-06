// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.memberName.text = args.data.first_name;
if( args.data.phone == "" || args.data.phone == undefined ) {
	$.memberNumber.text = "Phone# Not Available";
} else {
	$.memberNumber.text = args.data.phone;
}

$.delMember.circleMemberId = args.data.GroupMemberID;

