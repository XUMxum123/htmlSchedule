function get_content_browser_player_url(){
    return get_base_url() + "ContentBrowser/content_browser_player.html";
}

(function loadMmpTestData(){
    if ("Win32" == navigator.platform){
        mtvuiLoadScript(mtvuiUtil.getBaseURL() + "libs/mtvui/contentbrowser-test.js");
    }
})();

MtvObjRaw.prototype.getMmpService = function () {
    if (!this.mmpServices) {
        this.mmpServices = getCBMmpService();
    }
    return this.mmpServices;
};

MtvObjRaw.prototype.usbDetectInit = function (arg) {
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        ret = this.mmpServices.usbDetectInit(arg);
    }
    return ret;
};

MtvObjRaw.prototype.usbDetectDeinit = function (arg) {
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        ret = this.mmpServices.usbDetectDeinit(arg);
    }
    return ret;
};

MtvObjRaw.prototype.getMountPointList = function (arg) {
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getMountPointList(arg);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getMountPointDevDesc = function (arg) {
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getMountPointDevDesc(arg);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.importDatabase = function (arg) {
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.importDatabase(arg);
    }
    return ret;
};

MtvObjRaw.prototype.deleteDatabase = function (arg) {
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.deleteDatabase(arg);
    }
    return ret;
};

MtvObjRaw.prototype.startUsbScan = function (arg) {
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        ret = this.mmpServices.startUsbScan(arg);
    }
    return ret;
};

MtvObjRaw.prototype.stopUsbScan = function (arg) {
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        ret = this.mmpServices.stopUsbScan(arg);
    }
    return ret;
};

MtvObjRaw.prototype.getUsbScanDbCount = function (arg) {
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        ret = this.mmpServices.getUsbScanDbCount(arg);
    }
    return ret;
};

MtvObjRaw.prototype.getUsbContentInfo = function (arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbContentInfo(arg);
        mtvui_debug_log("getUsbContentInfo("+arg+") return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getContentBrowserCount = function (path, type) {
    console.log('getContentBrowserCount');
    var ret = 0;
    this.getMmpService();
    if (this.mmpServices) {
        var arg = '{"PARAMETER":{"PATH":"'+path+'","TYPE":"'+type+'","REQUEST":"QUERY"}}';
        res = this.mmpServices.getUsbScanDbCount(arg);
        if(res){
            mtvui_debug_log("getUsbScanDbCount return " + res.toString());
            var countInfo = JSON.parse(res);
            ret = parseInt(countInfo.ITEMS[0].COUNT);
        }
    }
    return ret;
};

MtvObjRaw.prototype.getContentBrowserList = function (path, type) {
    this.getMmpService();
    ret = [];
    if (this.mmpServices) {
        var total_num = this.getContentBrowserCount(path, type);
        mtvui_debug_log("getContentBrowserCount total_num " + total_num);
        var i = 0;
        while(i < total_num){
            var arg = '{"PARAMETER":{"PATH":"'+path+'","TYPE":"'+type+'","INDEX":"'+i+'","COUNT":"10","REQUEST":"QUERY"}}';
            res = this.mmpServices.getUsbContentInfo(arg);
            mtvui_debug_log("the getUsbContentInfo("+i+") return " + res);
            //res = res.replace(/[^\x20-\x7E]+/g, ''); // FIXME: workaround for non printable char
            if (!res)
                break;
            ch = JSON.parse(res);
            for(var index in ch.ITEMS){
                ret.push(ch.ITEMS[index]);
                i++;
            }

        };

        return ret;
    }
    return null;
};

MtvObjRaw.prototype.setContentSortType = function (mediaType,sortType){
    this.getMmpService();
    if (this.mmpServices) {
        var arg = '{"PARAMETER":{"TYPE":"'+mediaType+'","SORT":"'+sortType+'","REQUEST":"SET"}}'
        res = this.mmpServices.setContentSortType(arg);
        mtvui_debug_log("setContentSortType("+arg+") return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getUsbTopListDbCount = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbTopListDbCount(arg);
        mtvui_debug_log("getUsbTopListDbCount("+arg+") return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getUsbTopList = function (arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbTopList(arg);
        mtvui_debug_log("getUsbTopList("+arg+") return " + res);
        //res = res.replace(/[^\x20-\x7E]+/g, ''); // FIXME: workaround for non printable char

        return res;
    }
    return null;

};

MtvObjRaw.prototype.getUsbRec = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbRec(arg);
        mtvui_debug_log("getUsbRec("+arg+") return " + res);
        //res = res.replace(/[^\x20-\x7E]+/g, ''); // FIXME: workaround for non printable char
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getUsbContentInfoByPath = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbContentInfoByPath(arg);
        mtvui_debug_log("getUsbContentInfoByPath("+arg+") return " + res);
        //res = res.replace(/[^\x20-\x7E]+/g, ''); // FIXME: workaround for non printable char
        return res;
    }
    return null;
};

MtvObjRaw.prototype.playbackInitWithPath = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.playbackInitWithPath(arg);
        mtvui_debug_log("playbackInitWithPath("+arg+") return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.addMmpEventListener = function(name, notifyFunc){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.addEventListener(name, notifyFunc);
        mtvui_debug_log("addMmpEventListener("+name+") return " + res);

        return res;
    }
    return null;
};

MtvObjRaw.prototype.removeMmpEventListener = function(name, notifyFunc){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.removeEventListener(name, notifyFunc);
        mtvui_debug_log("removeMmpEventListener("+name+") return " + res);

        return res;
    }
    return null;
};

MtvObjRaw.prototype.playbackDeinit = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        this.mmpServices.playbackDeinit(arg);
        mtvui_debug_log("playbackDeinit("+arg+")");
    }
};

