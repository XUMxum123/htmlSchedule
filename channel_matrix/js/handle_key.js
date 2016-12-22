window.onload = function() {
    //init option menu part
    var lan = mtvObj.getGuiLanguage('');
    if (lan != null && lan != "") {
        lan = lan.ITEMS[0].TEXT;
        if (lan.toUpperCase() == "DUT") {
            $("#ColorKey_Yellow").parent().css("width", "360px");
        }
    }
    $("#top_menu_info_tv").html(getTranslate(tv_Satellite.top_menu_info_tv));
    $("#top_menu_info_sa").html(getTranslate(tv_Satellite.top_menu_info_sa));
	
	/* register channel notify */
    mtvObj.addChannelInfoEventListener(update_channel_notify);
    setTimeout(function(){
        var current_bs_src_type = parseInt(mtvObj.getDtvTunerBsSrc());
        /* select which tuner type */
        //$("#top_menu_bar").show();
        if (current_bs_src_type == BS_TYPE_SAT) {
            /* Satellite tuner type */
            top_menu_item_focus(true, "top_menu_1");
        //$('#top_menu_1').focus();
        } 
        else {
            /* DTV tuner type */
            top_menu_item_focus(true, "top_menu_0");
        //$('#top_menu_0').focus();
        }

        $('.preloader-wrapper').hide();
        /* reset first boot up flag */
        if (is_first_boot_up == true) {
            is_first_boot_up = false;
        }
    }, 20);

};

function key_dispatch(isup, event) {
    /* for debug */
    if (DEBUG == true) {
        show_up_down_info(event);
    }
    switch (focus_level) {
        case 1:
        case 2:
            if (isup) {
                //dispatch top menu key
               return top_menu_key_dispatch(true, event);
            }
            break;
        case 3:
            //dispatch sub_menu key
            return sub_menu_key_dispatch(event);
            break;
    }
    return true;
}

$(document).on("keydown", function(event) {
    var key = event.which || event.keyCode;
    console.log("HTML UI Rec key: " + key);
    
	if(KeyEvent.DOM_VK_LIST != key){
		if (key_dispatch(true, event)) {
			//dispatch all key of page.
			mtvuiUtil.procSysKey(key);
			event.stopPropagation();
		} else {
			return 0;
		}
	} else {
		mtvuiUtil.gotoSysPage("sys_index");
	}

}
);

//  fav_list.js
function get_favorite_length() {
    /* get the length of favorite list */
    return mtvObj.getFavoriteChannelCountEX(FAVORITE_TYPE_0);
}
;
function get_is_favorite_ch_by_mask(ch_mask) {
    
    return ((MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite);
}
;

// option_menu_handle_key.js
/* get channel count by svl id and mask and mask value */
function get_channel_count(svl_id, nw_mask, mask_value, satlId, satlRecId, categoryMask) {
    return mtvObj.getChannelCountTemp(svl_id, nw_mask, mask_value, satlId, satlRecId, categoryMask);
}

/* use INFO/BLUE key to UP/DOWN in debug mode */
function show_up_down_info(e) {
    var keynum = e.which || e.keyCode;
    switch (keynum) {
        case KeyEvent.DOM_VK_INFO:
            sub_heigh += 300;
            break;
        case KeyEvent.DOM_VK_BLUE:
            if (sub_heigh > 300) {
                sub_heigh -= 300;
            } else {
                sub_heigh = 0;
            }
            break;
    }
}
function show_end_view() {
    
    var div = document.getElementById('show_log_div');
    
    div.scrollTop = div.scrollHeight - sub_heigh;
}

function startScanMenu() {
    var obj_tv = new TV_JSP();
    var obj_tvServices = obj_tv.utility;
    //jump to TV native UI of scan channel.
    obj_tvServices.startSettingMenu(2);
}

function startScanMenuOfSattellite() {
    var obj_tv = new TV_JSP();
    var obj_tvServices = obj_tv.utility;
    //jump to TV native UI of dvbs scan channel.
    obj_tvServices.startSettingMenu(14);
}

function update_channel_notify(notify_info) {
    console.log("update_channel_notify notify_info:" + notify_info);
    notify_info = JSON.parse(notify_info);
    for (var i = 0; i < notify_info.ITEMS.length; i++) {
        if (ChannelNotifyTypeList.ChannelNotifyType_svl_updated == parseInt(notify_info.ITEMS[i].CONDITIONS) 
        && 0 != notify_info.ITEMS[i].REASON) {
            update_current_page_ch_list();
        }
    }
}
function is_need_card_ch_update_notify() {
    switch (active_mode) {
        case ModeList.Mode_FindChannel_show_results:
            {
                return false;
            }
        default:
            return true;
    
    }
    return true;
}
function update_current_page_ch_list() {
    /* if not card channel updated notify, return */
    if (false == is_need_card_ch_update_notify()) {
        return;
    }
    
    var svl_id = 1;
    var active_card = $('#id_channel_carousel').find(".item.active .card.channel.active");
    var item_cards = $('#id_channel_carousel').find(".item.active .card.channel");
    if (active_card.length > 0) {
        var ch_idx = $.inArray(active_card[0], item_cards);
    }
    
    update_channel_count();
    
    var idx = get_first_ch_in_current_ch_page(g_channel_page_idx * CAROUSEL_ITEM_CNT);
    console.log("get_first_ch_in_current_ch_page idx:" + idx);
    if (current_tuner_type != TunerType_list.TunerType_satellite) {
        var dtv_tuner_type = mtvObj.getDtvTunerType();
        console.log("dtv_tuner_type:" + dtv_tuner_type);
        switch (parseInt(dtv_tuner_type)) {
            case 0:
                //rewrite SVL_ID to air.
                //svl_id = 1;
                if (TYPE_BRDCST == mtvObj.getBroadcastType()) {
                    svl_id = BRDCST_DVBT;
                } else {
                    svl_id = CAM_DVBT;
                }
                break;
            case 1:
                //rewrite SVL_ID to cab.
                //svl_id = 2;
                if (TYPE_BRDCST == mtvObj.getBroadcastType()) {
                    svl_id = BRDCST_DVBC;
                } else {
                    svl_id = CAM_DVBC;
                }
                break;
            default:
                //rewrite SVL_ID to air.
                svl_id = BRDCST_DVBC;
                break;
        }
    } 
    else {
        /* in satellite tuner type */
        //svl_id = 3;
        if (TYPE_BRDCST == mtvObj.getBroadcastType()) {
            svl_id = BRDCST_DVBS;
        } else {
            svl_id = CAM_DVBS;
        }
    }
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var get_cur_type = get_cur_ch_list_type();
    console.log("get_cur_ch_list_type:" + get_cur_type);
    switch (parseInt(get_cur_type)) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            var ch_info = get_fav_channel_info_by_idx(svl_id, MaskList.Mask_favorite, MaskValueList.MaskValue_favorite, idx);
            carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            var ch_info = get_channel_info_by_idx(svl_id, nw_mask, mask_value, idx);
            carousel_add_channel_items(ModeList.Mode_TV_normal_all, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            var ch_info = get_channel_info_by_idx(svl_id, nw_mask, mask_value, idx);
            carousel_add_channel_items(ModeList.Mode_TV_normal_radio, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            var ch_info = get_channel_info_by_idx(svl_id, nw_mask, mask_value, idx);
            carousel_add_channel_items(ModeList.Mode_TV_normal_new, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            var ch_info = get_channel_info_by_idx(svl_id, nw_mask, mask_value, idx);
            carousel_add_channel_items(ModeList.Mode_TV_normal_tv, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
            break;
        default:
            break;
    }
    /* reload current page item cards */
    item_cards = $('#id_channel_carousel').find(".item.active .card.channel");
    //remove active card
    item_cards.attr("class", "card channel");
    /* set orignal channel position active */
    if (item_cards.length > 0) {
        $(item_cards[ch_idx]).attr("class", "card channel active");
        var ch_name = $(item_cards[ch_idx]).attr("channel_name");
        $(item_cards[ch_idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
    }
    /* update channel page navigation */
    setCd_pagination();
}
function update_channel_count() {
    console.log("before update_channel_count:" + g_channel_cnt);
    console.log("get_cur_ch_list_type:" + get_cur_ch_list_type());
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    switch (parseInt(get_cur_ch_list_type())) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            g_channel_cnt = mtvObj.getFavoriteChannelCountEX(FAVORITE_TYPE_0);
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
        case ChannelListTypeList.ChannelListType_satellite_tv:
            g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);
            break;
        default:
            break;
    }

}
function store_chlist_type_to_acfg() {
    console.log("store_chlist_type_to_acfg get_cur_ch_list_type:" + get_cur_ch_list_type());
    switch (parseInt(get_cur_ch_list_type())) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            set_channel_list_type(CUST_CH_LIST_TYPE_FAVORITE);
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            set_channel_list_type(CUST_CH_LIST_TYPE_ALL);
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            set_channel_list_type(CUST_CH_LIST_TYPE_RADIO);
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            set_channel_list_type(CUST_CH_LIST_TYPE_NEW);
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            set_channel_list_type(CUST_CH_LIST_TYPE_TV);
            break;
        default:
            break;
    }
    console.log("after get_channel_list_type:" + get_channel_list_type());
}
function set_channel_list_type(list_type) {
    console.log("set_channel_list_type:" + list_type);
    mtvObj.setChannelListType(list_type);
}
function get_channel_list_type() {
    return mtvObj.getChannelListType();
}

/* set channel list filter type */
function set_channel_filter_type(filter_type) {
    console.log("set_channel_filter_type:" + filter_type);
    mtvObj.setChannelFilterType(filter_type);
}

/* get channel list filter type */
function get_channel_filter_type() {
    return mtvObj.getChannelFilterType();
}
var storeChannelListtimeout = null;
var flag_storeChannelList = null;
function store_channel_list_to_acfg() {
    
    console.log("store_channel_list_to_acfg");
	storeChannelListtimeout = true;
	/*
    if (storeChannelListtimeout == null) {
        settime_store_channel_list_to_acfg();
    } else {
        flag_storeChannelList = storeChannelListtimeout;
    }
	*/
}
function settime_store_channel_list_to_acfg() {
    if (storeChannelListtimeout == null) {
        mtvObj.storeChannelList('');
        storeChannelListtimeout = setTimeout("settime_store_channel_list_to_acfg()", 3000);
    } else {
        if (null != flag_storeChannelList) {
            mtvObj.storeChannelList('');
            storeChannelListtimeout = null;
            flag_storeChannelList = null;
        } 
        else {
            storeChannelListtimeout = null;
        }
    }
}

function rename_channel_name_by_svl_ch_id(svl_id, channel_id, text_value) {
    mtvObj.editChannel(svl_id, channel_id, text_value);
    /* update channel logo id */
    update_channel_logo_id(svl_id, channel_id);
    /* store to acfg */
    store_channel_list_to_acfg();
}

function update_channel_logo_id(svl_id, channel_id) {
    console.log("update_channel_logo_id() svl_id" + svl_id);
    mtvObj.updateChannelLogoId(svl_id, channel_id);
}
function set_channel_info(svl_id, ch_id, ch_mask) {
    console.log("set_channel_info(svl_id:" + svl_id + ",ch_id:" + ch_id + ",ch_mask:" + ch_mask + ")");
    mtvObj.setChannelInfo(svl_id, ch_id, ch_mask);
}

function lock_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask) {
    console.log("lock_channel..(svl_id:" + svl_id + ",ch_id:" + ch_id + ",ch_mask:" + ch_mask + ")");
    ch_mask = ch_mask | SB_VENT_BLOCKED;
    
    set_channel_info(svl_id, ch_id, ch_mask);
}

function unlock_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask) {
    console.log("unlock_channel..(svl_id:" + svl_id + ",ch_id:" + ch_id + ",ch_mask:" + ch_mask + ")");
    ch_mask = ch_mask & (~SB_VENT_BLOCKED);
    set_channel_info(svl_id, ch_id, ch_mask);
}

function jump_to_help_page() {
    var arg = {"PARAMETER": {
            "appMode": "EDFU",
            "edfuUrl": "/usr/opera/opera_dir/pages/edfu/index.html",
            "REQUEST": "SET"}};
    
    mtvObj.startNetTV(JSON.stringify(arg));
    afterurlstoreChannelList();
}


var set_active_mode = function(mode) {
    //set active mode
    if (get_is_tv_normal_card_active_mode(mode)) {
        last_active_mode = mode;
    }

    //set current active mode
    active_mode = mode;
}

var back_to_last_active_mode = function() {
    console.log("back to last active mode: " + last_active_mode);
    set_active_mode(last_active_mode);
}

var get_is_tv_normal_card_active_mode = function(mode) {
    switch (mode) {
        case ModeList.Mode_TV_normal_favorite:
        case ModeList.Mode_TV_normal_all:
        case ModeList.Mode_TV_normal_radio:
        case ModeList.Mode_TV_normal_new:
        case ModeList.Mode_TV_normal_tv:
        case ModeList.Mode_Favorite_edit_one_by_one:
            return true;
        default:
            break;
    }
    
    return false;
}

var set_keyboard_mode = function(mode) {
    //set keyboard mode
    keyboard_mode = mode;
}

function satellite_filter_condition_reset() 
{
    satlId = 0;
    satlRecId = 0;
    categoryMask = 0;
}
/*
* show selected top menu bar.
*/
function top_menu_bar_selected(id, n) {
    console.info('top_menu_bar_selected id =' + id);
    for (var i = 0; i < n; i++) {
        var con = document.getElementById("con_top_menu_" + i);
        if (('top_menu_' + i) == top_menu_selected_id) 
        {
            con.style.display = "block";
        } else {
            con.style.display = "none";
        }

        //in TV tuner
        if ('top_menu_0' == top_menu_selected_id) {
            set_tuner_type(TunerType_list.TunerType_tv);
            satellite_filter_condition_reset();
        } 
        else {
            update_dvbs_svl_id();
            set_tuner_type(TunerType_list.TunerType_satellite);
        }
    }

    //get all channel count
    var ch_count = mtvObj.getAllChannelCount();
    //if there is no channel ,should install channel
    if (ch_count <= 0) {
        //set active mode
        set_active_mode(ModeList.Mode_TV_normal_install_channel);
        //layout install channel dialog
        TV_normal_install_channel_state_layout();
    
    } 
    else {
        initialDataLoading(id);
        init_ch_list_by_chlist_type();
        if (is_first_boot_up == true) {
            $('#id_div_contain').focus();
            submenu_item_focus(false, submenu_selected_id);
            top_menu_item_focus(false, id);
        }
    }
}
function init_ch_list_by_chlist_type() {
    var id = null;
    /* get channel list type which save in acfg */
    ch_list_type = parseInt(get_channel_list_type());
    switch (ch_list_type) {
        case CUST_CH_LIST_TYPE_ALL:
            if (current_tuner_type == TunerType_list.TunerType_tv) {
                id = "tv_submenu_bar_1";
            } 
            else {
                id = "satellite_submenu_bar_1";
            }
            break;
        case CUST_CH_LIST_TYPE_RADIO:
            if (current_tuner_type == TunerType_list.TunerType_tv) {
                id = "tv_submenu_bar_2";
            } 
            else {
                id = "satellite_submenu_bar_3";
            }
            break;
        case CUST_CH_LIST_TYPE_FAVORITE:
            if (current_tuner_type == TunerType_list.TunerType_tv) {
                id = "tv_submenu_bar_0";
            } 
            else {
                id = "satellite_submenu_bar_0";
            }
            break;
        case CUST_CH_LIST_TYPE_NEW:
            if (current_tuner_type == TunerType_list.TunerType_tv) {
                id = "tv_submenu_bar_3";
            } 
            else {
                id = "satellite_submenu_bar_4";
            }
            break;
        case CUST_CH_LIST_TYPE_TV:
            if (current_tuner_type == TunerType_list.TunerType_tv) {
                id = "tv_submenu_bar_1";
            } 
            else {
                id = "satellite_submenu_bar_2";
            }
            break;
    }
    //error handle 
    if ($('#' + id).length <= 0) {
        if (current_tuner_type == TunerType_list.TunerType_tv) {
            id = "tv_submenu_bar_1";
        } 
        else {
            id = "satellite_submenu_bar_1";
        }
    }
    if(is_first_boot_up){
       submenu_item_focus(true, id);
    } else {
        $('#' + id).focus();
        
    }
    show_tv_normal_items();
}
function set_tuner_type(tuner_type) {
    console.log("set_tuner_type: " + tuner_type);
    //current_tuner_type define in base.js
    current_tuner_type = tuner_type;
}
/*
* Init data, create submenu bar item
*/
function initialDataLoading(menu_id) {
    sub_menu_bar_menu();
    switch (menu_id) {
        case "top_menu_0":
            /* hide satellite submenu */
            $("#satellite_submenu_bar_layout").hide();
            /* show tv submenu */
            $("#tv_submenu_bar_layout").show();
            setSubmenuInfo($($("#tv_submenu_bar_layout").find("ul")), TVSubMenuList);
            //$('#tv_submenu_bar').children(':eq(0)').addClass('selected');
            submenu_selected_id = null;
            break;
        case "top_menu_1":
            /* hide tv submenu */
            $("#tv_submenu_bar_layout").hide();
            /* show satellite submenu */
            $("#satellite_submenu_bar_layout").show();
            setSubmenuInfo($($("#satellite_submenu_bar_layout").find("ul")), SatelliteSubMenuList);
            //$('#stellite_submenu_bar').children(':eq(0)').addClass('selected');
            submenu_selected_id = null;
            break;
    
    }
}

/*
* focus top menu item.
*/
function top_menu_item_focus(isfocus, id) {
    console.info('top_menu_item_focus isfocus =' + isfocus + ' id =' + id);
    var content = document.getElementById(id);
    if (isfocus) {
        focus_level = 1;
        content.className = "focus";
        if (top_menu_selected_id && top_menu_selected_id == id)
            return;
        if (top_menu_selected_id && top_menu_selected_id != id) {
            document.getElementById(top_menu_selected_id).className = "";
        }
        
        top_menu_selected_id = id;
        top_menu_bar_selected(id, 2);
    
    } else {
        if (id == top_menu_selected_id) {
            content.className = "selected";
        } else {
            content.className = "li";
        }
    
    }
}

function reset_top_menu_focus() {
    focus_level = 1;
    document.getElementById(top_menu_selected_id).focus();
}

function reset_submenu_focus() {
    focus_level = 2;
    if (submenu_selected_id != null) {
        document.getElementById(submenu_selected_id).focus();
    }
    
    console.log("reset_submenu_focus,submenu_selected_id:" + submenu_selected_id);
    /* close colourbar */
    close_colourbar();

    /* remove active form channel card */
    /* update the items */
    item_cards = $('#id_channel_carousel').find(".item.active .card.channel");
    if (item_cards.length <= 0) {
        return false;
    }
    //clear all channel active class
    item_cards.attr("class", "card channel");
}

function submenu_item_click(id) {
    $('#' + id).focus();
}
/*
* focus sub menu item.
*/
function submenu_item_focus(isfocus, id) {
    console.info('submenu_item_focus isfocus =' + isfocus + ' id =' + id);
    var content = document.getElementById(id);
    if (isfocus) {
        focus_level = 2;
        content.className = "focus";
        if (submenu_selected_id && submenu_selected_id == id)
            return;
        if (submenu_selected_id && submenu_selected_id != id) {
            document.getElementById(submenu_selected_id).className = "";
        }
        submenu_selected_id = id;
        
        if (true == is_first_boot_up) {
            /* get current channel mask and mask value */
            var nw_mask = get_current_mask();
            var mask_value = get_current_mask_value();
            var ch = mtvObj.getCurrentChannelInfoForEachTuner();
            
            g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);

            /* if channel count < 0 under current filter type */
            if (g_channel_cnt <= 0) {
                /* set channel filter type to all */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_ALL);
            }
            focus_level = 3;
        } else {
            /* set channel filter type to all */
            set_channel_filter_type(CUST_CH_FILTER_TYPE_ALL);
            satellite_filter_condition_reset();
        }

        /* init All channel cards  */
        if (submenu_selected_id == 'tv_submenu_bar_1' || (submenu_selected_id == 'satellite_submenu_bar_1')) {
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_all);
            /* set current channel list type */
            if ((submenu_selected_id == 'tv_submenu_bar_1')) {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_all);
            } 
            else {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_all);
            }
            /* update UI data */
            update_ui_data();
            //layout All channel list in TV normal mode
            TV_normal_all_state_layout();
        }  /* init Radio channel cards  */
        else if (submenu_selected_id == 'tv_submenu_bar_2' || (submenu_selected_id == 'satellite_submenu_bar_3')) {
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_radio);
            /* set current channel list type */
            if ((submenu_selected_id == 'tv_submenu_bar_2')) {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_radio);
            } 
            else {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_radio);
            }
            /* update UI data */
            update_ui_data();
            //layout Radio channel list
            TV_normal_radio_state_layout();
        } 
        else if ((submenu_selected_id == 'tv_submenu_bar_3') || (submenu_selected_id == 'satellite_submenu_bar_4')) {
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_new);
            /* set current channel list type */
            if ((submenu_selected_id == 'tv_submenu_bar_3')) {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_new);
            } 
            else {
                set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_new);
            }
            /* update UI data */
            update_ui_data();
            //layout New channel list
            TV_normal_new_state_layout();
        } 
        else if (submenu_selected_id == 'satellite_submenu_bar_2') {
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_tv);
            /* set current channel list type */
            set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_tv);
            /* update UI data */
            update_ui_data();
            //layout TV channel list in satellite
            TV_normal_tv_state_layout();
        } 
        else if (submenu_selected_id == 'tv_submenu_bar_0' || (submenu_selected_id == 'satellite_submenu_bar_0')) {
            //show create favorite channel list dialog.		
            if (get_favorite_length() <= 0) {
                console.log("show creat favorite!");
                //no favorite channel in favorite_list
                //set active mode
                set_active_mode(ModeList.Mode_Favorite_create_favorite);
                //layout
                Favorite_edit_create_favorite_state_layout();
            } 
            //show favorite channel list
            else {
                //set active mode
                set_active_mode(ModeList.Mode_TV_normal_favorite);
                /* set current channel list type */
                if ((submenu_selected_id == 'tv_submenu_bar_0')) {
                    set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_favorite);
                } 
                else {
                    set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_favorite);
                }

                /* update UI data */
                update_ui_data();
                //layout
                TV_normal_favorite_state_layout();
            }
        } 
        else {
            //clear all card
            $("#id_channel_carousel").html("");
            set_colourkey_list_text(ColourKeyList_Normal);
        }
        /* close colour bar */
        close_colourbar();
    
    } else {
        if (id == submenu_selected_id) {
            content.className = "selected";
        } else {
            content.className = "li";
        }
    
    }
    
    store_chlist_type_to_acfg();
    
    var active_card = get_current_active_channel_card();
    if (active_card.length <= 0) {
        return;
    }
    /* favorite list color key need not to change */
    if (!((submenu_selected_id == 'tv_submenu_bar_0') || (submenu_selected_id == 'satellite_submenu_bar_0'))) {
        /* change the color key list between fav's channel and not fav's channel. */
        if (get_is_favorite_ch_by_mask($(active_card[0]).attr("channel_mask"))) {
            set_colourkey_list_text(ColourKeyList_TV_normal_All_fav_state);
        } else {
            //not favorite channel colourkey
            set_colourkey_list_text(ColourKeyList_TV_normal_All_not_fav_state);
        }
    }
}

