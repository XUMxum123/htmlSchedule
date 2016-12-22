var MEDIA_FILE_TYPE = 4;
var labelName;
var focusTimeoutResult =  null;

var ChildNode = function() {
    this.parentInfo;
    this.mediaType;
    this.nodeInfo;
    this.nodeList;
    this.nodeNum;
}
;

ChildNode.prototype.clearInfo = function(){
    this.parentInfo = undefined;
    this.mediaType = undefined;
    this.nodeInfo = undefined;
    this.nodeList = [];
    this.nodeNum = 0;
};

ChildNode.prototype.getNodeNum = function(){
    if(this.parentInfo){
        if(curBrowserType == BrowserType.Usb){
            this.nodeNum = usbObj.getCbDbCount(this.mediaType, this.parentInfo.MEDIA_PATH);
        } else {
            this.nodeNum = parseInt(this.parentInfo.mediaInfo.subItemNum);
        }
    } else {
        this.nodeNum = 0;
    }
    console.log("fileObj.childNode.nodeNum = " + fileObj.childNode.nodeNum);
    return this.nodeNum;
};

ChildNode.prototype.getNodes = function(parent, isRootNode) {
    if(this.parentInfo == parent){
        console.log('this.parentInfo == parent');
        return;
    }
    this.nodeInfo = null;
    this.nodeNum = 0;
    this.nodeList = [];
    if(curBrowserType == BrowserType.Usb){
        if(isRootNode){
            setCurUsbPathInfo(parent);
            parent.MEDIA_TYPE = MEDIA_TYPE.Folder;
            parent.MEDIA_PATH = usbObj.USB_PATH;
            this.mediaType = MEDIA_TYPE.Folder;
        } else {
            this.mediaType = parent.MEDIA_TYPE;
        }

        if (this.mediaType >= MEDIA_TYPE.Folder) {
            this.nodeNum = usbObj.getCbDbCount(this.mediaType, parent.MEDIA_PATH);
            if (this.nodeNum > 0) {
                var count = (this.nodeNum > 10) ? 10 : this.nodeNum;
                this.nodeList = usbObj.getContentBrowserPageData(this.nodeList.length, count, this.mediaType, parent.MEDIA_PATH);
            }
        } else {
            this.nodeInfo = usbObj.getContentInfoByPath(this.mediaType,parent.MEDIA_PATH);
        }
    } else {
        var parentMediaName;
        parent.dlnaInfoStartIndex = 0;
        parent.dlnaInfoEndIndex = 0;
        if(isRootNode){
            parentMediaName = parent.SERVER_NAME;
            parent.devId = dlnaObj.dmpGetRealDevId(parent.DEV_ID);
            parent.objectId = 0;
            var instObj = dlnaObj.dmpCreateInstance(parent.devId, 0);
            parent.mediaInfo = dlnaObj.getDmpFileMediaInfo(instObj.instance);
            this.mediaType = instObj.mediaType;
            curMediaServer = parent;
        } else {
            parentMediaName = parent.mediaInfo.mediaName;
            this.mediaType = parent.mediaInfo.mediaType;
        }
            if(this.mediaType == DLNA_MEDIA_TYPE.Directory){
                console.log("parent.mediaInfo.subItemNum = " + parent.mediaInfo.subItemNum);
                this.nodeNum = parseInt(parent.mediaInfo.subItemNum);
                if(this.nodeNum > 0){
                    var count = (this.nodeNum > 10) ? 10 : this.nodeNum;
                    this.nodeList = dlnaObj.getDmpFilePageData(parent, count, this.nodeNum, 0);
                    console.log("parent.dlnaInfoEndIndex = " + parent.dlnaInfoEndIndex);
                }
            } else {
                this.nodeNum = 0;
                this.nodeInfo = parent.mediaInfo;
            }
    }
    this.parentInfo = parent;
}
;

var UsbPlayObj = function(){
    this.infoList;
    this.playIndex;
};

var DlnaPlayObj = function(){
    this.curMediaInfo;
    this.playIndex;
    this.DEV_ID;
};

var UsbMusicPlayObj = function(){
    this.infoList;
    this.playIndex;
};

var File_obj = function() {
    this.isRootNode;
    this.floderStack = [];
    this.curMediaInfo;
    this.totalNum;
    this.infoList;
    this.focusIndex;
    this.allMediaData = {};
    this.usbPlayObj = new UsbPlayObj();
    this.musicPlayObj = new UsbMusicPlayObj();
    this.dlnaMusicPlayObj = new DlnaPlayObj();
    this.childNode = new ChildNode();
    this.curFocusHighLight = 0;
}
;

File_obj.prototype.init = function(info, index) {
    if(typeof(index) != 'undefined'){
        this.focusIndex = index;
    } else {
        this.focusIndex = 0;
    }
    this.childNode.clearInfo();
    if(curBrowserType == BrowserType.Usb){
        this.totalNum = usbObj.getCbDbCount(MEDIA_TYPE.Folder, info.MEDIA_PATH);
        this.infoList = [];
        this.allMediaData = {};
        this.getOnePageInfo();

    } else {
        this.curMediaInfo.dlnaInfoEndIndex = 0;
        this.curMediaInfo.dlnaInfoStartIndex = 0;
        this.totalNum = parseInt(info.mediaInfo.subItemNum);
        this.infoList = [];
        this.getOnePageInfo();
    }

}
;

File_obj.prototype.initRoot = function(){
    this.isRootNode = true;
    this.focusIndex = 0;
    this.childNode.clearInfo();
    this.floderStack = [];
    this.curMediaInfo = null;
    if(curBrowserType == BrowserType.Usb){
        this.totalNum = usbMountList.length;
        this.infoList = usbMountList;
        if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'EU' || GLOBAL_MODE == 'AP')){
            for(var i = 0;i < this.infoList.length;i++){
                if(checkUsbDiskTypeByPath(this.infoList[i])){
                    this.infoList.splice(i,1);
                }
            }
        }
        if(curUsbPathInfo){
            for(idx in usbMountList){
                if(usbMountList[idx].PATH == curUsbPathInfo.PATH){            
                    this.focusIndex = parseInt(idx);
                    return;
                }
            }
        }
        
        this.totalNum = this.infoList.length;
        //setCurUsbPathInfo(this.infoList[this.focusIndex], scanDoneNotify);
    } else {
        this.totalNum = mediaServerList.length;
        this.infoList = mediaServerList;
        if(curMediaServer){
            for(idx in mediaServerList){
                if(mediaServerList[idx].DEV_ID == curMediaServer.DEV_ID){            
                    this.focusIndex = parseInt(idx);
                    return;
                }
            }
        }
    }
}
function checkUsbDiskTypeByPath(path){
    //step1 check disk file system.
    var macth = 0;
    var jsonobj = JSON.parse( mtvObj.checkUsbDiskTypeByPath(path.PATH));
    console.log(jsonobj);
    if(jsonobj && jsonobj.STATUS != 0){// is a ext4 file system disk.
        var totalNum = usbObj.getCbDbCount(MEDIA_TYPE.Folder, path.PATH);
        if(totalNum == 0){
            return true;
        }
        var fileList = new Array();
        while(totalNum>0){
            if (totalNum > 0) {
                var count = (totalNum > 10) ? 10 : totalNum;
                var getList = usbObj.getContentBrowserPageData(fileList.length, count, MEDIA_TYPE.Folder, path.PATH);
                
                fileList = fileList.concat(getList);
                totalNum -= count;
            }
        }
        for(var i = 0;i < fileList.length;i++){
            var fileNameArray = fileList[i].MEDIA_PATH.split("/");
            var fileName = fileNameArray[fileNameArray.length-1];
            if("tshift"==fileName){
                macth++;
            }
            if("lost+found"==fileName){
                macth++;
            }
        }        
    }
    if(macth >=2){
        return true;// for pvr disk
    }else{
        return false;
    }
    
    
}
File_obj.prototype.setFocusIndex = function(index) {
    this.focusIndex = index;
    this.childNode.getNodes(this.infoList[index], this.isRootNode);
}
;

File_obj.prototype.setBlurIndex = function(index){
    console.log("setBlurIndex index = " + index);
    if(this.infoList.length > index){
        if(this.infoList[index].instObj){
            console.log("this.infoList[index].instObj.instance = " + this.infoList[index].instObj.instance);
            dlnaObj.dmpDelInstance(this.infoList[index].instObj.instance);
        }
    }
}

