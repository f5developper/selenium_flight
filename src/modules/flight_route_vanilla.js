var mongo = require('mongoskin');



exports.faindAll = function (callback) {
    var client = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight');
    client.bind('flight_route_vanilla');
    console.log('--faindAll--');
    return client.flight_route_vanilla.find({}).toArray(function (err, items) {
        client.close();
        if (err) {
            console.log('-Erro-');
            console.log(err);
            return err;
        }

        for (var i = 0, size = items.length; i < 2; ++i) {
            callback(items[i].from,items[i].from_name,items[i].to,items[i].to_name);
        }
        console.log('--faindAll  end--');
    });
};

