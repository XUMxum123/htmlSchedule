var GLOBAL_MODE="EU";
window.mtvuiUtil = {
    "base_url":"",
    "sys_key_record": [],
    "sys_log_record": [],
    "sys_log_div": null,
    "getBaseURL": function () {
        if (!this.base_url) {
            var res = window.location.href.match(/.*\/html[^\/]*\//);
            this.base_url = (res.length > 0) ? res[0] : "";
        }
        return this.base_url;
    },
    "getChannelLogoSrc": function (iconIdx) {
        if (!this.mtvObj)
            this.mtvObj = new MtvObj();
        return this.mtvObj.getChannelLogoPath(iconIdx);
    },
    "max_log_len": 100,
    "log": function (msg) {return this.log_inner(msg);},
    "log_inner": function () {
        var callstack = Error().stack.split("\n");
        var prefix = "";
        if (callstack.length >= 4)
            prefix += callstack[3].replace(/.*\[as (.+)\].*/,'[$1] ');
        if (callstack.length >= 5)
            prefix += callstack[4].replace(/ +at /,'').replace(mtvuiUtil.getBaseURL(), '');
        var s = prefix + " ";
        try {
            for (i in arguments)
                s += JSON.stringify(arguments[i]) + ",";
            s = s.slice(0,-1);
        } catch(e) {
            s += "(error happen)";
        }

        while (mtvuiUtil.sys_log_record.length > this.max_log_len)
            mtvuiUtil.sys_log_record.shift();
        mtvuiUtil.sys_log_record.push(s);
        if (mtvuiUtil.sys_log_div) {
            mtvuiUtil.sys_log_div.scrollTop = mtvuiUtil.sys_log_div.scrollHeight;
            mtvuiUtil.sys_log_div.append($('<p/>').text(s));
            $(mtvuiUtil.sys_log_div).scrollTop($(mtvuiUtil.sys_log_div).get(0).scrollHeight);
        }
    },
    "debugTrigger": {
        "1": {"left":0,                               "top": parseInt(window.innerHeight/3*2),
              "width":window.innerWidth,              "height":parseInt(window.innerHeight/3)},
        "2": {"left":0,                               "top": 0,
              "width":window.innerWidth,              "height":parseInt(window.innerHeight/3)},
        "3": {"left":0,                               "top": 0,
              "width":parseInt(window.innerWidth/3),  "height":window.innerHeight},
        "4": {"left":parseInt(window.innerWidth/3*2), "top": 0,
              "width":parseInt(window.innerWidth/3),  "height":window.innerHeight},
        "5": {"left":0,                               "top": 0,
              "width":window.innerWidth,              "height":window.innerHeight}
    },
    "addDebugTrigger": function () {
        for (i in arguments) {
            if (arguments[i])
                this.debugTrigger[i] = arguments[i];
            else
                delete(this.debugTrigger[i]);
        }
    },
    "delDebugTrigger": function () {
        for (i in arguments) {
            delete(this.debugTrigger[i]);
        }
    },
    "activeDebugDiv": function () {
        if (!this.sys_log_div) {
            this.sys_log_div = $('<div style="z-index:9999;position:absolute;overflow:auto;'
                                 +'color:rgba(255,0,0,0.8);background:rgba(0,0,0,0.2);'
                                 +'word-wrap:break-word;"></div>');
            for (i in this.sys_log_record)
                this.sys_log_div.append("<p>" + this.sys_log_record[i]+"</p>");
            this.sys_log_div.appendTo($("body"));
        }
    },
    "deactiveDebugDiv": function () {
        if (this.sys_log_div) {
            this.sys_log_div.remove();
            this.sys_log_div = null;
        }
    },
    handleErr:function (msg,url,l){
        try{
            getTvJspService().utility.print_log(0, 'error:'+msg+";"+url+":"+l);
        }catch(e){
            
        }
        return false;
    },
    "replaceConsole": function () {
        var funs = ["error", "warr", "info", "log"];
        // try to save the original function
        for (i in funs) {
            if (!console["o" + funs[i]]) {
                console["o" + funs[i]] = console[funs[i]];
                console[funs[i]] = (function(fn){
                    return function() {
                        var callstack = Error().stack.split("\n");
                        var prefix = "";
                        if (callstack.length >= 4)
                            prefix += callstack[3].replace(/.*\((.*)\).*/,'$1');
            
                            var s = prefix + " ";
                            try {
                                for (i in arguments)
                                	if(typeof arguments[i] == 'object')
                                    	s += JSON.stringify(arguments[i]) + ",";
                                    else
                                    	s += arguments[i] + ",";
                            } catch(e) {
                                s += "(error happen)";
                            }
                        //mtvuiUtil.log_inner.apply(mtvuiUtil.log_inner, arguments);
                        var level = 1;
                        switch(fn){
                        	case "info":
                        	level = 0;
                        	break;
                        	case "log":
                        	level = 1;
                        	break;                       	
                        	case "warr":
                        	level = 2;
                        	break;
                        	case "error":
                        	level = 3;
                        	break;
                        }
                        try{
                            getTvJspService().utility.print_log(level, s);
                        }catch(e){
                            
                        }
                        console["o" + fn].apply(console, [s]);
                        //console["o" + fn].apply(console, arguments);
                    }
                })(funs[i]);
            }
        }
    },
    "keyHookProc": function (key) {
        var ch = null;
        if (!key || !(ch = String.fromCharCode(key)))// not valiad
            return true;
        while (this.sys_key_record.length > 8)
            this.sys_key_record.shift();
        if (this.sys_key_record.length == 8) {
            if ((new Date()).toISOString().replace(/[^\d]/g, '').slice(4,12)
                == this.sys_key_record.join("")) {
                if ("0" == ch) {
                    this.deactiveDebugDiv();
                }
                else {
                    arg = this.debugTrigger[ch];
                    if (!arg)
                        return true;
                    this.replaceConsole();
                    this.activeDebugDiv();
                    if (this.sys_log_div) {
                        this.sys_log_div.offset(arg);
                        this.sys_log_div.width(arg.width);
                        this.sys_log_div.height(arg.height);
                    }
                }
            }
        }
        this.sys_key_record.push(ch);
        return true;
    },
    getSysPageInfo: function (pageID) {
        for(var i in mtvuiUtil.sys_page_list) {
            var item = mtvuiUtil.sys_page_list[i];
            if(item.PageID == pageID || item.id == pageID)
                return item;
        }
        return null;
    },
    getCurrentPageInfo: function () {
        if (!this.currentpageInfo ) {
            var page_url = window.location.href;
            this.currentpageInfo = mtvuiUtil.sys_page_list[0];
            // get the longest matched url
            for (var pg in mtvuiUtil.sys_page_list) {
                if (page_url.indexOf(mtvuiUtil.sys_page_list[pg].url) == 0
                    && mtvuiUtil.sys_page_list[pg].url.length > this.currentpageInfo.url.length)
                    this.currentpageInfo = mtvuiUtil.sys_page_list[pg];
            }
        }
        return this.currentpageInfo;
    },
	dtvServiceAction:function (isStartTv) {
		try {
		var tvJspObj = getTvJspService();

		if (tvJspObj && tvJspObj.utility) {
				tvJspObj.utility.notifyHtmlUIStatus('{"dtvServiceAction":"'
															+ (isStartTv ? "native_service_select" : "native_service_stop")
															+ '"');
			}
		}catch(err) {console.log(err);}
	},
    isZiggoOrNorOperator:function () {
        // Slice/stv_api/inc/sapi_config.h
        // 0xFF310046, Configitem_Custom_IsEPGMuteAudio MakeCustomConfigValue(All, Bool, 70)
        var cfgItem = 0xFF310046;
        var res = getTvServices().getConfigBool('{"PARAMETER":{"cfgItem":'+cfgItem+',"REQUEST":"QUERY"}}');
        if (res) {
            var tmp = JSON.parse(res);
            if (tmp.ITEMS[0].valueInt == 1) { // Ziggo Operator
                return true;
            }
        }

        res = getTvServices().getCountry();
        if (res) {
            var cn = JSON.parse(res);
            var country = cn.ITEMS[0].TEXT;
            if (country == "NOR") { // Noway
                 var ch_current = getTvServices().getCurrentChannelInfo();
				var ch = JSON.parse(ch_current);
                if ( ch.ITEMS[0] && ch.ITEMS[0].BRDCST_TYPE == 2) { // DVB only
				    //var b_tunerBsSrc = getTvServices().getDtvTunerBsSrc();
					var b_tunerType = JSON.parse(getTvServices().getDtvTunerType());
					var b_tunerTypeValue = b_tunerType.ITEMS[0].VALUE;
                    if ( (ch.ITEMS[0].BARKER_MASK != 1) && (b_tunerTypeValue == 0) ) { // None Barker channel && DVB-T,// && (b_tunerBsSrc == 0) )
                        return true;
                    }
                }
            }
        }
        return false;
    },
    doPageMute: function(mute){
        if(mute){
            var res = getTvServices().getVolumeMute();
            var	ret = JSON.parse(res);
            var muteStatus = ret.ITEMS[0].VALUE;
            if(!muteStatus){
                getTvServices().setVolumeMute(1);
                localStorage.setItem('pvr_epg_mute', 1);
            }
        } else {
            if(localStorage.getItem('pvr_epg_mute') == '1'){
                getTvServices().setVolumeMute(0);
            }
            localStorage.setItem('pvr_epg_mute', 0);
        }
    },
    sendPageID: function (doAction) {
        var pageInfo = this.getCurrentPageInfo();
        if (pageInfo) {
            if(getTvServices() && !this.isFramed()){
				var res = getTvServices().getVolumeMute();
			    var	ret = JSON.parse(res);
				var AmuteStatus = ret.ITEMS[0].VALUE; //value = 1 is muted by boradcast RC KEY
                if(pageInfo.PageID == "HTML5_UI_PAGE_PVR" || (pageInfo.PageID == "HTML5_UI_PAGE_INPUT_EPG" && !this.isInternetTvGuide())){
					if (this.isZiggoOrNorOperator() == false) {
						// Disable audio port to mute audio, if current operator is not Ziggo or country is not NOR
						this.doPageMute(true);
						//getTvServices().setConfigValue('{"PARAMETER":{"cfgItem":154271748,"valueInt":0, "REQUEST":"SET"}}');
					}

                } else {
                    if(typeof(doAction) == 'undefined' || doAction){
                        if(pageInfo.PageID == "HTML5_UI_PAGE_CONTENTBROWSER"){

                             if (this.isZiggoOrNorOperator() == false) {
                            	 var mtvObjRaw = new MtvObjRaw();
                                 /* add the event listener first */
                                 mtvObjRaw.addEventListener('ConfigUpdateNotify', function (status) {
                                     var obj = JSON.parse(status);
                                     if (obj.ITEMS[0].ID == 10)  /* "10" --ACFG_MSG_CONTENT_BROWSER_STOP_DTV_SVC_READY */
                                     {
                                        // The stop TV service is async mode, so need listen notify then to enable audio port!!
                                        mtvuiUtil.doPageMute(false);
                                        //getTvServices().setConfigValue('{"PARAMETER":{"cfgItem":154271748,"valueInt":1, "REQUEST":"SET"}}');
                                     }
                                 });
                            }

                            this.dtvServiceAction(false);
                        }
                    }
                }
			}
            try {
		 if(this.getParentPageID().indexOf('sys_content_browser') >=0 && this.isFramed()){
			 return;
		 }
                var tvJspObj = getTvJspService();
                if (tvJspObj && tvJspObj.utility)
                    tvJspObj.utility.notifyHtmlUIStatus('{"PageID":"'
                                                        + pageInfo.PageID
                                                        + '", "Status":"Show"}');
            }
            catch(err) {console.log(err);}
            console.log("got page id: " + pageInfo.PageID);
        }
    },
    isFramed: function () {
        return window.top.location != window.self.location;
    },
    _getHistoryDBName: function () {
        return  this.isFramed() ? "mtvuiPageInfoDB" : "mtvuiPageInfoDBFrame";
    },
    getHistoryDB: function () {
        var dbStr = getParameterByName(this._getHistoryDBName());
        return dbStr ? JSON.parse(dbStr) : [];
    },
    createHistoryDB: function (newPageID) {
        var db = this.getHistoryDB();
        var idx = db.indexOf(newPageID);
        var ret = [];
        if (idx >= 0) {
            var curInfo = this.getCurrentPageInfo();
            var curPageID = curInfo ? curInfo.id : "sys_index";
            ret = db.slice(0, idx);
        }
        else
            db.push(newPageID);
        return db;
    },
    getPageInfo: function (idx) {
        var db = this.getHistoryDB();
        idx = Math.abs(parseInt(idx));
        if (db && db.length > 0 && db.length > idx) {
            return this.getSysPageInfo(db[idx]);
        }
        return this.getSysPageInfo("sys_index");
    },
    getParentPageID: function () {
        return getParameterByName("parentPageID");
    },
    storeFocus: function () {
        this._focusObj = $(":focus");
    },
    restoreFocus: function () {
        if (this._focusObj)
            this._focusObj.focus();
    },
	messageListener:null,
    cmdListener: function (evt) {
        if (evt.type === 'message') {
            var obj = null;
            if (evt && evt.data && (obj = JSON.parse(evt.data))) {
                if (obj.type == "command" && obj.action == "quitMenu") {
                    mtvuiUtil.hideMenu();
                    mtvuiUtil.sendPageID(false); // send the page ID again.
                } else {
					if(mtvuiUtil.messageListener)
						mtvuiUtil.messageListener(evt.data);
				}
            }
        }
    },
    exitMenu: function () {
        if (this.isFramed())
            window.parent.postMessage(JSON.stringify({type:"command", action:"quitMenu"}), '*');
    },
	selectSource: function () {
        if (this.isFramed()){
			if((window.top.location.protocol + '//' + window.top.location.pathname) == (get_base_url() + "ContentBrowser/content_browser.html")){
				window.parent.postMessage(JSON.stringify({type:"command", action:"selectSource"}), '*');
				return true;
			}
		}
		return false;
    },
    showMenu: function (pageID, parentPageID) {
        var res = this.getSysPageInfo(pageID);
        if (!res)
            return false;
        this.storeFocus();      // store focus first

        var url = res.url + (parentPageID ? "?parentPageID=" + parentPageID : "");
        if (!this._menuFrame) {
            window.addEventListener('message', this.cmdListener, false);

            this._menuFrame = $('<iframe tabindex="-1" allowtransparency="true" frameborder="0" style="position:absolute; left:0; right:0; width: 100%; height: 100vh; z-index:10000; display:none;"></iframe>');
            this._menuFrame.appendTo($("body"));
        }

        this._menuFrame.attr("src", url);
        this._menuFrame.show();
        this._menuFrame.focus();
        return true;
    },
    hideMenu: function () {
        if (this._menuFrame) {
            this._menuFrame.hide();
            this._menuFrame.attr("src", '');
            this.restoreFocus();
        }
    },
    isMenuShow: function(){
    	if (this._menuFrame && !this._menuFrame.is(":hidden")){
    		return true;
    	}
    	return false;
    },
    procSysKey: function  (key, callback) {
        var nextPageInfo = null;
        for (var i in this.sys_page_list) {
            if (this.sys_page_list[i].keycode.indexOf(key) >= 0) {
                nextPageInfo = this.sys_page_list[i];
                break;
            }
        }
        if (!nextPageInfo && key == KeyEvent.DOM_VK_BACK)
            nextPageInfo = this.getPageInfo(-1);

        if (!nextPageInfo)       // key not found
            return true;

        var curPageInfo = this.getCurrentPageInfo() || this.getSysPageInfo("sys_index");

        if (nextPageInfo == curPageInfo)
            nextPageInfo = this.getPageInfo(-1) || this.getSysPageInfo("sys_index");

        if (this.isFramed()) {
            var parentID = this.getParentPageID();
            if (nextPageInfo.id == parentID)
                this.exitMenu();
            else
                this.gotoSysPage(nextPageInfo.id);
        }
        else {                  // not framed
            if ((curPageInfo.PageID == "HTML5_UI_PAGE_CONTENTBROWSER"
                 || curPageInfo.PageID == "HTML5_UI_PAGE_PVR")
                && (nextPageInfo.PageID == "HTML5_UI_PAGE_DASH"
                    || nextPageInfo.PageID == "HTML5_UI_PAGE_INPUT_SOURCE")) {
                this.showMenu(nextPageInfo.id, curPageInfo.id);
            }
            else {
                if (typeof callback === 'function')
                    callback();
                this.gotoSysPage(nextPageInfo.id);
            }
        }
        return false;
    },
    getNetTvStatus: function () {
        if (!this.mtvObj)
            this.mtvObj = new MtvObj();
        // check the NetTV is active
        var ConfigItem_Misc_IsNettvAlive = 136380434;
        return this.mtvObj.acfgGetConfigItemBool(ConfigItem_Misc_IsNettvAlive) > 0;
    },
    get3rdAppStatus: function() {
        if (!this.mtvObj)
            this.mtvObj = new MtvObj();
        // check the 3rd app (eg: NetFlix ...) is running
        return this.mtvObj.acfgGetConfigValue("g_misc__3rd_app_running_status");
    },
    isInternetTvGuide: function() {
        if (!this.mtvObj)
        	this.mtvObj = new MtvObj();
	    var val = this.mtvObj.acfgGetConfigValue("g_misc__tv_guide_from_network");
	    if (val == 1) {
	        return true;
    	}
    	return false;
	},
    reinstallTv:function(){
        var mmpServices = getCBMmpService();
        var res = mmpServices.getMountPointList();
        if(res){
            res = JSON.parse(res);
            res = res.ITEMS;
            for (idx in res){
                mmpServices.deleteMmpStopInfo(res[idx].PATH);
            }
        }
    },
    getMarqueeNameByParam: function (regionWidth, offsetWidth) {
        if (offsetWidth <= 0
            || regionWidth <= 0
            || offsetWidth <= regionWidth )
            return null;
        var s = 1;
        var n = Math.round(10 * (offsetWidth - regionWidth) / regionWidth / s + 1) * s;
        return "marquee" + n;
    },
    makeMarquee: function (jqElem) {
        $.each(jqElem, function (ck, cv) {
            var elem = $(cv);
            var width = elem.width();
            if (width < elem.get(0).scrollWidth) {
                var cwidth = elem.get(0).clientWidth; // use clientWidth for more excactly.
                $.each(elem.find("span"), function (k, v) {
                    $(v).css("white-space", "nowrap");
                    var mcname = mtvuiUtil.getMarqueeNameByParam(cwidth, v.offsetWidth);
                    if (mcname) {
                        elem.addClass("marqueeContainer");
                        $(v).addClass(mcname);
                    }
                });
            }
        });
    }
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function get_base_url() {
    return mtvuiUtil.getBaseURL();
}

function get_content_browser_player_url(){
    return get_base_url() + "ContentBrowser/content_browser_player.html";
}

// "keycode": for hot key,
// "id":      the identical,
// "PageID":  PageID send to html5_comp
mtvuiUtil.sys_page_list = [
    {"keycode":[KeyEvent.DOM_VK_GHOST, KeyEvent.DOM_VK_NUMPAD0],
     "id": "sys_index",
     "PageID": "HTML5_UI_PAGE_SYS_INDEX",
     "url": get_base_url() + "index.html"},
    {"keycode":[KeyEvent.DOM_VK_EXIT, KeyEvent.DOM_VK_NUMPAD6],
     "id": "sys_show_tv",
     "PageID": "HTML5_UI_PAGE_SYS_INDEX",
     "url": get_base_url() + "index.html?action=show_tv"},
    {"keycode":[KeyEvent.DOM_VK_NUMPAD3],
     "id": "sys_channel_zapper",
     "PageID": "HTML5_UI_PAGE_CHANNEL_ZAPPER",
     "url": get_base_url() + "channel_zapper/channel_change_osd.html"},
    {"keycode":[KeyEvent.DOM_VK_MENU, KeyEvent.DOM_VK_NUMPAD2],
     "id": "sys_dashboard",
     "PageID": "HTML5_UI_PAGE_DASH",
     "url": get_base_url() + "dash/index.html"},
    {"keycode":[],
     "id": "sys_utilities",
     "PageID": "HTML5_UI_PAGE_UTILITIES",
     "url": get_base_url() + "utilities/utilities.html"},
    {"keycode":[KeyEvent.DOM_VK_LIST],
     "id": "sys_channel_matrix",
     "PageID": "HTML5_UI_PAGE_CHANNEL_MATRIX",
     "url": get_base_url() + "channel_matrix/index.html"},
    {"keycode":[],
     "id": "sys_content_browser",
     "PageID": "HTML5_UI_PAGE_CONTENTBROWSER",
     "url": get_base_url() + "ContentBrowser/content_browser.html"},
    {"keycode":[KeyEvent.DOM_VK_GUSB],
     "id": "sys_content_browser_usb",
     "PageID": "HTML5_UI_PAGE_CONTENTBROWSER",
     "url": get_base_url() + "ContentBrowser/content_browser.html?action=browse_usb"},
    {"keycode":[],
     "id": "sys_content_browser_network",
     "PageID": "HTML5_UI_PAGE_CONTENTBROWSER",
     "url": get_base_url() + "ContentBrowser/content_browser.html?action=browse_network"},
     {"keycode":[],
     "id": "sys_content_browser_player",
     "PageID": "HTML5_UI_PAGE_CONTENTBROWSER",
     "url": get_base_url() + "ContentBrowser/content_browser_player.html"},
    {"keycode":[KeyEvent.DOM_VK_RECORD,KeyEvent.DOM_VK_NUMPAD1],
     "id": "sys_program_record",
     "PageID": "HTML5_UI_PAGE_RECORDING",
     "url": get_base_url() + "recording/recording.html"},
    {"keycode":[],
     "id": "sys_page_pvr",
     "PageID": "HTML5_UI_PAGE_PVR",
     "url": get_base_url() + "pvr/pvr.html"},
    {"keycode":[KeyEvent.DOM_VK_INPUT_SOURCE, KeyEvent.DOM_VK_NUMPAD7],
     "id": "sys_input_source",
     "PageID": "HTML5_UI_PAGE_INPUT_SOURCE",
     "url": get_base_url() + "input_source/input_source.html"},
    {"keycode":[KeyEvent.DOM_VK_EPG, KeyEvent.DOM_VK_NUMPAD8],
     "id": "sys_page_epg",
     "PageID": "HTML5_UI_PAGE_INPUT_EPG",
     "url": get_base_url() + "epg/index.html"},
    {"keycode":[KeyEvent.DOM_VK_NUMPAD9],
     "id": "sys_tv_info",
     "PageID": "HTML5_UI_PAGE_NOWNEXTINFO",
     "url": get_base_url() + "epg/nownextinfo.html"},
    {"keycode":[KeyEvent.DOM_VK_GQUICKSETTINGS],
     "id": "sys_qucik_settings",
     "PageID": "HTML5_UI_PAGE_QUICK_SETTINGS",
     "url": get_base_url() + "QuickSettings/index.html"}
];

mtvuiUtil.gotoSysPage = function (sysPageID) {
    var item = this.getSysPageInfo(sysPageID);
    if (!item)
        return false;

    if(sysPageID == 'sys_channel_matrix'){
     	var obj = new MtvObjRaw();
     	var pvrStatus = obj.isRecording();
     	if(pvrStatus == 1){
     		return true;
     	}
    }

    var argIdx = 1;             // skip sysPageID
    var topJump;
    if (typeof arguments[argIdx] === 'boolean')
        topJump = arguments[argIdx ++];
    else // follow pages would be menu, do self jump, others do top jump
        topJump = (["sys_index",
                    "sys_dashboard",
                    "sys_input_source"].indexOf(item.id) < 0);
    var params = "";
    if (typeof arguments[argIdx] === 'object')
        params = $.param(arguments[argIdx++]);
    else if (typeof arguments[argIdx] === 'string')
        params = arguments[argIdx++];

    if (!topJump) {
        var parentID = this.getParentPageID();
        if (parentID)
            params += (params ? "&" : "") + "parentPageID=" + parentID;
    }

    if (params)
        params = (item.url.indexOf("?") > 0 ? "&" : "?") + params;

    var newUrl = item.url + params;

    var pageInfo = this.getCurrentPageInfo();
    if ( (pageInfo.PageID == "HTML5_UI_PAGE_PVR") || (pageInfo.PageID == "HTML5_UI_PAGE_INPUT_EPG") ) {
        if (item.PageID == "HTML5_UI_PAGE_CONTENTBROWSER") {
            // Keep mute state then Let's ContenBrowser to unmute.
            // This case can to avoid short sound output when switch to ContentBrowser with play PVR file in PVR List!!
            //newUrl += "&audio_state=mute";
        } else if ( ((pageInfo.PageID == "HTML5_UI_PAGE_PVR") && (item.PageID == "HTML5_UI_PAGE_INPUT_EPG")) ||
              ((pageInfo.PageID == "HTML5_UI_PAGE_INPUT_EPG") && (item.PageID == "HTML5_UI_PAGE_PVR")) ){
            // Keep mute state when swith from epg to pvr
        } else if (this.isZiggoOrNorOperator() == false){
            // Enable audio port to unmute audio, except ContentBrowser
            this.doPageMute(false);
            //getTvServices().setConfigValue('{"PARAMETER":{"cfgItem":154271748,"valueInt":1, "REQUEST":"SET"}}');
        }
    } else if (pageInfo.PageID == "HTML5_UI_PAGE_CONTENTBROWSER"){
        if (this.isZiggoOrNorOperator() == false){
            if ( (item.PageID == "HTML5_UI_PAGE_PVR") || (item.PageID == "HTML5_UI_PAGE_INPUT_EPG" && !this.isInternetTvGuide()) ) {
                // Keep mute state when swith from epg to pvr
                // Disable audio port to mute audio, if current operator is not Ziggo or country is not NOR
                this.doPageMute(true);
                //getTvServices().setConfigValue('{"PARAMETER":{"cfgItem":154271748,"valueInt":0, "REQUEST":"SET"}}');
            }
        }
    }

    if (topJump){
    	 window.top.location = newUrl;
    } else {
		if (mtvuiUtil.isFramed() && (sysPageID == "sys_index")) {
            mtvuiUtil.exitMenu();
        } else {
        	window.location = newUrl;
        }
    }

    return true;
};

function get_sys_page_by_key (key) {
    //if ( "Win32" != navigator.platform)
    if (!mtvuiUtil.keyHookProc(key))
        return null;
    var res = $.grep(mtvuiUtil.sys_page_list, function (item) {
        return (item.keycode.indexOf(key) >= 0);
    });
    return res.length ? res[0] : null;
}

var getTvJspService = function () {
    if (!window.tvJspService) {
        window.tvJspService = new TV_JSP();
    }
    return window.tvJspService;
};

function getCBMmpService() {
    if (!window.mmpServices) {
        try {
            var tvjsp = getTvJspService();
            window.mmpServices = tvjsp.mmpServices;
        } catch(err) {console.log(err);}

        if (!window.mmpServices) {
            try {window.mmpServices = new MmpServices();}
                 catch(err) {console.log(err);}
        }
    }
    return window.mmpServices;
}

function getTvServices() {
    if (!window.tvServices) {
        try {
            var tvjsp = getTvJspService();
            window.tvServices = tvjsp.tvServices;
        } catch(err) {console.log(err);}

    }
    return window.tvServices;
}

window.dmrUtil = {
	dlnaDmrHandle:null,
	dlnaDmrInit:function (){
		res = mmpServices.dlnaDmrInit('');
		if(res){
			res = JSON.parse(res);
			return res.ITEMS[0].instance;
		}
		return null;
	},
	startDlnaDmr:function (){
		console.log("startDlnaDmr");
		mmpServices.addEventListener('DlnaDmrNotify', this.dmrNotifyFunc);
		this.dlnaDmrHandle = this.dlnaDmrInit();
	},
	stopDlnaDmr:function (){
		console.log("stopDlnaDmr dlnaDmrHandle");
		mmpServices.removeEventListener('DlnaDmrNotify', this.dmrNotifyFunc);
		if(this.dlnaDmrHandle){
			var arg = '{"PARAMETER":{"instance":'+this.dlnaDmrHandle+',"REQUEST":"SET"}}';
			mmpServices.dlnaDmrDeinit(arg);
			this.dlnaDmrHandle = null;
		}
	},
	dmrNotifyCallback:null,
	dmrNotifyFunc:function (jsonStr){
		console.log("dmrNotifyFunc jsonStr= " + jsonStr);
		if(dmrUtil.dmrNotifyCallback){
			dmrUtil.dmrNotifyCallback(jsonStr);
			return;
		}
		var dmrNotify = JSON.parse(jsonStr);
		for(index in dmrNotify.ITEMS){
			dmrItem = dmrNotify.ITEMS[index];
			var type = Number(dmrItem.TYPE);
			switch(type){
				case 0:
				window.location = get_base_url() + "ContentBrowser/content_browser.html?" + encodeURI("action=dmr_play&params="+jsonStr);
				break;
			}
		}
	},
	dlnaIpChange:function (){
		console.log("dlnaIpChange");
		mmpServices.dlnaDmsDeinit('');
		mmpServices.dlnaDmsInit('');
		var dmrValue = this.getConfig(1, 'g_misc__dmr_2nd_device');
		if(dmrValue == 1){
			this.stopDlnaDmr();
			this.startDlnaDmr();
		}
	},
	networkNotifyCallback:null,
	networkNotifyFunc:function (jsonStr){
		if(dmrUtil.networkNotifyCallback){
			dmrUtil.networkNotifyCallback(jsonStr);
		}
		var netNotify = JSON.parse(jsonStr);
		for(index in netNotify.ITEMS){
			netItem = netNotify.ITEMS[index];
			switch(netItem.ID){
				case 2://unplugin
				case 3://ipchange
				setTimeout("dmrUtil.dlnaIpChange()", 100);
				break;
			}
		}
	},
	getConfig:function(type, itemId){
		switch(type){
			case 1:
			try {
					var res = tvServices.getConfigValue('{"PARAMETER":{"cfgId":"'+itemId+'","REQUEST":"QUERY"}}');
					if (res) {
						var tmp = JSON.parse(res);
						return tmp.ITEMS[0].valueInt;
					}
			}
			catch(err) {
				console.log(err);
			}
			return -1;
			break;
			case 2:
			try {
				var res = tvServices.getConfigString('{"PARAMETER":{"cfgId":"'+itemId+'","REQUEST":"QUERY"}}');
				if (res) {
					var tmp = JSON.parse(res);
					return tmp.ITEMS[0].valueString;
				}
			}
			catch(err) {
				console.log(err);
			}
			return null;
			break;
		}
	},
	dmrStateSync:function(notifyTypestate){
		if(this.dlnaDmrHandle){
			var arg = '{"PARAMETER":{"instance":'+this.dlnaDmrHandle+',"playState":'+notifyTypestate+',"value":"","url":"","REQUEST":"SET"}}';
			ret = mmpServices.dlnaDmrSyncPlayState(arg);
			console.log("dmrStateSync ret = "+ ret);
		}
	},
	configUpdateNotifyCallback:null,
	configUpdateNotifyFunc:function (jsonStr){
		console.log("configUpdateNotifyFunc jsonStr= " + jsonStr);
		if(dmrUtil.configUpdateNotifyCallback){
			setTimeout(function(){dmrUtil.configUpdateNotifyCallback(jsonStr);}, 10);
		}
		var configNotify = JSON.parse(jsonStr);
		for(index in configNotify.ITEMS){
			configItem = configNotify.ITEMS[index];
			if(configItem.ID == -1){
				if(configItem.ARG2 == 'g_misc__dmr_2nd_device'){
					dmrUtil.switchDmr();
				} else if(configItem.ARG2 == 'g_misc__tv_network_name'){
					dmrUtil.dmrStateSync(21);
				}
			}
		}
	},
	switchDmr:function(){
		getCBMmpService();
		getTvServices();
        var mtvObjRaw = new MtvObjRaw();
		mtvObjRaw.addEventListener('ConfigUpdateNotify', this.configUpdateNotifyFunc);
		tvServices.addEventListener('NetworkNotify', this.networkNotifyFunc);
		var dmrValue = this.getConfig(1, 'g_misc__dmr_2nd_device');
		if(dmrValue == 1){
			this.startDlnaDmr();
		} else {
			this.stopDlnaDmr();
		}
	},
	removeListener:function(){
		mmpServices.removeEventListener('DlnaDmrNotify', this.dmrNotifyFunc);
	},
	getUILang:function () {
		try {
			var lang = tvServices.getGuiLanguage('');
			if (lang){
				lang = JSON.parse(lang);
				if(lang && 0 == lang.STATUS){
					console.log("get lang::::"+lang.ITEMS[0].TEXT.toUpperCase());
					return lang.ITEMS[0].TEXT.toUpperCase();
				}
			}
		}
		catch(err) { console.log(err);}
		return 'ENG';
	},
	usbRedaerString: function () {
        var ret = "USB memory device reading files...";
        try {
            var mtvObjRaw = new MtvObjRaw();
            var str = mtvObjRaw.getLangString("USB_DETECT_DLG_INFO");
            ret = str || ret;
        } catch(e) {console.log(e);}
        return ret;
    },
    getSuperShopDemoCount: function(path){
        var ret = 0;
        var paramObj = {'PATH':path,'TYPE':6,'REQUEST':'QUERY'};
        var arg = {};
        arg.PARAMETER = paramObj;
        res = mmpServices.getUsbScanDbCount(JSON.stringify(arg));
        if(res){
            var countInfo = JSON.parse(res);
            ret = parseInt(countInfo.ITEMS[0].COUNT);
        }
        return ret;
    }
};

var usbDetectNotifyFunc = null;

var onUsbDetect = function(jsonStr){
					console.log("jsonStr = " + jsonStr);
					var usbNotify = JSON.parse(jsonStr);
					if(usbNotify.URI != '/tv/ws/notify/usb_detect'){
						console.log("usbNotify.URI != NotifyURI.Usb");
						return;
					}
					for(index in usbNotify.ITEMS){
						usbItem = usbNotify.ITEMS[index];
						var path = usbItem.PATH;
						var lastStr=path.substring(path.length-1);
						if(lastStr == "/"){
							path = path.substring(0,path.length-1);
						}
						switch(Number(usbItem.TYPE)){
							case 0://plugin and then goto content browser
							mmpServices.deleteDatabase(path);
							var isNeedJump = true;
							/*var mtvObjRaw = new MtvObjRaw();
                        	var ConfigItem_setupIsItmeShiftMode = 0x4220029;
                            var ts = mtvObjRaw.acfgGetConfigItemValue(ConfigItem_setupIsItmeShiftMode);
                            if (ts == 2) {
                                return ;
                            }*/
							if(usbDetectNotifyFunc){
								usbDetectNotifyFunc(usbItem);
								if((location.protocol + '//' + location.pathname) == (get_base_url() + "ContentBrowser/content_browser.html")){
									isNeedJump = false;
								}
							}
                            var smartDevName = window.dmrUtil.getConfig(2, 'g_misc__smart_tv_dev_name');
                            var mountDecDesc = mmpServices.getMountPointDevDesc('{"PARAMETER":{"VALUE":"'+usbItem.DEV+'","REQUEST":"QUERY"}}');
                            if(mountDecDesc){
                                mountDecDesc = JSON.parse(mountDecDesc);
                                mountDecDesc = mountDecDesc.ITEMS[0].TEXT;
                            }
                            var checkJumpStatus = mmpServices.checkUsbJumpStatus('{"PARAMETER":{"PATH":"'+path+'","REQUEST":"QUERY"}}');
                            if(checkJumpStatus){
                                checkJumpStatus = JSON.parse(checkJumpStatus).STATUS;
                            }
                            console.log("smartDevName = " + smartDevName +";mountDecDesc = " + mountDecDesc +";checkJumpStatus ="+checkJumpStatus);
                            var jumpReason =  window.dmrUtil.getConfig(1, 'g_misc__jump_to_mmp_reason');
                            if(0 == jumpReason && window.dmrUtil.getSuperShopDemoCount(path)){
                                showUsbDetectMsg(true);
                                if(isNeedJump){
                                    setTimeout(function(){
                                        var param = "action=usb_mount&path="+path;
                                        mtvuiUtil.gotoSysPage("sys_content_browser", param);
                                        //window.location = get_base_url() + "ContentBrowser/content_browser.html?action=usb_mount&path="+path;
                                    }, 100);
                                }
                            } else {
                                var jumpToMmp =  window.dmrUtil.getConfig(1, 'g_misc__check_jump_to_mmp');
                                if(1 == jumpToMmp && (smartDevName != mountDecDesc)  && checkJumpStatus == 0){
                                    showUsbDetectMsg(true);
                                    if(isNeedJump){
                                        setTimeout(function(){
                                            var param = "action=usb_mount&path="+path;
                                            mtvuiUtil.gotoSysPage("sys_content_browser", param);
                                            //window.location = get_base_url() + "ContentBrowser/content_browser.html?action=usb_mount&path="+path;
                                        }, 100);
                                    }
                                }
                            }
							break;
							case 1://plugout
							if(usbDetectNotifyFunc){
								usbDetectNotifyFunc(usbItem);
							}
							break;
							default:
							mmpServices.deleteDatabase(path);
							if(usbDetectNotifyFunc){
								usbDetectNotifyFunc(usbItem);
							}
							break;
						}
					}
};

var showUsbDetectMsg_timer;
function showUsbDetectMsg(iShow){
	if(iShow){
		clearTimeout(showUsbDetectMsg_timer);
		if($('#usb_detect_msg').length<=0){
			if(window.location.href.indexOf(get_base_url() + "index.html") >= 0){
				getTvJspService().utility.notifyHtmlUIStatus('{"PageID":"HTML5_UI_PAGE_CONTENTBROWSER", "Status":"Show"}');
			}
			var data = '<div id="usb_detect_msg" style="height: 95px;width: 950px;top: 440px;left:165px;margin: 0 auto;position: absolute;border: 2px solid #D3D4D5;border-radius: 6px;z-index:80005;">\
						<div style="position:absolute;height: 90px;width: 946px;  opacity: 0.7;background:#000;border-radius: 6px;z-index:80005;"></div>\
						<div style="position:absolute;height: 90px;width: 946px;  border-radius: 6px;z-index:80006;">\
						<img style="float:left;position:relative;top:23px;left:20px;right:20px;" src= "file:///3rd/html5/Assets/_Dialog/Notification_icon_warning.png" /><p style="float:left;height: 90px;width: 850px;position:relative;left:40px;top:28px;margin:0px;color:white;font-size:24px;text-align:left">'+window.dmrUtil.usbRedaerString()+'</p>\
						</div></div>'
			var content = $(data);
			content.appendTo(document.body);
		}

		showUsbDetectMsg_timer = setTimeout(function(){
			showUsbDetectMsg(false);
		}, 2000);
	} else {
		$('body #usb_detect_msg').remove();
	}

}

var pusNotifyFunc;
var onPusFunc = function (jsonStr){
	if(pusNotifyFunc) {
		pusNotifyFunc(jsonStr);
		return;
	}
	var pusNotify = JSON.parse(jsonStr);
	for(index in pusNotify.ITEMS){
		pusItem = pusNotify.ITEMS[index];
		switch(Number(pusItem.playCmd)){
			case 1: //play,jump to play pvr
			var param = encodeURI("action=pus_play&params="+jsonStr);
			mtvuiUtil.gotoSysPage("sys_content_browser_player", param);
			break;
		}
	}

};

// load the sctipt when not exist, otherwise do nothing
var mtvuiLoadScript = function (url, callback) {
    if( Object.prototype.toString.call( url ) === '[object Array]' ) {
        if (url.length > 0)
            mtvuiLoadScript(url[0], function () {
                mtvuiLoadScript(url.slice(1), callback);
            });
        else
            if (callback)
                callback();
        return;
    }
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == url || scripts[i].getAttribute("src") == url) {
            // exist
            if (callback)
                callback();
            return;
        }
    }
    // not exist
    var script = document.createElement('script');
    script.src = url;
    if (callback) {
        script.onload = callback;
        document.head.appendChild(script);
    }
    else
        document.write(script.outerHTML);
};

