function add_fav_icon() {
    
    var icon_favorite = "./res/ChannelList/Icon_Favorite_Small.png";
    its = target.find(".item");
    if (its.length > 0)
        $(its[0]).addClass("favorite_icon");
}
;

function set_favorite_ch_id(svl_id, ch_id, ch_mask, fav_idx) {
    console.log("set_favorite_ch_id id:" + ch_id);
    
    if (get_is_favorite_ch_by_mask(ch_mask)) 
    {
        /* the id is at favlsit, delete it */
        delete_favorite_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask, fav_idx);
    } 
    else 
    {
        set_favorite_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask, fav_idx);
    }
    /* store to acfg */
    store_channel_list_to_acfg();
    return;
}
;


function get_favorite_list() {
    
    var fav_count = mtvObj.getFavoriteChannelCount();
    console.log("getFavoriteChannelCount:" + fav_count);
    if (fav_count <= 0) {
        return null;
    }
    
    res = mtvObj.getCurrentChannelInfoEx();
    ch = res;
    console.log("get_favorite_list,ch.SVL_ID:" + ch.SVL_ID + ",ch.CHANNEL_ID:" + ch.CHANNEL_ID + "");
    $.each(mtvObj.getFavoriteChannelList(ch.SVL_ID, ch.CHANNEL_ID, DirectionList.Direction_next, fav_count), function(k, item) {
        g_favorite_channel_list[k] = item;
    });
    //carousel_add_channel_items(ModeList.Mode_TV_normal_favorite, ch.SVL_ID, ch.CHANNEL_ID, DirectionList.Direction_next, fav_count);
    return g_favorite_channel_list;
}
;


function set_favorite_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask, fav_idx) {
    console.log("set_favorite..(svl_id:" + svl_id + ",ch_id:" + ch_id + ",ch_mask:" + ch_mask + ")");
    if (0) {
        /* add favorite should remove new flag. */
        ch_mask = (ch_mask | SB_VENT_FAVORITE) & (~SB_VENT_NEW_SERVICE);
        
        set_channel_info(svl_id, ch_id, ch_mask);
    } 
    else {
        /* add favorite should remove NEW channel flag. */
        ch_mask = (ch_mask & (~SB_VENT_NEW_SERVICE));
        set_channel_info(svl_id, ch_id, ch_mask);
        /* add to favorite list */
        mtvObj.chFavListAddItem(svl_id, ch_id, fav_idx);
    }

}
;

function delete_favorite_channel_by_svl_and_ch_id(svl_id, ch_id, ch_mask, fav_idx) {
    if (0) {
        ch_mask = ch_mask & (~SB_VENT_FAVORITE);
        set_channel_info(svl_id, ch_id, ch_mask);
    } else {
        mtvObj.chFavListDelItem(svl_id, ch_id, fav_idx);
    }

}
;
function get_is_favorite_ch_by_id(id) {
    
    return (get_storage_item_by_id(id));
}
;

function set_storage_item_by_id(id, ChObj) {

    //get channel info
    console.log("channel_info:" + id);
    /* set the id of storage */
    localStorage.setItem(id, JSON.stringify(ChObj));
}
;

function get_storage_item_by_id(id) {
    /* get the id of storage */
    return (localStorage.getItem(id));
}
;

function delete_storage_item_by_id(id) {
    /* delete the id of storage */
    return (localStorage.removeItem(id));
}
;

