var InputSourceRaw = function () {
    this.mtvObj = this.getMtvObj();
};

InputSourceRaw.prototype.getMtvObj = function () {
    if (!InputSourceRaw.prototype.mtvObj)
        InputSourceRaw.prototype.mtvObj = new MtvObj();
    return InputSourceRaw.prototype.mtvObj;
};

InputSourceRaw.prototype.tvID        = "1";
InputSourceRaw.prototype.cableID     = "1_1"; // use under stash "_", it part of variable for most language.
InputSourceRaw.prototype.antennaID   = "1_2";
InputSourceRaw.prototype.satelliteID = "1_3";
InputSourceRaw.prototype.usbID       = "1_7";
InputSourceRaw.prototype.networkID   = "1_8";

InputSourceRaw.prototype.getAliasMap = function () {
    if (!InputSourceRaw.prototype.deviceNameArray)
        InputSourceRaw.prototype.deviceNameArray = [
            {name: "DVD",      icon: "../2K16_4K_UX_Asset/Icons/icon_179_DVD_Player_hl_48x48_px.png"},
            {name: "BLU_RAY",  icon: "../2K16_4K_UX_Asset/Icons/icon_176_Blue_ray_Disc_Player_hl_48x48_px.png"},
            {name: "HDD_DVDR", icon: "../2K16_4K_UX_Asset/Icons/icon_182_HD_Recorder_hl_48x48_px.png"},
            {name: "RECORDER", icon: "../2K16_4K_UX_Asset/Icons/icon_87_Recordings_Application_hl_48x48_px.png"},
            {name: "VCR",      icon: "../2K16_4K_UX_Asset/Icons/icon_187_VHS_VCR_hl_48x48_px.png"},
            {name: "GAME",     icon: "../2K16_4K_UX_Asset/Icons/icon_91_Game_hl_48x48_px.png"},
            {name: "PC",       icon: "../2K16_4K_UX_Asset/Icons/icon_166_PC_hl_48x48_px.png"},
            {name: "DIG_STB",  icon: "../2K16_4K_UX_Asset/Icons/icon_183_Digital_Receiver_hl_48x48_px.png"}
        ];
    return InputSourceRaw.prototype.deviceNameArray;
};

InputSourceRaw.prototype.getCecMap = function() {
    if (!InputSourceRaw.prototype.cecIconArray)
        InputSourceRaw.prototype.cecIconArray = [
            {name: "unspecified_dev",  icon: "../2K16_4K_UX_Asset/Icons/icon_188_Unspecified_Device_hl_48x48_px.png"},
            {name: "hd_recorder",      icon: "../2K16_4K_UX_Asset/Icons/icon_182_HD_Recorder_hl_48x48_px.png"},
            {name: "digital_receiver", icon: "../2K16_4K_UX_Asset/Icons/icon_183_Digital_Receiver_hl_48x48_px.png"},
            {name: "hts",              icon: "../2K16_4K_UX_Asset/Icons/icon_198_HTS_hl_48x48_px.png"},
            {name: "dvd_player",       icon: "../2K16_4K_UX_Asset/Icons/icon_179_DVD_Player_hl_48x48_px.png"}];
    return InputSourceRaw.prototype.cecIconArray;
};