File_obj.prototype.getOnePageInfo = function(isGetUsbCurData) {
    console.log("File_obj getOnePageInfo");
    if (!this.infoList) {
        this.infoList = [];
    }

    if(curBrowserType == BrowserType.Usb){
        if (this.infoList.length >= this.totalNum) {
            console.log("this.infoList.length >= this.totalNum return");
            return;
        }
        var count = (this.totalNum - this.infoList.length > 11) ? 11 : (this.totalNum - this.infoList.length);
        this.infoList = this.infoList.concat(usbObj.getFolderPageData(this.infoList.length, count, this.curMediaInfo.MEDIA_PATH, this.allMediaData));
    } else {
        if (this.curMediaInfo.dlnaInfoEndIndex >= this.totalNum) {
            console.log("this.infoList.length >= this.totalNum return");
            return;
        }
        var count = (this.totalNum - this.curMediaInfo.dlnaInfoEndIndex > 11) ? 11 : (this.totalNum - this.curMediaInfo.dlnaInfoEndIndex);
        this.infoList = this.infoList.concat(dlnaObj.getDmpFilePageData(this.curMediaInfo, count, this.totalNum, this.infoList.length));
    }
}
;
File_obj.prototype.getDlnaPrevInfo = function(reqCount){
    console.log("File_obj getDlnaPrevInfo");
    var ret = [];
    if(curBrowserType == BrowserType.Dlna && this.curMediaInfo){
        if(this.curMediaInfo.dlnaInfoStartIndex>0){
            if(reqCount > this.curMediaInfo.dlnaInfoStartIndex){
                reqCount = this.curMediaInfo.dlnaInfoStartIndex;
                this.curMediaInfo.dlnaInfoStartIndex = 0;
            } else {
                this.curMediaInfo.dlnaInfoStartIndex -= reqCount;
            }
            ret = dlnaObj.getDmpFilePageData(this.curMediaInfo, reqCount, this.totalNum, this.infoList.length, true);
            this.infoList = ret.concat(this.infoList);
           
        }
    }
     return ret;
};

File_obj.prototype.getDlnaShuffleList = function(startIndex){
    console.log("File_obj getDlnaShuffleList");
    if(curBrowserType == BrowserType.Dlna && this.curMediaInfo){
        if(startIndex < this.curMediaInfo.dlnaInfoStartIndex || startIndex > this.curMediaInfo.dlnaInfoEndIndex){
            var reqNum = 0;
            if(startIndex == 0){
                if(this.totalNum > 10){
                    reqNum = 10;
                } else {
                    reqNum = this.totalNum;
                }
            } else {
                if(this.totalNum - startIndex - 1 > 9){
                    this.curMediaInfo.dlnaInfoStartIndex = startIndex - 1;
                    reqNum = 11;
                } else {
                    var prevIdx = 10 - (this.totalNum - startIndex - 1);
                    if(prevIdx > startIndex){
                        this.curMediaInfo.dlnaInfoStartIndex = 0;
                        reqNum = this.totalNum;
                    } else {
                        this.curMediaInfo.dlnaInfoStartIndex = startIndex - prevIdx;
                        reqNum = 11;
                    }
                }
            }
            this.curMediaInfo.dlnaInfoEndIndex =  this.curMediaInfo.dlnaInfoStartIndex + reqNum - 1;
            this.infoList = dlnaObj.getDmpFilePageData(this.curMediaInfo, reqNum, this.totalNum, 0, true);
            setFileInfoList('file_folder_ul', fileObj.infoList);
            scroll1.refresh();
        }
        fileObj.focusIndex = (startIndex - this.curMediaInfo.dlnaInfoStartIndex);
        
        return this.infoList[(startIndex - this.curMediaInfo.dlnaInfoStartIndex)];

    }
};

File_obj.prototype.getContentInfoByType = function(reqCount){
    console.log("File_obj getContentInfoByType");
    if(curBrowserType == BrowserType.Usb){
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
        this.infoList = this.infoList.concat(usbObj.getFolderPageData(this.infoList.length, reqCount, this.curMediaInfo.MEDIA_PATH, this.allMediaData));
    } else {
        if (this.curMediaInfo.dlnaInfoEndIndex >= this.totalNum) {
            console.log("this.infoList.length >= this.totalNum return");
            return;
        }
        if(typeof(reqCount) == 'undefined'){
            reqCount = (this.totalNum - this.curMediaInfo.dlnaInfoEndIndex);
        }
        if(reqCount > (this.totalNum - this.curMediaInfo.dlnaInfoEndIndex)){
            reqCount = (this.totalNum - this.curMediaInfo.dlnaInfoEndIndex);
        }
        this.infoList = this.infoList.concat(dlnaObj.getDmpFilePageData(this.curMediaInfo, reqCount, this.totalNum, this.infoList.length));
    }
};

File_obj.prototype.changeNode = function(isNext) {
    console.log("changeNode");
    if(curBrowserType == BrowserType.Usb){
        if (isNext) {
            this.floderStack.push(this.infoList[this.focusIndex]);
            this.isRootNode = false;
            this.curMediaInfo = this.infoList[this.focusIndex];
            if(this.curMediaInfo){
                if(this.curMediaInfo.LABEL){
                    labelName = this.curMediaInfo.LABEL;
                }
            }
            this.init(this.curMediaInfo);
        } else {
            this.curMediaInfo = this.floderStack.pop();
            if(!this.curMediaInfo){
                return false;
            } else if (this.curMediaInfo.MEDIA_PATH == usbObj.USB_PATH) {
                this.initRoot();
            } else {
                var index = this.curMediaInfo.MEDIA_INDEX;
                var parentInfo = this.floderStack[this.floderStack.length - 1];
                this.curMediaInfo = parentInfo;
                this.init(parentInfo, index);
            }
        }
    } else {
        if(typeof(isNext) == 'undefined'){
            //refresh current path
            if(this.curMediaInfo){
                var instObj = dlnaObj.dmpCreateInstance(this.curMediaInfo.devId, this.curMediaInfo.objectId);
                if(instObj){
                    this.curMediaInfo.mediaInfo = dlnaObj.getDmpFileMediaInfo(instObj.instance);
                }
                this.init(this.curMediaInfo, this.focusIndex);
                if(this.infoList.length <= 0) {
                    this.initRoot();
                    return true;
                }
            }
            return true;
        }
        if (isNext) {
            console.log("changeNode isNext");
            this.infoList[this.focusIndex].MEDIA_INDEX = this.focusIndex;
            this.floderStack.push(this.infoList[this.focusIndex]);
            this.curMediaInfo = this.infoList[this.focusIndex];
            this.isRootNode = false;
            this.totalNum = this.childNode.nodeNum;
            this.infoList = this.childNode.nodeList;
            this.focusIndex = 0;
            if(this.infoList.length <= 0){
                this.init(this.curMediaInfo);
            }
        } else {
            this.curMediaInfo = this.floderStack.pop();
            if(!this.curMediaInfo){
                return false;
            } else {
            if(this.curMediaInfo.objectId== 0){
                console.log("initRoot");
                this.initRoot();
            } else {
                var index = this.curMediaInfo.MEDIA_INDEX;            
                var parentInfo = this.floderStack[this.floderStack.length - 1];
                var parentObjId = parentInfo.objectId;
                var parentDevId = parentInfo.mediaInfo.parentDevId;
                console.log("changeNode parentObjId = " + parentObjId+ ";parentDevId = "+parentDevId);
                this.curMediaInfo.devId = parentDevId;
                this.curMediaInfo.objectId = parentObjId;
                var instObj = dlnaObj.dmpCreateInstance(parentDevId, parentObjId);
                this.curMediaInfo.mediaInfo = dlnaObj.getDmpFileMediaInfo(instObj.instance);
                if(this.curMediaInfo.mediaInfo && this.curMediaInfo.mediaInfo.mediaType == 0){ // fix run CTT 7.2.11.4 lost focus
                    this.initRoot();
                    return true;
                }
                this.init(this.curMediaInfo, index);
            }
            }
        }
    }
    return true;
}
;

File_obj.prototype.getPlayIndex = function(mediaType){
    if(curBrowserType == BrowserType.Usb){
        if(mediaType == 2){
            return this.musicPlayObj.playIndex;
        } else {
            return this.usbPlayObj.playIndex;
        }
    } else {
        return this.focusIndex;
    }
};

File_obj.prototype.getShuffleItemInfo = function(mediaType, isRepeat){
    var ret = null;
    var startIndex;
    
    if(curBrowserType == BrowserType.Usb){
        if(mediaType == 2){
            if(isRepeat) {
                startIndex = getRandom(0, this.musicPlayObj.infoList.length - 1);
                console.log("File_obj getShuffleItemInfo startIndex = " + startIndex);
                ret = this.musicPlayObj.infoList[startIndex];
            } else {
                if( this.musicPlayObj.sortIndexArr.length > 0){
                    var listIndex = getRandom(0, this.musicPlayObj.sortIndexArr.length - 1);
                    startIndex = this.musicPlayObj.sortIndexArr[listIndex];
                    ret = this.musicPlayObj.infoList[startIndex];
                    this.musicPlayObj.sortIndexArr.splice(listIndex, 1);
                }
            }

        } else {
            if(isRepeat) {
                startIndex = getRandom(0, this.usbPlayObj.infoList.length - 1);
                
                ret = this.usbPlayObj.infoList[startIndex];
            } else {
                if( this.usbPlayObj.sortIndexArr.length > 0){
                    var listIndex = getRandom(0, this.usbPlayObj.sortIndexArr.length - 1);
                    startIndex = this.usbPlayObj.sortIndexArr[listIndex];
                    ret = this.usbPlayObj.infoList[startIndex];
                    this.usbPlayObj.sortIndexArr.splice(listIndex, 1);
                }
            }
        }
    } else {
        if(mediaType == 1 || mediaType == 3){
            if(isRepeat) {
                startIndex = getRandom(0, this.totalNum - 1);
                console.log("File_obj getShuffleItemInfo startIndex = " + startIndex);
                if(startIndex < this.infoList.length){
                    ret = this.infoList[startIndex];
                } else {
                    ret = dlnaObj.getPlayBackFileInfo(this.curMediaInfo, startIndex);
                }
                
            } else {
                if(this.sortIndexArr.length > 0){
                    var listIndex = getRandom(0, this.sortIndexArr.length - 1);
                    startIndex = this.sortIndexArr[listIndex];
                    if(startIndex < this.infoList.length){
                        ret = this.infoList[startIndex];
                    } else {
                        ret = dlnaObj.getPlayBackFileInfo(this.curMediaInfo, startIndex);
                    }
                    //ret = this.infoList[startIndex];
                    console.log("File_obj getShuffleItemInfo startIndex = " + startIndex);
                    this.sortIndexArr.splice(listIndex, 1);
                }
            }
        } else {
            if(isRepeat) {
                startIndex = getRandom(0, this.totalNum - 1);
                console.log("File_obj getShuffleItemInfo startIndex = " + startIndex);
                ret = this.getDlnaShuffleList(startIndex);
            } else {
                if(this.sortIndexArr.length > 0){
                    var listIndex = getRandom(0, this.sortIndexArr.length - 1);
                    startIndex = this.sortIndexArr[listIndex];
                    ret = this.getDlnaShuffleList(startIndex);
                    this.sortIndexArr.splice(listIndex, 1);
                }
            }
        }

    }
    return ret;
};