function loadLangRes (url, callback) {
    /* $.getScript or $.getJSON not work for local file.
       So we load the data manual */
    mtvuiLoadScript(url, callback ? function () { callback(window.mtvuiLangDictNew); } : callback);
}

var mtvui_debug_enable = false;
var mtvui_debug_log = function (s) {
    if (mtvui_debug_enable)
        console.log(s);
};

var MtvObjRaw = function () {
    this.tvjsp = null;
    this.oconfig = null;
    this.useDebugData = function (flag) {
        flag = flag || this.useDebugDataFlag;
        if (flag != this.useDebugDataFlag) {
            this.oconfig = null;
            this.mmpServices =null;
            this.getTvService();         // update the service
        }
    };
    this.getTvService = function () {
        if (!this.oconfig) {
            var flag = this.useDebugDataFlag;
            if (flag === 0 || flag === false) {   // not use debug-data
                try {this.tvjsp = getTvJspService();}
                catch(err) {console.log(err);}
                // FIXME: workaround, the tvService may be null, try to new one again
                try { if (!this.tvjsp.tvServices) {}; }
                catch(e) {
                    console.log("tvServices be null!!");
                    this.tvjsp = null;
                }
                if (!this.tvjsp) {
                    try {this.tvjsp = new TV_JSP();}
                    catch(e) {console.log(e);}
                }
                if (this.tvjsp) {
                    this.oconfig = this.tvjsp.tvServices;
                }
            }
            else { // use debug data
                if (flag === -1)  { // auto switch debug data, try getTvJspService() first
                    try {this.tvjsp = getTvJspService();}
                    catch(err) {console.log(err);}
                }
                if (!this.oconfig) {
                    try {this.oconfig = new tvServicesTest();}
                    catch(err) {console.log(err);}
                }
            }
        }
        this.tvServices = this.oconfig;
        return this.oconfig;
    };
};

