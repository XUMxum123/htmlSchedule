var layer=0;
var FirstList;
var SecondList;
var FocusList;
var focus=0;
var layerZeroFocus=0;
var layerOneFocus=0;
var layerTwoFocus=0;
var layerThreeFocus=0;
var layerFourFocus=0;
var selectedIndex=0;
var scroll1;
var top=0;

{
	$("body").append("<div class=PageStyle id=page_1></div>");
	$("body").append("<div id=list_one_layout></div>");
	$("#list_one_layout").append("<div id=page_one_layout></div>");
	$("body").append("<div class=Div_line id=div_line_1></div>");
	$("body").append("<div class=Div_line id=div_line_2></div>");
	$('#div_line_1').css('left', 72);
	$('#div_line_2').css('left', 421);
	$("#page_1").append("<div class=descriptionText id=descriptionText></div>");
	$('#descriptionText').text("Clear the list of connected and blocked devices that are used with Miracast");
    $("body").append("<div class=Panel_title id=FirstPanel data-translate=ID_SMART_PIC>Switch on settings</div>");
	$("body").append("<div class=Panel_title id=SecondPanel style=left:72px;><span id=SecondPanelText data-translate=ID_SMART_PIC>Picture style</span></div>");//三级标题
    $('#SecondPanel').hide();
}

function LoadFirstList(List)
{
  if(layer==0)
  {
    $('#ul_list1').remove();
	$('#ul_list2').remove();
	$('#FirstPanel').hide();
    $("#page_one_layout").append("<ul id=ul_list1 style=left:30px;top:0px;height:100%></ul>");
	$('#div_line_1').hide();
	$('#div_line_2').css('left',360);
	$('#FirstPanel').hide();
	scroll1.scrollTo(0, top, 0);
  }else if(layer==1)
  {   
	$('#ul_list1').remove();
	$('#ul_list2').remove();
	$('#FirstPanel').show();
    $('#FirstPanel').css("opacity", 1);
    $('#SecondPanel').hide();
	$('#FirstPanel').text(FirstList.name);
    $("body").append("<ul id=ul_list1></ul>");	
	$('#div_line_1').css('left', 72);
	$('#div_line_1').show();
	$('#div_line_2').css('left', 421);
  }else if(layer==2)
  {
    $('#ul_list1').remove();
	$('#ul_list2').remove();
	$('#SecondPanel').text(FirstList.name);
	$('#FirstPanel').text(BaseList.item[layerZeroFocus].name);
    $("body").append("<ul id=ul_list1 style=left:128px;></ul>");	 
  }else if(layer==3)
  {
    $('#ul_list1').remove();
	$('#ul_list2').remove();
	$('#SecondPanel').text(FirstList.name);
	$('#FirstPanel').text("... "+BaseList.item[layerZeroFocus].item[layerOneFocus].name);
    $("body").append("<ul id=ul_list1 style=left:128px;></ul>");	  
  }else if(layer==4)
  {
    $('#ul_list1').remove();
	$('#ul_list2').remove();
	$('#SecondPanel').text(FirstList.name);
	$('#FirstPanel').text("... "+BaseList.item[layerZeroFocus].item[layerOneFocus].item[layerTwoFocus].name);
    $("body").append("<ul id=ul_list1 style=left:128px;></ul>");	
  }
  
  for (var i = 0; i < List.item.length; i++) 
  {
	  if(List.item[i].item)
	  {
	    
	    if(List.item[i].item[0].constructor == Object)
		{
		  $('#ul_list1').append('<div class="settings" id=\"'+List.item[i].id+'\"><img class="normal_arrow"/><span>'+List.item[i].name+'</span></div><div></div>');
		}else
		{
		  $('#ul_list1').append('<div class="settings" id=\"'+List.item[i].id+'\"><span>'+List.item[i].name+'</span></div><div></div>');
		}
	  }else
	  {
	    $('#ul_list1').append('<div class="settings" id=\"'+List.item[i].id+'\"><span>'+List.item[i].name+'</span></div><div></div>');
	  }
	    if(i == focus)
		{
       	  $("img").eq($("img").length-1).addClass("focus_arrow");	
		}
      addNewFocus(focus);
   }      
}
function LoadSecondList(List)
{
  $('#ul_list2').remove();
  if(layer==0)
  {
    $("body").append("<ul id=ul_list2 style=left:380px;></ul>");
  }else if(layer==1)
  {
    $("body").append("<ul id=ul_list2 style=left:433px;></ul>");
  }else if(layer>1)
  {
    $("body").append("<ul id=ul_list2 style=left:478px;></ul>");  
  }
    if(List.item)
	{	    	   
	   for (var i = 0; i < List.item.length; i++) 
       {   
	     if(List.item[i].item)
		 {
		   $('#ul_list2').append('<div class="settings" id=\"'+List.item[i].id+'\"><img class="normal_arrow"/><span>'+List.item[i].name+'</span></div><div></div>');
		 }else if(List.item[i].listitem)
		 {
		    $('#ul_list2').append('<div class="settings" id=\"'+List.item[i].id+'\"><span>'+List.item[i].name+'</span></div><div></div>');
		 }else 
         {
		   $('#ul_list2').append('<div class="settings" id=\"'+List.item[i].id+'\"><span>'+List.item[i].name+'</span></div><div></div>');
		 }		 
	   }
	} else if(List.listitem)
	{
	  for (var i = 0; i < List.listitem.length; i++) 
	  {
	    if(i==List.selected)
		{
		  $('#ul_list2').append('<div class="settings selected" id=\"'+List.listitem[i][1]+'\"><span>'+List.listitem[i][0]+'</span></div><div></div>');
		}else
		{
		  $('#ul_list2').append('<div class="settings" id=\"'+List.listitem[i][1]+'\"><span>'+List.listitem[i][0]+'</span></div><div></div>');
		}
	    
	  }	 
	}else
	{
	  $('#ul_list2').remove();
	}  
}

