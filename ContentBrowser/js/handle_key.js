var top_menu_selected_id;
var submenu_selected_id;
var focus_level = 1;
var photoObj = new Photo_obj();
var videoObj = new Video_obj();
var musicObj = new Music_obj();

function waitLoading(isShow) {
    if (isShow) {
        if($("#scan_loading").css('display') == 'none'){
            $("#scan_loading").fadeIn();
        }       
    } else {
        if($("#scan_loading").css('display') != 'none'){
            $("#scan_loading").fadeOut();
        }        
    }
}

function top_menu_bar_selected(id, n) {
    console.log('top_menu_bar_selected id =' + id);
    for (var i = 0; i < n; i++) {
        var con = document.getElementById("con_top_menu_" + i);
        if (('top_menu_' + i) == top_menu_selected_id) 
        {
            con.style.display = "block";
        } else {
            con.style.display = "none";
        }
    }
}

function initialDataLoading(menu_id, obj) {
    waitLoading(true);
    switch (menu_id) {
    case "top_menu_0":
        initMusicMode();
        $('#music_submenu_bar').children(':eq('+musicObj.submenuSelectedIdx+')').addClass('selected');
        //submenu_selected_id = "music_submenu_bar_"+musicObj.submenuSelectedIdx;
        //music_content_focus();
        break;
    case "top_menu_1":
        musicPlayObj.stopMusic(true);
        initVideo(obj);
        $('#video_submenu_bar').children(':eq('+videoObj.submenuSelectedIdx+')').addClass('selected');
        submenu_selected_id = "video_submenu_bar_"+videoObj.submenuSelectedIdx;
        initPageIndicator('video_page_indicator', videoObj.pageIndicatorNum, videoObj.pageIndex);
        music_content_focus();
        break;
    case "top_menu_2":
        startLoadingAnimate();
        setTimeout(function(){initPhotoMode();}, 100);
        //submenu_selected_id = "photo_submenu_bar_"+photoObj.submenuSelectedIdx;
        break;
    case "top_menu_3":
        initFile(obj);
        if(!obj)
            return;
        break;
    }

    waitLoading(false);
}

