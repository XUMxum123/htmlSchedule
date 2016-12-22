var VideoPlayObj = function(){
    this.option_data_attr = ALL_OPTION_DATA["Movie Player"];
    this.handle;
    this.hidebar_t = null;
    this.hideBottombar_t;
    this.playBtnLenth = 1000;
    this.mediaSeek_t = null;
    this.startSeekTime = -1;
    this.mediaDuration = 0;
    this.currentPos = 0;
    this.mediaInfo;
    this.isPlayAll = false;
    this.shuffle = false;
    this.playObj;
    this.isPlayDone;
    this.curPlayInfo;
};

VideoPlayObj.prototype.getRepeat = function (){
    var repeat = Repeat;
    if(repeat.curValue == 0){
        return false;
    } else {
        return true;
    }
};

VideoPlayObj.prototype.hidebar = function() {
    console.log("hidebar id = ");
    if(playStatus != MmpPlayStatus.Speed){
        $('#video_player_bg').fadeOut();
    }
};

VideoPlayObj.prototype.timeout = function (isStop) {
    if (null  != this.hidebar_t) {
        clearTimeout(this.hidebar_t);
        this.hidebar_t = null;
    }
    if(!isStop){
        this.hidebar_t = setTimeout("videoPlayObj.hidebar()", 5000);
    }
}

VideoPlayObj.prototype.showBottombar= function() {
    console.log("showBottombar");
    $('#video_play_footer').fadeIn();
    if (null  != this.hideBottombar_t) {
        clearTimeout(this.hideBottombar_t);
    }
    this.hideBottombar_t = setTimeout("videoPlayObj.hideBottombar()", 2000);
}

VideoPlayObj.prototype.hideBottombar = function () {
    console.log("hideBottombar = ");
    $('#video_play_footer').fadeOut();
}

VideoPlayObj.prototype.showMediaBar = function(){
    if(isStopInfoDialogShow()){
        console.log("showMediaBar return");
        return;
    }
    $('#video_player_bg').fadeIn();
    videoPlayObj.timeout();
    videoPlayObj.timeupdate();
    if (!this.isVideoDialogShow()) {
        $('#btnVideoPlay').focus();
    }
}

function video_play_key_dispatch(event) {
    console.log("video_play_key_dispatch");
    var keynum = event.which || event.keyCode;
    if ($('#video_player_bg').css('display') == 'none') {
        if (keynum != KeyEvent.DOM_VK_INFO) {
            videoPlayObj.showMediaBar();
        }
    } else {
        videoPlayObj.timeout();
    }
    if(videoPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0){
        console.log("videoPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0");
        return;
    }
    
    switch (keynum) {
    case KeyEvent.DOM_VK_RETURN:
        videoPlayObj.key_dispatch(true, event);
        break;
    case KeyEvent.DOM_VK_0:
    case KeyEvent.DOM_VK_1:
    case KeyEvent.DOM_VK_2:
    case KeyEvent.DOM_VK_3:
    case KeyEvent.DOM_VK_4:
    case KeyEvent.DOM_VK_5:
    case KeyEvent.DOM_VK_6:
    case KeyEvent.DOM_VK_7:
    case KeyEvent.DOM_VK_8:
    case KeyEvent.DOM_VK_9:
    if (pvrDialog && pvrDialog != null ) {
        pvr_rating_blocked_key_dispatch(true, event);
    }
    break;
    case KeyEvent.DOM_VK_TRACK_PREV:
    case KeyEvent.DOM_VK_TRACK_NEXT:
    case KeyEvent.DOM_VK_BLUE:
    // do nothing
    break;
    default:
        videoPlayObj.handleCommonKey(event);
        break;
    }
}

function  video_player_red_keydown(event){
    var keynum = event.which || event.keyCode;
    if ($('#video_player_bg').css('display') == 'none') {
        if (keynum != KeyEvent.DOM_VK_INFO) {
            videoPlayObj.showMediaBar();
        }
    } else {
        videoPlayObj.timeout();
    }
    switch(keynum){
        case KeyEvent.DOM_VK_LIST:
        if(videoPlayObj.playObj.curSourceType == SourceType.Pvr){
            mtvuiUtil.procSysKey(KeyEvent.DOM_VK_LIST);
            return true;
        } else {
            return false;
        }
        break;
        case KeyEvent.DOM_VK_UP:
        case KeyEvent.DOM_VK_DOWN:
        case KeyEvent.DOM_VK_LEFT:
        case KeyEvent.DOM_VK_RIGHT:
        videoPlayObj.key_dispatch(true, event);
        break;
        case KeyEvent.DOM_VK_RED:
        case KeyEvent.DOM_VK_BLUE:
        case KeyEvent.DOM_VK_TRACK_PREV:
        case KeyEvent.DOM_VK_TRACK_NEXT:
        if(videoPlayObj.playObj.curSourceType == SourceType.Dmr){
            return true;
        }
        videoPlayObj.handleCommonKey(event);
        break;
    }
    return true;
}

VideoPlayObj.prototype.key_dispatch = function (isup, e) {
    var keynum = e.which || e.keyCode;
    
    if (isDialogShow()) {
        if (isOptionDialogShow()) {
            if (isup) {
                option_key_dispatch(e);
            }
        }
        return;
    } else if (pvrDialog && pvrDialog != null ) {
        if(isup){
            pvr_rating_blocked_key_dispatch(isup, e);
        }
        return;
    } else if (stopInfoDialog && stopInfoDialog != null ) {
        if(isup){
            dms_wakeup_key_dispatch(isup, e);
        }
        return;
    }
    
    switch (keynum) {
    case KeyEvent.DOM_VK_RETURN:
        this.playpause();
        break;
    case KeyEvent.DOM_VK_LEFT:
        if(videoPlayObj.playObj.curSourceType != SourceType.MultiRoom){
            this.doMediaSeek(true);
        }
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if(videoPlayObj.playObj.curSourceType != SourceType.MultiRoom){
            this.doMediaSeek(false);
        }
        break;
    /*
    case KeyEvent.DOM_VK_DOWN:
        if( videoPlayObj.playObj.curSourceType == SourceType.Pvr){
            playbackOperator(this.handle, playbackCommand.seekTime, 0);
            this.playpause(true);
        }
        break;*/
    }

}

var TIME_SEEK_LONG = 10000;
VideoPlayObj.prototype.doMediaSeek = function(isBack){
    if(playStatus == MmpPlayStatus.Speed){
        console.log("doMediaSeek playStatus == MmpPlayStatus.Speed return");
        return;
    }
    if(this.startSeekTime == -1){
        this.startSeekTime = this.currentPos;
    }
    if(isBack){
        if(this.startSeekTime > TIME_SEEK_LONG){
            this.startSeekTime -= TIME_SEEK_LONG;
        } else {
            this.startSeekTime = 0;
        }
    } else {
        if(this.mediaDuration - this.startSeekTime > TIME_SEEK_LONG){
            this.startSeekTime += TIME_SEEK_LONG;
        } else {
            this.startSeekTime = this.mediaDuration;
        }
    }
    if(this.mediaSeek_t){
        clearTimeout(this.mediaSeek_t);
        this.mediaSeek_t = null;
    }
    this.mediaSeek_t = setTimeout("videoPlayObj.timeSeek()", 500);
}

