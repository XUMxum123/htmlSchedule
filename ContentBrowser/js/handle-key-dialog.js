
function color_bar_list_key_dispatch(isup, e) {
    console.log("color_bar_list_key_dispatch id = " + e.target.id);
    var id = e.target.id;
    
    var keynum = e.which || e.keyCode;
    var content;
    
    switch (keynum) {
    case KeyEvent.DOM_VK_UP:
        if (id == "") {
            return;
        }
        content = $(e.target).prev();
        if (content.length > 0) {
            content.focus();
        }
        
        break;
    case KeyEvent.DOM_VK_RETURN:
        if (id == "") {
            return;
        }
        if (isup) {
            var command = $(e.target).attr('data-key-enter');
            closeDialog();
            eval(command);
        }
        
        break;
    case KeyEvent.DOM_VK_DOWN:
        if (id == "") {
            return;
        }
        content = $(e.target).next();
        if (content.length > 0) {
            content.focus();
        }
        break;
    
    }
}

var color_focus_bg = '';

function color_bar_item_focus(isfocus, id) {
    if (isfocus) {
        $('#' + id).css("background", "url(" + color_focus_bg + ")");
    } else {
        $('#' + id).css("background", "");
    }
}

var contentDialog = null ;

function closeDialog() {
    if (isDialogShow()) {
        contentDialog.close().remove();
        contentDialog = null ;
    }
}

function isDialogShow() {
    if (contentDialog && contentDialog != null ) {
        return true;
    } else {
        return false;
    }
}

function isDialogShowById(id) {
    var frag = false;
    if(isDialogShow()){
        console.log("isDialogShowById");
        seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
            console.log('isDialogShowById dialog.get(\'' + id + '\') = ' + dialog.get(id));
            if (dialog.get(id)) {
                frag = true;
            } else {
                frag = false;
            }
        }
        );
    }
    console.log('isDialogShowById dialog.get(\'' + id + '\') = ');
    return frag;

}

function showColorKeyDialog(index, colorListContent, itemNum, focusIndex) {
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'colorkey_dialog_' + index,
            align: 'bottom',
            content: '<div style=\'position:relative;\'>\
                <div style=\'width:233px;height:40px;background:url(../Assets/_Color_Key_Bar/ColorKeyBar_List/panelColorkey_1280_top.png);\'></div>\
                <div style=\'width:233px;height:' + (40 * (Number(itemNum) > 10 ? 10 : Number(itemNum))) + 'px;overflow: hidden;display:black;background:url(../Assets/_Color_Key_Bar/ColorKeyBar_List/panelColorkey_1280_center.png);\'>\
                <ul id ="color_bar_list" style=\'margin:0px;list-style:none;color:white;\'>'
            + colorListContent + 
            '</ul>\
                </div>\
                <div style=\'width:233px;height:40px;background:url(../Assets/_Color_Key_Bar/ColorKeyBar_List/panelColorkey_1280_bottom.png);\'></div>\
                </div>',
        
        });
        
        contentDialog.show($($('.footer').find('li')[index])[0]);
        if(typeof(focusIndex) == 'undefined'){
            focusIndex = 0;
        }
        $('#color_bar_list_' + focusIndex).focus();
    }
    );
}

function showMusicMetedataDialog(content) {
    var pathName = content.MEDIA_PATH;
    var title = pathName.substring(pathName.lastIndexOf('/') + 1);
    var artist = "Others";
    var album  = "Others";
    if (content.TITLE){
        title = content.TITLE;
    }
    if (content.ARTIST){
        artist = content.ARTIST;
    }
    if (content.ALBUM){
        album = content.ALBUM;
    }
    var date = content.DATE.YEAR + "/" + content.DATE.MONTH + "/" + content.DATE.DAY;
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'metedata_dialog',
            content: '<div style="height: 270px;width: 560px;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;opacity: 0.9;background:#000;">\
                <p style="float:left;color: white;margin: 0;text-align: left;font-size: 26px;position: relative;left: 10px;top: 10px;width: 200px;">'+ getTranslate("Music") +'</p>\
                <p style="float:right;color: white;margin: 0;text-align: right;font-size: 24px;position: relative;right: 10px;top: 10px; height: 26px;">' + timeFormat(content.DURATION) + '</p>\
                <table style="table-layout:fixed; float:left;width:520px;color: white;position: absolute;left: 20px;top: 60px;text-align:left;font-size:24px;">\
                <tr><td >'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + title + '</td></tr>\
                <tr><td >'+ getTranslate("Artist")+ ":"+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + artist + '</td></tr>\
                <tr><td >'+ getTranslate("Album")+ ":"+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + album + '</td></tr>\
                <tr><td >'+ getTranslate("DP_DURATION")+'</td><td>' + timeFormat(content.DURATION) + '</td></tr>\
                <tr><td >'+ getTranslate("Date")+'</td><td>' + date + '</td></tr>\
                </table>\
                </div>',
        
        });
        
        contentDialog.show();
    }
    );
}

