/**
 * Created by aessam on 4/15/14.
 */
function changeToEgyptTimeZone(pubDate){
    return pubDate - (2 * 3600000);
}

module.exports.imageFixationTableByProvider = {
    'في الجول' : function(item){
        item.media = '';
    },'جريدة البورصة':function(item){
        item.media = '';
    },             'سكاي نيوز عربي':function(item){
        item.media = item.media.replace("/95/53","/570/318");
    },
    'شبكة محيط':function(item){
        item.media = item.media.replace("www.","");
    },
    'MSN عربي':function(item){
        item.media = '';
    },
    'صوت الأمة':function(item){
        item.media = item.media.replace("/medium/","/large/");
    },
    'أخبار اليوم':function(item){
        item.media = item.media.replace("/small/","/large/");
    },
    'الدستور الأصلي':function(item){
        item.media = item.media.replace("/thumb/","/big/");
    },
    'بي بي سي':function(item){
//        item.media = item.media.replace("wscdn.bbc.co.uk/worldservice/ic/106x60/","");
        item.media = item.media.replace("144x81","304x171");
    },
    'أخبار مصر':function(item){
        item.media = '';
    },
    'الوطن':function(item){

        item.media = item.media.replace("/Small/","/Large/");
        item.media = item.media.replace("<img src='","");
        item.media = item.media.replace("' align='right' />","");
    },
    'CNN عربي':function(item){
        item.media = '';
        item.media_small = '';
    },
    'مصراوى':function(item){
        item.media = item.media.replace("-1-2.","-1-0.");
        item.media = item.media.replace("_s2.",".");
        item.media = item.media.replace("_S2.",".");
    },
    'المصرى اليوم':function(item){
        item.media = item.media.replace("/media_thumbnail/","/highslide_zoom/");
    },
    'التقنية اليوم':function(item){
        item.media = item.media.replace("_S","_L");
    },
    'البوابة العربية للأخبار التقنية':function(item){
        var reg = /-(\d+)x(\d+)/;
        item.media = item.media.replace(reg,'');
    },
    'أردرويد':function(item){
        item.media = item.media.replace("-200x200","");
    },
    'الوفد':function(item){
        item.media = item.media.replace("news_th/th107_","news/")
    },
    'مجلة سيدتي':function(item){
        item.media = item.media.replace("/200x200","/galleryformatter_slide");
    },
    'السينما.كوم':function(item){
        item.media = item.media.replace("_101.","_147.");
    },
    'جريدة الوادي':function(item){
        item.media = item.media.replace("140x90","600x350_node_image");
    }
};