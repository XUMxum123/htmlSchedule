

function init_option_menu() {
    try {
        nameselect('');
    } catch (e) {
    // ignore
    }
}

function list_left_Init() {
    
    var item_num = 7;
    items = [];
    var active_card = $('#id_collapsible_channel').find(".item.active .card.channel.active");
    $('#common').attr("disable", 'true');
    for (var i = 0; i < item_num; i++) {
        var disable = 0;
        items = document.getElementById('list_left').getElementsByTagName('li');
        disable = $(items[i]).attr("disable");
        if (disable == "true") {
            items[i].style.color = "rgb(121,122,123)";
        }
    }
    /* Update Lock/Unlock item*/
    var channel_id = null;
    if (active_card.length > 0 && (channel_id = $(active_card[0]).attr("channel_id"))) {
        console.log(channel_id);
        
        try {
            svl_id = $(active_card[0]).attr("svl_id");
            ch_mask = $(active_card[0]).attr("channel_mask");
            var is_lock = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;
            
            console.log("channel id:" + channel_id + "svl_id:" + svl_id + "channel_mask:" + ch_mask + "is-lock:" + is_lock);
            if (is_lock) {
                //unlock
                /* set unlock */
                $("#list_left>ul>li[value='Lock channel']").attr("key", getTranslate(option_channle_islock.CHM_OPTL_UNLOCK_CHANNEL)).html(getTranslate(option_channle_islock.CHM_OPTL_UNLOCK_CHANNEL));
            } else {
                //lock
                /* set lock */
                $("#list_left>ul>li[value='Lock channel']").attr("key", getTranslate(option_channle_islock.CHM_OPTL_LOCK_CHANNEL)).html(getTranslate(option_channle_islock.CHM_OPTL_LOCK_CHANNEL));
            }
        
        } 
        catch (err) {
            console.log("error for set channel id!");
            console.log(err);
        }
    
    }
    
    itemSelect();
}
function itemSelect(idx) {
    items = document.getElementById('list_left').getElementsByTagName('li');
    selected = (selected + items.length) % items.length;
    if (items.length <= 0)
        return;
    var pos = $(items[selected]).offset();
    //move(document.getElementById("hlbar"), pos, function(p) {return p;}, 500);
    pos.left -= 3;
    pos.top += 4;
    $("#hlbar").offset({top: pos.top});
    $("#hlbar").offset({left: pos.left});
    var tempselect = selected;
    var nextselect, prvselect;
    if ((tempselect + 1) == items.length) {
        nextselect = 0;
        prvselect = selected - 1;
    } else if ((tempselect - 1) == -1) {
        nextselect = selected + 1;
        prvselect = items.length - 1;
    } else {
        nextselect = selected + 1;
        prvselect = selected - 1;
    }
    var next = $(items[nextselect]).attr("key");
    next = cutoffString(next);
    $(items[nextselect]).html(next);
    
    var prv = $(items[prvselect]).attr("key");
    prv = cutoffString(prv);
    $(items[prvselect]).html(prv);
    
    var optionkey = $(items[selected]).attr("key");
    if (optionkey.length > optionmenulength) {
        $(items[selected]).html(setoptionlist(optionkey));
    } else {
        $(items[selected]).html(optionkey);
    }
    $(items[selected]).focus();

}

function setoptionlist(channelname) {
    channelname = '<div style="width:90%;position:absolute;"><marquee width="100%" behavior="scroll" direction="left" scrolldelay="100" align="left"  onmouseover="start()" onfocus="stop()">' + channelname + '</marquee></div>';
    return channelname;
}
function cutoffString(str) {
    if (str) {
        str = str.length > optionmenulength ? (str.substr(0, optionmenulength - 3) + "...") : str;
    }
    
    return str;
}
function item_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
    focus_id = id;
    //focus id html content.
    var content = $("#" + id).attr("value");
    if (isfocus) {
        //have sub menu
        if (content == "Digital/analogue" || 
        content == "Free / scrambled" || 
        content == "Satellite" || 
        content == "Category") 
        {
            console.log(" show sub menu id:" + id);
            //$('#list_content_right').show();
            $("#option").animate({left: '243px'}, "slow");
            if ($('#list_content_right').css("display") == "none") 
            {
                $("#list_content_right").fadeIn("slow");
            }
            $("#list_content_right").parent().css("background", 'url(./res/OptionMenu/options_menu_R.png)')
            update_list_right(id);
        } 
        else {
            if ($('#list_content_right').attr("focus") == "true")
                return;
            if ($('#list_content_right').css("display") != "none") {
                $('#list_content_right').hide();
                $("#list_content_right").parent().css("background", '');
                if ($('#list_content_right').css("display") == "none") {
                    $("#option").animate({left: '416px'}, "slow");
                }
                console.log("parent().css(\"background\", '')");
                //$("#list_content_right").fadeOut(3000);
                return;
            }
        }
    
    } 
    else {
    
    }
}

