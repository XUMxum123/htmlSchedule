 //Channel matrix layout of every state.

function TV_normal_favorite_state_layout() {
    console.log("Enter TV_normal_favorite_state_layout;");
    //show top menubar
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_TV_normal_Favorite_state);
    //show #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    //hide option menu
    $("#option-menu").hide();

    /* from 0th page */
    g_channel_page_idx = 0;

    /* reset favorite lsit */
    g_favorite_channel_list = [];
    //clear item 
    $("#id_channel_carousel").html("");
    g_channel_cnt = mtvObj.getFavoriteChannelCountEX(FAVORITE_TYPE_0);
    if (g_channel_cnt > 0) {
        var nw_mask = get_current_mask();
        var mask_value = get_current_mask_value();
        var ch = mtvObj.getCurrentChannelInfoForEachTuner();
        //get from first channel
        var idx = get_fav_index_by_channel_id(ch.SVL_ID, nw_mask, mask_value, ch.CHANNEL_ID);
        
        g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
        var curChIdx = idx % CAROUSEL_ITEM_CNT;
        idx = get_first_ch_in_current_ch_page(idx);
        
        var ch_info = get_fav_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
        carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT), FAVORITE_TYPE_0);
    }
    if (focus_level != 2) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0){
        	if(is_first_boot_up){
				$(item_cards[curChIdx]).attr("class", "card channel active");
        	} else {
        		 $(item_cards[fav_list_selected_idx]).attr("class", "card channel active");
        	}
        }
           
    }
    setCd_pagination();
}

function TV_normal_all_state_layout() {
    console.log("Enter TV_normal_all_state_layout;");
    //show top menubar
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_TV_normal_All_state);
    //show #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    //hide option menu
    $("#option-menu").hide();
    /* reset All lsit */
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);
    //clear item
    $("#id_channel_carousel").html("");
    /* reset all lsit */
    g_all_channel_list = [];
    
    if (g_channel_cnt <= 0) {
        return;
    }

    //get from first channel
    var idx = get_index_by_channel_id(ch.SVL_ID, nw_mask, mask_value, ch.CHANNEL_ID);
    
    g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
    var curChIdx = idx % CAROUSEL_ITEM_CNT;
    idx = get_first_ch_in_current_ch_page(idx);
    
    var ch_info = get_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
    
    carousel_add_channel_items(ModeList.Mode_TV_normal_all, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT));
    if (focus_level != 2) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0){
        	if(is_first_boot_up){
				$(item_cards[curChIdx]).attr("class", "card channel active");
        	} else {
        		 $(item_cards[all_list_selected_idx]).attr("class", "card channel active");
        	}
        }
    }
    setCd_pagination();
}

function get_index_by_channel_id(svl_id, nw_mask, mask_value, ch_id) {
    /* one channel list case */
    if (!is_dvbs_channel_by_svl_id(svl_id) && parseInt(mtvObj.getOclStatus())) {
        return mtvObj.getOclIdxByChannelId(nw_mask, mask_value, ch_id);
    } 
    else {
        return mtvObj.getIdxByChannelId(svl_id, nw_mask, mask_value, ch_id);
    }
}
function get_fav_index_by_channel_id(svl_id, nw_mask, mask_value, ch_id) {
    if ("GBR" == this.mtvObj.getCurrentCountry() || (typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC'))) {
        return get_index_by_channel_id(svl_id, nw_mask, mask_value, ch_id);
    }
    /* one channel list case */
    if (!is_dvbs_channel_by_svl_id(svl_id) && parseInt(mtvObj.getOclStatus())) {
        return mtvObj.oclFavListGetIdxByChId(nw_mask, mask_value, ch_id);
    } 
    else {
        return mtvObj.chFavListGetIdxByChId(svl_id, nw_mask, mask_value, ch_id);
    }
}
function get_channel_info_by_idx(svl_id, nw_mask, mask_value, search_idx) {
    /* one channel list case */
    if (!is_dvbs_channel_by_svl_id(svl_id) && parseInt(mtvObj.getOclStatus())) {
        return mtvObj.getOclChannelInfoByDbIdx(nw_mask, mask_value, search_idx);
    } 
    else {
        return mtvObj.getChannelInfoByDbIdx(svl_id, nw_mask, mask_value, search_idx);
    }
}
function get_fav_channel_info_by_idx(svl_id, nw_mask, mask_value, search_idx) {
    if ("GBR" == this.mtvObj.getCurrentCountry() || (typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC'))) {
        return get_channel_info_by_idx(svl_id, nw_mask, mask_value, search_idx);
    }
    /* one channel list case */
    if (!is_dvbs_channel_by_svl_id(svl_id) && parseInt(mtvObj.getOclStatus())) {
        arg = {"PARAMETER": 
            {"NW_MASK": nw_mask,
                "NW_VALUE": mask_value,
                "CH_SEARCH_IDX": search_idx,
                "REQUEST": "QUERY"}};
        var res = mtvObj.oclFavListGetSvlByIdx(JSON.stringify(arg));
        if (res) {
            res = JSON.parse(res);
        }
        return res;
    } 
    else {
        arg = {"PARAMETER": 
            {"SVL_ID": svl_id,
                "NW_MASK": nw_mask,
                "NW_VALUE": mask_value,
                "FAV_IDX": 0,
                "CH_SEARCH_IDX": search_idx,
                "REQUEST": "QUERY"}};
        var res = mtvObj.chFavListGetSvlByIdx(JSON.stringify(arg));
        if (res) {
            res = JSON.parse(res);
        }
        return res;
    }
}

function get_first_ch_in_current_ch_page(ch_idx) {
    console.log(" get_first_ch_in_current_ch_page ch_idx:" + ch_idx);
    if (ch_idx >= 0) {
        
        if (ch_idx < 10) {
            return g_channel_cnt - 1;
        } 
        else {
            return 10 * parseInt(ch_idx / 10) - 1;
        }
    
    } 
    else {
        return 0;
    }

}

function TV_normal_radio_state_layout() {
    console.log("Enter TV_normal_all_state_layout;");
    //show top menubar
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_TV_normal_All_state);
    //show #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    //hide option menu
    $("#option-menu").hide();
    /* reset Radio lsit */
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);
    //clear item 
    $("#id_channel_carousel").html("");
    
    if (g_channel_cnt <= 0) {
        return;
    }

    /*  //	g_channel_page_idx  = 0;
	
	//get from first channel
	//last channel idx
	var idx = g_channel_cnt - 1;
	var ch_info = get_channel_info_by_idx (ch.SVL_ID, nw_mask, mask_value, idx);
*/
    var idx = get_index_by_channel_id(ch.SVL_ID, nw_mask, mask_value, ch.CHANNEL_ID);
    var curChIdx = idx % CAROUSEL_ITEM_CNT;
    g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
    idx = get_first_ch_in_current_ch_page(idx);
    var ch_info = get_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
    
    carousel_add_channel_items(ModeList.Mode_TV_normal_radio, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT));
    if (focus_level != 2) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0){
        	if(is_first_boot_up){
				$(item_cards[curChIdx]).attr("class", "card channel active");
        	} else {
        		 $(item_cards[radio_list_selected_idx]).attr("class", "card channel active");
        	}
        }
    }
    setCd_pagination();
}