function showDlnaMusicMetedataDialog(content) {
    var pathName = content.MEDIA_PATH;
    var title = content.mediaName;
    var artist = "Others";
    var album  = "Others";
    if (content.mediaArtist != "N/A"){
        artist = content.mediaArtist;
    }
    if (content.mediaAlbum != "N/A"){
        album = content.mediaAlbum;
    }
    var date = getFormatDlnaDate(content.mediaDate);
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'metedata_dialog',
            content: '<div style="height: 270px;width: 560px;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;opacity: 0.9;background:#000;">\
                <p style="float:left;color: white;margin: 0;text-align: left;font-size: 26px;position: relative;left: 10px;top: 10px;width: 200px;">'+ getTranslate("Music") +'</p>\
                <table style="table-layout:fixed; float:left;width:520px;color: white;position: absolute;left: 20px;top: 60px;text-align:left;font-size:24px;">\
                <tr><td >'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + title + '</td></tr>\
                <tr><td >'+ getTranslate("Artist")+ ":"+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + artist + '</td></tr>\
                <tr><td >'+ getTranslate("Album")+ ":"+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + album + '</td></tr>\
                <tr><td >'+ getTranslate("DP_DURATION") + '</td><td>' + content.mediaDuration + '</td></tr>\
                <tr><td >'+ getTranslate("Date")+'</td><td>' + date + '</td></tr>\
                </table>\
                </div>',
        
        });
        
        contentDialog.show();
    }
    );
}

function showMetedataDialog(title, content) {
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'metedata_dialog',
            content: '<div style="height: 200px;width: 560px;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;opacity: 0.9;background:#000;">\
                <p style="float:left;color: white;margin: 0;text-align: left;font-size: 26px;position: relative;left: 10px;top: 10px;width: 200px;">' + getTranslate(title) + '</p>\
                <table style="table-layout:fixed; float:left;width:520px;color: white;position: absolute;left: 20px;top: 60px;text-align:left;font-size:24px;">' 
            + content + 
            '</table>\
                </div>',
        
        });
        
        contentDialog.show();
    }
    );
}

var selected = 0;
var selected_right = 0;
var show_option_title;
var show_option_data;
var show_option_obj;

var option_data_attr = null ;
var optionTitle;
var valueNotify;

function list_left_Init(value, data, index) {
    optionTitle = value;
    switch(value){
        case "Photo Player":
        optionTitle = "Photo";
        break;
        default:
        optionTitle = value;
        break;
    }
    if(!data){
        option_data_attr = ALL_OPTION_DATA['' + optionTitle];
    } else {
        option_data_attr = data;
    }
    console.log("option_data_attr = " + option_data_attr);
    if(typeof(index) == 'undefined'){
        selected = 0;
    } else {
        selected = index;
    }
    
    $('#option_title').html(getTranslate(value));
    $('#option_list_left').find('ul').empty();
    
    for (var index in option_data_attr) {
        var id = option_data_attr[index].name.replace(new RegExp(" ","g"),'_');
        var name = getTranslate(option_data_attr[index].name);
        var curValue = localStorage.getItem(id);
        if(curValue){
            option_data_attr[index].curValue = curValue;
        }
        $('#option_list_left').find('ul').append("<li id='" + id + "' tabindex='0' onfocus=item_focus(true,'" + id + "');  onblur=item_focus(false,'" + id + "');><div></div><span id='left_" + id + "' class='option_dialog_left' style='position:absolute;z-index:2;color:white;height:48px;'>" + name + "</span></li>"); 
    }
    setTimeout(function() {
        $($('#option_list_left').find('li')[selected]).focus();
    }
    , 100);

}