VideoPlayObj.prototype.timeSeek = function (){
    console.log("startSeekTime time = "+this.startSeekTime);
    playbackOperator(this.handle, playbackCommand.seekTime, parseInt(this.startSeekTime/1000));
    this.startSeekTime = -1;
    this.mediaSeek_t = null;
}

var slowBarDispearTimeOutResult = null;
/*Deal with Color key */
VideoPlayObj.prototype.handleCommonKey = function (e) {
    console.log("VideoPlayObj this.handleCommonKey");
    var keynum = e.which || e.keyCode;
    if (bottomBarKeyList.indexOf(keynum) !== -1 && keynum != KeyEvent.DOM_VK_INFO) {
        this.showBottombar();
    }
    switch (keynum) {
    case KeyEvent.DOM_VK_INFO:
        if(videoPlayObj.playObj.curSourceType == SourceType.Dmr){
            if(isDialogShowById('metedata_dialog')) {
                closeDialog();
                return;
            } else {
                var content = '<tr><td>'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + videoPlayObj.curPlayInfo.mediaName + '</td></tr>\
                        <tr><td >'+ getTranslate("Size")+'</td><td>' + bytesToMb(videoPlayObj.curPlayInfo.mediaSize) + '</td></tr>\
                        <tr><td>'+ getTranslate("Date")+'</td><td>' + getFormatDlnaDate(videoPlayObj.curPlayInfo.mediaDate) + '</td></tr>';
                showMetedataDialog("Movie", content);
            }
            return;
        }
        if ($('#video_player_bg').css('display') != 'none') {
            this.hidebar();
           this.hideBottombar();
        } else {
            this.showMediaBar();
            this.showBottombar();
        }
        break;
    case KeyEvent.DOM_VK_RED:
        content = $('#video_play_footer').find('li')[1];
        var info = $(content).text();
        console.log("DOM_VK_RED info = " + info);
        if(info == ''){
            return;
        }
        if(this.isPlayAll){
            setItemColorKey(content, PlayAll[1]);
            this.isPlayAll = false;
        } else {
            setItemColorKey(content, PlayAll[0]);
            this.isPlayAll = true;
        }
        break;
    case KeyEvent.DOM_VK_GREEN:
        //sort
        content = $('#video_play_footer').find('li')[2];
        var info = $(content).text();
        console.log("DOM_VK_GREEN info = " + info);
        if(info == ''){
            return;
        }
        if(!this.shuffle){
            Shuffle.curValue = 1;
            this.shuffle = true;
            setItemColorKey(content, Shuffle.value[0]);
        } else {
            Shuffle.curValue = 0;
            this.shuffle = false;
            setItemColorKey(content, Shuffle.value[1]);
        }
        localStorage.setItem(Shuffle.name, Shuffle.curValue);
        break;
    case KeyEvent.DOM_VK_YELLOW:
        break;
    case KeyEvent.DOM_VK_BLUE:
        var text = $($('#video_play_footer').find('li')[4]).text();
        console.log('text = ' + text);
        if (text == '') {
            return;
        }
        goToHelpPage();
        break;
    case KeyEvent.DOM_VK_CC:
    case KeyEvent.DOM_VK_SUBTITLE:
        if(videoPlayObj.playObj.curSourceType != SourceType.SuperShop 
            && videoPlayObj.playObj.curSourceType != SourceType.MultiRoom){
            showOption(0);
        }
        break;
    case KeyEvent.DOM_VK_OPTION:
        showOption(0);
        break;
    case KeyEvent.DOM_VK_BACK:
        if (isDialogShowById('option_dialog') || isDialogShowById('status_dialog')) {
            closeDialog();
            return;
        }
        if(videoPlayObj.playObj.curSourceType == SourceType.SuperShop){
            mtvuiUtil.gotoSysPage("sys_index");
        } else if(videoPlayObj.playObj.curSourceType != SourceType.Dmr 
            && videoPlayObj.playObj.curSourceType != SourceType.MultiRoom){
            this.playStop();
        }
        break;
    case KeyEvent.DOM_VK_STOP:
        this.playStop();
        break;
    case KeyEvent.DOM_VK_PAUSE:
        this.playpause(false);
        break;
    case KeyEvent.DOM_VK_FAST_FWD:
    if(videoPlayObj.playObj.curSourceType == SourceType.Dmp 
        || videoPlayObj.playObj.curSourceType == SourceType.Dmr){
            if(MmpPlayStatus.Pause == playStatus ||MmpPlayStatus.SlowSpeed  ==  playStatus){
                playbackOperator(this.handle, playbackCommand.sf);
            }else{
                 playbackOperator(this.handle, playbackCommand.ff);
            }
    } else {
        playbackOperator(this.handle, playbackCommand.ff);
    }

        break;
    case KeyEvent.DOM_VK_REWIND:
    if(videoPlayObj.playObj.curSourceType == SourceType.Dmp 
        || videoPlayObj.playObj.curSourceType == SourceType.Dmr){
        if(MmpPlayStatus.Pause == playStatus || MmpPlayStatus.SlowSpeed  ==  playStatus){
                playbackOperator(this.handle, playbackCommand.sr);
            }else{
                playbackOperator(this.handle, playbackCommand.fr);
            }
    } else{
        playbackOperator(this.handle, playbackCommand.fr);
    }
       
        break;
    case KeyEvent.DOM_VK_PLAY:
        if(isStopInfoDialogShow()){
            console.log("KeyEvent.DOM_VK_PLAY return");
            return;    
        }
        if(MmpPlayStatus.Play != playStatus){
            this.playpause(true);
        }
        break;
    case KeyEvent.DOM_VK_TRACK_NEXT:
    case KeyEvent.DOM_VK_CH_INCREASE: //CH+
    if(videoPlayObj.playObj.curSourceType == SourceType.Usb || videoPlayObj.playObj.curSourceType == SourceType.Dmp
        || videoPlayObj.playObj.curSourceType == SourceType.MultiRoom){
        this.playMode('next');
    }
    break;
    case KeyEvent.DOM_VK_TRACK_PREV:
    case KeyEvent.DOM_VK_CH_DECREASE: //Ch-
        if(videoPlayObj.playObj.curSourceType == SourceType.Pvr){
            playbackOperator(this.handle, playbackCommand.seekTime, 0);
            this.playpause(true);
        } else if(videoPlayObj.playObj.curSourceType == SourceType.Usb || videoPlayObj.playObj.curSourceType == SourceType.Dmp){
            if(videoPlayObj.currentPos > 4000){
                playbackOperator(this.handle, playbackCommand.seekTime, 0);
            } else{
                this.playMode('prev');
            }
        } else if(videoPlayObj.playObj.curSourceType == SourceType.MultiRoom){
            this.playMode('prev');
        }
    break;
    case KeyEvent.DOM_VK_LIST:
    if(videoPlayObj.playObj.curSourceType == SourceType.Usb || videoPlayObj.playObj.curSourceType == SourceType.Dmp){
        this.playStop();
    }
    break;
    }
};