InputSourceRaw.prototype.getInputIcon = function (id, name) {
    if (!InputSourceRaw.prototype.inputIconArray)
        InputSourceRaw.prototype.inputIconArray =
        [{"nameReg":/^TV.*/i,        "icon": "../2K16_4K_UX_Asset/Icons/icon_73_Watch_TV_hl_64x64_px.png"},
         {"nameReg":/^Cable TV/i,    "icon": "../2K16_4K_UX_Asset/Icons/icon_209_Antenna_hl_64x64_px.png"},
         {"nameReg":/^Antenna/i,     "icon": "../2K16_4K_UX_Asset/Icons/icon_73_Watch_TV_hl_64x64_px.png"},
         {"nameReg":/^Satellite/i,   "icon": "../2K16_4K_UX_Asset/Icons/icon_186_Satellite_Source_hl_64x64_px.png"},
         {"nameReg":/^Google cast/i, "icon": "../2K16_4K_UX_Asset/Icons/icon_307_Miracast_hl_64x64_px.png"},
         {"nameReg":/^USB.*/i,       "icon": "../2K16_4K_UX_Asset/Icons/icon_193_USB_hl_64x64_px.png"},
         {"nameReg":/^Network.*/i,   "icon": "../2K16_4K_UX_Asset/Icons/icon_213_Network_TV_hl_64x64_px.png"},
         {"nameReg":/^HDMI.*/i,      "icon": "../2K16_4K_UX_Asset/Icons/icon_203_HDMI_hl_64x64_px.png"},
         {"nameReg":/HDMI$/i,      "icon": "../2K16_4K_UX_Asset/Icons/icon_203_HDMI_hl_64x64_px.png"},
         {"nameReg":/^SCART.*/i,     "icon": "../2K16_4K_UX_Asset/Icons/icon_204_SCART_hl_64x64_px.png"},
         {"nameReg":/^CVBS.*/i,      "icon": "../2K16_4K_UX_Asset/Icons/icon_211_Video_Input_hl_64x64_px.png"},
         {"nameReg":/^YPbPr.*/i,     "icon": "../2K16_4K_UX_Asset/Icons/icon_211_Video_Input_hl_64x64_px.png"},
         {"nameReg":/^AV IN/i,       "icon": "../2K16_4K_UX_Asset/Icons/icon_208_Analogue_Input_hl_64x64_px.png"},
         {"nameReg":/^VGA/i,         "icon": "../2K16_4K_UX_Asset/Icons/icon_206_VGA_hl_64x64_px.png"},
		 {"nameReg":/^AV2.*/i,       "icon": "../2K16_4K_UX_Asset/Icons/icon_211_Video_Input_hl_64x64_px.png"},
		 {"nameReg":/^CVI*/i,      "icon": "../2K16_4K_UX_Asset/Icons/icon_211_Video_Input_hl_64x64_px.png"}];
    if (id == this.tvID)
        return this.inputIconArray[0].icon;
    if (id == this.cableID)
        return this.inputIconArray[1].icon;
    if (id == this.antennaID)
        return this.inputIconArray[2].icon;
    if (id == this.satelliteID)
        return this.inputIconArray[3].icon;
    if (id == this.networkID)
        return this.inputIconArray[6].icon;
    for (var i in this.inputIconArray) {
        if (name.match(this.inputIconArray[i].nameReg))
            return this.inputIconArray[i].icon;
    }
    return "";
};

InputSourceRaw.prototype.isEditable = function (id, name) {
    if ([this.tvID, this.cableID, this.antennaID, this.satelliteID].indexOf(id) >= 0)       // for TVs source
        return false;
    return $.grep([/^AV/i,
                   /^CVBS/i,
                   /^HDMI/i,
                   /HDMI$/i,
                   /^SCART/i,
                   /^YPbPr/i,
                   /^VGA/i,
				   /^CVI/i], function (v) { return v.test(name);}).length > 0;
};

