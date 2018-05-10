var oHtml = document.documentElement;

getSize();

function getSize(){

	var screenWidth = oHtml.clientWidth;
	//console.log(screenWidth);

	if(screenWidth >= 640){

		oHtml.style.fontSize = '40px';

	}else if(screenWidth <= 320){

		oHtml.style.fontSize = '20px';

	}else{

		oHtml.style.fontSize = screenWidth/640*40 +'px';

	}	

};

window.onresize = function(){

	getSize();

};

window.confirm = function (message) {
   var iframe = document.createElement("IFRAME");
   iframe.style.display = "none";
   iframe.setAttribute("src", 'data:text/plain,');
   document.documentElement.appendChild(iframe);
   var alertFrame = window.frames[0];
   var result = alertFrame.window.confirm(message);
   iframe.parentNode.removeChild(iframe);
   return result;
 };
//点击返回
$(".back").on("click",function(){
	window.history.back();
});

//检查数值
function check(Num){
	if ((!Num)&&(Num!=0)) {
		return Num = "";
	} else{
		return Num;
	}
}
//正式url
 var dataStr = "http://www.ehaofang.com/efapp";
 var dataStr2 = "http://agent2.ehaofang.com/efapp2";
 var imgurlStr = "http://images.ehaofang.com/";


//测试url
//var dataStr = "http://weixintest.ehaofang.com/efapp";
//var dataStr2 = "http://weixintest.ehaofang.com/efapp2";
//var imgurlStr = "http://images.ehaofang.com/";




 var thiswxOpenId = localStorage.getItem('wxOpenId');
 var thiswxUnionId = localStorage.getItem('wxUnionId');


var thismemberID = "";
var thisparentID = "";
var thisbranchID = "";
var thisunionID = "";
var thisfullName = "";
var thissex = "";
var thisagencyName = "";
var thisbranchName = "";
var thisphone = "";
var thisagencyCode = "";
var userType;
var manageLevel;

$.ajax({
	url: dataStr2 + "/login/weixinLogin_2",
    type:"POST",
    async:false,
    data:{
		weixinOpenId:thiswxOpenId,
		weixinunionid:thiswxUnionId,
		type:2
    },
    dataType: "json",
    success: function(data) {

    	thismemberID = data.data.ID;
    	thisparentID = data.data.ParentID;
    	thisbranchID = data.data.BranchID;
    	thisunionID = data.data.WeixinOpenId;
    	thisfullName = data.data.FullName;
    	thissex = data.data.sex;
    	thisagencyName = data.data.agencyName;
    	thisbranchName = data.data.branchName;
    	thisphone = data.data.Mobilephone;
    	thisagencyCode = data.data.AgencyCode;
    	userType = data.data.UserType;
    	manageLevel =  data.data.ManageLevel;

    }
});
$("footer a").eq(0).on("touchstart",function(){
		window.location.href = "index.jsp";
});

$("footer a").eq(1).on("touchstart",function(){
	if (userType == "2") {
		window.location.href = "client-index.jsp";
	} else{
		var con;
		con=confirm("是否去绑定分行码查看？"); 
		if(con==true){
			window.location.href = "../../login/login.jsp?member=1";
		}
	}
});
$("footer a").eq(2).on("touchstart",function(){
	if (userType == "2") {
		window.location.href = "add-reserve-client.jsp";
	} else{
		var con;
		con=confirm("是否去绑定分行后报备？"); 
		if(con==true){
			window.location.href = "../../login/login.jsp?member=1";
		}
	}
});
$("footer a").eq(3).on("touchstart",function(){
		window.location.href = "dongtai.jsp";
});
$("footer a").eq(4).on("touchstart",function(){
		window.location.href = "mine.jsp";
});
$(".visitor").on("click",function(){
	var con;
	con=confirm("是否去绑定分行码查看？");
	if(con==true){
		window.location.href = "../../login/login.jsp?member=1";
	}
	
});

