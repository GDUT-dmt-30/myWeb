// JavaScript Document
window.onload = function(){
	imgLocation("container","box")
	var imgData={"data":[{"src":"1.jpg"},{"src":"2.jpg"},{"src":"3.jpg"},{"src":"4.jpg"}]}
	window.onscroll=function(){
		if(checkFlag()){
			var cparent = document.getElementById("container");
			for(var i =0;i<imgData.data.length;i++){
				var ccontent = document.createElement("div");
				ccontent.className="box";
				cparent.appendChild(ccontent);
				var boximg = document.createElement("div");
				boximg.className="box_img";
				ccontent.appendChild(boximg);
				var img = document.createElement("img");
				img.src="image/"+imgData.data[i].src;
				boximg.appendChild(img);
				}
			}//动态加载
			imgLocation("container","box")
	}
}
function checkFlag(){
		var cparent = document.getElementById("container");
		var ccontent = getChildElement(cparent,"box");
		var lastContentHeight = ccontent[ccontent.length-1].offsetTop;
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var pageHeight = document.documentElement.clientHeight||document.body.clientHeight;
		if(lastContentHeight<scrollTop+pageHeight)
			return true;
		}
	//何时动态加载的判断条件
function imgLocation(parent,content){
	var cparent = document.getElementById(parent);
	var ccontent = getChildElement(cparent,content);
	
	var imgWidth=ccontent[0].offsetWidth;
	var cols=Math.floor(document.documentElement.clientWidth/imgWidth);//屏幕宽度得出一排图片的个数
	
	function bodyScale(){
	
	var devicewidth=document.documentElement.clientWidth;
	var scale=devicewidth/640;
	document.body.style.zoom=scale;
	}
	window.onload=window.onresize=function(){
	bodyScale();
	}//动态居中
	
	var BoxHeightArr=[];
	for(var i=0;i<ccontent.length;i++){
		if(i<cols){
			BoxHeightArr[i] = ccontent[i].offsetHeight;//存储第一行图片的高度
		}else{
			var minheight=Math.min.apply(null,BoxHeightArr);//求出第一行图片的最小值
			var minIndex = getminheightLocation(BoxHeightArr,minheight);//找出最小值的位置，赋值备用
			ccontent[i].style.position = "absolute";
			ccontent[i].style.top=minheight+"px";
			ccontent[i].style.left=	ccontent[minIndex].offsetLeft+"px";//把图片放在上一排的最短那张下面
			BoxHeightArr[minIndex]=BoxHeightArr[minIndex]+ccontent[i].offsetHeight;//放置之后高度重构
			}
		}
	
	}
function getminheightLocation(BoxHeightArr,minHeight){//遍历数组，找出最小值的位置，返回数组下标值
	for(var i in BoxHeightArr){
		if(BoxHeightArr[i]== minHeight){
			return i;
			}
		}
	}
function getChildElement(parent,content){
	var contentArr=[];
	var allcontent =parent.getElementsByTagName("*");
	for(var i =0;i<allcontent.length;i++){
			if(allcontent[i].className==content){
				contentArr.push(allcontent[i]);
				}
		}
	return contentArr;
	}