InputSourceRaw.prototype.getInputList = function () {
    if (this.inputSourceList)
        return this.inputSourceList;

    var inputList = this.mtvObj.getInputInfo('');
    var list = inputList.OPTION.split(/,/);
    var tvItem = list.shift(); // the first item is "1:TV", store it out of the list
    // unshift USB/Network source into list
    var parentPageID = mtvuiUtil.getParentPageID();
    if (parentPageID == "sys_content_browser"
        || parentPageID == "sys_content_browser_usb")
        inputList.VALUE = this.usbID;
    else if (parentPageID == "sys_content_browser_network")
        inputList.VALUE = this.networkID;
    list.unshift(this.usbID + ":" + "USB",
                 this.networkID + ":" + this.mtvObj.getLangString("ID_WIRE_NETWORK"));

    // restore the TV source now
    list.unshift(tvItem);
    // unshift the Satellite source into list, it will be the first one
    if (this.mtvObj.acfgGetConfigValue("g_misc__dvbs_support") > 0) {
        // insert "Satellite TV" to the source
        list.unshift(this.satelliteID + ":" + this.mtvObj.getLangString("MAIN_SATELLITE_SELECTED"));
        // if current active is "1:TV", detect the "Satellite" is active or not
        if (inputList.VALUE == "1") {
            if (this.mtvObj.getDtvTunerBsSrc() == "2") // BsSrc is Satellite
                inputList.VALUE = this.satelliteID;
        }
    }

    var inputSrcList = [];
    var fnThis = this;
    $.each(list, function (k, item) {
        var s = item.split(/:/);
        var id = s[0], name = s[1];
        var alias = fnThis.getAlias(id);
        var icon = fnThis.getInputIcon(id, name);
        if (id == "1") {        // for "1:TV", change name to "Antenna" or "Cable"
            if (fnThis.mtvObj.getDtvTunerType() == "1") {
                id = fnThis.cableID;
                name = fnThis.mtvObj.getLangString("MAIN_CABLE_TV_SELECTED");
            }
            else {
                id = fnThis.antennaID;
                name = fnThis.mtvObj.getLangString("MAIN_ANTENNA_TV_SELECTED");
            }
            if (inputList.VALUE == "1") // change the active one
                inputList.VALUE = id;
        }
        var obj = {
            "type": "input",
            "id": id,
            "name": name,
            "icon": icon,
            "oName": name,
            "oIcon": icon,
            "active": id == inputList.VALUE,
            "isEditable": fnThis.isEditable(id, name)
        };
        // update the alias
        if (alias) {
            if (alias.name)
                obj["name"] = obj["aName"] = alias.name;
            if (alias.icon)
                obj["icon"] = obj["aIcon"] = alias.icon;
        }
        inputSrcList.push(obj);
    });
    return this.inputSourceList = inputSrcList;
};

InputSourceRaw.prototype.getItem = function (arg) {
    var list = this.getInputList();
    var id = (typeof arg === "object") ? arg.id : arg;
    for (var i in list)
        if (list[i].id == id)
            return list[i];
    return null;
};

InputSourceRaw.prototype.isPipAvaliable = function() {
    var ret = false;
    var inputList = this.mtvObj.getInputInfo('');
    var list = inputList.OPTION.split(/,/);
    $.each(list, function (k, item) {
        var s = item.split(/:/);
        var id = s[0], name = s[1];
        if (id == inputList.VALUE) {
            ret = name.match(/^COMP|^YPbPr|^VGA|^HDMI/);
            return false;
        }
        return true;
    });
    return ret;
};

// For input source, it maybe have original/alias/CEC name/icon
// FIXME: there're 16 slot for alias name, use the 12-15 to store CEC name
// icon index begin with 1, and 0 reserved for invalid icon.
InputSourceRaw.prototype.getAlias = function (arg, nameIconMap) {
    var key = null;
    if (typeof arg == "object")
        key = arg.id;
    else if (typeof arg == "string" || typeof arg == "number")
        key = arg;
    key = parseInt(key) - 1;
    if (key !== NaN) {
        var res = {};
        var icon_name = this.mtvObj.getInputSourceAliasName(key);
        if (icon_name && icon_name.length > 0)
            res["name"] = icon_name;
		if (res["name"] == "BLU_RAY" || res["name"] == "DVD" || res["name"] == "HDD_DVDR" || res["name"] == "RECORDER" 
			|| res["name"] == "VCR" || res["name"] == "PC" || res["name"] == "GAME" || res["name"] == "DIG_STB"){
			res["name"] = this.mtvObj.getLangString(res["name"]);
		}
        var idx = this.mtvObj.getInputSourceAliasIcon(key);
        var devNameMap = nameIconMap || this.getAliasMap();
        if (idx > 0 && idx <= devNameMap.length)
            res["icon"] = devNameMap[idx - 1].icon;

        return res;
    }
    return null;
};

InputSourceRaw.prototype.setAlias = function (arg, nameIconMap) {
    var key = null;
    // FIXME: the setInputSourceAliasName/Icon() use the id is based "1", not "0"
    var devNameMap = nameIconMap || this.getAliasMap();
    arg["iconIdx"] = 0;
    for (var i in devNameMap) {
        if (devNameMap[i].icon == arg.icon) {
            arg["iconIdx"] = parseInt(i) + 1; // the Alias begin from "1", "0" reserve for invalid icon.
            break;
        }
    }
    arg.id = parseInt(arg.id) - 1;
    this.mtvObj.setInputSourceAliasName(arg.id, arg.name);
    this.mtvObj.setInputSourceAliasIcon(arg.id, arg.iconIdx);
    return false;
};

