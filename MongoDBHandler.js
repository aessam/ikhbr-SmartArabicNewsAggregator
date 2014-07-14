// Retrieve
//var MongoDB = require('mongodb');
var config = require('./configuration');
var logger = require("./logger");


var ptype = MonogoDBHandler.prototype;

function MonogoDBHandler(){
    ptype.dbName = config.dbName;
    ptype.dbServer = config.dbServer;
    ptype.dbPort = config.dbPort;
    self = this;
    require('mongodb').MongoClient.connect("mongodb://" + this.dbServer + ":" + this.dbPort + "/" + this.dbName, function(err, db) {
        if(!err) {
            console.log("** DB is connected **");
            self.activeDBLink = db;
            self.newsCollection = db.collection("News");
            self.logsCollection = db.collection("logs");
            self.articlesWords = db.collection("articlesWords");
            if(self.pendingArticlesForInsertion.length>0){
                self.insertArticlesArray(self.pendingArticlesForInsertion);
            }
        }else{
            console.log(err);
        }
    });
    ptype.newsCollection = undefined;
    ptype.pendingArticlesForInsertion = [];
}
ptype.insertArticleWords = function(articleWords){
    if (this.activeDBLink != undefined) {
        this.articlesWords.insert(articleWords,function(err, result) {
            if(err){
                logger.log("WordsCounterDBError",err);
            }
        });
    }
}
ptype.getArticlesForProcessing = function (entryCallback, completeCallback){
    if (this.activeDBLink != undefined && entryCallback != undefined) {
        this.newsCollection.find({processed:false},function(err,res){
            if(err){
                console.log(res);
            }else{
                res.toArray(function(err,res){
                    res.forEach(function(item,index){
                        entryCallback(item);
                    });
                    if(completeCallback!=undefined){
                        completeCallback();
                    }
                });
            }
        });
    }
}
ptype.insertArticlesArray  = function (arrOfArticles) {
    if (this.activeDBLink != undefined) {
        this.newsCollection.insert(arrOfArticles,function(err, result) {
            if(err){
                logger.log("DBError",err);
            }
        });
    }else{
        console.log("we will wait");
        this.pendingArticlesForInsertion = this.pendingArticlesForInsertion.concat(arrOfArticles);
    }
}

//ptype.insertLog = function (log) {
//    if (this.activeDBLink != undefined) {
//        this.logsCollection.insert(log,function(err, result) {
//            if(err)
//                logger.log("DBError",err);
//        });
//    }else{
//        console.log("Log is passed because DB is not ready");
//    }
//}

ptype.closeDB = function (){
    if(self.activeDBLink)
        self.activeDBLink.close();
}
module.exports = MonogoDBHandler;
module.exports.db = new MonogoDBHandler();