$(document).on('keydown', function (evt)
	{
		var key = evt.which || evt.keyCode;
		var ret = false;		
		ret = option_key_handle(key);	
		if(!ret)
		{
		  mtvuiUtil.procSysKey(key);
		}
		
	}
);

function option_key_handle(key)
{
 		if(key == KeyEvent.DOM_VK_UP || key == KeyEvent.DOM_VK_DOWN)
		{
			  if(FocusList==FirstList)
			  {
			    removeOldFocus(focus);	
				
				//change focus
				if(key == KeyEvent.DOM_VK_UP )
				{
				    if (focus > 0)
		            {
			          focus--;
		            }else if (focus ==0)
		            {
			          focus = FocusList.item.length - 1;
		            }	
                    scrollStep(document.getElementById($(".settings").eq(focus).attr('id')),scroll1,focus);					
				}else
				{
				    if (focus < FocusList.item.length - 1)
		            {
			          focus++;
		            }else if (focus == (FocusList.item.length - 1))
		            {
			          focus = 0;
		            }
					scrollStep(document.getElementById($(".settings").eq(focus).attr('id')),scroll1,focus);
				}
				
				addNewFocus(focus);				
				LoadSecondList(FocusList.item[focus]);
			  }else if(FocusList==SecondList)
              {
			    removeOldFocus(FirstList.item.length+selectedIndex);
				if(key == KeyEvent.DOM_VK_UP )
				{
				    if (selectedIndex > 0)
		            {
			          selectedIndex--;
		            }else if (selectedIndex ==0)
		            {
			          selectedIndex = SecondList.listitem.length - 1;
		            }				
				}else
				{
				    if (selectedIndex < SecondList.listitem.length - 1)
		            {
			          selectedIndex++;
		            }else if (selectedIndex == (SecondList.listitem.length - 1))
		            {
			          selectedIndex = 0;
		            }
				}
				addNewFocus(FirstList.item.length+selectedIndex);			  
			  }							
			return true;
		}
		if (key == KeyEvent.DOM_VK_RETURN || key == KeyEvent.DOM_VK_RIGHT)
		{
		    if(layer==0)
			{
			  if(FocusList==FirstList)
			  {
			    if(FocusList.item[focus].item)
				{
				  layer++;
				  FirstList=FocusList.item[focus];
				  FocusList=FirstList;
				  layerZeroFocus=focus;
				  focus=layerOneFocus;
				  console.log("focus="+focus);
                  SecondList=FocusList.item[focus];			  
				  LoadFirstList(FocusList);
				  LoadSecondList(SecondList);
				}else
				{
				  console.log("Enter name="+FocusList.item[focus].name);
				}
			  }
			}else if(layer==1)
			{
			  if(FocusList==FirstList)
			  {
			    if(FocusList.item[focus].item)
				{			  
				  layer++;
				  layerOneFocus=focus;
				  FirstList=FocusList.item[focus];
				  focus=layerTwoFocus;
				  FocusList=FirstList;
				  $('#SecondPanel').show();
			      $('#FirstPanel').css("opacity", 0.45);
		          $('#SecondPanel').css("opacity", 1.0);
			      $('#div_line_1').css('left', 117);
		          $('#div_line_2').css('left', 466);
			      $('#ul_list1').remove();
			      $('#ul_list2').remove();
				  LoadFirstList(FocusList);
				  SecondList=FocusList.item[focus];		
				  LoadSecondList(SecondList);	
				}else if(FocusList.item[focus].listitem)
				{
				  SecondList=FocusList.item[focus];
				  FocusList=SecondList;				  
                  removeOldFocus(focus);
				  selectedIndex=FocusList.selected;
				  console.log("FocusList.name="+FocusList.name+"  selected="+FocusList.selected);
				  $(".settings").eq(focus).addClass('selected');
                  addNewFocus(FirstList.item.length+selectedIndex);
				}else
				{
				  console.log(FocusList.item[focus].name+"do nothing");
				}				
			  }else if(FocusList==SecondList)
			  {
			  }
              			  
			}else if(layer==2)
			{
			  if(FocusList==FirstList)
			  {
			    if(FocusList.item[focus].item)
				{
				  layer++;
				  layerTwoFocus=focus;
				  FirstList=FocusList.item[focus];
				  FocusList=FirstList;
				  focus=layerThreeFocus;
			  	  $('#ul_list1').remove();
			      $('#ul_list2').remove();					  
				  LoadFirstList(FocusList);
				  SecondList=FocusList.item[focus];		
				  LoadSecondList(SecondList);					  				  
				}else if(FocusList.item[focus].listitem)
				{
				  SecondList=FocusList.item[focus];
				  FocusList=SecondList;				  
                  removeOldFocus(focus);
				  selectedIndex=FocusList.selected;
				  $(".settings").eq(focus).addClass('selected');
                  addNewFocus(FirstList.item.length+selectedIndex);				  
				}else
				{
				  console.log(FocusList.item[focus].name+"do nothing");
				}				
			  }else if(FocusList==SecondList)
			  {
			  }			  
			}else if(layer==3)
			{
			  if(FocusList==FirstList)
			  {
			    if(FocusList.item[focus].item)
				{
				  layer++;
				  layerThreeFocus=focus;
				  FirstList=FocusList.item[focus];
				  FocusList=FirstList;
				  focus=layerFourFocus;
			  	  $('#ul_list1').remove();
			      $('#ul_list2').remove();			  
				  LoadFirstList(FocusList);
				  SecondList=FocusList.item[focus];		
				  LoadSecondList(SecondList);			  
				}else if(FocusList.item[focus].listitem)
				{
				  SecondList=FocusList.item[focus];
				  FocusList=SecondList;				  
                  removeOldFocus(focus);
				  selectedIndex=FocusList.selected;
				  $(".settings").eq(focus).addClass('selected');
                  addNewFocus(FirstList.item.length+selectedIndex);					
				}else
				{
				  console.log(FocusList.item[focus].name+"do nothing");
				}				  
			  }			  
			}else if(layer==4)
			{
			}
		   return true;
		}

		if (key == KeyEvent.DOM_VK_BACK|| key == KeyEvent.DOM_VK_LEFT)	
		{
           if(layer==0)
		   {
		     if(FocusList==FirstList)
			 {
			   return false;
			 }else if(FocusList==SecondList)
			 {
			    //need to change focus from second list to first list
			    return true;
			 }
		   }else if(layer==1)
		   {
		     if(FocusList==FirstList)
			 {
			   layer--;
			   FirstList=BaseList;
               FocusList=FirstList;
			   focus=layerZeroFocus;
			   layerOneFocus=0;
			   console.log("zzw--focus="+focus);
               LoadFirstList(BaseList);
			   LoadSecondList(FocusList.item[focus]);
			   return false;
			 }else if(FocusList==SecondList)
			 {
			    FocusList=FirstList;
				removeOldFocus(FirstList.item.length+selectedIndex);
                $(".settings").eq(focus).removeClass('selected'); 
				addNewFocus(focus); 
			    return true;
			 }		   
		   }else if(layer==2)
		   {
		     if(FocusList==FirstList)
			 {
			   layer--;
			   FirstList=BaseList.item[layerZeroFocus];
               FocusList=FirstList;
			   focus=layerOneFocus;
			   layerTwoFocus=0;
			   console.log("zzw--focus="+focus);
               LoadFirstList(FirstList);
			   LoadSecondList(FocusList.item[focus]);
			   return true;
			 }else if(FocusList==SecondList)
			 {
			    //need to change focus from second list to first list
				FocusList=FirstList;
				removeOldFocus(FirstList.item.length+selectedIndex);
                $(".settings").eq(focus).removeClass('selected'); 
				addNewFocus(focus); 				  
			    return true;
			 }	
		   }else if(layer==3)
		   {
		     if(FocusList==FirstList)
			 {
			   layer--;
			   FirstList=BaseList.item[layerZeroFocus].item[layerOneFocus];
               FocusList=FirstList;
			   focus=layerTwoFocus;
			   layerThreeFocus=0;
			   console.log("zzw--focus="+focus);
               LoadFirstList(FirstList);
			   LoadSecondList(FocusList.item[focus]);
			   return true;
			 }else if(FocusList==SecondList)
			 {
			    //need to change focus from second list to first list
				FocusList=FirstList;
				removeOldFocus(FirstList.item.length+selectedIndex);
                $(".settings").eq(focus).removeClass('selected'); 
				addNewFocus(focus); 				  
			    return true;
			 }		   
		     return true;
		   }else if(layer==4)
		   {
		   
		   
		     if(FocusList==FirstList)
			 {
			   layer--;
			   FirstList=BaseList.item[layerZeroFocus].item[layerOneFocus].item[layerTwoFocus];
			   console.log("zzw--418="+FirstList.name);
               FocusList=FirstList;
			   focus=layerThreeFocus;
			   layerFourFocus=0;
			   console.log("zzw--focus="+focus);
               LoadFirstList(FirstList);
			   //LoadSecondList(FocusList.item[focus]);
			   return true;
			 }else if(FocusList==SecondList)
			 {
			    //need to change focus from second list to first list
				FocusList=FirstList;
				removeOldFocus(FirstList.item.length+selectedIndex);
                $(".settings").eq(focus).removeClass('selected'); 
				addNewFocus(focus); 				  
			    return true;
			 }			   
		   
		   
		   
		   }
		   return true;
		}
}
function removeOldFocus(focus)
{
	$(".settings").eq(focus).removeClass('focus');
	if (document.getElementById($(".settings").eq(focus).attr('id')))
	{
		if (document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0])
		{
			document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0].setAttribute('class', 'normal_txt');
		}
		if (document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("img")[0])
		{
			document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("img")[0].setAttribute('class', 'normal_arrow')
		}
		if ($(document.getElementById($(".settings").eq(focus).attr('id'))).find("#circle_outer"))
		{
			$(document.getElementById($(".settings").eq(focus).attr('id'))).find("#circle_outer").attr('class', 'circle_outer');
		}
	}  
}
function addNewFocus(focus)
{
    $(".settings").eq(focus).addClass('focus');	
	if(document.getElementById($(".settings").eq(focus).attr('id')))
	{
		if (document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("img")[0])
		{
			document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("img")[0].setAttribute('class', 'normal_arrow focus_arrow')
		}
	    if (document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0])/* to avoid set slider component*/
		{			
			if (document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0].offsetWidth > parseInt($(".settings").css("max-width")))
			{
				document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0].setAttribute('class', 'focus_txt option_marquee1');			
			}else
			{
				document.getElementById($(".settings").eq(focus).attr('id')).getElementsByTagName("span")[0].setAttribute('class', 'focus_txt');
			}			
		}
		if ($(document.getElementById($(".settings").eq(focus).attr('id'))).find("#circle_outer"))
		{
			$(document.getElementById($(".settings").eq(focus).attr('id'))).find("#circle_outer").attr('class', 'circle_outer_focus');
		}
	}  
}

