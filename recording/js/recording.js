var testTvServices = function () {
	this.status = -1;
	this.startPvr = function () {
		this.status = 1;
		return this.status;
	};
	this.stopPvr = function () {
		this.status = 0;
		return this.status;
	};
	this.getPvrErrorId = function () {
		this.status = 0;
		return this.status;
	};
	this.getPvrStatus = function () {
	this.status = 0;
	return this.status;
	};
};
var obj_tvServices = new (function() {
	this.service = null;
	this.getService = function (){
			try {
					this.service = new utility();
			} catch(e) {
					console.log("error create utility.");
					console.log(e);
					this.service = new testTvServices();
			}
			return this.service;
		};
	this.startPvr = function () {
		var svc = this.getService();
		if (svc)
			return svc.startPvr();
		return -1;
	}
	this.stopPvr = function () {
		var svc = this.getService();
		if (svc)
			return svc.stopPvr();
		return -1;
	};
	this.getPvrErrorId = function () {
	var svc = this.getService();
	if (svc)
		return svc.getPvrErrorId();
	return -1;
	};
	this.getPvrStatus = function () {
	var svc = this.getService();
	if (svc)
		return svc.getPvrStatus();
	return -1;
	};
});

function button_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
    var content = document.getElementById(id);
    focus_id = id;
    if (isfocus) {
       $($($('#'+id).find('.btn_left')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Left.png');
       $($($('#'+id).find('.btn_center')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Center.png');
       $($($('#'+id).find('.btn_right')).find('img')).attr("src", 'res/_Button_OK/But_HL_Blue_Right.png');
    } else {
       $($($('#'+id).find('.btn_left')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Left.png');
      $($($('#'+id).find('.btn_center')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Center.png');
       $($($('#'+id).find('.btn_right')).find('img')).attr("src", 'res/_Button_OK/But_Normal_Right.png');
    }
}
 function startPvr() {
 	 console.log('startPvr');
	//var obj_tvServices =new;
	var result=0 ;
	$('#dialog_notification_1line_recording').show();
	$('#notification_content_text').html( "recording is starting");
	result = obj_tvServices.startPvr();
	console.log('result = obj_tvServices.startPvr()');
	if(result == 0){
		$('#notification_content_text').html( "recording is started");
		setTimeout(function() {$('#dialog_notification_1line_recording').css("display" , "none");},5000);
		$('#recording_start_icon').show();
	}
	else{
		var error_id =0;
		error_id = obj_tvServices.getPvrErrorId();
		$('#notification_content_text').html( 'recording is failed,error id is' + error_id );
		//setTimeout(function() {$('#dialog_notification_1line_recording').css("display" , "none");},5000);
	}
} 
 function stopPvr() {
	//var obj_tvServices;
	var recording = obj_tvServices.getPvrStatus();
	if(recording == true){
		result = obj_tvServices.stopPvr();
		if(result == 0)
		{
			$('#notification_content_text').html("recording is stoped");
			$('#recording_start_icon').hide();
		}
		else
		{
			$('#notification_content_text').html("recording stop failed,error id is +'result' ");
		}
	}
} 