function clear_storage_item() {
    /* clear storage */
    return (localStorage.clear());
}
;
var set_favorite_channel_carousel = function(target, list) {
    var item = null;
    var count = 0;
    target.html(""); /* clean all items */
    console.log("set_favorite_channel_carousel:");
    $.each(list, function(k, ch) {
        if (null == item)
            item = $('<div class="item" />');
        /* if there is no icon then use default icon. */
        var logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
        var icon = '<div class="card-image">' + (logo ? '<img src="' + logo + '" />' : '') + '</div>';
        
        var icon_favorite = "./res/ChannelList/Icon_Favorite_Small.png";
        console.log("get_is_favorite_ch_by_mask:" + get_is_favorite_ch_by_mask(ch.NW_MASK));
        if (get_is_favorite_ch_by_mask(ch.NW_MASK)) {
            /* set current channel to favorite */
            console.log("ch:" + ch.SERVICE_NAME);
            var card = $('<div class="card channel" align="center" svl_id="' + ch.SVL_ID + '" channel_id="' + ch.CHANNEL_ID + '" channel_num="' + ch.MAJOR_NUM + '" channel_name="' + ch.SERVICE_NAME + '" channel_mask="' + ch.NW_MASK + '" >\
			<div class="card-favorite-icon" style="display:block"><img src="' + icon_favorite + '" /></div>\
			<div class="card-content" align="left"><span>' + ch.MAJOR_NUM + '</span></div>\
			' + icon + '\
			<div class="card-content"><span>' + ch.SERVICE_NAME + '</span></div>\
			</div>');
            
            var ci = $('<div class="col-md-3 col-sm-6" style="height:122px;"></div>');
            card.appendTo(ci);
            ci.appendTo(item);
            count++;
            if (item && (0 == (count % 10))) {
                item.appendTo(target);
                item = null;
            }
        
        }
    
    });
    
    console.log("set_favorite_channel_carousel:count:" + count);
    
    if (null != item)
        item.appendTo(target);
    its = target.find(".item");
    if (its.length > 0)
        $(its[0]).addClass("active");
};
function add_fav_list(item) {
    console.log("item :" + item);
    FavoritesList.push(item);

}
;
/*
*Judgment is favorite channel or not
*/
function is_favorite_channel(obj) {
    //if is favorite channel
    if (obj.find("#favorite-show-hide").hasClass("display")) {
        return true;
    } else {
        return false;
    }

}
;

//for move mode
var selected_channel_div; //selected channel div
var selected_channel_original_position; //selected channel position
var selected_channel_page_idx; //selected channel page idx
var moving_index; //will move to channel index
var selected_channel_index; //selected channel index
var moving_channel_div; //moving(target) channel div
var last_channel_div; //save last channel div
/**
 before move
 */
function removeCloneDiv() {
    if (selected_channel_div != null) {
        $(selected_channel_div).remove();
    }
}
function before_move(index) {
    console.log("before move index:" + index);
    //set slected channel div
    removeCloneDiv();
    selected_channel_page_idx = g_channel_page_idx;
    
    selected_channel_div = $(".item .col-md-3").eq(index).clone();
    selected_channel_original_position = $(".item .col-md-3").eq(index).offset(); //get position of target div
    //hide orignal card
    hidden_selected_postion_channel(index);
    
    $("#id_channel_carousel>div").append(selected_channel_div);
    selected_channel_div.offset({left: selected_channel_original_position.left,top: selected_channel_original_position.top});
    //selected_channel_div.show();
    //change current card class
    //$(".item .col-md-3").eq(index).find(".card.channel").addClass("before-move");
    selected_channel_div.find(".card.channel").addClass("before-move");
    //hide current card Channel name/channel NUM/...
    //$(".item .col-md-3").eq(index).find(".card.channel").find(".card-content").hide();
    selected_channel_div.find(".card.channel").find(".card-content").hide();
    //$(".item .col-md-3").eq(index).find(".card.channel").find(".card-favorite-icon").hide();
    selected_channel_div.find(".card.channel").find(".card-favorite-icon").hide();
    
    selected_channel_index = index; //save the orignal position of div
    //reset moving index
    moving_index = index;
}
;

function hidden_selected_postion_channel(select_idx) {
    //hide selected card
    $(".item .col-md-3").eq(select_idx).css("visibility", "hidden");
}