MtvObjRaw.prototype.useDebugDataFlag = (function () {
    if ("Win32" != navigator.platform)
        return 0;
    mtvuiLoadScript(mtvuiUtil.getBaseURL() + "libs/mtvui/test-data.js");
    return -1;
})();

MtvObjRaw.prototype.getCurrentChannelInfo = function () {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getCurrentChannelInfo('');
		var chInfo = JSON.parse(res);
        var ch_mask = parseInt(chInfo.ITEMS[0].NW_MASK);
		var is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
		var country = this.getCurrentCountry();

        if (chInfo.STATUS >= 0)
        {
            if (this.getChannelListType() == CUST_CH_LIST_TYPE_FAVORITE && is_favorite && country != "GBR" && (GLOBAL_MODE == 'EU' || GLOBAL_MODE == 'AP'))
            {
                var ch_id   = chInfo.ITEMS[0].CHANNEL_ID;
                var svl_id  = chInfo.ITEMS[0].SVL_ID;
				var fav;

				if ( !is_dvbs_channel(svl_id)
					&& TYPE_BRDCST == this.getBroadcastType()
					&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE) ){

					var arg_idx = '{"PARAMETER":{"NW_MASK":'+MaskList.Mask_favorite+',"NW_VALUE":'+MaskValueList.MaskValue_favorite+',"CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
					var ret = this.oconfig.oclFavListGetIdxByChId(arg_idx);
					ret = JSON.parse(ret);
					var ocl_idx = parseInt(ret.ITEMS[0].INDEX);
					console.log("TEST LOG---->oclFavList ocl_idx in base: " + ocl_idx);
					var arg_ch = '{"PARAMETER":{"NW_MASK":'+MaskList.Mask_favorite+',"NW_VALUE":'+MaskValueList.MaskValue_favorite+',"CH_SEARCH_IDX":'+ocl_idx+',"REQUEST":"QUERY"}}';
					var ch_ret = this.oconfig.oclFavListGetSvlByIdx(arg_ch);
					fav = JSON.parse(ch_ret);
				} else {
					var fav_idx = 0;
					var arg = {"PARAMETER":{"SVL_ID":svl_id,"NW_MASK":MaskList.Mask_favorite,"NW_VALUE":MaskValueList.MaskValue_favorite,"FAV_IDX":fav_idx,"CH_ID":ch_id,"REQUEST":"QUERY"}};
					var res = this.oconfig.chFavListGetIdxByChId(JSON.stringify(arg));
					fav = JSON.parse(res);
				}

	            chInfo.ITEMS[0].MAJOR_NUM = fav.ITEMS[0].INDEX + 1;

            }
            ret = chInfo.ITEMS[0];
        }
    }
    return ret;
};

MtvObjRaw.prototype.chFavListGetIdxByChId = function (svl_id, nw_mask, mask_value, ch_id) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.chFavListGetIdxByChId(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return parseInt(ret.ITEMS[0].INDEX);
	}catch(e){
		return e;
	}

};

MtvObjRaw.prototype.getChannelCount = function (svl_id, nw_mask, nw_value) {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
        var arg = {"PARAMETER":{"SVL_ID":svl_id,"NW_MASK":nw_mask,"NW_VALUE":nw_value,"REQUEST":"QUERY"}};
        var res = this.oconfig.getChannelNum(JSON.stringify(arg));
        var chListRes = JSON.parse(res);
        ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
    }
    return ret;
};

MtvObjRaw.prototype.getChannelNum = function (svl_id, mask, mask_value, satl_id, satl_rec_id, ctgry_mask) {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
        var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+mask+'","NW_VALUE":"'+mask_value+'","SATL_ID":"'+satl_id+'","SATL_REC_ID":"'+satl_rec_id+'","CATEGORY_MASK":"'+ctgry_mask+'","REQUEST":"QUERY"}}';
        res = this.oconfig.getChannelNum(arg);
        mtvui_debug_log("getChannelNum return " + res.toString());
        chListRes = JSON.parse(res);
        ret = chListRes.ITEMS[0].CH_TOTAL_NUM;

    }
    return ret;
};

MtvObjRaw.prototype.getPrevChannelInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        return this.oconfig.getPrevChannelInfo(arg);
    }
    return null;
};

MtvObjRaw.prototype.getNextChannelInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        return this.oconfig.getNextChannelInfo(arg);
    }
    return null;
};

MtvObjRaw.prototype.getPrevNextChannelInfoEx = function (svl_id, isPrev, channelId) {

    this.getTvService();

    if (this.oconfig) {
        // NW_MASK: bit0:all, bit1:active, bit2:epg, bit3:visable
        // 10 : active | visable
        var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"10","NW_VALUE":"10","CH_ID":'+channelId+',"REQUEST":"QUERY"}}';

        if (isPrev) {
            res = this.oconfig.getPrevChannelInfo(arg);
        } else {
            res = this.oconfig.getNextChannelInfo(arg);
        }

        mtvui_debug_log("the getNextChannelInfo("+arg+") return " + res);

        if (res) {
            var ch = JSON.parse(res);
            return ch.ITEMS[0];
        }
    }

    return null;
};

MtvObjRaw.prototype.getOclChannelCount = function (mask,mask_value) {

    var count = 0;

    this.getTvService();
    if (this.oconfig) {
        var arg = {"PARAMETER":{"NW_MASK":mask,"NW_VALUE":mask_value,"REQUEST":"QUERY"}};
        var res = this.oconfig.getOclChannelNum(JSON.stringify(arg));
        if (res) {
            var chListRes = JSON.parse(res);
            count = chListRes.ITEMS[0].CH_TOTAL_NUM;
        }
    }
    return count;
}

