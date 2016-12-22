function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

var test_channel_list = [
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"1",\
               "CHANNEL_ID":"1835137",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"7",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"2",\
               "CHANNEL_ID":"18350209",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"70",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 HD Digital"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"3",\
               "CHANNEL_ID":"18612353",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"71",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"4",\
               "CHANNEL_ID":"18874497",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"72",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"5",\
               "CHANNEL_ID":"19136641",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"73",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 3"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"6",\
               "CHANNEL_ID":"20185217",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"77",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"cctv",\
               "CH_LOGO_ID":"2801" \
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"1",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"4",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"7",\
               "CHANNEL_ID":"78905472",\
               "NW_MASK":"4111",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"57800000",\
               "MAJOR_NUM":"301",\
               "SERVICE_NAME":"-----"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"8",\
               "CHANNEL_ID":"18351371",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"7",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital x1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"9",\
               "CHANNEL_ID":"183502091",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"70",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 HD Digital x1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"10",\
               "CHANNEL_ID":"186123531",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"71",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 1 x1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"11",\
               "CHANNEL_ID":"188744971",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"72",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 2 x1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"12",\
               "CHANNEL_ID":"191366411",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"73",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 3 x1"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"13",\
               "CHANNEL_ID":"201852171",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"77",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"cctv x1",\
               "CH_LOGO_ID":"2801" \
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"1",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"4",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"14",\
               "CHANNEL_ID":"789054721",\
               "NW_MASK":"4111",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"57800000",\
               "MAJOR_NUM":"30101",\
               "SERVICE_NAME":"-----"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"15",\
               "CHANNEL_ID":"18351372",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"7",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital x2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"16",\
               "CHANNEL_ID":"183502092",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"70",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 HD Digital x2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"17",\
               "CHANNEL_ID":"186123532",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"71",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 1 x2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"18",\
               "CHANNEL_ID":"188744972",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"72",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 2 x2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"19",\
               "CHANNEL_ID":"191366412",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"73",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"7 Digital 3 x2"\
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"2",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"1",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"20",\
               "CHANNEL_ID":"201852172",\
               "NW_MASK":"8719",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"602000000",\
               "MAJOR_NUM":"77",\
               "MINOR_NUM":"0",\
               "SHORT_NAME":"",\
               "SERVICE_NAME":"cctv x2",\
               "CH_LOGO_ID":"2801" \
              }]}',
    '{"URI":"/tv/channelinfo/channel_info_by_db_index",\
     "STATUS":"0",\
     "ITEMS":[{\
               "NAME":"CHANNEL_INFO",\
               "TYPE":"TYPE_CHANNEL_INFO",\
               "GROUP":"0",\
               "STATE":"0",\
               "BRDCST_TYPE":"1",\
               "SERVICE_TYPE":"1",\
               "BRDCST_MEDIUM":"4",\
               "SVL_ID":"1",\
               "SVL_REC_ID":"21",\
               "CHANNEL_ID":"789054722",\
               "NW_MASK":"4111",\
               "CH_TOTAL_NUM":"0",\
               "FREQUENCY":"57800000",\
               "MAJOR_NUM":"30101",\
               "SERVICE_NAME":"-----"\
              }]}'];

var test_ch1_epg_event_list = [
    '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"16",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview ",\
                    "DETAILS":"details info details info details info details info details info details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"2",\
                    "EVENT_ID":"2",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"17",\
                    "RATING":"Free",\
                    "EVENT_NAME":"Smallville",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1320913200",\
                    "DURATION":"3300"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"3",\
                    "EVENT_ID":"3",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"18",\
                    "RATING":"Free",\
                    "EVENT_NAME":"Smallville2",\
                    "DETAILS":"details info details info details info details info details info ",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1320918300",\
                    "DURATION":"1800"\
                },\
            ]\
        }'];

var test_ch2_epg_event_list = [
    '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"10",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview",\
                    "DETAILS":"details info details info details info details info details info details info ",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
            ]\
        }'];

var test_ch3_epg_event_list = [
    '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"19",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"2",\
                    "EVENT_ID":"2",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"0",\
                    "CATEGORY":"0",\
                    "RATING":"Free",\
                    "EVENT_NAME":"Last of the Summer Wine",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026486600",\
                    "DURATION":"1500"\
                },\
            ]\
        }'];