function showOption(index){
    if (isDialogShowById('option_dialog')) {
        closeDialog();
        return;
    }
    closeDialog();
    if(videoPlayObj.playObj.curSourceType == SourceType.Pvr
        || videoPlayObj.playObj.curSourceType == SourceType.Pus){
            Subtitles.value[2] = Automatic[0];
            if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
                Subtitles.value[2] = Automatic[1];
                translateBeforewords.Subtitles='OPTION_CC';
                translateBeforewords['Subtitles Language']='CC';
                translateBeforewords['Subtitles On'] = 'OPTION_UAM_HI_ON';
                translateBeforewords['Subtitles Off'] = 'OPTION_UAM_HI_OFF';
            }
        showOptionDialog("Option", videoOptionNotify, PVR_OPTTION_DATA, index);
    } else if(videoPlayObj.playObj.curSourceType == SourceType.Dmp
        || videoPlayObj.playObj.curSourceType == SourceType.MultiRoom
        || videoPlayObj.playObj.curSourceType == SourceType.Dmr){
        Subtitles.value[2] = Automatic[1];
        showOptionDialog("Movie Player", videoOptionNotify, DLNA_OPTTION_DATA, index);
    } else {
        Subtitles.value[2] = Automatic[1];
        var subItem = Subtitles_Language.value[Subtitles_Language.curValue];
        if(subItem && subItem.external){
            if(Subtitle_Setting.value.length<4){
                Subtitle_Setting.value.push(Time_Offset);
            }
        } else {
            if(Subtitle_Setting.value.length>=4){
                Subtitle_Setting.value.splice(3,1);
            }
        }
        showOptionDialog("Movie Player", videoOptionNotify, null, index);
    }
}

VideoPlayObj.prototype.dmrCmdOperator = function(type, value){
    console.log("dmrCmdOperator type = "+type+";value = " + value);
    switch(type){
        case DmrNotifyCmdType.pause:
        this.playpause(false);
        break;
        case DmrNotifyCmdType.resume:
        this.playpause(true);
        break;
        case DmrNotifyCmdType.stop:
        this.videoDelInit();
        $('#btnVideoPlay')[0].className = 'music_stop_btn';
        this.closeVideoDialog();
        break;
        case DmrNotifyCmdType.seekTime:
        playbackOperator(this.handle, playbackCommand.seekTime, value);
        break;
        case DmrNotifyCmdType.playSpeed:
        playbackOperator(this.handle, playbackCommand.setSpeed, value);
        break;
        case DmrNotifyCmdType.subtitle_track:
        if(value == 0xFFFF){
            Subtitles.curValue = 0;
            this.swtichSub(Subtitles.curValue);
        } else {
            Subtitles.curValue = 1;
            if(value < Subtitles_Language.value.length){
                Subtitles_Language.curValue = value;
            }
            this.swtichSub(Subtitles.curValue);
        }
        break;
    }
};

VideoPlayObj.prototype.playpause = function (isPlay) {
    console.log("playpause isPlay = " + typeof (isPlay) +";playStatus = " + playStatus);
    if(!this.isPlayDone){
        console.log("!this.isPlayDone return");
        return;
    }
    if (typeof (isPlay) == 'undefined') {
        if (MmpPlayStatus.Play == playStatus) {
            playbackOperator(this.handle, playbackCommand.pause);          
        } else {
            playbackOperator(this.handle, playbackCommand.play);
        }
    } else if (isPlay) {
        if (MmpPlayStatus.Play != playStatus) {
            playbackOperator(this.handle, playbackCommand.play);
        }
    } else {
        if (MmpPlayStatus.Pause != playStatus) {
            playbackOperator(this.handle, playbackCommand.pause);
        }
    }
    //this.setBtnPlayClass();
};

function playErrorVideo(playEnd){
    if(videoPlayObj.playObj.curSourceType == SourceType.Pus || videoPlayObj.playObj.curSourceType == SourceType.Pvr){
        videoPlayObj.playStop(playEnd);
    } else if(videoPlayObj.playObj.curSourceType == SourceType.Dmr) {
        videoPlayObj.videoDelInit();
    } else {
        if(playEnd){
            videoPlayObj.playMode('end');
        } else {
            videoPlayObj.playMode('error');
        }

    }
}

VideoPlayObj.prototype.playStop = function (playEnd){
    console.log("VideoPlayObj playStop");
    if(isStopInfoDialogShow()){
        console.log("isStopInfoDialogShow() return");
        return;    
    }
    removeTvServerListener(EventListenerName.volumeNotify, volumeNotifyFunc);
    if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus
                || this.playObj.curSourceType == SourceType.Dmr){
        if(typeof(playEnd) == 'undefined'){
            playEnd = false;
        }
        this.videoDelInit();
        this.setPvrFileInfo(playEnd);
        if(this.playObj.curSourceType == SourceType.Dmr){
            dmrPlayStop();
        } else if(this.playObj.curSourceType == SourceType.Pvr) {
            try {
                var tvJspObj = getTvJspService();
                if (tvJspObj && tvJspObj.utility)
                    tvJspObj.utility.notifyHtmlUIStatus('{"PageID":"HTML5_UI_PAGE_PVR", "Status":"Show"}');
            }catch(err) {console.log(err);}
        }
        history.go(-1);
        return;
    }
    this.videoDelInit();
    this.timeout(true);
    this.timeReset();
    this.closeVideoDialog();
    contentBrowserObj.showBrowser();
};

VideoPlayObj.prototype.isVideoDialogShow = function(){
    if(isDialogShow() || isStopInfoDialogShow() || isPvrDialogShow()){
        return true;
    } else {
        return false;
    }
};

VideoPlayObj.prototype.closeVideoDialog = function(){
    closeDialog();
    closePlaybackErrorDialog();
    closeStopInfoDialog();
    closePvrDialog();
};

VideoPlayObj.prototype.setPvrFileInfo = function(playEnd){
    try {
        if(typeof(this.curPlayInfo.fileid) != 'undefined' && this.curPlayInfo.fileid != null){
            mtvObj.setPvrFileInfo(this.curPlayInfo.fileid, playEnd, (playEnd ? this.mediaDuration : this.currentPos));
        }
    } catch(err) { console.log(err); }
};

VideoPlayObj.prototype.setBtnPlayClass = function () {
    console.log("setBtnPlayClass playStatus = " + playStatus);
    $('#btnVideoPlay')[0].className = '';
    if (MmpPlayStatus.Play == playStatus) {
        $('#btnVideoPlay').addClass('music_play_btn');
    } else {
        $('#btnVideoPlay').addClass('music_pause_btn');
    }
};

VideoPlayObj.prototype.timeupdate = function () {
    var maxduration = this.mediaDuration;
    var perc;
    if(videoPlayObj.playObj.curSourceType == SourceType.MultiRoom && maxduration == 0){
        $('#video_player_current_time').text(timeFormat(this.currentPos));
        $('#video_player_total_time').text("");
        return;
    }
    if(this.mediaSeek_t){
        perc = 100 * this.startSeekTime / maxduration;
    } else {
        perc = 100 * this.currentPos / maxduration;
    }
    $('#video_progress').css('width', perc + '%');
    $('#video_player_current_time').text(timeFormat(this.currentPos));
    $('#video_player_total_time').text(timeFormat(maxduration));
    var pos = $('#btnVideoPlay').offset();
    pos.left = parseInt(this.currentPos / maxduration * this.playBtnLenth) + 85;
    $('#btnVideoPlay').offset(pos);
};

