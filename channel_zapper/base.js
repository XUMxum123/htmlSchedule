
var g_current_ch_list_type;
var g_current_ch_filter_type;

var g_chObj = null;
var g_current_svl_id = 0;
var g_isChannelZapperShowing = true;
var g_osdChannelTimeout = null;
var g_channel_count = 0;

var g_leftChannelID = 0;
var g_middChannelID = 0;
var g_righChannelID = 0;

function channelZapperIsShowing() {
    return g_isChannelZapperShowing;
}

function channelZapperGetChannelLogo(iconIdx) {
    var icon = mtvuiUtil.getChannelLogoSrc(iconIdx);
    if (icon == null) {
        icon = "../Assets/_Icons/EPG_Icons/iconChannel_BG.png";
    }
    return icon;
}

function channelZapperShow( isShow ) {

    //var div1=document.getElementById("zapper_channel");
    
    if (isShow)
    {
        g_isChannelZapperShowing = true;
        
        if ($('#zapper_channel').css('display') == 'none') {
			$('#zapper_channel').css('display','block');
        }
		//sendPageSubStatus("ch_list");
    }
    else {
        if ($('#zapper_channel').css('display')=='block') {
            $('#zapper_channel').css('display','none');
        }
    }
} 

function osdChannelShow( isShow ) {
    
    //var div1=document.getElementById("osd_channel");
   
     
    if (isShow)
    {
        g_isChannelZapperShowing = false;        
        channelZapperShow(false);
        if(osdChannelInit())
        {
        	if ($('#osd_channel').css('display') == 'none') {
				$('#osd_channel').css('display','block');
			}
			//sendPageSubStatus("ch_num");
			channelZapperInit();
			
	       osdChannelStartTimeout(2000);
        }
        else
        {
        	osdChannelClose();		
        }       
        
    }
    else {
        if ($('#osd_channel').css('display')=='block') {
            $('#osd_channel').css('display','none');
        }  
        osdChannelStopTimeout();
    }
} 

var g_prevChannelInfo;
var g_nextChannelInfo;
var g_middleChannelInfo;
var g_leftChannelLogo;
var g_middleChannelLogo;
var g_rightChannelLogo;
function channelZapperInit() {
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
    var currentChannelInfo = channelZappersGetCurrentChannelInfo();
    g_middleChannelInfo = currentChannelInfo;
    g_current_svl_id = currentChannelInfo.SVL_ID;
    	        
    // Prev Channel
    var prevChannelInfo = channelZappersGetPrevNextChannelInfo(1, currentChannelInfo.CHANNEL_ID);
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
		
    channel_logo = channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
    g_leftChannelLogo = channel_logo;
    //document.getElementById('logo_left').src               = channel_logo;
    //document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
	$('#logo_left').attr("src", channel_logo);
	channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
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
    channel_logo = channelZapperGetChannelLogo(currentChannelInfo.CH_LOGO_ID);
    g_middleChannelLogo = channel_logo;
    //document.getElementById('logo_middle').src               = channel_logo;
    //document.getElementById('channel_center_name').innerHTML = currentChannelInfo.MAJOR_NUM + ' ' + currentChannelInfo.SERVICE_NAME;
	$('#logo_middle').attr("src", channel_logo);
	channel_center_name.innerHTML = currentChannelInfo.MAJOR_NUM + ' ' + currentChannelInfo.SERVICE_NAME;
    g_middChannelID = currentChannelInfo.CHANNEL_ID;
     
    // Next Channel
    var nextChannelInfo = channelZappersGetPrevNextChannelInfo(0, currentChannelInfo.CHANNEL_ID);
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
    channel_logo = channelZapperGetChannelLogo(nextChannelInfo.CH_LOGO_ID);
    g_rightChannelLogo = channel_logo;
	$('#logo_right').attr("src", channel_logo);
	channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
    //document.getElementById('logo_right').src               = channel_logo;
    //document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
    g_righChannelID = nextChannelInfo.CHANNEL_ID;
    osdChannelStartTimeout(6000);
}


