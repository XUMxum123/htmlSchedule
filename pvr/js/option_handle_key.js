var opts = false;
var option_selected = 0;
var option_selected_right = 0;
var option_focus_id = 0;

function option_list_left_Init() {
    // opts =document.getElementById('pvrcontent_item').getElementsByTagName('li');
	option_selected = 0;
	option_selected_right = 0;
    var option_item_num = 1;
	$('#list_content_right').attr("focus","false");
    for (var i=0; i < option_item_num; i++) {
        var disable=0;
        items =document.getElementById('list_left').getElementsByTagName('li');
        disable= $(items[i]).attr("disable");
        if(disable == "true"){
            items[i].style.color = "rgb(121,122,123)";
        }
    }
	$('#option_hlbar_selected').hide();	
    option_itemSelect(0);
}
function option_itemSelect(idx) {
  	option_selected = (option_selected + items.length) % items.length;
  	items = document.getElementById('list_left').getElementsByTagName('li');
    if (items.length <= 0)
        return; 
    var pos = $(items[option_selected]).offset();
    pos.left -=3;
	pos.top +=4;
    $("#option_hlbar").offset({top:pos.top});
    $("#option_hlbar").offset({left:pos.left});
    $(items[option_selected]).focus(); 
     
}
function option_item_focus(isfocus, id) {
    console.log('button_focus isfocus =' + isfocus + ' id =' + id);
    option_focus_id = id;
    if (isfocus) {
        if( id == "sort"){
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
	        return;
	        }
        } 	
    }
    else{
		return;
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
    if(id == "sort"){
        $(items).append('<li id="by_date" tabindex="0" onfocus=item_right_focus(true,"by_date");  onblur=item_right_focus(false,"by_date"); data-translate="PPG_SORT_BY_DATE" ></li>\
                        <li id="by_expiry_date" tabindex="0" onfocus=item_right_focus(true,"by_expiry_date");  onblur=item_right_focus(false,"by_expiry_date"); data-translate="PPG_SORT_BY_EXPIRY_DATE" ></li> \
                        <li id="by_name" tabindex="0" onfocus=item_right_focus(true,"by_name");  onblur=item_right_focus(false,"by_name"); data-translate="PPG_SORT_BY_NAME"></li>\
						<li id="by_type" tabindex="0" onfocus=item_right_focus(true,"by_type");  onblur=item_right_focus(false,"by_type"); data-translate="PPG_SORT_BY_TYPE"></li>');
		$("#by_date").text(mtvObjRaw.getLangString("PPG_SORT_BY_DATE"));
		$("#by_expiry_date").text(mtvObjRaw.getLangString("PPG_SORT_BY_EXPIRY_DATE"));
		$("#by_name").text(mtvObjRaw.getLangString("PPG_SORT_BY_NAME")); 
		$("#by_type").text(mtvObjRaw.getLangString("PPG_SORT_BY_TYPE"));  				
    }
}
function itemSelect_right(idx) {
  	var items = document.getElementById('list_content_right').getElementsByTagName('li');
    if (items.length <= 0)
        return;
    option_selected_right = (option_selected_right + items.length) % items.length;
    var pos = $(items[option_selected_right]).offset();
    option_move(document.getElementById("option_hlbar"), pos, function(p) {return p;}, 500);
    $(items[option_selected_right]).focus();
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

function option_move(element, pos, delta, duration) {
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
