var MusicPlayObj = function(){
    this.curDisplayMode = musicDisplayMode.none;
    this.option_data_attr = ALL_OPTION_DATA["Music Player"];
    this.startSeekTime = -1;
    this.mediaSeek_t = null;
    this.currentPos;
    this.mediaDuration;
    this.musicHandle;
    this.isPlayAll = false;
    this.shuffle = false;
    this.playObj;
    this.curPlayInfo;
    this.firstPlayIndex;
    this.isPlayDone;
    this.playBtnLenth = 1000;
};

MusicPlayObj.prototype.getRepeat = function(){
    var repeat = Repeat;
    if(repeat.curValue == 0){
        return false;
    } else {
        return true;
    }
};

MusicPlayObj.prototype.audioPlayNotify = function(itemObj){
    if(this.pvTag != itemObj.TAG){
        console.log("this.pvTag = "+this.pvTag + ";itemObj = "+JSON.stringify(itemObj));
        return ;
    }
    var arg1 = Number(itemObj.ARG1);
    switch(Number(itemObj.TYPE)){
    case MmpEventType.total_time_update:
    this.mediaDuration = arg1;
    break;
    case MmpEventType.icur_time_update:
    musicPlayObj.currentPos = arg1;
    try{
    this.timeupdate();
    }catch(e){}
    break;
    case MmpEventType.eos:
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
        this.stopPlay();
    } else {
        console.log("eos true ");
        this.playMusicMode('ended');
    }
    break;
    case MmpEventType.play_done:
    musicPlayObj.isPlayDone = true;
    break;
    case MmpEventType.speed_update:
    document.querySelector('#music_play_btn').className = PlaySleep[arg1];
    break;
    case MmpEventType.playback_error:
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr) {
        showPlaybackErrorDialog(PlaybackErrorInfo[arg1], null);
        musicPlayObj.stopPlay();
    } else {
        showPlaybackErrorDialog(PlaybackErrorInfo[arg1], playErrorAudio);
    }
    break;
    }
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
        dmrCmpbStateNotify(itemObj);
    }
};

function playErrorAudio(){
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
        musicPlayObj.stopPlay();
    } else {
        musicPlayObj.playMusicMode('error');
    }
}

MusicPlayObj.prototype.closeMusicDialog = function(){
    closePlaybackErrorDialog();
    closeDialog();
};

MusicPlayObj.prototype.stopMusic = function(notFocus){
    if(musicPlayObj.curDisplayMode != musicDisplayMode.none){
        if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
            this.stopPlay();
            dmrPlayStop();
            history.go(-1);
            return;
        }
        musicPlayObj.timeReset();
        this.closeMusicDialog();
        musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.none, notFocus);
        if(contentBrowserObj.curShowMode == contentBrowserObj.ShowMode.MusicPlay){
            //contentBrowserObj.curShowMode = contentBrowserObj.ShowMode.Browser;
            contentBrowserObj.showBrowser();
        } else if(contentBrowserObj.curShowMode == contentBrowserObj.ShowMode.MusicAndPhotoPlay){
            contentBrowserObj.curShowMode = contentBrowserObj.ShowMode.PhotoPlay;
        }
    }
};

MusicPlayObj.prototype.playOrPauseClick = function (isplay) {
    console.log("playOrPauseClick isplay = " + typeof(isplay));
    if(!this.isPlayDone){
        console.log("playOrPauseClick !this.isPlayDone return");
        return;
    }

    if(typeof(isplay) == 'undefined'){
        if (playStatus == MmpPlayStatus.Play) {
            this.toPlay('pause');
        } else {
            this.toPlay('play');
        }
    } else if(isplay){
        if (playStatus != MmpPlayStatus.Play) {
            this.toPlay('play');
        }
    } else{
        if (playStatus != MmpPlayStatus.Pause) {
            this.toPlay('pause');
        }
    }

};