function channelZapperScroll(is_left) {

    var channel_logo;
    var ch_mask;		
	var is_favorite;
	var is_scrambled;
	var is_new;  
	var is_lock;

    if (is_left == 0)
    {	 
        // Prev Channel
        //var prevChannelInfo = channelZappersGetPrevNextChannelInfo(0, g_leftChannelID);
        var prevChannelInfo = g_middleChannelInfo;
        if (prevChannelInfo) {
            //channel_logo = channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
            channel_logo = g_middleChannelLogo;
            //document.getElementById('logo_left').src               = channel_logo;
            //document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
			$('#logo_left').attr("src", channel_logo);
			channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
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
			channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
            g_middChannelID = middChannelInfo.CHANNEL_ID;
            g_middleChannelInfo = middChannelInfo;
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
        var nextChannelInfo = channelZappersGetPrevNextChannelInfo(0, g_righChannelID);
        if (nextChannelInfo) {
            channel_logo = channelZapperGetChannelLogo(nextChannelInfo.CH_LOGO_ID);
            //document.getElementById('logo_right').src               = channel_logo;
            //document.getElementById('channel_right_name').innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
			$('#logo_right').attr("src", channel_logo);
			channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
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
        var prevChannelInfo = channelZappersGetPrevNextChannelInfo(1, g_leftChannelID);
        if (prevChannelInfo) {
            channel_logo_left = channelZapperGetChannelLogo(prevChannelInfo.CH_LOGO_ID);
            //document.getElementById('logo_left').src               = channel_logo_left;
            //document.getElementById('channel_left_name').innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
			$('#logo_left').attr("src", channel_logo_left);
			channel_left_name.innerHTML = prevChannelInfo.MAJOR_NUM + ' ' + prevChannelInfo.SERVICE_NAME;
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
			channel_center_name.innerHTML = middChannelInfo.MAJOR_NUM + ' ' + middChannelInfo.SERVICE_NAME;
            g_middChannelID = middChannelInfo.CHANNEL_ID;
			channel_info_mid = middChannelInfo;
            
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
			channel_right_name.innerHTML = nextChannelInfo.MAJOR_NUM + ' ' + nextChannelInfo.SERVICE_NAME;
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
   osdChannelStartTimeout(1500);
}

function channelZapperSetChannel(channelID) 
{
    g_chObj.setBrdcastChgChannel(channelID);
} 

function osdChannelInit() {
    var event_startEndTime ='';
    var event_name ='';
    var event_desc =''; 
    createProgressBar("osd_event_time_progress", null, null, null, null, null);
	
    if (!g_chObj) {
        g_chObj = new MtvObj();
    }
	
    utilInit(g_chObj);
    g_current_ch_list_type = g_chObj.getChannelListType();
	g_current_ch_filter_type = g_chObj.getChannelFilterType(); 
    var current_ch_info = channelZappersGetCurrentChannelInfo();    
    
    var ch_mask = parseInt(current_ch_info.NW_MASK);		
	var is_favorite  = (MaskList.Mask_favorite & ch_mask) == MaskList.Mask_favorite;
	var is_scrambled = (MaskList.Mask_scrambled & ch_mask) == MaskList.Mask_scrambled;
	var is_new		 = (MaskList.Mask_new & ch_mask) == MaskList.Mask_new; 
	var is_lock		 = (MaskList.Mask_lock & ch_mask) == MaskList.Mask_lock;	
		 
    g_current_svl_id = current_ch_info.SVL_ID;
    if (channelZappersGetChannelCount() == 0) {
		console.log("channel count is zero");
	    return false;
    }	
	if(g_chObj.isCiPlusHostTune()){
		console.log("isCiPlusHostTune is true");
		return false;
	}
		
	/* show scramble icon*/
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
    var current_channel_logo = channelZapperGetChannelLogo(current_ch_info.CH_LOGO_ID);    
    //document.getElementById('channel_logo').src = current_channel_logo;
	$('#channel_logo').attr("src", current_channel_logo);
    osd_channel_name.innerHTML = current_ch_info.MAJOR_NUM + ' ' + current_ch_info.SERVICE_NAME;   
  
    var eventItem = g_chObj.getEpgNowEvent(current_ch_info.CHANNEL_ID);   

    /* Now Event Info */
    if (eventItem ) 
    {   
        startUtcTime    = parseInt(eventItem.START_TIME);       
        durationUtcTime = parseInt(eventItem.DURATION);
        if (!isNaN(startUtcTime))
        {
            event_startEndTime = osdChannelFormatStartEndTime(startUtcTime, durationUtcTime);   
            event_name         = eventItem.EVENT_NAME;
            event_desc         = eventItem.DETAILS;
            
            osdChannelEventTimeProgressShow(true);
            osdChannelEventTimeProgressUpdate(startUtcTime, durationUtcTime);        
        }
    }
    
    osd_channel_program.innerHTML = event_name;
    osd_channel_time.innerHTML    = event_startEndTime;
    
	/* remove NEW channel flag after change channel. */
	if (is_new){
		ch_mask = (current_ch_info.NW_MASK & (~SB_VENT_NEW_SERVICE));
		reset_channel_mask_info(current_ch_info.SVL_ID, current_ch_info.CHANNEL_ID, ch_mask);
	}
	return true;
}

function osdChannelFormatStartEndTime(startUtcTime, durationUtcTime) {

    // Display Current Broadcast UTC time
    var timeInfo = utilConvertUtcToLocalTime(startUtcTime);
    var hh_s   = utilGetHours(timeInfo);
    var mm_s   = utilGetMinutes(timeInfo);
    
    timeInfo = utilConvertUtcToLocalTime(startUtcTime+durationUtcTime);
    var hh_e   = utilGetHours(timeInfo);
    var mm_e   = utilGetMinutes(timeInfo);
    
    var res = sprintf("%02d:%02d - %02d:%02d", hh_s, mm_s, hh_e, mm_e);
    
    return res;
}

function osdChannelEventTimeProgressShow( isShow ) {

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
}

function osdChannelEventTimeProgressUpdate(startTime, durationTime) {
    
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
    //var timeProgress = document.getElementById('osd_event_time_progress');
    //timeProgress.value = percent;
	//$('#osd_event_time_progress').attr("value", percent);
	setProgressBarPercent("osd_event_time_progress", percent);
}

function osdChannelClose() {
    if (g_isChannelZapperShowing) {				
		channelZapperSetChannel(g_middChannelID);
		osdChannelShow(true);
        return;
    }
    
    window.location = "../index.html"; /* Go to root page */
}

function osdChannelStartTimeout(delay) {
    if (g_osdChannelTimeout) {
        osdChannelStopTimeout();
    }
    g_osdChannelTimeout = setTimeout(osdChannelClose, delay);
}

function osdChannelStopTimeout() {
    if (g_osdChannelTimeout) {
        clearTimeout(g_osdChannelTimeout); 
        g_osdChannelTimeout = null;
    }
}


var g_hotkey_pressed_cnt = 0;
var g_hotkey_timer = null;
var g_hotkey_code;

function channelZapperHotkey() {

    if (g_hotkey_pressed_cnt >= 2) {
        console.log("g_hotkey_pressed_cnt:", g_hotkey_pressed_cnt);
        channelZapperHotkeyStopTimeout();
		channelZapperInit();
        g_hotkey_pressed_cnt = 0;
    }
    else {

        console.log("g_hotkey_code:", g_hotkey_code);

        
        var isNext = 0;
        if (g_hotkey_code == KeyEvent.DOM_VK_CH_INCREASE) {            
            isNext = 0; // Next Channel
        }
        else if (g_hotkey_code == KeyEvent.DOM_VK_CH_DECREASE) {           
            isNext = 1; // Prev Channel
        }
        else {
            g_hotkey_pressed_cnt = 0;
            return;
        }
       
        console.log("g_hotkey_pressed_cnt:", g_hotkey_pressed_cnt);

        g_hotkey_pressed_cnt = 0;
    }
}

function channelZapperHotkeyHandler(hotkey) {

    if (channelZapperHasChannel() == 0) {
        return;
    }

    g_hotkey_code = hotkey;

    if (hotkey == KeyEvent.DOM_VK_BACK) {
        g_hotkey_pressed_cnt = 0;
        channelZapperHotkeyStopTimeout();
		osdChannelShow(true);
        return;
    }
    
    if ( (hotkey != KeyEvent.DOM_VK_CH_INCREASE) && (hotkey != KeyEvent.DOM_VK_CH_DECREASE) ) {
        g_hotkey_pressed_cnt = 0;
        channelZapperHotkeyStopTimeout();
        return;
    }

    if (g_hotkey_pressed_cnt == 0) {
        g_hotkey_timer = setTimeout(channelZapperHotkey, 1000 );
    }

    g_hotkey_pressed_cnt++;

}

function channelZapperHotkeyStopTimeout() {
    if (g_hotkey_timer) {
        clearTimeout(g_hotkey_timer); 
        g_hotkey_timer = null;
    }
}


function channelZapperHasChannel() {
    
   // return true;
    if (!g_chObj) {
        g_chObj = new MtvObj();
    }
    
    var channelCount = channelZappersGetChannelCount();
    if (channelCount > 0) {
        return true;
    }
    
    return false;
}

function channelZappersGetCurrentChannelInfo() {

    var chItem = g_chObj.getCurrentChannelInfo();
    
    return chItem;
}

function channelZappersGetChannelCount() {
    
    var channel_count = 0;
    var svl_id, ch_id, mask, mask_value, mask_filter, mask_filter_value;
    
    if (!g_chObj) {
        g_chObj = new MtvObj();
    }
    
    //var current_ch_list_type = g_chObj.getChannelListType();

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
    var currentChannelInfo = channelZappersGetCurrentChannelInfo();
    g_current_svl_id = currentChannelInfo.SVL_ID;
    
    var channel_count = g_chObj.getChannelCountEx(g_current_svl_id, mask | mask_filter, mask_value | mask_filter_value);
        
    return channel_count;
}

function channelZappersGetPrevNextChannelInfo(isPrev, channelId) {
    
    var chItem = null;
    
    var svl_id, ch_id, mask, mask_value, mask_filter, mask_filter_value, dir, num;

    svl_id = g_current_svl_id;
    ch_id  = channelId;
    num    = 1; // Only get one channel info
    
    if (isPrev == 1) 
    {
        dir = DirectionList.Direction_pre;        
    }
    else 
    {
        dir = DirectionList.Direction_next;
    }
    
    //var current_ch_list_type = g_chObj.getChannelListType();
            
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
        var channellist = g_chObj.getNextFavChannelInfoByChannelId(svl_id, ch_id, dir);
        if (channellist) {
            chItem = channellist;
        }        
    }
    else
    {
        var channellist = g_chObj.getChannelListEx(svl_id, ch_id, mask | mask_filter, mask_value | mask_filter_value, dir, num);
       
        if (channellist) {
            chItem = channellist[0];
        }
    }
        
    return chItem;
}

var gotoSysPage = function (pageId, args) {
        $("#osd_channel").hide(0, function () {
        mtvuiUtil.gotoSysPage(pageId, args);
    });
};

//var temp_channelID = null;
function channelZapperHandleKey(kc) {
	key = kc.keyCode || kc.which;
	
	switch (key) {
        case KeyEvent.DOM_VK_DOWN:
        break;
        case KeyEvent.DOM_VK_UP:
        break;
        case KeyEvent.DOM_VK_CH_DECREASE:			
        case KeyEvent.DOM_VK_LEFT:
        if (!channelZapperIsShowing()) {                         
            osdChannelShow(false);
            channelZapperShow(true);
        }
            channelZapperScroll(1);
        break;
        case KeyEvent.DOM_VK_CH_INCREASE:
        case KeyEvent.DOM_VK_RIGHT:
            if (!channelZapperIsShowing()) {
                osdChannelShow(false);
                channelZapperShow(true);
            }
            channelZapperScroll(0);
		break;
        case KeyEvent.DOM_VK_ENTER:
        case KeyEvent.DOM_VK_RETURN:
            if (channelZapperIsShowing()) {		
				channelZapperSetChannel(g_middChannelID);  			
                osdChannelShow(true);
            }
            else{
                osdChannelShow(false);
                window.location = "../index.html"; /* Go to root page */						
            }
        break;         
        case KeyEvent.DOM_VK_BACK:
			 window.location = "../index.html"; /* Go to root page */
        break; 
		case KeyEvent.DOM_VK_CHANNEL_OSD:
			 osdChannelShow(false); /*to process joystick p+/p- when osd is showing*/
			 osdChannelShow(true);
		break;
    } 

    var sys_item = get_sys_page_by_key(key);
    if (sys_item) {
        if (sys_item.id != "sys_channel_zapper") {
            //window.location = sys_item.url;
			gotoSysPage(sys_item.id);
		}
        return;
    }                          
};
/*for don't skip keyevent, send pageSubStatus to html5 agent, the osd hide by html5_agent control*/
function sendPageSubStatus(pageSubStatus) {
	try {
    var tvJspObj = getTvJspService();
                
    if (tvJspObj && tvJspObj.utility) {
			tvJspObj.utility.notifyHtmlUIStatus('{"PageID":"HTML5_UI_PAGE_CHANNEL_ZAPPER", "Status":"Show", "PageSubStatus":"' + pageSubStatus + '"}');
		}
	}catch(err) {console.log(err);}
};
/*for remove New icon when user has been see this channel*/
function store_channel_mask_to_acfg() {
    g_chObj.storeChannelList('');
};

function reset_channel_mask_info(svl_id, ch_id, ch_mask){
    g_chObj.setChannelInfo(svl_id, ch_id, ch_mask);
    /* store to acfg */
    store_channel_mask_to_acfg();
};

