var g_mtvObj;

var g_newScheduleTxt="+New Schedule";
var g_allSchedulerInfo= [
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
	{
	"FOCUS":0,
	"NAME": "",
	"START_HOUR": 0,
	"START_MINUTE": 0,
	"END_HOUR": 0,
	"END_MINUTE": 0,
	"RECURRENCE_MODE": "Weekly",//"Once" "Weekly"
	"WEEK": [0,0,0,0,0,0,0],// 0:mon 1:Tue ..6:sun, value 1 is to show, value 0 not show
	"CHANNEL": "", 
	"URL": ""
	},
];
var g_SchedulerInfoCount=0;
var g_SchedulerListCnt=0;
var g_expandTimeOut=null;
var g_scollFontTimer=null;
var g_expandItemIndex=-1;
var g_willExpandItemIndex=0;
var g_focusItemIndex=-1;
var g_bItemExpand=false;
var g_preFocusItemIndex=-1;
var g_beginIndex=0;

function MenuInit() {

/*	    
	g_mtvObj = new MtvObj();

	g_mtvObj_1 = new InputSource();
	utilInit(g_mtvObj);
	*/
	// //var lang = g_mtvObj.getUILang();   
	// //var country = g_mtvObj.getCurrentCountry();
	g_beginIndex=0;
	initGridRowColArray();
	initSchedulerContent();

}

function MenuClose() {
    

}

/*
function getCurrentTime() {

	var utcTime = g_mtvObj.getUserUtcTime();
	if (utcTime == 0) 
	{
		var utcTime = Date.UTC(2015, 11, 20, 22, 59, 00, 000); 
		utcTime = (utcTime/1000);
	}
	// Display Current Broadcast UTC time
	var timeInfo = utilConvertUtcToLocalTime(utcTime);
	var week = utilGetWeek(timeInfo);
	var dat  = utilGetDay(timeInfo);
	var month= utilGetMonth(timeInfo);
	var hh   = utilGetHours(timeInfo);
	var mm   = utilGetMinutes(timeInfo);
	var year = utilGetYear(timeInfo);

	var week_str  = getDayString(week);
	var month_str = getMonthString(month-1);
	        
	var res = sprintf("%s %d %s %d", week_str, dat, month_str, year);

}
*/  


/*TODO: need  read setting*/
function initGridRowColArray() {
	
	g_SchedulerInfoCount=9;
	if(g_SchedulerInfoCount<10)
	{
		g_allSchedulerInfo[g_SchedulerInfoCount].NAME=g_newScheduleTxt;
		g_SchedulerInfoCount++;
	}

	for(var i=0;i<9;i++)
	{
		g_allSchedulerInfo[i].NAME="Play now"+i;
		g_allSchedulerInfo[i].START_HOUR=9;
		g_allSchedulerInfo[i].START_MINUTE=0;
		g_allSchedulerInfo[i].END_HOUR=12;
		g_allSchedulerInfo[i].END_MINUTE=0;
		g_allSchedulerInfo[i].RECURRENCE_MODE="Weekly";
		g_allSchedulerInfo[i].WEEK=[1,1,1,1,1,1,0];
		g_allSchedulerInfo[i].CHANNEL="channel test1";
		g_allSchedulerInfo[i].URL="url test1";
	}
	
	g_allSchedulerInfo[0].NAME="SalesSchedule";
	g_allSchedulerInfo[0].START_HOUR=8;
	g_allSchedulerInfo[0].START_MINUTE=0;
	g_allSchedulerInfo[0].END_HOUR=17;
	g_allSchedulerInfo[0].END_MINUTE=0;
	g_allSchedulerInfo[0].RECURRENCE_MODE="Weekly";
	g_allSchedulerInfo[0].WEEK=[1,1,1,1,1,1,0];
	g_allSchedulerInfo[0].CHANNEL="channel test0";
	g_allSchedulerInfo[0].URL="url test0";

	g_allSchedulerInfo[1].NAME="Play now";
	g_allSchedulerInfo[1].START_HOUR=9;
	g_allSchedulerInfo[1].START_MINUTE=0;
	g_allSchedulerInfo[1].END_HOUR=12;
	g_allSchedulerInfo[1].END_MINUTE=0;
	g_allSchedulerInfo[1].RECURRENCE_MODE="Weekly";
	g_allSchedulerInfo[1].WEEK=[1,1,1,1,1,1,0];
	g_allSchedulerInfo[1].CHANNEL="channel test1";
	g_allSchedulerInfo[1].URL="url test1";
	
   
}