function option_menu_page_reset() {
    if ($('#list_content_right').attr("focus") == "true") {
        $('#list_content_right').attr("focus", "false");
    }
}

var option_menu_timer = null;

function item_right_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
    
    if (isfocus) {
        
        if (null != option_menu_timer) {
            clearTimeout(option_menu_timer);
            option_menu_timer = null;
        }
        var items = document.getElementById('list_content_right').getElementsByTagName('li');
        var tempselect = selected_right;
        var nextselect, prvselect;
        if ((tempselect + 1) == items.length) {
            nextselect = 0;
            prvselect = selected_right - 1;
        } else if ((tempselect - 1) == -1) {
            nextselect = selected_right + 1;
            prvselect = items.length - 1;
        } else {
            nextselect = selected_right + 1;
            prvselect = selected_right - 1;
        }
        console.log("nextselect:prvselect:" + nextselect + "----" + prvselect + "//items.length/" + items.length);
        var next = $(items[nextselect]).attr("key");
        next = cutoffString(next);
        $(items[nextselect]).html(next);
        
        var prv = $(items[prvselect]).attr("key");
        prv = cutoffString(prv);
        $(items[prvselect]).html(prv);
        
        var optionkey = $(items[selected_right]).attr("key");
        if (optionkey.length > optionmenulength) {
            $(items[selected_right]).html(setoptionlist(optionkey));
        } else {
            $(items[selected_right]).html(optionkey);
        }



        /* delay 1s */
        option_menu_timer = setTimeout(function() {
            //			var items = document.getElementById('list_content_right').getElementsByTagName('li');
            var item_content = $(items[selected_right]).attr("value");
            handle_right_menu_item(item_content, false);
        }, 
        1000); /* delay 1s */
    } 
    else {
        /* close the delay timer */
        if (null != option_menu_timer) {
            clearTimeout(option_menu_timer);
            option_menu_timer = null;
        }
    }
}
function update_list_right(id) {
    var items = document.getElementById('list_content_right').getElementsByTagName('ul');
    var content = $("#" + id).attr("value");
    console.log("===item_right_focus======id:" + id);
    $(items).find("li").remove();
    console.log("content:" + content);
    
    if (id == "option_menu_0" 
    && content == "Digital/analogue") {
        $(items).append("<li id='subtitle_digital_and_analogue' tabindex='0' onfocus=item_right_focus(true,'subtitle_digital_and_analogue'); onblur=item_right_focus(false,'subtitle_digital_and_analogue'); value='Digital+Analogue';  key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FAV_ALL) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FAV_ALL)) + "</li>\
                         <li id='subtitle_digital' tabindex='0' onfocus=item_right_focus(true,'subtitle_digital');  onblur=item_right_focus(false,'subtitle_digital'); value='Digital TV channels'; key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FILTER_DIGITAL) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FILTER_DIGITAL)) + "</li> \
                         <li id='subtitle_analogue' tabindex='0' onfocus=item_right_focus(true,'subtitle_analogue');  onblur=item_right_focus(false,'subtitle_analogue'); value='Analogue TV channels'; key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FILTER_ANALOG) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FILTER_ANALOG)) + "</li>");
    }
    
    if (id == "option_menu_0" 
    && content == "Satellite") 
    {
        var ch = mtvObj.getCurrentChannelInfoForEachTuner();
        var satlNum = mtvObj.getSatlRecNum(ch.SVL_ID);
        var satlRec;
        var satlName = TVSubMenuList[1].name; /* All */
        var satlId;
        var satlRecId;
        
        $(items).append("<li id='All' tabindex='0' onfocus=item_right_focus(true,'All');  onblur=item_right_focus(false,'All'); value='" + satlName + "'; key='" + satlName + "'>" + cutoffString(satlName) + "</li>");
        
        for (var i = 0; i < satlNum; i++) 
        {
            satlRec = mtvObj.getSatlRecByIdx(ch.SVL_ID, i);
            satlName = satlRec.SATL_NAME;
            satlId = satlRec.SATL_ID;
            satlRecId = satlRec.SATL_REC_ID;
            
            if (satlName == "") 
            {
                continue;
            }
            
            $(items).append("<li id='" + satlName + "' tabindex='0' onfocus=item_right_focus(true,'" + satlName + "');  onblur=item_right_focus(false,'" + satlName + "'); satlId='" + satlId + "'; satlRecId='" + satlRecId + "'; value='" + satlName + "'; key='" + satlName + "'>" + cutoffString(satlName) + "</li>");
        
        }
    }
    
    if (id == "option_menu_1" 
    && content == "Free / scrambled") 
    {
        $(items).append("<li id='subtitle_free_and_scrambled' tabindex='0' onfocus=item_right_focus(true,'subtitle_free_and_scrambled');  onblur=item_right_focus(false,'subtitle_free_and_scrambled'); value='Free+Scrambled'; key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FAV_FREE_SCRAMBLE) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FAV_FREE_SCRAMBLE)) + "</li>\
                         <li id='subtitle_free' tabindex='0' onfocus=item_right_focus(true,'subtitle_free');  onblur=item_right_focus(false,'subtitle_free'); value='Free channels'; key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FAV_FREE_ONLY) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FAV_FREE_ONLY)) + "</li> \
                         <li id='subtitle_scrambled' tabindex='0' onfocus=item_right_focus(true,'subtitle_scrambled');  onblur=item_right_focus(false,'subtitle_scrambled'); value='Scrambled channels'; key='" + getTranslate(option_channel_sec_list.CHM_OPTL_FAV_SCRAMBLE) + "'>" + cutoffString(getTranslate(option_channel_sec_list.CHM_OPTL_FAV_SCRAMBLE)) + "</li>");
    
    }
    
    if (id == "option_menu_2" 
    && content == "Category") 
    {
        var tkgsList = mtvObj.getDvbsTkgsCategoryList(4, 0, 11);
        var categoryName = TVSubMenuList[1].name; /* All */
        var categoryNo;
        var categoryMask;
        /* append All item */
        $(items).append("<li id='category_all' tabindex='0' onfocus=item_right_focus(true,'category_all');  onblur=item_right_focus(false,'category_all'); categoryMask='0'; value='category_all'; key='" + categoryName + "'>" + cutoffString(categoryName) + "</li>");
        
        for (var i = 0; i < tkgsList.ITEMS.length; i++) 
        {
            categoryName = tkgsList.ITEMS[i].CATEGORY_NAME;
            categoryNo = tkgsList.ITEMS[i].CATEGORY_NO;
            categoryMask = 1 << categoryNo;
            $(items).append("<li id='" + categoryName + "' tabindex='0' onfocus=item_right_focus(true,'" + categoryName + "');  onblur=item_right_focus(false,'" + categoryName + "'); categoryNo='" + categoryNo + "'; categoryMask='" + categoryMask + "'; value='" + categoryName + "'; key='" + categoryName + "'>" + cutoffString(categoryName) + "</li>");
        }
    }
    /* add selected style */
    add_selected_style(id);
}

