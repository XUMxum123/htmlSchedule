/*Variables*/
var valueNotify;
var selected          = 0;
var mtvObj            = new MtvObj();
var settings_data_obj = null ;
var schedule_debug    = DEBUG_OFF;
var current_plane     = FIRST_PLANE;
var show_subsettings_obj;

function console_debug(debug_infor)
{
	if (schedule_debug)
	{
		console.log(debug_infor);
	}
}

/*Function*/
function settings_list_init(dataObj, Plane) 
{
	var name;
	var instructions = '';
	var img = '';
	var div = '';
	var style = "tabindex='0'";
	var settingsTitle = dataObj.name;
		
	show_subsettings_obj = dataObj;	
	
	if(Plane == FIRST_PLANE)
	{
		$("#settings_list").show();
		$('#settings_list').find('ul').empty();
	}
	else
	{
		$("#settings_list_submenu").show();
		$('#settings_list_submenu').find('ul').empty();
	}

	if(dataObj.hasOwnProperty("curValue"))
	{
		selected = dataObj.curValue;
	} 
	else if(dataObj.hasOwnProperty("focusIndex"))
	{
		selected = dataObj.focusIndex;
	} 
	else 
	{
		selected = 0;
	}

    for (var index in dataObj.value) 
	{		
		if(dataObj.value[index].Type == NODE_TYPE_LEAF)
		{
			if(2 == dataObj.showMode)
			{
				div = '<div ></div>'
			}
		}
		else 
		{
			instructions = '<span ></span>'
		}
		
		name = dataObj.value[index].name;
		id   = dataObj.value[index].id;
		var insert_string = "<li id='" + id + "'"+ style+"onfocus=item_focus(true,'" + id + "');  onblur=item_focus(false,'" + id + "');>" + img + div + name + instructions + "</li>";
		
		if(Plane == FIRST_PLANE)
		{
			$('#settings_list').find('ul').append(insert_string);
		}
		else
		{
			$('#settings_list_submenu').find('ul').append(insert_string);
		}	 
	}
	
	/*focus on first item*/
	if(Plane == FIRST_PLANE)
	{
		li_list = $('.settings_list_css').find('li');
		selected = 0;
		$(li_list[selected]).focus();
	}
}

function item_focus(isfocus, id) 
{
    console_debug('item_focus isfocus =' + isfocus + ' id =' + id);
	console.log('item_focus isfocus =' + isfocus + ' id =' + id);
    if (isfocus) 
	{
    	$("#"+id).addClass("focus");
		if(show_subsettings_obj.showMode == 2)
		{
			console_debug('show_subsettings_obj.curValue is'+ show_subsettings_obj.curValue + 'and $("#"+id).index() is'+ $("#"+id).index());
			if(show_subsettings_obj.curValue == $("#"+id).index())
			{
				$($("#"+id).find('div')).css('background','url(../2K16_4K_UX_Asset/Settings_screen/list_radiobutton_activated_highlighted.png)');
			}
		}
    } 
	else 
	{
		$("#"+id).removeClass("focus");
		$($("#"+id).find('div')).css('background','');
		return;
	}
	
	if(settings_data_obj.value[selected].id != id)
	{
		return;
	}
	
	var subObj = settings_data_obj.value[selected];
	if (typeof(subObj) == 'object')
	{
		settings_data_obj.focusIndex = selected;
		console_debug(selected);
		console_debug(subObj.Type);
		switch (subObj.Type)
		{
			case NODE_TYPE_MENU:
				list_submenu_init(subObj);
				break;
			
			case NODE_TYPE_TXT:
				$("#settings_list_submenu").show();
				$('#settings_list_submenu').find('ul').empty();
				var txt_id = id + "_inputfile";
				var string = "<input type='text' id='" + txt_id + "' class=text_input_style  placeholder='" + subObj.hint + "'>";
				$('#settings_list_submenu').find('ul').append(string);
				break;
			
			case NODE_TYPE_LEAF:
				break;
			
			case NODE_TYPE_ACTION:
				$("#settings_list_submenu").show();
				$('#settings_list_submenu').find('ul').empty();
				break;
			
			default:
				console_debug("unknown node type");
				break;
		}	
	}
}

function settings_init(show_obj)
{
	settings_data_obj = show_obj;
	$('#settings_list').attr("showIndex", 0);
	settings_list_init(show_obj, FIRST_PLANE);
}

function list_submenu_init(show_obj)
{
	settings_list_init(show_obj, SECOND_PLANE);
}

function showsettingsMenu(show_obj, notify)
{
	valueNotify = notify;
	settings_init(show_obj);
}