function list_submenu_init(show_obj, index){
    show_option_obj = show_obj;
    list_left_Init(show_option_obj.name, show_option_obj.value, index);
}

function option_key_dispatch(evt) {
    if ($('#option_list_content_right').attr("focus") == "true") {
        right_handleKeyCode(evt);
    } else {
        left_handleKeyCode(evt);
    }
}

function left_handleKeyCode(evt) {
    console.log("left_handleKeyCode");
    var kc = evt.which || evt.keyCode;
    var id = evt.target.id;
    if (kc == KeyEvent.DOM_VK_UP) {
        var content = $('#' + id).prev();
        if (content.length > 0) {
            selected = content.index();
            content.focus();
        }
        return true;
    } else if (kc == KeyEvent.DOM_VK_DOWN) {
        var content = $('#' + id).next();
        if (content.length > 0) {
            selected = content.index();
            content.focus();
        }
        return true;
    } else if (
    kc == KeyEvent.DOM_VK_RIGHT || 
    kc == KeyEvent.DOM_VK_RETURN) {
        if ($('#option_right_bg')[0].style.background != "") {
            $($('#option_list_left').find('li')[selected]).addClass('option_list_selected');
            
            $($('#option_list_content_right').find('li')[selected_right]).focus();
            /*show selected highlight bar*/
            return true;
        } else {
            var key = $($('#option_list_left').find('li')[selected]).attr('id');
            closeDialog();
            if(valueNotify){
                valueNotify(key);
            }
        }
    } else if(kc == KeyEvent.DOM_VK_LEFT) {
        if(show_option_obj && show_option_obj.hasSubmenu){
            list_left_Init(show_option_title, show_option_data);
            show_option_obj = null;
        }
    }
    
    return false;
}

function item_focus(isfocus, id) {
    console.log('item_focus isfocus =' + isfocus + ' id =' + id);
    var focus_item = $('#' + id).find('div')[0];
    if (isfocus) {
        $('#option_list_left li.option_list_selected').removeClass('option_list_selected');
         $('#option_list_content_right').attr("focus", "false");
        if(!$(focus_item).hasClass('option_list_div_focus')){
            $(focus_item).addClass("option_list_div_focus");
            $(focus_item).append('<span style="background:url(../Assets/_Highlight/Blue_Left.png);left:10px; top:60px;width:6px;height:40px;position: absolute;"></span><span style="background:url(../Assets/_Highlight/Blue_Middle.png);top:60px;left:16px; width:302px;height:40px;position: absolute;"></span><span style="background:url(../Assets/_Highlight/Blue_Right.png);left:318px; top:60px;width:6px;height:40px;position: absolute;"></span>')
            marqueeObj.startScroll("left_" + id);
        }

        update_list_right(Number($('#' + id).index()));
    } else {
        $(focus_item).html('');
        $(focus_item).removeClass("option_list_div_focus");
        marqueeObj.stopScroll();
    }
}

function right_item_focus(isfocus, id){
        console.log('right_item_focus isfocus =' + isfocus + ' id =' + id);
        var focus_item = $('#' + id).find('div')[0];
    if(isfocus){
        $('#option_list_content_right').attr("focus", "true");
        $('#option_list_content_right li.option_list_selected').removeClass('option_list_selected')
        if(!$(focus_item).hasClass('option_list_div_focus')){
            $(focus_item).addClass("option_list_div_focus");
            $(focus_item).append('<span style="background:url(../Assets/_Highlight/Blue_Left.png);left:10px; top:60px;width:6px;height:40px;position: absolute;"></span><span style="background:url(../Assets/_Highlight/Blue_Middle.png);top:60px;left:16px; width:302px;height:40px;position: absolute;"></span><span style="background:url(../Assets/_Highlight/Blue_Right.png);left:318px; top:60px;width:6px;height:40px;position: absolute;"></span>')
            marqueeObj.startScroll("right_"+id);
        }
    } else {
        $(focus_item).html('');
        $(focus_item).removeClass("option_list_div_focus");
        marqueeObj.stopScroll();
    }
}

