var BrowserType = {Usb:0, Dlna:1};
var curBrowserType = BrowserType.Usb;

var SourceType = {Usb:0, Pvr:1, Dmp:2, Dmr:3, SuperShop:4, Pus:5, MultiRoom:6};

var NotifyURI ={
    Cmpb:'/tv/ws/notify/cbrowser_playback',
    Dms:'/tv/ws/notify/dlna_dms',
    Dmr:'/tv/ws/notify/dlna_dmr',
    Usb:'/tv/ws/notify/usb_detect',
    Volume:'/tv/ws/notify/volume_ctrl'
};

var stvapi_config = {
    mmp_play_state:118620164,
    mmp_source_type:118620163
};

var icl_mmp_play_status = {
    off:0,
    on:1,
    photo:2,
    audio:3,
    video:4
};

var icl_mmp_source_type = {
    off:0,
    usb:1,
    dmp:2,
    dmr:3,
    pvr:4,
    multiroom:5
};

var otherColorKeyData = [{"show":false,"name":"Info"},{"show":true,"name":""},{"show":true,"name":""},{"show":true,"name":""},{"show":true,"name":"Help"},{"show":false,"name":"Option"}];
var photoColorKeyData = [{"show":true,"name":"Info"},{"show":true,"name":"Play All"},{"show":true,"name":"Sort"},{"show":true,"name":""},{"show":true,"name":"Help"},{"show":true,"name":"Option"}];
var videoColorKeyData = [{"show":true,"name":"Info"},{"show":true,"name":"Play All"},{"show":true,"name":""},{"show":true,"name":"USB Device"},{"show":true,"name":"Help"},{"show":true,"name":"Option"}];
var musicColorKeyData = [{"show":true,"name":"Info"},{"show":true,"name":"Play All"},{"show":true,"name":"Sort"},{"show":true,"name":"USB Device"},{"show":true,"name":"Help"},{"show":true,"name":"Option"}];
var usbColorKeyData = [{"show":false,"name":"Info"},{"show":true,"name":""},{"show":true,"name":""},{"show":true,"name":"USB Device"},{"show":true,"name":"Help"},{"show":true,"name":"Option"}];
var dlnaColorKeyData = [{"show":false,"name":"Info"},{"show":true,"name":""},{"show":true,"name":""},{"show":true,"name":"Media Server"},{"show":true,"name":"Help"},{"show":true,"name":"Option"}];

var playerColorKeyData = ["Info","Play All","Shuffle On","","Help","Option"];
var photoPlayerColorKeyData = ["Info","Slide Show","Rotate","","Help","Option"];

var DmrKeyList = [KeyEvent.DOM_VK_INFO,KeyEvent.DOM_VK_OPTION, KeyEvent.DOM_VK_RETURN, KeyEvent.DOM_VK_SUBTITLE, KeyEvent.DOM_VK_FAST_FWD, KeyEvent.DOM_VK_REWIND, KeyEvent.DOM_VK_LEFT, KeyEvent.DOM_VK_RIGHT,
                    KeyEvent.DOM_VK_BLUE, KeyEvent.DOM_VK_PLAY, KeyEvent.DOM_VK_PAUSE, KeyEvent.DOM_VK_STOP, KeyEvent.DOM_VK_DOWN, KeyEvent.DOM_VK_UP, KeyEvent.DOM_VK_OK];
var SuperShopKeyList = [];            
                    
var bottomBarKeyList = [KeyEvent.DOM_VK_INFO, KeyEvent.DOM_VK_RED, KeyEvent.DOM_VK_GREEN, KeyEvent.DOM_VK_YELLOW, KeyEvent.DOM_VK_BLUE, KeyEvent.DOM_VK_OPTION];

var color_focus_bg_list = ["../Assets/_Color_Key_Bar/ColorKeyBar_List/focusBar_Colorkey_1280_red.png","../Assets/_Color_Key_Bar/ColorKeyBar_List/focusBar_Colorkey_1280_green.png","../Assets/_Color_Key_Bar/ColorKeyBar_List/focusBar_Colorkey_1280_yellow.png","../Assets/_Color_Key_Bar/ColorKeyBar_List/focusBar_Colorkey_1280_blue.png"];

var SlideshowTime = {
    Short:3000,
    Medium:5000,
    Long:7000
};

var PlayAll = ["Play One", "Play All"];
var SlideShow = ["Slide Show", "Stop Slide Show"];
var Automatic = ["Automatic", "On during mute"];
var Shuffle = {"name":"Shuffle","curValue":0,"value":["Shuffle Off","Shuffle On"],"showValue":[]};
var Repeat = {"name":"Repeat","curValue":0,"value":["Play Once","Repeat"]};
var Subtitles = {"name":"Subtitles","curValue":0,"value":["Subtitles Off","Subtitles On","On during mute"]};
var Slideshow_Time = {"name":"Slideshow Time","curValue":0,"value":["Short","Medium","Long"]};
var Slideshow_Transition = {"name":"Slideshow Transition","curValue":0,"value":["None","Dissolve","Wipe left","Wipe right","Wipe up","Wipe down","Box in","Box out"]};
var Character_set = {"name":"Character set","curValue":0,"value":['Western Europe','Turkish','Central Europe','Cyrillic','Greek','UTF-8(Unicode)']};
var Font_Size = {"name":"Font Size","curValue":1,"value":['Small','Standard','Big']};
var Subtitles_Language = {"name":"Subtitles Language","curValue":0,"storage":0,"value":[]};
var Subtitles_Color = {"name":"Subtitle Color","curValue":0,"value":['White','Blue','Red','Green','Yellow','Black']};
var Subtitles_Display = {"name":"Subtitle Position","curValue":2,"storage":0,"value":['-2','-1','0','1','2']};
var Time_Offset = {"name":"Time sync offset","curValue":5,"storage":0,"value":['-5','-4','-3','-2','-1','0','1','2','3','4','5']};
var Status = {"name":"Status","curValue":0,"value":[]};
var Audio_Language = {"name":"Audio language","storage":0,"curValue":0,"value":[]};
var Subtitle_Setting = {"name":"Subtitle Setting", 'hasSubmenu':true,"storage":-1,"curValue":0, "value":[Font_Size,Subtitles_Color,Subtitles_Display]};

var ALL_OPTION_DATA = {
                "Music":[Shuffle, Repeat],
                "Movie":[Subtitles,Shuffle,Repeat],
                "Photo":[Shuffle,Repeat,Slideshow_Time,Slideshow_Transition],
                "Folder":[Subtitles,Shuffle,Repeat,Slideshow_Time,Slideshow_Transition],
                "Music Player":[Repeat],
                "Movie Player":[Subtitles
                                ,Subtitles_Language
                                ,Audio_Language
                                ,Character_set
                                ,Status
                                ,Repeat
                                ,Subtitle_Setting]
};

var PVR_OPTTION_DATA = [
    Subtitles
    ,Subtitles_Language
    ,Audio_Language
];

var DLNA_OPTTION_DATA = [
    Subtitles
    ,Subtitles_Language
    ,Character_set
    ,Audio_Language
];

if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
   Character_set.value=['Western Europe','UTF-8(Unicode)'];
}

var CLEAR_OFF_DMS = {"name":"Clear offline servers","curValue":0,"value":[]};
                
var ALL_SORT_DATA = {
                "Music":["Artist","Album","Genre","Track"],
                "Photo":["A..Z","Year","Month","Day"],
};

var MUSIC_TRACK_SORT = 'Track';

var MEDIA_TYPE = {
        NULL: 0,
        Photo: 1,
        Music: 2,
        Video: 3,
        Folder: 4,
        PlayList: 5,
        SuperShop: 6
};

var MUSIC_SORT_TYPE = {
        Artist: 3,
        Album: 5,
        Genre: 7,
        Track: 9
    };
    
var PHOTO_SORT_TYPE = {
        'A..Z': 1,
        Year: 6,
        Month: 8,
        Day: 10
    };
    
var VIDEO_SORT_TYPE = 1;
    
var ALL_PAGE_NUM = {
            Music:9,
            Music_List:10,
            Video:6,
            Photo:21    
};

var ALL_PAGE_ROW_NUM = {
            Music:3,
            Video:3,
            Photo:7    
};

var musicDisplayMode = {none:0,fullPlay:1,hidePlay:2,simplePlay:3,minimised:4};

var SuperShopObj = function(){
    this.totalNum;
    this.infoList;
    this.mediatype = MEDIA_TYPE.SuperShop;
    this.focusIndex = 0;
    this.curSourceType = SourceType.SuperShop;
};

SuperShopObj.prototype.init = function (){
    this.totalNum = usbObj.getCbDbCount(this.mediatype);
    this.getOnePageInfo();
};

SuperShopObj.prototype.getOnePageInfo = function(){
    console.log("SuperShopObj getOnePageInfo");
    if(!this.infoList){
        this.infoList = [];
    }
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    var count = (this.totalNum - this.infoList.length > 10) ? 10 : (this.totalNum - this.infoList.length);
    this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, count, this.mediatype, usbObj.USB_PATH));
};

SuperShopObj.prototype.getPlayInfo = function(paramObj){
    var isNext = paramObj.isNext;
    var isRepeat = paramObj.isRepeat;
    console.log("SuperShopObj getPlayInfo isNext = " + isNext+";isRepeat = " + isRepeat);
    ret = null;
    console.log("this.focusIndex = " + this.focusIndex);
    if(typeof(isNext) == 'undefined'){
            ret = this.infoList[this.focusIndex];
    } else {
        if(isNext) {
            tempNum = this.focusIndex+1;
            if(tempNum < this.totalNum){
                if(tempNum >= this.infoList.length){
                    this.getOnePageInfo();
                }
                this.focusIndex++;
                ret = this.infoList[this.focusIndex];
            } else if(isRepeat){
                this.focusIndex = 0;
                ret = this.infoList[0];
            }
        } else {
            if(this.focusIndex > 0){
                this.focusIndex--;
                ret = this.infoList[this.focusIndex];
            }
        }
    }
    return ret;
};
var superShopObj;

var Music_page = function(){
    this.submenuData = [];
    this.allNum;
    this.allInfoData;
    this.allPageListData;
    this.otherString;
    this.needAllOpt = true;
}

Music_page.prototype.init = function(mode){
    this.allNum = usbObj.getCbDbCount(MEDIA_TYPE.Music);
    this.submenuData = [];
    this.otherString = '';
    if(this.allNum > 0){
        if(MUSIC_SORT_TYPE.Track == MUSIC_SORT_TYPE[mode]) {
            this.submenuData = usbObj.getSubmenuStr(MEDIA_TYPE.Music, MUSIC_SORT_TYPE[mode], this.usbPath, this.needAllOpt);
        } else {
            this.submenuData = usbObj.getSubmenuList(MEDIA_TYPE.Music, MUSIC_SORT_TYPE[mode], this.usbPath, this.needAllOpt, this.otherString);
        }
    }
    //this.allInfoData = getContentBrowserData(MEDIA_TYPE.Music, MUSIC_SORT_TYPE[mode]);

};
                
