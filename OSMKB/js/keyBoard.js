  //移动键盘

function dragMing(idORclass1, idORclass2) {
    var obj = this; //这里的this是指dragMing对象么
    this.idORclass1 = idORclass1; //给dragMing的idORclass1赋值
    this.idORclass2 = idORclass2; //给dragMing的idORclass2赋值
    this.deltaX = 0;
    this.deltaY = 0;

    function dragStart(dragEvent) {
        obj.deltaX = dragEvent.clientX - $(obj.idORclass2).offset().left;
        obj.deltaY = dragEvent.clientY - $(obj.idORclass2).offset().top;
        $(document).bind("mousemove", dragMove);
        $(document).bind("mouseup", dragStop);
        dragEvent.preventDefault();
    }
    function dragMove(dragEvent) {
        $(obj.idORclass2).css({
            "left": (dragEvent.clientX - obj.deltaX) + "px",
            "top": (dragEvent.clientY - obj.deltaY) + "px"
        });
        dragEvent.preventDefault();

    }
    function dragStop() {
        $(document).unbind("mousemove", dragMove);
        $(document).unbind("mouseup", dragStop);

    }

    $(document).ready(function () {
        $(obj.idORclass1).bind("mousedown", dragStart);
    });
}
  // yellow key return jsonarray
function keyinfo(keyboarddata,keyboardkey,startkey) {
    var keyboard = [];
    for(var j=0;j<keyboardkey.length;j++){
        if(keyboardkey[j] == startkey){
            startkey=j;
            break;
        }
    }
    if(keyboarddata ==null || keyboarddata.length<1){
        for(var i=0;i<4;i++){
            var keyboardtemp={};
            keyboardtemp[""+keyboardkey[i+startkey]]="";
            keyboard.push(keyboardtemp);
        }
        return keyboard;
    }

    for(var i = 0; i<keyboarddata.length; i++){
        var keyboardtemp = {};
        keyboardtemp["" + keyboardkey[i+startkey]] = keyboarddata.charAt(i);
        keyboard.push(keyboardtemp);
    }

    return keyboard;
}
 // red && green return jsonarray
  function keyinfoNew(keyboarddata,keyboardkey,startkey){
     var keyboard = [];
      for(var j=0;j<keyboardkey.length;j++){
        if(keyboardkey[j] == startkey){
             startkey=j;
             break;
        }
        }
     if(keyboarddata ==null || keyboarddata.length<1){
         for(var i=0;i<4;i++){
                 var keyboardtemp={};
                 keyboardtemp[""+keyboardkey[i+startkey]]="";
               keyboard.push(keyboardtemp);
     }
      return keyboard;
     }


     for(var i=0;i<keyboarddata.length;i++){
                 var keyboardtemp={};
                 if(keyboarddata.charAt(i)!="*"){
                       keyboardtemp[""+keyboardkey[i+startkey]]=keyboarddata.charAt(i);
                 }else{
                     keyboardtemp[""+keyboardkey[i+startkey]]="";
                 }
               keyboard.push(keyboardtemp);
     }
    return keyboard;
 }
 // yellow key return json
 function keyinfoSec(keyboarddata,keyboardkey,startkey){
     for(var j=0;j<keyboardkey.length;j++){
        if(keyboardkey[j] == startkey){
             startkey=j;
             break;
        }
      }
    if(keyboarddata ==null || keyboarddata.length<1){
            var keyboardtemp={};
         for(var i=0;i<4;i++){
                 keyboardtemp[""+keyboardkey[i+startkey]]="";
        }
         return keyboardtemp;
      }

        var keyboardtemp={};
     for(var i=0;i<keyboarddata.length;i++){
              keyboardtemp[""+keyboardkey[i+startkey]]=keyboarddata.charAt(i);
             }
    return keyboardtemp;
 }
  // red && green return json