MtvObjRaw.prototype.playbackOperator = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.playbackOperator(arg);
        mtvui_debug_log("playbackOperator("+arg+") return " + res);
        return res;
    }
     return null;
};

MtvObjRaw.prototype.playbackGetInfo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.playbackGetInfo(arg);
        mtvui_debug_log("playbackGetInfo("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.imgInit = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.imgInit(arg);
        mtvui_debug_log("imgInit("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.imgDeinit = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.imgDeinit(arg);
        mtvui_debug_log("imgDeinit("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.imgGetThumbnailPath = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.imgGetThumbnailPath(arg);
        mtvui_debug_log("imgGetThumbnailPath("+arg+") res = "+ res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.imgOpen = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.imgOpen(arg);
        mtvui_debug_log("imgOpen("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.imgClose = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.imgClose(arg);
        mtvui_debug_log("imgClose("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.imgOperator = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        this.mmpServices.imgOperator(arg);
        mtvui_debug_log("imgOperator("+arg+")");
    }
};
MtvObjRaw.prototype.dlnaDmsInit = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmsInit(arg);
        mtvui_debug_log("dlnaDmsInit("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.dlnaDmsDeinit = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmsDeinit(arg);
        mtvui_debug_log("dlnaDmsDeinit("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.dlnaDmpGetDmsType = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpGetDmsType(arg);
        mtvui_debug_log("dlnaDmpGetDmsType("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.dlnaDmpIsDmsWakable = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpIsDmsWakable(arg);
        mtvui_debug_log("dlnaDmpIsDmsWakable("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.dlnaDmpWakeupDms = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpWakeupDms(arg);
        mtvui_debug_log("dlnaDmpWakeupDms("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.dlnaDmpClearOffDms = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpClearOffDms(arg);
        mtvui_debug_log("dlnaDmpClearOffDms("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.dlnaDmpCreateInstance = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpCreateInstance(arg);
        mtvui_debug_log("dlnaDmpCreateInstance("+arg+") return " + res);
        return res;
    }
     return null;
};
MtvObjRaw.prototype.dlnaDmpDestroyInstance = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmpDestroyInstance(arg);
        mtvui_debug_log("dlnaDmpDestroyInstance("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.dlnaDmpGetRealDevId = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpGetRealDevId(arg);
        mtvui_debug_log("dlnaDmpGetRealDevId("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmpGetMediaInfo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpGetMediaInfo(arg);
        mtvui_debug_log("dlnaDmpGetMediaInfo("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmpGetDirList = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmpGetDirList(arg);
        mtvui_debug_log("dlnaDmpGetDirList("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmpDownloadFile = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmpDownloadFile(arg);
        mtvui_debug_log("dlnaDmpGetDirList("+arg+") return " + ret);
    }
    return ret;
};
MtvObjRaw.prototype.dlnaDmrInit = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmrInit(arg);
        mtvui_debug_log("dlnaDmrInit("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmrDeinit = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmrDeinit(arg);
        mtvui_debug_log("dlnaDmrDeinit("+arg+")");
    }
    return ret;
};
MtvObjRaw.prototype.dlnaDmrGetMediaInfo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmrGetMediaInfo(arg);
        mtvui_debug_log("dlnaDmrGetMediaInfo("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmrDownloadFile = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.dlnaDmrDownloadFile(arg);
        mtvui_debug_log("dlnaDmrDownloadFile("+arg+") return " + res);
        return res;
    }
    return null;
};
MtvObjRaw.prototype.dlnaDmrSyncProgress = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmrSyncProgress(arg);
        mtvui_debug_log("dlnaDmrSyncProgress("+arg+") return " + ret);
    }
    return ret;    
};
MtvObjRaw.prototype.dlnaDmrSyncPlayState = function(arg){
    this.getMmpService();
    ret = -1;
    if (this.mmpServices) {
        ret = this.mmpServices.dlnaDmrSyncPlayState(arg);
        mtvui_debug_log("dlnaDmrSyncPlayState("+arg+") return " + ret);
    }
    return ret;    
};
MtvObjRaw.prototype.getJumpSuperShopDemo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getJumpSuperShopDemo(arg);
        mtvui_debug_log("getJumpSuperShopDemo("+arg+") return " + res);
        return res;
    }
    return null;    
};
MtvObjRaw.prototype.pusGetFileInfo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.pusGetFileInfo(arg);
        mtvui_debug_log("pusGetFileInfo("+arg+") return " + res);
        return res;
    }
    return null;    
};
MtvObjRaw.prototype.pusSubmitStatus = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.pusSubmitStatus(arg);
        mtvui_debug_log("pusSubmitStatus("+arg+") return " + res);
        return res;
    }
    return null;    
};
MtvObjRaw.prototype.getPrimarySubtitleLanguage = function(){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getPrimarySubtitleLanguage('');
        if(res){
            res = JSON.parse(res);
            if(res.STATUS ==0) return res.ITEMS[0].TEXT;
        }
    }
    return null;
};
MtvObjRaw.prototype.getSecondarySubtitleLanguage = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getSecondarySubtitleLanguage('');
        if(res){
            res = JSON.parse(res);
            if(res.STATUS ==0) return res.ITEMS[0].TEXT;
        }
    }
    return null;
};
MtvObjRaw.prototype.getUsbScanStatus = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.getUsbScanStatus(arg);
        mtvui_debug_log("getUsbScanStatus("+arg+") return " + res);
        return res;
    }
    return null;    
};
MtvObjRaw.prototype.deleteMmpStopInfo = function(arg){
    this.getMmpService();
    if (this.mmpServices) {
        res = this.mmpServices.deleteMmpStopInfo(arg);
        mtvui_debug_log("deleteMmpStopInfo("+arg+") return " + res);
        return res;
    }
    return null;    
};