var Music_obj = function() {
    this.usbPath;
    this.totalNum;
    this.sortMode = ALL_SORT_DATA.Music[1];
    this.infoList;
    this.submenuSelectedIdx;
    this.pageIndex;
    this.curFocusIndex;
    this.pageIndicatorNum;
    this.curSourceType = SourceType.Usb;
    this.pageInfo = new Music_page();
};

Music_obj.prototype.setTotalNum = function(num){
    this.totalNum = num;
};

Music_obj.prototype.setSortMode = function(mode){
    this.sortMode = mode;
};

Music_obj.prototype.setInfoList = function(list){
    this.infoList = list;
};

Music_obj.prototype.setSubmenuSelectedIdx = function(index){
    this.submenuSelectedIdx = index;
};

Music_obj.prototype.setPageIndex = function(index){
    this.pageIndex = index;
    this.needRefresh = true;
};

Music_obj.prototype.setPageIndicatorNum = function(num){
    this.pageIndicatorNum = num;
};

Music_obj.prototype.init = function(mode){
    this.usbPath = usbObj.USB_PATH;
    if(mode){
        this.setSortMode(mode);
    }
    this.pageInfo.init(this.sortMode);
    this.initBySubmenu(0);
};

Music_obj.prototype.initBySubmenu = function(index){
    if(this.pageInfo.needAllOpt && index == 0) {
        this.setTotalNum(this.pageInfo.allNum);
    } else {
        this.totalNum = usbObj.getUsbTopListDbCount(MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[index], this.usbPath);
    }
    this.infoList = [];
    this.setSubmenuSelectedIdx(index);
    this.setPageIndex(0);
    if(MUSIC_TRACK_SORT == this.sortMode){
        this.setPageIndicatorNum(Math.ceil(this.totalNum/ALL_PAGE_NUM.Music));
    } else {
        this.setPageIndicatorNum(this.pageInfo.submenuData.length);
    }
    this.getOnePageInfo();
};
Music_obj.prototype.getOnePageInfo = function() {
    console.log("Music_obj getOnePageInfo");
    if(!this.infoList){
        this.infoList = [];
    }
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    var onePageNum = (MUSIC_TRACK_SORT == this.sortMode) ? ALL_PAGE_NUM.Music : ALL_PAGE_NUM.Music_List;
    var count = (this.totalNum - this.infoList.length > onePageNum) ? onePageNum : (this.totalNum - this.infoList.length);
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, count, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.usbPath));
        //this.setInfoList(this.pageInfo.allInfoData);
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, count, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx], this.usbPath));
    }

};
Music_obj.prototype.getContentInfo = function(reqCount){
    console.log("Music_obj getContentInfoByType");
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    if(typeof(reqCount) == 'undefined'){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if(reqCount > (this.totalNum - this.infoList.length)){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, reqCount, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.usbPath));
        //this.setInfoList(this.pageInfo.allInfoData);
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, reqCount, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx], this.usbPath));
    }
};
Music_obj.prototype.getShuffleItemInfo = function(startIndex){
    var ret = null;
    if(typeof(startIndex) == 'undefined'){
        startIndex = getRandom(0, this.totalNum - 1);
    }
    console.log("getShuffleItemInfo startIndex = " + startIndex);
    if(startIndex >= this.infoList.length){
        this.getContentInfo(startIndex - this.infoList.length + 1);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        ret = usbObj.getContentBrowserPageData(startIndex, 1, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.usbPath);
    } else {
         ret = usbObj.getPagetDataBySubmenu(startIndex, 1, MEDIA_TYPE.Music, MUSIC_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx], this.usbPath);
    }
    if(ret){
        return ret[0];
    }  else {
        return null;
    }
};
Music_obj.prototype.getPlayIndex = function () {
    if(MUSIC_TRACK_SORT == this.sortMode){
        return ALL_PAGE_NUM.Music*this.pageIndex+Number(this.curFocusIndex);
    } else {
        return this.curFocusIndex;
    }
};
Music_obj.prototype.getPlayInfo = function(paramObj){
    var isNext = paramObj.isNext;
    var isRepeat = paramObj.isRepeat;
    var isShuffle  = paramObj.isShuffle;
    var isPlayAll = paramObj.isPlayAll;
    console.log("Music_obj getPlayInfo isNext = " + isNext+";isRepeat = " + isRepeat+";isShuffle = " + isShuffle);
    ret = null;
    if(MUSIC_TRACK_SORT == this.sortMode){
        
        var listIndex = ALL_PAGE_NUM.Music*this.pageIndex+Number(this.curFocusIndex);
        console.log("listIndex = " + listIndex);
        if(typeof(isNext) == 'undefined'){
            this.sortIndexArr = [];
            for(var i = 0; i < this.totalNum; i++){
                this.sortIndexArr[i] = i;
            }
            this.sortIndexArr.splice(listIndex, 1);
            ret = this.infoList[listIndex];
        } else if(isShuffle){
            if(isRepeat){
                var startIndex = getRandom(0, this.totalNum - 1);
                ret = this.getShuffleItemInfo(startIndex);
                this.curFocusIndex = startIndex;
            } else {
                if(this.sortIndexArr.length > 0){
                    var startIndex = getRandom(0, this.sortIndexArr.length - 1);
                    ret = this.getShuffleItemInfo(this.sortIndexArr[startIndex]);
                    this.curFocusIndex = this.sortIndexArr[startIndex];
                    this.sortIndexArr.splice(startIndex, 1);
                }
            }
        } else {
        if(isNext) {
            tempNum = listIndex+1;
            console.log("(tempNum < this.totalNum) = " + (tempNum < this.totalNum));
            if(tempNum < this.totalNum){
                if(tempNum >= this.infoList.length){
                    this.getOnePageInfo();
                    this.setPageIndex(this.pageIndex+1);
                    this.curFocusIndex = 0;
                } else {
                    this.curFocusIndex++;
                }
                listIndex = ALL_PAGE_NUM.Music*this.pageIndex+Number(this.curFocusIndex);
                ret = this.infoList[listIndex];
            } else if(repeat){
                this.setPageIndex(0);
                this.curFocusIndex = 0;
                ret = this.infoList[0];
            }
        } else {
            var needGet = false;
            if(this.curFocusIndex <= 0){
                if(this.pageIndex > 0){
                    this.setPageIndex(this.pageIndex-1);
                    this.curFocusIndex = ALL_PAGE_NUM.Music -1;
                    needGet = true;
                } else if(isPlayAll && isRepeat){
                    this.setPageIndex(Math.ceil(this.totalNum/ALL_PAGE_NUM.Music) - 1);
                    if(this.totalNum%ALL_PAGE_NUM.Music){
                        this.curFocusIndex = this.totalNum%ALL_PAGE_NUM.Music - 1;
                    } else {
                        this.curFocusIndex = ALL_PAGE_NUM.Music -1;
                    }
                    needGet = true;
                }
            } else {
                this.curFocusIndex--;
                needGet = true;
            }
            if(needGet){
                listIndex = ALL_PAGE_NUM.Music*this.pageIndex+Number(this.curFocusIndex);
                console.log("false listIndex = " + listIndex);
                if(listIndex >= this.infoList.length){
                    ret = this.getShuffleItemInfo(listIndex);
                } else {
                    ret = this.infoList[listIndex];
                }
            }
        }
        }
    } else {
        var listIndex = this.curFocusIndex;
        console.log("listIndex = " + listIndex);
        if(typeof(isNext) == 'undefined'){
            this.sortIndexArr = [];
            for(var i = 0; i < this.totalNum; i++){
                this.sortIndexArr[i] = i;
            }
            this.sortIndexArr.splice(listIndex, 1);
            ret = this.infoList[listIndex];
        } else if(isShuffle){
            if(isRepeat){
                var startIndex = getRandom(0, this.totalNum - 1);
                ret = this.getShuffleItemInfo(startIndex);
                this.curFocusIndex = startIndex;
            } else {
                if(this.sortIndexArr.length > 0){
                    var startIndex = getRandom(0, this.sortIndexArr.length - 1);
                    ret = this.getShuffleItemInfo(this.sortIndexArr[startIndex]);
                    this.curFocusIndex = this.sortIndexArr[startIndex];
                    this.sortIndexArr.splice(startIndex, 1);
                }
            }
        } else {
        if(isNext) {
            tempNum = listIndex+1;
            if(tempNum < this.totalNum){
                if(tempNum >= this.infoList.length){
                    this.getOnePageInfo();
                }
                this.curFocusIndex++;
                ret = this.infoList[this.curFocusIndex];
            } else if(isRepeat){
                this.curFocusIndex = 0;
                ret = this.infoList[0];
            }
        } else {
            if(this.curFocusIndex > 0){
                this.curFocusIndex--;
                ret = this.infoList[this.curFocusIndex];
            } else if(isPlayAll && isRepeat){
                this.curFocusIndex = this.totalNum - 1;
                if(this.curFocusIndex >= this.infoList.length){
                    ret = this.getShuffleItemInfo(this.curFocusIndex);
                } else {
                    ret = this.infoList[this.curFocusIndex];
                }
            }
            
        }
        }    
    }
    return ret;
};

