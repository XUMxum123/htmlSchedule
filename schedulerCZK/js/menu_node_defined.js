window.NODE_TYPE_TXT     = 1;
window.NODE_TYPE_MENU    = 2;
window.NODE_TYPE_LEAF    = 3;
window.NODE_TYPE_ACTION  = 4;

window.FIRST_PLANE       = 0;
window.SECOND_PLANE      = 1;

window.DEBUG_ON          = 1;
window.DEBUG_OFF         = 0;

/*Struct*/
var Enable = 
{
	"name"       : "Enable",
	"id"         : "Enable",
	"parent"     : Schedule_Enable,
	"Type"       : NODE_TYPE_LEAF
};

var Disable = 
{
	"name"       : "Disable",
	"id"         : "Disable",
	"parent"     : Schedule_Enable,
	"Type"       : NODE_TYPE_LEAF
};

var Schedule_Enable = 
{
	"name"       : "Enable",
	"id"         : "Schedule_Switch",
	"parent"     : Add_Edit_Schedule,
	'showMode'   : 2,
	'acfgKey'    : 'g_misc__cust_picture_style',
	"cacheValue" : 0,
	"curValue"   : 0,
	"value"      : [Enable,Disable],
	"Type"       : NODE_TYPE_MENU
};

var Start_Time = 
{
	"name"       : "Start time",
	"id"         : "Start_time",
	"parent"     : Schedule_Time,
	"Type"       : NODE_TYPE_MENU
}

var End_Time = 
{
	"name"       : "End time",
	"id"         : "End_time",
	"parent"     : Schedule_Time,
	"Type"       : NODE_TYPE_MENU
}

var Schedule_Time = 
{
	"name"       : "Time",
	"id"         : "Schedule_Time",
	"parent"     : Add_Edit_Schedule,
	'showMode'   : 1,
	'acfgKey'    : 'g_misc__cust_sound_style',
	"cacheValue" : 0,
	"curValue"   : 3,
	"value"      : [Start_Time,End_Time],
	"Type"       : NODE_TYPE_MENU
};

var Channel_Setting = 
{
	"name"       : "Channel Setting",
	"id"         : "Channel_Setting",
	"parent"     : Schedule_Switch,
	'showMode'   : 1,
	"value"      : [Start_Time,End_Time],
	"Type"       : NODE_TYPE_MENU
};

var Feature_Setting = 
{
	"name"       : "Feature Setting",
	"id"         : "Feature_Setting",
	"parent"     : Schedule_Switch,
	"Type"       : NODE_TYPE_MENU
};

var Schedule_Switch = 
{
	"name"       : "Switch on/to",
	"id"         : "Schedule_Switch_On",
	"parent"     : Add_Edit_Schedule,
	'showMode'   : 1,
	'acfgKey'    : 'g_misc__cust_sound_style',
	"cacheValue" : 0,
	"curValue"   : 2,
	"value"      : [Channel_Setting,Feature_Setting],
	"Type"       : NODE_TYPE_MENU
};

var Recurrence_Once =
{
	"name"       : "Once",
	"id"         : "Recurrence_Once",
	"parent"     : Schedule_Recurrence,
	"Type"       : NODE_TYPE_MENU
};

var Recurrence_Weekly =
{
	"name"       : "Weekly",
	"id"         : "Recurrence_Weekly",
	"parent"     : Schedule_Recurrence,
	"Type"       : NODE_TYPE_MENU
};

var Schedule_Recurrence =
{
	"name"       : "Recurrence",
	"id"         : "Schedule_Recurrence",
	"parent"     : Add_Edit_Schedule,
	'showMode'   : 1,
	'acfgKey'    : 'g_misc__cust_sound_style',
	"cacheValue" : 0,
	"curValue"   : 4,
	"value"      : [Recurrence_Once,Recurrence_Weekly],
	"Type"       : NODE_TYPE_MENU
};

var Schedule_name =
{
	"name"		 : "Name",
	"id"         : "Schedule_Name",
	"hint"       : "Schedule Name",
	"parent"     : Add_Edit_Schedule,
	"Type"       : NODE_TYPE_TXT
};

var Schedule_Priority =
{
	"name"		 : "Priority",
	"id"         : "Schedule_Priority",
	"hint"       : "Schedule Priority",
	"parent"     : Add_Edit_Schedule,
	"Type"       : NODE_TYPE_TXT
};

var Schedule_Delete_Schedule = 
{
	"name"		 : "Delete Schedule",
	"id"         : "Schedule_Delete",
	"parent"     : Add_Edit_Schedule,
	"Type"       : NODE_TYPE_ACTION	
};

var Add_Edit_Schedule = 
{
	"name"       : "Add/Edit Schedule",
	'showMode'   : 0,
	'focusIndex' : 0,
	"value"      : [Schedule_Enable, Schedule_name, Schedule_Switch, Schedule_Time, Schedule_Recurrence, Schedule_Priority, Schedule_Delete_Schedule]
};