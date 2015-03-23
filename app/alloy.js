// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Logging utility and expose it to the global namespace
var LogObject = require('logging');
var log = new LogObject.Logger();
log.init();

Alloy.Globals.log = log;

/*
// Logger Add exception handling - 'Red Screen of Death'
var Logger = require("yy.logcatcher");
//var exceptions = require('logging/exceptions');
Logger.addEventListener('error', function(e) {
    exceptions.parseException(e);
});
*/

// Let's create a random color scheme for the app based on Propellics base colors
// @link http://www.colorcombos.com/combotester.html?rnd=0&color0=172800&color1=1a1c20&color2=604800&color3=cccccc&color4=373c45&color5=eb5d36&color6=f0f0f0&color7=fb734e&color8=ffffff&color9=e1e1e1&color10=bfbfbf
Alloy.Globals.Colors = [
    { name: "green", color: "#172800" },
    { name: "darkBlue", color: "#1a1c20" },
    { name: "brown", color: "#604800" },
    { name: "gray", color: "#cccccc" },
    { name: "mediumBlue", color: "#373c45" },
    { name: "orange", color: "#eb5d36" }
];

