//**************************************************
//vanilla空港からのデータ取得用selenium
//**************************************************
//準備

var util = require('util');
var moment = require('moment');
var webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until,
        flow = webdriver.promise.controlFlow();
var flight_info_append = require('./modules/flight_info.js');

//var firefox = require('selenium-webdriver/firefox');
//var profile = new firefox.Profile('firefox_profile');
//var options = new firefox.Options().setProfile(profile);

var driver = new webdriver.Builder()
//        .setFirefoxOptions(options)
//        .forBrowser('firefox')
        .forBrowser('chrome')
        .build();

//driver.controlFlow().on('uncaughtException', function (err) {
//    console.log('uncaughtException: ' + err);
//});

var FLIGHT_MAP = [
    {from: "KIX", toList: ["CTS", "SDJ", "NRT", "MYJ", "FUK", "NGS", "KMI", "KOJ", "OKA"]},
    {from: "CTS", toList: ["KIX", "NRT"]},
    {from: "SDJ", toList: ["KIX"]},
    {from: "NRT", toList: ["KIX", "CTS", "FUK", "OKA"]},
    {from: "MYJ", toList: ["KIX"]},
    {from: "FUK", toList: ["KIX", "NRT", "OKA"]},
    {from: "NGS", toList: ["KIX"]},
    {from: "KMI", toList: ["KIX"]},
    {from: "KOJ", toList: ["KIX"]},
    {from: "OKA", toList: ["KIX", "NRT", "FUK"]},
    {from: "ISG", toList: ["KIX"]},
];



var topPage = {
    //URLトップ
    URL: "http://www.flypeach.com/jp/ja-jp/homeJP.aspx",
    //片道
    tripOneWay: By.id("trip_type_oneway"),
    //出発パネル
    tripFrom: By.id("hyperlink-from"),
    tripTo: By.id('hyperlink-to'),
    tripFromClose: By.id('dialogFromClose'),
    //なんかこの人のせいでじゃまされます
    backgroundDialog: By.id('backgroundDialog'),
    leavedFrom: function (from) {
        return By.xpath('//li[@id="' + from + '"]/a');
    },
    //dayDown
    arrivedTo: function (to) {
        return By.xpath('//div[@id="dialogTo"]//*/li[@id="' + to + '"]/a');
    },
    dayList: By.xpath('//div[@id="calendar-input-departing-on-1"]/*/div[@class="boxMainStripped"]/div[@class="boxMainInner"]/div[@class="boxMainCellsContainer"]/div[@class="dayNormal"]'),
    search: By.name('flyinpeach-booking')
};

var flightInfoPage = {
    priceRows: By.xpath('//div[@class="flight_table-body"]/div'),
    priceFlightName: By.xpath('./div[@class="flight_table-cell width_01-o"]/div[@class="plane_ticket-c"]/span'),
    leavedAt: By.xpath('./div[@class="flight_table-cell width_02-o"]/div[@class="plane_ticket-c"]/span[@class="plane_ticket-wrapper left_col-o"]/span'),
    leavedFromName: By.xpath('//*[@id="js_wrapper"]/div[2]/div[1]/article/div[3]/div/div[1]/div/div[2]/div/span[1]/span/span[1]'),
    arrivalAt: By.xpath('./div[@class="flight_table-cell width_02-o"]/div[@class="plane_ticket-c"]/span[@class="plane_ticket-wrapper right_col-o"]/span'),
    arrivalToName: By.xpath('//*[@id="js_wrapper"]/div[2]/div[1]/article/div[3]/div/div[1]/div/div[2]/div/span[3]/span/span'),
    happyPeachAmount: By.xpath('./div[3]/span[1]/span/span/span/span/span'),
    happyPeachPlusAmount: By.xpath('./div[4]/span[1]/span/span/span/span/span')
};

function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/g, '');
    }
    return text;
}

