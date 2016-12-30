var CurrentFirmwareinfo=
{
 "name":"Current Firmware and Clone info",
 "id":"CurrentFirmwareinfo"
};
var UsbtoTV=
{
 "name":"Clone USB to TV",
 "id":"UsbtoTV"
};
var CloneAllExceptApps=
{
 "name":"Clone All Except Apps",
 "id":"CloneAllExceptApps"
};
var CloneAll=
{
 "name":"Clone All",
 "id":"CloneAll"
};
var TVtoUsb=
{
 "name":"Clone TV to USB",
 "id":"TVtoUsb",
 "item":[CloneAllExceptApps,CloneAll],
};

var FirmwareUpgradefromUSB=
{
 "name":"Firmware Upgrade from USB",
 "id":"FirmwareUpgradefromUSB"
};

var IPtoTV=
{
 "name":"Clone IP to TV",
 "id":"IPtoTV"
};

var RFtoTV=
{
 "name":"Clone RF to TV",
 "id":"RFtoTV"
};

var AutoUpgradeandClone=
{
 "name":"Auto Upgrade and Clone",
 "id":"AutoUpgradeandClone",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var AutoCloneonWakeup=
{
 "name":"Auto Clone on Wakeup",
 "id":"AutoCloneonWakeup",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var AutoUpgradeSettings=
{
 "name":"Auto Upgrade Settings",
 "id":"AutoUpgradeSettings",
 "item":[AutoUpgradeandClone,AutoCloneonWakeup],
};
var Frequency=
{
 "name":"Frequency",
 "id":"Frequency"
};
var ScanMode=
{
 "name":"Scan Mode",
 "id":"ScanMode",
 "selected":0,
 "listitem":[["Legacy","a"],["Continuous","b"]],
};

var RFUpgradeSettings_Channel=
{
 "name":"Channel",
 "id":"RFUpgradeSettings_Channel",
};
var RFUpgradeSettings=
{
 "name":"RF Upgrade Settings",
 "id":"RFUpgradeSettings",
 "item":[Frequency,ScanMode,RFUpgradeSettings_Channel],
};

var UpgradeAndClone=
{
 "name":"Upgrade and Clone",
 "id":"UpgradeAndClone",
 "item":[CurrentFirmwareinfo,UsbtoTV,TVtoUsb,FirmwareUpgradefromUSB,IPtoTV,RFtoTV,AutoUpgradeSettings,RFUpgradeSettings],
};