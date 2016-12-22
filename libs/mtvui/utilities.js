MtvUtilities = function () {
    this.mtvObj = new MtvObj();
};

if (GLOBAL_MODE == "AOC") {
	MtvUtilities.prototype.getList = function () {
		return [
			// {"type":"utilities", "id": "youtube", "name": "YouTube",                                             "icon": "../libs/test-res/youtube.png"},
			// {"type":"utilities", "id": "netflix", "name": "NetFlix",                                             "icon": "../libs/test-res/netflix.png"},
			// {"type":"utilities", "id": "amazon",  "name": "Amazon",                                              "icon": "../libs/test-res/amazon.png"}
			{"type":"utilities", "id": "smarttv",       "name": this.mtvObj.getLangString('HS_SMART_TV'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_99_Smart_TV_hl_64x64_px.png"},
			{"type":"utilities", "id": "internet",      "name": this.mtvObj.getLangString('MAIN_INTERNET'),         "icon": "../2K16_4K_UX_Asset/Icons/icon_70_open_internet_hl_64x64_px.png"},
			{"type":"utilities", "id": "tvguid",        "name": this.mtvObj.getLangString('HS_ITEM_EPG'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_149_TV_Guide_hl_64x64_px.png"},
			{"type":"utilities", "id": "recording",     "name": this.mtvObj.getLangString('HS_RECORDINGS'),         "icon": "../2K16_4K_UX_Asset/Icons/icon_87_Recordings_Application_hl_64x64_px.png"},
			//{"type":"utilities", "id": "browseusb",     "name": this.mtvObj.getLangString('HS_BROWSE_USB'),       "icon": "../2K16_4K_UX_Asset/Icons/icon_193_USB_hl_64x64_px.png"},
			//{"type":"utilities", "id": "browsenet",     "name": this.mtvObj.getLangString('HS_BROWSE_NW'),        "icon": "../2K16_4K_UX_Asset/Icons/icon_213_Network_TV_hl_64x64_px.png"},
			{"type":"utilities", "id": "channelmatrix", "name": this.mtvObj.getLangString('ID_DECOD_CHAN'), "icon": "../2K16_4K_UX_Asset/Icons/icon_punched_Local_Control_Channels_hl_48x48_px.png"},
			{"type":"utilities", "id": "updatesoftware","name": this.mtvObj.getLangString('MAIN_SETUP_UPDATE'),     "icon": "../2K16_4K_UX_Asset/Icons/icon_12_Software_Update_hl_64x64_px.png"},
			// {"type":"utilities", "id": "demome",        "name": this.mtvObj.getLangString('MAIN_APP_NAME_DEMO_ME'), "icon": "../2K16_4K_UX_Asset/Icons/icon_83_Demo_Mode_hl_64x64_px.png"},
			{"type":"utilities", "id": "onehelp",       "name": this.mtvObj.getLangString('MAIN_APP_NAME_HELP'),    "icon": "../2K16_4K_UX_Asset/Icons/icon_125_Help_hl_64x64_px.png"}
			//{"type":"utilities", "id": "bbc_catal",     "name": "BBC Catal",                                        "icon": "../libs/test-res/icon_00_catal_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_news",      "name": "BBC News",                                         "icon": "../libs/test-res/icon_00_news_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_iplayer",   "name": "BBC iPlayer",                                      "icon": "../libs/test-res/icon_00_iplayer_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_sport",     "name": "BBC Sport",                                        "icon": "../libs/test-res/icon_00_sport_hl_64x64_px.png"}
		];
	};
} else {
	MtvUtilities.prototype.getList = function () {
		return [
			// {"type":"utilities", "id": "youtube", "name": "YouTube",                                             "icon": "../libs/test-res/youtube.png"},
			// {"type":"utilities", "id": "netflix", "name": "NetFlix",                                             "icon": "../libs/test-res/netflix.png"},
			// {"type":"utilities", "id": "amazon",  "name": "Amazon",                                              "icon": "../libs/test-res/amazon.png"}
			{"type":"utilities", "id": "smarttv",       "name": this.mtvObj.getLangString('HS_SMART_TV'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_99_Smart_TV_hl_64x64_px.png"},
			{"type":"utilities", "id": "internet",      "name": this.mtvObj.getLangString('MAIN_INTERNET'),         "icon": "../2K16_4K_UX_Asset/Icons/icon_70_open_internet_hl_64x64_px.png"},
			{"type":"utilities", "id": "tvguid",        "name": this.mtvObj.getLangString('HS_ITEM_EPG'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_149_TV_Guide_hl_64x64_px.png"},
			{"type":"utilities", "id": "recording",     "name": this.mtvObj.getLangString('HS_RECORDINGS'),         "icon": "../2K16_4K_UX_Asset/Icons/icon_87_Recordings_Application_hl_64x64_px.png"},
			//{"type":"utilities", "id": "browseusb",     "name": this.mtvObj.getLangString('HS_BROWSE_USB'),       "icon": "../2K16_4K_UX_Asset/Icons/icon_193_USB_hl_64x64_px.png"},
			//{"type":"utilities", "id": "browsenet",     "name": this.mtvObj.getLangString('HS_BROWSE_NW'),        "icon": "../2K16_4K_UX_Asset/Icons/icon_213_Network_TV_hl_64x64_px.png"},
			{"type":"utilities", "id": "channelmatrix", "name": this.mtvObj.getLangString('ID_DECOD_CHAN'), "icon": "../2K16_4K_UX_Asset/Icons/icon_punched_Local_Control_Channels_hl_48x48_px.png"},
			{"type":"utilities", "id": "updatesoftware","name": this.mtvObj.getLangString('MAIN_SETUP_UPDATE'),     "icon": "../2K16_4K_UX_Asset/Icons/icon_12_Software_Update_hl_64x64_px.png"},
			{"type":"utilities", "id": "demome",        "name": this.mtvObj.getLangString('MAIN_APP_NAME_DEMO_ME'), "icon": "../2K16_4K_UX_Asset/Icons/icon_83_Demo_Mode_hl_64x64_px.png"},
			{"type":"utilities", "id": "onehelp",       "name": this.mtvObj.getLangString('MAIN_APP_NAME_HELP'),    "icon": "../2K16_4K_UX_Asset/Icons/icon_125_Help_hl_64x64_px.png"}
			//{"type":"utilities", "id": "bbc_catal",     "name": "BBC Catal",                                        "icon": "../libs/test-res/icon_00_catal_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_news",      "name": "BBC News",                                         "icon": "../libs/test-res/icon_00_news_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_iplayer",   "name": "BBC iPlayer",                                      "icon": "../libs/test-res/icon_00_iplayer_hl_64x64_px.png"},
			//{"type":"utilities", "id": "bbc_sport",     "name": "BBC Sport",                                        "icon": "../libs/test-res/icon_00_sport_hl_64x64_px.png"}
		];
	};
}

MtvUtilities.prototype.procItem = function (id) {
    if (id == "smarttv")
        return this.startNetTV("NETTV");
    if (id == "internet") {
		this.startNetTV("OPEN_INTERNET");
		mtvuiUtil.gotoSysPage("sys_index", true);
		return true;
	}
        
    if (id == "onehelp")
        //return this.startNetTV("EDFU", "/usr/opera/opera_dir/pages/edfu/index.html");
        return this.procSettings("OneHelpMenu");
    if (id == "tvguid")
        return mtvuiUtil.gotoSysPage("sys_page_epg");
    if (id == "recording")
        return mtvuiUtil.gotoSysPage("sys_page_pvr");
    if (id == "browseusb")
        return mtvuiUtil.gotoSysPage("sys_content_browser_usb");
    if (id == "browsenet")
        return mtvuiUtil.gotoSysPage("sys_content_browser_network");
    if (id == "channelmatrix")
        return mtvuiUtil.gotoSysPage("sys_channel_matrix");
    if (id == "updatesoftware") {
		this.procSettings("UpdateSoftware");
		mtvuiUtil.gotoSysPage("sys_index", true);
		return true;
	}
    if (id == "demome")
        return this.procSettings("DemoMe");
    if (id == "bbc_catal")
        return this.startHbbtv("http://www.test.bbc.co.uk/catal/?config=precert");
    if (id == "bbc_news")
        return this.startHbbtv("http://www.test.bbc.co.uk/newsontal/?config=precert");
    if (id == "bbc_iplayer")
        return this.startHbbtv("http://www.test.bbc.co.uk/iplayer/?config=precert");
    if (id == "bbc_sport")
        return this.startHbbtv("http://www.test.bbc.co.uk/sprtiptvjs/?config=precert");
    return false;
};
MtvUtilities.prototype.procSettings = function (id) {
    var arg = id;
    if (typeof id === "string")
        arg = {"PARAMETER": {
            "VALUE":id,
            "REQUEST":"MODIFY"}};
    this.mtvObj.startNativeApp(arg);
    mtvuiUtil.gotoSysPage("sys_index", true);
};
MtvUtilities.prototype.startHbbtv = function (url) {
    var arg = {"PARAMETER":{
        "funcType":4,
        "appType":3,
        "appUri":url,
        "REQUEST":"SET"}};
    this.mtvObj.hbbtvFunction(JSON.stringify(arg));
    mtvuiUtil.gotoSysPage("sys_index", true);
};
MtvUtilities.prototype.startNetTV = function (id, url) {
    var arg = {"PARAMETER": {
        "appMode": id,
        "REQUEST":"SET"}};
    if (url)
        arg.PARAMETER["edfuUrl"] = url;
    this.mtvObj.startNetTV(JSON.stringify(arg));
    mtvuiUtil.gotoSysPage("sys_index", true);
};