var searchDate = moment();
var index = 0;
do {
    var targetDate = moment(searchDate).add(index, 'days');

    (function (targetDate) {

        FLIGHT_MAP.forEach(function (flight, index) {
            var from = flight.from;
            var toList = flight.toList;
            index = index + 1;

            toList.forEach(function (to, key) {
                    driver.get(topPage.URL).then(function () {

                    return driver.findElement(topPage.tripOneWay);
                }).then(function (e) {
                    driver.wait(until.elementIsVisible(e));
                }).then(function () {
                    return driver
                            .findElements(By.id("close"))
                            .then(function (list) {
                                webdriver.promise.filter(list, function (e) {
                                    e.isDisplayed().then(function (bool) {
                                        if (bool) {
                                            e.click();
                                            driver.sleep(500);
                                        }
                                    });
                                });
                            });
                }).then(function () {
                    return driver.findElement(topPage.tripOneWay);
                }).then(function (e) {
                    e.click();
                }).then(function () {
                    return driver.findElement(topPage.tripFrom);
                }).then(function (e) {
                    e.click();
                }).then(function () {
                    return driver.findElement(topPage.leavedFrom(from));
                }).then(function (e) {
                    e.click();
                }).then(function () {
                    // 出発地の選択画面を閉じずにクリック後はToの選択を行うようにしたためコメントアウト
//                    driver.findElement(topPage.tripFromClose).then(function (e) {
//                        e.click();
//                    }).then(function () {
//                        return driver.findElement(topPage.backgroundDialog);
//                    }).then(function (e) {
//                        return driver.wait(until.elementIsNotVisible(e));
//                    }).then(function () {
//                        return driver.findElement(topPage.tripTo);
//                    }).then(function (e) {
//                    driver.findElement(topPage.tripTo).then(function (e)){
//                        e.click();
//                    }).then(function () {
//                        return driver.findElement(topPage.arrivedTo(to));
//                    }).then(function (e) {
                    driver.findElement(topPage.arrivedTo(to)).then(function (e){
                        return e.click();
                    }).then(function (e) {
                        driver.executeScript(function (date) {
                            $("#inputDepartingon").val(date),
                            $("input[name=flyinpeach-booking]").trigger('click');
                        }, targetDate.format('YYYY/MM/DD'));
                    }).then(function () {
                        //ロード後のすくりぷとが終わるの待つ必要があるんですが、とりあえず
                        return driver.sleep(1000);
                    }).then(function () {

                        var priceRowsPromise = driver.findElements(flightInfoPage.priceRows);
                        priceRowsPromise.then(function (rows) {

                            var flightInfoList = [];
                            //フライトインフォは後でインスタンス化せねば
                            rows.forEach(function (row, key) {

                                var flightInfo = flight_info_append.flight_info.create();
                                flightInfo.airlineCompanyCd='1';
                                flightInfo.leavedFrom = from;
                                flightInfo.arrivalTo = to;

                                flow = webdriver.promise.controlFlow();
                                flow.execute(function () {
                                    row.findElement(flightInfoPage.priceFlightName).then(function (e) {
                                        e.getText().then(function (text) {
                                            flightInfo.flightId = text;
                                        });
                                    });
                                    row.findElement(flightInfoPage.leavedAt).then(function (e) {
                                        e.getText().then(function (text) {
                                            var fromDate = moment(targetDate.format('YYYY/MM/DD') + ' ' + text, 'YYYY/MM/DD HH:mm');
                                            flightInfo.leavedAt = fromDate;
                                        });
                                    });
                                    row.findElement(flightInfoPage.arrivalAt).then(function (e) {
                                        e.getText().then(function (text) {
                                            var toDate = moment(targetDate.format('YYYY/MM/DD') + ' ' + text, 'YYYY/MM/DD HH:mm');
                                            flightInfo.arrivalAt = toDate;
                                        });
                                    });
                                    row.findElement(flightInfoPage.leavedFromName).then(function (e) {
                                        e.getText().then(function (text) {
                                            flightInfo.leavedFromName = text;
                                        });

                                    });
                                    row.findElement(flightInfoPage.arrivalToName).then(function (e) {
                                        e.getText().then(function (text) {
                                            flightInfo.arrivalToName = text;
                                        });
                                    });
                                    row.isElementPresent(flightInfoPage.happyPeachAmount).then(function (isFound) {
                                        if (isFound) {
                                            row.findElement(flightInfoPage.happyPeachAmount).then(function (e) {
                                                e.getText().then(function (text) {
                                                    flightInfo.amount.push({key: 'ハッピーピーチ', amount: replaceAmount(text)});
                                                });
                                            });
                                        }
                                    });

                                    row.isElementPresent(flightInfoPage.happyPeachPlusAmount).then(function (isFound) {
                                        if (isFound) {
                                            row.findElement(flightInfoPage.happyPeachPlusAmount).then(function (e) {
                                                e.getText().then(function (text) {
                                                    flightInfo.amount.push({key: 'ハッピーピーチプラス', amount: replaceAmount(text)});
                                                });
                                            });
                                        }
                                    });
                                }).then(function () {
                                    flight_info_append.flight_info.append(flightInfo);
                                });
                            });
                        });
                    });
                });
            })
        });
    })(targetDate);
} while (++index < 180);
