console.log('--start--');

process.on('uncaughtException', function (err) {
    console.log(err);
});

var mongo = require('mongoskin');

var db = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight', {native_parser:true});
//バインドすることでオブジェクトとしてflight_route_vanillaをあつかう
db.bind('flight_route_vanilla');


db.flight_route_vanilla.find({}).toArray(function(err, items) {
        db.close();
        if (err) {
            console.log('-Erro-');
            console.log(err);
            return err;
        }

        for (var i = 0, size = items.length; i < size; ++i) {
            console.log('--faind--');
            console.log(items[i]);
        }
        console.log('--end--');
});