function add_selected_style(id) {
    /* default value */
    selected_right = 0;
    /* get channel filer type */
    var ch_filter_type = parseInt(get_channel_filter_type());
    switch (ch_filter_type) {
        case CUST_CH_FILTER_TYPE_ALL:
            selected_right = 0;
            break;
        case CUST_CH_FILTER_TYPE_DIGITAL:
            if (id == "option_menu_0") {
                selected_right = 1;
            }
            break;
        case CUST_CH_FILTER_TYPE_ANALOG:
            if (id == "option_menu_0") {
                selected_right = 2;
            }
            break;
        case CUST_CH_FILTER_TYPE_FREE_SCRAMBLE:
            /* free + scrambled is same as all */
            selected_right = 0;
            break;
        case CUST_CH_FILTER_TYPE_FREE_ONLY:
            if (id == "option_menu_1") {
                selected_right = 1;
            }
            break;
        case CUST_CH_FILTER_TYPE_SCRAMBLE:
            if (id == "option_menu_1") {
                selected_right = 2;
            }
            break;
        default:
            selected_right = 0;
            break;
    }
    console.log("add_selected_style/selected_right:" + selected_right);
    
    var items = document.getElementById('list_content_right').getElementsByTagName('li');
    if (items.length <= 0)
        return;
    selected_right = (selected_right + items.length) % items.length;
    $(items[selected_right]).addClass("selected");
}
function itemSelect_right(idx) {
    console.log("-------------selected_right:" + selected_right)
    var items = document.getElementById('list_content_right').getElementsByTagName('li');
    if (items.length <= 0)
        return;
    selected_right = (selected_right + items.length) % items.length;
    var pos = $(items[selected_right]).offset();
    move(document.getElementById("hlbar"), pos, function(p) {
        return p;
    }, 200);
    // $("#hlbar").offset({top:$(items[selected]).offset().top});
    /* remove selected class */
    $("#list_content_right").find(".selected").attr("class", "");
    $(items[selected_right]).focus();
}
function setInstr(txt) {
    document.getElementById('instr').innerHTML = txt;
}