function Schedule_Key_Up_Handle(isDown, id)
{
	var content;
	
	if(isDown)
	{
		do
		{
			if(content)
				id = content.attr('id');
			content = $('#' + id).prev();
		} while (content.length > 0 && content.attr('tabindex') == undefined);
		
		if (content.length > 0) 
		{
			selected = content.index();
			content.focus();
		} 
		else 
		{
			li_list = $('.settings_list_css').find('li');
			selected = li_list.length -1;
			$(li_list[selected]).focus();
		}
	} 
	else
	{
		if(show_subsettings_obj.showMode == 1 || show_subsettings_obj.showMode == 2)
		{
			show_subsettings_obj.cacheValue = selected;
			valueNotify({'name':show_subsettings_obj.name,'curValue':show_subsettings_obj.cacheValue});
		}
	}
}

function Schedule_Key_Down_Handle(isDown, id)
{
	var content;
	
	if(isDown)
	{
		do
		{
			if(content)
				id = content.attr('id');
			content = $('#' + id).next();
		} while (content.length > 0 && content.attr('tabindex') == undefined);
		
		if (content.length > 0)
		{
			selected = content.index();
			content.focus();
		}
		else 
		{
			li_list = $('.settings_list_css').find('li');
			selected = 0;
			$(li_list[selected]).focus();
		}
	}
	else 
	{
		if(show_subsettings_obj)
		{
			if(show_subsettings_obj.showMode == 1 || show_subsettings_obj.showMode == 2)
			{
				show_subsettings_obj.cacheValue = selected;
				valueNotify({'name':show_subsettings_obj.name,'curValue':show_subsettings_obj.cacheValue});
			}
		}
	}
}

function Schedule_Key_Return_Handle(isDown, id, kc)
{
	var subObj = settings_data_obj.value[selected];
	console.log(id);
	switch(subObj.Type)
	{
		case NODE_TYPE_TXT:   /*focus in input item*/
			$('#' + id+'_inputfile')[0].focus();
			/*start IME and cursor at the end of string*/
			break;
		case NODE_TYPE_LEAF:
			/*do nothing*/
			break;
		case NODE_TYPE_MENU:
			var subObj = settings_data_obj.value[selected];
			
			if(subObj.value[0].Type == NODE_TYPE_LEAF)
			{
				$('#' + subObj.value[0].name)[0].focus();
			}
			else if (subObj.value[0].Type == NODE_TYPE_MENU)
			{
				console.log(subObj);
				
				settings_init(subObj);
				list_submenu_init(subObj.value[0]);
				/*move current submenu to menu*/
				/*re-do the submenu*/
				/*focus on first item*/
			}
			break; 
		case NODE_TYPE_ACTION: /* excute the action*/
			break;
		default:
		console_debug("unknown Type");
	}
}

function Schedule_Key_Back_Handle(isDown, id, kc)
{
	console_debug("debug KeyEvent.DOM_VK_LEFT");
	if('1' == $('#settings_list').attr("showIndex"))
	{
		settings_init(settings_data_obj);
	} 
	else if(kc == KeyEvent.DOM_VK_BACK){
		mtvuiUtil.gotoSysPage("sys_index");
	}
}

function left_handleKeyCode(evt, isDown) 
{
    var kc = evt.which || evt.keyCode;
    var id = evt.target.id;
	
	console_debug("Key code is : "+ kc);
	switch (kc)
	{
		case KeyEvent.DOM_VK_UP:
			Schedule_Key_Up_Handle(isDown, id);
			break;
		
		case KeyEvent.DOM_VK_DOWN:
			Schedule_Key_Down_Handle(isDown, id);
			break;
			
		case KeyEvent.DOM_VK_RIGHT:
		case KeyEvent.DOM_VK_RETURN:
			Schedule_Key_Return_Handle(isDown, id, kc);
			break;
			
		case KeyEvent.DOM_VK_LEFT:
		case KeyEvent.DOM_VK_BACK:
			Schedule_Key_Back_Handle(isDown, id, kc);
			break;
			
		default:
			break;
	}
}

$(document).on("keydown", function(event) 
{
	var key = event.which || event.keyCode;
	if(KeyEvent.DOM_VK_DOWN == key || KeyEvent.DOM_VK_UP == key)
	{
		left_handleKeyCode(event, true);
	} 
	else if (KeyEvent.DOM_VK_BACK != key) 
	{
		mtvuiUtil.procSysKey(key);
	}
    event.stopPropagation();
}
);

$(document).on("keyup", function(event) 
{
	left_handleKeyCode(event);
    event.stopPropagation();
}
);

function settingsNotify(notifyData)
{
	var key;
	if(typeof(notifyData) == 'object')
	{
		key = notifyData.name.replace(new RegExp(" ","g"),'_');
	}
	else
	{
		key = notifyData;
	}
	console_debug("key = " + key);
	switch(key)
	{
		case Schedule_Enable.name.replace(new RegExp(" ","g"),'_'):
			mtvObj.acfgSetConfigValue(Schedule_Enable.acfgKey, notifyData.curValue);
			break;
			
		case Schedule_Time.name.replace(new RegExp(" ","g"),'_'):
			mtvObj.acfgSetConfigValue(Schedule_Time.acfgKey, notifyData.curValue);
			break;
	}
}

window.onload = function()
{
	showsettingsMenu(Add_Edit_Schedule, settingsNotify);
};