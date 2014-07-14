/**
 * Created by aessam on 4/14/14.
 */

var imageFixationTableByProvider = require("./ImageFixationTable").imageFixationTableByProvider;
var dateFixationTableByProvider = require("./DateFixationTable").dateFixationTableByProvider;


function setLargeImageForFeed(item){

     item.media_small = item.media;
     if(item.media_small){
         var imageFixFunction = imageFixationTableByProvider[item.source];

         if(imageFixFunction){
             imageFixFunction(item);
         }else{
             item.media = item.media_small;
         }
     }
}

function FixPubDate(item){

    item.dateString = item.date;
    item.date = new Date(item.date).getTime();

    var dateFixFunction = dateFixationTableByProvider[item.source];

    if(dateFixFunction){
        dateFixFunction(item);
    }
}

module.exports.FixPubDate = FixPubDate;
module.exports.setLargeImageForFeed = setLargeImageForFeed;