/*
var Video_page = function(){
    this.submenuData = [];
    this.allNum;
    this.allInfoData;
    this.allPageListData;
}

var Video_obj = function() {
    this.totalNum;
    this.infoList;
    this.pageIndex;
    this.pageIndicatorNum;
    this.submenuSelectedIdx;
    this.pageInfo = new Video_page();
};

Video_obj.prototype.setAllNum = function(num){
    this.allNum = num;
};
Video_obj.prototype.setInfoList = function(list){
    this.infoList = list;
};
Video_obj.prototype.setPageIndex = function(index){
    this.pageIndex = index;
};
Video_obj.prototype.setPageIndicatorNum = function(num){
    this.pageIndicatorNum = num;
};
Video_obj.prototype.setSubmenuSelectedIdx = function(index){
    this.submenuSelectedIdx = index;
};
Video_obj.prototype.init = function(){
    
    this.pageInfo.allPageListData = {};
    this.pageInfo.allInfoData = [];
    var otherInfoData = [];
    var total_num = usbObj.getCbDbCount(MEDIA_TYPE.Video);
    console.log("getUsbScanDbCount total_num " + total_num);
    var i = 0;
    var reg= /^[A-Za-z]+$/;
    var oldChar = "All";
    if(total_num > 0){
        this.pageInfo.submenuData = ["All"];        
    }
    while(i < total_num) {
        var arg = '{"PARAMETER":{"PATH":"'+USB_PATH+'","TYPE":"'+MEDIA_TYPE.Video+'","INDEX":"'+i+'","COUNT":"10","REQUEST":"QUERY"}}';
        console.log('arg = ' + arg);
        res = mtvObj.getUsbContentInfo(arg);
        mtvui_debug_log("the getUsbContentInfo("+i+") return " + res);
        if (!res)
            break;
        ch = JSON.parse(res);
        
        for(var index in ch.ITEMS){            
            var content = ch.ITEMS[index];
            var firstChar = ''+content.MEDIA_PATH.substring(content.MEDIA_PATH.lastIndexOf('/')+1).slice(0,1).toUpperCase();
            console.log("firstChar = " + firstChar);
            if(reg.test(firstChar)){
                console.log("oldChar = "  +oldChar);
                if(!oldChar || firstChar != oldChar){
                    this.pageInfo.submenuData.push(firstChar);
                    oldChar = firstChar;
                }
                if(this.pageInfo.allPageListData.hasOwnProperty(firstChar)){
                    this.pageInfo.allPageListData[firstChar].push(content);
                } else {
                    this.pageInfo.allPageListData[firstChar] = [];
                    this.pageInfo.allPageListData[firstChar].push(content);
                }
            } else {
                otherInfoData.push(content);
            }
            
            this.pageInfo.allInfoData.push(content);
            i++;
        }
            
    };
    
    if(otherInfoData.length > 0){
        this.pageInfo.submenuData.push('Other');
        this.pageInfo.allPageListData['Other'] = otherInfoData;
    }

    this.pageInfo.allNum = total_num;
    this.initBySubmenu(0);
};
Video_obj.prototype.initBySubmenu = function(index){
    if(index == 0) {
        this.infoList = this.pageInfo.allInfoData;
        this.totalNum = this.pageInfo.allNum;
        console.log("initBySubmenu totalNum = " + this.totalNum);
    } else {
        
        console.log("this.submenuData[index] = " + this.pageInfo.submenuData[index]);
        this.infoList = this.pageInfo.allPageListData[this.pageInfo.submenuData[index]];
        this.totalNum = this.infoList.length;
    }
    this.setSubmenuSelectedIdx(index);
    this.setPageIndex(0);
    this.setPageIndicatorNum(Math.ceil(this.totalNum/ALL_PAGE_NUM.Video));
};

Video_obj.prototype.resetData = function(jsonData){
    console.log("submenuData = " +jsonData.pageInfo.submenuData);
    this.pageInfo.submenuData = jsonData.pageInfo.submenuData;
    this.pageInfo.allPageListData = jsonData.pageInfo.allPageListData;
    this.pageInfo.allInfoData = jsonData.pageInfo.allInfoData;
    this.pageInfo.allNum = jsonData.pageInfo.allNum;
    this.infoList = jsonData.infoList;
    this.totalNum = jsonData.totalNum;
    this.pageIndex = jsonData.pageIndex;
    this.pageIndicatorNum = jsonData.pageIndicatorNum;
    this.submenuSelectedIdx = jsonData.submenuSelectedIdx;
};
*/
var Video_page = function(){
    this.submenuData = [];
    this.allNum;
    this.allInfoData;
    this.allPageListData;
}
Video_page.prototype.init = function() {
    this.allNum = usbObj.getCbDbCount(MEDIA_TYPE.Video);
    this.submenuData = [];
    if (this.allNum > 0) {
        this.submenuData = usbObj.getSubmenuStr(MEDIA_TYPE.Video, VIDEO_SORT_TYPE);
    }
    //this.allInfoData = getContentBrowserData(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[mode]);

};
var Video_obj = function() {
    this.totalNum;
    this.infoList;
    this.pageIndex;
    this.pageIndicatorNum;
    this.submenuSelectedIdx;
    this.curFocusIndex;
    this.curSourceType = SourceType.Usb;
    this.pageInfo = new Video_page();
    this.needRefresh = true;
};
Video_obj.prototype.setTotalNum = function(num){
    this.totalNum = num;
};
Video_obj.prototype.setInfoList = function(list){
    this.infoList = list;
};
Video_obj.prototype.setPageIndex = function(index){
    this.pageIndex = index;
    this.needRefresh = true;
};
Video_obj.prototype.setPageIndicatorNum = function(num){
    this.pageIndicatorNum = num;
};
Video_obj.prototype.setSubmenuSelectedIdx = function(index){
    this.submenuSelectedIdx = index;
};
Video_obj.prototype.init = function() {
    this.pageInfo.init();
    this.initBySubmenu(0);
};
Video_obj.prototype.initBySubmenu = function(index) {
    if (this.pageInfo.needAllOpt && index == 0) {
        this.setTotalNum(this.pageInfo.allNum);
    } else {
        this.totalNum = usbObj.getUsbTopListDbCount(MEDIA_TYPE.Video, VIDEO_SORT_TYPE, this.pageInfo.submenuData[index]);
    }
    this.infoList = [];
    this.setSubmenuSelectedIdx(index);
    this.setPageIndex(0);
    this.setPageIndicatorNum(Math.ceil(this.totalNum / ALL_PAGE_NUM.Video));
    this.getOnePageInfo();
};
Video_obj.prototype.getOnePageInfo = function() {
    console.log("Video_obj getOnePageInfo");
    if(!this.infoList){
        this.infoList = [];
    }
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    var count = (this.totalNum - this.infoList.length > ALL_PAGE_NUM.Video) ? ALL_PAGE_NUM.Video : (this.totalNum - this.infoList.length);
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, count, MEDIA_TYPE.Video, VIDEO_SORT_TYPE));
        //this.setInfoList(this.pageInfo.allInfoData);
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, count, MEDIA_TYPE.Video, VIDEO_SORT_TYPE, this.pageInfo.submenuData[this.submenuSelectedIdx]));
    }

};
Video_obj.prototype.getContentInfo = function(reqCount){
    console.log("Music_obj getContentInfoByType");
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    if(typeof(reqCount) == 'undefined'){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if(reqCount > (this.totalNum - this.infoList.length)){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, reqCount, MEDIA_TYPE.Video, VIDEO_SORT_TYPE));
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, reqCount, MEDIA_TYPE.Video, VIDEO_SORT_TYPE, this.pageInfo.submenuData[this.submenuSelectedIdx]));
    }
};
Video_obj.prototype.getShuffleItemInfo = function(startIndex){
    var ret = null;
    if(typeof(startIndex) == 'undefined'){
        startIndex = getRandom(0, this.totalNum - 1);
    }
    console.log("Video_obj getShuffleItemInfo startIndex = " + startIndex);
    if(startIndex >= this.infoList.length){
        this.getContentInfo(startIndex - this.infoList.length + 1);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        ret = usbObj.getContentBrowserPageData(startIndex, 1, MEDIA_TYPE.Video, VIDEO_SORT_TYPE);
    } else {
         ret = usbObj.getPagetDataBySubmenu(startIndex, 1, MEDIA_TYPE.Video, VIDEO_SORT_TYPE, this.pageInfo.submenuData[this.submenuSelectedIdx]);
    }
    if(ret){
        return ret[0];
    }  else {
        return null;
    }
};
Video_obj.prototype.getPlayIndex = function () {
    return ALL_PAGE_NUM.Video*this.pageIndex+Number(this.curFocusIndex);
};
Video_obj.prototype.getPlayInfo = function(paramObj){
    var isNext = paramObj.isNext;
    var isRepeat = paramObj.isRepeat;
    var isShuffle  = paramObj.isShuffle;
    var isPlayAll = paramObj.isPlayAll;
    console.log("Video_obj getPlayInfo isNext = " + isNext+";isRepeat = " + isRepeat+";isShuffle = " + isShuffle);
    ret = null;
    var listIndex = ALL_PAGE_NUM.Video*this.pageIndex+Number(this.curFocusIndex);
    console.log("listIndex = " + listIndex);
    if(typeof(isNext) == 'undefined'){
        //listIndex = ALL_PAGE_NUM.Photo*this.pageIndex+this.curFocusIndex;
        this.sortIndexArr = [];
        for(var i = 0; i < this.totalNum; i++){
            this.sortIndexArr[i] = i;
        }
        ret = this.infoList[listIndex];
        this.sortIndexArr.splice(listIndex, 1);
    } else if(isShuffle){
        if(isRepeat){
            var startIndex = getRandom(0, this.totalNum - 1);
            ret = this.getShuffleItemInfo(startIndex);
            //this.curFocusIndex = startIndex;
            this.setPageIndex(Math.ceil(startIndex/ALL_PAGE_NUM.Video) - 1);
            this.curFocusIndex = startIndex%ALL_PAGE_NUM.Video - 1;
        } else {
            if(this.sortIndexArr.length > 0){
                var startIndex = getRandom(0, this.sortIndexArr.length - 1);
                ret = this.getShuffleItemInfo(this.sortIndexArr[startIndex]);
                //this.curFocusIndex = this.sortIndexArr[startIndex];
                this.setPageIndex(Math.ceil( this.sortIndexArr[startIndex]/ALL_PAGE_NUM.Video) - 1);
                this.curFocusIndex =  this.sortIndexArr[startIndex]%ALL_PAGE_NUM.Video - 1;
                this.sortIndexArr.splice(startIndex, 1);
            }
        }
    } else {
    if(isNext) {
        tempNum = listIndex+1;
        if(tempNum < this.totalNum){
            if(tempNum >= this.infoList.length){
                this.getOnePageInfo();
                this.setPageIndex(this.pageIndex + 1);
                this.curFocusIndex = 0;
            } else {
                this.curFocusIndex++;
            }
            listIndex = ALL_PAGE_NUM.Video*this.pageIndex+Number(this.curFocusIndex);
            ret = this.infoList[listIndex];
        } else if(isRepeat){
            this.setPageIndex(0);
            this.curFocusIndex = 0;
            ret = this.infoList[0];
        }
    } else {
        var needGet = false;
        if(this.curFocusIndex <= 0){
            if(this.pageIndex > 0){
                this.setPageIndex(this.pageIndex-1);
                this.curFocusIndex = ALL_PAGE_NUM.Video - 1;
                needGet = true;
            } else if(isPlayAll && isRepeat){
                this.setPageIndex(Math.ceil(this.totalNum/ALL_PAGE_NUM.Video) - 1);
                if(this.totalNum%ALL_PAGE_NUM.Video){
                    this.curFocusIndex = this.totalNum%ALL_PAGE_NUM.Video - 1;
                } else {
                    this.curFocusIndex = ALL_PAGE_NUM.Video -1;
                }
                needGet = true;
            }
        } else {
            this.curFocusIndex--;
            needGet = true;
        }
        if(needGet){
            listIndex = ALL_PAGE_NUM.Video*this.pageIndex+Number(this.curFocusIndex);
            console.log("false listIndex = " + listIndex);
            if(listIndex >= this.infoList.length){
                ret = this.getShuffleItemInfo(listIndex);
            } else {
                ret = this.infoList[listIndex];
            }
        }
    }
    }
    return ret;
};
Video_obj.prototype.resetData = function(jsonData){
    console.log("submenuData = " +jsonData.pageInfo.submenuData);
    this.pageInfo.submenuData = jsonData.pageInfo.submenuData;
    //this.pageInfo.allPageListData = jsonData.pageInfo.allPageListData;
    //this.pageInfo.allInfoData = jsonData.pageInfo.allInfoData;
    this.pageInfo.allNum = jsonData.pageInfo.allNum;
    this.infoList = jsonData.infoList;
    this.totalNum = jsonData.totalNum;
    this.pageIndex = jsonData.pageIndex;
    this.pageIndicatorNum = jsonData.pageIndicatorNum;
    this.submenuSelectedIdx = jsonData.submenuSelectedIdx;
};