function top_menu_item_focus(isfocus, id) {
    console.log('top_menu_item_focus isfocus =' + isfocus + ' id =' + id +";top_menu_selected_id = "+top_menu_selected_id);
    var content = document.getElementById(id);
    if (isfocus) {
        focus_level = 1;
        content.className = "topFocus";
        $("#"+top_menu_selected_id).removeClass("selected");
        switch (id) {
        case "top_menu_0":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Music_HL_TR.png");
            $($("#"+id).find("p")).text(getTranslate("Music"));
            break;
        case "top_menu_1":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Video_HL_TR.png");
            $($("#"+id).find("p")).text(getTranslate("Movie"));
            break;
        case "top_menu_2":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Photo_HL_TR.png");
            $($("#"+id).find("p")).text(getTranslate("Photo"));
            break;
        case "top_menu_3":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Folder_HL_TR.png");
            $($("#"+id).find("p")).text(getTranslate("Folder"));
            break;
        default:
            break;
        }
        initColorKeyBar(otherColorKeyData);
    } else {
        switch (id) {
        case "top_menu_0":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Music_Nor.png");
            break;
        case "top_menu_1":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Video_Nor.png");
            break;
        case "top_menu_2":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Photo_Nor.png");
            break;
        case "top_menu_3":
            $("#"+id).find("img").attr("src","../Assets/_Top_Menu_Bar/Top_Menu_Bar_Icons/Folder_Nor.png");
            break;
        default:
            break;
        }
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
    console.log("reset_submenu_focus");
    focus_level = 2;
    var temp = document.getElementById(submenu_selected_id);
    if(temp){
        temp.focus();
    }
}

function submenuDataLoading(submenu_id) {
    switch (top_menu_selected_id) {
    case "top_menu_0":        
        musicObj.initBySubmenu($('#' + submenu_id).index());
        if (MUSIC_TRACK_SORT == musicObj.sortMode) {
            setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
            initPageIndicator('music_page_indicator', musicObj.pageIndicatorNum);
        } else {
            setMusicInfoList($('#music_list_ul'), musicObj.infoList);
            setPageIndicator('music_page_indicator', $('#' + submenu_id).index());
        }
        
        break;
    case "top_menu_1":
        musicPlayObj.stopMusic(true);
        videoObj.initBySubmenu($('#' + submenu_id).index());
        setVideoInfo(videoObj.infoList);
        initPageIndicator('video_page_indicator', videoObj.pageIndicatorNum);
        break;
    case "top_menu_2":
        photoObj.initBySubmenu($('#' + submenu_id).index());
        setphotoInfo($('#photo_album_container'), photoObj.infoList);
        initPageIndicator('photo_page_indicator', photoObj.pageIndicatorNum, photoObj.pageIndex);
        break;
    case "top_menu_3":
        
        break;
    }

}

function submenu_item_focus(isfocus, id) {
    console.log('submenu_item_focus isfocus =' + isfocus + ' id =' + id);
    var content = document.getElementById(id);
    if (isfocus) {
        focus_level = 2;
        content.className = "focus";
        initColorKeyBar(otherColorKeyData);
        marqueeObj.startScroll("span_"+id);
    } else {
        if (id == submenu_selected_id) {
            content.className = "selected";
        } else {
            content.className = "li";
        }
        marqueeObj.stopScroll();// clear when focus lost
    }

}
function topmenu_item_select(id) {
    console.log("topmenu_item_select id = " + id);
    if (top_menu_selected_id && top_menu_selected_id == id){
        if(id == 'top_menu_3'){
            music_content_focus();
        } else {
            reset_submenu_focus();
        }
        return;
    }
    clearThumbnail();
    
    if (top_menu_selected_id && top_menu_selected_id != id) {
        document.getElementById(top_menu_selected_id).className = "";
    }
    
    top_menu_selected_id = id; 
    top_menu_bar_selected(id, 4);

    setTimeout(function(){initialDataLoading(id);}, 500);
    
    //initialDataLoading(id);

}
function submenu_item_select(id) {
    console.log("submenu_item_select id = " + id);
        if (submenu_selected_id && submenu_selected_id == id){
            music_content_focus();
            return;
        }
        if (submenu_selected_id && submenu_selected_id != id) {
            var temp = document.getElementById(submenu_selected_id);
            if(temp){
                 temp.className = "";
            }
        }
        submenu_selected_id = id;
        clearThumbnail();
        submenuDataLoading(id);
        music_content_focus();
}

function setSubmenuInfo(target, folderList) {
    target.html("");
    var targetId = target.attr("id") + '_';
    for (var index in folderList) {
        var id = targetId + index;
        var content = $('<li id="' + id + '" tabindex = "0" onclick=\'doFocus("' + id + '");\' onfocus=\'submenu_item_focus(true, "' + id + '");\' onblur=\'submenu_item_focus(false, "' + id + '");\'>\
        <span id="span_'+id+'" >' + folderList[index] + '</span>\
        </li>');
        content.appendTo(target);
    }

}

function top_menu_key_dispatch(isup, e) {
    console.log("top_menu_key_dispatch id= " + e.target.id);
    
    var id = e.target.id;
    if (id == "") {
        return;
    }
    var content = document.getElementById(id);
    var focus_id;
    
    var keynum = e.which || e.keyCode;
    if (!isup) {
        return;
    }
    switch (keynum) {
    case KeyEvent.DOM_VK_RETURN:
        if(focus_level == 1){
            topmenu_item_select(id);
        }else{
            submenu_item_select(id);
        }
    return;
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
    case KeyEvent.DOM_VK_DOWN:
        if (isup) {
            var fun_str = $('#' + id).parent().attr("data-focus-down-function");
            console.log("fun_str = "+fun_str) ;
            if (fun_str) {
                eval(fun_str);
            } else {
                if (focus_level == 1) {
                    topmenu_item_select(id);
                } else {
                    //focus_id = $('#' + id).parent().attr("data-focus-down-level");
                    console.log("DOM_VK_DOWN submenu_item_select");
                    submenu_item_select(id);
                }
             
            }
        
        
        }
        break;
    }
}

function setVideoInfo(videoInfoList) {
    /*
    console.log("setVideoInfo videoObj.totalNum = " + videoObj.totalNum);
    setVideoInfo1(videoInfoList,videoObj.start,videoObj.totalNum);
    */
    if(videoInfoList && videoInfoList.length>0){
        startLoadingAnimate();
    }
    
    
    var videoConetnt0 = $('#video_content_0');
    var videoConetnt1 = $('#video_content_1');
    videoConetnt0.html("");
    videoConetnt1.html("");
    var index = 0;
    for (var i = (videoObj.pageIndex * 6); (i < ((videoObj.pageIndex + 1) * 6) && i < videoInfoList.length) ; i++) {
        var id = "video_item_" + index;
        
        var pathName = videoInfoList[i].MEDIA_PATH;
        title = pathName.substring(pathName.lastIndexOf('/') + 1);
        console.log("setVideoInfo title = " + title);
        
        var data = '<div id="' + id + '" data-path="' + videoInfoList[i].MEDIA_PATH + '"class="video_info_layout" tabindex="0" onfocus=\'video_item_focus("' + id + '");\'  onblur=\'video_item_blur("' + id + '");\' ><div ><table style=\'width: 100%;height: 100%;\'><tr><td style="padding: 0px;text-align: center;">' 
        + '<img id="'+id+'_img" src="../Assets/Contents_Browser/_Movie_Browser/movie-icon-N.png"/>' + 
        '</td></tr></table></div><div class="p-bottom"><p>' + title + '</p><p>' + timeFormat(videoInfoList[i].DURATION) + '</p><p>' + bytesToMb(videoInfoList[i].SIZE) + '</p><p>' + getFormatDateVideo(videoInfoList[i]) + '</p></div></div>';
        getThumbnail({MEDIA_PATH:videoInfoList[i].MEDIA_PATH,width:120,height:120,MEDIA_TYPE:3,id:id+'_img',needWait:true});
        var content = $(data);
        if (index >= 6)
            return;
        if (index >= 3) {
            content.appendTo(videoConetnt1);
        } else {
            content.appendTo(videoConetnt0);
        }
        index++;
    
    }

}


function getFormatDateVideo(dateObj){
    if(!dateObj.DATE){
        return '';
    }
    if (dateObj.DATE.MONTH < 10){
        var month = '0' + dateObj.DATE.MONTH;
    }else{
        var month = dateObj.DATE.MONTH;
    }
    if (dateObj.DATE.DAY < 10){
        var day = '0' + dateObj.DATE.DAY;
    }else{
        var day = dateObj.DATE.DAY;
    }
    return dateObj.DATE.YEAR+'-'+month+'-'+day;
}

function getFormatDlnaDate(obj){
    var dateObj = obj;
    return dateObj.year+'/'+dateObj.month+'/'+dateObj.day;
}

function getFormatTimeVideo(dateObj){
    if(!dateObj.DATE){
        return '';
    }
    if (dateObj.DATE.HOUR < 10){
        var hour = '0' + dateObj.DATE.HOUR;
    }else{
        var hour = dateObj.DATE.HOUR;
    }
    if (dateObj.DATE.MINUTE < 10){
        var min = '0' + dateObj.DATE.MINUTE;
    }else{
        var min = dateObj.DATE.MINUTE;
    }
    if (dateObj.DATE.SECOND < 10){
        var sec = '0' + dateObj.DATE.SECOND;
    }else{
        var sec = dateObj.DATE.SECOND;
    }
    return hour +':'+ min +':' + sec;
}

function setVideoInfo1(videoInfoList, start, totalNum) {
    console.log("setVideoInfo start " + start + " totalNum = " + totalNum);
    var videoConetnt0 = $('#video_content_0');
    var videoConetnt1 = $('#video_content_1');
    videoConetnt0.html("");
    videoConetnt1.html("");
    var index = 0;
    for (var i = (videoObj.pageIndex * 6); (i < ((videoObj.pageIndex + 1) * 6) && i < totalNum) ; i++) {
        var id = "video_item_" + index;
        var location = i + start;
        var pathName = videoInfoList[location].MEDIA_PATH;
        title = pathName.substring(pathName.lastIndexOf('/') + 1);
        console.log("setVideoInfo title = " + title);
        
        var data = '<div id="' + id + '" data-path="' + videoInfoList[location].MEDIA_PATH + '"class="video_info_layout" tabindex="0" onfocus=\'video_item_focus("' + id + '");\'  onblur=\'video_item_blur("' + id + '");\' ><div ><img /></div><div class="p-bottom"><p>' + title + '</p><p>' + videoInfoList[location].YEAR + '</p><p >' + bytesToMb(videoInfoList[location].SIZE) + '</p></div></div>'
        getThumbnail({MEDIA_PATH:videoInfoList[location].MEDIA_PATH,width:86,height:86,MEDIA_TYPE:3,id:id+'_img',needWait:true});
        var content = $(data);
        if (index >= 6)
            return;
        if (index >= 3) {
            content.appendTo(videoConetnt1);
        } else {
            content.appendTo(videoConetnt0);
        }
        index++;
    
    }
}

function initVideo(refresh){
    console.log("initVideo");
    var name = getTranslate("Movie");
    $($("#con_top_menu_1").find('.title_name')).html(name);
    if(typeof(refresh) == 'undefined'){
        videoObj.init();
    }
    setVideoInfo(videoObj.infoList);
    setSubmenuInfo($('#video_submenu_bar'), videoObj.pageInfo.submenuData);
}

function videoPageNext() {
    /**
    var submenuStr = $('#'+submenu_selected_id).html();
    if((videoPageIndex+1)*6 < videoInfoList[submenuStr].length){
        console.log("videoPageNext ");
        videoPageIndex++;
        console.log("$('#submenu_selected_id').html() = " + $('#'+submenu_selected_id).html());
        setVideoInfo(videoInfoList[submenuStr]);
        $('#video_item_0').focus();
    }
    **/
    if ((videoObj.pageIndex + 1) * 6 < videoObj.totalNum) {
        console.log("videoPageNext ");
        videoObj.setPageIndex(videoObj.pageIndex+1);
        videoObj.getOnePageInfo();
        console.log("$('#submenu_selected_id').html() = " + $('#' + submenu_selected_id).html());
        setVideoInfo(videoObj.infoList);
        $('#video_item_0').focus();
        setPageIndicator('video_page_indicator', videoObj.pageIndex);
    }
}

function videoPagePrevious() {
    /**
     if(videoPageIndex > 0){
         videoPageIndex--;
         setVideoInfo(videoInfoList[$('#'+submenu_selected_id).html()]);
         $('#video_item_0').focus();
     }
     **/
    if (videoObj.pageIndex > 0) {
        videoObj.setPageIndex(videoObj.pageIndex-1);
        setVideoInfo(videoObj.infoList);
        $('#video_item_0').focus();
        setPageIndicator('video_page_indicator', videoObj.pageIndex);
    }
}

var pathReg = new RegExp("/","g");

function video_item_focus(id) {
    focus_level = 3;
    document.getElementById(id).className = "video_info_hl_layout";
    if(fileObj.usbList){
        if(fileObj.usbList.length>1){
            videoColorKeyData[3] = {"show":true,"name":"USB Device"};
        }else{
            videoColorKeyData[3] = {"show":true,"name":""};
        }
    }else{
        videoColorKeyData[3] = {"show":true,"name":""};
    }
    
    initColorKeyBar(videoColorKeyData);
    videoObj.curFocusIndex = Number(id.charAt(id.length - 1));
    var imgPath = $('#'+id+'_img').attr('src');
    if(imgPath && imgPath.indexOf("../") >= 0){
        $('#'+id+'_img').attr('src','../Assets/Contents_Browser/_Movie_Browser/movie-icon-HL.png');
    }
    $('#video_file_path').html($('#' + id).attr('data-path').substring($('#' + id).attr('data-path').lastIndexOf('/') + 1));
}

function video_item_blur(id) {
    document.getElementById(id).className = "video_info_layout";
    if($('#'+id+'_img').attr('src').indexOf("../") >= 0){
        $('#'+id+'_img').attr('src','../Assets/Contents_Browser/_Movie_Browser/movie-icon-N.png');
    }
    $('#video_file_path').html('');
}

function video_key_dispatch(isup, e) {
    console.log('video_key_dispatch id=' + e.target.id);
    var id = e.target.id;
    if (id == "") {
        return;
    }
    var content = document.getElementById(id);
    var focus_id;
    
    var keynum = e.which || e.keyCode;
    switch (keynum) {
    case KeyEvent.DOM_VK_PLAY:
    case KeyEvent.DOM_VK_RETURN:
        if(thumbnailList.length > 0){
            return;
        }
        if (!isup) {
            content.className = "video_info_sel_layout";
        } else {
            videoObj.needRefresh  = false;
            content.className = "video_info_hl_layout";
            var index = Number(new RegExp(/\d+$/).exec(id));
            index += Number(6*videoObj.pageIndex);
            //var pageInfo = '{"pageId":"'+top_menu_selected_id+'","curPageObj":'+JSON.stringify(videoObj)+'}';
            //$("input[name='page_info']").val(pageInfo);
            
            //var title = $($('#' + id).find('.p-bottom')).find("p").first().html();
            //goToLocation(get_content_browser_player_url() + '?'+encodeURI('filePath=' + $('#' + id).attr('data-path') + '&title=' + title));
            //document.location.href = './content_browser_player.html';
            
            contentBrowserObj.playVideo(videoObj, null, (KeyEvent.DOM_VK_PLAY == keynum));
        }
        break;
    case KeyEvent.DOM_VK_LEFT:
        if (isup) {
            var content = $('#' + id).prev();
            if (content.length > 0) {
                $('#' + id).prev().focus();
            } else {
                focus_id = $('#' + id).parent().attr("data-focus-up-level");
                console.log("focus_id = " + focus_id);
                if (focus_id) {
                    $('#' + focus_id).children(':eq(2)').focus();
                } else {
                    videoPagePrevious();
                }
            }
        }
        break;
    case KeyEvent.DOM_VK_RIGHT:
        if (isup) {
            var content = $('#' + id).next();
            if (content.length > 0) {
                $('#' + id).next().focus();
            } else {
                focus_id = $('#' + id).parent().attr("data-focus-down-level");
                console.log("focus_id = " + focus_id);
                if (focus_id) {
                    $('#' + focus_id).children(':eq(0)').focus();
                } else {
                    videoPageNext();
                }
            }
        }
        break;
    case KeyEvent.DOM_VK_UP:
        if (isup) {
            focus_id = $('#' + id).parent().attr("data-focus-up-level");
            var funStr = $('#' + id).parent().attr('data-focus-up-function');
            if (funStr) {
                eval(funStr);
            } else if (focus_id) {
                var index = id.charAt(id.length - 1);
                $('#' + focus_id).children(':eq(' + Number(index) % 3 + ')').focus();
            } else {
                focus_id = content.dataset.nextFocusUp;
                doFocus(focus_id);
            }
        }
        break;
    case KeyEvent.DOM_VK_DOWN:
        if (isup) {
            focus_id = $('#' + id).parent().attr("data-focus-down-level");
            if (focus_id) {
                var index = id.charAt(id.length - 1);
                var childrens = $('#' + focus_id).children();
                var max = childrens.length;
                if (max > 0) {
                    if (max > Number(index) % 3) {
                        childrens[Number(index) % 3].focus();
                    } else {
                        childrens[max - 1].focus();
                    }
                }
            } else {
                focus_id = content.dataset.nextFocusDown;
                doFocus(focus_id);
            }
        }
        break;
    
    }

}

function switchMusicMode(mode) {
    console.log("switchMusicMode");
    if (mode == musicObj.sortMode) {
        return;
    }
    waitLoading(true);
    clearThumbnail();
    initMusicMode(mode);
    waitLoading(false);
    reset_submenu_focus();
}

function initMusicMode(mode) {
    if(musicObj.usbPath != usbObj.USB_PATH){
        musicObj = new Music_obj();
    }
    musicObj.init(mode);
    $('#artistAlbum').attr('src','../Assets/Contents_Browser/_Music_Browser/MUSIC_AlbumLayout_default_icon.png');
    setSubmenuInfo($("#music_submenu_bar"), musicObj.pageInfo.submenuData);
    submenu_selected_id = "music_submenu_bar_"+musicObj.submenuSelectedIdx;
    initPageIndicator('music_page_indicator', musicObj.pageIndicatorNum);
    $($("#con_top_menu_0").find('.title_name')).html(getTranslate(musicObj.sortMode));
    if (MUSIC_TRACK_SORT == musicObj.sortMode) {
        $("#music_content_list").hide();
        $("#music_content_album").show();
        setTimeout(function(){setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
        if(!mode){music_content_focus();}},250);
    } else {
        $("#music_content_list").show();
        $("#music_content_album").hide();
        setMusicInfoList($('#music_list_ul'), musicObj.infoList);
        if(!mode){music_content_focus();}
    }
}

function music_album_focus(isFocus, id) {
    if (isFocus) {
        focus_level = 3;
        player_item_focus(false);
        var old_width = $("#" + id).width() / 2;
        var old_height = $("#" + id).outerHeight() / 2;
        var x = $("#" + id).offset().left - 31;
        var y = $("#" + id).offset().top + $("#" + id).height() / 2 - 97;
        $("#" + id).addClass('music_album_focus');
        $("#" + id).css('left', x + 'px');
        $("#" + id).css('top', y + 'px');
        if($('#'+id+'_img').attr('src') && $('#'+id+'_img').attr('src').indexOf("../") < 0){
            $('#'+id+'_img').css('width', '144px');
            $('#'+id+'_img').css('height', '144px');
        } else {
            $('#'+id+'_img').attr('src', '../Assets/Contents_Browser/_Music_Browser/music-icon-HL.png');
        }
        initColorKeyBar(musicColorKeyData);
        var index = new RegExp(/\d+$/).exec(id);
        musicObj.curFocusIndex = Number(index);
        var idex = musicObj.pageIndex * 9 + Number(index);
        $('#music_file_path').html(musicObj.infoList[idex].MEDIA_PATH.substring(musicObj.infoList[idex].MEDIA_PATH.lastIndexOf('/') + 1));
    } else {
        $("#" + id).removeClass('music_album_focus');
        if($('#'+id+'_img').attr('src') && $('#'+id+'_img').attr('src').indexOf("../") < 0){
            $('#'+id+'_img').css('width', '120px');
            $('#'+id+'_img').css('height', '120px');
        } else {
            $('#'+id+'_img').attr('src', '../Assets/Contents_Browser/_Music_Browser/music-icon-N.png');
        }
        $('#music_file_path').html('');
    }

}

function music_list_focus(isFcous, id) {
    var artistPhoto = $('#artistAlbum')[0];
    if (isFcous) {
        clearFocusTimeoutResult();
        focus_level = 3;
        player_item_focus(false);
        $('#' + id).addClass("focus");
        $($('#' + id).find('div')[0]).addClass("music_list_div_focus");
        
        var index = $('#' + id).index();
        musicObj.curFocusIndex = index;
        focusTimeoutResult = setTimeout("music_list_item_selected("+index+")", 800);

        marqueeObj.startScroll("p_"+id);
    } else {
        $('#' + id).removeClass("focus");
        $($('#' + id).find('div')[0]).removeClass("music_list_div_focus");
        $('#music_file_path').html('');
        marqueeObj.stopScroll();// clear when focus lost
    }
}

function music_list_item_selected(index){
    focusTimeoutResult = null;
    if(fileObj.usbList){
        if(fileObj.usbList.length>1){
            musicColorKeyData[3] = {"show":true,"name":"USB Device"};
        }else{
            musicColorKeyData[3] = {"show":true,"name":""};
        }
    }else{
        musicColorKeyData[3] = {"show":true,"name":""};
    }
    initColorKeyBar(musicColorKeyData);
    $('#music_file_path').html(musicObj.infoList[index].MEDIA_PATH.substring(musicObj.infoList[index].MEDIA_PATH.lastIndexOf('/') + 1));
    getThumbnail({MEDIA_PATH:musicObj.infoList[index].MEDIA_PATH,width:271,height:271,MEDIA_TYPE:musicObj.infoList[index].MEDIA_TYPE,id:'artistAlbum',needWait:false,defaultImg:"../Assets/Contents_Browser/_Music_Browser/MUSIC_AlbumLayout_default_icon.png"});

}

function getThumbnailByTypeAsync(obj, isVideo){

    var fileHandle = null;
    var ret = playbackInitWithPath({mediaPath:obj.MEDIA_PATH});
    if(ret == null || ret.STATUS != 0){
        if(ret){
            playbackDeinit(ret.HANDLE);
        }
        setTimeout(function(){setThumbnail();}, 50);
        return null;
    } else {
        if(thumbnailObj){
            thumbnailObj.pvTag = ret.PVTAG;
        }
        fileHandle = ret.HANDLE;
    }

    if(fileHandle){
        var res = playbackOperator(fileHandle, (isVideo ? playbackCommand.getThumbnailAsync : playbackCommand.getMp3CoverAsync), {width:obj.width,height:obj.height});

        return  fileHandle;
    }
    return null;
}

function getPhotoThumbnail(obj){
    var path = playbackImgGetThumbnail(obj.MEDIA_PATH, obj.width, obj.height);
    console.log("getPhotoThumbnail path = " + path);
    setTimeout(function(){
        if(path){
            setThumbnail(path);
        } else {
            setThumbnail();
        }
    }, 100);
}

function setThumbnailData(path, img){
    console.log("setThumbnailData img = " + img);
    BMP.load(path, bmpRender, img);
}

function bmpRender(bmp, imgObj) {
    console.log("bmpRender");
    var canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;

    var ctx = canvas.getContext("2d");
    var data = ctx.getImageData(0, 0, bmp.width, bmp.height);
    bmp.copyToImageData(data);
    ctx.putImageData(data, 0, 0);
    if(imgObj){
        imgObj.src = canvas.toDataURL("image/png");
    }
    playbackDeinit(thumbnailObj.thumbnailHandle);
    thumbnailObj = null;
    if(thumbnailList.length > 0){
        getThumbnail();
    }
    
}

var thumbnailObj = null;
var thumbnailList = [];

function clearPvTag(){
    if(thumbnailObj){
        thumbnailObj.pvTag = null;
    }
}

function clearThumbnail(){
    console.log("clearThumbnail");
    clearTimeout(deinitThumbnail_t);
    thumbnailList = [];
    endLoadingAnimate();
    if(thumbnailObj){
        var tempHandle = thumbnailObj.thumbnailHandle;
        thumbnailObj = null;
        if(tempHandle){
            playbackDeinit(tempHandle);
        }
    }
}

function getThumbnail(infoObj){
    if(typeof(infoObj) != 'undefined'){
        if(thumbnailObj){
            if(thumbnailObj.needWait){
                console.log("needWait && thumbnailHandle return");
                thumbnailList.push(infoObj);
                return;
            } else if(thumbnailObj.thumbnailHandle){
                clearTimeout(deinitThumbnail_t);
                playbackDeinit(thumbnailObj.thumbnailHandle);
                thumbnailObj = null;
                
            }
        } else if(thumbnailList.length > 0){
            console.log("thumbnailList.length > 0");
            thumbnailList.push(infoObj);
            return;
        }
    } else {
        console.log("typeof(infoObj) == 'undefined'");
        infoObj = thumbnailList.shift();
    }
    
    thumbnailObj = infoObj;
    switch(infoObj.MEDIA_TYPE){
        case 1:
        getPhotoThumbnail(infoObj);
        break;
        case 2:
        thumbnailObj.thumbnailHandle = getThumbnailByTypeAsync(infoObj, false);
        break;
        case 3:
        thumbnailObj.thumbnailHandle = getThumbnailByTypeAsync(infoObj, true);
        break;
    }
}

function setThumbnail(path){
    try{
    console.log("setThumbnail");
    if(typeof(path) == 'undefined'){
        console.log("typeof(path) == 'undefined'");
         if(thumbnailObj && thumbnailObj.defaultImg){
            console.log("setThumbnail thumbnailObj.defaultImg " + thumbnailObj.defaultImg);
            $('#'+thumbnailObj.id).attr('src', thumbnailObj.defaultImg);
         }
         if(thumbnailObj && thumbnailObj.thumbnailHandle){
            playbackDeinit(thumbnailObj.thumbnailHandle);
         }
         thumbnailObj = null;
         console.log("test log1");
         if(thumbnailList.length > 0){
            getThumbnail();
        } else {
            endLoadingAnimate();
        }
    } else {
        if(thumbnailObj){
            try {
                $('#'+thumbnailObj.id).attr('src', "file:///" + encodeURIComponent(path) + '?' + Math.random());
                if(thumbnailObj.MEDIA_TYPE == 2){
                    $('#'+thumbnailObj.id).css('width', thumbnailObj.width+'px');
                    $('#'+thumbnailObj.id).css('height', thumbnailObj.height+'px');
                }
            }catch(err) {
                console.log(err);      
                if(thumbnailObj.defaultImg){
                    $('#'+thumbnailObj.id).attr('src', thumbnailObj.defaultImg);
                    }
                }
        }

            if(thumbnailObj && thumbnailObj.thumbnailHandle){
                //var inst = thumbnailObj.thumbnailHandle;
                deinitThumbnail(thumbnailObj.thumbnailHandle);
                //deinitThumbnail_t = setTimeout('deinitThumbnail("'+inst+'")', 1000);
            } else {
                thumbnailObj = null;
                if(thumbnailList.length > 0){
                    getThumbnail();
                } else{
                    endLoadingAnimate();
                }
            }
            
        /*
        if(path.indexOf(".jpg") > 0){

        } else {
            console.log("setThumbnail setThumbnailData");
            console.log("document.getElementById(thumbnailObj.id) = " + document.getElementById(thumbnailObj.id));
            setThumbnailData(path, document.getElementById(thumbnailObj.id));
        }*/
        }
        
    }catch (e) {
        // TODO: handle exception
        console.log(e);
    }
}

var deinitThumbnail_t;
function deinitThumbnail(inst){
    console.log("deinitThumbnail");
    playbackDeinit(inst);
    thumbnailObj = null;
    if(thumbnailList.length > 0){
        getThumbnail();
    } else {
        endLoadingAnimate();
    }
}

function music_list_click(id) {
    $("#" + id).focus();
}

var lastContentFocusId;
function music_content_focus(refresh) {
    if(typeof(refresh) == 'undefined'){
        switch (top_menu_selected_id) {
        case 'top_menu_0':
        if (MUSIC_TRACK_SORT == musicObj.sortMode) {
            if (document.activeElement.id != "music_album_container_0") {
                $('#music_album_container_0').focus();
            }
        } else {
            $('#music_list_0').focus();
        }
        break;
        case 'top_menu_1':
        $('#video_item_0').focus();
        break;
        case 'top_menu_2':
        $('#photo_album_container_0').focus();
        break;
        case 'top_menu_3':
        $('#file_folder_ul li:first').focus();
        break;
        }
    } else if(refresh) {
        switch (top_menu_selected_id) {
        case 'top_menu_0':
        if (MUSIC_TRACK_SORT == musicObj.sortMode) {
            if(lastContentFocusId != -1 && lastContentFocusId != musicObj.pageIndex){
                setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
            }
            if (document.activeElement.id != ("music_album_container_"+musicObj.curFocusIndex)) {
                $('#music_album_container_'+musicObj.curFocusIndex).focus();
            }
        } else {
            if(lastContentFocusId >= 0){
                $('#music_list_'+lastContentFocusId).removeClass("selected");
            }
            $('#music_list_'+musicObj.curFocusIndex).focus();
        }
        break;
        case 'top_menu_3':
        removeDlnaMusicPlayStyle();
        $('#file_folder_ul li:nth-child('+(Number(fileObj.focusIndex)+1)+')').focus();
        break;
        }        
        lastContentFocusId = -1;
    } else {
        switch (top_menu_selected_id) {
        case 'top_menu_0':
        if (MUSIC_TRACK_SORT != musicObj.sortMode) {
            if(lastContentFocusId || lastContentFocusId == 0){
                $('#music_list_'+lastContentFocusId).removeClass("selected");
            }
            appendMusicInfoList($('#music_list_ul'), musicObj.infoList,Number($('#music_list_ul').find('li').length));
            if(lastContentFocusId >= 0){
                if(lastContentFocusId > musicObj.curFocusIndex){
                    srcollMusicList(musicObj.curFocusIndex, true);
                } else {
                    srcollMusicList(musicObj.curFocusIndex, false);
                }
            }
            $('#music_list_'+musicObj.curFocusIndex).addClass("selected");
            lastContentFocusId = musicObj.curFocusIndex;
        } else {
            if(lastContentFocusId != -1 && lastContentFocusId != musicObj.pageIndex){
                setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
            }
            lastContentFocusId = musicObj.pageIndex;
        }
        break;
        case 'top_menu_3':
        if(curBrowserType == BrowserType.Usb){
            console.log("fileObj.focusIndex = " + fileObj.focusIndex);
            try{
            if(lastContentFocusId || lastContentFocusId == 0){
                $('#file_folder_ul'+lastContentFocusId).removeClass("file_item_selected");
            }
            if(fileObj.infoList.length > Number($('#file_folder_ul').find('li').length)){
                console.log("fileObj.infoList > Number($('#file_folder_ul').find('li').length");
                 setFileInfoList('file_folder_ul',fileObj.infoList,Number($('#file_folder_ul').find('li').length));
            }
            if(lastContentFocusId >= 0){
                if(lastContentFocusId > fileObj.focusIndex){
                    fileScrollToElement(fileObj.focusIndex, true);
                } else {
                    fileScrollToElement(fileObj.focusIndex, false);
                }
            }
            $('#file_folder_ul'+fileObj.focusIndex).addClass("file_item_selected");
            lastContentFocusId = fileObj.focusIndex;
            }catch(e){
                console.log("music play next is error.");
                console.log(e);
            }
        } else {
            fileScrollToElement(fileObj.focusIndex, true);
            removeDlnaMusicPlayStyle();
            $('#file_folder_ul li:nth-child('+(fileObj.focusIndex+1)+')').addClass("file_item_selected");
        }
        break;
        }    
    }
}

var isDispatchToPlayer = false;

function play_pause_btn_focus() {
    console.log("play_pause_btn_focus");
    $('#music_play_btn').focus();
}

function player_item_focus(isFcous) {
    console.log("player_item_focus isFcous = " + isFcous);
    isDispatchToPlayer = isFcous;
}

function setMusicInfoList(target, musicList) {
    target.html('');
    for (var index in musicList) {
        var id = 'music_list_' + index;
        var pathName = musicList[index].MEDIA_PATH;
        title = pathName.substring(pathName.lastIndexOf('/') + 1);
        console.log("setMusicInfoList title = " + title);
        var musicItem = $('<li id="' + id + '" tabindex = "0" onfocus=\'music_list_focus(true, "' + id + '");\'  onblur=\'music_list_focus(false, "' + id + '");\' >\
        <div >\
        </div>\
        <div style="display: inline;overflow: hidden;position: absolute;width: 350px;text-align: left;">\
        <p class=\'music_name_p\' id="p_' + id + '">' + eval(Number(index) + 1) + "." + title + '</p>\
        </div>\
        <p  class=\'music_duration_p\'>' + timeFormat(musicList[index].DURATION) + '</p>\
        </li>');
        musicItem.appendTo(target);
    }
    
    scroll.refresh();
}

function appendMusicInfoList(target, musicList, startIndex) {
    for(var index = startIndex; index<musicList.length;index++ ){
        var id = 'music_list_' + index;
        var pathName = musicList[index].MEDIA_PATH;
        title = pathName.substring(pathName.lastIndexOf('/') + 1);
        console.log("appendMusicInfoList title = " + title);
        target.append('<li id="' + id + '" tabindex = "0" onfocus=\'music_list_focus(true, "' + id + '");\'  onblur=\'music_list_focus(false, "' + id + '");\' >\
        <div >\
        </div>\
        <div style="display: inline;overflow: hidden;position: absolute;width: 350px;text-align: left;">\
        <p class=\'music_name_p\' id="p_' + id + '">' + eval(Number(index) + 1) + "." + title + '</p>\
        </div>\
        <p  class=\'music_duration_p\'>' + timeFormat(musicList[index].DURATION) + '</p>\
        </li>')
    }
    scroll.refresh();
}

function setMusicInfoAlbum(target, musicList) {
    target.html('')
    var rowItem = null ;
    var targetId = target.attr("id") + '_';
    var index = 0;
    for (var i = (musicObj.pageIndex * 9); (i < ((musicObj.pageIndex + 1) * 9) && i < musicList.length) ; i++) {
        console.log("setMusicInfoAlbum index =" + index);
        if (index >= 9)
            rerurn;
        if (rowItem == null ) {
            console.log("setMusicInfoAlbum rowItem =" + index);
            var rowId = 'row_' + (index / 3);
            var rowItem = $('<div id="' + rowId + '" class="row" style="height:156px;"></div>')
        }
        var id = targetId + index;
        
        var pathName = musicList[i].MEDIA_PATH;
        title = pathName.substring(pathName.lastIndexOf('/') + 1);
        console.log("setMusicInfoAlbum title = " + title);
        var data = '<div class="music_album_layout">' 
        + '<div id="' + id + '" tabindex="0" onfocus=\'music_album_focus(true, "' + id + '");\' onblur=\'music_album_focus(false, "' + id + '");\' style="height:inherit">' 
        + '<div class="music_album_title"><table style=\'width: 100%;height: 100%;\'><tr><td style="padding: 0px;text-align: center;">' 
        + '<img id="'+id+'_img" src="../Assets/Contents_Browser/_Music_Browser/music-icon-N.png"/>'
        + '</td></tr></table></div>' 
        + '<div class="music_album_content">'
        + '<p >' + title + '</p>' 
        + '<p>' + musicList[i].ARTIST + '</p>' 
        + '<p >' + timeFormat(musicList[i].DURATION) + '</p></div></div></div>'
        var content = $(data);
        content.appendTo(rowItem);
        if ((index + 1) % 3 == 0) {
            rowItem.appendTo(target);
            rowItem = null ;
        }
        getThumbnail({MEDIA_PATH:musicList[i].MEDIA_PATH,width:120,height:120,MEDIA_TYPE:2,id:id+'_img',needWait:true,defaultImg:"../Assets/Contents_Browser/_Music_Browser/music-icon-N.png"});
        index++;
    }
    
    if (rowItem) {
        rowItem.appendTo(target);
    }

}

function music_list_key_dispatch(isup, e) {
    console.log("music_list_key_dispatch id = " + e.target.id);
    var id = e.target.id;
    if (id == "") {
        return;
    }
    var keynum = e.which || e.keyCode;
    var content;
    
    switch (keynum) {
    case KeyEvent.DOM_VK_UP:
        content = $(e.target).prev();
        if (content.length > 0) {
            srcollMusicList(content.index(), true);
            content.focus();
        } else if(musicPlayObj.curDisplayMode <= musicDisplayMode.fullPlay) {
            reset_submenu_focus();
        }
        break;
    case KeyEvent.DOM_VK_PLAY:
    case KeyEvent.DOM_VK_RETURN:
        var index = $(e.target).index();
        contentBrowserObj.playMusic(musicObj, null, (KeyEvent.DOM_VK_PLAY == keynum));
        
        break;
    case KeyEvent.DOM_VK_DOWN:
        var index = $(e.target).index();
        if(index+1 >= musicObj.totalNum){
            if (musicPlayObj.curDisplayMode > musicDisplayMode.fullPlay) {
                musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
            }
        } else {
            if(((index+2)%10) == 0 && (musicObj.infoList.length < musicObj.totalNum)){
                var strIndex = musicObj.infoList.length;
                musicObj.getOnePageInfo();
                appendMusicInfoList($('#music_list_ul'), musicObj.infoList, strIndex);
                scroll.refresh();
            }
            content = $(e.target).next();
            if (content.length > 0) {
                srcollMusicList(content.index(), false);
                content.focus();
            }
        }
        break;
    
    }
}

function srcollMusicList(scrollIndex, isUp){

    var ret = scrollStep(document.querySelector('#music_list_layout li:nth-child(' + (Number(scrollIndex) + 1) + ')'), scroll);
    if(isNaN(ret)){
        $('#music_list_ul li:nth-child('+(Number(scrollIndex) - ret+1)+')').css('color','gray');
        $('#music_list_ul li').eq(scrollIndex + (10-ret)).css('color','gray');
        $('#music_list_ul li:lt('+(scrollIndex + (10-ret))+')li:gt('+(scrollIndex - ret<0?0:(scrollIndex - ret))+')').css('color','white');
    }
}

function musicAlbumPage(left) {
    if (left) {
        if (musicObj.pageIndex > 0) {
            musicObj.setPageIndex(musicObj.pageIndex-1);
            setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
            $('#music_album_container_0').focus();
        }
    } else {
        if ((musicObj.pageIndex + 1) * 9 < musicObj.totalNum) {
            musicObj.setPageIndex(musicObj.pageIndex+1);
            musicObj.getOnePageInfo();
            setMusicInfoAlbum($('#music_album_container'), musicObj.infoList);
            $('#music_album_container_0').focus();
        }
    }
    setPageIndicator('music_page_indicator', musicObj.pageIndex);
}

function album_key_dispatch(isup, e) {
    console.log("album_key_dispatch id = " + e.target.id);
    var id = e.target.id;
    if (id == "") {
        return;
    }
    var index = new RegExp(/\d+$/).exec(id);
    var total_num;
    var row_num;
    var container_id;
    
    switch (top_menu_selected_id) {
    case 'top_menu_0':
        container_id = "music_album_container";
        var total_num = $('#' + container_id).find('.music_album_layout').length;
        row_num = 3;
        break;
    case 'top_menu_2':
        container_id = "photo_album_container";
        var total_num = $('#' + container_id).find('.photo_album_layout').length;
        row_num = 7;
        break;
    }
    
    
    var keynum = e.which || e.keyCode;
    var param = '';
    switch (keynum) {
    case KeyEvent.DOM_VK_PLAY:
    if(musicPlayObj.curDisplayMode != musicDisplayMode.none){
        musicPlayObj.music_player_key_dispatch(isup, e);
        return;
    }
    case KeyEvent.DOM_VK_RETURN:
        if (row_num == 3) {
            console.log('$(e.target).parent().index() = ' + index);
            contentBrowserObj.playMusic(musicObj, null, (KeyEvent.DOM_VK_PLAY == keynum));
        } else {
            if(thumbnailList.length > 0){
                return;
            }
            photoObj.needRefresh  = false;
            //var pageInfo = '{"pageId":"'+top_menu_selected_id+'","curPageObj":'+JSON.stringify(photoObj)+'}';
            //$("input[name='page_info']").val(pageInfo);
            //console.log('$(e.target).parent().index() = ' + index);
            //goToLocation('./content_browser_photo_player.html?index=' + (photoObj.pageIndex * 21 + Number(index))+param);
            contentBrowserObj.playPhoto(photoObj, (KeyEvent.DOM_VK_PLAY == keynum));
        }
        
        
        break;
    case KeyEvent.DOM_VK_LEFT:
        index = Number(index) - 1;
        if (index >= 0) {
            $('#' + container_id + '_' + index).focus();
        } else {
            if (row_num == 3) {
                musicAlbumPage(true);
            } else {
                photoPage(true);
            }
        }
        
        break;
    case KeyEvent.DOM_VK_RIGHT:
        index = Number(index) + 1;
        console.log("index = " + index);
        if (index < total_num) {
            console.log("index1 = " + index);
            $('#' + container_id + '_' + index).focus();
        } else {
            if (row_num == 3) {
                musicAlbumPage(false);
            } else {
                photoPage(false);
            }
        }
        break;
    case KeyEvent.DOM_VK_UP:
        var row_index = $(e.target).parent().parent().index() - 1;
        if (row_index >= 0) {
            index = row_index * row_num + $(e.target).parent().index();
            $('#' + container_id + '_' + index).focus();
        } else {
            if (row_num == 3) {
                if (musicPlayObj.curDisplayMode <= musicDisplayMode.fullPlay) {
                    reset_submenu_focus();
                }
            } else {
                reset_submenu_focus();
            }
        
        }
        break;
    case KeyEvent.DOM_VK_DOWN:
        var row_index = $(e.target).parent().parent().index() + 1;
        if (row_index * row_num < total_num) {
            index = row_index * row_num + $(e.target).parent().index();
            if (index < total_num) {
                $('#' + container_id + '_' + index).focus();
            } else if (new RegExp(/\d+$/).exec(id) != (total_num - 1)) {
                $('#' + container_id + '_' + (total_num - 1)).focus();
            }
        } else {
            if (musicPlayObj.curDisplayMode > musicDisplayMode.fullPlay) {
                musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
            }
        }
        
        break;
    
    }
}

function doFocusByClassName(className) {
    
    if (className) {
        $('.' + className).focus();
    }

}

function switchPhotoMode(mode) {
    console.log("switchPhotoMode");
    if (mode == photoObj.sortMode) {
        return;
    }
    photoObj.sortMode = mode;
    //waitLoading(true);
    clearThumbnail();
    startLoadingAnimate();
    setTimeout(function(){initPhotoMode(mode);},100);
}

function initPhotoMode(mode, refresh) {
    if(typeof(refresh) == 'undefined'){
        photoObj.init(mode);
    }
    var name = getTranslate(photoObj.sortMode);
    $($("#con_top_menu_2").find('.title_name')).html(name);
    setphotoInfo($('#photo_album_container'), photoObj.infoList);
    setSubmenuInfo($('#photo_submenu_bar'), photoObj.pageInfo.submenuData);
    submenu_selected_id = "photo_submenu_bar_"+photoObj.submenuSelectedIdx;
    initPageIndicator('photo_page_indicator', photoObj.pageIndicatorNum, photoObj.pageIndex);
    waitLoading(false);
    if(typeof(mode) == 'undefined'){
        reset_submenu_focus();
    }
    if(typeof(refresh) == 'undefined'){
        $('#photo_submenu_bar').children(':eq('+photoObj.submenuSelectedIdx+')').addClass('selected');
        music_content_focus();
    }
}


function photo_content_focus() {
    $('#photo_album_container_0').focus();
}

function Photo_album_focus(isFocus, id) {
    console.log("Photo_album_focus isFocus = " + isFocus+";id = " + id);
    var index = new RegExp(/\d+$/).exec(id);
    var idex = photoObj.pageIndex * 21 + Number(index);
    if (isFocus) {
        focus_level = 3;
        var x = $("#" + id).offset().left + 66 - 97;
        var y = $("#" + id).offset().top + 66 - 97;
        $("#" + id).removeClass('photo_album_bg');
        $("#" + id).addClass('photo_album_focus_bg');
        $("#" + id).css('left', x + 'px');
        $("#" + id).css('top', y + 'px');
        
        if(fileObj.usbList){
            if(fileObj.usbList.length>1){
                photoColorKeyData[3] = {"show":true,"name":"USB Device"};
            }else{
                photoColorKeyData[3] = {"show":true,"name":""};
            }
        }else{
            photoColorKeyData[3] = {"show":true,"name":""};
        }
        initColorKeyBar(photoColorKeyData);
        $('#photo_file_path').html(photoObj.infoList[idex].MEDIA_PATH.substring(photoObj.infoList[idex].MEDIA_PATH.lastIndexOf('/') + 1));
        photoObj.curFocusIndex = index;
        //setImage(id, photoObj.infoList[idex], 144);
        if($('#'+id+'_img').attr('src') && $('#'+id+'_img').attr('src').indexOf("../") < 0){
            $('#'+id+'_img').css('width', '144px');
            $('#'+id+'_img').css('height', '144px');
        }
    } else {
        $("#" + id).removeClass('photo_album_focus_bg');
        $("#" + id).addClass('photo_album_bg');
        $("#" + id).css('left', 0 + 'px');
        $("#" + id).css('top', 0 + 'px');
        $('#photo_file_path').html('');
        //setImage(id, photoObj.infoList[idex], 120);
        if($('#'+id+'_img').attr('src') && $('#'+id+'_img').attr('src').indexOf("../") < 0){
            $('#'+id+'_img').css('width', '120px');
            $('#'+id+'_img').css('height', '120px');
        }
    }

}

function photoPage(left) {
    if (left) {
        if (photoObj.pageIndex > 0) {
            photoObj.setPageIndex(photoObj.pageIndex-1);
            setphotoInfo($('#photo_album_container'), photoObj.infoList);
            $('#photo_album_container_0').focus();
        }
    } else {
        if ((photoObj.pageIndex + 1) * 21 < photoObj.totalNum) {
            photoObj.setPageIndex(photoObj.pageIndex+1);
            photoObj.getOnePageInfo();
            setphotoInfo($('#photo_album_container'), photoObj.infoList);
            $('#photo_album_container_0').focus();
        }
    }
    setPageIndicator('photo_page_indicator', photoObj.pageIndex);
}

function setphotoInfo(target, photoList) {
    if(photoList && photoList.length>0){
        startLoadingAnimate();
    }
    
    target.html('')
    var rowItem = null ;
    var targetId = target.attr("id") + '_';
    var index = 0;
    for (var i = (photoObj.pageIndex * 21); (i < ((photoObj.pageIndex + 1) * 21) && i < photoList.length) ; i++) {
        if (index >= 21)
            return;
        if (rowItem == null ) {
            console.log('row_ index =' + index);
            var rowId = 'row_' + (index / 7);
            var rowItem = $('<div id="' + rowId + '" class="row" style="height: 155px;margin:0 auto;"></div>')
        }
        
        var img = drawImage(photoList[i], 120);
        
        var id = targetId + index;
        var data = '<div class="photo_album_layout"><div id=\'' + id + '\' class="photo_album_bg" tabindex=\'0\' onfocus=\'Photo_album_focus(true, "' + id + '");\' onblur=\'Photo_album_focus(false, "' + id + '");\'>\
                    <table style=\'width: 100%;height: 100%;\'><tr><td style="padding: 0px;text-align: center;">' 
        + '<img id="' + id + '_img" onerror="javascript:this.style.width=\'104px\';this.style.height=\'89px\';this.src=\'../Assets/Contents_Browser/_Photo_Browser/Picture_icon.png\'" />' + 
        '</td></tr></table></div></div>'
        var content = $(data);
        content.appendTo(rowItem);
        getThumbnail({MEDIA_PATH:photoList[i].MEDIA_PATH,width:120,height:120,MEDIA_TYPE:1,id:id+'_img',needWait:true,defaultImg:"../Assets/Contents_Browser/_Photo_Browser/Picture_icon.png"});
        if (eval(parseInt(index) + 1) % 7 == 0) {
            rowItem.appendTo(target);
            rowItem = null ;
        }
        index++;
    }
    if (rowItem) {
        rowItem.appendTo(target);
    }

}

function drawImage(photoMeteData, width) {
    var iwidth, iheight;
    var style = '';
    if (photoMeteData.WIDTH > 0 && photoMeteData.HEIGHT > 0) {
        if (photoMeteData.WIDTH / photoMeteData.HEIGHT >= 1) {
            if (photoMeteData.WIDTH > width) {
                iwidth = width;
                iheight = (photoMeteData.HEIGHT * width) / photoMeteData.WIDTH;
            } else {
                iwidth = photoMeteData.WIDTH;
                iheight = photoMeteData.HEIGHT;
            }
        } else {
            if (photoMeteData.HEIGHT > width) {
                iheight = width;
                iheight = (photoMeteData.WIDTH * iheight) / photoMeteData.HEIGHT;
            } else {
                iwidth = photoMeteData.WIDTH;
                iheight = photoMeteData.HEIGHT;
            }
        }
        style = 'style="width:' + iwidth + 'px;height:' + iheight + 'px;"';
    }
    
    return '<img ' + style + ' onerror="javascript:this.style.width=\'104px\';this.style.height=\'89px\';this.src=\'../Assets/Contents_Browser/_Photo_Browser/Picture_icon.png\'" src=\'' + photoMeteData.MEDIA_PATH + '?' + Math.random()+ '\'/>';
}

function setImage(id, photoMeteData, width) {
    
    if($("#" + id).find('img').length <= 0) {
        return;
    }
    var target = $($("#" + id).find('img'));
    var iwidth, iheight;
    if (photoMeteData.WIDTH > 0 && photoMeteData.HEIGHT > 0) {
        if (photoMeteData.WIDTH / photoMeteData.HEIGHT >= 1) {
            if (photoMeteData.WIDTH > width) {
                iwidth = width;
                iheight = (photoMeteData.HEIGHT * width) / photoMeteData.WIDTH;
            } else {
                iwidth = photoMeteData.WIDTH;
                iheight = photoMeteData.HEIGHT;
            }
        } else {
            if (photoMeteData.HEIGHT > width) {
                iheight = width;
                iheight = (photoMeteData.WIDTH * iheight) / photoMeteData.HEIGHT;
            } else {
                iwidth = photoMeteData.WIDTH;
                iheight = photoMeteData.HEIGHT;
            }
        }
        target.css('width', iwidth + 'px');
        target.css('height', iheight + 'px');
    }
}

function setFileMetedata(target, metedata) {
    target.html('');
    var content = $('<div class=\'file_img_layout\'><img src=\'../Assets/Contents_Browser/Folder_Album_Art_Box.png\'/></div>' 
    + '<p>Title:' + metedata.title + '</p>' 
    + '<p>Artist:' + metedata.artist + '</p>' 
    + '<p>Genre:' + metedata.Genre + '</p>' 
    + '<p>Duration:' + metedata.duration + '</p>');
    content.appendTo(target);
}

/*Deal with Color key */
function handleCommonKey(e) {
    console.log("handleCommonKey");
    if('top_menu_3' == top_menu_selected_id){
        handleFileCommonKey(e);
        return;
    }
    var keynum = e.which || e.keyCode;
    switch (keynum) {
    case KeyEvent.DOM_VK_INFO:
        handleInfoAndRedKey(true);
        break;
    case KeyEvent.DOM_VK_BACK:
        handleBackKey();
        break;
    case KeyEvent.DOM_VK_RED:
        handleInfoAndRedKey(false);
        //play all
        break;
    case KeyEvent.DOM_VK_GREEN:
        handleGreenKey();
        //sort
        break;
    case KeyEvent.DOM_VK_YELLOW:
        if (isDialogShow()) {
            closeDialog();
            return;
        }
        getUsbList();
        break;
    case KeyEvent.DOM_VK_BLUE:
        // 跳转到help界面
        goToHelpPage();
        break;
    case KeyEvent.DOM_VK_OPTION:
        handleOptionKey();
        break;
    case KeyEvent.DOM_VK_STOP:
    case KeyEvent.DOM_VK_PAUSE:
    case KeyEvent.DOM_VK_FAST_FWD:
    case KeyEvent.DOM_VK_REWIND:
        if (musicPlayObj.curDisplayMode != musicDisplayMode.none) {
            musicPlayObj.handleMusicPlayerKey(event);
        }
        break;
    case KeyEvent.DOM_VK_LIST:
        if(isDialogShow()){
            closeDialog();
        }
        if (focus_level == 3) {
            reset_submenu_focus();
        } else if (focus_level == 2) {
            reset_top_menu_focus();
        } 
    break;
    case KeyEvent.DOM_VK_TRACK_NEXT:
    case KeyEvent.DOM_VK_CH_INCREASE: //CH+
    handleCHKey(false,e);
    break;
    case KeyEvent.DOM_VK_TRACK_PREV:
    case KeyEvent.DOM_VK_CH_DECREASE: //Ch-
    handleCHKey(true,e);
    break;
    }
}

function handleCHKey(isPrev, e){
    if(focus_level != 3){
        return;
    }
    var index = $(e.target).index();
    if(isPrev){
        switch (top_menu_selected_id) {
            case "top_menu_0":
            if (MUSIC_TRACK_SORT == musicObj.sortMode) {
                musicAlbumPage(true);
            } else {
                 if(musicObj.curFocusIndex > 0){
                    var tempIndex = musicObj.curFocusIndex >= 10 ? (musicObj.curFocusIndex - 10) : 0;
                    srcollMusicList(tempIndex, true);
                    $('#music_list_ul li:nth-child(' + (Number(tempIndex) + 1)+ ')').focus();
                }               
            }
            break;
            case "top_menu_1":
            videoPagePrevious();
            break;
            case "top_menu_2":
            photoPage(true);
            break;
            case "top_menu_3":
            if(fileObj.focusIndex > 0){
                var tempIndex = fileObj.focusIndex >= 10 ? (fileObj.focusIndex - 10) : 0;
                fileScrollToElement(tempIndex, true);
                $('#file_folder_ul li:nth-child(' + (Number(tempIndex) + 1)+ ')').focus();
            }
            break;
        }
    } else {
        switch (top_menu_selected_id) {
            case "top_menu_0":
            if (MUSIC_TRACK_SORT == musicObj.sortMode) {
                musicAlbumPage(false);
            } else {
               if(musicObj.infoList.length < musicObj.totalNum){
                    var strIndex = musicObj.infoList.length;
                    musicObj.getOnePageInfo();
                    appendMusicInfoList($('#music_list_ul'), musicObj.infoList, strIndex);
                    scroll.refresh();
                }
                var tempIndex = index+10;
                srcollMusicList(tempIndex, false);
                $('#music_list_ul li:nth-child(' + (Number(tempIndex) + 1)+ ')').focus();
            }
            break;
            case "top_menu_1":
            videoPageNext();
            break;
            case "top_menu_2":
            photoPage(false);
            break;
            case "top_menu_3":
            console.log("top_menu_3");
            if( fileObj.infoList && fileObj.infoList.length && (fileObj.infoList.length < fileObj.totalNum)){
                var strIndex = fileObj.infoList.length;
                fileObj.getOnePageInfo();
                setFileInfoList('file_folder_ul', fileObj.infoList, strIndex);
                scroll1.refresh();
            }
            
            fileScrollToElement(Number(index + 10), false);
            $('#file_folder_ul li:nth-child(' + (Number(index + 10) + 1)+ ')').focus();
            break;
        }
    }
}

function initColorKeyBar(data) {
    var showCount = 0;
    for (index in data) {
        var content = $('#footer').find('li')[index];
        var text = $(content).text();
        var htmltext = $(content).html();
        var html = htmltext.substring(0, htmltext.lastIndexOf(text));
        if (data[index].show) {
            content.style.display = '';
            var tempname = getTranslate(data[index].name);
            //$(content).html(html + data[index].name);
            $(content).html(html + tempname);
            showCount++;
        } else {
            content.style.display = 'none';
            $(content).html(html);
        }
    }
    $($('#footer').find('ul')).css('width', 190 * showCount + "px");
}

function setItemColorKey(content, value){
    console.log("setItemColorKey value = " + value);
    var text = $(content).text();
    console.log("text = " + text);
    var htmltext = $(content).html();
    var html = htmltext.substring(0, htmltext.lastIndexOf(text));
    $(content).html(html+getTranslate(value));
}

function handleInfoAndRedKey(infoKey) {
    var text = $($('#footer').find('li')[infoKey ? 0 : 1]).text();
    console.log('text = ' + text);
    if (infoKey && isDialogShowById('metedata_dialog')) {
        closeDialog();
        return;
    } else if (text == '') {
        return;
    }
    closeDialog();
    var index;
    var id = document.activeElement.id;
    switch (top_menu_selected_id) {
    case "top_menu_0":
        if (MUSIC_TRACK_SORT == musicObj.sortMode) {
            var idex = new RegExp(/\d+$/).exec(id);
            index = musicObj.pageIndex * 9 + Number(idex);
        } else {
            index = $(document.activeElement).index();
        }
        if (infoKey) {
            var path = musicObj.infoList[index].MEDIA_PATH;
            var type = musicObj.infoList[index].MEDIA_TYPE;
            var media_info = usbObj.getContentInfoByPath(type, path);
            showMusicMetedataDialog(media_info);
        } else {
            contentBrowserObj.playMusic(musicObj, null, true);
            showMusicBottombar();
        }
        
        
        break;
    case "top_menu_1":
        index = videoObj.pageIndex * 6 + Number(id.charAt(id.length - 1));
        var pathName = videoObj.infoList[index].MEDIA_PATH;
        var title = pathName.substring(pathName.lastIndexOf('/') + 1);
        if (infoKey) {
             var content = '<tr><td>'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + title + '</td></tr>\
                    <tr><td >'+ getTranslate("Size")+'</td><td>' + bytesToMb(videoObj.infoList[index].SIZE) + '</td></tr>\
                    <tr><td>'+ getTranslate("Date")+'</td><td>' + getFormatDateVideo(videoObj.infoList[index]) + '</td></tr>';
            showMetedataDialog("Video", content);
        } else {
            //var pageInfo = '{"pageId":"'+top_menu_selected_id+'","curPageObj":'+JSON.stringify(videoObj)+'}';
            //$("input[name='page_info']").val(pageInfo);
            //goToLocation(get_content_browser_player_url() + '?'+encodeURI('filePath=' + $('#' + id).attr('data-path') + '&title=' + title));
            if(thumbnailList.length > 0){
                return;
            }
            videoObj.needRefresh  = false;
            contentBrowserObj.playVideo(videoObj, null, true);
            
        }
        
        break;
    case "top_menu_2":
        var idex = new RegExp(/\d+$/).exec(id);
        index = photoObj.pageIndex * 21 + Number(idex);
        var pathName = photoObj.infoList[idex].MEDIA_PATH;
        var mediaType = photoObj.infoList[idex].MEDIA_TYPE;
        var media_info = usbObj.getContentInfoByPath(mediaType, pathName);
        var title = pathName.substring(pathName.lastIndexOf('/') + 1);
        var date = media_info.DATE.YEAR + "/" + media_info.DATE.MONTH + "/" + media_info.DATE.DAY;
        var size = media_info.WIDTH + "x" + media_info.HEIGHT;
        if (infoKey) {
             var content = '<tr><td>'+ getTranslate("Title")+'</td><td style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + title + '</td></tr>\
                    <tr><td>'+ getTranslate("Date")+'</td><td>' + date + '</td></tr>\
                    <tr><td>'+ getTranslate("Size")+'</td><td>' + size + '</td></tr>';
            showMetedataDialog("Photo", content);
        } else {
            //index = new RegExp(/\d+$/).exec(id);
            //var pageInfo = '{"pageId":"'+top_menu_selected_id+'","curPageObj":'+JSON.stringify(photoObj)+'}';
            //$("input[name='page_info']").val(pageInfo);
            //goToLocation('./content_browser_photo_player.html?playStatus=true&index=' + (photoObj.pageIndex * 21 + Number(index)));
            if(thumbnailList.length > 0){
                return;
            }
            photoObj.needRefresh  = false;
            contentBrowserObj.playPhoto(photoObj, true);
        }
        
        break;
    }
}

function handleBackKey() {
    //back
    if(isDialogShow()){
        closeDialog();
        return;
    }
    switch (top_menu_selected_id) {
    case "top_menu_0":
        if (musicPlayObj.curDisplayMode > musicDisplayMode.fullPlay) {
            musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.fullPlay);
        } else if(document.activeElement.id == "top_menu_0"){
            if(musicPlayObj.curDisplayMode == musicDisplayMode.fullPlay){
                $('#music_play_btn').focus();
                focus_level = 3;
                musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
                return ;
            }
        } else if (focus_level == 3) {
            reset_submenu_focus();
        } else if (focus_level == 2) {
            reset_top_menu_focus();
        }
        break;
    case "top_menu_1":
    case "top_menu_2":
        if (focus_level == 3) {
            reset_submenu_focus();
        } else if (focus_level == 2) {
            reset_top_menu_focus();
        }
        
        break;
    case "top_menu_3":
    if(curBrowserType == BrowserType.Usb){
        if (musicPlayObj.curDisplayMode > musicDisplayMode.fullPlay) {
            musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.fullPlay);
        }else if(document.activeElement.id == "top_menu_3"){
            if(musicPlayObj.curDisplayMode == musicDisplayMode.fullPlay){
                $('#music_play_btn').focus();
                focus_level = 3;
                musicPlayObj.switchDisMusicplayerMode(musicDisplayMode.simplePlay);
                return ;
            }
        } else {
            fileBackKeyHandle();
        }    
    } else {
        if (musicPlayObj.curDisplayMode != musicDisplayMode.none) {
            musicPlayObj.stopMusic(true);
        } else {
            fileBackKeyHandle();
        }
    }
    break;
    }
}