/* Update channel list, event duration time is 2 hours */
function schedulerUpdateLeftList(rowStart,rowEnd,beginIndex) 
{
	var target = $("#schedule_left_list");
	var item   = target;
	var ci_1;
	var rowCnt=0;

	if(rowStart<0 || rowEnd<0 || beginIndex<0)
	{
		return;
	}

	/* clean all items */
	target.html("");
	//console.log("length=",g_allSchedulerInfo[0].NAME.length);

	for (var i=rowStart; i < rowEnd; i++) 
	{

		if (rowCnt >= 8) 
		{
		    break;
		}
		if (null == item) 
		{
		    item = $('<div style="position:absolute; left:0px; top:230px; width:220px; heigth:500px;"/>');
		}   

		//var card = $('<div class="row-fluid channel-show-grid"> </div>');

		if(g_allSchedulerInfo[i+beginIndex].FOCUS == 1)
		{
			//if(g_allSchedulerInfo[i+beginIndex].NAME.length>20)
			//{
			//	ci_1 = $('<div id="left_schedule_name'+i+'" class="leftfont" style="color: #76D7D6";width:210px;> <marquee scrollamount="5" width="210">'+g_allSchedulerInfo[i+beginIndex].NAME+' </marquee></div>');
			//}
			//else
			//{
				ci_1 = $('<div id="left_schedule_name'+i+'" class="leftfont" style="color: #76D7D6;width:210px;overflow: hidden;"> '+g_allSchedulerInfo[i+beginIndex].NAME+' </div>');
			//}
		}
		else
		{
			//if(g_allSchedulerInfo[i+beginIndex].NAME.length>20)
			//{
			//	ci_1 = $('<div id="left_schedule_name'+i+'" class="leftfont" style="color: #FFFFFF;width:210px;"><marquee scrollamount="8" width="210">'+g_allSchedulerInfo[i+beginIndex].NAME+' </marquee></div>');
			//}
			//else
			//{
				ci_1 = $('<div id="left_schedule_name'+i+'" class="leftfont" style="color: #FFFFFF;width:210px;overflow: hidden;">'+g_allSchedulerInfo[i+beginIndex].NAME+' </div>');
			//}
		}
		//card.appendTo(item); 
		//ci_1.appendTo(card); 
		ci_1.appendTo(item); 
		rowCnt++;
	}

	if (null != item)
		item.appendTo(target);
	
	its = target.find(".schedule_left_list");
	
	if (its.length > 0)
		$(its[0]).addClass("active");    
	
}



function schedulerUpdateEventPage(rowStart,rowEnd,beginIndex)
{
    
	var target = $("#schedule_right_list");

	if(rowStart<0 || rowEnd<0 || beginIndex<0)
	{
		return;
	}

	target.html("");/* clean all items */
	if (null == target) 
	{
		target = $('<div  style="position:absolute; left:0px; top:210px; width:992px; heigth:500px;"/>');
	}
	for (var i = rowStart; i < rowEnd; i++)
	{
		schedulerDrawEventListUI($("#schedule_right_list"), 7, i,beginIndex);
	}   
}