var Photo_page = function() {
    this.submenuData = [];
    this.allNum;
    this.allInfoData;
    this.allPageListData;
};
Photo_page.prototype.init = function(mode) {
    this.allNum = usbObj.getCbDbCount(MEDIA_TYPE.Photo);
    this.submenuData = [];
    if (this.allNum > 0) {
        switch(PHOTO_SORT_TYPE[mode]){
            case PHOTO_SORT_TYPE['A..Z']:
            this.submenuData = usbObj.getSubmenuStr(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[mode]);
            break;
            default:
            this.submenuData = usbObj.getSubmenuList(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[mode]);
            break;
        }
    }
    //this.allInfoData = getContentBrowserData(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[mode]);

};
var Photo_obj = function() {
    this.totalNum;
    this.sortMode = ALL_SORT_DATA.Photo[0];
    this.infoList;
    this.pageIndex;
    this.pageIndicatorNum;
    this.submenuSelectedIdx = 0;
    this.curFocusIndex = 0;
    this.pageInfo = new Photo_page();
    this.needRefresh = true;
};
Photo_obj.prototype.setSubmenuData = function(data) {
    this.submenuData = data;
}
;
Photo_obj.prototype.setTotalNum = function(num) {
    this.totalNum = num;
};
Photo_obj.prototype.setSortMode = function(mode) {
    this.sortMode = mode;
};
Photo_obj.prototype.setInfoList = function(list) {
    this.infoList = list;
};
Photo_obj.prototype.setPageIndex = function(index) {
    this.pageIndex = index;
}
;
Photo_obj.prototype.setPageIndicatorNum = function(num) {
    this.pageIndicatorNum = num;
};
Photo_obj.prototype.setSubmenuSelectedIdx = function(index) {
    this.submenuSelectedIdx = index;
};
Photo_obj.prototype.init = function(mode) {
    if(mode){
        this.setSortMode(mode);
    }
    this.pageInfo.init(this.sortMode);
    this.initBySubmenu(0);
};
Photo_obj.prototype.initBySubmenu = function(index) {
    if (this.pageInfo.needAllOpt && index == 0) {
        //this.setInfoList(this.pageInfo.allInfoData);
        this.setTotalNum(this.pageInfo.allNum);
    } else {
        this.totalNum = usbObj.getUsbTopListDbCount(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[index]);
        //var dataBySubmenu = getDataBySubmenu(MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[index]);
        //this.setInfoList(dataBySubmenu.data);
    }
    this.infoList = [];
    this.setSubmenuSelectedIdx(index);
    this.setPageIndex(0);
    this.setPageIndicatorNum(Math.ceil(this.totalNum / ALL_PAGE_NUM.Photo));
    this.getOnePageInfo();
};
Photo_obj.prototype.getOnePageInfo = function() {
    console.log("getOnePageInfo");
    if(!this.infoList){
        this.infoList = [];
    }
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    var count = (this.totalNum - this.infoList.length > ALL_PAGE_NUM.Photo) ? ALL_PAGE_NUM.Photo : (this.totalNum - this.infoList.length);
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, count, MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode]));
        //this.setInfoList(this.pageInfo.allInfoData);
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, count, MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx]));
    }

};
Photo_obj.prototype.getContentInfo = function(reqCount){
    console.log("Music_obj getContentInfoByType");
    if (this.infoList.length >= this.totalNum) {
        console.log("this.infoList.length >= this.totalNum return");
        return;
    }
    if(typeof(reqCount) == 'undefined'){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if(reqCount > (this.totalNum - this.infoList.length)){
        reqCount = (this.totalNum - this.infoList.length);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        this.infoList = this.infoList.concat(usbObj.getContentBrowserPageData(this.infoList.length, reqCount, MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode]));
    } else {
        this.infoList = this.infoList.concat(usbObj.getPagetDataBySubmenu(this.infoList.length, reqCount, MEDIA_TYPE.Photo, PHOTO_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx]));
    }
};
Photo_obj.prototype.getShuffleItemInfo = function(startIndex){
    var ret = null;
    if(typeof(startIndex) == 'undefined'){
        startIndex = getRandom(0, this.totalNum - 1);
    }
    console.log("Photo_obj getShuffleItemInfo startIndex = " + startIndex);
    if(startIndex >= this.infoList.length){
        this.getContentInfo(startIndex - this.infoList.length + 1);
    }
    if (this.pageInfo.needAllOpt && this.submenuSelectedIdx == 0) {
        ret = usbObj.getContentBrowserPageData(startIndex, 1, MEDIA_TYPE.Photo,  PHOTO_SORT_TYPE[this.sortMode]);
    } else {
         ret = usbObj.getPagetDataBySubmenu(startIndex, 1, MEDIA_TYPE.Photo,  PHOTO_SORT_TYPE[this.sortMode], this.pageInfo.submenuData[this.submenuSelectedIdx]);
    }
    if(ret){
        return ret[0];
    }  else {
        return null;
    }
};
Photo_obj.prototype.getPlayIndex = function () {
    return ALL_PAGE_NUM.Photo*this.pageIndex+Number(this.curFocusIndex);
};
Photo_obj.prototype.getPlayInfo = function(paramObj){
    var isNext = paramObj.isNext;
    var isRepeat = paramObj.isRepeat;
    var isShuffle  = paramObj.isShuffle;
    var isPlayAll = paramObj.isPlayAll;
    console.log("Photo_obj getPlayInfo isNext = " + isNext+";isRepeat = " + isRepeat+";isShuffle = " + isShuffle);
    ret = null;
    var listIndex = ALL_PAGE_NUM.Photo*this.pageIndex+Number(this.curFocusIndex);
    console.log("listIndex = " + listIndex);
    if(typeof(isNext) == 'undefined'){
        this.sortIndexArr = [];
        for(var i = 0; i < this.totalNum; i++){
            this.sortIndexArr[i] = i;
        }
        this.sortIndexArr.splice(listIndex, 1);
        ret = this.infoList[listIndex];
    } else if(isShuffle){
        if(isRepeat){
            var startIndex = getRandom(0, this.totalNum - 1);
            ret = this.getShuffleItemInfo(startIndex);
            //this.curFocusIndex = startIndex;
            this.setPageIndex(Math.ceil(startIndex/ALL_PAGE_NUM.Photo) - 1);
            this.curFocusIndex = startIndex%ALL_PAGE_NUM.Photo - 1;
        } else {
            if(this.sortIndexArr.length > 0){
                var startIndex = getRandom(0, this.sortIndexArr.length - 1);
                ret = this.getShuffleItemInfo(this.sortIndexArr[startIndex]);
                //this.curFocusIndex = this.sortIndexArr[startIndex];
                this.setPageIndex(Math.ceil(this.sortIndexArr[startIndex]/ALL_PAGE_NUM.Photo) - 1);
                this.curFocusIndex = this.sortIndexArr[startIndex]%ALL_PAGE_NUM.Photo - 1;
                this.sortIndexArr.splice(startIndex, 1);
            }
        }
    } else {
    if(isNext) {
        tempNum = listIndex+1;
        if(tempNum < this.totalNum){
            if(tempNum >= this.infoList.length){
                this.getOnePageInfo();
                this.setPageIndex(this.pageIndex+1);
                this.curFocusIndex = 0;
            } else {
                this.curFocusIndex++;
            }
            listIndex = ALL_PAGE_NUM.Photo*this.pageIndex+Number(this.curFocusIndex);
            ret = this.infoList[listIndex];
        } else if(isRepeat){
            this.setPageIndex(0);
            this.curFocusIndex = 0;
            ret = this.infoList[0];
        }
    } else {
        var needGet = false;
        if(this.curFocusIndex <= 0){
            if(this.pageIndex > 0){
                this.setPageIndex(this.pageIndex-1);
                this.curFocusIndex = ALL_PAGE_NUM.Photo - 1;
                needGet = true;
            } else if(isPlayAll && isRepeat){
                this.setPageIndex(Math.ceil(this.totalNum/ALL_PAGE_NUM.Photo) - 1);
                if(this.totalNum%ALL_PAGE_NUM.Photo){
                    this.curFocusIndex = this.totalNum%ALL_PAGE_NUM.Photo - 1;
                } else {
                    this.curFocusIndex = ALL_PAGE_NUM.Photo -1;
                }
                needGet = true;
            }
        } else {
            this.curFocusIndex--;
            needGet = true;
        }
        if(needGet){
            listIndex = ALL_PAGE_NUM.Photo*this.pageIndex+Number(this.curFocusIndex);
            console.log("false listIndex = " + listIndex);
            if(listIndex >= this.infoList.length){
                ret = this.getShuffleItemInfo(listIndex);
            } else {
                ret = this.infoList[listIndex];
            }
        }
    }
    }
    return ret;
};
Photo_obj.prototype.resetData = function(jsonData) {
    this.setSortMode(jsonData.sortMode);
    this.setPageIndicatorNum(jsonData.pageIndicatorNum);
    this.pageInfo.submenuData = jsonData.pageInfo.submenuData;
    //this.pageInfo.allInfoData = jsonData.pageInfo.allInfoData;
    this.pageInfo.allNum = jsonData.pageInfo.allNum;
    this.infoList = jsonData.infoList;
    this.totalNum = jsonData.totalNum;
    this.pageIndex = jsonData.pageIndex;
    this.pageIndicatorNum = jsonData.pageIndicatorNum;
    this.submenuSelectedIdx = jsonData.submenuSelectedIdx;
};


function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');    
    var r = decodeURI(window.location.href.substring(window.location.href.indexOf('?'))).substr(1).match(reg);
    if (r != null )
        return r[2];
    return null ;
}

function goToHelpPage(){
    console.log("goToHelpPage");
    var arg = {"PARAMETER":{"appMode": "EDFU",
                "edfuUrl":"/usr/opera/opera_dir/pages/edfu/index.html",
                "REQUEST":"SET"}};
    mtvObj.startNetTV(JSON.stringify(arg)); 
}

var mtvObj  = new MtvObj();
var UsbObj = function(){
    this.USB_PATH = "";
};

UsbObj.prototype.init = function(path){
    console.log("UsbObj.prototype.init path = " + path);
    var lastStr=path.substring(path.length-1);
    console.log("lastStr = " + lastStr);
    if(lastStr == "/"){
        path = path.substring(0,path.length-1);
    }
    this.USB_PATH = path;
}

