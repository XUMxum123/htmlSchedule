var opts = false;
var selected = 0;
var selected_right = 0;
var focus_id = 0;
var subtitlelangnum=3;
var subtitlelangArr = ["english",
                       "franch",
                       "chinese"];
var audlangnum=4;
var audlangArr = ["audio0",
                  "audio2",
                  "audio3",
                  "audio4"];
var dualinfo="none";
var commoninfo="none";
function initVideo() {
    try {
        document.getElementById('video').bindToCurrentChannel();
    } catch (e) {
        // ignore
    }
    try {
        document.getElementById('video').setFullScreen(false);
    } catch (e) {
        // ignore
    }
}

function initApp() {
    try {
        var app = document.getElementById('appmgr').getOwnerApplication(document);
        app.show();
        app.activate();
    } catch (e) {
        // ignore
    }
    setKeyset(0x1+0x2+0x4+0x8+0x10);
}

function setKeyset(mask) {
    // for HbbTV 0.5:
    try {
        var elemcfg = document.getElementById('oipfcfg');
        elemcfg.keyset.value = mask;
    } catch (e) {
        // ignore
    }
    try {
        var elemcfg = document.getElementById('oipfcfg');
        elemcfg.keyset.setValue(mask);
    } catch (e) {
        // ignore
    }
    // for HbbTV 1.0:
    try {
        var app = document.getElementById('appmgr').getOwnerApplication(document);
        app.privateData.keyset.setValue(mask);
        app.privateData.keyset.value = mask;
    } catch (e) {
        // ignore
    }
}

