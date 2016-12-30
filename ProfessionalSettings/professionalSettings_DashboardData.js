

var Dashboard_Mode=
{
 "name":"Mode",
 "id":"Dashboard_Mode",
 "selected":0,
 "listitem":[["Default","a"],["Custom","b"]],
};
var Dashboard_DefaultSettings=
{
 "name":"Default Settings",
 "id":"Dashboard_DefaultSettings",
 "selected":0,
 "listitem":[["Side Dashboard","a"],["FullScreen Dashboard","b"]],
};


var Dashboard_CustomSettings_Source=
{
 "name":"Source",
 "id":"Dashboard_CustomSettings_Source",
 "selected":0,
 "listitem":[["Server","a"],["Local","b"]],
};
var Dashboard_CustomSettings_ServerURL=
{
 "name":"Server URL",
 "id":"Dashboard_CustomSettings_ServerURL",
};
var Dashboard_CustomSettings_Fallback=
{
 "name":"Fallback",
 "id":"Dashboard_CustomSettings_Fallback",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Dashboard_CustomSettings_ServerSettings=
{
 "name":"Server Settings",
 "id":"Dashboard_CustomSettings_ServerSettings",
 "item":[Dashboard_CustomSettings_ServerURL,Dashboard_CustomSettings_Fallback],
};
var Dashboard_CustomSettings_Reload=
{
 "name":"Reload Dashboard After Network Restore",
 "id":"Dashboard_CustomSettings_Reload",
 "selected":0,
 "listitem":[["Yes","a"],["No","b"]],
};
var Dashboard_CustomSettings=
{
 "name":"Custom Settings",
 "id":"Dashboard_CustomSettings",
 "item":[Dashboard_CustomSettings_Source,Dashboard_CustomSettings_ServerSettings,Dashboard_CustomSettings_Reload],
};

var Dashboard=
{
 "name":"Dashboard",
 "id":"Dashboard",
 "item":[Dashboard_Mode,Dashboard_DefaultSettings,Dashboard_CustomSettings],
};