function animate(opts) {
    var start = new Date;
    var id = setInterval(function() {
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration;
        
        if (progress > 1)
            progress = 1;
        
        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1) {
            clearInterval(id);
        }
    }, opts.delay || 10);
}

function move(element, pos, delta, duration) {
    var org = $(element).offset();
    pos.left -= 6;
    pos.top += 3;
    animate({
        delay: 10,
        duration: duration || 1000, // 1 sec by default
        delta: delta,
        step: function(delta) {
            // element.style.left = org.x+(pos.x-org.x)*delta + "px";
            // element.style.top  = org.y+(pos.y-org.y)*delta + "px";
            $(element).offset({left: org.left + (pos.left - org.left) * delta,
                top: org.top + (pos.top - org.top) * delta});
        }
    });
}

function handle_right_menu_item(item_content, is_save, satlId, satlRecId, categoryMask) {
    
    var nw_mask = MaskList.Mask_all;
    var mask_value = MaskValueList.MaskValue_all;

    //submenu_selected_id
    switch (submenu_selected_id) {
        case "tv_submenu_bar_0":
        case "satellite_submenu_bar_0":
            {
                break;
            }
        case "tv_submenu_bar_1":
        case "satellite_submenu_bar_1":
            {
                nw_mask = nw_mask | MaskList.Mask_all;
                mask_value = mask_value | MaskValueList.MaskValue_all;
                break;
            }
        case "tv_submenu_bar_2":
        case "satellite_submenu_bar_3":
            {
                nw_mask = nw_mask | MaskList.Mask_radio;
                mask_value = mask_value | MaskValueList.MaskValue_radio;
                break;
            }
        case "satellite_submenu_bar_2":
            {
                nw_mask = nw_mask | MaskList.Mask_tv;
                mask_value = mask_value | MaskValueList.MaskValue_tv;
                break;
            }
        default:
            break;
    }
    var ch_filter_type = parseInt(get_channel_filter_type());
    switch (item_content) {
        case "Digital+Analogue":
            {
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_ALL);
                //	}
                break;
            }
        case "Digital TV channels":
            {
                nw_mask = nw_mask | MaskList.Mask_digital;
                mask_value = mask_value | MaskValueList.MaskValue_digital;
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_DIGITAL);
                //	}
                break;
            }
        case "Analogue TV channels":
            {
                nw_mask = nw_mask | MaskList.Mask_analog;
                mask_value = mask_value | MaskValueList.MaskValue_analog;
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_ANALOG);
                //	}
                break;
            }
        case "Free+Scrambled":
            {
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_FREE_SCRAMBLE);
                //	}
                break;
            }
        case "Free channels":
            {
                nw_mask = nw_mask | MaskList.Mask_free;
                mask_value = mask_value | MaskValueList.MaskValue_free;
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_FREE_ONLY);
                //	}
                break;
            }
        case "Scrambled channels":
            {
                nw_mask = nw_mask | MaskList.Mask_scrambled;
                mask_value = mask_value | MaskValueList.MaskValue_scrambled;
                //	if (true == is_save){
                /* set channel filter type */
                set_channel_filter_type(CUST_CH_FILTER_TYPE_SCRAMBLE);
                //	}
                break;
            }
        default:
            //	if (true == is_save){
            /* set channel filter type */
            set_channel_filter_type(CUST_CH_FILTER_TYPE_ALL);
            //	}
            break;
    }
    
    var ch = mtvObj.getCurrentChannelInfoForEachTuner();
    
    console.log("svl_id" + ch.SVL_ID + "nw_mask" + nw_mask + "mask_value" + mask_value);
    
    g_channel_cnt = get_channel_count(ch.SVL_ID, nw_mask, mask_value, satlId, satlRecId, categoryMask);

    //clear all card items
    $("#id_channel_carousel").html("");
    
    
    if (g_channel_cnt <= 0) {
        g_channel_page_idx = 0;
        setCd_pagination();
        return;
    }
    
    if (satlId == undefined && 
    categoryMask == undefined) 
    {
        //last channel idx, normal case
        var idx = g_channel_cnt - 1;
        var ch_info = get_channel_info_by_idx(ch.SVL_ID, nw_mask, mask_value, idx);
        
        console.log("handle_right_menu_item,ch.SVL_ID:" + ch_info.ITEMS[0].SVL_ID + ",ch.CHANNEL_ID:" + ch_info.ITEMS[0].CHANNEL_ID + "");
        carousel_add_channel_items(ModeList.Mode_default, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT));
    } 
    else 
    {
        //last channel info
        var ch_info = getChannelInfoEx(ch.SVL_ID, ch.CHANNEL_ID, nw_mask, mask_value, CHLST_ITERATE_DIR_FROM_LAST, categoryMask, satlId, satlRecId);
        
        console.log("handle_right_menu_item,ch.SVL_ID:" + ch_info.ITEMS[0].SVL_ID + ",ch.CHANNEL_ID:" + ch_info.ITEMS[0].CHANNEL_ID + "");
        carousel_add_channel_items(ModeList.Mode_default, ch_info.ITEMS[0].SVL_ID, ch_info.ITEMS[0].CHANNEL_ID, DirectionList.Direction_next, Math.min(g_channel_cnt, CAROUSEL_ITEM_CNT), 0, 0, satlId, satlRecId, categoryMask);
    
    }
    if (false == is_save) {
        set_channel_filter_type(ch_filter_type);
    }
    g_channel_page_idx = 0;
    setCd_pagination();
}
function getChannelInfoEx(svl_id, ch_id, nw_mask, mask_value, dir, ctgry_mask, satl_id, satl_rec_id) {
    return mtvObj.getChannelInfoEx(svl_id, ch_id, nw_mask, mask_value, dir, ctgry_mask, satl_id, satl_rec_id);
}