MusicPlayObj.prototype.musicPlayOperator = function (operator, isBack){
    console.log("musicPlayOperator operator = " + operator);
    if(operator == 'timeSeek'){
        this.doMediaSeek(isBack);
    } else {
        playbackOperator(this.musicHandle, operator);
    }    
};

MusicPlayObj.prototype.cmdPlay = function(){
    var ret = playbackOperator(this.musicHandle, playbackCommand.play);
    if(ret != 0){
        playStatus = MmpPlayStatus.Pause;
        this.audioPlayNotify({"TYPE":MmpEventType.playback_error,"TAG":this.pvTag,"ARG1":109,"ARG2":0,"ARG3":0,"ARG4":0});
    } else {
        document.querySelector('#music_play_btn').className = 'music_play_btn';
    }
}

var MUSIC_SEEK_LONG = 20000;
MusicPlayObj.prototype.doMediaSeek = function(isBack){
    var SEEK_LONG;
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmp || musicPlayObj.playObj.curSourceType == SourceType.Dmr){
        SEEK_LONG = MUSIC_SEEK_LONG;
    } else {
        SEEK_LONG = 10000;
    }
    if(playStatus == MmpPlayStatus.Speed){
        console.log("doMediaSeek playStatus == MmpPlayStatus.Speed return");
        return;
    }
    if(this.startSeekTime == -1){
        this.startSeekTime = this.currentPos;
    }
    if(isBack){
        if(this.startSeekTime > SEEK_LONG){
            this.startSeekTime -= SEEK_LONG;
        } else {
            this.startSeekTime = 0;
        }
    } else {
        if(this.mediaDuration - this.startSeekTime > SEEK_LONG){
            this.startSeekTime += SEEK_LONG;
        } else {
            this.startSeekTime = this.mediaDuration;
        }
    }
    if(this.mediaSeek_t){
        clearTimeout(this.mediaSeek_t);
        this.mediaSeek_t = null;
    }
    this.mediaSeek_t = setTimeout("musicPlayObj.timeSeek()", 500);
}

MusicPlayObj.prototype.timeSeek = function (){
    console.log("startSeekTime time = "+this.startSeekTime);
    playbackOperator(this.musicHandle, playbackCommand.seekTime, parseInt(this.startSeekTime/1000));
    this.startSeekTime = -1;
    this.mediaSeek_t = null;
}

MusicPlayObj.prototype.stopPlay = function() {
    if(this.musicHandle){
        //removeCmpbEventListener(audioPlayNotifyName, audioPlayNotify);
        playbackOperator(this.musicHandle, playbackCommand.stop);
        playbackDeinit(this.musicHandle);
        this.musicHandle = null;
        this.pvTag = null;
    }
};

MusicPlayObj.prototype.previousClick = function (){
    toPlay('prev');
};

MusicPlayObj.prototype.nextClick = function() {
    toPlay('next');
};

MusicPlayObj.prototype.toPlay =  function(action) {
    console.log("toPlay action = " + action);
    if (action == 'play') {
        this.cmdPlay();
    }
    else if (action == 'pause') {
        this.musicPlayOperator(playbackCommand.pause);
        document.querySelector('#music_play_btn').className = 'music_pause_btn';
    } 
    else if (action == 'prev') {
        this.playMusicMode(action);
    } 
    else if (action == 'next') {
        this.playMusicMode(action);
    }
    ;
};