UsbObj.prototype.getSubmenuList = function (type, sort, usbPath, needAll, otherString) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    if(needAll){
        ret = ['All'];
    } else {
        ret = [];
    }
    var i;
    var total_num = 0;
    var COUNT = 10;
    var other;
    do {
        i = 0;
        var arg = '{"PARAMETER":{"PATH":"' + usbPath + '","TYPE":"' + type + '","SORT":"' + sort + '","INDEX":"' + total_num + '","COUNT":"' + COUNT + '","REQUEST":"QUERY"}}';
        res = mtvObj.getUsbTopList(arg);
        if (!res)
            break;

        ch = JSON.parse(res);
        
        if(ch.ITEMS.length <= 1 && ch.ITEMS[0].hasOwnProperty('COUNT'))
            break;

        for (var index in ch.ITEMS) {
            var itemMenu;
            switch (type) {
            case MEDIA_TYPE.Music:
                itemMenu = getMusicSubmenuItem(ch.ITEMS[index], sort, otherString);
                break;
            case MEDIA_TYPE.Photo:
                itemMenu = getPhotoSubmenuItem(ch.ITEMS[index], sort);
                break;
            
            }
            if (itemMenu == "") {
                other = "Other";
            } else {
                ret.push(itemMenu);
            }
            i++;
            total_num++;
        }
    } while (i >= COUNT);
    
    if (other) {
        ret.push(other);
    }
    
    return ret;

};

UsbObj.prototype.getSubmenuStr = function(type, sort, usbPath, needAll) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    if(needAll){
        ret = ['All'];
    } else {
        ret = [];
    }
        var arg = '{"PARAMETER":{"PATH":"' + usbPath + '","TYPE":"' + type + '","SORT":"' + sort + '","INDEX":"0","COUNT":"10","REQUEST":"QUERY"}}';
        res = mtvObj.getUsbTopList(arg);
        if (res){
            ch = JSON.parse(res);
            if(ch.ITEMS.length >= 1 && !ch.ITEMS[0].hasOwnProperty('COUNT')){
                var menuArray = ch.ITEMS[0].MEDIA_PATH.split("")
                for (var index in menuArray) {
                    if('#' == menuArray[index]){
                        ret.push('Other');
                    } else {
                        ret.push(menuArray[index]);
                    }
                }
            }
            
        }
        
    return ret;
};

function getMusicSubmenuItem(item, sort, otherString) {
    var itemMenu = "";
    switch (sort) {
    case MUSIC_SORT_TYPE.Artist:
        itemMenu = item.ARTIST;
        break;
    case MUSIC_SORT_TYPE.Album:
        itemMenu = item.ALBUM;
        break;
    case MUSIC_SORT_TYPE.Genre:
        itemMenu = item.GENER;
        break;
    case MUSIC_SORT_TYPE.Track:
        itemMenu = item.TRACK;
        break;
    }
    if($.trim(itemMenu) == ""){
        itemMenu = "";
        if(otherString.length > 0){
            otherString = ALL_SORT_DATA.Music[sort] + '\'' + itemMenu + '\'';
        } else {
            otherString = "or" + ALL_SORT_DATA.Music[sort] + '\'' + itemMenu + '\'';
        }
    }
    return itemMenu;
}

function getPhotoSubmenuItem(item, sort) {
    var itemMenu = "";
    switch (sort) {
    case PHOTO_SORT_TYPE.Year:
        itemMenu = item.DATE.YEAR;
        break;
    case PHOTO_SORT_TYPE.Month:
        itemMenu = item.DATE.YEAR+'/'+item.DATE.MONTH;
        break;
    case PHOTO_SORT_TYPE.Day:
        itemMenu = item.DATE.YEAR+'/'+item.DATE.MONTH+'/'+item.DATE.DAY;
        break;
    }
    return itemMenu;
}

UsbObj.prototype.getDataBySubmenu = function(type,sort,reserved, usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    console.log("type = " + type+";sort = " + sort+";reserved = " + reserved);
    if(reserved == "Other"){
        reserved =     getOtherReserved(type, sort);
    }
    ret = [];
    var i;
    var total_num = 0;
    var COUNT = 10;
    do{
        i = 0;
        var paramObj = {'PATH':usbPath,'TYPE':type,'SORT':sort,'INDEX':total_num,'COUNT':COUNT,'RESERVED':""+reserved,'REQUEST':'QUERY'};
        var arg = {};
        arg.PARAMETER = paramObj;
        //var arg = '{"PARAMETER":{"PATH":"'+this.USB_PATH+'","TYPE":"'+type+'","SORT":"'+sort+'","INDEX":"'+total_num+'","COUNT":"'+COUNT+'","RESERVED":"'+reserved+'","REQUEST":"QUERY"}}';
        res = mtvObj.getUsbRec(JSON.stringify(arg));
        if (!res)
            break;
        ch = JSON.parse(res);
        for(var index in ch.ITEMS){
            ret.push(ch.ITEMS[index]);
            i++;
            total_num++;
        }
    }while(i>=COUNT);
    
    var request = {};
    request.num = total_num;
    request.data = ret;

    return request;
};

UsbObj.prototype.getPagetDataBySubmenu = function(startIndex, totalCount, type, sort, reserved, usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    console.log("startIndex = " + startIndex + ";count= " + totalCount + ";type = " + type + ";sort = " + sort + ";reserved = " + reserved);
    if(reserved == "Other"){
        reserved =     getOtherReserved(type, sort);
    }
    ret = [];

    var total_num = 0;
    var i = 0;
    var count = 0;
    while(total_num < totalCount && i >= count){
        console.log("getPagetDataBySubmenu total_num " + total_num);
        i = 0
        count = (totalCount - total_num >= 10) ? 10 : (totalCount - total_num);
        var paramObj = {'PATH':usbPath,'TYPE':type,'SORT':sort,'INDEX':startIndex,'COUNT':count,'RESERVED':""+reserved,'REQUEST':'QUERY'};
        var arg = {};
        arg.PARAMETER = paramObj;
        //var arg = '{"PARAMETER":{"PATH":"' + this.USB_PATH + '","TYPE":"' + type + '","SORT":"' + sort + '","INDEX":"' + startIndex + '","COUNT":"' + count + '","RESERVED":"' + reserved + '","REQUEST":"QUERY"}}';
        console.log("arg = " + JSON.stringify(arg));
        res = mtvObj.getUsbRec(JSON.stringify(arg));
        if (!res)
            break;
        ch = JSON.parse(res);
        for(var index in ch.ITEMS){
            ret.push(ch.ITEMS[index]);
            i++;
            total_num++;
        }

    };

    return ret;
};

UsbObj.prototype.getUsbTopListDbCount = function(type,sort,reserved){
    if(reserved == "Other"){
        reserved =     getOtherReserved(type, sort);
    }
    var ret = 0;
    var paramObj = {'SORT':sort,'TYPE':type,'RESERVED':""+reserved,'REQUEST':'QUERY'};
    var arg = {};
    arg.PARAMETER = paramObj;
    //var arg = '{"PARAMETER":{"TYPE":"'+type+'","SORT":"'+sort+'","RESERVED":"'+reserved+'","REQUEST":"QUERY"}}';
    res = mtvObj.getUsbTopListDbCount(JSON.stringify(arg));
    if(res){
        var countInfo = JSON.parse(res);
        ret = parseInt(countInfo.ITEMS[0].COUNT);
    }
    return ret;
};

function getOtherReserved(type, sort){
    var other = "";
    switch(type){
        case MEDIA_TYPE.Music:
        if(MUSIC_SORT_TYPE.Track == sort){
            other = "#";
        } else {
            other = "";
        }
        break;
        case MEDIA_TYPE.Photo:
        if(PHOTO_SORT_TYPE['A..Z'] == sort){
            other = "#";
        } else {
            other = "";
        }
        break;
        case MEDIA_TYPE.Video:
        other = "#";
        break;
    }
    return other;
}

UsbObj.prototype.getCbDbCount = function(mediaType, path){
    if(typeof(path) == 'undefined'){
        path = this.USB_PATH;
    }
    var ret = 0;
    var paramObj = {'PATH':path,'TYPE':mediaType,'REQUEST':'QUERY'};
    var arg = {};
    arg.PARAMETER = paramObj;
    //var arg = '{"PARAMETER":{"PATH":"'+path+'","TYPE":"'+mediaType+'","REQUEST":"QUERY"}}';
    res = mtvObj.getUsbScanDbCount(JSON.stringify(arg));
    if(res){
        var countInfo = JSON.parse(res);
        ret = parseInt(countInfo.ITEMS[0].COUNT);
    }
    return ret;
};

UsbObj.prototype.getContentBrowserPageData = function(startIndex, totalCount, mediaType, sortTypeOrPath, usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    console.log("startIndex = " + startIndex +";mediaType = " + mediaType +";sortTypeOrPath = " + sortTypeOrPath);
    var path;
    var sortType;
    if(MEDIA_TYPE.Folder <= mediaType) {
        path = sortTypeOrPath;
    } else {
        sortType = sortTypeOrPath;
        mtvObj.setContentSortType(mediaType, sortType);
        path = usbPath;
    }

    var ret = [];
    var total_num = 0;
    var i = 0;
    var count = 0;
    while(total_num < totalCount ){
        i = 0;
        count = (totalCount - total_num >= 10) ? 10 : (totalCount - total_num);
        var paramObj = {'PATH':path,'TYPE':mediaType,'INDEX':(startIndex+total_num),'COUNT':count,'REQUEST':'QUERY'};
        var arg = {};
        arg.PARAMETER = paramObj;
        //var arg = '{"PARAMETER":{"PATH":"' + path + '","TYPE":"'+ mediaType + '","INDEX":"' + (startIndex+total_num) + '","COUNT":"'+count+'","REQUEST":"QUERY"}}';
        console.log("arg = " + JSON.stringify(arg));
        res = mtvObj.getUsbContentInfo(JSON.stringify(arg));
        if (!res)
            break;
        ch = JSON.parse(res);
        for(var index in ch.ITEMS){
            ret.push(ch.ITEMS[index]);
            i++;
            total_num++;
        }

    };

    return ret;
};

UsbObj.prototype.getFolderPageData = function(startIndex, totalCount, sortTypeOrPath, allMediaData){
    console.log("startIndex = " + startIndex +";sortTypeOrPath = " + sortTypeOrPath);
    var ret = [];
    var total_num = 0;
    var i = 0;
    var count = 0;
    while(total_num < totalCount && i >= count){
        i = 0;
        count = (totalCount - total_num >= 10) ? 10 : (totalCount - total_num);
        var paramObj = {'PATH':sortTypeOrPath,'TYPE':4,'INDEX':(startIndex+total_num),'COUNT':count,'REQUEST':'QUERY'};
        var arg = {};
        arg.PARAMETER = paramObj;
        //var arg = '{"PARAMETER":{"PATH":"' + path + '","TYPE":"'+ mediaType + '","INDEX":"' + (startIndex+total_num) + '","COUNT":"'+count+'","REQUEST":"QUERY"}}';
        console.log("arg = " + JSON.stringify(arg));
        res = mtvObj.getUsbContentInfo(JSON.stringify(arg));
        if (!res)
            break;
        ch = JSON.parse(res);
        for(var index in ch.ITEMS){
            var item = ch.ITEMS[index];
            item.MEDIA_INDEX = startIndex+total_num;
            ret.push(item);
            switch(item.MEDIA_TYPE){
                case 1:
                case 2:
                case 3:
                if(!allMediaData[item.MEDIA_TYPE]){
                    allMediaData[item.MEDIA_TYPE] = [];
                    item.PLAY_INDEX = 0;
                }  else {
                    item.PLAY_INDEX = allMediaData[item.MEDIA_TYPE].length;
                }
                
                allMediaData[item.MEDIA_TYPE].push(item);
                break;
            }
            i++;
            total_num++;
        }

    };

    return ret;
};