function keyinfoSecNew(keyboarddata,keyboardkey,startkey) {
    for(var j=0;j<keyboardkey.length;j++){
        if(keyboardkey[j] == startkey){
            startkey=j;
            break;
        }
    }
    if(keyboarddata ==null || keyboarddata.length<1){
        var keyboardtemp={};
        for(var i=0;i<4;i++){
            keyboardtemp[""+keyboardkey[i+startkey]]="";
        }
        return keyboardtemp;
    }

    var keyboardtemp={};
    for(var i=0;i<keyboarddata.length;i++){
        if(keyboarddata.charAt(i)!="*"){
            keyboardtemp[""+keyboardkey[i+startkey]]=keyboarddata.charAt(i);
        }else{
            keyboardtemp[""+keyboardkey[i+startkey]]="";
        }
    }
    return keyboardtemp;
}

 var DOM_VK_RED=0;
 var DOM_VK_GREEN=true;
 var DOM_VK_YELLOW=false;
  //draw keyboard
  function updateUIString () {
  	   var  osmmtvObj=new MtvObj();
            $.each($("[data-translate]"), function (k, item) {
             var strId = $(item).data("translate");
             $(item).text(osmmtvObj.getLangString(strId));
         });
   };
  function osmkbdrawKeyboard(type) {
      var country="";
      var language = "";
      var mtvObj = new MtvObj();
        var result= mtvObj.getGuiLanguage('');
        if(null != result){
          language=result.ITEMS[0].TEXT;
        }
      var countryresult= mtvObj.getCountry('');
     if(null != countryresult){
            country=countryresult.ITEMS[0].TEXT;
        }
      updateUIString() ;
      console.log("language:"+language)
      if(language=="ger"){
          language="deu";
      }else if(language=="fra"){
            language="fre";
      }
      else if(language=="rum"){
            language="ron";
      }
      else if(language=="slv"){
            language="slo";
      }
      else if(language=="hrv"){
            language="scr";
      }
      var keyvalue= OSMKBDate[language];
      if(keyvalue==null){
        keyvalue= OSMKBDate["eng"];
      }
      $("#keyboardNum").empty();
      $("#keyboardLetterQ").empty();
      $("#keyboardLetterA").empty();
      $("#keyboardLetterZ").empty();
      $("#keyboardSpaceBar").empty();
          var keyboardSymbol = [];
          var keyboardLetterQ = [];
          var keyboardLetterA = [];
          var keyboardLetterP_S = {};
          var keyboardLetterT_V ={};
          var keyboardLetterW_Z = {};
          var keyboardSpaceBar=[];
          var keyboardSymbolkey = ["190","188","50","222","223"];
          var keyboardLetterQkey = ["65","66","67","91","92","68","69","70","93","104"];
          var keyboardLetterAkey =["71","72","73","94","101","74","75","76","95","102","77","78","79","96","103"];
          var keyboardLetterP_Skey = ["80","81","82","83","97"];
              var keyboardLetterT_Vkey =["84","85","86","98","99"];
          var keyboardLetterW_Zkey = ["87","88","89","90","100"];
          var keyboardSpaceBarkey=["32","33","191","49","189"];
      var count_id = 0;
      if (type == "DOM_VK_GREEN") {
        if(DOM_VK_GREEN){
             var temp=keyvalue.MAIN_KB_GREEN_123[0].MAIN_KB_GREEN_1,temp1,temp2;
           keyboardSymbol = keyinfoNew(temp,keyboardSymbolkey,190);
               temp=keyvalue.MAIN_KB_GREEN_123[0].MAIN_KB_GREEN_2;
               temp1=keyvalue.MAIN_KB_GREEN_123[0].MAIN_KB_GREEN_3;
               keyboardLetterQ.push(keyinfoSecNew(temp,keyboardLetterQkey,65));
               keyboardLetterQ.push(keyinfoSecNew(temp1,keyboardLetterQkey,68));
           temp= keyvalue.MAIN_KB_GREEN_456[0].MAIN_KB_GREEN_4;
           temp1=keyvalue.MAIN_KB_GREEN_456[0].MAIN_KB_GREEN_5;
           temp2=keyvalue.MAIN_KB_GREEN_456[0].MAIN_KB_GREEN_6;
           keyboardLetterA.push(keyinfoSecNew(temp,keyboardLetterAkey,71));
           keyboardLetterA.push(keyinfoSecNew(temp1,keyboardLetterAkey,74));
           keyboardLetterA.push(keyinfoSecNew(temp2,keyboardLetterAkey,77));
           temp= keyvalue.MAIN_KB_GREEN_789[0].MAIN_KB_GREEN_7;
           keyboardLetterP_S=keyinfoSecNew(temp,keyboardLetterP_Skey,80)
           temp= keyvalue.MAIN_KB_GREEN_789[0].MAIN_KB_GREEN_8;
           keyboardLetterT_V=keyinfoSecNew(temp,keyboardLetterT_Vkey,84)
               temp= keyvalue.MAIN_KB_GREEN_789[0].MAIN_KB_GREEN_9;
               keyboardLetterW_Z=keyinfoSecNew(temp,keyboardLetterW_Zkey,87)
           temp= keyvalue.MAIN_KB_GREEN_0;
           keyboardSpaceBar= keyinfoNew(temp,keyboardSpaceBarkey,32);
           var key = "";
           DOM_VK_GREEN=false;
        }else{
             var temp=null,temp1,temp2;
           if(keyvalue.MAIN_KB_GREEN_123.length>1){
                    temp=keyvalue.MAIN_KB_GREEN_123[1].MAIN_KB_GREEN_1;
                    keyboardSymbol = keyinfoNew(temp,keyboardSymbolkey,190);
                    temp=keyvalue.MAIN_KB_GREEN_123[1].MAIN_KB_GREEN_2;
                            temp1=keyvalue.MAIN_KB_GREEN_123[1].MAIN_KB_GREEN_3;
                          keyboardLetterQ.push(keyinfoSecNew(temp,keyboardLetterQkey,65));
                    keyboardLetterQ.push(keyinfoSecNew(temp1,keyboardLetterQkey,68));
           }else{
                keyboardSymbol = [{ "190": ""}];
                        keyboardLetterQ = [{"65":""},  {"68":""}];
           }
           if(keyvalue.MAIN_KB_GREEN_456.length>1){
                 temp= keyvalue.MAIN_KB_GREEN_456[1].MAIN_KB_GREEN_4;
                 temp1=keyvalue.MAIN_KB_GREEN_456[1].MAIN_KB_GREEN_5;
                 temp2=keyvalue.MAIN_KB_GREEN_456[1].MAIN_KB_GREEN_6;
                 keyboardLetterA.push(keyinfoSecNew(temp,keyboardLetterAkey,71));
                   keyboardLetterA.push(keyinfoSecNew(temp1,keyboardLetterAkey,74));
                 keyboardLetterA.push(keyinfoSecNew(temp2,keyboardLetterAkey,77));
           }else{
                 keyboardLetterA = [{  "71": ""}, { "74": ""},{ "77":"" }];
           }
           if(keyvalue.MAIN_KB_GREEN_789.length>1){
                 temp= keyvalue.MAIN_KB_GREEN_789[1].MAIN_KB_GREEN_7;
                  keyboardLetterP_S=keyinfoSecNew(temp,keyboardLetterP_Skey,80)
                 temp= keyvalue.MAIN_KB_GREEN_789[1].MAIN_KB_GREEN_8;
                  keyboardLetterT_V=keyinfoSecNew(temp,keyboardLetterT_Vkey,84)
                     temp= keyvalue.MAIN_KB_GREEN_789[1].MAIN_KB_GREEN_9;
                 keyboardLetterW_Z=keyinfoSecNew(temp,keyboardLetterW_Zkey,87)
           }else{
               keyboardLetterP_S = { "80": ""};
                     keyboardLetterT_V = { "84": ""};
                 keyboardLetterW_Z = { "87": ""};
           }

           keyboardSpaceBar = [{ "32": ""}];
           var key = "";
           DOM_VK_GREEN=true;
        }
      }
        else if(type == "DOM_VK_RED"){
            if(DOM_VK_RED >= keyvalue.MAIN_KB_RED_123.length){
                DOM_VK_RED=0;
            }
             var temp,temp1,temp2;
            if(keyvalue.MAIN_KB_RED_123.length<2 && (keyvalue.MAIN_KB_RED_456.length>1 || keyvalue.MAIN_KB_RED_789.length>1 ) && DOM_VK_RED!=0){
                temp="";
                temp1="";
                temp2="";
            }else{
                temp=keyvalue.MAIN_KB_RED_123[DOM_VK_RED].MAIN_KB_RED_1;
                temp1= keyvalue.MAIN_KB_RED_123[DOM_VK_RED].MAIN_KB_RED_2;
              temp2=keyvalue.MAIN_KB_RED_123[DOM_VK_RED].MAIN_KB_RED_3;
            }
           keyboardSymbol = keyinfoNew(temp,keyboardSymbolkey,190);
               keyboardLetterQ.push(keyinfoSecNew(temp1,keyboardLetterQkey,65));
               keyboardLetterQ.push(keyinfoSecNew(temp2,keyboardLetterQkey,68));
            if(keyvalue.MAIN_KB_RED_456.length<2 && (keyvalue.MAIN_KB_RED_123.length>1 || keyvalue.MAIN_KB_RED_789.length>1 ) && DOM_VK_RED!=0){
                temp= "";
                temp1="";
                temp2="";
             }else{
                  temp= keyvalue.MAIN_KB_RED_456[DOM_VK_RED].MAIN_KB_RED_4;
                temp1=keyvalue.MAIN_KB_RED_456[DOM_VK_RED].MAIN_KB_RED_5;
                temp2=keyvalue.MAIN_KB_RED_456[DOM_VK_RED].MAIN_KB_RED_6;
               }
           keyboardLetterA.push(keyinfoSecNew(temp,keyboardLetterAkey,71));
           keyboardLetterA.push(keyinfoSecNew(temp1,keyboardLetterAkey,74));
           keyboardLetterA.push(keyinfoSecNew(temp2,keyboardLetterAkey,77));
            if(keyvalue.MAIN_KB_RED_789.length<2 && (keyvalue.MAIN_KB_RED_456.length>1 || keyvalue.MAIN_KB_RED_123.length>1 ) && DOM_VK_RED!=0){
              temp= "";
                temp1="";
                temp2="";
               }else{
                    temp= keyvalue.MAIN_KB_RED_789[DOM_VK_RED].MAIN_KB_RED_7;
                temp1=keyvalue.MAIN_KB_RED_789[DOM_VK_RED].MAIN_KB_RED_8;
                temp2=keyvalue.MAIN_KB_RED_789[DOM_VK_RED].MAIN_KB_RED_9;
               }
           keyboardLetterP_S=keyinfoSecNew(temp,keyboardLetterP_Skey,80)
           keyboardLetterT_V=keyinfoSecNew(temp1,keyboardLetterT_Vkey,84);
               keyboardLetterW_Z=keyinfoSecNew(temp2,keyboardLetterW_Zkey,87);
           if(DOM_VK_RED==0){
                temp= keyvalue.MAIN_KB_RED_0;
                keyboardSpaceBar= keyinfoNew(temp,keyboardSpaceBarkey,32);
           }else{
                keyboardSpaceBar=[{ "32": ""}];
           }
           var key = "";
           DOM_VK_RED++;
      }else if(type == "DOM_VK_YELLOW"){
           if(!DOM_VK_YELLOW){
                       var temp=keyvalue.MAIN_KB_YELLOW_SYMBOL_1,temp1,temp2;
                       keyboardSymbol = keyinfo(temp,keyboardSymbolkey,190);
                           temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_2;
                           temp1=keyvalue.MAIN_KB_YELLOW_SYMBOL_3;
                           keyboardLetterQ.push(keyinfoSec(temp,keyboardLetterQkey,65));
                           keyboardLetterQ.push(keyinfoSec(temp1,keyboardLetterQkey,68));
                       temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_4;
                       temp1=keyvalue.MAIN_KB_YELLOW_SYMBOL_5;
                       temp2=keyvalue.MAIN_KB_YELLOW_SYMBOL_6;
                       keyboardLetterA.push(keyinfoSec(temp,keyboardLetterAkey,71));
                     keyboardLetterA.push(keyinfoSec(temp1,keyboardLetterAkey,74));
                       keyboardLetterA.push(keyinfoSec(temp2,keyboardLetterAkey,77));
                       temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_7;
                       if(language == "Brazilian_Portuguese (bpt)" || language == "Argentinian Spanish (eas)"){
                          keyboardLetterP_S = { "80":temp.charAt(0),"81": "R$","82": temp.charAt(2),"83": temp.charAt(3),"97": temp.charAt(4) };
                       }else{
                          keyboardLetterP_S=keyinfoSec(temp,keyboardLetterP_Skey,80);
                       }
                       temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_8;
                           keyboardLetterT_V = keyinfoSec(temp,keyboardLetterT_Vkey,84);
                           temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_9;
                                 keyboardLetterW_Z = keyinfoSec(temp,keyboardLetterW_Zkey,87);
                       temp= keyvalue.MAIN_KB_YELLOW_SYMBOL_0;
                       keyboardSpaceBar = keyinfo(temp,keyboardSpaceBarkey,32);
                       var key = "";
                       DOM_VK_YELLOW=true;
           }else{
                       var temp=keyvalue.MAIN_KB_RED_123[0].MAIN_KB_RED_1,temp1,temp2;
                       if(country=="\0\0\0" || null == keyvalue["MAIN_KB_YELLOW_WEB_5_"+country]){
                        country="OTHER";
                       }
                       keyboardSymbol = [{ "190":keyvalue.MAIN_KB_YELLOW_WEB_1}];
                           keyboardLetterQ = [{"65": keyvalue.MAIN_KB_YELLOW_WEB_2}, {"68":keyvalue.MAIN_KB_YELLOW_WEB_3}];
                       keyboardLetterA =[ {  "71": keyvalue.MAIN_KB_YELLOW_WEB_4},{  "74":keyvalue["MAIN_KB_YELLOW_WEB_5_"+country]},{ "77":keyvalue.MAIN_KB_YELLOW_WEB_6}];
                       keyboardLetterP_S = { "80":keyvalue.MAIN_KB_YELLOW_WEB_7 };
                           keyboardLetterT_V = { "84": ""};
                                 keyboardLetterW_Z = { "87": ""};
                       keyboardSpaceBar = [{ "32": ""}];
                       var key = "";
                       DOM_VK_YELLOW=false;
           }


      }
        $("#ColorKey_Rednew").html('&nbsp;&nbsp;'+keyvalue.MAIN_KB_RED_BUTTON);
        $("#ColorKey_Greenew").html('&nbsp;&nbsp;'+keyvalue.MAIN_KB_GREEN_BUTTON);
        $("#ColorKey_Yellownew").html('&nbsp;&nbsp;'+keyvalue.MAIN_KB_YELLOW_BUTTON);
        $("#ColorKey_Bluenew").html('&nbsp;&nbsp;'+keyvalue.MAIN_KB_BLUE_BUTTON);
        if(keyvalue.MAIN_KB_BLUE_BUTTON.length>14){
            $(".footer-keyBoard").find("li").css('margin-left',"23px");
        }

    var keylength=0;
    for (var index in keyboardSymbol){
        keylength=keyboardSymbol.length;
        for (var key in keyboardSymbol[index]){
            keyContent = $('<div class="simple'+keylength+'Key" onclick="setOnclickValue(\''+ keyboardSymbol[index][''+key] +'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value="' + keyboardSymbol[index][''+key] + '">' + keyboardSymbol[index][''+key] + '</div>');
        $("#keyboardLetterQ").append(keyContent);
          count_id ++;
        }
    }

    for (var index in keyboardLetterQ){
        keylength=0;
      for (var key in keyboardLetterQ[index]){
        keylength++;
    }
        for (var key in keyboardLetterQ[index]){
                      keyContent = $('<div class="simple'+keylength+'Key" onclick="setOnclickValue(\''+keyboardLetterQ[index][''+key]  +'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value="' + keyboardLetterQ[index][''+key] + '">' + keyboardLetterQ[index][''+key] + '</div>');
                  $("#keyboardLetterQ").append(keyContent);
                      count_id ++;
        }
    }
    for (var index in keyboardLetterA){
    keylength=0;
    for (var key in keyboardLetterA[index]){
        keylength++;
    }
      $.each(keyboardLetterA[index], function (key, value) {
          if (value != "Caps Lock") {
              key = $('<div class="simple'+keylength+'Key" onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardLetterA").append(key);

          }
          else {
              key = $('<div class="capslockKey" onclick="setOnclickValue(\''+value+'\')"   id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardLetterA").append(key);
          }
          count_id ++;
      });
 }
    keylength=0;
    for (var key in keyboardLetterP_S){
        keylength++;
    }
      $.each(keyboardLetterP_S, function (key, value) {
                key = $('<div class="simple'+keylength+'Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
                 $("#keyboardLetterZ").append(key);
           count_id ++;
        });
   keylength=0;
    for (var key in keyboardLetterT_V){
        keylength++;
    }
     $.each(keyboardLetterT_V, function (key, value) {
           key = $('<div class="simple'+keylength+'Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
           $("#keyboardLetterZ").append(key);

           count_id ++;
        });

  keylength=0;
    for (var key in keyboardLetterW_Z){
        keylength++;
    }
     $.each(keyboardLetterW_Z, function (key, value) {
           key = $('<div class="simple'+keylength+'Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
           $("#keyboardLetterZ").append(key);

           count_id ++;
        });

   keylength=0;
    for (var key in keyboardSpaceBar){
        keylength++;
    }
    for (var index in keyboardSpaceBar){
        for (var key in keyboardSpaceBar[index]){
            if(keyboardSpaceBar[index][''+key] == 'Spa'){
                keyContent = $('<div class="simple'+keylength+'Key"  onclick="setOnclickValue(\' '+'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value=\' '+'\'>' + keyboardSpaceBar[index][''+key] + '</div>');
                $("#keyboardSpaceBar").append(keyContent);
            }else{
                keyContent = $('<div class="simple'+keylength+'Key"  onclick="setOnclickValue(\''+keyboardSpaceBar[index][''+key]+'\')" id="key_' + count_id + '"  name="key"  key="' + key + '" value="' + keyboardSpaceBar[index][''+key] + '">' + keyboardSpaceBar[index][''+key] + '</div>');
                $("#keyboardSpaceBar").append(keyContent);
            }
            count_id ++;
        }
    }

 }

/**
*键盘
*/
//打开键盘
/*function openKeyboard(ID) {
    $("#keyboard").css("visibility", "visible");
    //$("#state").val(ID);
//  $("#key_4").addClass("osmkbkey-active");
    //$("#txtID").val("123");
}

//关闭键盘
function closeKeyboard() {
    $("#keyboard").css("visibility", "hidden")
}*/
/*
$('#btn-new-srch-done').on('click', function(event){*/
/*function newdialogkeyboard(agr){
        $("#new-search-dialog").css("display","none");
 //   event.preventDefault();
    $('#keyBoard-dialognew').dialog({
        autoOpen: true,
    //    modal:true,
        width:630,
        height:350,
        buttons: null
    });

    }*/
/*
});*/

var OSMKB = function () {
    this.doneBack = null;
    this.hideBack = null;
    this.element = "";
    this.osmkbresult = "";
    this.osmkbisblink = 0;
    this.osmkbtextValue = ''; // input vale
    this.osmkblightposition = 0;// heightlight position
    this.osmkblight=null;
    this.osmkbkeynumber=0;
    this.osmkbnumberkeystatus="";
    this.osmkbnumkeyTimerstatus;
    this.inputStringlength=21;
    this.inputlength=64;
    if (!window.mtvuiOSMKB) {
        this.status = "close";
        this.osmkbDom = $('<div id="keyBoard-dialog" class="keyBoard-dialog" style="display:none";></div>');
        //  $("body").append('<div id="keyBoard-dialognew" style="display:none"><div id="keyBoard-dialog" class="keyBoard-dialog" style="background:black"></div></div>');
        //  var tabs = $("#keyBoard-dialog").tabs();
        var divKeyBoard= $('<div class="osmkbinputlayout"><div class="osmkbinput-text"><div  id="key-board-txtID" style="width:100%;"></div></div></div>'+
                           '<div class="osmkbkeylayout"><div id="osmkeyboard" class="osmkeyboard"><div id="keyboardNum"></div><div id="keyboardLetterQ"></div><div id="keyboardLetterA"></div><div id="keyboardLetterZ"></div><div id="keyboardSpaceBar"></div></div><div id="keyboard-btn">'+
                           '<div class="osmkbbtn-keyboard-done  osmbtn-select-style" id="btn-keyboard-done" data-translate="DONE">Done</div><div class="osmkbbtn-keyboard-hide osmbtn-select-style" id="btn-keyboard-hide" data-translate="HIDE">Hide</div></div>'+
                           '<div class="footer-keyBoard"><ul> <li><img src="../OSMKB/res/ColourBar/ColorKey_Red.png"/><span id="ColorKey_Rednew"></span></li><li><img src="../OSMKB/res/ColourBar/ColorKey_Green.png"/><span id="ColorKey_Greenew">&nbsp;&nbsp;ABAA</span>'+
                           '</li> <li><img src="../OSMKB/res/ColourBar/ColorKey_Yellow.png"/><span id="ColorKey_Yellownew">&nbsp;&nbsp;123www</span></li>'+
                           '<li style="width: auto;"><img src="../OSMKB/res/ColourBar/ColorKey_Blue.png"/><span id="ColorKey_Bluenew">Backspace</span></li></ul></div></div>');
        //      $("#keyBoard-dialog").append(divKeyBoard);
        divKeyBoard.appendTo(this.osmkbDom);
 //       var foot = $('<div id="osmkeyboard" class="osmkeyboard"><div id="keyboardNum"></div><div id="keyboardLetterQ"></div><div id="keyboardLetterA"></div><div id="keyboardLetterZ"></div><div id="keyboardSpaceBar"></div></div>');
        //    $("#keyBoard-dialog").append(divKeyBoard);
   //     foot.appendTo(this.osmkbDom);
        this.osmkbDom.appendTo('body');
        osmkbdrawKeyboard("DOM_VK_RED");
        window.mtvuiOSMKB = this.osmkbDom;
    }
};

jQuery.fn.showTagInfo = function() {
    var tags = this.map( function() {
        return ( this.id ? "#" + this.id : "" );
    } ).get();
    return tags;
};

var find_valid_keyNew= function (idx,idxtemp) {
    var new_str = "key_" + idx;
    var idxtemp1=idxtemp2=idx;
    var temp=$("#"+new_str+"").text();
    while(temp==" " || temp == ""){
        idxtemp2 ++;
        if (idxtemp2 >= (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length-1)){
            idxtemp2 = idxtemp;
        }
        new_str = "key_" + idxtemp2;
        var temp=$("#"+new_str+"").text();
        temp=$("#"+new_str+"").text();
        if(temp!=" " && temp != ""){
            return idxtemp2;
        }
        idxtemp1--;
        if (idxtemp1 < 0){
            idxtemp1 = (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length)-1;
        }
        new_str = "key_" + idxtemp1;
        temp=$("#"+new_str+"").text();
        if(temp!=" " && temp != ""){
            return idxtemp1;
        }
    }
    return idx;
};



 var keyboardLetterQ ;
 var keyboardLetterA ;
 var keyboardLetterZ ;
 var keyboardSpaceBar;

OSMKB.prototype.keyProcess=function(kc){
    var key = kc.keyCode || kc.which;
    console.log("Enter find_channel_type_text_key_procNew");
    keyboardLetterQ = $("#keyboardLetterQ").find("div");
    keyboardLetterA = $("#keyboardLetterA").find("div");
    keyboardLetterZ = $("#keyboardLetterZ").find("div");
    keyboardSpaceBar = $("#keyboardSpaceBar").find("div");
    var keyboardLetterA_4 = $(keyboardLetterA.showTagInfo()[0]).attr("class").substr(6,1);
    var keyboardLetterA_6 = $(keyboardLetterA.showTagInfo()[keyboardLetterA.length-1]).attr("class").substr(6,1);
    var keyboardLetterA_5 = keyboardLetterA.length-keyboardLetterA_4-keyboardLetterA_6;

    var keyboardLetterZ_7 = $(keyboardLetterZ.showTagInfo()[0]).attr("class").substr(6,1);
    var keyboardLetterZ_9 = $(keyboardLetterZ.showTagInfo()[keyboardLetterZ.length-1]).attr("class").substr(6,1);
    var keyboardLetterZ_8 =keyboardLetterZ.length-keyboardLetterZ_7-keyboardLetterZ_9;

    var keyboardLetterQ_1 = $(keyboardLetterQ.showTagInfo()[0]).attr("class").substr(6,1);
    var keyboardLetterQ_3 = $(keyboardLetterQ.showTagInfo()[keyboardLetterQ.length-1]).attr("class").substr(6,1);
    var keyboardLetterQ_2 = keyboardLetterQ.length-keyboardLetterQ_1-keyboardLetterQ_3;
    switch (key){
        case KeyEvent.DOM_VK_UP:
        {
            //var activeValue = $("#keyboard").find(".key-active").attr("value");
            //str_id like as key_1/key_2...
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            //string to int
            if(str_id == null){
            	break;
            }
            var idx = parseInt(str_id.split("_")[1]);
            var idxtemp=idx;
            //remove old active class
            if($("#keyBoard-dialog").find(".osmkbkey-active") != null){
                $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
            }
            if( $("#keyBoard-dialog").find(".osmkbkey-hideactive") != null){
            	 $("#keyBoard-dialog").find(".osmkbkey-hideactive").removeClass("osmkbkey-hideactive");
            }
            if (str_id == "btn-keyboard-hide"){
                $("#btn-keyboard-done").addClass("osmkbkey-active");
                break;
            }
            else  if (str_id == "btn-keyboard-done"){
                $("#btn-keyboard-hide").addClass("osmkbkey-hideactive osmkbkey-active");
                break;
            }
            //index computing by each row
            // row 1
     /*       var keyboardLetterA_4 = $(keyboardLetterA.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterA_6 = $(keyboardLetterA.showTagInfo()[keyboardLetterA.length-1]).attr("class").substr(6,1);
            var keyboardLetterA_5 = keyboardLetterA.length-keyboardLetterA_4-keyboardLetterA_6;

            var keyboardLetterZ_7 = $(keyboardLetterZ.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterZ_9 = $(keyboardLetterZ.showTagInfo()[keyboardLetterZ.length-1]).attr("class").substr(6,1);
            var keyboardLetterZ_8 =keyboardLetterZ.length-keyboardLetterZ_7-keyboardLetterZ_9;

            var keyboardLetterQ_1 = $(keyboardLetterQ.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterQ_3 = $(keyboardLetterQ.showTagInfo()[keyboardLetterQ.length-1]).attr("class").substr(6,1);
            var keyboardLetterQ_2 = keyboardLetterQ.length-keyboardLetterQ_1-keyboardLetterQ_3;*/
            console.log(idx);
            //1 -3
            if (idx > -1 && idx < keyboardLetterQ_1){
             /*   if(idx<keyboardLetterZ_7){
                    idx = keyboardLetterQ.length+keyboardLetterA.length+idx-1;
                }else{
                    idx = keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ_7-1;
                }
                */
                console.log(idx);
                break;
            }
            else if (idx > (keyboardLetterQ_1-1) && idx < (keyboardLetterQ.length-keyboardLetterQ_3)){
             /*   var temp=idx-keyboardLetterQ_1+1;
                if(temp<keyboardSpaceBar.length){
                    idx = keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+temp-1;
                }else{
                    idx = keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length-1;
                }*/
                  break;
            }
            else if (idx > (keyboardLetterQ.length-keyboardLetterQ_3-1) && idx < keyboardLetterQ.length){
               /* var temp=idx-keyboardLetterQ_1-keyboardLetterQ_2+1;
                if(temp<parseInt(keyboardLetterZ_9)){
                    idx =keyboardLetterQ.length+ keyboardLetterA.length+parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8)+temp-1;
                }else{
                    idx =keyboardLetterQ.length+ keyboardLetterA.length+keyboardLetterZ.length-1;
                }*/
                  break;
            }
            // 4-6
            else if (idx > (keyboardLetterQ.length-1 )&& idx < (keyboardLetterQ.length+parseInt(keyboardLetterA_4))){
                var temp=idx-keyboardLetterQ.length+1;
                if(temp<parseInt(keyboardLetterQ_1)){
                    idx = temp-1;
                }else{
                    idx = keyboardLetterQ_1-1;
                }
            }else if(idx>(keyboardLetterQ.length-1+parseInt(keyboardLetterA_4)) && idx<(keyboardLetterQ.length+ keyboardLetterA.length-keyboardLetterA_6)){
                    var temp=idx-keyboardLetterQ.length-keyboardLetterA_4+1;
                    if(temp<parseInt(keyboardLetterQ_2)){
                        idx=parseInt(keyboardLetterQ_1)+temp-1;
                    }else{
                        idx=parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)-1;
                    }
            }else if(idx>(keyboardLetterQ.length+keyboardLetterA.length-parseInt(keyboardLetterA_6)-1) && idx< (keyboardLetterQ.length+keyboardLetterA.length)){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA_4-keyboardLetterA_5+1;
                if(temp<parseInt(keyboardLetterQ_3)){
                        idx=parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)+temp-1;
                    }else{
                        idx=keyboardLetterQ.length-1;
                    }
            }
            // 7-9
            else if (idx > (keyboardLetterQ.length+keyboardLetterA.length-1) && idx < (keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7))){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA.length+1;
                if (temp < parseInt(keyboardLetterA_4)){
                    idx=keyboardLetterQ.length+temp-1;
                }else{
                    idx=keyboardLetterQ.length+parseInt(keyboardLetterA_4)-1;
                }
            }else if(idx>(keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)-1) && idx<(keyboardLetterQ.length+ keyboardLetterA.length+keyboardLetterZ.length-parseInt(keyboardLetterZ_9))){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA.length-parseInt(keyboardLetterZ_7)+1;
                if(temp<parseInt(keyboardLetterA_5)){
                    idx=keyboardLetterQ.length+parseInt(keyboardLetterA_4)+temp-1;
                }else{
                    idx=keyboardLetterQ.length+parseInt(keyboardLetterA_4)+parseInt(keyboardLetterA_5)-1;
                }
            }
            else if(idx>(keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length-keyboardLetterZ_9-1) && idx<keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA.length-parseInt(keyboardLetterZ_7)-parseInt(keyboardLetterZ_8)+1;
                if(temp<parseInt(keyboardLetterA_6)){
                    idx=keyboardLetterQ.length+keyboardLetterA.length-parseInt(keyboardLetterA_6)+temp-1;
                }else{
                    idx=keyboardLetterQ.length+keyboardLetterA.length-1;
                }
            }
            // 0
            else if (idx > (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length-1) && idx < (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length)){
               var temp=idx-keyboardLetterQ.length-keyboardLetterA.length-keyboardLetterZ.length+1;
               if(temp<parseInt(keyboardLetterZ_8)){
                 idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+temp-1;
               }else{
                 idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8)-1;
               }
            }
            console.log(idx);
            //Joining together new string
            var new_str = "key_" + find_valid_keyNew(idx,idxtemp);
            //new idx add active class
            $("#"+new_str+"").addClass("osmkbkey-active");
            break;
        }
        case KeyEvent.DOM_VK_DOWN:
        {
            //var activeValue = $("#keyboard").find(".osmkbkey-active").attr("value");
            //str_id like as key_1/key_2...
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            if(str_id == null){
              var idx = idxtemp =	Math.floor(parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)/2);
              var new_str = "key_" +  find_valid_keyNew(idx,idxtemp);
             $("#"+new_str+"").addClass("osmkbkey-active");
              console.log(idx);
              break;
            }
            //string to int
            try{
                var idx = parseInt(str_id.split("_")[1]);
            }
            catch(err) {
                idx = 0;
                 console.log("error for parseInt!");
                 console.log(err);
            }
          /*  var keyboardLetterA_4 = $(keyboardLetterA.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterA_6 = $(keyboardLetterA.showTagInfo()[keyboardLetterA.length-1]).attr("class").substr(6,1);
            var keyboardLetterA_5 = keyboardLetterA.length-keyboardLetterA_4-keyboardLetterA_6;

            var keyboardLetterZ_7 = $(keyboardLetterZ.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterZ_9 = $(keyboardLetterZ.showTagInfo()[keyboardLetterZ.length-1]).attr("class").substr(6,1);
            var keyboardLetterZ_8 =keyboardLetterZ.length-keyboardLetterZ_7-keyboardLetterZ_9;

            var keyboardLetterQ_1 = $(keyboardLetterQ.showTagInfo()[0]).attr("class").substr(6,1);
            var keyboardLetterQ_3 = $(keyboardLetterQ.showTagInfo()[keyboardLetterQ.length-1]).attr("class").substr(6,1);
            var keyboardLetterQ_2 = keyboardLetterQ.length-keyboardLetterQ_1-keyboardLetterQ_3;*/
            //remove old active class
            if($("#keyBoard-dialog").find(".osmkbkey-active") != null){
                $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
            }
            if( $("#keyBoard-dialog").find(".osmkbkey-hideactive") != null){
            	 $("#keyBoard-dialog").find(".osmkbkey-hideactive").removeClass("osmkbkey-hideactive");
            }
            if (str_id == "btn-keyboard-done"){
                $("#btn-keyboard-hide").addClass("osmkbkey-hideactive osmkbkey-active");
                break;
            }
            else if (str_id == "btn-keyboard-hide"){
                $("#btn-keyboard-done").addClass("osmkbkey-active");
                break;
            }
            //index computing by each row
            // row 1
            console.log(idx);
            var idxtemp=idx;
            //1-3
            if (idx > -1 && idx < parseInt(keyboardLetterQ_1)){
                if (idx < parseInt(keyboardLetterA_4) ){
                    idx = keyboardLetterQ.length+idx;
                }
                else{
                    idx = keyboardLetterQ.length+parseInt(keyboardLetterA_4);
                }
                console.log(idx);
            }
            else if (idx > (parseInt(keyboardLetterQ_1) -1 )&& idx < (keyboardLetterQ.length-parseInt(keyboardLetterQ_3))){
                var temp=idx-parseInt(keyboardLetterQ_1)+1;
                if(temp<parseInt(keyboardLetterA_5)){
                    idx = keyboardLetterQ.length+parseInt(keyboardLetterA_4)+temp-1;
                }else{
                    idx = keyboardLetterQ.length+parseInt(keyboardLetterA_4)+parseInt(keyboardLetterA_5)-1;
                }
            }
            else if (idx > (parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)-1) && idx < (keyboardLetterQ.length)){
                var temp=idx-parseInt(keyboardLetterQ_1)-parseInt(keyboardLetterQ_2)+1;
                if(temp < parseInt(keyboardLetterA_6)){
                    idx = (keyboardLetterQ.length+parseInt(keyboardLetterA_4)+parseInt(keyboardLetterA_5)+temp)-1;
                }else{
                    idx = (keyboardLetterQ.length+keyboardLetterA.length)-1;
                }
            }
            //4-6
            else if (idx > (keyboardLetterQ.length-1)&& idx <(keyboardLetterQ.length+parseInt(keyboardLetterA_4))){
                var temp=idx-keyboardLetterQ.length+1;
                if(temp<parseInt(keyboardLetterZ_7)){
                    idx = (keyboardLetterQ.length+keyboardLetterA.length)+temp-1;
                }else{
                    idx = (keyboardLetterQ.length+keyboardLetterA.length)+parseInt(keyboardLetterZ_7)-1;
                }
            }else if(idx>(keyboardLetterQ.length-1+parseInt(keyboardLetterA_4)) && idx<(keyboardLetterQ.length+ keyboardLetterA.length-parseInt(keyboardLetterA_6))){
                    var temp=idx-keyboardLetterQ.length-keyboardLetterA_4+1;
                    if(temp<parseInt(keyboardLetterZ_8)){
                        idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+temp-1;
                    }else{
                        idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8)-1;
                    }
            }else if(idx>(keyboardLetterQ.length+keyboardLetterA.length-parseInt(keyboardLetterA_6)-1) && idx< (keyboardLetterQ.length+keyboardLetterA.length)){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA_4-keyboardLetterA_5+1;
                if(temp<parseInt(keyboardLetterZ_9)){
                        idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8)+parseInt(temp)-1;
                    }else{
                        idx=keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8)+parseInt(keyboardLetterZ_9)-1;
                    }
            }
            //7-9
            else if (idx > (keyboardLetterQ.length+keyboardLetterA.length-1) && idx < (keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7))){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA.length+1;
                if (temp < parseInt(keyboardLetterQ_1)){
                    idx = temp-1;
                }else{
                    idx = parseInt(keyboardLetterQ_1)-1;
                }
            }else if(idx>(keyboardLetterQ.length+keyboardLetterA.length+parseInt(keyboardLetterZ_7)-1) && idx<(keyboardLetterQ.length+ keyboardLetterA.length+keyboardLetterZ.length-parseInt(keyboardLetterZ_9))){
                var temp=idx-keyboardLetterQ.length-keyboardLetterA.length-parseInt(keyboardLetterZ_7)+1;
                if(temp<parseInt(keyboardLetterQ_2)){
                    idx=keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+temp-1;
                }else{
                    idx=keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length-1;
                }
            }
            else if(idx>(keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length-keyboardLetterZ_9-1) && idx<keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length){
                var temp = idx-keyboardLetterQ.length-keyboardLetterA.length-parseInt(keyboardLetterZ_7)-parseInt(keyboardLetterZ_8)+1;
                if(temp < parseInt(keyboardLetterQ_3)){
                    idx = parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)+temp-1;
                }else{
                    idx = keyboardLetterQ.length-1;
                }
            }
            //0
            else if (idx > (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length-1) && idx < (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length)){
               var temp=idx-keyboardLetterQ.length-keyboardLetterA.length-keyboardLetterZ.length+1;
               if(temp<parseInt(keyboardLetterQ_2)){
                    idx=parseInt(keyboardLetterQ_1)+temp-1;
               }else{
                    idx=parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2)-1;
               }
            }
            console.log(idx);
            //Joining together new string
            var new_str = "key_" +  find_valid_keyNew(idx,idxtemp);
            //new idx add active class
            $("#"+new_str+"").addClass("osmkbkey-active");
            break;
        }
        case KeyEvent.DOM_VK_LEFT:
        {
            //var activeValue = $("#keyboard").find(".osmkbkey-active").attr("value");
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            //handle button of DONE/HIDE
            console.log(str_id);
            if (str_id == "btn-keyboard-done" || str_id == "btn-keyboard-hide"){
            //  idx = 9;
                //Joining together new string
                var new_str=$("#keyboardLetterQ").find("div").last().attr("id");
                //new idx add active class
                $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
                if( $("#keyBoard-dialog").find(".osmkbkey-hideactive") != null){
            			 $("#keyBoard-dialog").find(".osmkbkey-hideactive").removeClass("osmkbkey-hideactive osmkbkey-active");
           			 }
                $("#"+new_str+"").addClass("osmkbkey-active");
                break;
            }else if(str_id==null){
            	if(this.osmkblightposition>0){
            		this.osmkblightposition--;
            	}
            	 break;
            }

            //str_id like as key_1/key_2...
            var idx = parseInt(str_id.split("_")[1]);
            //remove old active class
            $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
            //index --
            var new_str;
            do{
                idx--;
                if (idx < 0){
                    idx = (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length)-1;
                }
                new_str = "key_" + idx;
                var temp=$("#"+new_str+"").text();
            }while(temp==" " || temp == "")

            //Joining together new string
            var new_str = "key_" + idx;
            //new idx add active class
            $("#"+new_str+"").addClass("osmkbkey-active");
            break;
        }
        case KeyEvent.DOM_VK_RIGHT:
        {
            //var activeValue = $("#keyboard").find(".osmkbkey-active").attr("value");
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            //str_id like as key_1/key_2...
            console.log(str_id);
            if (str_id == "btn-keyboard-done" || str_id == "btn-keyboard-hide"){
                //do nothing
                break;
            }else if(str_id==null){
            	if(this.osmkblightposition<this.osmkbtextValue.length){
            		this.osmkblightposition++;
            	}
            	 break;
            }
            var idx = str_id.split("_")[1];
            //remove old active class
            $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
            //index ++
            console.log(idx);
            //handle special key ,should jump to button DONE
            if (idx == (keyboardLetterQ.length-1) || idx == (keyboardLetterQ.length+keyboardLetterA.length-1) || idx == (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length-1)){
                $("#btn-keyboard-done").addClass("osmkbkey-active");
                break;
            }
        /*  idx ++;
            if (idx > (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length-1)){
                idx = 0;
            }*/
            var new_str;
            do{
                idx ++;
                if (idx > (keyboardLetterQ.length+keyboardLetterA.length+keyboardLetterZ.length+keyboardSpaceBar.length-1)){
                    idx = 0;
                }
                new_str = "key_" + idx;
                var temp=$("#"+new_str+"").text();
            }while(temp==" " || temp == "")
            //Joining together new string
            //new idx add active class
            $("#"+new_str+"").addClass("osmkbkey-active");
            break;
        }
        case KeyEvent.DOM_VK_RETURN:
        {
            console.log("KeyEvent.DOM_VK_RETURN");
            //get active id
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            if (str_id == "btn-keyboard-done") {
                //back up to pre page
                this.close();
                this.status="done";
                if(typeof this.doneBack == "function"){
                    this.doneBack(this.osmkbDom, this.osmkbtextValue);
                }
                break;
            }
            else if (str_id == "btn-keyboard-hide") {
                this.close();
                this.status="hide";
                if(typeof this.hideBack == "function") {
                    this.hideBack(this.osmkbDom);
                }
                break;
            }else if(str_id == "" ||str_id == null){
                this.open('');
                $("#btn-keyboard-done").addClass("osmkbkey-active");
                break;
            }
            if(this.osmkbtextValue.length>this.inputlength){
		 				   	break;
							}
            var activeValue =$("#keyBoard-dialog").find(".osmkbkey-active").attr("value");
            //  var str = oldValue+activeValue;
            var pos = this.osmkblightposition;
            this.osmkbtextValue=this.osmkbtextValue.substr(0,pos) + activeValue + this.osmkbtextValue.substring(pos);
            this.osmkblightposition+=activeValue.length;
            this.osmkbUpdate();
            //  $("#key-board-txtID").text(str);
            $("#key-board-txtID").focus();
            $("#"+str_id).addClass("osmkbkey-active");
            break;
        }
        case KeyEvent.DOM_VK_GREEN:
        {
            console.log("KeyEvent.DOM_VK_GREEN");
            //switch keyboard to UPPER
            osmkbdrawKeyboard("DOM_VK_GREEN");
            $("#btn-keyboard-done").addClass("osmkbkey-active");
            $("#btn-keyboard-hide").attr("class","osmkbbtn-keyboard-hide osmbtn-select-style");
            break;
        }
        case KeyEvent.DOM_VK_RED:{
            console.log("KeyEvent.DOM_VK_RED");
            osmkbdrawKeyboard("DOM_VK_RED");
            $("#btn-keyboard-done").addClass("osmkbkey-active");
            $("#btn-keyboard-hide").attr("class","osmkbbtn-keyboard-hide osmbtn-select-style");
            break;
        }
        case KeyEvent.DOM_VK_YELLOW:{
            console.log("KeyEvent.DOM_VK_YELLOW");
            osmkbdrawKeyboard("DOM_VK_YELLOW");
            $("#btn-keyboard-done").addClass("osmkbkey-active");
            $("#btn-keyboard-hide").attr("class","osmkbbtn-keyboard-hide osmbtn-select-style");
            break;
        }
        case KeyEvent.DOM_VK_BLUE:{
            console.log("KeyEvent.DOM_VK_BLUE");
            this.setOnclickBlue();
         /*   var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            $("#"+str_id).addClass("osmkbkey-active");*/
            break;
        }
        case KeyEvent.DOM_VK_BACK:{
        	      this.close();
                this.status="done";
                if(typeof this.doneBack == "function"){
                    this.doneBack(this.osmkbDom, this.osmkbtextValue);
                }
                break;
        }
        case KeyEvent.DOM_VK_0:{
        	if(this.osmkbtextValue.length>this.inputlength){
		       	 break;
	       		}
	 	        if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_0){
	        		 this.osmkbkeynumber=0;
	        	}
	        		if(this.osmkbnumkeyTimerstatus !=""){
	        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
	        	}
	        	
	        	this.osmkbnumberkey(0, keyboardSpaceBar);
	          var	self=this;
            this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
	        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_0;
	        	break;
        }case KeyEvent.DOM_VK_1:{
        	if(this.osmkbtextValue.length>this.inputlength){
						 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_1){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
	        	     clearTimeout(this.osmkbnumkeyTimerstatus);
        	}
        	this.osmkbnumberkey(0, keyboardLetterQ);
          var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_1;
        	break;
        }
        case KeyEvent.DOM_VK_2:{
        	if(this.osmkbtextValue.length>this.inputlength){
							 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_2){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=""){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(keyboardLetterQ_1, keyboardLetterQ);
          var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_2;
          break;
        }
        case KeyEvent.DOM_VK_3:{
        	if(this.osmkbtextValue.length>this.inputlength){
							 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_3){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=""){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(parseInt(keyboardLetterQ_1)+parseInt(keyboardLetterQ_2), keyboardLetterQ);
          var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_3;
          break;
        }
        case KeyEvent.DOM_VK_4:{
        	if(this.osmkbtextValue.length>this.inputlength){
							 break;
						}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_4){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=""){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(0, keyboardLetterA);
        	var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_4;
          break;
        }
        case KeyEvent.DOM_VK_5:{
		       if(this.osmkbtextValue.length>this.inputlength){
							 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_5){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(keyboardLetterA_4, keyboardLetterA);
        	var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_5;
          break;
        }
        case KeyEvent.DOM_VK_6:{
        	if(this.osmkbtextValue.length>this.inputlength){
					 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_6){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(parseInt(keyboardLetterA_4)+parseInt(keyboardLetterA_5), keyboardLetterA);
        	var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_6;
          break;
        }
        case KeyEvent.DOM_VK_7:{
        	if(this.osmkbtextValue.length>this.inputlength){
						 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_7){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(0, keyboardLetterZ);
        	var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_7;
          break;
        }
        case KeyEvent.DOM_VK_8:{
        	if(this.osmkbtextValue.length>this.inputlength){
		 					break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_8){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(keyboardLetterZ_7, keyboardLetterZ);
        	var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_8;
          break;
        }
        case KeyEvent.DOM_VK_9:{
        	if(this.osmkbtextValue.length>this.inputlength){
						 break;
					}
        	if(this.osmkbnumberkeystatus != "" && this.osmkbnumberkeystatus != KeyEvent.DOM_VK_9){
        		 this.osmkbkeynumber=0;
        	}
        		if(this.osmkbnumkeyTimerstatus !=null){
        	     clearTimeout(this.osmkbnumkeyTimerstatus)  ;
        	}
        	
        	this.osmkbnumberkey(parseInt(keyboardLetterZ_7)+parseInt(keyboardLetterZ_8), keyboardLetterZ);
          var	self=this;
          this.osmkbnumkeyTimerstatus=setTimeout(function(){self.osmkbnumkeyTimer()},1000);
        	this.osmkbnumberkeystatus=KeyEvent.DOM_VK_9;
          break;
        }
        default: {
            return false;
        }
    };
    return true;
};
OSMKB.prototype.osmkbnumkeyTimer=function(){
	   this.osmkbnumberkeystatus="";
     var activeValue = $("#keyBoard-dialog").find(".osmkbkey-active").attr("value");
     var pos = this.osmkblightposition;
     this.osmkbtextValue=this.osmkbtextValue.substr(0,pos) + activeValue + this.osmkbtextValue.substring(pos);
     this.osmkblightposition+=activeValue.length;
     this.osmkbUpdate();
     this.osmkbkeynumber=0;
    this.osmkbnumkeyTimerstatus=null;
}
OSMKB.prototype.osmkbnumberkey=function(keyboardLetter1,keyboardLetter2){
	      //var activeValue = $("#keyboard").find(".osmkbkey-active").attr("value");
            var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
            //handle button of DONE/HIDE
            console.log(str_id);
            if (str_id == "btn-keyboard-done" || str_id == "btn-keyboard-hide"){
            //  idx = 9;
                //Joining together new string
           //     var new_str=$("#keyboardLetterQ").find("div").last().attr("id");
                //new idx add active class
                $("#keyBoard-dialog").find(".osmkbkey-active").removeClass("osmkbkey-active");
           //     $("#"+new_str+"").addClass("osmkbkey-active");
           //     break;
            }else{
            	  $("#"+str_id).removeClass("osmkbkey-active");
            }
      var osmkbclass =  $(keyboardLetter2.showTagInfo()[parseInt(keyboardLetter1)]).attr("class").substr(6,1);
      this.osmkbkeynumber = this.osmkbkeynumber % parseInt(osmkbclass);
	    str_id=$(keyboardLetter2.showTagInfo()[parseInt(keyboardLetter1)+this.osmkbkeynumber]).attr("id");
	    this.osmkbchecknumkey(str_id);
	    this.osmkbkeynumber++;
}

OSMKB.prototype.osmkbchecknumkey= function (str_id){
	
	   while($("#"+str_id).attr("value")==""){
	   	str_id=$("#"+str_id).attr("id").split("_")[1];
	   	str_id="key_"+(parseInt(str_id)+1);
	   	this.osmkbkeynumber++
	   }
	   $("#"+str_id).addClass("osmkbkey-active");
	
}
OSMKB.prototype.setOnclickBlue = function () {
    var pos = this.osmkblightposition;
    if(this.osmkblightposition>0){
	    this.osmkbtextValue = this.osmkbtextValue.substr(0, pos-1) + this.osmkbtextValue.substring(pos);
	    this.osmkblightposition--;
    }
    this.osmkbUpdate();
   /* var str_id = $("#keyBoard-dialog").find(".osmkbkey-active").attr("id");
    if(str_id != "btn-keyboard-done") {
        $("#keyBoard-dialog").find(".osmkbkey-active").focus();
    }*/
};

// 获取值
OSMKB.prototype.getResult=function() {
    if(this.status=="hide"){
        return false;
    }
  return this.osmkbtextValue;
};

//打开键盘
OSMKB.prototype.open = function(args) {
    //hide top menubar
    this.status = "open";
    if(typeof args == "object") {
        this.osmkbresult = args.sendvalue;
        this.osmkbtextValue = this.osmkbresult.toString();
        this.osmkblightposition = this.osmkbtextValue.length;
        this.doneBack = args.doneBack;
    		this.hideBack = args.hideBack;
   		  this.element = args.element;
        this.inputlength=args.inputlength==null? 64:parseInt(args.inputlength);
    }
     this.osmkbUpdate();
    $("#keyBoard-dialog").show();
    //if there is not active item, active Done button.
    if ($("#keyBoard-dialog").find(".osmkbkey-active").length == 0){
        $("#btn-keyboard-done").addClass("osmkbkey-active");
    }else{
        $("#btn-keyboard-hide").removeClass("osmkbkey-active osmkbkey-hideactive");
    }
    DOM_VK_RED=0;
    $("#btn-keyboard-done").addClass("osmkbkey-active");
    var self = this;
		if(this.osmkblight != null){
			clearInterval(this.osmkblight);
		}
    this.osmkblight=setInterval(function(){self.osmkbUpdate();}, 700);
    this.setOffset();
    this.osmkbDom.show();
};

OSMKB.prototype.setOffset = function() {
    var pos = this.osmkbDom.offset();
    var P = {W:$("body").width(), H:$("body").height()};
    var p = {w:this.osmkbDom.width(), h:this.osmkbDom.height()};
    this.osmkbDom.offset({left:Math.abs( (P.W-p.w)/2), top:Math.abs((P.H-p.h)) });
};

// 关闭键盘
OSMKB.prototype.close=function(){
    //hide top menubar
    if(this.status=="open"){
        this.status="close";
    }
    //  keyBoard-dialognew
    this.osmkbDom.hide();
};

//返回键盘状态
OSMKB.prototype.getStatus = function() {
    return this.status;
};
OSMKB.prototype.osmkbUpdate = function() {
    var indicate = this.osmkbisblink ? "&nbsp;" : "|";
    var pos = this.osmkblightposition;
    var str = this.osmkbtextValue;
    if (pos <= this.osmkbtextValue.length)
        str = this.osmkbtextValue.substr(0,pos) + indicate + this.osmkbtextValue.substring(pos);
/*    if(this.osmkbtextValue.length>32){  
    	if(this.osmkbisblink){
    		if( pos==this.osmkbtextValue.length || (pos<str.length && (str.length-pos)<23)){
    				str=str.substr(str.length-38,38);
    		}else if( pos<17){
       		str=str.substr(0,38);
    		}else if((str.length-pos)>22 || pos>21){
    			str=str.substr(pos-16+1,16)+str.substr(pos+1,22);
    		}
    	}else{
    			if( pos==str.length || (pos<str.length && (str.length-pos)<17)){
    		   	str=str.substr(str.length-33,33);
    			}else if( pos<17){
     		  	str=str.substr(0,33);
    			}else if((str.length-pos)>16 || pos>16){
    				str=str.substr(pos-16+1,16)+str.substr(pos+1,17);
    		}
    	}
    
    }*/
    var osminputStringlength=this.inputStringlength;
    if (this.osmkbtextValue.length > osminputStringlength) {
					if (this.osmkbisblink) {
						if (pos == this.osmkbtextValue.length || (pos < str.length && (str.length - pos) < Math.ceil(osminputStringlength/2)+6)) {
							str = str.substr(str.length - (osminputStringlength+6), osminputStringlength+6);
						} else if (pos < Math.ceil(osminputStringlength/2)+1) {
							str = str.substr(0, osminputStringlength+6);
						} else if ((str.length - pos) > Math.ceil(osminputStringlength / 2)+6 || pos > Math.ceil(osminputStringlength / 2) ) {
							str = str.substr(pos - Math.ceil(osminputStringlength/2)+ 1, Math.ceil(osminputStringlength/2)) + str.substr(pos + 1, Math.ceil(osminputStringlength/2)+5);
        }
					} else {
						if (pos == str.length || (pos < str.length && (str.length - pos) < Math.ceil(osminputStringlength/2)+1)) {
							str = str.substr(str.length -( osminputStringlength+1), osminputStringlength+1);
						} else if (pos < Math.ceil(osminputStringlength/2)+1) {
							str = str.substr(0,osminputStringlength+1);
						} else if ((str.length - pos) > Math.ceil(osminputStringlength/2) || pos > Math.ceil(osminputStringlength/2)) {
							str = str.substr(pos - Math.ceil(osminputStringlength/2) + 1, Math.ceil(osminputStringlength/2)) + str.substr(pos + 1, Math.ceil(osminputStringlength/2));
						}
					}
				}
    this.osmkbisblink = !this.osmkbisblink;
    $("#key-board-txtID").html(str);
};