MusicPlayObj.prototype.playMusicMode = function (action) {
    console.log("playMusicMode");
    if(!this.playObj){
        console.log("playMusicMode !this.playObj return");
        return;
    }
    var temp;
    if (action == 'prev') {
        temp = this.playObj.getPlayInfo({isNext:false,isRepeat:this.getRepeat(),isShuffle:false,isPlayAll:this.isPlayAll,mediaType:2});
        if(this.isPlayAll || !this.getRepeat() || temp){
            this.curPlayInfo = temp;
        }
    } else if (action == 'next'){
        this.curPlayInfo = this.playObj.getPlayInfo({isNext:true,isRepeat:this.getRepeat(),isShuffle:this.shuffle,mediaType:2});
    } else if (action == 'ended' || action == 'error') {
        console.log("this.isPlayAll = " + this.isPlayAll+";this.getRepeat() = " + this.getRepeat());
        if(this.isPlayAll){
            temp = this.playObj.getPlayInfo({isNext:true,isRepeat:this.getRepeat(),isShuffle:this.shuffle,mediaType:2});
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
    console.log("this.curPlayInfo = " + JSON.stringify(this.curPlayInfo));
    if(!this.curPlayInfo){
        this.stopMusic();
        return;
    }
    setTimeout(function(){musicPlayObj.initPlayer();},100);
};

MusicPlayObj.prototype.initPlayer = function () {
    console.log("initPlayer this.curPlayInfo = " + JSON.stringify(this.curPlayInfo));
    this.stopPlay();
    var paramObj;
    var fileName;
    this.isPlayDone = false;
    switch(this.playObj.curSourceType){
        case SourceType.Dmp:
        paramObj = {mediaPath:this.curPlayInfo.mediaInfo.fileObjId,bMode:2,info:this.curPlayInfo.devId};
        fileName = this.curPlayInfo.mediaInfo.mediaName;
        break;
        case SourceType.Dmr:
        paramObj = {mediaPath:this.curPlayInfo.URL,bMode:2,protocal:this.curPlayInfo.PROTOCOL_INFO};
        fileName = this.curPlayInfo.mediaName;
        break;
        default:
        paramObj = {mediaPath:this.curPlayInfo.MEDIA_PATH};
        var pathName = this.curPlayInfo.MEDIA_PATH;
        fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
        break;
    }
    if(this.playObj.curSourceType != SourceType.Dmr && this.curDisplayMode == musicDisplayMode.simplePlay){
        music_content_focus(false);
    }
    document.querySelector('#music_current_name').innerHTML = fileName;
    var ret = playbackInitWithPath(paramObj);
    if(ret == null || ret.STATUS != 0){
        if(ret){
            this.musicHandle = ret.HANDLE;
            this.pvTag = ret.PVTAG;
        } else {
            this.pvTag = -1;
        }
        
        this.audioPlayNotify({"TYPE":MmpEventType.playback_error,"TAG":this.pvTag,"ARG1":109,"ARG2":0,"ARG3":0,"ARG4":0});
        return;
    }
    this.musicHandle = ret.HANDLE;
    this.pvTag = ret.PVTAG;
    playStatus = MmpPlayStatus.Pause;    
    this.cmdPlay();
    if(this.curDisplayMode >= musicDisplayMode.simplePlay){
        $('#music_play_btn').focus();
    }
    //var mediaInfo = playbackOperator(this.musicHandle, playbackCommand.getMediaInfo);
    //if(mediaInfo){
        //this.mediaDuration = JSON.parse(mediaInfo).ITEMS[0].mediaDuration;
    //}
};

MusicPlayObj.prototype.init = function (obj, sourceType, isPlayAll) {
    try{
    mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.audio);
    this.initOption();
    this.timeReset();
    if(typeof(isPlayAll) != 'undefined'){
        this.isPlayAll = isPlayAll;
    } else {
        this.isPlayAll = false;
    }
    var curValue = localStorage.getItem('Shuffle');
    if(parseInt(curValue)){
        this.shuffle = true;
    } else {
        this.shuffle = false;
    }
    
    if(sourceType == SourceType.Dmr){
        this.playObj = {curSourceType:sourceType};
        this.curPlayInfo = obj;
        this.firstPlayIndex = 0;
    } else {
        this.playObj = obj;
        this.curPlayInfo = this.playObj.getPlayInfo({mediaType:2});
        this.firstPlayIndex = this.playObj.getPlayIndex(2);
    }

    this.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
    this.initMusicBottombar();
    setTimeout(function(){musicPlayObj.initPlayer();},100);
    }catch (e) {
        console.log(e);
    }finally{
        endLoadingAnimate();
    }

};

MusicPlayObj.prototype.timeupdate = function (currentTime) {
    document.querySelector('#music_player_current_time').innerHTML = timeFormat(this.currentPos);
    document.querySelector('#music_player_total_time').innerHTML = timeFormat(this.mediaDuration);
    var surpos = this.currentPos / this.mediaDuration;
    var perc;
    if(this.mediaSeek_t){
        perc = 100 * this.startSeekTime / this.mediaDuration;
    } else {
        perc = 100 * surpos;
    }
    $('#music_progress').css('width', perc + '%');
        
    if (this.curDisplayMode != musicDisplayMode.hidePlay) {
        var pos = $('#music_play_btn').offset();
        pos.left = parseInt(surpos * this.playBtnLenth) + 85;
        $('#music_play_btn').css('left', pos.left + 'px');
    }

};

MusicPlayObj.prototype.timeReset = function (){
    this.currentPos = 0;
    this.mediaDuration = 0;
    this.startSeekTime = -1;
    this.mediaSeek_t = null;
    document.querySelector('#music_player_current_time').innerHTML = timeFormat(0);
    document.querySelector('#music_player_total_time').innerHTML = timeFormat(0);
    $('#music_current_name').html('');
    document.querySelector('#music_progress').style.width = '0px';
    $('#music_play_btn').css('left', '85px');
};

MusicPlayObj.prototype.music_player_key_dispatch = function (isup, e) {
    console.log("music_player_key_dispatch className = " + e.target.className);
    var keynum = e.which || e.keyCode;
    if (this.curDisplayMode == musicDisplayMode.minimised) {
        this.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
        if (KeyEvent.DOM_VK_UP == keynum)
            return;
    } else if (musicPlayObj.curDisplayMode == musicDisplayMode.hidePlay) {
        setMusicPlayerModeTimer(6000, musicDisplayMode.simplePlay);
    } else if(musicPlayObj.curDisplayMode == musicDisplayMode.simplePlay && musicPlayObj.playObj.curSourceType != SourceType.Dmr){
        setMusicPlayerModeTimer(60000, musicDisplayMode.minimised);
    }
    var id = e.target.className;

    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0){
        console.log("musicPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0");
        return;
    }
    var focus_id;
    switch (keynum) {
    case KeyEvent.DOM_VK_LEFT:
        if (isup) {
            this.musicPlayOperator(playbackCommand.seekTime, true);
        }
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if (isup) {
            this.musicPlayOperator(playbackCommand.seekTime, false);
        }
        break;
    case KeyEvent.DOM_VK_RETURN:
        if (isup && id != "") {
            var fun_str = $('.' + id).attr('data-key-enter');
            eval(fun_str);
        }
        break;
    case KeyEvent.DOM_VK_UP:
        if(id == ""){
            return;
        }
        if (isup && (musicPlayObj.playObj.curSourceType != SourceType.Dmr)) {
            if (this.curDisplayMode == musicDisplayMode.simplePlay) {
                var funStr = $('.' + id).attr('data-focus-up-function');
                console.log("data-focus-up-function = " + funStr);
                if (funStr) {
                    eval(funStr);
                }
            }
        }
        break;
    case KeyEvent.DOM_VK_DOWN:

        break;
    case KeyEvent.DOM_VK_PLAY:
        this.playOrPauseClick(true);
        break;
    }
}

