/**
 * This is the controller file for "TodoList".
 *
 * @class Controller.TodoList
 * @author Steven House
 * @email steven.m.house@gmail.com
 */

// Include logging utility
var log = Alloy.Globals.log;
log.info('[TodoList] : Opened Page');


var collection = true;
var todoCollection;
var listSection;

init();
addEventListeners();

/**
 * Start the controller running
 * @method init
 * @return
 */
function init() {
    //log.debug();
    setupNav();

    log.debug('[TodoList] : Initializing');
    // If there is no existing todo records, get standard set
    if (collection) {
        getTasks();
    } else {
        todoSuccess();
    }

    if (Alloy.isTablet) {
        //Alloy.Globals.Menu.setSideContent('TodoListHistory');
    }

}

/**
 * Setup the Nav Bar
 * @method setupNav
 */
function setupNav() {
    // Add menu

}

/**
 * Add event listeners for the ListView.
 * 'itemclick' - open detail window
 * 'swipe left' - Set Reminder
 * 'swipe right' - Mark as Done
 * @method addEventListeners
 * @return
 */
function addEventListeners() {

     // Filter: ALL
     //$.viewFilterAll.addEventListener('click', function(e){
     $.labelFilterAll.addEventListener('click', function(e) {
         //$.search.height = '0dp';
         filter(e.source.id);
     });

     // Filter: DONE
     $.labelFilterDone.addEventListener('click', function(e) {
        //$.search.height = '0dp';
        filter(e.source.id);
     });

     // Filter: SEARCH
     $.labelFilterSearch.addEventListener('click', function(e){
        $.search.height = '44dp';
     });

    // Item Clicked
    $.listViewTodo.addEventListener('itemclick', function(e) {
        if (Alloy.isTablet) {
            Alloy.Globals.Menu.setSideContent('TodoListDetail', {itemId: e.itemId});
        } else {
            // Open our ToDo List Detail controller
            var todoDetail = Alloy.createController('TodoListDetail', {itemId: e.itemId}).getView();
            //Alloy.Globals.navWindow.open(todoDetail);
            Alloy.Globals.Menu.setMainContent('TodoListDetail');
        }
    });
}

/**
 * Filter the results of the list view
 * @method filter
 * @param {} item
 * @return
 */
function filter(item) {
    switch (item) {
        case "viewFilterAll":
        case "labelFilterAll":
            var sections = $.listViewTodo.getSections();
            _.each(sections, function(section) {
                $.listViewTodo.deleteSectionAt(0);
            });
            todoSuccess();
            break;
        case "viewFilterDone":
        case "labelFilterDone":
            var sections = $.listViewTodo.getSections();
            _.each(sections, function(section) {
                $.listViewTodo.deleteSectionAt(0);
            });

            doneCollection = _.where(Alloy.Collections.ToDo.toJSON(), {
                complete: true
            });
            todoSuccess(doneCollection);
            break;
    }
}

/**
 * This checks if todo items have been loaded,
 * then loads from data fileor bypass reload
 * @method getVehicletodo
 * @return
 */
function getTasks() {
    // If there are no models in the collection, let's start out with some demo data
    if (Alloy.Collections.ToDo.length === 0) {
        var todo = require('data/ToDo').getTasks();
        log.debug('[TodoList] : getTasks() : todo = ', todo);

        Alloy.Collections.ToDo.reset(todo);
    }

    todoSuccess();
}

/**
 * Add the todo items to the List View Section
 * @method todoSuccess
 * @param {} itemsToShow
 * @return
 */
function todoSuccess(itemsToShow) {
    var sortedCollection;

    if (itemsToShow) {
        sortedCollection = itemsToShow;
    } else {
        sortedCollection = _.sortBy(Alloy.Collections.ToDo.toJSON(),
            function(item) {
                return item.createdDateTime;
            });
    }

    log.debug('[TodoList] : todoSuccess() : sortedCollection', sortedCollection);

    displayTodo(sortedCollection);
}

/**
 * Render the List View
 * @method displaytodo
 * @param {} sortedCollection
 * @return
 */