function TV_normal_new_state_layout() {
    console.log(" Enter TV_normal_new_state_layout ");
    //show top menubar
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_TV_normal_All_state);
    //show #new-search-dialog
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    //hide option menu
    $("#option-menu").hide();
    /* reset NEW lsit */
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);
    //clear item 
    $("#id_channel_carousel").html("");
    
    if (g_channel_cnt <= 0) {
        return;
    }

    /*	g_channel_page_idx  = 0;

	//last channel idx
	var idx = g_channel_cnt - 1;
	var ch_info = get_channel_info_by_idx (ch.SVL_ID, nw_mask, mask_value, idx);
	*/
    
    var idx = get_index_by_channel_id(ch.SVL_ID, nw_mask, mask_value, ch.CHANNEL_ID);
    g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
    idx = get_first_ch_in_current_ch_page(idx);
    var ch_info = get_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
    
    carousel_add_channel_items(ModeList.Mode_TV_normal_new, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT));
    //active first channel
    if (is_first_boot_up == true) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0)
            $(item_cards[0]).attr("class", "card channel active");
    
    } else if (focus_level != 2) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0)
            $(item_cards[new_list_selected_idx]).attr("class", "card channel active");
    }
    
    setCd_pagination();
}
function TV_normal_tv_state_layout() {
    //show top menubar
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_TV_normal_All_state);
    //show #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    //hide option menu
    $("#option-menu").hide();
    /* reset TV lsit */
    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value);
    //clear item 
    $("#id_channel_carousel").html("");
    
    if (g_channel_cnt <= 0) {
        return;
    }

    /*	g_channel_page_idx  = 0;
	//last channel idx
	var idx = g_channel_cnt - 1;
	var ch_info = get_channel_info_by_idx (ch.SVL_ID, nw_mask, mask_value, idx);*/
    
    var idx = get_index_by_channel_id(ch.SVL_ID, nw_mask, mask_value, ch.CHANNEL_ID);
    var curChIdx = idx % CAROUSEL_ITEM_CNT;
    g_channel_page_idx = parseInt(idx / CAROUSEL_ITEM_CNT);
    idx = get_first_ch_in_current_ch_page(idx);
    var ch_info = get_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
    
    carousel_add_channel_items(ModeList.Mode_TV_normal_tv, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT));
    if (focus_level != 2) {
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0){
        	if(is_first_boot_up){
				 $(item_cards[curChIdx]).attr("class", "card channel active");
        	} else {
        		 $(item_cards[tv_list_selected_idx]).attr("class", "card channel active");
        	}
        }
           
    }
    setCd_pagination();
}
function Find_channel_results_state_layout(search_str) {
    //hide top menubar
    $("#top_menu_bar").hide();
    $("#sub_menu_bar").hide();
    set_cd_pagination('');
    $("#colour_bar").show();
    $("#create-fav-dialog").hide();
    $("#new-search-dialog").hide();
    //rewrite guidance text content.
    $("#guidance_text_content").html(getTranslate(favoritedata.QT_SEARCH_FOR) + "\"" + search_str + "\" <br />" + getTranslate(favoritedata.QT_VIEW_CHANNEL));
    //show guidance text
    $("#guidance_text").show();
    //hide option menu
    $("#option-menu").hide();
    $("#btn-new-srch-done").removeClass("key-active");
    //set color key text
    set_colourkey_list_text(ColourKeyList_FindChannel_results_state);

    /* get current channel mask and mask value */
    var nw_mask = get_current_mask();
    var mask_value = get_current_mask_value();
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    g_channel_cnt = mtvObj.getChannelCountBySearchStr(ch.SVL_ID, nw_mask, mask_value, search_str.trim());
    //clear item 
    $("#id_channel_carousel").html("");
    
    if (g_channel_cnt <= 0) {
        return;
    }
    
    g_channel_page_idx = 0;

    //draw find channel card
    carousel_add_channel_items(ModeList.Mode_FindChannel_show_results, ch.SVL_ID, ch.CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT), FAVORITE_TYPE_0, search_str.trim());
    /* from 0th page */
    
    setCd_pagination();
}

