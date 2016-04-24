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
var FlightInfo = {
    flightId: '',
    //航空会社CD
    airlineCompanyCd: '',
    //航空会社名称
    airlineCompanyName: '',
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
    //データ登録時間
    createdAt: ''
};


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
//        driver.isElementPresent(By.xpath('//div[@id="dialogTo"]/div[@class="dialog_2columns"]/*/ul/li[@id="' + to + '"]/a')).then(function (exists) {
//            if (exists) {
//                return By.xpath('//div[@id="dialogTo"]/div[@class="dialog_2columns"]/*/ul/li[@id="' + to + '"]/a');
//            }
//
//        });
    },
    dayList: By.xpath('//div[@id="calendar-input-departing-on-1"]/*/div[@class="boxMainStripped"]/div[@class="boxMainInner"]/div[@class="boxMainCellsContainer"]/div[@class="dayNormal"]'),
    search: By.name('flyinpeach-booking')
};

var flightInfoPage = {
    priceRows: By.xpath('//div[@class="flight_table-body"]/div'),
    priceFlightName: By.xpath('./div[@class="flight_table-cell width_01-o"]/div[@class="plane_ticket-c"]/span'),
    leavedAt: By.xpath('./div[@class="flight_table-cell width_02-o"]/div[@class="plane_ticket-c"]/span[@class="plane_ticket-wrapper left_col-o"]/span'),
    leavedFromName: By.xpath('//*[@id="js_wrapper"]/div[2]/div[1]/article/div[3]/div/div[1]/div/div[2]/div/span[1]/span/span[1]'),
    arrivalToName: By.xpath('//*[@id="js_wrapper"]/div[2]/div[1]/article/div[3]/div/div[1]/div/div[2]/div/span[3]/span/span'),
    happyPeachAmount: By.xpath('./div[3]/span[1]/span/span/span/span/span'),
    happyPeachPlusAmount: By.xpath('./div[4]/span[1]/span/span/span/span/span')
};

function replaceAmount(text) {
    if (text.match(/^(?:¥[0-9,]+)$/)) {
        return text.replace(/[¥|,]/, '');
    }
    return text;
}


var index = 0;
//while (index < 60) {
//    var searchDay = moment().add(++index, 'days').format("D");
//    console.log(searchDay);
//}

var searchDay = moment().add(15, 'days').format("D");
var searchDate = moment();
FLIGHT_MAP.forEach(function (flight, index) {
    var from = flight.from;
    var toList = flight.toList;
    index = index + 1;

    searchDate.add(index, 'days');

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
            driver.findElement(topPage.tripFromClose).then(function (e) {
                e.click();
                driver.findElement(topPage.backgroundDialog)
                        .then(function (elem) {
                        });
            }).then(function () {
                return driver.findElement(topPage.backgroundDialog);
            }).then(function (e) {
                return driver.wait(until.elementIsNotVisible(e));
            }).then(function () {
                return driver.findElement(topPage.tripTo);
            }).then(function (e) {
                e.click();
            }).then(function () {
                return driver.findElement(topPage.arrivedTo(to));
            }).then(function (e) {
                e.click();
            }).then(function () {
                return driver.findElements(topPage.dayList);
            }).then(function (list) {
                return webdriver.promise.filter(list, function (e) {

                    return e.getText().then(function (text) {
                        return text === searchDate.format("D");
                    });
                });
            }).then(function (elem) {
                // 日付が反映される前にクリックされるためスリープを入れる。
                driver.sleep(500);
                elem[0].click();
            }).then(function () {
                return driver.findElement(topPage.backgroundDialog);
            }).then(function (e) {
                return driver.wait(until.elementIsNotVisible(e));
            }).then(function () {
                driver.findElement(topPage.search).click();
            }).then(function () {
                //ロード後のすくりぷとが終わるの待つ必要があるんですが、とりあえず
                return driver.sleep(5000);
            }).then(function () {

                var priceRowsPromise = driver.findElements(flightInfoPage.priceRows);
                priceRowsPromise.then(function (rows) {

                    var flightInfoList = [];
                    //フライトインフォは後でインスタンス化せねば
                    rows.forEach(function (row, key) {

                        var flightInfo = '';
                        flightInfo = (JSON.parse(JSON.stringify(FlightInfo)));
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
                                    var fromDate = moment(searchDate.format('YYYY/MM/DD') + ' ' + text, 'YYYY/MM/DD HH:mm');
                                    flightInfo.leavedAt = fromDate;
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

    });
});
