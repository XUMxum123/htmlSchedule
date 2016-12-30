var SwitchOnChannelFilter={
"id":"SwitchOnChannelFilter",
"name":"Switch On Channel Filter",
"listitem":[["All Channels","a"],["TV Channels","b"],["ThemeTV 1","c"],["ThemeTV 2","d"],["ThemeTV 3","e"],["SwitchOnChannel Details set via JAPIT","f"],["SwitchOnChannel Details set via SXP","g"]],
"selected":0,
"description":null,
};
var SwitchOnChannel={
"id":"SwitchOnChannel",
"name":"Switch On Channel",
"description":null,
"listitem":[["None","a"],["HDMI 1","b"],["HDMI 2","c"],["HDMI 3","d"]],
"selected":1,
};
var ChannelDetails={
"id":"ChannelDetails",
"name":"Channel Details",
"description":null,
"listitem":[["CCAV 1","a"],["CCAV 2","b"]],
"selected":0,
};

var ChannelSettings={
"id":"ChannelSettings",
"name":"Channel Settings",
"item": [ SwitchOnChannelFilter, SwitchOnChannel, ChannelDetails],
"description":null,
};
var SwitchOnFeature={
"id":"SwitchOnFeature",
"name":"Switch On Feature",
"description":null,
"listitem":[["None","a"],["Dashboard","b"],["SmartInfo","c"]],
"selected":0,
};
var FeatureSettings={
"id":"FeatureSettings",
"name":"Feature Settings",
"item": [SwitchOnFeature],
"description":null,
};
var TVSpeaker={
"id":"TVSpeaker",
"name":"TV Speaker",
"description":null,
};
var Headphone={
"id":"Headphone_BathroomSpeakers",
"name":"Headphone",
"description":null,
};
var BathroomSpeakers={
"id":"BathroomSpeakers",
"name":"Bathroom Speakers",
"description":null,
};
var Volume={
"id":"Volume",
"name":"Volume",
"item": [TVSpeaker, Headphone,BathroomSpeakers],
"description":null,
};
var SoundStyle={
"id":"SoundStyle",
"name":"Sound Style",
"listitem":[["Personal","a"],["Orginal","b"],["Movie","c"],["Music","d"],["Game","e"],["News","f"]],
"selected":0,
"description":null,
};
var Bass={
"id":"Bass",
"name":"Bass",
"description":null,

};
var Treble={
"id":"Treble",
"name":"Treble",
"description":null,
};
var SoundSettings={
"id":"SoundSettings",
"name":"Sound Settings",
"item": [Volume,SoundStyle,Bass,Treble],
"description":null,
};

var PictureFormat={
"id":"PictureFormat",
"name":"Picture Format",
"description":null,
"selected":3,
"listitem":[["Fill Screen","a"],["Fit to Screen","b"],["Super Zoom","c"],["Movie Expand 16:9","d"],["Wide Screen","e"],["Unscaled","f"],["4:3","g"]],
};
var PictureStyle={
"id":"PictureStyle",
"name":"Picture Style",
"description":null,
"selected":2,
"listitem":[["Personal","a"],["Vivid","b"],["Natural","c"],["Standard","d"],["Movie","e"],["Game","f"]],
};
var PictureSettings_Colour={
"id":"PictureSettings_Colour",
"name":"Colour",
"description":null,
};
var PictureSettings_Contrast={
"id":"PictureSettings_Contrast",
"name":"Contrast",
"description":null,
};
var PictureSettings_Sharpness={
"id":"PictureSettings_Sharpness",
"name":"Sharpness",
"description":null,
};
var PictureSettings={
"id":"PictureSettings",
"name":"Picture Settings",
"description":null,
"item": [PictureFormat, PictureStyle,PictureSettings_Colour,PictureSettings_Contrast,PictureSettings_Sharpness],
};
var ClosedCaption={
"id":"ClosedCaption",
"name":"Closed Caption",
"description":null,
"listitem":[["Off","a"],["On","b"],["On During Mute","c"]],
"selected":0,
};
var DigitalCaptionOptions_size={
"id":"DigitalCaptionOptions_size",
"name":"Size",
"description":null,
"listitem":[["Default","a"],["Small","b"],["Standard","c"],["Large","d"]],
"selected":0,
};

var DigitalCaptionOptions_Style={
"id":"DigitalCaptionOptions_Style",
"name":"Style",
"description":null,
"listitem":[["Default","a"],["Monospaced Serif","b"],["Serif","c"],["Monospaced Sans Serif","d"],["Sans Serif","e"],["Casual","f"],["Cursive","g"],["Small Caps","h"]],
"selected":0,
};