function Find_channel_new_search_state_layout() {
    
    if (keyboard_mode == KyeboardModeList.KyeboardMode_tv_normal_find_channel) {
        //hide top menubar
        $("#top_menu_bar").hide();
        $("#sub_menu_bar").hide();
    }
    $("#create-fav-dialog").hide();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    //hide colour_bar
    $("#colour_bar").hide();
    //hide option menu
    $("#option-menu").hide();
    $("#new-search-txtID").val(textValue);
    $("#new-search-dialog").show();
    console.log("Find_channel_new_search_state_layout,str:" + textValue);
    $("#new-search-txtID").focus();
}


function Favorite_edit_create_favorite_state_layout() {
    show_top_menu_bar();
    set_cd_pagination('');
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_None_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#option-menu").hide();
    //clear channel_carousel
    $("#id_channel_carousel").html("");
    if ($("#create-fav-dialog .child").length <= 0) {
        $("#create-fav-dialog").html('<div class="modal-content">\
		    <div class="modal-body">\
			    <p id="create_fav_note1">' + getTranslate(option_menuData.create_fav_note1) + '</p>\
			    <p id="create_fav_note2">' + getTranslate(option_menuData.create_fav_note2) + '</p>\
		    </div>\
		    <div class="modal-footer" style="margin-top:180px; border-top-width:0px!important;margin-bottom: 30px;">\
			    <button type="button" class="btn btn-select-style" id="btn-ok" data-dismiss="modal">' + getTranslate(option_menuData.btn_ok) + '</button>\
			    <button type="button" class="btn btn-select-style" id="btn-cancel" style="margin-left: 60px; ">' + getTranslate(option_menuData.btn_cancel) + '</button>\
		    </div>\
		</div>');
    } else {
        $("#btn-ok").html(getTranslate(option_menuData.btn_ok));
        $("#btn-cancel").html(getTranslate(option_menuData.btn_cancel));
        $("#create_fav_note1").html(getTranslate(option_menuData.create_fav_note1));
        $("#create_fav_note2").html(getTranslate(option_menuData.create_fav_note2));
    }
    $("#create-fav-dialog").show();
    //focus at "OK" button
    $('#btn-ok').addClass('btn-select-style-hover');
    $('#btn-cancel').removeClass('btn-select-style-hover').addClass('btn-select-style');
    $("#create-fav-dialog").focus();
    focus_level = 3;
    
    g_channel_cnt = 0;
}