VideoPlayObj.prototype.timeReset = function (){
    this.currentPos = 0;
    this.mediaDuration = 0;
    this.startSeekTime = -1;
    this.mediaSeek_t = null;
    $('#video_player_current_time').text(timeFormat(0));
    $('#video_player_total_time').text(timeFormat(0));
    $('#video_progress').css('width', '0px');
    $('#btnVideoPlay')[0].className = 'music_play_btn';
    $('#btnVideoPlay').css('left', '85px');
    $('#video_player_bg').hide();
};

function videoOptionNotify(key, valueIndex, itemObj){
    console.log("videoOptionNotify key = " +key+";valueIndex = " +valueIndex);
    //localStorage.setItem(key.replace('Movie Player','Movie'), valueIndex);
    videoPlayObj.switchValue(key, valueIndex, itemObj);
}

VideoPlayObj.prototype.switchValue = function (key, valueIndex, itemObj){
    switch(key){
    case Subtitles.name:
    this.swtichSub(valueIndex);
    this.setDmrSubtitleInfo();
    break;
    case Character_set.name.replace(new RegExp(" ","g"),'_'):
    playbackOperator(this.handle, playbackCommand.setSubEnc, itemObj.value[valueIndex]);
    break;
    case Font_Size.name.replace(new RegExp(" ","g"),'_'):
    playbackOperator(this.handle, playbackCommand.setSubFontSize, itemObj.value[valueIndex]);
    playbackOperator(this.handle, playbackCommand.setSubEdgWidth);
    break;
    case Subtitles_Color.name.replace(new RegExp(" ","g"),'_'):
    //playbackOperator(this.handle, playbackCommand.setSubtxtColor, itemObj.value[valueIndex]);
    videoPlayObj.setSubtxtColor();
    break;
    case Subtitles_Language.name.replace(new RegExp(" ","g"),'_'):
    this.selectSub();
    this.setDmrSubtitleInfo();
    break;
    case "Audio_language":
    //mtvObj.acfgSetConfigItemString("70516781", itemObj.value[valueIndex]);
    playbackOperator(this.handle, playbackCommand.selectAud, itemObj.value[valueIndex].index, itemObj.value[valueIndex].dmxidx);
    break;
    case Time_Offset.name.replace(new RegExp(" ","g"),'_'):
    playbackOperator(this.handle, playbackCommand.setSubTimeOffset, itemObj.value[valueIndex]);
    break;
    case Subtitles_Display.name.replace(new RegExp(" ","g"),'_'):
    playbackOperator(this.handle, playbackCommand.setSubDisplayRect, itemObj.value[valueIndex]);
    break;
    case "Status":
    closeDialog();
    this.showMovieStatusDialog(valueIndex);
    break;
    }
};

VideoPlayObj.prototype.swtichSub = function (valueIndex){
    console.log("swtichSub valueIndex = " + valueIndex);
    if(typeof(valueIndex) == 'undefined' || valueIndex == 0){
        playbackOperator(this.handle, playbackCommand.setStopSub);
    } if (valueIndex == 2){
        var volValue = mtvObj.getVolumeValue();
        var mute = mtvObj.getVolumeMute();
        console.log("volValue = " + volValue + ";mute = " + mute);
        this.subAutomatic(volValue, mute);
    } else {
        this.selectSub();
    }
};

VideoPlayObj.prototype.subAutomatic = function(volValue, muteStatus){
    if(muteStatus || (!muteStatus && volValue == 0)){
        this.selectSub();
    } else {
        playbackOperator(this.handle, playbackCommand.setStopSub);
        
    }
};

VideoPlayObj.prototype.selectSub = function (){
    if(Subtitles.curValue <= 0){
        console.log("selectSub subtitle is close return");
        return;
    }
    if(Subtitles_Language.value.length <= Subtitles_Language.curValue){
        Subtitles_Language.curValue = 0;
    }
    console.log("selectSub curValue = " + Subtitles_Language.curValue);
    playbackOperator(this.handle, playbackCommand.selectSub, Subtitles_Language.curValue);
    this.setSubtxtColor();
    playbackOperator(videoPlayObj.handle, playbackCommand.setSubFontSize, Font_Size.value[Font_Size.curValue]);
    playbackOperator(videoPlayObj.handle, playbackCommand.setSubDisplayRect, Subtitles_Display.value[Subtitles_Display.curValue]);
    playbackOperator(videoPlayObj.handle, playbackCommand.setSubEdgWidth);
};

var ConfigItem_MMP_LanguageString = 119799813;
VideoPlayObj.prototype.getSubLanguage = function(){
    if((this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus) && (typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC'))){
        Subtitles_Language.value = ['CC-1','CC-2','CC-3','CC-4','CC-5','CC-6','CC-7','CC-8'];
        Subtitles_Language.curValue = 0;
        return;
    }
    Subtitles_Language.value = [];
    Subtitles_Language.curValue = -1;
    var isPrimaryLang = false;
    var isSecondaryLang = false;
    primaryLang = mtvObj.getPrimarySubtitleLanguage();
    if(primaryLang){
        primaryLang = mtvObj.acfgGetConfigItemString(ConfigItem_MMP_LanguageString, primaryLang);
    }
    secondaryLang = mtvObj.getSecondarySubtitleLanguage();
    if(secondaryLang){
        secondaryLang = mtvObj.acfgGetConfigItemString(ConfigItem_MMP_LanguageString, secondaryLang);
    }
    console.log("primaryLang = " + primaryLang+";secondaryLang = " + secondaryLang);
    if(!this.mediaInfo){
        this.mediaInfo = this.getMedia();
    }
    if(this.mediaInfo){
        console.log("this.mediaInfo.mediaSubTrackNum = " + this.mediaInfo.mediaSubTrackNum);
        //console.log("Number(this.mediaInfo.mediaSubTrackNum) = " + Number(this.mediaInfo.mediaSubTrackNum));
        //{value:'undefined'},{value:'undefined',icon:'../Assets/_Icons/List_Icons/subtitle_dvb_N_S.png'}
        if(Number(this.mediaInfo.mediaSubTrackNum) > 0){
            for(var i = 0; i < Number(this.mediaInfo.mediaSubTrackNum); i++){
                var subInfo = playbackOperator(this.handle, playbackCommand.getSubinfo, i);
                var subItem = {};
                if(subInfo){
                    subInfo = JSON.parse(subInfo);
                    var lang = subInfo.ITEMS[0].sublang;
                    if(!isPrimaryLang || !isSecondaryLang){
                        if(primaryLang == lang){
                            Subtitles_Language.curValue = i;
                            isSecondaryLang = true;
                            isPrimaryLang = true;
                        } else if(secondaryLang == lang && !isPrimaryLang && !isSecondaryLang){
                            Subtitles_Language.curValue = i;
                            isSecondaryLang = true;
                        }
                    }
                    subItem.value = lang;
                    subItem.external = subInfo.ITEMS[0].external;
                    var sub_type = subInfo.ITEMS[0].subtype;
                    console.log("sub_type = " + sub_type);

                    if(subInfo.ITEMS[0].hearingImpair){
                        subItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_Hearing_Impaired.png';
                    } else {
                    switch(sub_type){
                        case video_sub_type.dvb:
                        subItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_DVB_Text.png';
                        break;
                        case video_sub_type.ttx:
                        subItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_Subtitle_Language.png';
                        break;
                        case video_sub_type.ass:
                        case video_sub_type.srt:
                        subItem.external = 1;
                        break;
                    }
                    }
                    if(lang == '' || lang.toLowerCase() == 'undefined'){
                        if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
                            subItem.value = 'Undefined';
                        } else {
                            subItem.value = 'Subtitles ' + (i+1);
                        }
                    }
                } else {
                    if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
                        subItem.value = 'Undefined';
                    } else {
                        subItem.value = 'Subtitles ' + (i+1);
                    }
                }
                Subtitles_Language.value.push(subItem);
            }
        }
    }
    if(Subtitles_Language.curValue == -1){
        Subtitles_Language.curValue = 0;
    }

};