MtvObjRaw.prototype.getOclFirstChannelInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        return this.oconfig.getOclFirstChannelInfo(arg);
    }
    return null;
};

MtvObjRaw.prototype.getOclPrevChannelInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        return this.oconfig.getOclPrevChannelInfo(arg);
    }
    return null;
};

MtvObjRaw.prototype.getOclNextChannelInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        return this.oconfig.getOclNextChannelInfo(arg);
    }
    return null;
};

MtvObjRaw.prototype.setBrdcastChgChannel = function (chID) {
    this.getTvService();
    // exit NetTV then set channel.
    this.exitNetTV({"PARAMETER": {"exitReason":"CHANGE_SOURCE","REQUEST":"SET"}});
    if (this.oconfig) {
        return this.oconfig.setBrdcastChgChannel(parseInt(chID));
    }
    return null;
};

MtvObjRaw.prototype.getInputInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getInputList(arg);
        if (res) {
            var inInfo = JSON.parse(res);
            return inInfo.ITEMS[0];
        }
    }
    return null;
};

MtvObjRaw.prototype.setInputInfo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.selectInputList(parseInt(arg));
        return res;
    }
    return null;
};

MtvObjRaw.prototype.setInputSourceAliasName = function (sourceIdx, sourceAliasName) {

    this.getTvService();

    if (this.oconfig) {
        var arg = {"PARAMETER":{"INDEX":sourceIdx, "ALIAS_NAME":sourceAliasName, "REQUEST":"SET"}};

        var res = this.oconfig.setInputSourceAliasNameByIdx(JSON.stringify(arg));
        mtvui_debug_log("the setInputSourceAliasName("+arg+") return " + res);
        return res;
    }

    return null;
};

MtvObjRaw.prototype.getInputSourceAliasName = function (sourceIdx) {

    this.getTvService();

    if (this.oconfig) {
        var arg = {"PARAMETER":{"INDEX":sourceIdx, "REQUEST":"QUERY"}};

        var res = this.oconfig.getInputSourceAliasNameByIdx(JSON.stringify(arg));
        mtvui_debug_log("the getInputSourceAliasName("+arg+") return " + res);

        if (res) {
            var srcInfo = JSON.parse(res);
            return srcInfo.ITEMS[0].ALIAS_NAME;
        }
    }

    return null;
};

MtvObjRaw.prototype.setInputSourceAliasIcon = function (sourceIdx, devType) {

    this.getTvService();

    if (this.oconfig) {
        var arg = {"PARAMETER":{"INDEX":sourceIdx, "DEVICE_TYPE":devType, "REQUEST":"SET"}};

        var res = this.oconfig.setInputSourceDevTypeByIdx(JSON.stringify(arg));
        mtvui_debug_log("the setInputSourceType("+arg+") return " + res);
        return res;
    }

    return null;
};

MtvObjRaw.prototype.getInputSourceAliasIcon = function (sourceIdx) {

    this.getTvService();

    if (this.oconfig) {
        var arg = {"PARAMETER":{"INDEX":sourceIdx, "REQUEST":"QUERY"}};

        var res = this.oconfig.getInputSourceDevTypeByIdx(JSON.stringify(arg));
        mtvui_debug_log("the getInputSourceType("+arg+") return " + res);

        if (res) {
            var srcInfo = JSON.parse(res);
            var devType = srcInfo.ITEMS[0].DEVICE_TYPE;

            return devType;
        }
    }

    return null;
};

MtvObjRaw.prototype.cecGetDeviceInfoByLa = function (la) {

    this.getTvService();

    if (this.oconfig) {
        var arg = '{"PARAMETER":{"E_LOGICADR":"'+la+'", "REQUEST":"QUERY"}}';

        var res = this.oconfig.getInputDeviceInfoByLogicAdr(arg);
        mtvui_debug_log("the getInputDeviceInfoByLogicAdr("+arg+") return " + res);

        if (res) {
            var tmp = JSON.parse(res);
            var devInfo = tmp.ITEMS[0];
            return devInfo;
        }
    }
    return null;
};

MtvObjRaw.prototype.mviewChgDisplayRegion = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewChgDisplayRegion(arg);
        mtvui_debug_log("mviewChgDisplayRegion return " + res);
        return res;
    }
    return null;
};

// 0 : Normal mode 1: PIP Mode 2: POP mode
MtvObjRaw.prototype.mviewSetTvMode = function (model) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewSetTvMode(model);
        mtvui_debug_log("mviewSetTvMode return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.mviewStartMainVideo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewStartMainVideo(arg);
        mtvui_debug_log("mviewStartMainVideo return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.mviewStartSubVideo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewStartSubVideo(arg);
        mtvui_debug_log("mviewStartSubVideo return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.mviewStopMainVideo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewStopMainVideo(arg);
        mtvui_debug_log("mviewStopMainVideo return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.mviewStopSubVideo = function (arg) {
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.mviewStopSubVideo(arg);
        mtvui_debug_log("mviewStopSubVideo return " + res);
        return res;
    }
    return null;
};

MtvObjRaw.prototype.getGuiLanguage = function (type) {
    console.log('getGuiLanguage');
    var ret =null;
    this.getTvService();
    if (this.oconfig) {
		res = this.oconfig.getGuiLanguage('');
        mtvui_debug_log("getGuiLanguage return " + res.toString());
        ret = JSON.parse(res);
    }
    return ret;
};

MtvObjRaw.prototype.getCountry = function (type) {
	console.log('getCountry');
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		res = this.oconfig.getCountry('');
        mtvui_debug_log("getCountry return " + res.toString());
        ret = JSON.parse(res);
    }
   return ret;
};

MtvObjRaw.prototype.selectBarkerChannel= function (arg) {

    var ret = null;
    try {
        this.getTvService();

        if (this.oconfig) {
            ret = this.oconfig.setSelectChannel(arg);
            mtvui_debug_log("the setSelectChannel("+arg+") return " + res);
        } else {
            ret = "oconfig is empty";
        }
    } catch(e) {
        return e;
    }
};

MtvObjRaw.prototype.epgAddEventListener = function (eventActiveWindowInfoNotifyFunc, eventActiveWindowTimeNotifyFunc, svlUpdateNotifyFunc) {

    var ret = null;
    try {
        this.getTvService();

        if (this.oconfig) {
            if (eventActiveWindowInfoNotifyFunc) {
                ret = this.oconfig.addEventListener('ActiveWindowInfoNotify', eventActiveWindowInfoNotifyFunc);
            }
            if (eventActiveWindowTimeNotifyFunc) {
                ret = this.oconfig.addEventListener('ActiveWindowTimeNotify', eventActiveWindowTimeNotifyFunc);
            }
            if (svlUpdateNotifyFunc) {
                ret = this.oconfig.addEventListener('ChannelInfoNotify', svlUpdateNotifyFunc);
            }
        } else {
            ret = "oconfig is empty";
        }
    } catch(e) {
        return e;
    }
};

MtvObjRaw.prototype.getEpgEventList = function (channleId, startTime, durationTime) {

    this.getTvService();

    if (this.oconfig) {
        var arg = '{"PARAMETER":{"CH_ID":"'+channleId+'","START_TIME":'+startTime+',"DURATION":'+durationTime+',"REQUEST":"QUERY"}}';
        var res = this.oconfig.getEventList(arg);

        if (res) {
            //eventlist = JSON.parse(res);
            eventlist = eval("("+res+")");
            if (eventlist.STATUS >= 0)
            {
                return eventlist;
            }
        }
    }

    return null;
};

MtvObjRaw.prototype.getEpgNowEvent = function (channleId) {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getCurrentEvent(channleId);

        if (res) {
            //nowevent = JSON.parse(res);
            nowevent = eval("("+res+")");
            return nowevent.ITEMS[0];
        }
    }

    return null;
};

MtvObjRaw.prototype.getEpgNextEvent = function (channleId) {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getNextEvent(channleId);

        if (res) {
            //nextevent = JSON.parse(res);
            nextevent = eval("("+res+")");
            return nextevent.ITEMS[0];
        }
    }

    return null;
};

MtvObjRaw.prototype.getEpgEventInfoById = function (channel_id, event_id) {

    var ret = null;

    this.getTvService();

    if (this.oconfig) {
        var arg = '{"PARAMETER":{"CH_ID":"'+channel_id+'","EVENT_ID":"'+event_id+'","REQUEST":"QUERY"}}';
        var res = this.oconfig.getEventInfoByEventId(arg);

//        var eventItem = JSON.parse(res);
//        if (eventItem.STATUS >= 0) {
//            ret = eventItem.ITEMS[0];
//        }
        if (res) {
            var eventItem = eval("("+res+")");
            if (eventItem.STATUS >= 0) {
                ret = eventItem.ITEMS[0];
            }
        }
    }

    return ret;
};

MtvObjRaw.prototype.getEpgEventNumByFilter = function (svl_id, ch_id, evt_id, filter_category, startTime, durationTime) {

    var ret = null;

    this.getTvService();

    if (this.oconfig) {
        var endTime = startTime + durationTime;
        var arg = '{"PARAMETER":{"CH_ID":'+ch_id+',"EVENT_ID":'+evt_id+',"FILTER_TYPE":1,"SVL_ID":'+svl_id+',"START_TIME":'+startTime+',"END_TIME":'+endTime+',"CATEGORY_NUM":1,"CATEGORY":['+filter_category+'],"CAPTION_NUM":0,"CAPTION":0,"RATING_TYPE":0,"REQUEST":"QUERY"}}';
        var res = this.oconfig.getEventNumByFilter(arg);

        if (res) {
            var eventItem = JSON.parse(res);
            if (eventItem.STATUS >= 0) {
                ret = eventItem.ITEMS[0];
            }
        }
    }

    return ret;
};

MtvObjRaw.prototype.epgSetCurrentActiveWindow = function (arg) {

    this.getTvService();

    if (this.oconfig) {
        if (arg) {
            res = this.oconfig.setActiveWindowInfo(arg);
            mtvui_debug_log("the setActiveWindowInfo("+arg+") return " + res);
            return res;
        }
    }

    return null;
};
MtvObjRaw.prototype.epgSetEventQueryParameter = function (arg) {

    this.getTvService();

    if (this.oconfig) {
        if (arg) {
            res = this.oconfig.setEventQueryParameter(arg);
            mtvui_debug_log("the setEventQueryParameter("+arg+") return " + res);
            return res;
        }
    }

    return null;
};

MtvObjRaw.prototype.getBroadcastUtcTime = function () {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getBroadcastTime('');
        if (res) {
            var utcTime = JSON.parse(res);
            return parseInt(utcTime.ITEMS[0].VALUE);
        }
    }

    return 0;
};

MtvObjRaw.prototype.getUserUtcTime = function () {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getUtcTime('');
        if (res) {
            var utcTime = JSON.parse(res);
            return parseInt(utcTime.ITEMS[0].VALUE);
        }
    }

    return 0;
};

MtvObjRaw.prototype.getTimeZone = function () {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getTimeZone('');

        if (res) {
            var tmp = JSON.parse(res);
            return tmp.ITEMS[0].VALUE;
        }
    }

    return 0;
};

MtvObjRaw.prototype.getTimeOffset = function () {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.getTimeOffset('');

        if (res) {
            var tmp = JSON.parse(res);
            return tmp.ITEMS[0].VALUE;
        }
    }

    return 0;
};

MtvObjRaw.prototype.getCurrentCountry = function () {

    this.getTvService();

    if (this.oconfig) {
        res = this.oconfig.getCountry();
        mtvui_debug_log("getCurrentCountry return " + res.toString());

        if (res) {
            var cn = JSON.parse(res);
            return cn.ITEMS[0].TEXT;
        }
    }

    return null;
};

MtvObjRaw.prototype.convertLocalToUtcTime = function (Year, Month, Day, Week, Hours, Minutes, Second, dst) {

    this.getTvService();

    if (this.oconfig) {
        var arg = {"PARAMETER":{"DTG":{"YEAR":Year,"MONTH":Month,"DAY":Day,"WEEK":Week,"HOUR":Hours,"MINUTE":Minutes,"SECOND":Second,"DST":dst},"REQUEST":"QUERY"}};
        var res = this.oconfig.convertLocalTimeToMillis(JSON.stringify(arg));

        if (res) {
            var tmp = JSON.parse(res);
            return tmp.ITEMS[0].VALUE;
        }
    }

    return 0;
};
MtvObjRaw.prototype.convertUtcToLocalTime = function (utcTime) {

    this.getTvService();

    if (this.oconfig) {
        var res = this.oconfig.convertMillisToLocalTime(utcTime);

        if (res) {
            var tmp = JSON.parse(res);
            return tmp.ITEMS[0];
        }
    }

    return 0;
};


