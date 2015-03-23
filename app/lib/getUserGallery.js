/**
 * @description Helper functions for camera and gallery functionality
 *
 * @class Controller.Map
 * @author Steven House
 * @email steven.m.house@gmail.com
 */

// Include logging utility
var log = Alloy.Globals.log;
log.info('[Map]: Opened Page');

/**
 * Get
 * @method fromGallery
 */
exports.fromGallery = function(args) {
    var successevt = args.success ? args.cancel : function(){};
    var error = args.error ? args.cancel : function(){};
    var cancel = args.cancel ? args.cancel : function(){};
    Ti.Media.openPhotoGallery({
        success:function(event) {
            log.debug('Media Type from Gallerys: '+event.mediaType);
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                successevt(event.media);
            }
        },
        error:function(err) {
            error(err);
        },
        cancel: cancel,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
    });
};