VideoPlayObj.prototype.setDmrSubtitleInfo = function(){
    if(videoPlayObj.playObj.curSourceType != SourceType.Dmr){
        return;
    }
    this.dmrSubtitleStr = null;
    for(var index in Subtitles_Language.value){
        var expandStr = '';
        var subItem = Subtitles_Language.value[index];
        if(0 != Subtitles.curValue){
            if(index == Subtitles_Language.curValue){
                expandStr = '*';
            }
        }
        if(this.dmrSubtitleStr){
            this.dmrSubtitleStr += ";"+expandStr+subItem.value;
        } else {
            this.dmrSubtitleStr = expandStr+subItem.value;
        }
    }
    if(this.dmrSubtitleStr){
        dlnaDmrSyncPlayState(DmrStateNfyType.subtitle_info, videoPlayObj.dmrSubtitleStr);
    }
};

VideoPlayObj.prototype.showMovieStatusDialog = function(index){
    var path = this.curPlayInfo.MEDIA_PATH;
    var type = this.curPlayInfo.MEDIA_TYPE;
    var media_info = usbObj.getContentInfoByPath(type, path);
    var title;
    var size;
    var date;
    var sound_mode;
    if (media_info.TITLE) {
        title = media_info.TITLE;
    } else {
        title = media_info.MEDIA_PATH.substring(media_info.MEDIA_PATH.lastIndexOf("/") + 1);
        title = title.substring(0, title.lastIndexOf('.'));
    }    
    date = getFormatDateVideo(media_info);

    if(!this.mediaInfo){
        this.mediaInfo = this.getMedia();
    }
    size = bytesToMb(this.mediaInfo.mediaFileSize);
    if(this.mediaInfo){
        var audInfo = playbackOperator(this.handle, playbackCommand.getAudInfo, index);
        if(audInfo){
            audInfo = JSON.parse(audInfo);
            sound_mode = audInfo.ITEMS[0].audenctype;
            if(sound_mode){
                sound_mode = video_aud_full_name[sound_mode];
            } else {
                sound_mode = '';
            }
        } else {
            sound_mode = '';
        }
    }
    console.log("sound_mode = " + sound_mode);
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'status_dialog',
            content: '<div style="height: 220px;width: 580px;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;opacity: 0.9;background:#000;">\
                <p style="float:left;color: white;margin: 0;text-align: left;font-size: 26px;position: relative;left: 10px;top: 10px;width: 200px;">'+ getTranslate("Movie") +'</p>\
                <table style="table-layout:fixed; float:left;width:540px;color: white;position: absolute;left: 20px;top: 60px;text-align:left;font-size:24px;">\
                <tr><td>'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap;  overflow:hidden;">' + title + '</td></tr>\
                <tr><td >'+ getTranslate("Size")+'</td><td>' + size + '</td></tr>\
                <tr><td>'+ getTranslate("Date")+'</td><td>' + date + '</td></tr>\
                <tr><td>'+ getTranslate("Sound mode")+ ":"+'</td><td>' + sound_mode + '</td></tr>\
                </table>\
                </div>',
        
        });        
        contentDialog.show();
    });
}

VideoPlayObj.prototype.getAudLanguage = function(){
    Audio_Language.value = [];
    if(!this.mediaInfo){
        this.mediaInfo = this.getMedia();
    }
    
    if(this.mediaInfo){
        console.log("this.mediaInfo.mediaAudTrackNum = " + this.mediaInfo.mediaAudTrackNum);
        if(Number(this.mediaInfo.mediaAudTrackNum) > 0){
            for(var i = 0; i < Number(this.mediaInfo.mediaAudTrackNum); i++){
                var audInfo = playbackOperator(this.handle, playbackCommand.getAudInfo, i);
                console.log("audInfo = " + audInfo);
                var audItem = {};
                if(audInfo){
                    audInfo = JSON.parse(audInfo);
                    lang = audInfo.ITEMS[0].audlang;
                    if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
                        switch(audInfo.ITEMS[0].impairtype){
                            case video_aud_impared_type.hearing:
                            audItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_Hearing_Impaired.png';
                            break;
                            case video_aud_impared_type.visual:
                            audItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_Visually_Impaired.png';
                            break;
                            case video_aud_impared_type.mixed:
                            audItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_visualmixed.png';
                            break;
                            default:
                            switch(audInfo.ITEMS[0].audenctype){
                                case video_aud_type.aac:
                                audItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_AAC.png';
                                break;
                                case video_aud_type.dd:
                                audItem.icon = '../2K16_4K_UX_Asset/option_audio_language/icon_Dolby.png';
                                break;
                            }
                            break;
                        }

                        if(!lang) {
                            if(audInfo.ITEMS[0].reflang && audInfo.ITEMS[0].reflang > 0){
                                audItem.reflang = audInfo.ITEMS[0].reflang;
                            }                
                        }
                    } else {
                        audItem.isDualMono = this.isAudDualMono(audInfo.ITEMS[0]);
                    }
                    if(lang){
                        lang = mtvObj.acfgGetConfigItemString(ConfigItem_MMP_LanguageString, lang);
                    }
                    if(lang == '' || lang.toLowerCase() == 'undefined'){
                        if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
                            console.log("audItem.value = 'Undefined';");
                            if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'EU' || GLOBAL_MODE == 'AP')){
                                audItem.value = 'Undefined';
                            } else {
                               audItem.value = 'NO_NAME'; 
                            }
                        } else {
                            audItem.value = 'Audio language ' + (i+1);
                        }
                    } else {
                        audItem.value = lang;
                    }

                    
                } else {
                    if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
                        if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'EU' || GLOBAL_MODE == 'AP')){
                            audItem.value = 'Undefined';
                        } else {
                           audItem.value = 'NO_NAME'; 
                        }
                    } else {
                        audItem.value = 'Audio language ' + (i+1);
                    }
                }
                audItem.index = i;
                if(this.mediaInfo.mediaCurAudTrackIdx == i){
                    Audio_Language.curValue = Audio_Language.value.length;
                }
                Audio_Language.value.push(audItem);
                if(audItem.isDualMono){
                    audItem.dmxidx = 3;
                    audChannel1 = clone(audItem);
                    audChannel1.value += ' left';
                    audChannel1.dmxidx = 1;
                    audChannel2 = clone(audItem);
                    audChannel2.value += ' right';
                    audChannel2.dmxidx = 2;
                    Audio_Language.value.push(audChannel1);
                    Audio_Language.value.push(audChannel2);
                } else {
                    audItem.dmxidx = 0;
                }
            }
        }
    }
    if(this.playObj.curSourceType == SourceType.Pvr || this.playObj.curSourceType == SourceType.Pus){
        for(var index in Audio_Language.value){
            if(Audio_Language.value[index].reflang){
                var ref1 = Audio_Language.value[index].reflang & 0xFF;
                var ref2 = (Audio_Language.value[index].reflang & 0xFF00) >> 8;
                console.log("index"+index+";ref1 = " + ref1 +";ref2 = " + ref2);
                Audio_Language.value[index].value = Audio_Language.value[ref1].value +"+" + Audio_Language.value[ref2].value;            
            }

        }
    }
    if(Audio_Language.curValue >= Audio_Language.value.length){
        Audio_Language.curValue = 0;
    }
};

