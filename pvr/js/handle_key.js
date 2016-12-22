var mtvObjRaw = new MtvObjRaw();
var opts = false;
var selected = 0;
var manual_selected = 0;
var time_focus_id = 0;
var schedule_date = 0;
var date_end = 0;
var schedule_date_local = 0;
var date_end_local = 0;
var focus_id = 0;
var booking_count =0;
var recording_list_page_item_num = 9;
var recording_list_page_id = 0;
var sort_type = 0;
var item_num = 0;
var record_list = [];
/*static value for manual channel list*/
var channel_list_page_item_num = 5;
var channel_lis_page_id =0;
var manual_svl_id = 1;
var manual_selected_channel = [];
var DirectionList = {Direction_default : 0, Direction_pre : 1, Direction_next : 2}
/*for number key */
var num_input_status = 0;

 var USB_DETECT_NOTIFY_TYPE = {
  Plugin:0,
  Plugout:1
} 
var weekArray =["DOW_ABBR_SUN", 
				"DOW_ABBR_MON",
				"DOW_ABBR_TUE",
				"DOW_ABBR_WED", 
				"DOW_ABBR_THU", 
				"DOW_ABBR_FRI",
				"DOW_ABBR_SAT"];
var recfile_status = new Array("Unknown","Scheduled","Unwatched", "Partially_Watched", "Watched","Expired","Failed","Ongoing");
var failed_reason = new Array("MY_RECORDING_FAILED_REASON_UNKNOWN",
							"MY_RECORDING_FAILED_REASON_CHANGED_SCHEDULE",
							"MY_RECORDING_FAILED_REASON_NO_CAM", 
							"MY_RECORDING_FAILED_REASON_NO_SIGNAL", 
							"MY_RECORDING_FAILED_REASON_OTHER_RECORDING",
							"MY_RECORDING_FAILED_REASON_POWER_FAILURE",
							"MY_RECORDING_FAILED_REASON_TV_BUSY",
							"MY_RECORDING_FAILED_REASON_WRITE_ERROR",
							"MY_RECORDING_FAILED_REASON_NO_HDD",
							"MY_RECORDING_FAILED_REASON_UNKNOWN");	
var recfile_status_string = ["OPTL_TITLE_UNKNOWN",
								"MY_RECORDING_SCHEDULED",
								"MY_RECORDING_UNWATCHED", 
								"MY_RECORDING_PARTIALLY_WATCHED",
								"MY_RECORDING_WATCHED", 
								"MY_RECORDING_EXPIRED",
								"MY_RECORDING_FAILED",
								"MY_RECORDING_ONGOING"];							
var sort_type_string = ["MY_RECORDING_DATE",
						"MY_RECORDING_EXPIRY_DATE",
						"MY_RECORDING_NAME", 
						"MY_RECORDING_TYPE"];								