function Favorite_edit_one_by_one_state_layout() {
    //hide top menubar
    $("#top_menu_bar").hide();
    $("#sub_menu_bar").hide();
    set_cd_pagination('');
    $("#colour_bar").show();
    //rewrite guidance text content.
    var fav_count = get_favorite_length();
    $("#guidance_text_content").html("&nbsp;&nbsp" + fav_count + getTranslate(favoritedata.QT_FAV_CHANNEL) + "<br />" + getTranslate(favoritedata.QT_FAV_REMOVE));
    //show guidance text content.
    $("#guidance_text").show();
    //set color key text
    set_colourkey_list_text(ColourKeyList_Favorite_edit_one_by_one_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    $("#option-menu").hide();
    focus_level = 3;
    /* reset All lsit */
    g_channel_cnt = mtvObj.getAllChannelCount();
    //clear item
    $("#id_channel_carousel").html("");
    console.log("getOclStatus:" + JSON.stringify(mtvObj.getOclStatus()));
    /* reset all lsit */
    g_all_channel_list = [];
    
    if (g_channel_cnt <= 0) {
        return;
    }
    
    g_channel_page_idx = 0;

    //last channel idx
    var idx = g_channel_cnt - 1;
    
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    var ch_info = get_channel_info_by_idx(ch.SVL_ID, MaskList.Mask_all, MaskList.Mask_all, idx);
    
    carousel_add_channel_items(ModeList.Mode_TV_normal_all, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, CAROUSEL_ITEM_CNT);
    //active first channel
    var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
    if (item_cards.length > 0)
        $(item_cards[0]).attr("class", "card channel active");
    
    setCd_pagination();
}

function Move_before_move_state_layout() {
    //hide top menubar
    $("#top_menu_bar").hide();
    $("#sub_menu_bar").hide();
    $("#colour_bar").show();
    //rewrite guidance text content.
    $("#guidance_text_content").html("&nbsp;&nbsp;" + getTranslate(favoritedata.QT_CHANNEL_MOVE));
    //show guidance text content.
    $("#guidance_text").show();
    //set color key text
    set_colourkey_list_text(ColourKeyList_Move_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    $("#option-menu").hide();
}

function Move_moving_state_layout() {
    //hide top menubar
    $("#top_menu_bar").hide();
    $("#sub_menu_bar").hide();
    $("#colour_bar").show();
    //rewrite guidance text content.
    $("#guidance_text_content").html("&nbsp;&nbsp;" + getTranslate(favoritedata.QT_CHANNEL_MOVE_NEW_LOCATION));
    //show guidance text content.
    $("#guidance_text").show();
    //set color key text
    set_colourkey_list_text(ColourKeyList_Moving_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    $("#option-menu").hide();
}

function Move_after_move_state_layout() {
    //hide top menubar
    $("#top_menu_bar").hide();
    $("#sub_menu_bar").hide();
    $("#colour_bar").show();
    //rewrite guidance text content.
    $("#guidance_text_content").html("&nbsp;&nbsp;" + getTranslate(favoritedata.QT_INSERT));
    //show guidance text content.
    $("#guidance_text").show();
    //set color key text
    set_colourkey_list_text(ColourKeyList_Move_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#create-fav-dialog").hide();
    $("#option-menu").hide();
}

function create_option_layout() {
    if ($('#option-menu child').length <= 0) {
        $('#option-menu').html('<div id="option" style="position:absolute; left:243px; top:126px; width:774px; height:470px;float:left;z-index:6;">\
		<div id="list_content_left"  style="width:394px; height:460px;float:left;background-image: url(./res/OptionMenu/OptionMeamu_Panel.png);">\
			<div id="title" style="position:absolute; left:-140px; top:120px; width:380px; height:42px; color:rgb(211,212,213);text-alignc:center;font-size:26px;vertical-align=middle;margin:0px;-webkit-transform:rotate(270deg);">Channel Options</div>\
			<div id="list_left" class="option_list" style="left:80px; width:300px; z-index:7;" >\
				<ul>\
					<li id="option_menu_0" tabindex=\'0\' onfocus=\'item_focus(true,"option_menu_0");\' key="1" disable="none" value="Digital/analogue"></li>\
					<li id="option_menu_1" tabindex=\'0\' onfocus=\'item_focus(true,"option_menu_1");\' key="2" disable="none" value="Free / scrambled"></li>\
					<li id="option_menu_2" tabindex=\'0\' onfocus=\'item_focus(true,"option_menu_2");\' key="3" disable="none" value="Lock channel"></li>\
				</ul>\
			</div>\
		</div>\
		<div  class="option_list" focus="false" style="width:380px;z-index:6;margin-left: -29px;top: -6px;">\
			<div id ="hlbar" class= "hlbar" style="left:75px;top:36px;z-index:6;">\
				<img src="../Assets/_Highlight/List_Glow_Blue.png" style="left:5px;top:-32px;width:179px;height:108px ;position: inherit;">\
				<img src="../Assets/_Highlight/Blue_Left.png" style="left:10px; width:6px;position: inherit;">\
				<img src="../Assets/_Highlight/Blue_Middle.png" style="left:16px; width:302px;height:40px;position: inherit;">\
				<img src="../Assets/_Highlight/Blue_Right.png" style="left:318px; width:6px;position: inherit;">\
			</div>\
			<div id="list_content_right" style="position:absolute;z-index:6;">\
				<ul style="top:30px;margin-left:25px;">\
				</ul>\
			</div>\
		</div>\
		<div id ="hlbar_selected" class= "hlbar" style="left:80px;top:157px;display:none;">\
				<img src="../Assets/_Highlight/Selected_Left.png" style="left:10px; width:20px;position: inherit;">\
				<img src="../Assets/_Highlight/Selected_Middle.png" style="left:30px; width:270px;height:40px;position: inherit;">\
				<img src="../Assets/_Highlight/Selected_Right.png" style="left:286px; width:20px;height:40px;position: inherit;">\
		</div>\
	</div>')
    }

}

function Option_menu_TV_normal_all_state_layout() {
    setMemc_level(false);
    //set color key list
    set_colourkey_list_text(ColourKeyList_Option_menu_TV_normal_all_state);
    create_option_layout();
    //show option menu	
    mtvuiLoadScript("./js/option_menu_handle_key.js", function() {
        $("#option-menu").show();
        if (current_tuner_type == TunerType_list.TunerType_satellite) 
        {
            if (is_tkgs_enable() == true) {
                /* TKGS option menu */
                setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_SAT_TKGS);
            } 
            else if (is_m7_enable() == true) {
                /* M7 option menu */
                setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_SAT_M7);
            } 
            else {
                /* Satellite option menu */
                setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_SAT);
            }
        } 
        else 
        {
            /* TV option menu */
            setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_TV);
        }
        $("#title").html(getTranslate(option_channle_islock.QT_CHANNEL_OPTIONS));
        list_left_Init();
    });

}

function Option_menu_TV_normal_fav_state_layout() {
    setMemc_level(false);
    //set color key list
    set_colourkey_list_text(ColourKeyList_Option_menu_TV_normal_all_state);
    create_option_layout();
    mtvuiLoadScript("./js/option_menu_handle_key.js", function() {
        $("#option-menu").show();
        setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_FAV);
        $("#title").html(getTranslate(option_channle_islock.QT_CHANNEL_OPTIONS));
        //init menu left part
        list_left_Init();
    });


}

function Option_menu_TV_normal_new_state_layout() {
    setMemc_level(false);
    //set color key list
    set_colourkey_list_text(ColourKeyList_Option_menu_TV_normal_all_state);
    create_option_layout();
    //show option menu	
    mtvuiLoadScript("./js/option_menu_handle_key.js", function() {
        $("#option-menu").show();
        setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_New);
        $("#title").html(getTranslate(option_channle_islock.QT_CHANNEL_OPTIONS));
        //init menu left part
        list_left_Init();
    });
}