VideoPlayObj.prototype.isAudDualMono = function(audObj){
    if(audObj.audenctype == video_aud_type.dd ||
        audObj.audenctype == video_aud_type.ddp ||
        audObj.audenctype == video_aud_type.he_aac ||
        audObj.audenctype == video_aud_type.he_aac_v2 ||
        audObj.audenctype == video_aud_type.aac){
        if(audObj.audchnum == 'DUAL_MONO'){
            return true;
        }
    }
    return false;
};

VideoPlayObj.prototype.getMedia = function () {
    var itemInfo = playbackOperator(this.handle, playbackCommand.getMediaInfo);
    if(itemInfo){
        return JSON.parse(itemInfo).ITEMS[0];
    } else {
        return null;
    }
};

VideoPlayObj.prototype.getMediaDuration = function (){
    if(this.mediaInfo){
        return this.mediaInfo.mediaDuration;
    }
}

VideoPlayObj.prototype.initOption = function (option_attr){
    for(index in option_attr){
        if(option_attr[index].hasSubmenu){
            this.initOption(option_attr[index].value);
        } else {
            var curValue;
            var id = option_attr[index].name.replace(' ', '_');
            curValue = localStorage.getItem(id);
            console.log("id = " + id +";curValue ="+curValue);
            if(curValue){
                if(curValue >= option_attr[index].value.length){
                    curValue = 0;
                    localStorage.setItem(id,curValue);
                } else if(curValue < 0) {
                    curValue = 0;
                    localStorage.setItem(id,curValue);
                }
                option_attr[index].curValue = parseInt(curValue);
            } else {
                curValue = option_attr[index].curValue;
            }
        }
        //switchValue(id, curValue, index);
    }
    if(this.playObj.curSourceType == SourceType.Pus || this.playObj.curSourceType == SourceType.Pvr){
        var subtitle_swtich = localStorage.getItem(Subtitles.name.replace(' ', '_'));
        if(!subtitle_swtich){
            Subtitles.curValue = 1;
        }
    }
};

VideoPlayObj.prototype.initBottombar = function(){
    var data = playerColorKeyData;
    if(this.playObj.curSourceType == SourceType.Pus || this.playObj.curSourceType == SourceType.Pvr){
        playerColorKeyData[1] = "";
        playerColorKeyData[2] = "";
        playerColorKeyData[4] = "";
    } else if(this.playObj.curSourceType == SourceType.MultiRoom){
        playerColorKeyData[1] = "";
        playerColorKeyData[2] = "";
    } else {
        if(!this.isPlayAll){
            playerColorKeyData[1] = PlayAll[1];
        } else {
            playerColorKeyData[1] = PlayAll[0];
        }
        if(!this.shuffle){
            playerColorKeyData[2] = Shuffle.value[1];
        } else {
            playerColorKeyData[2] = Shuffle.value[0];
        }
    }
    var children = $('#video_play_footer').find('li');
    for (var i = 0; i < children.length; i++) {
        var text = $(children[i]).text();
        var htmltext = $(children[i]).html();
        var html = htmltext.substring(0, htmltext.lastIndexOf(text));
        $(children[i]).html(html + getTranslate(data[i]));
    }
}

VideoPlayObj.prototype.videoPlayNotify = function (videoNotify){
    if(this.pvTag != videoNotify.TAG){
        return ;
    }
    var arg1 = Number(videoNotify.ARG1);
    switch(Number(videoNotify.TYPE)){
        case MmpEventType.total_time_update:
        this.mediaDuration = arg1;
        break;
        case MmpEventType.icur_time_update:
        videoPlayObj.currentPos = arg1;
        try{
        this.timeupdate(arg1);
        }catch(e){}
        break;
        case MmpEventType.eos:
        console.log("MmpEventType.eos");
        if(this.currentPos < this.mediaDuration){
            this.currentPos = this.mediaDuration;
            try{
            this.timeupdate(this.currentPos);
            }catch(e){}
        }
        setTimeout(function(){
            playErrorVideo(true);
        });
        break;
        case MmpEventType.play_done:
        videoPlayObj.isPlayDone = true;
        setTimeout(function(){
            videoPlayObj.mediaInfo = videoPlayObj.getMedia();
            videoPlayObj.getSubLanguage();
            videoPlayObj.getAudLanguage();
            videoPlayObj.swtichSub(Subtitles.curValue);
            videoPlayObj.setDmrSubtitleInfo();
            if(playStatus != MmpPlayStatus.Play){
                var speed = playbackOperator(videoPlayObj.handle, playbackCommand.getSpeed);
                if(speed){
                    speed = JSON.parse(speed);
                    if(speed.ITEMS[0].s_speed == 'FF1')
                        videoPlayObj.videoPlayNotify({"TYPE":MmpEventType.speed_update,"TAG":videoPlayObj.pvTag,"ARG1":100000,"ARG2":0,"ARG3":0,"ARG4":0});
                } 
            }
        });
        break;
        case MmpEventType.speed_update:
         var original_class = PlaySleep[arg1];
         $('#btnVideoPlay')[0].className = original_class;
        //var speedItem = playbackOperator(this.handle, playbackCommand.getSpeed);
        //console.log(JSON.stringify(speedItem));
        //speedItem = JSON.parse(speedItem);
        // var s_class = speedItem.ITEMS[0].s_speed
         //console.log("speed :"+s_class);
         if(100000 == arg1){
            playStatus = MmpPlayStatus.Play;
         } else if(0 == arg1){
            playStatus = MmpPlayStatus.Pause;
         }else if(400 == arg1 || 200 == arg1||-400 == arg1||-200 == arg1){
            playStatus = MmpPlayStatus.SlowSpeed;
         } else {
            playStatus = MmpPlayStatus.Speed;
         }
         dealWithSlowSpeedPlay(arg1);
        break;
        /*
        case MmpEventType.rating_blocked:
        console.log("MmpEventType.rating_blocked");
        showPvrRatingBlockedDialog('pvrRatingBlockedBtnNotify');
        break;
        */
        case MmpEventType.playback_error:
        if(arg1 == PlaybackErrorType.video_unplayable){
            arg1 = PlaybackErrorType.video_codec_not_support;
        }
        if(arg1 == PlaybackErrorType.drm_not_support || arg1 == PlaybackErrorType.no_audio_video_svc
                || arg1 == PlaybackErrorType.file_not_support || arg1 == PlaybackErrorType.media_lost){
            if(videoPlayObj.playObj.curSourceType == SourceType.Dmr) {
                showPlaybackErrorDialog(PlaybackErrorInfo[arg1], null);
                videoPlayObj.videoDelInit();
            } else {
                showPlaybackErrorDialog(PlaybackErrorInfo[arg1], playErrorVideo);
            }
        } else {
            showPlaybackErrorDialog(PlaybackErrorInfo[arg1], null);
            return;
        }
        break;
        case MmpEventType.rating_blocked:
        console.log("MmpEventType.rating_blocked");
        case MmpEventType.channel_blocked:
        console.log("MmpEventType.channel_blocked");
        showPvrChannelBlockedDialog('pvrRatingBlockedBtnNotify');
        break;
    }
    if(this.playObj.curSourceType == SourceType.Dmr){
        dmrCmpbStateNotify(videoNotify);
    } else if(this.playObj.curSourceType == SourceType.Pus){
        pusCmpbStateNotify(videoNotify);
    }
};

