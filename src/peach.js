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

var driver = new webdriver.Builder()
        .forBrowser('firefox')
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
    //なんすかね？
    backGround: By.id('backgroundDialog'),
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
    priceTable: By.xpath('//table[@class="TBLYourFlight"]'),
    priceRows: By.xpath('//table[@class="TBLYourFlight"]/tbody/tr[starts-with(@class,"FlightInformation")]'),
    priceFlightName: By.xpath('./td[1]/div/div/p[@class="demoText"]/a'),
    leavedFrom: By.xpath('./td[2]/div/div[@class="FlightdurationDetail Deptflight"]'),
    arrivalTo: By.xpath('./td[2]/div/div[@class="FlightdurationDetail Arrivflight"]')
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
            driver.wait(until.elementLocated(topPage.tripOneWay));
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
            driver.findElement(topPage.backGround).then(function (e) {
                e.click();
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
                        return text === searchDay;
                    });
                });
            }).then(function (elem) {
                elem[0].click();
            }).then(function () {
                driver.findElement(topPage.search).click();
            }).then(function () {
                //ロード後のすくりぷとが終わるの待つ必要があるんですが、とりあえず
                return driver.sleep(2000);
//                driver.wait(until.elementLocated(flightInfoPage.priceTable));
            }).then(function () {
                var promise = driver.findElements(flightInfoPage.priceRows);
                promise.then(function (rows) {

                    var flightInfoList = [];
                    //フライトインフォは後でインスタンス化せねば

                    rows.forEach(function (row, key) {
                        var flightInfo = {};
                        flightInfo.leavedFrom = from;
                        flightInfo.arrivalTo = to;

                        row.findElement(flightInfoPage.priceFlightName).then(function (e) {
                            e.getText().then(function (text) {
                                flightInfo.flightId = text;
                            });
                        });
                        row.findElement(flightInfoPage.leavedFrom).then(function (e) {
                            e.getText().then(function (text) {
                                var leavedInfo = [];
                                leavedInfo = text.split('  ');
                                flightInfo.leavedFromName = leavedInfo[3];
                                flightInfo.leavedAt = leavedInfo[1] + leavedInfo[2];
                            });

                        });
                        row.findElement(flightInfoPage.arrivalTo).then(function (e) {
                            e.getText().then(function (text) {
                                var arrivedInfo = [];
                                arrivedInfo = text.split('  ');
                                flightInfo.arrivalToName = arrivedInfo[3];
                                flightInfo.arrivalAt = arrivedInfo[1] + arrivedInfo[2];
                            });

                        });
                        //もしかしたら非同期だからはいってないもよう。
                        flightInfoList.push(flightInfo);

                    });

                    console.log(flightInfoList);
                });
            });
        });

    });
});
