$(function(){
	FastClick.attach(document.body);
	var proURL = decodeURI((window.location.search).substr(1,(window.location.search).length));
	var proArr = proURL.split("&");
	
	var qyStr = "";
	var ddStr = "";
	var xdStr = "";
	$.ajax({
		type:"post",
		url:dataStr+"/customer/customerCJDetail",
		data:{houseId:proArr[0],
			customerID:proArr[1],
			houseproccessId:proArr[2]
			},
		success:function(data){
			console.log(data);
			
			if(data.info[1]){
				$(".visitItem").html("<div><b></b>"+ check(data.info[0].fullname) +"</div>"
						+"<div><i></i>"+ check(data.info[0].phoneNum) +"</div>"
						+"<div>"+check(data.info[0].propertyName) +" "+check(data.info[0].banNO)+"-"+check(data.info[0].adWord)+"</div>");
					ddStr = "<ul>"
						+"<h4>"+ signStatus(check(data.info[1].HouseSaleType)) +"<span>"+ checkMsg(data.info[1].SignTime) +"</span></h4>"
						+"<li>大定金额<span>"+ checkMsg(data.info[1].SignMoney) +"</span></li>"
						+"<li>团购方案<span>"+ checkMsg(data.info[1].DetailName) +"</span></li>"
						+"<li>应收团购<span>"+ checkMsg(data.info[1].GroupShouldpay) +"</span></li>"
						+"<li>案场销售<span>"+ checkMsg(data.info[1].name) +"</span></li>"
						+"<li>约签时间<span>"+ checkMsg(data.info[1].TradingTime) +"</span></li>"
						+"<li><b>备</b>注 <span>"+ checkMsg(data.info[1].Remark) +"</span></li>"
						+"</ul>";
					qyStr = "<ul>"
						+"<h4>"+ signStatus(check(data.info[0].HouseSaleType)) +"<span>"+ checkMsg(data.info[0].SignTime) +"</span></h4>"
						+"<li>签约总价<span>"+ checkMsg(data.info[0].SignMoney) +"</span></li>"
						+"<li><b>面</b>积<span>"+ checkMsg(data.info[0].DealArea) +"平米</span></li>"
						+"<li>团购方案<span>"+ checkMsg(data.info[0].DetailName) +"</span></li>"
						+"<li>应收团购<span>"+ checkMsg(data.info[0].GroupShouldpay) +"</span></li>"
						+"<li>实收团购<span>"+ checkMsg(data.info[0].GroupActualpay) +"</span></li>"
						+"<li>案场销售<span>"+ checkMsg(data.info[0].name) +"</span></li>"
						+"<li><b>备</b>注<span>"+ checkMsg(data.info[0].Remark) +"</span></li>"
					+"</ul>";

			}else{
				if(data.info[0]){
					
					$(".visitItem").html("<div><b></b>"+ check(data.info[0].fullname) +"</div>"
						+"<div><i></i>"+ check(data.info[0].phoneNum) +"</div>"
						+"<div>"+check(data.info[0].propertyName) +" "+check(data.info[0].banNO)+"-"+check(data.info[0].adWord)+"</div>");
					ddStr = "<ul>"
						+"<h4>"+ signStatus(check(data.info[0].HouseSaleType)) +"<span>"+ checkMsg(data.info[0].SignTime) +"</span></h4>"
						+"<li>大定金额<span>"+ checkMsg(data.info[0].SignMoney) +"</span></li>"
						+"<li>团购方案<span>"+ checkMsg(data.info[0].DetailName) +"</span></li>"
						+"<li>应收团购<span>"+ checkMsg(data.info[0].GroupShouldpay) +"</span></li>"
						+"<li>案场销售<span>"+ checkMsg(data.info[0].name) +"</span></li>"
						+"<li>约签时间<span>"+ checkMsg(data.info[0].TradingTime) +"</span></li>"
						+"<li><b>备</b>注<span>"+ checkMsg(data.info[0].Remark) +"</span></li>"
						+"</ul>";
					
					}else{
						$(".signContent").html("<dt></dt>"
								+"<dd>没有相关客户数据～</dd>");

					}
				
			}
			$(".signContent").append(qyStr);
			$(".signContent").append(ddStr);
			
		}	
	});
    function signStatus(t){
    	
		switch(t)
		{
		case 0:
		  return t = "未售"
		  break;
		case 1:
		  return t = "带看"
		  break;
		case 2:
		  return t = "小定"
		  break;
		case 3:
		  return t = "大定"
		  break;
		case 4:
		  return t = "签约"
		  break;
		default:
		  return t = "未知"
		}			                    
    }
								  
    function checkMsg(Num){
    	if ((!Num)&&(Num!=0)||(Num.length ==0)) {
    		return Num = "-- ";
    	}else{
    		return Num;
    	}
    }

})
