var GlobalContentBrowserObj = function(){
    this.ShowMode = {Browser:0,MusicPlay:1,PhotoPlay:2,VideoPlay:3,MusicAndPhotoPlay:4};
    this.curShowMode = this.ShowMode.Browser;
    
};

GlobalContentBrowserObj.prototype.getPlayObject = function(){
    var obj = null;
    switch(this.curShowMode){
        case this.ShowMode.MusicPlay:
        obj = musicPlayObj;
        break;
        case this.ShowMode.PhotoPlay:
        obj = photoPlayObj;
        break;
        case this.ShowMode.VideoPlay:
        obj = videoPlayObj;
        break;
        
    }
    return obj;
};

GlobalContentBrowserObj.prototype.stopPlay = function(){
    console.log("stopPlay");
    var obj = null;
    switch(this.curShowMode){
        case this.ShowMode.MusicPlay:
        musicPlayObj.stopMusic();
        break;
        case this.ShowMode.PhotoPlay:
        photoPlayObj.playStop();
        break;
        case this.ShowMode.VideoPlay:
        videoPlayObj.playStop();
        break;
        case this.ShowMode.MusicAndPhotoPlay:
        musicPlayObj.stopMusic();
        photoPlayObj.playStop();
        break;
        
    }
    if(musicPlayObj.curDisplayMode != musicDisplayMode.none){
        musicPlayObj.stopMusic();
    }
};

GlobalContentBrowserObj.prototype.dmrPlayExit = function(){
    window.dmrUtil.removeListener();
    history.go(-1);
};

GlobalContentBrowserObj.prototype.doStop = function(){
    var obj = null;
    switch(this.curShowMode){
        case this.ShowMode.MusicPlay:
        musicPlayObj.stopPlay();
        break;
        case this.ShowMode.PhotoPlay:
        photoPlayObj.imgDeinit();
        break;
        case this.ShowMode.VideoPlay:
        videoPlayObj.videoDelInit();
        break;
        case this.ShowMode.MusicAndPhotoPlay:
        musicPlayObj.stopPlay();
        photoPlayObj.imgDeinit();
        break;
        
    }
};

GlobalContentBrowserObj.prototype.refreshCbUi = function(refType){
    switch(refType){
        case 1://no usb -> usb
        if(noUsbDialog){
            noUsbDialog.close().remove();
            noUsbDialog = null;
        }
        waitLoading(true);
        setTimeout(function(){initUsb();}, 100);
        break;
        case 2://usb ->no usb
        closeDialog();
        var children = $('#footer').find('li');
        for (var i = 0; i < children.length; i++) {
            var text = $(children[i]).text();
            var htmltext = $(children[i]).html();
            var html = htmltext.substring(0, htmltext.lastIndexOf(text));
            $(children[i]).html(html);
        }
        $('#con_top_menu_0').hide();
        $('#con_top_menu_1').hide();
        $('#con_top_menu_2').hide();
        $('#con_top_menu_3').hide();
        initUsb();
        break;
    }
};

GlobalContentBrowserObj.prototype.showBrowser = function(){
    if(this.curShowMode == this.ShowMode.Browser){
        console.log("this.curShowMode == this.ShowMode.Browser");
        return;
    }
    if(this.curShowMode == this.ShowMode.MusicAndPhotoPlay){
        this.curShowMode = this.ShowMode.MusicPlay;
        mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.audio);
        console.log("musicPlayObj.curDisplayMode = " + musicPlayObj.curDisplayMode);
        if(musicPlayObj.curDisplayMode == musicDisplayMode.hidePlay){
            setMusicPlayerModeTimer(6000, musicDisplayMode.simplePlay);
        } else {
            setMusicPlayerModeTimer(0);
        }
    } else {
        this.curShowMode = this.ShowMode.Browser;
    }
    mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.on);
    closeDialog();
    $('#video_play_content').hide();
    $('#photo_play_layout').hide();
    $('#browser_and_audio_play').show();
    keyUpNotify = keyUpDispath;
    keyDownNotify = keyDownDispath;
    if(typeof(top_menu_selected_id) == 'undefined'){
        initUsb();
        return;
    }
    switch (top_menu_selected_id) {
    case "top_menu_0":
        if(mtvuiUtil.isMenuShow()){
            mtvuiUtil.storeFocus();
            mtvuiUtil._menuFrame.focus();
        }        
        break;
    case "top_menu_1":
        initVideo(true);
        $('#video_submenu_bar').children(':eq('+videoObj.submenuSelectedIdx+')').addClass('selected');
        submenu_selected_id = "video_submenu_bar_"+videoObj.submenuSelectedIdx;
        initPageIndicator('video_page_indicator', videoObj.pageIndicatorNum, videoObj.pageIndex);
        $('#video_item_'+videoObj.curFocusIndex).focus();
        if(mtvuiUtil.isMenuShow()){
            mtvuiUtil.storeFocus();
            mtvuiUtil._menuFrame.focus();
        }
        break;
    case "top_menu_2":
        initPhotoMode(photoObj.sortMode, true);
        $('#photo_submenu_bar').children(':eq('+photoObj.submenuSelectedIdx+')').addClass('selected');
        submenu_selected_id = "photo_submenu_bar_"+photoObj.submenuSelectedIdx;
        console.log("photo_album_container_'+photoObj.curFocusIndex = " + 'photo_album_container_'+photoObj.curFocusIndex);
        $('#photo_album_container_'+photoObj.curFocusIndex).focus();
        if(mtvuiUtil.isMenuShow()){
            mtvuiUtil.storeFocus();
            mtvuiUtil._menuFrame.focus();
        }
        break;
    case "top_menu_3":
        doRefreshLayout();
        break;
    }

};

