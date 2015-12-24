/**
 * Created by aessam on 4/13/14.
 */

//var allowedChannelElements = {"title" : "", "link" : "", "description" : ""};
var allowedItemsElements = {
    "title" : "title", "a10:author": "author", "media:content": "description",
    "description" : "description", "author" : "author","a10:name" : "author", "category" : "category", "comments" : "comments",
    "enclosure" : "media", "guid" : "id", "pubdate" : "date", "source" : "source", "date" : "date","body":"description",
    "content:encoded": "encoding", "dc:creator":"author", "image" : "media", "dc:identifier" : "id", "id":"id",
    "published":"date", "rights":"rights", "summary":"description", "updated":"date"};

var ptype = ATOMFeedParser.prototype;
function ATOMFeedParser() {
    this.tree = [];
    this.lastOpenedTag = "";
    this.lastCreatedItem = [];
    this.itemCompeletionCallBack = undefined;
}
ptype.setItemCompeletionCallBack = function (clbk){
    this.itemCompeletionCallBack = clbk;
}

ptype.getLastCreatedItem = function() {
    return this.lastCreatedItem;
};

ptype.getParsedFeed = function() {
    return this.tree;
};

ptype.tagOpened = function(node) {
    nodeName = node.name.toLowerCase();
    if(nodeName === "media:thumbnail"){
        this.lastCreatedItem["smallMedia"] = node.attributes.URL;
    }
    if(nodeName === "img"){
        this.lastCreatedItem["media"] = node.attributes.SRC;
    }
    if(nodeName === "link"){
        this.lastCreatedItem["link"] = node.attributes.HREF;
    }
    if(nodeName === "entry"){
        this.lastCreatedItem = {};
        this.tree.push(this.lastCreatedItem);
    }

    if(allowedItemsElements[node.name.toLowerCase()] !== undefined){
        this.lastOpenedTag = node.name.toLowerCase();
    }

};
ptype.tagClosed = function(node) {
    if(node.toLowerCase() === "entry"){
        if(this.itemCompeletionCallBack){
            this.itemCompeletionCallBack(this.lastCreatedItem);
        }
        this.lastCreatedItem = {};
        this.lastOpenedTag = "";
    }
    if(allowedItemsElements[this.lastOpenedTag] !== undefined &&
        this.lastOpenedTag==node.toLowerCase()){
        this.lastOpenedTag = "";
    }
}

ptype.addTextToLastOpenedTag = function(text) {

    if(!this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]])
        this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] = "";
    this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] = this.lastCreatedItem[allowedItemsElements[this.lastOpenedTag]] + text;
};
ATOMFeedParser.validateAndCreate = function (initNode){
    if (initNode.name.toLowerCase() === "feed"){
        if(initNode.attributes.XMLNS.toLowerCase().indexOf("atom")>=0)
            return new ATOMFeedParser();
    }
}


module.exports = ATOMFeedParser;