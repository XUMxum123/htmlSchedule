var DLNA_MEDIA_TYPE = {
    Null:0,
    Photo:1,
    Audio:2,
    Video:3,
    PlayList:4,
    Item:5,
    Directory:6
}

var DLNA_SORT_MODE = {
    Null:0,
    Title_asc:1,
    Title_desc:2,
    Last_entry:3,
};

var DMP_NOTIFY_TYPE = {
    Found:0,
    Lost:1,
    Update:2,
    Update_Root:3
};

var DMS_TYPE = {
    Normal:0,
    MultiRoom:1
};

var DMS_STATUS_TYPE = {
    Online:0,
    OnlineWakable:1,
    OfflineWakable:2
};

var mediaServerList = [{SERVER_NAME:'tv',DEV_ID:90,instanceObj:11,relDevId:80}];

var curMediaServer;

function addOrUpdateMediaServer(serverInfo){
    console.log("addOrUpdateMediaServer serverInfo = " + JSON.stringify(serverInfo));
    var serverIndex = 0;
    var needAdd = true;
    for(serverIndex in mediaServerList){
        if(mediaServerList[serverIndex].DEV_ID == serverInfo.DEV_ID){
            mediaServerList[serverIndex] = serverInfo;
            needAdd = false;
            break;
        }
    }
    serverInfo.statusType = serverInfo.ARG2;
    /*
    serverInfo.dmsType = dlnaObj.dlnaDmpGetDmsType(serverInfo.DEV_ID);
    if(serverInfo.dmsType == DMS_TYPE.MultiRoom){
        serverInfo.isWakable = dlnaObj.dlnaDmpIsDmsWakable(serverInfo.DEV_ID);
    }
    */
    serverInfo.dmsType = serverInfo.ARG1;
    if(needAdd){
        addDMS(serverInfo);
    } else {
        if(mediaServerList.length <= 1){
            refreshRootList(true);
        } else {
            refreshRootList();
        }
    }
}

function removeMediaServer(serverInfo){
    var needRemove = false;
    var serverIndex = 0;
    for(serverIndex in mediaServerList){
        if(mediaServerList[serverIndex].DEV_ID == serverInfo.DEV_ID){
            needRemove = true;
            break;
        }
    }
    console.log("serverInfo serverIndex= " + JSON.stringify(mediaServerList[serverIndex]));
    if(needRemove){
        if(mediaServerList[serverIndex].ARG2 == 1){
            mediaServerList[serverIndex].statusType = DMS_STATUS_TYPE.OfflineWakable;
        } else {
            mediaServerList.splice(serverIndex, 1);
            if(curMediaServer.DEV_ID == serverInfo.DEV_ID){
                //TODO:
                if(contentBrowserObj.curShowMode != contentBrowserObj.ShowMode.Browser){
                    contentBrowserObj.stopPlay();
                }
                refreshRootList(true);
                return;
            } else {
                musicPlayObj.dmsLost(serverInfo.DEV_ID);
            }
        }
        refreshRootList();
    } else if(serverInfo.ARG2 == 1) {
        serverInfo.dmsType = serverInfo.ARG1;
        serverInfo.statusType = DMS_STATUS_TYPE.OfflineWakable;
        addDMS(serverInfo);
    }
}

function addDMS(serverInfo){
    mediaServerList.push(serverInfo);
    mediaServerList.sort(function(a,b){
            return a.statusType-b.statusType});
    if(mediaServerList.length <= 1){
        refreshRootList(true);
    } else {
        refreshRootList();
    }
}