MusicPlayObj.prototype.initMusicPlayerMode = function (mode, notFocus) {
    console.log("initMusicPlayerMode mode = " + mode);
    $(".content_box").fadeIn();
    switch (mode) {
    case musicDisplayMode.none:
        this.stopPlay();
        setMusicPlayerModeTimer(0);
        musicPlayShowTopMenuBar(true);
        $($("#con_top_menu_0").find(".submenu_bar_layout_bg")).fadeIn();
        $('#music_page_indicator_layout').fadeIn();
        $('#footer').fadeIn();
        $('#music_player_bg').css('display', 'none');
        $('#music_play_btn')[0].className = '';
        if(typeof(notFocus) == 'undefined'){
            music_content_focus(true);
        }
        break;
    case musicDisplayMode.fullPlay:
        setMusicPlayerModeTimer(0);
        musicPlayShowTopMenuBar(true);
        $($("#con_top_menu_0").find(".submenu_bar_layout_bg")).fadeIn();
        $('#music_page_indicator_layout').fadeIn();
        $('#footer').fadeIn();
        $('#music_player_bg').css('display', '');
        $('#music_player_bg').css('background', 'url(../Assets/_Slices/Slice_572.png)');
        music_content_focus(true);
        break;
    case musicDisplayMode.simplePlay:
        if(this.playObj.curSourceType != SourceType.Dmr){
            music_content_focus(false);
        }

        musicPlayShowTopMenuBar(false);
        $($("#con_top_menu_0").find(".submenu_bar_layout_bg")).fadeOut();
        if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
            $(".content_box").fadeOut();
        } else {
            setMusicPlayerModeTimer(60000, musicDisplayMode.minimised);
        }
        $('#music_page_indicator_layout').fadeOut();
        $('#footer').fadeOut();
        $('#music_player_bg').css('display', '');
        $('#music_player_bg').css('background', 'url(../Assets/_Slices/Slice_572.png)');
        play_pause_btn_focus();
        break;
    case musicDisplayMode.hidePlay:
        console.log("musicDisplayMode.hidePlay");
        musicPlayShowTopMenuBar(false);
        setMusicPlayerModeTimer(6000, musicDisplayMode.simplePlay);
        $($("#con_top_menu_0").find(".submenu_bar_layout_bg")).fadeOut();
        $('#music_page_indicator_layout').fadeOut();
        $('#footer').fadeOut();
        $('#music_player_bg').css('display', 'none');
        $('#music_player_bg').css('background', '');
        $('#music_play_btn').css('left', '585px');
        music_content_focus(true);
        break;
    case musicDisplayMode.minimised:
        setMusicPlayerModeTimer(0);
        $(".content_box").fadeOut();
        $('#music_player_bg').css('display', '');
        $('#music_player_bg').css('background', '');
        play_pause_btn_focus();
        break;
    }
};