REMINDER_CONFLICT_TYPE_NO_CONFLICT = 0;
REMINDER_CONFLICT_TYPE_START_TIME_CONFLICT = 1;
REMINDER_CONFLICT_TYPE_END_TIME_CONFLICT = 2;
REMINDER_CONFLICT_TYPE_FULL_CONTAIN_ANOTHER_ONE = 3;
REMINDER_CONFLICT_TYPE_BE_FULL_CONTAINED_BY_ANOTHER_ONE = 4 ;  
function getMothString(idx) {
	if (!getMothString.prototype.monthArray ) {
		var list = ["MONTH_JAN","MONTH_FEB","MONTH_MAR","MONTH_APR","MONTH_MAY","MONTH_JUN","MONTH_JUL","MONTH_AUG",
		   "MONTH_SEP","MONTH_OCT","MONTH_NOV","MONTH_DEC"];
		getMothString.prototype.monthArray = [];
		for (i in list)  {
			getMothString.prototype.monthArray[i] = mtvObjRaw.getLangString(list[i]);
		}
	}
	return getMothString.prototype.monthArray[idx]
}; 
function getWeekString(idx) {
	if (!getWeekString.prototype.weekArray ) {
		var list = ["DOW_ABBR_SUN", 
				"DOW_ABBR_MON",
				"DOW_ABBR_TUE",
				"DOW_ABBR_WED", 
				"DOW_ABBR_THU", 
				"DOW_ABBR_FRI",
				"DOW_ABBR_SAT"];
		getWeekString.prototype.weekArray = [];
		for (i in list)  {
			getWeekString.prototype.weekArray[i] = mtvObjRaw.getLangString(list[i]);
		}
	}
	return getWeekString.prototype.weekArray[idx]
}; 
function getTitleString(idx) {
	if (!getTitleString.prototype.titleArray ) {
		getTitleString.prototype.titleArray = [];
		for (i in recfile_status_string)  {
			getTitleString.prototype.titleArray[i] = mtvObjRaw.getLangString(recfile_status_string[i]);
		}
	}
	return getTitleString.prototype.titleArray[idx]
}; 
function getSortString(idx) {
	if (!getSortString.prototype.sortArray) {
		getSortString.prototype.sortArray = [];
		for (i in sort_type_string)  {
			getSortString.prototype.sortArray[i] = mtvObjRaw.getLangString(sort_type_string[i]);
		}
	}
	return getSortString.prototype.sortArray[idx]
};  
function findStringIndexInArray(string,array) {
	if (string && array ) {
		for (i in array)  {
			if(string == array[i])
			return i;
		}
	}
	return -1;
};  
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
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+getWeekString([this.getDay()+""]));           
	    } 
	if(/(M+)/.test(fmt)){           
	        fmt=fmt.replace(RegExp.$1, getMothString(this.getMonth()));           
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
function registerKeyEventListener() {
  document.addEventListener("keydown", function(e) {
    if (handleKeyCode(e.keyCode)) {
      e.preventDefault();
    }
  }, false);
}
function updateItemIcon(type) {
  if(type = "scheduled")
  {
  	opts =document.getElementById('pvrcontent_item').getElementById('li');
  }

}
/*var obj_tvServices = new (function() {
	this.service = null;
	this.getService = function (){
			try {
					this.service = getTvJspService();
			} catch(e) {
					console.log("error create tv service.");
					console.log(e);
			}
			return this.service.tvServices;
		};
});	*/
var obj_tv = getTvJspService();
var obj_tvServices = obj_tv.tvServices;
var mtvObj = new MtvObj();
function get_total_number(){
	var total_number = 0;
	var res= obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":12,"REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	total_number =	Number(ret.ITEMS[0].total_rmdr_num );
	var res_num = obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":2,"REQUEST":"QUERY"}}');
	var ret_num = JSON.parse(res_num);
	total_number = total_number + Number(ret_num.ITEMS[0].reclist_num);
	return total_number;
}
function get_record_list(){
	var i=0;
	record_list = []; 
	/*get rmdr*/
	for (var i=0; i < 6; i++) {
		var index = i*9;
		var y = 0;
		res= obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":1,"type":1,"otr_mode":1,"start_slot":"'+index+'","REQUEST":"QUERY"}}');
		ret = JSON.parse(res);
		if (ret && ret.ITEMS.length > 0){
			for(y= 0 ;y < ret.ITEMS.length;y++){
				var channel_id  = Number(ret.ITEMS[y].channel_id);
				/*get start time and duration*/	
				var time = ret.ITEMS[y].start_time;
				if(( channel_id == 0)&&(time == 0))
				continue;
				record_list.push(ret.ITEMS[y]);
				booking_count++;
			}
		}
		res= obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":12,"REQUEST":"QUERY"}}');
		ret = JSON.parse(res);
		if(ret.ITEMS[0].total_rmdr_num == record_list.length)
		{
			break;
		}
	/*
		itenObj.channel_id = channel_id;
		itenObj.event_id = Number(.event_id);
		itenObj.start_time = Number(ret.ITEMS[0].start_time);
		record_list[index].duration = Number(ret.ITEMS[0].duration);
		record_list[index].rec_start_time = Number(ret.ITEMS[0].rec_start_time);
		record_list[index].rec_duration = Number(ret.ITEMS[0].rec_duration);
		record_list[index].slot = Number(ret.ITEMS[0].slot);
		record_list[index].genre = ret.ITEMS[0].genre;
		record_list[index].event_title = ret.ITEMS[0].event_title;
		record_list[index].info_data = ret.ITEMS[0].info_data;
		*/
	}
	for (var i=0; i < 15; i++) {
		var index = i*9;
		var y = 0;
		res= obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":1,"type":0,"otr_mode":1,"start_slot":"'+index+'","REQUEST":"QUERY"}}');
		ret = JSON.parse(res);
		if (ret && ret.ITEMS.length > 0){
			for(y= 0 ;y < ret.ITEMS.length;y++){
				var channel_id  = Number(ret.ITEMS[y].channel_id);
				/*get start time and duration*/	
				var time = ret.ITEMS[y].start_time;
				if(( channel_id == 0)&&(time == 0))
				continue;
				record_list.push(ret.ITEMS[y]);
			}
		}
		var res_num = obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":2,"REQUEST":"QUERY"}}');
		var ret_num = JSON.parse(res_num);
		if(ret_num.ITEMS[0].reclist_num == record_list.length)
		{
			break;
		}
	}
	return record_list;
}
function item_Init() {
	soundOutPortEnable(0);
	$($("#record_list_ul").find('li')).remove();
	recording_list_page_id = 0;
	item_num = 0;
	update_disk_info();
	update_sortby_info(sort_type);
	var ret = []; 
	var res= obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":13,"REQUEST":"QUERY"}}');
	ret = JSON.parse(res);
	if(parseInt(ret.ITEMS[0].is_usb_ready) == 0){
		$('#hlbar').hide();
		return;
	}
	item_num = get_total_number();
	if(item_num <= 0) {
	/*hide footer text*/
	$(".text-color-span").eq(0).html("");
	$(".text-color-span").eq(2).html("");
	$(".text-color-span").eq(3).html("");
	$('#hlbar').hide();
	return;};
	var page_info = $("input[name='page_info']").val();
	if(page_info == null ||
		page_info ==""){
		item_update(sort_type,recording_list_page_id);
		itemSelect(0);}
	else{
		var page_info_ret = JSON.parse(page_info);
		sort_type = parseInt(page_info_ret.sorttype);
		recording_list_page_id = parseInt(page_info_ret.pageid);
		selected = parseInt(page_info_ret.hlpos);
		item_update(sort_type,recording_list_page_id);
		itemSelect(selected);
	}
	$("input[name='page_info']").val("");
	if(item_num > recording_list_page_item_num ){	
		/*call scrollbar height*/
		var hight = parseInt($('#record_list_layout').css("height"));
		hight = (recording_list_page_item_num / item_num) * hight  + "px";
		$('#recording_list_scrollbar_img').css("height",hight);
		$('#recording_list_scrollbar').show();
	}
}
function pvrRecordingStatusNotifyHandler(info) {
    
    if (!info) {
        return;
    }
    
    var obj = JSON.parse(info);
    if (obj.ITEMS[0].ID != 11) {
        return;
    }
	else
	{
		item_update(sort_type,recording_list_page_id);
		itemSelect(selected);
	}
    
}
function item_update(sort_type,page_id){
	recording_list_page_id = page_id;
	item_num = get_total_number();
	if(item_num <= 0){
		$('#hlbar').hide();
	}
	else{
			/*show footer text*/
		$(".text-color-span").eq(0).html(mtvObjRaw.getLangString("SCHED_BLUE_INFO"));
		$(".text-color-span").eq(3).html(mtvObjRaw.getLangString("MY_RECORDING_REMOVE"));
		$('#hlbar').show();
	}
	if(item_num > recording_list_page_item_num ){	
		/*call scrollbar height*/
		var hight = parseInt($('#record_list_layout').css("height"));
		hight = (recording_list_page_item_num / item_num) * hight  + "px";
		$('#recording_list_scrollbar_img').css("height",hight);
		$('#recording_list_scrollbar').show();
	}
	else if(item_num <= recording_list_page_item_num ){
		if ($('#recording_list_scrollbar').css("display") != "none"){
			$('#recording_list_scrollbar').hide();
		}
	}
	var i=0;
	var file_name 
	var date = 0;
	record_list = [];
	$($("#record_list_ul").find('li')).remove();
	var res= obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":1,"sort_type":"'+sort_type+'","otr_mode":1,"page_index":"'+page_id+'","REQUEST":"QUERY"}}');
	var ret = JSON.parse(res);
	if (ret && ret.ITEMS.length > 0){
		for(i= 0 ;i < ret.ITEMS.length;i++){
			var channel_id  = Number(ret.ITEMS[i].channel_id);
			/*get start time and duration*/	
			var time = ret.ITEMS[i].start_time;
			if(( channel_id == 0)&&(time == 0))
			continue;
			record_list.push(ret.ITEMS[i]);
		}
	}
	/*get rmdr*/
	for (var i=0; i < record_list.length; i++) {
		var channel_id  = Number(record_list[i].channel_id);
	 /*get start time and duration*/	
		var time = record_list[i].start_time;
		time = Number(time);
		var localTime = mtvObj.convertUtcToLocalTime(parseInt(time));
		var start_time = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		var duration = record_list[i].duration;
		duration = Number(duration);
		var data_type_index = Number(record_list[i].recording_status);
		data_type = recfile_status[data_type_index];
		var date = record_list_date_foramt(start_time,data_type,record_list[i].expire_time);
		var duration =record_list_duration_foramt(start_time,duration,data_type);
		/*
		if(data_type == recfile_status[1]){
			date =  start_time.pattern("dd M yyyy");
		}
		else{
			date =  start_time.pattern("dd M yyyy HH:mm");	
		}
		*/
		if(record_list[i].program_name ){
			file_name = record_list[i].program_name;
		}
		else if(record_list[i].channel_name){
			file_name = record_list[i].channel_name;
		}
		else if(record_list[i].channel_name ==  ""||
			record_list[i].channel_name ==  null){
		 		/*get channel  name*/
			var current_ch    = mtvObj.getCurrentChannelInfo();
			if(current_ch){
				var svl_id      = current_ch.SVL_ID;
				var ch_pre = mtvObj.getPrevNextChannelInfoEx(svl_id,1,record_list[i].channel_id);
				var channel_info = mtvObj.getPrevNextChannelInfoEx(svl_id,0,ch_pre.CHANNEL_ID);
				var channel_name = channel_info.SERVICE_NAME;
				if(channel_name){
					file_name = channel_name;
				}
			}
			else{
				file_name = "Unknown";
			}	
		}

	/*append list etem to list*/
		var id = "pvrcontent_item_" + i;	
		$("#record_list_ul").append(' \
				<li id ="'+id+'" class="pvrcontent_item"  data-type='+data_type+' tabindex="0" onfocus=\'list_focus(true, "'+id+'");\' onblur=\'list_focus(false, "'+id+'");\'> \
					<ul> \
						<li id="pvrcontent_item_status_icon" class="pvrcontent_item_status_icon" ><img src=""></li> \
						<li id="pvrcontent_item_program" class="pvrcontent_item_program" style ="width:400px;text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">'+file_name+'</li> \
						<li id="pvrcontent_item_date" class="pvrcontent_item_date"  style ="width:240px;overflow:hidden;">'+date+'</li> \
						<li id="pvrcontent_item_duration" class="pvrcontent_item_duration" >'+duration+'</li> \
						<li id="pvrcontent_item_conflict_icon" class="pvrcontent_item_conflict_icon" ><img src=""></li> \
					</ul> \
			</li>');
		item_update_icon(i);		
		item_update_conflict_icon(i);		
	}
}
function itemSelect(idx) {
	var items = $(".pvrcontent_item");
	console.log("itemSelect idx:",idx);
	if (items.length <= 0)
	  return;
	selected = idx;
	selected = (selected + items.length) % items.length;
	$(items[selected]).focus();
	var pos = $(items[selected]).offset();
	pos.top +=2;
	$("#hlbar").offset({top:pos.top});
	/*update green key adjust time or rename.*/
	var	item= (document.getElementById('pvrcontent_item_' + idx));
	var id= 'pvrcontent_item_' + idx;
	var item_type = $(item).attr("data-type");
	if(item_type == recfile_status[1] ||
		item_type == recfile_status[7]) {
		/*green button*/
		$(".text-color-span").eq(2).html(mtvObjRaw.getLangString("QT_ADJUST_TIME"));
	}
	else{
		$(".text-color-span").eq(2).html(mtvObjRaw.getLangString("MY_RECORDING_RENAME"));
	}	
	var scrollbar_height = parseInt($('#recording_list_scrollbar_img').css("height"));
	var hight = parseInt($('#record_list_layout').css("height"));
	hight  = hight - scrollbar_height;
	var per = (recording_list_page_id * recording_list_page_item_num + selected ) / item_num ; 
	var top = per * hight + "px";
	$('#recording_list_scrollbar').css("top",top);
}
function update_disk_info() {
	var ret = [];
	var str_temp ;	
	var res= obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":13,"REQUEST":"QUERY"}}');
	ret = JSON.parse(res);
	if(parseInt(ret.ITEMS[0].is_usb_ready) == 0){
		$("#title_diskinfo").html(mtvObjRaw.getLangString("MY_RECORDING_NO_USB_INSTALLED")); 
		$("#title_diskicon").attr("src", "res/_Icons/EPG_Icons/PVR_List/icon_storage_not_available.png");
		return;
	}
	res = obj_tvServices.getPvrPairedDiskInfo();
	ret = JSON.parse(res);
	var total_size = Number(ret.ITEMS[0].totalSize);
	total_size = total_size/1024;
	total_size = total_size/1024;
	total_size = total_size/1024;
	var ava_size = Number(ret.ITEMS[0].freeSize);;
	ava_size = ava_size/1024;
	ava_size = ava_size/1024;
	ava_size = ava_size/1024;
	if(ava_size < 2 )
	{ 
		$("#title_diskinfo").html(mtvObjRaw.getLangString("MY_RECORDING_DISC_INSUFFICIENT")); 
		$("#title_diskicon").attr("src", "res/_Icons/EPG_Icons/PVR_List/icon_storage_problem.png");
		return;
	}
	if(ava_size < 32 )
	{ 
		$("#title_diskicon").attr("src", "res/_Icons/EPG_Icons/PVR_List/icon_storage_problem.png");
		var space_per =( ava_size/total_size) * 100;
		space_per = " " + Math.round(space_per); 
		str_temp = mtvObjRaw.getLangString("MY_RECORDING_DISC_LOW");
		str_temp = str_temp.replace('<xx>', space_per);
		$("#title_diskinfo").html(str_temp);
		return;
	}
	$("#title_diskicon").attr("src", "res/_Icons/EPG_Icons/PVR_List/icon_storage.png");
	space_per =( ava_size/total_size);
	space_per = " " + Math.round(space_per * 100) + "%"; 
	str_temp = mtvObjRaw.getLangString("QT_DISC_SPACE_AVAILABLE");
	str_temp = str_temp.replace('%1%', space_per);
	$("#title_diskinfo").html(str_temp);
}
function update_sortby_info(sort_type) {
	var str ;
	str = mtvObjRaw.getLangString("MY_RECORDING_SORTED_BY") ;
	str = str + ":" + " " +getSortString(sort_type);
	$('#title_sortinfo').html(str);	
}
function record_list_date_foramt(time,data_type,expiry_time) {
	var res = obj_tvServices.getUtcTime();
	var resault = JSON.parse(res);
	var current_time = resault.ITEMS[0].VALUE;
	var localTime = mtvObj.convertUtcToLocalTime(parseInt(current_time));
	var today = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE,localTime.DTG.SECOND);
	var date = new Date(time);
	//var ret = GetDateDiff(today,date,"day");
	var ret = date.getDate() - today.getDate();
	var ret_month = date.getMonth() - today.getMonth();
	//var ret_year = GetDateDiff(today,date,"year");
	var ret_year = date.getFullYear() - today.getFullYear();
/*("Unknown","Scheduled","Unwatched", "Partially_Watched", "Watched","Expired","Failed","Ongoing")*/
	if(data_type == recfile_status[1]) {
		if(ret_year > 0 ){ 
			return date.pattern("dd M yyyy");
		} 
		if(ret == 1){
			return mtvObjRaw.getLangString("DOW_TOM");
		} 
		if(ret == 0){
			return mtvObjRaw.getLangString("DOW_ABBR_TOD");
		} 
		return date.pattern("dd M yyyy"); 
	}
	if(data_type == recfile_status[7]) {
		return mtvObjRaw.getLangString("MY_RECORDING_NOW");
	}
	if(data_type == recfile_status[5]) {
		var expiry_time = new Date(expiry_time * 1000) ;
		//var ret = GetDateDiff(today,expiry_time,"day");
		var ret = expiry_time.getDate() - today.getDate();
		if((1 < ret && ret < 7)||
			(1 == ret )||
			(7 == ret )){
			if(1 == ret){
				return mtvObjRaw.getLangString("QT_EXPIRE_TOMORROW");
			}
			var str_temp = mtvObjRaw.getLangString("QT_EXPIRE_ONE_DAY");
			str_temp = str_temp.replace('%1', ret);
			return str_temp;
		} 
		else if(ret == 0)
			{return mtvObjRaw.getLangString("MY_RECORDING_EXPIRES_TODAY");} 
		else (ret < 0)
			{return mtvObjRaw.getLangString("MY_RECORDING_EXPIRED");} 
	}
	if((ret_year < 0) || (ret_year > 0))
	{ return date.pattern("dd M yyyy");}
	
	if((ret < -1) || (ret > 0))
	{ 
		return date.pattern("dd M");
	}
	if(ret == -1 )
	{ 
		if(ret_month == 0)
		{
			return mtvObjRaw.getLangString("DOW_YES");
		}
		else
		{
			return date.pattern("dd M");
		}
	}
	if(ret == 0)
	{ 
		if(ret_month == 0)
		{
			return date.pattern("HH:mm");
		}
		else
		{
			return date.pattern("dd M");
		}
	}
}
function record_list_duration_foramt(start_time,duration,data_type) {

	var start_time = new Date(start_time);
	if(data_type == recfile_status[7])
	{
		duration += 59;
	}
	var end_time = DateAdd("s",duration,start_time);
	var end_time = new Date(end_time);
	if(data_type == recfile_status[1]||
		data_type == recfile_status[7]) {
		return start_time.pattern("HH:mm") + " - " +end_time.pattern("HH:mm");
	}
	else{
		var a = duration / 60  + 1;
		return  parseInt(a) + " " + mtvObjRaw.getLangString("EVENT_INFO_MINUTE");
	}	
}
function manual_select_itemSelect(idx) {
	//var items = document.getElementById('manual_select_list_layout').getElementByTagName('li');
	var items = $("#manual_select_list_layout").find("li");
	var top = 0;
	console.log("itemSelect idx:",idx);
	if (items.length <= 0)
	  return;
	manual_selected = idx;
	manual_selected = (manual_selected + items.length) % items.length;
	$(items[manual_selected]).focus();
	$("#manual_hlbar").show();
	var pos = $(items[manual_selected]).offset();
	pos.top -=5;
	pos.left=$("#manual_hlbar").offset().left;
	move(document.getElementById("manual_hlbar"), pos, function(p) {return p;}, 200);
	focus_id = "manual_select_list_layout";
	/*cal scrollbar position*/
	var scrollbar_height = parseInt($('#channel_list_scrollbar_img').css("height"));
	var hight = parseInt($('#manual_select_list_layout').css("height"));
	
	
	if(manual_selected == 0 && channel_lis_page_id == 0){//focu 0
		top = "16px";
	}else if(idx == (channel_lis_page_id * channel_list_page_item_num + manual_selected-1)){//focus last one
		var scrollHeight = 392-	$('#channel_list_scrollbar_img').height();
		top = scrollHeight+"px";
	}else{
		var scrollTop = (392-$('#channel_list_scrollbar_img').height())*((channel_lis_page_id * channel_list_page_item_num + manual_selected +1) /channel_count);
		top = scrollTop+"px";
	}
	$('#channel_list_scrollbar').css("top",top);
}
function manual_select_channel_list_init(index){
	var channel_logo;
	var str;
	$($("#channel_select_ul").find('li')).remove();
	manual_selected_channel =[];
	channel_lis_page_id = 0;
	/*get channel number*/
	var EPG_MASK       = MaskList.Mask_all; // SB_VENT_ACTIVE | SB_VENT_VISIBLE
    var EPG_MASK_VALUE = MaskValueList.MaskValue_all; //SB_VENT_ACTIVE | SB_VENT_VISIBLE
	var current_ch    = mtvObj.getCurrentChannelInfo();
    var current_ch_id = current_ch.CHANNEL_ID;
    manual_svl_id      = current_ch.SVL_ID;
	channel_count = mtvObj.getChannelCountEx(manual_svl_id, EPG_MASK, EPG_MASK_VALUE);
	if(channel_count <= 0)
	{return;}
	if(channel_count > channel_list_page_item_num ){	
		/*call scrollbar height*/
		var hight =parseInt( $('#manual_select_list_layout').css("height"));
		hight = (channel_list_page_item_num / channel_count) * hight  + "px";
		$('#channel_list_scrollbar_img').css("height",hight);
		$('#channel_list_scrollbar').show();
	}
	// get first channel info
	//var ch = mtvObj.getPrevNextChannelInfoEx(manual_svl_id, 0, 0);
	//if(ch){
		//var channel_list = mtvObj.getChannelListEx(manual_svl_id, ch.CHANNEL_ID,EPG_MASK, EPG_MASK_VALUE,DirectionList.Direction_next,channel_list_page_item_num -1);
	//}
	//console.log("channel_list:",channel_list);
	//console.log("channel_list[1]:",channel_list[0].SERVICE_NAME);
	manual_select_channel_list_update(channel_lis_page_id);
	manual_select_itemSelect(index);
}
function manual_select_channel_list_update(index){
	var channel_logo;
	var str;
	 	/*update title*/
	$($('#dialog_manual_select').find('.dialog_title')).html(mtvObjRaw.getLangString("TME_ADJ_MANUAL") + " - "+ mtvObjRaw.getLangString("QT_SELECT_CHANNEL")); 
		/*get channel number*/
	var EPG_MASK       = MaskList.Mask_all; // SB_VENT_ACTIVE | SB_VENT_VISIBLE
    var EPG_MASK_VALUE = MaskValueList.MaskValue_all; //SB_VENT_ACTIVE | SB_VENT_VISIBLE
	var currentChannelListType = mtvObj.getChannelListType();
    if (currentChannelListType == CUST_CH_LIST_TYPE_FAVORITE){
		EPG_MASK       = MaskList.Mask_favorite; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_favorite; 
	}
	else{
		EPG_MASK       = MaskList.Mask_all; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_all; 
	}
	var current_ch    = mtvObj.getCurrentChannelInfo();
    var current_ch_id = current_ch.CHANNEL_ID;
    manual_svl_id      = current_ch.SVL_ID;
	channel_count = mtvObj.getChannelCountEx(manual_svl_id, EPG_MASK, EPG_MASK_VALUE);
	if(channel_count <= 0)
	{return;}
	channel_lis_page_id =  index;
	$($("#channel_select_ul").find('li')).remove();
	for (var i=0; i < channel_list_page_item_num; i++){
		if(channel_lis_page_id *channel_list_page_item_num  + i >= channel_count){return;}
		/*get channel info from  all channel list  or favourite*/
		var curChObj  = mtvuiChannel.getCurrentChannelObj();
        if (!curChObj)
        return ;
		var ch = mtvuiChannel.getChannelInfoByIndex(curChObj, EPG_MASK, EPG_MASK_VALUE, channel_lis_page_id *channel_list_page_item_num  + i);
		if(!ch){return;}
		if(ch){
			channel_logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
			str = ch.MAJOR_NUM;
			if(str){
				var str_minor = ch.MINOR_NUM;
				if (str_minor) {
					if (str_minor != '0') {
						str = str+'.'+str_minor;
					}
				}
				str = str + " " + ch.SERVICE_NAME;
			}
			else{
				str = ch.SERVICE_NAME;
			}
		}
		if(!channel_logo ||
		(mtvObj.getChLogoStatus()==false) ){
			channel_logo="../libs/test-res/blank.png";
		}
		$("#channel_select_ul").append(' \
		<li tabindex="3" onfocus=\'manual_list_focus(true, "'+i+'");\' onblur=\'manual_list_focus(false, "'+i+'");\' > \
		<img class= "channel_list_icon" style= "margin-left: 78px;" src="'+channel_logo+'" ><p class="channel_list_name">'+str+'</p>\
		</li>');
	}
}
function manual_select_time_update(){
	console.log("manual_select_time_update");
	var channel_logo;
	var localTime;
	var mtvObj = new MtvObj();
	manual_selected_channel = [];
	/*update title*/
	 $($('#dialog_manual_select_time').find('.dialog_title')).html(mtvObjRaw.getLangString("TME_ADJ_MANUAL") + " - "+ mtvObjRaw.getLangString("QT_SELECT_DATE_TIME"));
	 		/*get channel infomation*/
	var EPG_MASK       = MaskList.Mask_all; // SB_VENT_ACTIVE | SB_VENT_VISIBLE
    var EPG_MASK_VALUE = MaskValueList.MaskValue_all; //SB_VENT_ACTIVE | SB_VENT_VISIBLE
	var currentChannelListType = mtvObj.getChannelListType();
    if (currentChannelListType == CUST_CH_LIST_TYPE_FAVORITE){
		EPG_MASK       = MaskList.Mask_favorite; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_favorite; 
	}
	else{
		EPG_MASK       = MaskList.Mask_all; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_all; 
	}
	var current_ch    = mtvObj.getCurrentChannelInfo();
    manual_svl_id      = current_ch.SVL_ID;
	var channel_list_index =channel_lis_page_id * channel_list_page_item_num + manual_selected;
		/*get channel info from  all channel list  or favourite*/
	var curChObj  = mtvuiChannel.getCurrentChannelObj();
	if (!curChObj)
	return ;
	var ch = mtvuiChannel.getChannelInfoByIndex(curChObj, EPG_MASK, EPG_MASK_VALUE, channel_list_index);
	channel_logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
	if(channel_logo && (mtvObj.getChLogoStatus()== true)){
		$($('#dialog_manual_select_time').find('.chennel_logo')).attr("src", channel_logo);
		$($('#dialog_manual_select_time').find('.chennel_logo')).show();
	}
	else{
		$($('#dialog_manual_select_time').find('.chennel_logo')).hide();
	}
	var ch_num = ch.MAJOR_NUM;
	if (ch.MINOR_NUM != 0) {
        ch_num = ch.MAJOR_NUM + "." + ch.MINOR_NUM;
    }
	var program_name = ch.SERVICE_NAME;
	manual_selected_channel = ch;
 	$($('#dialog_manual_select_time').find('.channel_num')).html(ch_num);
 	$($('#dialog_manual_select_time').find('.channel_name')).html(program_name);
 	/*default show current time*/
	var res = obj_tvServices.getUtcTime();
	var ret = JSON.parse(res);
	var time = ret.ITEMS[0].VALUE;
	time = Number(time);
	time = time * 1000;
	var today = new Date(time);
 	schedule_date =  new Date(time);
	localTime = mtvObj.convertUtcToLocalTime(parseInt(ret.ITEMS[0].VALUE));
	schedule_date_local  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE,localTime.DTG.SECOND);
 	console.log('time_cal_update schedule_date =' + schedule_date );
 	var date = schedule_date_local.getDate(); 
 	var month = schedule_date_local.getMonth() +1;
 	var wek = schedule_date_local.getDay();
	
	var hh = schedule_date_local.pattern('HH'); 
 	var mm = schedule_date_local.pattern('mm');
	
