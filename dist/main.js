"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
var private_1 = require("./private");
var errorMap = {
    52001: '请求超时',
    52002: '系统错误',
    52003: '用户认证失败',
};
exports.translate = function (word) {
    // console.log(md5('1')) // 引入不了，因为没有typescript类型文件,yarn add --dev @types/md5解决类型问题
    var salt = Math.random();
    var sign = md5(private_1.appId + word + salt + private_1.appSecret); // appSecret 一般都是放在服务器
    var from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        // 英->中
        from = 'en';
        to = 'zh';
    }
    else {
        // 中->英
        from = 'zh';
        to = 'en';
    }
    var query = querystring.stringify({
        q: word,
        appid: private_1.appId,
        from: from,
        to: to,
        salt: salt,
        sign: sign
        // ?q=banana&from=en&to=zh&appid=20200426000430230&salt=1435660288&sign=64f66d6aff1391bdd49775fc2824b9e6
    }); // 构造查询字符串
    var options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };
    var request = https.request(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
            // console.log(chunk.constructor) // 用这个方法来判断constructor,也可以删除tsconfig.json
            chunks.push(chunk); // data 就是每次下载得到数据
        });
        response.on('end', function () {
            var string = Buffer.concat(chunks).toString(); // end,就是把每次下载完的数据合起来
            var object = JSON.parse(string);
            if (object.error_code) {
                if (object.error_code in errorMap) {
                    console.error(errorMap[object.error_code] || object.error_msg); // 对象只有3个key,不能把一个未知的字符串放到key里面
                }
                process.exit(2); // 退出当前进程
            }
            else {
                // console.log(object.trans_result[0].dst)
                object.trans_result.map(function (obj) {
                    console.log(obj.dst);
                });
                process.exit(0); // 退出当前进程,0 表示正确
            }
        });
    }); // 通过https.request和百度服务器做交互
    request.on('error', function (e) {
        console.error(e);
    });
    request.end();
};
