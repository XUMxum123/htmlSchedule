// channel list for test
channel_list = [
    {"id": "ch01", "name": "BBC_NEWS", "description":"BBC news channel", "icon": "../libs/test-res/BBC_News.png"},
    {"id": "ch02", "name": "CNN",      "description":"BBC news channel", "icon": "../libs/test-res/cnn.jpg"},
    {"id": "ch03", "name": "MTV",      "description":"MTK tv channel",   "icon": "../libs/test-res/MTV.jpg"},
    {"id": "ch04", "name": "NBC",      "description":"NBC sports",       "icon": "../libs/test-res/NBC.jpg"},
    {"id": "ch05", "name": "P-WIJ",    "description":"P WIJ channel",    "icon": "../libs/test-res/p-wij.png"},
    {"id": "ch06", "name": "S-Club",   "description":"S Club channel",   "icon": "../libs/test-res/s-club.png"},
    {"id": "ch07", "name": "v_inter",  "description":"V Inter channel",  "icon": "../libs/test-res/v-inter.png"},
    {"id": "ch08", "name": "CNN",      "description":"BBC news channel", "icon": "../libs/test-res/cnn.jpg"},
    {"id": "ch09", "name": "MTV",      "description":"MTK tv channel",   "icon": "../libs/test-res/MTV.jpg"},
    {"id": "ch10", "name": "NBC",      "description":"NBC sports",       "icon": "../libs/test-res/NBC.jpg"},
	{"id": "ch11", "name": "BBC_NEWS", "description":"BBC news channel", "icon": "../libs/test-res/BBC_News.png"}
];

input_list = [
    {"id": "input01", "name": "TV1",      "description":"TV input",         "icon": "../libs/test-res/i-tv.png"},
    {"id": "input02", "name": "HDMI1",    "description":"HDMI input 1",     "icon": "../libs/test-res/i-hdmi.png"},
    {"id": "input03", "name": "HDMI2",    "description":"HDMI input 2",     "icon": "../libs/test-res/i-hdmi.png"},
    {"id": "input04", "name": "HDMI3",    "description":"HDMI input 3",     "icon": "../libs/test-res/i-hdmi.png"},
    {"id": "input05", "name": "HDMI4",    "description":"HDMI input 4",     "icon": "../libs/test-res/i-hdmi.png"},
    {"id": "input06", "name": "Serial1",  "description":"Serial input 1",   "icon": "../libs/test-res/i-serial.png"},
    {"id": "input07", "name": "Serial2",  "description":"Serial input 2",   "icon": "../libs/test-res/i-serial.png"},
    {"id": "input08", "name": "Serial3",  "description":"Serial input 3",   "icon": "../libs/test-res/i-serial.png"},
    {"id": "input09", "name": "Serial4",  "description":"Serial input 4",   "icon": "../libs/test-res/i-serial.png"}
];

utilities_list = [
    {"id": "utilities_youtube", "name": "YouTube",  "description":"YouTube movies",   "icon": "../libs/test-res/youtube.png"}
];

settings_list = [
    {"id": "settings_tv", "name": "TV setup",  "description":"Setup you TV", "icon": "../2K16_4K_UX_Asset/Icons/icon_7_Settings_Setup_d_64x64_px .png"},
    {"id": "settings_scan", "name": "Scan",  "description":"Scan Channels", "icon": "../2K16_4K_UX_Asset/Icons/icon_8_Quick_Adjustments_Quick_Settings_hl_64x64_px.png"},
    {"id":"settings_eco", "name": "Eco settings",        "description":"Setup you TV", "icon": ""},
    {"id":"settings_pic", "name": "Picture Style",       "description":"Setup you TV", "icon": "../2K16_4K_UX_Asset/Icons/icon_98_Media_Photos_d_64x64_px.png"},
    {"id":"settings_fmt", "name": "Picture Format",      "description":"Setup you TV", "icon": ""},
    {"id":"settings_snd", "name": "Sound Style",         "description":"Setup you TV", "icon": "../2K16_4K_UX_Asset/Icons/icon_50_Sound_d_64x64_px.png"},
    {"id":"settings_vol", "name": "Headphones Volume",   "description":"Setup you TV", "icon": "../2K16_4K_UX_Asset/Icons/icon_66_Headphone_Volume_d_64x64_px.png"},
    {"id":"settings_spk", "name": "Speakers",            "description":"Setup you TV", "icon": ""},
    {"id":"settings_clk", "name": "Clock",               "description":"Setup you TV", "icon": ""},
    {"id":"settings_spt", "name": "Sleeptimer",          "description":"Setup you TV", "icon": ""},
    {"id":"settings_all", "name": "All Settings",        "description":"Setup you TV", "icon": ""}
];

function get_channel_list () {
    return channel_list;
}

function get_input_source_list () {
    return input_list;
}

function get_utilities_list() {
    return utilities_list;
}

function get_settings_list() {
    return settings_list;
}
