
var obj_tv = getTvJspService();
var obj_tvServices = obj_tv.tvServices;
var mtvObjRaw = new MtvObjRaw();
var mtvObj = new MtvObj();
var focus_id = 0;
var time_focus_id = 0;
var schedule_date = 0;
var date_end = 0;
var schedule_date_local = 0;
var date_end_local = 0;
var recording_info = {};
var recording_modify_page_show = 0;
var num_input_status = 0;
var monthArray=new Array
   ("January","February","March","April","May","June","July","August",
   "September","October","November","December");
var weekArray =new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
REMINDER_CONFLICT_TYPE_NO_CONFLICT = 0;
REMINDER_CONFLICT_TYPE_START_TIME_CONFLICT = 1;
REMINDER_CONFLICT_TYPE_END_TIME_CONFLICT = 2;
REMINDER_CONFLICT_TYPE_FULL_CONTAIN_ANOTHER_ONE = 3;
REMINDER_CONFLICT_TYPE_BE_FULL_CONTAINED_BY_ANOTHER_ONE = 4 ; 
function getMothString(idx) {
	if (!getMothString.prototype.monthArray) {
		var list = ["MONTH_JAN","MONTH_FEB","MONTH_MAR","MONTH_APR","MONTH_MAY","MONTH_JUN","MONTH_JUL","MONTH_AUG",
		   "MONTH_SEP","MONTH_OCT","MONTH_NOV","MONTH_DEC"];
		getMothString.prototype.monthArray = [];
		for (i in list)  {
			getMothString.prototype.monthArray[i] = mtvObjRaw.getLangString(list[i]);
		}
	}
	return getMothString.prototype.monthArray[idx]
}; 
function time_cal_update(id,num){
	console.log('time_cal_update id =' + id);
	console.log('time_cal_update schedule_date =' + schedule_date );
	console.log('time_cal_update date_end =' + date_end);
	switch(time_focus_id){
		case "manual_time_date": schedule_date = DateAdd("d",num,schedule_date);date_end = DateAdd("d",num,date_end);$('#manual_time_date').html(schedule_date.getDate());break;
		case "manual_time_mon": schedule_date = DateAdd("m",num,schedule_date);date_end = DateAdd("m",num,date_end);var month = schedule_date.getMonth() + 1;	$('#manual_time_mon').html(month); break;
		case "manual_time_hour": schedule_date = DateAdd("h",num,schedule_date);$('#manual_time_hour').html(schedule_date.getHours()); break;
		case "manual_time_min": schedule_date = DateAdd("n",num,schedule_date); $('#manual_time_min').html(schedule_date.getMinutes());break;
		case "manual_time_hour_end":date_end = DateAdd("h",num,date_end); $('#manual_time_hour_end').html(date_end.getHours());break;
		case "manual_time_min_end": date_end = DateAdd("n",num,date_end); $('#manual_time_min_end').html(date_end.getMinutes());break;
		default:break;
	}
	$('#manual_time_week').html(weekArray[schedule_date.getDay()]);
}
function adjust_time_cal_update(id,num){
	console.log('time_cal_update id =' + id);
	console.log('time_cal_update schedule_date =' + schedule_date );
	console.log('time_cal_update date_end =' + date_end);
	switch(time_focus_id){
	  case "adjust_time_hour": schedule_date = DateAdd("h",num,schedule_date);schedule_date_local = DateAdd("h",num,schedule_date_local);$('#adjust_time_hour').html(schedule_date_local.pattern("HH")); break;
	  case "adjust_time_min": schedule_date = DateAdd("n",num,schedule_date);schedule_date_local = DateAdd("n",num,schedule_date_local);$('#adjust_time_min').html(schedule_date_local.pattern("mm"));$('#adjust_time_hour').html(schedule_date_local.pattern("HH"));break;
	  case "adjust_time_hour_end":date_end = DateAdd("h",num,date_end);date_end_local = DateAdd("h",num,date_end_local); $('#adjust_time_hour_end').html(date_end_local.pattern("HH"));break;
	  case "adjust_time_min_end": date_end = DateAdd("n",num,date_end); date_end_local = DateAdd("n",num,date_end_local);$('#adjust_time_min_end').html(date_end_local.pattern("mm"));$('#adjust_time_hour_end').html(date_end_local.pattern("HH"));break;
	  default:break;
	}
	check_conflict();
}
function time_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	time_focus_id= id;
	$('#adjust_time_arrow').show();
	 $('#focus_id').focus();
	var pos = $('#'+id).offset();
	//var hl_bar_pos = $('#'+id).offset();

	pos.top=$("#adjust_time_arrow").offset().top;
	//hl_bar_pos.top=$('#'+focus_id).offset().top;
	//$("#manual_time_arrow").offset({left:pos.left});
	//$("#manual_time_hl_bar").offset({top:hl_bar_pos.top,left:hl_bar_pos.left});
	//pos.left=pos.left -121;/*back ground picture is big*/
  move(document.getElementById("adjust_time_arrow"), pos, function(p) {return p;}, 500);
}
function adjust_time_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	time_focus_id= id;
	$('#adjust_time_arrow').show();
	$('#time_focus_id').focus();
	//var pos = $('#'+id).offset();
	//pos.top=$("#adjust_time_arrow").offset().top;
	var left = $('#'+id).css("left");
	$('#adjust_time_arrow').css("left",left);	
	//move(document.getElementById("adjust_time_arrow"), pos, function(p) {return p;}, 500);

}
function button_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	time_focus_id= "adjust_time_hour_end";
	if (isfocus) {
		 focus_id = id;
	   $($($('#'+id).find('.btn_left')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Left.png');
	   $($($('#'+id).find('.btn_center')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Center.png');
	   $($($('#'+id).find('.btn_right')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Right.png');
	} else {
	   $($($('#'+id).find('.btn_left')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Left.png');
	  $($($('#'+id).find('.btn_center')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Center.png');
	   $($($('#'+id).find('.btn_right')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Right.png');
	}
}
function set_button_focus(isfocus, id) {
	console.log('set_button_focus isfocus =' + isfocus + ' id =' + id);
		if (isfocus) {
		button_focus(false, focus_id);
		$('#'+id).focus();
	} else {
	   $($($('#'+id).find('.btn_left')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Left.png');
	  $($($('#'+id).find('.btn_center')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Center.png');
	   $($($('#'+id).find('.btn_right')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Right.png');
	}
}
Date.prototype.pattern=function(fmt) {           
    var o = {           
   // "M+" : this.getMonth()+1, //月份           
	"d+" : this.getDate(), //日           
	"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
	"H+" : this.getHours(), //小时           
	"m+" : this.getMinutes(), //分           
	"s+" : this.getSeconds(), //秒           
	"q+" : Math.floor((this.getMonth()+3)/3), //季度           
	"S" : this.getMilliseconds() //毫秒           
	};                      

  		
    for(var k in o){           
	        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        } 		
    } 
	if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+weekArray[this.getDay()+""]);           
	    } 
	if(/(M+)/.test(fmt)){           
	        fmt=fmt.replace(RegExp.$1, this.getMonth()+ 1);           
	    }    
    return fmt;           
}        
//adjust time 
function compare_time(startTime, endTime) {  
	  startTime = startTime.toString();
	  endTime = endTime.toString();
	 var d1 = startTime.replace(/\-/g, "\/");  
	 var d2 = endTime.replace(/\-/g, "\/");  
	  
	  if(startTime!=""&&endTime!=""&&d1 >=d2)  
	 {  
	 // alert("开始时间不能大于结束时间！");  
	  return false;  
	 }       
} 
//获得两个时间的差 
function GetDateDiff(startTime, endTime, diffType) {  
	 startTime = startTime.toString();
	 endTime = endTime.toString(); 
	startTime = startTime.replace(/\-/g, "/");             
	endTime = endTime.replace(/\-/g, "/");             
	diffType = diffType.toLowerCase(); var sTime = new Date(startTime);      
	var eTime = new Date(endTime); var divNum = 1; switch (diffType) 
	{ 
		case"second":                      
			divNum = 1000; break; 
		case"minute":                      
			divNum = 1000 * 60; break; 
		case"hour":                     
			divNum = 1000 * 3600; break; 
		case"day":                      
			divNum = 1000 * 3600 * 24; break; 
		case"year":                      
			divNum = 1000 * 3600 * 24 * 365; break; 
		default: break;             
	}  
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));         
} 
function DateAdd(interval,number,date_in){ // date 可以是时间对象也可以是字符串，如果是后者，形式必须为: yyyy-mm-dd hh:mm:ss 其中分隔符不定。"2006年12月29日 16点01分23秒" 也是合法的
    number = parseInt(number);
    var date = new Date(date_in) ;
    if (typeof(date)=="string"){
        date = date.split(/\D/);
        --date[1];
        eval("var date = new Date("+date.join(",")+")");
    }
    if (typeof(date)=="object"){
        var date = date
    }
    switch(interval){
        case "y": date.setFullYear(date.getFullYear()+number); break;
        case "m": date.setMonth(date.getMonth()+number); break;
        case "d": date.setDate(date.getDate()+number); break;
        case "w": date.setDate(date.getDate()+7*number); break;
        case "h": date.setHours(date.getHours()+number); break;
        case "n": date.setMinutes(date.getMinutes()+number); break;
        case "s": date.setSeconds(date.getSeconds()+number); break;
        case "l": date.setMilliseconds(date.getMilliseconds()+number); break;
    }
    console.log('date =' + date); 
    return date;
}
function recording_update_rmdr(){
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	var recording = parseInt(ret.ITEMS[0].is_recording);
	if(recording != 1){
		return;
	}
	var ret= compare_time(schedule_date_local,date_end_local);
	if(ret == false)
	{
		date_end_local = DateAdd("d",1,date_end_local);
	}
	if(date_end_local > schedule_date_local)
	{
		var duration= (date_end_local - schedule_date_local)/1000;
	}
	else
	{
		return;
	}
	if((duration %(24* 3600 )) == 0){
		stopPvr();
		return;
	}
	if(duration >= (24 * 3600)){
		/*max duration is 23 hour 59 minute.*/
		duration= 23 * 3600 + 59 * 60; 
	}
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	if (ret.ITEMS[0]) {
		var arg = ret;
		obj_tvServices.setPvrRecordInfo('{"PARAMETER":{"operation":"5",\
										"recording_status":"7",\
										"duration":"'+duration+'",\
										"REQUEST":"SET"}}');
	}
}
function recording_modify_time_update(){
	var mtvObj = new MtvObj();
	var time   = 0;
	var duration = 0;
	var progarm_name ;
	var prog_time_str ;
	var prog_start_time;
	var prog_end_time;
	var str = mtvObjRaw.getLangString("PVR_ADD_DUR");
	$($('#dialog_adjust_time').find('.dialog_title')).html(str);
	$($('#dialog_adjust_time').find('.Title_Icon')).attr("src", 'res/pvr/iconPVR_recorded_HL.png');
	var cur_ch = mtvObj.getCurrentChannelInfo();
	var icon = mtvuiUtil.getChannelLogoSrc(cur_ch.CH_LOGO_ID);
	var ch_num = cur_ch.MAJOR_NUM;
	var channel_name = cur_ch.SERVICE_NAME;
	$($('#dialog_adjust_time').find('.channel_name')).html(channel_name + " "+ ch_num); 
	if(icon){	
		$($('#dialog_adjust_time').find('.chennel_logo')).attr("src", icon);
		$($('#dialog_adjust_time').find('.chennel_logo')).show();
	} 
	else{	
		$($('#dialog_adjust_time').find('.chennel_logo')).hide();
	}
	var nowEvent = mtvObj.getEpgNowEvent(cur_ch.CHANNEL_ID);
	if (nowEvent) 
	{           
		time   = parseInt(nowEvent.START_TIME);
		duration = parseInt(nowEvent.DURATION);
		localTime = mtvObj.convertUtcToLocalTime(time);
		prog_start_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		localTime = mtvObj.convertUtcToLocalTime(time + duration);
		prog_end_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		prog_time_str =prog_start_time.pattern("dd/MM/yyyy") +", " + prog_start_time.pattern("HH:mm") + " - " + prog_end_time.pattern("HH:mm");
		progarm_name = nowEvent.EVENT_NAME;
		$($('#dialog_adjust_time').find('.program_info')).html(progarm_name +", "+ prog_time_str ); 
	}
	else{		
		var res = obj_tvServices.getUtcTime();
		var ret = JSON.parse(res);
		time = Number(ret.ITEMS[0].VALUE);	
		duration = 1800;
		localTime = mtvObj.convertUtcToLocalTime(time);
		prog_start_time = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		localTime = mtvObj.convertUtcToLocalTime(time + duration);
		prog_end_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		prog_time_str =prog_start_time.pattern("dd/MM/yyyy") +", " +prog_start_time.pattern("HH:mm") + " - " + prog_end_time.pattern("HH:mm");
		$($('#dialog_adjust_time').find('.program_info')).html(prog_time_str ); 
	}	
		/* show current time*/
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	if (ret.ITEMS[0]) 
	{           
		time = ret.ITEMS[0].rec_start_time;
		duration = ret.ITEMS[0].rec_duration + 1800;
	}	
	recording_info.channel_id = ret.ITEMS[0].channel_id;
	recording_info.data_type = 6;
	recording_info.event_title = ret.ITEMS[0].event_title;
	var start_time = time;
	var localTime = mtvObj.convertUtcToLocalTime(start_time);
	schedule_date_local = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
	schedule_date =new Date(start_time * 1000);
	console.log('time_cal_update schedule_date =' + schedule_date);
	var hh = schedule_date_local.pattern("HH"); 
	var mm = schedule_date_local.pattern("mm");
	$('#adjust_time_hour').html(hh);
	$('#adjust_time_min').html(mm);
	var end_time =	start_time + duration;
	var localTime = mtvObj.convertUtcToLocalTime(end_time);
	date_end_local = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
	date_end = new Date(end_time * 1000);
	console.log('time_cal_update date_end =' + date_end);
	var hh_end = date_end_local.pattern("HH"); 
	var mm_end = date_end_local.pattern("mm");	
	$('#adjust_time_hour_end').html(hh_end);
	$('#adjust_time_min_end').html(mm_end);	
	focus_id = "adjust_time_arrow_up";
	$('#adjust_time_hl_bar').css("top","0px");	
	time_focus(true,"adjust_time_hour_end"); 
	recording_modify_page_show = 1;
	schedule_date_local.setSeconds(00);
	schedule_date.setSeconds(00);
	schedule_date_local.setMilliseconds(000);
	schedule_date.setMilliseconds(000);
	date_end_local.setSeconds(00);
	date_end.setSeconds(00);
	date_end_local.setMilliseconds(000);
	date_end.setMilliseconds(000);
		/*show conflict message.*/
	check_conflict();	
}
function recording_adjust_time_update(){
	var mtvObj = new MtvObj();
	var progarm_name ;
	var prog_time_str ;
	var prog_start_time;
	var prog_end_time;
	var time   = 0;
	var duration = 0;
	$($('#dialog_adjust_time').find('.dialog_title')).text(mtvObjRaw.getLangString("QT_START_RECORD"));
	$($('#dialog_adjust_time').find('.Title_Icon')).attr("src", 'res/pvr/iconPVR_recorded_HL.png');
	var cur_ch = mtvObj.getCurrentChannelInfo();
	var icon = mtvuiUtil.getChannelLogoSrc(cur_ch.CH_LOGO_ID);
	var ch_num = cur_ch.MAJOR_NUM;
	var channel_name = cur_ch.SERVICE_NAME;
	//$($('#dialog_adjust_time').find('.channel_num')).html(ch_num); 
	$($('#dialog_adjust_time').find('.channel_name')).html(channel_name + " "+ ch_num); 
	if(icon){	
		$($('#dialog_adjust_time').find('.chennel_logo')).attr("src", icon);
		$($('#dialog_adjust_time').find('.chennel_logo')).show();
	} 
	else{	
		$($('#dialog_adjust_time').find('.chennel_logo')).hide();
	}	
	var nowEvent = mtvObj.getEpgNowEvent(cur_ch.CHANNEL_ID);
	if (nowEvent) 
	{           
		time   = parseInt(nowEvent.START_TIME);
		duration = parseInt(nowEvent.DURATION);
		localTime = mtvObj.convertUtcToLocalTime(time);
		prog_start_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		localTime = mtvObj.convertUtcToLocalTime(time + duration);
		prog_end_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		prog_time_str =prog_start_time.pattern("dd/MM/yyyy") +", "+ prog_start_time.pattern("HH:mm") + " - " + prog_end_time.pattern("HH:mm");
		var res = obj_tvServices.getUtcTime();
		var ret = JSON.parse(res);
		duration = time + duration - recording_info.rec_start_time + 600 ;
		time = parseInt(ret.ITEMS[0].VALUE) ;
		var conflict_info = mtvObj.CheckConflick(2,nowEvent.CHANNEL_ID,time,duration,1,50);
		if (conflict_info.conflict_type != REMINDER_CONFLICT_TYPE_NO_CONFLICT &&
			conflict_info.conflict_type != REMINDER_CONFLICT_TYPE_START_TIME_CONFLICT) /*REMINDER_CONFLICT_TYPE_END_TIME_CONFLICT or contain another one,or contained by other one,it means end  time  have  conflict,no need +10 minutes  */
		{
			duration -= 600;
		}
		progarm_name = nowEvent.EVENT_NAME;
		$($('#dialog_adjust_time').find('.program_info')).html(progarm_name +", "+ prog_time_str ); 
	}
	else{		
		var res = obj_tvServices.getUtcTime();
		var ret = JSON.parse(res);
		time = Number(ret.ITEMS[0].VALUE);	
		duration = 1800;
		localTime = mtvObj.convertUtcToLocalTime(time);
		prog_start_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		localTime = mtvObj.convertUtcToLocalTime(time + duration);
		prog_end_time  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		prog_time_str =prog_start_time.pattern("dd/MM/yyyy") +", "+ prog_start_time.pattern("HH:mm") + " - " + prog_end_time.pattern("HH:mm");
		$($('#dialog_adjust_time').find('.program_info')).html(prog_time_str ); 
	}	

	var start_time = recording_info.rec_start_time;
	var localTime = mtvObj.convertUtcToLocalTime(start_time);
	schedule_date_local = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE, localTime.DTG.SECOND);
	schedule_date =new Date(start_time * 1000);
	console.log('time_cal_update schedule_date =' + schedule_date);
	var hh = schedule_date_local.pattern("HH"); 
	var mm = schedule_date_local.pattern("mm");
	$('#adjust_time_hour').html(hh);
	$('#adjust_time_min').html(mm);
	var end_time =	start_time + duration;
	var localTime = mtvObj.convertUtcToLocalTime(end_time);
	date_end_local = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE, localTime.DTG.SECOND);
	date_end = new Date(end_time * 1000);
	console.log('time_cal_update date_end =' + date_end);
	var hh_end = date_end_local.pattern("HH"); 
	var mm_end = date_end_local.pattern("mm");	
	$('#adjust_time_hour_end').html(hh_end);
	$('#adjust_time_min_end').html(mm_end);	
	focus_id = "adjust_time_arrow_up";
	$('#adjust_time_hl_bar').css("top","0px");	
	time_focus(true,"adjust_time_hour_end"); 
	//schedule_date_local.setSeconds(00);
	schedule_date.setSeconds(00);
	schedule_date_local.setMilliseconds(000);
	schedule_date.setMilliseconds(000);
	//date_end_local.setSeconds(00);
	date_end.setSeconds(00);
	date_end_local.setMilliseconds(000);
	date_end.setMilliseconds(000);
	/*show conflict message.*/
	check_conflict();	
}
 function startPvr() {
	console.log('startPvr');
	var time = 0 ;
	var start_time = 0;
	var duration = 0;
	var rec_duration  = 0;
	var event_title;
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	var  recording = parseInt(ret.ITEMS[0].is_recording);
	if(recording != 1){
		res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":2,"REQUEST":"QUERY"}}');
		ret = JSON.parse(res);
		if(ret.ITEMS[0].is_usb_ready){
			var mtvObj = new MtvObj();
			var cur_ch = mtvObj.getCurrentChannelInfo();
			var nowEvent = mtvObj.getEpgNowEvent(cur_ch.CHANNEL_ID);
			if (nowEvent) {           
				time = parseInt(nowEvent.START_TIME);
				start_time = time;
				duration = parseInt(nowEvent.DURATION);
				res = obj_tvServices.getUtcTime();
				ret = JSON.parse(res);
				rec_duration = time + duration - parseInt(ret.ITEMS[0].VALUE) + 600 ;
				time = parseInt(ret.ITEMS[0].VALUE) ;
				event_title = nowEvent.EVENT_NAME;
			}
			else{
				res = obj_tvServices.getUtcTime();
				ret = JSON.parse(res);
				time = Number(ret.ITEMS[0].VALUE);	
				start_time = time;
				duration = 1800;
				rec_duration = 1800;
				event_title = "";
			}
			obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":7,"mode":"2","channel_id":"'+cur_ch.CHANNEL_ID+'","start_time":"'+start_time+'","duration":"'+duration+'","rec_start_time":"'+time+'","rec_duration":"'+rec_duration+'","event_title":"'+event_title+'","REQUEST":"QUERY"}}');
			res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
			ret = JSON.parse(res);
			recording = parseInt(ret.ITEMS[0].is_recording);
			if(recording == 1)
			{
			   recording_info.channel_id = cur_ch.CHANNEL_ID;
			   recording_info.start_time = start_time;
			   recording_info.data_type = 7;
			   recording_info.duration = duration;
			   recording_info.rec_start_time = time;
			   recording_info.rec_duration = rec_duration;
			   recording_info.event_title = event_title;
			   $('#dialog_adjust_time').show();
			   recording_adjust_time_update();
			}
		}
		else{
			mtvuiUtil.gotoSysPage("sys_index");/* Go to root page */
		}
	}
} 
 function stopPvr() {
	//var obj_tvServices;
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	var  recording = parseInt(ret.ITEMS[0].is_recording);
	if(recording == 1){
		obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":9,"REQUEST":"QUERY"}}');
	}
	if ($('#dialog_notification_1line_recording').css("display") != "none"){
       	$('#dialog_notification_1line_recording').hide();
    }
} 
function animate(opts) {
    var start = new Date;
    var id = setInterval(function() {
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration;

        if (progress > 1) progress = 1;

        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1) {
            clearInterval(id);
        }
    }, opts.delay || 10);
}

function move(element, pos, delta, duration) {
    var org = $(element).offset();
    animate({
        delay: 10,
        duration: duration || 1000, // 1 sec by default
        delta: delta,
        step: function(delta) {
            // element.style.left = org.x+(pos.x-org.x)*delta + "px";
            // element.style.top  = org.y+(pos.y-org.y)*delta + "px";
            $(element).offset({left:org.left+(pos.left-org.left)*delta ,
                               top:org.top+(pos.top-org.top)*delta });
        }
    });
}
function startInternetOtrRecord(mtvObject) {
	var arg = {"PARAMETER": {"appMode":"OTRECORD", "REQUEST":"SET"}};
	mtvObject.startNetTV(JSON.stringify(arg));
}
function isInternetTvGuide(mtvObject) {

	// cfgId: Please reference mtkapi_config_type.h, for example: 
	// CFG_PWD_PASSWORD CFG_GRP_PASSWORD_PREFIX "password" 
	var val = mtvObject.acfgGetConfigValue("g_misc__tv_guide_from_network");
	if (val == 1) {
		return true;
	}
	return false;
}
function update_num_osd (value){
	if($('#adjust_time_arrow').css("display") != "none"){
		//$("#adjust_time_arrow").hide();
	}
	if($('#time-num').css("display") == "none"){
		$("#time-num").show();
	}
	num_input_status = 1;
	var number = 0;
	/* first has no number */
	if(time_focus_id == "adjust_time_hour_end"){ 
		$("#time-num").css("left","418px");
		if ( $("#num_0").hasClass("input_li") ){
			$("#num_0").html(value);
			$("#num_0").attr("class", "inputed_li");
			return;
		}
		else if( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			if(value_0 > 2){					
				$("#num_0").html(0);
				$("#num_1").html(value_0);
				$("#num_1").attr("class", "inputed_li");
				$("#num_0").attr("class", "inputed_li");
			}
			if(value_0 == 2){ 
				if(value > 4){return;}
				if(value == 4){			
					$("#num_1").html(0);
					$("#num_0").html(0);
					$("#num_1").attr("class", "inputed_li");
					$("#num_0").attr("class", "inputed_li");
				}
				if(value < 4){
					$("#num_1").html(value);
					$("#num_1").attr("class", "inputed_li");
				}			
			}
			if((value_0 == 1) ||
				(value_0 == 0)){
				$("#num_1").html(value);
				$("#num_1").attr("class", "inputed_li");
			}
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end.setHours(number); 
			date_end_local.setHours(number); 
			$("#num_0").attr("class", "input_li");
			$("#num_1").attr("class", "input_li");
			$("#num_0").html("");
			$("#num_1").html("");
			$('#time-num').hide();
			num_input_status = 0;
			$('#adjust_time_hour_end').html(date_end_local.pattern("HH"));
			check_conflict();
			eval($('#'+time_focus_id).attr("move_right"));
			return;
		}
	}
	if(time_focus_id == "adjust_time_min_end"){
	
		$("#time-num").css("left","516px");
		if ( $("#num_0").hasClass("input_li") ){
			if(value >= 6){
				$("#num_0").html(0);
				$("#num_0").attr("class", "inputed_li");
				$("#num_1").html(value);
				$("#num_1").attr("class", "inputed_li");
			}
			else if(value < 6){
				$("#num_0").html(value);
				$("#num_0").attr("class", "inputed_li");
				return;
			}
		}
		else if ( $("#num_1").hasClass("input_li") ){
			$("#num_1").html(value);
			$("#num_1").attr("class", "inputed_li");
		}
		number= Number($("#num_0").html() + $("#num_1").html());
		date_end.setMinutes(number); 
		date_end_local.setMinutes(number); 
		$("#num_0").attr("class", "input_li");
		$("#num_1").attr("class", "input_li");
		$("#num_0").html("");
		$("#num_1").html("");
		$('#adjust_time_min_end').html(date_end_local.pattern("mm"));
		$('#adjust_time_arrow').hide();
		$('#time-num').hide();
		num_input_status = 0;
		check_conflict();
		set_button_focus(true,"adjust_button_confirm");
		return;
	}
	return;
}
function exit_num_input_mode (){
	if(num_input_status == 0){return;}
	/* first has no number */
	if(time_focus_id == "adjust_time_hour_end"){ 
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			$("#num_0").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end.setHours(number); 
			date_end_local.setHours(number); 
			$("#num_0").attr("class", "input_li");
			$("#num_1").attr("class", "input_li");
			$("#num_0").html("");
			$("#num_1").html("");
			check_conflict();
			$('#time-num').hide();
			num_input_status = 0;
			$('#adjust_time_hour_end').html(date_end_local.pattern("HH"));
			$('#adjust_time_arrow').show();
			return;
		}
	}
	if(time_focus_id == "adjust_time_min_end"){
		$("#time-num").css("left","516px");
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_0").attr("class", "inputed_li");
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end.setMinutes(number); 
			date_end_local.setMinutes(number); 
			$("#num_0").attr("class", "input_li");
			$("#num_1").attr("class", "input_li");
			$("#num_0").html("");
			$("#num_1").html("");
			$('#adjust_time_min_end').html(date_end_local.pattern("mm"));
			check_conflict();
			$('#time-num').hide();
			num_input_status = 0;
			$('#adjust_time_arrow').show();
			return;
		}
	return;
	}
}
function rmdr_check_conflick(mode_type,channel_info,start_time,duration) {
	var str_temp ;
	if(duration < 0){return;}
	if((duration %(24*3600) ) == 0){
		$("#notify_conflict_start").css("display","none");
		$("#notify_conflict_end").css("display","block");
		$("#notify_conflict_info").css("display","block");
		/*show conflict infomation*/
		$("#notify_conflict_text").html(mtvObjRaw.getLangString("TME_ADJ_INVALID_END_TME"));
		return;
	}
	if(duration >= (24*3600)){
		/*max duration is 23 hour 59 minute.*/
		duration= 23 * 3600 + 59 * 60; 
	}
	var conflict_info = mtvObj.CheckConflick(mode_type,channel_info.CHANNEL_ID,start_time.getTime()/1000,duration,1,50);
	var rmdr_conflict_temp ;
	var conflict_min = 0;
	var start_temp_str;
	var end_temp_str;
	var localTime = 0;
	switch (conflict_info.conflict_type ){
		case REMINDER_CONFLICT_TYPE_NO_CONFLICT:
			$("#notify_conflict_start").css("display","none");
			$("#notify_conflict_end").css("display","none");
			$("#notify_conflict_info").css("display","none");
			$("#notify_conflict_text").html("");
			break;
		case REMINDER_CONFLICT_TYPE_START_TIME_CONFLICT:
			/*show conflict icon*/
			$("#notify_conflict_start").css("display","block");
			$("#notify_conflict_end").css("display","none");
			$("#notify_conflict_info").css("display","block");
			/*show conflict infomation*/
			rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			start_temp_str = start_time.pattern("HH:mm");
			conflict_min = Number((rmdr_conflict_temp.rec_start_time + rmdr_conflict_temp.rec_duration - start_time.getTime()/1000)/60);
			end_temp_str = DateAdd("n",conflict_min,start_time);
			end_temp_str = end_temp_str.pattern("HH:mm");
			str_temp = mtvObjRaw.getLangString("QT_NOT_RECORD_FROM_1_TO_3");
			str_temp = str_temp.replace('%1', channel_info.SERVICE_NAME);
			str_temp = str_temp.replace('%2', start_temp_str);
			str_temp = str_temp.replace('%3', end_temp_str);
			str_temp = str_temp.replace('%4', parseInt(conflict_min));
			$("#notify_conflict_text").html(str_temp);
			break;
		case REMINDER_CONFLICT_TYPE_END_TIME_CONFLICT:
			$("#notify_conflict_start").css("display","none");
			$("#notify_conflict_end").css("display","block");
			$("#notify_conflict_info").css("display","block");
			/*show conflict infomation*/
			rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			conflict_min = Number((start_time.getTime()/1000) + duration - rmdr_conflict_temp.rec_start_time)/60;
			start_temp_str = new Date(rmdr_conflict_temp.rec_start_time * 1000);
			start_temp_str = start_temp_str.pattern("HH:mm");
			end_temp_str = new Date((rmdr_conflict_temp.rec_start_time + conflict_min * 60) * 1000);
			end_temp_str = end_temp_str.pattern("HH:mm");
			
			str_temp = mtvObjRaw.getLangString("QT_RECORD_FROM_1_TO_3");
			str_temp = str_temp.replace('%1', rmdr_conflict_temp.event_title);
			str_temp = str_temp.replace('%2', start_temp_str);
			str_temp = str_temp.replace('%3', end_temp_str);
			str_temp = str_temp.replace('%4', parseInt(conflict_min));
			$("#notify_conflict_text").html(str_temp);
			break;
		case REMINDER_CONFLICT_TYPE_FULL_CONTAIN_ANOTHER_ONE:
			$("#notify_conflict_start").css("display","block");
			$("#notify_conflict_end").css("display","block");
			$("#notify_conflict_info").css("display","block");
						/*show conflict infomation*/
			rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			start_temp_str = new Date(rmdr_conflict_temp.rec_start_time * 1000);
			start_temp_str = start_temp_str.pattern("HH:mm");
			end_temp_str = new Date((rmdr_conflict_temp.rec_start_time + rmdr_conflict_temp.rec_duration) * 1000);
			end_temp_str = end_temp_str.pattern("HH:mm");
			str_temp = mtvObjRaw.getLangString("QT_RECORD_SCHEDULE_FROM_1_TO_3");
			str_temp = str_temp.replace('%1', rmdr_conflict_temp.event_title);
			str_temp = str_temp.replace('%2', start_temp_str);
			str_temp = str_temp.replace('%3', end_temp_str);
			$("#notify_conflict_text").html(str_temp);
			break;	
		case REMINDER_CONFLICT_TYPE_BE_FULL_CONTAINED_BY_ANOTHER_ONE:
			$("#notify_conflict_start").css("display","block");
			$("#notify_conflict_end").css("display","block");
			$("#notify_conflict_info").css("display","block");
			/*show conflict infomation*/
			rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			start_temp_str = start_time.pattern("HH:mm");
			conflict_min = Number(duration/60);
			end_temp_str = DateAdd("n",conflict_min,start_time);
			end_temp_str = end_temp_str.pattern("HH:mm");
			str_temp = mtvObjRaw.getLangString("QT_RECORD_WANT_SCHEDULE_FROM_1_TO_3");
			str_temp = str_temp.replace('%1', channel_info.SERVICE_NAME);
			str_temp = str_temp.replace('%2', start_temp_str);
			str_temp = str_temp.replace('%3', end_temp_str);
			$("#notify_conflict_text").html(str_temp );
			break;				
		default:
			break;
	}
    return ;
};
function check_conflict() {
	/*check if have conflict*/
	recording_channel = [];
	var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	if(ret.ITEMS[0]) {
		recording_channel.channel_id = ret.ITEMS[0].channel_id;
		recording_channel.event_title = ret.ITEMS[0].event_title;
		recording_channel.SERVICE_NAME = ret.ITEMS[0].event_title;
		recording_channel.rec_start_time = ret.ITEMS[0].rec_start_time;
	}
	var date_tmp = new Date();
	date_tmp = date_end_local;
	var ret= compare_time(schedule_date_local,date_tmp);

	if(ret == false)
	{
		date_tmp = DateAdd("d",1,date_tmp);
	}
	var duration = (date_tmp - schedule_date_local)/1000;
	console.log('duration = ' + duration);
	rmdr_check_conflick(2,recording_channel,schedule_date,duration);
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null )
	return unescape(r[2]);
	return null ;
}