function handleGreenKey() {
    // sort
    var text = $($('#footer').find('li')[2]).text();
    console.log('text = ' + text);
    if (isDialogShowById('colorkey_dialog_2')) {
        closeDialog();
        return;
    } else if (text == '') {
        return;
    }
    closeDialog();
    color_focus_bg = color_focus_bg_list[1];
    switch (top_menu_selected_id) {
    case "top_menu_0":
        //music sort
        var listContent = "";
        var focusIndex = 0;
        for (i in colorList = ALL_SORT_DATA.Music) {
            var id = "color_bar_list_" + i;
            if(musicObj.sortMode == colorList[i]){
                focusIndex = i;
            }
            listContent += '<li tabindex="1" id="' + id + '" onfocus="color_bar_item_focus(true,\'' + id + '\');" onblur="color_bar_item_focus(false,\'' + id + '\');" data-key-enter="switchMusicMode(\'' + colorList[i] + '\');" style=\'line-height:40px;font-size:26px;margin-left: 24px; margin-right: 24px;outline:none;border:none;\'>' + getTranslate(colorList[i]) + '</li>'
        }
        showColorKeyDialog(2, listContent, colorList.length, focusIndex);
        
        break;
    
    case "top_menu_2":
        //photo sort
        var listContent = "";
        var focusIndx = 0;
        for (i in colorList = ALL_SORT_DATA.Photo) {
            var id = "color_bar_list_" + i;
            if(photoObj.sortMode == colorList[i]){
                focusIndx = i;
            }
            listContent += '<li tabindex="1" id="' + id + '" onfocus="color_bar_item_focus(true,\'' + id + '\');" onblur="color_bar_item_focus(false,\'' + id + '\');" data-key-enter="switchPhotoMode(\'' + colorList[i] + '\');" style=\'line-height:40px;font-size:26px;margin-left: 24px; margin-right: 24px;outline:none;border:none;\'>' + getTranslate(colorList[i]) + '</li>'
        }
        showColorKeyDialog(2, listContent, colorList.length,focusIndx);
        break;
    }
}