GlobalContentBrowserObj.prototype.playMusic = function(obj, sourceType,isPlayAll){
    try{
    if(this.curShowMode != this.ShowMode.MusicPlay){
        this.curShowMode = this.ShowMode.MusicPlay;
        $('#browser_and_audio_play').show();
        $('#video_play_content').hide();
        $('#photo_play_layout').hide();
        closeDialog();
        clearThumbnail();
        keyUpNotify = keyUpDispath;
        keyDownNotify = keyDownDispath;
    }
    musicPlayObj.init(obj, sourceType, isPlayAll);
    }catch (e) {
        console.log(e);
        endLoadingAnimate();
    }
};

GlobalContentBrowserObj.prototype.playPhoto = function(playObj, isPlayAll){
    if(this.curShowMode != this.ShowMode.PhotoPlay){
        if(this.curShowMode == this.ShowMode.MusicPlay){
            this.curShowMode = this.ShowMode.MusicAndPhotoPlay;
        } else {
            this.curShowMode = this.ShowMode.PhotoPlay;
        }
        clearThumbnail();
        closeDialog();
        $('#browser_and_audio_play').hide();
        $('#video_play_content').hide();
        $('#photo_play_layout').show();
        keyUpNotify = photo_player_key_dispatch;
        keyDownNotify = photo_player_red_keydown;
    }
    photoPlayObj.init(playObj, isPlayAll);
};

GlobalContentBrowserObj.prototype.playVideo = function(obj, sourceType, isPlayAll){
    try{
    if(this.curShowMode != this.ShowMode.VideoPlay){
        clearThumbnail();
        closeDialog();
        this.curShowMode = this.ShowMode.VideoPlay;
        $('#browser_and_audio_play').hide();
        $('#photo_play_layout').hide();
        $('#video_play_content').show();
        keyUpNotify = video_play_key_dispatch;
        keyDownNotify = video_player_red_keydown;
    }
    videoPlayObj.init(obj, sourceType, isPlayAll);
    }catch (e) {
        console.log(e);
         endLoadingAnimate();
    } 
};

GlobalContentBrowserObj.prototype.usbAddDetect = function(){
    console.log("usbAddDetect");
    switch(this.curShowMode){
        case this.ShowMode.MusicPlay:
        musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.fullPlay);
        break;
        case this.ShowMode.PhotoPlay:
        photoPlayObj.playStop();
        break;
        case this.ShowMode.VideoPlay:
        videoPlayObj.playStop();
        break;
        case this.ShowMode.MusicAndPhotoPlay:
        photoPlayObj.playStop();
        break;
        default:
        if(top_menu_item_focus != 'top_menu_3'){
            var temp = top_menu_selected_id;
        }
        initPage('top_menu_3');
        if(temp){
            top_menu_item_focus(false, temp);
        }
        break;
        
    }
};

GlobalContentBrowserObj.prototype.updateData = function(){

    if(this.curShowMode == this.ShowMode.Browser || this.curShowMode == this.ShowMode.MusicPlay){
        switch (top_menu_selected_id) {
        case "top_menu_0":
            var focusId = document.activeElement.id;
            initMusicMode(musicObj.sortMode);
            if(focusId){
                $('#'+focusId).focus();
            }
            break;
        case "top_menu_1":
            initVideo(true);
            $('#video_submenu_bar').children(':eq('+videoObj.submenuSelectedIdx+')').addClass('selected');
            submenu_selected_id = "video_submenu_bar_"+videoObj.submenuSelectedIdx;
            initPageIndicator('video_page_indicator', videoObj.pageIndicatorNum, videoObj.pageIndex);
            $('#video_item_'+videoObj.curFocusIndex).focus();
            break;
        case "top_menu_2":
            initPhotoMode(photoObj.sortMode, true);
            $('#photo_submenu_bar').children(':eq('+photoObj.submenuSelectedIdx+')').addClass('selected');
            submenu_selected_id = "photo_submenu_bar_"+photoObj.submenuSelectedIdx;
            console.log("photo_album_container_'+photoObj.curFocusIndex = " + 'photo_album_container_'+photoObj.curFocusIndex);
            $('#photo_album_container_'+photoObj.curFocusIndex).focus();
            break;
        case "top_menu_3":

            break;
        }
    }

};

var contentBrowserObj = new GlobalContentBrowserObj();