function displayTodo(sortedCollection) {
    log.debug("Display ToDo Tasks.  Collection: ", sortedCollection);
    // Push data to the List View
    var data = [];
    _.each(sortedCollection, function(todoItem) {
        log.error('[TodoList] : todoSuccess() : todoItem', todoItem);
        data.push({
            imageViewCheckmark: {
                image: todoItem.complete ? "/icons/check_mark.png" : "/icons/ic_action_event.png",
                left: 10,
                top: 10
            },
            itemTitle: {
                text: todoItem.name,
                font: {
                    fontSize: '18sp'
                },
                left: 10,
                top: 10
            },
            properties: {
                itemId: todoItem.name,
                searchableText: todoItem.name
            }
        });
    });


    var listSection = Titanium.UI.createListSection({
        // properties
        items: data,
        //headerView : listSectionHeaderView
        headerTitle: "Most Recent first"
    });

    $.listViewTodo.appendSection(listSection);
}

/**
 * Add the todo records to the List View Section
 * @method todoSuccess
 * @param {} recordsToShow
 * @return
 */
function todoSuccess(recordsToShow) {
    var sortedCollection;

    if (recordsToShow) {
        sortedCollection = recordsToShow;
    } else {
        sortedCollection = _.sortBy(Alloy.Collections.ToDo.toJSON(),
            function(item) {
               // return item.intervalMileage;
            });
    }

    log.debug('[TodoList] : todoSuccess() : sortedCollection', sortedCollection);

    var data = [];

    // Push data to the List View
    _.each(sortedCollection, function(todoItem) {
        data.push({
            imageViewCheckmark: {
                image: todoItem.complete ? "/icons/check_mark.png" : ""
            },
            itemTitle: {
                text: todoItem.name,
                font: {
                    fontSize: '18sp'
                },
                left: 5
            },
            properties: {
                itemId: todoItem.name,
                searchableText: todoItem.name,
                backgroundColor: '#fff',
                height: 90
            }
        });
    });

    var listSection = Titanium.UI.createListSection({
        // properties
        items: data,
        //headerView : listSectionHeaderView
        headerTitle: "To-do List"
    });

    $.listViewTodo.appendSection(listSection);
}

/**
 * Add a new custom item to the todo list
 * @method addNewItem
 */
function addNewItem() {
    log.debug('[TodoList] : addNewItem');
    // Show the Popup to add Item
    $.widgetPopup.show();

    // Initialize the Add todo Item form
    $.form.init({
        fieldsets: [{
            legend: 'Add a todo Item',
            fields: [{
                name: 'name',
                label: 'Name',
                type: 'text'
            }, {
                name: 'frequencyTime',
                label: 'Frequency (time)',
                type: 'text'
            }, {
                name: 'frequencyMiles',
                label: 'Frequency (miles)',
                type: 'text'
            }, {
                name: 'tags',
                label: 'Tags',
                type: 'text'
            }, {
                name: 'youtubeID',
                label: 'YouTube ID (11 characters)',
                type: 'text'
            }]
        }]
    });

    // Add the Submit button
    $.form.addSubmit('Create Item', function() {
        // @TODO add verification here

        var formValues = $.form.getValues();

        var newModel = Alloy.createModel("todo", {
            name: formValues.name,
            frequencyTime: formValues.frequencyTime ?
                formValues.frequencyTime : '',
            frequencyMiles: formValues.frequencyMiles ?
                parseInt(formValues.frequencyMiles) : 0,
            tags: formValues.tags ? formValues.tags : "",
            youtube: formValues.youtubeID ? formValues.youtubeID : '12345678901'
        });

        newModel.save();

        // Make sure the collection is current
        Alloy.Collections.todo.add(newModel);
        //Alloy.Collections.todo.fetch();
        alert("Saved this model: " + JSON.stringify(newModel, null, 4));

        // Create the list item
        var newListItem = [{
            imageViewCheckmark: {
                image: "/icons/check_mark.png",
                left: 10,
                top: 10
            },
            itemTitle: {
                text: formValues.name,
                font: {
                    fontSize: '18sp'
                },
                left: 10,
                top: 10
            },
            properties: {
                itemId: formValues.name,
                searchableText: formValues.name,
                backgroundColor: '#fff'
            }
        }];

        var listSection = Titanium.UI.createListSection({
            // properties
            items: newListItem,
            //headerView : listSectionHeaderView
            headerTitle: "User Added Items"
        });

        $.listViewTodo.appendSection(listSection);

        // Add the new item to the UI
        //$.listSection.appendItems(newListItem);

    });

};

/**
 *
 * @method openTodoListHistory
 */
function openTodoListHistory() {
    // @TODO Move this to its own function
}
