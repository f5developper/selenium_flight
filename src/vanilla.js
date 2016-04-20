//**************************************************
//vanilla空港からのデータ取得用selenium
//**************************************************
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

console.log("serch setting start.");
logger.debug("serch setting start.");
// サーバー実装の前に、エラーハンドリング
process.on('uncaughtException', function (err) {
    console.log(err);
    logger.debug(err);
});

var date = require('./modules/date.js');
//空港データ取得
var flight_info_append = require('./modules/flight_info.js');
//ルートデータ取得
var flight_route = require('./modules/flight_route_vanilla.js');



var getURL = function (from, to, day) {
    return "https://www.vanilla-air.com/jp/booking/#/flight-select/?tripType=OW&origin=" + from + "&destination=" + to + "&outboundDate=" + day + "&adults=1&children=0&infants=0&promoCode=&mode=searchResultInter";
}


//円マーク除去
function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/, '');
    }
    return text;
}

//一日分のデータを登録
var putPlice =function(url, from, from_name, to, to_name, days) {
    driver.get(url).then(function () {
        console.log('putPlice -- start --');
        logger.debug('putPlice -- start --');

        driver.wait(driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope']/dt")
                ), 10000).then(function () {
        console.log('--step1--');
        logger.debug('--step1--');
            return;
        }).then(function () {
        console.log('--step2--');
        logger.debug('--step2--');
            driver.sleep(10000).then(function () {

        console.log('--step3--');
        logger.debug('--step3--');

                var info = require('./modules/flightInfo.js');
                // ちゃんとエラー処理を書く
                try {
                    //要素が無いなら次へ
                    driver.findElements(By.xpath("//dl[@class='flip-in rowroot ng-scope']"));
                } catch (e) {
                    return;
                }

                //料金リスト取得
                driver.findElements(By.xpath("//dl[@class='flip-in rowroot ng-scope']")).then(function (rows) {
                console.log('--step4--');
                logger.debug('--step4--');
        
                    //料金のレコードがあるならループする
                    rows.forEach(function (row, key) {


                        var flightinfo = new info.FlightInfo();

                        flightinfo.leavedFrom = from;
                        flightinfo.leavedFromName = from_name;
                        flightinfo.arrivalTo = to;
                        flightinfo.arrivalToName = to_name;
                        flightinfo.createdAt = days;

                        console.log(key);
                        logger.debug(key);
                        var count = key + 1;
                        console.log('--------');
                        logger.debug('--------');

                        //便名、出発日、到着日を取得
                        driver.findElement(
                                By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dt")
                                ).then(function (e) {
                            e.getText().then(function (text) {
                                
                console.log('--step5--');
                logger.debug('--step5--');
                                var flightid = text.toString().substr(0, 5);
                                //航空会社CD
                                flightinfo.flightId = flightid;
                                var times = text.toString().substr(6);
                                //出発時間
                                flightinfo.leavedAt = times.substr(0, 5);
                                //到着時間
                                flightinfo.arrivalAt = times.substr(6);

                                console.log('航空ID =' + flightid);
                                logger.debug('航空ID =' + flightid);
                                console.log('出発時間 =' + flightinfo.leavedAt);
                                logger.debug('出発時間 =' + flightinfo.leavedAt);
                                console.log('到着時間 =' + flightinfo.arrivalAt);
                                logger.debug('到着時間 =' + flightinfo.arrivalAt);

                            });
                        }).then(function () {
                console.log('--step6--');
                logger.debug('--step6--');
                            //こみこみプランの料金取得
                            driver.findElement(
                                    By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]//span[@class='pl30 ng-binding']")
                                    ).then(function (e) {
                                e.getText().then(function (text) {
                                    console.log('込々プラン = ' + text);
                                    logger.debug('込々プラン = ' + text);
                                    flightinfo.amount.push({key: 'コミコミプラン', amount: replaceAmount(text)});
                                });
                            }).then(function () {
                console.log('--step7--');
                logger.debug('--step7--');
                                //シンプルプランの料金取得
                                driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[2]//span[@class='pl30 ng-binding']")
                                        ).then(function (e) {
                console.log('--step8--');
                logger.debug('--step8--');
                                    e.getText().then(function (text) {
                console.log('--step9--');
                logger.debug('--step9--');
                                        console.log('シンプルプラン = ' + text);
                                        logger.debug('シンプルプラン = ' + text);
                                        flightinfo.amount.push({key: 'シンプルプラン', amount: replaceAmount(text)});
                                    }).then(function () {
                console.log('--step10--');
                logger.debug('--step10--');
                                        flight_info_append.flight_info.append(flightinfo)
                                        console.log(flightinfo);
                                        logger.debug(flightinfo);
                                        console.log('putPlice -- end --');
                                        logger.debug('putPlice -- end --');
                                    });
                                });
                            });
                        });
                    });
                });
            })
        });
    });

}
//var airLines = function (from, from_name, to, to_name) {
var main = function () {
    console.log('main -- start --');
    logger.debug('main -- start --');
    driver.get('https://www.google.co.jp/?gws_rd=ssl').then(function () {
        //時間がかかるブラウザの立ち上げを先にやる
    }).then(function () {
        //ルート検索
        flight_route.faindAll(function (from, from_name, to, to_name) {
            //ルート＋日付分処理ループ
            var day = date.today();
            for (var i = 0; i < 2; i++) {
                var url = getURL(from, to, day);
                console.log(url)
                logger.debug(url)
                putPlice(url, from, from_name, to, to_name, day);
                day = date.nextDay(day);
            }
        });
        console.log('main -- end --');
        logger.debug('main -- end --');
    });
}

main();


