/**
 * Created by aessam on 4/13/14.
 */

var RSSFeedV2Parser = require("./RSSFeedV2Parser.js");
var ATOMFeedParser = require("./ATOMFeedParser.js");
var FeedParserBlackHole = require("./FeedParserBlackHole.js");
var RDFRSSFeedParser = require("./RDFRSSFeedParser.js");

var listOfParser=[];
function registerParser(parser){
    listOfParser.push(parser);
}
function findMatchingParser(input){
    for(var con in listOfParser){
        var retObject = listOfParser[con].validateAndCreate(input);
        if(retObject)
            return retObject;
    }
}
module.exports.registerParser = registerParser;
module.exports.findMatchingParser = findMatchingParser;

registerParser(RSSFeedV2Parser);
registerParser(ATOMFeedParser);
registerParser(RDFRSSFeedParser);



// Keep this line at the bottom do not ever push it up, this thing is made
// to such the life out of the crash that is caused by none parser found crap
registerParser(FeedParserBlackHole);
