var pathReg = new RegExp("/","g");

var GlobalPhotoPlayObj = function(){
	this.isPlay = true;
	this.autoPlay_t = null ;
	this.rotateValue = ["rotate_0", "rotate_90", "rotate_180", "rotate_270"];
	this.slideshowTime = 2000;
	this.curRotateIndex = 0;
	this.photoInfoObj;
	this.shuffle = false;
	this.activeContent;
	this.firstPlayIndex;
	this.curPlayInfo;//{initInfo:{mediaPath:'ssss'},title}
	this.playbar_t = null;
};

GlobalPhotoPlayObj.prototype.showPhoto = function (action) {
	if(!this.photoInfoObj){
		console.log("showPhoto !this.photoInfoObj return");
		return;
	}
	var temp;
    if (action == 'prev') {
		temp = this.photoInfoObj.getPlayInfo({isNext:false,isRepeat:this.getImgRepeat(),isShuffle:this.shuffle,mediaType:1});
		if(temp){
			if(!this.getImgRepeat() && !this.shuffle){
				//if(this.photoInfoObj.getPlayIndex() == this.firstPlayIndex){
				//	temp = null;
				//}
			}
			this.curPlayInfo = temp;
		} else {
			console.log("cur is the first one return");
			return;
		}
    } else if (action == 'next') {
		temp = this.photoInfoObj.getPlayInfo({isNext:true,isRepeat:this.getImgRepeat(),isShuffle:this.shuffle,mediaType:1});
		if(temp){
			if(!this.getImgRepeat() && !this.shuffle){
				//if(this.photoInfoObj.getPlayIndex() == this.firstPlayIndex){
				//	temp = null;
				//}
			}
			this.curPlayInfo = temp;
		} else {
			console.log("cur is the first one return");
			return;
		}
	} else {
		var tempAct = action;
		if(tempAct == 'error'){
			tempAct = true;
		}
		temp = this.photoInfoObj.getPlayInfo({'isNext':tempAct,isRepeat:this.getImgRepeat(),isShuffle:this.shuffle,mediaType:1});
		if(this.isPlay && !temp && !action){
			console.log("this.isPlay && !temp && !action");
			return;
		}
		if(this.getImgRepeat() && action == 'error' && this.curPlayInfo == temp){
            temp = null;
		}
	}
    this.curPlayInfo = temp;
	if(!this.curPlayInfo){
		this.playStop();
		return;
	}
    this.resetRotate();
    this.imgStop();
    var imgPath;
	if(this.curPlayInfo.mediaInfo){
		imgPath = this.curPlayInfo.mediaInfo.localPath
	} else {
		imgPath = this.curPlayInfo.MEDIA_PATH
	}
	this.setPhotoName();
	if(this.imgPlay(imgPath)){
		 this.resetTimer();
	}
};

GlobalPhotoPlayObj.prototype.resetTimer = function (isStop) {
console.log("resetTimer isPlay = " + this.isPlay);
    if (this.autoPlay_t) {
        clearTimeout(this.autoPlay_t);
        this.autoPlay_t = null ;
    }
    
    if (this.isPlay && !isStop) {
        this.autoPlay_t = setTimeout("photoPlayObj.showPhoto(true)", this.slideshowTime);
    }
};

GlobalPhotoPlayObj.prototype.initStatus = function () {
	console.log("initStatus this.curPlayInfo = " + JSON.stringify(this.curPlayInfo));
	var imgPath;
	if(this.curPlayInfo.mediaInfo){
		imgPath = this.curPlayInfo.mediaInfo.localPath
	} else {
		imgPath = this.curPlayInfo.MEDIA_PATH
	}

	if(this.imgPlay(imgPath) && this.isPlay){
		this.resetTimer();
	}
};

GlobalPhotoPlayObj.prototype.setPhotoName = function(){
	if(this.curPlayInfo.mediaInfo){
		$('#photo_current_name').html(this.curPlayInfo.mediaInfo.mediaName);
	} else {
		var path = this.curPlayInfo.MEDIA_PATH;
		$('#photo_current_name').html(path.substring(path.lastIndexOf('/') + 1));
	}
};