function show_selected_postion_channel(select_idx) {
    //hide selected card
    $(".item .col-md-3").eq(select_idx).css("visibility", "visible");
}
/**
 Moving channel
 @parameter index : target of moving position
 @parameter move_div: target of moving div
 */
function moving_channel(index) {
    //set will move to channel index
    moving_index = index;
    var new_position;
    var x_position;
    var y_position;
    
    if ((index == selected_channel_index) && (selected_channel_page_idx == g_channel_page_idx)) {
        //back to orignal position
        x_position = selected_channel_original_position.left;
        y_position = selected_channel_original_position.top;
    } else {
        //new position
        //compute position
        /* insert last channel position + 1 */
        if (is_last_last_channel_card_positon(index)) {
            /* last last channel in first channel of first row */
            if (index == 0) {
                moving_channel_div = last_channel_div;
                /* first channel position */
                x_position = 88;
                y_position = 304;
            } else if (index == 5) {
                /* first channel position of second row. */
                x_position = 88;
                y_position = 462;
            } 
            else {
                moving_channel_div = $(".item .col-md-3").eq(index - 1);
                new_position = $(".item .col-md-3").eq(index - 1).offset(); //get position of target div
                x_position = new_position.left + 230;
                y_position = new_position.top + 5;
            }
        
        } 
        else {
            moving_channel_div = $(".item .col-md-3").eq(index);
            new_position = $(".item .col-md-3").eq(index).offset(); //get position of target div
            if (undefined != new_position) {
                x_position = new_position.left - 20;
                y_position = new_position.top - 20;
            } 
            else {
                /* first channel position */
                x_position = 88;
                y_position = 304;
            }
        
        }
    }
    
    console.log("selected_channel_index:" + selected_channel_index);
    console.log("moving_channel_index:" + index);

    //change selected channel position
    $(selected_channel_div).offset({left: x_position,top: y_position});

}
;
/* index is last position + 1 ? */
function is_last_last_channel_card_positon(index) {
    if (g_channel_page_idx == parseInt(g_channel_cnt / CAROUSEL_ITEM_CNT) 
    && (g_channel_cnt % CAROUSEL_ITEM_CNT) == (index)) {
        /* last page */
        /* index is last position + 1 */
        return true;
    } 
    else {
        return false;
    }
}
/**
 after move, change position and div css
 */
