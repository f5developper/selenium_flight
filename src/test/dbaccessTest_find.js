//
//航空マスタからデータを取得するサンプル
//

var mongo = require('mongoskin');
var db = mongo.db('mongodb://160.16.95.237:27017/flight', {native_parser:true});

console.log('start');

//bindすることでair_lines_dataコレクションをobjectとしてあつかう
db.bind('air_lines_data').bind({
    getByAuthor: function(code, callback) {
        this.findOne({code: code}, callback);
    }
});

//空港コーが成田のデータを取得
db.air_lines_data.getByAuthor('NRT', function(err, documents) {
//        console.log(article);

        //取得するデータ
        console.log(documents.country);
        console.log(documents.region.region_name);

});

console.log('close');

db.close();

