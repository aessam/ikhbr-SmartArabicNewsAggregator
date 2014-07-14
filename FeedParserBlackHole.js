
var logger = require("./logger");

var ptype = FeedParserBlackHole.prototype;

function FeedParserBlackHole() {
    this.tree = [];
    this.lastOpenedTag = "";
    this.lastCreatedItem = [];
    this.itemCompeletionCallBack;
}
ptype.setItemCompeletionCallBack = function (clbk){
    this.itemCompeletionCallBack = clbk;
}
ptype.getParsedFeed = function() {
    return this.tree;
};

ptype.getLastCreatedItem = function() {
    return this.lastCreatedItem;
};

ptype.tagOpened = function(node) {

};
ptype.tagClosed = function(node) {

}

ptype.addTextToLastOpenedTag = function(text) {

};
FeedParserBlackHole.validateAndCreate = function (initNode){
    logger.log("ParserError",{"Reason":"unsupported type","initialNode":initNode});
    return new FeedParserBlackHole();
}


module.exports = FeedParserBlackHole;