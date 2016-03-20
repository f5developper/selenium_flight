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
    priceTable : By.xpath('//table[@class="TBLYourFlight"]'),
    priceRows : By.xpath('//table[@class="TBLYourFlight"]/tbody/tr[starts-with(@class,"FlightInformation")]'),
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
//        driver.get(topPage.URL).then(function () {
//            return driver.findElement(topPage.tripOneWay);
        driver.get(topPage.URL).then(function(){
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
            }).then(function(){
                driver.wait(until.elementLocated(flightInfoPage.priceTable));
            }).then(function(){
                return driver.findElements(flightInfoPage.priceRows);
            });
            
        });

    });
});
