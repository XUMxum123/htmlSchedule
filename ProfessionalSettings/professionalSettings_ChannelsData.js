
var ShowChannels=
{
 "name":"Show Channels",
 "id":"showChannels",
 "listitem":[["No","a"],["Yes","b"]],
 "selected":0,
};
var Autoprogram=
{
 "name":"Autoprogram",
 "id":"Autoprogram",

};
var Weak_Channel_Installation=
{
 "name":"Weak Channel Installation",
 "id":"Weak_Channel_Installation",

};
var RF_Program_Installation=
{
 "name":"RF Program Installation",
 "id":"RF_Program_Installation",
 "item":[Autoprogram,Weak_Channel_Installation],
};

var Install_Analog=
{
 "name":"Install Analog",
 "id":"Install_Analog",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Install_Antenna=
{
 "name":"Install Antenna",
 "id":"Install_Antenna",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Install_Cable=
{
 "name":"Install Cable",
 "id":"Install_Cable",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var Install_Scrambled_Channels=
{
 "name":"Install Scrambled Channels",
 "id":"Install_Scrambled_Channels",
 "selected":0,
 "listitem":[["Off","a"],["On","b"]],
};
var RF_Installation_Settings=
{
 "name":"RF Installation Settings",
 "id":"RF_Installation_Settings",
 "item":[Install_Analog,Install_Antenna,Install_Cable,Install_Scrambled_Channels],
};
var EPG_Enable=
{
 "name":"Enable",
 "id":"EPG_Enable",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var EPG_Source=
{
 "name":"Source",
 "id":"EPG_Source",
 "selected":0,
 "listitem":[["From the Internet","a"],["From the Broadcaster","b"]],
};
var Channel_Settings_EPG=
{
 "name":"EPG",
 "id":"Channel_Settings_EPG",
 "item":[EPG_Enable,EPG_Source],
};
var Channel_Settings_EnableClosedCaptions=
{
 "name":"Enable Closed Captions",
 "id":"Channel_Settings_EnableClosedCaptions",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Channel_Settings_EnableChannelLogos=
{
 "name":"Enable Channel Logos",
 "id":"Channel_Settings_EnableChannelLogos",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Channel_Settings_ChannelBanner=
{
 "name":"Display Scrambled Channel Banner",
 "id":"Channel_Settings_ChannelBanner",
 "selected":0,
 "listitem":[["No","a"],["Yes","b"]],
};
var Channel_Settings_IGMP=
{
 "name":"IGMP Version for Multicast IP Channels",
 "id":"Channel_Settings_IGMP",
 "selected":0,
 "listitem":[["Auto","a"],["1","b"],["2","c"],["3","d"]],
};

var Channel_Settings=
{
 "name":"Channel Settings",
 "id":"Channel_Settings",
 "item":[Channel_Settings_EPG,Channel_Settings_EnableClosedCaptions,Channel_Settings_EnableChannelLogos,Channel_Settings_ChannelBanner,Channel_Settings_IGMP],
};
var Channels=
{
 "name":"Channels",
 "id":"channels",
 "item":[ShowChannels,RF_Program_Installation,RF_Installation_Settings,Channel_Settings],
};