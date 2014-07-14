var Utility = require("./Utility");
var FeedParserCenter = require("./FeedParserCenter");
var DataUtility = require("./DataUtility");
var logger = require("./logger");

module.exports.parseIncomingContent = function (contentType, itemFeedInfo, data){

    if (data.length<1024) return false;
    i=0;
    if(data[0]!=60){
        while(data[i]!=60 && i<data.length){
            i++;
        };
        data = data.slice(i);
    }
    if(contentType.toLowerCase().indexOf("windows-1256")>0){
        data = Utility.convertWindows1256EncodingToUTF8(data);
    }else{
        data = data.toString("UTF8");
    }

    if(contentType.toLowerCase().indexOf("html")>=0 && data.indexOf('<?xml version=')!=0){
//        Shit happens all teh time.
//        console.log("A really fucked up dude, wrote a very bad code that mixes XML with HTML page.");
        return;
    }


    parser = require("sax").createStream(false);
    var parserForData;
    var isFirst = false;
    parser.onerror = function (e) {
        logger.log("ParserError", e);
    }
    parser.ontext = function (text) {
        if(parserForData)
            parserForData.addTextToLastOpenedTag(text);
    }
    parser.onclosetag = function (node) {
        parserForData.tagClosed(node);
    }
    parser.onopentag = function (node) {
        if(!isFirst){
            isFirst = true;
            parserForData = FeedParserCenter.findMatchingParser(node);

            // Post Processing for completely parsed feed item.
            parserForData.setItemCompeletionCallBack(function(item){
                // Adding the needed keys for teh feed item, it will be used for identification purposes
                for(var key in itemFeedInfo){
                    item[key] = itemFeedInfo[key];
                }

                // Fix the date and images
                DataUtility.FixPubDate(item);
                DataUtility.setLargeImageForFeed(item);
            });

        }else{
            parserForData.tagOpened(node);
        }
    }

    parser.oncdata = function (text) {
        parserForData.addTextToLastOpenedTag(text);
    }

    parser.write(data);

    if(parserForData)
        return parserForData.getParsedFeed();

    return [];
}