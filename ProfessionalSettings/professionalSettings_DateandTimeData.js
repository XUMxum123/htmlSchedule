var Time_Sources=
{
 "name":"Source",
 "id":"Time_Sources",
 "selected":0,
 "listitem":[["Automatic Channels","a"],["Automatic NTP","b"],["Manual","c"]],
};
var Time_SourcesChannel=
{
 "name":"Source Channel",
 "id":"Time_SourcesChannel",
 "selected":0,
 "listitem":[["CCTV 1","a"],["CCTV 2","b"],["CCTV 3","c"],["CCTV 4","d"],["CCTV 5","e"]],
};
var NTPSettings_Source=
{
 "name":"NTP Source",
 "id":"NTPSettings_Source",
 "selected":0,
 "listitem":[["Default","a"],["Custom NTP Server","b"]],
};

var NTPSettings_ServerURL=
{
 "name":"Custom NTP Server URL",
 "id":"NTPSettings_ServerURL",
};
var Time_NTPSettings=
{
 "name":"NTP Settings",
 "id":"Time_NTPSettings",
  "item":[NTPSettings_Source,NTPSettings_ServerURL],
};
var Time_ManualSettings_Date=
{
 "name":"Date",
 "id":"Time_ManualSettings_Date",
};
var Time_ManualSettings_Time=
{
 "name":"Time",
 "id":"Time_ManualSettings_Time",
};
var Time_ManualSettings=
{
 "name":"Manual Date and Time Settings",
 "id":"Time_ManualSettings",
 "item":[Time_ManualSettings_Date,Time_ManualSettings_Time],
};

var Time_TimeZoneSettings_Region=
{
 "name":"Time Zone Region",
 "id":"Time_TimeZoneSettings_Region",
 "selected":0,
 "listitem":[["USA","a"],["Cannary Island","b"],["Western Australia","c"]],
};
var Time_TimeZoneSettings=
{
 "name":"Time Zone Settings",
 "id":"Time_TimeZoneSettings",
 "item":[Time_TimeZoneSettings_Region],
};
var Time_Daylight=
{
 "name":"Automatic Daylight Savings",
 "id":"Time_Daylight",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Time_Timeoffset=
{
 "name":"Time offset",
 "id":"Time_Timeoffset",
};
var Time_ClockFormat=
{
 "name":"Clock Format",
 "id":"Time_ClockFormat",
 "selected":0,
 "listitem":[["24 hour","a"],["AM/PM","b"]],
};
var DateAndTime=
{
 "name":"Date and Time",
 "id":"Date_and_Time",
 "item":[Time_Sources,Time_SourcesChannel,Time_NTPSettings,Time_ManualSettings,Time_TimeZoneSettings,Time_Daylight,Time_Timeoffset,Time_ClockFormat],
};