GlobalPhotoPlayObj.prototype.playpause = function (playStatus) {
    if (typeof (playStatus) == 'undefined') {       
        this.isPlay = !this.isPlay;    
    } else if (playStatus) {
        if (!this.isPlay) {
            this.isPlay = !this.isPlay;      
        }
    } else {
	console.log("playpause isPlay = " + this.isPlay);
        if (this.isPlay) {
            this.isPlay = !this.isPlay;       
        }
    }
	
	if(!photoPlayObj.photoInfoObj){
		var speed = this.isPlay ? cmpbCtrlSpeedType['1X'] : cmpbCtrlSpeedType.ZERO;
		dmrCmpbStateNotify({"TYPE":MmpEventType.speed_update, 'ARG1':speed});
	}
    
    this.setBtnPlayClass();
    this.resetTimer();
    //$('#btnPlay').focus();
};

GlobalPhotoPlayObj.prototype.setBtnPlayClass = function () {
	console.log("setBtnPlayClass this.isPlay = " + this.isPlay);
    if (this.isPlay) {
        $('#btnPlay').removeClass('photo_play_btn');
        $('#btnPlay').addClass('photo_pause_btn');
		this.setRedKeyStatus(SlideShow[1]);
    } else {
        $('#btnPlay').addClass('photo_play_btn');
        $('#btnPlay').removeClass('photo_pause_btn');
		this.setRedKeyStatus(SlideShow[0]);		
    }
};

GlobalPhotoPlayObj.prototype.setRedKeyStatus = function (value){
	console.log("setRedKeyStatus value = " + value);
        var content = $('#photo_play_footer').find('li')[1];
        var text = $(content).text();
        var htmltext = $(content).html();
        var html = htmltext.substring(0, htmltext.lastIndexOf(text));
		$(content).html(html+getTranslate(value));
};

GlobalPhotoPlayObj.prototype.imgRotate = function (index) {
	if(typeof(index) == 'undefined'){
		if (this.curRotateIndex < (this.rotateValue.length - 1)) {
			this.curRotateIndex++;
		} else {
			this.curRotateIndex = 0;
		}
	} else {
		this.curRotateIndex = index;
	}
    playbackImgOperator(imgPlaybackCommand.rotate, imgPlaybackRotateType[this.rotateValue[this.curRotateIndex]]);
};

GlobalPhotoPlayObj.prototype.resetRotate = function () {
    this.curRotateIndex = 0;
};

GlobalPhotoPlayObj.prototype.imgPlay = function (path){
	console.log("imgPlay path "+path);
	this.resetRotate();
	var ret = playbackImgOpen(path);
	if(ret != 0){
		showPlaybackErrorDialog(PlaybackErrorInfo[109], playErrorPhoto);
		if(!photoPlayObj.photoInfoObj){
			dmrCmpbStateNotify({"TYPE":MmpEventType.playback_error,"ARG1":109});
		}
		return false;
	}
    var tfx_effect = ALL_OPTION_DATA.Photo[3];
    if (tfx_effect.curValue == 0) {
        playbackImgOperator(imgPlaybackCommand.display);
    } else {
        playbackImgOperator(imgPlaybackCommand.tfx_effect_play, imgPlaybackTransitionType[tfx_effect.value[tfx_effect.curValue]]);
    }
	if(!photoPlayObj.photoInfoObj){
		dmrCmpbStateNotify({"TYPE":MmpEventType.play_done});
	}
	return true;
};

function playErrorPhoto(){
	if(photoPlayObj.isPlay){
		photoPlayObj.showPhoto('error');
	}
}

GlobalPhotoPlayObj.prototype.imgTfxEffect = function () {
    var tfx_effect = ALL_OPTION_DATA.Photo[3];
    if (tfx_effect.curValue == 0) {
        playbackImgOperator(imgPlaybackCommand.tfx_effect_stop);
    } else {
        playbackImgOperator(imgPlaybackCommand.tfx_effect_play, imgPlaybackTransitionType[tfx_effect.value[tfx_effect.curValue]]);
    }
};

GlobalPhotoPlayObj.prototype.getImgRepeat = function (){
	var repeat = ALL_OPTION_DATA.Photo[1];
	if(repeat.curValue == 0){
		return false;		
	} else {
		return true;
	}
};

GlobalPhotoPlayObj.prototype.imgStop = function (){
	playbackImgOperator(imgPlaybackCommand.tfx_effect_stop);
	playbackImgClose();
};