File_obj.prototype.usbPlayInit = function(mediaType, playIndex){
    if(this.infoList.length < this.totalNum){
        fileObj.getContentInfoByType();
    }

    if(mediaType == 2){
        this.musicPlayObj.infoList = this.allMediaData[mediaType];
        this.musicPlayObj.playIndex = playIndex;
        this.musicPlayObj.sortIndexArr = [];
        for(var i = 0; i < this.musicPlayObj.infoList.length; i++){
            this.musicPlayObj.sortIndexArr[i] = i;
        }
        this.musicPlayObj.sortIndexArr.splice(playIndex, 1);
    } else {
        this.usbPlayObj.infoList = this.allMediaData[mediaType];
        this.usbPlayObj.playIndex = playIndex;
        this.usbPlayObj.sortIndexArr = [];
        for(var i = 0; i < this.usbPlayObj.infoList.length; i++){
            this.usbPlayObj.sortIndexArr[i] = i;
        }
        this.usbPlayObj.sortIndexArr.splice(playIndex, 1);
    }
};

File_obj.prototype.getPlayInfo = function(paramObj){
    var isNext = paramObj.isNext;
    var isRepeat = paramObj.isRepeat;
    var mediaType = paramObj.mediaType;
    var isShuffle  = paramObj.isShuffle;
    var isPlayAll = paramObj.isPlayAll;
    console.log("File_obj getPlayInfo isNext = " + isNext+";isRepeat = " + isRepeat+";isShuffle = " + isShuffle+";mediaType = " +mediaType);
    ret = null;
    if(curBrowserType == BrowserType.Usb){
        var playInfoObject;
        if(mediaType == 2){
            playInfoObject = this.musicPlayObj;
        } else {
            playInfoObject = this.usbPlayObj;
        }
        if(typeof(isNext) == 'undefined'){
            
            this.usbPlayInit(mediaType, fileObj.infoList[this.focusIndex].PLAY_INDEX);
            ret = playInfoObject.infoList[playInfoObject.playIndex];
        } else if(isShuffle){
            ret = this.getShuffleItemInfo(mediaType, isRepeat);
        } else {
        if(isNext){
            var tempIndex = playInfoObject.playIndex;
            if(tempIndex + 1 < playInfoObject.infoList.length){
                playInfoObject.playIndex++;
                ret = playInfoObject.infoList[playInfoObject.playIndex];
            } else if(isRepeat) {
                playInfoObject.playIndex = 0;
                ret = playInfoObject.infoList[playInfoObject.playIndex];
            }
        } else {
            if(playInfoObject.playIndex > 0){
                playInfoObject.playIndex--;
                ret = playInfoObject.infoList[playInfoObject.playIndex];
            } else if(isRepeat && isPlayAll){
                playInfoObject.playIndex = playInfoObject.infoList.length - 1;
                ret = playInfoObject.infoList[playInfoObject.playIndex];
            }
        }
        
        } 
        if(ret){
            fileObj.focusIndex = ret.MEDIA_INDEX;
        }
    } else {
        if(mediaType == 2 && this.dlnaMusicPlayObj.curMediaInfo.objectId != this.curMediaInfo.objectId){
            var totalNum = this.dlnaMusicPlayObj.curMediaInfo.mediaInfo.subItemNum;
            var temp;
            if(typeof(isNext) == 'undefined'){
                console.log("typeof(isNext) == 'undefined'");
            } else if(isShuffle){
                if(isRepeat) {
                    temp = getRandom(0, totalNum - 1);
                } else {
                    if(this.sortIndexArr.length > 0){
                        var listIndex = getRandom(0, this.sortIndexArr.length - 1);
                        temp = this.sortIndexArr[listIndex];
                        this.sortIndexArr.splice(listIndex, 1);
                    }
                }
            } else {
                if(isNext) {
                    if(this.dlnaMusicPlayObj.curMediaInfo.playIndex+1 < totalNum){
                        temp = this.dlnaMusicPlayObj.curMediaInfo.playIndex+1;
                    } else if(isRepeat){
                        temp = 0;
                    }
                } else {
                    if(this.dlnaMusicPlayObj.curMediaInfo.playIndex > 0){
                        temp = this.dlnaMusicPlayObj.curMediaInfo.playIndex-1;
                    }
                    
                }
            }
            if(typeof temp != 'undefined'){
                this.dlnaMusicPlayObj.curMediaInfo.playIndex = temp;
                ret = dlnaObj.getPlayBackFileInfo(this.dlnaMusicPlayObj.curMediaInfo, temp);
            }
            return ret;
        }
        var listIndex = this.focusIndex;
        if(typeof(isNext) == 'undefined'){
            this.sortIndexArr = [];
            for(var i = 0; i < this.totalNum; i++){
                this.sortIndexArr[i] = i;
            }
            this.sortIndexArr.splice(listIndex, 1);
            ret = this.infoList[this.focusIndex];
        } else if(isShuffle){
            var temp = this.getShuffleItemInfo(mediaType, isRepeat);
            if(temp){
                switch(mediaType){
                    case 1:
                    dlnaObj.getPhotoFileInfo(temp);
                    break;
                }
                ret = temp;
            }

        } else {
            if(isNext) {
                if(listIndex+1 < this.totalNum){
                    this.focusIndex++;
                    if(this.focusIndex >= this.infoList.length){
                        fileObj.getOnePageInfo();
                        setFileInfoList('file_folder_ul',fileObj.infoList,Number($('#file_folder_ul').find('li').length));
                    }
                    if(mediaType == 1){
                        dlnaObj.getPhotoFileInfo(this.infoList[this.focusIndex]);
                    }
                    ret = this.infoList[this.focusIndex];
                } else if(isRepeat){
                    this.focusIndex = 0;
                    if(mediaType == 1){
                        dlnaObj.getPhotoFileInfo(this.infoList[this.focusIndex]);
                    }
                    ret = this.infoList[this.focusIndex];
                }
            } else {
                if(listIndex > 0){
                    this.focusIndex--;
                    if(mediaType == 1){
                        dlnaObj.getPhotoFileInfo(this.infoList[this.focusIndex]);
                    }
                    ret = this.infoList[this.focusIndex];
                }
            }
        }
        if(mediaType == 2){
            this.dlnaMusicPlayObj.playIndex = this.focusIndex;
        }
        if(ret && ret.MEDIA_INDEX){
            console.log("ret.MEDIA_INDEX = " +ret.MEDIA_INDEX);
            fileObj.focusIndex = ret.MEDIA_INDEX;
        }

    }
    return ret;
};

File_obj.prototype.resetData = function(jsonData) {
    this.totalNum = jsonData.totalNum;
    this.infoList = jsonData.infoList;
    this.focusIndex = jsonData.focusIndex;
    this.childNode.parentInfo = jsonData.childNode.parentInfo;
    this.childNode.mediaType = jsonData.childNode.mediaType;
    this.childNode.nodeInfo = jsonData.childNode.nodeInfo;
    this.childNode.nodeList = jsonData.childNode.nodeList;
    this.childNode.nodeNum = jsonData.childNode.nodeNum;
}
;
var fileObj = new File_obj();

function scanDoneNotify(isNeedRef){
    if(isNeedRef){
        fileObj.childNode.getNodes(fileObj.infoList[fileObj.focusIndex], fileObj.isRootNode);
        change_current_path();
    }
    waitLoading(false);
}

function initFile(refresh){
    console.log("initFile");
    clearFocusTimeoutResult();
    if(typeof(refresh) == 'undefined'){
        fileObj.initRoot();
    }
    change_current_path();
    waitLoading(false);
}

function refreshRootList(isChangeCurServer){
    console.log("refreshRootList");
    if(typeof(isChangeCurServer) == 'undefined'){
        isChangeCurServer = false;
    }
    if(top_menu_selected_id == "top_menu_3"){
        if(isChangeCurServer || fileObj.isRootNode){
            initFile();
        }
    }
}

