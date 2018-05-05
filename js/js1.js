// JavaScript Document 
$(document).ready(function() {
	$("#a_btn").button(function(){});
	$("#a_btn").click(function(){
		$("#threetop").toggle(1000);
	});

	//$(".main>a").click(function(){
	//	var ulNode=$(this).next("ul")
	//ulNode.toggle(500);
	//});垂直菜单实现
	$(".main").hover(function(){
		$(this).children("ul").slideDown();
			changeImg($(this).children("a"));
		},function(){
			$(this).children("ul").slideUp();
			changeImg($(this).children("a"));
		})
});
function changeImg(mainNode){
	if(mainNode){
		if(mainNode.css("background-image").indexOf("log2.png")>=0){
			mainNode.css("background-image","url('images/log5.png')");
		}else{
			mainNode.css("background-image","url('images/log2.png')");	
		}	
	}
}