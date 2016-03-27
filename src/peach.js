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

//var firefox = require('selenium-webdriver/firefox');
//var profile = new firefox.Profile('firefox_profile');
//var options = new firefox.Options().setProfile(profile);

var driver = new webdriver.Builder()
//        .setFirefoxOptions(options)
        .forBrowser('chrome')
        .build();

driver.controlFlow().on('uncaughtException', function (err) {
    console.log('uncaughtException: ' + err);
});

var FLIGHT_MAP = [
    {from: "KIX", toList: ["CTS", "SDJ", "NRT", "MYJ", "FUK", "NGS", "KMI", "KOJ", "OKA"]}
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
    amount: '',
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
        return By.xpath('//div[@id="dialogTo"]/div[@class="dialog_2columns"]/*/ul/li[@id="' + to + '"]/a');
    },
    dayList: By.xpath('//div[@id="calendar-input-departing-on-1"]/*/div[@class="boxMainStripped"]/div[@class="boxMainInner"]/div[@class="boxMainCellsContainer"]/div[@class="dayNormal"]'),
    search: By.name('flyinpeach-booking')
};

var flightInfoPage = {
//    priceTable: By.xpath('//table[@class="TBLYourFlight"]'),
    priceRows: By.xpath('//div[@class="flight_table-body"]/div[@class="flight_table-row"]'),
    priceFlightName: By.xpath('./div[@class="flight_table-cell width_01-o"]/div[@class="plane_ticket-c"]/span'),
    leavedAt: By.xpath('./div[@class="flight_table-cell width_02-o"]/div[@class="plane_ticket-c"]/span[@class="plane_ticket-wrapper left_col-o"]/span'),
//*[@id="js_wrapper"]/div[2]/div[1]/article/div[3]/div/div[1]/div/div[2]/div/span[1]/span/span[1]/text()    
    leavedFromName: By.xpath('//div[@class="flight_table-header"/div[@class="flight_table-row"]/div[@class="flight_table-cell width_02-o"]/div[@class="plane_ticket-c"]/span[@class="plane_ticket-wrapper left_col-o"]/span[@class="plane_ticket-info question-o text_container-o bold_text-o"]/span'),
//    arrivalTo: By.xpath('./td[2]/div/div[@class="FlightdurationDetail Arrivflight"]')
};


var searchDay = moment().add(1, 'days').format("D");

var index = 0;
//while (index < 60) {
//    var searchDay = moment().add(++index, 'days').format("D");
//    console.log(searchDay);
//}


FLIGHT_MAP.forEach(function (flight, index) {
    var from = flight.from;
    var toList = flight.toList;
    toList.forEach(function (to, key) {
        driver.get(topPage.URL).then(function () {
            console.log("zzzz");

            return driver.findElement(topPage.tripOneWay);
        }).then(function (e) {
            console.log("yyyyy");

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
            console.log("aaaa");
            e.click();
        }).then(function () {
            console.log("bbbb");
            return driver.findElement(topPage.leavedFrom(from));
        }).then(function (e) {
            console.log("cccc");
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
                console.log("fff");
                return driver.findElement(topPage.tripTo);
            }).then(function (e) {
                console.log("gggg");
                e.click();
            }).then(function () {
                console.log("hhhh");
                return driver.findElement(topPage.arrivedTo(to));
            }).then(function (e) {
                console.log("iiii");
                e.click();
            }).then(function () {
                console.log("jjjj");
                return driver.findElements(topPage.dayList);
            }).then(function (list) {
                console.log("kkkkk");
                return webdriver.promise.filter(list, function (e) {

                    return e.getText().then(function (text) {
                        return text === searchDay;
                    });
                });
            }).then(function (elem) {
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
                console.log("lllll");

                var priceRowsPromise = driver.findElements(flightInfoPage.priceRows);
                priceRowsPromise.then(function (rows) {
                    console.log("mmmm");

                    var flightInfoList = [];
                    //フライトインフォは後でインスタンス化せねば
                    console.log(rows.length);
                    rows.forEach(function (row, key) {
                        console.log("nnnn");
                        var flightInfo = {};
                        flightInfo.leavedFrom = from;
                        flightInfo.arrivalTo = to;
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
                                    flightInfo.leavedAt = text;
                                });
//                                    flightInfo.leavedFromName = leavedInfo[3];

                            });
//                            row.findElement(flightInfoPage.leavedFromName).then(function (e) {
//                                e.getText().then(function (text) {
//                                    flightInfo.leavedFromName = text;
//                                });
//
//                            });
//                            row.findElement(flightInfoPage.arrivalTo).then(function (e) {
//                                e.getText().then(function (text) {
//                                    var arrivedInfo = [];
//                                    arrivedInfo = text.split('  ');
//                                    flightInfo.arrivalToName = arrivedInfo[3];
//                                    flightInfo.arrivalAt = arrivedInfo[1] + arrivedInfo[2];
//                                });
//                            });
                        }).then(function () {
                            console.log("aaaaa");
                            console.log(flightInfo);
                        });

                    });
                });
            });
        });

    });
});
