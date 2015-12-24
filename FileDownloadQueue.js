/**
 * Created by aessam on 7/8/14.
 */
var fs = require('fs');
var request = require('request');
var async = require('async');
var mime = require("mime");
var Logger = require("./logger");


var allImages = []
var downloadCompleted = true;
var completeCallback;
function download(uri, filename, callback){
    if(uri.length>10 && !fs.existsSync(filename)) {
        request.head(uri, function(err, res, body){
			if(err){
				Logger.log("ERROR",{
		            "Filename":filename,
		            "URL": uri,
		            "Data":Date.now()
		        });
			}
            if(res.headers["location"]){
                addImageToDownloadQueue(res.headers["location"], filename);
            }
            if(res.statusCode===200){
                var serverType = res.headers['content-type'].toLowerCase();
                var fileNametype = mime.lookup(filename);
                if(serverType===fileNametype){
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                }else{
                    Logger.log("FileTypeMismatch", {
                        "HTTP Header" : res.headers['content-type'],
                        "Types" : serverType + " " + fileNametype,
                        "URL": uri,
                        "Date":Date.now()
                    });
                }
            }else{
                Logger.log("FileDownloadNotOk",{
                    "Filename":filename,
                    "URL": uri,
                    "Data":Date.now()
                });
            }
            callback();
        });
    }else{
        Logger.log("FileExist",{
            "Filename":filename,
            "URL": uri,
            "Data":Date.now()
        });
        callback();
    }
}

function processQueue(){
    downloadCompleted = false;
    async.forEachLimit(allImages,5,function(imgInfo, imageDownloaded) {
        download(imgInfo.url,imgInfo.path, function(){
            imageDownloaded();
        });
    },function(err){
        if(!err){
            downloadCompleted = true;
            if(completeCallback!==undefined){
                completeCallback();
            }
        }
    });
}

function addImageToDownloadQueue(url, path){
    var startDownload = allImages.length===0;
    allImages.push({url:url,path:path});
    if(startDownload){
        processQueue();
    }
}

function setFinishCallback(clbk){
    completeCallback = clbk;
}

module.exports.addImageToDownloadQueue = addImageToDownloadQueue;
module.exports.setFinishCallback = setFinishCallback;