var test_ch4_epg_event_list = [
    '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"18",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"2",\
                    "EVENT_ID":"2",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"19",\
                    "RATING":"Free",\
                    "EVENT_NAME":"Last of the Summer Wine",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026486600",\
                    "DURATION":"1500"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"3",\
                    "EVENT_ID":"3",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"250",\
                    "RATING":"Free",\
                    "EVENT_NAME":"After You Gone",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1443097294451",\
                    "DURATION":"1500"\
                },\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"4",\
                    "EVENT_ID":"4",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"240",\
                    "RATING":"Free",\
                    "EVENT_NAME":"This is test",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1443097294451",\
                    "DURATION":"1500"\
                },\
            ]\
        }'];

var test_ch5_epg_event_list = [
    '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"-1",\
            "ITEMS": \
            [\
            ]\
        }'];

var test_epg_event_now = [
        '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"170",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Preview BBC HD Preview BBC HD Preview BBC HD Preview",\
                    "DETAILS":"details info \\n details info details info details info details info details info details info details info details info details info details info details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
            ]\
        }'];
var test_epg_event_next = [
        '{\
            "URI":"/tv/eventinfo/event_information",\
            "STATUS":"0",\
            "ITEMS": \
            [\
                {\
                    "NAME":"EVENT_INFO",\
                    "TYPE":"TYPE_EVENT_INFO",\
                    "CHANNEL_ID":"1",\
                    "EVENT_ID":"1",\
                    "FREE_CA_MODE":"0",\
                    "CATEGORY_NUM":"1",\
                    "CATEGORY":"100",\
                    "RATING":"Free",\
                    "EVENT_NAME":"BBC HD Next",\
                    "DETAILS":"details info",\
                    "GUIDANCE_TEXT":"Guidance text", \
                    "GUIDANCE_MODE":"1", \
                    "START_TIME":"1026484200",\
                    "DURATION":"1300"\
                },\
            ]\
        }'];