function dmsFileUpdate(mediaInfo){
    if((fileObj.curMediaInfo && fileObj.curMediaInfo.mediaInfo.fileObjId == mediaInfo.fileObjId)
        || fileObj.infoList[fileObj.focusIndex].mediaInfo.fileObjId == mediaInfo.fileObjId
        || fileObj.infoList[fileObj.focusIndex].mediaInfo.fileObjId == mediaInfo.parentId){
        initFile(true);
    }
}

function change_current_path(isNext) {
    console.log("change_current_path");
    if(focusTimeoutResult){
        console.log("focusTimeoutResult is true,don't change node return");
        return;
    }

    var needRefresh = true;
    if (typeof(isNext) != 'undefined') {
        if ((isNext && fileObj.childNode.nodeList.length > 0) || !isNext) {
            needRefresh = fileObj.changeNode(isNext);
        } else {
            needRefresh = false;
        }
    } else if(curBrowserType == BrowserType.Dlna) {
        needRefresh = fileObj.changeNode();
    }
    if (needRefresh) {
        doRefreshLayout();
    }
}

function doRefreshLayout(){
    scroll1.scrollTo(0, 0, 0);
    change_folder_nav();
    setFileInfoList('file_folder_ul', fileObj.infoList);
    switch_file_layout();
    scroll1.refresh();
    if(fileObj.infoList.length > 0){
        if(!fileObj.isRootNode && fileObj.focusIndex >= (fileObj.infoList.length - 1)){
            fileObj.getContentInfoByType(fileObj.focusIndex - (fileObj.infoList.length - 2));
            setFileInfoList('file_folder_ul', fileObj.infoList);
        }
        if(fileObj.infoList.length < Number(fileObj.focusIndex)+1){
            console.log("fileObj.infoList.length < fileObj.focusIndex+1");
            fileObj.focusIndex = 0;
        }
        fileScrollToElement(fileObj.focusIndex, true);
        if(needFocus()){
            $('#file_folder_ul li:nth-child(' + (Number(fileObj.focusIndex) + 1)+ ')').focus();
            if(mtvuiUtil.isMenuShow()){
                mtvuiUtil.storeFocus();
                mtvuiUtil._menuFrame.focus();
            }
        }
    }
}

function needFocus(){
    if(contentBrowserObj.curShowMode == contentBrowserObj.ShowMode.Browser || 
        (contentBrowserObj.curShowMode == contentBrowserObj.ShowMode.MusicPlay && !isDispatchToPlayer)){
        if(!isDialogShow())    {
            return true;
        }
    }
    return false;
}

function setFileInfoList(showId, fileList, startIndex) {
    if(typeof showId == 'string'){
        if (typeof (startIndex) == 'undefined') {
            $('#' + showId).html('');
            startIndex = 0;
        }
    } else {
        startIndex = 0;
    }

    for (var ints = startIndex; ints < fileList.length; ints++) {
        var ico_class = undefined;
        var class_info;
        if(curBrowserType == BrowserType.Usb){
            type = Number(fileList[ints].MEDIA_TYPE)
        } else {
            if(fileObj.isRootNode && showId == 'file_folder_ul'){
                type = 6;
            } else {
                type = Number(fileList[ints].mediaInfo.mediaType);
            }
        }
        
        switch (type) {
           case 1:
                ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Photo_HL.png'>";
                break;
            case 2:
                ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Music_HL.png'>";
                break;
            case 3:
                ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Video_HL.png'>";
                break;
            case 4:
                if(curBrowserType == BrowserType.Usb){
                    ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Folder_HL.png'>";
                }
                break;
            case 6:
                if(curBrowserType == BrowserType.Dlna){
                    ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Folder_HL.png'>";
                }
                break;
            }
            if(type == 0){
                return ;
            }
            if(typeof(ico_class) == 'undefined'){
                ico_class = "<img src='../Assets/Contents_Browser/_Contents_Browser_Icons/List_Folder_HL.png'>";
            }
        var item = null;
        var id;
        if(typeof showId == 'string'){
            id = showId + ints;
        } else {
            id = showId.attr('id') + ints;
        }
        
        var filePath_forPlay;
        if(curBrowserType == BrowserType.Usb){
            if(fileList[ints].PATH){
                if(fileList[ints].LABEL != ""){
                    item_name = fileList[ints].LABEL;
                } else {
                    var info = usbObj.getUsbProductInfo(fileList[ints].DEV);
                    console.log(info);
                    var res = JSON.parse(info);
                    if(res && res.ITEMS[0] && res.ITEMS[0].TEXT){
                        labelName = res.ITEMS[0].TEXT;
                        item_name = labelName;
                        fileList[ints].LABEL = labelName;
                    }else{
                        var path = fileList[ints].PATH;
                        var lastStr=path.substring(path.length-1);
                        console.log("lastStr = " + lastStr);
                        if(lastStr == "/"){
                            path = path.substring(0,path.length-1);
                        }
                        item_name = getTranslate('USB Device')+" "+ path.substring(path.lastIndexOf("/") + 1).charAt(2).toLocaleUpperCase();
                        labelName = item_name;
                        fileList[ints].LABEL = item_name;
                    }
                }
                
                filePath_forPlay = fileList[ints].PATH;
            } else {
                item_name = fileList[ints].MEDIA_PATH.substring(fileList[ints].MEDIA_PATH.lastIndexOf("/") + 1);
                filePath_forPlay = fileList[ints].MEDIA_PATH;
            }
            item = $('<li id="'+ id + '" filePath = "'+filePath_forPlay+'" tabindex = "0" onfocus=\'file_music_list_focus(true, "' + id + '");\' onblur=\'file_music_list_focus(false, "' + id + '");\' ><div class=\'music_name_p\'>'
            + ico_class + '<div style="display: inline;overflow: hidden;width: 308px;text-align: left;float: right;"><span id="span_'+id+'" class="show_scroll" >' + item_name + '</span></div></div></li>');

        } else {
            if(!fileList[ints].mediaInfo || (fileObj.isRootNode && showId == 'file_folder_ul')){
                item_name = fileList[ints].SERVER_NAME;
            } else {
                item_name = fileList[ints].mediaInfo.mediaName;
            }
            item = $('<li id="'+ id + '" filePath = "'+fileList[ints].objectId+'"  tabindex = "0" onfocus=\'file_music_list_focus(true, "' + id + '");\' onblur=\'file_music_list_focus(false, "' + id + '");\' ><div class=\'music_name_p\'>'
            + ico_class + '<div style="display: inline;overflow: hidden;width: 308px;text-align: left;float: right;"><span id="span_'+id+'" class="show_scroll" >' + item_name + '</span></div></div></li>');
        }
        if(typeof showId == 'string'){
             $("#" + showId).append(item);
        } else {
            item.insertBefore(showId);
        }
       
    }
}

function change_folder_nav() {
    if(curBrowserType == BrowserType.Usb){
        var previous_foilder_name;
        var before_previous_foilder_name;
        
        if(fileObj.curMediaInfo){
            var current_array = fileObj.curMediaInfo.MEDIA_PATH.split("/");
            var root_array = usbObj.USB_PATH.split("/");
            if(current_array.length - root_array.length >= 1){
                previous_foilder_name = current_array[current_array.length -1];
                before_previous_foilder_name = current_array[current_array.length -2];
                if((current_array.length - root_array.length) == 1){
                    $("#before_previous_foilder").find("img").attr("src","../Assets/_Icons/ISL_Icons/Usb_TR.png");
                    $("#previous_foilder").find("img").attr("src","../Assets/Contents_Browser/_Contents_Browser_Icons/Folder_Nor_Sel.png");
                    before_previous_foilder_name = labelName;
                }else{
                    $("#before_previous_foilder").find("img").attr("src","../Assets/Contents_Browser/_Contents_Browser_Icons/Folder_Nor_Sel.png");
                    $("#previous_foilder").find("img").attr("src","../Assets/Contents_Browser/_Contents_Browser_Icons/Folder_Nor_Sel.png");
                }
                
                
            } else {
                //previous_foilder_name = current_array[current_array.length -1];
                previous_foilder_name  = labelName;
                if(!previous_foilder_name){
                    previous_foilder_name = current_array[current_array.length -1];
                }
                before_previous_foilder_name = getTranslate('USB Device');
                $("#before_previous_foilder").find("img").attr("src","../Assets/_Icons/ISL_Icons/Usb_TR.png");
                if((current_array.length - root_array.length) == 0){
                    $("#previous_foilder").find("img").attr("src","../Assets/_Icons/ISL_Icons/Usb_TR.png");
                    before_previous_foilder_name = null;
                }else{
                    $("#previous_foilder").find("img").attr("src","../Assets/Contents_Browser/_Contents_Browser_Icons/Folder_Nor_Sel.png");
                }
                
            }
            
        } else {
            previous_foilder_name = getTranslate('USB Device');
            $("#previous_foilder").find("img").attr("src","../Assets/_Icons/ISL_Icons/Usb_TR.png");
            before_previous_foilder_name = null;
        }
        
        if (before_previous_foilder_name) {
            showOrHideNav(2);
        } else {
            showOrHideNav(1);
        }
        $("#previous_foilder").find("p").html(previous_foilder_name);
        $("#before_previous_foilder").find("p").html(before_previous_foilder_name);
    } else {
        if(!fileObj.curMediaInfo){
            showOrHideNav(0);
        } else {
            if(fileObj.curMediaInfo.objectId ==0){
                showOrHideNav(1);
                $("#previous_foilder").find("p").html(curMediaServer.SERVER_NAME);
            } else {
                showOrHideNav(2);
                console.log("fileObj.curMediaInfo.objId = " + fileObj.curMediaInfo.objectId)
                $("#previous_foilder").find("p").html(fileObj.curMediaInfo.mediaInfo.mediaName);
                var prevTemp = fileObj.floderStack[fileObj.floderStack.length - 2];
                if(prevTemp.objectId ==0){
                    $("#before_previous_foilder").find("p").html(prevTemp.SERVER_NAME);
                } else {
                    $("#before_previous_foilder").find("p").html(prevTemp.mediaInfo.mediaName);
                }
                
            }
        }
    }

}

