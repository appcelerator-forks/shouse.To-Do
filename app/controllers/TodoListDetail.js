/**
 * This is the controller file for "TodoDetail"
 *
 * @class Controller.TodoDetail
 * @author Steven House
 * @email steven.m.house@gmail.com
 */

var args = arguments[0] || {};
var itemId = args.itemId || "";

// Include logging utility
var log = Alloy.Globals.log;

var args = arguments[0] || {};
var id = args.id;


var todo = Alloy.Collections.ToDo;
var todoJSON = todo.toJSON();
var todoItem = _.first(_.where(todoJSON, {name: itemId}));
todoItem = JSON.parse(todoJSON);
//var todoItem = todo.findWhere({ name: itemId });
//var todoItem = _.first(todo.where({ name: itemId }));
//var todoItemJSON = todoItem.toJSON();


log.info('[TodoDetail] : Opened Item', todoItem);

var moment = require('moment');
var galleryExists = false;

init();

/**
 * Start the controller running
 * @method init
 * @return
 */
function init() {
    setupNav();
    addEventListeners();

    //alert(todoItem.name);
    var name = todoItem.name;

    //$.labelTitle.text = todoItem.name.toUpperCase();
    //$.labelTitle.text = todoItem.get("name");

        /*
    if (isDone()) {
        log.debug('[TodoDetail] : Initializing : Completed');
        $.viewDone.height = 44;
        //$.viewPhoto.height = 0;
        $.addClass($.viewDone, 'bgDarkGreen');
    }

    if (hasReminder()) {
        log.debug('[TodoDetail] : Initializing : Completed');

        $.viewAptTime.height = 44;
        $.viewScheduleApt.height = 0;
        $.addClass($.viewScheduleApt, 'bgDarkGreen');

        var reminderDate = todoItem.get('reminderDateTime');

        var dateText = moment.utc(reminderDate).fromNow();
        $.labelReminder.text = dateText;
        // + reminderDate;
    }

    if (hasPhoto()) {
        createGallery();
        galleryExists = true;
    }
    */
    // @TODO Figure out why this is needed.  The nav widget should handle it
    //$.windowTodoDetail.open();

}

/**
 * Setup the Nav Bar
 * @method setupNav
 */
function setupNav() {
    if (Alloy.isTablet) {
        return;
    }

}

/**
 * Add event listeners for the ListView.
 * @method addEventListeners
 * @return
 */
function addEventListeners() {

    // Mark as Done
    $.viewDone.addEventListener('click', done);

    // Set Reminder
    $.viewScheduleApt.addEventListener('click', setReminder);

    // Capture a photo
    $.viewPhoto.addEventListener('click', captureImage);

}

/**
 * Handles the done click event listener
 * @method done
 * @return
 */
function done() {
    log.event({
        type: 'todo',
        action: 'completed',
        description: todoItem.get('name'),
        eventId: todoItem.get('name')
    });

    $.addClass($.viewDone, 'bgDarkGreen');

    //$.viewDone.height = 0;
    //$.viewPhoto.height = 44;

    todoItem.set({
        complete: true,
        completedDateTime: new Date().toISOString()
    });
    todoItem.save();
}

/**
 * Description
 * @method isDone
 * @return CallExpression
 */
function isDone() {
    return todoItem.get('status');
}

/**
 * Checks if item has reminder and changes UI based on this
 * @method hasReminder
 */
function hasReminder() {
    return todoItem.get('reminderDateTime');
}

/**
 * Checks if item has reminder and changes UI based on this
 * @method hasReminder
 */
function hasPhoto() {
    return todoItem.get('hasPhoto');
}


/**
 * Invoke the calendar module to set a date
 * @method setReminder
 * @return
 */
function setReminder() {
    log.debug('[TodoDetail] : setReminder');

    if (Ti.Platform.osname === 'android') {
        var now = new Date();
        var month = now.getUTCMonth() + 1;
        var day = now.getUTCDate();
        var year = now.getUTCFullYear();

        var Dialogs = require("yy.tidialogs");
        // Create the dialog

        // value property is priority
        var picker = Dialogs.createDatePicker({
            okButtonTitle: 'Set',         // <-- optional, default "Done"
            cancelButtonTitle: 'Cancel',  // <-- optional, default "Cancel"
            value: new Date(),            // <-- optional
            day: day,                     // <-- optional
            month: month,                 // <-- optional - java/javascript month, i.e. August
            year: year                    // <-- optional
        });

        // Add the click listener
        picker.addEventListener('click',function(e){
            if (!e.cancel) {
                saveDate(e.value);
            } else {
                // Android Cancel Date
            }
        });

        // Cancel listener
        picker.addEventListener('cancel', function() {
            Ti.API.info("dialog was cancelled");
        });

        // open it
        picker.show();
    }
    // iOS will use different date picker
    else {
        $.viewRow.height = 0;

        var calendar = require('ti.sq');

        var now = new Date();
        var month = now.getUTCMonth() + 1;
        var day = now.getUTCDate();
        var year = now.getUTCFullYear();

        var minYear = year - 1;
        var maxYear = year + 1;

        var calValue = {
            month: month,
            day: day,
            year: year
        };
        var calMin = {
            month: month,
            day: day,
            year: minYear
        };
        var calMax = {
            month: month,
            day: day,
            year: maxYear
        };

        var calendarView = calendar.createView({
            height: Ti.UI.FILL,
            width: Ti.UI.FILL,
            top: 0,
            left: 10,
            right: 10,
            //bottom: 65,
            pagingEnabled: true,
            value: {
                month: month,
                day: day,
                year: year
            },
            min: {
                month: month,
                day: 1,
                year: year
            },
            max: {
                month: month,
                day: day,
                year: maxYear
            }
        });

        $.viewMain.add(calendarView);

        calendarView.addEventListener('dateChanged', function(d) {
            var opts = {
                options: ['Yep!', 'Changed my mind'],
                selectedIndex: 0,
                destructive: 0,
                title: 'Set A Reminder for ' + calendarView.value.month +
                '/' + calendarView.value.day + '/' +
                calendarView.value.year + ' ?'
            };

            var dialog = Ti.UI.createOptionDialog(opts);
            dialog.show();
            dialog.addEventListener('click', function(e) {
                if (e.index == 0) {
                    saveDate(d.dateValue);
                } else {
                    //Alloy.Globals.toast.show("Reminder cancelled");
                    alert("Reminder cancelled");
                }

                $.viewMain.remove(calendarView);
            });

            $.viewRow.height = Ti.UI.FILL;

        });
    }

}

