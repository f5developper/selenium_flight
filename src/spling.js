/**
 * パラメータに数値を設定することでデータ取得月を変更する
 * 設定は以下
 * 例）
 * 実行日が2016/5/6なら
 * なし:2016/5/6-2016/5/31
 * 1:2016/6/1-2016/6/30
 * 2:2016/7/1-2016/7/31
 * 3:2016/8/1-2016/8/31
 * 
 * 春秋航空は3カ月先まで予約可能なためパラメータは3まで使える
 * 
 * @type Module date|Module date
 */
var date = require('./modules/date.js');

if (process.argv[2] && process.argv[2] > 0) {
    var month = date.getMonth() + parseInt(process.argv[2]);
    console.log('est: ' + month);
    var startDay = date.getFirstOfTheMonth(date.getDay('', month, ''));
    var endDay = date.getEndOfTheMonth(startDay);

    console.log('startDay: ' + startDay);
    console.log('endDay: ' + endDay);
} else {
    var startDay = date.getDay();
    var endDay = date.getEndOfTheMonth(startDay);
}
console.log('startDay: ' + startDay);
console.log('endDay: ' + endDay);


var logger = require('./modules/logger');
var util = require('util');
var moment = require('moment');
var webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until,
        flow = webdriver.promise.controlFlow();
var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
logger.debug("serch setting start.");

////**************************************************
//エラーハンドリング
//**************************************************
process.on('uncaughtException', function (err) {
    driver.quit();
    logger.error('ERROR:' + err);
    process.exit();
});

//空港データ取得
var flightInfo = require('./modules/flight_info.js');

//航空ルート
var flightList = [
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "HSG",
        to_name: "佐賀"
    },
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "HIJ",
        to_name: "広島"
    },
    {
        from: "HIJ",
        from_name: "広島",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "HIJ",
        from_name: "広島",
        to: "HSG",
        to_name: "佐賀"
    },
];

//URI生成
function createURL(from, to, day) {
    return "http://jp.ch.com/flights/HSG-NRT.html?OriCityCode=" + from + "&DestCityCode=" + to + "&FlightDate=" + day + "&FlightDateReturn=" + day + "&IsReturn=False&MoneyType=1&AdultNum=1&ChildNum=0&InfantNum=0";
}

//円マーク除去
function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/, '');
    }
    return text;
}
var putFlightInfo = function () {

    logger.info('main -- start --');
    driver.get('https://www.google.co.jp/?gws_rd=ssl').then(function () {
        flightList.forEach(function (flight) {

            var days = startDay;
            for (; ; ) {
                var url = createURL(flight.from, flight.to, days);
                logger.debug(url)

                driver.get(url).then(function () {
                    logger.info(' -- start --');
                    driver.wait(driver.findElement(By.xpath('//[@id="goFlightsShow"]')), 20000);
                    logger.debug('--step1--');
                    return;

                }).then(function () {
                    logger.debug('--step2--');
                    return driver.sleep(5000);
                }).then(function () {
                    logger.debug('--step3--');
                    //料金リスト取得
                    return driver.findElements(By.xpath("//[@id='goFlightsShow']/tr"));
                }).then(function (rows) {
                    //航空データが無い場合は処理を抜ける
                    logger.debug('rows = ' + rows.length);
                    if (rows.length == 0) {
                        logger.info('-- flight route not found --');
                        return;
                    }

                    for (var count = 1; count < rows.length(); count++) {
                        var flightObj = flightInfo.flight_info.create();
                        flightObj.airlineCompanyName = '春秋航空';
                        flightObj.leavedFrom = flight.from;
                        flightObj.leavedFromName = flight.from_name;
                        flightObj.arrivalTo = flight.to;
                        flightObj.arrivalToName = flight.to_name;
                        flightObj.createdAt = days;

                        flow.execute(function () {

                            var columns = driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt"));
                            if (columns.length() > 1) {
                            }

                            driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt[@class='first springjp']")).then(function (e) {
                                e.getText().then(function (text) {
                                    flightObj.flightId = text;
                                    logger.debug('航空ID =' + flightObj.flightId);
                                })
                            });

                            driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt[@class='bolda']")).then(function (e) {
                                e.getText().then(function (text) {
                                    flightObj.leavedAt = moment(days + ' ' + text, 'YYYY/MM/DD HH:mm');
                                    logger.debug('出発時間 =' + flightObj.leavedAt.toDate());
                                })
                            });
                            driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt[3]")).then(function (e) {
                                e.getText().then(function (text) {
                                    flightObj.arrivalAt = moment(days + ' ' + text, 'YYYY/MM/DD HH:mm');
                                    logger.debug('到着時間 =' + flightObj.arrivalAt.toDate());
                                })
                            });
                            driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt[@class='cn_txt_03 td_plus']")).then(function (e) {
                                e.getText().then(function (text) {
                                    logger.debug('スプリング プラス = ' + text);
                                    flightObj.amount.push({key: 'スプリング プラス', amount: replaceAmount(text)});
                                })
                            });
                            driver.findElements(By.xpath("//[@id='goFlightsShow']/tr[" + count + "]/dt[@class='cn_txt_03 td_flexi']")).then(function (e) {
                                e.getText().then(function (text) {
                                    logger.debug('スプリング = ' + text);
                                    flightObj.amount.push({key: 'スプリング', amount: replaceAmount(text)});
                                })
                            });
                        }).then(function () {
                            logger.debug('--data append = ' + count);
                            flightInfo.flight_info.append(flightObj);
                        });
                    }
                });
                if (days === endDay) {
                    break;
                }
                days = date.nextDay(days);
            }
        });
        logger.info('main -- end --');
    });
}

flow.execute(putFlightInfo);
flow.execute(function () {
    driver.quit();
    logger.info('-- close --');
    process.exit();
});