InputSourceRaw.prototype.setInputSource = function (id) {
    this.mtvObj.exitNetTV({"PARAMETER": {"exitReason":"CHANGE_SOURCE","REQUEST":"SET"}});
	console.info('[HTML5_UI_INPUTSOURCE] setInputSource id: '+id);
    if (id == this.antennaID || id == this.cableID)
        return this.mtvObj.selectTvSource('');
    else if (id == this.satelliteID)
        return this.mtvObj.selectSatelliteSource('');
    else if (id == this.usbID)  // for "USB"
        return mtvuiUtil.gotoSysPage("sys_content_browser_usb");
    else if (id == this.networkID)  // for "Network"
        return mtvuiUtil.gotoSysPage("sys_content_browser_network");
    else
        return this.mtvObj.setInputInfo(id);
};

InputSourceRaw.prototype.checkTimeShift = function () {
    var ConfigItem_setupIsItmeShiftMode = 0x4220029;
    var ts = this.mtvObj.acfgGetConfigItemValue(ConfigItem_setupIsItmeShiftMode);
    if (ts == 2) {
        var data = '<div id="dilog_checkTS" tabindex=0 style="z-index:9999;position:absolute;left:165px;top:448px;border:2px solid #D3D4D5;border-radius:6px;padding:21px;background:rgba(0,0,0,0.7);" > \
                <div style="position:relative;float:left;width:48px;height:48px;" ><img src="../Assets/_Dialog/Notification_icon_warning.png" /></div> \
                <div style="position:relative;float:left;overflow-wrap:break-word;width:850px;text-align:left;margin-top:10px;margin-left:16px;color:rgb(211,212,213);font-size:24px;">'
            + this.mtvObj.getLangString("TSHIFT_MSG_GOTO_LIVEVIEW") + '</div></div>';
        var elem = $(data).appendTo(document.body);
        $(document).on('keydown', function (evt) {
            if (elem) {
                elem.remove();
                elem = null;
            }
        });
        return true;
    }
    return false;
};

var InputSource = function () {
    this.supper = new InputSourceRaw();
    if (!InputSource.prototype.object_inited) {
        for (var i in InputSourceRaw.prototype) {
            if (typeof InputSourceRaw.prototype[i] === 'function' && !InputSource.prototype[i])
                InputSource.prototype[i] = (function (fn) {return function () {
                    try { return InputSourceRaw.prototype[fn].apply(this.supper, arguments); }
                    catch (err) { console.log(String(fn), err); }
                    return null;
                };})(i);
        }
        InputSource.prototype.object_inited = true;
    }
};

