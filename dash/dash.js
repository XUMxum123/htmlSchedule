var DashObj = function () {
    this.tvjsp = null;
    this.mtvObj = new MtvObj();
    this.mtvUtilities = null;
    this.inputSrcList = [];
    this.settingsList = [];
    this.utilitiesList = [];
    this.getLangString = function (strId) {
        return this.mtvObj.getLangString(strId);
    };
    this.getCurrentChannelInfo = function () {
        var ret = null;
        var item = this.mtvObj.getCurrentChannelInfo();
        if (item) {
            var icon = mtvuiUtil.getChannelLogoSrc(item.CH_LOGO_ID);
            ret = {
                "type": "channel",
                "brdType": item.BRDCST_TYPE,
                "name": item.SERVICE_NAME,
                "id": item.CHANNEL_ID,
                "num": item.MAJOR_NUM,
                "icon": icon
            };
        }
        return ret;
    };
    this.getEpgNowEvent = function (chid) {
        return this.mtvObj.getEpgNowEvent(chid);
    };
    this.getChannelCount = function ()  {
        var curChObj  = mtvuiChannel.getCurrentChannelObj();
        return mtvuiChannel.getChannelCount(curChObj);
    };
    this.getChannelList = function (nPerPage) {
        var curChObj  = mtvuiChannel.getCurrentChannelObj();
        if (!curChObj)
            return [];
        var chListType = parseInt(this.mtvObj.getChannelListType());
        var curIdx = mtvuiChannel.getChannelIndex(curChObj, MaskList.Mask_all, MaskValueList.MaskValue_all);
        var low = parseInt(curIdx / nPerPage) * nPerPage;
        var lowChObj = curChObj;
        if (curIdx != low) {
            lowChObj = mtvuiChannel.getChannelInfoByIndex(curChObj, MaskList.Mask_all, MaskValueList.MaskValue_all, low);
            lowChObj = lowChObj || curChObj;
        }
        var list = mtvuiChannel.getChannelList({"CHANNEL_ID":lowChObj.CHANNEL_ID, "DIRECTION":"NEXT", "NUM": nPerPage});
        if ((lowChObj.NW_MASK & MaskList.Mask_all) == MaskList.Mask_all) {
            list.unshift(lowChObj);
            list = list.slice(0, nPerPage);
        }
        var ret = [];
        $.each(list, function (k, item) {
            var icon = mtvuiUtil.getChannelLogoSrc(item.CH_LOGO_ID);
            ret.push({
                "type": "channel",
                "name": item.SERVICE_NAME,
                "id": item.CHANNEL_ID,
                "num": item.MAJOR_NUM,
                "icon": icon,
                "mask": item.NW_MASK
            });
            console.log(item);
        });
        return ret;
    };
    this.setBrdcastChgChannel = function (chID) {
        this.mtvObj.pause3rdApp();
        return this.mtvObj.setBrdcastChgChannel(chID);
    };
    this.getInputList = function (count) {
        if (!this.inputSource)
            this.inputSource = new InputSource();
        var inputList = this.inputSource.getInputList();
        if (!inputList || inputList.length <= 0)
            return [];
        // assume there are 0-12 items, if active is item[11], show 2-11 (drop the 0,1, 12)
        for (var i in inputList) {
            if (inputList[i].active) {
                var m = Math.max(count, parseInt(i/2 + 1) * 2);
                return inputList.slice(m - count, m);
            }
        }
        return inputList.slice(0, count);
    };
    this.checkTimeShift = function (arg) {
        if (!this.inputSource)
            this.inputSource = new InputSource();
        if (this.inputSource.checkTimeShift())
            return true;
        return false;
    };
    this.setInputSource = function (arg) {
        if (!this.inputSource)
            this.inputSource = new InputSource();
        if (this.inputSource.checkTimeShift())
            return false;
        return this.inputSource.setInputSource(arg);
    };
    this.isPipAvaliable  = function () {
		if (this.mtvObj.acfgGetConfigValue("g_misc__wfd_is_on") == 0) {
			console.info("[HTML5_UI]WFD is off!");
			if (!this.inputSource)
				this.inputSource = new InputSource();
			// check the NetTV is active
			if (mtvuiUtil.getNetTvStatus())
				return false;
			// check the 3rd app (eg: NetFlix ...) is running
			if (mtvuiUtil.get3rdAppStatus())
				return false;
			
			// fix CR DTV00775105, BEG. content browser mode disable PIP.
			if (mtvuiUtil.isMenuShow())
				return false;
			if (mtvuiUtil.getParentPageID().indexOf('sys_content_browser') >= 0)
				return false;
			if (mtvuiUtil.getParentPageID().indexOf('sys_content_browser_usb') >= 0)
				return false;
			if (mtvuiUtil.getParentPageID().indexOf('sys_content_browser_network') >= 0)
				return false;
			// fix CR DTV00775105, END.
			
			return this.inputSource.isPipAvaliable();
		}
		console.info("[HTML5_UI]WFD is on!");
		return false;
        
    };
    this.getSettingsList = function () {
        var ret = [
            {"type":"settings", "id":"Eco",             "name":this.mtvObj.getLangString('MAIN_ECO_SETTINGS'),      "icon": "../2K16_4K_UX_Asset/Icons/icon_10_Eco_hl_64x64_px.png"},
            {"type":"settings", "id":"PictureStyle",    "name":this.mtvObj.getLangString('EXP_SETTING_SMART_PIC'),  "icon": "../2K16_4K_UX_Asset/Icons/icon_98_Media_Photos_hl_64x64_px.png"},
            {"type":"settings", "id":"PictureFormat",   "name":this.mtvObj.getLangString('EXP_SETTING_PIC_FORMAT'), "icon": "../2K16_4K_UX_Asset/Icons/icon_28_Picture_Format_hl_64x64_px.png"},
            {"type":"settings", "id":"SoundStyle",      "name":this.mtvObj.getLangString('EXP_SETTING_SMART_SND'),  "icon": "../2K16_4K_UX_Asset/Icons/icon_50_Sound_hl_64x64_px.png"},
            {"type":"settings", "id":"Ambilight",       "name":this.mtvObj.getLangString('ID_AMB_STYLE'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_2_Ambilight_Style_hl_64x64_px.png"},
            {"type":"settings", "id":"HeadphonesVolume","name":this.mtvObj.getLangString('EXP_SETTING_HDPHONE_VOL'),"icon": "../2K16_4K_UX_Asset/Icons/icon_66_Headphone_Volume_hl_64x64_px.png"},
            {"type":"settings", "id":"Speakers",        "name":this.mtvObj.getLangString('EXP_SETTING_SPEAKERS'),   "icon": "../2K16_4K_UX_Asset/Icons/icon_197_Speakers_hl_64x64_px.png"},
            {"type":"settings", "id":"Clock",           "name":this.mtvObj.getLangString('OPTION_CLOCK'),           "icon": "../2K16_4K_UX_Asset/Icons/icon_303_Clock_hl_64x64_px.png"},
            {"type":"settings", "id":"SleepTimer",      "name":this.mtvObj.getLangString('HS_SLEEP_TIMER'),         "icon": "../2K16_4K_UX_Asset/Icons/icon_158_Remiders_hl_64x64_px.png"}
            //{"type":"settings", "id":"AllSettings",     "name":mtvuiLangDict['MAIN_ALL_SETTINGS'),    "icon": "../2K16_4K_UX_Asset/Icons/icon_7_Settings_Setup_hl_64x64_px.png"}
        ];
        var removeItem = function (id) {
            for (var i in ret)
                if (ret[i].id == id)
                    return ret.splice(i, 1); // splice will drop the item
            return null;
        };
        // get the speaker status, 0-on, 1-off, 2-EasyLink, 3-EasyLink autostart
        var cec_sac = this.mtvObj.acfgGetConfigValue("g_cec__cec_sac_func");
        if (cec_sac == 0 || cec_sac == 2 || cec_sac == 3)
            removeItem("Speakers");
        // has ambilight
        var CFG_MISC_HAS_AMBILIGHT = "g_misc__has_ambilight";
        if (this.mtvObj.acfgGetConfigValue(CFG_MISC_HAS_AMBILIGHT) <= 0)
            removeItem("Ambilight");
        return ret;
    };
    this.getUtilitiesList = function (count) {
        if (!this.mtvUtilities)
            this.mtvUtilities = new MtvUtilities();
        var list = this.mtvUtilities.getList();
        return list.slice(0, count);
    };
    this.procUtilities = function (id) {
        if (!this.mtvUtilities)
            this.mtvUtilities = new MtvUtilities();
        return this.mtvUtilities.procItem(id);
    };
    this.procSettings = function (id) {
        var arg = id;
        if (typeof id === "string")
            arg = {"PARAMETER": {
                "VALUE":id,
                "REQUEST":"MODIFY"}};
        this.mtvObj.startNativeApp(arg);
        gotoSysPage("sys_index");
    };
    this.scanChannel = function (mode) {
        mode = mode || ((this.mtvObj.getDtvTunerBsSrc() == "2") ? "SatelliteTunerScan" : "AutoTunerScan");
        this.procSettings(mode);
    };
    this.getUILang = function (type)  {
        return this.mtvObj.getUILang(type);
    },
    this.getBroadcastUtcTime = function () {
        return this.mtvObj.getBroadcastUtcTime();
    };
    this.isCiPlusHostTune = function () {
        return this.mtvObj.isCiPlusHostTune();
    };
    this.pipRegionStart = function (arg) {
        var param = '{"PARAMETER":{"MVIEW_VALUE":' + arg.v
            +',"MVIEW_REGION_X":'+(arg.x/window.screen.width *10000)
            +',"MVIEW_REGION_Y":'+(arg.y/window.screen.height*10000)
            +',"MVIEW_REGION_W":'+(arg.w/window.screen.width *10000)
            +',"MVIEW_REGION_H":'+(arg.h/window.screen.height*10000)
            +',"REQUEST":"SET"}}';
        try {
            // display TV in region when TV is present
            if (!this.isPipAvaliable()) {
                // this.mtvObj.mviewChgDisplayRegion(param);
                return true;
            }
            // TV not presetn, display PIP in region
            if (!window.pipModeActive) {
                window.pipModeActive = true;
                this.mtvObj.mviewSetTvMode(1); // 0 : Normal mode 1: PIP Mode 2: POP mode
            }
            this.mtvObj.mviewStartSubVideo(param);
            // tvSvc.mviewStartMainVideo(...);
        } catch(err) {
            console.log(err);
            return false;
        }
        return true;
    };
    this.pipRegionStop = function (arg) {
        try {
            if (window.pipModeActive) {
                window.pipModeActive = false;
                this.mtvObj.mviewStopSubVideo('');
                // tvSvc.mviewStopMainVideo('');
                this.mtvObj.mviewSetTvMode(0);
            }
            else {
                var param = '{"PARAMETER":{"MVIEW_VALUE":' + arg.v
                    +',"MVIEW_REGION_X":'+(arg.x/window.screen.width *10000)
                    +',"MVIEW_REGION_Y":'+(arg.y/window.screen.height*10000)
                    +',"MVIEW_REGION_W":'+(arg.w/window.screen.width *10000)
                    +',"MVIEW_REGION_H":'+(arg.h/window.screen.height*10000)
                    +',"REQUEST":"SET"}}';
                // this.mtvObj.mviewChgDisplayRegion(param);
                return true;
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    };
};
