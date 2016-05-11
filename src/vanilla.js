/**
 * パラメータに数値を設定することでデータ取得月を変更する
 * 設定は以下
 * 例）
 * 実行日が2016/5/6なら
 * なし:2016/5/6-2016/5/31
 * 1:2016/6/1-2016/6/30
 * 2:2016/7/1-2016/7/31
 * 3:2016/8/1-2016/8/31
 * 4:2016/9/1-2016/9/30
 * 5:2016/10/1-2016/10/31
 * 
 * vanilla航空は5カ月先まで予約可能なためパラメータは5まで使える
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


////**************************************************
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
var flightList = [{
        from: "NRT",
        from_name: "東京(成田)",
        to: "CTS",
        to_name: "札幌(新千歳)"
    },
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "OKA",
        to_name: "沖縄(那覇)"
    },
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "ASJ",
        to_name: "奄美大島"
    },
//海外ルート除外
//    {
//        from: "NRT",
//        from_name: "東京(成田)",
//        to: "TPE",
//        to_name: "台北(桃園)"
//    },
//    {
//        from: "NRT",
//        from_name: "東京(成田)",
//        to: "KHH",
//        to_name: "高雄"
//    },
//    {
//        from: "NRT",
//        from_name: "東京(成田)",
//        to: "HKG",
//        to_name: "香港"
//    },
//    {
//        from: "KIX",
//        from_name: "大阪(関西)",
//        to: "TPE",
//        to_name: "台北(桃園)"
//    },
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "KIX",
        to_name: "大阪(関西)"
    },
//国内乗換ルート除外（札幌→東京　東京→奄美大島のチケットを別々に予約するのと同じなんて詐欺だろ）
//    {
//        from: "CTS",
//        from_name: "札幌(新千歳)",
//        to: "ASJ",
//        to_name: "奄美大島"
//    },
//    {
//        from: "CTS",
//        from_name: "札幌(新千歳)",
//        to: "TPE",
//        to_name: "台北(桃園)"
//    },
//    {
//        from: "CTS",
//        from_name: "札幌(新千歳)",
//        to: "KHH",
//        to_name: "高雄"
//    },
//    {
//        from: "CTS",
//        from_name: "札幌(新千歳)",
//        to: "HKG",
//        to_name: "香港"
//    },
    {
        from: "OKA",
        from_name: "沖縄(那覇)",
        to: "NRT",
        to_name: "東京(成田)"
    },
//乗換ルート除外（以下同文）
//    {
//        from: "OKA",
//        from_name: "沖縄(那覇)",
//        to: "CTS",
//        to_name: "札幌(新千歳)"
//    },
//    {
//        from: "OKA",
//        from_name: "沖縄(那覇)",
//        to: "ASJ",
//        to_name: "奄美大島"
//    },
    {
        from: "ASJ",
        from_name: "奄美大島",
        to: "NRT",
        to_name: "東京(成田)"
    },
//乗換ルート除外（以下同文）
//    {
//        from: "ASJ",
//        from_name: "奄美大島",
//        to: "CTS",
//        to_name: "札幌(新千歳)"
//    },
//    {
//        from: "ASJ",
//        from_name: "奄美大島",
//        to: "OKA",
//        to_name: "沖縄(那覇)"
//    },
//    {
//        from: "TPE",
//        from_name: "台北(桃園)",
//        to: "NRT",
//        to_name: "東京(成田)"
//    },
//    {
//        from: "TPE",
//        from_name: "台北(桃園)",
//        to: "CTS",
//        to_name: "札幌(新千歳)"
//    },
//    {
//        from: "TPE",
//        from_name: "台北(桃園)",
//        to: "KIX",
//        to_name: "大阪(関西)"
//    },
//    {
//        from: "KHH",
//        from_name: "高雄",
//        to: "NRT",
//        to_name: "東京(成田)"
//    },
//    {
//        from: "KHH",
//        from_name: "高雄",
//        to: "CTS",
//        to_name: "札幌(新千歳)"
//    },
//    {
//        from: "HKG",
//        from_name: "香港",
//        to: "NRT",
//        to_name: "東京(成田)"
//    },
//    {
//        from: "HKG",
//        from_name: "香港",
//        to: "CTS",
//        to_name: "札幌(新千歳)"
//    }
];

//URI生成
function createURL(from, to, day) {
    return "https://www.vanilla-air.com/jp/booking/#/flight-select/?tripType=OW&origin=" + from + "&destination=" + to + "&outboundDate=" + day + "&adults=1&children=0&infants=0&promoCode=&mode=searchResultInter";
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
                    logger.info('putPlice -- start --');
                    driver.wait(driver.findElement(By.xpath('//div[@class="vnl-flight-selected-date_flights vnl-table"]/dl/dt/span[@class="vnl-flight-selected-date_bar-selectedDate ng-binding"]')), 20000);
                    logger.debug('--step1--');
                    return;

                }).then(function () {
                    logger.debug('--step2--');
                    return driver.sleep(5000);
                }).then(function () {
                    logger.debug('--step3--');
                    //料金リスト取得
                    return driver.findElements(By.xpath("//dl[@class='flip-in rowroot ng-scope']"));
                }).then(function (rows) {
                    //航空データが無い場合は処理を抜ける
                    logger.debug('rows = ' + rows.length);
                    if (rows.length == 0) {
                        logger.info('-- flight route not found --');
                        return;
                    }

                    rows.forEach(function (row, key) {
                        logger.debug('--step4--');
                        var count = parseInt(key) + 1;

                        //料金のレコードがあるならループする
                        var flightObj = flightInfo.flight_info.create();
                        flightObj.airlineCompanyName = 'vanilla';
                        flightObj.leavedFrom = flight.from;
                        flightObj.leavedFromName = flight.from_name;
                        flightObj.arrivalTo = flight.to;
                        flightObj.arrivalToName = flight.to_name;
                        flightObj.createdAt = days;

                        flow = webdriver.promise.controlFlow();
                        flow.execute(function () {
                            logger.debug('--roop - ' + count);
                            //便名、出発日、到着日を取得
                            row.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dt")).then(
                                    function (e) {
                                        e.getText().then(
                                                function (text) {
                                                    logger.debug('--step5--');
                                                    //航空会社CD
                                                    var flightid = text.toString().substr(0, 5);
                                                    flightObj.flightId = flightid;
                                                    //出発時間
                                                    var times = text.toString().substr(6);
                                                    logger.debug('航空ID =' + flightid);
                                                    //到着時間
                                                    flightObj.leavedAt = moment(days + ' ' + times.substr(0, 5), 'YYYY/MM/DD HH:mm');
                                                    flightObj.arrivalAt = moment(days + ' ' + times.substr(6), 'YYYY/MM/DD HH:mm');
                                                    logger.debug('出発時間 =' + flightObj.leavedAt.toDate());
                                                    logger.debug('到着時間 =' + flightObj.arrivalAt.toDate());
                                                })
                                    });

                            row.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]/div/span")).then(
                                    function (e) {
                                        e.getText().then(function (text) {
                                            logger.debug('--step6--');
                                            logger.debug(text);
                                            if (text == '満席') {
                                                logger.debug('×');
                                                flightObj.vacancyStatus = '×';
                                            } else {
                                                logger.debug('○');
                                                flightObj.vacancyStatus = '○';

                                                row.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]//span[@class='pl30 ng-binding']")).then(
                                                        function (e) {
                                                            e.getText().then(function (text) {
                                                                logger.debug('込々プラン = ' + text);
                                                                flightObj.amount.push({key: 'コミコミプラン', amount: replaceAmount(text)});
                                                            })
                                                        });
                                                row.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]//span[@class='pl30 ng-binding']")).then(
                                                        function (e) {
                                                            e.getText().then(function (text) {
                                                                logger.debug('シンプルプラン = ' + text);
                                                                flightObj.amount.push({key: 'シンプルプラン', amount: replaceAmount(text)});
                                                            })
                                                        });
                                            }
                                        })
                                    });

                        }).then(function () {
                            logger.debug('--data append = ' + count);
                            flightInfo.flight_info.append(flightObj);
                        });
                    });
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