function schedulerDrawEventListUI(target, evtCount, rowIdx,beginIndex) 
{
	var item;
	var item_scheduler;
	var col_w   = 145;
	var rowIdx_tmp=rowIdx;

	rowIdx=rowIdx+beginIndex;
	var event_row = $('<div id="row'+rowIdx_tmp+'" class="eventrow"> </div>');
	event_row.appendTo(target);

	if(rowIdx_tmp ==g_expandItemIndex)
	{
		var duration,duration_tmp,duration_hour,duration_minute;
		var channel,url;
		var start_time = sprintf("Start Time: %02d:%02d", g_allSchedulerInfo[rowIdx].START_HOUR, g_allSchedulerInfo[rowIdx].START_MINUTE);
		var end_time = sprintf("End Time: %02d:%02d", g_allSchedulerInfo[rowIdx].END_HOUR, g_allSchedulerInfo[rowIdx].END_MINUTE);

		if(g_allSchedulerInfo[rowIdx].END_HOUR<g_allSchedulerInfo[rowIdx].START_HOUR)
		{
			duration_tmp=((g_allSchedulerInfo[rowIdx].END_HOUR+24)*60+g_allSchedulerInfo[rowIdx].END_MINUTE)-(g_allSchedulerInfo[rowIdx].START_HOUR*60+g_allSchedulerInfo[rowIdx].START_MINUTE);
		}
		else
		{
			duration_tmp=(g_allSchedulerInfo[rowIdx].END_HOUR*60+g_allSchedulerInfo[rowIdx].END_MINUTE)-(g_allSchedulerInfo[rowIdx].START_HOUR*60+g_allSchedulerInfo[rowIdx].START_MINUTE);
		}

		duration_hour = duration_tmp/60;
		duration_minute= duration_tmp%60;
		duration= sprintf("Duration: %d hrs %d mins",duration_hour, duration_minute);

		var recurrence=sprintf("Recurrence: %s",g_allSchedulerInfo[rowIdx].RECURRENCE_MODE);

		if(g_allSchedulerInfo[rowIdx].CHANNEL.length ==0)
		{
			channel= sprintf("Channel: None");
		}
		else
		{
			channel=sprintf("Channel: %s",g_allSchedulerInfo[rowIdx].CHANNEL);
		}

		if(g_allSchedulerInfo[rowIdx].URL.length ==0)
		{
			url= sprintf("URL: None");
		}
		else
		{
			url=sprintf("URL: %s",g_allSchedulerInfo[rowIdx].URL);
		}


		var event_new = $('<div id="row_detail'+rowIdx_tmp+'" class="eventrow" style="height:118px;background-color:#76D7D6;"> '
		+'<ul><li id="name_detail'+rowIdx_tmp+'" class="detailfont" style="list-style-type:none;float:left;margin-left:20px;font-weight:bold;width:300px;overflow: hidden;">'+g_allSchedulerInfo[rowIdx].NAME+'</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px">'+recurrence +'</li>'
		+'<li class="detailfont" style="list-style-type:none;float:left; width:300px;">'+channel+'</li>'

		+'<li class="detailfont" style="list-style-type:none; float:left;margin-left:20px;width:300px">'+start_time+'</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px">&nbsp;</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px">'+url+'</li>'

		+'<li class="detailfont" style="list-style-type:none; float:left;margin-left:20px;width:300px">'+end_time+'</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px"> &nbsp;</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px"> &nbsp;</li>'

		+'<li class="detailfont" style="list-style-type:none; float:left;margin-left:20px;width:300px">'+duration+'</li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px"> &nbsp; </li>'
		+'<li class="detailfont" style="list-style-type:none; float:left;width:300px"> &nbsp; </li></ul>'
		+'</div>');

		event_new.appendTo(target);
	}

	for (var i=0; i<evtCount; i++) 
	{                                              
		if (col_w != 0) 
		{
			item = $('<div id="col'+rowIdx_tmp+''+i+'" class="eventcol" style="width:'+col_w+'px;"></div>'); 

			if(g_allSchedulerInfo[rowIdx].WEEK[i]==1)
			{
				var mar_lef;
				var row_width;
				mar_lef=((g_allSchedulerInfo[rowIdx].START_HOUR*60+g_allSchedulerInfo[rowIdx].START_MINUTE)*col_w)/(24*60);
				row_width=(((g_allSchedulerInfo[rowIdx].END_HOUR*60+g_allSchedulerInfo[rowIdx].END_MINUTE)-(g_allSchedulerInfo[rowIdx].START_HOUR*60+g_allSchedulerInfo[rowIdx].START_MINUTE))*col_w)/(24*60);
				if(g_allSchedulerInfo[rowIdx].FOCUS == 1)
				{
					item_scheduler = $('<div id="col_scheduler'+rowIdx_tmp+''+i+'" class="eventcol1" style="width:'+row_width+'px; margin-left:'+ mar_lef+'px;background-color:#76D7D6;"></div>'); 
				}
				else
				{
					item_scheduler = $('<div id="col_scheduler'+rowIdx_tmp+''+i+'" class="eventcol1" style="width:'+row_width+'px; margin-left:'+ mar_lef+'px;"></div>'); 
				}
				item_scheduler.appendTo(item);
			}

		item.appendTo(event_row);

		}

	}

}