function set_channel_list_to_cards(svl_id, ch_id, mask, mask_value, dir, num) {
    var channel_list = [];
    var chBegin = 0;
    $.each(mtvObj.getChannelListEx(svl_id, ch_id, mask, mask_value, dir, num), function(k, item) {
        channel_list[chBegin + k] = item;
    });
    set_channel_carousel($("#id_channel_carousel"), 
    /* CAROUSEL_ITEM_CNT+1 will make sure the carousel show scrollbar */
    channel_list.slice(chBegin, chBegin + CAROUSEL_ITEM_CNT), 
    1);
}

function right_handleKeyCode(kc) {
    //get right items
    var items = document.getElementById('list_content_right').getElementsByTagName('li');
    if (kc == KeyEvent.DOM_VK_UP) {
        selected_right--;
    } else if (kc == KeyEvent.DOM_VK_DOWN) {
        selected_right++;
    } else if (kc == KeyEvent.DOM_VK_RETURN) {
        item_content = $(items[selected_right]).attr("value");
        satlId = $(items[selected_right]).attr("satlId");
        satlRecId = $(items[selected_right]).attr("satlRecId");
        categoryMask = $(items[selected_right]).attr("categoryMask");
        handle_right_menu_item(item_content, true, satlId, satlRecId, categoryMask);
        /* close option menu */
        close_option_menu();
        return false;
    } else if (kc == KeyEvent.DOM_VK_LEFT || 
    kc == KeyEvent.DOM_VK_RIGHT) {
        $('#list_content_right').attr("focus", "false");
        var pos = $("#hlbar").offset();
        $('#hlbar_selected').show();
        pos.left -= 3;
        pos.top += 4;
        $("#hlbar_selected").offset({top: pos.top});
        $("#hlbar_selected").offset({left: pos.left});
        itemSelect(selected);
        $('#hlbar_selected').hide();
        return true;
    } else if (kc == KeyEvent.DOM_VK_BACK || 
    kc == KeyEvent.DOM_VK_OPTION) {
        //exit option menu
        option_menu_page_reset();
        close_option_menu();
        return false;
    }
    itemSelect_right(selected_right);
    return true;
}
function close_option_menu() {
    /* close timer */
    if (null != option_menu_timer) {
        clearTimeout(option_menu_timer);
        option_menu_timer = null;
    }
    setMemc_level(true);
    /* hide option menu */
    $("#option-menu").hide();
    $('#hlbar_selected').hide();
    /* reset focus */
    $('#list_content_right').attr("focus", "false");
    /* back to last active channel mode */
    
    if (g_channel_cnt == 0) {
        
        back_to_last_active_mode();
        reset_submenu_focus();
    } 
    else {
        back_to_last_active_mode();
        var active_card = $("#id_channel_carousel").find(".item.active .card.channel.active");
        if (active_card.length > 0) {
            active_card.attr("class", "card channel");
        }
        var item_cards = $("#id_channel_carousel").find(".item.active .card.channel");
        if (item_cards.length > 0) {
            $(item_cards[0]).attr("class", "card channel active");
        }
        /* reset colour bar */
        reset_colourbar();
    }

    /*reset*/
    selected = 0;
    selected_right = 0;

}
function nameselect(snam) {
    if (!snam)
        return;
    for (var i = 0; i < opts.length; i++) {
        var check = opts[i].getAttribute('name');
        if (check == snam) {
            itemSelect(i);
            break;
        }
    }
}
function handleKeyCode(kc) {
    if (kc == KeyEvent.DOM_VK_UP) {
        var i = 0;
        var items = document.getElementById('list_left').getElementsByTagName('li');
        selected--;
        for (i = selected; i >= 0; i--) {
            if ($(items[selected]).attr("disable") == "true") {
                selected--;
            }
        }
    } else if (kc == KeyEvent.DOM_VK_DOWN) {
        var i = 0;
        var items = document.getElementById('list_left').getElementsByTagName('li');
        selected++;
        for (i = selected; i < items.length; i++) {
            if ($(items[selected]).attr("disable") == "true") {
                selected++;
            }
        }
    } else if (kc == KeyEvent.DOM_VK_LEFT || 
    kc == KeyEvent.DOM_VK_RIGHT || 
    kc == KeyEvent.DOM_VK_RETURN) {
        if ($('#list_content_right').css("display") != "none") {
            var pos = $("#hlbar").offset();
            $('#hlbar_selected').show();
            pos.left -= 3;
            pos.top += 4;
            $("#hlbar_selected").offset({top: pos.top});
            $("#hlbar_selected").offset({left: pos.left});
            $('#list_content_right').attr("focus", "true");
            //selected_right= 0;
            itemSelect_right(selected_right); //向右键							
            /*show selected highlight bar*/
            return true;
        } 
        else {
            var items = document.getElementById('list_left').getElementsByTagName('li');
            var item_content = $(items[selected]).attr("value");
            if ('Lock channel' == item_content 
            || 'Unlock channel' == item_content) {
                if (correct_pin_code == false) {
                    /* confirm pin code fail, need input again */
                    Pin_code_state_layout();
                    set_active_mode(ModeList.Mode_Enter_pin_code);
                    return;
                }
                /* lock or unlock channel */
                lock_unlock_channel();
            
            }  //if
            else if ('Unmark all as favourites' == item_content) {
                //exit option menu
                option_menu_page_reset();
                close_option_menu();
                mark_all_as_fav_dialog("unmark");
                set_active_mode(ModeList.Mode_favorite_mark_all);
            }
        }
    
    } else if (kc == KeyEvent.DOM_VK_BACK || 
    kc == KeyEvent.DOM_VK_OPTION) {
        //exit option menu
        option_menu_page_reset();
        close_option_menu();
        return false;
    }
    itemSelect(selected);
    return true;
}

