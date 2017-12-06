// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

$.memberName.text = args.group.first_name;
$.memberName.phone = args.group.phone;

$.phoneNo.text = args.group.phone;
$.phoneNo.phone = args.group.phone;

$.delMember.circleMemberID = args.group.GroupMemberID;