function right_handleKeyCode(evt) {
    var kc = evt.which || evt.keyCode;
    var id = evt.target.id;
    console.log("right_handleKeyCode id = " + id);
    if (kc == KeyEvent.DOM_VK_UP) {
        $('#' + id).prev().focus();
        return true;
    } else if (kc == KeyEvent.DOM_VK_DOWN) {
        $('#' + id).next().focus();
        return true;
    } else if (kc == KeyEvent.DOM_VK_RETURN) {
        var index = $('#'+id).index();
        console.log("index = " + index);
        var key = $($('#option_list_left').find('li')[selected]).attr('id');
        
        if(option_data_attr[selected].hasOwnProperty("hasSubmenu")){
            list_submenu_init(option_data_attr[selected], index);
            return;
        } else if(!option_data_attr[selected].hasOwnProperty("storage") || option_data_attr[selected].storage == 1){
            option_data_attr[selected].curValue = index;
            localStorage.setItem(key, index);
        } else if(option_data_attr[selected].storage == 0){
            option_data_attr[selected].curValue = index;
        }
        closeDialog();
        if(valueNotify){
            valueNotify(key, index, option_data_attr[selected]);
        }
        return true;
    } else if (kc == KeyEvent.DOM_VK_LEFT) {
        $($('#option_list_left').find('li')[selected]).focus();
        return true;
    }
    return false;
}

function update_list_right(index) {
    var items = document.getElementById('option_list_content_right').getElementsByTagName('ul');
    $(items).html('');
    var contentValue = option_data_attr[index].value;
    if(contentValue.length <= 0){
        $('#option_right_bg').css('background','');
        return;
    } else {
        $('#option_right_bg').css('background','url(./img/options_menu_R.png)');
    }
    var title = option_data_attr[index].name;
    var titleId = title.replace(new RegExp(' ','g'),'_');
    console.log("option_data_attr[index].curValue = " + option_data_attr[index].curValue);
    selected_right = option_data_attr[index].curValue;
    for (var i in contentValue) {
        var id = titleId + i;
        var showValue;
        var icon_path = null;
        var img = '';
        var className = '';
        if(typeof(contentValue[i]) == 'object'){
            if(option_data_attr[index].hasSubmenu) {
                showValue = contentValue[i].name;
            } else {
            
            showValue = contentValue[i].value;
            if(contentValue[i].icon){
                icon_path = contentValue[i].icon;
                img = '<div style="width:56px;display:block;float:left;"><img src='+icon_path+' /></div>'
            } else {
                img = '<img style="width:56px;" />'
            }
            }
        } else {
            img = '<img style="width:56px;" />'
            showValue = contentValue[i];
        }
        if(i==selected_right){
            className = 'class="option_list_selected"'
        }
        

        $(items).append("<li id='" + id + "'"+className+" tabindex='0' onfocus=right_item_focus(true,'" + id + "');  onblur=right_item_focus(false,'" + id + "');><div></div><div style='position:absolute;z-index:2;color:white;height:48px;' >"+ img +"<div style=\"display: inline;overflow: hidden;position: absolute;width: 234px;text-align: left;\"><span id='right_" + id + "' class='option_dialog_right' >" + getTranslate(showValue) + "</span></div></div></li>");
    }
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';   
}

function isOptionDialogShow() {
    var frag;
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        console.log('isOptionDialogShow dialog.get(\'option_dialog\') = ' + dialog.get('option_dialog'));
        if (dialog.get('option_dialog')) {
            frag = true;
        } else {
            frag = false;
        }
    }
    );
    return frag;
}

