
var Features_Apps_Mode=
{
 "name":"Mode",
 "id":"Features_Apps",
 "selected":0,
 "listitem":[["Off","a"]],
};
var Features_Apps_Manage=
{
 "name":"Manage",
 "id":"Features_Apps_Manage"
};
var Features_Apps_SmartTVMode=
{
 "name":"SmartTV Mode",
 "id":"Features_Apps_SmartTVMode",
 "selected":0,
 "listitem":[["Default","a"],["Profile","b"]],
};
var AppcontrolID=
{
 "name":"Appcontrol ID",
 "id":"AppcontrolID",
};
var ProfileName=
{
 "name":"Profile Name",
 "id":"ProfileName",
};
var LocationID=
{
 "name":"Location ID",
 "id":"LocationID",
};

var Features_Apps_ProfileSettings=
{
 "name":"Profile Settings",
 "id":"Features_Apps_ProfileSettings",
 "item":[AppcontrolID,ProfileName,LocationID],
};


var Features_Apps_SmartTVSettings=
{
 "name":"SmartTV Apps Settings",
 "id":"Features_Apps_SmartTVSettings",
 "item":[Features_Apps_SmartTVMode,Features_Apps_ProfileSettings],
};
var Features_Apps=
{
 "name":"Apps",
 "id":"Features_Apps",
 "item":[Features_Apps_Mode,Features_Apps_Manage,Features_Apps_SmartTVSettings],
};
var Features_WeatherApp=
{
 "name":"Weather App",
 "id":"Features_WeatherApp",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Features_ThemeTV_Enable=
{
 "name":"Enable",
 "id":"Features_ThemeTV_Enable",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Features_ThemeTV_Manage=
{
 "name":"Manage",
 "id":"Features_ThemeTV_Manage",
};
var Features_ThemeTV=
{
 "name":"ThemeTV",
 "id":"Features_ThemeTV",
"item":[Features_ThemeTV_Enable,Features_ThemeTV_Manage],
};
var Features_SmartInfo_Mode=
{
 "name":"Mode",
 "id":"Features_SmartInfo_Mode",
 "selected":0,
 "listitem":[["Off","a"],["Browser","b"]],
};
var Features_Browsersettings_Source=
{
 "name":"Source",
 "id":"Features_Browsersettings_Source",
 "selected":0,
 "listitem":[["Local","a"],["Server","b"]],
};
var Features_Browsersettings_ServerURL=
{
 "name":"Server URL",
 "id":"Features_Browsersettings_ServerURL",
};
var Features_Browsersettings=
{
 "name":"Browser settings",
 "id":"Features_Browsersettings",
 "item":[Features_Browsersettings_Source,Features_Browsersettings_ServerURL],
};
var Features_SmartInfo=
{
 "name":"SmartInfo",
 "id":"Features_SmartInfo",
 "item":[Features_SmartInfo_Mode,Features_Browsersettings],
};
var Features_WelcomeLogo_Enable=
{
 "name":"Enable",
 "id":"Features_WelcomeLogo_Enable",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Features_WelcomeLogo_Timeout=
{
 "name":"Timeout",
 "id":"Features_WelcomeLogo_Timeout",
};
var Features_WelcomeLogo=
{
 "name":"Welcome Logo",
 "id":"Features_WelcomeLogo",
 "item":[Features_WelcomeLogo_Enable,Features_WelcomeLogo_Timeout],
};
var Features_USBAutoPlay=
{
 "name":"USB Auto Play",
 "id":"Features_USBAutoPlay",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Features_USBMediaBrowser_Enable=
{
 "name":"Enable",
 "id":"Features_USBMediaBrowser_Enable",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Features_USBbreakin=
{
 "name":"USB break-in",
 "id":"Features_USBbreakin",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Features_USBMediaBrowser=
{
 "name":"USB Media Browser",
 "id":"Features_USBMediaBrowser",
 "item":[Features_USBMediaBrowser_Enable,Features_USBbreakin],
};
var Features_Scheduler_Enable=
{
 "name":"Enable",
 "id":"Features_Scheduler_Enable",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Features_Scheduler_Manage=
{
 "name":"Manage",
 "id":"Features_Scheduler_Manage",
};
var Features_Scheduler=
{
 "name":"Scheduler",
 "id":"Features_Scheduler",
 "item":[Features_Scheduler_Enable,Features_Scheduler_Manage],
};
var Features=
{
 "name":"Features",
 "id":"features",
 "item":[Features_Apps,Features_WeatherApp,Features_ThemeTV,Features_SmartInfo,Features_WelcomeLogo,Features_USBAutoPlay,Features_USBMediaBrowser,Features_Scheduler],
};