/*
* set sub menu item info.
*/
function setSubmenuInfo(target, folderList) {
    target.html("");
    var targetId = target.attr("id") + '_';
    for (var index in folderList) {
        var id = targetId + index;
        if (folderList[index].name != "NULL") {
            var content = $('<li id="' + id + '" tabindex = "0" onfocus=\'submenu_item_focus(true, "' + id + '");\' \' onblur=\'submenu_item_focus(false, "' + id + '");\' >' + folderList[index].name + '</li>');
            content.appendTo(target);
        }
    }

}

/*
*  top menu item key dispatch.
*/
function top_menu_key_dispatch(isup, e) {
    console.log("top_menu_key_dispatch id= " + e.target.id);
    var id = e.target.id;
    var content = document.getElementById(id);
    var focus_id;
    
    var keynum = e.which || e.keyCode;
    if (!isup) {
        return true;
    }
    switch (keynum) {
        case KeyEvent.DOM_VK_LEFT:
            if (isup) {
                $('#' + id).prev().focus();
            }
            break;
        case KeyEvent.DOM_VK_RIGHT:
            if (isup) {
                $('#' + id).next().focus();
            }
            break;
        case KeyEvent.DOM_VK_UP:
            if (isup) {
                var funStr = $('#' + id).parent().attr('data-focus-up-function');
                if (funStr) {
                    eval(funStr);
                }
            }
            break;
        case KeyEvent.DOM_VK_BACK:
            if (isup) {
                if (focus_level == 1) {
                    //exit channel matrix
                    /* back to home UI */
                    window.location = "../index.html";
                    return false;
                } else {
                    if (!get_dvbs_status()) {
                        //exit channel matrix
                        /* back to home UI */
                        window.location = "../index.html";
                        return false;
                    }
                }
                var funStr = $('#' + id).parent().attr('data-focus-up-function');
                if (funStr) {
                    eval(funStr);
                }
            }
            break;
        case KeyEvent.DOM_VK_RETURN:
        case KeyEvent.DOM_VK_DOWN:
            if (isup) {
                /* when focus in top menu  */
                if (focus_level == 1) {
                    //get all channel count
                    var ch_count = mtvObj.getAllChannelCount();
                    //if there is no channel ,should install channel
                    if (ch_count <= 0) {
                        //set active mode
                        set_active_mode(ModeList.Mode_TV_normal_install_channel);
                        //layout install channel dialog
                        TV_normal_install_channel_state_layout();
                        return;
                    }
                    //set focus level
                    reset_submenu_focus();
                } else {
                    //console.log("Rec:KeyEvent.DOM_VK_DOWN");
                    if (g_channel_cnt <= 0) {
                        /* set channel filter type to all */
                        set_channel_filter_type(CUST_CH_FILTER_TYPE_ALL);
                        TV_normal_all_state_layout();
                    }
                    focus_id = $('#' + id).parent().attr("data-focus-down-level");
                    focus_level = 3;
                    //var sub_menu_focus_id = $("#sub_menu_bar").find(".selected").attr("id");
                    /* onblur submenu bar */
                    $("#id_div_contain").focus();
                    switch (submenu_selected_id) {
                        //In Favorite list
                        case "satellite_submenu_bar_0":
                        case "tv_submenu_bar_0":
                            {
                                if (get_favorite_length() <= 0) {
                                    set_active_mode(ModeList.Mode_Favorite_create_favorite);
                                } 
                                else {
                                    set_active_mode(ModeList.Mode_TV_normal_favorite);
                                }
                                break;
                            }
                        //In All list
                        case "satellite_submenu_bar_1":
                        case "tv_submenu_bar_1":
                            {
                                set_active_mode(ModeList.Mode_TV_normal_all);
                                break;
                            }
                        //In Radio list
                        case "satellite_submenu_bar_3":
                        case "tv_submenu_bar_2":
                            {
                                set_active_mode(ModeList.Mode_TV_normal_radio);
                                break;
                            }
                        //In New list
                        case "satellite_submenu_bar_4":
                        case "tv_submenu_bar_3":
                            {
                                set_active_mode(ModeList.Mode_TV_normal_new);
                                break;
                            }
                        //In TV list
                        case "satellite_submenu_bar_2":
                            {
                                set_active_mode(ModeList.Mode_TV_normal_tv);
                                break;
                            }
                        default:
                            set_active_mode(ModeList.Mode_TV_normal_all);
                    }

                    //sub_menu_key_dispatch(KeyEvent);
                    /* active the selected channel card */
                    set_selected_channel_card_active();
                    /* show colour bar */
                    show_colourbar();
                
                }
            
            }
            break;
    }
    return true;
}

function satellite_content_focus() {
    $('#satellite_submenu_bar_0').focus();
}

function set_selected_channel_card_active() {
    var channel_selected_idx = 0;
    item_cards = $('#id_channel_carousel').find(".item.active .card.channel");
    if (item_cards.length <= 0) {
        return false;
    }
    switch (parseInt(get_cur_ch_list_type())) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            channel_selected_idx = fav_list_selected_idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            channel_selected_idx = all_list_selected_idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            channel_selected_idx = radio_list_selected_idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            channel_selected_idx = new_list_selected_idx;
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            channel_selected_idx = tv_list_selected_idx;
            break;
        default:
            break;
    }
    /* set selected channel active */
    $(item_cards[channel_selected_idx]).attr("class", "card channel active");
    var ch_name = $(item_cards[channel_selected_idx]).attr("channel_name");
    //		 if(ch_name != null && ch_name.length>channelnamelength){
    $(item_cards[channel_selected_idx]).find("#ch_name").html(ch_name);
    setchannelName(ch_name);
    //		 }
    /* favorite list color key need not to change */
    if (!((submenu_selected_id == 'tv_submenu_bar_0') || (submenu_selected_id == 'satellite_submenu_bar_0'))) {
        /* change the color key list between fav's channel and not fav's channel. */
        if (get_is_favorite_ch_by_mask($(item_cards[channel_selected_idx]).attr("channel_mask"))) {
            set_colourkey_list_text(ColourKeyList_TV_normal_All_fav_state);
        } else {
            //not favorite channel colourkey
            set_colourkey_list_text(ColourKeyList_TV_normal_All_not_fav_state);
        }
    }
}

function change_channel_by_channel_id(channel_id) {
    /* channge channel */
    mtvObj.setBrdcastChgChannel(channel_id);
}
//change channel of dvbc-->dvbt or dvbt-->dvbc
function change_channel_from_dvbt_to_dvbc(src_ch, target_ch) {
    //one channel list case
    if (parseInt(mtvObj.getOclStatus())) {

        /*[on ch list internal] the following steps is the channel change in one channel list case:*/
        /*step1: set ocl toggle type on*/

        /*step2: set the correct bs type according to the channel info*/

        /*step3: channel chanage by change id*/

        /*step4: set the bs type to cab*/

        /*step5: set ocl toggle type off*/


        /*[not on ch list case internal] channel change*/

        /*step3: channel chanage by change id*/
        //step 1: set one channel lsit toggle type on
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_ON);
        //step 2:set bs type according to the channel info
        switch (parseInt(target_ch.SVL_ID)) {
            case BRDCST_DVBT:
            case CAM_DVBT:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
            case BRDCST_DVBC:
            case CAM_DVBC:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
                break;
            default:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
        }
        /* step3: channel change by channel id */
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
        /* step4: set the bs type to cab due to current is one channel list */
        //mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
        /* step5: set ocl toggle type off */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_OFF);
    } 
    else {
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
    }
}

//change channel of dvbc-->dvbs or dvbt-->dvbs
function change_channel_from_dvbct_to_dvbs(src_ch, target_ch) {
    /*DTV->DVBS*/
    /*step1: one chlist toggle  list_on*/
    /*step2: set bs src  to dvbs*/
    /*step3: one chlist toggle off*/
    /*step4: channel change by ch id*/

    //one channel list case
    if (parseInt(mtvObj.getOclStatus())) {
        //step 1: set one channel lsit toggle type on
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_ON);
        //step 2:set bs type according to the channel info
        mtvObj.setDtvTunerBsSrc(BS_TYPE_SAT);

        /* step3: channel change by channel id */
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
        /* step4: set the bs type to cab due to current is one channel list */
        //mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
        /* step5: set ocl toggle type off */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_OFF);
    
    } 
    else {
        //step 1: set one channel lsit toggle type on
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_LIST_CH_ON);
        //step 2:set bs type according to the channel info
        mtvObj.setDtvTunerBsSrc(BS_TYPE_SAT);

        /* step3: channel change by channel id */
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
        /* step4: set ocl toggle type off */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_OFF);
    }
}

//change channel of dvbs-->dvbt or dvbs-->dvbc
function change_channel_from_dvbs_to_dvbct(src_ch, target_ch) {

    /*DVBS --> DTV*/
    /*step1: one chlist toggle list_on*/
    /*step2: set bs src to the one that store in dtv bs type*/
    /*step3: one chlist toggle off*/
    /*step4: check whether the current condition is one chlist*/
    /*step5   1: one chlist, 2: not one chlist*/
    /*step5.1.1: [one chlist channel change]*/
    /*step5.2.1: [not one chlist channel change]*/
    //one channel list case
    if (parseInt(mtvObj.getOclStatus())) {
        /* step 1: set one channel lsit toggle type on */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_ON);
        /* step 2: get one channel lsit channel id */
        //var ocl_ch_id = mtvObj.getOclChannelId();
        /* step 3: get dtv tuner type */
        //var dtv_tuner_type = mtvObj.getDtvTunerType();
        switch (parseInt(target_ch.SVL_ID)) {
            case BRDCST_DVBT:
            case CAM_DVBT:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
            case BRDCST_DVBC:
            case CAM_DVBC:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
                break;
            default:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
        }
        /* step4: channel change by channel id */
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
        /* step5: set the bs type to cab due to current is one channel list */
        //mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
        /* step6: set ocl toggle type off */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_OFF);
    } 
    else {
        /* step 1: set one channel lsit toggle type list_ch_on */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_LIST_CH_ON);
        /* step 2: get dtv tuner type */
        //var dtv_tuner_type = mtvObj.getDtvTunerType();
        switch (parseInt(target_ch.SVL_ID)) {
            case BRDCST_DVBT:
            case CAM_DVBT:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
            case BRDCST_DVBC:
            case CAM_DVBC:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
                break;
            default:
                mtvObj.setDtvTunerBsSrc(BS_TYPE_AIR);
                break;
        }
        /* step3: channel change by channel id */
        change_channel_by_channel_id(target_ch.CHANNEL_ID);
        /* step4: set ocl toggle type off */
        mtvObj.setOclToggleType(OCL_TOGGLE_TYPE_OFF);
    }
}
/* if DVBS SVL_ID ? */
function is_dvbs_channel_by_svl_id(svl_id) {
    if ((svl_id == BRDCST_DVBS_GEN) || 
    (svl_id == BRDCST_DVBS_PREFER) || 
    (svl_id == CAM_DVBS)) {
        return true;
    }
    
    return false;
}
function pause_3rd_app() {
    mtvObj.pause3rdApp();
}
function change_channel_by_channle_info(channel_info) {
    /* step 1:Pause 3rd APP */
    pause_3rd_app();
    /* step 2: get current channel info */
    ch = mtvObj.getCurrentChannelInfoEx();
    /* error handle */
    if (ch.SVL_ID == 0 || 
    ch.SVL_ID == undefined) {
        /* rewrite the SVL ID by bs source type */
        var current_bs_src_type = parseInt(mtvObj.getDtvTunerBsSrc());
        /* select which tuner type */
        if (current_bs_src_type == BS_TYPE_AIR) {
            /* AIR tuner type */
            ch.SVL_ID = BRDCST_DVBT;
        } 
        else if (current_bs_src_type == BS_TYPE_CAB) {
            /* CAB tuner type */
            ch.SVL_ID = BRDCST_DVBC;
        } else if (current_bs_src_type == BS_TYPE_SAT) {
            /* Satellite tuner type */
            ch.SVL_ID = BRDCST_DVBS;
        } else {
            return;
        }
    }

    /* case 1: current play channel svl_id the same as target svl_id */
    if (ch.SVL_ID == channel_info.SVL_ID) {
        change_channel_by_channel_id(channel_info.CHANNEL_ID);
    } 
    /* case 2: dvbc->dvbt or dvbt->dvbc , dvbs type is 3. */
    else if (!is_dvbs_channel_by_svl_id(ch.SVL_ID) && 
    !is_dvbs_channel_by_svl_id(channel_info.SVL_ID)) {
        change_channel_from_dvbt_to_dvbc(ch, channel_info);
        mtvObj.acfgSetConfigValue("g_misc__update_dt_sync_mode", 0);
    } 
    /* case 3: dvbc->dvbs or dvbt->dvbs , dvbs type is 3. */
    else if (!is_dvbs_channel_by_svl_id(ch.SVL_ID) && is_dvbs_channel_by_svl_id(channel_info.SVL_ID)) {
        change_channel_from_dvbct_to_dvbs(ch, channel_info);
        mtvObj.acfgSetConfigValue("g_misc__update_dt_sync_mode", 0);
    } 
    /* case 3: dvbc->dvbs or dvbt->dvbs , dvbs type is 3. */
    else if (is_dvbs_channel_by_svl_id(ch.SVL_ID) && !is_dvbs_channel_by_svl_id(channel_info.SVL_ID)) {
        change_channel_from_dvbs_to_dvbct(ch, channel_info);
        mtvObj.acfgSetConfigValue("g_misc__update_dt_sync_mode", 0);
    } 
    /* default */
    else {
        change_channel_by_channel_id(channel_info.CHANNEL_ID);
    }
    
    var is_new = (MaskList.Mask_new & channel_info.NW_MASK) == MaskList.Mask_new;
    if (true == is_new) {
        /* remove NEW channel flag after change channel. */
        var ch_mask = (channel_info.NW_MASK & (~SB_VENT_NEW_SERVICE));
        set_channel_info(channel_info.SVL_ID, channel_info.CHANNEL_ID, ch_mask);
    }

    /* save current channel list type */
    store_chlist_type_to_acfg();
}

