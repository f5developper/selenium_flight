var mongo = require('mongoskin');
var moment = require('moment');

exports.flight_info = (function () {
    var client = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight');
    var collection = client.collection('flight_info');
    return {
        append: function (flightInfo) {
            collection.insert(flightInfo);
        }
    }
})();

 