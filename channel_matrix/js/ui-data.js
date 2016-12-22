 /*
*  ****************************************
*  TV sub_menu list introduction.
*  ****************************************
*/
//var TVSubMenuList = [{"name":"\""+ch_name+"\""},{"name":"All"},{"name":"Radio"},{"name":"New"}]
// var TVSubMenuList = [{"name":"QT_FAVOURITES"},{"name":"ALL"},{"name":"FPL_OPTION_3"},{"name":"CHM_OPTL_FILTER_NEW_CHANNEL"}];
var TVSubMenuList = [{"name": "QT_FAVOURITES"}, {"name": "ALL"}];
/*
*  ****************************************
*  Satellite sub_menu list introduction.
*  ****************************************
*/
// var SatelliteSubMenuList = [{"name":"QT_FAVOURITES"},{"name":"ALL"},{"name":"HS_WATCH_TV"},{"name":"FPL_OPTION_3"},{"name":"CHM_OPTL_FILTER_NEW_CHANNEL"}]
var SatelliteSubMenuList = [{"name": "QT_FAVOURITES"}, {"name": "ALL"}];
/*
*  ****************************************
*  The state abbreviations introduction.
*  ****************************************
*/
var COUNTRY_ROMANIA = "ROU"; /* Romania */
var COUNTRY_NEDERLAND = "NLD"; /*  Nederland */
var COUNTRY_UK = "GBR"; /*  United Kingdom of Great Britain */
var COUNTRY_BELGIUM = "BEL"; /* Belgium */
var COUNTRY_TURKEY = "TUR"; /* Turkey */


var translateAfterwords = {};

function getTranslate(KeyWord) {
    if (KeyWord == undefined) {
        return '';
    }
    if (!translateAfterwords.hasOwnProperty(KeyWord)) {
        var transText = mtvObj.getLangString(KeyWord);
        if (transText) {
            translateAfterwords[KeyWord] = mtvObj.getLangString(KeyWord);
        } else {
            return KeyWord;
        }
    }
    return translateAfterwords[KeyWord];
}

/*
*  ****************************************
*  All of colorKey list state introduction.
*  ****************************************
*/