/**
 * @method saveDate
 */
function saveDate(d) {
    log.debug("[TodoDetail] Set a reminder for  : dateChanged = ", d);
    var moment = require('moment');
    log.event({
        type: 'todo',
        action: 'set a reminder for',
        description: todoItem.get('name') + " " + moment(d).fromNow(),
        eventId: todoItem.get('name')
    });

    todoItem.set({ reminderDateTime: d });
    todoItem.save();

    //Alloy.Globals.toast.show("Reminder set!");
    alert("Reminder set!");
}

/**
 * This invokes the camera
 * @method captureImage
 * @return
 */
function captureImage() {
    log.debug('[TodoDetail] : captureImage');
    var camera = require('Camera');
    camera.captureImage({success: savePhoto});
}

/**
 * Save a photo to the SD card
 * @method savePhoto
 */
function savePhoto(image) {
    if (image.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {

        log.event({
            type: 'todo',
            action: 'captured',
            description: 'an image for' + todoItem.get('name'),
            eventId: todoItem.get('name')
        });

        log.debug('[TodoDetail] : captureImage : Camera Success, image = ', image);

        // This part should be skipped to the existing function
        var imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'todo');
        if (!imageDir.exists()) {
            imageDir.createDirectory();
        }

        // Add +1 to the existing photoCount
        var photoCount = todoItem.get('photoCount') + 1;

        var file = Ti.Filesystem.getFile(imageDir.resolve(), itemId +
        photoCount + '.png');

        log.debug("[TodoDetail] : Saving image to = ", imageDir.resolve() +
        itemId + photoCount + '.png');

        // Write to storage
        file.write(image.media);

        todoItem.set({
            hasPhoto: true,
            photoCount: photoCount
        });
        todoItem.save();

        log.debug('[TodoDetail] : Saved image to this location : ',
            file.nativePath);

        updateGallery();

    } else {
        alert('We are only supporting images at the moment.');

        todoItem.set({
            hasVideo: true
        });
        todoItem.save();
    }
}

/**
 * This returns an imageView created from the file system
 * @method getPictureView
 * @param {photoCount}
 * @param {width}
 * @param {height}
 * @return {Object} imageView
 */
function getPictureView(photoCount, width, height) {
    log.debug('[TodoDetail] : getPictureView : photoCount = ',
        photoCount + ", width = " + width + ", height = " + height);
    // Create the directory if it doesn't exist
    var imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'todo');
    var file = Ti.Filesystem.getFile(imageDir.resolve(), itemId + photoCount + '.png');

    if (!file.exists()) {
        log.warn(
            '[TodoDetail] : No saved pictures found.  Should not see this'
        );
        return false;
    } else {
        var image = file.read();
        log.info('[TodoDetail] : Retrieved saved picture : ',
            image);

        var imageView = Ti.UI.createImageView({
            image: image,
            width: width,
            height: height,
            borderColor: "white"
        });

        //$.viewMain.add(imageView);
        return imageView;
    }

}

/**
 * Create Gallery of photos / videos
 * @method createGallery
 */
function createGallery() {
    log.debug('[TodoDetail] : createGallery() : image number = ', todoItem.get('photoCount'));
    galleryExists = true;

    var photoCount = todoItem.get('photoCount');
    var images = [];
    var columns = 0;

    // Bail if no photos
    if (photoCount < 1) {
        log.debug("[TodoDetail] : createGallery : photoCount === 0");
        return false;
    } else if (photoCount == 1) {
        columns = 1;
    } else if (photoCount == 2) {
        columns = 2;
    } else {
        columns = 3;
    }

    $.tdg.init({
        columns: columns,
        space: 5,
        delayTime: 500,
        gridBackgroundColor: '#e1e1e1',
        itemBackgroundColor: '#9fcd4c',
        itemBorderColor: '#6fb442',
        itemBorderWidth: 0,
        itemBorderRadius: 3
    });

    // For each photo count create a photo
    _(photoCount).times(function(n) {
        //THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
        var itemData = {
            caption: 'Test'
        };

        var imageView = getPictureView(n + 1, 150, 150);

        //NOW WE PUSH TO THE ARRAY THE VIEW AND THE DATA
        images.push({
            view: imageView,
            data: itemData
        });
    });

    //ADD ALL THE ITEMS TO THE GRID
    $.tdg.addGridItems(images);

    $.tdg.setOnItemClick(function(e){
        alert('Selected Item: ' + JSON.stringify(e, null, 4));
    });
}

/**
 * Update the gallery and add a menu item
 * @method updateGallery
 */
function updateGallery() {
    log.debug("[TodoDetail] : Updating Gallery");
    // If gallery doesn't exist create it
    if (!galleryExists) {
        createGallery();
        return
    }

    // If gallery does exist add the first item
    var imageView = getPictureView(1, 150, 150);

    $.tdg.addGridItems({
        view: imageView,
        data: {
            caption: 'Test'
        }
    });

}