function dmsNotifyFunc(jsonStr){
    console.log("dmsNotifyFunc jsonStr = " + jsonStr);
    var dmpNotify = JSON.parse(jsonStr);
    if(dmpNotify.URI != NotifyURI.Dms){
        console.log("dmpNotify.URI != NotifyURI.Dms");
        return;
    }
    for(index in dmpNotify.ITEMS){
        dmpItem = dmpNotify.ITEMS[index];
        switch(Number(dmpItem.TYPE)){
            case DMP_NOTIFY_TYPE.Found:
            addOrUpdateMediaServer(dmpItem);
            break;
            case DMP_NOTIFY_TYPE.Lost:
            removeMediaServer(dmpItem);
            break;
            case DMP_NOTIFY_TYPE.Update:
            if(curMediaServer && curMediaServer.DEV_ID === dmpItem.DEV_ID){
                var instObj = dlnaObj.dmpCreateInstance(curMediaServer.devId, dmpItem.ARG1);
                if(instObj){
                    var mediaInfo = dlnaObj.getDmpFileMediaInfo(instObj.instance);
                    if(mediaInfo)
                        dmsFileUpdate(mediaInfo);
                }
            }
            break;
            case DMP_NOTIFY_TYPE.Update_Root:
            if(curMediaServer && curMediaServer.DEV_ID === dmpItem.DEV_ID){
                initFile(true);
            }
            break;
        }
    }
}

function scanMediaServer(scanNotifyFunc){
    mediaServerList = [];
    addCBEventListener(EventListenerName.dmsNotify, dmsNotifyFunc);
    mtvObj.dlnaDmsInit('');
    //wait for 10s,return mediaserver info
    setTimeout(function(){
    if(scanNotifyFunc && mediaServerList.length <= 0){
        scanNotifyFunc(0);
    }
    }, 10000);
}

function stopMediaServer(){
    removeCBEventListener(EventListenerName.dmsNotify, dmsNotifyFunc);
    //mtvObj.dlnaDmsDeinit('');
}

var DlnaObj = function(){
};

DlnaObj.prototype.dlnaDmpGetDmsType = function(devId){
    var ret = 0;
    var arg = '{"PARAMETER":{"devId":'+devId+',"REQUEST":"QUERY"}}';
    res = mtvObj.dlnaDmpGetDmsType(arg);
    console.log("dlnaDmpGetDmsType res = " + res);
    if(res){
        res = JSON.parse(res);
        ret = Number(res.ITEMS[0].dmsType);
    }
    return ret;
};
DlnaObj.prototype.dlnaDmpIsDmsWakable = function(devId){
    var arg = '{"PARAMETER":{"devId":'+devId+',"REQUEST":"QUERY"}}';
    var ret = 0;
    res = mtvObj.dlnaDmpIsDmsWakable(arg);
    console.log("dlnaDmpIsDmsWakable res = " + res);
    if(res){
        res = JSON.parse(res);
        ret = Number(res.ITEMS[0].isWakable);
    }
    return ret;
};
DlnaObj.prototype.dlnaDmpWakeupDms = function(devId){
    var arg = '{"PARAMETER":{"devId":'+devId+',"REQUEST":"SET"}}';
    res = mtvObj.dlnaDmpWakeupDms(arg);
    console.log("dlnaDmpWakeupDms res = " + res);
};
DlnaObj.prototype.dlnaDmpClearOffDms = function(devId){
    var arg = '{"PARAMETER":{"devId":'+devId+',"REQUEST":"SET"}}';
    res = mtvObj.dlnaDmpClearOffDms(arg);
    console.log("dlnaDmpClearOffDms res = " + res);
};

DlnaObj.prototype.dmpGetRealDevId = function(devId){
    var ret = null;
    var arg = '{"PARAMETER":{"devId":'+devId+',"REQUEST":"QUERY"}}';
    var res = mtvObj.dlnaDmpGetRealDevId(arg);
    if(res){
        res = JSON.parse(res);
        ret = res.ITEMS[0].realDevId;
    }
    return ret;
};

DlnaObj.prototype.dmpCreateInstance = function(devId, objId){
    var ret = null;
    var arg = '{"PARAMETER":{"devId":'+devId+',"objId":'+objId+',"REQUEST":"QUERY"}}';
    var res = mtvObj.dlnaDmpCreateInstance(arg);
    if(res){
        res = JSON.parse(res);
        ret = {'instance':res.ITEMS[0].instance,'mediaType':res.ITEMS[0].mediaType};
    }
    return ret;
};