var ColourKeyList_Normal = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "&nbsp;&nbsp;-","ColorKey_Green": "QT_FIND_CHANNEL","ColorKey_Yellow": "QT_FAV_MARK","ColorKey_Blue": "&nbsp;&nbsp;-","ColorKey_Options": "&nbsp;&nbsp;-"};
var ColourKeyList_TV_normal_Favorite_state = {"ColorKey_Info": "&nbsp;&nbsp;&nbsp;&nbsp;-","ColorKey_Red": "RENAME","ColorKey_Green": "MAIN_FAV_CH_MOVE","ColorKey_Yellow": "HS_DLG_REMOVE","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "OPTS"};

var ColourKeyList_FindChannel_results_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "PVR_BTN_CLOSE","ColorKey_Green": "PHM_VG_DEV_DLG_BTN_SEARCH_AGAIN","ColorKey_Yellow": "QT_FAV_MARK","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;-"};
var ColourKeyList_None_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "&nbsp;&nbsp;-","ColorKey_Green": "&nbsp&nbsp;-","ColorKey_Yellow": "&nbsp;&nbsp;-","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;-"};
var ColourKeyList_TV_normal_All_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "RENAME","ColorKey_Green": "QT_FIND_CHANNEL","ColorKey_Yellow": "QT_FAV_MARK","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "OPTS"};
var ColourKeyList_TV_normal_All_fav_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "RENAME","ColorKey_Green": "QT_FIND_CHANNEL","ColorKey_Yellow": "QT_FAV_UNMARDK","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "OPTS"};
var ColourKeyList_TV_normal_All_not_fav_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "RENAME","ColorKey_Green": "QT_FIND_CHANNEL","ColorKey_Yellow": "QT_FAV_MARK","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "OPTS"};
var ColourKeyList_Favorite_edit_one_by_one_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "CHM_TEXTE_DONE","ColorKey_Green": "QT_FAV_SELECT_RANGE","ColorKey_Yellow": "QT_FAV_SELECT_ALL","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "OPTS"};
var ColourKeyList_Option_menu_TV_normal_all_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "&nbsp;&nbsp;-","ColorKey_Green": "&nbsp;&nbsp;-","ColorKey_Yellow": "&nbsp;&nbsp;-","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;-"};
var ColourKeyList_Move_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "DONE","ColorKey_Green": "&nbsp;&nbsp;","ColorKey_Yellow": "&nbsp;&nbsp;","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;"};
var ColourKeyList_Moving_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "CHM_TEXTE_CANCEL","ColorKey_Green": "&nbsp;&nbsp;","ColorKey_Yellow": "&nbsp;&nbsp;","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;"};
var ColourKeyList_Select_Rang_state = {"ColorKey_Info": "&nbsp;&nbsp;-","ColorKey_Red": "RC_OPT_CLOSE","ColorKey_Green": "&nbsp;&nbsp;","ColorKey_Yellow": "&nbsp;&nbsp;","ColorKey_Blue": "RC_ADJUST_HELP","ColorKey_Options": "&nbsp;&nbsp;"};
var option_menuData = {"option_menu_all_fav": "QT_DIGITAL_PLUS_ANALOGUE","option_menu_all_find": "CHM_OPTL_FAV_FREE_SCRAMBLE","option_menu_all_lock": "ID_CHNN_LOCK","HS_DLG_SEARCH_CH": "HS_DLG_SEARCH_CH","btn_ok": "HS_DLG_OK","btn_cancel": "CHM_TEXTE_CANCEL","btn_new_srch_clr": "CHM_TEXTE_CLEAR","btn_new_srch_done": "CHM_TEXTE_DONE","btn_new_srch_cancel": "CHM_TEXTE_CANCEL","btn_yes": "CHM_DLG_CANCEL_YES","btn_no": "CHM_DLG_CANCEL_NO","create_fav_note1": "QT_FAV_CREATE","create_fav_note2": "QT_FAV_ORDER","option_menu_fav": "CHM_OPTL_UNMARK_AS_FAV","option_menu_cha": "QT_FIND_CHANNEL","option_menu_lock": "ID_CHNN_LOCK"};
var option_channle_islock = {"CHM_OPTL_LOCK_CHANNEL": "ID_CHNN_LOCK","CHM_OPTL_UNLOCK_CHANNEL": "CHM_OPTL_UNLOCK_CHANNEL","btn_pin_code_yes": "HS_DLG_OK","btn_pin_code_no": "CHM_PIN_CANCEL","pin_code_title": "CHM_PIN_TITLE","QT_CHANNEL_OPTIONS": "QT_CHANNEL_OPTIONS","QT_SET_PIN": "QT_SET_PIN","QT_INCORRECT_PIN": "CHM_PIN_INVALID_TEXT","QT_PIN_0000": "QT_PIN_0000","QT_CONFIRM_PIN": "QT_CONFIRM_PIN"};
var option_channel_sec_list = {"CHM_OPTL_FAV_ALL": "QT_DIGITAL_PLUS_ANALOGUE","CHM_OPTL_FILTER_DIGITAL": "CHM_OPTL_FILTER_DIGITAL","CHM_OPTL_FILTER_ANALOG": "CHM_OPTL_FILTER_ANALOG","CHM_OPTL_FAV_FREE_SCRAMBLE": "CHM_OPTL_FAV_FREE_SCRAMBLE","CHM_OPTL_FAV_FREE_ONLY": "CHM_OPTL_FAV_FREE_ONLY","CHM_OPTL_FAV_SCRAMBLE": "CHM_OPTL_FAV_SCRAMBLE"};
var favoritedata = {"QT_FAV_CHANNEL": "QT_FAV_CHANNEL","QT_FAV_REMOVE": "QT_FAV_REMOVE","QT_SEARCH_FOR": "QT_SEARCH_FOR","QT_VIEW_CHANNEL": "QT_VIEW_CHANNEL","QT_CHANNEL_MOVE": "QT_CHANNEL_MOVE","QT_CHANNEL_MOVE_NEW_LOCATION": "QT_CHANNEL_MOVE_NEW_LOCATION","QT_INSERT": "QT_INSERT","QT_FAV_MARK_ALL": "QT_FAV_MARK_ALL","QT_FAV_ADD_ALL": "QT_FAV_ADD_ALL","YES": "YES","NO": "NO","QT_FAV_ADD_REMOVE": "QT_FAV_ADD_REMOVE","QT_FAV_UNMARK_ALL": "QT_FAV_UNMARK_ALL","MAIN_CATEGORY": "MAIN_CATEGORY","QT_FAV_UNMARK_ALL": "QT_FAV_UNMARK_ALL","QT_FAV_REMOVE_ALL": "QT_FAV_REMOVE_ALL"};
var tv_Satellite = {"top_menu_info_tv": "SPEAKERS_TV","top_menu_info_sa": "BNR_SATELLITE_TITLE"};
/*
*  ****************************************
*  Channel matrix all of mode introduction.
*  ****************************************
*
* 0: Mode_default, channel matrix default mode.
* 1: Mode_FindChannel_new_serach, start a new search  in find channel mode.
* 2: Mode_FindChannel_type_text, type a text  in find channel mode.
* 3: Mode_FindChannel_show_results, show the results  in find channel mode.
* 4: Mode_Favorite_edit_by_block, edit favorite list by block in Edit favorite mode.
* 5: Mode_Favorite_create_favorite, show a create favorite list dialog in Edit favorite mode.
* 6: Mode_Favorite_edit_one_by_one, edit favorite list one by one in Edit favorite mode.
* 7: Mode_TV_normal_favorite, show Favorite list in TV normal mode.
* 8: Mode_TV_normal_all, show All list in TV normal mode.
* 9: Mode_Option_menu_TV_normal_all, show option menu in TV normal All list.
* 10: Mode_Option_menu_TV_normal_fav, show option menu in TV normal Favorite list.
* 11: Mode_Move_before_move, enter the move mode at the moment.
* 12: Mode_Move_moving, press OK key when in before move mode.
*
*/
var ModeList = {Mode_default: 0,Mode_FindChannel_new_serach: 1,Mode_FindChannel_type_text: 2,Mode_FindChannel_show_results: 3,Mode_Favorite_edit_by_block: 4,
    Mode_Favorite_create_favorite: 5,Mode_Favorite_edit_one_by_one: 6,Mode_TV_normal_favorite: 7,Mode_TV_normal_all: 8,
    Mode_Option_menu_TV_normal_all: 9,Mode_Option_menu_TV_normal_fav: 10,Mode_Move_before_move: 11,Mode_Move_moving: 12,
    Mode_TV_normal_radio: 13,Mode_TV_normal_new: 14,Mode_TV_normal_install_channel: 15,
    Mode_TV_normal_tv: 16,Mode_Enter_pin_code: 17,Mode_favorite_mark_all: 18,Mode_favorite_edit_by_range: 19,Mode_Swap_before_move: 20,
    Mode_Swap_moving: 21}

