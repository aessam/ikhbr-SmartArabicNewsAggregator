/**
 * Created by aessam on 4/11/14.
 */
var Agent = require('agentkeepalive');
var url = require('url');
var fs = require('fs');
var http = require("http");
var logger = require("./logger");
var crypto = require('crypto');

var keepaliveAgent = new Agent({
    maxSockets: 5,
    maxFreeSockets: 5,
    keepAlive: true,
    keepAliveMsecs: 30000 // keepalive for 30 seconds
});

function updateRequestURLandCookies(reqOptions, newURL,newCookies) {
    if(newURL.toLowerCase().indexOf("http://")===-1){
        newURL = "http://" + newURL;
    }
    var sourceURL = url.parse(newURL);
    if(sourceURL.port === undefined) sourceURL.port = 80;

    reqOptions.host = sourceURL.host;
    reqOptions.path = sourceURL.path;
    reqOptions.port = sourceURL.port;

    reqOptions.headers['Cookie'] = newCookies;

    return reqOptions;
}
function prepareRequestOptionsForURL (targetURL,method){
    if(targetURL.toLowerCase().indexOf("http://")===-1){
        targetURL = "http://" + targetURL;
    }
    method = (typeof method !=== 'undefined') ? method : "GET";

    var sourceURL = url.parse(targetURL);
    if(sourceURL.port === undefined) sourceURL.port = 80;
    var options = {
        host: sourceURL.host,
        path: sourceURL.path,
        timeout: 10000  ,
        port: sourceURL.port ,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.69 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
//            'Accept-Encoding': 'gzip,deflate'
        },
        agent: keepaliveAgent,
        method: method
    };
    return options;
}
function convertWindows1256EncodingToUTF8(data) {
    var str = "";
    var Key = [  0x20AC, 0x067E, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
        0x02C6, 0x2030, 0x0679, 0x2039, 0x0152, 0x0686, 0x0698, 0x0688,
        0x06AF, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
        0x06A9, 0x2122, 0x0691, 0x203A, 0x0153, 0x200C, 0x200D, 0x06BA,
        0x00A0, 0x060C, 0x00A2, 0x00A3, 0x00A4, 0x00A5, 0x00A6, 0x00A7,
        0x00A8, 0x00A9, 0x06BE, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x00AF,
        0x00B0, 0x00B1, 0x00B2, 0x00B3, 0x00B4, 0x00B5, 0x00B6, 0x00B7,
        0x00B8, 0x00B9, 0x061B, 0x00BB, 0x00BC, 0x00BD, 0x00BE, 0x061F,
        0x06C1, 0x0621, 0x0622, 0x0623, 0x0624, 0x0625, 0x0626, 0x0627,
        0x0628, 0x0629, 0x062A, 0x062B, 0x062C, 0x062D, 0x062E, 0x062F,
        0x0630, 0x0631, 0x0632, 0x0633, 0x0634, 0x0635, 0x0636, 0x00D7,
        0x0637, 0x0638, 0x0639, 0x063A, 0x0640, 0x0641, 0x0642, 0x0643,
        0x00E0, 0x0644, 0x00E2, 0x0645, 0x0646, 0x0647, 0x0648, 0x00E7,
        0x00E8, 0x00E9, 0x00EA, 0x00EB, 0x0649, 0x064A, 0x00EE, 0x00EF,
        0x064B, 0x064C, 0x064D, 0x064E, 0x00F4, 0x064F, 0x0650, 0x00F7,
        0x0651, 0x00F9, 0x0652, 0x00FB, 0x00FC, 0x200E, 0x200F, 0x00ff ];
    var buff = new Buffer("  ", "UTF-8");
    var buffElse = new Buffer(" ", "UTF-8");
    for (var x = 0; x < data.length; x++) {
        if (data[x] - 0x80 > 0) {
            var char = Key[data[x] - 0x80];
            buff.writeUInt8(0xC0 | (char >> 6), 0);
            buff.writeUInt8(0x80 | (char & 0x3F), 1);
            str = str + buff.toString("UTF-8");
        } else {
            buffElse[0] = data[x];
            str = str + buffElse.toString("UTF-8");
        }
    }
    return str;
}

function downloadFeed(feedOptions,returnCallback){
    var req = http.request(feedOptions,function(response){

        req.socket.on("err",function(err){
            logger.log("SocketError",err);
            returnCallback(null, null,err);
        });

        if(response.headers.location != null){
            var cookie = "", newURL = "";

            if(response.headers['set-cookie'] && response.headers['set-cookie'].length>0){
                cookie = response.headers['set-cookie'][0].split(";")[0]+";";
            }

            if(response.headers.location.toLowerCase().indexOf("http://")===-1) {
                newURL = feedOptions.host + response.headers.location;
            }else {
                newURL = response.headers.location;
            }

            feedOptions = updateRequestURLandCookies(feedOptions, newURL, cookie);
            downloadFeed(feedOptions,returnCallback);

        }else{
            var buffersArray = [];
            response.on('data', function (data) {
                buffersArray.push(data);
            });
            response.on('end', function () {
//                try{
                    var feedData = Buffer.concat(buffersArray);
                    response["requestInfo"] = feedOptions;
                    returnCallback(feedData, response,null); // Call back so the next request start
//                }catch(err) {
//                    logger.log("ResponseError",buffersArray);
//                }
            });
        }
    } );

    req.on('error', function (err) {
        logger.log("RequestError",err);
        returnCallback(null,null,err); // Call back so the next request start
    });

    req.on('socket', function (socket) {
        socket.setTimeout(70000);
        socket.on('timeout', function() {
            req.abort();
            returnCallback(null, null,"[Custom] Error unhandled timeout"); // Call back so the next request start
        });
    });
    req.end();
}

function fixNoneLatenURLEncoding(downloadURL){
    all = "";
    for(var i=0;i<downloadURL.length;i++){
        c = downloadURL.charAt(i);
        if(downloadURL.charCodeAt(i)>255){
            c=encodeURIComponent(c);
        }
        all = all + c;
    }
    return all;
}

function prepMediaForDownload(article){
    if(article.media) {
        article.localMedia = crypto.createHash('md5').update(article.media).digest('hex');
        article.localMedia += article.media.substring(article.media.length-4);

        if(!fs.existsSync("./images/")){
            fs.mkdirSync("./images/");
        }

        return true;
    }
    return false;
}

function prepareArticleToDB(article,owner){
    article["_id"] = crypto.createHash('md5').update(article.link).digest('hex');
    article["categoryID"] = owner["category"];
    article["countryID"] = owner["country"];
    article["processed"] = false;
    return article;
}
module.exports.prepareArticleToDB = prepareArticleToDB;
module.exports.updateRequestURLandCookies = updateRequestURLandCookies;
module.exports.prepareRequestOptionsForURL = prepareRequestOptionsForURL;
module.exports.convertWindows1256EncodingToUTF8 = convertWindows1256EncodingToUTF8;
module.exports.downloadFeed = downloadFeed;
module.exports.fixNoneLatenURLEncoding = fixNoneLatenURLEncoding;
module.exports.prepMediaForDownload = prepMediaForDownload;