GlobalPhotoPlayObj.prototype.imgDeinit = function (){
	playbackImgOperator(imgPlaybackCommand.tfx_effect_stop);
	playbackImgClose();
	playbackImgDeinit();
	mtvObj.acfgSetConfigValue('g_misc__drv_photo_pic_mode_type', 0);
};

GlobalPhotoPlayObj.prototype.playStop = function (){
	this.imgDeinit();
	this.isPlay = false;
	this.resetTimer(true);
	this.timeout(true);
	this.closePhotoDialog();
	if(photoPlayObj.photoInfoObj){
		contentBrowserObj.showBrowser();
	} else {
		dmrPlayStop();
		history.go(-1);
	}
};

GlobalPhotoPlayObj.prototype.closePhotoDialog = function(){
	closePlaybackErrorDialog();
	closeDialog();
};

GlobalPhotoPlayObj.prototype.keyUpFunction = function (isup, e) {
    console.log("keyUpFunction className = " + e.target.className);
    if (isDialogShow()) {
        if (isOptionDialogShow()) {
            if (isup) {
                option_key_dispatch(event);
            }
        }
        return;
    }
    var id = e.target.className;
    if (id == "") {
        return;
    }
    
    var keynum = e.which || e.keyCode;
    switch (keynum) {
    case KeyEvent.DOM_VK_LEFT:
        if (isup) {
            $('.' + id).prev().focus();
        }
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if (isup) {
            $('.' + id).next().focus();
        }
        break;
    case KeyEvent.DOM_VK_RETURN:
        if (isup) {
            var fun_str = $('.' + id).attr('data-key-enter');
            eval(fun_str);
        }
        break;
    
    }
};

/*Deal with Color key */
GlobalPhotoPlayObj.prototype.handleCommonKey = function (e) {
    console.log("handleCommonKey KeyEvent.DOM_VK_PAUSE =" + KeyEvent.DOM_VK_PAUSE);
    var keynum = e.which || e.keyCode;
    switch (keynum) {
    case KeyEvent.DOM_VK_BACK:
        if (isDialogShowById('option_dialog')) {
            closeDialog();
            return;
        }
		this.playStop();
		break;
    case KeyEvent.DOM_VK_INFO:
		if(!photoPlayObj.photoInfoObj){
			if(isDialogShowById('metedata_dialog')) {
				closeDialog();
				return;
			} else {
				var mediaResolution = ""
				if(photoPlayObj.curPlayInfo.mediaResolution != "N/A"){
					mediaResolution = photoPlayObj.curPlayInfo.mediaResolution;
				}
				var content = '<tr><td>'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + photoPlayObj.curPlayInfo.mediaName + '</td></tr>\
						<tr><td>'+ getTranslate("Date")+'</td><td>' + getFormatDlnaDate(photoPlayObj.curPlayInfo.mediaDate) + '</td></tr>\
						<tr><td >'+ getTranslate("Size")+'</td><td>' + bytesToMb(photoPlayObj.curPlayInfo.mediaSize) + '</td></tr>';
				showMetedataDialog("Photo", content);
			}
		} else {
			this.switchBottomBar();
		}
        break;
    case KeyEvent.DOM_VK_RED:
        
        this.playpause();
        //play all
        break;
    case KeyEvent.DOM_VK_GREEN:
        this.imgRotate();
        break;
    case KeyEvent.DOM_VK_BLUE:
        // 跳转到help界面
        goToHelpPage();
        break;
    case KeyEvent.DOM_VK_OPTION:
        //handleOptionKey();
        if (isDialogShowById('option_dialog')) {
            closeDialog();
            return;
        }
        closeDialog();
        showOptionDialog("Photo Player", photoOptionNotify);
        break;

    case KeyEvent.DOM_VK_STOP:
        this.playStop();
        break;
    case KeyEvent.DOM_VK_PAUSE:
        this.playpause(false);
        break;
    case KeyEvent.DOM_VK_PLAY:
        this.playpause(true);
        break;
    case KeyEvent.DOM_VK_FAST_FWD:
	case KeyEvent.DOM_VK_TRACK_NEXT:
	case KeyEvent.DOM_VK_CH_INCREASE: //CH+
	this.showPhoto('next');
	break;
    case KeyEvent.DOM_VK_REWIND:
	case KeyEvent.DOM_VK_TRACK_PREV:
	case KeyEvent.DOM_VK_CH_DECREASE: //Ch-
	this.showPhoto('prev');
	break;
    case KeyEvent.DOM_VK_LIST:
    this.playStop();
    break;
    }
};