var KyeboardModeList = {KyeboardMode_tv_normal_rename: 0,KyeboardMode_tv_normal_find_channel: 1}

//top menu selected id
var top_menu_selected_id;
//sub menu selected id
var submenu_selected_id = null;
//favorite list channel selected id
var fav_list_selected_idx = 0;
//all list channel selected id
var all_list_selected_idx = 0;
//radio list channel selected id
var radio_list_selected_idx = 0;
//new list channel selected id
var new_list_selected_idx = 0;
//tv list channel selected id
var tv_list_selected_idx = 0;
//current focus level
var focus_level = 1;
//current active mode
var active_mode;
//last active mode
var last_active_mode = -1;
//keyboard in which mode
var keyboard_mode;
//debugger
var DEBUG = false;
//for debugger
var sub_heigh = 0;
//for save pin code
var correct_pin_code = false;
//for first boot up
var is_first_boot_up = true;
//default password
var DEFAULT_PWD = '0000';
//first PIN CODE
var first_enter_pin_code = '0000';
//pin code has been set
var PIN_CODE_SET = 0;
//pin code not set
var PIN_CODE_NOT_SET = 1;
//channel name length of static display 
var channelnamelength = 12;
//favorite list type
var FAVORITE_TYPE_0 = 0;
//for change channel
//global value
var OCL_TOGGLE_TYPE_OFF = 0;
var OCL_TOGGLE_TYPE_ON = 1;
var OCL_TOGGLE_TYPE_LIST_CH_ON = 2;
var BS_TYPE_AIR = 0;
var BS_TYPE_CAB = 1;
var BS_TYPE_SAT = 2;
var DTV_TYPE_AIR = 0;
var DTV_TYPE_CAB = 1;

var CHLST_ITERATE_DIR_FROM_FIRST = 0; /* iterate channel from first */
var CHLST_ITERATE_DIR_FROM_LAST = 1; /* iterate channel from last */
var CHLST_ITERATE_DIR_NEXT = 2; /* the direct of iterate channel is next */
var CHLST_ITERATE_DIR_PREV = 3; /* the direct of iterate channel is prev */

// string scroll settimeout
var timestring = "";
var scrollnulllength = 1;
var scrollchannelname = "";

/* is need response key */
var is_need_response = true;

var selected = 0;
var selected_right = 0;
var focus_id = 0;
var optionmenulength = 21;

var satlId = 0;
var satlRecId = 0;
var categoryMask = 0;

/* dvbs operator name */
var DVBS_OPERATOR_NAME_AUSTRIASAT = 3;
var DVBS_OPERATOR_NAME_CANALDIGITAAL_HD = 4;
var DVBS_OPERATOR_NAME_CANALDIGITAAL_SD = 5;
var DVBS_OPERATOR_NAME_TV_VLAANDEREN_HD = 6;
var DVBS_OPERATOR_NAME_TV_VLAANDEREN_SD = 7;
var DVBS_OPERATOR_NAME_SYKLINK_CZ = 8;
var DVBS_OPERATOR_NAME_SYKLINK_SK = 9;
var DVBS_OPERATOR_NAME_TELESAT_BELGIUM = 11;
var DVBS_OPERATOR_NAME_TELESAT_LUXEMBOURG = 12;
var DVBS_OPERATOR_NAME_HELLO = 26;
var DVBS_OPERATOR_NAME_TKGS = 27;
function functionTime() {
    var d = new Date();
    var functionName = '';
    if (functionTime.caller) {
        var tmp = functionTime.caller.toString();
        var re = /function\s*(\w*)/i;
        functionName = re.exec(tmp);
        functionName = functionName[1];
    }
    
    if (arguments.length > 0) {
        console.log(functionName + " end totalTime = " + (d.getTime() - arguments[0]));
    } else {
        console.log(functionName + " start");
        return d.getTime();
    }
}