function musicPlayShowTopMenuBar(isShow){
    if(musicPlayObj.playObj.curSourceType == SourceType.Usb){
        if(isShow){
            $('.top_menu_bar').fadeIn();
        } else {
            $('.top_menu_bar').fadeOut();
        }
    }
}

var musicPlayerModeTimer;
function setMusicPlayerModeTimer(time, mode) {
    console.log("setMusicPlayerModeTimer time = " + time +";mode = " + mode);
    if (null  != musicPlayerModeTimer) {
        console.log("clearTimeout");
        clearTimeout(musicPlayerModeTimer);
        musicPlayerModeTimer = null ;
    }
    if (time > 0) {
        musicPlayerModeTimer = setTimeout('doSwitchModeTimer(' + mode + ');', time);
    }
}

function doSwitchModeTimer(mode){
    if(contentBrowserObj.curShowMode == contentBrowserObj.ShowMode.MusicPlay){
        musicPlayObj.switchDisMusicplayerMode(mode);
    }
}

MusicPlayObj.prototype.switchDisMusicplayerMode = function (mode, notFocus) {
    console.log("switchDisMusicplayerMode curDisplayMode = " + this.curDisplayMode + ";mode = " + mode);
    if (this.curDisplayMode != mode) {
        this.curDisplayMode = mode;
        this.initMusicPlayerMode(mode, notFocus);
        console.log("this.curDisplayMode = " + this.curDisplayMode);
    }
};