VideoPlayObj.prototype.setSubtxtColor = function(){
    playbackOperator(videoPlayObj.handle, playbackCommand.setSubtxtColor, Subtitles_Color.value[Subtitles_Color.curValue]);
    if(Subtitles_Color.curValue == 5){
        playbackOperator(videoPlayObj.handle, playbackCommand.setSubEdgColor, 1);
    } else {
        playbackOperator(videoPlayObj.handle, playbackCommand.setSubEdgColor);
    }
}

function pvrRatingBlockedBtnNotify(btn_content){
    console.log('pvrRatingBlockedBtnNotify btn_content = ' + btn_content);
    switch(btn_content){
    case 1:
    console.log('pvrRatingBlockedPinText = ' + pvrRatingBlockedPinText);
    if(pvrRatingBlockedPinText == getPinCode()){
        closePvrDialog();
        playbackOperator(videoPlayObj.handle, playbackCommand.setUnlockRating);
    } else{
        $('#pin_code_error').show();
        clearPvrRatingBlockedPin();
    }
    break;
    case 2:
    case 3:
    videoPlayObj.playStop();
    break;
    case 4:
    clearPvrRatingBlockedPin();
    break;
    case 5:
    if(pvrRatingBlockedPinText == getPinCode()){
        closePvrDialog();
        playbackOperator(videoPlayObj.handle, playbackCommand.setUnlockRating);
    } else{
        $('#pvr_enter_pincode_title').html(getTranslate('PWD_STATE_2'));
        clearPvrRatingBlockedPin();
    }
    break;
    }
};

function multiRoomRatingBtnNotify(btn_content){
    console.log('multiRoomRatingBtnNotify btn_content = ' + btn_content);
    switch(btn_content){
    case 3:
    videoPlayObj.playStop();
    break;
    case 4:
    clearPvrRatingBlockedPin();
    break;
    case 5:
    if(pvrRatingBlockedPinText == getPinCode()){
        closePvrDialog();
        videoPlayObj.cmdPlay();
        playbackOperator(videoPlayObj.handle, playbackCommand.setUnlockRating);
    } else{
        $('#pvr_enter_pincode_title').html(getTranslate('PWD_STATE_2'));
        clearPvrRatingBlockedPin();
    }
    break;
    }
}

VideoPlayObj.prototype.videoDelInit = function (){
    if(this.handle){
        playbackOperator(this.handle, playbackCommand.stop);
        playbackDeinit(this.handle);
        this.handle = undefined;
        this.pvTag = null;
    }
}

VideoPlayObj.prototype.playback = function () {
    try{
        var infoObj;
        var fileName;
        this.timeReset();
        this.isPlayDone = false;
        switch(this.playObj.curSourceType){
            case SourceType.Pvr:
            case SourceType.Pus:
            infoObj = {mediaPath:this.curPlayInfo.mediaPath, bMode:1};
            if(this.curPlayInfo.title){
                fileName = this.curPlayInfo.title;
            } else {
                path = this.curPlayInfo.mediaPath;
                fileName = path.substring(path.lastIndexOf('/') + 1);
            }
            break;
            case SourceType.Dmp:
            case SourceType.MultiRoom:
            infoObj = {mediaPath:this.curPlayInfo.mediaInfo.fileObjId, bMode:2, info:this.curPlayInfo.devId};
            fileName = this.curPlayInfo.mediaInfo.mediaName;
            break;
            case SourceType.Dmr:
            infoObj = {mediaPath:this.curPlayInfo.URL, bMode:2, protocal:this.curPlayInfo.PROTOCOL_INFO};
            fileName = this.curPlayInfo.mediaName;
            break;
            default:
            path = this.curPlayInfo.MEDIA_PATH;
            infoObj = {mediaPath:path, bMode:1};
            fileName = path.substring(path.lastIndexOf('/') + 1);
            break;
        }
        playStatus = MmpPlayStatus.Pause;
        $('#video_current_name').html(fileName);
        var ret = playbackInitWithPath(infoObj);
        if(ret == null || ret.STATUS != 0){
            if(ret){
                this.handle = ret.HANDLE;
                this.pvTag = ret.PVTAG;
            } else {
                this.pvTag = -1;
            }
            this.videoPlayNotify({"TYPE":MmpEventType.playback_error,"TAG":this.pvTag,"ARG1":109,"ARG2":0,"ARG3":0,"ARG4":0});
            return;
        }
        this.handle = ret.HANDLE;
        this.pvTag = ret.PVTAG;
        this.mediaInfo = this.getMedia();
        this.mediaDuration = this.getMediaDuration();
        
        if(this.playObj.curSourceType == SourceType.MultiRoom){
            var ratingInfo = playbackOperator(this.handle, playbackCommand.getRatingInfo);
            if(ratingInfo && JSON.parse(ratingInfo).ITEMS[0].hasRating){
                showPvrChannelBlockedDialog('multiRoomRatingBtnNotify');
            } else {
                this.cmdPlay();
            }
            return;
        }
        
        var stopinfo = playbackStopInfo(this.handle);
        if(1 == stopinfo){
            if(this.playObj.curSourceType == SourceType.SuperShop || this.playObj.curSourceType == SourceType.Pus){
                stopInfoBtnNotify(1);
            } else {
                showStopInfoDialog('stopInfoBtnNotify');
            }
        } else {
            this.cmdPlay();
        }
    }catch(e){
        console.log(e);
    }
};