/*
* set option-menu left sub menu item info.
*/
function setLeftSubMenuInfo(target, subList) {
    target.html("");
    var targetId = 'option_menu_';
    for (var index in subList) {
        var id = 'option_menu_' + index;
        //$(items).append("<li id='option_menu_3' tabindex='0' onfocus=item_focus(true,'option_menu_3'); key='4' disable='none' value='' ></li>");
        var str = subList[index].dup_lang;
        var content = $('<li id="' + id + '" tabindex = "0" onfocus=\'item_focus(true, "' + id + '");\' key="' + str + '" disable="none" value="' + subList[index].value + '" > ' + cutoffString(str) + '</li>');
        content.appendTo(target);
    }

}
/*
*  ****************************************
*  Option menu left sub menu list introduction.
*  ****************************************
*/
var OptionMenuLeftSubMenuList_New = [{"value": "Lock channel","dup_lang": getTranslate(option_channle_islock.CHM_OPTL_LOCK_CHANNEL)}];
var OptionMenuLeftSubMenuList_FAV = [{"value": "Add/Remove favourites","dup_lang": getTranslate(favoritedata.QT_FAV_ADD_REMOVE)},  //need replace by dup_lang
    {"value": "Find channel","dup_lang": getTranslate(option_menuData.option_menu_cha)}, 
    {"value": "Lock channel","dup_lang": getTranslate(option_menuData.option_menu_lock)}];
