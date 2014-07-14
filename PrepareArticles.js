/**
 * Created by aessam on 7/14/14.
 */

var db = require("./MongoDBHandler").db;
var cheerio = require('cheerio');

var allArticlesWordsCount = {};

function cleanUpString(str){
    $ = cheerio.load("<div>" + str + "</div>");
    return $.root().text();
}

function addWordOrIncrement(word,dict){
    if(dict[word])
        dict[word]++;
    else
        dict[word] = 1;
    return dict;
}

function buildWordsDictionary(string,doAddToGlobalDict){
    var allWords = string.split(" ");
    var returnDict = {};
    for(wordIdx in allWords){
        addWordOrIncrement(allWords[wordIdx],returnDict);
        if(doAddToGlobalDict)
            addWordOrIncrement(allWords[wordIdx],allArticlesWordsCount);
    }
    return returnDict;
}
function cleanWithRange(str){
    returnString = "";
    for(charIdx in str){
        if(str.charCodeAt(charIdx)==32 ||
            (str.charCodeAt(charIdx)>= 1569 && str.charCodeAt(charIdx)<=1610) ||
            (str.charCodeAt(charIdx)>= 65 && str.charCodeAt(charIdx)<=90)||
            (str.charCodeAt(charIdx)>= 97 && str.charCodeAt(charIdx)<=122)){
            returnString += str[charIdx]
        }
    }
    return returnString;
}
function preProcessEntry(entry){
    entry.description = cleanUpString(entry.description);
    cleanDescription = cleanWithRange(entry.description);
    entry.words = buildWordsDictionary(cleanDescription,true);
    entry.processed = true;
//    db.insertArticleWords({_id:entry._id, words: articleDict});
    // Update article
}

//function preprocessingComplete (){
//    // Updating Global words Count.
//}
//
//setTimeout(function(){
//    db.getArticlesForProcessing(preProcessEntry,preprocessingComplete);
//},100);

module.exports.preProcessEntry = preProcessEntry;
module.exports.allWordsDictionary = allArticlesWordsCount;