var carousel_add_channel_items = function(cur_mode, svl_id, ch_id, dir, num, fav_idx, search_str) {
    var item_count = 0;
    var chBegin = g_channel_page_idx * CAROUSEL_ITEM_CNT;
    var args = {
        "SVL_ID": svl_id,
        "CHANNEL_ID": ch_id,
        "SATL_ID": satlId,
        "SATL_REC_ID": satlRecId,
        "CATEGORY_MASK": categoryMask,
        "NW_MASK": get_current_mask(),
        "MASK_VALUE": get_current_mask_value(),
        "DIRECTION": (dir == DirectionList.Direction_pre) ? "PRE" : "NEXT",
        "NUM": num, //get channel list number 
        "FAV_IDX": fav_idx, //favorite index 
        "ENABLE_CYCLE": false, //disable get channel by cycle
        "CH_LIST_TYPE": "ALL"
    };
    
    switch (cur_mode) {
        case ModeList.Mode_TV_normal_favorite:
            {
                args["CH_LIST_TYPE"] = "FAV";
                args["NW_MASK"] = MaskList.Mask_favorite;
                args["MASK_VALUE"] = MaskValueList.MaskValue_favorite;
                $.each(mtvuiChannel.getChannelList(args), function(k, item) {
                    
                    g_favorite_channel_list[chBegin + k] = item;
                    item_count++;
                });
                set_channel_carousel($("#id_channel_carousel"), 
                /* CAROUSEL_ITEM_CNT+1 will make sure the carousel show scrollbar */
                g_favorite_channel_list.slice(chBegin, chBegin + item_count), 
                g_channel_cnt > CAROUSEL_ITEM_CNT);
                break;
            }
        case ModeList.Mode_FindChannel_show_results:
            {
                /* get current channel mask and mask value */
                var nw_mask = get_current_mask();
                var mask_value = get_current_mask_value();
                
                $.each(mtvObj.getChannelListBySearchStr(svl_id, nw_mask, mask_value, chBegin, num, search_str), function(k, item) {
                    item_count++;
                    g_all_channel_list[chBegin + k] = item;
                });
                set_channel_carousel($("#id_channel_carousel"), 
                /* CAROUSEL_ITEM_CNT+1 will make sure the carousel show scrollbar */
                g_all_channel_list.slice(chBegin, chBegin + item_count), 
                g_channel_cnt > CAROUSEL_ITEM_CNT);
                break;
            }
        case ModeList.Mode_TV_normal_all:
        case ModeList.Mode_TV_normal_radio:
        case ModeList.Mode_TV_normal_new:
        case ModeList.Mode_TV_normal_tv:
        default:
            {
                args["CH_LIST_TYPE"] = "ALL";
                $.each(mtvuiChannel.getChannelList(args), function(k, item) {
                    item_count++;
                    g_all_channel_list[chBegin + k] = item;
                });
                set_channel_carousel($("#id_channel_carousel"), 
                /* CAROUSEL_ITEM_CNT+1 will make sure the carousel show scrollbar */
                g_all_channel_list.slice(chBegin, chBegin + item_count), 
                g_channel_cnt > CAROUSEL_ITEM_CNT);
                break;
            }
    }
    var channel_name = $(".item.active .card.channel.active").attr("channel_name")
    if (channel_name != null) {
        $(".item.active .card.channel.active").find("#ch_name").html(channel_name);
        setchannelName(channel_name);
    }

};
/* get current channel list mask by channel list type and channel filter type */
function get_current_mask() {
    var nw_mask = MaskList.Mask_all;
    /* get channel list type */
    var ch_list_type = parseInt(get_cur_ch_list_type());
    switch (ch_list_type) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            nw_mask = nw_mask | MaskList.Mask_favorite;
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            nw_mask = nw_mask | MaskList.Mask_all;
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            nw_mask = nw_mask | MaskList.Mask_radio;
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            nw_mask = nw_mask | MaskList.Mask_new;
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            nw_mask = nw_mask | MaskList.Mask_tv;
            break;
        default:
            nw_mask = nw_mask | MaskList.Mask_all;
            break;
    }
    /* get channel filter type */
    var ch_filter_type = parseInt(get_channel_filter_type());
    switch (ch_filter_type) {
        case CUST_CH_FILTER_TYPE_ALL:
            nw_mask = nw_mask | MaskList.Mask_all;
            break;
        case CUST_CH_FILTER_TYPE_DIGITAL:
            nw_mask = nw_mask | MaskList.Mask_digital;
            break;
        case CUST_CH_FILTER_TYPE_RADIO:
            nw_mask = nw_mask | MaskList.Mask_radio;
            break;
        case CUST_CH_FILTER_TYPE_ANALOG:
            nw_mask = nw_mask | MaskList.Mask_analog;
            break;
        case CUST_CH_FILTER_TYPE_NEW:
            nw_mask = nw_mask | MaskList.Mask_new;
            break;
        case CUST_CH_FILTER_TYPE_FREE_SCRAMBLE:
            /* free + scrambled is same as all */
            nw_mask = nw_mask | MaskList.Mask_all;
            break;
        case CUST_CH_FILTER_TYPE_FREE_ONLY:
            nw_mask = nw_mask | MaskList.Mask_free;
            break;
        case CUST_CH_FILTER_TYPE_SCRAMBLE:
            nw_mask = nw_mask | MaskList.Mask_scrambled;
            break;
        default:
            nw_mask = nw_mask | MaskList.Mask_all;
            break;
    }
    
    return nw_mask;
}

/* get current channel list mask value by channel list type and channel filter type */
function get_current_mask_value() {
    var mask_value = MaskValueList.MaskValue_all;
    /* get channel list type */
    var ch_list_type = parseInt(get_cur_ch_list_type());
    switch (ch_list_type) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            mask_value = mask_value | MaskValueList.MaskValue_favorite;
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            mask_value = mask_value | MaskValueList.MaskValue_all;
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            mask_value = mask_value | MaskValueList.MaskValue_radio;
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            mask_value = mask_value | MaskValueList.MaskValue_new;
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            mask_value = mask_value | MaskValueList.MaskValue_tv;
            break;
        default:
            mask_value = mask_value | MaskValueList.MaskValue_all;
            break;
    }
    /* get channel filter type */
    var ch_filter_type = parseInt(get_channel_filter_type());
    switch (ch_filter_type) {
        case CUST_CH_FILTER_TYPE_ALL:
            mask_value = mask_value | MaskValueList.MaskValue_all;
            break;
        case CUST_CH_FILTER_TYPE_DIGITAL:
            mask_value = mask_value | MaskValueList.MaskValue_digital;
            break;
        case CUST_CH_FILTER_TYPE_RADIO:
            mask_value = mask_value | MaskValueList.MaskValue_radio;
            break;
        case CUST_CH_FILTER_TYPE_ANALOG:
            mask_value = mask_value | MaskValueList.MaskValue_analog;
            break;
        case CUST_CH_FILTER_TYPE_NEW:
            mask_value = mask_value | MaskValueList.MaskValue_new;
            break;
        case CUST_CH_FILTER_TYPE_FREE_SCRAMBLE:
            /* free + scrambled is same as all */
            mask_value = mask_value | MaskValueList.MaskValue_all;
            break;
        case CUST_CH_FILTER_TYPE_FREE_ONLY:
            mask_value = mask_value | MaskValueList.MaskValue_free;
            break;
        case CUST_CH_FILTER_TYPE_SCRAMBLE:
            mask_value = mask_value | MaskValueList.MaskValue_scrambled;
            break;
        default:
            mask_value = mask_value | MaskValueList.MaskValue_all;
            break;
    }
    
    return mask_value;
}