function Option_menu_TV_normal_edit_fav_state_layout() {
    setMemc_level(false);
    //set color key list
    set_colourkey_list_text(ColourKeyList_Option_menu_TV_normal_all_state);
    create_option_layout();
    mtvuiLoadScript("./js/option_menu_handle_key.js", function() {
        //show option menu	
        $("#option-menu").show();
        setLeftSubMenuInfo($($("#list_left").find("ul")), OptionMenuLeftSubMenuList_EDIT_FAV);
        
        $("#title").html(getTranslate(option_channle_islock.QT_CHANNEL_OPTIONS));

        //init menu left part
        list_left_Init();
    });
}
function TV_normal_install_channel_state_layout() {
    //hide top menubar
    show_top_menu_bar();
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
    //hide guidance text content.
    $("#guidance_text").hide();
    //set color key text
    set_colourkey_list_text(ColourKeyList_None_state);
    //hide #new-search-dialog	
    $("#new-search-dialog").hide();
    $("#option-menu").hide();
    //clear channel_carousel
    $("#id_channel_carousel").html("");
    if ($("#installChannel-dialog child".length <= 0)) {
        $("#installChannel-dialog").html('<div class="modal-content">\
				<div class="modal-body">\
					<p id="HS_DLG_SEARCH_CH">' + getTranslate(option_menuData.HS_DLG_SEARCH_CH) + '</p>\
				</div>\
				<div class="modal-footer" style="margin-top:220px; border-top-width:0px!important;">\
					<button type="button" class="btn btn-select-style" id="btn-yes" data-dismiss="modal">' + getTranslate(option_menuData.btn_yes) + '</button>\
					<button type="button" class="btn btn-select-style" id="btn-no" >' + getTranslate(option_menuData.btn_no) + '</button>\
				</div>\
			</div>');
    } else {
        $("#HS_DLG_SEARCH_CH").html(getTranslate(option_menuData.HS_DLG_SEARCH_CH));
        $("#btn-yes").html(getTranslate(option_menuData.btn_yes));
        $("#btn-no").html(getTranslate(option_menuData.btn_no));
    }
    $("#installChannel-dialog").show();
    focus_level = 3;
    //focus at "Yes" button
    $('#btn-yes').addClass('btn-select-style-hover');
    $('#btn-no').removeClass('btn-select-style-hover').addClass('btn-select-style');
}
function Pin_code_state_layout() {
    if ($("#pin-code-dialog child").length <= 0) {
        $('#pin-code-dialog').html('<div class="modal-body">\
			    <p id="pin-code-title" align="left" style="font-size:20px;">Enter PIN code</p>\
		</div>\
		<div class="pin-code-input-text" id="pin-code-txtID" type="text" >\
			<ul	 id="pwd_input" style="padding-left: 30px; padding-top: 5px;">\
				<li id="pwd_0" class="pwd_none" value="0">*</li>\
				<li id="pwd_1" class="pwd_none" value="0">*</li>\
				<li id="pwd_2" class="pwd_none" value="0">*</li>\
				<li id="pwd_3" class="pwd_none" value="0">*</li>\
			</ul>\
		</div>\
		<div class="modal-body">\
			    <p id="pin-code-msg" align="center" style="font-size:16px;margin-top:15px">&nbsp;&nbsp</p>\
		</div>\
		<div id="pin-code-btn" class="pin-code-btn">\
			<button type="button" class="btn-select-style" id="btn-pin-code-yes" >' + getTranslate(option_channle_islock.btn_pin_code_yes) + '</button>\
			<button type="button" class="btn-select-style" id="btn-pin-code-no" >' + getTranslate(option_channle_islock.btn_pin_code_no) + '</button>\
		</div>')
    } else {
        $('#btn-pin-code-yes').html(getTranslate(option_channle_islock.btn_pin_code_yes));
        $('#btn-pin-code-no').html(getTranslate(option_channle_islock.btn_pin_code_no));
    }
    
    $("#pin-code-dialog").show();
    close_colourbar();
    $("#option-menu").hide();
    //focus at "Cancel" button
    $('#btn-pin-code-no').addClass('btn-select-style-hover');
    $('#btn-pin-code-yes').removeClass('btn-select-style-hover').addClass('btn-select-style');
    /* set PIN code title */
    /* default password need set new pin code by user */
    var str = null;
    if (is_default_password() == true) {
        str = getTranslate(option_channle_islock.QT_SET_PIN);
    } 
    else {
        str = getTranslate(option_channle_islock.pin_code_title);
    }
    
    set_pin_code_title(str);
}
function close_pin_code_dialog() {
    $("#pin-code-dialog").hide();
}
function set_pin_code_title(str) {
    $("#pin-code-title").html(str);
}
function set_pin_code_msg(msg) {
    $("#pin-code-msg").html(msg);
}
function set_guidance_text(str) {
    $("#guidance_text_content").html(str);
}

function close_guidance_text() {
    $("#guidance_text_content").hide();
}

function set_guidance_text(str) {
    $("#guidance_text_content").html(str);
}
function show_colourbar() {
    $("#colour_bar").show();
}
function close_colourbar() {
    $("#colour_bar").hide();
}

function show_tv_normal_items() {
    show_top_menu_bar();
    $("#sub_menu_bar").show();
    $("#colour_bar").show();
}
function show_channel_num_osd() {
    $("#channel-num").show();
}

