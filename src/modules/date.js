//selniu取得期間
exports.today = function () {
    var dt = new Date();
    var days = [
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate()
    ].join('-')
    console.log(days);
    return days;
}

exports.lastDay = function () {
    var dt = new Date(today());
    dt.setDate(dt.getDate() + 60);
    var days = [
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate()
    ].join('-')
    console.log(days);
    return days;
}

exports.nextDay = function (date) {
    var dt = new Date(date);
    dt.setDate(dt.getDate() + 1);
    var days = [
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate()
    ].join('-')
    console.log(days);
    return days;
}