function showOptionDialog(title, notify, list, index) {
    console.log("showOptionDialog notify = " + notify);
    if(typeof(notify) == 'undefined'){
        valueNotify = null;        
    } else {
        valueNotify = notify;
    }
    
    show_option_title = title;
    show_option_data = list;
    show_option_obj = null;
    
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        contentDialog = dialog({
            id: 'option_dialog',
            content: '<div id="option" style="width:745px; height:470px;position:relative;">\
                <div id="option_list_content_left"  style="width:394px; height:460px;float:left;background-image: url(./img/OptionMeamu_Panel.png);top: 5px;position: absolute;">\
                    <div id="option_title" style="position: absolute;left: -130px;top: 200px;height: 42px;width:380px;color: rgb(211,212,213);text-align: right;font-size: 26px;margin: 0px;-webkit-transform: rotate(270deg);white-space: nowrap;"></div>\
                    <div id="option_list_left" style="left: 80px;width: 280px;height: 380px;float: left;position: relative;display: block;z-index: 3;overflow: hidden;margin-top:32px;" >\
                        <ul class="option_ul">\
                        </ul>\
                    </div>\
                </div>\
                <div id="option_right_bg" focus="false" style="position: relative;float: right;width:380px;height: 470px;z-index:0;background:url(./img/options_menu_R.png)">\
                    <div id="option_list_content_right"><div class="option_list"><ul id="option_right_ul"></ul></div></div>\
                </div>\
                </div>',
        
        });
        
        contentDialog.show();
        list_left_Init(title, list, index);
    }
    );
}

var pvrRatingBlockedPinText ='';
var pvrPinNotiftyFunc;

function pvr_rating_blocked_key_dispatch(isup, e){
    var id = e.target.id;
    var keynum = e.which || e.keyCode;
    var keyValue = '';
    switch(keynum){
    case KeyEvent.DOM_VK_0:
    case KeyEvent.DOM_VK_1:
    case KeyEvent.DOM_VK_2:
    case KeyEvent.DOM_VK_3:
    case KeyEvent.DOM_VK_4:
    case KeyEvent.DOM_VK_5:
    case KeyEvent.DOM_VK_6:
    case KeyEvent.DOM_VK_7:
    case KeyEvent.DOM_VK_8:
    case KeyEvent.DOM_VK_9:
    //TODO deal with number key
    keyValue = keynum - KeyEvent.DOM_VK_0;
    if(pvrRatingBlockedPinText.length < 4){
        pvrRatingBlockedPinText += keyValue;
    }
    console.log("pvrRatingBlockedPinText = " + pvrRatingBlockedPinText);
    if(pvrRatingBlockedPinText.length == 4){
        $($('#pin_star_layout').find('img')[pvrRatingBlockedPinText.length - 1]).attr('src','../Assets/_TextEntry_OK/Pin_Star_Black.png');
        if(pvrPinNotiftyFunc){
             eval(pvrPinNotiftyFunc+'(5);');
        } else {
            doFocus('btn_left');
        }
    } else {
        $($('#pin_star_layout').find('img')[pvrRatingBlockedPinText.length - 1]).attr('src','../Assets/_TextEntry_OK/Pin_Star_Black.png');
    }
    break;
    case KeyEvent.DOM_VK_LEFT:
        if (id == "") {
            return;
        }
        content = $(e.target).prev();
        if (content.length > 0) {
            content.focus();
        }
        
        break;
    case KeyEvent.DOM_VK_RETURN:
        if (id == "") {
            return;
        }
        if (isup) {
            var command = $(e.target).attr('data-key-enter');
            console.log("command = " + command);
            eval(command);
        }
        
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if (id == "") {
            return;
        }
        content = $(e.target).next();
        if (content.length > 0) {
            content.focus();
        }
        break;
    default:
    break;
    }
}

function closePvrDialog() {
    if (pvrDialog && pvrDialog != null ) {
        pvrDialog.close().remove();
        pvrDialog = null ;
    }
}

function isPvrDialogShow() {
    if (pvrDialog && pvrDialog != null ) {
        return true;
    } else {
        return false;
    }
}

function clearPvrRatingBlockedPin(){
    pvrRatingBlockedPinText = '';
    $('#pin_star_layout').find('img').attr('src','../Assets/_TextEntry_OK/Pin_Star_Grey.png');
    
}

