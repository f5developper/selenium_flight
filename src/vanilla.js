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
        .forBrowser('chrome')
        .build();

console.log("serch setting start.");

var date = require('./date.js');
//空港データ取得

var from = 'NRT';
var to = 'CTS';

var url = "https://www.vanilla-air.com/jp/booking/#/flight-select/?tripType=OW&origin=" + from + "&destination=" + to + "&outboundDate=" + date.nextDay(date.today()) + "&adults=1&children=0&infants=0&promoCode=&mode=searchResultInter";

//検索画面遷移
var planPages = function (driver, By) {

    var flightInfo = require('./flightInfo');

//    driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][1]/dt/span[@class='ng-binding']")).then(function(e){
    driver.findElement(By.xpath("html/body/div[1]/div[2]/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div/div[5]/div/div[2]/dl[2]/dt/span[2]")).then(function (e) {
        flightInfo.flightId = e.getText();
        console.log('flightcd = ' + flightInfo.flightId);
    }).then(function () {
        return driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][1]/dt/span[@class='ng-binding']/span"));
    }).then(function (e) {
        var times = e.getText();
        console.log('times = ' + times);
    }).then(function () {
        return driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][1]/dd[1]//span[@class='pl30 ng-binding']"));
    }).then(function (e) {
        var span1 = e.getText();
        console.log('spn1 = ' + span1);
    }).then(function () {
        return driver.findElement(By.xpath("//dl[@class='flip-in rowroot ng-scope'][1]/dd[2]//span[@class='pl30 ng-binding']"));
    }).then(function (e) {
        var spn2 = e.getText();
        console.log('spn2 = ' + spn2);
    })

    return flightInfo;

};

//検索用の空港データ取得
//全ルート網羅
driver.get(url).then(function () {
    driver.wait(driver.findElement(By.xpath(
            "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div/div[5]/div/div[2]/dl[2]/dt/span[2]/span"
            )
            ), 10000).then(function () {
        driver.sleep(5000);
    }).then(function(){
        
        driver.findElement(By.xpath("/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div/div[5]/div/div[2]/dl[2]/dt/span[2]/span")
                ).then(function(e) {
                    e.getText().then(function(text){
                        console.log(text);
                    })
//        console.log(e.getText());
//        console.log('-------getAttlibute');
//        console.log(e.getAttribute("text"));
//        console.log('end');
//        driver.executeScript('alert("1")');                    
                })
    });
});