var favorite_create_favorite_key_proc = function(kc) {
    var idx = -1;
    var key = kc.keyCode || kc.which;
    /* handle UP key */
    if (key == KeyEvent.DOM_VK_UP) {
        //	reset_submenu_focus();
        //	$("#create-fav-dialog").hide();
        return false;
    } 
    /* handle LEFT key */
    else if (key == KeyEvent.DOM_VK_LEFT) {
        console.log("Rec DOM_VK_LEFT");
        
        $('#btn-ok').addClass('btn-select-style-hover');
        $('#btn-cancel').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle RIGHT key */
    else if (key == KeyEvent.DOM_VK_RIGHT) {
        console.log("Rec DOM_VK_RIGHT");
        
        $('#btn-cancel').addClass('btn-select-style-hover');
        $('#btn-ok').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle OK key */
    else if (key == KeyEvent.DOM_VK_RETURN) {
        
        console.log("REC: DOM_VK_RETURN key");
        
        var btn_id = $("#create-fav-dialog").find('.btn-select-style-hover').attr('id');
        
        if (btn_id == "btn-ok") {
            /* if focus at OK button should jump to ALL menu to add favorite item */
            //set active mode
            set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
            /* set current channel list type */
            set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_default);
            Favorite_edit_one_by_one_state_layout();
            focus_level = 3;
        } 
        else {
            //reset_submenu_focus();
            /* hide the favorite dialog. */
            $("#create-fav-dialog").hide();
            $('#' + submenu_selected_id).next().focus();
        }
        return true;
    
    }
}
var tv_normal_install_channel_key_proc = function(kc) {
    var idx = -1;
    var key = kc.keyCode || kc.which;
    console.log("Enter favorite_create_favorite_key_proc");
    /* handle UP key */
    if (key == KeyEvent.DOM_VK_UP) {
        
        $("#installChannel-dialog").hide();
        reset_top_menu_focus();
        return false;
    } 
    /* handle LEFT key */
    else if (key == KeyEvent.DOM_VK_LEFT) {
        console.log("Rec DOM_VK_LEFT");
        
        $('#btn-yes').addClass('btn-select-style-hover');
        $('#btn-no').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle RIGHT key */
    else if (key == KeyEvent.DOM_VK_RIGHT) {
        console.log("Rec DOM_VK_RIGHT");
        
        $('#btn-no').addClass('btn-select-style-hover');
        $('#btn-yes').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle OK key */
    else if (key == KeyEvent.DOM_VK_RETURN) {
        
        console.log("REC: DOM_VK_RETURN key");
        
        var btn_id = $("#installChannel-dialog").find('.btn-select-style-hover').attr('id');
        
        if (btn_id == "btn-yes") {
            console.log("InstallChannel rec OK.");
            
            if (current_tuner_type == TunerType_list.TunerType_satellite) {
                //jump to dvbs scan channel of native UI
                startScanMenuOfSattellite();
            } else {
                //jump to scan channel of native UI
                startScanMenu();
            }

            /* back to home UI */
            window.location = "../index.html";
            return true;
        
        } 
        else {
            console.log("No");
            /* hide the favorite dialog. */
            $("#installChannel-dialog").hide();
            reset_top_menu_focus();
            mtvuiUtil.gotoSysPage("sys_index");
        
        }
        return true;
    
    }
}
var Enter_pin_code_key_proc = function(kc) {
    
    var key = kc.keyCode || kc.which;
    console.log("Enter favorite_create_favorite_key_proc");
    /* handle UP key */
    if (key == KeyEvent.DOM_VK_UP) {
        return false;
    } 
    /* handle LEFT key */
    else if (key == KeyEvent.DOM_VK_LEFT) {
        console.log("Rec DOM_VK_LEFT");
        
        $('#btn-pin-code-yes').addClass('btn-select-style-hover');
        $('#btn-pin-code-no').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return false;
    } 
    /* handle RIGHT key */
    else if (key == KeyEvent.DOM_VK_RIGHT) {
        console.log("Rec DOM_VK_RIGHT");
        
        $('#btn-pin-code-no').addClass('btn-select-style-hover');
        $('#btn-pin-code-yes').removeClass('btn-select-style-hover').addClass('btn-select-style');
        
        return false;
    } 
    /* handle OK key */
    else if (key == KeyEvent.DOM_VK_RETURN) {
        
        console.log("REC: DOM_VK_RETURN key");
        
        var btn_id = $("#pin-code-dialog").find('.btn-select-style-hover').attr('id');
        
        if (btn_id == "btn-pin-code-yes") {
            console.log("InstallChannel rec OK.");
            /* confirm the input pin code is correct or not? */
            update_pin_code_status();
            if (correct_pin_code == true) {
                back_to_last_active_mode();
                /* reset colour bar */
                reset_colourbar();
            }
        } 
        else {
            console.log("enter cancel button.");
            reset_pin_code_osd_class();
            close_pin_code_dialog();
            /* return to last mode */
            back_to_last_active_mode();
            /* reset colour bar */
            reset_colourbar();
        }
        return false;
    
    } 
    /* handle number key */
    else if ((KeyEvent.DOM_VK_0 <= key) && (key <= KeyEvent.DOM_VK_9)) {
        try {
            switch (key) {
                case KeyEvent.DOM_VK_0:
                    update_pin_code_dialog(0);
                    break;
                case KeyEvent.DOM_VK_1:
                    update_pin_code_dialog(1);
                    break;
                case KeyEvent.DOM_VK_2:
                    update_pin_code_dialog(2);
                    break;
                case KeyEvent.DOM_VK_3:
                    update_pin_code_dialog(3);
                    break;
                case KeyEvent.DOM_VK_4:
                    update_pin_code_dialog(4);
                    break;
                case KeyEvent.DOM_VK_5:
                    update_pin_code_dialog(5);
                    break;
                case KeyEvent.DOM_VK_6:
                    update_pin_code_dialog(6);
                    break;
                case KeyEvent.DOM_VK_7:
                    update_pin_code_dialog(7);
                    break;
                case KeyEvent.DOM_VK_8:
                    update_pin_code_dialog(8);
                    break;
                case KeyEvent.DOM_VK_9:
                    update_pin_code_dialog(9);
                    break;
                default:
                    break;
            }
            /* input the 4th number */
            if ($("#pwd_3").hasClass("pwd_done")) {
                /* confirm the input pin code is correct or not? */
                update_pin_code_status();
                if (correct_pin_code == true) {
                    back_to_last_active_mode();
                    show_colourbar();
                    /* confirm ok, lock/unlock the channel */
                    lock_unlock_channel();
                }
            }
        } 
        catch (err) {
            console.log("error for set channel id!");
            console.log(err);
        }
        return false;
    }
}
function set_pin_code_confirm_fail() {
    /* set title */
    var str = getTranslate(option_channle_islock.QT_INCORRECT_PIN);
    set_pin_code_title(str.replace("\\n", "<br/>"));
    /* reset PIN CODE dialog */
    reset_pin_code_osd_class();
    /* notice msg: not to use default password */
    var msg = getTranslate(option_channle_islock.QT_PIN_0000);
    set_pin_code_msg(msg);
    /* reset first_enter_pin_code to default */
    first_enter_pin_code = DEFAULT_PWD;
}
function set_new_pin_code() {
    /* enter pin code is valid ? */
    var pinCode = get_pin_code_value()
    if (!pinCode || pinCode.length != 4 || pinCode == DEFAULT_PWD) {
        set_pin_code_confirm_fail();
    } 
    /* valid PIN CODE */
    else {
        var osd_pin_code_val = pinCode;
        /* first enter PIN CODE, show confirm again */
        if (first_enter_pin_code == DEFAULT_PWD) {
            /* save first PIN CODE */
            first_enter_pin_code = osd_pin_code_val;
            /* show confirm dialog */
            set_confirm_pin_code();
        } 
        else if (first_enter_pin_code == osd_pin_code_val) {
            /* confirm ok */
            /* save password */
            set_password(first_enter_pin_code);
            /* hide pin code dialog */
            close_pin_code_dialog();
            /* save pin code status */
            correct_pin_code = true;
        } 
        else {
            /* confirm fail */
            
            set_pin_code_confirm_fail();
        }
    
    } /* else */
}
function set_confirm_pin_code() {
    /* set title */
    var str = getTranslate(option_channle_islock.QT_CONFIRM_PIN);
    set_pin_code_title(str);
    /* reset PIN CODE dialog */
    reset_pin_code_osd_class();
    return;
}
function update_pin_code_status() {

    /* default password need set new pin code by user */
    if (is_default_password() == true) {
        set_new_pin_code();
        return;
    }
    
    if (is_pin_code_correct() == true) {
        /* hide pin code dialog */
        close_pin_code_dialog();
        /* save pin code status */
        correct_pin_code = true;
    } 
    else {
        /* save pin code statue */
        correct_pin_code = false;
        /* confirm fail, set error msg */
        var str = getTranslate(option_channle_islock.QT_INCORRECT_PIN);
        set_pin_code_title(str.replace("\\n", "<br/>"));
        /* reset pin code dialog */
        reset_pin_code_osd_class();
    }
    return null;
}
function get_passsord() {
    var pwd = null;
    pwd = mtvObj.getPassword();
    return pwd;
}
function set_password(pwd) {
    mtvObj.setPassword(pwd);
    set_pin_mode(PIN_CODE_SET);
    return;
}
function get_pin_mode() {
    return mtvObj.getPinMode();
}
function set_pin_mode(mode) {
    return mtvObj.setPinMode(mode);
}
function is_pin_code_correct() {
    return (get_pin_code_value() == get_passsord());
}
function is_default_password() {
    if (PIN_CODE_NOT_SET == get_pin_mode()) {
        return true;
    }
    return false;
}
var t_timer = null;

function reset_delay_ch_num_osd(svl_id, ch_id, mask, mask_val, mode) {
    if (t_timer == null) {
        t_timer = setTimeout(function() {
            delay_function(svl_id, ch_id, mask, mask_val, mode);
        }, 
        3000);
    } 
    else {
        clearTimeout(t_timer);
        t_timer = setTimeout(function() {
            delay_function(svl_id, ch_id, mask, mask_val, mode);
        }, 
        3000);
    }
}
function delay_function(svl_id, ch_id, mask, mask_val, mode) {
    console.log("delay_function svl_id:" + svl_id + "ch_id" + ch_id + "mask:" + mask + "mask_val:" + mask_val + "mode:" + mode);
    
    var major_num = get_channel_num_osd_value();
    var ch_id = -1;
    /* one channel list case */
    if (!is_dvbs_channel_by_svl_id(svl_id) && parseInt(mtvObj.getOclStatus())) {
        if (mode == ModeList.Mode_TV_normal_favorite && "GBR" != this.mtvObj.getCurrentCountry()) {
            idx = major_num < g_channel_cnt ? major_num - 1 : g_channel_cnt - 1;
            if (idx < 0) {
                idx = 0;
            }
            var ch_info = get_fav_channel_info_by_idx(svl_id, mask, mask_val, idx);
            ch_id = ch_info.ITEMS[0].CHANNEL_ID;
        } else {
            var idx = mtvObj.getOclNearestIdxByMajor(mask, mask_val, major_num);
            var ch_info = mtvObj.getOclChannelInfoByDbIdx(mask, mask_val, idx);
            ch_id = ch_info.ITEMS[0].CHANNEL_ID;
        }

    } 
    else {
        //favorite
        if (mode == ModeList.Mode_TV_normal_favorite && "GBR" != this.mtvObj.getCurrentCountry()) {
            idx = major_num < g_channel_cnt ? major_num - 1 : g_channel_cnt - 1;
            if (idx < 0) {
                idx = 0;
            }
            var ch_info = get_fav_channel_info_by_idx(svl_id, mask, mask_val, idx);
            ch_id = ch_info.ITEMS[0].CHANNEL_ID;
        } else {
            ch_id = get_channel_id_by_major_num(major_num);
            var chObj_next = mtvObj.getChannelListEx(svl_id, ch_id, mask, mask_val, DirectionList.Direction_next, 1);
            var next_major_num = chObj_next[0].MAJOR_NUM;
            var next_ch_id = chObj_next[0].CHANNEL_ID;
            var chObj_pre = mtvObj.getChannelListEx(svl_id, ch_id, mask, mask_val, DirectionList.Direction_pre, 1);
            var pre_major_num = chObj_pre[0].MAJOR_NUM;
            var pre_ch_id = chObj_pre[0].CHANNEL_ID;
            ch_id = (Math.abs(next_major_num - major_num)) > (Math.abs(major_num - pre_major_num)) ? pre_ch_id : next_ch_id;
        }
    }
    
    focus_channel_by_ch_id(svl_id, ch_id, mask, mask_val, mode);
    //adjust channel page idx
    changeCurrentpage();
    /* hide channel num OSD */
    hide_channel_num_osd();
    reset_channel_num_osd_class();
}
function get_channel_id_by_major_num(maj_num) {
    /* Bitwise Left Shift */
    var ch_id = maj_num << 18;
    return ch_id;
}
function focus_channel_by_ch_id(svl_id, ch_id, mask, mask_val, mode) {
    //get from first channel
    if(mode == ModeList.Mode_TV_normal_favorite){
        var idx = get_fav_index_by_channel_id(svl_id, mask, mask_val, ch_id);
        var focus_idx = idx % CAROUSEL_ITEM_CNT; 
        g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
        idx = get_first_ch_in_current_ch_page(idx);
        var ch_info = get_fav_channel_info_by_idx(svl_id, mask, mask_val, idx);
    } else {
        var idx = get_index_by_channel_id(svl_id, mask, mask_val, ch_id);
        var focus_idx = idx % CAROUSEL_ITEM_CNT;
        g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
        idx = get_first_ch_in_current_ch_page(idx);
        var ch_info = get_channel_info_by_idx(svl_id, mask, mask_val, idx);
    }
    
    carousel_add_channel_items(mode, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
    focus_channel_card_by_idx(focus_idx);
}
function focus_channel_card_by_idx(idx) {
    var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
    
    if (item_cards.length <= 0)
        return;
    //clear all channel active class
    item_cards.attr("class", "card channel");
    $(item_cards[idx]).attr("class", "card channel active");
}
var set_channel_carousel = function(target, list, scroll) {
    var item = null;
    var count = 0;
    target.html(""); /* clean all items */
    //default automatic
    //scroll = typeof scroll !== 'undefined' ? scroll : -1;
    /* get current channel info*/
    var cur_ch = mtvObj.getCurrentChannelInfoForEachTuner();
    var channel_name = '';
    $.each(list, function(k, ch) {
        
        if (null == item)
            item = $('<div class="item active" />');
        /* if there is no icon then use default icon. */
        var logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
        //var icon = '<div class="card-image">'+(logo ? '<img src="'+logo+'" />' : '')+'</div>';
        var icon = logo ? '<div class="card-image"><img src="' + logo + '" /></div>' : '';
        
        var ch_name = ch.SERVICE_NAME ? ch.SERVICE_NAME : "-----";
        var attrch_name = ch.SERVICE_NAME;
        var temp = "";
        for (var i = 0; i < attrch_name.length; i++) {
            if (attrch_name.charAt(i) == '"') {
                temp += "&quot;";
            } else {
                temp += attrch_name.charAt(i);
            }
        }
        attrch_name = temp;
        var icon_favorite = "./res/ChannelList/Icon_Favorite_Small.png";
        var icon_lock = "./res/ChannelList/Icon_Lock_Small.png";
        var icon_scrambled = "./res/ChannelList/Icon_Scrambled_Small.png";
        var icon_new = "./res/ChannelList/Icon_New_Small.png";
        var ch_mask = parseInt(ch.NW_MASK);
        var ch_num = ch.MAJOR_NUM;
        if(ch.hasOwnProperty('MINOR_NUM')&&ch.MINOR_NUM){
            ch_num = ch.MAJOR_NUM+'.'+ch.MINOR_NUM;
        }

        var is_favorite = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
        var is_lock = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;
        var is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
        var is_new = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
        ch_name = stringtoolong(ch_name);
        var ch_name_temp = logo ? '<div id="ch_name" class="card-content" style="width:178px;height:26px;white-space:nowrap;overflow:hidden;">' + ch_name + '</div>' : '<div id="ch_name" class="card-content" style="position:absolute;width:178px;height:26px;top:50%;margin-top:-13px;white-space:nowrap;overflow:hidden;">' + ch_name + '</div>';
        var scramble_icon = logo ? '<div class="card-scrambled-icon"><img /></div>' : '<div class="card-scrambled-icon" style="margin-top:83px;"><img /></div>';
        var card = $('<div class="card channel" align="center" svl_id="' + ch.SVL_ID + '" channel_id="' + ch.CHANNEL_ID + '" channel_num="' + ch_num + '" channel_name="' + attrch_name + '" channel_mask="' + ch_mask + '" channel_idx="' + ch.INDEX + '" >\
		<div class="card-favorite-icon" id="favorite-show-hide"><img /></div>\
		<div class="card-new-icon"><img /></div>\
		<div class="card-content" style="font-size:19px;" align="left"><span>' + ch_num + '</span></div>\
		<div class="card-lock-icon"><img /></div>\
		' + icon + '\
		' + ch_name_temp + '\
		' + scramble_icon + '\
		<div class="car_range_favorite_icon_num" style="display:none;"><img src="./res/ChannelList/Icon_Favorite_Blue.png"><p class="num_car_range">1</p></div>\
		</div>');
        var ci;
        if (cur_ch.CHANNEL_ID == ch.CHANNEL_ID) {
            /* add current channel style */
            ci = $('<div class="col-md-3 col-sm-6 channel_item   current" style="height:122px;"></div>');
        } else {
            ci = $('<div class="col-md-3 col-sm-6 channel_item " style="height:122px;"></div>');
        }
        
        card.appendTo(ci);
        ci.appendTo(item);
        count++;

        //set lock icon display
        if (is_lock) 
        {
            lock = ci.find(".card-lock-icon");
            if (lock.length > 0) {
                $($(lock[0]).find('img')).attr("src", icon_lock);
                $(lock[0]).addClass("display");
            }
        }
        //set scrambled icon display
        if (is_scrambled) 
        {
            scrambled = ci.find(".card-scrambled-icon");
            if (scrambled.length > 0) {
                $($(scrambled[0]).find('img')).attr("src", icon_scrambled);
                $(scrambled[0]).addClass("display");
            }
        
        }
        //set new icon display
        if (is_new && !is_favorite) 
        {
            newer = ci.find(".card-new-icon");
            if (newer.length > 0) {
                $($(newer[0]).find('img')).attr("src", icon_new);
                $(newer[0]).addClass("display");
            }
        
        }

        //console.log("get_is_favorite_ch_by_id(ch.CHANNEL_ID):"+get_is_favorite_ch_by_id(ch.CHANNEL_ID));
        if (is_favorite) 
        {
            fav = ci.find(".card-favorite-icon");
            if (fav.length > 0) {
                $($(fav[0]).find('img')).attr("src", icon_favorite);
                $(fav[0]).addClass("display");
            }
        
        }
        
        if (item && (0 == (count % 10))) {
            item.appendTo(target);
            item = null;
        }
    
    });
    //console.log("count:"+count);
    if (null != item)
        item.appendTo(target);
};

var set_find_channel_carousel = function(target, list, find_ch_name) {
    var item = null;
    var count = 0;
    target.html(""); /* clean all items */
    console.log("find_ch_name:" + find_ch_name);
    $.each(list, function(k, ch) {
        if (null == item)
            item = $('<div class="item" />');
        /* if there is no icon then use default icon. */
        var logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
        var icon = '<div class="card-image">' + (logo ? '<img src="' + logo + '" />' : '') + '</div>';
        var ch_num = ch.MAJOR_NUM;
        if(ch.hasOwnProperty('MINOR_NUM')&&ch.MINOR_NUM){
            ch_num = ch.MAJOR_NUM+'.'+ch.MINOR_NUM;
        }
        
        var ch_name = ch.SERVICE_NAME ? ch.SERVICE_NAME : "-----";
        var icon_favorite = "./res/ChannelList/Icon_Favorite_Small.png";
        var icon_lock = "./res/ChannelList/Icon_Lock_Small.png";
        var icon_scrambled = "./res/ChannelList/Icon_Scrambled_Small.png";
        var icon_new = "./res/ChannelList/Icon_New_Small.png";
        /* draw find channel card */
        console.log("ch_name.indexOf(find_ch_name):" + ch_name.indexOf(find_ch_name));
        if (ch_name.indexOf(find_ch_name) > -1) {
            var card = $('<div class="card channel" align="center"  channel_id="' + ch.CHANNEL_ID + '" channel_num="' + ch_num + '" channel_name="' + ch.SERVICE_NAME + '">\
			<div class="card-favorite-icon" id="favorite-show-hide"><img src="' + icon_favorite + '" /></div>\
			<div class="card-new-icon"><img src="' + icon_new + '" /></div>\
			<div class="card-content" align="left"><span>' + ch_num + '</span></div>\
			<div class="card-lock-icon"><img src="' + icon_lock + '" /></div>\
			' + icon + '\
			<div class="card-content"><span>' + ch_name + '</span></div>\
			<div class="card-scrambled-icon"><img /></div>\
			</div>');
            
            var ci = $('<div class="col-md-3 col-sm-6" style="height:122px;;"></div>');
            card.appendTo(ci);
            ci.appendTo(item);
            count++;
            if (item && (0 == (count % 10))) {
                item.appendTo(target);
                item = null;
            }
        
        }
    });
    
    if (null != item)
        item.appendTo(target);
    its = target.find(".item");
    if (its.length > 0)
        $(its[0]).addClass("active");


};

function save_last_active_idx(idx) {
    switch (parseInt(get_cur_ch_list_type())) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            fav_list_selected_idx = idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_all:
        case ChannelListTypeList.ChannelListType_satellite_all:
            all_list_selected_idx = idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_radio:
        case ChannelListTypeList.ChannelListType_satellite_radio:
            radio_list_selected_idx = idx;
            break;
        case ChannelListTypeList.ChannelListType_tv_new:
        case ChannelListTypeList.ChannelListType_satellite_new:
            new_list_selected_idx = idx;
            break;
        case ChannelListTypeList.ChannelListType_satellite_tv:
            tv_list_selected_idx = idx;
            break;
        default:
            all_list_selected_idx = idx;
            break;
    }
}
var tv_normal_all_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;
    var svl_id = 0;
    var channel_id = 0;
    /* not card */
    if (cards_all.length <= 0) {
        reset_submenu_focus();
        return false;
    }
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        //	 if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        //	 }
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            /* save last selected idx */
            save_last_active_idx(idx);
            idx -= 5;
            if (idx < 0) {
                var ch_name = $(active_card[0]).attr("channel_name");
                ch_name = stringtoolong(ch_name);
                $(active_card[0]).find("#ch_name").html(ch_name);
                reset_submenu_focus();
                return false;
            }
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    /* if at last page */
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                //i = $.inArray(active_card[0], cards_all);
                idx = item_cards.length - 1;
            //$(cards_all[idx]).attr("class", "card channel active");
            }
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[0]).attr("channel_id"))) {
                svl_id = $(item_cards[0]).attr("svl_id");
                /* if at last page */
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                }
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //set first channel card active
            idx = 0;
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            if (idx >= item_cards.length) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                //i = $.inArray(active_card[0], cards_all);
                //idx = (i + 1 + cards_all.length) % cards_all.length;
                //$(cards_all[idx]).attr("class", "card channel active");
                idx = 0;
            }
        } 
        /* handle INCREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[item_cards.length - 1]).attr("channel_id"))) {
                svl_id = $(item_cards[item_cards.length - 1]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                }
                //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //active first channel
            idx = 0;
            if (g_channel_cnt <= CAROUSEL_ITEM_CNT) {
                idx = item_cards.length - 1;
            }
        
        } 
        /* handle YELLOW key */
        else if (key == KeyEvent.DOM_VK_YELLOW) {
            //DOM_VK_PAGE_UP
            console.log("REC: DOM_VK_YELLOW key");
            
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    svl_id = $(active_card[0]).attr("svl_id");
                    ch_mask = $(active_card[0]).attr("channel_mask");
                    var is_new = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
                    
                    if (is_new) {
                        /* hidden new icon */
                        $('[channel_id="' + channel_id + '"] .card-new-icon').hide();
                    }
                    if(!$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src')){
						$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src', "./res/ChannelList/Icon_Favorite_Small.png");
					}
                    /* show/hidden favorite icon */
                    $('[channel_id="' + channel_id + '"] .card-favorite-icon').toggle();

                    set_favorite_ch_id(svl_id, channel_id, ch_mask, FAVORITE_TYPE_0);
                    /* toggle the channel favorite mask */
                    ch_mask_toggle = ch_mask ^= SB_VENT_FAVORITE; /* XOR */
                    $(active_card[0]).attr("channel_mask", ch_mask_toggle);
                
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
        
        } 
        /* handle GREEN key */
        else if (key == KeyEvent.DOM_VK_GREEN) {
            
            if (true == is_enable_swap_fct()) {
                /* Swap channel mode */
                Move_before_move_state_layout();
                set_active_mode(ModeList.Mode_Swap_before_move);
                return false;
            } else {
                /* Find channel mode */
                /*set keyboard mode*/
                set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_find_channel);
                console.log("REC: DOM_VK_GREEN key");
                textValue = "";
                Find_channel_new_search_state_layout();
                set_active_mode(ModeList.Mode_FindChannel_new_serach);
            }
        
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    /* set new channel */
                    //mtvObj.setBrdcastChgChannel(channel_id);
                    var chObj = {
                        "CHANNEL_ID": channel_id,
                        "SVL_ID": $(active_card[0]).attr("svl_id"),
                        "NW_MASK": $(active_card[0]).attr("channel_mask")
                    };
                    change_channel_by_channle_info(chObj);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            /* back to home UI */
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            g_t_timer_delay_exit = setTimeout(function() {
                window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            }, 
            1000);
            return false;
        
        } 
        else if (key == KeyEvent.DOM_VK_CHANNEL_OSD) {
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            return false;
        } 
        /* handle OPTION key */
        else if (key == KeyEvent.DOM_VK_BLUE) {
            
            console.log("REC: DOM_VK_BLUE key");
            //Option_menu_TV_normal_all_state_layout();
            jump_to_help_page();
            window.location = "../index.html";
            return true;
        
        } 
        /* handle OPTION key */
        else if (key == KeyEvent.DOM_VK_OPTION) {
            
            console.log("REC: DOM_VK_OPTION key");
            switch (parseInt(get_cur_ch_list_type())) {
                case ChannelListTypeList.ChannelListType_tv_new:
                case ChannelListTypeList.ChannelListType_satellite_new:
                    Option_menu_TV_normal_new_state_layout();
                    break;
                default:
                    Option_menu_TV_normal_all_state_layout();
                    break;
            }
            
            set_active_mode(ModeList.Mode_Option_menu_TV_normal_all);
            return false;
        
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            if (is_disable_rename()) {
                return false;
            }
            /*set keyboard mode*/
            set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_rename);
            
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                var ch_mask = $(active_card[0]).attr("channel_mask");
                var svl_id = $(active_card[0]).attr("svl_id");
                var channel_name = $(active_card[0]).attr("channel_name");
                
                try {
                    //set keyboard orignal value
                    textValue = channel_name;
                    //show keyboard
                    Find_channel_new_search_state_layout();
                    set_active_mode(ModeList.Mode_FindChannel_new_serach);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            
            return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_BACK) {
            reset_submenu_focus();
            return false;
        
        } 
        /* handle number key */
        else if ((KeyEvent.DOM_VK_0 <= key) && (key <= KeyEvent.DOM_VK_9)) {
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                var svl_id = $(active_card[0]).attr("svl_id");
                try {
                    show_channel_num_osd();
                    switch (key) {
                        case KeyEvent.DOM_VK_0:
                            update_channel_num_osd(0);
                            break;
                        case KeyEvent.DOM_VK_1:
                            update_channel_num_osd(1);
                            break;
                        case KeyEvent.DOM_VK_2:
                            update_channel_num_osd(2);
                            break;
                        case KeyEvent.DOM_VK_3:
                            update_channel_num_osd(3);
                            break;
                        case KeyEvent.DOM_VK_4:
                            update_channel_num_osd(4);
                            break;
                        case KeyEvent.DOM_VK_5:
                            update_channel_num_osd(5);
                            break;
                        case KeyEvent.DOM_VK_6:
                            update_channel_num_osd(6);
                            break;
                        case KeyEvent.DOM_VK_7:
                            update_channel_num_osd(7);
                            break;
                        case KeyEvent.DOM_VK_8:
                            update_channel_num_osd(8);
                            break;
                        case KeyEvent.DOM_VK_9:
                            update_channel_num_osd(9);
                            break;
                        default:
                            break;
                    }
                    reset_delay_ch_num_osd(svl_id, channel_id, get_current_mask(), get_current_mask_value(), ModeList.Mode_TV_normal_all);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            return false;
        }

        //clear all channel active class
        item_cards.attr("class", "card channel");
        if (item_cards.length <= 0) {
            return false;
        }
        //set current channel active
        $(item_cards[idx]).attr("class", "card channel active");
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        // if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        // }
        //change the color key list between fav's channel and not fav's channel.
        if (get_is_favorite_ch_by_mask($(item_cards[idx]).attr("channel_mask"))) {
            set_colourkey_list_text(ColourKeyList_TV_normal_All_fav_state);
        } else {
            //not favorite channel colourkey
            set_colourkey_list_text(ColourKeyList_TV_normal_All_not_fav_state);
        }
        changeCurrentpage();
    }
    return true;
};