DlnaObj.prototype.dmpDelInstance = function(inst){
    if(inst){
        var arg = '{"PARAMETER":{"instance":'+inst+',"REQUEST":"SET"}}';
        mtvObj.dlnaDmpDestroyInstance(arg);
    }
};

DlnaObj.prototype.getDmpFilePageData = function(getInstInfo, reqTotalCount, totalNum, listLen, isPrev){
    console.log("getDmpFilePageData getInstInfo.dlnaInfoEndIndex = " + getInstInfo.dlnaInfoEndIndex +";getInstInfo = " + JSON.stringify(getInstInfo));
    var inst = this.dmpCreateInstance(getInstInfo.devId,getInstInfo.objectId);
    if(!inst){
        return;
    }
    if(typeof(listLen) == 'undefined'){
        listLen = 0;
    }
    inst = inst.instance;
    var ret = [];
    var total_num = 0;
    var i = 0;
    var requestNum = 0;
    var startIdx;
    var requestCount = 0;
    try {  
    while(total_num < reqTotalCount && getInstInfo.dlnaInfoEndIndex < totalNum){
        i = 0;
        if(!isPrev){
            startIdx = getInstInfo.dlnaInfoEndIndex;
            requestNum = (totalNum - getInstInfo.dlnaInfoEndIndex - 1 >= 10) ? 10 : (totalNum - getInstInfo.dlnaInfoEndIndex)
        } else {
            startIdx = getInstInfo.dlnaInfoStartIndex;
            requestNum = reqTotalCount;
        }
        var arg = '{"PARAMETER":{"instance":'+inst+',"startIdx":'+startIdx+',"requestNum":'+requestNum+',"REQUEST":"QUERY"}}';
        console.log("getDmpFilePageData arg = " + arg);
        var res = mtvObj.dlnaDmpGetDirList(arg);
        if (!res)
            break;
        ch = JSON.parse(res);
        if(ch.STATUS == 0){
            if(!isPrev){
                getInstInfo.dlnaInfoEndIndex += requestNum;
            }
            requestCount += requestNum; 
        
            for(var index in ch.ITEMS){
                var tempObj = ch.ITEMS[index];
                tempInst = this.dmpCreateInstance(tempObj.devId, tempObj.objectId);
                if(tempInst){
                    tempObj.mediaType = tempInst.mediaType;
                    var mediaInfo = this.getDmpFileMediaInfo(tempInst.instance);
                    if(mediaInfo){
                        tempObj.mediaInfo = mediaInfo;
                    }
                }
                //tempObj.MEDIA_INDEX = total_num + listLen;
                ret.push(tempObj);
                i++;
                total_num++;
            }
        } else {
            break;
        }
    };
    }catch(err) { console.log("err = "+err); }
    
    if(inst){
        this.dmpDelInstance(inst);
    }

    return ret;
};

DlnaObj.prototype.getPlayBackFileInfo = function(getInstInfo, startIdx){
    var inst = this.dmpCreateInstance(getInstInfo.devId,getInstInfo.objectId);
    if(!inst){
        return null;
    }
    inst = inst.instance;
    var ret = null;
    var arg = '{"PARAMETER":{"instance":'+inst+',"startIdx":'+startIdx+',"requestNum":1,"REQUEST":"QUERY"}}';
    try {
    var res = mtvObj.dlnaDmpGetDirList(arg);
    if (res){
        res = JSON.parse(res);
        ret = res.ITEMS[0];
        tempInst = this.dmpCreateInstance(ret.devId, ret.objectId);
        if(tempInst){
            ret.mediaType = tempInst.mediaType;
            var mediaInfo = this.getDmpFileMediaInfo(tempInst.instance);
            if(mediaInfo){
                ret.mediaInfo = mediaInfo;
            }
        }
    }
    }catch(err) { console.log("err = "+err); }
    if(inst){
        this.dmpDelInstance(inst);
    }
        
    return ret;
}

