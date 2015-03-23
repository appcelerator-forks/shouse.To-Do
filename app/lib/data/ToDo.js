/**
 * This is the a library for retrieving sample ToDo tasks
 *
 * @class Lib.Data.ToDo
 * @author Steven House
 * @email steven.m.house@gmail.com
 */

//saveToCollection();

/**
 * Get all ToDo Sample items
 * @method getSymptoms
 * @return symptoms
 */
exports.getTasks = function() {
    return tasks;
}

var tasks = [
    { name: "Get Hired with Propellics", section: "Test 1"},
    { name: "Make Cool Stuff!", section: "Test 2"}
];