var tv_normal_radio_key_proc = function(kc) {

    //tv normal Radio key handle process the same as All case expect for RIGHT/LEFT key
    return tv_normal_all_key_proc(kc);
}

var tv_normal_new_key_proc = function(kc) {

    //tv normal New key handle process the same as All case expect for RIGHT/LEFT key
    return tv_normal_all_key_proc(kc);
}
var tv_normal_tv_key_proc = function(kc) {

    //tv normal Radio key handle process the same as All case expect for RIGHT/LEFT key.
    return tv_normal_all_key_proc(kc);
}

/*
*Set the text of colour key list
*/
var set_colourkey_list_text = function(colourkey_state) {
    
    console.log("set ColorKey list text");
    //set the text of Info key
    //$("#ColorKey_Info").html(colourkey_state[0].ColorKey_Info);
    //set the text of Red key
    $("#ColorKey_Red").html(getTranslate(colourkey_state.ColorKey_Red));
    //set the text of Green key
    $("#ColorKey_Green").html(getTranslate(colourkey_state.ColorKey_Green));
    //set the text of YELLOW key
    $("#ColorKey_Yellow").html(getTranslate(colourkey_state.ColorKey_Yellow));
    //set the text of Blue key
    $("#ColorKey_Blue").html(getTranslate(colourkey_state.ColorKey_Blue));
    //set the text of Options key
    $("#ColorKey_Options").html(getTranslate(colourkey_state.ColorKey_Options));
    
    return true;
};

/*
*Handle key process of Find channel mode in type a text mode.
*/
var find_channel_type_text_key_proc = function(kc) {
    
    var key = kc.keyCode || kc.which;
    console.log("Enter find_channel_type_text_key_proc");
    
    switch (key) {
        case KeyEvent.DOM_VK_UP:
            {
                //str_id like as key_1/key_2...
                var str_id = $("#keyBoard-dialog").find(".key-active").attr("id");

                //string to int
                var idx = parseInt(str_id.split("_")[1]);
                //remove old active class
                $("#keyBoard-dialog").find(".key-active").removeClass("key-active");
                if (str_id == "btn-keyboard-hide") {
                    //active the DONE button
                    $("#btn-keyboard-done").addClass("key-active");
                    break;
                } 
                else if (str_id == "btn-keyboard-done") {
                    //active the HIDE button
                    $("#btn-keyboard-hide").addClass("key-active");
                    break;
                }
                //index computing by each row
                // row 1
                console.log(idx);
                if (idx > -1 && idx < 5) {
                    idx = 30;
                    console.log(idx);
                } 
                else if (idx > 4 && idx < 7) {
                    idx += 26;
                } 
                else if (idx > 6 && idx < 10) {
                    idx += 19;
                } 
                else if (idx > 9 && idx < 19) {
                    idx -= 9;
                } 
                else if (idx > 18 && idx < 30) {
                    if (idx == 19) {
                        idx = 10;
                    } 
                    else if (idx == 29) {
                        idx = 18;
                    } 
                    else {
                        idx -= 10;
                    }
                } 
                else if (idx > 29 && idx < 34) {
                    if (idx == 33) {
                        idx = 25;
                    } 
                    else {
                        idx -= 7;
                    }
                
                }
                console.log(idx);
                //Joining together new string
                var new_str = "key_" + idx;
                //new idx add active class
                $("#" + new_str + "").addClass("key-active");
                break;
            }
        case KeyEvent.DOM_VK_DOWN:
            {
                //var activeValue = $("#keyboard").find(".key-active").attr("value");
                //str_id like as key_1/key_2...
                var str_id = $("#keyBoard-dialog").find(".key-active").attr("id");

                //string to int
                try {
                    var idx = parseInt(str_id.split("_")[1]);
                } 
                catch (err) {
                    idx = 0;
                    console.log("error for parseInt!");
                    console.log(err);
                }

                //remove old active class
                $("#keyBoard-dialog").find(".key-active").removeClass("key-active");
                
                if (str_id == "btn-keyboard-done") {
                    //active the HIDE button
                    $("#btn-keyboard-hide").addClass("key-active");
                    break;
                } 
                else if (str_id == "btn-keyboard-hide") {
                    $("#btn-keyboard-done").addClass("key-active");
                    break;
                }
                //index computing by each row
                // row 1
                console.log(idx);
                if (idx > -1 && idx < 10) {
                    if (idx == 0) {
                        idx += 10;
                    } 
                    else {
                        idx += 9;
                    }
                    console.log(idx);
                } 
                else if (idx > 9 && idx < 19) {
                    idx += 10;
                } 
                else if (idx > 18 && idx < 24) {
                    idx = 30;
                } 
                else if (idx > 23 && idx < 27) {
                    idx += 7;
                } 
                else if (idx > 26 && idx < 30) {
                    idx = 33;
                } 
                else if (idx > 29 && idx < 34) {
                    if (idx == 33) {
                        idx = 6;
                    } 
                    else {
                        idx -= 26;
                    }
                
                }
                console.log(idx);
                //Joining together new string
                var new_str = "key_" + idx;
                //new idx add active class
                $("#" + new_str + "").addClass("key-active");
                break;
            }
        case KeyEvent.DOM_VK_LEFT:
            {
                //var activeValue = $("#keyboard").find(".key-active").attr("value");
                var str_id = $("#keyBoard-dialog").find(".key-active").attr("id");
                //handle button of DONE/HIDE
                console.log(str_id);
                if (str_id == "btn-keyboard-done" || str_id == "btn-keyboard-hide") {
                    idx = 9;
                    //Joining together new string
                    var new_str = "key_" + idx;
                    //new idx add active class
                    $("#keyBoard-dialog").find(".key-active").removeClass("key-active");
                    $("#" + new_str + "").addClass("key-active");
                    break;
                }

                //str_id like as key_1/key_2...
                var idx = parseInt(str_id.split("_")[1]);
                //remove old active class
                $("#keyboard").find(".key-active").removeClass("key-active");
                //index --
                idx--;
                if (idx < 0) {
                    idx = 33;
                }
                //Joining together new string
                var new_str = "key_" + idx;
                //new idx add active class
                $("#" + new_str + "").addClass("key-active");
                break;
            }
        case KeyEvent.DOM_VK_RIGHT:
            {
                //var activeValue = $("#keyboard").find(".key-active").attr("value");
                var str_id = $("#keyBoard-dialog").find(".key-active").attr("id");
                //str_id like as key_1/key_2...
                console.log(str_id);
                if (str_id == "btn-keyboard-done" || str_id == "btn-keyboard-hide") {
                    //do nothing
                    break;
                }
                var idx = str_id.split("_")[1];
                //remove old active class
                $("#keyBoard-dialog").find(".key-active").removeClass("key-active");
                //index ++
                console.log(idx);
                //handle special key ,should jump to button DONE
                if (idx == 9 || idx == 18 || idx == 29) {
                    $("#btn-keyboard-done").addClass("key-active");
                    break;
                }
                idx++;
                if (idx > 33) {
                    //set the index to first one.
                    idx = 0;
                }
                //Joining together new string
                var new_str = "key_" + idx;
                //new idx add active class
                $("#" + new_str + "").addClass("key-active");
                break;
            }
        case KeyEvent.DOM_VK_RETURN:
            {
                console.log("KeyEvent.DOM_VK_RETURN");
                //get active id
                var str_id = $("#keyBoard-dialog").find(".key-active").attr("id");
                //save the old value
                var oldValue = $("#key-board-txtID").text();
                if (str_id == "btn-keyboard-done") {
                    //back up to pre page
                    Find_channel_new_search_state_layout();
                    //set active mode to Find channel mode of new search mode
                    set_active_mode(ModeList.Mode_FindChannel_new_serach);
                    
                    break;
                } 
                else if (str_id == "btn-keyboard-hide") {
                    //back up to pre page
                    Find_channel_new_search_state_layout();
                    //clear keyboard text value
                    $("#key-board-txtID").html("");
                    //set active mode to Find channel mode of new search mode
                    set_active_mode(ModeList.Mode_FindChannel_new_serach);
                    
                    break;
                }
                //get current active item's value
                var activeValue = $("#keyBoard-dialog").find(".key-active").attr("value");
                //insert to current active item's value to old value last
                var str = oldValue + activeValue;
                //set the new value to input text item
                $("#key-board-txtID").html(str);
                //set focus
                //$("#key-board-txtID").focus();
                break;
            }
        case KeyEvent.DOM_VK_GREEN:
            {
                console.log("KeyEvent.DOM_VK_GREEN");
                //switch keyboard to UPPER
                drawKeyboard("upper");
                break;
            }
        case KeyEvent.DOM_VK_RED:
            {
                console.log("KeyEvent.DOM_VK_GREEN");
                drawKeyboard("lower");
                break;
            }
        case KeyEvent.DOM_VK_BLUE:
            {
                var oldValue = $("#key-board-txtID").text() + "";
                var str = oldValue.substr(0, oldValue.length - 1);
                $("#key-board-txtID").html(str);
                break;
            }
    }
    ;
    return false;
}

/*
*Handle key process of Find channel mode in new search mode.
*/
var find_channel_new_search_key_proc = function(kc) {
    
    var key = kc.keyCode || kc.which;
    switch (key) {
        case KeyEvent.DOM_VK_RETURN:
            {
                var str_id = $("#new-search-dialog").find(".key-active").attr("id");

                //handle button key of Clear/Done/Cancel
                console.log(str_id);
                var channel_id = 0;
                textValue = $("#new-search-txtID").val();
                if (keyboard_mode == KyeboardModeList.KyeboardMode_tv_normal_rename) {
                    var active_card = $("#id_channel_carousel").find(".item.active .card.channel.active");
                    if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                        var svl_id = $(active_card[0]).attr("svl_id");
                        //rename active channel name
                        var channel_name = textValue;
                        $(active_card[0]).find("#ch_name").html(channel_name);
                        setchannelName(channel_name);
                        /* show/hidden favorite icon */
                        rename_channel_name_by_svl_ch_id(svl_id, channel_id, textValue);
                        $(active_card[0]).attr("channel_name", textValue);
                        $("#new-search-dialog").hide();
                        back_to_last_active_mode();
                        show_tv_normal_items();
                    }
                
                } else {
                    //layout find channel results
                    Find_channel_results_state_layout(textValue);
                    //set mode
                    set_active_mode(ModeList.Mode_FindChannel_show_results);
                }
                $("#new-search-txtID").blur();
                break;
            }
        case KeyEvent.DOM_VK_ESCAPE:
            {
                $("#new-search-dialog").hide();
                back_to_last_active_mode();
                reset_colourbar();
                show_tv_normal_items();
                $("#new-search-txtID").blur();
                break;
            }
        default:
            break;
    }
    ;
    return false;
}
/*
*Handle key process of Find channel mode in search results state mode.
*/
var g_t_timer_delay_exit = null;
var find_channel_show_results_state_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;

    //no card channel
    if (cards_all.length <= 0) {
        if ((key == KeyEvent.DOM_VK_UP) || (key == KeyEvent.DOM_VK_DOWN) || (key == KeyEvent.DOM_VK_LEFT) 
        || (key == KeyEvent.DOM_VK_RIGHT) || (key == KeyEvent.DOM_VK_RETURN) || (key == KeyEvent.DOM_VK_YELLOW))
            return false; /* not process */
    }
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
    }
    
    {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            idx -= 5;
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0, textValue.trim());
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                    }
                    //carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                idx = item_cards.length - 1;
            
            }
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[0]).attr("channel_id"))) {
                svl_id = $(item_cards[0]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0, textValue.trim());
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                }
                //carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //set first channel card active
            idx = 0;
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            if (idx >= item_cards.length) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    //carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());	
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0, textValue.trim());
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                    }
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                idx = 0;
            }
        } 
        /* handle INCREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[item_cards.length - 1]).attr("channel_id"))) {
                svl_id = $(item_cards[item_cards.length - 1]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0, textValue.trim());
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                }
                //carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0, textValue.trim());
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //active first channel
            idx = 0;
            if (g_channel_cnt <= CAROUSEL_ITEM_CNT) {
                idx = item_cards.length - 1;
            }
        
        } 
        /* handle YELLOW key */
        else if (key == KeyEvent.DOM_VK_YELLOW) {
            //DOM_VK_PAGE_UP
            console.log("REC: DOM_VK_YELLOW key");
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    svl_id = $(active_card[0]).attr("svl_id");
                    ch_mask = $(active_card[0]).attr("channel_mask");
                    
                    set_favorite_ch_id(svl_id, channel_id, ch_mask, FAVORITE_TYPE_0);
                    if(!$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src')){
						$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src', "./res/ChannelList/Icon_Favorite_Small.png");
					}
                    /* show/hidden favorite icon */
                    $('[channel_id="' + channel_id + '"] .card-favorite-icon').toggle();
                
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            }
            return true;
        } 
        /* handle DOM_VK_GREEN key */
        else if (key == KeyEvent.DOM_VK_GREEN) {
            //DOM_VK_PAGE_UP
            console.log("REC: DOM_VK_GREEN key");
            $("#new-search-txtID").val("");
            /* Find channel mode */
            /*set keyboard mode*/
            set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_find_channel);
            Find_channel_new_search_state_layout();
            set_active_mode(ModeList.Mode_FindChannel_new_serach);
            //active_mode = ModeList.Mode_FindChannel_type_text;
            return true;
        } 
        /* handle DOM_VK_RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            //DOM_VK_PAGE_UP
            console.log("REC: DOM_VK_RED key");
            switch (parseInt(get_cur_ch_list_type())) {
                case ChannelListTypeList.ChannelListType_tv_favorite:
                case ChannelListTypeList.ChannelListType_satellite_favorite:
                    TV_normal_favorite_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_favorite);
                    break;
                case ChannelListTypeList.ChannelListType_tv_radio:
                case ChannelListTypeList.ChannelListType_satellite_radio:
                    TV_normal_radio_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_radio);
                    break;
                case ChannelListTypeList.ChannelListType_tv_new:
                case ChannelListTypeList.ChannelListType_satellite_new:
                    TV_normal_new_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_new);
                    break;
                case ChannelListTypeList.ChannelListType_tv_all:
                case ChannelListTypeList.ChannelListType_satellite_all:
                    TV_normal_all_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_all);
                    break;
                case ChannelListTypeList.ChannelListType_satellite_tv:
                    TV_normal_tv_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_tv);
                    break;
                default:
                    TV_normal_all_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_all);
                    break;
            }
            
            return true;
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    /* set new channel */
                    //mtvObj.setBrdcastChgChannel(channel_id);
                    var chObj = {
                        "CHANNEL_ID": channel_id,
                        "SVL_ID": $(active_card[0]).attr("svl_id"),
                        "NW_MASK": $(active_card[0]).attr("channel_mask")
                    };
                    change_channel_by_channle_info(chObj);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            /* back to home UI */
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            g_t_timer_delay_exit = setTimeout(function() {
                window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            }, 
            1000);
            return false;
        } 
        else if (key == KeyEvent.DOM_VK_CHANNEL_OSD) {
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            return false;
        } 
        else if (key == KeyEvent.DOM_VK_BLUE) {
            jump_to_help_page();
            return false;
        }

        //clear all channel active class
        item_cards.attr("class", "card channel");
        if (item_cards.length <= 0) {
            return false;
        }
        //set current channel active
        $(item_cards[idx]).attr("class", "card channel active");
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        //	 if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        //	 }
        changeCurrentpage();
    }
    return true;
};