/*
For "oper", please reference this:
    typedef enum {
        PpgOp_NULL = 0,
        PpgOp_UpdateStart = 1,
        PpgOp_UpdateStop = 2,
        PpgOp_UpdateGetState = 3,
        PpgOp_UpdateGetChNum = 4
    } PpgUpdateOp_T;
*/
MtvObjRaw.prototype.epgGuideUpdateOperator = function (request, oper) {

    try {
        this.getTvService();

        if (this.oconfig)
        {
            if (request == "GET")
            {
                var arg = '{"PARAMETER":{"operation":'+oper+',"REQUEST":"QUERY"}}';
                var res = this.oconfig.getEpgUpdate(arg);
                if (res) {
                    var tmp = JSON.parse(res);
                    return tmp.ITEMS[0];
                }
                return 0;
            }
            else  if (request == "SET")
            {
                var arg = '{"PARAMETER":{"operation":'+oper+',"REQUEST":"SET"}}';
                var res = this.oconfig.setEpgUpdate(arg);
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return 0;
};

/*
cfgItem: Please reference Slice/stv_api/inc/sapi_config.h, for example:
#define ConfigItem_TvTunerMode MakeConfigValue(TV, All, Int32, 0)
*/
MtvObjRaw.prototype.acfgGetConfigItemBool = function (cfgItem) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.getConfigBool('{"PARAMETER":{"cfgItem":'+cfgItem+',"REQUEST":"QUERY"}}');
            if (res) {
                var tmp = JSON.parse(res);
                return tmp.ITEMS[0].valueInt;
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.acfgSetConfigItemBool = function (cfgItem, val_bool) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.setConfigBool('{"PARAMETER":{"cfgItem":'+cfgItem+',"valueInt":'+val_bool+', "REQUEST":"SET"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};

MtvObjRaw.prototype.acfgGetConfigItemValue = function (cfgItem) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.getConfigValue('{"PARAMETER":{"cfgItem":'+cfgItem+',"REQUEST":"QUERY"}}');
            if (res) {
                var tmp = JSON.parse(res);
                return tmp.ITEMS[0].valueInt;
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.acfgSetConfigItemValue = function (cfgItem, val_int) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.setConfigValue('{"PARAMETER":{"cfgItem":'+cfgItem+',"valueInt":'+val_int+', "REQUEST":"SET"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.acfgGetConfigItemString = function (cfgItem, val_str) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
        	var res;
        	if(typeof(val_str) == 'undefined'){
            	res = this.oconfig.getConfigString('{"PARAMETER":{"cfgItem":'+cfgItem+',"REQUEST":"QUERY"}}');
            } else{
            	res = this.oconfig.getConfigString('{"PARAMETER":{"cfgItem":'+cfgItem+',"valueString":"'+val_str+'","REQUEST":"QUERY"}}');
            }
            if (res) {
                var tmp = JSON.parse(res);
                return tmp.ITEMS[0].valueString;
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return null;
};
MtvObjRaw.prototype.acfgSetConfigItemString = function (cfgItem, val_str) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.setConfigString('{"PARAMETER":{"cfgItem":'+cfgItem+',"valueString":"'+val_str+'", "REQUEST":"SET"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};

/*
cfgId: Please reference mtkapi_config_type.h, for example:
CFG_PWD_PASSWORD CFG_GRP_PASSWORD_PREFIX "password"
*/
MtvObjRaw.prototype.acfgGetConfigValue = function (cfg_id) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.getConfigValue('{"PARAMETER":{"cfgId":"'+cfg_id+'","REQUEST":"QUERY"}}');
            if (res) {
                var tmp = JSON.parse(res);
                return tmp.ITEMS[0].valueInt;
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.acfgSetConfigValue = function (cfg_id, val_int) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.setConfigValue('{"PARAMETER":{"cfgId":"'+cfg_id+'","valueInt":'+val_int+', "REQUEST":"SET"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};

MtvObjRaw.prototype.acfgGetConfigString = function (cfg_id) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.getConfigString('{"PARAMETER":{"cfgId":"'+cfg_id+'","REQUEST":"QUERY"}}');
            if (res) {
                var tmp = JSON.parse(res);
                return tmp.ITEMS[0].valueString;
            }
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.acfgSetConfigString = function (cfg_id, val_str) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.setConfigString('{"PARAMETER":{"cfgId":"'+cfg_id+'","valueString":"'+val_str+'", "REQUEST":"SET"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return -1;
};
MtvObjRaw.prototype.soundOutPortEnable = function (enable) {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
        // Slice/stv_api/inc/sapi_config.h
        // 0x09320004, Configitem_PpgSoundOutPort MakeConfigValue(Epg, All, Int32, 4)
        var cfgItem = 154271748;
        ret = this.acfgSetConfigItemValue(cfgItem, enable);
	}
	return ret;
};

MtvObjRaw.prototype.isZiggoOperator = function () {
    this.getTvService();
    if (this.oconfig) {
        // Slice/stv_api/inc/sapi_config.h
        // 0xFF310046, Configitem_Custom_IsEPGMuteAudio MakeCustomConfigValue(All, Bool, 70)
        var cfgItem = 0xFF310046;
        var is_nld_ziggo = this.acfgGetConfigItemBool(cfgItem);
        if (is_nld_ziggo == 1)
        {
            return true;
        }
	}
	return false;
};

/* for channel */
/* define channel mask */
var SB_VENT_ALL 				 = 1;
var SB_VENT_ACTIVE  			 = 2;/* svl bit mask of 1 */
var SB_VENT_VISIBLE 			 = 8;/* svl bit mask of 3 */
var SB_VENT_FAVORITE 			 = 16;/* svl bit mask of 4 */
var SB_VENT_BLOCKED  			 = 256;/* svl bit mask of 8 */
var SB_VENT_RADIO_SERVICE    	 = 1024;/* svl bit mask of 10 */
var SB_VENT_SCRAMBLED_SERVICE    = 2048;/* svl bit mask of 11 */
var SB_VENT_ANALOG_SERVICE       = 4096;/* svl bit mask of 12 */
var SB_VENT_NEW_SERVICE          = 262144;/* svl bit mask of 18 */
var MaskList = {Mask_default : SB_VENT_ALL,
				Mask_all : (SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_favorite : (SB_VENT_FAVORITE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_lock : (SB_VENT_BLOCKED | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_radio : (SB_VENT_RADIO_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_scrambled : (SB_VENT_SCRAMBLED_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_free: (SB_VENT_SCRAMBLED_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_analog : (SB_VENT_ANALOG_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_new : (SB_VENT_NEW_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_digital : (SB_VENT_RADIO_SERVICE | SB_VENT_ANALOG_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_digital_and_analog : (SB_VENT_RADIO_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				Mask_tv : (SB_VENT_RADIO_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE)}
var MaskValueList = {MaskValue_default : SB_VENT_ALL,
					 MaskValue_all : (SB_VENT_ACTIVE | SB_VENT_VISIBLE),
					 MaskValue_favorite : (SB_VENT_FAVORITE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
					 MaskValue_lock : (SB_VENT_BLOCKED | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_radio : (SB_VENT_RADIO_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_scrambled : (SB_VENT_SCRAMBLED_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_free : (SB_VENT_ACTIVE | SB_VENT_VISIBLE) ,
				MaskValue_analog : (SB_VENT_ANALOG_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_new : (SB_VENT_NEW_SERVICE | SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_digital : (SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_digital_and_analog : ( SB_VENT_ACTIVE | SB_VENT_VISIBLE),
				MaskValue_tv : (SB_VENT_ACTIVE | SB_VENT_VISIBLE)}
var DirectionList = {Direction_default : 0, Direction_pre : 1, Direction_next : 2}
var TunerType_list ={TunerType_tv : 1, TunerType_satellite : 3}
var ChannelNotifyTypeList ={ChannelNotifyType_svl_updating : 1, ChannelNotifyType_svl_updated : 2}

var ChannelListTypeList ={ChannelListType_tv_default : 0,
							ChannelListType_tv_favorite : 1, ChannelListType_tv_all : 2,
							ChannelListType_tv_radio : 3, ChannelListType_tv_new : 4,
							ChannelListType_satellite_favorite : 5, ChannelListType_satellite_all : 6,
							ChannelListType_satellite_tv : 7, ChannelListType_satellite_radio : 8,
							ChannelListType_satellite_new : 9}
//global value
var current_tuner_type = TunerType_list.TunerType_satellite;
var current_channel_type = ChannelListTypeList.ChannelListType_tv_all;
/* channel list type */
var CUST_CH_LIST_TYPE_ALL 	   = 0;
var CUST_CH_LIST_TYPE_DIGITAL  = 1;
var CUST_CH_LIST_TYPE_RADIO    = 2;
var CUST_CH_LIST_TYPE_ANALOG   = 3;
var CUST_CH_LIST_TYPE_NEW      = 4;
var CUST_CH_LIST_TYPE_FAVORITE = 5;
var CUST_CH_LIST_TYPE_TV       = 9;
/* channel filter type */
var CUST_CH_FILTER_TYPE_ALL      = 0;
var CUST_CH_FILTER_TYPE_DIGITAL  = 1;
var CUST_CH_FILTER_TYPE_RADIO    = 2;
var CUST_CH_FILTER_TYPE_ANALOG   = 3;
var CUST_CH_FILTER_TYPE_NEW      = 4;
var CUST_CH_FILTER_TYPE_LNB1	 = 5;
var CUST_CH_FILTER_TYPE_LNB2	 = 6;
var CUST_CH_FILTER_TYPE_LNB3	 = 7;
var CUST_CH_FILTER_TYPE_LNB4	 = 8;
var CUST_CH_FILTER_TYPE_UB1		 = 9;
var CUST_CH_FILTER_TYPE_UB2	 	 = 10;
var CUST_CH_FILTER_TYPE_FREE_SCRAMBLE	 = 11;
var CUST_CH_FILTER_TYPE_FREE_ONLY	 	 = 12;
var CUST_CH_FILTER_TYPE_SCRAMBLE	 	 = 13;
/* dvbs operator name */
var DVBS_OPERATOR_NAME_TKGS      = 27;
/* tkgs operator mode */
var TKGS_OPERATING_MODE_AUTO     = 0;
var TKGS_OPERATING_MODE_CUST     = 1;
var TKGS_OPERATING_MODE_OFF      = 2;

function get_cur_ch_list_type (){
	return current_channel_type;
};

function set_cur_ch_list_type (cur_ch_list_type){

	current_channel_type = cur_ch_list_type;
	return;
};

/* if DVBS SVL_ID ? */
function is_dvbs_channel(svl_id){
	if ( (svl_id == BRDCST_DVBS_GEN) ||
		 (svl_id == BRDCST_DVBS_PREFER) ||
		 (svl_id == CAM_DVBS) ){

		return true;
	}

	return false;
}

/*
* @name getChannelListEx
* @in ch_id: channel's id
* @in mask  : channel mask
* @in mask_value  : channel mask value
* @in dir  : direction is 'pre' or 'next'
* @in num  : get the number of channel
*/
MtvObjRaw.prototype.getChannelListEx = function (svl_id, ch_id, mask, mask_value, dir, num, satl_id, satl_rec_id, ctgry_mask) {
    ret = [];
    this.getTvService();
	if (satl_id == undefined ||
		satl_rec_id == undefined){
		satl_id 	= 0;
		satl_rec_id = 0;
	}
	if (ctgry_mask == undefined){
		ctgry_mask 	= 0;
	}
    try {
    if (this.oconfig) {
		//one channel list case && not for dvbs
		if ( !is_dvbs_channel(svl_id)
			&& TYPE_BRDCST == this.getBroadcastType()
			&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
		   ){
			var arg = '{"PARAMETER":{"NW_MASK":"'+mask+'","NW_VALUE":"'+mask_value+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getOclChannelNum(arg);
			mtvui_debug_log("getOclChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			num = Math.min(num, parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM));
			for (i = 0; i < num; i++) {
				arg = '{"PARAMETER":{"NW_MASK":"'+mask+'","NW_VALUE":"'+mask_value+'","CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
				if (dir == DirectionList.Direction_pre){
					res = this.oconfig.getOclPrevChannelInfo(arg);
					if (!res)
						break;
					ch = JSON.parse(res);
					//if below current channel id
					if (i != 0 && (ch_id < ch.ITEMS[0].CHANNEL_ID)){
						console.log("ch_id < ch.ITEMS[0].CHANNEL_ID");
						break;
					}

				}
				else{
					res = this.oconfig.getOclNextChannelInfo(arg);
				if (!res)
					break;
				ch = JSON.parse(res);
					//if greater than current channel id
					if (i != 0 && (ch_id > ch.ITEMS[0].CHANNEL_ID)){
						console.log("ch_id > ch.ITEMS[0].CHANNEL_ID");
						break;
					}

				}

				console.log("the getNextChannelInfo("+arg+") return " + res);

				//replace channel id
				ch_id = ch.ITEMS[0].CHANNEL_ID;

				ret.push(ch.ITEMS[0]);
			}
		}
		//normal case
		else{
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+mask+'","NW_VALUE":"'+mask_value+'","SATL_ID":"'+satl_id+'","SATL_REC_ID":"'+satl_rec_id+'","CATEGORY_MASK":"'+ctgry_mask+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getChannelNum(arg);
			console.log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			num = Math.min(num, parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM));
			for (i = 0; i < num; i++) {
				arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"NW_MASK":'+mask+',"NW_VALUE":'+mask_value+',"CH_ID":'+ch_id+',"SATL_ID":"'+satl_id+'","SATL_REC_ID":"'+satl_rec_id+'","CATEGORY_MASK":"'+ctgry_mask+'","REQUEST":"QUERY"}}';
				if (dir == DirectionList.Direction_pre){
					res = this.oconfig.getPrevChannelInfo(arg);
					if (!res)
						break;
					ch = JSON.parse(res);
					//if belower than current channel id
					if (i != 0 && (ch_id < ch.ITEMS[0].CHANNEL_ID)){
						console.log("ch_id < ch.ITEMS[0].CHANNEL_ID");
						break;
				}
				}
				else{
					res = this.oconfig.getNextChannelInfo(arg);
					if (!res)
						break;
					ch = JSON.parse(res);
					//if greater than current channel id
					if (i != 0 && (ch_id > ch.ITEMS[0].CHANNEL_ID)){
						console.log("ch_id > ch.ITEMS[0].CHANNEL_ID");
						break;
				}
				}
				mtvui_debug_log("the getNextChannelInfo("+arg+") return " + res);
				//res = res.replace(/[^\x20-\x7E]+/g, ''); // FIXME: workaround for non printable char
				//replace channel id
				ch_id = ch.ITEMS[0].CHANNEL_ID;
				ret.push(ch.ITEMS[0]);
			}/* for */
		}
    }
    } catch (e) {
        console.log(e);
    }
	//if search from previous need reverse the channel list
	//&& (parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE))
	if (dir == DirectionList.Direction_pre){
		//reverse the channel list
		return ret.reverse();
	}
	else{
		return ret;
	}

};
MtvObjRaw.prototype.getChannelListBySearchStr = function (svl_id, mask, mask_value, begin_idx, num, search_str) {
    ret = [];
    this.getTvService();
    try {
		if (this.oconfig) {
			//one channel list case && not for dvbs
			if ( !is_dvbs_channel(svl_id) && parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE) ){
				var arg = {"PARAMETER":{"NW_MASK":mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"REQUEST":"QUERY"}};
				res = this.oconfig.getOclChannelNum(JSON.stringify(arg));
				chListRes = JSON.parse(res);
				num = Math.min(num, parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM));
				for (i = 0; i < num; i++) {
					idx = i + begin_idx;
					arg = {"PARAMETER":{"NW_MASK":mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"CH_SEARCH_IDX":idx,"REQUEST":"QUERY"}};
					res = this.oconfig.getOclChannelInfoByDbIdx(JSON.stringify(arg));
					if (!res)
						break;
					ch = JSON.parse(res);
					mtvui_debug_log("the getOclChannelInfoByDbIdx("+arg+") return " + res);
					ret.push(ch.ITEMS[0]);
				}/* for */
			}
			//normal case
			else{
				var arg = {"PARAMETER":{"SVL_ID":svl_id,"NW_MASK":mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"REQUEST":"QUERY"}};
				res = this.oconfig.getChannelNum(JSON.stringify(arg));
				chListRes = JSON.parse(res);
				num = Math.min(num, parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM));
				for (i = 0; i < num; i++) {
					idx = i + begin_idx;
					arg = {"PARAMETER":{"SVL_ID":svl_id,"NW_MASK":mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"CH_SEARCH_IDX":idx,"REQUEST":"QUERY"}};
					res = this.oconfig.getChannelInfoByDbIdx(JSON.stringify(arg));
					if (!res)
						break;
					ch = JSON.parse(res);
					mtvui_debug_log("the getChannelInfoByDbIdx("+arg+") return " + res);
					ret.push(ch.ITEMS[0]);
				}/* for */
			}

		}
    } catch (e) {
        console.log(e);
    }

	return ret;
};
MtvObjRaw.prototype.storeChannelList = function () {

    this.getTvService();

    if (this.oconfig) {
        res = this.oconfig.storeChannelList();
        mtvui_debug_log("getCurrentCountry return " + res.toString());
    }

    return null;
};
MtvObjRaw.prototype.getFavoriteChannelCountEX = function (fav_idx) {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		var svl_id = null;
		//if in satellite && current channel is not DVBS
		if ((current_tuner_type == TunerType_list.TunerType_satellite)){
			//rewrite SVL_ID to satellite.
			//svl_id = 3;
			if (TYPE_BRDCST == this.getBroadcastType()){
				svl_id = BRDCST_DVBS;
			}else{
				svl_id = CAM_DVBS;
			}
		}
		//if in TV && current channel is DVBS
		else if((current_tuner_type == TunerType_list.TunerType_tv)){
			/* step 1: get dtv tuner type */
			var dtv_tuner_type = this.getDtvTunerType();
			switch (dtv_tuner_type){
				case 0:
					//rewrite SVL_ID to air.
					//svl_id = 1;
					if (TYPE_BRDCST == this.getBroadcastType()){
						svl_id = BRDCST_DVBT;
					}else{
						svl_id = CAM_DVBT;
					}
					break;
				case 1:
					//rewrite SVL_ID to cab.
					//svl_id = 2;
					if (TYPE_BRDCST == this.getBroadcastType()){
						svl_id = BRDCST_DVBC;
					}else{
						svl_id = CAM_DVBC;
					}
					break;
				default:
					//svl_id = 1;
					break;
			}

		}
		//one channel list case && not for dvbs
		if ( !is_dvbs_channel(svl_id)
			&& TYPE_BRDCST == this.getBroadcastType()
			&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
		   ){
			    var arg = '{"PARAMETER":{"NW_MASK":"'+MaskList.Mask_favorite+'","NW_VALUE":"'+MaskValueList.MaskValue_favorite+'","REQUEST":"QUERY"}}';
				res = this.oconfig.oclFavListGetNumByMask(arg);
				mtvui_debug_log("getChannelNum return " + res.toString());
				chListRes = JSON.parse(res);
				ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}
		else {
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+MaskList.Mask_favorite+'","NW_VALUE":"'+MaskValueList.MaskValue_favorite+'","FAV_IDX":"'+fav_idx+'","REQUEST":"QUERY"}}';
			res = this.oconfig.chFavListGetNumByMask(arg);
			mtvui_debug_log("chFavListGetNumByMask return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}
    }
    return parseInt(ret);
};
MtvObjRaw.prototype.getChannelCountEx = function (svl_id, ch_mask, mask_value) {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
        if((current_tuner_type != TunerType_list.TunerType_satellite) && parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)){
			var arg = '{"PARAMETER":{"NW_MASK":"'+ch_mask+'","NW_VALUE":"'+mask_value+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getOclChannelNum(arg);
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
        }
        else
        {
            var currentChannelListType = this.getChannelListType();

            if (currentChannelListType == CUST_CH_LIST_TYPE_FAVORITE)
            {
                var fav_idx = 0;
                var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+MaskList.Mask_favorite+'","NW_VALUE":"'+MaskValueList.MaskValue_favorite+'","FAV_IDX":"'+fav_idx+'","REQUEST":"QUERY"}}';
                res = this.oconfig.chFavListGetNumByMask(arg);
                mtvui_debug_log("chFavListGetNumByMask return " + res.toString());
                chListRes = JSON.parse(res);
                ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
            }
            else
            {
                var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+ch_mask+'","NW_VALUE":"'+mask_value+'","REQUEST":"QUERY"}}';
                res = this.oconfig.getChannelNum(arg);
                mtvui_debug_log("getChannelNum return " + res.toString());
                chListRes = JSON.parse(res);
                ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
            }
        }
    }
    return parseInt(ret);
};

MtvObjRaw.prototype.chFavListGetNumByMask = function (arg) {
    var res = null;
    this.getTvService();
    if (this.oconfig){
    	res = this.oconfig.chFavListGetNumByMask(arg);
    }
	return res;
};

MtvObjRaw.prototype.oclFavListGetSvlByIdx = function (arg) {
    var res = null;
    this.getTvService();
    if (this.oconfig){
    	res = this.oconfig.oclFavListGetSvlByIdx(arg);
    }
	return res;
};

MtvObjRaw.prototype.getChannelCountTemp = function (svl_id, ch_mask, mask_value, satl_id, satl_rec_id, categoryMask) {
    var ret = null;
    this.getTvService();
	if (satl_id == undefined ||
		satl_rec_id == undefined){
			satl_id 	= 0;
			satl_rec_id = 0;
		}
		if(categoryMask == undefined)
		{
			 categoryMask = 0;
		}
    if (this.oconfig) {
        if((current_tuner_type != TunerType_list.TunerType_satellite) && parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)){
			var arg = '{"PARAMETER":{"NW_MASK":"'+ch_mask+'","NW_VALUE":"'+mask_value+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getOclChannelNum(arg);
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
        }
        else
        {
            var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+ch_mask+'","NW_VALUE":"'+mask_value+'","SATL_ID":"'+satl_id+'","SATL_REC_ID":"'+satl_rec_id+'","CATEGORY_MASK":"'+categoryMask+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getChannelNum(arg);
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
        }
    }
    return parseInt(ret);
};
MtvObjRaw.prototype.getSatlRecNum = function (satl_id) {
    var ret = null;
    this.getTvService();
	if (satl_id == undefined){
		satl_id = 0;
	}
    if (this.oconfig) {
		var arg = '{"PARAMETER":{"SATL_ID":"'+satl_id+'","REQUEST":"QUERY"}}';
		res = this.oconfig.getSatlRecNum(arg);
		mtvui_debug_log("getSatlRecNum return " + res.toString());
		chListRes = JSON.parse(res);
		ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
    }
    return parseInt(ret);
};
MtvObjRaw.prototype.getSatlRecByIdx = function (satl_id, satl_idx) {
    var ret = null;
    this.getTvService();
	if (satl_id == undefined){
		satl_id = 0;
	}
    if (this.oconfig) {
		var arg = '{"PARAMETER":{"SATL_ID":"'+satl_id+'","INDEX":"'+satl_idx+'","REQUEST":"QUERY"}}';
		res = this.oconfig.getSatlRecByIdx(arg);
		mtvui_debug_log("getSatlRecByIdx return " + res.toString());
		chListRes = JSON.parse(res);
		ret = chListRes.ITEMS[0];
    }
    return ret;
};
MtvObjRaw.prototype.getChannelCountBySearchStr = function (svl_id, ch_mask, mask_value, search_str) {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		//one channel list case && not for dvbs
		if ( !is_dvbs_channel(svl_id) && parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE) ){
			var arg = {"PARAMETER":{"NW_MASK":ch_mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"REQUEST":"QUERY"}};
			res = this.oconfig.getOclChannelNum(JSON.stringify(arg));
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}else{
			var arg = {"PARAMETER":{"SVL_ID":svl_id,"NW_MASK":ch_mask,"NW_VALUE":mask_value,"SEARCH_NAME":search_str,"REQUEST":"QUERY"}};
			res = this.oconfig.getChannelNum(JSON.stringify(arg));
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}

    }
    return parseInt(ret);
};
MtvObjRaw.prototype.getAllChannelCount = function () {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		if((current_tuner_type != TunerType_list.TunerType_satellite) && parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)){
			var arg = '{"PARAMETER":{"NW_MASK":"'+MaskList.Mask_all+'","NW_VALUE":"'+MaskValueList.MaskValue_all+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getOclChannelNum(arg);
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}
		else {
			var svl_id = null;
			//if in satellite && current channel is not DVBS
			if (current_tuner_type == TunerType_list.TunerType_satellite){
				//rewrite SVL_ID to satellite.
				//svl_id = 3;
				if (TYPE_BRDCST == this.getBroadcastType()){
					svl_id = BRDCST_DVBS;
				}else{
					svl_id = CAM_DVBS;
				}

			}
			//if in TV && current channel is DVBS
			else if((current_tuner_type == TunerType_list.TunerType_tv)){
				/* step 1: get dtv tuner type */
				var dtv_tuner_type = this.getDtvTunerType();
				switch (dtv_tuner_type){
					case 0:
						//rewrite SVL_ID to air.
						//svl_id = 1;
						if (TYPE_BRDCST == this.getBroadcastType()){
							svl_id = BRDCST_DVBT;
						}else{
							svl_id = CAM_DVBT;
						}
						break;
					case 1:
						//rewrite SVL_ID to cab.
						//svl_id = 2;
						if (TYPE_BRDCST == this.getBroadcastType()){
							svl_id = BRDCST_DVBC;
						}else{
							svl_id = CAM_DVBC;
						}
						break;
					default:
						//svl_id = 1;
						break;
				}

			}
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":"'+MaskList.Mask_all+'","NW_VALUE":"'+MaskValueList.MaskValue_all+'","REQUEST":"QUERY"}}';
			res = this.oconfig.getChannelNum(arg);
			mtvui_debug_log("getChannelNum return " + res.toString());
			chListRes = JSON.parse(res);
			ret = chListRes.ITEMS[0].CH_TOTAL_NUM;
		}
    }
    return parseInt(ret);
};
MtvObjRaw.prototype.getCurrentChannelInfoEx = function () {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
			res = this.oconfig.getCurrentChannelInfo('');
			mtvui_debug_log("getCurrentChannelInfo return " + res.toString());
			var chInfo = JSON.parse(res);
			ret = chInfo.ITEMS[0];
    }
    return ret;
};
var BRDCST_DVBT = 1;
var BRDCST_DVBC = 2;
var BRDCST_DVBS_GEN = 3;
var BRDCST_DVBS_PREFER = 4;
/* BRDCST_DVBS default value */
var BRDCST_DVBS = BRDCST_DVBS_GEN;
var CAM_DVBT	= 5;
var CAM_DVBC 	= 6;
var CAM_DVBS 	= 7;
var TYPE_BRDCST = 0;
var TYPE_CAM    = 1;
MtvObjRaw.prototype.getCurrentChannelInfoForEachTuner = function () {
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		var res = this.oconfig.getCurrentChannelInfo('');
		var chInfo = JSON.parse(res);
		ret = chInfo.ITEMS[0];

		//if in satellite
		if (current_tuner_type == TunerType_list.TunerType_satellite){
			//rewrite SVL_ID to satellite.
			if (TYPE_BRDCST == this.getBroadcastType()){
				ret.SVL_ID = BRDCST_DVBS;
			}else{
				ret.SVL_ID = CAM_DVBS;
			}
			//rewrite CHANNEL_ID to first.
			ret.CHANNEL_ID = this.getSatChannelId();
		}
		//else in TV
		else {
			/*one channel list case */
			if(parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)){
				ret.CHANNEL_ID = this.getOclChannelId();
				ret.SVL_ID = BRDCST_DVBC;
			}
			else
			{
				var dtv_tuner_type = this.getDtvTunerType();
				switch (parseInt(dtv_tuner_type)){
					case 0:
						ret.CHANNEL_ID = this.getAirChannelId();
						//rewrite SVL_ID to air.
						if (TYPE_BRDCST == this.getBroadcastType()){
							ret.SVL_ID = BRDCST_DVBT;
						}else{
							ret.SVL_ID = CAM_DVBT;
						}

						break;
					case 1:
						ret.CHANNEL_ID = this.getCabChannelId();
						//rewrite SVL_ID to cab.
						if (TYPE_BRDCST == this.getBroadcastType()){
							ret.SVL_ID = BRDCST_DVBC;
						}else{
							ret.SVL_ID = CAM_DVBC;
						}
						break;
					default:
						ret.CHANNEL_ID = this.getAirChannelId();
						//rewrite SVL_ID to air.
						ret.SVL_ID = BRDCST_DVBT;
						break;
				}
			}

		}// else
    }

    return ret;
};
MtvObjRaw.prototype.getOclNearestIdxByMajor = function (mask, mask_value, major) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"NW_MASK":'+mask+',"NW_VALUE":'+mask_value+',"MAJOR":'+major+',"REQUEST":"QUERY"}}';
			mtvui_debug_log("getOclNearestIdxByMajor arg:"+arg);
			res = this.oconfig.getOclNearestIdxByMajor(arg);
			console.log("getOclNearestIdxByMajor return " + res.toString());
			res = JSON.parse(res);
			ret = parseInt(res.ITEMS[0].INDEX);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}
};
MtvObjRaw.prototype.getOclStatus = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			ret = parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE);
			//ret = JSON.stringify(this.oconfig.getOclStatus(''));
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getChLogoStatus = function () {
	var ret = null;
    this.getTvService();
    if (this.oconfig) {
		ret = parseInt(JSON.parse(this.oconfig.getChLogoStatus('')).ITEMS[0].VALUE);
        mtvui_debug_log("getChLogoStatus return " + res.toString());
    }
    return ret;
};
MtvObjRaw.prototype.getDvbsSupportStatus = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			ret = parseInt(JSON.parse(this.oconfig.getDvbsSupportStatus('')).ITEMS[0].VALUE);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};

MtvObjRaw.prototype.getBroadcastType = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__ch_list_type","REQUEST":"QUERY"}}';
			ret = parseInt(JSON.parse(this.oconfig.getConfigValue(arg)).ITEMS[0].valueInt);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getChannelListType = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__custom_ch_list_type","REQUEST":"QUERY"}}';
			mtvui_debug_log("getChannelListType arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getChannelListType Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.getPinMode = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__pin_mode","REQUEST":"QUERY"}}';
			mtvui_debug_log("getPinMode arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getPinMode Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.setPinMode = function (mode) {

	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__pin_mode","valueInt":"'+mode+'","REQUEST":"SET"}}';
			mtvui_debug_log("setPinMode arg:"+arg);
			var res = this.oconfig.setConfigValue(arg);
		}else{
			return;
		}

	}catch(e){
		mtvui_debug_log("catch error:"+e);
	}
	return;
};
MtvObjRaw.prototype.pause3rdApp = function () {

	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__pause_3rd_app","REQUEST":"SET"}}';
			mtvui_debug_log("pause3rdApp arg:"+arg);
			var res = this.oconfig.setConfigValue(arg);
		}else{
			return;
		}

	}catch(e){
		mtvui_debug_log("catch error:"+e);
	}
	return;
};
MtvObjRaw.prototype.getBsBsSatelliteBrdcster = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_bs__bs_sat_brdcster","REQUEST":"QUERY"}}';
			mtvui_debug_log("getBsBsSatelliteBrdcster arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getBsBsSatelliteBrdcster Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.getDvbsTkgsOperatingMode = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__dvbs_tkgs_operating_mode","REQUEST":"QUERY"}}';
			mtvui_debug_log("getDvbsTkgsOperatingMode arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getDvbsTkgsOperatingMode Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.getChannelFilterType = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__custom_ch_filter_type","REQUEST":"QUERY"}}';
			mtvui_debug_log("getChannelFilterType arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getChannelFilterType Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.getSatellitePreferredStatus = function () {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_two_sat_chlist__preferred_sat","REQUEST":"QUERY"}}';
			mtvui_debug_log("getSatellitePreferredStatus arg:"+arg);
			var res = JSON.parse(this.oconfig.getConfigValue(arg));
			if ( parseInt(res.STATUS) == 0){
				ret = parseInt(res.ITEMS[0].valueInt);
			}
			else{
				mtvui_debug_log("getSatellitePreferredStatus Error:"+JSON.stringify(res));
			}

		}else{
			ret = "oconfig is empty"
		}

		return ret;
	}catch(e){
		mtvui_debug_log("catch error:"+e);
		return ret;
	}

};
MtvObjRaw.prototype.setChannelListType = function (list_type) {

	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__custom_ch_list_type","valueInt":"'+list_type+'","REQUEST":"SET"}}';
			mtvui_debug_log("setChannelListType arg:"+arg);
			var res = this.oconfig.setConfigValue(arg);
		}else{
			return;
		}

	}catch(e){
		mtvui_debug_log("catch error:"+e);
	}
	return;
};
MtvObjRaw.prototype.setChannelFilterType = function (filter_type) {

	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"cfgId":"g_misc__custom_ch_filter_type","valueInt":"'+filter_type+'","REQUEST":"SET"}}';
			mtvui_debug_log("setChannelFilterType arg:"+arg);
			var res = this.oconfig.setConfigValue(arg);
		}else{
			return;
		}

	}catch(e){
		mtvui_debug_log("catch error:"+e);
	}
	return;
};
MtvObjRaw.prototype.addChannelInfoEventListener = function (channelInfoUpdateFunc) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			//channelInfoUpdateFunc('{"URI":  "/tv/ws/notify/channel_info"}');
			ret = this.oconfig.addEventListener ('ChannelInfoNotify', channelInfoUpdateFunc);
		}else{
			ret = "oconfig is empty"
		}
		return ;

	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.editChannel = function (svl_id, channel_id, new_ch_name) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = {"PARAMETER":{"SVL_ID":svl_id,"CH_ID":channel_id,"CH_EDIT_NAME":new_ch_name,"REQUEST":"SET"}};
			ret = this.oconfig.editChannel(JSON.stringify(arg));

		}else{
			ret = "oconfig is empty"
		}
		return ;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.updateChannelLogoId = function (svl_id, channel_id) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"CH_ID":'+channel_id+',"REQUEST":"SET"}}';
			mtvui_debug_log("updateChannelLogoId:"+arg);
			ret = this.oconfig.updateChannelLogoId(arg);

		}else{
			ret = "oconfig is empty"
		}
		return ;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getChannelInfoByDbIdx = function (svl_id, nw_mask, mask_value, search_idx) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_SEARCH_IDX":'+search_idx+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.getChannelInfoByDbIdx(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getChannelInfoEx = function (svl_id, ch_id, nw_mask, mask_value, dir, ctgry_mask, satl_id, satl_rec_id) {
    var ret = null;
 	if (satl_id == undefined ||
		satl_rec_id == undefined){
		satl_id 	= 0;
		satl_rec_id = 0;
	}

	if (ctgry_mask == undefined){
		ctgry_mask 	= 0;
	}
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"CH_ID":'+ch_id+',"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"DIRECTION":'+dir+',"CATEGORY_MASK":'+ctgry_mask+',"SATL_ID":'+satl_id+',"SATL_REC_ID":'+satl_rec_id+',"REQUEST":"QUERY"}}';
			console.log("getChannelInfoEx:"+arg);
			ret = this.oconfig.getChannelInfo(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getDvbsTkgsCategoryList = function (lol_id, lol_idx, lol_data_tag) {
    var ret = null;
	if (lol_id == undefined ||
		lol_idx == undefined){
		lol_id 	= 4;
		lol_idx = 0;
	}
	if (lol_data_tag == undefined){
		lol_data_tag = 11;/* tkgs category */
	}
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"LOL_ID":'+lol_id+',"LOL_IDX":'+lol_idx+',"LOL_DATA_TAG":'+lol_data_tag+',"REQUEST":"QUERY"}}';
			console.log("getChannelInfoEx:"+arg);
			ret = this.oconfig.getDvbsTkgsCategoryList(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getOclChannelInfoByDbIdx = function ( nw_mask, mask_value, search_idx) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_SEARCH_IDX":'+search_idx+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.getOclChannelInfoByDbIdx(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return ret;
	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getIdxByChannelId = function (svl_id, nw_mask, mask_value, ch_id) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":'+svl_id+',"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.getIdxByChannelId(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}

		return parseInt(ret.ITEMS[0].INDEX);

	}catch(e){
		return e;
	}

};
MtvObjRaw.prototype.getOclIdxByChannelId = function (nw_mask, mask_value, ch_id) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.getOclIdxByChannelId(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return parseInt(ret.ITEMS[0].INDEX);
	}catch(e){
		return e;
	}

};

