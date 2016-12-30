$(function(){
		
		//算高度-无头无尾
 		$(".Z_con").css("height",($(window).height()/16-3.3)+"em");
		$(".Z_con2").css("height",($(window).height()/16-5.8)+"em");
		$(".Z_con2_2").css("height",($(window).height()/16-5.8)+"em");
		
		
		$(".F_wd_top_con2_l").css("height",($(window).height()/16-5.4)+"em");
		$(".F_wd_top_con2_r").css("height",($(window).height()/16-5.4)+"em");
		
		$(".F_wd_top_con2_l_2").css("height",($(window).height()/16-8.6)+"em");
		$(".F_wd_top_con2_r_2").css("height",($(window).height()/16-8.6)+"em");
		
	
		
	
		
		
		//竖直切换
        $(function(){
			window.onload = function()
			{
				var $li = $('.sy li');
				var $ul = $('.content .by');
				$li.click(function(){
					var $this = $(this);
					var $t = $this.index();
					$li.removeClass();
					$this.addClass('current');
					$ul.css('display','none');
					$ul.eq($t).css('display','block');
				})
			}
		});
		
       $(function(){
		   $(".F_wd_top_con2_r_borb1").click(function(){
			   $(this).addClass("F_wd_top_con2_r_borb2").siblings().removeClass("F_wd_top_con2_r_borb2");
		   })

	   })
});