var tv_normal_favorite_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;
    // console.log(carousel);
    /* not card */
    if (cards_all.length <= 0) {
        reset_submenu_focus();
        return false;
    }
    console.log(" cards_all:" + cards_all.length);
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);
    console.log(" idx:" + idx);
    /* no active card */
    if (-1 == idx) {
        console.log("0 > idx:" + idx);
        if (key == KeyEvent.DOM_VK_UP) {
            reset_submenu_focus();
            return false; /* not process */
        }
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        //	 if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        //	 }
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            /* save last selected idx */
            fav_list_selected_idx = idx;
            idx -= 5;
            if (idx < 0) {
                var ch_name = $(active_card[0]).attr("channel_name");
                ch_name = stringtoolong(ch_name);
                $(active_card[0]).find("#ch_name").html(ch_name);
                reset_submenu_focus();
                return false;
            }
        } 
        /* handle back key */
        else if (key == KeyEvent.DOM_VK_BACK) {
            var ch_name = $(active_card[0]).attr("channel_name");
            ch_name = stringtoolong(ch_name);
            $(active_card[0]).find("#ch_name").html(ch_name);
            reset_submenu_focus();
            return false;
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item .card.channel"); /* update the items */
                }
                idx = item_cards.length - 1;
            }
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[0]).attr("channel_id"))) {
                svl_id = $(item_cards[0]).attr("svl_id");
                /* if at last page */
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //set first channel card active
            idx = 0;
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            if (idx >= item_cards.length) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                idx = 0;
            }
        } 
        /* handle INCREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[item_cards.length - 1]).attr("channel_id"))) {
                svl_id = $(item_cards[item_cards.length - 1]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //active first channel
            idx = 0;
            if (g_channel_cnt <= CAROUSEL_ITEM_CNT) {
                idx = item_cards.length - 1;
            }
        
        } 
        /* handle YELLOW key */
        else if (key == KeyEvent.DOM_VK_YELLOW) {
            /* remove a favorite channel per 1s when user long press yellow key */
            if (false == is_need_response) {
                return false;
            } 
            else {
                is_need_response = false;
                delay_response_key(1000); /* 1000ms */
            }
            
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    svl_id = $(active_card[0]).attr("svl_id");
                    ch_mask = $(active_card[0]).attr("channel_mask");
                    
                    if ((g_channel_page_idx * CAROUSEL_ITEM_CNT + idx + 2) > g_channel_cnt) {
                        /* need reset focus */
                        if (idx == 0) {
                            idx = CAROUSEL_ITEM_CNT - 1;
                        } 
                        else {
                            idx--;
                        }
                        
                        if (idx < 0) {
                            idx = 0;
                        }
                    }
                    if (item_cards.length <= 1) {
                        /* only one channel in current page, remove it should decrease the channel page idx */
                        g_channel_page_idx--;
                    }
                    set_favorite_ch_id(svl_id, channel_id, ch_mask, FAVORITE_TYPE_0);
                    /* reset favorite lsit */
                    $('[channel_id="' + channel_id + '"]').parent().remove();
                    /* update favorite list of current page */
                    update_current_page_ch_list();
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            }
            //if there is no favorite channel card
            //should change state to create-favorite
            if (get_favorite_length() <= 0) {
                console.log("show creat favorite!");
                //no favorite channel in favorite_list
                //layout
                Favorite_edit_create_favorite_state_layout();
                //set active mode
                set_active_mode(ModeList.Mode_Favorite_create_favorite);
                return false;
            }
            /* update the items */
            item_cards = kc.target.find(".item.active .card.channel");
        /* focus to previous card */
        
        } 
        /* handle GREEN key */
        else if (key == KeyEvent.DOM_VK_GREEN) {
            if (is_disable_move_fct()) {
                return false;
            }
            if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
                set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_find_channel);
                console.log("REC: DOM_VK_GREEN key");
                textValue = "";
                Find_channel_new_search_state_layout();
                set_active_mode(ModeList.Mode_FindChannel_new_serach);
            } else {
                Move_before_move_state_layout();
                set_active_mode(ModeList.Mode_Move_before_move);               
            }
            
            return true;
        
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    /* set new channel */
                    //mtvObj.setBrdcastChgChannel(channel_id);
                    var chObj = {
                        "CHANNEL_ID": channel_id,
                        "SVL_ID": $(active_card[0]).attr("svl_id"),
                        "NW_MASK": $(active_card[0]).attr("channel_mask")
                    };
                    change_channel_by_channle_info(chObj);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            }
            /* back to home UI */
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            g_t_timer_delay_exit = setTimeout(function() {
                window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            }, 
            1000);
            return false;
        } 
        else if (key == KeyEvent.DOM_VK_CHANNEL_OSD) {
            if (g_t_timer_delay_exit != null) {
                clearTimeout(g_t_timer_delay_exit);
                g_t_timer_delay_exit = null;
            }
            window.location = "../channel_zapper/channel_change_osd.html"; /* Go to root page */
            return false;
        } 
        /* handle BLUE key */
        else if (key == KeyEvent.DOM_VK_BLUE) {
            
            console.log("REC: DOM_VK_BLUE key");
            jump_to_help_page();
            window.location = "../index.html";
            return true;
        
        } 
        /* handle OPTION key */
        else if (key == KeyEvent.DOM_VK_OPTION) {
            Option_menu_TV_normal_fav_state_layout();
            set_active_mode(ModeList.Mode_Option_menu_TV_normal_fav);
            return true;
        
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            if (is_disable_rename()) {
                return false;
            }
            /*set keyboard mode*/
            set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_rename);
            
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                var ch_mask = $(active_card[0]).attr("channel_mask");
                var svl_id = $(active_card[0]).attr("svl_id");
                var channel_name = $(active_card[0]).attr("channel_name");
                
                try {
                    //set keyboard orignal value
                    //	$("#key-board-txtID").html(channel_name);
                    textValue = channel_name;
                    //show keyboard
                    Find_channel_new_search_state_layout();
                    set_active_mode(ModeList.Mode_FindChannel_new_serach);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            
            return false;
        } 
        /* handle number key */
        else if ((KeyEvent.DOM_VK_0 <= key) && (key <= KeyEvent.DOM_VK_9)) {
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                var svl_id = $(active_card[0]).attr("svl_id");
                try {
                    show_channel_num_osd();
                    switch (key) {
                        case KeyEvent.DOM_VK_0:
                            update_channel_num_osd(0);
                            break;
                        case KeyEvent.DOM_VK_1:
                            update_channel_num_osd(1);
                            break;
                        case KeyEvent.DOM_VK_2:
                            update_channel_num_osd(2);
                            break;
                        case KeyEvent.DOM_VK_3:
                            update_channel_num_osd(3);
                            break;
                        case KeyEvent.DOM_VK_4:
                            update_channel_num_osd(4);
                            break;
                        case KeyEvent.DOM_VK_5:
                            update_channel_num_osd(5);
                            break;
                        case KeyEvent.DOM_VK_6:
                            update_channel_num_osd(6);
                            break;
                        case KeyEvent.DOM_VK_7:
                            update_channel_num_osd(7);
                            break;
                        case KeyEvent.DOM_VK_8:
                            update_channel_num_osd(8);
                            break;
                        case KeyEvent.DOM_VK_9:
                            update_channel_num_osd(9);
                            break;
                        default:
                            break;
                    }
                    reset_delay_ch_num_osd(svl_id, channel_id, MaskList.Mask_favorite, MaskValueList.MaskValue_favorite, ModeList.Mode_TV_normal_favorite);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            return false;
        }
        item_cards.attr("class", "card channel");
        $(item_cards[idx]).attr("class", "card channel active");
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return true;
};

var favorite_edit_one_by_one_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;
    /* not card */
    if (cards_all.length <= 0 || item_cards.length <= 0) {
        reset_submenu_focus();
        return false;
    }
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        //	 if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        //	 }
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            idx -= 5;
            if (idx < 0) {
                return false;
            }
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[0]).attr("channel_id"))) {
                svl_id = $(item_cards[0]).attr("svl_id");
                /* if at last page */
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                }
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //set first channel card active
            idx = 0;
        } 
        /* handle INCREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(item_cards[item_cards.length - 1]).attr("channel_id"))) {
                svl_id = $(item_cards[item_cards.length - 1]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                }
                //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }
            //active first channel
            idx = 0;
            if (g_channel_cnt <= CAROUSEL_ITEM_CNT) {
                idx = item_cards.length - 1;
            }
        
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            console.log("DOM_VK_LEFT:g_channel_idx:" + g_channel_idx);
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    }
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                //carousel.carousel('prev');				 
                idx = item_cards.length - 1;
            
            }
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            if (idx >= item_cards.length) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }
                idx = 0;
            }
        } 
        /* handle YELLOW key */
        else if (key == KeyEvent.DOM_VK_YELLOW) {
            //DOM_VK_PAGE_UP
            //	 var channel_id = null;
            
            mark_all_as_fav_dialog("mark");
            set_active_mode(ModeList.Mode_favorite_mark_all);
            return false;
        
        } 
        /* handle GREEN key */
        else if (key == KeyEvent.DOM_VK_GREEN) {
            //DOM_VK_GREEN
            console.log("REC: DOM_VK_GREEN key");
            
            startRangeIndex = CAROUSEL_ITEM_CNT * g_channel_page_idx + idx;
            endRangeIndex = startRangeIndex;
            windowIndex = idx;
            
            addOrMoveFavoriteStyle();
            
            reset_edit_by_block_text_guidance();
            
            set_active_mode(ModeList.Mode_favorite_edit_by_range);
            //set color key text
            set_colourkey_list_text(ColourKeyList_Select_Rang_state);
            return false;
        
        } 
        /*  handle blue key */
        else if (key == KeyEvent.DOM_VK_BLUE) {
            
            console.log("REC: DOM_VK_BLUE key");
            //Option_menu_TV_normal_all_state_layout();
            jump_to_help_page();
            window.location = "../index.html";
            return false;
        
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            //DOM_VK_PAGE_UP
            console.log("REC: DOM_VK_YELLOW key");
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    svl_id = $(active_card[0]).attr("svl_id");
                    ch_mask = $(active_card[0]).attr("channel_mask");
                    
                    
                    var is_new = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
                    set_favorite_ch_id(svl_id, channel_id, ch_mask, FAVORITE_TYPE_0);
                    if (is_new) {
                        /* hidden new icon */
                        $('[channel_id="' + channel_id + '"] .card-new-icon').hide();
                    }

                    if(!$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src')){
						$('[channel_id="'+channel_id+'"] .card-favorite-icon img').attr('src', "./res/ChannelList/Icon_Favorite_Small.png");
					}
					
                    /* show/hidden favorite icon */
                    $('[channel_id="' + channel_id + '"] .card-favorite-icon').toggle();

                    /* toggle the channel favorite mask */
                    var ch_mask_toggle = ch_mask ^= SB_VENT_FAVORITE; /* XOR */
                    $(active_card[0]).attr("channel_mask", ch_mask_toggle);
                    
                    
                    
                    var fav_count = get_favorite_length();
                    //var str = "&nbsp;&nbsp"+fav_count+" Favorite Channels <br />To add or remove favorite channels, press OK. To mark multiple in one go, press Green or Yellow."
                    var str = fav_count + getTranslate(favoritedata.QT_FAV_CHANNEL) + "<br />" + getTranslate(favoritedata.QT_FAV_REMOVE);
                    //set guidance text
                    set_guidance_text(str);
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            
            }
            
            return false;
        } 
        /* handle DOM_VK_RED key */
        else if (key == KeyEvent.DOM_VK_RED || key == KeyEvent.DOM_VK_BACK) {
            //show create favorite channel list dialog.
            if (get_favorite_length() <= 0) {
                //no favorite channel in favorite_list
                //layout
                Favorite_edit_create_favorite_state_layout();
                //set active mode
                set_active_mode(ModeList.Mode_Favorite_create_favorite);
            
            } else {
                if(ModeList.Mode_favorite_edit_by_range == active_mode){
                    set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
                    /* set current channel list type */
                    set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_default);
                    Favorite_edit_one_by_one_state_layout();
                } else {
                    if ((submenu_selected_id == 'tv_submenu_bar_0')) {
                        set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_favorite);
                    } 
                    else {
                        set_cur_ch_list_type(ChannelListTypeList.ChannelListType_satellite_favorite);
                    }
                    TV_normal_favorite_state_layout();
                    set_active_mode(ModeList.Mode_TV_normal_favorite);
                }
                startRangeIndex = null;
            }
            return true;
        
        } 
        /* handle OPTION key */
        else if (key == KeyEvent.DOM_VK_OPTION) {
            
            console.log("REC: DOM_VK_OPTION key");
            if (get_favorite_length() > 0) {
                Option_menu_TV_normal_edit_fav_state_layout();
                set_active_mode(ModeList.Mode_Option_menu_TV_normal_all);
            }
            
            return false;
        
        }
        cards_all.attr("class", "card channel");
        $(item_cards[idx]).attr("class", "card channel active");
        
        var ch_name = $(active_card[0]).attr("channel_name")
        ch_name = stringtoolong(ch_name);
        
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return true;
};
function reset_edit_by_block_text_guidance() {
    var slecting_fav_count = Math.abs(endRangeIndex - startRangeIndex) + 1;
    var str = "&nbsp;&nbsp" + slecting_fav_count + getTranslate(favoritedata.QT_FAV_CHANNEL) + "<br />" + getTranslate(favoritedata.QT_FAV_REMOVE);
    //set guidance text
    set_guidance_text(str);
}

var startRangeIndex = null;
var endRangeIndex = null;
function favorite_edit_by_block_key_proc(kc) {
    var key = kc.keyCode || kc.which;
    switch (key) {
        case KeyEvent.DOM_VK_UP:
        case KeyEvent.DOM_VK_DOWN:
        case KeyEvent.DOM_VK_LEFT:
        case KeyEvent.DOM_VK_RIGHT:
        case KeyEvent.DOM_VK_CH_INCREASE:
        case KeyEvent.DOM_VK_CH_DECREASE:
        case KeyEvent.DOM_VK_RED:
        case KeyEvent.DOM_VK_BLUE:
            favorite_edit_one_by_one_key_proc(kc);
            if (startRangeIndex != null) {
                
                var item_cards = kc.target.find(".item.active .card.channel");
                var active_card = kc.target.find(".item.active .card.channel.active");
                var idx = -1;

                /* not card */
                if (item_cards.length <= 0) {
                    return false;
                }
                
                if (active_card.length > 0) {
                    idx = $.inArray(active_card[0], item_cards);
                    windowIndex = idx;
                    endRangeIndex = CAROUSEL_ITEM_CNT * g_channel_page_idx + windowIndex;
                }
                
                addOrMoveFavoriteStyle();
                reset_edit_by_block_text_guidance();
            }
            break;
        case KeyEvent.DOM_VK_RETURN:
            var ch = mtvObj.getCurrentChannelInfoForEachTuner();
            if (startRangeIndex < endRangeIndex) {
                for (var i = startRangeIndex; i <= endRangeIndex; i++) {
                    /* get channel info by idx */
                    var ch_info = get_channel_info_by_idx(ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, i);
                    set_favorite_channel_by_svl_and_ch_id(ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, ch_info.ITEMS[0].NW_MASK, FAVORITE_TYPE_0);
                }
            
            } else {
                for (var i = endRangeIndex; i <= startRangeIndex; i++) {
                    /* get channel info by idx */
                    var ch_info = get_channel_info_by_idx(ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, i);
                    set_favorite_channel_by_svl_and_ch_id(ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, ch_info.ITEMS[0].NW_MASK, FAVORITE_TYPE_0);
                }
            }
            /* remove all style */
            $(".channel_item:lt(" + CAROUSEL_ITEM_CNT + ")").removeClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").hide();

            /* store to acfg */
            store_channel_list_to_acfg();
            //show create favorite channel list dialog.
            if (get_favorite_length() <= 0) {
                //no favorite channel in favorite_list
                //layout
                Favorite_edit_create_favorite_state_layout();
                //set active mode
                set_active_mode(ModeList.Mode_Favorite_create_favorite);
            
            } else {
                TV_normal_favorite_state_layout();
                set_active_mode(ModeList.Mode_TV_normal_favorite);
            }
            break;
        default:
            break;
    }
}