function handleOptionKey() {
    var text = $($('#footer').find('li')[5]).text();
    console.log('text = ' + text);
    if (isDialogShowById('option_dialog')) {
        closeDialog();
        return;
    } else if (text == '') {
        return;
    }
    closeDialog();
    switch (top_menu_selected_id) {
    case "top_menu_0":
        showOptionDialog("Music");        
        break;
    case "top_menu_1":
        showOptionDialog("Movie");
        break;
    case "top_menu_2":
        showOptionDialog("Photo");
        break;
    }
}

function initPageIndicator(targetId, total_num, index) {
    console.log("initPageIndicator num = " + total_num);
    $('#' + targetId).html('');
    for (var i = 0; i < total_num; i++) {
        $('#' + targetId).append("<li class='page_indicator_li'>");
    }
    $('#' + targetId).css('width', 24 * total_num + 'px');
    index = (typeof(index) == 'undefined') ? 0 : index;
    $($('#' + targetId).find('li')[index]).css('background', 'url(./img/Page_Indicator_HL.png)');
    setPagebumpers(index, total_num);
}

function setPageIndicator(targetId, index) {
    var list = $('#' + targetId).find('li');
    for (var i = 0; i < list.length; i++) {
        $(list[i]).css('background', 'url(./img/Page_Indicator_N.png)');
    }
    $(list[index]).css('background', 'url(./img/Page_Indicator_HL.png)');
    setPagebumpers(index, list.length);
}

