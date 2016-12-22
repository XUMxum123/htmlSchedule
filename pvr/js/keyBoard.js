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
         })
         dragEvent.preventDefault();

     }
     function dragStop() {
         $(document).unbind("mousemove", dragMove);
        $(document).unbind("mouseup", dragStop);

     }

    $(document).ready(function () {
         $(obj.idORclass1).bind("mousedown", dragStart);
    })
 }
 

 
  //绘制键盘
  function drawKeyboard(type) {
      $("#keyboardNum").empty();
      $("#keyboardLetterQ").empty();
      $("#keyboardLetterA").empty();
      $("#keyboardLetterZ").empty();
      $("#keyboardSpaceBar").empty();
	  var count_id = 0;
	//,    "219": "[", "221": "]", "186": ";", "222": "'", "220": "\\",  "16": "Shift",     "191": "/"
      if (type == "lower") {
          //var keyboardNum = { "192": "`", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "48": "0", "189": "-", "187": "=", "8": "Backspace" };
          var keyboardSymbol = [{ "190": "."},{"188": ","},{"50": "@"},{"222": "'"}];
		  var keyboardLetterQ = [{"65": "a"},{"66": "b"},{"67": "c"},  {"68": "d"},{"69": "e"},{"70": "f" }];
          var keyboardLetterA = {  "71": "g", "72": "h","73": "i",  "74": "j", "75": "k", "76": "l",  "77": "m", "78": "n","79": "o" };
          var keyboardLetterP_S = { "80": "p","81": "q","82": "r","83": "s" };		  
		  var keyboardLetterT_V = { "84": "t","85": "u", "86": "v"};
          var keyboardLetterW_Z = { "87": "w","88": "x","89": "y", "90": "z" };
          var keyboardSpaceBar = [{ "32": "Spa"},{"191": "?"},{"49": "!"},{ "189": "-" }];
          var key = "";
      }
      else {
          //var keyboardNum = { "192": "~", "49": "!", "50": "@", "51": "#", "52": "$", "53": "%", "54": "^", "55": "&", "56": "*", "57": "(", "48": ")", "189": "_", "187": "+", "8": "Backspace" };
          //var keyboardLetterQ = { "81": "Q", "87": "W", "69": "E", "82": "R", "84": "T", "89": "Y", "85": "U", "73": "I", "79": "O", "80": "p", "219": "{", "221": "}" };
          //var keyboardLetterA = { "20": "Caps Lock", "65": "A", "83": "S", "68": "D", "70": "F", "71": "G", "72": "H", "74": "J", "75": "K", "76": "L", "186": ":", "222": "\"", "220": "|" };
          //var keyboardLetterZ = { "16": "Shift", "90": "Z", "88": "X", "67": "C", "86": "V", "66": "B", "78": "N", "77": "M", "188": "<", "190": ">", "191": "?" };
          //var keyboardSpaceBar = { "32": "Spa", "": "Tim" };
          //var key = "";
		  var keyboardSymbol = [{ "190": "."},{"188": ","},{"50": "@"},{"222": "'"}];
		  var keyboardLetterQ = [{"65": "A"},{"66": "B"},{"67": "C"},  {"68": "D"},{"69": "E"},{"70": "F" }];
          var keyboardLetterA = {  "71": "G", "72": "H","73": "I",  "74": "J", "75": "K", "76": "L",  "77": "M", "78": "N","79": "O" };
          var keyboardLetterP_S = { "80": "P","81": "Q","82": "R","83": "S" };		  
		  var keyboardLetterT_V = { "84": "T","85": "U", "86": "V"};
          var keyboardLetterW_Z = { "87": "W","88": "X","89": "Y", "90": "Z" };
          var keyboardSpaceBar = [{ "32": "Spa"},{"191": "?"},{"49": "!"},{ "189": "-" }];
          var key = "";
      }
      /*
	  $.each(keyboardNum, function (key, value) {
          if (value != "Backspace") {
              key = $('<div class="simpleKey" name="key" key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardNum").append(key);
          }
          else {
              key = $('<div class="backspaceKey" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardNum").append(key);
          }
      });

      $.each(keyboardLetterQ, function (key, value) {
		  console.log("key, value"+key+value);
          key = $('<div class="simpleKey" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
          $("#keyboardLetterQ").append(key);
      });
	   */
	for (var index in keyboardSymbol){
		for (var key in keyboardSymbol[index]){
		//console.log("key, value"+key+keyboardSymbol[index][''+key]);
		  keyContent = $('<div class="symbolKey" onclick="setOnclickValue(\''+ keyboardSymbol[index][''+key] +'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value="' + keyboardSymbol[index][''+key] + '">' + keyboardSymbol[index][''+key] + '</div>');
          $("#keyboardLetterQ").append(keyContent);
		  count_id ++;
		}
	}
	for (var index in keyboardLetterQ){
		for (var key in keyboardLetterQ[index]){
		//console.log("key, value"+key+keyboardLetterQ[index][''+key]);
		  keyContent = $('<div class="simple3Key" onclick="setOnclickValue(\''+keyboardLetterQ[index][''+key]  +'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value="' + keyboardLetterQ[index][''+key] + '">' + keyboardLetterQ[index][''+key] + '</div>');
          $("#keyboardLetterQ").append(keyContent);
		  count_id ++;
		}
	}
      $.each(keyboardLetterA, function (key, value) {
          if (value != "Caps Lock") {
              key = $('<div class="simple3Key" onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardLetterA").append(key);
          }
          else {
              key = $('<div class="capslockKey" onclick="setOnclickValue(\''+value+'\')"   id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
              $("#keyboardLetterA").append(key);
          }
		  
		  count_id ++;
      });
 
      $.each(keyboardLetterP_S, function (key, value) {
		   key = $('<div class="simple4Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
		   $("#keyboardLetterZ").append(key);
		   
		   count_id ++;
        });
	 $.each(keyboardLetterT_V, function (key, value) {
		   key = $('<div class="simple3Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
		   $("#keyboardLetterZ").append(key);
		   
		   count_id ++;
        });
	 $.each(keyboardLetterW_Z, function (key, value) {
		   key = $('<div class="simple4Key"  onclick="setOnclickValue(\''+value+'\')"  id="key_' + count_id + '" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
		   $("#keyboardLetterZ").append(key);
		   
		   count_id ++;
        });		
	for (var index in keyboardSpaceBar){
		for (var key in keyboardSpaceBar[index]){
			if(keyboardSpaceBar[index][''+key] == 'Spa'){
				keyContent = $('<div class="symbolKey"  onclick="setOnclickValue(\' '+'\')" id="key_' + count_id + '" name="key"  key="' + key + '" value=\' '+'\'>' + keyboardSpaceBar[index][''+key] + '</div>');	
				$("#keyboardSpaceBar").append(keyContent);
			}else{
				keyContent = $('<div class="symbolKey"  onclick="setOnclickValue(\''+keyboardSpaceBar[index][''+key]+'\')" id="key_' + count_id + '"  name="key"  key="' + key + '" value="' + keyboardSpaceBar[index][''+key] + '">' + keyboardSpaceBar[index][''+key] + '</div>');	
				$("#keyboardSpaceBar").append(keyContent);
			}
			count_id ++;
		}
	}
	/*
     $.each(keyboardSpaceBar, function (key, value) {
         if (value != "Space") {
             key = $('<div class="simpleKey" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
             $("#keyboardSpaceBar").append(key);
         }
         else {
             key = $('<div class="spaceKey" name="key"  key="' + key + '" value="' + value + '">' + value + '</div>');
             $("#keyboardSpaceBar").append(key);
         }
     });
	*/
    // addMouseClickEvent();


 }

 //监听鼠标点击事件
 function addMouseClickEvent() {
     $("#close").click(function () {
         closeKeyboard()
     });

     $("div[name='key']").hover(function () {
	$(this).css("background-color", "orange");
     }, function () {
         $(this).css("background-color", "Gray");
     }).click(function () {
		 console.log("clickkey");
         var thisValue = $(this).attr("value");
         var ID = $("#state").val();
         switch (thisValue) {
             case "": //"
                 $("#" + ID).val($("#" + ID).val() + "\"");
                 if ($("#shift").attr("checked") == true) {
                     if ($("#capsLock").attr("checked") != true) {
                         drawKeyboard("lower");
                     }
                     $("#shift").attr("checked", false);
                 }
                 break;
             case "Shift":
                 $("#shift").attr("checked", $("#shift").attr("checked") == true ? false : true);
                 if ($("#shift").attr("checked") == true) {
                     drawKeyboard("upper")
                 }
                 else {
                     if ($("#capsLock").attr("checked") != true) {
                         drawKeyboard("lower");
                     }
                 }
                 break;
             case "Caps Lock":
                 $("#capsLock").attr("checked", $("#capsLock").attr("checked") == true ? false : true);
                 $("#capsLock").attr("checked") == true ? drawKeyboard("upper") : drawKeyboard("lower");
                 $("#shift").attr("checked", false)
                 break;
             case "Space":
                 $("#" + ID).val($("#" + ID).val() + " ");
                 break;
             case "Backspace":
                 $("#" + ID).val($("#" + ID).val().substring(0, $("#" + ID).val().length - 1));
                 break;
             default:
                 $("#" + ID).val($("#" + ID).val() + thisValue);
                 if ($("#shift").attr("checked") == true) {
                     if ($("#capsLock").attr("checked") != true) {
                         drawKeyboard("lower");
                     }
                     $("#shift").attr("checked", false);
                 }

                 break;
         }
         $("#" + ID).focus();
     });
 }


 //监听键盘事件
 function addKeydownEvent() {
	 console.log("addKeydownEvent:");
     $("html").keydown(function (event) {
         var realkey = String.fromCharCode(event.keyCode);
		console.log("keycode:"+event.keyCode);
         //特殊键
         if (event.keyCode == 32) { realkey = "Space" }
         if (event.keyCode == 13) { realkey = "Enter" }
         if (event.keyCode == 27) { realkey = " Esc" }
         if (event.keyCode == 16) {
             realkey = "Shift";
             $("#shift").attr("checked", $("#shift").attr("checked") == true ? false : true);
             if ($("#shift").attr("checked") == true) {
                 drawKeyboard("upper")
             }
             else {
                 if ($("#capsLock").attr("checked") != true) {
                     drawKeyboard("lower");
                 }
             }
         }
         if (event.keyCode == 17) { realkey = " Ctrl" }
         if (event.keyCode == 18) { realkey = "Alt" }
         if (event.keyCode == 8) { realkey = "Backspace" }
         if (event.keyCode == 20) { realkey = "Caps Lock"; $("#capsLock").attr("checked", $("#capsLock").attr("checked") == true ? false : true); $("#capsLock").attr("checked") == true ? drawKeyboard("upper") : drawKeyboard("lower"); }


         $("div[name='key']").css("background-color", "orange")
         $("div[key=" + event.keyCode + "]").css("background-color", "Gray");

         //如果按了shif再按其他键并且这个键不是shif键盘变回小写
         //如果capsLock选中了键盘就不用变回小写
         if ($("#shift").attr("checked") == true && event.keyCode != 16) {
             if ($("#capsLock").attr("checked") != true) {
                 drawKeyboard("lower");
             }
             $("#shift").attr("checked", false);
         }

     });
 }
/**
*键盘
*/
 function setOnclickValue(clickValue){
	 var oldValue = $("#txtID").val();
	 var str = oldValue+clickValue;
	 $("#txtID").val(str);
	 $("#txtID").focus();
 }
 
 
//打开键盘
function openKeyboard(ID) {
    $("#keyboard").css("visibility", "visible");
    //$("#state").val(ID);
	$("#key_4").addClass("key-active");
	//$("#txtID").val("123");
}

//关闭键盘
function closeKeyboard() {
    $("#keyboard").css("visibility", "hidden")
}

$(function () {
    var divKeyBoard = '<div id="keyboard" class="keyboard"><div id="keyboardNum"></div><div id="keyboardLetterQ"></div><div id="keyboardLetterA"></div><div id="keyboardLetterZ"></div><div id="keyboardSpaceBar"></div></div>';
    $("#keyBoard-dialog").append(divKeyBoard);
    drawKeyboard("lower");
    //addKeydownEvent();
    $("#keyboard").css("visibility", "show");
   //var drag = new dragMing("#keyboard", "#keyboard");
	//console.log("$(function ()");
 })
