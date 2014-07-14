/**
 * Created by aessam on 4/15/14.
 */
var logger = require("./logger");

function changeToEgyptTimeZone (pubDate){
    return pubDate - (2 * 3600000);
}
module.exports.dateFixationTableByProvider = {
    'اليوم السابع': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'أخبار اليوم': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'المصرى اليوم': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'في الجول': function (item) {
        item.date = new Date(Date.parse(item.dateString,'  E , dd NNN  yyyy - HH:mm')).getTime();
        item.date = changeToEgyptTimeZone(item.date);
    },
    'مصراوى': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'يالاكورة': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'إيجي نيوز': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    },
    'جريدة المال': function (item) {
        try{
            if(item.dateString){
                item.dateString = item.dateString.replace('ص','AM')
                item.dateString = item.dateString.replace('م','PM')
                item.date = new Date(Date.parse(item.dateString,'dd/MM/yyyy hh:mm:ss a')).getTime();
                item.date = changeToEgyptTimeZone(item.date);
            }else{
                item.date = Date.now();
            }
        }catch(err){
            logger.log("FixationTable",err);
        }

    },
    'DW Arabic': function (item) {
        item.date = changeToEgyptTimeZone(item.date);
    }
};