function updateLineTime()
{
	var cnt=g_SchedulerListCnt;
	var pos=262;
	var mydate=new Date();
	var myhours=mydate.getHours();
	var myminutes=mydate.getMinutes();
	var myday=mydate.getDay();
	if(myday ==0)//1<->7 mon<->sun
	{
		myday=7;
	}
	myday=myday-1;
	
	pos = pos+myday*145;
	pos= pos+((myhours*60+myminutes)*145)/(24*60);

	if(g_bItemExpand == true)
	{
		if(g_SchedulerListCnt>6)
		{
			cnt=6;
		}
		document.getElementById("time_line").style.height =  59+cnt*59+118+'px';
	}
	else
	{
		document.getElementById("time_line").style.height =  59+g_SchedulerListCnt*59+'px';//130+60*N
	}
	$("#time_line").offset({left:pos});
	$("#indicator_text").offset({left:pos-22}); 
	$("#indicator").offset({left:pos-18});

	var time_str = sprintf("%02d:%02d", myhours, myminutes);
	document.getElementById("indicator_text").innerText = time_str;
}

function ScheduleItemExpand(item,bExpand,beginIndex)
{
	if(bExpand == true)
	{
		var cnt=g_SchedulerListCnt;
		g_bItemExpand=true;

		if(g_SchedulerListCnt>6)
		{
			cnt=6;
		}

		g_expandItemIndex=item;

		if(item>=6)
		{
			beginIndex= beginIndex+(item-5);
			item=5;
			g_expandItemIndex=5;
		}

		schedulerUpdateLeftList(0,cnt,beginIndex);
		schedulerUpdateEventPage(0,cnt,beginIndex);

		document.getElementById("time_line").style.height =  59+cnt*59+118+'px';
		document.getElementById("left_schedule_name"+item).style.height="180px";
		document.getElementById("left_schedule_name"+item).style.width="210px";

		if(g_allSchedulerInfo[item+beginIndex].NAME.length>20)
		{
			var obj=document.getElementById("name_detail"+item);
			startScollFont(obj);
		}

	}
	else
	{
		g_bItemExpand=false;
		g_expandItemIndex=-1;
		schedulerUpdateLeftList(0,g_SchedulerListCnt,beginIndex); 
		schedulerUpdateEventPage(0,g_SchedulerListCnt,beginIndex);
		document.getElementById("left_schedule_name"+item).style.height="55px";
		document.getElementById("left_schedule_name"+item).style.width="210px";
		document.getElementById("time_line").style.height =  59+g_SchedulerListCnt*59+'px';
		stopScollFont();
	}
}

function _scroll(obj) 
{  
	var tmp=obj.scrollLeft;
	(obj.scrollLeft)++;   

	if (tmp == obj.scrollLeft) 
	{  
		obj.scrollLeft = 0;  
	}  

}  

var g_scrollObj;
function startScollFont(obj) 
{  
	stopScollFont();
	g_scrollObj=obj;
	g_scollFontTimer = setInterval("_scroll(g_scrollObj)", 30);  
}  

function stopScollFont()
{  
	if (g_scollFontTimer != null) 
	{  
	    clearInterval(g_scollFontTimer);  
		g_scrollObj.scrollLeft = 0;
		g_scollFontTimer=null;
	}  
	
}  
	
function focusScheduleItem(item,bFocus,beginIndex)
{
	if(item<0 || item>=10 || beginIndex<0)
	{
		return;
	}

	for(var i=0;i<g_SchedulerInfoCount;i++)
	{
		g_allSchedulerInfo[i].FOCUS = 0;
	}
	if(bFocus == true)
	{
		g_allSchedulerInfo[item+beginIndex].FOCUS = 1;

		var left_schedule_name=document.getElementById("left_schedule_name"+item);
		if(left_schedule_name)
		{
			
			
			g_focusItemIndex=item;
			left_schedule_name.style.color ="#76D7D6";
			for (var i=0; i<7; i++) 
			{                    
				if(g_allSchedulerInfo[item+beginIndex].WEEK[i]==1)
				{
					document.getElementById("col_scheduler"+item+i).style.backgroundColor ="#76D7D6";
				}
			}
			
			if(g_allSchedulerInfo[item+beginIndex].NAME.length>20)
			{
				//overflow: hidden;  
				//document.getElementById("col_scheduler"+item+i).style.overflow ='hidden';
				startScollFont(left_schedule_name);
			}
		}

	}
	else
	{

		var left_schedule_name=document.getElementById("left_schedule_name"+item);
		
		if(left_schedule_name)
		{
			if(g_allSchedulerInfo[item+beginIndex].NAME.length>20)
			{
				stopScollFont();
			}
			
			g_focusItemIndex=-1;
			left_schedule_name.style.color ="#FFFFFF";
			for (var i=0; i<7; i++) 
			{                    
				if(g_allSchedulerInfo[item+beginIndex].WEEK[i]==1)
				{
					document.getElementById("col_scheduler"+item+i).style.backgroundColor ="#666666";
				}
			}

		}
	}

}
	