var pvrDialog = null;
function showPvrRatingBlockedDialog(btnClickNotify){
    console.log("showPvrRatingBlockedDialog btnClickNotify = " + btnClickNotify);
    pvrRatingBlockedPinText = '';
    pvrPinNotiftyFunc = null;
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        pvrDialog = dialog({
            id: 'pvr_rating_blocked_dialog',
            content: '<div style="height: 348px;width: 454px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;background:transparent;">\
            <div style="position:absolute;height: 344px;width: 450px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="height:70px;width:450px;background:black;opacity:1;position:absolute;border-top-left-radius: 6px;border-top-right-radius: 6px;z-index:2;">\
                <p style="width:100%;float:left;background:black;color: white;margin: 0;text-align: center;font-size: 26px;position: relative;top: 20px;display: inline;">Channel Unlock Dialogue</p>\
            </div>\
            <div style="position:absolute;height: 65px;top:70px;left:125px;width: 200px;z-index:2;">\
                <span style="width:20px;height:65px;position: inherit;left:0px;background:url(../Assets/_TextEntry_OK/TxtEntry_Left.png);"></span>\
                <span style="left:20px;height:65px; width:160px;position:inherit;height:65px;background:url(../Assets/_TextEntry_OK/TxtEntry_Center.png);"></span>\
                <span style="left:180px;height:65px; width:20px;position: inherit;background:url(../Assets/_TextEntry_OK/TxtEntry_Right.png);"></span>\
            </div>\
            <div id="pin_star_layout" style="position:absolute;height: 65px;top:70px;left:125px;width: 200px;z-index:3;padding-top:18px;">\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
            </div>\
            <div id="pin_code_error" style="position:absolute;height: 65px;top:135px;width: 450px;z-index:3;display:none;">\
                <p style="color:white;font-size:16px;margin:0px;">Passcode is incorrent.Re-enter</p>\
                <p style="color:white;font-size:16px;margin:0px;">Passcode to unlock channel or</p>\
                <p style="color:white;font-size:16px;margin:0px;">Cancel to close this dialogue</p>\
            </div>\
            <div style="position:absolute;height: 65px;bottom:30px;width: 450px;z-index:3;">\
            <div id="btn_left" tabindex="0" class="btn_all" data-key-enter="'+btnClickNotify+'(1);" style="width:200px;height:70px;float:left;margin-left:25px;outline:none;border:none;position:inherit;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("next")+'</p>\
            </div>\
            <div id="btn_right" tabindex="0" class="btn_all" data-key-enter="'+btnClickNotify+'(2);" style="width:200px;height:70px;float:left;margin-left:225px;outline:none;border:none;position:inherit;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("cancel")+'</p>\
                </div>\
            </div>\
        </div>',
        
        });
        
        pvrDialog.show();
       }
    );
}

function showPvrChannelBlockedDialog(btnClickNotify){
    console.log("showPvrRatingBlockedDialog btnClickNotify = " + btnClickNotify);
    pvrRatingBlockedPinText = '';
    pvrPinNotiftyFunc = btnClickNotify;
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        pvrDialog = dialog({
            id: 'pvr_rating_blocked_dialog',
            content: '<div style="height: 288px;width: 952px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;">\
            <div style="position:absolute;height: 284px;width: 948px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="height:70px;width:948px;background:black;opacity:1;position:absolute;border-top-left-radius: 6px;border-top-right-radius: 6px;z-index:2;">\
                <p id="pvr_enter_pincode_title" style="width:100%;float:left;background:black;color: white;margin: 0;text-align: left;padding-left:20px;font-size: 26px;position: relative;top: 20px;display: inline;">'+getTranslate('QT_ENTER_PIN')+'</p>\
            </div>\
            <div style="position:absolute;height: 65px;top:90px;left:373px;width: 200px;z-index:2;">\
                <span style="width:20px;height:65px;position: inherit;left:0px;background:url(../Assets/_TextEntry_OK/TxtEntry_Left.png);"></span>\
                <span style="left:20px;height:65px; width:160px;position:inherit;height:65px;background:url(../Assets/_TextEntry_OK/TxtEntry_Center.png);"></span>\
                <span style="left:180px;height:65px; width:20px;position: inherit;background:url(../Assets/_TextEntry_OK/TxtEntry_Right.png);"></span>\
            </div>\
            <div id="pin_star_layout" style="position:absolute;height: 65px;top:90px;left:373px;width: 200px;z-index:3;padding-top:18px;">\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
                <img src="../Assets/_TextEntry_OK/Pin_Star_Grey.png" style="position:relative;margin-left:20px;float:left;"/>\
            </div>\
            <div style="position:absolute;height: 65px;bottom:15px;width: 952px;z-index:3;">\
            <div id="btn_left" tabindex="0" class="btn_all" data-key-enter="'+btnClickNotify+'(3);" style="width:200px;height:70px;float:left;margin-left:275px;outline:none;border:none;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("cancel")+'</p>\
            </div>\
            <div id="btn_right" tabindex="0" class="btn_all" data-key-enter="'+btnClickNotify+'(4);" style="width:200px;height:70px;float:left;margin-left:0px;outline:none;border:none;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("clear")+'</p>\
            </div>\
            </div>\
        </div>',
        
        });
        
        pvrDialog.show();
        $('#btn_left').focus();
       }
    );
}

