$(function(){
	FastClick.attach(document.body);
	var proURL = decodeURI((window.location.search).substr(1,(window.location.search).length));
	//console.log(proURL.indexOf("&"));
	var customerId = proURL.substr(proURL.indexOf("&")+1,proURL.length);
	var propertyId = proURL.substr(0,proURL.indexOf("&"));
    var clipboard = new Clipboard('.copyBtn');
	
	//console.log(propertyId+"-----"+customerId);
	$.ajax({
		type:"post",
		url:dataStr+"/customer/customerperdetail",
		data:{customerId:customerId,
			propertyId:propertyId
			},
		success:function(data){
			console.log(data);
			if (check(data.info[0].Shuttle) == 1) {
				$(".reportContent ul").html("<li><b>姓</b>名:<span>"+ check1(data.info[0].FullName) +"</span></li>"
					+"<li><b>电</b>话:<span>"+ check1(data.info[0].PhoneNum) +"</span></li>"
					+"<li class='reportPro'>意向项目:<span>"+ check1(data.info[0].PropertyName) +"</span></li>"
					+"<li>预访时间:<span>"+ check1(data.info[0].LookHomeDate) +"</span></li>"
					+"<li>来访人数:<span>"+ check1(checkvisitor(data.info[0].VisitorsNumber))+ "</span></li>"
					+"<li>案场销售:<span>"+ check1(data.info[0].name) +"</span></li>"
					+"<li>来访方式:<span>自驾</span></li>"
					+"<li>报备时间:<span>"+ check1(data.info[0].CreatTime) +"</span></li>");
				
			} else{
				$(".reportContent ul").html("<li><b>姓</b>名:<span>"+ check1(data.info[0].FullName) +"</span></li>"
					+"<li><b>电</b>话:<span>"+ check1(data.info[0].PhoneNum) +"</span></li>"
					+"<li class='reportPro'>意向项目:<span>"+ check1(data.info[0].PropertyName) +"</span></li>"
					+"<li>报备时间:<span>"+ check1(data.info[0].CreatTime) +"</span></li>"
					+"<li>预访时间:<span>"+ check1(data.info[0].LookHomeDate) +"</span></li>"
					+"<li>来访人数:<span>"+ check1(checkvisitor(data.info[0].VisitorsNumber))+ "</span></li>"
					+"<li>案场销售:<span>"+ check1(data.info[0].name) +"</span></li>"
					+"<li>来访方式:<span>班车</span></li>"
					+"<li>上车地点:<span>"+ check1(data.info[0].HouseValuation) +"</span></li>"
					+"<li>上车时间:<span>"+ check1(data.info[0].CarTime) +"</span></li>"
					+"<li>报备时间:<span>"+ check1(data.info[0].CreatTime) +"</span></li>");
			}
			$("#clickButton").on("click",function(){
				window.location.href = "add-reserve-client.jsp?"+ check(data.info[0].FullName) + "@" + check(data.info[0].PhoneNum) ;
			})
			
			function checkvisitor(num){
				if(num == "0"){
					return num = "";
				}else{
					return num ;
				}
			}
			function check1(num){
				if((num == "")||(!num)&&(num!=0)){
					return num = "无";
				}else{
					return num ;
				}
			}
			
		}
	});
	
//复制文本				
	
	    clipboard.on('success', function(e) {
	        //console.log(e);
	    	  console.info('Action:', e.action);
	    	  console.info('Text:', e.text);
	    	  console.info('Trigger:', e.trigger);
			warn("文本已复制！");
			e.clearSelection();
	    });
		function warn(word){
			$(".warn").html(word).fadeIn("fast");
			setTimeout(function(){$(".warn").fadeOut("normal");},2000)
		}
	
	    clipboard.on('error', function(e) {
	    	  console.error('Action:', e.action);
	    	  console.error('Trigger:', e.trigger);
	        //console.log(e);
	    });

})