function initSchedulerContent() 
{
	
	if(g_SchedulerInfoCount>=8)
	{
		g_SchedulerListCnt=8;
	}
	else if(g_SchedulerInfoCount<8 && g_SchedulerInfoCount>=0)
	{
		g_SchedulerListCnt=g_SchedulerInfoCount;
	}

	schedulerUpdateLeftList(0,g_SchedulerListCnt,0);   
	schedulerUpdateEventPage(0,g_SchedulerListCnt,0);
	updateLineTime();

	setInterval(function(){ 
	updateLineTime();
	},60000);
	
}	
    	 


function HandleUpDownKey(keycode,updateUI) 
{
	var bExpand=false;
	if (g_expandTimeOut) 
	{   
		if(!((g_allSchedulerInfo[g_focusItemIndex+g_beginIndex].NAME == g_newScheduleTxt||(g_preFocusItemIndex+1) ==g_SchedulerInfoCount) &&  keycode == KeyEvent.DOM_VK_DOWN))
		{
			clearTimeout(g_expandTimeOut);            
			g_expandTimeOut = null; 
		}
	}

	if(g_expandItemIndex>=0)
	{
		if(!((g_allSchedulerInfo[g_focusItemIndex+g_beginIndex].NAME == g_newScheduleTxt||(g_preFocusItemIndex+1) ==g_SchedulerInfoCount) &&  keycode == KeyEvent.DOM_VK_DOWN))
		{
			ScheduleItemExpand(g_expandItemIndex,false,g_beginIndex);
		}
	}
	if(g_focusItemIndex>=0)
	{
		if(!((g_allSchedulerInfo[g_focusItemIndex+g_beginIndex].NAME == g_newScheduleTxt||(g_preFocusItemIndex+1) ==g_SchedulerInfoCount) &&  keycode == KeyEvent.DOM_VK_DOWN))
		{
			focusScheduleItem(g_focusItemIndex,false,g_beginIndex);
		}
	}
	if (keycode == KeyEvent.DOM_VK_DOWN)
	{
		if((g_preFocusItemIndex+1)<g_SchedulerInfoCount)
		{
			g_preFocusItemIndex++;
			if(g_preFocusItemIndex<=7)
			{
				g_beginIndex=0;
				if(updateUI == true)
				{
					schedulerUpdateLeftList(0,g_SchedulerListCnt,g_beginIndex);   
					schedulerUpdateEventPage(0,g_SchedulerListCnt,g_beginIndex);
				}
				focusScheduleItem(g_preFocusItemIndex,true,g_beginIndex);
				g_willExpandItemIndex=g_preFocusItemIndex;
				if(g_allSchedulerInfo[g_preFocusItemIndex].NAME != g_newScheduleTxt)
				{
					bExpand=true;
				}
			}
			else if(g_preFocusItemIndex>7)
			{
				g_beginIndex=g_preFocusItemIndex -7;
				schedulerUpdateLeftList(0,8,g_beginIndex);   
				schedulerUpdateEventPage(0,8,g_beginIndex);
				focusScheduleItem(7,true,g_beginIndex);
				g_willExpandItemIndex=7;
				if(g_allSchedulerInfo[7+g_beginIndex].NAME != g_newScheduleTxt)
				{
					bExpand=true;
				}
			}
		}


	}
	else if (keycode == KeyEvent.DOM_VK_UP)
	{
		if(g_preFocusItemIndex>=0)
		{
			g_preFocusItemIndex --;
			if(g_preFocusItemIndex<7)
			{
				g_beginIndex=0;
				if(updateUI == true)
				{
					schedulerUpdateLeftList(0,g_SchedulerListCnt,g_beginIndex);   
					schedulerUpdateEventPage(0,g_SchedulerListCnt,g_beginIndex);
				}
				focusScheduleItem(g_preFocusItemIndex,true,g_beginIndex);
				g_willExpandItemIndex=g_preFocusItemIndex;
			}
			else if(g_preFocusItemIndex>=7)
			{
				g_beginIndex=g_preFocusItemIndex -7;
				schedulerUpdateLeftList(0,8,g_beginIndex);   
				schedulerUpdateEventPage(0,8,g_beginIndex);
				focusScheduleItem(7,true,g_beginIndex);
				g_willExpandItemIndex=7;
			}

			if(g_preFocusItemIndex>=0)
			{
				bExpand=true;
			}
		}

	}

	if(bExpand)
	{
		g_expandTimeOut=window.setTimeout(function(){ 
		ScheduleItemExpand(g_willExpandItemIndex,true,g_beginIndex);
		},5000);
	}


}