UsbObj.prototype.getContentInfoByPath = function(type, filePath, usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    var ret = null;
    var paramObj = {'PATH':usbPath,'TYPE':type,'RESERVED':filePath,'REQUEST':'QUERY'};
    var arg = {};
    arg.PARAMETER = paramObj;
    //var arg = '{"PARAMETER":{"PATH":"'+this.USB_PATH+'","TYPE":"'+type+'","RESERVED":"'+filePath+'","REQUEST":"QUERY"}}';
    var res = mtvObj.getUsbContentInfoByPath(JSON.stringify(arg));
    if(res){
        res = JSON.parse(res);
        ret = res.ITEMS[0];
    }
    return ret;
};

UsbObj.prototype.usbScanStatus = function (usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    var ret = -1;
    res = mtvObj.getUsbScanStatus('{"PARAMETER":{"PATH":"'+usbPath+'","REQUEST":"QUERY"}}');
    if(res){
        var countInfo = JSON.parse(res);
        ret = parseInt(countInfo.STATUS);
    }
    return ret;
};

UsbObj.prototype.startUsbScan = function (usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    return mtvObj.startUsbScan(usbPath);
};

UsbObj.prototype.importDatabase = function (usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    return mtvObj.importDatabase(usbPath);
};

UsbObj.prototype.deleteDatabase = function (usbPath) {
    console.log("deleteDatabase usbPath = " + usbPath);
    var lastStr=usbPath.substring(usbPath.length-1);
    console.log("lastStr = " + lastStr);
    if(lastStr == "/"){
        usbPath = usbPath.substring(0,usbPath.length-1);
    }
    return mtvObj.deleteDatabase(usbPath);
};

UsbObj.prototype.getUsbMountList = function () {
    var ret = [];
    var res = mtvObj.getMountPointList('');
    if(res){
        res = JSON.parse(res);
        for(index in res.ITEMS){
            ret.push(res.ITEMS[index]);
        }
    }
    return ret;
};

UsbObj.prototype.getMountPointDevDesc = function (devName) {
    var arg = '{"PARAMETER":{"VALUE":"'+devName+'","REQUEST":"QUERY"}}';
    var res = mtvObj.getMountPointDevDesc(arg);
    if(res){

    }
    return null;
};

UsbObj.prototype.getJumpSuperShopDemo = function (usbPath) {
    if(typeof(usbPath) == 'undefined'){
        usbPath = this.USB_PATH;
    }
    var ret = 0;
    var arg = '{"PARAMETER":{"path":"'+usbPath+'","REQUEST":"QUERY"}}';
    var res = mtvObj.getJumpSuperShopDemo(arg);
    if(res){
        res = JSON.parse(res);
        ret = res.ITEMS[0].TYPE;
    }
    return ret;
};
UsbObj.prototype.getUsbProductInfo = function(dev){
    if(dev){
        var arg = '{"PARAMETER":{"VALUE":"'+dev+'","REQUEST":"QUERY"}}';
        return  mtvObj.getMountPointDevDesc(arg);
    }
    console.log("UsbObj.prototype.getUsbProductInfo dev is empty [ "+dev+"]")

}
var usbObj = new UsbObj();

var EventListenerName = {
    cmpbNotify:'CBCmpbNotify',
    dmsNotify:'DlnaDmsNotify',
    dmrNotify:'DlnaDmrNotify',
    usbDetectNotify:'UsbDetectNotify',
    networkNotify:'NetworkNotify',
    volumeNotify:'VolumeNotify',
    pusNotify:'PusNotify'
}

function addCBEventListener(name, notifyFunc){
    if(name && notifyFunc){
        mtvObj.addMmpEventListener(name, notifyFunc);
    }
};

function removeCBEventListener(name, notifyFunc){
    if(name && notifyFunc){
        mtvObj.removeMmpEventListener(name, notifyFunc);
    }
};

function addTvServerListener(name, notifyFunc){
    if(name && notifyFunc){
        mtvObj.addTvServerListener(name, notifyFunc);
    }
}

function removeTvServerListener(name, notifyFunc){
    if(name && notifyFunc){
        mtvObj.removeTvServerListener(name, notifyFunc);
    }
}

var usbMountList = [];
var curUsbPathInfo = null;

function setCurUsbPathInfo(usbInfo, scanNotifyFunc){
    console.log("setCurUsbPathInfo");
    if(!curUsbPathInfo || curUsbPathInfo.PATH != usbInfo.PATH){
        curUsbPathInfo = usbInfo;
        usbObj.init(curUsbPathInfo.PATH);
        var importRet = usbObj.importDatabase();
        console.log("importRet = "+importRet);
        if (importRet != 0) {
            waitUsbScan();
            return;
        }
    }
}

function addOrUpdateUsbPath(usbInfo){
    console.log("addOrUpdateUsbPath usbInfo = " + JSON.stringify(usbInfo));
    for(usbPathIndex in usbMountList){
        if(usbMountList[usbPathIndex].PATH == usbInfo.PATH){
            console.log("usbMountList[usbPathIndex].PATH == usbInfo.PATH");
            usbMountList[usbPathIndex] = usbInfo;
            return;
        }
    }
    usbObj.deleteDatabase(usbInfo.PATH);
    if(usbMountList.length <= 0){
        usbMountList.push(usbInfo);
        contentBrowserObj.refreshCbUi(1);
    } else {
        usbMountList.push(usbInfo);
        refreshRootList();
    }
    console.log("usbMountList = " +JSON.stringify(usbMountList));
}

function removeUsbPath(usbInfo){
    var needRemove = false;
    for(usbPathIndex in usbMountList){
        if(usbMountList[usbPathIndex].PATH == usbInfo.PATH){
            needRemove = true;
            break;
        }
    }
    console.log("usbPathIndex = " + usbPathIndex + ";needRemove = "+ needRemove);
    if(needRemove){
        usbMountList.splice(usbPathIndex, 1);
        musicPlayObj.plugoutUsb(usbInfo.PATH);
        if(curUsbPathInfo.PATH == usbInfo.PATH){
            //TODO:
            console.log("history.go(-1)");
            if(usbMountList.length <= 0){
                if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
                    contentBrowserObj.stopPlay();
                    contentBrowserObj.refreshCbUi(2);
                } else {
                    mtvuiUtil.gotoSysPage("sys_index");
                }               
            } else {
                contentBrowserObj.stopPlay();
                if(top_menu_item_focus != 'top_menu_3'){
                    var temp = top_menu_selected_id;
                    initPage('top_menu_3');
                    if(temp){
                        top_menu_item_focus(false, temp);
                    }   
                } else {
                    initFile();
                }
            }  
        } else {
            musicPlayObj.plugoutUsb(usbInfo.PATH);
            refreshRootList();
        }
    }
    console.log("usbMountList = " +JSON.stringify(usbMountList));
}

function waitUsbScan(scanDonFunc) {
    console.log("waitUsbScan");
    usbObj.startUsbScan();
    usbScanStatus = usbObj.usbScanStatus();
    console.log("usbScanStatus = " + usbScanStatus);
    if (usbScanStatus == 0) {
        if(scanDonFunc)
            scanDonFunc(true);
    } else {
        if(scanDonFunc)
            scanDonFunc(false);
    }

}

function usbDetect(){
    usbDetectNotifyFunc = usbDetectItemNotifyFunc;
    usbMountList = usbObj.getUsbMountList();
    console.log("usbMountList = " + JSON.stringify(usbMountList));
    if(usbMountList.length <= 0){
        return false;
    }
    return true;
}

var USB_DETECT_NOTIFY_TYPE = {
    Plugin:0,
    Plugout:1,
    ScanDone:1000
}

function usbDetectItemNotifyFunc(usbItem){
    console.log("usbDetectItemNotifyFunc");
    switch(Number(usbItem.TYPE)){
        case USB_DETECT_NOTIFY_TYPE.Plugin:
        addOrUpdateUsbPath(usbItem);
        contentBrowserObj.usbAddDetect();
        break;
        case USB_DETECT_NOTIFY_TYPE.Plugout:
        removeUsbPath(usbItem);
        break;
        case USB_DETECT_NOTIFY_TYPE.ScanDone:
        contentBrowserObj.updateData();
        break;
    }
}

function superShopUsbDetectNotifyFunc(usbItem){
    console.log("superShopUsbDetectNotifyFunc");
    switch(Number(usbItem.TYPE)){
        case USB_DETECT_NOTIFY_TYPE.Plugin:
            var path = usbItem.PATH;
            var lastStr=path.substring(path.length-1);
            if(lastStr == "/"){
                path = path.substring(0,path.length-1);
            }
            var param = "action=usb_mount&path="+path;
            mtvuiUtil.gotoSysPage("sys_content_browser", param);
        break;
        case USB_DETECT_NOTIFY_TYPE.Plugout:
        if(usbItem.PATH.indexOf(usbObj.USB_PATH) == 0){
            mtvuiUtil.gotoSysPage("sys_index");
        }
        break;
    }
}

function playbackInitWithPath(paramObj) {
    console.log("paramObj = " + JSON.stringify(paramObj));
    if (typeof (paramObj.bMode) == 'undefined' || !paramObj.bMode) {
        paramObj.bMode = 1;
    }
    if (typeof (paramObj.info) == 'undefined' || !paramObj.info) {
        paramObj.info = '';
    }
    if (typeof (paramObj.oMode) == 'undefined' || !paramObj.oMode) {
        paramObj.oMode = 2;
    }
    if (typeof (paramObj.protocal) == 'undefined' || !paramObj.protocal) {
        paramObj.protocal = '';
    }
    if (typeof (paramObj.REQUEST) == 'undefined' || !paramObj.REQUEST) {
        paramObj.REQUEST = 'QUERY';
    }
    paramObj.pvTag = parseInt(Math.random()*(0xffff)+1);
    var arg = {};
    arg.PARAMETER = paramObj;
    //var arg = '{"PARAMETER":{"bMode":' + bufferingModel + ',"oMode":2,"profile":"","info":'+playbackDevId+',"protocal":"","mediaPath":"' + path + '","REQUEST":"QUERY"}}';
    console.log("playbackInitWithPath arg = " + JSON.stringify(arg));
    var res = mtvObj.playbackInitWithPath(JSON.stringify(arg));
    if (res) {
        ch = JSON.parse(res);
        return {STATUS:ch.STATUS,HANDLE:ch.ITEMS[0].handle,PVTAG:ch.ITEMS[0].pvTag};
    }
    return null;

};

function playbackDeinit(handle) {
    if (typeof (handle) != 'undefined' && handle) {
        var arg = '{"PARAMETER":{"handle":' + handle + ',"REQUEST":"SET"}}';
        console.log("playbackDeinit arg = " + arg);
        mtvObj.playbackDeinit(arg);
    }
}