function showOrHideNav(type) {
    switch(type){
        case 0:
            $("#vertical_line1").hide();
            $("#vertical_line2").hide();
            $("#vertical_line3").hide();
            $("#before_previous_foilder").hide();
            $("#previous_foilder").hide();
        break
        case 1:
            $("#vertical_line1").hide();
            $("#vertical_line2").show();
            $("#vertical_line3").show();
            $("#before_previous_foilder").hide();
            $("#previous_foilder").show();
        break;
        case 2:
            $("#vertical_line1").show();
            $("#vertical_line2").show();
            $("#vertical_line3").show();
            $("#before_previous_foilder").show();
            $("#previous_foilder").show();
        break;
    }
}

function file_key_dispatch_dom_vk_return(id, playAll) {
    console.log("file_key_dispatch_dom_vk_return id = " + id);
    if(!id)
        return;
    //clearFocusTimeoutResult();
    var index = $('#'+id).index();
    if(fileObj.indexFocus){
        if(fileObj.indexFocus != index){
            console.log("fileObj.indexFocus : "+fileObj.indexFocus+" != index : "+index);
            index =  fileObj.indexFocus;
        }
    }
    var itemInfo = fileObj.infoList[index];
    var meidaType ;
    if(curBrowserType == BrowserType.Usb){
        meidaType = itemInfo.MEDIA_TYPE;
    } else {
        meidaType = itemInfo.mediaInfo.mediaType;
    }
    
    console.log("[fileBrowser  file_do_return] meidaType:" + meidaType);
    playAll = (typeof(playAll) == 'undefined') ? false : playAll;
    switch (Number(meidaType)) {
        case 1:
        clearFocusTimeoutResult();
        contentBrowserObj.playPhoto(fileObj, playAll);
        endLoadingAnimate();
        break;
        case 2:
        fileObj.curSourceType = (curBrowserType == BrowserType.Usb) ? SourceType.Usb : SourceType.Dmp;
        if(curBrowserType == BrowserType.Dlna){
            fileObj.dlnaMusicPlayObj.curMediaInfo = clone(fileObj.curMediaInfo);
            fileObj.dlnaMusicPlayObj.DEV_ID = curMediaServer.DEV_ID;
        }
        contentBrowserObj.playMusic(fileObj, null, playAll);
        break;
        case 3:
        clearFocusTimeoutResult();
        if(curBrowserType == BrowserType.Usb){
            fileObj.curSourceType = SourceType.Usb;
        } else {
            if(curMediaServer.dmsType == DMS_TYPE.MultiRoom){
                fileObj.curSourceType = SourceType.MultiRoom;
                playAll = false;
            } else {
                fileObj.curSourceType = SourceType.Dmp;
            }
        }
        contentBrowserObj.playVideo(fileObj, fileObj.curSourceType, playAll);
        endLoadingAnimate();
        break;
        case 4:
        case 5:
        if(curBrowserType == BrowserType.Usb){
            change_current_path(true);
        }
        break;
        case 6:
        if(curBrowserType == BrowserType.Dlna){
            change_current_path(true);
        }
        default:
            break;
    }

}
function playDLNAVideo(playAll){
    contentBrowserObj.playVideo(fileObj, null, playAll);
}

function switch_file_layout(layout_type){
    switch(layout_type){
        case 'list':
            $("#file_prompt_p").hide();
            $("#file_list_two_info").hide();
            $("#music_list").show();
        break;
        case 'info':
            $("#file_prompt_p").hide();
            $("#music_list").hide();
            $("#file_list_two_info").show();
        break;
        case 'prompt':
            $("#music_list").hide();
            $("#file_list_two_info").hide();
            $("#file_prompt_p").show();
        break;
        default:
            $("#file_prompt_p").hide();
            $("#music_list").hide();
            $("#file_list_two_info").hide();
        break;
    }
}
function show_thumbnail_info(index) {
    try{
        console.log("show_thumbnail_info index = " + index);
        focusTimeoutResult = null;
        var itemInfo = fileObj.infoList[index];
        fileObj.setFocusIndex(index);
        if(curBrowserType == BrowserType.Usb){
            meidaType = itemInfo.MEDIA_TYPE;
        } else {
            meidaType = itemInfo.mediaInfo.mediaType;
        }
        switch (Number(meidaType)) {
            case 1:
                setItemColorKey($('#footer').find('li')[1], 'Play All');
                if(curBrowserType != BrowserType.Usb){
                    dlnaObj.getPhotoFileInfo(itemInfo);
                }
                show_thumbnail_info_picture(fileObj.childNode.nodeInfo);
                break;
            case 2:
                setItemColorKey($('#footer').find('li')[1], 'Play All');
                show_thumbnail_info_music(fileObj.childNode.nodeInfo);
                if(curBrowserType == BrowserType.Usb){
                    startGetShowThumbnail(fileObj.childNode.nodeInfo.MEDIA_PATH, meidaType);
                }
                break;
            case 3:
                setItemColorKey($('#footer').find('li')[1], 'Play All');
                musicPlayObj.stopMusic(true);//get video thumbnail,if play music need to stop music play
                show_thumbnail_info_video(fileObj.childNode.nodeInfo);
                if(curBrowserType == BrowserType.Usb){
                    startGetShowThumbnail(fileObj.childNode.nodeInfo.MEDIA_PATH, meidaType);
                }
                break;
            case 4:
            if(curBrowserType == BrowserType.Usb){
                show_thumbnail_info_folder(fileObj.childNode.nodeList);
            }
            break;
            case 5:
            if(curBrowserType == BrowserType.Usb){
                show_thumbnail_info_folder(fileObj.childNode.nodeList);
            }
            break;
            case 6:
            if(curBrowserType == BrowserType.Dlna){
                show_thumbnail_info_folder(fileObj.childNode.nodeList);
            }
            break;
            default:
            //TODO:
            if(curBrowserType == BrowserType.Dlna && fileObj.isRootNode){
                if(itemInfo.statusType && itemInfo.statusType ==  DMS_STATUS_TYPE.OfflineWakable){
                    // TODO wakeup
                    switch_file_layout('prompt');
                    $('#file_prompt_p').html(getTranslate('QT_SERVER_OFFLINE_WAKE_UP'));
                    return;
                }
            }
            switch_file_layout();
            break;
            }
    }catch (e) {
        console.log(e);
    } finally {
        if(curBrowserType == BrowserType.Dlna){
            endLoadingAnimate();
        }
    }
}

var getShowThumbnail_t = null;
function startGetShowThumbnail(path, type){
    if(getShowThumbnail_t){
        clearTimeout(getShowThumbnail_t);
        getShowThumbnail_t = null;
    }
    getShowThumbnail_t = setTimeout("get_show_thumbnail('"+path+"',"+type+")", 2000);
}

function get_show_thumbnail(path, type){
    var defImg = "";
    switch(type){
        case 2:
        defImg = "../Assets/Contents_Browser/_Music_Browser/MUSIC_AlbumLayout_default_icon.png";
        break;
        case 3:
        defImg = "../Assets/Contents_Browser/_Movie_Browser/movie-icon-HL.png";
        break;
    }
    getThumbnail({MEDIA_PATH:path,width:224,height:224,MEDIA_TYPE:type,id:'file_thumbnail_img',needWait:false,defaultImg:defImg});
    getShowThumbnail_t = null;
}

function show_thumbnail_info_folder(listInfo) {
    switch_file_layout('list');
    if (!listInfo || listInfo.length <= 0) {
        if(curBrowserType == BrowserType.Dlna){
            switch_file_layout('prompt');
            $('#file_prompt_p').html(getTranslate('QT_MEDIA_NO_SHARE_CONTENT'));
        } else {
            $("#music_list").hide();
            $('#file_list_two').html('');
        }
        endLoadingAnimate();
        return;
    }
    setFileInfoList("file_list_two", listInfo);
    endLoadingAnimate();
}