function setPagebumpers(index, total_num) {
    var left_id;
    var right_id;
    switch (top_menu_selected_id) {
    case "top_menu_0":
        if (MUSIC_TRACK_SORT == musicObj.sortMode) {
            left_id = 'album-bumpers-left';
            right_id = 'album-bumpers-right';
        } else {
            left_id = 'list-bumpers-left';
            right_id = 'list-bumpers-right';
        }
        break;
    case "top_menu_1":
        left_id = 'movie-bumpers-left';
        right_id = 'movie-bumpers-right';
        break;
    case "top_menu_2":
        left_id = 'photo-bumpers-left';
        right_id = 'photo-bumpers-right';
        
        break;
    }
    
    displayfunc((index > 0) ? true : false, left_id);
    displayfunc((index < total_num - 1) ? true : false, right_id);

}

function displayfunc(isShow, id) {
    console.log("isShow = " + isShow + ";id = " + id);
    if (isShow) {
        $('#' + id).show();
    } else {
        $('#' + id).hide();
    }
}

var timeFormat = function(isMillisecond) {
    var seconds = isMillisecond/1000;
    if (seconds >= 3600) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60) < 10 ? "0" + Math.floor((seconds % 3600) / 60) : Math.floor((seconds % 3600) / 60);
        var s = ((seconds % 3600) % 60) < 10 ? "0" + Math.floor((seconds % 3600) % 60) : Math.floor((seconds % 3600) % 60);
        return h + ":" + m + ":" + s;
    } else {
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    }

};