var OptionMenuLeftSubMenuList_EDIT_FAV = [{"value": "Unmark all as favourites","dup_lang": getTranslate(favoritedata.QT_FAV_UNMARK_ALL)}]; //need replace by dup_lang									 
var OptionMenuLeftSubMenuList_TV = [{"value": "Digital/analogue","dup_lang": getTranslate(option_menuData.option_menu_all_fav)}, 
    {"value": "Free / scrambled","dup_lang": getTranslate(option_menuData.option_menu_all_find)}, 
    {"value": "Lock channel","dup_lang": getTranslate(option_menuData.option_menu_all_lock)}];
var OptionMenuLeftSubMenuList_SAT = [{"value": "Satellite","dup_lang": getTranslate(tv_Satellite.top_menu_info_sa)}, 
    {"value": "Free / scrambled","dup_lang": getTranslate(option_menuData.option_menu_all_find)}, 
    {"value": "Lock channel","dup_lang": getTranslate(option_menuData.option_menu_all_lock)}];
var OptionMenuLeftSubMenuList_SAT_M7 = [{"value": "Satellite","dup_lang": getTranslate(tv_Satellite.top_menu_info_sa)}, 
    {"value": "Lock channel","dup_lang": getTranslate(option_menuData.option_menu_all_lock)}];
var OptionMenuLeftSubMenuList_SAT_TKGS = [{"value": "Satellite","dup_lang": getTranslate(tv_Satellite.top_menu_info_sa)}, 
    {"value": "Free / scrambled","dup_lang": getTranslate(option_menuData.option_menu_all_find)}, 
    {"value": "Category","dup_lang": getTranslate(favoritedata.MAIN_CATEGORY)},  //need replace by dup_lang
    {"value": "Lock channel","dup_lang": getTranslate(option_menuData.option_menu_all_lock)}];