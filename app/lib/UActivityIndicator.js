/**
 * Indicator window with a spinner and a label
 * 
 * @param {Object} args
 */
function createIndicatorWindow(args) {
    var width = 100,
        height = 100;

    var args = args || {};
    var top = args.top || 150;
    
    var win = Ti.UI.createWindow({
    	backgroundcolor : '#001E45',
    	title : "",
    	opacity : 1
        // top:top,
        // width:width,
        // height:height,
        // title: "",
		// borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        // borderRadius:10,
        // touchEnabled:false,
    });
    
    var view = Ti.UI.createView({
        width:Ti.UI.SIZE,
        height:Ti.UI.FILL,
        center: {x:(width/2), y:(height/2)},
        layout:'horizontal'
    });
    
    function osIndicatorStyle() {
        style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
        
        if ('iPhone OS' !== Ti.Platform.name) {
            style = Ti.UI.ActivityIndicatorStyle.DARK;            
        }
        
        return style;
    }
     
var activityIndicator = Ti.UI.createActivityIndicator({
  top:100,
  left:100,
  height:100,
  width:100,
  // font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
  // message: 'Loading...',
  style: Ti.UI.ActivityIndicatorStyle.PLAIN,
});
    
    var label = Titanium.UI.createLabel({
        left:10,
        width:Ti.UI.FILL,
        height:Ti.UI.FILL,
        text:L('spinner'),
        color: '#fff',
        font: {fontFamily:'Helvetica Neue', fontSize:16, fontWeight:'bold'},
    });

    win.add(activityIndicator);
    // view.add(label);
    // win.add(view);

    function openIndicator() {
        win.open();
        activityIndicator.show();
    }
    
    win.openIndicator = openIndicator;
    
    function closeIndicator() {
        activityIndicator.hide();
        win.close();
    }
    
    win.closeIndicator = closeIndicator;
    
    return win;
}

// Public interface
exports.createIndicatorWindow = createIndicatorWindow;