GlobalPhotoPlayObj.prototype.timeout = function (isStop) {
    if (null  != this.playbar_t) {
        clearTimeout(this.playbar_t);
		this.playbar_t = null;
    }
	if(!isStop){
		if ($('#photo_player_bg').css('display') == 'none') {
			$('#photo_player_bg').css('display', '');
			$(this.activeContent).focus();
		}
		this.playbar_t = setTimeout("photoPlayObj.switchBottomBar()", 5000);
	}
}

GlobalPhotoPlayObj.prototype.switchBottomBar = function(isShow){
	if(typeof(isShow) == 'undefined'){
		if ($('#photo_player_bg').css('display') == 'none') {
			isShow = true;
		} else {
			isShow = false;
		}
	}
	if(isShow){
		if ($('#photo_player_bg').css('display') == 'none') {
			$('#photo_player_bg').css('display', '');
			if(this.activeContent){
				$(this.activeContent).focus();
			} else {
				$('#btnPlay').focus();
			}
		}
	} else {
		if(document.activeElement.tagName != "BODY" && document.activeElement.tagName != "IFRAME"){
			this.activeContent = document.activeElement;
		}
		$('#photo_player_bg').css('display', 'none');
	}

};

GlobalPhotoPlayObj.prototype.dmrCmdOperator = function(type, value){
	console.log("MusicPlayObj dmrCmdOperator type = "+type+";value = " + value);
	switch(type){
		case DmrNotifyCmdType.pause:
		break;
		case DmrNotifyCmdType.resume:
		
		break;
		case DmrNotifyCmdType.stop:
		this.imgDeinit();
		this.closePhotoDialog();
		break;
		case DmrNotifyCmdType.imgRotate: //Min:0 MAX:360 Step:90 default:0
		var index = 0;
		if(value >=90 && value < 180){
			index = 1;
		} else if(value >=180 && value < 270){
			index = 2;
		} else if(value >=270 && value < 360){
			index = 3;
		} else {
			index = 0;
		}
		this.imgRotate(index);
		break;
		case DmrNotifyCmdType.imgZoom: //Min:100 MAX:400 Step:10 default:100
		playbackImgOperator(imgPlaybackCommand.zoom, value);
		this.
		break;
		case DmrNotifyCmdType.imgHoripan: //Min:-100 MAX:100 default:0
		break;
		case DmrNotifyCmdType.imgVertpan:
		break;
	}
};

function photoOptionNotify(key, valueIndex, itemObj){
console.log("photoOptionNotify key = " + key + ";valueIndex = " + valueIndex);
//localStorage.setItem(key.replace('Photo Player','Photo'), valueIndex);
photoPlayObj.switchValue(key, valueIndex, itemObj);
}

GlobalPhotoPlayObj.prototype.switchValue = function (key, valueIndex, itemObj){
	switch(key){
	case Slideshow_Time.name.replace(new RegExp(" ","g"),'_'):
	this.slideshowTime = SlideshowTime[itemObj.value[valueIndex]];
	console.log("GlobalPhotoPlayObj switchValue this.slideshowTime = " + this.slideshowTime);
	break;
	case Shuffle.name.replace(new RegExp(" ","g"),'_'):
	this.shuffle = (Shuffle.value[1] == itemObj.value[valueIndex]);
	console.log("GlobalPhotoPlayObj switchValue this.shuffle = " + this.shuffle);
	break;
	}
}

function photo_player_key_dispatch (event) {
	console.log("photo_player_key_dispatch");
    var keynum = event.which || event.keyCode;

     if ($('#photo_player_bg').css('display') == 'none') {
        if (keynum != KeyEvent.DOM_VK_INFO) {
            photoPlayObj.switchBottomBar(true);
           photoPlayObj.timeout();
			
        }
    } else {
       photoPlayObj.timeout();
    }
	
	if(!photoPlayObj.photoInfoObj && DmrKeyList.indexOf(keynum) < 0){
		return;
	}
        switch (keynum) {
        case KeyEvent.DOM_VK_RETURN:
            photoPlayObj.keyUpFunction(true, event);
            break;
		case KeyEvent.DOM_VK_TRACK_PREV:
		case KeyEvent.DOM_VK_TRACK_NEXT:
		case KeyEvent.DOM_VK_BLUE:
		// do nothing
		break;
        default:
            photoPlayObj.handleCommonKey(event);
            break;
        }
};

