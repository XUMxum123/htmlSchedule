
$.widget( "mtvui.ChannelOsdDialog", {
	open: function() {
		var self = this;
        var dlg = this.element;
        dlg.show(); // show it first, then the operation depends on .offset() will work
		dlg.focus();
		self._osdChannelShow(true);
    },
    close: function() {
        this.element.hide();
        this._trigger("close", this);
    },

	_create: function() {
		var self = this;
        var dlg = this.element;
		dlg.focus();
		/*global variante statement*/
		//temp_channelID = null;
		g_current_ch_list_type = 0;
		g_current_ch_filter_type = 0;
		g_chObj = null;
		g_current_svl_id = 0;
		g_isChannelZapperShowing = true;
		g_osdChannelTimeout = null;
		g_channel_count = 0;
		g_leftChannelID = 0;
		g_middChannelID = 0;
		g_righChannelID = 0;
		g_prevChannelInfo = null;
		g_nextChannelInfo = null;
		g_middleChannelInfo = null;
		g_selectChannelInfo = null;
		g_leftChannelLogo = null;
		g_middleChannelLogo = null;
		g_rightChannelLogo = null;

		//osd_channel
		$('<div tabindex="0" id="osd_channel" style="display:none;" >\
		  <div id="osd_channel_hl" \
					style="position:absolute; left:487px; top:0px; width:303px; heigth:220px;">\
					<img src="file:///3rd/html5/Assets/_Highlight/Glow_Blue_TimeDate.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="osd_channel_bg" \
					style="position:absolute; left:572px; top:21px; width:138px; heigth:105px;">\
					<img src="file:///3rd/html5/Assets/Zap/White_Box_Zap_HL.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="osd_channel_logo"\
					style="position:absolute; left:596px; top:40px; width:90px; heigth:90px;">\
					<img id="channel_logo" src="file:///3rd/html5/Assets/_Icons/EPG_Icons/iconChannel_BG.png" style="width:100%; height:100%" /></div>\
		  <div id="osd_channel_name"\
					style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;color:#FFFFFF; text-align:center; position:absolute; left:510px; top:139px; width:260px; heigth:28px; font-size:22px;"><!--BBC News-->\
		  </div>\
		  <div id="osd_scrambled" style="position:absolute; left:694px; top:110px; width:31px; heigth:31px; display: none">\
					<img id="icon_scrambled" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Scrambled_Small.png" style="width:100%; height:100%" />\
		  </div>\
			<div id="osd_favourite" style="position:absolute; left:694px; top:7px; width:31px; heigth:31px; display: none">\
					<img id="icon_favourite" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Favorite_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="osd_new" style="position:absolute; left:694px; top:7px; width:31px; heigth:31px; display: none">\
					<img id="icon_new" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_New_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="osd_lock" style="position:absolute; left:557px; top:7px; width:31px; heigth:31px; display: block">\
					<img id="icon_lock" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Lock_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="osd_channel_time" \
					style="color:#FFFFFF; text-align:left; position:absolute; left:735px; top:27px; width:530px; heigth:24px; font-size:20px;"> 20:00 - 21:30\
		  </div>\
		  <div id="osd_channel_program" \
					style="color:#FFFFFF; text-align:left; position:absolute; left:735px; top:74px; width:530px; heigth:30px; font-size:24px; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><nobr><!--The Curious Case of Benjamin The Curious Case of Benjamin--></nobr>\
		  </div> \
		  <div id="osd_channel_time_progress" style="position:absolute; left:737px; top:108px; width:236px; display:none;"> \
			<p> \
			<progress id="osd_event_time_progress" min="0" max="100" low="25" high="75" optimum="100" value="0" style="width: 100%; height: 5px;"></progress> \
	        </p></div></div>').appendTo(dlg);

		  // channel_zapper_container
		  $('<div tabindex="0" id="zapper_channel" class="channel_zapper_container" style="display:none;">\
				<div id="more_left" \
					style="position:absolute; left:0px; top:22px; width:30px; heigth:69px;"  >\
					<img src="file:///3rd/html5/Assets/Zap/More_Left.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="more_right"\
					style="position:absolute; left:1250px; top:22px; width:30px; heigth:69px;" >\
					<img src="file:///3rd/html5/Assets/Zap/More_Right.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_center_hl" \
					style="position:absolute; left:487px; top:0px; width:303px; heigth:220px;">\
					<img src="file:///3rd/html5/Assets/_Highlight/Glow_Blue_TimeDate.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_center_bg" \
					style="position:absolute; left:572px; top:21px; width:138px; heigth:105px;">\
					<img src="file:///3rd/html5/Assets/Zap/White_Box_Zap_HL.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_center_logo"\
					style="position:absolute; left:596px; top:40px; width:90px; heigth:90px;">\
					<img id="logo_middle" src="file:///3rd/html5/Assets/_Icons/EPG_Icons/iconChannel_BG.png" style="width:100%; height:100%" /> \
		  </div>\
		  <div id="channel_center_name" \
					style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;color:#FFFFFF; text-align:center; position:absolute; left:510px; top:139px; width:260px; heigth:28px;font-size:22px;"> <!--BBC News -->\
		  </div>\
		  <div id="channel_center_scrambled" style="position:absolute; left:694px; top:110px; width:31px; heigth:31px; display: none">\
					<img id="icon_center_scrambled" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Scrambled_Small.png" style="width:100%; height:100%" />\
		  </div>\
			<div id="channel_center_favourite" style="position:absolute; left:694px; top:7px; width:31px; heigth:31px; display: none">\
					<img id="icon_center_favourite" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Favorite_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_center_new" style="position:absolute; left:694px; top:7px; width:31px; heigth:31px; display: none">\
					<img id="icon_center_new" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_New_Small.png" style="width:100%; height:100%" />\
		  </div> \
		  <div id="channel_center_lock" style="position:absolute; left:557px; top:7px; width:31px; heigth:31px; display: none">\
					<img id="icon_center_lock" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Lock_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <!-- Left: Channel Logo icon and channel name -->\
		  <div id="channel_left_bg" \
					style="position:absolute; left:274px; top:22px; width:92px; heigth:69px;">\
					<img src="file:///3rd/html5/Assets/Zap/White_Box_Zap_N.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_left_logo" \
					style="position:absolute; left:290px; top:34px; width:60px; heigth:60px;">\
					<img id="logo_left" src="file:///3rd/html5/Assets/_Icons/EPG_Icons/iconChannel_BG.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_left_name" \
					style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;color:#D3D4D5; text-align:center; position:absolute; left:190px; top:104px; width:260px; heigth:28px;font-size:22px;"> <!--NBC-->\
		  </div>\
		  <div id="channel_left_scrambled" style="position:absolute; left:351px; top:77px; width:28px; heigth:28px; display: none">\
					<img id="icon_left_scrambled" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Scrambled_Small.png" style="width:100%; height:100%" />\
		  </div>\
			<div id="channel_left_favourite" style="position:absolute; left:351px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_left_favourite" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Favorite_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_left_new" style="position:absolute; left:351px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_left_new" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_New_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_left_lock" style="position:absolute; left:261px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_left_lock" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Lock_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <!-- Right: Channel Logo icon and channel name -->\
		  <div id="channel_right_bg"\
					style="position:absolute; left:909px; top:22px; width:92px; heigth:69px;">\
					<img src="file:///3rd/html5/Assets/Zap/White_Box_Zap_N.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_right_logo"\
					style="position:absolute; left:925px; top:34px; width:60px; heigth:60px;">\
					<img id="logo_right" src="file:///3rd/html5/Assets/_Icons/EPG_Icons/iconChannel_BG.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_right_name" \
					style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;color:#D3D4D5; text-align:center; position:absolute; left:826px; top:104px; width:260px; heigth:28px;font-size:22px;"> <!--MTV-->\
		  </div>\
		  <div id="channel_right_scrambled" style="position:absolute; left:987px; top:77px; width:28px; heigth:28px; display: none">\
					<img id="icon_right_scrambled" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Scrambled_Small.png" style="width:100%; height:100%" />\
		  </div>\
			<div id="channel_right_favourite" style="position:absolute; left:987px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_right_favourite" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Favorite_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_right_new" style="position:absolute; left:987px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_right_new" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_New_Small.png" style="width:100%; height:100%" />\
		  </div>\
		  <div id="channel_right_lock" style="position:absolute; left:892px; top:8px; width:28px; heigth:28px; display: none">\
					<img id="icon_right_lock" src="file:///3rd/html5/Assets/Channelgrid/Channelgrid_Icons/Icon_Lock_Small.png" style="width:100%; height:100%" />\
		  </div> </div>').appendTo(dlg);

		  dlg.on('keydown', function (evt){
				self._channelZapperHandleKey(evt)
			});
	},

	_channelZapperIsShowing: function () {
		return g_isChannelZapperShowing;
	},

	_channelZapperGetChannelLogo: function (iconIdx) {
		var icon = mtvuiUtil.getChannelLogoSrc(iconIdx);
		if (icon == null) {
			icon = "file:///3rd/html5/Assets/_Icons/EPG_Icons/iconChannel_BG.png";
		}
		return icon;
	},

	/*to solve special symbol display such as < > &, which may lead to error*/
	_charReplace: function (Srcstring){
		var service_name = Srcstring.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#'+i.charCodeAt(0)+';';});
		return service_name;
	},

	_osdChannelShow: function (isShow, channelInfo) {
		var self = this;
		var dlg = this.element;
		if (isShow)
		{
			dlg.focus();
			g_isChannelZapperShowing = false;
			self._channelZapperShow(false);
			if(self._osdChannelInit(channelInfo))
			{
				if ($('#osd_channel').css('display') == 'none') {
					$('#osd_channel').css('display','block');
				}
				//self._sendPageSubStatus("HTML5_UI_PAGE_CHANNEL_ZAPPER", "");
				self._channelZapperInit();
				if (typeof(channelInfo) == 'undefined') {
			    	var chInfo = self._channelZappersGetCurrentChannelInfo();
				} else {
					chInfo = channelInfo;
				}
				var ch_mask = parseInt(chInfo.NW_MASK);
				var is_lock	= (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;
				var country = g_chObj.getCurrentCountry();
				var chName = chInfo.SERVICE_NAME;
				var hbbtv = g_chObj.acfgGetConfigValue("g_menu__hbbtv");
				if ("NLD" == country && (!chInfo.HBBTV_OFF && hbbtv) && (chName && chName.match(/NPO/)) && !is_lock) {
					self._osdChannelStartTimeout(4300);
				} else {
			    	self._osdChannelStartTimeout(1800);
				}
			}
			else
			{
				self._osdChannelClose();
			}

		}
		else {
			if ($('#osd_channel').css('display')=='block') {
				$('#osd_channel').css('display','none');
			}
			self._osdChannelStopTimeout();
		}
	},

	_channelZapperShow: function (isShow) {
		var self = this;
		var dlg = this.element;
		if (isShow)
		{
			g_isChannelZapperShowing = true;
			dlg.focus();
			if ($('#zapper_channel').css('display') == 'none') {
				$('#zapper_channel').css('display','block');
			}
			//self._sendPageSubStatus("HTML5_UI_PAGE_CHANNEL_ZAPPER", "");
		}
		else {
			if ($('#zapper_channel').css('display')=='block') {
				$('#zapper_channel').css('display','none');
			}
		}
	},

	_osdChannelInit: function (channelInfo){
		var self = this;
		var event_startEndTime ='';
		var event_name ='';
		var event_desc ='';
		//createProgressBar("osd_event_time_progress", null, null, null, null, null);
		if (!g_chObj) {
			g_chObj = new MtvObj();
		}

		utilInit(g_chObj);
		if (typeof(channelInfo) == 'undefined') {
			var current_ch_info = self._channelZappersGetCurrentChannelInfo();
		} else {
			var current_ch_info = channelInfo;
		}
		/*when enter EPG and then back, TV is not install channel, which will show channel osd*/
		if (current_ch_info == null){
			console.log("current channel info is null");
			return false;
		}

		if(g_chObj.isCiPlusHostTune()){
			console.log("isCiPlusHostTune is true");
			return false;
		}
		g_current_ch_list_type = g_chObj.getChannelListType();
		g_current_ch_filter_type = g_chObj.getChannelFilterType();

		var ch_mask = parseInt(current_ch_info.NW_MASK);
		var is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
		var is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
		var is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
		var is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

		g_current_svl_id = current_ch_info.SVL_ID;

		/* show scramble icon*/
		$('#osd_channel').addClass("channel_zapper_container");
		if (is_scrambled){
			if ($('#osd_scrambled').css('display')=='none') {
				$('#osd_scrambled').css('display','block');
			}
		} else{
			if ($('#osd_scrambled').css('display')=='block') {
				$('#osd_scrambled').css('display','none');
			}
		}
		/* show favourite icon*/
		if (is_favorite){
			if ($('#osd_favourite').css('display')=='none') {
				$('#osd_favourite').css('display','block');
			}
		} else{
			if ($('#osd_favourite').css('display')=='block') {
				$('#osd_favourite').css('display','none');
			}
		}
		/* show new icon*/
		if (is_new && !is_favorite){
			if ($('#osd_new').css('display')=='none') {
				$('#osd_new').css('display','block');
			}
		} else{
			if ($('#osd_new').css('display')=='block') {
				$('#osd_new').css('display','none');
			}
		}
		/* show lock icon*/
		if (is_lock){
			if ($('#osd_lock').css('display')=='none') {
				$('#osd_lock').css('display','block');
			}
		} else{
			if ($('#osd_lock').css('display')=='block') {
				$('#osd_lock').css('display','none');
			}
		}
		var current_channel_logo = self._channelZapperGetChannelLogo(current_ch_info.CH_LOGO_ID);
		//document.getElementById('channel_logo').src = current_channel_logo;
		$('#channel_logo').attr("src", current_channel_logo);
		if(current_ch_info.MINOR_NUM!=0&&current_ch_info.MINOR_NUM!=undefined){

		osd_channel_name.innerHTML = current_ch_info.MAJOR_NUM+'.'+current_ch_info.MINOR_NUM + ' ' + self._charReplace(current_ch_info.SERVICE_NAME);

		}else{
		osd_channel_name.innerHTML = current_ch_info.MAJOR_NUM + ' ' + self._charReplace(current_ch_info.SERVICE_NAME);
		}
		var eventItem = g_chObj.getEpgNowEvent(current_ch_info.CHANNEL_ID);
		self._osdChannelEventTimeProgressShow(false);
		/* Now Event Info */
		if (eventItem )
		{
			startUtcTime    = parseInt(eventItem.START_TIME);
			durationUtcTime = parseInt(eventItem.DURATION);
			if (!isNaN(startUtcTime))
			{

				event_startEndTime = self._osdChannelFormatStartEndTime(startUtcTime, durationUtcTime);
				event_name         = eventItem.EVENT_NAME;
				event_desc         = eventItem.DETAILS;
			}
			self._osdChannelEventTimeProgressUpdate(startUtcTime, durationUtcTime);
		}

		osd_channel_program.innerHTML = self._charReplace(event_name);
		osd_channel_time.innerHTML    = event_startEndTime;

		/* remove NEW channel flag after change channel. */
		if (is_new){
			ch_mask = (current_ch_info.NW_MASK & (~SB_VENT_NEW_SERVICE));
			self._reset_channel_mask_info(current_ch_info.SVL_ID, current_ch_info.CHANNEL_ID, ch_mask);
		}

		return true;
	},

	_channelZapperInit: function () {
		var self = this;
		var channel_logo;

		if (!g_chObj) {
			g_chObj = new MtvObj();
		}

		//g_channel_count = channelZappersGetChannelCount();

		var ch_mask;
		var is_favorite;
		var is_scrambled;
		var is_new;
		var is_lock;

		g_current_ch_list_type = g_chObj.getChannelListType();
		g_current_ch_filter_type = g_chObj.getChannelFilterType();
		var currentChannelInfo = self._channelZappersGetCurrentChannelInfo();
		g_middleChannelInfo = currentChannelInfo;
		g_current_svl_id = currentChannelInfo.SVL_ID;

		// Prev Channel
		var prevChannelInfo = self._channelZappersGetPrevNextChannelInfo(1, currentChannelInfo.CHANNEL_ID);
		g_prevChannelInfo = prevChannelInfo;

	/**************************************************************************************/
		ch_mask = parseInt(prevChannelInfo.NW_MASK);
		is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
		is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
		is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
		is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

		/* show scramble icon*/
		if (is_scrambled){
			if ($('#channel_left_scrambled').css('display')=='none') {
				$('#channel_left_scrambled').css('display','block');
			}
		} else{
			if ($('#channel_left_scrambled').css('display')=='block') {
				$('#channel_left_scrambled').css('display','none');
			}
		}
		/* show favourite icon*/
		if (is_favorite){
			if ($('#channel_left_favourite').css('display')=='none') {
				$('#channel_left_favourite').css('display','block');
			}
		} else{
			if ($('#channel_left_favourite').css('display')=='block') {
				$('#channel_left_favourite').css('display','none');
			}
		}
		/* show new icon*/
		if (is_new && !is_favorite){
			if ($('#channel_left_new').css('display')=='none') {
				$('#channel_left_new').css('display','block');
			}
		} else{
			if ($('#channel_left_new').css('display')=='block') {
				$('#channel_left_new').css('display','none');
			}
		}
		/* show lock icon*/
		if (is_lock){
			if ($('#channel_left_lock').css('display')=='none') {
				$('#channel_left_lock').css('display','block');
			}
		} else{
			if ($('#channel_left_lock').css('display')=='block') {
				$('#channel_left_lock').css('display','none');
			}
		}
	/*****************************************************************************/

		channel_logo = self._channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
		g_leftChannelLogo = channel_logo;
		//document.getElementById('logo_left').src               = channel_logo;
		//document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
		$('#logo_left').attr("src", channel_logo);
		if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){

		channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM+'.'+prevChannelInfo.MINOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

		}else{
		channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);
		}
		g_leftChannelID = prevChannelInfo.CHANNEL_ID;

		// Current Channel
		/**************************************************************************************/
		ch_mask = parseInt(currentChannelInfo.NW_MASK);
		is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
		is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
		is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
		is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

		/* show scramble icon*/
		if (is_scrambled){
			if ($('#channel_center_scrambled').css('display')=='none') {
				$('#channel_center_scrambled').css('display','block');
			}
		} else{
			if ($('#channel_center_scrambled').css('display')=='block') {
				$('#channel_center_scrambled').css('display','none');
			}
		}
		/* show favourite icon*/
		if (is_favorite){
			if ($('#channel_center_favourite').css('display')=='none') {
				$('#channel_center_favourite').css('display','block');
			}
		} else{
			if ($('#channel_center_favourite').css('display')=='block') {
				$('#channel_center_favourite').css('display','none');
			}
		}
		/* show new icon*/
		if (is_new && !is_favorite){
			if ($('#channel_center_new').css('display')=='none') {
				$('#channel_center_new').css('display','block');
			}
		} else{
			if ($('#channel_center_new').css('display')=='block') {
				$('#channel_center_new').css('display','none');
			}
		}
		/* show lock icon*/
		if (is_lock){
			if ($('#channel_center_lock').css('display')=='none') {
				$('#channel_center_lock').css('display','block');
			}
		} else{
			if ($('#channel_center_lock').css('display')=='block') {
				$('#channel_center_lock').css('display','none');
			}
		}
	/*****************************************************************************/
		channel_logo = self._channelZapperGetChannelLogo(currentChannelInfo.CH_LOGO_ID);
		g_middleChannelLogo = channel_logo;
		//document.getElementById('logo_middle').src               = channel_logo;
		//document.getElementById('channel_center_name').innerHTML = currentChannelInfo.MAJOR_NUM + ' ' + currentChannelInfo.SERVICE_NAME;
		$('#logo_middle').attr("src", channel_logo);
		if(currentChannelInfo.MINOR_NUM!=0&&currentChannelInfo.MINOR_NUM!=undefined){

		channel_center_name.innerHTML = currentChannelInfo.MAJOR_NUM+'.'+currentChannelInfo.MINOR_NUM + ' ' + self._charReplace(currentChannelInfo.SERVICE_NAME);

		}else{
		channel_center_name.innerHTML = currentChannelInfo.MAJOR_NUM + ' ' + self._charReplace(currentChannelInfo.SERVICE_NAME);
		}
		g_middChannelID = currentChannelInfo.CHANNEL_ID;
		g_selectChannelInfo = currentChannelInfo;

		// Next Channel
		var nextChannelInfo = self._channelZappersGetPrevNextChannelInfo(0, currentChannelInfo.CHANNEL_ID);
		g_nextChannelInfo = nextChannelInfo;

		/**************************************************************************************/
		ch_mask = parseInt(nextChannelInfo.NW_MASK);
		is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
		is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
		is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
		is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

		/* show scramble icon*/
		if (is_scrambled){
			if ($('#channel_right_scrambled').css('display')=='none') {
				$('#channel_right_scrambled').css('display','block');
			}
		} else{
			if ($('#channel_right_scrambled').css('display')=='block') {
				$('#channel_right_scrambled').css('display','none');
			}
		}
		/* show favourite icon*/
		if (is_favorite){
			if ($('#channel_right_favourite').css('display')=='none') {
				$('#channel_right_favourite').css('display','block');
			}
		} else{
			if ($('#channel_right_favourite').css('display')=='block') {
				$('#channel_right_favourite').css('display','none');
			}
		}
		/* show new icon*/
		if (is_new && !is_favorite){
			if ($('#channel_right_new').css('display')=='none') {
				$('#channel_right_new').css('display','block');
			}
		} else{
			if ($('#channel_right_new').css('display')=='block') {
				$('#channel_right_new').css('display','none');
			}
		}
		/* show lock icon*/
		if (is_lock){
			if ($('#channel_right_lock').css('display')=='none') {
				$('#channel_right_lock').css('display','block');
			}
		} else{
			if ($('#channel_right_lock').css('display')=='block') {
				$('#channel_right_lock').css('display','none');
			}
		}
	/*****************************************************************************/
		channel_logo = self._channelZapperGetChannelLogo(nextChannelInfo.CH_LOGO_ID);
		g_rightChannelLogo = channel_logo;
		$('#logo_right').attr("src", channel_logo);
		if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){

		channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM+'.'+nextChannelInfo.MINOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

		}else{
		channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

		}
		//document.getElementById('logo_right').src               = channel_logo;
		//document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
		g_righChannelID = nextChannelInfo.CHANNEL_ID;
		//self._osdChannelStartTimeout(6000);
	},
	_channelZapperScroll: function (is_left) {
		var self = this;
		var dlg = this.element;
		dlg.focus();
		var channel_logo;
		var ch_mask;
		var is_favorite;
		var is_scrambled;
		var is_new;
		var is_lock;
		if(g_chObj.acfgGetConfigValue('g_misc__service_navigation_status')==1){
		if (is_left == 0)
		{
			var prevChannelInfo = g_middleChannelInfo;
			if (prevChannelInfo) {
				channel_logo = g_middleChannelLogo;
				$('#logo_left').attr("src", channel_logo);
				if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){

				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM+'.'+prevChannelInfo.MINOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

			}else{
				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);
			}
				g_leftChannelID = prevChannelInfo.CHANNEL_ID;
				g_prevChannelInfo = prevChannelInfo;
				g_leftChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(prevChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_left_scrambled').css('display')=='none') {
						$('#channel_left_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_left_scrambled').css('display')=='block') {
						$('#channel_left_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_left_favourite').css('display')=='none') {
						$('#channel_left_favourite').css('display','block');
					}
				} else{
					if ($('#channel_left_favourite').css('display')=='block') {
						$('#channel_left_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_left_new').css('display')=='none') {
						$('#channel_left_new').css('display','block');
					}
				} else{
					if ($('#channel_left_new').css('display')=='block') {
						$('#channel_left_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_left_lock').css('display')=='none') {
						$('#channel_left_lock').css('display','block');
					}
				} else{
					if ($('#channel_left_lock').css('display')=='block') {
						$('#channel_left_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			// Middle Channel
			//var middChannelInfo = channelZappersGetPrevNextChannelInfo(0, g_middChannelID);
			var middChannelInfo = g_nextChannelInfo;
			if (middChannelInfo) {
				//channel_logo = channelZapperGetChannelLogo(middChannelInfo.CH_LOGO_ID);
				channel_logo = g_rightChannelLogo;
				//document.getElementById('logo_middle').src               = channel_logo;
				//document.getElementById('channel_center_name').innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
				$('#logo_middle').attr("src", channel_logo);
				if(middChannelInfo.MINOR_NUM!=0&&middChannelInfo.MINOR_NUM!=undefined){

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM+'.'+middChannelInfo.MINOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}else{
				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}
				g_middleChannelInfo = middChannelInfo;
				g_selectChannelInfo = middChannelInfo;
				g_middleChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(middChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_center_scrambled').css('display')=='none') {
						$('#channel_center_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_center_scrambled').css('display')=='block') {
						$('#channel_center_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_center_favourite').css('display')=='none') {
						$('#channel_center_favourite').css('display','block');
					}
				} else{
					if ($('#channel_center_favourite').css('display')=='block') {
						$('#channel_center_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_center_new').css('display')=='none') {
						$('#channel_center_new').css('display','block');
					}
				} else{
					if ($('#channel_center_new').css('display')=='block') {
						$('#channel_center_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_center_lock').css('display')=='none') {
						$('#channel_center_lock').css('display','block');
					}
				} else{
					if ($('#channel_center_lock').css('display')=='block') {
						$('#channel_center_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}

			// Next Channel
			var nextChannelInfo = self._channelZappersGetPrevNextChannelInfo(0, g_righChannelID);
			//self._channelZapperSetChannel(nextChannelInfo.CHANNEL_ID);
			if (nextChannelInfo) {
				channel_logo = self._channelZapperGetChannelLogo(nextChannelInfo.CH_LOGO_ID);
				//document.getElementById('logo_right').src               = channel_logo;
				//document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
				$('#logo_right').attr("src", channel_logo);
				if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){

				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM+'.'+nextChannelInfo.MINOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}else{
				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}
				g_righChannelID = nextChannelInfo.CHANNEL_ID;
				g_nextChannelInfo = nextChannelInfo;
				g_rightChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(nextChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_right_scrambled').css('display')=='none') {
						$('#channel_right_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_right_scrambled').css('display')=='block') {
						$('#channel_right_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_right_favourite').css('display')=='none') {
						$('#channel_right_favourite').css('display','block');
					}
				} else{
					if ($('#channel_right_favourite').css('display')=='block') {
						$('#channel_right_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_right_new').css('display')=='none') {
						$('#channel_right_new').css('display','block');
					}
				} else{
					if ($('#channel_right_new').css('display')=='block') {
						$('#channel_right_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_right_lock').css('display')=='none') {
						$('#channel_right_lock').css('display','block');
					}
				} else{
					if ($('#channel_right_lock').css('display')=='block') {
						$('#channel_right_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
	   }
	   else
	   {
			// Prev Channel
			var channel_logo_left;
			var channel_info_pre;
			var channel_logo_mid;
			var channel_info_mid;
			var prevChannelInfo = self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
			//self._channelZapperSetChannel(prevChannelInfo.CHANNEL_ID);
			if (prevChannelInfo) {
				channel_logo_left = self._channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
				//document.getElementById('logo_left').src               = channel_logo_left;
				//document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
				$('#logo_left').attr("src", channel_logo_left);
				if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){

				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM+'.'+prevChannelInfo.MINOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

				}else{
				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

				}
				g_leftChannelID = prevChannelInfo.CHANNEL_ID;
				channel_info_pre = prevChannelInfo;
				/**************************************************************************************/
				ch_mask = parseInt(prevChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_left_scrambled').css('display')=='none') {
						$('#channel_left_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_left_scrambled').css('display')=='block') {
						$('#channel_left_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_left_favourite').css('display')=='none') {
						$('#channel_left_favourite').css('display','block');
					}
				} else{
					if ($('#channel_left_favourite').css('display')=='block') {
						$('#channel_left_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_left_new').css('display')=='none') {
						$('#channel_left_new').css('display','block');
					}
				} else{
					if ($('#channel_left_new').css('display')=='block') {
						$('#channel_left_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_left_lock').css('display')=='none') {
						$('#channel_left_lock').css('display','block');
					}
				} else{
					if ($('#channel_left_lock').css('display')=='block') {
						$('#channel_left_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}

			// Middle Channel
			//var middChannelInfo = channelZappersGetPrevNextChannelInfo(1, g_middChannelID);
			var middChannelInfo = g_prevChannelInfo;
			if (middChannelInfo) {
				//channel_logo = channelZapperGetChannelLogo(middChannelInfo.CH_LOGO_ID);
				channel_logo_mid = g_leftChannelLogo;
				//document.getElementById('logo_middle').src               = channel_logo_mid;
				//document.getElementById('channel_center_name').innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
				$('#logo_middle').attr("src", channel_logo_mid);
				if(middChannelInfo.MINOR_NUM!=0&&middChannelInfo.MINOR_NUM!=undefined){

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM+'.'+middChannelInfo.MINOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}else{

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);
				}
				g_middChannelID = middChannelInfo.CHANNEL_ID;
				channel_info_mid = middChannelInfo;
				g_selectChannelInfo = middChannelInfo;

				/**************************************************************************************/
				ch_mask = parseInt(middChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_center_scrambled').css('display')=='none') {
						$('#channel_center_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_center_scrambled').css('display')=='block') {
						$('#channel_center_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_center_favourite').css('display')=='none') {
						$('#channel_center_favourite').css('display','block');
					}
				} else{
					if ($('#channel_center_favourite').css('display')=='block') {
						$('#channel_center_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_center_new').css('display')=='none') {
						$('#channel_center_new').css('display','block');
					}
				} else{
					if ($('#channel_center_new').css('display')=='block') {
						$('#channel_center_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_center_lock').css('display')=='none') {
						$('#channel_center_lock').css('display','block');
					}
				} else{
					if ($('#channel_center_lock').css('display')=='block') {
						$('#channel_center_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}

			// Next Channel
			//var nextChannelInfo = channelZappersGetPrevNextChannelInfo(1, g_righChannelID);
			var nextChannelInfo = g_middleChannelInfo;
			if (nextChannelInfo) {
				channel_logo = g_middleChannelLogo
				//document.getElementById('logo_right').src               = channel_logo;
				//document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
				$('#logo_right').attr("src", channel_logo);
					if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){

				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM+'.'+nextChannelInfo.MINOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}else{
				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}
				g_righChannelID = nextChannelInfo.CHANNEL_ID;
				g_nextChannelInfo = nextChannelInfo;
				g_rightChannelLogo = channel_logo;
				/**************************************************************************************/
				ch_mask = parseInt(nextChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_right_scrambled').css('display')=='none') {
						$('#channel_right_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_right_scrambled').css('display')=='block') {
						$('#channel_right_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_right_favourite').css('display')=='none') {
						$('#channel_right_favourite').css('display','block');
					}
				} else{
					if ($('#channel_right_favourite').css('display')=='block') {
						$('#channel_right_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_right_new').css('display')=='none') {
						$('#channel_right_new').css('display','block');
					}
				} else{
					if ($('#channel_right_new').css('display')=='block') {
						$('#channel_right_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_right_lock').css('display')=='none') {
						$('#channel_right_lock').css('display','block');
					}
				} else{
					if ($('#channel_right_lock').css('display')=='block') {
						$('#channel_right_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			g_leftChannelLogo = channel_logo_left;
			g_prevChannelInfo = channel_info_pre;
			g_middleChannelInfo = channel_info_mid;
			g_middleChannelLogo = channel_logo_mid;
	   }
	   }else{
	   if (is_left == 0)
		{
			var prevChannelInfo = g_middleChannelInfo;
			if (prevChannelInfo) {
				channel_logo = g_middleChannelLogo;
				$('#logo_left').attr("src", channel_logo);
				if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){

				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM+'.'+prevChannelInfo.MINOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

			}else{
				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);
			}
				g_leftChannelID = prevChannelInfo.CHANNEL_ID;
				g_prevChannelInfo = prevChannelInfo;
				g_leftChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(prevChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_left_scrambled').css('display')=='none') {
						$('#channel_left_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_left_scrambled').css('display')=='block') {
						$('#channel_left_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_left_favourite').css('display')=='none') {
						$('#channel_left_favourite').css('display','block');
					}
				} else{
					if ($('#channel_left_favourite').css('display')=='block') {
						$('#channel_left_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_left_new').css('display')=='none') {
						$('#channel_left_new').css('display','block');
					}
				} else{
					if ($('#channel_left_new').css('display')=='block') {
						$('#channel_left_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_left_lock').css('display')=='none') {
						$('#channel_left_lock').css('display','block');
					}
				} else{
					if ($('#channel_left_lock').css('display')=='block') {
						$('#channel_left_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			// Middle Channel
			//var middChannelInfo = channelZappersGetPrevNextChannelInfo(0, g_middChannelID);
			var middChannelInfo = g_nextChannelInfo;
			if (middChannelInfo) {
				//channel_logo = channelZapperGetChannelLogo(middChannelInfo.CH_LOGO_ID);
				channel_logo = g_rightChannelLogo;
				//document.getElementById('logo_middle').src               = channel_logo;
				//document.getElementById('channel_center_name').innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
				$('#logo_middle').attr("src", channel_logo);
				if(middChannelInfo.MINOR_NUM!=0&&middChannelInfo.MINOR_NUM!=undefined){

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM+'.'+middChannelInfo.MINOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}else{
				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}
				g_middleChannelInfo = middChannelInfo;
				g_selectChannelInfo = middChannelInfo;
				g_middleChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(middChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_center_scrambled').css('display')=='none') {
						$('#channel_center_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_center_scrambled').css('display')=='block') {
						$('#channel_center_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_center_favourite').css('display')=='none') {
						$('#channel_center_favourite').css('display','block');
					}
				} else{
					if ($('#channel_center_favourite').css('display')=='block') {
						$('#channel_center_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_center_new').css('display')=='none') {
						$('#channel_center_new').css('display','block');
					}
				} else{
					if ($('#channel_center_new').css('display')=='block') {
						$('#channel_center_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_center_lock').css('display')=='none') {
						$('#channel_center_lock').css('display','block');
					}
				} else{
					if ($('#channel_center_lock').css('display')=='block') {
						$('#channel_center_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}

			// Next Channel
			var nextChannelInfo = self._channelZappersGetPrevNextChannelInfo(0, g_righChannelID);
			if(nextChannelInfo.MAJOR_NUM==middChannelInfo.MAJOR_NUM){
			  while(true){
				if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){
					g_righChannelID=nextChannelInfo.CHANNEL_ID;
					nextChannelInfo=self._channelZappersGetPrevNextChannelInfo(0, g_righChannelID);
				}else{
				break;
			    }
			  }
			}
			
			//self._channelZapperSetChannel(nextChannelInfo.CHANNEL_ID);
			if (nextChannelInfo) {
				channel_logo = self._channelZapperGetChannelLogo(nextChannelInfo.CH_LOGO_ID);
				//document.getElementById('logo_right').src               = channel_logo;
				//document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
				$('#logo_right').attr("src", channel_logo);
				if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){

				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM+'.'+nextChannelInfo.MINOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}else{
				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}
				g_righChannelID = nextChannelInfo.CHANNEL_ID;
				g_nextChannelInfo = nextChannelInfo;
				g_rightChannelLogo = channel_logo;

				/**************************************************************************************/
				ch_mask = parseInt(nextChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_right_scrambled').css('display')=='none') {
						$('#channel_right_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_right_scrambled').css('display')=='block') {
						$('#channel_right_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_right_favourite').css('display')=='none') {
						$('#channel_right_favourite').css('display','block');
					}
				} else{
					if ($('#channel_right_favourite').css('display')=='block') {
						$('#channel_right_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_right_new').css('display')=='none') {
						$('#channel_right_new').css('display','block');
					}
				} else{
					if ($('#channel_right_new').css('display')=='block') {
						$('#channel_right_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_right_lock').css('display')=='none') {
						$('#channel_right_lock').css('display','block');
					}
				} else{
					if ($('#channel_right_lock').css('display')=='block') {
						$('#channel_right_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
	   }
	   else
	   {
			
			var channel_logo_left;
			var channel_info_pre;
			var channel_logo_mid;
			var channel_info_mid;
			// Middle Channel
			//var middChannelInfo = channelZappersGetPrevNextChannelInfo(1, g_middChannelID);
			var middChannelInfo = g_prevChannelInfo;
			var prevChannelInfo = self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
			if(middChannelInfo.MAJOR_NUM==prevChannelInfo.MAJOR_NUM){
			if(middChannelInfo.MINOR_NUM!=0&&middChannelInfo.MINOR_NUM!=undefined){
			while(true){
			if(middChannelInfo.MAJOR_NUM==prevChannelInfo.MAJOR_NUM){
				 g_leftChannelID=middChannelInfo.CHANNEL_ID;
					middChannelInfo=self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);

				}else{
					break;
				}
			  } 
		
			}
			g_leftChannelID=middChannelInfo.CHANNEL_ID;
			middChannelInfo=self._channelZappersGetPrevNextChannelInfo(0, g_leftChannelID);

			}
			if (middChannelInfo) {
				//channel_logo = channelZapperGetChannelLogo(middChannelInfo.CH_LOGO_ID);
				channel_logo_mid = g_leftChannelLogo;
				//document.getElementById('logo_middle').src               = channel_logo_mid;
				//document.getElementById('channel_center_name').innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
				$('#logo_middle').attr("src", channel_logo_mid);
				if(middChannelInfo.MINOR_NUM!=0&&middChannelInfo.MINOR_NUM!=undefined){

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM+'.'+middChannelInfo.MINOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);

				}else{

				channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + self._charReplace(middChannelInfo.SERVICE_NAME);
				}
				g_middChannelID = middChannelInfo.CHANNEL_ID;
				channel_info_mid = middChannelInfo;
				g_selectChannelInfo = middChannelInfo;

				/**************************************************************************************/
				ch_mask = parseInt(middChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_center_scrambled').css('display')=='none') {
						$('#channel_center_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_center_scrambled').css('display')=='block') {
						$('#channel_center_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_center_favourite').css('display')=='none') {
						$('#channel_center_favourite').css('display','block');
					}
				} else{
					if ($('#channel_center_favourite').css('display')=='block') {
						$('#channel_center_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_center_new').css('display')=='none') {
						$('#channel_center_new').css('display','block');
					}
				} else{
					if ($('#channel_center_new').css('display')=='block') {
						$('#channel_center_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_center_lock').css('display')=='none') {
						$('#channel_center_lock').css('display','block');
					}
				} else{
					if ($('#channel_center_lock').css('display')=='block') {
						$('#channel_center_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			
			// Prev Channel

			var prevChannelInfo = self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
			if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){
					g_leftChannelID=prevChannelInfo.CHANNEL_ID;
				while(true){
				
				var prevChannelInfo_pre = self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
					if(prevChannelInfo.MAJOR_NUM==prevChannelInfo_pre.MAJOR_NUM){
					 g_leftChannelID=prevChannelInfo_pre.CHANNEL_ID;
					//prevChannelInfo=self._channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
			}else{
				break;
				}
			}
			 g_leftChannelID=prevChannelInfo_pre.CHANNEL_ID;
			prevChannelInfo=self._channelZappersGetPrevNextChannelInfo(0, g_leftChannelID);
				}
			//self._channelZapperSetChannel(prevChannelInfo.CHANNEL_ID);
			if (prevChannelInfo) {
				channel_logo_left = self._channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
				//document.getElementById('logo_left').src               = channel_logo_left;
				//document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
				$('#logo_left').attr("src", channel_logo_left);
				if(prevChannelInfo.MINOR_NUM!=0&&prevChannelInfo.MINOR_NUM!=undefined){

				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM+'.'+prevChannelInfo.MINOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

				}else{
				channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + self._charReplace(prevChannelInfo.SERVICE_NAME);

				}
				g_leftChannelID = prevChannelInfo.CHANNEL_ID;
				channel_info_pre = prevChannelInfo;
				/**************************************************************************************/
				ch_mask = parseInt(prevChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_left_scrambled').css('display')=='none') {
						$('#channel_left_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_left_scrambled').css('display')=='block') {
						$('#channel_left_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_left_favourite').css('display')=='none') {
						$('#channel_left_favourite').css('display','block');
					}
				} else{
					if ($('#channel_left_favourite').css('display')=='block') {
						$('#channel_left_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_left_new').css('display')=='none') {
						$('#channel_left_new').css('display','block');
					}
				} else{
					if ($('#channel_left_new').css('display')=='block') {
						$('#channel_left_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_left_lock').css('display')=='none') {
						$('#channel_left_lock').css('display','block');
					}
				} else{
					if ($('#channel_left_lock').css('display')=='block') {
						$('#channel_left_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			// Next Channel
			//var nextChannelInfo = channelZappersGetPrevNextChannelInfo(1, g_righChannelID);
			var nextChannelInfo = g_middleChannelInfo;
			if (nextChannelInfo) {
				channel_logo = g_middleChannelLogo
				//document.getElementById('logo_right').src               = channel_logo;
				//document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
				$('#logo_right').attr("src", channel_logo);
					if(nextChannelInfo.MINOR_NUM!=0&&nextChannelInfo.MINOR_NUM!=undefined){

				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM+'.'+nextChannelInfo.MINOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}else{
				channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + self._charReplace(nextChannelInfo.SERVICE_NAME);

				}
				g_righChannelID = nextChannelInfo.CHANNEL_ID;
				g_nextChannelInfo = nextChannelInfo;
				g_rightChannelLogo = channel_logo;
				/**************************************************************************************/
				ch_mask = parseInt(nextChannelInfo.NW_MASK);
				is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
				is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
				is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new;
				is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;

				/* show scramble icon*/
				if (is_scrambled){
					if ($('#channel_right_scrambled').css('display')=='none') {
						$('#channel_right_scrambled').css('display','block');
					}
				} else{
					if ($('#channel_right_scrambled').css('display')=='block') {
						$('#channel_right_scrambled').css('display','none');
					}
				}
				/* show favourite icon*/
				if (is_favorite){
					if ($('#channel_right_favourite').css('display')=='none') {
						$('#channel_right_favourite').css('display','block');
					}
				} else{
					if ($('#channel_right_favourite').css('display')=='block') {
						$('#channel_right_favourite').css('display','none');
					}
				}
				/* show new icon*/
				if (is_new && !is_favorite){
					if ($('#channel_right_new').css('display')=='none') {
						$('#channel_right_new').css('display','block');
					}
				} else{
					if ($('#channel_right_new').css('display')=='block') {
						$('#channel_right_new').css('display','none');
					}
				}
				/* show lock icon*/
				if (is_lock){
					if ($('#channel_right_lock').css('display')=='none') {
						$('#channel_right_lock').css('display','block');
					}
				} else{
					if ($('#channel_right_lock').css('display')=='block') {
						$('#channel_right_lock').css('display','none');
					}
				}
				/*****************************************************************************/
			}
			g_leftChannelLogo = channel_logo_left;
			g_prevChannelInfo = channel_info_pre;
			g_middleChannelInfo = channel_info_mid;
			g_middleChannelLogo = channel_logo_mid;
	   }
	   }
	   self._osdChannelStartTimeout(1000);
	},

	_channelZapperSetChannel: function (channelID)
	{
		g_chObj.setBrdcastChgChannel(channelID);
	},

	_osdChannelFormatStartEndTime: function (startUtcTime, durationUtcTime) {

		// Display Current Broadcast UTC time
		var timeInfo = utilConvertUtcToLocalTime(startUtcTime);
		var hh_s   = utilGetHours(timeInfo);
		var mm_s   = utilGetMinutes(timeInfo);

		timeInfo = utilConvertUtcToLocalTime(startUtcTime+durationUtcTime);
		var hh_e   = utilGetHours(timeInfo);
		var mm_e   = utilGetMinutes(timeInfo);

		var res = sprintf("%02d:%02d - %02d:%02d", hh_s, mm_s, hh_e, mm_e);

		return res;
	},

	_osdChannelEventTimeProgressShow: function ( isShow ) {

		//var div1=document.getElementById("osd_channel_time_progress");
		if (isShow){
			if ($('#osd_channel_time_progress').css('display')=='none') {
				$('#osd_channel_time_progress').css('display','block');
			}
		} else{
			if ($('#osd_channel_time_progress').css('display')=='block') {
				$('#osd_channel_time_progress').css('display','none');
			}
		}
	},

	_osdChannelEventTimeProgressUpdate: function (startTime, durationTime) {
    	var self = this;
		var currentUtcTime = g_chObj.getBroadcastUtcTime();
		var startUtcTime     = startTime;
		var durationUtcTime  = durationTime;

		var percent = 0;
		if (startUtcTime > currentUtcTime) {
			percent = 0;
		} else {
			var loadedTime = currentUtcTime - startUtcTime;
			var total      = durationUtcTime;
			percent = Math.round((loadedTime / total) * 100);
		}
		self._osdChannelEventTimeProgressShow(true);
		$('#osd_event_time_progress').attr("value", percent);
		//setProgressBarPercent("osd_event_time_progress", percent);
	},

	_osdChannelClose: function () {
		var self = this;
		//var dlg = this.element;
		if (g_isChannelZapperShowing) {
			//self._channelZapperSetChannel(g_middChannelID);
			self._change_channel_by_channle_info(g_selectChannelInfo);
			self._osdChannelShow(true, g_selectChannelInfo);
			return;
		}

		//window.location = "../index.html"; /* Go to root page */

		//dlg.hide(0);
		$('#osd_channel').removeClass("channel_zapper_container");
		self.close();
		if (self.options.indexFlag == "index"){
			self._sendPageSubStatus("HTML5_UI_PAGE_SYS_INDEX", "");
		} else {
			window.location = "../index.html"; /* Go to root page */
		}

	},

	_osdChannelStartTimeout: function (delay) {
		var self = this;
		if (g_osdChannelTimeout) {
			self._osdChannelStopTimeout();
		}
		//g_osdChannelTimeout = setTimeout(self._osdChannelClose, delay);
		g_osdChannelTimeout = setTimeout(function() {self._osdChannelClose()}, delay);
	},

	_osdChannelStopTimeout: function () {
		if (g_osdChannelTimeout) {
			clearTimeout(g_osdChannelTimeout);
			g_osdChannelTimeout = null;
		}
	},

	_channelZapperHasChannel: function() {
		var self = this;
		if (!g_chObj) {
			g_chObj = new MtvObj();
		}
		var channelCount = self._channelZappersGetChannelCount();
		if (channelCount > 0) {
			return true;
		}
		return false;
	},

	_channelZappersGetCurrentChannelInfo: function () {
		return g_chObj.getCurrentChannelInfo();
	},

	_channelZappersGetChannelCount: function () {

		var self = this;
		var channel_count = 0;
		var svl_id, ch_id, mask, mask_value, mask_filter, mask_filter_value;

		if (!g_chObj) {
			g_chObj = new MtvObj();
		}

		var g_current_ch_list_type = g_chObj.getChannelListType();

		switch (g_current_ch_list_type){
			case CUST_CH_LIST_TYPE_FAVORITE:
				mask       = MaskList.Mask_favorite;
				mask_value = MaskValueList.MaskValue_favorite;
				break;
			case CUST_CH_LIST_TYPE_ALL:
				mask       = MaskList.Mask_all;
				mask_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_LIST_TYPE_RADIO:
				mask       = MaskList.Mask_radio;
				mask_value = MaskValueList.MaskValue_radio;
				break;
			case CUST_CH_LIST_TYPE_NEW:
				mask       = MaskList.Mask_new;
				mask_value = MaskValueList.MaskValue_new;
				break;
			case CUST_CH_LIST_TYPE_TV:
				mask       = MaskList.Mask_tv;
				mask_value = MaskValueList.MaskValue_tv;
				break;
			default:
				mask       = MaskList.Mask_all;
				mask_value = MaskValueList.MaskValue_all;
				break;
		}

		switch(g_current_ch_filter_type){
			case CUST_CH_FILTER_TYPE_ALL:
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_FILTER_TYPE_DIGITAL:
				mask_filter = MaskList.Mask_digital;
				mask_filter_value = MaskValueList.MaskValue_digital;
				break;
			case CUST_CH_FILTER_TYPE_RADIO:
				mask_filter = MaskList.Mask_radio;
				mask_filter_value = MaskValueList.MaskValue_radio;
				break;
			case CUST_CH_FILTER_TYPE_ANALOG:
				mask_filter = MaskList.Mask_analog;
				mask_filter_value = MaskValueList.MaskValue_analog;
				break;
			case CUST_CH_FILTER_TYPE_NEW:
				mask_filter = MaskList.Mask_new;
				mask_filter_value = MaskValueList.MaskValue_new;
				break;
			case CUST_CH_FILTER_TYPE_FREE_SCRAMBLE:
				/* free + scrambled is same as all */
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_FILTER_TYPE_FREE_ONLY:
				mask_filter = MaskList.Mask_free;
				mask_filter_value = MaskValueList.MaskValue_free;
				break;
			case CUST_CH_FILTER_TYPE_SCRAMBLE:
				mask_filter = MaskList.Mask_scrambled;
				mask_filter_value = MaskValueList.MaskValue_scrambled;
				break;
			default:
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
		}
		var currentChannelInfo = self._channelZappersGetCurrentChannelInfo();
		g_current_svl_id = currentChannelInfo.SVL_ID;
		var channel_count = g_chObj.getChannelCountEx(g_current_svl_id, mask | mask_filter, mask_value | mask_filter_value);
		return channel_count;
	},

	_channelZappersGetPrevNextChannelInfo: function (isPrev, channelId) {

		var chItem = null;

		var svl_id, ch_id, mask, mask_value, mask_filter, mask_filter_value, dir, num;

		svl_id = g_current_svl_id;
		ch_id  = channelId;
		num    = 1; // Only get one channel info

		if (isPrev == 1)
		{
			dir = "PRE";
		}
		else
		{
			dir = "NEXT";
		}

		var current_ch_list_type = g_chObj.getChannelListType();

		switch (g_current_ch_list_type){
			case CUST_CH_LIST_TYPE_FAVORITE:
				mask       = MaskList.Mask_favorite;
				mask_value = MaskValueList.MaskValue_favorite;
				break;
			case CUST_CH_LIST_TYPE_ALL:
				mask       = MaskList.Mask_all;
				mask_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_LIST_TYPE_RADIO:
				mask       = MaskList.Mask_radio;
				mask_value = MaskValueList.MaskValue_radio;
				break;
			case CUST_CH_LIST_TYPE_NEW:
				mask       = MaskList.Mask_new;
				mask_value = MaskValueList.MaskValue_new;
				break;
			case CUST_CH_LIST_TYPE_TV:
				mask       = MaskList.Mask_tv;
				mask_value = MaskValueList.MaskValue_tv;
				break;
			default:
				mask       = MaskList.Mask_all;
				mask_value = MaskValueList.MaskValue_all;
				break;
		}

		switch(g_current_ch_filter_type){
			case CUST_CH_FILTER_TYPE_ALL:
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_FILTER_TYPE_DIGITAL:
				mask_filter = MaskList.Mask_digital;
				mask_filter_value = MaskValueList.MaskValue_digital;
				break;
			case CUST_CH_FILTER_TYPE_RADIO:
				mask_filter = MaskList.Mask_radio;
				mask_filter_value = MaskValueList.MaskValue_radio;
				break;
			case CUST_CH_FILTER_TYPE_ANALOG:
				mask_filter = MaskList.Mask_analog;
				mask_filter_value = MaskValueList.MaskValue_analog;
				break;
			case CUST_CH_FILTER_TYPE_NEW:
				mask_filter = MaskList.Mask_new;
				mask_filter_value = MaskValueList.MaskValue_new;
				break;
			case CUST_CH_FILTER_TYPE_FREE_SCRAMBLE:
				/* free + scrambled is same as all */
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
			case CUST_CH_FILTER_TYPE_FREE_ONLY:
				mask_filter = MaskList.Mask_free;
				mask_filter_value = MaskValueList.MaskValue_free;
				break;
			case CUST_CH_FILTER_TYPE_SCRAMBLE:
				mask_filter = MaskList.Mask_scrambled;
				mask_filter_value = MaskValueList.MaskValue_scrambled;
				break;
			default:
				mask_filter = MaskList.Mask_all;
				mask_filter_value = MaskValueList.MaskValue_all;
				break;
		}

		if (g_current_ch_list_type == CUST_CH_LIST_TYPE_FAVORITE)
		{
			var channellist = mtvuiChannel.getChannelList({"SVL_ID":svl_id,"DIRECTION":dir,"CHANNEL_ID":ch_id,"NUM":"1","ENABLE_CYCLE":"true","CH_LIST_TYPE":"FAV"});
			if (channellist) {
				chItem = channellist[0];
			}
		}
		else
		{
			var nw_mask = mask | mask_filter;
			var nw_mask_value = mask_value | mask_filter_value;
			var channellist = mtvuiChannel.getChannelList({"SVL_ID":svl_id,"DIRECTION":dir,"CHANNEL_ID":ch_id,"NUM":"1", "NW_MASK": nw_mask, "MASK_VALUE":nw_mask_value,"ENABLE_CYCLE":"true"});
			if (channellist) {
				chItem = channellist[0];
			}
		}
		return chItem;
	},

	_gotoSysPage: function (pageId, args) {
			$("#osd_channel").hide(0, function () {
			mtvuiUtil.gotoSysPage(pageId, args);
		});
	},

	_channelZapperHandleKey: function(kc) {
		var self = this;
		key = kc.keyCode || kc.which;
		switch (key) {
			case KeyEvent.DOM_VK_DOWN:
			break;
			case KeyEvent.DOM_VK_UP:
			break;
			case KeyEvent.DOM_VK_CH_DECREASE:
			case KeyEvent.DOM_VK_LEFT:
				if (!self._channelZapperIsShowing()) {
					self._osdChannelShow(false);
					self._channelZapperShow(true);
				}
				self._channelZapperScroll(1);
			break;
			case KeyEvent.DOM_VK_CH_INCREASE:
			case KeyEvent.DOM_VK_RIGHT:
				if (!self._channelZapperIsShowing()) {
					self._osdChannelShow(false);
					self._channelZapperShow(true);
				}
				self._channelZapperScroll(0);
			break;
			case KeyEvent.DOM_VK_ENTER:
			case KeyEvent.DOM_VK_RETURN:
				if (self._channelZapperIsShowing()) {
					//self._channelZapperSetChannel(g_middChannelID);
					self._change_channel_by_channle_info(g_selectChannelInfo);
					self._osdChannelShow(true, g_selectChannelInfo);
				}
				else{
					self._osdChannelShow(false);
					if (self.options.indexFlag == "index"){
						self._sendPageSubStatus("HTML5_UI_PAGE_SYS_INDEX", "");
					} else {
						window.location = "../index.html"; /* Go to root page */
					}
				}
			break;
			case KeyEvent.DOM_VK_BACK:
				 self.close();
				 if (self.options.indexFlag == "index"){
						self._sendPageSubStatus("HTML5_UI_PAGE_SYS_INDEX", "");
					} else {
						window.location = "../index.html"; /* Go to root page */
					}

			break;
			case KeyEvent.DOM_VK_CHANNEL_OSD:
				 self._osdChannelShow(false); /*to process joystick p+/p- when osd is showing*/
				 self._osdChannelShow(true);
			break;
		}
		console.log("key:"+key);
		var sys_item = get_sys_page_by_key(key);
		if (sys_item) {
			if (sys_item.id != "sys_channel_zapper") {
				console.log("sys_item id:"+sys_item.id);
				if (sys_item.id == "sys_index"){
					self._sendPageSubStatus("HTML5_UI_PAGE_SYS_INDEX", "");
					self.close();
				}
				else
					self._gotoSysPage(sys_item.id);
			}
			return;
		}
	},
	/*for don't skip keyevent, send pageSubStatus to html5 agent, the osd hide by html5_agent control*/
	_sendPageSubStatus: function (pageId, pageSubStatus) {
		try {
			var tvJspObj = getTvJspService();
			if (tvJspObj && tvJspObj.utility) {
				tvJspObj.utility.notifyHtmlUIStatus('{"PageID":"' + pageId + '", "Status":"Show", "PageSubStatus":"' + pageSubStatus + '"}');
			} else {
				window.location = "./index.html"; /* Go to root page */
			}
		}catch(err) {
			window.location = "./index.html"; /* Go to root page */
			console.log(err);
		}
	},
	/*for remove New icon when user has been see this channel*/
	_store_channel_mask_to_acfg: function () {
		g_chObj.storeChannelList('');
	},

	_reset_channel_mask_info: function (svl_id, ch_id, ch_mask){
		var self = this;
		g_chObj.setChannelInfo(svl_id, ch_id, ch_mask);
		/* store to acfg */
		self._store_channel_mask_to_acfg();
	},

		//change channel of dvbc-->dvbt or dvbt-->dvbc
	 _change_channel_from_dvbt_to_dvbc: function(src_ch, target_ch){
		//one channel list case
		var self = this;
		if (parseInt(g_chObj.getOclStatus())){

			/*[on ch list internal] the following steps is the channel change in one channel list case:*/
			/*step1: set ocl toggle type on*/

			/*step2: set the correct bs type according to the channel info*/

			/*step3: channel chanage by change id*/

			/*step4: set the bs type to cab*/

			/*step5: set ocl toggle type off*/


			/*[not on ch list case internal] channel change*/

			/*step3: channel chanage by change id*/
			//step 1: set one channel lsit toggle type on
			g_chObj.setOclToggleType(1); //OCL_TOGGLE_TYPE_ON
			//step 2:set bs type according to the channel info
			switch (parseInt(target_ch.SVL_ID)){
				case BRDCST_DVBT:
				case CAM_DVBT:
					g_chObj.setDtvTunerBsSrc(0);//BS_TYPE_AIR
					break;
				case BRDCST_DVBC:
				case CAM_DVBC:
					g_chObj.setDtvTunerBsSrc(1);//BS_TYPE_CAB
					break;
				default:
					g_chObj.setDtvTunerBsSrc(0); //BS_TYPE_AIR
					break;
			}
			/* step3: channel change by channel id */
			self._channelZapperSetChannel(target_ch.CHANNEL_ID);
			/* step4: set the bs type to cab due to current is one channel list */
			//mtvObj.setDtvTunerBsSrc(BS_TYPE_CAB);
			/* step5: set ocl toggle type off */
			g_chObj.setOclToggleType(0);//OCL_TOGGLE_TYPE_OFF
		}
		else{
			self._channelZapperSetChannel(target_ch.CHANNEL_ID);
		}
	},
	 _change_channel_by_channle_info: function(channel_info){
		var self = this;
		var ch = g_chObj.getCurrentChannelInfoEx();

		/* case 1: current channel svl_id is different of target svl_id */
		if (ch.SVL_ID != channel_info.SVL_ID){
			self._change_channel_from_dvbt_to_dvbc(ch, channel_info);
			g_chObj.acfgSetConfigValue("g_misc__update_dt_sync_mode", 0);
		}
		/* default */
		else{
			self._channelZapperSetChannel(channel_info.CHANNEL_ID);
		}
	},
});