function show_thumbnail_info_music(thumbnail_info) {
    try{
        switch_file_layout('info');
        if (!thumbnail_info) {
            $("#file_list_two_info").hide();
            return;
        }
        if(curBrowserType == BrowserType.Usb){
            setDefaultMetadataInfo(2);
            var htmlShow = "";
            if (thumbnail_info.TITLE) {
                htmlShow += "<p class='metadate-style'>"+getTranslate("DP_TITLE") + thumbnail_info.TITLE + "</p>";
            } else {
                if(thumbnail_info.MEDIA_PATH){
                    if(thumbnail_info.MEDIA_PATH){
                        var song_title_temp = thumbnail_info.MEDIA_PATH.substring(thumbnail_info.MEDIA_PATH.lastIndexOf("/") + 1);
                        htmlShow += " <p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME") + song_title_temp + "</p>";
                    }else{
                        htmlShow += " <p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+"</p>";
                    }
                }
            }
            if (thumbnail_info.ARTIST) {
                htmlShow += "<p  class='metadate-style'>"+getTranslate("SB_ARTIST")+ thumbnail_info.ARTIST + "</p>";
            }else{
                htmlShow += "<p  class='metadate-style'>"+getTranslate("SB_ARTIST")+getTranslate("EVT_OTHERS")+"</p>";
            }
            if (thumbnail_info.ALBUM) {
                htmlShow += "<p class='metadate-style'>"+getTranslate("QT_MEDIA_ALBUM")+":" + thumbnail_info.ALBUM + "</p>";
            }else{
                htmlShow += "<p  class='metadate-style'>"+getTranslate("QT_MEDIA_ALBUM")+":"+getTranslate("EVT_OTHERS")+"</p>";
            }
            $('#file_thumbnail_img').attr('src','');
            var durationTime  = getTimeByDuration(thumbnail_info.DURATION );
            if(durationTime){
                htmlShow += "<p  class='metadate-style'>"+getTranslate("DP_DURATION")+ durationTime+ "</p>";
            }else{
                htmlShow += "<p  class='metadate-style'>"+getTranslate("DP_DURATION")+"</p>";
            }
            if( thumbnail_info.DATE) {
                if(thumbnail_info.DATE.YEAR && thumbnail_info.DATE.MONTH && thumbnail_info.DATE.DAY){
                    htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+ thumbnail_info.DATE.YEAR + "/" + thumbnail_info.DATE.MONTH+ "/" + thumbnail_info.DATE.DAY+"</p>";
                }
            }else{
                htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+"</p>";
            }
            //getThumbnail({MEDIA_PATH:thumbnail_info.MEDIA_PATH,width:226,height:226,MEDIA_TYPE:2,id:'file_thumbnail_img',needWait:false,defaultImg:"../Assets/Contents_Browser/_Music_Browser/MUSIC_AlbumLayout_default_icon.png"});
            $("#file_list_two_p").empty().append(htmlShow);
            setTimeout('showFIleListTwoInfo()',800);
        } else {
            var artist_name_temp = "";
            var album_name_temp = "";
            if (thumbnail_info.mediaArtist.length > 0) {
                artist_name_temp = "<p  class='metadate-style'>"+getTranslate("SB_ARTIST") + thumbnail_info.mediaArtist + "</p>";
            }
            if (thumbnail_info.mediaAlbum.length > 0) {
                album_name_temp = "<p class='metadate-style'>"+getTranslate("QT_MEDIA_ALBUM") +":"+ thumbnail_info.mediaAlbum + "</p>";
            }
            $('#file_thumbnail_img').css('width','198px');
            $('#file_thumbnail_img').css('height','196px');
            $('#file_thumbnail_img').attr('src','../Assets/Contents_Browser/_Music_Browser/music-icon-Big.png');
            $("#file_list_two_p").empty().append("<p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":"+ thumbnail_info.mediaName+thumbnail_info.mediaExtension + "</p>"
            + artist_name_temp + album_name_temp
            + "<p class='metadate-style'>"+getTranslate("DP_DURATION")+ thumbnail_info.mediaDuration + "</p>"
            + "<p class='metadate-style'>"+getTranslate("DP_DT")+  getFormatDate(thumbnail_info.mediaDate) + "</p>").show();
            showFIleListTwoInfo();
            }
    }catch (e) {
        console.log(e);
    }
}
function showFIleListTwoInfo(){
    hideDefaultMetadata();
    $("#file_list_two_info").show();
}
function show_thumbnail_info_picture(thumbnail_info) {
    try{
    switch_file_layout('info'); 
    if (!thumbnail_info) {
        $("#file_list_two_info").hide();
        return;
    }
    $('#file_thumbnail_img').attr('src','');
    if(curBrowserType == BrowserType.Usb){
            setDefaultMetadataInfo(1);
        getThumbnail({MEDIA_PATH:thumbnail_info.MEDIA_PATH,width:224,height:224,MEDIA_TYPE:1,id:'file_thumbnail_img',needWait:false,defaultImg:"../Assets/Contents_Browser/_Photo_Browser/Picture_icon.png"});
        var htmlShow = "";
        if(thumbnail_info.MEDIA_PATH){
            htmlShow += "<p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":"+ thumbnail_info.MEDIA_PATH.substring(thumbnail_info.MEDIA_PATH.lastIndexOf("/") + 1) + "</p>"
        }else{
            htmlShow += "<p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":"+"</p>"
        }
        if( thumbnail_info.MEDIA_PATH) {
            var splitPath = thumbnail_info.MEDIA_PATH.split("/");
            htmlShow += "<p class='metadate-style'>"+getTranslate("QT_MEDIA_FOLDER")+":"+splitPath[splitPath.length-2] + "</p>";
        }else{
            htmlShow += "<p class='metadate-style'>"+getTranslate("QT_MEDIA_FOLDER")+":"+"</p>";
        }
        if( thumbnail_info.DATE) {
            htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+ thumbnail_info.DATE.YEAR + "-" + thumbnail_info.DATE.MONTH+ "-" + thumbnail_info.DATE.DAY + " " + thumbnail_info.DATE.HOUR+ ":" + thumbnail_info.DATE.MINUTE+ ":" + thumbnail_info.DATE.SECOND+  "</p>";
        }else{
            htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+"</p>";
        }
        if( thumbnail_info.WIDTH && thumbnail_info.HEIGHT) {
            htmlShow += "<p class='metadate-style'>"+getTranslate("DP_SZ")+ thumbnail_info.WIDTH + "x" + thumbnail_info.HEIGHT + "</p>";
        }else{
            htmlShow += "<p class='metadate-style'>"+getTranslate("DP_SZ")+"</p>";
        }
            $("#file_list_two_p").empty().append(htmlShow);
            
            setTimeout('showFIleListTwoInfo()',800);
    } else {
        $('#file_thumbnail_img').css('width','');
        $('#file_thumbnail_img').css('height','');
        var mediaResolution = thumbnail_info.mediaResolution;
        var array = mediaResolution.split('x');
        //var img = drawImage({WIDTH:array[0],HEIGHT:array[1],MEDIA_PATH:thumbnail_info.localPath}, 226);
        //$('#file_thumbnail_img').attr('src',thumbnail_info.localPath+'?' + Math.random());
        getThumbnail({MEDIA_PATH:thumbnail_info.localPath,width:224,height:224,MEDIA_TYPE:1,id:'file_thumbnail_img',needWait:false,defaultImg:""});
        $("#file_list_two_p").empty().append("<p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":"+ thumbnail_info.mediaName+thumbnail_info.mediaExtension + "</p>\
                <p class='metadate-style'>"+getTranslate("QT_RESOLUTION")+":"+ mediaResolution + "</p>\
                <p class='metadate-style'>"+getTranslate("DP_DT")+ getFormatDate(thumbnail_info.mediaDate) + "</p>"
        ).show();
        showFIleListTwoInfo();
        }
    }catch (e) {
        console.log(e);
    }

}

