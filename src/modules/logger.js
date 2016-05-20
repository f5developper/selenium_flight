/**
 * ログ出力モジュール
 * requireしてください。
 **/

var log4js = require('log4js');
log4js.configure({
    "appenders": [
        {
            "type": "dateFile",
            "category": "system",
            "filename": "./system.log",
            "pattern": "-yyyy-MM-dd"
        },
        {
            "type": "dateFile",
            "category": "debug",
            "filename": "./debug.log",
            "pattern": "-yyyy-MM-dd"
        },
        {
            "type": "dateFile",
            "category": "error",
            "filename": "./error.log",
            "pattern": "-yyyy-MM-dd"
        },
    ],
    "levels": {"system": "DEBUG"}
});


exports.info = function (message) {
    console.log(message);
    log4js.getLogger('system').info(message);
};

exports.debug = function (message) {
    log4js.getLogger('debug').debug(message);
};

exports.error = function (message) {
    log4js.getLogger('system').error(message);
    log4js.getLogger('error').error(message);
};

