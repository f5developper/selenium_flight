var mongo = require('mongoskin');
var logger = require('./logger');
exports.flight_info_vanilla = (function () {
    var client = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight');
    var collection = client.collection('flight_info');
    return {
        append: function (flightInfo) {
            logger.info('-- insert --');
            logger.info(flightInfo);
            collection.insert(flightInfo);
            logger.info('-- insert end--');
        },
    }
})();

 