// try to support AMD and commonjs, please refer
// http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define(["postal"], function(postal){
            return (root.mtvuiChannel = factory(postal));
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.mtvuiChannel = factory(require("postal")));
    } else {
        root.mtvuiChannel = factory(root.postal);
    }
}(this, function(postal) {
    // module code here....
    var mtvuiChannel = function () {
        this.mtvObj = new MtvObj();
    };
    mtvuiChannel.prototype.tunnerTypeList = {DVB_T:0, DVB_C: 1};
    mtvuiChannel.prototype.getChannelCount = function (chObj, nw_mask, nw_value) {
        if(this.isOclAvaiable(chObj)) {
            return this.mtvObj.getOclChannelCount();
        }
        else {
            var svl_id = (svl_id || chObj.SVL_ID);
            nw_mask = (nw_mask || MaskList.Mask_all);
            nw_value = (nw_mask || MaskValueList.MaskValue_all);
            return this.mtvObj.getChannelCount(svl_id, nw_mask, nw_value);
        }
    };
    mtvuiChannel.prototype.getTunerType = function () {
        if (!mtvuiChannel.prototype.tunerType)
            mtvuiChannel.prototype.tunerType = this.mtvObj.getDtvTunerType();
        return mtvuiChannel.prototype.tunerType;
    };
    mtvuiChannel.prototype.setTunnerType = function (tunnerType) {
        if ([1, 2].indexOf >= 0) {
            mtvuiChannel.prototype.tunerType = tunnerType;
            return true;
        }
        return false;
    };
    mtvuiChannel.prototype.getTunnerBsSrc = function () {
        return this.mtvObj.getDtvTunerBsSrc();
    };
    mtvuiChannel.prototype.setTunnerBsSrc = function (tunnerBsSrc) {
        return this.mtvObj.setDtvTunerBsSrc(tunnerBsSrc);
    };
    mtvuiChannel.prototype.getBroadcastType = function () {
        return this.mtvObj.getBroadcastType();
    };
    mtvuiChannel.prototype.isOclAvaiable = function (chObj) {
        if (!chObj)
            return false;
        var is_ocl = parseInt(this.mtvObj.getOclStatus(''));
        return ( !is_dvbs_channel(chObj.SVL_ID)
                 && TYPE_BRDCST == this.mtvObj.getBroadcastType()
                 && is_ocl);
    };
    mtvuiChannel.prototype.getChannelIndex = function (chObj, nw_mask, mask_value) {
        return this.isOclAvaiable(chObj) ?
            this.mtvObj.getOclIdxByChannelId(nw_mask, mask_value, chObj.CHANNEL_ID) :
            this.mtvObj.getIdxByChannelId(chObj.SVL_ID, nw_mask, mask_value, chObj.CHANNEL_ID);
    };
    mtvuiChannel.prototype.getChannelInfoByIndex = function (chObj, nw_mask, mask_value, search_idx) {
        var ret = this.isOclAvaiable(chObj) ?
            this.mtvObj.getOclChannelInfoByDbIdx(nw_mask, mask_value, search_idx) :
            this.mtvObj.getChannelInfoByDbIdx(chObj.SVL_ID, nw_mask, mask_value, search_idx);
        return (ret && ret.STATUS == 0) ? ret.ITEMS[0] : null;
    };
    mtvuiChannel.prototype.getCurrentChannelObj = function () {
        return this.mtvObj.getCurrentChannelInfoEx();
    };

    mtvuiChannel.prototype.getChannelList = function (args) {
        var ret = [];
        var crrnt_ch = this.mtvObj.getCurrentChannelInfoEx();
        var defArgs = {
            "SVL_ID": crrnt_ch.SVL_ID,
            "CHANNEL_ID": crrnt_ch.CHANNEL_ID,
            "SATL_ID": 0,
            "SATL_REC_ID": 0,
            "CATEGORY_MASK": 0,
            "NW_MASK": MaskList.Mask_all,
            "MASK_VALUE": MaskValueList.MaskValue_all,
            "DIRECTION": "NEXT",
            "NUM": 1, //get channel list number default is 1
            "FAV_IDX": 0, //favorite index default is 0
            "ENABLE_CYCLE": false, //default is disable get channel by cycle
            "CH_LIST_TYPE": "ALL"
        };
        for (var i in defArgs)
            if (typeof args[i] == 'undefined')
                args[i] = defArgs[i];

        //Favorite list channel order should follow all list in UK.
        if (args["CH_LIST_TYPE"] == "FAV" && 
        ("GBR" == this.mtvObj.getCurrentCountry() || (typeof GLOBAL_MODE != 'undefined' && (GLOBAL_MODE == 'LT' || GLOBAL_MODE == 'AOC')))){
            args["CH_LIST_TYPE"] = "ALL";//get channel from all list
            args["NW_MASK"]      = MaskList.Mask_favorite;//mask is favorite
            args["MASK_VALUE"]   = MaskValueList.MaskValue_favorite;//mask value is favorite
        }

        try {
            if(crrnt_ch && args["SVL_ID"]){
                crrnt_ch.SVL_ID = args["SVL_ID"];
            } else {
                console.log("error crrnt_ch args");
            }
            if (args["CH_LIST_TYPE"] == "FAV") {
                //one channel list case && not for dvbs
                if ( this.isOclAvaiable(crrnt_ch)) {
                    var arg = {"PARAMETER":
                               {"NW_MASK": MaskList.Mask_favorite,
                                "NW_VALUE": MaskValueList.MaskValue_favorite,
                                "REQUEST": "QUERY"}};
                    var res = this.mtvObj.oclFavListGetNumByMask(JSON.stringify(arg));
                    console.log("oclFavListGetNumByMask return " + res.toString());
                    var chListRes = JSON.parse(res);
                    //channel total number
                    var ch_total_num = parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM);
					console.log("TEST LOG---->oclFavList channel Num: " + ch_total_num);
                    //get channel list number
                    var num = Math.min(args["NUM"], ch_total_num);
                    var begin_idx = this.mtvObj.oclFavListGetIdxByChId(args["NW_MASK"], args["MASK_VALUE"], args["CHANNEL_ID"]);
					console.log("TEST LOG---->oclFavList idx::" + begin_idx);
                    if (args["DIRECTION"] == "NEXT") {
                        for (i = 0; i < num; i++) {
                            //the next channel of last channel is first channel
                            var idx = (i + begin_idx + 1) % ch_total_num;
                            arg = {"PARAMETER":
                                   {"NW_MASK":MaskList.Mask_favorite,
                                    "NW_VALUE":MaskValueList.MaskValue_favorite,
                                    "CH_SEARCH_IDX": idx,
                                    "REQUEST":"QUERY"}};
                            res = this.mtvObj.oclFavListGetSvlByIdx(JSON.stringify(arg));
                            if (!res)
                                break;
                            var ch = JSON.parse(res);
                            console.log("the oclFavListGetSvlByIdx("+arg+") return " + res);
                            // if enable_cycle is false, do not get channel by cycle
                            if (ch.ITEMS[0].INDEX <= pre_ch_index
                                && (!args["ENABLE_CYCLE"])
                                && i != 0) {
                                console.log("ch.ITEMS[0].CHANNEL_ID <= args[CHANNEL_ID]");
                                break;
                            }
                            /* The Favourite channels list shall follow its own numbering */
                            ch.ITEMS[0].MAJOR_NUM = ch.ITEMS[0].INDEX + 1;
                            ch.ITEMS[0].MINOR_NUM = 0;
                            if (parseInt(ch.STATUS) == 0){
                                ret.push(ch.ITEMS[0]);
                            }
							var pre_ch_index = ch.ITEMS[0].INDEX;
                        }/* for */
                    } else {    // args["DIRECTION"] == "PRE"
                        for (i = 0; i < num; i++) {
                            //the pre channel of first channel is last channel
                            idx = (begin_idx - i - 1) < 0 ? ch_total_num + (begin_idx - i - 1) : (begin_idx - i - 1);
                            arg = {"PARAMETER":
                                   {"NW_MASK":MaskList.Mask_favorite,
                                    "NW_VALUE":MaskValueList.MaskValue_favorite,
                                    "CH_SEARCH_IDX":idx,
                                    "REQUEST":"QUERY"}};
                            res = this.mtvObj.oclFavListGetSvlByIdx(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            console.log("the oclFavListGetSvlByIdx("+arg+") return " + res);
                            //if enable_cycle is false, do not get channel by cycle
                            if (ch.ITEMS[0].INDEX >= pre_ch_index
                                && (!args["ENABLE_CYCLE"])
                                && i != 0){
                                console.log("ch.ITEMS[0].CHANNEL_ID >= args[CHANNEL_ID]");
                                break;
                            }
                            /* The Favourite channels list shall follow its own numbering */
                            ch.ITEMS[0].MAJOR_NUM = ch.ITEMS[0].INDEX + 1;
                            ch.ITEMS[0].MINOR_NUM = 0;
                            if (parseInt(ch.STATUS) == 0){
                                ret.push(ch.ITEMS[0]);
                            }
							var pre_ch_index = ch.ITEMS[0].INDEX;
                        }/* for */
                    }
                }//normal case
                else{
                    arg = {"PARAMETER":
                           {"SVL_ID":args["SVL_ID"],
                            "NW_MASK":MaskList.Mask_favorite,
                            "NW_VALUE":MaskValueList.MaskValue_favorite,
                            "FAV_IDX":args["FAV_IDX"],
                            "REQUEST":"QUERY"}};
                    res = this.mtvObj.chFavListGetNumByMask(JSON.stringify(arg));
                    console.log("chFavListGetNumByMask return " + res.toString());
                    chListRes = JSON.parse(res);
                    //get channel list number
                    ch_total_num = parseInt(chListRes.ITEMS[0].CH_TOTAL_NUM);
                    num = Math.min(args["NUM"], ch_total_num);
					var begin_idx = this.mtvObj.chFavListGetIdxByChId(args["SVL_ID"], args["NW_MASK"], args["MASK_VALUE"], args["CHANNEL_ID"]);
                    if (args["DIRECTION"] == "NEXT"){
                        for (i = 0; i < num; i++) {
                            //the next channel of last channel is first channel
                            idx = (i + begin_idx + 1) % ch_total_num;
                            arg = {"PARAMETER":
                                   {"SVL_ID":args["SVL_ID"],
                                    "NW_MASK":MaskList.Mask_favorite,
                                    "NW_VALUE":MaskValueList.MaskValue_favorite,
                                    "FAV_IDX":args["FAV_IDX"],
                                    "CH_SEARCH_IDX":idx,
                                    "REQUEST":"QUERY"}};
                            res = this.mtvObj.chFavListGetSvlByIdx(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            console.log("the chFavListGetSvlByIdx("+arg+") return " + res);
                            //if enable_cycle is false, do not get channel by cycle
                            if (args["ENABLE_CYCLE"] == "false"
                                && ch.ITEMS[0].INDEX <= pre_ch_index
                                && i != 0){
                                console.log("ch.ITEMS[0].CHANNEL_ID <= args[CHANNEL_ID]");
                                break;
                            }
                            /* The Favourite channels list shall follow its own numbering */
                            ch.ITEMS[0].MAJOR_NUM = ch.ITEMS[0].INDEX + 1;
                            ch.ITEMS[0].MINOR_NUM = 0;
                            if (parseInt(ch.STATUS) == 0){
                                ret.push(ch.ITEMS[0]);
                            }
							var pre_ch_index = ch.ITEMS[0].INDEX;
                        }/* for */
                    } else {
                        for (i = 0; i < num; i++) {
                            //the pre channel of first channel is last channel
                            idx = (begin_idx - i - 1) < 0 ? ch_total_num  + (begin_idx - i - 1) : (begin_idx - i - 1);
                            arg = {"PARAMETER":
                                   {"SVL_ID":args["SVL_ID"],
                                    "NW_MASK":MaskList.Mask_favorite,
                                    "NW_VALUE":MaskValueList.MaskValue_favorite,
                                    "FAV_IDX":args["FAV_IDX"],
                                    "CH_SEARCH_IDX":idx,
                                    "REQUEST":"QUERY"}};
                            res = this.mtvObj.chFavListGetSvlByIdx(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            console.log("the chFavListGetSvlByIdx("+arg+") return " + res);
                            //if enable_cycle is false, do not get channel by cycle
                            if (args["ENABLE_CYCLE"] == "false"
                                && ch.ITEMS[0].INDEX >= pre_ch_index
                                && i != 0){
                                console.log("ch.ITEMS[0].CHANNEL_ID >= args[CHANNEL_ID]");
                                break;
                            }
                            /* The Favourite channels list shall follow its own numbering */
                            ch.ITEMS[0].MAJOR_NUM = ch.ITEMS[0].INDEX + 1;
                            ch.ITEMS[0].MINOR_NUM = 0;
                            if (parseInt(ch.STATUS) == 0){
                                ret.push(ch.ITEMS[0]);
                            }
							var pre_ch_index = ch.ITEMS[0].INDEX;
                        }/* for */
                    }//else
                }
            }//if (args["CH_LIST_TYPE"] == "FAV")
             else {
                //one channel list case && not for dvbs
                var ch_id = args["CHANNEL_ID"];
                if (this.isOclAvaiable(crrnt_ch)) {
                    arg = {"PARAMETER":
                           {"NW_MASK":args["NW_MASK"],
                            "NW_VALUE":args["MASK_VALUE"],
                            "REQUEST":"QUERY"}};
                    res = this.mtvObj.getOclChannelCount(args["NW_MASK"],args["MASK_VALUE"]);
                    console.log("getOclChannelNum return " + res.toString());
                    args["NUM"] = Math.min(args["NUM"], parseInt(res));
                    for (i = 0; i < args["NUM"]; i++) {
                        arg = {"PARAMETER":
                               {"NW_MASK":args["NW_MASK"],
                                "NW_VALUE":args["MASK_VALUE"],
                                "CH_ID": ch_id,
                                "REQUEST":"QUERY"}};
                        if (args["DIRECTION"] == "PRE"){
                            res = this.mtvObj.getOclPrevChannelInfo(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            //if below current channel id
                            if ((ch_id < ch.ITEMS[0].CHANNEL_ID)
                                && i != 0
                                && (!args["ENABLE_CYCLE"])) {
                                console.log("ch_id < ch.ITEMS[0].CHANNEL_ID");
                                break;
                            }
                        }
                        else{
                            res = this.mtvObj.getOclNextChannelInfo(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            //if greater than current channel id
                            if ((ch_id > ch.ITEMS[0].CHANNEL_ID)
                                && i != 0
                                && (!args["ENABLE_CYCLE"])) {
                                console.log("ch_id > ch.ITEMS[0].CHANNEL_ID");
                                break;
                            }
                        }
                        console.log("the getNextChannelInfo("+arg+") return " + res);
                        //replace channel id
                        ch_id = ch.ITEMS[0].CHANNEL_ID;
                        if (parseInt(ch.STATUS) == 0){
                            ret.push(ch.ITEMS[0]);
                        }
                    }
                }
                //normal case
                else {
                    var ch_num = this.mtvObj.getChannelNum(args["SVL_ID"], args["NW_MASK"], args["MASK_VALUE"], args["SATL_ID"], args["SATL_REC_ID"], args["CATEGORY_MASK"], args["CATEGORY_MASK"]);
                    console.log("getChannelNum return " + ch_num);

                    args["NUM"] = Math.min(args["NUM"], parseInt(ch_num));
                    for (i = 0; i < args["NUM"]; i++) {
                        arg = {"PARAMETER":
                               {"SVL_ID":args["SVL_ID"],
                                "NW_MASK":args["NW_MASK"],
                                "NW_VALUE":args["MASK_VALUE"],
                                "CH_ID": ch_id,
                                "SATL_ID":args["SATL_ID"],
                                "SATL_REC_ID":args["SATL_REC_ID"],
                                "CATEGORY_MASK":args["CATEGORY_MASK"],
                                "REQUEST":"QUERY"}};
                        if (args["DIRECTION"] == "PRE") {
                            res = this.mtvObj.getPrevChannelInfo(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            //if belower than current channel id
                            if ((ch_id < ch.ITEMS[0].CHANNEL_ID)
                                && i != 0
                                && (!args["ENABLE_CYCLE"])) {
                                console.log("ch_id < ch.ITEMS[0].CHANNEL_ID");
                                break;
                            }
                        }
                        else{
                            res = this.mtvObj.getNextChannelInfo(JSON.stringify(arg));
                            if (!res)
                                break;
                            ch = JSON.parse(res);
                            //if greater than current channel id
                            if ((ch_id > ch.ITEMS[0].CHANNEL_ID)
                                && i != 0
                                && (!args["ENABLE_CYCLE"])) {
                                console.log("ch_id > ch.ITEMS[0].CHANNEL_ID");
                                break;
                            }
                        }
                        console.log("the getNextChannelInfo("+arg+") return " + res);
                        //replace channel id
                        ch_id = ch.ITEMS[0].CHANNEL_ID;
                        if (parseInt(ch.STATUS) == 0){
                            ret.push(ch.ITEMS[0]);
                        }
                    }/* for */
                }
            }
            //if search from previous need reverse the channel list
            if (args["DIRECTION"] == "PRE"){
                //reverse the channel list
                return ret.reverse();
            }
            else{
                return ret;
            }
        } catch (e) {
            console.log("getChannelList Error!");
            console.log(e);
        }//catch
        return ret;
    };

    mtvuiChannel.prototype.setChannelObj = function (chObj) {
        return this.mtvObj.setBrdcastChgChannel(chObj.CHANNEL_ID);
    };
    return new mtvuiChannel();
}));