/**
 * Created by aessam on 4/13/14.
 */


var allowedItemsElements = {
    "title" : "title", "link" : "link", "description" : "description", "dc:date": "date", "dc:subject" : "category", "dc:language" : "language",
    "dwsyn:contentid":"id"};

var ptype = RDFRSSFeedParser.prototype;
function RDFRSSFeedParser() {
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
RDFRSSFeedParser.validateAndCreate = function (initNode){
    if (initNode.name.toLowerCase() == "rdf:rdf"){
        return new RDFRSSFeedParser();
    }
}


module.exports = RDFRSSFeedParser;