function hide_channel_num_osd() {
    $("#channel-num").hide();
}
function get_dvbs_status() {
    return mtvObj.getDvbsSupportStatus();
}
function show_top_menu_bar() {
    
    if (get_dvbs_status()) {
        $("#top_menu_bar").show();
    } 
    else {
        $("#top_menu_bar").hide();
    }

}
function update_channel_num_osd(value) {
    /* first has no number */
    if ($("#num_0").hasClass("input_li")) {
        $("#num_0").html(value);
        $("#num_0").attr("class", "inputed_li");
    } 
    else if ($("#num_1").hasClass("input_li")) {
        $("#num_1").html(value);
        $("#num_1").attr("class", "inputed_li");
    } 
    else if ($("#num_2").hasClass("input_li")) {
        $("#num_2").html(value);
        $("#num_2").attr("class", "inputed_li");
    } 
    else {
        $("#num_3").html(value);
        $("#num_3").attr("class", "inputed_li");
    }
    
    return;
}
function reset_channel_num_osd_class() {
    
    $("#num_0").attr("class", "input_li");
    $("#num_0").html('');
    $("#num_1").attr("class", "input_li");
    $("#num_1").html('');
    $("#num_2").attr("class", "input_li");
    $("#num_2").html('');
    $("#num_3").attr("class", "input_li");
    $("#num_3").html('');
    return;
}
function get_channel_num_osd_value() {
    var val = null;
    /* first has no number */
    if ($("#num_0").hasClass("inputed_li")) {
        val = $("#num_0").html();
    }
    
    if ($("#num_1").hasClass("inputed_li")) {
        val = val + $("#num_1").html();
    }
    
    if ($("#num_2").hasClass("inputed_li")) {
        val = val + $("#num_2").html();
    }
    
    if ($("#num_3").hasClass("inputed_li")) {
        val = val + $("#num_3").html();
    }
    
    return parseInt(val);
}
function get_pin_code_value() {
    var val = null;
    /* first has no number */
    if ($("#pwd_0").hasClass("pwd_done")) {
        val = $("#pwd_0").attr("value");
    }
    
    if ($("#pwd_1").hasClass("pwd_done")) {
        val = val + $("#pwd_1").attr("value");
    }
    
    if ($("#pwd_2").hasClass("pwd_done")) {
        val = val + $("#pwd_2").attr("value");
    }
    
    if ($("#pwd_3").hasClass("pwd_done")) {
        val = val + $("#pwd_3").attr("value");
    }
    return val;
}
function update_pin_code_dialog(value) {
    /* first has no number */
    if ($("#pwd_0").hasClass("pwd_none")) {
        $("#pwd_0").attr("value", value);
        $("#pwd_0").attr("class", "pwd_done");
    } 
    else if ($("#pwd_1").hasClass("pwd_none")) {
        $("#pwd_1").attr("value", value);
        $("#pwd_1").attr("class", "pwd_done");
    } 
    else if ($("#pwd_2").hasClass("pwd_none")) {
        $("#pwd_2").attr("value", value);
        $("#pwd_2").attr("class", "pwd_done");
    } 
    else {
        $("#pwd_3").attr("value", value);
        $("#pwd_3").attr("class", "pwd_done");
    }
    
    return;
}


function mark_all_as_fav_dialog(mark) {
    var title, note;
    if (mark == "mark") {
        title = favoritedata.QT_FAV_MARK_ALL;
        note = favoritedata.QT_FAV_ADD_ALL;
    } else {
        title = favoritedata.QT_FAV_UNMARK_ALL;
        note = favoritedata.QT_FAV_REMOVE_ALL;
    }
    if (mark == "mark") {
        $("#mark_all_fav_title").html(getTranslate(favoritedata.QT_FAV_MARK_ALL));
        $("#mark_all_fav_note").html(getTranslate(favoritedata.QT_FAV_ADD_ALL));
    } else {
        $("#mark_all_fav_title").html(getTranslate(favoritedata.QT_FAV_UNMARK_ALL));
        $("#mark_all_fav_note").html(getTranslate(favoritedata.QT_FAV_REMOVE_ALL));
    }
    if ($("#mark-all-as-fav child").length <= 0) {
        $("#mark-all-as-fav").html('<div class="mark-all-content">\
			  <p id="mark_all_fav_title">' + getTranslate(title) + '</p>\
		    <div class="mark-all-body">\
			    <p id="mark_all_fav_note">' + getTranslate(note) + '</p>\
		    </div>\
		    <div class="mark_all_fav-footer" style="text-align: center;">\
			    <button type="button" class="mark-all-as-favbutton" id="mark_all_btn_yes">' + getTranslate(favoritedata.YES) + '</button>\
			    <button type="button" class="mark-all-as-favbutton" id="mark_all_btn_no" style="margin-left: 100px;">' + getTranslate(favoritedata.NO) + '</button>\
		    </div>\
		</div>');
    } else {
        $("#mark_all_fav_title").html(getTranslate(title));
        $("#mark_all_fav_note").html(getTranslate(note));
        $("#mark_all_btn_yes").html(getTranslate(favoritedata.YES));
        $("#mark_all_btn_no").html(getTranslate(favoritedata.NO));
    }
    $("#mark_all_btn_yes").attr("value", mark);
    $("#mark_all_btn_yes").addClass("mark-all-as-favbutton-style-hover");
    $("#mark_all_btn_no").removeClass('mark-all-as-favbutton-style-hover').addClass("btn-select-style");
    $("#colour_bar").hide();
    $("#mark-all-as-fav").show();
}