var DigitalCaptionOptions_textcolor={
"id":"DigitalCaptionOptions_textcolor",
"name":"Text Color",
"description":null,
"listitem":[["Default","a"],["Black","b"],["White","c"],["Red","d"],["Green","e"],["Blue","f"],["Yellow","g"],["Magenta","h"],["Cyan","i"]],
"selected":0,
};
var DigitalCaptionOptions_textOpacity={
"id":"DigitalCaptionOptions_textOpacity",
"name":"Text Opacity",
"description":null,
"listitem":[["Default","a"],["Solid","b"],["Transparent","c"],["Translucent","d"],["Flashing","e"]],
"selected":0,
};
var DigitalCaptionOptions_bgcolor={
"id":"DigitalCaptionOptions_bgcolor",
"name":"Background Color",
"description":null,
"listitem":[["Default","a"],["Black","b"],["White","c"],["Red","d"],["Green","e"],["Blue","f"],["Yellow","g"],["Magenta","h"],["Cyan","i"]],
"selected":0,
};
var DigitalCaptionOptions_bgOpacity={
"id":"DigitalCaptionOptions_bgOpacity",
"name":"Background Opacity",
"description":null,
"listitem":[["Default","a"],["Solid","b"],["Transparent","c"],["Translucent","d"],["Flashing","e"]],
"selected":0,
};

var DigitalCaptionOptions_edgeType={
"id":"DigitalCaptionOptions_edgeType",
"name":"Edge Type",
"description":null,
"listitem":[["Default","a"],["None","b"],["Raised","c"],["Uniform","d"],["Left Drop Shadow","e"],["Right Drop Shadow","f"]],
"selected":0,
};
var DigitalCaptionOptions_edgeColor={
"id":"DigitalCaptionOptions_edgeColor",
"name":"Edge Color",
"description":null,
"listitem":[["Default","a"],["Black","b"],["White","c"],["Red","d"],["Green","e"],["Blue","f"],["Yellow","g"],["Magenta","h"],["Cyan","i"]],
"selected":0,
};
var DigitalCaptionOptions={
"id":"DigitalCaptionOptions",
"name":"Digital Caption Options",
"description":null,
"item":[DigitalCaptionOptions_size,DigitalCaptionOptions_Style,DigitalCaptionOptions_textcolor,DigitalCaptionOptions_textOpacity,DigitalCaptionOptions_bgcolor,DigitalCaptionOptions_bgOpacity,DigitalCaptionOptions_edgeType,DigitalCaptionOptions_edgeColor],

};
var ClosedCaptionSettings={
"id":"ClosedCaptionSettings",
"name":"Closed Caption Settings",
"item": [ClosedCaption, DigitalCaptionOptions],
"description":null,
};
var switchon_Guest_Country={
"id":"switchon_Guest_Country",
"name":"Country",
"description":null,
"listitem":[["Germany","a"],["English","b"],["USA","c"],["UK","d"]],
"selected":0,
};
var switchon_Guest={
"id":"switchon_Guest",
"name":"Guest",
"description":null,
"item":[switchon_Guest_Country],
};
var switchon_Languages_Menulang={
"id":"switchon_Languages_Menulang",
"name":"Menu Language",
"description":null,
"listitem":[["Chinese","a"],["English","b"],["USA","c"],["UK","d"]],
"selected":0,
};
var switchon_Languages={
"id":"switchon_Languages",
"name":"Languages",
"description":null,
"item":[switchon_Languages_Menulang],
};
var LanguageSettings={
"id":"LanguageSettings",
"name":"Region And Language Settings",
"item": [switchon_Guest, switchon_Languages],
"description":null,
};
var Philips_Wordmark={
"id":"Philips_Wordmark",
"name":"Philips Wordmark",
"description":null,
"listitem":[["Off","a"],["Minimum","b"],["Medium","c"],["Maximum","d"]],
"selected":0,
};
var ECOSettings={
"id":"ECOSettings",
"name":"ECO Settings",
"item": [Philips_Wordmark],
"description":"Eco Settings bundles settings that help save energy",
};

var SwitchOnSettings = { 
    "id":"SwitchOnSettings",
	"name":"Switch on settings",
    "showMode":0,
    "focusIndex":0,
    "item": [ ChannelSettings,FeatureSettings,SoundSettings,PictureSettings,ClosedCaptionSettings,LanguageSettings,ECOSettings]
};