DlnaObj.prototype.getPhotoFileInfo = function(photoNode){
    tempInst = this.dmpCreateInstance(photoNode.devId, photoNode.objectId);
    if(tempInst){
        this.dlnaDmpDownloadFile(tempInst.instance);
        this.dmpDelInstance(tempInst.instance);
    }
};

DlnaObj.prototype.getDmpFileMediaInfo = function(inst){
    var ret = null;
    if(inst){
        var arg = '{"PARAMETER":{"instance":'+inst+',"REQUEST":"QUERY"}}';
        var res = mtvObj.dlnaDmpGetMediaInfo(arg);
        if(res){
            res = JSON.parse(res);
            ret = res.ITEMS[0];
        }
        this.dmpDelInstance(inst);
    }
    return ret;
};

DlnaObj.prototype.dlnaDmpDownloadFile = function(inst){
    var ret = -1;
    if(inst){
        var arg = '{"PARAMETER":{"instance":'+inst+',"REQUEST":"SET"}}';
        ret = mtvObj.dlnaDmpDownloadFile(arg);
    }
    return ret;
};

var dlnaObj = new DlnaObj();

var DmrNotifyCmdType = {
    play:0,
    pause:1,
    resume:2,
    stop:3,
    next:4,
    prev:5,
    seekTime:6,
    imgRotate:7,//Min:0 MAX:360 Step:90 default:0
    imgZoom:8,//Min:100 MAX:400 Step:10 default:100
    imgHoripan:9,//Min:-100 MAX:100 default:0
    imgVertpan:10,
    playSpeed:11,
    subtitle:12,
    delay:13,
    mute:14,
    adj_volume:15,
    subtitle_track:16
}

