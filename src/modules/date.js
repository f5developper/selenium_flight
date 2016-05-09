
/**
 * 当月取得
 * @returns {Number}
 */
exports.getMonth = function () {
    var dt = new Date();
    return dt.getMonth() + 1;
}

/**
 * 日付取得
 * @param {type} yer
 * @param {type} month
 * @param {type} day
 * @returns {Array|exports.getDay.days}
 */
exports.getDay = function (yer,month,day) {
    var dt = new Date();
    if(typeof yer === 'undefined' || yer === '' || yer === null){
        yer = dt.getFullYear();
    }
    if(typeof month === 'undefined' || month === '' || month === null){
        month = dt.getMonth() + 1;
    }
    if(typeof day === 'undefined' || day === '' || day === null){
        day = dt.getDate();
    }
    
    var days = [
        yer,
        month,
        day
    ].join('-')
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
    return days;
}

/**
 * 指定した日付の月初取得
 * デフォルトは当月の月初
 * @param {type} date
 * @returns {Array|exports.getFirstOfTheMonth.days}
 */
exports.getFirstOfTheMonth = function (date) {
    //パラメータが空の場合の初期値
    if(typeof date === 'undefined'){
        date = this.getDay();
    }
    var dt = new Date(date);
    dt.setMonth(dt.getMonth());
    dt.setDate(1);
    var days = [
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate()
    ].join('-')
    return days;
}

/**
 * 指定日の月末取得
 * デフォルトは当月の月末
 * @param {type} date
 * @returns {Array|exports.getEndOfTheMonth.days}
 */
exports.getEndOfTheMonth = function (date) {
    if(typeof date === 'undefined'){
        date = this.getDay();
    }
    var dt = new Date(date);
    dt.setMonth(dt.getMonth()+1);
    dt.setDate(0);
    var days = [
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDate()
    ].join('-')
    return days;
}
