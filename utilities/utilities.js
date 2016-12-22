var gMtvutilities = new MtvUtilities();

// move to items, show different color list
const CARD_WIDTH = 245;
function inputSourceGridMenuInit(target, list) {
    var item = null;
    var count = 0;

    target.html(""); // clean all items
    //show page item
    $.each(list, function (key, v) {
        if (null == item) {
            item = $('<div />');
        }
        // keep current source index in attr "data-id" for setting new source index
        var card = $('<div class="card mtvui" align="center" data-id="'
                     +v.id+'"><div class="card-image"><img src="'
                     +v.icon+'" /></div><div class="card-content"><span>'
                     +v.name+'</span></div></div>');

        var ci = $('<div class="card-cell" style="float:left; width:'+CARD_WIDTH+'px;"></div>');
        card.appendTo(ci);
        ci.appendTo(item);
        count++;
        if (item && (0 == (count % 15))) {
            item.appendTo(target);
            item = null;
        }
    });

    if (null != item) {
        item.appendTo(target);
    }
    // highlight first one
    $(".card.mtvui").eq(0).addClass("active");
};

// this function is used to replace image when moving to another item
function document_keyProc(kc) {
    var key = kc.keyCode || kc.which;
    //var items     = $('.collapsible-header');
    //var active    = $('.collapsible-header.active');
    kc.target = $("#id_collapsible_input");

    var carousel    = kc.target.find(".carousel[data-ride=carousel]");
    var cards_all   = kc.target.find(".card.mtvui");
    var active_card = cards_all.filter(".card.mtvui.active");

    /* not card */
    if (cards_all.length <= 0)
        return true;
    var idx = 0;
    if (active_card.length > 0)
        idx = $.inArray(active_card[0], cards_all);
    console.log("idx=", idx, "key=", key);

    if((key == KeyEvent.DOM_VK_RETURN) || (key == KeyEvent.DOM_VK_ENTER) ) {
        // set new source index; DOM_VK_RETURN mapping == Enter
        var cur_ipt_id = null;
        if (active_card.length > 0 && (cur_ipt_id = $(active_card[0]).attr("data-id"))) {
            gMtvutilities.procItem(cur_ipt_id);
            return false;
        }
        return true;
    }

    const COLMAX = 5;   // cards per row
    var ROWMAX = Math.ceil(cards_all.length / COLMAX);
    if (key == KeyEvent.DOM_VK_DOWN)       idx += COLMAX;
    else if (key == KeyEvent.DOM_VK_UP)    idx -= COLMAX;
    else if (key == KeyEvent.DOM_VK_LEFT)  idx--;
    else if (key == KeyEvent.DOM_VK_RIGHT) idx++;
    else if (key == KeyEvent.DOM_VK_CH_INCREASE) idx = cards_all.length - 1;
    else if (key == KeyEvent.DOM_VK_CH_DECREASE) idx = 0;
    else
        return true;            // other keys

    idx = Math.max(idx, 0);
    idx = Math.min(idx, cards_all.length - 1);

    cards_all.removeClass("active");
    active_card = $(cards_all[idx]);
    active_card.addClass("active");

    return false;
}

$(document).on("keydown", function (evt) {
    if (document_keyProc(evt))
        return mtvuiUtil.procSysKey(evt.keyCode || evt.which);
    return false;
});
