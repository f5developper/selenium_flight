var mongo = require('mongoskin');
var moment = require('moment');
var database = require('./database');

var COLLECTION_NAME = 'notification';
var collection = null;

exports.notification = (function () {

    collection = database.database.createCollection(COLLECTION_NAME);
    return {
        append: function (flightInfo) {
            collection.insert(flightInfo);
        },
        getCollection: function () {
            return collection;
        }
    }
})();