function registerKeyEventListener() {
    document.addEventListener("keydown", function(e) {
        if (handleKeyCode(e.keyCode)) {
            e.preventDefault();
        }
    }, false);
}
function updateItemIcon(type) {
    if(type = "scheduled")
    {
        opts =document.getElementById('pvrcontent_item').getElementById('li');
    }

}
function list_left_Init() {
    // opts =document.getElementById('pvrcontent_item').getElementsByTagName('li');
    var item_num = 7;
    items = [];
    if(subtitlelangnum ==0){
        $('#subtitles_lang').attr("disable", 'true');
    }
    if(audlangnum ==0){
        $('#audlangnum').attr("disable", 'true');
    }
    if(dualinfo =="none"){
        $('#dual').attr("disable", 'true');
    }
    $('#common').attr("disable", 'true');
    for (var i=0; i < item_num; i++) {
        var disable=0;
        items =document.getElementById('list_left').getElementsByTagName('li');
        disable= $(items[i]).attr("disable");
        if(disable == "true"){
            items[i].style.color = "rgb(121,122,123)";
        }
    }
    itemSelect(0);
}
function itemSelect(idx) {
  	selected = (selected + items.length) % items.length;
  	items = document.getElementById('list_left').getElementsByTagName('li');
    if (items.length <= 0)
        return; 
    var pos = $(items[selected]).offset();
    //move(document.getElementById("hlbar"), pos, function(p) {return p;}, 500);
    pos.left -=3;
	  pos.top +=4;
    $("#hlbar").offset({top:pos.top});
    $("#hlbar").offset({left:pos.left});
    $(items[selected]).focus(); 
     
}
function item_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
    focus_id = id;
    if (isfocus) {
        if( id == "subtitles"||
            id == "subtitles_lang"||
            id == "aud_lang"){
            //$('#list_content_right').show();
            $("#option").animate({left: '243px'}, "slow");
            $("#list_content_right").fadeIn("slow");
						$("#list_content_right").parent().css("background", 'url(./img/options_menu_R.png)')
        		update_list_right(id);
        }
        else{
        	if($('#list_content_right').attr("focus")== "true")
    				return;
	        if ($('#list_content_right').css("display") != "none"){
	            $('#list_content_right').hide();
							$("#list_content_right").parent().css("background", '');
					if ($('#list_content_right').css("display") == "none"){
    	  			$("#option").animate({left: '416px'}, "slow");
    			} 
							console.log("parent().css(\"background\", '')");
	            //$("#list_content_right").fadeOut(3000);
	            return;
	        }
        }
        	
    }
    else{

    }
}
function item_right_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
}
function update_list_right(id) {
    var items =document.getElementById('list_content_right').getElementsByTagName('ul');
    var lists;
    $(items).find("li").remove();
    var i=0;
    if(id == "subtitles"){
        $(items).append("<li id='subtitle_off' tabindex='0' onfocus=item_right_focus(true,'subtitle_off');  onblur=item_right_focus(false,'subtitle_off');>Off</li>\
                         <li id='subtitle_on' tabindex='0' onfocus=item_right_focus(true,'subtitle_on');  onblur=item_right_focus(false,'subtitle_on');>On</li> \
                         <li id='subtitle_auto' tabindex='0' onfocus=item_right_focus(true,'subtitle_auto');  onblur=item_right_focus(false,'subtitle_auto');>Automatic</li>");
    }
    if(id == "subtitles_lang")
    {
        for(i=0;i<subtitlelangnum;i++)
        {
            var str=subtitlelangArr[i];
            $(items).append("<li id='subtitles_lang[i]' tabindex='0' onfocus=item_right_focus(true,'subtitles_lang[i]');  onblur=item_right_focus(false,'subtitles_lang[i]');></li>");
            lists=document.getElementById('list_content_right').getElementsByTagName('li');
            $(lists[i]).html(str);
        }
    }
    if(id == "aud_lang")
    { for(i=0;i<audlangnum;i++)
      {
          var str=audlangArr[i];
          $(items).append("<li id='aud_lang[i]' tabindex='0' onfocus=item_right_focus(true,'aud_lang[i]');  onblur=item_right_focus(false,'aud_lang[i]');></li>");
          lists=document.getElementById('list_content_right').getElementsByTagName('li');
          $(lists[i]).html(str);

      }
    }
}
function itemSelect_right(idx) {
  	var items = document.getElementById('list_content_right').getElementsByTagName('li');
    if (items.length <= 0)
        return;
    selected_right = (selected_right + items.length) % items.length;
    var pos = $(items[selected_right]).offset();
    move(document.getElementById("hlbar"), pos, function(p) {return p;}, 500);
    // $("#hlbar").offset({top:$(items[selected]).offset().top});
    $(items[selected_right]).focus();
}
function setInstr(txt) {
    document.getElementById('instr').innerHTML = txt;
}

function animate(opts) {
    var start = new Date;
    var id = setInterval(function() {
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration;

        if (progress > 1) progress = 1;

        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1) {
            clearInterval(id);
        }
    }, opts.delay || 10);
}

function move(element, pos, delta, duration) {
    var org = $(element).offset();
    pos.left -= 6;
    pos.top += 3;
    animate({
        delay: 10,
        duration: duration || 1000, // 1 sec by default
        delta: delta,
        step: function(delta) {
            // element.style.left = org.x+(pos.x-org.x)*delta + "px";
            // element.style.top  = org.y+(pos.y-org.y)*delta + "px";
            $(element).offset({left:org.left+(pos.left-org.left)*delta ,
                               top:org.top+(pos.top-org.top)*delta });
        }
    });
}
 function right_handleKeyCode(kc) {
     if (kc==KeyEvent.DOM_VK_UP) {
         selected_right--;
     } else if (kc==KeyEvent.DOM_VK_DOWN) {
         selected_right++;
     } else if (kc==KeyEvent.DOM_VK_RETURN) {
         return true;
     } else if (kc==KeyEvent.DOM_VK_LEFT ||
     						kc==KeyEvent.DOM_VK_RIGHT) {
     			$('#list_content_right').attr("focus","false")
					itemSelect(selected);
     			$('#hlbar_selected').hide();	
     			return true;
     }
     itemSelect_right(selected_right);
     return false;
 }