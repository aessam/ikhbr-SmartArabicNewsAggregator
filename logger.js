/**
 * Created by aessam on 7/11/14.
 */

var fs = require('fs');
var util = require('util');

var sp = "\r\n\r\n------- Log Entry -------\r\n\r\n";

var files = {}
function getFile(type){
    if(!files[type]){
        if(!fs.existsSync("./logs/")){
            fs.mkdirSync("./logs/");
        }
        files[type] = fs.createWriteStream("./logs/" + type + ".txt", {flags: 'a'});
    }
    return files[type];
}
module.exports.log = function(type,obj){
    getFile(type).write(sp);
    getFile(type).write(JSON.stringify(obj));
}