function showMusicBottombar() {
    
    $('#music_player_footer').fadeIn();
    setTimeout("hideMusicBottombar()", 2000);
}

MusicPlayObj.prototype.initMusicBottombar = function () {
    var data = playerColorKeyData;
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
    var children = $('#music_player_footer').find('li');
    for (var i = 0; i < children.length; i++) {
        var text = $(children[i]).text();
        var htmltext = $(children[i]).html();
        var html = htmltext.substring(0, htmltext.lastIndexOf(text));
        $(children[i]).html(html + getTranslate(data[i]));
    }
}

function hideMusicBottombar() {
    console.log("hideMusicBottombar = ");
    $('#music_player_footer').fadeOut();
}

MusicPlayObj.prototype.handleMusicPlayerKey = function (e) {
    console.log("handleMusicPlayerKey");
    var keynum = e.which || e.keyCode;
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0){
        console.log("musicPlayObj.playObj.curSourceType == SourceType.Dmr && DmrKeyList.indexOf(keynum) < 0");
        return;
    }
    if (bottomBarKeyList.indexOf(keynum) !== -1 && musicPlayObj.playObj.curSourceType != SourceType.Dmr) {
        showMusicBottombar();
    }
    
    if (this.curDisplayMode == musicDisplayMode.minimised) {
        this.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
        if (KeyEvent.DOM_VK_INFO == keynum) {
            return;
        }
    }
    if (this.curDisplayMode == musicDisplayMode.hidePlay) {
        setMusicPlayerModeTimer(6000, musicDisplayMode.simplePlay);
    } else if(musicPlayObj.curDisplayMode == musicDisplayMode.simplePlay && musicPlayObj.playObj.curSourceType != SourceType.Dmr){
        setMusicPlayerModeTimer(60000, musicDisplayMode.minimised);
    }
    switch (keynum) {
    case KeyEvent.DOM_VK_INFO:
    if(musicPlayObj.playObj.curSourceType == SourceType.Dmr){
        if(isDialogShowById('metedata_dialog')) {
            closeDialog();
            return;
        } else {
            showDlnaMusicMetedataDialog(musicPlayObj.curPlayInfo);
        }
        return;
        
    } else {
        if ($(".content_box").css('display') != 'none') {
            // 直接进入
            this.switchDisMusicplayerMode(musicDisplayMode.minimised);
        }
    }
        break;
    case KeyEvent.DOM_VK_BACK:
        handleBackKey();
        break;
    case KeyEvent.DOM_VK_RED:
        content = $('#music_player_footer').find('li')[1];
        var info = $(content).text();
        console.log("DOM_VK_RED info = " + info);
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
        content = $('#music_player_footer').find('li')[2];
        var info = $(content).text();
        console.log("DOM_VK_GREEN info = " + info);
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
        if (isDialogShow()) {
            closeDialog();
            return;
        }
        break;
    case KeyEvent.DOM_VK_BLUE:
        // 跳转到help界面
        goToHelpPage();
        break;
    case KeyEvent.DOM_VK_OPTION:
        if (isDialogShowById('option_dialog')) {
            closeDialog();
            return;
        }
        closeDialog();
        showOptionDialog("Music Player", musicOptionNotify);
        break;
    case KeyEvent.DOM_VK_STOP:
        this.stopMusic();
        break;
    case KeyEvent.DOM_VK_PAUSE:
        this.playOrPauseClick(false);
        break;
    case KeyEvent.DOM_VK_FAST_FWD:
        if(musicPlayObj.playObj.curSourceType == SourceType.Usb){
            this.musicPlayOperator(playbackCommand.ff);
        }
        break;
    case KeyEvent.DOM_VK_REWIND:
        if(musicPlayObj.playObj.curSourceType == SourceType.Usb){
            this.musicPlayOperator(playbackCommand.fr);
        }
        break;
    case KeyEvent.DOM_VK_TRACK_NEXT:
    case KeyEvent.DOM_VK_CH_INCREASE: //CH+
    if(musicPlayObj.playObj.curSourceType != SourceType.Dmr){
        this.playMusicMode('next');
    }
    break;
    case KeyEvent.DOM_VK_TRACK_PREV:
    case KeyEvent.DOM_VK_CH_DECREASE: //Ch-
    if(musicPlayObj.playObj.curSourceType != SourceType.Dmr){
        if(musicPlayObj.currentPos > 3000){
            playbackOperator(this.musicHandle, playbackCommand.seekTime, 0);
        } else{
            this.playMusicMode('prev');
        }
    }
    break;
    case KeyEvent.DOM_VK_LIST:
    if(this.curDisplayMode == musicDisplayMode.minimised){
        this.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
    } else if(this.curDisplayMode == musicDisplayMode.hidePlay || this.curDisplayMode == musicDisplayMode.simplePlay){
        this.switchDisMusicplayerMode(musicDisplayMode.fullPlay);
    }
    break;
    }
};

