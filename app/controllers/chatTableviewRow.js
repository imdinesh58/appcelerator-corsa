// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

////Ti.API.warn('*********  args ChatTableview.js  *********   ' + JSON.stringify(args)); 

if( args.sendText != undefined ) {
	// //Ti.API.warn('*********  args.sendText  came on ChatTableview.js  *********   ' + args.sendText); 
	$.message.text = args.sendText;
} else {
	$.message.text = "";
}

if(args.sendDate == undefined) {
	////Ti.API.warn('*********  args.sendDate IF undefined  ChatTableview.js  *********   ' + args.sendDate); 
	$.messageDate.text = args.sendDate;
} else {
	////Ti.API.warn('*********  args.sendDate NOT undefined ChatTableview.js  *********   ' + args.sendDate); 
	$.messageDate.text = args.sendDate;
}

if( args.position != undefined ) {
	////Ti.API.warn('*********  args.position  came on ChatTableview.js  *********   ' + args.position); 
	if (args.position == 'left') {
		$.img.left = "1%";
		$.messageDate.left = '15%';
		$.message.left = "15%";
	} 
	if( args.position == 'right' ) {
		$.img.right = "1%";
		$.messageDate.right = '15%';
		$.message.right = "15%";
	}
}

