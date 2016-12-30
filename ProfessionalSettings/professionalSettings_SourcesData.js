var Sources_Manage=
{
 "name":"Manage",
 "id":"Sources_Manage",
};
var Sources_Advanced_EnableSources=
{
 "name":"Enable Sources",
 "id":"Sources_Advanced_EnableSources",
 "selected":0,
 "listitem":[["HDMI1","a"],["HDMI2","b"],["YPbPr","c"]],
};
var EasyLink_EasyLink=
{
 "name":"EasyLink",
 "id":"EasyLink_EasyLink",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var EasyLink_BreakIn=
{
 "name":"EasyLink Break-in",
 "id":"EasyLink_BreakIn",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var EasyLink_RemoteControl=
{
 "name":"EasyLink Remote Control",
 "id":"EasyLink_RemoteControl",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};

var Sources_Advanced_EasyLink=
{
 "name":"EasyLink",
 "id":"Sources_Advanced_EasyLink",
 "item":[EasyLink_EasyLink,EasyLink_BreakIn,EasyLink_RemoteControl],
};
var Sources_Advanced=
{
 "name":"Advanced",
 "id":"Sources_Advanced",
 "item":[Sources_Advanced_EnableSources,Sources_Advanced_EasyLink],
};
var Sources=
{
 "name":"Sources",
 "id":"Sources",
 "item":[Sources_Manage,Sources_Advanced],
};