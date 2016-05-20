var mongo = require('mongoskin');
var moment = require('moment');
var database = require('./database');
var notification = require('./notification');

var FlightInfo = {
    createdAt: '',
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
function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/g, '');
    }
    return text;
}

var COLLECTION_NAME = 'flight_info';
var collection = null;
exports.flight_info = (function () {
    collection = database.database.createCollection(COLLECTION_NAME);
    return {
        append: function (flightInfo) {
            flightInfo.leavedAt = flightInfo.leavedAt.toDate();
            flightInfo.arrivalAt = flightInfo.arrivalAt.toDate();
            flightInfo.amount.forEach(function(data, key ){
                data.amount =replaceAmount(data.amount); 
            });
            
            collection.insert(flightInfo);

            collection.aggregate([
                {$match: {"_id": flightInfo._id}}, {$project: {_id: 1, flightId: 1, leavedFrom: 1, arrivalTo: 1, leavedAt: 1, arrivalAt: 1, airlineCompanyName: 1, amount: {$min: "$amount.amount"}}}
            ], function (err, result) {
                result.forEach(function (price) {
                    var from = moment(price.leavedAt).startOf('day');
                    var to = moment(price.leavedAt).endOf('day');

                    notification.notification.getCollection().find({noticeAmount: {$ne: price.amount}, leavedAt: {$gte: from.toDate(), $lt: to.toDate()}, leavedPort: price.leavedFrom, arrivalPort: price.arrivalTo})
                            .toArray(function (error, notices) {
                                notices.forEach(function (notice) {
                                    notice.prices.push(price);
                                    notice.isNotice = '1';
                                    notification.notification.getCollection().update({_id: mongo.helper.toObjectID(notice._id)}, notice);
                                });
                            });
                });
            });
        },
        create: function () {
            var ins = (JSON.parse(JSON.stringify(FlightInfo)));
            ins.createdAt = moment().toDate();
            ins.updatedAt = moment().toDate();
            return ins;
        }
    }
})();

 