MusicPlayObj.prototype.initOption = function (){
    console.log("option_data_attr = "+ JSON.stringify(this.option_data_attr))
    for(index in this.option_data_attr){
        var curValue;
        var id = this.option_data_attr[index].name.replace(' ', '_');
        console.log("initOption id = " + id);
        curValue = localStorage.getItem(id);
        if(curValue){
            if(curValue >= this.option_data_attr[index].value.length){
                curValue = 0;
                localStorage.setItem(id,curValue);
            } else if(curValue < 0){
                curValue = 0;
                localStorage.setItem(id,curValue);
            }
            this.option_data_attr[index].curValue = parseInt(curValue);
        }
    }
};

function musicOptionNotify(key, valueIndex, itemObj){
    console.log("musicOptionNotify key = " +key+";valueIndex = " +valueIndex);
    //localStorage.setItem(key.replace('Music Player','Music'), valueIndex);
    musicPlayObj.switchValue(key, valueIndex, itemObj);
}

MusicPlayObj.prototype.switchValue = function (key, valueIndex, itemObj){
    console.log("switchValue key = " + this.option_data_attr[keyIndex].value[valueIndex]);
    switch(key.replace('Music Player_','')){
    case Shuffle.name:
    musicPlayerColorKeyData[1] = itemObj.value[valueIndex];
    break;
    }
};

MusicPlayObj.prototype.dmrCmdOperator = function(type, value){
    console.log("MusicPlayObj dmrCmdOperator type = "+type+";value = " + value);
    switch(type){
        case DmrNotifyCmdType.pause:
        this.playOrPauseClick(false);
        break;
        case DmrNotifyCmdType.resume:
        this.playOrPauseClick(true);
        break;
        case DmrNotifyCmdType.stop:
        this.stopPlay();
        this.closeMusicDialog();
        $('#music_play_btn')[0].className = 'music_stop_btn';
        break;
        case DmrNotifyCmdType.seekTime:
        playbackOperator(this.musicHandle, playbackCommand.seekTime, value);
        break;
        case DmrNotifyCmdType.playSpeed:
        playbackOperator(this.musicHandle, playbackCommand.setSpeed, value);
        break;
    }
};

MusicPlayObj.prototype.plugoutUsb = function(usbPath){
    if(this.curPlayInfo && this.curPlayInfo.MEDIA_PATH && this.curPlayInfo.MEDIA_PATH.indexOf(usbPath) == 0){
        this.stopMusic(true);
    }
}

MusicPlayObj.prototype.dmsLost = function(devId){
    if(this.playObj && this.playObj.dlnaMusicPlayObj && this.playObj.dlnaMusicPlayObj.DEV_ID == devId){
        this.stopMusic(true);
    }
}

var musicPlayObj = new MusicPlayObj();