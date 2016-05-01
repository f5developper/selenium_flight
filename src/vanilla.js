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
logger.debug("serch setting start.");
// サーバー実装の前に、エラーハンドリング
process.on('uncaughtException', function (err) {
    logger.debug(err);
});
var date = require('./modules/date.js');
//空港データ取得
var flight_info_append = require('./modules/flight_info_vanilla.js');

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
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "TPE",
        to_name: "台北(桃園)"
    },
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "KHH",
        to_name: "高雄"
    },
    {
        from: "NRT",
        from_name: "東京(成田)",
        to: "HKG",
        to_name: "香港"
    },
    {
        from: "KIX",
        from_name: "大阪(関西)",
        to: "TPE",
        to_name: "台北(桃園)"
    },
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
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "ASJ",
        to_name: "奄美大島"
    },
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "TPE",
        to_name: "台北(桃園)"
    },
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "KHH",
        to_name: "高雄"
    },
    {
        from: "CTS",
        from_name: "札幌(新千歳)",
        to: "HKG",
        to_name: "香港"
    },
    {
        from: "OKA",
        from_name: "沖縄(那覇)",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "OKA",
        from_name: "沖縄(那覇)",
        to: "CTS",
        to_name: "札幌(新千歳)"
    },
    {
        from: "OKA",
        from_name: "沖縄(那覇)",
        to: "ASJ",
        to_name: "奄美大島"
    },
    {
        from: "ASJ",
        from_name: "奄美大島",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "ASJ",
        from_name: "奄美大島",
        to: "CTS",
        to_name: "札幌(新千歳)"
    },
    {
        from: "ASJ",
        from_name: "奄美大島",
        to: "OKA",
        to_name: "沖縄(那覇)"
    },
    {
        from: "TPE",
        from_name: "台北(桃園)",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "TPE",
        from_name: "台北(桃園)",
        to: "CTS",
        to_name: "札幌(新千歳)"
    },
    {
        from: "TPE",
        from_name: "台北(桃園)",
        to: "KIX",
        to_name: "大阪(関西)"
    },
    {
        from: "KHH",
        from_name: "高雄",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "KHH",
        from_name: "高雄",
        to: "CTS",
        to_name: "札幌(新千歳)"
    },
    {
        from: "HKG",
        from_name: "香港",
        to: "NRT",
        to_name: "東京(成田)"
    },
    {
        from: "HKG",
        from_name: "香港",
        to: "CTS",
        to_name: "札幌(新千歳)"
    }];

//ルート
var flight_route = require('./modules/flight_route_vanilla.js');
var info = require('./modules/flightInfo.js');
function getURL(from, to, day) {
    return "https://www.vanilla-air.com/jp/booking/#/flight-select/?tripType=OW&origin=" + from + "&destination=" + to + "&outboundDate=" + day + "&adults=1&children=0&infants=0&promoCode=&mode=searchResultInter";
}

//円マーク除去
function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/, '');
    }
    return text;
}


logger.info('main -- start --');
driver.get('https://www.google.co.jp/?gws_rd=ssl').then(function () {

    flightList.forEach(function (flight) {
        var days = date.today();
        for (var i = 1; i < 3; i++) {

            var url = getURL(flight.from, flight.to, days);
            logger.debug(url)

            try {

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
                    if (rows == 0) {
                        return;
                    }
                    logger.debug('--step4--');
                    //料金のレコードがあるならループする
                    var count = 0;
                    rows.forEach(function (row, key) {
                        count++;
                        logger.debug('--roop ' + count);
                        var flightinfo = new info.FlightInfo();
                        flightinfo.airlineCompanyName = 'vanilla';
                        flightinfo.leavedFrom = flight.from;
                        flightinfo.leavedFromName = flight.from_name;
                        flightinfo.arrivalTo = flight.to;
                        flightinfo.arrivalToName = flight.to_name;
                        flightinfo.createdAt = days;
                        //便名、出発日、到着日を取得
                        driver.isElementPresent(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + key + 1 + "]/dt")).then(function (e) {
                                    if (e) {
                                        driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + key + 1 + "]/dt")).then(
                                                function (e) {
                                                    return e.getText();
                                                }).then(function (text) {

                                            logger.debug('--step5--');
                                            //航空会社CD
                                            var flightid = text.toString().substr(0, 5);
                                            flightinfo.flightId = flightid;
                                            //出発時間
                                            var times = text.toString().substr(6);
                                            //到着時間
                                            flightinfo.leavedAt = times.substr(0, 5);
                                            flightinfo.arrivalAt = times.substr(6);

                                            logger.debug('航空ID =' + flightid);
                                            logger.debug('出発時間 =' + flightinfo.leavedAt);
                                            logger.debug('到着時間 =' + flightinfo.arrivalAt);

                                        });

                                        driver.isElementPresent(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]/div/span"))
                                                .then(function (e) {
                                                    if (e) {
                                                        driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]/div/span")).then(
                                                                function (e) {
                                                                    return e.getText();
                                                                }).then(function (text) {
                                                            logger.debug('--step6--');
                                                            logger.debug(text);

                                                            if (text == '満席') {
                                                                logger.debug('×');
                                                                flightinfo.vacancyStatus = '×';
                                                                logger.debug('--data append--');
                                                                flight_info_append.flight_info_vanilla.append(flightinfo)
                                                                logger.info('putPlice -- end --');
                                                            } else {
                                                                logger.debug('○');
                                                                driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]//span[@class='pl30 ng-binding']")
                                                                        ).then(function (e) {
                                                                    return e.getText();
                                                                }).then(function (text) {
                                                                    logger.debug('込々プラン = ' + text);
                                                                    flightinfo.vacancyStatus = '○';
                                                                    flightinfo.amount.push({key: 'コミコミプラン', amount: replaceAmount(text)});
                                                                }).then(function () {
                                                                    driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][" + count + "]/dd[1]//span[@class='pl30 ng-binding']")
                                                                            ).then(function (e) {
                                                                        return e.getText();
                                                                    }).then(function (text) {
                                                                        logger.debug('シンプルプラン = ' + text);
                                                                        flightinfo.amount.push({key: 'シンプルプラン', amount: replaceAmount(text)});
                                                                    });
                                                                }).then(function () {
                                                                    logger.debug('--data append--');
                                                                    flight_info_append.flight_info_vanilla.append(flightinfo)
                                                                    logger.info('putPlice -- end --');

                                                                });


                                                            }

                                                        });

                                                    } else {
                                                        logger.debug('データなし');
                                                    }
                                                });
                                    }
                                });
                    });
                });
            } catch (e) {
                logger.error(e);
            }
            days = date.nextDay(days);
        }

    });
    logger.info('main -- end --');
//    });

});