function reset_pin_code_osd_class() {
    
    $("#pwd_0").attr("class", "pwd_none");
    $("#pwd_0").attr("value", "0");
    $("#pwd_1").attr("class", "pwd_none");
    $("#pwd_1").attr("value", "0");
    $("#pwd_2").attr("class", "pwd_none");
    $("#pwd_2").attr("value", "0");
    $("#pwd_3").attr("class", "pwd_none");
    $("#pwd_3").attr("value", "0");
    /*clear PIN CODE dialog msg */
    set_pin_code_msg("");
    return;
}
function open_guidance_text() {
    $("#guidance_text_content").show();
}
function is_tkgs_enable() {
    var sat_brdcster = mtvObj.getBsBsSatelliteBrdcster();
    var stl_pref_status = mtvObj.getSatellitePreferredStatus();
    console.log("is_disable_rename/getSatellitePreferredStatus:" + mtvObj.getSatellitePreferredStatus());
    /* in Satellite mode */
    if (current_tuner_type == TunerType_list.TunerType_satellite) 
    {

        /* operator name is TKGS 
		 * && scan is satellite prefer
		 */
        if (sat_brdcster == DVBS_OPERATOR_NAME_TKGS 
        && stl_pref_status == 1) {
            return true;
        }
    
    }
    
    return false;
}
function is_m7_enable() {
    var sat_brdcster = mtvObj.getBsBsSatelliteBrdcster();
    var stl_pref_status = mtvObj.getSatellitePreferredStatus();
    console.log("is_m7_enable/getSatellitePreferredStatus:" + mtvObj.getSatellitePreferredStatus());
    /* in Satellite mode */
    if (current_tuner_type == TunerType_list.TunerType_satellite) 
    {

        /* scan is satellite prefer
		 * && operator name is M7
		 */
        if (stl_pref_status == 1 && 
        (sat_brdcster == DVBS_OPERATOR_NAME_AUSTRIASAT 
        || sat_brdcster == DVBS_OPERATOR_NAME_CANALDIGITAAL_HD 
        || sat_brdcster == DVBS_OPERATOR_NAME_CANALDIGITAAL_SD 
        || sat_brdcster == DVBS_OPERATOR_NAME_TV_VLAANDEREN_HD 
        || sat_brdcster == DVBS_OPERATOR_NAME_TV_VLAANDEREN_SD 
        || sat_brdcster == DVBS_OPERATOR_NAME_SYKLINK_CZ 
        || sat_brdcster == DVBS_OPERATOR_NAME_SYKLINK_SK 
        || sat_brdcster == DVBS_OPERATOR_NAME_TELESAT_BELGIUM 
        || sat_brdcster == DVBS_OPERATOR_NAME_TELESAT_LUXEMBOURG 
        || sat_brdcster == DVBS_OPERATOR_NAME_HELLO)) {
            
            return true;
        }
    
    }
    
    return false;
}
function is_tkgs_auto_operating_mode() {
    var tkgs_operat_mode = mtvObj.getDvbsTkgsOperatingMode();
    /*  
	 * operator mode is auto 
	 * 
	 */
    if (tkgs_operat_mode == TKGS_OPERATING_MODE_AUTO) {
        return true;
    }
    
    return false;
}
function is_disable_rename() {
    var dtv_tuner_type = mtvObj.getDtvTunerType();
    var current_country = mtvObj.getCurrentCountry();
    console.log("country:" + current_country + "dtv_tuner_type:" + dtv_tuner_type);
    /* in DTV mode */
    if (current_tuner_type == TunerType_list.TunerType_tv) 
    {
        /* country is Romania && in DVBC */
        if (current_country == COUNTRY_ROMANIA && dtv_tuner_type == 1) {
            return true;
        }
        /* country is Nederland && in DVBC */
        if (current_country == COUNTRY_NEDERLAND && dtv_tuner_type == 1) {
            return true;
        }

        /* country is Belgium && in DVBC */
        if (current_country == COUNTRY_BELGIUM && dtv_tuner_type == 1) {
            return true;
        }
    
    }
    /* get channel list type */
    var ch_list_type = parseInt(get_cur_ch_list_type());

    /* disable rename fct when tkgs is enable in ALL channel list */
    if (is_tkgs_enable() == true 
    && is_tkgs_auto_operating_mode() == true 
    && (ch_list_type == ChannelListTypeList.ChannelListType_tv_all || ch_list_type == ChannelListTypeList.ChannelListType_satellite_all)) {
        return true;
    }
    
    return false;
}
function is_disable_move_fct() {
    
    console.log("Enter is_disable_move_fct");
    
    var current_country = mtvObj.getCurrentCountry();
    /* country is UK */
    if (current_country == COUNTRY_UK) {
        return true;
    }

    /*	// disable move fct when tkgs is enable 
	if (is_tkgs_enable() == true && is_tkgs_auto_operating_mode() == true){
		return true;
	}
*/
    /* default move funtion is enable */
    return false;
}