/*
 	var hh = schedule_date_local.getHours(); 
 	var mm = schedule_date_local.getMinutes();
*/
 	$('#manual_time_date').html(date);
 	$('#manual_time_mon').html(month);
 	$('#manual_time_week').html(mtvObjRaw.getLangString(weekArray[wek]));
 	$('#manual_time_hour').html(hh);
 	$('#manual_time_min').html(mm);
 	date_end =	DateAdd("n",30,today);
	localTime = mtvObj.convertUtcToLocalTime(parseInt(ret.ITEMS[0].VALUE) + 1800);
	date_end_local  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE,localTime.DTG.SECOND);
 	console.log('time_cal_update date_end =' + date_end);
	
	var hh_end = date_end_local.pattern('HH'); 
 	var mm_end = date_end_local.pattern('mm');
/*
 	var hh_end = date_end_local.getHours(); 
 	var mm_end = date_end_local.getMinutes();	
*/
 	$('#manual_time_hour_end').html(hh_end);
 	$('#manual_time_min_end').html(mm_end);	
 	focus_id = "manual_time_arrow_up";
 	$('#manual_time_hl_bar').css("top","0px");	
 	time_focus(true,"manual_time_date");
	check_conflict();
}
function item_update_icon(idx) {
	var	item= (document.getElementById('pvrcontent_item_' + idx));
    var item_type = $(item).attr("data-type");
	/*("Unknown","Scheduled","Unwatched", "Partially_Watched", "Watched","Expired","Failed","Ongoing")*/
    if(item_type == recfile_status[1]) {
        $(item).find('img')[0].src = "res/pvr/iconPVR_recorded_HL.png";
        // $($(opts[i]).('li ul li')[1]).html("BBC XXXXX");
    }
    else if(item_type == recfile_status[7]) {
        $(item).find('img')[0].src = "res/pvr/recording_normal.png";
    }
    else if(item_type == recfile_status[6]) {
        $(item).find('img')[0].src = "res/pvr/rec_failed_normal.png";
    }
    else if(item_type == recfile_status[2]){
    	 $(item).find('img')[0].src = "res/pvr/play_ready_normal.png";
		}
		else if(item_type == recfile_status[3]){
    	 $(item).find('img')[0].src = "res/pvr/part_seen_normal.png";
		}
		else if(item_type == recfile_status[4]){
    	 $(item).find('img')[0].src = "res/pvr/seen_normal.png";
		}
		else if(item_type == recfile_status[5]){
    	 $(item).find('img')[0].src = "res/pvr/expired_normal.png";
		}  
		else if(item_type == recfile_status[0]){
    	 $(item).find('img')[0].src = "res/pvr/play_ready_normal.png";
		}  
}
function item_update_conflict_icon(idx) {
	var	item= (document.getElementById('pvrcontent_item_' + idx));
    var item_type = $(item).attr("data-type");
	/*("Unknown","Scheduled","Unwatched", "Partially_Watched", "Watched","Expired","Failed","Ongoing")*/
	if(item_type == recfile_status[1]||
		item_type == recfile_status[7]){
		var check_type = 0;
		if(item_type == recfile_status[7]){
			check_type = 1;
		}
		var conflict_info = mtvObj.CheckConflick(2,record_list[idx].channel_id,record_list[idx].start_time,record_list[idx].duration,check_type,record_list[idx].slot);	
		if(conflict_info.conflict_type != 0){
			$(item).find('img')[1].src = "res/_Icons/EPG_Icons/PVR_List/iconPVR_conflict.png";
		}
		else{
			$(item).find('img')[1].src = "";
		}
	}	
}
function adjust_time_update(idx){
	var mtvObj = new MtvObj();
	var localTime ;
	var adjust_channel = [];
	var	item= (document.getElementById('pvrcontent_item_' + idx));
	var id= 'pvrcontent_item_' + idx;
	var item_type = $(item).attr("data-type");
	var str;
	var string_index = findStringIndexInArray(item_type,recfile_status);
	if ( string_index >= 0 ){
		str = getTitleString(string_index);
	}
	str+=" " ;
	str+= mtvObjRaw.getLangString("RECORDINGS") ;
	$($('#dialog_adjust_time').find('.dialog_title')).html(str);
	if(item_type == recfile_status[1]||
	   item_type == recfile_status[7] ) {
		$($('#dialog_adjust_time').find('.Title_Icon')).attr("src", 'res/pvr/iconPVR_recorded_HL.png');
	}
	if(idx < record_list.length){
		var event_id = record_list[idx].event_id;
		/* if there is no icon then use default icon. */
		var channel_logo = mtvuiUtil.getChannelLogoSrc(record_list[idx].channel_logo_id);
		if(channel_logo  && (mtvObj.getChLogoStatus()==true) ){
			$($('#dialog_adjust_time').find('.chennel_logo')).attr("src", channel_logo); 
		}
		var file_name;
		if(record_list[idx].channel_name ==  ""||
			record_list[idx].channel_name ==  null){
		 		/*get channel  name*/
			var current_ch    = mtvObj.getCurrentChannelInfo();
			if(current_ch){
				var svl_id      = current_ch.SVL_ID;
				var ch_pre = mtvObj.getPrevNextChannelInfoEx(svl_id,1,record_list[idx].channel_id);
				var channel_info = mtvObj.getPrevNextChannelInfoEx(svl_id,0,ch_pre.CHANNEL_ID);
				var channel_name = channel_info.SERVICE_NAME;
				if(channel_name){
					file_name = channel_name;
				}
			}
			else{
				file_name = "Unknown";
			}	
		}
		else{
			file_name = record_list[idx].channel_name;
		}
		$($('#dialog_adjust_time').find('.channel_name')).html(file_name); 
		/*program name*/
		/*if is recording ,channel is current channel,and evnet is current event*/
		var program_name = record_list[idx].program_name;
		if (!program_name) {
			program_name = "Unknown";
		}
		 /*get start time and duration*/	
		var time = record_list[idx].start_time;
		time = Number(time);
		var localTime = mtvObj.convertUtcToLocalTime(parseInt(time));
		var start_time = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
		var duration = record_list[idx].duration;
		duration = Number(duration);
		var data_type_index = Number(record_list[idx].recording_status);
		data_type = recfile_status[data_type_index];
		var date = record_list_date_foramt(start_time,data_type,record_list[idx].expire_time);
		var duration =record_list_duration_foramt(start_time,duration,data_type);
		$($('#dialog_adjust_time').find('.program_info')).html(program_name + " , " + date + " , "+ duration); 
		
			/*default show current time*/
		var start_time = parseInt(record_list[idx].start_time);
		schedule_date =new Date(start_time * 1000);
		localTime = mtvObj.convertUtcToLocalTime(start_time);
		schedule_date_local  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1 ,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE,localTime.DTG.SECOND);
		schedule_date_local.pattern("HH:mm");
		console.log('time_cal_update schedule_date =' + schedule_date);
		var hh = schedule_date_local.getHours(); 
		var mm = schedule_date_local.getMinutes();
		$('#adjust_time_hour').html(hh);
		$('#adjust_time_min').html(mm);
		var end_time =	parseInt(start_time + record_list[idx].duration);
		date_end = new Date(end_time * 1000);
		localTime = mtvObj.convertUtcToLocalTime(end_time);
		date_end_local  = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH - 1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE,localTime.DTG.SECOND);
		date_end_local.pattern("HH:mm");
		console.log('time_cal_update date_end =' + date_end);
		var hh_end = date_end_local.getHours(); 
		var mm_end = date_end_local.getMinutes();	
		$('#adjust_time_hour_end').html(hh_end);
		$('#adjust_time_min_end').html(mm_end);	
		focus_id = "adjust_time_arrow_up";
		$('#adjust_time_hl_bar').css("top","0px");	
		adjust_time_focus(true,"adjust_time_hour");
		check_conflict();
	}
}
function item_infomation_show(idx) {
	var	item = (document.getElementById('pvrcontent_item_' + idx));
	var id= 'pvrcontent_item_' + idx;
	var item_type = $(item).attr("data-type");
	var str;
	var string_index = findStringIndexInArray(item_type,recfile_status);
	if ( string_index >= 0 ){
		str = getTitleString(string_index);
	}
	$('#info_title_name').html(str);
	/*get disk name*/
	//str= $($(item).find('.pvrcontent_item_disk')).html();
	//$('#disk_name').html(str);
	/*get channel logo and channel name*/
	var ch_num = record_list[idx].channel_id;
	var channel_logo = mtvuiUtil.getChannelLogoSrc(record_list[idx].channel_logo_id);
	if(channel_logo == null || (mtvObj.getChLogoStatus()==false) ){
		$($('#dialog_item_infomation').find('.channel_name')).css("top","105px");
		$($('#dialog_item_infomation').find('.chennel_logo')).hide();
	}
	else{
		$($('#dialog_item_infomation').find('.chennel_logo')).attr("src", channel_logo);
		$($('#dialog_item_infomation').find('.chennel_logo')).show();
		$($('#dialog_item_infomation').find('.channel_name')).css("top","184px");
	}
	/*set title icon*/
	if(item_type == recfile_status[1]) {
		$('#info_title_Icon').attr("src", 'res/pvr/iconPVR_header_record.png');
	}
	else if(item_type == recfile_status[7]) {
		$('#info_title_Icon').attr("src", 'res/pvr/recording_HL.png');
	}
	else if(item_type == recfile_status[6]) {
		$('#info_title_Icon').attr("src", 'res/pvr/rec_failed_HL.png');
	}
	else if(item_type == recfile_status[2]){
		$('#info_title_Icon').attr("src", 'res/pvr/play_ready_HL.png');
	}
	else if(item_type == recfile_status[4]){
		$('#info_title_Icon').attr("src", 'res/pvr/seen_HL.png');
	} 
	else if(item_type == recfile_status[3]){
		$('#info_title_Icon').attr("src", 'res/pvr/part_seen_HL.png');
	}
	else{
		$('#info_title_Icon').attr("src", 'res/pvr/play_ready_HL.png');
	} 	
	/*add  : to title*/
	str = mtvObjRaw.getLangString("QT_RECORD_AT");
	$('#infomation_title_recorded').html(str);
	str = mtvObjRaw.getLangString("MY_RECORDING_EXPIRED") + ":";
	$('#infomation_title_expires').html(str);
	str = mtvObjRaw.getLangString("TSHIFT_DISK_SIZE");
	$('#infomation_title_diskspace').html(str);
 		/*get channel  name*/
	var current_ch    = mtvObj.getCurrentChannelInfo();
    var svl_id      = current_ch.SVL_ID;
	var ch_pre = mtvObj.getPrevNextChannelInfoEx(svl_id,1,record_list[idx].channel_id);
	var channel_info = mtvObj.getPrevNextChannelInfoEx(svl_id,0,ch_pre.CHANNEL_ID);
	var channel_name = channel_info.SERVICE_NAME;
 	$($('#dialog_item_infomation').find('.channel_name')).html(channel_name);
	/*get program name*/
	//str= $($(item).find('.pvrcontent_item_program')).html();
	$('#program_name').html(record_list[idx].program_name);
	/*get duration*/
	str= $($(item).find('.pvrcontent_item_duration')).html();
	$('#infomation_duration').html(str);
	/*get DATE*/
	var localTime = mtvObj.convertUtcToLocalTime(parseInt(record_list[idx].start_time));
	var time = new Date(localTime.DTG.YEAR,localTime.DTG.MONTH -1,localTime.DTG.DAY,localTime.DTG.HOUR,localTime.DTG.MINUTE);
	str = time.pattern("dd/MM/yyyy HH:mm");
	$('#infomation_recorded').html(str);
	 /*get experided*/
	var expire_time = record_list[idx].expire_time ;
	if((expire_time != 0 )&&
		(expire_time != 0xffffffff)){
		time = DateAdd("s",parseInt(record_list[idx].expire_time),time)
		time = time.pattern("dd/MM/yyyy HH:mm");
		$('#infomation_expires').html(time);
	}
	/*get disk space*/
	var disk_size = record_list[idx].sizeinMB;
	if(disk_size < 1024){
		disk_size = disk_size + " MB";
	}
	else{
		var res = obj_tvServices.getPvrPairedDiskInfo();
		var ret = JSON.parse(res);
		var total_size = Number(ret.ITEMS[0].totalSize);
		var per ="(" + Math.round((disk_size * 1024 * 1024) / total_size * 100) + "%" +")";
		disk_size = Math.round(disk_size /1024) + "GB" +" " + per;
	}
	$('#infomation_diskspace').html(disk_size);
		if(item_type == recfile_status[1]){
		$('#infomation_expired').hide();
		$('#infomation_title_expires').hide();
		$('#infomation_expires').hide();
		$('#infomation_title_diskspace').hide();
		$('#infomation_diskspace').hide();
		$("#infomation_fail_reason").hide(); 
		return;
	}
	/*hide expire if not unwatched*/
	/*expired*/
	if(item_type == recfile_status[5]){
		$('#infomation_expired').show();
		$('#infomation_title_expires').hide();
		$('#infomation_expires').hide();
		var top = $('#infomation_title_expires').css("top");
		$('#infomation_title_diskspace').css("top",top);
		$('#infomation_diskspace').css("top",top);
		$('#infomation_title_diskspace').show();
		$('#infomation_diskspace').show();
		return;
	}
	if(item_type == recfile_status[6]){
		if(	record_list[idx].sizeinMB <= 0){
			$('#infomation_title_expires').hide();
			$('#infomation_expires').hide();
			$('#infomation_title_diskspace').hide();
			$('#infomation_diskspace').hide();
			var top = $('#infomation_title_expires').css("top");
			$('#infomation_fail_reason').css("top",top);
			var failed_reason_index = Number(record_list[idx].failure_reason);
			fail_reason = failed_reason[failed_reason_index];
			$("#infomation_fail_reason").html(mtvObjRaw.getLangString(fail_reason)); 
			$("#infomation_fail_reason").show(); 
		}
		else{
			$('#infomation_title_expires').hide();
			$('#infomation_expires').hide();
			$('#infomation_title_diskspace').show();
			$('#infomation_diskspace').show();
			var top = $('#infomation_title_expires').css("top");
			var top_disk = 347+"px";
			$('#infomation_title_diskspace').css("top",top);
			$('#infomation_diskspace').css("top",top);
			$('#infomation_fail_reason').css("top",top_disk);
			var failed_reason_index = Number(record_list[idx].failure_reason);
			fail_reason = failed_reason[failed_reason_index];
			$("#infomation_fail_reason").html(mtvObjRaw.getLangString(fail_reason)); 
			$("#infomation_fail_reason").show(); 
		}
		return;
	}
	if(expire_time == 0xffffffff ||
		expire_time == 0){
		$('#infomation_expired').hide();
		$('#infomation_title_expires').hide();
		$('#infomation_expires').hide();
		var top = $('#infomation_title_expires').css("top");
		$('#infomation_title_diskspace').css("top",top);
		$('#infomation_diskspace').css("top",top);
		$('#infomation_title_diskspace').show();
		$('#infomation_diskspace').show();
		$("#infomation_fail_reason").hide(); 
		return;
	}
	$('#infomation_title_expires').show();
	$('#infomation_expires').show();
	$('#infomation_title_diskspace').show();
	$('#infomation_diskspace').show();
	$("#infomation_fail_reason").hide(); 
}
function time_cal_update(id,num){
	console.log('time_cal_update id =' + id);
	console.log('time_cal_update schedule_date =' + schedule_date );
	console.log('time_cal_update date_end =' + date_end);
	var res = obj_tvServices.getUtcTime();
	var ret = JSON.parse(res);
	var time = Number(ret.ITEMS[0].VALUE);
	time = time * 1000;
	var cur_time = new Date(time);
	cur_time = mtvObj.convertUtcToLocalTime(parseInt(cur_time.getTime()/1000));
	var date_temp = new Date();
	var date_temp_end = new Date();
	var localTime;
	date_temp = schedule_date_local;
	date_temp_end = date_end_local;
	switch(time_focus_id){
	  case "manual_time_date": date_temp = DateAdd("d",num,date_temp);date_temp_end = DateAdd("d",num,date_temp_end);break;
	  case "manual_time_mon": date_temp = DateAdd("m",num,date_temp);date_temp_end = DateAdd("m",num,date_temp_end);break;
	  case "manual_time_hour": date_temp = DateAdd("h",num,date_temp); break;
	  case "manual_time_min": date_temp = DateAdd("n",num,date_temp);break;
	  case "manual_time_hour_end":date_temp_end = DateAdd("h",num,date_temp_end);;break;
	  case "manual_time_min_end": date_temp_end = DateAdd("n",num,date_temp_end);break;
	  default:break;
	}
	console.log('schedule_date id =' + schedule_date);
	if(date_temp < schedule_date_local ){
		if(cur_time >=  date_temp)
		{
			$('#dialog_notification_1line_recording').show();
			$('#notification_content_text').html("Can not set time before current time.");	
			setTimeout(function(){$('#dialog_notification_1line_recording').css("display" , "none");},2000);
			return;
		}
	}
	schedule_date_local = date_temp;
	date_end_local = date_temp_end;

	$('#manual_time_date').html(schedule_date_local.getDate());
	var month = schedule_date_local.getMonth() +1;
	$('#manual_time_mon').html(month);
	$('#manual_time_hour').html(schedule_date_local.pattern('HH')); 
	$('#manual_time_min').html(schedule_date_local.pattern('mm'));
	$('#manual_time_week').html(mtvObjRaw.getLangString(weekArray[schedule_date_local.getDay()]));
	$('#manual_time_hour_end').html(date_end_local.pattern('HH'));
	$('#manual_time_min_end').html(date_end_local.pattern('mm'));
	/*add for check conflict*/
	/*start time and end time have same year,month,date */
	date_end_local.setFullYear(schedule_date_local.getFullYear()); 
	date_end_local.setMonth(schedule_date_local.getMonth());
	date_end_local.setDate(schedule_date_local.getDate());	
	var ret= compare_time(schedule_date_local,date_end_local);
	if(ret == false)
	{
		date_end_local = DateAdd("d",1,date_end_local);
	}
		/*calcute start time*/
	check_conflict();
}
function adjust_time_cal_update(id,num){
	console.log('time_cal_update id =' + id);
	console.log('time_cal_update schedule_date =' + schedule_date );
	console.log('time_cal_update date_end =' + date_end);
	var	item = (document.getElementById('pvrcontent_item_' + selected));
    var item_type = $(item).attr("data-type");
	/*ongoing pvr,start time cannnot adjust*/
    if(item_type == recfile_status[7]){
		if(time_focus_id == "adjust_time_hour" ||
			time_focus_id == "adjust_time_min"){
			return;
		}
	}
	var localTime;
	var adjust_channel = [];
	var res = obj_tvServices.getUtcTime();
	var ret = JSON.parse(res);
	var time = Number(ret.ITEMS[0].VALUE);
	time = time * 1000;
	var cur_time = new Date(time);
	cur_time = mtvObj.convertUtcToLocalTime(parseInt(cur_time.getTime()/1000));
	var date_temp = new Date();
	var date_temp_end = new Date();
	var date_temp = schedule_date_local;
	var date_temp_end = date_end_local;
	switch(time_focus_id){
		case "adjust_time_hour": date_temp = DateAdd("h",num,date_temp);break;
		case "adjust_time_min": date_temp = DateAdd("n",num,date_temp);break;
		case "adjust_time_hour_end":date_temp_end = DateAdd("h",num,date_temp_end); break;
		case "adjust_time_min_end": date_temp_end = DateAdd("n",num,date_temp_end); break;
		default:break;
	}
	if(date_temp < schedule_date_local ){
		if(cur_time >=  date_temp)
		{
			$('#dialog_notification_1line_recording').show();
			$('#notification_content_text').html("Can not set time before current time.");	
			setTimeout(function(){$('#dialog_notification_1line_recording').css("display" , "none");},2000);
			return;
		}
	}
	schedule_date_local = date_temp;
	date_end_local = date_temp_end;
	$('#adjust_time_hour').html(schedule_date_local.getHours());
	$('#adjust_time_min').html(schedule_date_local.getMinutes());
	$('#adjust_time_hour_end').html(date_end_local.getHours());
	$('#adjust_time_min_end').html(date_end_local.getMinutes());
		/*add for check conflict*/
	/*start time and end time have same year,month,date */
	date_end_local.setFullYear(schedule_date_local.getFullYear()); 
	date_end_local.setMonth(schedule_date_local.getMonth());
	date_end_local.setDate(schedule_date_local.getDate());	
	var ret= compare_time(schedule_date_local,date_end_local);
	if(ret == false)
	{
		date_end_local = DateAdd("d",1,date_end_local);
	}
		/*calcute start time*/
	check_conflict();
}
function time_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	time_focus_id= id;
	$('#manual_time_arrow').show();
	 $('#focus_id').focus();
	var pos = $('#'+id).offset();
	//var hl_bar_pos = $('#'+id).offset();

	pos.top=$("#manual_time_arrow").offset().top;
	$("#manual_time_arrow").offset({left:pos.left,top:pos.top});
	//move(document.getElementById("manual_time_arrow"), pos, function(p) {return p;}, 500);
}
function adjust_time_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	time_focus_id= id;
	$('#adjust_time_arrow').show();
	$('#time_focus_id').focus();
	var pos = $('#'+id).offset();
	pos.top=$("#adjust_time_arrow").offset().top;
	$("#adjust_time_arrow").offset({left:pos.left,top:pos.top});
 // move(document.getElementById("adjust_time_arrow"), pos, function(p) {return p;}, 500);
}
function button_focus(isfocus, id) {
	console.log('button_focus isfocus =' + isfocus + ' id =' + id);
	var content = document.getElementById(id);
	if($('#dialog_adjust_time').css("display") != "none"){
		time_focus_id= "adjust_time_hour";
	}
	else{
		time_focus_id= "manual_time_date";
	}
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
function item_delete_dialog_show(idx) {
	if ($('#dialog_button_confirm').css("display") != "none")
	{
		$('#dialog_button_confirm').hide();
		return;
	}  
	$('#dialog_button_confirm').show();
	var	item= (document.getElementById('pvrcontent_item_' + idx));
	var item_type = $(item).attr("data-type");
	if(item_type == recfile_status[1]) {
		//$('#dialog_button_confirm_content').html("Are you sure you want to cancel the scheduled recordings?");
		$('#dialog_button_confirm_content').text(mtvObjRaw.getLangString("MY_RECORDING_DELETE_RECORD")); 

		$('#dialog_button_confirm_no').focus();
	}
	else if(item_type == recfile_status[7]) {
		//$('#dialog_button_confirm_content').html("Are you sure you want to stop recordings?");
		$('#dialog_button_confirm_content').text(mtvObjRaw.getLangString("MSG_STOP_RECORD")); 

		$('#dialog_button_confirm_no').focus();
	}
	else{
		$('#dialog_button_confirm_content').text(mtvObjRaw.getLangString("MY_RECORDING_DELETE_RECORD")); 
		$($('#dialog_button_confirm_yes').find('.btn_text')).html(mtvObjRaw.getLangString("BTN_YES"));
		$($('#dialog_button_confirm_no').find('.btn_text')).html(mtvObjRaw.getLangString("DLG_CANCEL"));

		$('#dialog_button_confirm_no').focus();
		
	}
}
function set_rmdr(){
	console.log("set_rmdr");
	var channel_logo;	
	 		/*get channel number*/
	var EPG_MASK       = MaskList.Mask_all; // SB_VENT_ACTIVE | SB_VENT_VISIBLE
    var EPG_MASK_VALUE = MaskValueList.MaskValue_all; //SB_VENT_ACTIVE | SB_VENT_VISIBLE
	var currentChannelListType = mtvObj.getChannelListType();
    if (currentChannelListType == CUST_CH_LIST_TYPE_FAVORITE){
		EPG_MASK       = MaskList.Mask_favorite; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_favorite; 
	}
	else{
		EPG_MASK       = MaskList.Mask_all; 
		EPG_MASK_VALUE = MaskValueList.MaskValue_all; 
	}
	var current_ch    = mtvObj.getCurrentChannelInfo();
    var current_ch_id = current_ch.CHANNEL_ID;
    manual_svl_id      = current_ch.SVL_ID;
	var channel_list_index =channel_lis_page_id * channel_list_page_item_num + manual_selected;
			/*get channel info from  all channel list  or favourite*/
	var curChObj  = mtvuiChannel.getCurrentChannelObj();
	if (!curChObj)
	return ;
	var ch = mtvuiChannel.getChannelInfoByIndex(curChObj, EPG_MASK, EPG_MASK_VALUE, channel_list_index);
	channel_logo = mtvuiUtil.getChannelLogoSrc(ch.CH_LOGO_ID);
	if(!channel_logo ||(mtvObj.getChLogoStatus()==false) ){
		channel_logo="../libs/test-res/blank.png";
	}
	var ch_num = ch.MAJOR_NUM ? ch.MAJOR_NUM : "000";
	var ch_id = ch.CHANNEL_ID ? ch.CHANNEL_ID : "000";
	var program_name = "";			/*start time and end time have same year,month,date */
	date_end_local.setFullYear(schedule_date_local.getFullYear()); 
	date_end_local.setMonth(schedule_date_local.getMonth());
	date_end_local.setDate(schedule_date_local.getDate());
	var ret= compare_time(schedule_date_local,date_end_local);
	if(ret == false)
	{
		date_end_local = DateAdd("d",1,date_end_local);
	}
		/*calcute start time*/
	var res = obj_tvServices.getUtcTime();
	var ret = JSON.parse(res);
	var time = Number(ret.ITEMS[0].VALUE);
	var localTime = mtvObj.convertUtcToLocalTime(parseInt(time));
	var dst = localTime.DTG.DST;
	var month = schedule_date_local.getMonth() +1;
	res = obj_tvServices.convertLocalTimeToMillis('{"PARAMETER":{"DTG":{"YEAR":'+schedule_date_local.getFullYear()+',"MONTH":'+month+',"DAY":'+schedule_date_local.getDate()+',"WEEK":'+schedule_date_local.getDay()+',"HOUR":'+schedule_date_local.getHours()+',"MINUTE":'+schedule_date_local.getMinutes()+',"SECOND":'+schedule_date_local.getSeconds()+',"DST":'+dst+'},"REQUEST":"QUERY"}}');
	ret = JSON.parse(res);
	var start_time= ret.ITEMS[0].VALUE;
	var dur= GetDateDiff(schedule_date_local,date_end_local,"second");
	
	obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":3,"mode":"2","channel_id":"'+ch_id+'","start_time":"'+start_time+'","duration":"'+dur+'","rec_start_time":"'+start_time+'","rec_duration":"'+dur+'","event_title":"'+program_name+'","REQUEST":"QUERY"}}');

	$($("#record_list_ul").find('li')).remove();
	item_Init();
}
function update_rmdr(selected){
	if(selected < record_list.length )
	{   
		/*start time and end time have same year */
		date_end_local.setFullYear(schedule_date_local.getFullYear()); 
		date_end_local.setMonth(schedule_date_local.getMonth());
		date_end_local.setDate(schedule_date_local.getDate());

		var ret= compare_time(schedule_date_local,date_end_local);
		if(ret == false)
		{
			date_end_local = DateAdd("d",1,date_end_local);
		}
		/*calcute start time*/
		var res = obj_tvServices.getUtcTime();
		var ret = JSON.parse(res);
		var time = Number(ret.ITEMS[0].VALUE);
		var localTime = mtvObj.convertUtcToLocalTime(parseInt(time));
		var dst = localTime.DTG.DST;
		var month = schedule_date_local.getMonth() +1;
		res = obj_tvServices.convertLocalTimeToMillis('{"PARAMETER":{"DTG":{"YEAR":'+schedule_date_local.getFullYear()+',"MONTH":'+month+',"DAY":'+schedule_date_local.getDate()+',"WEEK":'+schedule_date_local.getDay()+',"HOUR":'+schedule_date_local.getHours()+',"MINUTE":'+schedule_date_local.getMinutes()+',"SECOND":'+schedule_date_local.getSeconds()+',"DST":'+dst+'},"REQUEST":"QUERY"}}');
		ret = JSON.parse(res);
		var start_time = ret.ITEMS[0].VALUE;
		var duration = (date_end_local - schedule_date_local)/1000;
		record_list[selected].start_time = start_time;
		record_list[selected].duration = duration;	
		console.log("duration:",duration);
		obj_tvServices.setPvrRecordInfo('{"PARAMETER":{"operation":"5",\
													"slot":"'+record_list[selected].slot+'",\
													"list_id":"'+record_list[selected].list_id+'",\
													"recording_status":"'+record_list[selected].recording_status+'",\
													"file_name_id":"'+record_list[selected].file_name_id+'",\
													"channel_id":"'+record_list[selected].channel_id+'",\
													"start_time":"'+start_time+'",\
													"duration":"'+duration+'",\
													"rec_start_time":"'+start_time+'",\
													"rec_duration":"'+duration+'",\
													"REQUEST":"SET"}}');
														
	/*update recordlist and ui*/
		duration =record_list_duration_foramt(schedule_date_local,duration,recfile_status[1]);
		date =  schedule_date_local.pattern("dd M yyyy");
		var	item = (document.getElementById('pvrcontent_item_' + selected));
		$($(item).find('.pvrcontent_item_date')).html(date);
		$($(item).find('.pvrcontent_item_duration')).html(duration);
		item_update_conflict_icon(selected);			
	}
}
function handle_play_key(selected){
	var title_name;
	if(selected < record_list.length)
	{
		var	item= (document.getElementById('pvrcontent_item_' + selected));
		var item_type = $(item).attr("data-type");
		var failed_reason_index = Number(record_list[selected].failure_reason);
		fail_reason = failed_reason[failed_reason_index];
		if(item_type == recfile_status[5])
		{	
			$('#dialog_notification_1line_recording').show();
			$("#notification_content_text").text(mtvObjRaw.getLangString("MY_RECORDING_PLAY_EXPIRED"));
			setTimeout(function(){$('#dialog_notification_1line_recording').css("display" , "none");},6000);
		}
		else if(item_type == recfile_status[6])
		{	
			$('#dialog_notification_1line_recording').show();
			$("#notification_content_text").text(mtvObjRaw.getLangString(fail_reason)); 
			setTimeout(function(){$('#dialog_notification_1line_recording').css("display" , "none");},6000);
		}
		else if(item_type == recfile_status[2]||
				item_type == recfile_status[3]||
				item_type == recfile_status[4] ||
				item_type == recfile_status[7])
			{
				var res= obj_tvServices.getPvrRecordList('{"PARAMETER":{"operation":"3","recording_status":"'+record_list[selected].recording_status+'","file_name_id":"'+record_list[selected].file_name_id+'","REQUEST":"QUERY"}}'); 
				var ret = JSON.parse(res);
				if ( ret.ITEMS[0].file_url_id ) 
				{   
					title_name = $($(item).find('.pvrcontent_item_program')).html();
					var pvr_path = ret.ITEMS[0].file_url_id;
					var pageInfo = '{"pageid":"'+recording_list_page_id+'","hlpos":"'+selected+'","sorttype":"'+sort_type+'"}';
					$("input[name='page_info']").val(pageInfo);
					mtvuiUtil.gotoSysPage("sys_content_browser_player",'filePath='+pvr_path+'&fileid='+record_list[selected].list_id+'&title='+title_name+'&bufferingModel=1');
				}
				else{
						$('#dialog_notification_1line_recording').show();
						$('#notification_content_text').text(mtvObjRaw.getLangString("MY_RECORDING_PLAY_NOT_FOUND"));	
						

						setTimeout(function(){$('#dialog_notification_1line_recording').css("display" , "none");},6000);
				}
			}
		else{return;}			
	}  
}
function setInstr(txt) {
  document.getElementById('instr').innerHTML = txt;
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
function list_focus(isFcous,id){
	if(isFcous){
	}

}
function manual_list_focus(isFcous,id){
	if(isFcous){
	}

}
function rmdr_check_conflick(mode_type,channel_info,start_time,duration) {
	var check_type = 0;
	var str_temp ;
	if((duration %(24*3600) ) == 0 ||
		duration == 0){
		$("#notify_conflict_start").css("display","none");
		$("#notify_conflict_end").css("display","block");
		$("#notify_conflict_info").css("display","block");
		/*show conflict infomation*/
		$("#notify_conflict_text").html(mtvObjRaw.getLangString("TME_ADJ_INVALID_END_TME"));
		return;
	}
	if($('#dialog_adjust_time').css("display") != "none"){
		var	item= (document.getElementById('pvrcontent_item_' + selected));
		var item_type = $(item).attr("data-type");
		if(item_type == recfile_status[7])
		{check_type = 1;}
	}
	else{check_type = 0;}
	var conflict_info = mtvObj.CheckConflick(mode_type,channel_info.CHANNEL_ID,start_time.getTime()/1000,duration,check_type,50);
	var rmdr_conflict_temp ;
	var conflict_min = 0;
	var start_temp_str;
	var end_temp_str;
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
			if(conflict_info.conflict_slot == 50)/*conflict with OTR*/
			{
				var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
				var ret = JSON.parse(res);
				if (ret.ITEMS[0]) 
				{           
					rmdr_conflict_temp = ret.ITEMS[0];
				}
			}
			else /*conflict with Non-OTR*/
			{
				rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			}	
			start_temp_str = schedule_date_local.pattern("HH:mm");
			conflict_min = Number((rmdr_conflict_temp.rec_start_time + rmdr_conflict_temp.rec_duration - start_time.getTime()/1000)/60);
			end_temp_str = DateAdd("n",conflict_min,schedule_date_local);
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
			if(conflict_info.conflict_slot == 50)/*conflict with OTR*/
			{
				var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
				var ret = JSON.parse(res);
				if (ret.ITEMS[0]) 
				{           
					rmdr_conflict_temp = ret.ITEMS[0];
				}
			}
			else /*conflict with Non-OTR*/
			{
				rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			}	
			conflict_min = Number((start_time.getTime()/1000) + duration - rmdr_conflict_temp.rec_start_time)/60;
			var start_temp_utc = new Date(rmdr_conflict_temp.rec_start_time * 1000);
			var localTime_start = mtvObj.convertUtcToLocalTime(start_temp_utc);
			start_temp_str = localTime_start.pattern("HH:mm");
			
			var end_temp_utc = new Date((rmdr_conflict_temp.rec_start_time + conflict_min * 60) * 1000);
			var localTime_end = mtvObj.convertUtcToLocalTime(end_temp_utc);
			end_temp_str = localTime_end.pattern("HH:mm");
			
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
			if(conflict_info.conflict_slot == 50)/*conflict with OTR*/
			{
				var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
				var ret = JSON.parse(res);
				if (ret.ITEMS[0]) 
				{           
					rmdr_conflict_temp = ret.ITEMS[0];
				}
			}
			else /*conflict with Non-OTR*/
			{
				rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			}	
			var start_temp_utc = new Date(rmdr_conflict_temp.rec_start_time * 1000);
			var localTime_start = mtvObj.convertUtcToLocalTime(start_temp_utc);
			start_temp_str = localTime_start.pattern("HH:mm");
			
			var end_temp_utc = new Date((rmdr_conflict_temp.rec_start_time + rmdr_conflict_temp.rec_duration) * 1000);
			var localTime_end = mtvObj.convertUtcToLocalTime(end_temp_utc);
			end_temp_str = localTime_end.pattern("HH:mm");
			
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
			if(conflict_info.conflict_slot == 50)/*conflict with OTR*/
			{
				var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":11,"REQUEST":"QUERY"}}');
				var ret = JSON.parse(res);
				if (ret.ITEMS[0]) 
				{           
					rmdr_conflict_temp = ret.ITEMS[0];
				}
			}
			else /*conflict with Non-OTR*/
			{
				rmdr_conflict_temp = mtvObj.GetReminder(mode_type,conflict_info.conflict_slot);
			}	
			start_temp_str = schedule_date_local.pattern("HH:mm");
			conflict_min = Number(duration/60);
			
			end_temp_str = DateAdd("n",conflict_min,schedule_date_local);
			end_temp_str = end_temp_str.pattern("HH:mm");
			
			str_temp = mtvObjRaw.getLangString("QT_RECORD_WANT_SCHEDULE_FROM_1_TO_3");
			str_temp = str_temp.replace('%1', channel_info.SERVICE_NAME);
			str_temp = str_temp.replace('%2', start_temp_str);
			str_temp = str_temp.replace('%3', end_temp_str);
			$("#notify_conflict_text").html(str_temp);
			break;				
		default:
			break;
	}
    return ;
};
function soundOutPortEnable(enable) {
    //var cfgItem = 154271748;    
	//mtvObj.acfgSetConfigItemValue(cfgItem, enable);
}
function exist_record_list() {
	soundOutPortEnable(1);	
}
usbDetectNotifyFunc = function(usbItem){
	switch(Number(usbItem.TYPE)){
	case USB_DETECT_NOTIFY_TYPE.Plugin:
	item_Init();
	break;
	case USB_DETECT_NOTIFY_TYPE.Plugout:
	item_Init();
	break;
	}
};  
function startInternetMyRecording(mtvObject) {
	var arg = {"PARAMETER": {"appMode":"MYRECORDING", "REQUEST":"SET"}};
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
 function pvrHelpEnter() {
        
    var arg = {"PARAMETER": {"appMode":"EDFU", "edfuUrl":"/usr/opera/opera_dir/pages/edfu/index.html", "REQUEST":"SET"}};
         
    mtvObject.startNetTV(JSON.stringify(arg));
} 
function adjust_time_update_num_osd (value){
	var	item = (document.getElementById('pvrcontent_item_' + selected));
    var item_type = $(item).attr("data-type");
	/*("Unknown","Scheduled","Unwatched", "Partially_Watched", "Watched","Expired","Failed","Ongoing")*/
	/*ongoing pvr,start time cannnot adjust*/
    if(item_type == recfile_status[7]){
		if(time_focus_id == "adjust_time_hour" ||
			time_focus_id == "adjust_time_min"){
			return;
		}
	}
	if($('#adjust_time_arrow').css("display") != "none"){
		//$("#adjust_time_arrow").hide();
	}
	if($('#adjust-time-num').css("display") == "none"){
		$("#adjust-time-num").show();
	}
	num_input_status = 1;
	var number = 0;
	/* first has no number */
	if(time_focus_id == "adjust_time_hour"){ 
		$("#adjust-time-num").css("left","174px");
		if ( $("#adjust_num_0").hasClass("input_li") ){
			$("#adjust_num_0").html(value);
			$("#adjust_num_0").attr("class", "inputed_li");
			return;
		}
		else if( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			if(value_0 > 2){					
				$("#adjust_num_0").html(0);
				$("#adjust_num_1").html(value_0);
				$("#adjust_num_1").attr("class", "inputed_li");
				$("#adjust_num_0").attr("class", "inputed_li");
			}
			if(value_0 == 2){ 
				if(value > 4){return;}
				if(value == 4){			
					$("#adjust_num_1").html(0);
					$("#adjust_num_0").html(0);
					$("#adjust_num_1").attr("class", "inputed_li");
					$("#adjust_num_0").attr("class", "inputed_li");
				}
				if(value < 4){
					$("#adjust_num_1").html(value);
					$("#adjust_num_1").attr("class", "inputed_li");
				}			
			}
			if(value_0 == 1 ||
				value_0 == 0){
				$("#adjust_num_1").html(value);
				$("#adjust_num_1").attr("class", "inputed_li");
			}
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			//date_end.setHours(number); 
			schedule_date_local.setHours(number); 
			$("#adjust_num_0").attr("class", "input_li");
			$("#adjust_num_1").attr("class", "input_li");
			$("#adjust_num_0").html("");
			$("#adjust_num_1").html("");
			$('#adjust-time-num').hide();
			num_input_status = 0;
			$('#adjust_time_hour').html(schedule_date_local.pattern("HH"));
			check_conflict();
			eval($('#'+time_focus_id).attr("move_right"));
			return;
		}
	}
	if(time_focus_id == "adjust_time_min"){
	
		$("#adjust-time-num").css("left","271px");
		if ( $("#adjust_num_0").hasClass("input_li") ){
			if(value >= 6){
				$("#adjust_num_0").html(0);
				$("#adjust_num_0").attr("class", "inputed_li");
				$("#adjust_num_1").html(value);
				$("#adjust_num_1").attr("class", "inputed_li");
			}
			else if(value < 6){
				$("#adjust_num_0").html(value);
				$("#adjust_num_0").attr("class", "inputed_li");
				return;
			}
		}
		else if ( $("#adjust_num_1").hasClass("input_li") ){
			$("#adjust_num_1").html(value);
			$("#adjust_num_1").attr("class", "inputed_li");
		}
		number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
		//date_end.setMinutes(number); 
		schedule_date_local.setMinutes(number); 
		$("#adjust_num_0").attr("class", "input_li");
		$("#adjust_num_1").attr("class", "input_li");
		$("#adjust_num_0").html("");
		$("#adjust_num_1").html("");
		$('#adjust_time_min').html(schedule_date_local.pattern("mm"));
		$('#adjust_time_arrow').hide();
		$('#adjust-time-num').hide();
		num_input_status = 0;
		check_conflict();
		eval($('#'+time_focus_id).attr("move_right"));
		return;
	}
	if(time_focus_id == "adjust_time_hour_end"){ 
		$("#adjust-time-num").css("left","418px");
		if ( $("#adjust_num_0").hasClass("input_li") ){
			$("#adjust_num_0").html(value);
			$("#adjust_num_0").attr("class", "inputed_li");
			return;
		}
		else if( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			if(value_0 > 2){					
				$("#adjust_num_0").html(0);
				$("#adjust_num_1").html(value_0);
				$("#adjust_num_1").attr("class", "inputed_li");
				$("#adjust_num_0").attr("class", "inputed_li");
			}
			if(value_0 == 2){ 
				if(value > 4){return;}
				if(value == 4){			
					$("#adjust_num_1").html(0);
					$("#adjust_num_0").html(0);
					$("#adjust_num_1").attr("class", "inputed_li");
					$("#adjust_num_0").attr("class", "inputed_li");
				}
				if(value < 4){
					$("#adjust_num_1").html(value);
					$("#adjust_num_1").attr("class", "inputed_li");
				}			
			}
			if(value_0 == 1 ||
				value_0 == 0){
				$("#adjust_num_1").html(value);
				$("#adjust_num_1").attr("class", "inputed_li");
			}
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			date_end.setHours(number); 
			date_end_local.setHours(number); 
			$("#adjust_num_0").attr("class", "input_li");
			$("#adjust_num_1").attr("class", "input_li");
			$("#adjust_num_0").html("");
			$("#adjust_num_1").html("");
			$('#adjust-time-num').hide();
			num_input_status = 0;
			$('#adjust_time_hour_end').html(date_end_local.pattern("HH"));
			check_conflict();
			eval($('#'+time_focus_id).attr("move_right"));
			return;
		}
	}
	if(time_focus_id == "adjust_time_min_end"){
	
		$("#adjust-time-num").css("left","516px");
		if ( $("#adjust_num_0").hasClass("input_li") ){
			if(value >= 6){
				$("#adjust_num_0").html(0);
				$("#adjust_num_0").attr("class", "inputed_li");
				$("#adjust_num_1").html(value);
				$("#adjust_num_1").attr("class", "inputed_li");
			}
			else if(value < 6){
				$("#adjust_num_0").html(value);
				$("#adjust_num_0").attr("class", "inputed_li");
				return;
			}
		}
		else if ( $("#adjust_num_1").hasClass("input_li") ){
			$("#adjust_num_1").html(value);
			$("#adjust_num_1").attr("class", "inputed_li");
		}
		number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
		date_end.setMinutes(number); 
		date_end_local.setMinutes(number); 
		$("#adjust_num_0").attr("class", "input_li");
		$("#adjust_num_1").attr("class", "input_li");
		$("#adjust_num_0").html("");
		$("#adjust_num_1").html("");
		$('#adjust_time_min_end').html(date_end_local.pattern("mm"));
		$('#adjust_time_arrow').hide();
		$('#adjust-time-num').hide();
		num_input_status = 0;
		check_conflict();
		set_button_focus(true,"adjust_button_confirm");
		return;
	}
	return;
}
function adjust_time_exit_num_input_mode (){
	if(num_input_status == 0){return;}
	/* first has no number */
	if(time_focus_id == "adjust_time_hour"){ 
		if ( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			$("#adjust_num_0").html(0);
			$("#adjust_num_1").html(value_0);
			$("#adjust_num_1").attr("class", "inputed_li");
			$("#adjust_num_0").attr("class", "inputed_li");
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			schedule_date_local.setHours(number); 
			$('#adjust_time_hour').html(schedule_date_local.pattern("HH"));
		}
	}
	if(time_focus_id == "adjust_time_min"){
		if ( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			$("#adjust_num_0").html(0);
			$("#adjust_num_0").attr("class", "inputed_li");
			$("#adjust_num_1").html(value_0);
			$("#adjust_num_1").attr("class", "inputed_li");
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			schedule_date_local.setMinutes(number); 
			$('#adjust_time_min').html(schedule_date_local.pattern("mm"));

		}
	}
	if(time_focus_id == "adjust_time_hour_end"){ 
		if ( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			$("#adjust_num_0").html(0);
			$("#adjust_num_1").html(value_0);
			$("#adjust_num_1").attr("class", "inputed_li");
			$("#adjust_num_0").attr("class", "inputed_li");
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			date_end.setHours(number); 
			date_end_local.setHours(number); 
			$('#adjust_time_hour_end').html(date_end_local.pattern("HH"));

		}
	}
	if(time_focus_id == "adjust_time_min_end"){
		if ( $("#adjust_num_1").hasClass("input_li") ){
			var value_0 = Number($("#adjust_num_0").html());
			$("#adjust_num_0").html(0);
			$("#adjust_num_0").attr("class", "inputed_li");
			$("#adjust_num_1").html(value_0);
			$("#adjust_num_1").attr("class", "inputed_li");
			number= Number($("#adjust_num_0").html() + $("#adjust_num_1").html());
			date_end.setMinutes(number); 
			date_end_local.setMinutes(number); 
			$('#adjust_time_min_end').html(date_end_local.pattern("mm"));
		}
	}
	$("#adjust_num_0").attr("class", "input_li");
	$("#adjust_num_1").attr("class", "input_li");
	$("#adjust_num_0").html("");
	$("#adjust_num_1").html("");
	check_conflict();
	$('#adjust-time-num').hide();
	num_input_status = 0;
	$('#adjust_time_arrow').show();
	return;
}
function manual_time_update_num_osd (value){
	if($('#time-num').css("display") == "none"){
		$("#time-num").show();
	}
	num_input_status = 1;
	var number = 0;
	/* first has no number */
	if(time_focus_id == "manual_time_hour"){ 
		$("#time-num").css("left","614px");
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
			if(value_0 == 1 ||
				value_0 == 0){
				$("#num_1").html(value);
				$("#num_1").attr("class", "inputed_li");
			}
			number= Number($("#num_0").html() + $("#num_1").html());
			//date_end.setHours(number); 
			schedule_date_local.setHours(number); 
			$("#num_0").attr("class", "input_li");
			$("#num_1").attr("class", "input_li");
			$("#num_0").html("");
			$("#num_1").html("");
			$('#time-num').hide();
			num_input_status = 0;
			$('#manual_time_hour').html(schedule_date_local.pattern("HH"));
			check_conflict();
			eval($('#'+time_focus_id).attr("move_right"));
			return;
		}
	}
	if(time_focus_id == "manual_time_min"){
	
		$("#time-num").css("left","714px");
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
		//date_end.setMinutes(number); 
		schedule_date_local.setMinutes(number); 
		$("#num_0").attr("class", "input_li");
		$("#num_1").attr("class", "input_li");
		$("#num_0").html("");
		$("#num_1").html("");
		$('#manual_time_min').html(schedule_date_local.pattern("mm"));
		$('#manual_time_arrow').hide();
		$('#time-num').hide();
		num_input_status = 0;
		check_conflict();
		eval($('#'+time_focus_id).attr("move_right"));
		return;
	}
	if(time_focus_id == "manual_time_hour_end"){ 
		$("#time-num").css("left","885px");
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
			if(value_0 == 1 ||
				value_0 == 0 ){
				$("#num_1").html(value);
				$("#num_1").attr("class", "inputed_li");
			}
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end_local.setHours(number); 
			$("#num_0").attr("class", "input_li");
			$("#num_1").attr("class", "input_li");
			$("#num_0").html("");
			$("#num_1").html("");
			$('#time-num').hide();
			num_input_status = 0;
			$('#manual_time_hour_end').html(date_end_local.pattern("HH"));
			check_conflict();
			eval($('#'+time_focus_id).attr("move_right"));
			return;
		}
	}
	if(time_focus_id == "manual_time_min_end"){
	
		$("#time-num").css("left","983px");
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
		date_end_local.setMinutes(number); 
		$("#num_0").attr("class", "input_li");
		$("#num_1").attr("class", "input_li");
		$("#num_0").html("");
		$("#num_1").html("");
		$('#manual_time_min_end').html(date_end_local.pattern("mm"));
		$('#manual_time_arrow').hide();
		$('#time-num').hide();
		num_input_status = 0;
		check_conflict();
		set_button_focus(true,"manual_time_button_confirm");
		return;
	}
	return;
}
function manual_time_exit_num_input_mode (){
	if(num_input_status == 0){return;}
	/* first has no number */
	if(time_focus_id == "manual_time_hour"){ 
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			$("#num_0").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			schedule_date_local.setHours(number); 
			$('#manual_time_hour').html(schedule_date_local.pattern("HH"));
		}
	}
	if(time_focus_id == "manual_time_min"){
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_0").attr("class", "inputed_li");
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			schedule_date_local.setMinutes(number); 
			$('#manual_time_min').html(schedule_date_local.pattern("mm"));

		}
	}
	if(time_focus_id == "manual_time_hour_end"){ 
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			$("#num_0").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end_local.setHours(number); 
			$('#manual_time_hour_end').html(date_end_local.pattern("HH"));

		}
	}
	if(time_focus_id == "manual_time_min_end"){
		$("#time-num").css("left","516px");
		if ( $("#num_1").hasClass("input_li") ){
			var value_0 = Number($("#num_0").html());
			$("#num_0").html(0);
			$("#num_0").attr("class", "inputed_li");
			$("#num_1").html(value_0);
			$("#num_1").attr("class", "inputed_li");
			number= Number($("#num_0").html() + $("#num_1").html());
			date_end_local.setMinutes(number); 
			$('#manual_time_min_end').html(date_end_local.pattern("mm"));
		}
	}
	$("#num_0").attr("class", "input_li");
	$("#num_1").attr("class", "input_li");
	$("#num_0").html("");
	$("#num_1").html("");
	check_conflict();
	$('#time-num').hide();
	num_input_status = 0;
	$('#manual_time_arrow').show();
	return;
}
function check_conflict() {
	/*check if have conflict*/
	recording_channel = [];
	if($('#dialog_adjust_time').css("display") != "none"){
		recording_channel.channel_id = record_list[selected].channel_id;
		recording_channel.SERVICE_NAME = record_list[selected].program_name;
	}
	else{
		recording_channel = manual_selected_channel;
	}
	var ret= compare_time(schedule_date_local,date_end_local);
	if(ret == false)
	{
		date_end_local = DateAdd("d",1,date_end_local);
	}
	var duration = (date_end_local - schedule_date_local)/1000;
	console.log('duration = ' + duration);
		/*convert local to utc*/
			/*calcute start time*/
	var res = obj_tvServices.getUtcTime();
	var ret = JSON.parse(res);
	var time = Number(ret.ITEMS[0].VALUE);
	var localTime = mtvObj.convertUtcToLocalTime(parseInt(time));
	var dst = localTime.DTG.DST;
	var month = schedule_date_local.getMonth() +1;
	res = obj_tvServices.convertLocalTimeToMillis('{"PARAMETER":{"DTG":{"YEAR":'+schedule_date_local.getFullYear()+',"MONTH":'+month+',"DAY":'+schedule_date_local.getDate()+',"WEEK":'+schedule_date_local.getDay()+',"HOUR":'+schedule_date_local.getHours()+',"MINUTE":'+schedule_date_local.getMinutes()+',"SECOND":'+schedule_date_local.getSeconds()+',"DST":'+dst+'},"REQUEST":"QUERY"}}');
	ret = JSON.parse(res);
	var start_time = ret.ITEMS[0].VALUE;
	start_time = new Date(start_time * 1000);
	rmdr_check_conflick(2,recording_channel,start_time,duration);
}
