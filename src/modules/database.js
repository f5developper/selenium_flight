var mongo = require('mongoskin');
var moment = require('moment');
var client = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight');
var collectionList = client.collection('flight_info');
//var collectionList = client.collection('flight_info');
exports.database = (function () {
    return {
        createCollection: function (name) {
            if (typeof collectionList[name] === "undefined") {
                collectionList[name] = client.collection(name);
            }
            return collectionList[name];
        }
    };
})();