window.ipsCECObj = (function () {
    var ipsCEC = function () {};

    var t_cecm_msgcode = {
        CECM_MSGCODE_ACK                      :0,
        CECM_MSGCODE_WAIT_FOR_OPCODE_TIME_OUT :1,
        CECM_MSGCODE_DEV_LIST_NFY             :2,
        CECM_MSGCODE_ONE_TOUCH_PLAY           :3,
        CECM_MSGCODE_PWR_ON_DEV               :4,
        CECM_MSGCODE_5V_PWR                   :5,
        CECM_MSGCODE_TV_LA                    :6
    };

    /*
    ** This function determine whether there is a CEC device connected on a specific HDMI port.
    ** hdmi_port_idx [in] HDMI port index. 0=>HDMI-1, 1=>HDMI-2,....
    ** is_connected  [out] determine whether the CEC device is connected or not.
    */
    ipsCEC.prototype.getConnectedDeviceList = function (portList) {
        var ret = [];
        var la; // logical address
        var t_dev_info;
        var g_mtvObj = new MtvObj();

        for (la = 1; la < 14; la++) { // 1-14 for CEC logical address
            t_dev_info = g_mtvObj.cecGetDeviceInfoByLa(la);
            if (!t_dev_info        // nothing
                || parseInt(t_dev_info.ui2_pa) == 0xDEAD)// skip CECM_INV_PA
                continue;

            var pa = parseInt(t_dev_info.ui2_pa);
            var idx = ((pa & 0xF000) >> 12); // begin from 1
            if ( idx > 0 ) {
                console.log("la=", la, ", pa=", pa, ", pa=", idx);

                ret.push({
                    idx           : idx,
                    dev_pa        : pa,
                    dev_la        : parseInt(t_dev_info.e_la), //la;
                    dev_name      : t_dev_info.s_dev_name,
                    hdmi_port     : t_dev_info.s_hdmi_port,
                    osd_name      : t_dev_info.s_osd_name,
                    is_amp        : t_dev_info.b_amp_connected,
                    dev_type      : t_dev_info.dev_type,
                    dev_vendor_id : t_dev_info.ui1_dev_vndr_id});
            }
        }

        return ret;
    };

    ipsCEC.prototype.getImgByLa = function (la) {
        var iconArray = InputSourceRaw.prototype.getCecMap();
        var target = "";
        switch (la) {
        case 1: // CECM_LOG_ADDR_REC_DEV_1
        case 2: // CECM_LOG_ADDR_REC_DEV_2
        case 9: // CECM_LOG_ADDR_REC_DEV_3
            target = "hd_recorder"; // Harddisc Recorder
            break;
        case 3: // CECM_LOG_ADDR_TUNER_1
        case 6: // CECM_LOG_ADDR_TUNER_2
        case 7: // CECM_LOG_ADDR_TUNER_3
            target = "digital_receiver"; // Digital Receiver
            break;
        case 5: // CECM_LOG_ADDR_AUD_SYS
            target = "hts";         // Home theather
            break;
        case 4: // CECM_LOG_ADDR_PLAYBACK
        case 8: // CECM_LOG_ADDR_PLAYBACK_DEV_2
        case 11:// CECM_LOG_ADDR_PLAYBACK_DEV_3
            target = "dvd_player";  // Audio Player
            break;
        case 0: // CECM_LOG_ADDR_TV
        default:
            break;
        }
        for (var i in iconArray)
            if (iconArray[i].name == target)
                return iconArray[i].icon;

        return iconArray[0].icon;
    };

    ipsCEC.prototype.updateDeviceList = function (list) {
        if (list && list.length > 0) {
            // reset the CEC name/icon first
            var deviceID = 10000;
            $.each(list, function (k, v) {
                if (v.oName && v.oName.indexOf('HDMI') == 0) {
                    v["cName"] = v["cIcon"] = null;
                    v.name = v.oName;
                    v.icon = v.oIcon;
                    if (v.id < deviceID){
                    	deviceID = v.id;
                    }
                }
            });

            var fnThis = this;
            var cecList = fnThis.getConnectedDeviceList();
            if (cecList && cecList.length > 0 ) {
                //var connectedDeviceId = 4; // UI index 4 + 1 is for "HDMI 1"
                $.each(cecList, function (k, v) {
                    var id = parseInt(deviceID) + v.idx - 1;
                    var res = $.grep(list, function(v) {return v.id == id;});
                    if (res && res.length > 0) {
                        var obj = res[0];
                        obj["name"] = obj["cName"] = v.osd_name;
                        obj["icon"] = obj["cIcon"] = fnThis.getImgByLa(v.dev_la);
                    }
                });
            }
        }
        return list;
    };

    ipsCEC.prototype.IsAmpDeviceConnected = function (la, amp_pa, dev_pa) {
        if (amp_pa == 57005) /*CECCM_INV_PA*/
            return false;

        if (la == 5)  /*CECCM_LOG_ADDR_AUD_SYS*/
            return false;

        if (amp_pa == dev_pa)
            return true;
        if (amp_pa == (dev_pa & 0xfff0))
            return true;
        if (amp_pa == (dev_pa & 0xff00))
            return true;
        if (amp_pa == (dev_pa & 0xf000))
            return true;

        return false;
    };
    return new ipsCEC();
})();

// try to support AMD and commonjs, please refer
// http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define(["postal"], function(postal){
            return (root.InputSource = factory(postal));
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.InputSource = factory(require("postal")));
    } else {
        root.InputSource = factory(root.postal);
    }
}(this, function(postal) {
    // module code here....
    return InputSource;
}));
