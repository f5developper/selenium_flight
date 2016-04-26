var mongo = require('mongoskin');
var moment = require('moment');
var FlightInfo = {
    createdAt:'',
    updateAt: '',      
    flightId: '',
    //航空会社CD
    airlineCompanyCd: '',
    //航空会社名称
    airlineCompanyName: 'ピーチ',
    //出発空港ID
    leavedFrom: '',
    //出発空港
    leavedFromName: '',
    //出発時間
    leavedAt: '',
    //到着空港ID
    arrivalTo: '',
    //到着空港
    arrivalToName: '',
    //到着時間
    arrivalAt: '',
    //料金プラン
    flightPlan: '片道',
    //空席状況
    vacancyStatus: '',
    //料金
    amount: [],
};

exports.flight_info = (function () {
    var client = mongo.db('mongodb://flight:mC5DJaYi@160.16.95.237/flight');
    var collection = client.collection('flight_info');
    return {
        append: function (flightInfo) {
            flightInfo.leavedAt = flightInfo.leavedAt.toDate();
            flightInfo.arrivalAt = flightInfo.arrivalAt.toDate();
            collection.insert(flightInfo);
        },
        create:function(){
            var ins = (JSON.parse(JSON.stringify(FlightInfo)));
            ins.createdAt = moment().toDate();
            ins.updatedAt = moment().toDate();
            return ins;
        }
    }
})();

 