var windowIndex = 0;
var itemIndex = 0;
function addOrMoveFavoriteStyle() {
    
    var end = CAROUSEL_ITEM_CNT * g_channel_page_idx + windowIndex;
    var samePage = parseInt(startRangeIndex / CAROUSEL_ITEM_CNT) == parseInt(end / CAROUSEL_ITEM_CNT) ? true : false;
    
    var windowSta = null;
    var windowEnd = null;

    /* remove all style */
    $(".channel_item:lt(" + CAROUSEL_ITEM_CNT + ")").removeClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").hide();
    
    if (samePage) { //in same page
        if (end > startRangeIndex) {
            windowSta = startRangeIndex % CAROUSEL_ITEM_CNT;
            windowEnd = end % CAROUSEL_ITEM_CNT;
        
        } else {
            windowSta = end % CAROUSEL_ITEM_CNT;
            windowEnd = startRangeIndex % CAROUSEL_ITEM_CNT;
        }
        $(".channel_item:eq(" + windowSta + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
        $(".channel_item:eq(" + windowEnd + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
        var selectObj = $(".channel_item:lt(" + windowEnd + ").channel_item:gt(" + windowSta + ")");
        
        $(".channel_item:eq(" + windowSta + ")").find(".num_car_range").html(1);
        $(".channel_item:eq(" + windowEnd + ")").find(".num_car_range").html(windowEnd - windowSta + 1);
        
        for (var index = 0; index < selectObj.length; index++) {
            range_num = index + 2;
            $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").find(".num_car_range").html(range_num);
            $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
        }
    
    } else { //in new page
        if (end > startRangeIndex) {
            windowSta = 0;
            windowEnd = end % CAROUSEL_ITEM_CNT;
            $(".channel_item:eq(" + windowEnd + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            $(".channel_item:lt(" + windowEnd + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            var selectObj = $(".channel_item:lt(" + windowEnd + ")");
            $(".channel_item:eq(" + windowEnd + ")").find(".num_car_range").html(end - startRangeIndex + 1);
            for (var index = 0; index < selectObj.length; index++) {
                range_num = Math.abs(CAROUSEL_ITEM_CNT * g_channel_page_idx - startRangeIndex) + index + 1;
                $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").find(".num_car_range").html(range_num);
                $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            }
        } else {
            windowSta = end % CAROUSEL_ITEM_CNT;
            windowEnd = CAROUSEL_ITEM_CNT - 1;
            
            $(".channel_item:eq(" + windowEnd + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            $(".channel_item:gt(" + windowEnd + ")").addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            var selectObj = $(".channel_item:gt(" + windowEnd + ")");
            $(".channel_item:eq(" + windowEnd + ")").find(".num_car_range").html(startRangeIndex - end + 1);
            $(".channel_item:eq(" + windowSta + ")").find(".num_car_range").html(1);
            for (var index = 0; index < selectObj.length; index++) {
                range_num = index + 2;
                $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").find(".num_car_range").html(range_num);
                $(selectObj[index]).addClass("car_range_favorite_icon").find(".car_range_favorite_icon_num").show();
            }
        }
    
    }

}
function showSelectedFavoriteNumber() {

}
function moveSelectedItem(event) {
    var item_cards = $(".channel_item");
    switch (event) {
        case KeyEvent.DOM_VK_UP:
            if ((windowIndex - 5) < 0) {
                return false;
            } else {
                windowIndex -= 5;
            }
            break;
        case KeyEvent.DOM_VK_DOWN:
            if ((windowIndex + 5) >= item_cards.length)  /* out of last range */{
                return false;
            } else {
                windowIndex += 5;
            }
            break;
        case KeyEvent.DOM_VK_LEFT:
            if ((windowIndex - 1) < 0) { //go to up page
                var Jitem = $(".channel_item:first>div").eq(0);
                if (Jitem == undefined) { //current window is empty
                    console.log('$(".channel_item").length' + $(".channel_item").length);
                    return;
                } else {
                    console.log('$(".channel_item").length' + $(".channel_item").length);
                }
                
                var svlId = Jitem.attr("svl_id");
                var channelId = Jitem.attr("channel_id");
                if (svlId == undefined) {
                    console.log("svlId is undefined.");
                    console.log(Jitem);
                    return;
                } else {
                    console.log("svlId is:" + svlId);
                }
                var pageSize;
                
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx - 1;
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) { /* last page channel count */
                    pageSize = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                } else {
                    pageSize = CAROUSEL_ITEM_CNT;
                }
                carousel_add_channel_items(ModeList.Mode_TV_normal_all, svlId, channelId, DirectionList.Direction_pre, pageSize, FAVORITE_TYPE_0);
                windowIndex = 0;
            } else {
                windowIndex -= 1;
            }
            
            break;
        case KeyEvent.DOM_VK_RIGHT:
            if ((windowIndex + 1) >= item_cards.length) {
                var Jitem = $(".channel_item:last>div").eq(0);
                if (Jitem == undefined) { //current window is empty
                    console.log('$(".channel_item").length' + $(".channel_item").length);
                    return;
                } else {
                    console.log('$(".channel_item").length' + $(".channel_item").length);
                }
                var svlId = Jitem.attr("svl_id");
                var channelId = Jitem.attr("channel_id");
                if (svlId == undefined) {
                    console.log("svlId is undefined.");
                    console.log(Jitem);
                    return;
                } else {
                    console.log("svlId is:" + svlId);
                }
                var pageSize;
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) { /* last page channel count */
                    pageSize = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                } else {
                    pageSize = CAROUSEL_ITEM_CNT;
                }
                carousel_add_channel_items(ModeList.Mode_TV_normal_all, svlId, channelId, DirectionList.Direction_next, pageSize, FAVORITE_TYPE_0);
                windowIndex = 0;
            } else {
                windowIndex += 1;
            }
            break;
        
        case KeyEvent.DOM_VK_CH_INCREASE:
            
            windowIndex = 0;
            var Jitem = $(".channel_item:last>div").eq(0);
            if (Jitem == undefined) { //current window is empty
                console.log('$(".channel_item>div").length' + $(".channel_item>div").length);
                return;
            } else {
                console.log('$(".channel_item>div").length' + $(".channel_item>div").length);
            }
            var svlId = Jitem.attr("svl_id");
            var channelId = Jitem.attr("channel_id");
            if (svlId == undefined) {
                console.log("svlId is undefined.");
                console.log(Jitem);
                return;
            } else {
                console.log("svlId is:" + svlId);
            }
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            var pageSize = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
            carousel_add_channel_items(ModeList.Mode_TV_normal_all, svlId, channelId, DirectionList.Direction_next, pageSize, FAVORITE_TYPE_0);
            
            break;
        
        case KeyEvent.DOM_VK_CH_DECREASE:
            windowIndex = 0;
            var Jitem = $(".channel_item:first>div").eq(0);
            if (Jitem == undefined) { //current window is empty
                console.log('$(".channel_item>div").length' + $(".channel_item>div").length);
                return;
            } else {
                console.log('$(".channel_item").length' + $(".channel_item>div").length);
            }
            var svlId = Jitem.attr("svl_id");
            var channelId = Jitem.attr("channel_id");
            if (svlId == undefined) {
                console.log("svlId is undefined.");
                console.log(Jitem);
                return;
            } else {
                console.log("svlId is:" + svlId);
            }
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx - 1;
            var pageSize = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
            carousel_add_channel_items(ModeList.Mode_TV_normal_all, svlId, channelId, DirectionList.Direction_next, pageSize, FAVORITE_TYPE_0);
            
            break;
        default:
            break;
    }
}
function mark_all_as_favourites_key_proc(kc) {
    var idx = -1;
    var key = kc.keyCode || kc.which;
    var cards_all = kc.target.find(".item .card.channel");
    /* handle UP key */
    if (key == KeyEvent.DOM_VK_UP) {
        //	reset_submenu_focus();
        $("#mark-all-as-fav").hide();
        $("#colour_bar").show();
        set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
        return false;
    } 
    /* handle LEFT key */
    else if (key == KeyEvent.DOM_VK_LEFT) {
        console.log("Rec DOM_VK_LEFT");
        // mark_all_btn_yes mark_all_btn_no
        $('#mark_all_btn_yes').addClass('mark-all-as-favbutton-style-hover');
        $('#mark_all_btn_no').removeClass('mark-all-as-favbutton-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle RIGHT key */
    else if (key == KeyEvent.DOM_VK_RIGHT) {
        console.log("Rec DOM_VK_RIGHT");
        
        $('#mark_all_btn_no').addClass('mark-all-as-favbutton-style-hover');
        $('#mark_all_btn_yes').removeClass('mark-all-as-favbutton-style-hover').addClass('btn-select-style');
        
        return true;
    } 
    /* handle OK key */
    else if (key == KeyEvent.DOM_VK_RETURN) {
        
        console.log("REC: DOM_VK_RETURN key");
        
        var btn_id = $('.mark-all-as-favbutton-style-hover').attr('id');
        if (btn_id == "mark_all_btn_yes") {
            
            var yesvalue = $("#mark_all_btn_yes").attr("value");
            var ch = mtvObj.getCurrentChannelInfoForEachTuner();

            /* show preloader-wrapper */
            $('.preloader-wrapper').show();
            
            if (yesvalue == "mark") {
                /* if focus at OK button should jump to ALL menu to add favorite item */
                var channel_id = null;
                if (cards_all.length < 0) {
                    return false;
                }

                /* add favorite style */
                for (var i = 0; i < cards_all.length; i++) {
                    if (channel_id = $(cards_all[i]).attr("channel_id")) {
                        
                        try {
                            svl_id = $(cards_all[i]).attr("svl_id");
                            ch_mask = $(cards_all[i]).attr("channel_mask");

                            //set_favorite_channel_by_svl_and_ch_id(svl_id, channel_id, ch_mask);

                            /* show/hidden favorite icon */
                            if ((MaskList.Mask_new & ch_mask) == MaskList.Mask_new) {
                                /* hide new icon first */
                                $('[channel_id="' + channel_id + '"] .card-new-icon').hide();
                            }
                            $('[channel_id="' + channel_id + '"] .card-favorite-icon').show();
                        
                        } 
                        catch (err) {
                            console.log("error for set channel id!");
                            console.log(err);
                        }
                    
                    }
                }

                /* add all channel to favourite list */
                mtvObj.chFavListAddAll(ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, FAVORITE_TYPE_0);
            /*
				var channel_cnt = mtvObj.getAllChannelCount();			
				for (var i = 0; i < channel_cnt; i++){
					// get channel info by idx 				
					var ch_info = get_channel_info_by_idx (ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, i);
					set_favorite_channel_by_svl_and_ch_id(ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, ch_info.ITEMS[0].NW_MASK, FAVORITE_TYPE_0);
				}
				*/
            
            } else {
                /* remove favorite style */
                for (var i = 0; i < cards_all.length; i++) {
                    if (channel_id = $(cards_all[i]).attr("channel_id")) {
                        try {
                            $('[channel_id="' + channel_id + '"] .card-favorite-icon').hide();
                        } 
                        catch (err) {
                            console.log("error for set channel id!");
                            console.log(err);
                        }
                    }
                }
                // deal unmark all as favourites
                mtvObj.chFavListDelAll(ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, FAVORITE_TYPE_0);
            }
            /* store to acfg */
            store_channel_list_to_acfg();
            
            var fav_count = get_favorite_length();
            var str = "&nbsp;&nbsp" + fav_count + getTranslate(favoritedata.QT_FAV_CHANNEL) + "<br />" + getTranslate(favoritedata.QT_FAV_REMOVE);
            //set guidance text
            set_guidance_text(str);
            /* hide preloader-wrapper */
            $('.preloader-wrapper').hide();
            /* hide the favorite dialog. */
            $("#mark-all-as-fav").hide();
            set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
        } 
        else {
            /* return to parent's level */
            set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
            //reset_submenu_focus();
            /* hide the favorite dialog. */
            $("#mark-all-as-fav").hide();
        }
        $("#colour_bar").show();
        return true;
    }
}
//for option menu in favorite list key handle
var option_menu_TV_normal_fav_key_proc = function(kc) {
    var key = kc.which || kc.keyCode;
    var active_card = $('#id_collapsible_channel').find(".item.active .card.channel.active");
    if (key == KeyEvent.DOM_VK_UP) {
        var i = 0;
        var items = document.getElementById('list_left').getElementsByTagName('li');
        selected--;
        for (i = selected; i >= 0; i--) {
            if ($(items[selected]).attr("disable") == "true") {
                selected--;
            }
        }
    } else if (key == KeyEvent.DOM_VK_DOWN) {
        var i = 0;
        var items = document.getElementById('list_left').getElementsByTagName('li');
        selected++;
        for (i = selected; i < items.length; i++) {
            if ($(items[selected]).attr("disable") == "true") {
                selected++;
            }
        }
    } else if (key == KeyEvent.DOM_VK_RETURN) {
        var items = document.getElementById('list_left').getElementsByTagName('li');
        var left_menu_item = $(items[selected]).attr("value");
        //handle enter key of diffrent menu item
        switch (left_menu_item) {
            case "Add/Remove favourites":
                {
                    set_active_mode(ModeList.Mode_Favorite_edit_one_by_one);
                    /* set current channel list type */
                    set_cur_ch_list_type(ChannelListTypeList.ChannelListType_tv_default);
                    Favorite_edit_one_by_one_state_layout();
                    /*
				return;
				
				 var channel_id = null;
				 if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
					console.log(channel_id);

					try {
						//layout
						TV_normal_favorite_state_layout();
						//set active mode
						set_active_mode(ModeList.Mode_TV_normal_favorite);


						svl_id  = $(active_card[0]).attr("svl_id");
						ch_mask = $(active_card[0]).attr("channel_mask");

						set_favorite_ch_id(svl_id, channel_id, ch_mask, FAVORITE_TYPE_0);

						// show/hidden favorite icon
						$('[channel_id="'+channel_id+'"]').parent().remove();

					}
					catch(err) {
						 console.log("error for set channel id!");
						 console.log(err);
					}
					console.log(mtvObj.getCurrentChannelInfo().SERVICE_NAME);
				 }
				 //if there is no favorite channel card
				 //should change state to create-favorite
				 if (get_favorite_length() <= 0){
					 console.log("show creat favorite!");
					//no favorite channel in favorite_list
					//layout
					Favorite_edit_create_favorite_state_layout();
					//set active mode
					set_active_mode(ModeList.Mode_Favorite_create_favorite);
				 }
				 */
                    break;
                }
            case "Find channel":
                {
                    console.log("Jump to Find channel mode.");
                    /* Find channel mode */
                    /*set keyboard mode*/
                    set_keyboard_mode(KyeboardModeList.KyeboardMode_tv_normal_find_channel);
                    Find_channel_new_search_state_layout();
                    set_active_mode(ModeList.Mode_FindChannel_new_serach);
                    break;
                }
            case "Unlock channel":
            case "Lock channel":
                {
                    if (correct_pin_code == false) {
                        /* confirm pin code fail, need input again */
                        Pin_code_state_layout();
                        set_active_mode(ModeList.Mode_Enter_pin_code);
                        return;
                    }
                    /* lock or unlock channel */
                    lock_unlock_channel();
                    break;
                }
        }
    
    } 
    else if (key == KeyEvent.DOM_VK_BACK || 
    key == KeyEvent.DOM_VK_OPTION) {
        setMemc_level(true);
        //exit option menu
        $("#option-menu").hide();
        //focus level to 2
        //reset_submenu_focus();
        back_to_last_active_mode();
        /* reset colour bar */
        reset_colourbar();
        return false;
    } else if (key == KeyEvent.DOM_VK_BLUE) {
        jump_to_help_page();
        return false;
    }
    
    itemSelect(selected);
    
    return true;
};
function get_current_active_channel_card() {
    return ($("#id_channel_carousel").find(".item.active .card.channel.active"));
}
function lock_unlock_channel() {
    var channel_id = null;
    var active_card = get_current_active_channel_card();
    if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
        console.log(channel_id);
        
        try {
            var channel_id = null;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                console.log(channel_id);
                
                try {
                    svl_id = $(active_card[0]).attr("svl_id");
                    ch_mask = $(active_card[0]).attr("channel_mask");
                    
                    var is_lock = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;
                    if (is_lock) {
                        //unlock
                        unlock_channel_by_svl_and_ch_id(svl_id, channel_id, ch_mask);
                        $("#option_menu_2").html(getTranslate(option_channle_islock.CHM_OPTL_LOCK_CHANNEL));
                        $(active_card[0]).attr("channel_mask", (ch_mask & ~SB_VENT_BLOCKED));
                    } else {
                        lock_channel_by_svl_and_ch_id(svl_id, channel_id, ch_mask);
                        $("#option_menu_2").html(getTranslate(option_channle_islock.CHM_OPTL_UNLOCK_CHANNEL));
                        $(active_card[0]).attr("channel_mask", (ch_mask | SB_VENT_BLOCKED));
                    }

                    if(!$('[channel_id="'+channel_id+'"] .card-lock-icon img').attr('src')){
						$('[channel_id="'+channel_id+'"] .card-lock-icon img').attr('src', "./res/ChannelList/Icon_Lock_Small.png");
					}

                    /* show/hide lock icon */
                    $('[channel_id="' + channel_id + '"] .card-lock-icon').toggle();
                    //exit option menu
                    $("#option-menu").hide();
                    setMemc_level(true);
                    //focus level to 2
                    //reset_submenu_focus();
                    back_to_last_active_mode();
                    /* reset colour bar */
                    reset_colourbar();
                
                } 
                catch (err) {
                    console.log("error for set channel id!");
                    console.log(err);
                }
            }
        
        
        } 
        catch (err) {
            console.log("error for set channel id!");
            console.log(err);
        }
    
    } //if
    /* store to acfg */
    store_channel_list_to_acfg();
}
function reset_colourbar() {
    switch (parseInt(get_cur_ch_list_type())) {
        case ChannelListTypeList.ChannelListType_tv_favorite:
        case ChannelListTypeList.ChannelListType_satellite_favorite:
            set_colourkey_list_text(ColourKeyList_TV_normal_Favorite_state);
            break;
        default:
            var active_card = get_current_active_channel_card();
            if (active_card.length <= 0) {
                return;
            }
            
            if (active_mode == ModeList.Mode_Favorite_edit_one_by_one) {
                set_colourkey_list_text(ColourKeyList_Favorite_edit_one_by_one_state);
                break;
            }
            
            if (get_is_favorite_ch_by_mask($(active_card[0]).attr("channel_mask"))) {
                set_colourkey_list_text(ColourKeyList_TV_normal_All_fav_state);
            } else {
                //not favorite channel colourkey
                set_colourkey_list_text(ColourKeyList_TV_normal_All_not_fav_state);
            }
            break;
    }
    /* show colour bar. */
    show_colourbar();
}

var option_menu_TV_normal_all_key_proc = function(kc) {
    var key = kc.which || kc.keyCode;
    switch (key) {
        case KeyEvent.DOM_VK_BLUE:
            jump_to_help_page();
            break;
        default:
            if ($('#list_content_right').attr("focus") == "true") {
                return right_handleKeyCode(key);
            } else {
                return handleKeyCode(key);
            }
            break;
    }
    return true;
};

var move_state_before_move_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;

    /* not card */
    if (cards_all.length <= 0)
        return false;
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            idx -= 5;
            if (idx < 0) {
                return false;
            }
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT || 
        key == KeyEvent.DOM_VK_RIGHT || 
        key == KeyEvent.DOM_VK_CH_DECREASE || 
        key == KeyEvent.DOM_VK_CH_INCREASE || 
        key == KeyEvent.DOM_VK_BLUE) {
            /* key follow is the same as normal favorite key */
            tv_normal_favorite_key_proc(kc);
            return false;
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            //before move
            before_move(idx);
            //set active mode
            set_active_mode(ModeList.Mode_Move_moving);
            return false;
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            //layout
            TV_normal_favorite_state_layout();
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_favorite);
            
            removeCloneDiv();
            return true;
        }
        cards_all.attr("class", "card channel");
        $(item_cards[idx]).attr("class", "card channel active");
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return true;
};
var move_state_moving_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;

    /* not card */
    if (cards_all.length <= 0)
        return false;
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        //	 if(ch_name != null && ch_name.length>channelnamelength){
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        //	 }
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length || idx >= CAROUSEL_ITEM_CNT) /* out of last range */
                return false;
            
            moving_channel(idx);
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            idx -= 5;
            if (idx < 0) {
                return false;
            }
            moving_channel(idx);
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            //if current page is selected page
            if (selected_channel_page_idx == g_channel_page_idx) {
                //if moving_index = selected_index + 1; idx need --
                if (idx == (selected_channel_index + 1)) {
                    idx -= 1;
                }
            }
            
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */

                    //active the first channel
                    idx = item_cards.length - 1;
                    /* append the clone card to current page */
                    $("#id_channel_carousel>div").append(selected_channel_div);
                
                }

                //if current page is selected page, need hide old selected channel card position
                if (selected_channel_page_idx == g_channel_page_idx) {
                    hidden_selected_postion_channel(selected_channel_index);
                }
            
            }
            moving_channel(idx);
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                svl_id = $(active_card[0]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */

                //active the first channel
                idx = 0;
                /* append the clone card to current page */
                $("#id_channel_carousel>div").append(selected_channel_div);
            
            }

            //if current page is selected page, need hide old selected channel card position
            if (selected_channel_page_idx == g_channel_page_idx) {
                hidden_selected_postion_channel(selected_channel_index);
            }
            
            moving_channel(idx);
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            //if current page is selected page
            if (selected_channel_page_idx == g_channel_page_idx) {
                //if moving_index = selected_index + 1; idx need ++
                if (idx == (selected_channel_index + 1)) {
                    idx += 1;
                }
            }
            
            if (idx >= item_cards.length || idx >= CAROUSEL_ITEM_CNT) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                /* last page && channel count is g_channel_cnt % CAROUSEL_ITEM_CNT == 0 */
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) && 
                g_channel_cnt % CAROUSEL_ITEM_CNT == 0) {
                    /*  save last channel div*/
                    last_channel_div = $(".item .col-md-3").eq(CAROUSEL_ITEM_CNT - 1).clone();
                    /* step 2: clear current page content */
                    $("#id_channel_carousel>div").empty();

                    /* step 3: page idx ++ */
                    g_channel_page_idx++;
                } 
                else {
                    g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                    if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                        svl_id = $(active_card[0]).attr("svl_id");
                        if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                            /* last page channel count */
                            var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                            carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                        } 
                        else {
                            carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                        }
                        
                        item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                    }
                }
                /* step 2: append the clone card to current page */
                $("#id_channel_carousel>div").append(selected_channel_div);
                //active the first channel
                idx = 0;
                //if current page is selected page, need hide old selected channel card position
                if (selected_channel_page_idx == g_channel_page_idx) {
                    hidden_selected_postion_channel(selected_channel_index);
                }
            
            }
            
            moving_channel(idx);
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                svl_id = $(active_card[0]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }

            /* step 2: append the clone card to current page */
            $("#id_channel_carousel>div").append(selected_channel_div);
            //active the first channel
            idx = 0;
            //if current page is selected page, need hide old selected channel card position
            if (selected_channel_page_idx == g_channel_page_idx) {
                hidden_selected_postion_channel(selected_channel_index);
            }
            
            moving_channel(idx);
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            after_move();
            //set active mode to before move
            set_active_mode(ModeList.Mode_Move_before_move);
            return true;
        
        } 
        /* handle Blue key */
        else if (key == KeyEvent.DOM_VK_BLUE) {
            
            console.log("REC: DOM_VK_BLUE key");
            //jump to help page.
            jump_to_help_page();
            window.location = "../index.html";
            return true;
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            //layout
            TV_normal_favorite_state_layout();
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_favorite);
            //remove clone div
            removeCloneDiv();
            return true;
        }
        //remove active card
        cards_all.attr("class", "card channel");
        
        if (is_last_last_channel_card_positon(idx)) {
            //set selected card before-move style
            $(selected_channel_div).find(".card.channel").attr("class", "card channel active before-move");
        } 
        else {
            //active idx channel
            $(item_cards[idx]).attr("class", "card channel active");
            /* select channel back to orignal position should active itself */
            if (idx == selected_channel_index) {
                //set selected card before-move style
                $(selected_channel_div).find(".card.channel").attr("class", "card channel active before-move");
            } 
            else {
                //set selected card before-move style
                $(selected_channel_div).find(".card.channel").attr("class", "card channel before-move");
            }
        
        }
        
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return false;
};
/*
* Swap function
*/
var swap_state_before_move_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;

    /* not card */
    if (cards_all.length <= 0)
        return false;
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN) {
            idx += 5;
            if (idx >= item_cards.length) /* out of last range */
                return false;
        } 
        /* handle UP key */
        else if (key == KeyEvent.DOM_VK_UP) {
            idx -= 5;
            if (idx < 0) {
                return false;
            }
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT || 
        key == KeyEvent.DOM_VK_RIGHT || 
        key == KeyEvent.DOM_VK_CH_DECREASE || 
        key == KeyEvent.DOM_VK_CH_INCREASE || 
        key == KeyEvent.DOM_VK_BLUE) {
            /* key follow is the same as normal favorite key */
            tv_normal_all_key_proc(kc);
            //set color key text because tv_normal_all_key_proc rewrite the color key text
            set_colourkey_list_text(ColourKeyList_Move_state);
            return false;
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            //before move
            before_move(idx);
            Move_moving_state_layout();
            //set active mode
            set_active_mode(ModeList.Mode_Swap_moving);
            return false;
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            //layout
            TV_normal_all_state_layout();
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_all);
            
            removeCloneDiv();
            return false;
        }
        cards_all.attr("class", "card channel");
        $(item_cards[idx]).attr("class", "card channel active");
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return true;
};
var swap_state_moving_key_proc = function(kc) {
    var carousel = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all = kc.target.find(".item .card.channel");
    var item_cards = kc.target.find(".item.active .card.channel");
    var active_card = kc.target.find(".item.active .card.channel.active");
    var idx = -1;
    var key = kc.keyCode || kc.which;

    /* not card */
    if (cards_all.length <= 0)
        return false;
    
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], item_cards);

    /* no active card */
    if (-1 == idx) {
        if (key == KeyEvent.DOM_VK_UP)
            return false; /* not process */
        item_cards.attr("class", "card channel");
        /* active the first one */
        $(item_cards[0]).attr("class", "card channel active");
        var ch_name = $(item_cards[0]).attr("channel_name");
        
        $(item_cards[0]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        return true;
    } 
    else {
        /* handle DOWN key */
        if (key == KeyEvent.DOM_VK_DOWN 
        || key == KeyEvent.DOM_VK_UP 
        || key == KeyEvent.DOM_VK_BLUE) {
            /* key process the same as move_state_moving_key_proc */
            move_state_moving_key_proc(kc);
            return false;
        } 
        /* handle OK key */
        else if (key == KeyEvent.DOM_VK_RETURN) {
            
            console.log("REC: DOM_VK_RETURN key");
            swap_after_move();
            //set active mode to swap before move
            Move_before_move_state_layout();
            set_active_mode(ModeList.Mode_Swap_before_move);
            return false;
        
        } 
        /* handle LEFT key */
        else if (key == KeyEvent.DOM_VK_LEFT) {
            idx -= 1;
            
            if (idx < 0) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                
                g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                    }
                    //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */

                    //active the first channel
                    idx = item_cards.length - 1;
                    /* append the clone card to current page */
                    $("#id_channel_carousel>div").append(selected_channel_div);
                
                }

                //if current page is selected page, need hide old selected channel card position
                if (selected_channel_page_idx == g_channel_page_idx) {
                    hidden_selected_postion_channel(selected_channel_index);
                }
            
            }
            moving_channel(idx);
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_DECREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = g_channel_page_idx == 0 ? parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT) : g_channel_page_idx - 1;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                svl_id = $(active_card[0]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, svl_id, channel_id, DirectionList.Direction_pre, CAROUSEL_ITEM_CNT);
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */

                //active the first channel
                idx = 0;
                /* append the clone card to current page */
                $("#id_channel_carousel>div").append(selected_channel_div);
            
            }

            //if current page is selected page, need hide old selected channel card position
            if (selected_channel_page_idx == g_channel_page_idx) {
                hidden_selected_postion_channel(selected_channel_index);
            }
            
            moving_channel(idx);
        } 
        /* handle RIGHT key */
        else if (key == KeyEvent.DOM_VK_RIGHT) {
            idx += 1;
            
            if (idx >= (item_cards.length - 1) || idx >= CAROUSEL_ITEM_CNT) {
                cards_all.attr("class", "card channel"); /* remove the ative first */
                
                g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
                if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                    svl_id = $(active_card[0]).attr("svl_id");
                    if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                        /* last page channel count */
                        var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                    } 
                    else {
                        carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                    }
                    
                    item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
                }

                /* step 2: append the clone card to current page */
                $("#id_channel_carousel>div").append(selected_channel_div);
                //active the first channel
                idx = 0;
                //if current page is selected page, need hide old selected channel card position
                if (selected_channel_page_idx == g_channel_page_idx) {
                    hidden_selected_postion_channel(selected_channel_index);
                }
            
            }
            
            moving_channel(idx);
        } 
        /* handle DECREASE key */
        else if (key == KeyEvent.DOM_VK_CH_INCREASE) {
            
            cards_all.attr("class", "card channel"); /* remove the ative first */
            g_channel_page_idx = (g_channel_page_idx >= parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) ? 0 : g_channel_page_idx + 1;
            if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
                svl_id = $(active_card[0]).attr("svl_id");
                if (g_channel_page_idx == parseInt((g_channel_cnt - 1) / CAROUSEL_ITEM_CNT)) {
                    /* last page channel count */
                    var num = (g_channel_cnt % CAROUSEL_ITEM_CNT) == 0 ? CAROUSEL_ITEM_CNT : (g_channel_cnt % CAROUSEL_ITEM_CNT);
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, num, FAVORITE_TYPE_0);
                } 
                else {
                    carousel_add_channel_items(ModeList.Mode_TV_normal_all, svl_id, channel_id, DirectionList.Direction_next, CAROUSEL_ITEM_CNT, FAVORITE_TYPE_0);
                }
                
                item_cards = kc.target.find(".item.active .card.channel"); /* update the items */
            }

            /* step 2: append the clone card to current page */
            $("#id_channel_carousel>div").append(selected_channel_div);
            //active the first channel
            idx = 0;
            //if current page is selected page, need hide old selected channel card position
            if (selected_channel_page_idx == g_channel_page_idx) {
                hidden_selected_postion_channel(selected_channel_index);
            }
            
            moving_channel(idx);
        } 
        /* handle RED key */
        else if (key == KeyEvent.DOM_VK_RED) {
            //layout
            TV_normal_all_state_layout();
            //set active mode
            set_active_mode(ModeList.Mode_TV_normal_all);
            //remove clone div
            removeCloneDiv();
            return true;
        }
        //remove active card
        cards_all.attr("class", "card channel");
        
        if (is_last_last_channel_card_positon(idx)) {
            //set selected card before-move style
            $(selected_channel_div).find(".card.channel").attr("class", "card channel active before-move");
        } 
        else {
            //active idx channel
            $(item_cards[idx]).attr("class", "card channel active");
            /* select channel back to orignal position should active itself */
            if (idx == selected_channel_index) {
                //set selected card before-move style
                $(selected_channel_div).find(".card.channel").attr("class", "card channel active before-move");
            } 
            else {
                //set selected card before-move style
                $(selected_channel_div).find(".card.channel").attr("class", "card channel before-move");
            }
        
        }
        
        var ch_name = $(active_card[0]).attr("channel_name");
        ch_name = stringtoolong(ch_name);
        $(active_card[0]).find("#ch_name").html(ch_name);
        ch_name = $(item_cards[idx]).attr("channel_name");
        
        $(item_cards[idx]).find("#ch_name").html(ch_name);
        setchannelName(ch_name);
        
        changeCurrentpage();
    }
    return false;
};

