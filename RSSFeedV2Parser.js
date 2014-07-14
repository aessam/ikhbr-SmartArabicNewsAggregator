/**
 * Created by aessam on 4/13/14.
 */


var allowedItemsElements = {
    "title" : "title", "link" : "link", "a10:author": "author", "media:content": "description",
    "description" : "description", "author" : "author","a10:name" : "author", "category" : "category", "comments" : "comments",
    "enclosure" : "media", "guid" : "id", "pubdate" : "date", "source" : "source", "date" : "date","body":"description",
    "content:encoded": "encoded", "dc:creator":"author", "image" : "media", "dc:identifier" : "id", "id":"id",
    "published":"date", "rights":"rights", "summary":"description", "media:conent":"description","media:thumbnail":"mediaSmall",
    "img" :"media"};

var ptype = RSSFeedV2Parser.prototype;
function RSSFeedV2Parser() {
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

    if(node.name.toLowerCase() == "item"){
        this.lastCreatedItem = {};
        this.tree.push(this.lastCreatedItem);
    }

    if(allowedItemsElements[node.name.toLowerCase()] != undefined){
        this.lastOpenedTag = node.name.toLowerCase();
    }

};
ptype.tagClosed = function(node) {
    if(node.toLowerCase() == "item"){
        if(this.itemCompeletionCallBack){
            this.itemCompeletionCallBack(this.lastCreatedItem);
        }
        this.lastCreatedItem = [];
        this.lastOpenedTag = "";
    }
    if(allowedItemsElements[this.lastOpenedTag] != undefined &&
        this.lastOpenedTag==node.toLowerCase()){
        this.lastOpenedTag = "";
    }
}

ptype.addTextToLastOpenedTag = function(text) {
    if(!this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]])
        this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] = "";
    this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] = this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] + text;
};
RSSFeedV2Parser.validateAndCreate = function (initNode){
    if (initNode.name.toLowerCase() == "rss" && initNode.attributes.VERSION && initNode.attributes.VERSION.toLowerCase() == "2.0"){
        return new RSSFeedV2Parser();
    }
}


module.exports = RSSFeedV2Parser;