function  photo_player_red_keydown(event){
    var keynum = event.which || event.keyCode;
	if ($('#photo_player_bg').css('display') == 'none') {
		if (keynum != KeyEvent.DOM_VK_INFO) {
			photoPlayObj.switchBottomBar(true);
			photoPlayObj.timeout();
				
		}
	} else {
		  photoPlayObj.timeout();
	}
	if(!photoPlayObj.photoInfoObj){
		return true;
	}
	switch(keynum){
		case KeyEvent.DOM_VK_RED:
		case KeyEvent.DOM_VK_BLUE:
		case KeyEvent.DOM_VK_TRACK_PREV:
		case KeyEvent.DOM_VK_TRACK_NEXT:
		photoPlayObj.handleCommonKey(event);
		break;
        case KeyEvent.DOM_VK_UP:
        case KeyEvent.DOM_VK_DOWN:
        case KeyEvent.DOM_VK_LEFT:
        case KeyEvent.DOM_VK_RIGHT:
		photoPlayObj.keyUpFunction(true, event);
		break;
	}
	return true;
}

GlobalPhotoPlayObj.prototype.initOption = function (){
	var option_data_attr = ALL_OPTION_DATA["Photo"];
	console.log("option_data_attr = "+ JSON.stringify(option_data_attr))
	for(index in option_data_attr){
		var curValue;
		var id = option_data_attr[index].name.replace(' ', '_');
		console.log("initOption id = " + id);
		curValue = localStorage.getItem(id);
		if(curValue){
			if(curValue >= option_data_attr[index].value.length){
				curValue = 0;
				localStorage.setItem(id,curValue);
			} else if(curValue < 0){
				curValue = 0;
				localStorage.setItem(id,curValue);
			}
			option_data_attr[index].curValue = parseInt(curValue);
			this.switchValue(id, parseInt(curValue), option_data_attr[index])
		}
	}
};

GlobalPhotoPlayObj.prototype.init = function(photoObj, playStatus){
	console.log("photoObj = " + photoObj+";playStatus = " +playStatus);
	mtvObj.acfgSetConfigValue('g_misc__drv_photo_pic_mode_type', 1);
	mtvObj.acfgSetConfigItemValue(stvapi_config.mmp_play_state, icl_mmp_play_status.photo);
	playbackImgInit();
	this.initOption();
	if(typeof(playStatus) == 'undefined'){
		this.curPlayInfo = photoObj;
		this.photoInfoObj = null;
		this.isPlay = true;
		$('#photo_ctrl_lay').css('width', '110px');
		$('.music_player_previous').hide();
		$('.music_player_next').hide();
		$('#photo_play_footer').hide();
	} else {
		this.photoInfoObj = photoObj;
		this.isPlay = playStatus;
		this.curPlayInfo = this.photoInfoObj.getPlayInfo({mediaType:1});
		this.firstPlayIndex = this.photoInfoObj.getPlayIndex();
	}
	this.setPhotoName();
    this.setBtnPlayClass();
	this.initBottombar();
    $('#btnPlay').focus();
	setTimeout(function(){photoPlayObj.initStatus();}, 100);
	photoPlayObj.timeout();
};

GlobalPhotoPlayObj.prototype.initBottombar = function(){
	var data = photoPlayerColorKeyData;
	if(this.isPlay){
		photoPlayerColorKeyData[1] = SlideShow[1];
	}else{
		photoPlayerColorKeyData[1] = SlideShow[0];
	}

    var children = $('#photo_play_footer').find('li');
    for (var i = 0; i < children.length; i++) {
        var text = $(children[i]).text();
        var htmltext = $(children[i]).html();
        var html = htmltext.substring(0, htmltext.lastIndexOf(text));
        $(children[i]).html(html + getTranslate(data[i]));
    }
};

var photoPlayObj = new GlobalPhotoPlayObj();