function bytesToMb(bytes) {
    if (bytes === 0)
        return '0 Mb';
    var num = (bytes / Math.pow(1024, 2));
    var dot = String(num).indexOf(".");
    if (dot != -1) {
        if (String(num).length - dot > 2) {
            num = num.toFixed(2);
        }
    }
    return num + ' ' + 'Mb';
}

function scrollStep(el, scrollObj, needScroll) {
    if(!el){
        return;
    }
    el = el.nodeType ? el : scrollObj.scroller.querySelector(el);
    var offsetY;
    var screenIdx;

    if ( !el || !el.offsetHeight) {
        return ;
    }

    var elPos = $(el).offset();
    var scrollPos = $(scrollObj.scroller).offset();
    var wrapperOffset = $(scrollObj.wrapper).offset();
    
    if(elPos.top >= wrapperOffset.top && (elPos.top+el.offsetHeight) <= (wrapperOffset.top+scrollObj.wrapper.offsetHeight)){
        if(needScroll && 0 == scrollObj.y){
            scrollObj.scrollTo(0, -40, 0);
            screenIdx = Math.floor((elPos.top - wrapperOffset.top)/el.offsetHeight);
        } else {
            screenIdx = Math.floor((elPos.top - wrapperOffset.top)/el.offsetHeight)+1;
        }
        return screenIdx;
    }
    if(elPos.top < wrapperOffset.top){
        offsetY = false;
    } else {
        offsetY = true;
    }

    scrollPos.left -= wrapperOffset.left;
    scrollPos.top  -= wrapperOffset.top;        

    var pos = {left:0,top:0};
    if(offsetY){
        if(elPos.top+el.offsetHeight > wrapperOffset.top+scrollObj.wrapper.offsetHeight){
            var index = Math.ceil((elPos.top+el.offsetHeight - wrapperOffset.top-scrollObj.wrapper.offsetHeight) / el.offsetHeight);
            pos.top = scrollPos.top - (index*el.offsetHeight) - 20;
        }
        screenIdx = 9;
    } else {
        if(elPos.top<wrapperOffset.top){
            var index = Math.ceil((wrapperOffset.top - elPos.top) / el.offsetHeight);
            pos.top = scrollPos.top + (index*el.offsetHeight) - 20;
        } else {
            pos.top = scrollPos.top;
        }
        screenIdx = 1;
    }
    
    pos.left = pos.left > 0 ? 0 : pos.left < scrollObj.maxScrollX ? scrollObj.maxScrollX : pos.left;
    //pos.top  = pos.top  > 0 ? 0 : ((pos.top  >= (scrollObj.maxScrollY + 20)) ? scrollObj.maxScrollY : pos.top);
    scrollObj.scrollTo(pos.left, pos.top, 0);
    return screenIdx;
}