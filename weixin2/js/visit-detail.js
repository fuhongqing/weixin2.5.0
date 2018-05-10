$(function(){
	FastClick.attach(document.body);
	var proURL = decodeURI((window.location.search).substr(1,(window.location.search).length));
	
	var thiscustomerID = proURL.substr(0,proURL.indexOf("&"));
	var thisproccessId = proURL.substr(proURL.indexOf("&")+1,proURL.length);
	console.log(thisproccessId)
	$.ajax({
		type:"post",
		url:dataStr+"/customer/customerLFDetail",
		data:{customerID:thiscustomerID,
			houseproccessId:thisproccessId
			},
		success:function(data){
			console.log(check(data.info));
			$(".visitItem").html("<div><b></b>"+check(data.info[0].Customername)+"</div><div><i></i>"
					+check(data.info[0].PhoneNum)+"</div><div>"
					+check(data.info[0].PropertyName)+"</div>");
			var visitStr = "";
			$.each(check(data.info), function(i) {
				//check(data.info[i]
				visitStr += "<ul><h4>"+ checkMsg(data.info[i].visitorCount) +"<span>"+checkMsg(data.info[i].LookTime)+"</span></h4>"
						+"<li>来访人数<span>"+checkMsg(data.info[i].LookStructure)+"</span></li>"
						+"<li>案场销售<span>"+checkMsg(data.info[i].saleusername)+"</span></li>"				
						+"<li><b>落</b>座<span>"+IsSeat(data.info[i].IsSeat)+"</span></li>"//1 落座  2没有落座
						+"<li><b>落</b>位<span>"+HouseIDarr(data.info[i].HouseIDarr)+"</span></li>"//不为空  说明落位了
						+"<li><b>出</b>价<span>"+checkMsg(data.info[i].GivenPrice)+"</span></li>"
						+"<li>下次来访<span>"+checkMsg(data.info[i].NexttradeTime)+"</span></li>"
						+"<li><b>备</b>注<span>"+checkMsg(data.info[i].Remark)+"</span></li></ul>"
			});
			
			$(".visitContent").html(visitStr);
		function IsSeat(t){
			if(t == "1"){
				return t = " 是";
			}else{
				return t = " 否";
			}
		}
	    function checkMsg(Num){
	    	if ((!Num)&&(Num!=0)||(Num.length ==0)) {
	    		return Num = "-- ";
	    	}else{
	    		return Num;
	    	}
	    }

		function HouseIDarr(t){
			if(t == ""){
				return t = " 否";
			}else{
				return t = " 是";
			}
		}
			
		}
		
	});
});
