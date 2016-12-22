var g_mtvObj = new MtvObj();
var g_inputSrcObj = null;
var gInputObjList = [];         // will init
var gTimeoutHandle = null;

function findInputObj(arg) {
    return $.grep(gInputObjList, function (v) {return (!arg.id || arg.id == v.id);})[0];
}

function updateDeviceCard(opts) {
    var card = $(".card.mtvui[data-id="+opts.id+"]");
    if (opts.name == "BLU_RAY" || opts.name == "DVD" || opts.name == "HDD_DVDR" || opts.name == "RECORDER" 
		|| opts.name == "VCR" || opts.name == "PC" || opts.name == "GAME" || opts.name == "DIG_STB"){
		card.find(".card-content>span").text(g_mtvObj.getLangString(opts.name));
	} else {
    	card.find(".card-content>span").text(opts.name);
  	}
    card.find(".card-image>img").attr("src", opts.icon);
}
// Red Key go to the Device Editor Page on Input Source Main UI page.
function updateDeviceAliasInfo(opts) {
    updateDeviceCard(opts);
    // Storage input source alias
    var arg = {"id":opts.id, "name": opts.name, "icon": opts.icon};
    g_inputSrcObj.setAlias(arg);
    // update the name/icon
    var obj = findInputObj({"id":opts.id});
    if (obj) {
        obj.name = obj["aName"] = opts.name;
        obj.icon = obj["aIcon"] = opts.icon;
    }
}

function updateDeviceCecInfo(opts) {
    // update the name/icon
    updateDeviceCard(opts);
    var obj = findInputObj({"id":opts.id});
    if (obj) {
        obj.name = obj["cName"] = opts.name;
        obj.icon = obj["cIcon"] = opts.icon;
    }

}

// move to items, show different color list
const CARD_WIDTH = 245;
function inputSourceGridMenuInit(target, list) {
    var item = null;
    var count = 0;

    //enter input source firstly, show color key
    var activeItem = $.grep(gInputObjList, function (v) {return v.active;})[0];
    if (activeItem && activeItem.isEditable)
        $("#color_list_bar").show();
    else
        $("#color_list_bar").hide();

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
        if (v.active){
			g_idx = key;  // for refresh the UI, foucs still is last index, we save the card idx;
            card.addClass("active");
		}

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
};

function refreshUI(){
	
	var inputSrcObj = new InputSource();
	freshList = inputSrcObj.getInputList();
		
	var target = $("#id_collapsible_input");
	var devDom = target.find(".carousel-inner");
	var item = null;
	var count = 0;
	devDom.html(""); // clean all items
	$.each(freshList, function (key, v) {
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
			item.appendTo(devDom);
			item = null;
		}
	});
	if (null != item) {
		item.appendTo(devDom);
	}
	
	var carousel    = target.find(".carousel[data-ride=carousel]");
	var cards_all   = target.find(".card.mtvui");
	cards_all.removeClass("active");
	var active_card = $(cards_all[g_idx]);
	active_card.addClass("active");
	
	id = active_card.data("id");
	obj = findInputObj({id:id});
	if (obj) {
		if (obj.isEditable)
			$("#color_list_bar").show();
		else
			$("#color_list_bar").hide();
	}

}