playbackErrorDialog = null;
autoCloseplaybackErrorDialog_t = null;
function closePlaybackErrorDialog(){
    if(playbackErrorDialog && playbackErrorDialog != null){
        playbackErrorDialog.close().remove();
        playbackErrorDialog = null;
        if(autoCloseplaybackErrorDialog_t){
            clearTimeout(autoCloseplaybackErrorDialog_t);
        }
        return true;
    }
    return false;
}

function showPlaybackErrorDialog(errorInfo, closeNotify){
    console.log("showPlaybackErrorDialog errorInfo = " + errorInfo);
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        playbackErrorDialog = dialog({
            id: 'playback_error_dialog',
            content: '<div style="height: 90px;width: 950px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;z-index:1;">\
            <div style="position:absolute;height: 86px;width: 946px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="position:absolute;height: 86px;width: 946px;border-radius: 6px;z-index:2;">\
            <img style="float:left;position:relative;top:22px;left:20px;right:20px;" src="../Assets/_Dialog/Notification_icon_warning.png"/>\
            <table style="float:left;position:relative;left:40px;width: 800px;height: 100%;"><tr><td style="padding: 0px;text-align: center;">\
            <p style="height: auto;width: 800px;margin:0px;color:white;font-size:24px;text-align:left">' + getTranslate(errorInfo) + '</p>\
            </td></tr></table>\
            </div>\
        </div>',
        
        });
        
        playbackErrorDialog.show();
        autoCloseplaybackErrorDialog_t = setTimeout(function () {
            if(closePlaybackErrorDialog()){
                if(closeNotify){
                    closeNotify();
                }
            }
            
        }, 6000);
       }
    );
}

var noUsbDialog = null;
function showNoUsbDialog(){
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        noUsbDialog = dialog({
            id: 'no_usb_dialog',
            content: '<div style="height: 90px;width: 950px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;z-index:1;">\
            <div style="position:absolute;height: 86px;width: 946px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="position:absolute;height: 86px;width: 946px;border-radius: 6px;z-index:2;">\
            <img style="float:left;position:relative;top:22px;left:20px;right:20px;" src="../Assets/_Dialog/Notification_icon_warning.png"/><p style="float:left;height: 90px;width: 800px;position:relative;left:40px;line-height:90px;margin:0px;color:white;font-size:24px;text-align:left">'+getTranslate("No USB device connected")+'</p>\
            </div>\
        </div>',
        
        });
        
        noUsbDialog.show();
       }
    );
}

function dms_wakeup_key_dispatch(isup, e){
    var id = e.target.id;
    var keynum = e.which || e.keyCode;
    var keyValue = '';
    switch(keynum){
        case KeyEvent.DOM_VK_LEFT:
        if (id == "") {
            return;
        }
        content = $(e.target).prev();
        if (content.length > 0) {
            content.focus();
        }
        
        break;
    case KeyEvent.DOM_VK_RETURN:
        if (id == "") {
            return;
        }
        if (isup) {
            var command = $(e.target).attr('data-key-enter');
            console.log("command = " + command);
            eval(command);
        }
        
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if (id == "") {
            return;
        }
        content = $(e.target).next();
        if (content.length > 0) {
            content.focus();
        }
        break;
    default:
    break;
    }
}

