var Advanced_ProfessionalMode=
{
 "name":"Professional Mode",
 "id":"ProfessionalMode",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var RoomID=
{
 "name":"RoomID",
 "id":"RoomID",
};
var LocationID=
{
 "name":"Premises Geoname LocationID",
 "id":"LocationID",
};
var PremisesName=
{
 "name":"Premises Name",
 "id":"PremisesName",
};
var IdentificationSettings=
{
 "name":"Identification Settings",
 "id":"IdentificationSettings",
 "item":[RoomID,LocationID,PremisesName],
};
var PowerOn=
{
 "name":"Power On",
 "id":"PowerOn",
 "selected":0,
 "listitem":[["Standby","a"],["On","b"]],
};
var StandbyMode=
{
 "name":"Standby Mode",
 "id":"StandbyMode",
 "selected":0,
 "listitem":[["Green","a"],["Fast","b"]],
};
var RebootEveryday=
{
 "name":"Reboot Everyday",
 "id":"RebootEveryday",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var AutoStandby=
{
 "name":"Auto Standby",
 "id":"AutoStandby",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Advanced_Power=
{
 "name":"Power",
 "id":"Advanced_Power",
 "item":[PowerOn,StandbyMode,RebootEveryday,AutoStandby],
};
var KeyboardLock=
{
 "name":"Local Keyboard  Control Lock",
 "id":"KeyboardLock",
 "selected":0,
 "listitem":[["Off","a"],["On","b"],["All","c"]],
};
var RemoteControl_Lock=
{
 "name":"Lock",
 "id":"RemoteControl_Lock",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var RemoteControl=
{
 "name":"Remote Control",
 "id":"RemoteControl",
 "item":[RemoteControl_Lock],
};
var RemoteControl_Bluetooth=
{
 "name":"Bluetooth Remote Control",
 "id":"RemoteControl_Bluetooth",
 "selected":0,
 "listitem":[["Pair","a"],["UnPair","b"]],
};
var Keyboard_Setup=
{
 "name":"USB Keyboard Setup",
 "id":"Keyboard_Setup",
};

var InputControl=
{
 "name":"Input Control",
 "id":"InputControl",
 "item":[KeyboardLock,RemoteControl,RemoteControl_Bluetooth,Keyboard_Setup],
};
var HighSecurity=
{
 "name":"High Security",
 "id":"HighSecurity",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};

var LoadKeystoUSB=
{
 "name":"Load Keys to USB",
 "id":"LoadKeystoUSB",
};
var LoadKeystoTV=
{
 "name":"Load Keys to TV",
 "id":"LoadKeystoTV",
};
var SelfTest=
{
 "name":"Self Test",
 "id":"SelfTest",
};
var Vsecure_USB=
{
 "name":"Vsecure Keys Via USB",
 "id":"Vsecure_USB",
 "item":[LoadKeystoUSB,LoadKeystoTV,SelfTest],
};

var Vsecure_RF=
{
 "name":"Vsecure Keys Via RF",
 "id":"Vsecure_RF",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Vsecure=
{
 "name":"Vsecure",
 "id":"Vsecure",
 "item":[Vsecure_USB,Vsecure_RF],
};
var Advanced_Security=
{
 "name":"Security",
 "id":"Advanced_Security",
 "item":[HighSecurity,Vsecure],
};
var SerialXpress=
{
 "name":"Serial Xpress",
 "id":"SerialXpress",
 "selected":0,
 "listitem":[["38400","a"],["19200","b"]],
};
var DisplayOSD=
{
 "name":"Display OSD",
 "id":"DisplayOSD",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Advanced_UI=
{
 "name":"UI",
 "id":"Advanced_UI",
 "item":[DisplayOSD],
};
var ClearUserData=
{
 "name":"Clear User Data",
 "id":"ClearUserData",
 "selected":0,
 "listitem":[["Off","a"],["Standby and PowerOn","b"],["CheckIn and CheckOut","c"]],
};
var Advanced_SystemSettings=
{
 "name":"System Settings",
 "id":"Advanced_SystemSettings",
 "item":[ClearUserData],
};
var Advanced=
{
 "name":"Advanced",
 "id":"Advanced",
 "item":[Advanced_ProfessionalMode,IdentificationSettings,Advanced_Power,InputControl,Advanced_Security,SerialXpress,Advanced_UI,Advanced_SystemSettings],
};