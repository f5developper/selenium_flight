var mongo = require('mongoskin');
var moment = require('moment');
var client = mongo.db('mongodb://160.16.95.237:27017/flight');
var collection = client.collection('flight_info');

collection.insert({
        //便名
        flightId: "JAL0012",
        //航空会社CD
        airlineCompanyCd: "1",
        //航空会社名称
        airlineCompanyName: "スカイマーク",
        //出発空港ID
        leavedFrom: "NRT",
        //出発空港
        leavedFromName: "成田国際空港",
        //出発時間
        leavedAt: moment("2015-08-16T13:30:00+09:00").toDate(),
        //到着空港ID
        arrivalTo: "KIX",
        //到着空港
        arrivalToName: "関西国際空港",
        //到着時間
        arrivalAt: moment("2015-08-16T16:30:00+09:00").toDate(),
        //料金プラン
        flightPlan:'片道',
        //空席状況
        vacancyStatus:'○',
        //料金
        amount: 1000,
        //データ登録時間
        createdAt: moment("2015-08-16T16:30:00+09:00").toDate()
    });

client.close();