VideoPlayObj.prototype.cmdPlay = function(){
    this.showMediaBar();
    playbackOperator(this.handle, playbackCommand.setDisplayRect);
    var ret = playbackOperator(this.handle, playbackCommand.play);
    if(ret != 0){
        playStatus = MmpPlayStatus.Pause;
        this.videoPlayNotify({"TYPE":MmpEventType.playback_error,"TAG":this.pvTag,"ARG1":109,"ARG2":0,"ARG3":0,"ARG4":0});
    } else {
        this.setBtnPlayClass();
    }
}

function stopInfoBtnNotify(btn_index){
    console.log('stopInfoBtnNotify btn_index = ' + btn_index);
    closeStopInfoDialog();
    playbackOperator(videoPlayObj.handle, playbackCommand.setStopInfo, (btn_index == 1) ? 0 : 1);
    videoPlayObj.cmdPlay();
}

var lastVolume = -1;
var lastMuteStatus = -1;

var volumeNotifyFunc = function(jsonStr){
    if(Subtitles.curValue != 2){
        return;
    }
    var volumeNotifyObj = JSON.parse(jsonStr);
    for(index in volumeNotifyObj.ITEMS){
        var volumeNotifyItem = volumeNotifyObj.ITEMS[index];

        if((volumeNotifyItem.volValue > 0 && lastVolume<=0) || (volumeNotifyItem.volValue <= 0 && lastVolume > 0) || (lastMuteStatus !== volumeNotifyItem.muteStatus)){
            videoPlayObj.subAutomatic(volumeNotifyItem.volValue, volumeNotifyItem.muteStatus);
        }
        lastVolume = volumeNotifyItem.volValue;
        lastMuteStatus = volumeNotifyItem.muteStatus;
    }
};

VideoPlayObj.prototype.init = function(obj, sourceType, isPlayAll) {
    try{
    addTvServerListener(EventListenerName.volumeNotify, volumeNotifyFunc);
    mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.video);

    this.timeReset();
    if(sourceType == SourceType.MultiRoom || (typeof(isPlayAll) == 'undefined')){
        this.isPlayAll = false;
    } else {
        this.isPlayAll = isPlayAll;
    }
    var curValue = localStorage.getItem('Shuffle');
    if(sourceType == SourceType.MultiRoom || !parseInt(curValue)){
        this.shuffle = false;
    } else {
        this.shuffle = true;
    }
    if(sourceType == SourceType.Dmr || sourceType == SourceType.Pvr || sourceType == SourceType.Pus){
        this.playObj = {curSourceType:sourceType};
        this.curPlayInfo = obj;
    } else {
        this.playObj = obj;
        this.curPlayInfo = this.playObj.getPlayInfo({mediaType:3});
        }
        this.initOption(this.option_data_attr);
        this.initBottombar();
        setTimeout(function(){videoPlayObj.playback();},100);
    }catch (e) {
        console.log(e);
        endLoadingAnimate();
    }
    
};

VideoPlayObj.prototype.playMode = function (action) {
    console.log("VideoPlayObj playMode");
    var temp;
    if (action == 'prev') {
        temp = this.playObj.getPlayInfo({isNext:false,isRepeat:this.getRepeat(),isShuffle:false,isPlayAll:this.isPlayAll,mediaType:3});
        if(this.isPlayAll || !this.getRepeat() || temp){
            this.curPlayInfo = temp;
        }
    } else if (action == 'next') {
        this.curPlayInfo = this.playObj.getPlayInfo({isNext:true,isRepeat:this.getRepeat(),isShuffle:this.shuffle,mediaType:3});
    } else if (action == 'end' || action == 'error') {
        if(this.playObj.curSourceType == SourceType.SuperShop){
            this.curPlayInfo = this.playObj.getPlayInfo({isNext:true,isRepeat:true,mediaType:3});
        } else {
            console.log("this.isPlayAll = " + this.isPlayAll+";this.getRepeat() = " + this.getRepeat());
            if(this.isPlayAll){
                temp = this.playObj.getPlayInfo({isNext:true,isRepeat:this.getRepeat(),isShuffle:this.shuffle,mediaType:3});
                if(action == 'error' && this.getRepeat() && this.curPlayInfo == temp){
                    this.curPlayInfo = null;
                } else {
                    this.curPlayInfo = temp;
                }
            } else if(!this.getRepeat()){
                this.curPlayInfo = null;
            } else {
                if(action == 'error'){
                    this.curPlayInfo = null;
                }
            }
        }
    }
    console.log("this.curPlayInfo = " + JSON.stringify(this.curPlayInfo));
    if(!this.curPlayInfo){
        this.playStop();
        return;
    }
    this.videoDelInit();
    this.timeReset();
    this.closeVideoDialog();
    setTimeout(function(){videoPlayObj.playback();},100);
};
function dealWithSlowSpeedPlay(speed){
    if(speed){
        switch (speed) {
        case 200:
             isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sf_1_2").addClass("li_select");
            break;
        case 400:
             isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sf_1_4").addClass("li_select");
            break;
        case -200:
            isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sr_1_2").addClass("li_select");
            break;
        case -400:
            isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sr_1_4").addClass("li_select");
            break;
        case 100000:
             isSlowSpeed = false;
             if( $("#show_speed").is(":visible")){
                 $("#show_video_title").show();
                 $("#show_speed").hide();
                 $("#show_speed").find("li").removeClass("li_select");
             }
            break;

        default:
            isSlowSpeed = false;
            break;
        }
    }
}


function SpeedBarShowOrHide(){
    if( $("#show_speed").is(":visible")){
         $("#show_video_title").show();
         $("#show_speed").hide();
         $("#show_speed").find("li").removeClass("li_select");
     }else{
         getInitSpeed();
          $("#show_video_title").hide();
         $("#show_speed").show();
         $("#show_speed").find("li").removeClass("li_select");
         $("#cur_select").addClass("li_select");
         setTimeOutForSpeedBar();
     }
}
function getInitSpeed(){
     var speedItem = playbackOperator(videoPlayObj.handle, playbackCommand.getSpeed);
        speedItem = JSON.parse(speedItem);
        var s_class = speedItem.ITEMS[0].s_speed;

        switch (s_class) {
        case "SF2":
             isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sf_1_2").addClass("li_select");
            break;
        case "SF4":
             isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sf_1_4").addClass("li_select");
            break;
        case "SR-2":
            isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sr_1_2").addClass("li_select");
            break;
        case "SR-4":
            isSlowSpeed = true;
             $("#show_speed").find("li").removeClass("li_select");
             $("#sr_1_4").addClass("li_select");
            break;
        case "FF1":
             isSlowSpeed = false;
             $("#show_speed").find("li").removeClass("li_select");
             $("#cur_select").addClass("li_select");
            break;

        default:
            isSlowSpeed = false;
            break;
        }
    
}
function setTimeOutForSpeedBar(){
    if(slowBarDispearTimeOutResult != null){
         clearTimeout(slowBarDispearTimeOutResult);
     }
     slowBarDispearTimeOutResult =  setTimeout("SpeedBarShowOrHide()",4000);
}
var videoPlayObj = new VideoPlayObj();