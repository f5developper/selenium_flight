//**************************************************
//vanilla空港からのデータ取得用selenium
//**************************************************
//準備
var util = require('util');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    flow = webdriver.promise.controlFlow();

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.controlFlow().on('uncaughtException', function(err) {
    console.log('uncaughtException: ' + err);
});


    console.log("serch setting start.");
    //検索画面遷移
    driver.get("http://www.vanilla-air.com/jp/");

    // $("#reservation_point_select input[placeholder='出発地']").attr("data-value","OKA");
    // $("#reservation_point_select input[placeholder='目的地']").attr("data-value","OKA");

　　//xpathがうまく取れない
    driver.findElement("#reservation_point_select input[placeholder='出発地']").type('data-value','OKA');

    // driver.findElement(By.xpath("//div[@id='reservation_point_select']/div/div/ul/li")).click();
    // driver.findElement(By.xpath("//div[@id='reservation_point_select']/div[2]/div/ul/li[2]")).click();
    // driver.findElement(By.xpath("//a[contains(text(),'26')]")).click();
    // driver.findElement(By.xpath("//a[contains(text(),'片道')]")).click();

    driver.findElement(By.xpath("//button[@id='edit-submit-ticket']")).click();
    // var timeoutMSec = 10000;
//    driver.wait(until.elementLocated(By.id('')), timeoutMSec);

    console.log("serch setting end.");
