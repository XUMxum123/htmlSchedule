/**/ 
var translateBeforewords = {"Info": "RC_OPT_INFO",
						   "Play All":"2K14_MAIN_DI_ALL_DEMOS_REDO",
						   "Shuffle On":"PLAY_SHUFFLE_ON",
						   "Help":"RC_FORMAT_HELP",
						   "Option":"OPTS",
						   "Sort":"PPG_SORT",
						   "Shuffle":"PLAY_SHUFFLE",
						   "Shuffle On":"PLAY_SHUFFLE_ON",
						   "Shuffle Off":"PLAY_SHUFFLE_OFF",
						   "Repeat":"PLAY_REPEAT",
						   "Subtitles":"OPTL_SBTLS",
						   "Subtitles On":"OPTION_SUBTITLES_ON",
						   "Subtitles Off": "OPTION_SUBTITLES_OFF",
						   "Automatic":"OPTION_SUBTITLES_MUTE",
						   "On during mute":"SBTL_MUTE_ON",
						   "Audio language":"ID_DIGIT_L133",
						   "Short" :"DLB_S",
						   "Medium" :"DLB_M",
						   "Long" :"DLB_L",
						   "None" :"TLB_NONE",
						   "Dissolve" :"TLB_DISSOLVE",
						   "Wipe left" :"TLB_WP_L",
						   "Wipe right" :"TLB_WP_R",
						   "Wipe up" :"TLB_WP_U",
						   "Wipe down" :"TLB_WP_D",
						   "Box in" :"TLB_BX_IN",
						   "Box out" :"TLB_BX_OUT",
						   "Character set" :"CHR_SET",
						   "Western Europe" :"QT_TIME_ZONE_WESTERN_EUROPE",
						   "Greek" :"HID_KBD_ID_17",
						   "Turkish" :"EU_TUR_LY_NAME",
						   "Small" :"MAIN_SUBTITLE_FONT_SIZE_SMALL",
						   "Standard" :"PIC_STANDARD",
						   "Big" :"INFO_BIG",
						   "Blue" :"COLOR_BLUE",
						   "Red" :"COLOR_RED",
						   "Green" :"COLOR_GREEN",
						   "Sound mode": "BNR_LBL_S_MODE",
						   "Yellow" :"COLOR_YELLOW",
						   "Black": "MAIN_SUBTITLE_COLOUR_BLACK",
						   "Status":"ID_WIRE_STATUS",
						   "Central Europe": "MAIN_CENTRAL_EUROPE",
						   "Cyrillic": "MAIN_CYRILLIC",
						   "Font Size": "MAIN_SUBTITLE_FONT_SIZE",
						   "Subtitle Color": "MAIN_SUBTITLE_COLOUR",
						   "White": "MAIN_SUBTITLE_COLOUR_WHITE",
						   "Slideshow Time":"MAIN_SLIDESHOW_TIME",
						   "Stop Slide Show": "STOP_SLIDESHOW",
						   //"Subtitles Display" :"TB_M_DTL",
						   "Subtitle Position":"MAIN_SUBTITLE_POSITION",
						   "Subtitle Setting": "MAIN_SUBTITLE_SETTING",
						   "Subtitles Language" :"OPTION_SBTL_LANG",
						   "Slideshow Transition" :"TB_TFX",
						   "Time sync offset": "MAIN_SUBTITLE_TIME_SYNC_OFFSET",
						   "Play Once":"PLAY_ONEC",
						   "Play One": "QT_MEDIA_PLAY_ONE",
						   "Movie": "PIC_MOVIE_LT",
						   "Album": "QT_MEDIA_ALBUM",
						   "Media server": "QT_MEDIA_SERVER",
						   "Slide Show": "START_SLIDESHOW",
						   "No USB device connected": "QT_USB_DEVICE_NOT_CONNECTED",
						   "USB Device": "QT_USB_DEVICE",
						   "Year": "QT_MEDIA_YEAR", "Month":"QT_MEDIA_MONTH",
						   "Day": "TME_ADJ_DAY", "Font size": "MAIN_SUBTITLE_FONT_SIZE",
						   "Artist": "QT_MEDIA_ARTIST", "Genre": "PPG_GENRE", "Track": "QT_MEDIA_TRACK",
						   "Photo": "PIC_PHOTO", "Video": "FB_FF_VIDEO", 
						   "Music": "FB_FF_AUDIO", "Folder": "QT_MEDIA_FOLDER", "Title": "DP_TITLE",
						   "Size": "DP_SZ", "Date": "DP_DT", "Rotate": "TB_ROT",
						   "qt_playback_begining":"QT_PLAYBACK_BEGINNING",
						   "qt_resume":"QT_RESUME","ok":"OK",
						   "cancel":"CANCEL",clear:'CLEAR',next:"NEXT",
						   "DP_TITLE":"DP_TITLE",
						   "QT_MEDIA_FILE_NAME":"QT_MEDIA_FILE_NAME",
						   "SB_ARTIST":"SB_ARTIST",
						   "QT_MEDIA_ALBUM":"QT_MEDIA_ALBUM",
						   "DP_DURATION":"DP_DURATION",
						   "DP_DT":"DP_DT",
						   "QT_MEDIA_FOLDER":"QT_MEDIA_FOLDER",
						   "DP_SZ":"DP_SZ",
						   "QT_RESOLUTION":"QT_RESOLUTION",
						   "EVT_OTHERS":"EVT_OTHERS",
						   QT_ENTER_PIN:'QT_ENTER_PIN',
						   PWD_STATE_2:'PWD_STATE_2',
						   NFY_PHOTO:'NFY_PHOTO',
						   NFY_NO_AV_SVC:'NFY_NO_AV_SVC',
						   NFY_AV_NOT_SUP:'NFY_AV_NOT_SUP',
						   NFY_AUDIO_NOT_SUP:'NFY_AUDIO_NOT_SUP',
						   NFY_VIDEO_NOT_SUP:'NFY_VIDEO_NOT_SUP',
						   NFY_AUDIO_ONLY:'NFY_AUDIO_ONLY',
						   QT_MEDIA_RESOLUTION_UNSUPPORT:'QT_MEDIA_RESOLUTION_UNSUPPORT',
						   WFD_VIEW_MSG_VIDEO_NOT_SUPPORTED:'WFD_VIEW_MSG_VIDEO_NOT_SUPPORTED',
						   QT_DRM_NOT_SUPPORT:'QT_DRM_NOT_SUPPORT',
						   "Clear offline servers":'QT_SERVER_OFFLINE_CLEAR',
						   "Music Player":'QT_MEDIA_MUSIC_PLAYER',
						   "Movie Player":'QT_MEDIA_MOVIE_PLAYER',
						   "QT_SERVER_OFFLINE_WAKE_UP":'QT_SERVER_OFFLINE_WAKE_UP',
						   "QT_MEDIA_NO_SHARE_CONTENT":'QT_MEDIA_NO_SHARE_CONTENT',
						   "NO_NAME":'NO_NAME',
						   "Undefined":"UNDEFINED",
};