function is_enable_swap_fct() {
    
    console.log("Enter is_enable_swap_fct");
    var current_country = mtvObj.getCurrentCountry();

    /* Swap: Country = Turkey & TKGS Installed & (Operating mode is not set to Automatic)
	* & in satellite All channel list.
	*/
    if (get_cur_ch_list_type() == ChannelListTypeList.ChannelListType_satellite_all 
    && current_country == COUNTRY_TURKEY 
    && is_tkgs_enable() == true 
    && is_tkgs_auto_operating_mode() == false) {
        return true;
    }

    /* default swap funtion is disable */
    return false;
}
function update_ui_data() {
    console.log("update_ui_data");
    /* if disable rename function, need hide rename color key. */
    if (is_disable_rename()) {
        ColourKeyList_TV_normal_Favorite_state.ColorKey_Red = "&nbsp;&nbsp;-";
        ColourKeyList_TV_normal_All_state.ColorKey_Red = "&nbsp;&nbsp;-";
        ColourKeyList_TV_normal_All_fav_state.ColorKey_Red = "&nbsp;&nbsp;-";
        ColourKeyList_TV_normal_All_not_fav_state.ColorKey_Red = "&nbsp;&nbsp;-";
    } 
    else {
        /* set red color bar to normal */
        var rename = "RENAME";
        ColourKeyList_TV_normal_Favorite_state.ColorKey_Red = rename;
        ColourKeyList_TV_normal_All_state.ColorKey_Red = rename;
        ColourKeyList_TV_normal_All_fav_state.ColorKey_Red = rename;
        ColourKeyList_TV_normal_All_not_fav_state.ColorKey_Red = rename;
    }

    /* if disable move function, need hide move color key. */
    if (is_disable_move_fct()) {
        ColourKeyList_TV_normal_Favorite_state.ColorKey_Green = "&nbsp;&nbsp;-";
    } else if(typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')){
    	ColourKeyList_TV_normal_Favorite_state.ColorKey_Green = "QT_FIND_CHANNEL";
    }
    else {
        //var move_name = mtvObj.getLangString("MAIN_FAV_CH_MOVE");
        ColourKeyList_TV_normal_Favorite_state.ColorKey_Green = "MAIN_FAV_CH_MOVE";
    }

    /* if enable Swap function, need replace green color key(find channel function). */
    if (is_enable_swap_fct()) {
        var swap = "MAIN_BUTTON_SWAP";
        ColourKeyList_TV_normal_All_state.ColorKey_Green = swap;
        ColourKeyList_TV_normal_All_fav_state.ColorKey_Green = swap;
        ColourKeyList_TV_normal_All_not_fav_state.ColorKey_Green = swap;
    } 
    else {
        /* set green color bar to normal */
        var find_channel = "QT_FIND_CHANNEL";
        ColourKeyList_TV_normal_All_state.ColorKey_Green = find_channel;
        ColourKeyList_TV_normal_All_fav_state.ColorKey_Green = find_channel;
        ColourKeyList_TV_normal_All_not_fav_state.ColorKey_Green = find_channel;
    }
    /* update svl id according to satellite prefer status */
    update_dvbs_svl_id();
}

function update_dvbs_svl_id() {
    var stl_pref_status = mtvObj.getSatellitePreferredStatus();
    console.log("update_dvbs_svl_id/getSatellitePreferredStatus:" + mtvObj.getSatellitePreferredStatus());
    /* update DVBS SVL_ID  */
    if (stl_pref_status == 0) {
        /* defined in base.js */
        BRDCST_DVBS = BRDCST_DVBS_GEN;
    } else {
        BRDCST_DVBS = BRDCST_DVBS_PREFER;
    }
}
function set_cd_pagination(str) {
    $('#cd-pagination').html("");
}

function sub_menu_bar_menu() {
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    var tv_new_channel_cnt = get_channel_count(ch.SVL_ID, MaskList.Mask_new, MaskValueList.MaskValue_new);
    var tv_radio_channel_cnt = get_channel_count(ch.SVL_ID, MaskList.Mask_radio, MaskValueList.MaskValue_radio);
    var temp = [{"name": mtvObj.getLangString("QT_FAVOURITES")}, {"name": mtvObj.getLangString("ALL")}];
    if (is_dvbs_channel(ch.SVL_ID)) {
        var tv_tv_channel_cnt = get_channel_count(ch.SVL_ID, MaskList.Mask_tv, MaskValueList.MaskValue_tv);
        if (tv_tv_channel_cnt != null && tv_tv_channel_cnt > 0) {
            temp.push({"name": mtvObj.getLangString("HS_WATCH_TV")});
        } else {
            temp.push({"name": "NULL"});
        }
        if (tv_radio_channel_cnt != null && tv_radio_channel_cnt > 0) {
            temp.push({"name": mtvObj.getLangString("FPL_OPTION_3")});
        } else {
            temp.push({"name": "NULL"});
        }
        if (tv_new_channel_cnt != null && tv_new_channel_cnt > 0) {
            temp.push({"name": mtvObj.getLangString("CHM_OPTL_FILTER_NEW_CHANNEL")});
        } else {
            temp.push({"name": "NULL"});
        }
        SatelliteSubMenuList = temp;
    } else {
        
        if (tv_radio_channel_cnt != null && tv_radio_channel_cnt > 0) {
            temp.push({"name": mtvObj.getLangString("FPL_OPTION_3")});
        } else {
            temp.push({"name": "NULL"});
        }
        if (tv_new_channel_cnt != null && tv_new_channel_cnt > 0) {
            temp.push({"name": mtvObj.getLangString("CHM_OPTL_FILTER_NEW_CHANNEL")});
        } else {
            temp.push({"name": "NULL"});
        }
        TVSubMenuList = temp;
    }


}