var PlaybackErrorType = {
    error_unknown:100,
    audio_unplayable:101,
    audio_codec_not_support:102,
    video_unplayable:103,
    video_codec_not_support:104,
    resolution_not_support:105,
    drm_not_support:106,
    hd_not_support:107,
    no_audio_video_svc:108,
    file_not_support:109,
    media_lost:110,
    license_expired:111
};

var PlaybackErrorInfo = {
    '100':'Error unknown',
    '101':'Audio unplayable',
    '102':'NFY_AUDIO_NOT_SUP',//'Audio format not supported',
    '103':'Video unplayable',
    '104':'WFD_VIEW_MSG_VIDEO_NOT_SUPPORTED',//'Video format not supported',
    '105':'QT_MEDIA_RESOLUTION_UNSUPPORT',//'Resolution not supported',
    '106':'QT_DRM_NOT_SUPPORT',//'Drm not supported',
    '107':'HD not supported',
    '108':'NFY_AV_NOT_SUP',//'No audio video svc',
    '109':'NFY_PHOTO',//'File not supported',
    '110':'Media lost',
    '111':'License expired'
};

var MmpEventType = {
    unknown:0,
    total_time_update:1,
    icur_time_update:2,
    icur_pos_update:3,
    buffer_underflow:4,
    buffer_high:5,
    buffer_low:6,
    playback_error:7,
    eos:8,
    ceof:9,
    play_done:10,
    step_done:11,
    timeseek_done:12,
    get_buf_ready:13,
    replay:14,
    speed_update:15,
    video_num_ready:16,
    mp3cover_ready:17,
    mp3cover_eeror:18,
    thumbnail_ready:19,
    thumbnail_error:20,
    rating_blocked:21,
    channel_blocked:22,
    prepare_done:23,
    pvr_tricj_reach_valid_end:24
};

var playbackCommand = {
    play:'Play',
    pause:'Pause',
    stop:'Stop',
    ff:'FF',
    fr:'FR',
    sf:'SF',
    sr:'SR',
    step:'Step',
    seekTime:'timeSeek',
    seekByte:'byteSeek',
    getMediaInfo:'getmediainfo',
    repeat:'repeat',
    getSubinfo:'getsubinfo',
    getCurPos:'getcurpos',
    getSpeed:'getspeed',
    getZoomStatus:'getzoomstatus',
    getPlayType:'getplaytype',
    getAudInfo:'getaudinfo',
    getMetaData:'getmetadata',
    getThumbnailAsync:'getthumbnailasync',
    getMp3CoverAsync:'getmp3coverasync',
    getThumbnailData:'getthumbnaildata',
    getStopInfo:'getstopinfo',
    setStopInfo:'setstopinfo',
    setSpeed:'SetSpeed',
    selectSub:'selectsub',
    selectAud:'selectaud',
    setStopSub:'setstopsub',
    setSubEnc:'setsubenc',
    setSubDisplayRect:'setsubdisplayrect',
    setDisplayRect:'setdisplayrect',
    setSubFontSize:'setsubfontsize',
    setSubtxtColor:'setsubtxtcolor',
    setSubTimeOffset:'setsubtimeoffset',
    setSubEdgColor:'setsubedgcolor',
    setSubBkgColor:'setsubbkgcolor',
    setZoom:'setzoom',
    selectcc:'selectcc',
    setSubEdgWidth:'setsubedgwidth',
    setUnlockRating:'setunlockrating',
    getRatingInfo:'getRatingInfo'
};

var VideoSubCharacter = {
    'Central Europe':'codepage1250',
    Cyrillic:'codepage1251',
    'Western Europe':'codepage1252',
    Greek:'codepage1253',
    Turkish:'iso8859_9',
    'UTF-8(Unicode)':'utf8'
    
};

var VideoSubDisplayRect = {
    '-2':['0','100'],
    '-1':['0','75'],
    '0':['0','50'],
    '1':['0','25'],
    '2':['0','0']
}

var VideoSubFontSize = {
    Small:'30',
    Standard:'40',
    Big:'50'
};

var VideoSubTextColor = {
    White:['255','255','255','255'],
    Blue:['255','0','0','255'],
    Red:['255','255','0','0'],
    Green:['255','0','255','0'],
    Yellow:['255','255','255','0'],
    Black:['255','0','0','0']
};

var VideoSubTimeOffset = {
    '-5':'-2500',
    '-4':'-2000',
    '-3':'-1500',
    '-2':'-1000',
    '-1':'-500',
    '0':'0',
    '1':'500',
    '2':'1000',
    '3':'1500',
    '4':'2000',
    '5':'2500'
};

var MmpPlayStatus = {
    Play:0,
    Pause:1,
    Speed:2,
    SlowSpeed:3
};

var playStatus = MmpPlayStatus.Pause;

var PlaySleep = {
    FF0:'music_pause_btn',
    FF1:'music_play_btn',
    FF2:'music_play_speed_fforw_x2',
    FF4:'music_play_speed_fforw_x4',
    FF8:'music_play_speed_fforw_x8',
    FF16:'music_play_speed_fforw_x16',
    FF32:'music_play_speed_fforw_x32',
    FR0:'music_pause_btn',
    'FR-2':'music_play_speed_frew_x2',
    'FR-4':'music_play_speed_frew_x4',
    'FR-8':'music_play_speed_frew_x8',
    'FR-16':'music_play_speed_frew_x16',
    'FR-32':'music_play_speed_frew_x32',
    SR0:'music_pause_btn',
    SF0:'music_pause_btn',
    SF2:'music_play_speed_fforw_x12',
    SF4:'music_play_speed_fforw_x14',
    '-200':'music_play_speed_fforew_x12',
    '-400':'music_play_speed_fforew_x14',
    //'-6400000':,
    '-3200000':'music_play_speed_frew_x32',
    '-1600000':'music_play_speed_frew_x16',
    '-800000':'music_play_speed_frew_x8',
    '-400000':'music_play_speed_frew_x4',
    '-200000':'music_play_speed_frew_x2',
    '0':'music_pause_btn',
    '100000':'music_play_btn',
    '200000':'music_play_speed_fforw_x2',
    '400000':'music_play_speed_fforw_x4',
    '800000':'music_play_speed_fforw_x8',
    '1600000':'music_play_speed_fforw_x16',
    '3200000':'music_play_speed_fforw_x32',
    //'6400000':,
    '200':'music_play_speed_fforw_x12',
    '400':'music_play_speed_fforw_x14',
    //'800':800,
    //'1600':1600,
    //'3200':3200,
    SR_1_2X:'music_play_speed_fforew_x12',
    SR_1_4x:'music_play_speed_fforew_x14'
    //SR_1_8x:-800,
    //SR_1_16x:-1600,
    //SR_1_32x:-3200
    
};

var video_sub_type = {
    none:0,
    ttml:1,
    divx:2,
    ass:3,
    srt:4,
    cc:5,
    dvb:6,
    ttx:7,
    isdb_cc:8,
    isdb_txt:9,
    ssa:10,
    sami:11,
    text:12,
    vobsub:13,
    blueray:14,
    pgs:15,
    sup:16    
};
/*
var video_aud_type = {
    none:0,
    mpeg:1,
    mp3:2,
    aac:3,
    dd:4,
    truehd:5,
    pcm:6,
    dts:7,
    dts_hd_hr:8,
    dts_hd_ma:9,
    wma:10,
    cook:11,
    vorbis:12,
    flac:13,
    monkey:14,
    ddp:15,
    he-aac:16,
    he-aac-v2:17,
    wma_pro:18,
    amr:19,
    awb:20,
    mpeg1:21,
    mpeg2:22
};
*/
var video_aud_type = {
    none:'UNKNOWN',
    mpeg:'MPEG',
    mp3:'MP3',
    aac:'AAC',
    dd:'DD',
    truehd:'TRUEHD',
    pcm:'PCM',
    dts:'DTS',
    dts_hd_hr:'DTS_HD_HR',
    dts_hd_ma:'DTS_HD_MA',
    wma:'WMA',
    cook:'COOK',
    vorbis:'VORBIS',
    flac:'FLAC',
    monkey:'MONKEY',
    ddp:'DDP',
    he_aac:'HE-AAC',
    he_aac_v2:'HE-ACC-V2',
    wma_pro:'WMA_PRO',
    amr:'AMR',
    awb:'AWB',
    mpeg1:'MPEG1',
    mpeg2:'MPEG2'
};

var video_aud_full_name = {
    'UNKNOWN':'UNKNOWN',
    'MPEG':'Mpeg Audio',
    'MP3':'MP3',
    'AAC':'AAC',
    'DD':'Dolby Digital',
    'TRUEHD':'Dolby TrueHD',
    'PCM':'PCM',
    'DTS':'DTS',
    'DTS_HD_HR':'DTS-HD High Resolution',
    'DTS_HD_MA':'DTS-HD Master Audio',
    'WMA':'WMA',
    'COOK':'COOK',
    'VORBIS':'VORBIS',
    'FLAC':'FLAC',
    'MONKEY':'MONKEY',
    'DDP':'Dolby Digital Plus',
    'HE-AAC':'HE-AAC',
    'HE-ACC-V2':'HE-ACC-V2',
    'WMA_PRO':'WMA Pro',
    'AMR':'AMR',
    'AWB':'AWB',
    'MPEG1':'MPEG1',
    'MPEG2':'MPEG2'
};

var playback_media_type = {
    INVAL:0,
    TITLE:1,
    DIRECTOR:2,
    COPYRIGHT:3,
    YEAR:4,
    DATE:5,
    GENRE:6,
    DURATION:7,
    SIZE:8,
    ARTIST:9,
    ALBUM:10,
    TRACK:11,
    BITRATE:12,
    PROTECT:13,
    CREATE_TIME:14,
    ACCESS_TIME:15,
    MODIFY_TIME:16,
}

var video_aud_impared_type = {
    none:0,
    hearing:1,
    visual:2,
    mixed:3
}

function playbackStopInfo(inst){
    ret = -1;
    var res = playbackOperator(inst, playbackCommand.getStopInfo);
    if(res){
        res = JSON.parse(res);
        ret = res.ITEMS[0].bgethasstopinfo;
    }
    return ret;
}