if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
	translateBeforewords['Subtitle Color']='MAIN_SUBTITLE_COLOR_LA';
}
					   
var translateAfterwords = {};

function getKeyWords(originalName){
	if(originalName == ""){
		return undefined;
	}
	return translateBeforewords[originalName];
}

function getTranslate(originalName){
	var KeyWord = getKeyWords(originalName);
	if (KeyWord == undefined ){
		return originalName;
	}
	if(!translateAfterwords.hasOwnProperty(KeyWord)){
		var transText = mtvObj.getLangString(KeyWord);
		if(transText){
			translateAfterwords[KeyWord] = mtvObj.getLangString(KeyWord);
		} else {
			return originalName;
		}
	}
	return translateAfterwords[KeyWord];
}

function updateUIString(langDict) {

  for ( var p in translateBeforewords ){  
	  if ( typeof ( translateBeforewords[ p ]) == " function " ){
		  
	  } else { 
				var result = getKeyWords(p);
				if(result != undefined){
					if (langDict.hasOwnProperty(result))
						translateAfterwords[result] = langDict[result];
				}
		} 
	} 
};

var languageChangeNotifyCallback = null;
function languageChangeNotify(jsonStr){
	var configNotify = JSON.parse(jsonStr);
	for(index in configNotify.ITEMS){
		configItem = configNotify.ITEMS[index];
		if(configItem.ID == -1 && configItem.ARG2 == 'g_gui_lang__gui_language'){
			if(languageChangeNotifyCallback){
				translateAfterwords = {};
				languageChangeNotifyCallback();
			} else {
				location.reload();
			}
			
		}
	}
}

(function(){
	window.dmrUtil.configUpdateNotifyCallback = languageChangeNotify;
})();