var dmrNotifyFunc = function (jsonStr){
    var dmrNotify = JSON.parse(jsonStr);
    if(dmrNotify.URI != NotifyURI.Dmr){
        console.log("dmrNotify.URI != NotifyURI.Dmr");
        return;
    }
    console.log("dlna dmrNotifyFunc jsonStr= " + jsonStr);
    for(index in dmrNotify.ITEMS){
        dmrItem = dmrNotify.ITEMS[index];
        var type = Number(dmrItem.TYPE);
        switch(type){
            case DmrNotifyCmdType.play:
            console.log("DmrNotifyCmdType.play");
            setExitDmrPlayTimer();
            dlnaDmrPlayCmd(dmrItem);
            break;
            case DmrNotifyCmdType.resume:
            sendDmrCmdOperator(type);
            var cmd;
            if(curDmrPlayInfo.mediaType == 1){
                cmd = DmrStateNfyType.photo_played;
            } else if(curDmrPlayInfo.mediaType == 2){
                cmd = DmrStateNfyType.audio_played;
            } else if(curDmrPlayInfo.mediaType == 3){
                cmd = DmrStateNfyType.video_played;
            }
            dlnaDmrSyncPlayState(cmd, 0);
            break;
            case DmrNotifyCmdType.pause:
            sendDmrCmdOperator(type);
            dlnaDmrSyncPlayState(DmrStateNfyType.pause, 0);
            break;
            case DmrNotifyCmdType.stop:
            sendDmrCmdOperator(type);
            //contentBrowserObj.doStop();
            dmrPlayStop(true);
            break;
            case DmrNotifyCmdType.playSpeed:
            sendDmrCmdOperator(type, convertDmrSpeed(Number(dmrItem.ARG2)));
            if(curDmrPlayInfo.mediaType == 2){
                cmd = DmrStateNfyType.audio_played;
            } else if(curDmrPlayInfo.mediaType == 3){
                cmd = DmrStateNfyType.video_played;
            }
            dlnaDmrSyncPlayState(cmd, 0);
            break;
            case DmrNotifyCmdType.seekTime:
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.mute:
            dmrVolumeCtrl(volumeCtrlType.mute, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.mute, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.adj_volume:
            dmrVolumeCtrl(volumeCtrlType.set, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.volume, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.subtitle_track:
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.imgRotate: //Min:0 MAX:360 Step:90 default:0
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.img_rotation, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.imgZoom: //Min:100 MAX:400 Step:10 default:100
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.img_zoom, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.imgHoripan: //Min:-100 MAX:100 default:0
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.img_hori_pan, Number(dmrItem.ARG2));
            break;
            case DmrNotifyCmdType.imgVertpan:
            sendDmrCmdOperator(type, Number(dmrItem.ARG2));
            dlnaDmrSyncPlayState(DmrStateNfyType.img_ver_pan, Number(dmrItem.ARG2));
            break;
        }
    }
};

function sendDmrCmdOperator(type, value){
    try{
        if(contentBrowserObj.getPlayObject()){
            contentBrowserObj.getPlayObject().dmrCmdOperator(type, value);
        }
    } catch(e){
        
    }

}

function dlnaDmrPlayCmd(dmrItem){
    console.log("dlnaDmrPlayCmd");
    dlnaDmrHandle = dmrItem.TAG;
    curDmrPlayInfo = dlnaDmrGetMediaInfo(dlnaDmrHandle);
    if(!curDmrPlayInfo){
        curDmrPlayInfo = {};
    }
    curDmrPlayInfo.PROTOCOL_INFO = dmrItem.PROTOCOL_INFO;
    curDmrPlayInfo.URL = dmrItem.URL;
    curDmrPlayInfo.playSpeed = Number(dmrItem.ARG2);
    switch(dmrItem.ARG1){
        case 1:
        var photopath = dlnaDmrDownloadFile(curDmrPlayInfo);
        if(photopath){
            curDmrPlayInfo.MEDIA_PATH = photopath;
            curDmrPlayInfo.MEDIA_NAME = curDmrPlayInfo.mediaName;
            contentBrowserObj.playPhoto(curDmrPlayInfo);
        } else {
            dlnaDmrSyncPlayState(DmrStateNfyType.file_not_support, 0);
        }
        break;
        case 2:
        contentBrowserObj.playMusic(curDmrPlayInfo, SourceType.Dmr);
        break;
        case 3:
        contentBrowserObj.playVideo(curDmrPlayInfo, SourceType.Dmr);
        break;
    }
}

function dlnaDmrInit(){
    res = mtvObj.dlnaDmrInit('');
    if(res){
        res = JSON.parse(res);
        return res.ITEMS[0].instance;
    }
    return null;
}

function dlnaDmrGetMediaInfo(instance){
    if(instance){
        var arg = '{"PARAMETER":{"instance":'+instance+',"REQUEST":"QUERY"}}';
        res = mtvObj.dlnaDmrGetMediaInfo(arg);
        console.log("res = "+ res);
        if(res){
            res = JSON.parse(res);
            return res.ITEMS[0];
        }
    }
    return null;
}

function dlnaDmrDownloadFile(mediaInfo){
    if(dlnaDmrHandle){
        var arg = '{"PARAMETER":{"instance":'+dlnaDmrHandle+',"protocol":"'+mediaInfo.PROTOCOL_INFO+'","url":"'+mediaInfo.URL+'","REQUEST":"QUERY"}}';
        res = mtvObj.dlnaDmrDownloadFile(arg);
        if(res){
            res = JSON.parse(res);
            return res.ITEMS[0].path;
        }
    }
    return null;
}

function dlnaDmrSyncProgress(cur, dur){
        if(dlnaDmrHandle){
        var arg = '{"PARAMETER":{"instance":'+dlnaDmrHandle+',"position":'+cur+',"duration":'+dur+',"REQUEST":"SET"}}';
        ret = mtvObj.dlnaDmrSyncProgress(arg);
        console.log("dlnaDmrSyncProgress ret = "+ ret);
    }
}

function dlnaDmrSyncPlayState(state, value){
    if(dlnaDmrHandle && curDmrPlayInfo){
        url = curDmrPlayInfo.URL;
        if(state == DmrStateNfyType.subtitle_info){
            url = value;
            value = 0;
        }
        var arg = '{"PARAMETER":{"instance":'+dlnaDmrHandle+',"playState":'+state+',"value":'+value+',"url":"'+url+'","REQUEST":"SET"}}';
        ret = mtvObj.dlnaDmrSyncPlayState(arg);
        console.log("dlnaDmrSyncPlayState ret = "+ ret);
    }
}

var dlnaDmrHandle = null;
var curDmrPlayInfo = null;
function startDlnaDmr(){
    console.log("startDlnaDmr");
    window.dmrUtil.dmrNotifyCallback = dmrNotifyFunc;
    window.dmrUtil.networkNotifyCallback = networkNotifyFunc;
    /*
    addCBEventListener(EventListenerName.dmrNotify, dmrNotifyFunc);
    addTvServerListener(EventListenerName.networkNotify, networkNotifyFunc);
    dlnaDmrHandle = dlnaDmrInit();
    console.log("startDlnaDmr dlnaDmrHandle = " + dlnaDmrHandle);
    */
}

function stopDlnaDmr(){
    console.log("stopDlnaDmr dlnaDmrHandle");
    window.dmrUtil.dmrNotifyCallback = null;
    //window.dmrUtil.networkNotifyCallback = null;
    /*
    removeCBEventListener(EventListenerName.dmrNotify, dmrNotifyFunc);
    removeTvServerListener(EventListenerName.networkNotify, networkNotifyFunc);
    if(dlnaDmrHandle){
        var arg = '{"PARAMETER":{"instance":'+dlnaDmrHandle+',"REQUEST":"SET"}}';
        mtvObj.dlnaDmrDeinit(arg);
        dlnaDmrHandle = null;
    }
    */
}

var exitDmrPlayPage_t = null;
function setExitDmrPlayTimer(isReset){
    console.log("setExitDmrPlayTimer");
    if(exitDmrPlayPage_t){
        clearTimeout(exitDmrPlayPage_t);
        exitDmrPlayPage_t = null;
    }
    if(isReset){
        exitDmrPlayPage_t = setTimeout("contentBrowserObj.dmrPlayExit();", 10000);
    }
}

function dmrPlayStop(autoStop){
    dlnaDmrSyncPlayState(DmrStateNfyType.stopped, 0);
    curDmrPlayInfo = null;
    if(typeof(autoStop) != 'undefined'){
        setExitDmrPlayTimer(true);
    } else {
        setExitDmrPlayTimer();
    }
    contentBrowserObj.curShowMode = contentBrowserObj.ShowMode.Browser;
}

var cmpbCtrlSpeedType = {
    FR_64X:-6400000,
    FR_32X:-3200000,
    FR_16X:-1600000,
    FR_8X:-800000,
    FR_4X:-400000,
    FR_2X:-200000,
    ZERO:0,
    '1X':100000,
    FF_2X:200000,
    FF_4X:400000,
    FF_8X:800000,
    FF_16X:1600000,
    FF_32X:3200000,
    FF_64X:6400000,
    SF_1_2X:200,
    SF_1_4x:400,
    SF_1_8x:800,
    SF_1_16x:1600,
    SF_1_32x:3200,
    SR_1_2X:-200,
    SR_1_4x:-400,
    SR_1_8x:-800,
    SR_1_16x:-1600,
    SR_1_32x:-3200
}

var convertDmrSpeed = function(speed){
    return speed;
}

var DmrStateNfyType = {
    file_not_support:0,
    av_none:1,
    audio_only:2,
    video_only:3,
    av_both:4,
    audio_played:5,
    video_played:6,
    audio_not_support:7,
    video_not_support:8,
    hd_not_support:9,
    drm_not_support:10,
    resolution_not_support:11,
    framerate_not_support:12,
    no_content:13,
    stopped:14,
    photo_played:15,
    end_of_media:16,
    player_exit:17,
    pause:18,
    mute:19,
    volume:20,
    friendly_name_change:21,
    subtitle_info:22,
    img_rotation:23,
    img_zoom:24,
    img_hori_pan:25,
    img_ver_pan:26,
    ignore:27
};

function dmrCmpbStateNotify(cmpbNotify){
    var arg1 = Number(cmpbNotify.ARG1);
    switch(Number(cmpbNotify.TYPE)){
        case MmpEventType.total_time_update:
        curDmrPlayInfo.duration = arg1;
        break;
        case MmpEventType.icur_time_update:
        dlnaDmrSyncProgress(arg1, curDmrPlayInfo.duration);
        break;
        case MmpEventType.eos:
        dlnaDmrSyncPlayState(DmrStateNfyType.end_of_media, 0);        
        dmrPlayStop(true);
        break;
        case MmpEventType.play_done:
        if(curDmrPlayInfo.playSpeed){
            var speed = convertDmrSpeed(curDmrPlayInfo.playSpeed);
            if(speed != cmpbCtrlSpeedType['1X']){
                sendDmrCmdOperator(DmrNotifyCmdType.playSpeed, speed);
            }
        }
        case MmpEventType.timeseek_done:
        var cmd;
        if(curDmrPlayInfo.mediaType == 1){
            cmd = DmrStateNfyType.photo_played;
        } else if(curDmrPlayInfo.mediaType == 2){
            cmd = DmrStateNfyType.audio_played;
        } else if(curDmrPlayInfo.mediaType == 3){
            cmd = DmrStateNfyType.video_played;
        }
        dlnaDmrSyncPlayState(cmd, 0);
        break;
        case MmpEventType.speed_update:
        switch(arg1){
            case cmpbCtrlSpeedType.ZERO:
            dlnaDmrSyncPlayState(DmrStateNfyType.pause, 0);
            break;
            case cmpbCtrlSpeedType['1X']:
            var cmd;
            if(curDmrPlayInfo.mediaType == 1){
                cmd = DmrStateNfyType.photo_played;
            } else if(curDmrPlayInfo.mediaType == 2){
                cmd = DmrStateNfyType.audio_played;
            } else if(curDmrPlayInfo.mediaType == 3){
                cmd = DmrStateNfyType.video_played;
            }
            dlnaDmrSyncPlayState(cmd, 0);
            break;
        }
        break;
        case MmpEventType.playback_error:
        dlnaDmrSyncPlayState(DmrStateNfyType.file_not_support, 0);
        dmrPlayStop(true);
        break;

    }
}

var volumeCtrlType = {
    mute:0,
    set:1,
    increase:2,
    decrease:3
}

function dmrVolumeCtrl(type, value){
    switch(type){
        case volumeCtrlType.mute:
        //mtvObj.setVolumeMute(value);
        //break;
        case volumeCtrlType.set:
        //mtvObj.setVolumeValue(value);
        mtvObj.acfgGetConfigValue('g_misc__vol_bar_is_shown');
        break;
        case volumeCtrlType.increase:
        mtvObj.increaseVolume();
        break;
        case volumeCtrlType.decrease:
        mtvObj.decreaseVolume();
        break;
    }
}

function resetDlnaLayout(){
    console.log("resetDlnaLayout");
    mediaServerList = [];
    initFile();
    if(contentBrowserObj.curShowMode != contentBrowserObj.ShowMode.Browser){
        contentBrowserObj.stopPlay();
    }
}

var networkNotifyFunc = function(jsonStr){
    console.log("networkNotifyFunc jsonStr = " + jsonStr);
    var netNotify = JSON.parse(jsonStr);
    for(index in netNotify.ITEMS){
        netItem = netNotify.ITEMS[index];
        switch(netItem.ID){
            case 2://unplugin
            case 3://ipchange
            setTimeout("resetDlnaLayout()",100);
            break;
        }
    }
}