var tvServicesTest = function () {
    // if (!document.getElementById("broadcast_test")) {
    //     var divtest = document.createElement("div");
    //     divtest.innerHTML = '<video id="broadcast_test" autoplay="autoplay" loop=-1 style="width:100%; heigth:100vh"> \
    //         <source id="webm" src="'+get_base_url() + 'libs/a.webm" type="video/webm"></video>';
    //     document.body.appendChild(divtest);
    // }
    this.getCurrentChannelInfo = function(arg) {
        var idx = localStorage.getItem("test_cur_channel_idx");
        idx = idx || parseInt(test_channel_list.length / 2);
        return test_channel_list[idx];
    },
    this.getChannelNum = function (arg) {
        return '{\
                "URI":"/tv/channelinfo/channel_num_by_svl_id",\
                "ITEMS":[{\
                          "NAME":"CHANNEL_INFO",\
                          "TYPE":"TYPE_CHANNEL_INFO",\
                          "GROUP":"0",\
                          "STATE":"0",\
                          "BRDCST_TYPE":"0",\
                          "SERVICE_TYPE":"0",\
                          "BRDCST_MEDIUM":"0",\
                          "SVL_ID":"0",\
                          "SVL_REC_ID":"0",\
                          "CHANNEL_ID":"0",\
                          "NW_MASK":"0",\
                          "CH_TOTAL_NUM":"'+test_channel_list.length+'",\
                          "FREQUENCY":"0",\
                          "MAJOR_NUM":"0",\
                          "MINOR_NUM":"0",\
                          "SERVICE_NAME":""\
                         }]\
               }';
    },

    this.getIdxByChannelId = function (arg) {
        return '{"URI":"/tv/menu/common_setting/gui_language", \
                "STATUS":"0", \
                "ITEMS":[{ \
                    "INDEX":"1" \
                }] \
               }';
    };
    this.getChannelInfoByDbIdx = function (arg) {
        arg = JSON.parse(arg);
        if (!arg || !arg.PARAMETER || 1 != arg.PARAMETER.SVL_ID || arg.PARAMETER.REQUEST != "QUERY")
            return null;
        /* CH_SEARCH_IDX begin from 1 */
        if (arg.PARAMETER.CH_SEARCH_IDX >= 1 && arg.PARAMETER.CH_SEARCH_IDX <= test_channel_list.length)
            return test_channel_list[arg.PARAMETER.CH_SEARCH_IDX - 1];
        return null;
    };
    this.setBrdcastChgChannel = function (chID) {
        for(i = 0; i < test_channel_list.length; i++) {
            info = JSON.parse(test_channel_list[i]);
            if (info.ITEMS[0].CHANNEL_ID == chID) {
                localStorage.setItem("test_cur_channel_idx", i);
                return true;
            }
        }
        return false;
    };

    this.getPrevChannelInfo = function (arg) {
        arg = JSON.parse(arg);
        ret = null;
        $.each(test_channel_list, function (k, v) {
            chObj = JSON.parse(v);
            if (chObj.ITEMS[0].CHANNEL_ID == arg.PARAMETER.CH_ID) {
                ret = test_channel_list[(k - 1 + test_channel_list.length) % test_channel_list.length];
                return false;   // break;
            }
            return true;
        });
        return ret;
    };
    this.getNextChannelInfo = function (arg) {
        arg = JSON.parse(arg);
        ret = null;
        $.each(test_channel_list, function (k, v) {
            chObj = JSON.parse(v);
            if (chObj.ITEMS[0].CHANNEL_ID == arg.PARAMETER.CH_ID) {
                ret = test_channel_list[(k + 1) % test_channel_list.length];
                return false;   // break;
            }
            return true;
        });
        return ret;
    };

    this.getOclPrevChannelInfo = function (arg) {
        arg = JSON.parse(arg);
        ret = null;
        $.each(test_channel_list, function (k, v) {
            chObj = JSON.parse(v);
            if (chObj.ITEMS[0].CHANNEL_ID == arg.PARAMETER.CH_ID) {
                ret = test_channel_list[(k - 1 + test_channel_list.length) % test_channel_list.length];
                return false;   // break;
            }
            return true;
        });
        return ret;
    };
    this.getOclNextChannelInfo = function (arg) {
        arg = JSON.parse(arg);
        ret = null;
        $.each(test_channel_list, function (k, v) {
            chObj = JSON.parse(v);
            if (chObj.ITEMS[0].CHANNEL_ID == arg.PARAMETER.CH_ID) {
                ret = test_channel_list[(k + 1) % test_channel_list.length];
                return false;   // break;
            }
            return true;
        });
        return ret;
    };

    this.getCountry = function() {
        return '{ \
            "URI":"/tv/menu/common_setting/gui_language", \
            "STATUS":"0", \
            "ITEMS":[ \
                { \
                "NAME":"", \
                "TYPE":"TYPE_TEXT", \
                "GROUP":"9", \
                "STATE":"1", \
                "TEXT":"GBR" \
                } \
              ] \
            }';
    };
    this.getGuiLanguage = function (arg) {
        return '{"URI":"/tv/menu/common_setting/gui_language", \
                "STATUS":"0", \
                "ITEMS":[{ \
                    "NAME":"", \
                    "TYPE":"TYPE_TEXT", \
                    "GROUP":"9", \
                    "STATE":"1", \
                    "TEXT":' + getGuiLanguageTest() + '\
                }] \
               }';
    };

    this.currentInputIndex = 1;
    this.getInputList = function (arg) {
        var curInputIdx = localStorage.getItem("currentInputIndex");
        curInputIdx = (curInputIdx == null) ? "1" : curInputIdx; // use "1" for default
        return '{\
                "URI":"/tv/inputsource/input_source_list", \
                "ITEMS":[ \
                          { \
                            "NAME":"", \
                            "TYPE":"TYPE_OPTION_LIST", \
                            "GROUP":"0", \
                            "STATE":"0", \
                            "OPTION":"1:TV,2:CVBS,3:YPbPr,4:SCART,5:HDMI 1,6:HDMI 2,7:HDMI 3,8:HDMI side", \
                            "VALUE":"'+curInputIdx+'" \
                          } \
                        ] \
               }';
    };
    this.selectInputList = function (arg) {
        localStorage.setItem("currentInputIndex", arg);
    };

    this.AliasObjectsNameDB = "InputSourceRawAliasName";
    this.AliasObjectsIconDB = "InputSourceRawAliasIcon";
    this.getAliasDB = function (dbName) {
        var strDB = localStorage.getItem(dbName);
        if (strDB) {
            try {
                ret = JSON.parse(strDB);
                if (typeof ret === 'object')
                    return ret;
            } catch (err) {
                console.log(err);
                // try to reset when error
                localStorage.removeItem(dbName);
            }
        }
        return {"dbName":dbName}; // return default db
    };
    this.setAliasDB = function (dbObj) {
        if (dbObj && dbObj.dbName) {
            localStorage.setItem(dbObj.dbName, JSON.stringify(dbObj));
            return true;
        }
        return false;
    };

    this.setInputSourceAliasNameByIdx = function (arg) {
        // '{"PARAMETER":{"INDEX":"[4]","ALIAS_NAME":"[Blue Ray]","REQUEST":"SET"}}'
        var obj = JSON.parse(arg);
        if (obj && obj.PARAMETER.INDEX != undefined) {
            var db = this.getAliasDB(this.AliasObjectsNameDB);
            db[String(obj.PARAMETER.INDEX)] = obj.PARAMETER.ALIAS_NAME;
            this.setAliasDB(db);
            return true;
        }
        return false;
    };

    this.getInputSourceAliasNameByIdx = function (arg) {
        var obj = JSON.parse(arg);
        if (obj && obj.PARAMETER.INDEX >= "0") {
            var db = this.getAliasDB(this.AliasObjectsNameDB);
            return JSON.stringify({
                "URI":"/tv/inputsource/device_type",
                "STATUS":"0",
                "ITEMS":[{
                    "INDEX":obj.PARAMETER.INDEX,
                    "ALIAS_NAME":db[String(obj.PARAMETER.INDEX)],
                    "DEVICE_TYPE":"0"
                }]
            });
        }
        return null;
    };

    this.setInputSourceDevTypeByIdx = function (arg) {
        // '{"PARAMETER":{"INDEX":"[4]","DEVICE_TYPE":"[2]","REQUEST":"SET"}}'
        var obj = JSON.parse(arg);
        if (obj && obj.PARAMETER.INDEX != undefined) {
            var db = this.getAliasDB(this.AliasObjectsIconDB);
            db[String(obj.PARAMETER.INDEX)] = obj.PARAMETER.DEVICE_TYPE;
            this.setAliasDB(db);
            return true;
        }
        return false;
    };

    this.getInputSourceDevTypeByIdx = function (arg) {
        var obj = JSON.parse(arg);
        if (obj && obj.PARAMETER.INDEX >= "0") {
            var db = this.getAliasDB(this.AliasObjectsIconDB);
            return JSON.stringify({
                "URI":"/tv/inputsource/device_type",
                "STATUS":"0",
                "ITEMS":[{
                    "INDEX":obj.PARAMETER.INDEX,
                    "ALIAS_NAME":"",
                    "DEVICE_TYPE":db[String(obj.PARAMETER.INDEX)]
                }]
            });
        }
        return null;
    };

    this.getInputDeviceInfoByLogicAdr = function (arg) {
        if (JSON.parse(arg).PARAMETER.E_LOGICADR == 4)
            return '{\
                    "URI":  "/tv/channelinfo/device_info",\
                    "STATUS": 0,\
                    "ITEMS":  [{\
                                "s_dev_name":   "OK",\
                                "s_hdmi_port":  "HDMI 2",\
                                "s_osd_name":   "BD",\
                                "b_amp_connected":  0,\
                                "e_la": 4,\
                                "ui2_pa":   4096,\
                                "dev_type": 4,\
                                "ui1_dev_vndr_id":  [8, 0, 70]\
                               }]\
                   }';
        else if (JSON.parse(arg).PARAMETER.E_LOGICADR == 5)
            return '{\
                    "URI":"/tv/inputsource/device_type", \
                    "STATUS":"0", \
                    "ITEMS":[{ \
                               "s_dev_name":"HDMI CEC", \
                               "s_hdmi_port":"HDMI CEC PORT", \
                               "s_osd_name":"This is CEC test", \
                               "b_amp_connected": "0", \
                               "e_la":"5", \
                               "ui2_pa":"8192", \
                               "dev_type":"", \
                               "ui1_dev_vndr_id":"" \
                             } \
                            ] \
                   }';
        return '{"URI":"/tv/inputsource/device_type", \
                "STATUS":"-1", \
                "ITEMS":[]}';
    };

    this.mviewChgDisplayRegion = function (arg) {
        console.log(arg);
    };

    var g_epg_channel_idx = 0;

    this.getEventList = function (arg) {
        arg = JSON.parse(arg);

        g_epg_channel_idx++;

        //console.log("test_epg_event_list_1:", eval("("+test_epg_event_list+")"));
        if (g_epg_channel_idx == 1) {
            return test_ch1_epg_event_list;
        }
        else if (g_epg_channel_idx == 2) {
            return test_ch2_epg_event_list;
        }
        else if (g_epg_channel_idx == 3) {
            return test_ch3_epg_event_list;
        }
        else if (g_epg_channel_idx == 4) {
            return test_ch4_epg_event_list;
        }
        else {
            g_epg_channel_idx = 0;
            return test_ch5_epg_event_list;//eval("("+test_epg_event_list+")");
        }
    };

    this.getCurrentEvent = function (arg) {
        //console.log("getCurrentEvent:");
        return test_epg_event_now;//eval("("+test_epg_event_list+")");
    };
    this.getNextEvent = function (arg) {
        //console.log("getNextEvent:");
        //console.log("getNextEvent:", eval("("+test_epg_event_list+")"));
        return test_epg_event_next;//eval("("+test_epg_event_list+")");
    };
    this.getEventInfoByEventId = function (arg) {
        //console.log("getCurrentEvent:");
        return test_epg_event_now;//eval("("+test_epg_event_list+")");\
    };
    this.getEventNumByFilter = function (arg) {
        //console.log("getEventNumByFilter:");
			return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"EVENT_NUM":3,\
			"EVENT_ID":[1, 2, 3],\
			"CH_ID":[1, 2, 3],\
			"SIZE":"8719"\
			}\
			]\
			}';
    };
    this.getBroadcastTime = function (arg) {
        var utcTimeStamp = Date.UTC(2007, 1, 26, 20, 30, 0, 0);
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"VALUE":1359345600 \
			}\
			]\
			}';
    };
    this.getUtcTime = function (arg) {
        var utcTimeStamp = Date.UTC(2007, 1, 26, 20, 30, 0, 0);
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"VALUE":1359345600 \
			}\
			]\
			}';
    };
    this.getTimeZone = function (arg) {
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"VALUE":0 \
			}\
			]\
			}';
    };
    this.getTimeOffset = function (arg) {
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"VALUE":0 \
			}\
			]\
			}';
    };
    this.getOclStatus = function (arg) {
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"VALUE":0 \
			}\
			]\
			}';
    };

    this.getOclChannelNum = function (arg) {
	    return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"CH_TOTAL_NUM":"'+test_channel_list.length+'" \
			}\
			]\
			}';
    };

    this.convertMillisToLocalTime = function (arg) {
            var mydate = new Date();
            mydate.setTime(arg*1000);
            var yy = mydate.getFullYear();
            var mm  = mydate.getMonth();
            var dd  = mydate.getDate();
            var ww  = mydate.getDay();
            var hh = mydate.getHours();
            var mi = mydate.getMinutes();
            var ss = mydate.getSeconds();
            //console.log("convertMillisToLocalTime=", arg);
            return JSON.stringify({
                "URI":"/tv/menu/common_setting/convert_millis_to_local_time",
                "STATUS":0,
                "ITEMS":[
                {
                    "NAME":"",
                    "TYPE":"TYPE_TIME",
                    "GROUP":0,
                    "STATE":1,
                    "VALUE":1199713200,
                    "DTG":{
                        "YEAR":yy,
                        "MONTH":mm,
                        "DAY":dd,
                        "WEEK":ww,
                        "HOUR":hh,
                        "MINUTE":mi,
                        "SECOND":ss,
                        "GMT":0,
                        "DST":1
                        }
                    }
                    ]
                 });
    };
    this.convertLocalTimeToMillis = function (arg) {
            return JSON.stringify({
                "URI":"/tv/menu/common_setting/convert_local_time_to_millis",
                "STATUS":0,
                "ITEMS":[
                {
                    "NAME":"",
                    "TYPE":"TYPE_TIME",
                    "GROUP":0,
                    "STATE":1,
                    "VALUE":1199713200,
                    "DTG":{
                        "YEAR":yy,
                        "MONTH":mm,
                        "DAY":dd,
                        "WEEK":ww,
                        "HOUR":hh,
                        "MINUTE":mi,
                        "SECOND":ss,
                        "GMT":0,
                        "DST":1
                        }
                    }
                    ]
                 });
    };
    this.getPvrReminderEvent = function (arg) {
        arg = JSON.parse(arg);
        if (arg.PARAMETER.operation == 12) {
            //GetTotalReminderNum();
			return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"total_rmdr_num":"2", \
			"is_rmdr":"1",\
			"is_recording_on_going":"0",\
			"is_on_going_pvr":"0",\
			"conflict_type":"3",\
			"SIZE":"8719", \
			"channel_id": "1", \
			"event_id":"1", \
			"start_time":"1026484200", \
			"duration":"1800", \
			"genre":"0", \
			"event_title":"Event Title" \
			}\
			]\
			}';
        }
        else
        {
			return  '{\
			"URI":"/tv/cbrowser/get_info_by_idx",\
			"STATUS":"0",\
			"ITEMS":[\
			{\
			"is_rmdr":"1",\
			"is_recording_on_going":"0",\
			"is_on_going_pvr":"0",\
			"conflict_type":"0",\
			"SIZE":"8719", \
			"channel_id": "1", \
			"event_id":"1", \
			"start_time":"1026484200", \
			"duration":"1800", \
			"genre":"0", \
			"event_title":"Event Title" \
			}\
			]\
			}';
		}
    };

    this.getConfigValue = function(arg) {
        var obj = JSON.parse(arg);
        if (obj.PARAMETER.cfgId == "g_misc__dvbs_support") {
            return JSON.stringify({"URI":"/tv/config/value_number",
                                   "STATUS":0,
                                   "ITEMS":[{
                                       "cfgId":"g_misc__dvbs_support",
                                       "valueString":"",
                                       "valueInt": 1
                                   }]});
        }
        return JSON.stringify({
            "URI":"/tv/cbrowser/get_config_value",
            "STATUS":"0",
            "ITEMS":[{
                "valueString":"0",
                "valueInt":0
            }]
        });
    };
    this.selectTvSource = function (arg) {
        localStorage.setItem("currentInputIndex", "1");
    };
    this.selectSatelliteSource = function (arg) {
        localStorage.setItem("currentInputIndex", "1_3");
    };
    this.getLangString = function (args) {
        var params = JSON.parse(args);
        var langId = params.PARAMETER.langId;
        var obj = {"URI":"/tv/config/language_string",
                   "STATUS":0,
                   "ITEMS":[{
                       "langId":langId,
                       "langString":testLangDict[langId]
                   }]};
        return JSON.stringify(obj);
    };
    this.getChannelLogoPath = function (iconIdx) {
        if (!this.iconPath)
            this.iconPath = (function () {
                if (window.location.href.match(/EU\/html5/))
                    return "../../Slice/res/ChLogo_EU/PreDef/";
                else if (window.location.href.match(/\/html-ui/))
                    return "./ChLogo/PreDef/";
                else
                    return "/3rd_rw/ChLogo/PreDef/";
            })();
        if (iconIdx) {
            var pImg = this.iconPath + String(iconIdx) + ".png";
            if (pImg.substr(0, 1) != '/') // relative path
                pImg = get_base_url() + pImg;
            return JSON.stringify({STATUS: 0, ITEMS: [{TEXT: pImg}]});
        }
        return null;
    };
    this.addEventListener = function () {
        return true;
    };
};