MtvObjRaw.prototype.oclFavListGetIdxByChId = function (nw_mask, mask_value, ch_id) {
    var ret = null;
	try{
		this.getTvService();
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"CH_ID":'+ch_id+',"REQUEST":"QUERY"}}';
			ret = this.oconfig.oclFavListGetIdxByChId(arg);
			ret = JSON.parse(ret);
		}else{
			ret = "oconfig is empty"
		}
		return parseInt(ret.ITEMS[0].INDEX);
	}catch(e){
		return e;
	}

};

MtvObjRaw.prototype.chFavListGetSvlByIdx = function (args) {
    ret = [];
    this.getTvService();
	if (this.oconfig){
		ret = this.oconfig.chFavListGetSvlByIdx(args);
	}
	return ret;
};

MtvObjRaw.prototype.oclFavListGetNumByMask = function (args) {
    ret = [];
    this.getTvService();
	if (this.oconfig){
		ret = this.oconfig.oclFavListGetNumByMask(args);
	}
	return ret;
};
MtvObjRaw.prototype.chFavListSwapByChId = function (svl_id, ch_from, ch_to, fav_idx) {

    this.getTvService();
    try {
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_FROM":"'+ch_from+'","CH_TO":"'+ch_to+'","FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
			this.oconfig.chFavListSwapByChId(arg);
		}
    } catch (e) {
        console.log(e);
    }

	return;
};
MtvObjRaw.prototype.sortChannel = function (svl_id, ch_from, ch_to) {

    this.getTvService();
    try {
		if (this.oconfig) {
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_FROM":"'+ch_from+'","CH_TO":"'+ch_to+'","REQUEST":"SET"}}';
			this.oconfig.sortChannel(arg);
		}
    } catch (e) {
        console.log(e);
    }

	return;
};
MtvObjRaw.prototype.chFavListInsertMoveByIdx = function (svl_id, nw_mask, mask_value, idx_from, idx_to, fav_idx) {

    this.getTvService();
    try {
		if (this.oconfig) {
			//one channel list case && not for dvbs
			if ( !is_dvbs_channel(svl_id)
				&& TYPE_BRDCST == this.getBroadcastType()
				&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
			   ){
				var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"IDX_FROM":"'+idx_from+'","IDX_TO":"'+idx_to+'","REQUEST":"SET"}}';
				this.oconfig.oclFavListInsertMoveByIdx(arg);
		    }else{
				var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"IDX_FROM":"'+idx_from+'","IDX_TO":"'+idx_to+'","FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
				this.oconfig.chFavListInsertMoveByIdx(arg);
			}

		}
    } catch (e) {
        console.log(e);
    }

	return;
};
MtvObjRaw.prototype.chFavListAddAll = function (svl_id, nw_mask, mask_value, fav_idx) {

    this.getTvService();
    try {
		if (this.oconfig) {
			//one channel list case && not for dvbs
			if ( !is_dvbs_channel(svl_id)
				&& TYPE_BRDCST == this.getBroadcastType()
				&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
			   ){
				var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"REQUEST":"SET"}}';
				this.oconfig.oclFavListAddAll(arg);
		    }else{
				var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
				this.oconfig.chFavListAddAll(arg);
		    }

		}
    } catch (e) {
        console.log(e);
    }

	return;
};
MtvObjRaw.prototype.chFavListDelAll = function (svl_id, nw_mask, mask_value, fav_idx) {

    this.getTvService();
    try {
		if (this.oconfig) {
			//one channel list case && not for dvbs
			if ( !is_dvbs_channel(svl_id)
				&& TYPE_BRDCST == this.getBroadcastType()
				&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
			   ){
				var arg = '{"PARAMETER":{"NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"REQUEST":"SET"}}';
				this.oconfig.oclFavListDelAll(arg);
		   }else{
				var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","NW_MASK":'+nw_mask+',"NW_VALUE":'+mask_value+',"FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
				this.oconfig.chFavListDelAll(arg);
		   }

		}
    } catch (e) {
        console.log(e);
    }

	return;
};
MtvObjRaw.prototype.setChannelInfo = function (svl_id, ch_id, ch_mask) {

    this.getTvService();
    if (this.oconfig) {
        var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_ID":"'+ch_id+'","NW_MASK":"'+ch_mask+'","REQUEST":"SET"}}';
        res = this.oconfig.setChannelInfo(arg);
    }
    return ;
};
MtvObjRaw.prototype.getOclToggleType = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getOclToggleType();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
MtvObjRaw.prototype.getPassword = function () {
	console.log('getPassword');
    var ret = null;
    this.getTvService();
    if (this.oconfig) {
		res = this.oconfig.getPassword('');
        mtvui_debug_log("getPassword return " + res.toString());
    	if(res){
			ret = JSON.parse(res);
			return ret.ITEMS[0].TEXT;
		}
    }
   return ret;
};
MtvObjRaw.prototype.setPassword = function (pwd) {
	console.log('setPassword');
    this.getTvService();
    if (this.oconfig) {
		res = this.oconfig.setPassword(pwd);
        mtvui_debug_log("setPassword return " + res.toString());
    }

};
MtvObjRaw.prototype.chFavListAddItem = function (svl_id, ch_id, fav_idx) {
	console.log('chFavListAddItem');
    this.getTvService();
    if (this.oconfig) {
		//one channel list case && not for dvbs
		if ( !is_dvbs_channel(svl_id)
			&& TYPE_BRDCST == this.getBroadcastType()
			&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
		   ){
			var arg = '{"PARAMETER":{"CH_ID":"'+ch_id+'","REQUEST":"SET"}}';
			this.oconfig.oclFavListAddItem(arg);
			mtvui_debug_log("chFavListAddItem:" + arg);
		}else{
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_ID":"'+ch_id+'","FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
			this.oconfig.chFavListAddItem(arg);
			mtvui_debug_log("chFavListAddItem:" + arg);
		}

    }

};
MtvObjRaw.prototype.chFavListDelItem = function (svl_id, ch_id, fav_idx) {
	console.log('chFavListDelItem');
    this.getTvService();
    if (this.oconfig) {
		//one channel list case && not for dvbs
		if ( !is_dvbs_channel(svl_id)
			&& TYPE_BRDCST == this.getBroadcastType()
			&& parseInt(JSON.parse(this.oconfig.getOclStatus('')).ITEMS[0].VALUE)
		   ){
			var arg = '{"PARAMETER":{"CH_ID":"'+ch_id+'","REQUEST":"SET"}}';
			this.oconfig.oclFavListDelItem(arg);
			mtvui_debug_log("oclFavListDelItem:" + arg);
		}else{
			var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_ID":"'+ch_id+'","FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
			this.oconfig.chFavListDelItem(arg);
			mtvui_debug_log("chFavListDelItem:" + arg);
		}

    }

};
MtvObjRaw.prototype.chFavListSwapByChId = function (svl_id, ch_from_id, ch_to_id, fav_idx) {
	console.log('chFavListSwapByChId');
    this.getTvService();
    if (this.oconfig) {
		var arg = '{"PARAMETER":{"SVL_ID":"'+svl_id+'","CH_FROM":"'+ch_from_id+'","CH_TO":"'+ch_to_id+'","FAV_IDX":"'+fav_idx+'","REQUEST":"SET"}}';
		this.oconfig.chFavListSwapByChId(arg);
        mtvui_debug_log("chFavListSwapByChId:" + arg);
    }

};
MtvObjRaw.prototype.setOclToggleType = function (val) {

    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.setOclToggleType(val);
    }
    return ;
};
MtvObjRaw.prototype.getCabChannelId = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getCabChannelId();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
MtvObjRaw.prototype.getAirChannelId = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getAirChannelId();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
MtvObjRaw.prototype.getSatChannelId = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getSatChannelId();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
MtvObjRaw.prototype.getOclChannelId = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getOclChannelId();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
// the Tuner Type, "0" for DVB-T, "1" for DVB-C
MtvObjRaw.prototype.getDtvTunerType = function () {
	var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getDtvTunerType();
		res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
// the Tuner Bs src, "0" for DVBT, "1" for DVBC, "2" for DVBS.
MtvObjRaw.prototype.getDtvTunerBsSrc = function () {
    var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.getDtvTunerBsSrc();
        res = parseInt(JSON.parse(res).ITEMS[0].VALUE);
    }
    return res;
};
MtvObjRaw.prototype.setDtvTunerBsSrc = function (val) {
    var res = null;
    this.getTvService();
    if (this.oconfig) {
        res = this.oconfig.setDtvTunerBsSrc(val);
    }
    return res;
};
/*add for epg pvr*/
MtvObjRaw.prototype.isReminderEvent = function (mode_type, channel_id, event_id,start_time, duration,event_title, genre) {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var arg = {"PARAMETER": {
				"operation":1,
				"mode": mode_type,
				"channel_id": channel_id,
				"event_id": event_id,
				"start_time": start_time,
				"duration": duration,
				"rec_start_time": start_time,
				"rec_duration": duration,
				"event_title": event_title,
				"genre": genre,
				"REQUEST": "QUERY"}};
			var res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
			if (res) {
			    var ret = JSON.parse(res);
		        return ret.ITEMS[0];
		    }
	    }
    } catch (e) {
        console.log("get isReminderEvent fail");
        console.log(e);
    }
	return null;
};