function HandleInfoKey() 
{
	if(g_focusItemIndex>=0 && g_bItemExpand == false)
	{
		if (g_expandTimeOut) 
		{   
			clearTimeout(g_expandTimeOut);            
			g_expandTimeOut = null; 
		}
	ScheduleItemExpand(g_willExpandItemIndex,true,g_beginIndex);

	}
}

/*TODO: need call out Add/Edit UI*/
function HandleOptionKey() 
{
	if(g_focusItemIndex>=0)
	{
		console.log("g_focusItemIndex,g_beginIndex",g_focusItemIndex,g_beginIndex);	
	}
}

/*TODO: need save the setting*/
function HandleYellowKey() ///MOVE_UP
{
	var index=g_focusItemIndex+g_beginIndex;
	if(g_allSchedulerInfo[index].NAME == g_newScheduleTxt)
	{
		return;
	}
	if((g_focusItemIndex)>0)
	{
		var info;
		info=g_allSchedulerInfo[index-1];
		g_allSchedulerInfo[index-1]=g_allSchedulerInfo[index];
		g_allSchedulerInfo[index]=info;

		HandleUpDownKey(KeyEvent.DOM_VK_UP,true);
		
	}
}

/*TODO: need save the setting*/
function HandleBlueKey() ///MOVE_DOWN
{
	var index=g_focusItemIndex+g_beginIndex;
	if(index<(g_SchedulerInfoCount-1))
	{
		if(g_allSchedulerInfo[index+1].NAME == g_newScheduleTxt)
		{
			return;

		}
		var info;
		info=g_allSchedulerInfo[index+1];
		g_allSchedulerInfo[index+1]=g_allSchedulerInfo[index];
		g_allSchedulerInfo[index]=info;

		HandleUpDownKey(KeyEvent.DOM_VK_DOWN,true);
		
	}

}

function HandleOkKey() 
{
	var index=g_focusItemIndex+g_beginIndex;
	if(g_allSchedulerInfo[index].NAME == g_newScheduleTxt)
	{
		/*TODO: need call out Add/Edit UI*/
	}
	else if(g_focusItemIndex>=0)
	{

	}
}

function KeyHandler(kc) {
    
        
    switch (kc) {
    case KeyEvent.DOM_VK_EXIT:        
    case KeyEvent.DOM_VK_BACK:
          MenuClose();
        break;
    case KeyEvent.DOM_VK_UP:
    case KeyEvent.DOM_VK_DOWN:
        HandleUpDownKey(kc,false);
        break;
    case KeyEvent.DOM_VK_LEFT:
    case KeyEvent.DOM_VK_RIGHT:
		
        break;
    case KeyEvent.DOM_VK_ENTER:
    case KeyEvent.DOM_VK_RETURN:
		HandleOkKey();
        break;
    case KeyEvent.DOM_VK_YELLOW://MOVE_UP
		HandleYellowKey();
        break;
    case KeyEvent.DOM_VK_BLUE://MOVE_DOWN
		HandleBlueKey();
        break;   
        
    case KeyEvent.DOM_VK_INFO:
		HandleInfoKey();
        break;   
                                            
    case KeyEvent.DOM_VK_OPTION:
		HandleOptionKey();
        break;
            
    default:
        break;                                                                              
    }
    
    return true;
}