function scrollStep(el, scrollObj, focusNum) {
    if(!el){
        return;
    }
    el = el.nodeType ? el : scrollObj.scroller.querySelector(el);
    var offsetY;
    var screenIdx;
    if ( !el || !el.offsetHeight) {
        return ;
    }
    var elPos = $(el).offset();
    var scrollPos = $(scrollObj.scroller).offset();
    var wrapperOffset = $(scrollObj.wrapper).offset();	
    if(elPos.top >= wrapperOffset.top && (elPos.top+el.offsetHeight) <= (wrapperOffset.top+scrollObj.wrapper.offsetHeight)){
        screenIdx = Math.floor((elPos.top - wrapperOffset.top)/el.offsetHeight)+1;  
        return screenIdx;
    }
    if(elPos.top < wrapperOffset.top){
        offsetY = false;
    } else {
        offsetY = true;
    }
    scrollPos.left -= wrapperOffset.left;
    scrollPos.top  -= wrapperOffset.top;  
    var pos = {left:0,top:0};
    if(offsetY){
        if(elPos.top+el.offsetHeight > wrapperOffset.top+scrollObj.wrapper.offsetHeight){
            var index = Math.ceil((elPos.top+el.offsetHeight - wrapperOffset.top-scrollObj.wrapper.offsetHeight) / el.offsetHeight);
            pos.top = scrollPos.top - (index*el.offsetHeight) ;	
        }
        screenIdx = 9;
    } else {
        if(elPos.top<wrapperOffset.top){
            var index = Math.ceil((wrapperOffset.top - elPos.top) / el.offsetHeight);
            pos.top = scrollPos.top + (index*el.offsetHeight) ;
        } else {
            pos.top = scrollPos.top;
        }
        screenIdx = 1;
    }
	if(focusNum==0)
	{
	  scrollObj.scrollTo(0, 0, 0);
	  top=0;
	}else if(focus == (FocusList.item.length - 1))
	{
	  scrollObj.scrollTo(0, -178, 0);
	  top=-178;
	}else 
	{
	  scrollObj.scrollTo(0, pos.top, 0);
	  top=pos.top;
	}
    return screenIdx;
}