function playbackOperator(handle, Operator, value, extendValue) {
    console.log("playbackOperator Operator = " + Operator + ";value = " + value);
    if (typeof (handle) == 'undefined' || !handle) {
        return;
    }
    var isGet = false;
    if (Operator == playbackCommand.play) {
        playStatus = MmpPlayStatus.Play;
    } else if (Operator == playbackCommand.pause) {
        playStatus = MmpPlayStatus.Pause;
    } else if(Operator == playbackCommand.ff || Operator == playbackCommand.fr){
        playStatus = MmpPlayStatus.Speed;
    }
    var parameter = '';
    switch(Operator){
        case playbackCommand.seekTime:
        parameter = ',"seek_time":' + value;
        break;
        case playbackCommand.selectSub:
        parameter = ',"select_sub_idx":"' + value + '"';
        break;
        case playbackCommand.selectAud:
        parameter = ',"select_aud_idx":"' + value + '","select_aud_dmxidx":' + extendValue;
        break;
        case playbackCommand.setSubEnc:
        parameter = ',"setsubencinfo":"' + VideoSubCharacter[value] + '"';
        break;
        case playbackCommand.setSubDisplayRect:
        parameter = ',"setsubdisplayrect_u4X":"'+VideoSubDisplayRect[value][0]+'","setsubdisplayrect_u4Y":"' + VideoSubDisplayRect[value][1] + '","setsubdisplayrect_u4W":1280,"setsubdisplayrect_u4H":620';
        break;
        case playbackCommand.setDisplayRect:
        parameter = ',"setdisplayrect_u4X":0,"setdisplayrect_u4Y":0,"setdisplayrect_u4W":1000,"setdisplayrect_u4H":1000';
        break;
        case playbackCommand.setSubFontSize:
        parameter = ',"setsubfontsizetype":"custom","setsubfontsizevalue":"' + VideoSubFontSize[value] + '"';
        break;
        case playbackCommand.setSubtxtColor:
        parameter = ',"setsubtxtclr_alpha":"'+VideoSubTextColor[value][0]+'","setsubtxtclr_r":"' + VideoSubTextColor[value][1] + '","setsubtxtclr_g":"' + VideoSubTextColor[value][2] + '","setsubtxtclr_b":"' + VideoSubTextColor[value][3] + '"';
        break;
        case playbackCommand.setSubTimeOffset:
        parameter = ',"setsubtimeoffset_type":"userdef","setsubtimeoffset_value":"' + VideoSubTimeOffset[value] + '"';
        break;
        case playbackCommand.setSubEdgWidth:
        parameter = ',"setsubedgwidth":"2"';
        break;
        case playbackCommand.setSubEdgColor:
        if(value == 1){
            parameter = ',"setsubedgclr_alpha":"255","setsubedgclr_r":"255","setsubedgclr_g":"255","setsubedgclr_b":"255"';
        } else {
            parameter = ',"setsubedgclr_alpha":"255","setsubedgclr_r":"0","setsubedgclr_g":"0","setsubedgclr_b":"0"';
        }
        break;
        case playbackCommand.getSubinfo:
        parameter = ',"getsubinfoidx":"' + value + '"';
        isGet = true;
        break;
        case playbackCommand.getAudInfo:
        parameter = ',"getaudinfoidx":"' + value + '"';
        isGet = true;
        break;
        case playbackCommand.getThumbnailAsync:
        parameter = ',"getthumbnailasyncwidth":"' + value.width + '","getthumbnailasyncheight":"' + value.height + '"';
        isGet = true;
        break;
        case playbackCommand.getMp3CoverAsync:
        parameter = ',"getmp3coverasyncwidth":"' + value.width + '","getmp3coverasyncheight":"' + value.height + '"';
        isGet = true;
        break;
        case playbackCommand.setSpeed:
        parameter = ',"SetSpeedValue":' + value;
        break;
        case playbackCommand.setStopInfo:
        parameter = ',"bsethasstopinfo":' + value;
        break;
        case playbackCommand.getMetaData:
        parameter = ',"getmetaType":' + value;
        isGet = true;
        break;
        case playbackCommand.getThumbnailData:
        case playbackCommand.getMediaInfo:
        case playbackCommand.getCurPos:
        case playbackCommand.getSpeed:
        case playbackCommand.getZoomStatus:
        case playbackCommand.getPlayType:
        case playbackCommand.getThumbnail:
        case playbackCommand.getMp3Cover:
        case playbackCommand.getStopInfo:
        case playbackCommand.getRatingInfo:
        isGet = true;
        break;
        
    }

    if(isGet) {
        var  arg = '{"PARAMETER":{"handle":' + handle + ',"operator":"' + Operator + '"' + parameter + ',"REQUEST":"QUERY"}}';
        return mtvObj.playbackGetInfo(arg);
    } else {
        var  arg = '{"PARAMETER":{"handle":' + handle + ',"operator":"' + Operator + '"' + parameter + ',"REQUEST":"SET"}}';
        return mtvObj.playbackOperator(arg);
    }
};

function playbackImgOpen(path) {
    var paramObj = {'path':path,'REQUEST':'SET'};
    var arg = {};
    arg.PARAMETER = paramObj;
    return mtvObj.imgOpen(JSON.stringify(arg));
}

function playbackImgClose() {
    mtvObj.imgClose('');
}

function playbackImgInit(){
    mtvObj.imgInit('');
}

function playbackImgDeinit(){
    mtvObj.imgDeinit('');
}

function playbackImgGetThumbnail(path, width, height){
    console.log("playbackImgGetThumbnail");
    var paramObj = {'path':path,'width':width,'height':height,'REQUEST':'QUERY'};
    var arg = {};
    arg.PARAMETER = paramObj;
    //var arg = '{"PARAMETER":{"path":"' + path + '","width":'+width+',"height":'+height+',"REQUEST":"QUERY"}}';
    res = mtvObj.imgGetThumbnailPath(JSON.stringify(arg));
    console.log("res = " + res);
    if(res){
        res = JSON.parse(res);
        return res.ITEMS[0].thumbnailPath;
    }
    return null;
}

var imgPlaybackCommand = {
    rotate:'Rotate',
    zoom:'Zoom',
    display:'Display',
    tfx_effect_play: 'Tfx_Effect_Play',
    tfx_effect_stop: 'Tfx_Effect_Stop'
};

var imgPlaybackRotateType = {
    rotate_0:0,
    rotate_0_with_flip:1,
    rotate_180:2,
    rotate_180_with_flip:3,
    rotate_270_with_flip:4,
    rotate_90:5,
    rotate_90_with_flip:6,
    rotate_270:7
};

var imgPlaybackTransitionType = {
    'Wipe left':0,
    'Wipe right':1,
    'Wipe up':2,
    'Wipe down':3,
    'Box in':4,
    'Box out':5,
    blending:6,
    Dissolve:7,
    interlace_h:8,
    interlace_v:9,
    split_in_h:10,
    split_out_h:11,
    split_in_v:12,
    split_out_v:13,
    osd_blending:14
};

function playbackImgOperator (action, value) {
    var parameter = '';
    switch(action){
        case imgPlaybackCommand.rotate:
        parameter = ',"rotate":'+value;
        break;
        case imgPlaybackCommand.zoom:
        parameter = ',"zoom":'+value;
        break;
        case imgPlaybackCommand.tfx_effect_play:
        parameter = ',"effect":'+value;
        break;
        case imgPlaybackCommand.tfx_effect_stop:
        parameter = '';
        break;
    }
    var arg = '{"PARAMETER":{"operator":"'+action+'"'+parameter+',"REQUEST":"SET"}}';
    mtvObj.imgOperator(arg);
}

function stopContentBrowser(isExitPlayer){
    if(typeof(isExitPlayer) == 'undefined' || !isExitPlayer){
        removeCBEventListener(EventListenerName.cmpbNotify, contentBrowserCmpbNotify);
        contentBrowserObj.doStop();
        if(typeof(isExitPlayer) != 'undefined'){
            dmrPlayStop();
        }
        clearThumbnail();
        if(curBrowserType == BrowserType.Dlna){
            stopMediaServer();
            stopDlnaDmr();
        }
    } else {
        videoPlayObj.videoDelInit();
    }
    mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.off);
    mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_source_type, icl_mmp_source_type.off);
    startDtvService();
}

function getPinCode(){
    return mtvObj.getPassword();
}

function doFocus(id) {
    console.log("doFocus id = "+id);
    if (id) {
        var children = $('#' + id).children().length;
        
        if (children > 0 && ($('#' + id).children(':eq(0)').attr('tabindex'))) {
            $('#' + id).children(':eq(0)').focus();
        } else {
            $('#' + id).focus();
        }
    }

}

function setItemColorKey(content, value){
    console.log("setItemColorKey value = " + value);
    var text = $(content).text();
    console.log("text = " + text);
    var htmltext = $(content).html();
    var html = htmltext.substring(0, htmltext.lastIndexOf(text));
    $(content).html(html+getTranslate(value));
}

function getFormatDate(dateObj){
    return dateObj.year+'/'+dateObj.month+'/'+dateObj.day;
}

//print log
function writeLog(log){
    console.log(log);
    try {
        if($('#show_log_info').length > 0){
            $('#show_log_info').append('<br></br>');
            $('#show_log_info').append(log);
            show_end_view();
        }
    }catch(err) { console.log(err); }
}

function show_end_view(){
    var div = document.getElementById('show_log_info');
    div.scrollTop = div.scrollHeight;
}
function getRandom(min, max){
    var r = Math.random() * (max - min);
    var re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min);
    return re;      
}

var MarqueeObj = function(){
    this.marqueeClass;
    this.lastMarqueeId;
    this.marqueeContent;
}

MarqueeObj.prototype.stopScroll = function(){
    console.log("stopScroll");
    if(this.lastMarqueeId && this.marqueeContent){
        //$('#' + this.lastMarqueeId).scrollLeft(0);
        //$('#' + this.lastMarqueeId).css("display","inline");
        $('#' + this.lastMarqueeId).text(this.marqueeContent).removeClass(this.marqueeClass).removeClass('srcoll');
    }
    this.marqueeClass = '';
    this.lastMarqueeId = null;
    this.marqueeContent = null;
}


MarqueeObj.prototype.startScroll = function(id){
    if(id){
        console.log("scroll_id:"+id)
    }else{
        return;
    }
    if(this.marqueeClass){
        this.stopScroll();
    }
    var obj = document.getElementById(id);
    var tempWidth = obj.scrollWidth - obj.offsetWidth; // length of can scroll
    if(tempWidth > 0){
        this.marqueeWidth = tempWidth;
        this.lastMarqueeId = id;
        this.marqueeContent = $("#"+id).text();
        console.log("scroll_txt:"+this.marqueeContent);
        obj.innerHTML += ("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.marqueeContent+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        console.log("obj.innerHTML = " + obj.innerHTML);
        var num = Math.floor(obj.scrollWidth/100);
        if(num >13)num=13;
        this.marqueeClass = 'srcoll marquee'+num;
        $(obj).addClass(this.marqueeClass);
        //this.setIntervalObj = setInterval("marqueeObj.scrollToLeft('"+id+"','"+this.marqueeWidth+"')",20);
    }
}

var marqueeObj = new MarqueeObj();

function clone(myObj){
  if(typeof(myObj) != 'object') return myObj;
  if(myObj == null) return myObj;
    
  var myNewObj = new Object();
    
  for(var i in myObj)
     myNewObj[i] = clone(myObj[i]);
    
  return myNewObj;
}

function startDtvService(){
    //1 msgconvert(netflix);2 nettv;0 other app
    var appStatus = mtvObj.acfgGetConfigValue('g_misc__next_app_status');
    if(appStatus == 0){
        mtvuiUtil.dtvServiceAction(true);
    }
}

function messageCmdListener(data){
    obj = JSON.parse(data);
    if (obj.type == "command" && obj.action == "selectSource") {
        contentBrowserObj.doStop();
    }
}
mtvuiUtil.messageListener = messageCmdListener;