var setGuiLanguageTest = function (arg) {
    localStorage.setItem("html5-ui-language", arg);
};

var getGuiLanguageTest = function (arg) {
    var lang = localStorage.getItem("html5-ui-language");
    return (lang ? lang : "ENG");
};

var useDebugChannelData = function (enable) {
    if (!this.origSvc) {
        try {this.origSvc = tvServices;}
        catch(err) {console.log(err);}
    }
    tvServices = enable ? tvServicesTest : this.origSvc;
};

// remap key for debug on PC.
if ("Win32" == navigator.platform) {
    KeyEvent.DOM_VK_GREEN  = KeyEvent.DOM_VK_G;
    KeyEvent.DOM_VK_BLUE   = KeyEvent.DOM_VK_B;
    KeyEvent.DOM_VK_RED    = KeyEvent.DOM_VK_R;
    KeyEvent.DOM_VK_YELLOW = KeyEvent.DOM_VK_Y;
    KeyEvent.DOM_VK_BACK   = KeyEvent.DOM_VK_ESCAPE;
    KeyEvent.DOM_VK_EXIT   = KeyEvent.DOM_VK_BACK_SPACE;
    KeyEvent.DOM_VK_CH_INCREASE = KeyEvent.DOM_VK_ADD;
    KeyEvent.DOM_VK_CH_DECREASE = KeyEvent.DOM_VK_SUBTRACT;
    var lang = getGuiLanguageTest();
    document.write("<script src=" + mtvuiUtil.getBaseURL() + "i18n/" + lang + ".js" + "></script>");
}