function after_move() {
    var svl_id = $(moving_channel_div).find(".card.channel").attr("svl_id");
    var idx_from = $(selected_channel_div).find(".card.channel").attr("channel_idx");
    var idx_to = $(moving_channel_div).find(".card.channel").attr("channel_idx");
    
    console.log("selected_channel_div:" + selected_channel_div);
    //restore style
    selected_channel_div.css({"top": "auto","left": "auto"});
    selected_channel_div.find(".card-content").show();
    selected_channel_div.find(".card-favorite-icon").show();
    $(".item .col-md-3").find(".before-move").removeClass("before-move");
    //insert slected channel to new position
    console.log("---------moving_index:" + moving_index)
    
    if (idx_from == idx_to || 
    (moving_index == selected_channel_index && selected_channel_page_idx == g_channel_page_idx) || 
    idx_to == undefined) {
        //remove clone channel card
        removeCloneDiv();
        //show channel
        show_selected_postion_channel(selected_channel_index);
        return;
    }
    
    if (selected_channel_page_idx == g_channel_page_idx) {
        //hide selected card
        $(".item .col-md-3").eq(selected_channel_index).remove();
    }

    /* last last position case */
    if (is_last_last_channel_card_positon(moving_index)) {
        if (0 == moving_index) {
            /* insert after to last channel card postion */
            selected_channel_div.insertAfter(moving_channel_div);
            /* channel page idx need --, due to correct update channel after move channel*/
            g_channel_page_idx--;
        } else {
            /* insert after to last channel card postion */
            selected_channel_div.insertAfter($(".item .col-md-3").eq(moving_index - 1));
        }

        /*  insert to last postion channel index rewrite to last index + 1 */
        //$(moving_channel_div).find(".card.channel").attr("channel_idx", g_channel_cnt);
        idx_to = g_channel_cnt;
    } 
    /* not last last position case */
    else {
        /* in selected channel page && selected_channel_index < moving_index */
        if (selected_channel_index < moving_index && 
        selected_channel_page_idx == g_channel_page_idx) {
            selected_channel_div.insertBefore($(".item .col-md-3").eq(moving_index - 1));
        } 
        else {
            selected_channel_div.insertBefore($(".item .col-md-3").eq(moving_index));
        }

        //remove active card
        $('#id_collapsible_channel').find(".item .card.channel").attr("class", "card channel");
        //set selected channel to active
        $(selected_channel_div).find(".card.channel").attr("class", "card channel active");
    }

    //switch_channel_by_channel_id(svl_id, ch_from, ch_to, FAVORITE_TYPE_0);
    insert_channel_by_ch_idx(svl_id, MaskList.Mask_favorite, MaskValueList.MaskValue_favorite, idx_from, idx_to, FAVORITE_TYPE_0);

    /* store to acfg */
    store_channel_list_to_acfg();

}
;
/**
* swap after move, 
* 1: change position and div css
* 2: swap channel
*/
function swap_after_move() {
    var svl_id = $(moving_channel_div).find(".card.channel").attr("svl_id");
    var ch_from = $(selected_channel_div).find(".card.channel").attr("channel_id");
    var ch_to = $(moving_channel_div).find(".card.channel").attr("channel_id");
    
    console.log("selected_channel_div:" + selected_channel_div);
    //restore style
    selected_channel_div.css({"top": "auto","left": "auto"});
    selected_channel_div.find(".card-content").show();
    selected_channel_div.find(".card-favorite-icon").show();
    $(".item .col-md-3").find(".before-move").removeClass("before-move");
    //insert slected channel to new position
    console.log("---------moving_index:" + moving_index)
    
    if (ch_from == ch_to || 
    (moving_index == selected_channel_index && selected_channel_page_idx == g_channel_page_idx) || 
    ch_to == undefined) {
        //remove clone channel card
        removeCloneDiv();
        //show channel
        show_selected_postion_channel(selected_channel_index);
        return;
    }
    
    if (selected_channel_page_idx == g_channel_page_idx) {
        //hide selected card
        $(".item .col-md-3").eq(selected_channel_index).remove();
    }
    
    selected_channel_div.insertBefore($(".item .col-md-3").eq(moving_index));

    //remove active card
    $('#id_collapsible_channel').find(".item .card.channel").attr("class", "card channel");
    //set selected channel to active
    $(selected_channel_div).find(".card.channel").attr("class", "card channel active");
    
    sort_channel_by_channel_id(svl_id, ch_from, ch_to);
    update_current_page_ch_list();

    /* store to acfg */
    store_channel_list_to_acfg();

}
;
function switch_channel_by_channel_id(svl_id, ch_from, ch_to, fav_idx) {
    console.log("switch_channel_by_channel_id");
    mtvObj.chFavListSwapByChId(svl_id, ch_from, ch_to, fav_idx);
    return;
}

function sort_channel_by_channel_id(svl_id, ch_from, ch_to, fav_idx) {
    console.log("sort_channel_by_channel_id");
    mtvObj.sortChannel(svl_id, ch_from, ch_to);
    return;
}
function insert_channel_by_ch_idx(svl_id, nw_mask, mask_value, idx_from, idx_to, fav_idx) {
    console.log("insert_channel_by_ch_idx:svl_id:" + svl_id + "idx_from:" + idx_from + "idx_to:" + idx_to + "");
    mtvObj.chFavListInsertMoveByIdx(svl_id, nw_mask, mask_value, idx_from, idx_to, fav_idx);
}

function delay_response_key(delay_time) {
    setTimeout(function() {
        is_need_response = true;
    }, delay_time);
}