
var obj_tv = getTvJspService();
var obj_tvServices = obj_tv.tvServices;
function get_recording_url(){
    return get_base_url() + "recording/recording.html";
}
$(document).on("keydown", function (evt) {
   var key = evt.which || evt.keyCode;
   if (key == KeyEvent.DOM_VK_STOP) {
		var res = obj_tvServices.getPvrReminderEvent('{"PARAMETER":{"operation":4,"REQUEST":"QUERY"}}');
		var ret = JSON.parse(res);
		var  recording =parseInt(ret.ITEMS[0].is_recording);
		 if(recording  == 1){
				//window.location =  get_recording_url()+'?stop_recording=true';
				mtvuiUtil.gotoSysPage("sys_program_record",'stop_recording=true');
		 }
	   return false;
   }
});