MtvObjRaw.prototype.setOrClearReminder = function (mode_type, svl_id, channel_id,event_id, start_time, duration,rec_start_time,rec_duration,event_title,genre) {
    this.getTvService();
    try {
		if (this.oconfig) {

		    var info_data = 0; // APP_CFG_CUST_RMDR_INFO_TYPE_MASK_NONE MAKE_BIT_MASK_8(0)
		    if (svl_id == BRDCST_DVBT) {
		        info_data = 1; // APP_CFG_CUST_RMDR_INFO_TYPE_MASK_AIR  MAKE_BIT_MASK_8(0)
		    } else if (svl_id == BRDCST_DVBC) {
		        info_data = 2; // APP_CFG_CUST_RMDR_INFO_TYPE_MASK_CAB  MAKE_BIT_MASK_8(1)
		    } else if (svl_id == BRDCST_DVBS_GEN) {
		        info_data = 4; // APP_CFG_CUST_RMDR_INFO_TYPE_MASK_SAT  MAKE_BIT_MASK_8(2)
		    } else if (svl_id == BRDCST_DVBS_PREFER) {
		        info_data = 8; // APP_CFG_CUST_RMDR_INFO_TYPE_MASK_SAT_PREFERRED  MAKE_BIT_MASK_8(3)
		    } else {
		        info_data = 1;
		    }

			var arg = {"PARAMETER": {
				"operation":3,
				"mode": mode_type,
				"channel_id": channel_id,
				"event_id": event_id,
				"start_time": start_time,
				"duration": duration,
				"rec_start_time": rec_start_time,
				"rec_duration": rec_duration,
				"event_title": event_title,
				"genre": genre,
				"info_data": info_data,
				"REQUEST": "QUERY"}};
			var res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
	    }
    } catch (e) {
        console.log("setOrClearReminder fail");
        console.log(e);
    }
	return;
};

MtvObjRaw.prototype.setStartRecord = function (mode_type, channel_id, start_time, duration, rec_start_time, rec_duration, event_title) {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var arg = {"PARAMETER": {
				"operation": 7,
				"mode": mode_type,
				"channel_id": channel_id,
				"start_time": start_time,
				"duration": duration,
				"rec_start_time": rec_start_time,
				"rec_duration": rec_duration,
				"event_title": event_title,
				"REQUEST": "QUERY"}};
			var res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
	    }
    } catch (e) {
        console.log("set setStartRecord fail");
        console.log(e);
    }
	return;
};