// this function is used to replace image when moving to another item
function inputSourceMainMenuKeyHandler(kc) {
    var key = kc.keyCode || kc.which;
	console.info('[HTML5_UI_INPUTSOURCE] keyCode = '+key);
    if(key == KeyEvent.DOM_VK_RED || key == KeyEvent.DOM_VK_GREEN) { // dealing with color key
        var id = $(".card.mtvui.active").data("id");
        var obj = findInputObj({id:id});
        if(!obj.isEditable)
            return true;

        if (key == KeyEvent.DOM_VK_RED) {
            var args = $.extend({}, obj, {
                getDeviceList: g_inputSrcObj.getAliasMap,
                finish: function (evt, opts) { // Apply Changes
                    updateDeviceAliasInfo(opts);					
					setTimeout(function(){
						refreshUI();
						var devList = freshList.filter(function(v) {
							return (v.oName && v.oName.indexOf('HDMI') == 0);
						});
						devList = ipsCECObj.updateDeviceList(devList);
						$.each(devList, function (k,v) {
							v.name = v["cName"] || v["aName"] || v["oName"];
							v.icon = v["cIcon"] || v["aIcon"] || v["oIcon"];
							updateDeviceCecInfo(v);
						});
						mtvuiUtil.makeMarquee($(".card-content"));
					}, 110);
                }
            });
            mtvuiLoadScript("./deviceDialog.js", function () {
                $("#dialog_device_list").deviceDialog(args);
                $("#dialog_device_list").deviceDialog('open'); // make sure dialog focus
            });
        }
        else if(key == KeyEvent.DOM_VK_GREEN) {
            var devList = [];
            $.each(gInputObjList, function(k, v) {
                if (v.oName && (v.oName.match(/^HDMI.*/) || v.oName.match(/HDMI$/)))
                    devList.push($.extend({}, v, {
                        cName: null,
                        cIcon: null
                    }));
            });
            var oList = $.map(devList, function (v) { return $.extend({}, v);});
            setTimeout(function(){
				var cecList = ipsCECObj.updateDeviceList(oList);
				// update the cName/cIcon as newName/newIcon
				for (var i = 0; i < cecList.length; i++) {
					var v = devList[i];
					v["newName"] = cecList[i]["cName"];
					v["newIcon"] = cecList[i]["cIcon"];
				}
				
				$("#id_collapsible_input").fadeOut(100);
				$("#id_collapsible_input").fadeIn(300,function(){
					refreshUI();
					$.each(devList, function (k, v) {
						v.name = v["newName"] || v["aName"] || v["oName"];
						v.icon = v["newIcon"] || v["aIcon"] || v["oIcon"];
						updateDeviceCecInfo(v);
					});
					
					// reset newName/newIcon
					$.each(devList, function (k, v) {
						v.newName = null;
						v.newIcon = null;
					});
					mtvuiUtil.makeMarquee($(".card-content"));
				}); 			

			}, 500);
        }

        return false;
    }

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
			console.log(cur_ipt_id);
            if (g_inputSrcObj.checkTimeShift())
                return false;
			/*fix DTV00728384*/
			if (mtvuiUtil.selectSource()){
				setTimeout(function(){					
				try { g_inputSrcObj.setInputSource(cur_ipt_id); }
				catch(err) {
					console.log("error for set input source id!");
					console.log(err);
				}
				if (cur_ipt_id != InputSourceRaw.prototype.usbID
					&& cur_ipt_id != InputSourceRaw.prototype.networkID) {
					if (cur_ipt_id == InputSourceRaw.prototype.antennaID || cur_ipt_id == InputSourceRaw.prototype.cableID
						|| cur_ipt_id == InputSourceRaw.prototype.satelliteID) {
						$('#id_div_contain').hide(0, function () {
							mtvuiUtil.gotoSysPage("sys_channel_zapper", true);
						});
						
					} else {
						$('#id_div_contain').hide(0, function () {
							mtvuiUtil.gotoSysPage("sys_index", true);
						});
					}
					
				}
				return false;
				}, 200);
			} else {
				try { g_inputSrcObj.setInputSource(cur_ipt_id); }
				catch(err) {
					console.log("error for set input source id!");
					console.log(err);
				}
				if (cur_ipt_id != InputSourceRaw.prototype.usbID
					&& cur_ipt_id != InputSourceRaw.prototype.networkID) {
					if (cur_ipt_id == InputSourceRaw.prototype.antennaID || cur_ipt_id == InputSourceRaw.prototype.cableID
						|| cur_ipt_id == InputSourceRaw.prototype.satelliteID) {
						$('#id_div_contain').hide(0, function () {
							mtvuiUtil.gotoSysPage("sys_channel_zapper", true);
						});
						
					} else {
						$('#id_div_contain').hide(0, function () {
							mtvuiUtil.gotoSysPage("sys_index", true);
						});
					}
				}
				return false;
			}
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
	g_idx = idx;
	
    cards_all.removeClass("active");
    active_card = $(cards_all[idx]);
    active_card.addClass("active");

    id = active_card.data("id");
    obj = findInputObj({id:id});
    if (obj) {
        if (obj.isEditable)
            $("#color_list_bar").show();
        else
            $("#color_list_bar").hide();
    }

    return false;
}

$(document).ready(function () {
    g_inputSrcObj = new InputSource();
    gInputObjList = g_inputSrcObj.getInputList();
    setTimeout(function(){
		inputSourceGridMenuInit($("#id_input_carousel"), gInputObjList);
		mtvuiUtil.makeMarquee($(".card-content"));
	}, 110);

    gTimeoutHandle = setTimeout(function () {
        var devList = gInputObjList.filter(function(v) {
            return (v.oName && v.oName.indexOf('HDMI') == 0);
        });
        devList = ipsCECObj.updateDeviceList(devList);
        $.each(devList, function (k,v) {
			v.name = v["cName"] || v["aName"] || v["oName"];
			v.icon = v["cIcon"] || v["aIcon"] || v["oIcon"];
            updateDeviceCecInfo(v);
        });
    }, 80);
	/* var mtvObjRaw = new MtvObjRaw();
	mtvObjRaw.addEventListener(ipsCEC_EventName, ipsCEC_DeviceDetectNotifyFunc); */
});

$(document).on("keydown", function (evt) {
    if (inputSourceMainMenuKeyHandler(evt))
        return mtvuiUtil.procSysKey(evt.keyCode || evt.which);
    return false;
});
