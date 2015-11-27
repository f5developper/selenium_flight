/**
 * ログ出力モジュール
 * requireしてください。
 **/

var log4js = require('log4js');
log4js.configure({
    "appenders": [
        {
            "type":     "dateFile",
            "category": "system",
            "filename": "logs/system.log",
            "pattern":  "-yyyy-MM-dd"
        },
        {
            "type":     "dateFile",
            "category": "debug",
            "filename": "logs/debug.log",
            "pattern":  "-yyyy-MM-dd"
        },
        {
            "type":     "dateFile",
            "category": "error",
            "filename": "logs/error.log",
            "pattern":  "-yyyy-MM-dd"
        },
    ],
    "levels": {"system": "DEBUG"}
});


exports.info = function(message){
  log4js.getLogger('system').info(message);
};

exports.debug = function(message){
  log4js.getLogger('system').debug(message);
  log4js.getLogger('debug').debug(message);
};

exports.error = function(message){
  log4js.getLogger('system').error(message);
  log4js.getLogger('error').error(message);
};

