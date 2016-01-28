//**************************************************
// node.js v0.12.7
// npm install selenium-webdriver

// とりあえず、１経路　2015/08/30分だけ取得しますよ。

//**************************************************
//いろいろ準備
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
    logger.info('uncaughtException: ' + err);
});

//ロガー
var logger = require('/moduls/logger');

//mongoDB
var mongo = require('mongoskin');
var moment = require('moment');
var client = mongo.db('mongodb://160.16.95.237:27017/flight');
var collection = client.collection('flight_info');


//**************************************************
//ホーム画面の操作定義関数
var step1 = function() {
    console.log("step1 setting start.");
    logger.info('step1 setting start.');

    //項目の入力を適当に。もう適当。
    driver.findElement(By.id("rdoFlightTypeOneWay")).isSelected().then(function(isSelected){
        if(!isSelected){
            driver.findElement(By.id("rdoFlightTypeOneWay")).click();
        }
    });
    driver.findElement(By.xpath(".//*[@id='dlSection_ddWrapper_0']/div[1]/div/fieldset/div[2]/div[1]/div[1]/span")).click();
    driver.findElement(By.linkText("東京 (成田)")).click();
    driver.findElement(By.linkText("札幌")).click();
    driver.findElement(By.xpath(".//*[@id='txtDepart']")).click();
    driver.findElement(By.xpath(".//*[@id='txtDepart']")).clear();
    driver.findElement(By.xpath(".//*[@id='txtDepart']")).sendKeys("2015/08/30");

    //検索開始も適当に
    driver.findElement(By.id("btnSearchForFlights")).click();

    //ページが切り替わるのを待つ
    //タイトルが Jetstar... に代わるのを待つ。これ止めるは。
    //driver.wait(until.titleIs("Jetstar Airways Cheap Flights, Low Fares all day everyday from the world's best Cheap Fare airline"),10000);

    //Element(何でもいい)がロードされるのを待つ。たくさん待つ。
    var timeoutMSec = 10000;
    driver.wait(until.elementLocated(By.id('ControlGroupSelectView_AvailabilityInputSelectView_RadioButtonMkt1Fare1')), timeoutMSec);

    console.log("step1 done."); //そしてブラウザが動き出す。
    logger.info('step1 done.');
};

//**************************************************
//検索結果画面の操作定義関数
var step2 = function(){
    console.log("step2 setting start.");
    logger.info('step2 setting start.');

    //とりあえず、１日分の結果を探そう。
    var countPath = ".//*[@id='main']/div[6]/div[3]/div[1]/table/tbody/tr/td[1]/strong";
    driver.wait(driver.findElements(By.xpath(countPath)),1000)
    .then(function(item){

        var cnt = 0;
        var dataItem = {};  //この中に結果１件分を格納しますよ

        //件数分繰り返すんです。たぶん。
        for(var i=1; i <= item.length; i++){

            flow.execute(function(){
                cnt++;
                dataItem = {};
            })

            flow.execute(function(){
               //出発時間
                var path = util.format(".//*[@id='main']/div[6]/div[3]/div[1]/table/tbody/tr[%d]/td[1]/strong", cnt);
                driver.findElement(By.xpath(path)).getText()
                .then(function(text){
                    dataItem.Departs = text;
                });

                //到着時間
                var path2 = util.format(".//*[@id='main']/div[6]/div[3]/div[1]/table/tbody/tr[%d]/td[2]/strong", cnt);
                driver.findElement(By.xpath(path2)).getText()
                .then(function(text){
                    dataItem.Arrives = text;
                });

                //お値段
                var path3 = util.format(".//*[@id='main']/div[6]/div[3]/div[1]/table/tbody/tr[%d]/td[4]/div[1]/label", cnt);
                driver.findElement(By.xpath(path3)).getText()
                .then(function(text){
                    dataItem.Price = text;
                });
            });

            //結果を表示（登録？）
            flow.execute(function(){
                console.log(dataItem);
                logger.info(dataItem);

                collection.insert({
                        //便名
                        flightId: "JTS0012",
                        //航空会社CD
                        airlineCompanyCd: "1",
                        //航空会社名称
                        airlineCompanyName: "スカイマーク",
                        //出発空港ID
                        leavedFrom: "NRT",
                        //出発空港
                        leavedFromName: "成田国際空港",
                        //出発時間
                        leavedAt: moment("2015-08-16T13:30:00+09:00").toDate(),
                        //到着空港ID
                        arrivalTo: "KIX",
                        //到着空港
                        arrivalToName: "関西国際空港",
                        //到着時間
                        arrivalAt: moment("2015-08-16T16:30:00+09:00").toDate(),
                        //料金プラン
                        flightPlan:'片道',
                        //空席状況
                        vacancyStatus:'○',
                        //料金
                        amount: 1000,
                        //データ登録時間
                        createdAt: moment("2015-08-16T16:30:00+09:00").toDate()
                    });
            });
        }
    });

　   console.log("step2 done."); //そしてブラウザが動き出す。
     logger.info("step2 done.");
};



//メインフロー
//順に実行するよ。
flow.execute(function(){
    driver.get("http://www.jetstar.com/jp/ja/home").then(
        function(){
            driver.manage().deleteAllCookies();
        });
});
flow.execute(step1);
flow.execute(step2);
flow.execute(function(){
    driver.quit();
    console.log("flow done.")
    logger.info("flow done.");
});

client.close();

//これが最初に表示されるよ。
console.log('done');
logger.info("done");