MtvObjRaw.prototype.setStopRecord = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
            var res =  this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
            if (res) {
                var ret = JSON.parse(res);
                var  recording = parseInt(ret.ITEMS[0].is_recording);
    			if(recording == 1){
    			    this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":9,"REQUEST":"QUERY"}}');
    			}
		    }
	    }
    } catch (e) {
        console.log("set setStopRecord fail");
        console.log(e);
    }
	return;
};
MtvObjRaw.prototype.IsUsbReady = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var res = this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":2,"REQUEST":"QUERY"}}');
			var ret = JSON.parse(res);
			if(ret.ITEMS[0].is_usb_ready != true){
			    this.gotoSysPage("sys_index");
				//window.location = get_base_url() + "index.html";
			}
			return	ret.ITEMS[0].is_usb_ready;
	    }
    } catch (e) {
        console.log("get IsUsbReady fail");
        console.log(e);
    }
	return false;
};
MtvObjRaw.prototype.GetTotalReminderNum = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var res= this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":12,"REQUEST":"QUERY"}}');
			var ret = JSON.parse(res);
			return	ret.ITEMS[0].total_rmdr_num;
	    }
    } catch (e) {
        console.log("get GetTotalReminderNum fail");
        console.log(e);
    }
	return 0;
};
MtvObjRaw.prototype.GetReminder = function (mode,index) {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var arg = {"PARAMETER": {
				"operation": 5,
				"mode": mode,
				"slot": index,
				"REQUEST": "QUERY"}};
			var res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
			var	ret = JSON.parse(res);
			return	ret.ITEMS[0];
	    }
    } catch (e) {
        console.log("get GetTotalReminderNum fail");
        console.log(e);
    }
	return null;
};
MtvObjRaw.prototype.ClearAllReminders = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
			 this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":6,"REQUEST":"QUERY"}}');
			return;
	    }
    } catch (e) {
        console.log("get ClearAllReminders fail");
        console.log(e);
    }
	return ;
};
MtvObjRaw.prototype.CheckConflick = function (mode_type,channel_id,start_time, duration,is_ignore_special_slot,conflict_slot) {
    this.getTvService();
    try {
    	if (this.oconfig) {
    	    var res;

    	    if (mode_type == 1)
    	    {
    			var arg = {"PARAMETER": {
    				"operation": 10,
    				"mode": mode_type,
    				"channel_id": channel_id,
    				"start_time": start_time,
    				"duration": duration,
					"is_ignore_special_slot":is_ignore_special_slot,
					"conflict_slot":conflict_slot,
    				"REQUEST": "QUERY"}};
    			res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
    	    }
    	    else
    	    {
				var arg = {"PARAMETER": {
					"operation": 10,
					"mode": mode_type,
					"channel_id": channel_id,
					"rec_start_time": start_time,
					"rec_duration": duration,
					"is_ignore_special_slot":is_ignore_special_slot,
					"conflict_slot":conflict_slot,
					"REQUEST": "QUERY"}};
				res = this.oconfig.getPvrReminderEvent(JSON.stringify(arg));
		    }
			var	ret = JSON.parse(res);
			return	ret.ITEMS[0];
	    }
    } catch (e) {
        console.log("get CheckConflick fail");
        console.log(e);
    }
	return null;
};
MtvObjRaw.prototype.GetOnGoingReminder = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var res = this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
			var	ret = JSON.parse(res);
			if (ret.STATUS >= 0) {
			return	ret.ITEMS[0];
	    }
		    return null;
	    }
    } catch (e) {
        console.log("get GetOnGoingReminder fail");
        console.log(e);
    }
	return null;
};
MtvObjRaw.prototype.setPvrFileInfo = function (listid,file_status,resume_time) {
    this.getTvService();
    try {
    	if (this.oconfig) {
			if(file_status == true){
				file_status = 1;
			}
			else {
				file_status = 2;
			}
			var arg = {"PARAMETER": {
					"listId": listid,
					"fileStatus": file_status,
					"resumeTime": resume_time,
					"REQUEST": "SET"}};
			this.oconfig.setPvrFileInfo(JSON.stringify(arg));
			return;
	    }
    } catch (e) {
        console.log("Set setPvrFileInfo fail");
        console.log(e);
    }
	return ;
};
MtvObjRaw.prototype.isRecording = function () {
    this.getTvService();
    try {
    	if (this.oconfig) {
			var res = this.oconfig.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
			var ret = JSON.parse(res);
			return parseInt(ret.ITEMS[0].is_recording);
	    }
    } catch (e) {
        console.log("get isRecording fail");
        console.log(e);
    }
	return 0;
};
MtvObjRaw.prototype.isVoDAsset = function(){
	this.getTvService();
    try {
    	if (this.oconfig) {
			var cur_ch = this.oconfig.getCurrentChannelInfo('');
			if(cur_ch){
				if((cur_ch.NW_MASK & SB_VENT_ACTIVE)&&(cur_ch.NW_MASK & SB_VENT_VISIBLE)){
					return false;
				}
				if(cur_ch.CI_TUNE_SERVICE){
					return true;
				}
			}
			return false;
	    }
    } catch (e) {
        console.log("get isVoDAsset fail");
    }
	return false;
}
// the params for "startSettingMenu", should use the id;
// the params for "startNativeApp",   should use the name in PARAMETER object.
MtvObjRaw.prototype.nativeMenuMap = [
    {id: 1, name:"AllSettings"},
    {id: 2, name:"AutoTunerScan"},
    {id: 3, name:"Eco"},
    {id: 4, name:"PictureStyle"},
    {id: 5, name:"PictureFormat"},
    {id: 6, name:"SoundStyle"},
    {id: 7, name:"HeadphonesVolume"},
    {id: 8, name:"Speakers"},
    {id: 9, name:"Clock"},
    {id:10, name:"SleepTimer"},
    {id:11, name:"UpdateSoftware"},
    {id:12, name:"DemoMe"},
    {id:13, name:"NetTV"},
    {id:14, name:"SatelliteTunerScan"},
    {id:15, name:"QuickSettings"},
    {id:17, name:"OneHelpMenu"}
];
MtvObjRaw.prototype.startNativeApp = function (arg) {
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility)
        return tvJspObj.utility.startNativeApp(typeof arg === 'string' ? arg : JSON.stringify(arg));
    return null;
};
MtvObjRaw.prototype.startSettingMenu = function (arg) {
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility)
        return tvJspObj.utility.startSettingMenu(typeof arg === 'string' ? arg : JSON.stringify(arg));
    return null;
};

// {"PARAMETER": {"appMode":appMode, "edfuUrl":URL, "REQUEST":"SET"}};
// the appMode could be:"IPEPG", "IPEPG_INFO_NOW", "IPEPG_INFO_NEXT", "OTRECORD", "MYRECORDING", "EDFU"
// the "edfuUrl" only avaliable when the appMode is "EDFU"
MtvObjRaw.prototype.startNetTV = function (arg) {
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility)
        return tvJspObj.utility.startNetTV(typeof arg === 'string' ? arg : JSON.stringify(arg));
    return null;
};
// {"exitReason":"CHANGE_SOURCE","REQUEST":"SET"}
// the reason candidate: GOTO_LAST_SOURCE, CHANGE_SOURCE, PUSHN_OFF, EDFU_OFF
MtvObjRaw.prototype.exitNetTV = function (arg) {
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility)
        return tvJspObj.utility.exitNetTV(typeof arg === 'string' ? arg : JSON.stringify(arg));
    return null;
};

MtvObjRaw.prototype.hbbtvFunction = function (arg) {
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility)
        return tvJspObj.utility.hbbtvFunction(typeof arg === 'string' ? arg : JSON.stringify(arg));
    return null;
};

MtvObjRaw.prototype.setVolumeMute = function (arg) {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.setVolumeMute(arg);
	}
	return ret;
};
MtvObjRaw.prototype.getVolumeMute = function () {
    this.getTvService();
    if (this.oconfig) {
		res = this.oconfig.getVolumeMute();
	    var	ret = JSON.parse(res);
		return	ret.ITEMS[0].VALUE;
	}
	return -1;
};

MtvObjRaw.prototype.setVolumeValue = function (arg) {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.setVolumeValue(arg);
	}
	return ret;
};
MtvObjRaw.prototype.getVolumeValue = function () {
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.getVolumeValue();
	    var	ret = JSON.parse(res);
		return	ret.ITEMS[0].VALUE;
	}
	return -1;
};
MtvObjRaw.prototype.increaseVolume = function () {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.increaseVolume('');
	}
	return ret;
};
MtvObjRaw.prototype.decreaseVolume = function () {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.decreaseVolume('');
	}
	return ret;
};
MtvObjRaw.prototype.addTvServerListener = function (name, notifyFunc) {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.addEventListener(name, notifyFunc);
	}
	return ret;
};
MtvObjRaw.prototype.removeTvServerListener = function (name, notifyFunc) {
	ret = -1;
    this.getTvService();
    if (this.oconfig) {
		ret = this.oconfig.removeEventListener(name, notifyFunc);
	}
	return ret;
};

// the jsPlugin don't support multiple listener, do some trick to support multiple listner.
MtvObjRaw.prototype.listenerList = {};
MtvObjRaw.prototype.addEventListener = function (name, notifyFunc) {
    var ret = -1;
    this.getTvService();
    if (this.tvServices) {
        if (!MtvObjRaw.prototype.listenerList.hasOwnProperty(name)) {
            MtvObjRaw.prototype.listenerList[name] = [notifyFunc];
            var tvSvc = this.tvServices;
            var funList = MtvObjRaw.prototype.listenerList[name];
            ret = this.oconfig.addEventListener(name, function () {
                var arg = arguments;
                funList.forEach(function (element, index, array) {
                    element.apply(tvSvc, arg);
                });
            });
        }
        else {
            var idx = MtvObjRaw.prototype.listenerList[name].indexOf(notifyFunc);
            if (idx < 0)
                MtvObjRaw.prototype.listenerList[name].push(notifyFunc);
            ret = 0;
        }
    }
    return ret;
};
MtvObjRaw.prototype.removeEventListener = function (name, notifyFunc) {
    var ret = -1;
    this.getTvService();
    if (this.tvServices) {
        if (MtvObjRaw.prototype.listenerList.hasOwnProperty(name)) {
            var idx = MtvObjRaw.prototype.listenerList[name].indexOf(notifyFunc);
            if (idx >= 0)
                MtvObjRaw.prototype.listenerList[name].splice(idx, 1);
            if (MtvObjRaw.prototype.listenerList[name].length == 0) {
                // the real listener is lambda function, not support remove
                // delete listenerList[name];
                // ret = this.tvServices.removeEventListener(name, notifyFunc);
            }
        }
    }
    return ret;
};

MtvObjRaw.prototype.isCiPlusHostTune = function () {

    this.getTvService();

    if (this.oconfig)
    {
        if (this.isZiggoOperator() == false) {
            return false;
        }

		var brdcst_tune_ret = this.oconfig.getCiHostTuneBroadcastStatus('');
		var brdcst_ret = 0;
        if (brdcst_tune_ret){
            var is_ci_brdcst_tune = JSON.parse(brdcst_tune_ret);
            brdcst_ret = is_ci_brdcst_tune.ITEMS[0].VALUE;
        }

        var chInfo = null;
	    var ret = this.oconfig.getCurrentChannelInfo('');
	    var tmp = JSON.parse(ret);
	    if (tmp.STATUS >= 0) {
	        chInfo = tmp.ITEMS[0];
	    }

	    if (brdcst_ret || (chInfo && chInfo.CI_TUNE_SERVICE)){
	    	return true;
	    }

		if (chInfo) {

	        var SB_VNET_ACTIVE             = (1 << 1);
	        var SB_VNET_VISIBLE            = (1 << 3);
	        // Exception: NOT a hidden channel
	        if ( (chInfo.NW_MASK & SB_VNET_ACTIVE) && (chInfo.NW_MASK & SB_VNET_VISIBLE) ) {
	             return false;
	         } else {
	             return true;
	         }
	     }
	}
	return false;
};

MtvObjRaw.prototype.selectTvSource = function (arg) {
    var ret = -1;
    this.getTvService();
    if (this.oconfig)
        ret = this.oconfig.selectTvSource(arg);
    return ret;
};
MtvObjRaw.prototype.selectSatelliteSource = function (arg) {
    var ret = -1;
    this.getTvService();
    if (this.oconfig)
        ret = this.oconfig.selectSatelliteSource(arg);
    return ret;
};
MtvObjRaw.prototype.getLangString = function (strId) {
    this.getTvService();
    if (this.tvServices) {
        var arg = {"PARAMETER": {"langId":strId, "REQUEST":"QUERY"}};
        var ret = this.tvServices.getLangString(JSON.stringify(arg));
        var res = JSON.parse(ret);
        if (res.STATUS == 0)
            return res.ITEMS[0].langString;
    }
    return "";
};
MtvObjRaw.prototype.getChannelLogoPath = function (iconIdx) {
    this.getTvService();
    if (this.tvServices) {
        var ret = this.tvServices.getChannelLogoPath(iconIdx);
        if (ret) {
            var res = JSON.parse(ret);
            if (res.STATUS == 0)
                return res.ITEMS[0].TEXT;
        }
    }
    return null;
};
/**
 * @brief This function using to Start NetTV by special App mode.
 * @param [in] appMode           - "IPEPG"
 *                                 "IPEPG_INFO_NOW"
 *                                 "IPEPG_INFO_NEXT"
 *                                 "OTRECORD"
 *                                 "MYRECORDING"
 * @param [out] none
 * @return return true or false
 * @retval true  - indicate start NetTV or Network Wizard success.
 * @retval false - indicate start NetTV or Network Wizard not success.
 */
MtvObjRaw.prototype.startNetTvByAppMode = function (appMode) {

    var val = this.acfgGetConfigValue("g_misc__tv_guide_from_network");
    if (val == 1)
    {
        var b_network_status = this.acfgGetConfigValue("g_misc__check_network_status");
        if (b_network_status != 1)
        {
            // If the network connection is missing, go to network install wizard
            var arg = {"PARAMETER": {"VALUE":"NetworkWizard","REQUEST":"MODIFY"}};
            this.startNativeApp(JSON.stringify(arg));
            mtvuiUtil.gotoSysPage("sys_index", true);
            return true;
        }

        // Go to IPEPG one touch recording page
        if (appMode == "OTRECORD")
        {
            //this.exitNetTV({"PARAMETER": {"exitReason":"CHANGE_SOURCE","REQUEST":"SET"}});

            var arg = {"PARAMETER": {"appMode":appMode, "REQUEST":"SET"}};
            this.startNetTV(JSON.stringify(arg));
            mtvuiUtil.gotoSysPage("sys_index", true);
            return true;
        }

        var b_ipepg_enable = this.acfgGetConfigValue("g_misc__check_ip_epg_enable_status");
        if (b_ipepg_enable == 1)
        {
            var a_browser = this.acfgGetConfigValue("g_misc__check_browser_status");
            if (a_browser != 1) // 1: BROW_INIT_OK
            {
                return false;
            }

            var b_ipepg_available = this.acfgGetConfigValue("g_misc__check_ip_epg_available_status");
            if (b_ipepg_available == 1)
            {
                //this.exitNetTV({"PARAMETER": {"exitReason":"CHANGE_SOURCE","REQUEST":"SET"}});

                var arg = {"PARAMETER": {"appMode":appMode, "REQUEST":"SET"}};
                this.startNetTV(JSON.stringify(arg));
                mtvuiUtil.gotoSysPage("sys_index", true);
                return true;
            }
        }
    }

    return false;
};

MtvObjRaw.prototype.acfgGetConfigRange = function (cfg_id) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = this.oconfig.getConfigRange('{"PARAMETER":{"cfgId":"'+cfg_id+'","REQUEST":"QUERY"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return null;
};
MtvObjRaw.prototype.checkUsbDiskTypeByPath = function (path) {
    try {
        this.getTvService();

        if (this.oconfig)
        {
            var res = mmpServices.checkUsbDiskTypeByPath('{"PARAMETER":{"PATH":"'+path+'","REQUEST":"QUERY"}}');
            return res;
        }
    }
    catch(err) {
        mtvui_debug_log(err);
    }

    return null;
};

MtvObjRaw.prototype.getNetTVAppMode = function () {
	var ret = null;
    var tvJspObj = getTvJspService();
    if (tvJspObj && tvJspObj.utility){
        var res =  tvJspObj.utility.getNetTVAppMode('');
		if(res){
			res = JSON.parse(res);
			ret = res.ITEMS[0].appMode;
		}
	}
    return ret;
};

// the MtvObj should after all MtvObjRaw's stuff.
var MtvObj = function () {
    this.supper = new MtvObjRaw();
    if (!MtvObj.prototype.init_funs) {
        for (var i in MtvObjRaw.prototype) {
            if (typeof MtvObjRaw.prototype[i] === 'function' && !MtvObj.prototype[i])
                MtvObj.prototype[i] = (function (fn) {return function () {
                    try { return MtvObjRaw.prototype[fn].apply(this.supper, arguments); }
                    catch (err) { console.log(fn.toString, err); }
                    return null;
                };})(i);
        }
        MtvObj.prototype.init_funs = true;
    }
};
MtvObj.prototype.init_funs = false;

// return the lang string in uppercase (getGuiLanguage return raw result)
MtvObj.prototype.getUILang = function () {
    try {
        lang = this.supper.getGuiLanguage('');
        return (lang && 0 == lang.STATUS) ? lang.ITEMS[0].TEXT.toUpperCase() : null;
    }
    catch(err) { mtvui_debug_log(err);}
    return null;
};

(function () {
    if (mtvuiUtil.isFramed()) {
        var pageInfo = mtvuiUtil.getCurrentPageInfo();
        if (pageInfo.id == "sys_index") {
            mtvuiUtil.exitMenu();
        }
        else {
            mtvuiUtil.sendPageID();
        }
    }
    else {
        mtvuiUtil.sendPageID();
   //register listener for usb Detect,add for mmp
	 try {
	 	mtvuiUtil.replaceConsole();
        onerror=mtvuiUtil.handleErr;
		var mmpServices = getCBMmpService();
		if (mmpServices) {
			window.dmrUtil.switchDmr();
			mmpServices.addEventListener('UsbDetectNotify', onUsbDetect);
			mmpServices.addEventListener('PusNotify', onPusFunc);
		}
	 }catch(err) {console.log(err);}
    }

    // if ("Win32" != navigator.platform)
    //     mtvuiUtil.replaceConsole();
})();