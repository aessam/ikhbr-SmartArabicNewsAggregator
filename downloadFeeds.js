var fs = require("fs");
var async = require('async');
var Utility = require("./Utility");
var iKhbrParser = require("./ParseAndStructurizeFeed");
var db = require("./MongoDBHandler").db;
var crypto = require('crypto');
var fileDownloader = require("./FileDownloadQueue")
var logger = require("./logger");
var prepare = require("./PrepareArticles");

var arabicSourcesFilename = "ArabicSources.json";
var arabicSources =  JSON.parse(fs.readFileSync(arabicSourcesFilename));
var sourceGroups  = {};
var allSources = [];

arabicSources.forEach(function(item){
    var requestInfo = Utility.prepareRequestOptionsForURL(item.feedUrl,"GET");
    requestInfo["owner"] = item;
    if(sourceGroups[requestInfo.host] == undefined){
        sourceGroups[requestInfo.host] = [];
    }
    sourceGroups[requestInfo.host].push(requestInfo);
});

for(groupID in sourceGroups) {
    allSources = allSources.concat(sourceGroups[groupID]);
}

async.forEachLimit(allSources,5,function(requestInfo, groupCallBack) {
    Utility.downloadFeed(requestInfo, function (feedData, feedResponse, err) {
        // in whatever situation you have to work on the next object and that's why we call the callback.
        groupCallBack();

        if(err){
            logger.log("feedDownloadError",err);
        }

        if (feedData != undefined) {
            // keep the returnObject and start working on it.
            var articles = iKhbrParser.parseIncomingContent(feedResponse["headers"]["content-type"], requestInfo.owner, feedData);
            if(articles && articles.length>0){
                for(var item in articles){
                    var article = articles[item];

                    article = Utility.prepareArticleToDB(article,feedResponse["requestInfo"]["owner"]);

                    if(article.media && article.media.length>7 &&  Utility.prepMediaForDownload(article)) {
                        fileDownloader.addImageToDownloadQueue(article.media, "images/" + article.localMedia);
                    }
                    prepare.preProcessEntry(article);
                    db.insertArticlesArray(article);
                }
            }else{
                logger.log( "FeedDownload", {
                    "HTTP Header" : feedResponse["headers"],
                    "DataHash": crypto.createHash('md5').update(feedData).digest('hex')
                });
            }
        }else{
            logger.log("FeedWithZeroLength","No comment");
        }
    },function(err){
        if(!err)
            db.closeDB();
    });
});


process.on('uncaughtException', function(err) {
    logger.log("uncaughtException",err);
});