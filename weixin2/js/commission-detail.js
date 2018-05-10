$(function(){
	FastClick.attach(document.body);

	var proURL = decodeURI((window.location.search).substr(1,(window.location.search).length));
	//console.log(proURL.indexOf("&"));
	var thiscustomerId = proURL.substr(proURL.indexOf("&")+1,proURL.length);
	var thishouseId = proURL.substr(0,proURL.indexOf("&"));
	var jinduStr = "";
	$.ajax({
		type:"post",
		url:dataStr+"/customer/customerYJDetail",
		data:{houseId:thishouseId,
			customerId:thiscustomerId
			},
		success:function(data){
			console.log(data);
			
			$(".visitItem").html("<div><b></b>"+ check(data.info.QYJMmap.customerName) +"</div>"
				+"<div><i></i>"+ check(data.info.QYJMmap.PhoneNum) +"</div>"
				+"<div>"+ check(data.info.QYJMmap.PropertyName) +"</div>");

						
			$(".commissionDetail").html("<h4>佣金详情</h4>"
				+"<li>签约金额<span>"+ checkMsg(data.info.QYJMmap.qianyuejine) +"元</span></li>"
				+"<li>签约时间<span>"+ checkMsg(data.info.YJMap.FinanceTime) +"</span></li>"
				+"<li><b>佣</b>金<span>"+ checkMsg(data.info.YJMap.yongjin) +"元</span></li>"
				+"<li><b>折</b>佣<span>"+ checkMsg(data.info.ZYMap.zheyong) +"元</span></li>"
				+"<li>应发佣金<span>"+ checkMsg(data.info.ZYMap.yingfayongjin) +"元</span></li>"
				+"<li>实发佣金<span>"+ checkMsg(data.info.ZYMap.shifayongjin) +"元</span></li>"
				+"<li>提供发票<span>"+ fapiao(check(data.info.YJMap.tigongfapiao)) +"</span></li>")
			$.each(check(data.info.SYGCMmap), function(i) {
				jinduStr += "<li><b></b>"+check(data.info.SYGCMmap[i].Createtime)+"<i></i>"+ check(data.info.SYGCMmap[i].remark) +"</li>"
			});
			
			$(".commissionProgress").append(jinduStr);
			function fapiao(t){
				if (t == "1 ") {
					return t = "是";
				}else{
					return t = "否";
				}
			}
		    function checkMsg(Num){
		    	if ((!Num)&&(Num!=0)||(Num.length ==0)) {
		    		return Num = "-- ";
		    	}else{
		    		return Num;
		    	}
		    }
			
		}
	})	
})