function show_thumbnail_info_video(thumbnail_info) {
    try{
        switch_file_layout('info');
        if (!thumbnail_info) {
            $("#file_list_two_info").hide();
            return;
        }
        if(curBrowserType == BrowserType.Usb){
                setDefaultMetadataInfo(3);
            var htmlShow = "";
            $('#file_thumbnail_img').attr('src','');
            //getThumbnail({MEDIA_PATH:thumbnail_info.MEDIA_PATH,width:224,height:224,MEDIA_TYPE:3,id:'file_thumbnail_img',needWait:false,defaultImg:"../Assets/Contents_Browser/_Movie_Browser/movie-icon-HL.png"});
            if (thumbnail_info.TITLE) {
                htmlShow += "<p class='metadate-style'>"+getTranslate("DP_TITLE") + thumbnail_info.TITLE + "</p>";
            }  else {
                if(thumbnail_info.MEDIA_PATH){
                    var song_title_temp = thumbnail_info.MEDIA_PATH.substring(thumbnail_info.MEDIA_PATH.lastIndexOf("/") + 1);
                    htmlShow += " <p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":"+ song_title_temp + "</p>";
                }else{
                    htmlShow += " <p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":</p>";
                    }
                }
            if (thumbnail_info.SIZE || thumbnail_info.SIZE == 0) {
                if(Math.ceil(thumbnail_info.SIZE/(1024*1024)) > 1024){
                    var sizeVideo = thumbnail_info.SIZE/(1024*1024*1024);
                    htmlShow += "<p class='metadate-style'>"+getTranslate("DP_SZ") + sizeVideo.toFixed(2) + "GB</p>";
                }else{
                    var sizeVideo = thumbnail_info.SIZE/(1024*1024);
                    htmlShow += "<p class='metadate-style'>"+getTranslate("DP_SZ") + sizeVideo.toFixed(2)  + "MB</p>";
                }
            } 
            if( thumbnail_info.DATE) {
                if(thumbnail_info.DATE.YEAR && thumbnail_info.DATE.MONTH && thumbnail_info.DATE.DAY){
                    htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+""+ thumbnail_info.DATE.YEAR + "/" + thumbnail_info.DATE.MONTH+ "/" + thumbnail_info.DATE.DAY+"</p>";
                }
            }else{
                htmlShow += "<p class='metadate-style'>"+getTranslate("DP_DT")+"</p>";
            }
                $("#file_list_two_p").empty().append(htmlShow);
                setTimeout('showFIleListTwoInfo()',800);
                
        } else {
            var mediasize = "";
            if(curMediaServer.dmsType != DMS_TYPE.MultiRoom || thumbnail_info.mediaSize != 0){
                mediasize = " <p  class='metadate-style'>"+getTranslate("DP_SZ") + bytesToMb(thumbnail_info.mediaSize) + "</p>";
            }

            var mediaduation = "";
            if(curMediaServer.dmsType != DMS_TYPE.MultiRoom || thumbnail_info.mediaDuration != ""){
                mediaduation = " <p class='metadate-style'>"+getTranslate("DP_DURATION")+thumbnail_info.mediaDuration +"</p>";
            }

            var mediadate = "";
            if(curMediaServer.dmsType == DMS_TYPE.MultiRoom && thumbnail_info.mediaDate.year == 0 && thumbnail_info.mediaDate.month == 0 && thumbnail_info.mediaDate.day == 0 && 
                thumbnail_info.mediaDate.hour == 0 && thumbnail_info.mediaDate.minute == 0 && thumbnail_info.mediaDate.second == 0){
                mediadate = "";
            } else {
                mediadate = " <p class='metadate-style'>"+getTranslate("DP_DT")  + getFormatDate(thumbnail_info.mediaDate) +"</p>"
            }
            $('#file_thumbnail_img').css('width','72px');
            $('#file_thumbnail_img').css('height','58px');
            $('#file_thumbnail_img').attr('src','../Assets/Contents_Browser/_Movie_Browser/movie-icon-N.png');
            $("#file_list_two_p").empty().append(" <p class='metadate-style'>"+getTranslate("QT_MEDIA_FILE_NAME")+":" + thumbnail_info.mediaName+thumbnail_info.mediaExtension + '</p>'
            + mediasize + mediaduation + mediadate
            ).show();
            showFIleListTwoInfo();
        }
    }catch (e) {
        console.log(e);
    }
}



function file_key_dispatch(isup, e) {
    console.log("file_key_dispatch id= " + e.target.id);
    var id = e.target.id;
    if (id == "") {
        return;
    }
    if(dmsWakeupDialog){
        dms_wakeup_key_dispatch(isup, event);
        return;
    }
    var content = document.getElementById(id);
    var focus_id;
    
    var keynum = e.which || e.keyCode;
    if (!isup) {
        return;
    }
    switch (keynum) {
    case KeyEvent.DOM_VK_LEFT:
        change_current_path(false);
        break;
    case KeyEvent.DOM_VK_UP:
        var content = $(e.target).prev();
        if (content.length > 0) {
            var index = $(e.target).index();
             if(curBrowserType == BrowserType.Dlna && index == 1){
            if(fileObj.curMediaInfo && fileObj.curMediaInfo.dlnaInfoStartIndex > 0){
                
               setFileInfoList($('#file_folder_ul li:first'), fileObj.getDlnaPrevInfo(8));
                scroll1.refresh();
            }
        }
            var down_index = content.index();
            console.log("down_index = " + down_index);
            fileScrollToElement(down_index,true);
            content.focus();
        
        } else if(curBrowserType == BrowserType.Usb){
            if(musicPlayObj.curDisplayMode <= musicDisplayMode.fullPlay){
                reset_top_menu_focus();
            }
        }
        break;
    case KeyEvent.DOM_VK_DOWN:
        var index = $(e.target).index();
        if( fileObj.infoList &&   fileObj.infoList.length && fileObj.infoList.length <= (index + 2) && (fileObj.infoList.length < fileObj.totalNum)){
            var strIndex = fileObj.infoList.length;
            fileObj.getOnePageInfo();
            setFileInfoList('file_folder_ul', fileObj.infoList, strIndex);
            scroll1.refresh();
        }
        var content = $(e.target).next();
        if (content.length > 0) {
            fileScrollToElement(content.index(), false);
            content.focus();
        }
        break;
    case KeyEvent.DOM_VK_RETURN:
        if(curBrowserType == BrowserType.Dlna && fileObj.isRootNode){
            var itemInfo = fileObj.infoList[$(e.target).index()];
            if(itemInfo.statusType && itemInfo.statusType ==  DMS_STATUS_TYPE.OfflineWakable){
                // TODO wakeup
                console.log("do wake up");
                console.log("fileObj.infoList[fileObj.focusIndex].DEV_ID = " + itemInfo.DEV_ID);
                dlnaObj.dlnaDmpWakeupDms(itemInfo.DEV_ID);
                return;
            }
        }
    case KeyEvent.DOM_VK_RIGHT:
        file_key_dispatch_dom_vk_return(e.target.id);
        break;
    case KeyEvent.DOM_VK_PLAY:
        var index = $('#'+e.target.id).index();
        var itemInfo = fileObj.infoList[index];
        var meidaType ;
        if(curBrowserType == BrowserType.Usb){
            meidaType = itemInfo.MEDIA_TYPE;
        } else {
            meidaType = itemInfo.mediaInfo.mediaType;
        }
        if(meidaType == 2 && musicPlayObj.curDisplayMode != musicDisplayMode.none){
            musicPlayObj.music_player_key_dispatch(isup, e);
            return;
        }
        if(meidaType == 1 || meidaType == 2 || meidaType == 3){
            file_key_dispatch_dom_vk_return(e.target.id, true);
        }
    break;
    
    }
}

function dmsWakeupBtnClick(position){
    if(position == 1){
        console.log("do wake up");
        dmsWakeupDialog.close().remove();
        dmsWakeupDialog = null;
        console.log("fileObj.infoList[fileObj.focusIndex].DEV_ID = " + fileObj.infoList[fileObj.focusIndex].DEV_ID);
        dlnaObj.dlnaDmpWakeupDms(fileObj.infoList[fileObj.focusIndex].DEV_ID);
    } else {
        dmsWakeupDialog.close().remove();
        dmsWakeupDialog = null;
    }
    
}

function file_music_list_focus(isFocus, id) {
    if (isFocus) {
        var index = $("#" + id).index();
        focus_level = 3;
        player_item_focus(false);
        var pos = $('#' + id).offset();
        $(".file_list_div_focus").show();
        $(".file_list_div_focus").css('top', pos.top - 208);

        setTimeout(function(){
            if(curBrowserType == BrowserType.Usb){
                if(usbMountList.length>1){
                    usbColorKeyData[3] = {"show":true,"name":"USB Device"};
                }else{
                    usbColorKeyData[3] = {"show":true,"name":""};
                }
            }
            initColorKeyBar((curBrowserType == BrowserType.Usb) ? usbColorKeyData : dlnaColorKeyData);},300);

           
        fileObj.childNode.clearInfo();
        clearPvTag();
        clearFocusTimeoutResult();
        focusAfter500Action();
        fileObj.focusIndex = index;
        if(curBrowserType == BrowserType.Usb){
            var  mediaType = fileObj.infoList[fileObj.focusIndex].MEDIA_TYPE;
            if(!mediaType){
                mediaType = 4;
            }
             switch (Number(mediaType)) {
                case 1:
                case 2:
                case 3:
                    switch_file_layout();
                break;
            }
        } else {
            switch_file_layout();
        }
        console.log("file_music_list_focus index = " + index);
        var timeout = 800;
        if(curBrowserType == BrowserType.Dlna && fileObj.isRootNode){
            timeout = 1500;
        }
        focusTimeoutResult = setTimeout("show_thumbnail_info("+index+")", timeout);
        //$("#span_"+id).css("display","inline-flex");
        marqueeObj.startScroll('span_'+id);

    } else {
          $(".file_list_div_focus").hide();
        //$("#span_"+id).css("display","inline");
        marqueeObj.stopScroll();// clear when focus lost
    }
}

function clearFocusTimeoutResult(isReset){
    if(focusTimeoutResult){
        clearTimeout(focusTimeoutResult);
        focusTimeoutResult = null;
    }
    if(getShowThumbnail_t){
        clearTimeout(getShowThumbnail_t);
        getShowThumbnail_t = null;
    }
    clearFocusAfter500Action();
}