/*
* Dispatch submenu key .
*/
var sub_menu_key_dispatch = function(kc) {
    key = kc.keyCode || kc.which;
    console.log("recieve key:" + key +" mode:" + active_mode);
    
    kc.target = $('#id_collapsible_channel');
    switch (active_mode) {
        case ModeList.Mode_Favorite_create_favorite:
            {
                //no favirite channel, a pop up dialog shall be displayed to invite user to create Favorites
                //so key should send to dialog.
                favorite_create_favorite_key_proc(kc);
                break;
            }
        case ModeList.Mode_FindChannel_new_serach:
            {
                //Find channel mode of new search mode key process
                find_channel_new_search_key_proc(kc);
                break;
            }
        case ModeList.Mode_FindChannel_show_results:
            {
                //Find channel mode of search results mode key process
                find_channel_show_results_state_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_favorite:
            {
                //TV normal mode in Favorite list key process
                tv_normal_favorite_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_all:
            {
                //TV normal mode in All list key process
                tv_normal_all_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_radio:
            {
                //TV normal mode in Radio list key process
                tv_normal_radio_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_new:
            {
                //TV normal mode in New list key process
                tv_normal_new_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_tv:
            {
                //TV normal mode in TV list key process
                tv_normal_tv_key_proc(kc);
                break;
            }
        case ModeList.Mode_Favorite_edit_one_by_one:
            {
                //Edit favorite mode of edit one by one mode key process
                favorite_edit_one_by_one_key_proc(kc);
                break;
            }
        case ModeList.Mode_Option_menu_TV_normal_all:
            {
                //Option menu mode in TV normal All list key process
                return option_menu_TV_normal_all_key_proc(kc);
                break;
            }
        case ModeList.Mode_Option_menu_TV_normal_fav:
            {
                //Option menu mode in TV normal Favorite list key process
                return option_menu_TV_normal_fav_key_proc(kc);
                break;
            }
        case ModeList.Mode_Move_before_move:
            {
                //Move mode of before move mode key process
                //before move that is enter the move mode at the moment.
                move_state_before_move_key_proc(kc);
                break;
            }
        case ModeList.Mode_Move_moving:
            {
                //Move mode of moving mode key process
                //moving mode that is press OK key when in before move mode.
                move_state_moving_key_proc(kc);
                break;
            }
        case ModeList.Mode_TV_normal_install_channel:
            {
                //Install channel mode of tv normal mode key process
                tv_normal_install_channel_key_proc(kc);
                break;
            }
        case ModeList.Mode_Enter_pin_code:
            {
                //Enter PIN code key process
                Enter_pin_code_key_proc(kc);
                break;
            }
        case ModeList.Mode_favorite_mark_all:
            {
                
                mark_all_as_favourites_key_proc(kc);
                break;
            }
        case ModeList.Mode_favorite_edit_by_range:
            {
                favorite_edit_by_block_key_proc(kc);
                break;
            }
        case ModeList.Mode_Swap_before_move:
            {
                swap_state_before_move_key_proc(kc);
                break;
            }
        case ModeList.Mode_Swap_moving:
            {
                swap_state_moving_key_proc(kc);
                break;
            }
        default:
            {
                //TV normal mode in All list key process
                tv_normal_all_key_proc(kc);
                break;
            }
    }
    
    return true;
};
function setCd_pagination() {
    var cd_pagination = '';
    if (g_channel_cnt >= 0) {
        var channel_cnt = Math.ceil(g_channel_cnt / 10.0);
        if (channel_cnt > 44) {
            channel_cnt = 44;
        }
        for (var i = 0; i < channel_cnt; i++) {
            cd_pagination += '<li class="cd-paginationall" id="page' + i + '"></li>';
        }
        $('#cd-pagination').html(cd_pagination);
        var temp_channel_page_idx = g_channel_page_idx;
        if (g_channel_page_idx > 43) {
            temp_channel_page_idx = 43;
        }
        $('#cd-pagination').find('li').eq(temp_channel_page_idx).attr("class", "cd-paginationall currentpagenew");
    
    }

}
function changeCurrentpage() {
    var temp_channel_page_idx = g_channel_page_idx;
    if (g_channel_page_idx > 43) {
        temp_channel_page_idx = 43;
    }
    console.log("g_channel_page_idx: " + g_channel_page_idx);
    var pageination = $('#cd-pagination').find('li');
    pageination.attr("class", "cd-paginationall");
    pageination.eq(temp_channel_page_idx).attr("class", "cd-paginationall currentpagenew");
/*if(temp_channel_page_idx==($('#cd-pagination').find('li').length-1) && temp_channel_page_idx == 0){
		}
		else if(temp_channel_page_idx==($('#cd-pagination').find('li').length-1)  && temp_channel_page_idx != 0){
			$('#cd-pagination').find('li').first().attr("class","cd-paginationall");
			$('#cd-pagination').find('li').eq(temp_channel_page_idx-1).attr("class","cd-paginationall");
		}else if(temp_channel_page_idx==0){
			$('#cd-pagination').find('li').last().attr("class","cd-paginationall");
			$('#cd-pagination').find('li').eq(temp_channel_page_idx+1).attr("class","cd-paginationall");
		}else{
		    $('#cd-pagination').find('li').eq(temp_channel_page_idx-1).attr("class","cd-paginationall");
		    $('#cd-pagination').find('li').eq(temp_channel_page_idx+1).attr("class","cd-paginationall");
		}
*/
}

function closescroll() {
    clearInterval(timestring);
    scrollnulllength = 1;
}
function string_scroll(obj) {
    if (obj == null) {
        closescroll();
        return false;
    }
    var tmp = (obj.scrollLeft)++;
    if (obj.scrollLeft == tmp) {
        obj.innerHTML += ("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + scrollchannelname);
        scrollnulllength++;
    }
    if (scrollnulllength > 2) {
        obj.innerHTML = (scrollchannelname);
        scrollnulllength = 1;
    }
}
function setchannelName(channelname) {
    if (timestring != "") {
        closescroll();
    }
    scrollchannelname = channelname;
    if (channelname != null && channelname != "") {
        var channelnamepxlength = channelname.getWidth($(".item.active .card.channel.active").find("#ch_name").css("font-size"));
        var channeldivwidth = $(".item.active .card.channel.active").find("#ch_name").css("width");
        if (channelname != null && parseInt(channelnamepxlength) > parseInt(channeldivwidth)) {
            var actioncard = $(".item.active .card.channel.active").find("#ch_name")[0];
            if (actioncard != null) {
                timestring = setInterval('string_scroll($(".item.active .card.channel.active").find("#ch_name")[0])', 20);
            }
        }
    } else {
        $(".item.active .card.channel.active").find("#ch_name").html("-----");
    }
}
function stringtoolong(stringlonger) {
    var channelnamepxlength = stringlonger.getWidth("20px");
    if (stringlonger != null && parseInt(channelnamepxlength) > 178) {
        stringlonger = stringlonger.substring(0, channelnamelength - 7) + '...' + stringlonger.substring(stringlonger.length - 4, stringlonger.length);
    } else if (stringlonger == null || stringlonger == "") {
        stringlonger = "-----";
    }
    return stringlonger;
}
function afterurlstoreChannelList() {
    if (storeChannelListtimeout) {
        mtvObj.storeChannelList('');
		storeChannelListtimeout = null;
    }

}
var acfg_memc_level = 'g_misc__memc_level';
var acfg_vid_mjc_func = 'g_video__vid_mjc_func';
function setMemc_level(enable) {
    if (enable) {
        var value = mtvObj.acfgGetConfigValue(acfg_vid_mjc_func);
        mtvObj.acfgSetConfigValue(acfg_memc_level, value);
    } else {
        mtvObj.acfgSetConfigValue(acfg_memc_level, 0);
    }
}