var dmsWakeupDialog = null;
function showDMSWakeupDialog(){
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        dmsWakeupDialog = dialog({
            id: 'dms_wakeup_dialog',
            content: '<div style="height: 348px;width: 454px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;">\
            <div style="position:absolute;height: 344px;width: 450px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="height:70px;width:450px;background:black;opacity:1;position:absolute;border-top-left-radius: 6px;border-top-right-radius: 6px;z-index:2;"> \
                <p style="width:100%;float:left;background:black;color: white;margin: 0;text-align: center;font-size: 26px;position: relative;top: 20px;display: inline;">DMS Wakeup Dialogue</p>\
            </div>\
            <div id="pin_code_error" style="position:absolute;height: 65px;top:135px;width: 450px;z-index:3;">\
                <p style="color:white;font-size:20px;margin:0px;">do you want to wakeup the dms</p>\
            </div>\
            <div style="position:absolute;height: 65px;bottom:30px;width: 450px;z-index:3;">\
            <div id="btn_left" tabindex="0" class="btn_all" data-key-enter="dmsWakeupBtnClick(1);" style="width:200px;height:70px;float:left;margin-left:25px;outline:none;border:none;position:inherit;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("ok")+'</p>\
            </div>\
            <div id="btn_right" tabindex="0" class="btn_all" data-key-enter="dmsWakeupBtnClick(2);" style="width:200px;height:70px;float:left;margin-left:225px;outline:none;border:none;position:inherit;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("cancel")+'</p>\
            </div>\
            </div>\
        </div>',
        
        });
        
        dmsWakeupDialog.show();
        $('#btn_left').focus();
       }
    );
}

var stopInfoDialog = null;

function closeStopInfoDialog() {
    if (stopInfoDialog && stopInfoDialog != null ) {
        stopInfoDialog.close().remove();
        stopInfoDialog = null ;
    }
}

function isStopInfoDialogShow() {
    if (stopInfoDialog && stopInfoDialog != null ) {
        return true;
    } else {
        false;
    }
}

function showStopInfoDialog(btnNotify){
    seajs.use(['jquery', '../libs/artDialog/src/dialog'], function($, dialog) {
        stopInfoDialog = dialog({
            id: 'playback_stop_info_dialog',
            content: '<div style="height: 90px;width: 950px;margin: 0 auto;position: relative;border: 2px solid #D3D4D5;border-radius: 6px;z-index:1;">\
            <div style="position:absolute;height: 86px;width: 946px;opacity: 0.7;background:#000;border-radius: 6px;z-index:1;">\
            </div>\
            <div style="position:absolute;height: 86px;width: 946px;border-radius: 6px;z-index:2;">\
            <p style="float:left;height: 40px;width: 800px;position:relative;left:40px;line-height:40px;margin:0px;color:white;font-size:24px;text-align:left">'+getTranslate("qt_playback_begining")+'</p>\
            </div>\
            <div style="position:absolute;height: 70px;bottom:30px;width: 420px;left:530px;top:20px;z-index:3;">\
            <div id="btn_left" tabindex="0" class="btn_all" data-key-enter="'+btnNotify+'(1);" style="width:200px;height:70px;float:left;outline:none;border:none;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("ok")+'</p>\
            </div>\
            <div id="btn_right" tabindex="0" class="btn_all" data-key-enter="'+btnNotify+'(2);" style="width:200px;height:70px;float:left;outline:none;border:none;">\
                <p style="width:200px;height:70px;text-align:center;line-height:70px;color:white;font-size:24px;margin:0px;">'+getTranslate("qt_resume")+'</p>\
            </div>\
            </div>\
        </div>',
        
        });
        
        stopInfoDialog.show();
        $('#btn_left').focus();
       }
    );
}