function handleFileCommonKey(e) {
    console.log("handleFileCommonKey");
    if(dmsWakeupDialog){
        dms_wakeup_key_dispatch(true, event);
        return;
    }
    var keynum = e.which || e.keyCode;
    switch (keynum) {
    case KeyEvent.DOM_VK_BACK:
        if(isDialogShow()){
            closeDialog();
            change_current_path();
            return;
        }
        handleBackKey();
        break;
    case KeyEvent.DOM_VK_RED:
        var text = $($('#footer').find('li')[1]).text();
        if (text == '') {
            return;
        }
        //play all
        file_key_dispatch_dom_vk_return(document.activeElement.id, true);
        break;
    case KeyEvent.DOM_VK_YELLOW:
         getUsbList();
        break;
    case KeyEvent.DOM_VK_BLUE:
        goToHelpPage();
        break;
    case KeyEvent.DOM_VK_OPTION:
        var text = $($('#footer').find('li')[5]).text();
        if (isDialogShowById('option_dialog')) {
            closeDialog();
            change_current_path();
            return;
        } else if (text == '') {
            return;
        }
        closeDialog();
        var opttionArray = ALL_OPTION_DATA["Folder"];
        if((curBrowserType == BrowserType.Dlna) && fileObj.isRootNode){
            if(opttionArray.length<6){
                opttionArray.push(CLEAR_OFF_DMS);
            }
        } else {
            if(opttionArray.length>=6){
                opttionArray.splice(5,1);
            }
        }
        showOptionDialog("Folder", folderOptionNotify, opttionArray);
        break;
    case KeyEvent.DOM_VK_STOP:
    case KeyEvent.DOM_VK_PAUSE:
    case KeyEvent.DOM_VK_FAST_FWD:
    case KeyEvent.DOM_VK_REWIND:
        if (musicPlayObj.curDisplayMode != musicDisplayMode.none) {
            musicPlayObj.handleMusicPlayerKey(event);
        }
        break;
    case KeyEvent.DOM_VK_LIST:
        if(isDialogShow()){
            closeDialog();
        }
        reset_top_menu_focus();
    break;
    case KeyEvent.DOM_VK_TRACK_NEXT:
    case KeyEvent.DOM_VK_CH_INCREASE: //CH+
    handleCHKey(false,e);
    break;
    case KeyEvent.DOM_VK_TRACK_PREV:
    case KeyEvent.DOM_VK_CH_DECREASE: //Ch-
    handleCHKey(true,e);
    break;
    }
}

function folderOptionNotify(key, valueIndex, itemObj){
    switch(key){
        case CLEAR_OFF_DMS.name.replace(new RegExp(" ","g"),'_'):
        dlnaObj.dlnaDmpClearOffDms(0);
        scanMediaServer();
        break;
    }
}

function getUsbList(){
    console.log("DOM_VK_YELLOW");
    var text = $($('#footer').find('li')[3]).text();
    console.log('text = ' + text);
    if (isDialogShowById('colorkey_dialog_3')) {
        closeDialog();
        change_current_path();
        return;
    } else if (text == '') {
        return;
    }
    closeDialog();
    color_focus_bg = color_focus_bg_list[2];
    var listContent = "";
    if(curBrowserType == BrowserType.Usb){
        var length = 0;
        for (i in usbMountList) {
            if(!checkUsbDiskTypeByPath(usbMountList[i])){
                var showUsbName ;
                if(usbMountList[i].LABEL){
                    showUsbName = usbMountList[i].LABEL;
                }else{
                    showUsbName = usbMountList[i].DEV;
                }
                length++;
                var id = "color_bar_list_" + length;
                listContent += '<li tabindex="1" id="' + id + '" onfocus="color_bar_item_focus(true,\'' + id + '\');" onblur="color_bar_item_focus(false,\'' + id + '\');" data-key-enter="switchMediaServer(\'' + usbMountList[i].PATH + '\');" class=\'color_key_list_li\'>' + showUsbName + '</li>';
            }
        }
        showColorKeyDialog(3, listContent, length);
    }else{
        var focusIdx = 0;
        for (i in mediaServerList) {
            var id = "color_bar_list_" + i;
            listContent += '<li tabindex="1" id="' + id + '" onfocus="color_bar_item_focus(true,\'' + id + '\');" onblur="color_bar_item_focus(false,\'' + id + '\');" data-key-enter="switchMediaServer(\'' + mediaServerList[i].DEV_ID + '\');" class=\'color_key_list_li\'>' + mediaServerList[i].SERVER_NAME + '</li>';
            if(mediaServerList[i].DEV_ID == curMediaServer.DEV_ID){
                focusIdx = i;
            }
        }
        showColorKeyDialog(3, listContent, mediaServerList.length, focusIdx);
    }
}

function switchMediaServer(switchDevId){
    console.log("switchMediaServer switchDevId = " + switchDevId);
    if(curBrowserType == BrowserType.Usb){

        switch (top_menu_selected_id) {
        case 'top_menu_0':
        case 'top_menu_1':
        case 'top_menu_2':

            for(idx in usbMountList){
                if(usbMountList[idx].PATH == switchDevId ){            
                    setCurUsbPathInfo(usbMountList[idx]);
                    initialDataLoading (top_menu_selected_id);

                    return;
                }
            }
            break;
        case 'top_menu_3':
            for(idx in usbMountList){
                if(usbMountList[idx].PATH == switchDevId ){            
                    if(!fileObj.isRootNode){
                        initFile();
                    }
                    doFocus('file_folder_ul'+idx);
                    return;
                }
            }
            break;

        default:
            break;
        }
        
    }else{
        for(idx in mediaServerList){
            if(mediaServerList[idx].DEV_ID == switchDevId && mediaServerList[idx].DEV_ID != curMediaServer.DEV_ID){
                curMediaServer = mediaServerList[idx];
                initFile();
                return;
            }
        }
    }
    
}
function setDefaultMetadataInfo(type){
/*    if(type == undefined){
        return;
    }*/
    return;// for cr 723548
    switch (type) {
    case 1://picture
        $("#file_list_two_info_music").hide();
        $("#file_list_two_info_video").hide();
        $("#file_list_two_info_picture").show();
        
        break;
    case 2://music
        $("#file_list_two_info_picture").hide();
        $("#file_list_two_info_video").hide();
        $("#file_list_two_info_music").show();
        
        break;
    case 3://video
        $("#file_list_two_info_picture").hide();
        $("#file_list_two_info_music").hide();
        $("#file_list_two_info_video").show();
        
        break;

    default:
        break;
    }
}
function hideDefaultMetadata(){
    $("#file_list_two_info_picture").hide();
    $("#file_list_two_info_music").hide();
    $("#file_list_two_info_video").hide();
}

function getTimeByDuration(duration){
    if(duration){
        try{
            var Lduration = Number(duration);
            Lduration = Lduration/1000;
            var time = Math.floor(Lduration/60);
            var second = Lduration%60;
            return time+":"+second;
        }catch (e) {
            console.error(e);
        }
    }
}
function fileBackKeyHandle(){
    if(!fileObj.curMediaInfo && (curBrowserType == BrowserType.Usb)){
        reset_top_menu_focus();
    }else if(fileObj.focusIndex >= 0){
        change_current_path(false);
    }
}

function fileScrollToElement(scrollIndex,isUp){//do scroll
    if(scrollIndex != undefined && !isNaN(scrollIndex)){
        scrollIndex = parseInt(scrollIndex);
        var ret;
        if(isUp){// up key
            ret = scrollStep(document.querySelector('#file_list_one_layout li:nth-child(' + (Number(scrollIndex) + 1) + ')'), scroll1, (scrollIndex&&fileObj.infoList.length>10)?true:false);
        }else{// down key
            ret = scrollStep(document.querySelector('#file_list_one_layout li:nth-child(' + (Number(scrollIndex) + 1) + ')'), scroll1);
        }

        if(!isNaN(ret)){
            $('#file_folder_ul li:nth-child('+(Number(scrollIndex) - ret +1)+')').css('color','gray');
            $('#file_folder_ul li').eq(scrollIndex + (10-ret)).css('color','gray');
            $('#file_folder_ul li:lt('+(scrollIndex + (10-ret))+')li:gt('+(scrollIndex - ret<0?0:(scrollIndex - ret))+')').css('color','white');
            if(scrollIndex == 0){
                $('#file_folder_ul li:nth-child(1)').css('color','white');    
            }
        }

    }
}
function addMusicPlayingStyle(path){
    removeMusicPlayingStyle();
    console.log("addMusicPlayingStyle path = "+path);
    
    var musicPlayIndex = getMusicItemIndex(path);
    while(fileObj.infoList.length < fileObj.totalNum && musicPlayIndex == -1){
        fileObj.getOnePageInfo();
        musicPlayIndex = getMusicItemIndex(path);
    }
    if(musicPlayIndex != -1){
        fileObj.focusIndex = $("#file_folder_ul").find("[filePath='"+path+"']").index();
    }
    $("#file_folder_ul").find("[filePath='"+path+"']").addClass("file_item_selected");
        
}
function getMusicItemIndex(path){
    return $("#file_folder_ul").find("[filePath='"+path+"']").index();
}
function removeMusicPlayingStyle(){
    $("#file_folder_ul>li").removeClass("file_item_selected");
}
var timeResult500 = null
function focusAfter500Action(){
    if(timeResult500 != null){
        clearTimeout(timeResult500);
    }
    timeResult500 = setTimeout("startLoadingAnimate()",500);
}
function clearFocusAfter500Action(){
    if(timeResult500 != null){
        clearTimeout(timeResult500);
    }
}
function startLoadingAnimate(){
    console.log("startLoadingAnimate");
    $("#loading_wait").show();
    $('#loading_wait').find('div').addClass('watting');
}

function endLoadingAnimate(){
    $("#loading_wait").hide();
    $('#loading_wait').find('div').removeClass('watting');
}

function removeDlnaMusicPlayStyle(){
    $('#file_folder_ul .file_item_selected').removeClass('file_item_selected');
}