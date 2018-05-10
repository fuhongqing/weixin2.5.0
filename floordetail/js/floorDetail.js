$(function () {
    //根字体大小设置
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px';
    //提示框显示
    function showTips(text) {
        $('.modal').fadeIn();
        $('.toast').html(text);
        setTimeout(function () {
            $('.modal').fadeOut();
        },1000)
    }
    //点击图片，显示大图
    function showBigImg(imgSrc) {
        $('.imgModal').fadeIn();
        $('.imgToast').html(imgSrc);
    }
    //console.log($('#commissionInfo').offset().top);
    //获取元素到底部距离
    function contactToolbar(curId) {
        var top = document.getElementById(curId).getBoundingClientRect().top; //元素顶端到可见区域顶端的距离
        if(top<100&&top>80){
            $('#navbars>li.'+curId).addClass('active').siblings().removeClass('active');
        }
    }
    var idArr=['commissionInfo','preferential','sellPoints','renderings','progress',
        'declaration','guess'];
    //头部返回
    $('#topTool,#swiperTitle').on('click','.backImg',function () {
        history.back();
    });
    //向上滑动时导航条
    $('#navbars').on('click','li',function () {
        $('#floorDetail').css({'top':'0'});
        $(this).addClass('active').siblings().removeClass('active');
        switch ($(this).index()){
            case 5:
                $('#floorDetail').animate({'top':'0rem'},50);
                break;
            case 6:
                $('#floorDetail').animate({'top':'0rem'},50);
                break;
            default:
                $('#floorDetail').animate({'top':'1rem'},50);
                break;
        }
    });
    //点击楼盘信息时显示详情
    $('#floorInfo>div:first-child').click(function () {
        $('#floorDetail').hide();
        $('#lpxq').show();
    });
    //楼盘详情返回详情主页
    $('#lpxq').on('click','.back',function () {
        $('#floorDetail').show();
        $('#lpxq').hide();
    });
    //佣金信息显示详情
    $('#commissionInfo>div').on('click','.more',function () {
        if(userType==2){
            $('#floorDetail').hide();
            $('#commissionInfoMore').show();
        }else{
            $('.fhmModal').fadeIn();
            var consultHtml=`
                    <div>您还没有绑定分行码</div>
                    <div>
                        <div class="cancel">算了</div>
                        <div class="call">立即绑定</div>
                    </div>
                    `;
            $('.fhmToast').html(consultHtml);
            //取消
            $('.cancel').on('click',function () {
                $('.fhmModal').fadeOut();
            });
            $('.call').on('click',function () {
                $(location).attr('href','../login/login.jsp?member=1');
            });
            return;
        }
    });
    //佣金信息详情返回主页
    $('#commissionInfoMore').on('click','.back',function () {
        $('#floorDetail').show();
        $('#commissionInfoMore').hide();
    });
    //优惠活动显示详情
    $('#preferential>div').on('click','.more',function () {
        $('#floorDetail').hide();
        $('#preferentialMore').show();
    });
    //优惠活动详情返回主页
    $('#preferentialMore').on('click','.back',function () {
        $('#floorDetail').show();
        $('#preferentialMore').hide();
    });
    //楼盘相册返回事件
    $('#propertyImg').on('click','.back',function () {
        $('#floorDetail').show();
        $('#propertyImg').hide();
    });
    // 楼盘详情页滚动事件
    $(document).scroll(function () {
        contactToolbar(idArr[0]);
        contactToolbar(idArr[1]);
        contactToolbar(idArr[2]);
        contactToolbar(idArr[3]);
        contactToolbar(idArr[4]);
        contactToolbar(idArr[5]);
        contactToolbar(idArr[6]);
        var scrollTop=$(this).scrollTop();
        if(scrollTop){
            $('#swiperTitle').css('visibility','visible');//显示头部
            $('.scrollAuto').css('visibility','visible');//显示导航条
        }else{
            $('#floorDetail').css({'top':'0'});
            $('#floorDetail>header').show();
            $('#swiperTitle').css('visibility','hidden');//隐藏头部
            $('.scrollAuto').css('visibility','hidden');//隐藏导航条
        }
    });
    //获取链接中的楼盘信息
    var searchArr=location.search.slice(1).split('&');
    var imgUrl = "http://images.ehaofang.com/",//初始图片地址
        //floorUrl='http://weixintest.ehaofang.com/efapp2/',//初始url
        //weixinUrl='http://weixintest.ehaofang.com/efangnet/',
        //wxAppId='wx9cbe0adb2edc523f',
        wxAppId='wx54409552def47f3f',
        floorUrl='http://agent2.ehaofang.com/efapp2/',//初始url
        weixinUrl='http://weixin.ehaofang.com/efangnet/',
        propertyId=searchArr[0].split('=')[1],//楼盘id3
        memberId=searchArr[1].split('=')[1],//经纪人id151774
        sign=searchArr[2].split('=')[1],//是否签约0
        userType=searchArr[3].split('=')[1],//1为游客  2为员工1
        isShangXian=searchArr[4].split('=')[1],//是否上线
        propertyName='',//楼盘名
        hasConsult=true;//判断是否有咨询信息

    //判断是否为上线项目
    if(isShangXian==0){//未上线
        $('#floorDetail>footer').hide();
    }
    var noDataHtml=`<div class="noData">暂无更多楼盘信息</div>`;//卖点，户型图，猜暂无数据
    var initImg='img/all_bg_wait_best@2x.png';
    function weixin(data) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的
            //参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId:wxAppId,//  必填，企业号的唯一标识，此处填写企业号corpid  wx9cbe0adb2edc523f
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1W
            jsApiList: [
                'getLocation',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });
        wx.ready(function () {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，
                //可传入'gcj02'
                success: function (res) {
                    getFloorDetail(res);
                    //_distance 获取到的距离
                }
            });
        });
        wx.error(function (res) {
            console.log(res);
        });
    }
    function getDistance(itemPoint, pointOrigin) {
        var map = new BMap.Map('');
        var pointB = new BMap.Point(itemPoint.Longitude, itemPoint.Latitude);
        var distance = ~~(map.getDistance(pointOrigin, pointB));
        return distance;
    }
    PostData(weixinUrl+"weixin/member/demo.html", {url:window.location.href}, weixin);
    //楼盘状态
    function sellState(t) {
        switch (t) {
            case 1:
                return t="待售";
                break;
            case 2:
                return t="在售";
                break;
            case 4:
                return t="售罄";
                break;
            default:
                return t="其他";
                break;
        }
    }
    //建筑类型
    function buildingType(n) {
        var arr = n.split(",");
        var arrHtml = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            switch (arr[i]) {
                case "1":
                    arrHtml.push("住宅");
                    break;
                case "2":
                    arrHtml.push("别墅");
                    break;
                case "3":
                    arrHtml.push("公寓");
                    break;
                case "4":
                    arrHtml.push("商铺");
                    break;
                case "5":
                    arrHtml.push("写字楼");
                    break;
                case "6":
                    arrHtml.push("洋房");
                    break;
                default:
                    break;
            }
        }
        return arrHtml.join("；")
    }
    //项目属性
    function feature(n) {
        if (!n) {
            return ""
        }
        var arr = n.split(",");
        var arrHtml = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            switch (arr[i]) {
                case "1":
                    arrHtml.push("学区房");
                    break;
                case "2":
                    arrHtml.push("养老房");
                    break;
                case "3":
                    arrHtml.push("轨交房");
                    break;
                case "4":
                    arrHtml.push("景区房");
                    break;
                case "5":
                    arrHtml.push("商超房");
                    break;
                case "7":
                    arrHtml.push("人车分流");
                    break;
                case "8":
                    arrHtml.push("低密度");
                    break;
                case "9":
                    arrHtml.push("大型社区");
                    break;
                case "10":
                    arrHtml.push("投资地产");
                    break;
                case "11":
                    arrHtml.push("降价房源");
                    break;
                case "12":
                    arrHtml.push("火爆热盘");
                    break;
                default:
                    break;
            }
        }
        return arrHtml.join("；")
    }
    //楼盘相册
    function PropertyImage(data) {
        if (data.list.PropertyImage.length) {
            var _data = data.list.PropertyImage;
            var KeyImg = [];
            var KeyImg1, KeyImg1l, KeyImg2, KeyImg2l, KeyImg3, KeyImg3l, KeyImg4, KeyImg4l, slide1, slide2, slide3,
                slide4;
            for (var i = 0, l = _data.length; i < l; i++) {
                var Type = _data[i]["Type"];
                if(_data[i]["KeyImg"]){
                    switch (Type) {
                        case 1:
                            slide1 = document.createElement("span");
                            slide1.className = "slide active";
                            KeyImg1 = _data[i]["KeyImg"].split(",");
                            KeyImg1l = KeyImg1.length;
                            slide1.innerHTML = "效果图(" + KeyImg1l + ")";
                            break;
                        case 2:
                            slide2 = document.createElement("span");
                            slide2.className = "slide";
                            KeyImg2 = _data[i]["KeyImg"].split(",");
                            KeyImg2l = KeyImg2.length;
                            slide2.innerHTML = "实景图(" + KeyImg2l + ")";
                            break;
                        case 3:
                            slide3 = document.createElement("span");
                            slide3.className = "slide";
                            KeyImg3 = _data[i]["KeyImg"].split(",");
                            KeyImg3l = KeyImg3.length;
                            slide3.innerHTML = "交通图(" + KeyImg3l + ")";
                            break;
                        case 4:
                            slide4 = document.createElement("span");
                            slide4.className = "slide";
                            KeyImg4 = _data[i]["KeyImg"].split(",");
                            KeyImg4l = KeyImg4.length;
                            slide4.innerHTML = "样板间(" + KeyImg4l + ")";
                            break;
                        default:
                            break;
                    }
                }
            }
            if (KeyImg1) {
                KeyImg.push(KeyImg1)
            }
            if (KeyImg2) {
                KeyImg.push(KeyImg2)
            }
            if (KeyImg3) {
                KeyImg.push(KeyImg3)
            }
            if (KeyImg4) {
                KeyImg.push(KeyImg4)
            }
            KeyImg = KeyImg.join(",");
            KeyImg = KeyImg.split(",");
            var lists = [];
            for (var j = 0, k = KeyImg.length; j < k; j++) {
                var list = "<div class='swiper-slide'>" +
                    "<img class='swiper-lazy' data-src='" + KeyImg[j] + "' />" +
                    "</div>";
                lists.push(list);
            }
            lists = lists.join("");
            document.getElementById("PropertyImage").innerHTML = lists;
            if (slide1) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide1)
            }
            if (slide2) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide2)
            }
            if (slide3) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide3)
            }
            if (slide4) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide4)
            }
            var swiper_PropertyImage = new Swiper('.swiper-container_PropertyImage', {
                lazy: {
                    loadPrevNext: true
                },
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                on: {
                    slideChangeTransitionEnd: function () {
                        document.getElementsByClassName("PropertyImage-num")[0].innerHTML = this.activeIndex + 1 + "/" + KeyImg.length
                    }
                }
            });
            var elDom = document.getElementsByClassName("slide");
            document.getElementsByClassName("PropertyImage-num")[0].innerHTML = 1 + "/" + KeyImg.length;

            function resetActive(n) {
                for (var i = 0, l = elDom.length; i < l; i++) {
                    if (i == n) {
                        elDom[i].className = "slide active"
                    } else {
                        elDom[i].className = "slide"
                    }
                }
            }

            if (slide1) {
                slide1.onclick = function () {
                    resetActive(0);
                    swiper_PropertyImage.slideTo(0, 0);
                };
            }
            if (slide2) {
                slide2.onclick = function () {
                    resetActive(1);
                    swiper_PropertyImage.slideTo(KeyImg1l, 0);

                };
            }
            if (slide3) {
                slide3.onclick=function () {
                    resetActive(2);
                    swiper_PropertyImage.slideTo(KeyImg3l, 0);
                };
            }
            if (slide4) {
                slide4.onclick=function () {
                    resetActive(3);
                    swiper_PropertyImage.slideTo(KeyImg4l, 0);
                };
            }
        }
    }

    function PostData(url, data, callback) {
        $.ajax({
            type:'post',
            url:url,
            data:data,
            success:function (data) {
                callback(data);
            },
            error:function () {
                showTips('请求失败');
            }
        });
    }
    //获取楼盘详情
    function getFloorDetail(res) {
        $.ajax({
            type:'post',
            url:floorUrl+'Project/projectdetails',
            data:{
                propertyID:propertyId,//	是	string	楼盘id
                memberId:memberId//	是	string	经纪人id
            },
            success:function (data) {
                $('#loading').hide();
                var floorDetailData=data.xmxq;//详情数据
                var messData=data.mess;//合作，意向客户，成交数
                var midImgList=data.midimglist;//轮播图
                var yjfasize=data.yjfasize;//佣金信息条数
                var zlhx=data.zlhx;//户型图
                var photoNum=data.photoNum;//相册数量
                var anChangTuiJian=data.anChangTuiJian_1;// 咨询项目

                if(photoNum){
                    var spanHtml='';
                    $('#topPages>p').text('查看相册('+data.photoNum+')');
                    for(var i=0;i<photoNum;i++){
                        spanHtml+=`
                        <span></span>   
                        `;
                    }
                    $('#topPages>div').html(spanHtml);
                }else{
                    $('#topPages>p').text('查看相册()');
                    $('#topPages>div').html('<span></span>');
                }
                if(yjfasize){
                    $('#commissionInfo .more>span').text(yjfasize+'套方案');
                }else{
                    $('#commissionInfo .more>span').text('套方案');
                }
                var yjfa=data.yjfa;//佣金方案
                if(yjfa.length){
                    var yjfaHtml='',yjfaMoreHtml='';
                    var noMoreHtml='<li><span class="line"></span><sapn>已经到底啦</sapn><span class="line"></span></li>';
                    $.each(yjfa,function (i) {
                        if(yjfa[i].CommissionMoney==null){
                            yjfa[i].CommissionMoney='';
                        }
                        if(!yjfa[i].CommissionAdword){
                            yjfa[i].CommissionAdword='';
                        }
                        yjfaHtml+=`
                        <li>
                            <p>${yjfa[i].CommissionMoney}元/套</p>
                            <p>${yjfa[i].CommissionAdword}</p>
                        </li>
                        `;
                        yjfaMoreHtml+=`
                        <li><span>${yjfa[i].CommissionAdword}</span><span>${yjfa[i].CommissionMoney}元/套</span></li>
                        `;
                    });
                    if(userType==2){

                        $('#commissionInfo>ul').html(yjfaHtml);
                        $('#commissionInfoMore>ul').html(yjfaMoreHtml+noMoreHtml);
                    }else{
                        $('#userType').show();
                    }
                }else{
                    $('#commissionInfo>ul').text('暂无数据');
                    $('#commissionInfoMore>ul').text('暂无数据');
                }
                var tgxqsize=data.tgxqsize;//团购条数
                if(tgxqsize){
                    $('#preferential .more>span').text(tgxqsize+'套方案');
                }
                var tgxq=data.tgxq;//团购详情
                if(tgxq.length){
                    var tgxqHtml='',tgxqMoreHtml='';
                    var noMoreHtml='<li><span class="line"></span><sapn>已经到底啦</sapn><span class="line"></span></li>';
                    $.each(tgxq,function (i) {
                        if(!tgxq[i].BuildingType){
                            tgxq[i].BuildingType='';
                        }
                        if(!tgxq[i].DetailName){
                            tgxq[i].DetailName='';
                        }
                        tgxqHtml+=`
                        <li>
                            <span>${tgxq[i].BuildingType}</span>
                            <span>${tgxq[i].DetailName}</span>
                        </li>
                        `;
                        tgxqMoreHtml+=`
                        <li><span>${tgxq[i].BuildingType}</span><span>${tgxq[i].DetailName}</span></li>
                        `;
                    });
                    $('#preferential>ul').html(tgxqHtml);
                    $('#preferentialMore>ul').html(tgxqMoreHtml+noMoreHtml);
                }else{
                    $('#preferential>ul').text('暂无数据');
                    $('#preferentialMore>ul').text('暂无数据');
                }
                if(!midImgList.length){//轮播图
                    $('#floorDetail .swiper-wrapper').html(`<li><img src="${initImg}" alt=""></li>`);
                }else{
                    var midImgHtml='';
                    $.each(midImgList,function (i) {
                        midImgHtml+=`
                         <li class="swiper-slide"><img data-src="${imgUrl+midImgList[i]}" class="swiper-lazy" alt=""></li>  
                        `;
                    });
                    $('#floorDetail .swiper-wrapper').html(midImgHtml);
                    var mySwiper = new Swiper ('.headerImg', {
                        direction: 'horizontal',
                        lazy: {
                            loadPrevNext: true,
                        }
                    });
                    //点击轮播图显示相册
                    $('#topPages').on('click','p',function () {
                        $('#propertyImg .append-buttons').html('');
                        //楼盘相册
                        PostData(floorUrl+"Project/PropertyImage", "propertyId=" + propertyId, PropertyImage);
                        $('#floorDetail').hide();
                        $('#propertyImg').show();
                    });
                    //点击轮播图显示相册
                    $('#floorDetail').on('click','.headerImg',function (e) {
                        $('#propertyImg .append-buttons').html('');
                        //楼盘相册
                        PostData(floorUrl+"Project/PropertyImage", "propertyId=" + propertyId, PropertyImage);
                        $('#floorDetail').hide();
                        $('#propertyImg').show();
                    });
                }
                //判断合作，意向客户，成交数据是否存在
                if(messData.length){
                    var messHtml=`
                    <p><span>合作经纪人:</span><span>${messData[0].AgentMemberCount}</span></p>
                    <p class="center"><span>意向客户:</span><span>${messData[0].ReportCustomer}</span></p>
                    <p><span>最近成交:</span><span>${messData[0].TotalHouse}</span></p>
                    `;
                    $('#floorInfo>div:last-child').html(messHtml);
                }
                //基本详情
                if(floorDetailData.length){
                    if(!floorDetailData[0].PropertyName){
                        floorDetailData[0].PropertyName='';
                    }
                    if(floorDetailData[0].AveragePrice==null){
                        floorDetailData[0].AveragePrice='';
                    }
                    propertyName=floorDetailData[0].PropertyName;
                    // 楼盘信息
                    var floorInfoHtml=`
                    <p><span>${floorDetailData[0].PropertyName}</span><span class="floorState">${sellState(floorDetailData[0].SellState)}</span><span class="isSigned">签约项目</span></p>
                    <p>均价:${floorDetailData[0].AveragePrice}元/㎡</p>
                    `;
                    $('#floorInfo .nameLeft').html(floorInfoHtml);
                    if(sign==0){
                        $('#floorInfo span.isSigned').hide();
                    }
                    //上滑屏幕时头部
                    var swiperTitleHtml=`
                    <div class="img backImg" onclick="history.back()"><img src="img/topbar_ic_back_black@2x.png" alt=""></div>
                    <div>${floorDetailData[0].PropertyName}</div>
                    <div class="img"><img src="img/topbar_ic_share_black@2x.png" alt=""></div>
                    `;
                    $('#swiperTitle').html(swiperTitleHtml);
                    //项目属性
                    if(floorDetailData[0].minAcreage==null){
                        floorDetailData[0].minAcreage='';
                    }
                    if(floorDetailData[0].maxAcreage==null){
                        floorDetailData[0].maxAcreage='';
                    }
                    var itemsHtml=`
                    <span>项目属性：</span><span>${floorDetailData[0].minAcreage}-${floorDetailData[0].maxAcreage}㎡；</span><span>${buildingType(floorDetailData[0].BuildingType)}</span><span>${feature(floorDetailData[0].Feature)}</span>
                    `;
                    $('#floorInfo>.items').html(itemsHtml);
                    //楼盘地址
                    var x = res.longitude;//微信经度
                    var y = res.latitude;//微信纬度
                    var pointOrigin,_distance;//起始坐标点
                    var url = "http://api.map.baidu.com/geoconv/v1/?coords=" + x + "," + y + "&from=1&to=5&ak=CB2ede775afeb6e413abd40261396a69";
                    $.get(url, function(data) {
                        if(data.status === 0) {
                            pointOrigin = new BMap.Point(data.result[0].x,data.result[0].y);
                            //参数是楼盘所在地的经纬度
                            _distance = getDistance({
                                Longitude: floorDetailData[0].Longitude,
                                Latitude: floorDetailData[0].Latitude
                            }, pointOrigin);
                            if(!floorDetailData[0].Address){
                                floorDetailData[0].Address='';
                            }
                            if(String(_distance).length>3){
                                _distance=Math.round(_distance/1000)+'km';
                            }else{
                                _distance=_distance+'m';
                            }
                            var attressHtml=`
                    <div class="attressLeft">
                      <img src="img/project_ic_location_big@2x.png" alt=""><span>${floorDetailData[0].Address}</span>
                    </div>
                    <div class="attressRight">
                      <span>${_distance}</span>
                    </div>
                    `;
                            $('#floorInfo>.attress').html(attressHtml);
                        }
                    }, 'jsonp');
                    //楼盘卖点
                    var hasSellPoints=0;//判断是否有楼盘卖点
                    if(floorDetailData[0].Advantage){
                        $('#sellPoints .advantage').text(floorDetailData[0].Advantage);//交通配套
                    }else{
                        hasSellPoints+=1;
                        $('#sellPoints .advantage').text('暂无');
                    }
                    if(floorDetailData[0].Attribute){
                        $('#sellPoints .attribute').text(floorDetailData[0].Attribute);//教育资源
                    }else{
                        hasSellPoints+=1;
                        $('#sellPoints .attribute').text('暂无');
                    }
                    if(floorDetailData[0].Process){
                        $('#sellPoints .process').text(floorDetailData[0].Process);//医疗健康
                    }else{
                        hasSellPoints+=1;
                        $('#sellPoints .process').text('暂无');
                    }
                    if(floorDetailData[0].TheWords){
                        $('#sellPoints .theWords').text(floorDetailData[0].TheWords);//娱乐购物
                    }else{
                        hasSellPoints+=1;
                        $('#sellPoints .theWords').text('暂无');
                    }
                    if(hasSellPoints==4){
                        $('#sellPoints>ul').html(noDataHtml);
                    }
                    //楼盘分享
                    $.ajax({
                        type:"post",
                        url:weixinUrl+"weixin/member/demo.html",
                        async:true,
                        data:{
                            url:weixinUrl+"pages/efshare/pro.jsp?propertyID="+propertyId+'&memberId='+memberId
                        },
                        success:function(data){
                            wx.config({

                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

                                appId: wxAppId, // 必填，公众号的唯一标识

                                timestamp: data.timestamp, // 必填，生成签名的时间戳

                                nonceStr: data.noncestr, // 必填，生成签名的随机串

                                signature: data.signature,// 必填，签名，见附录1

                                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表

                            });
                        }
                    });

                    wx.ready(function () {
                        wx.onMenuShareTimeline({
                            title: floorDetailData[0].PropertyName+' '+floorDetailData[0].AveragePrice+'元/㎡', // 分享标题 楼盘名称和均价
                            link: weixinUrl+'pages/efshare/pro.jsp?propertyID='+propertyId+'&memberId='+memberId,
                            imgUrl: imgUrl+midImgList[0], // 分享图标  当前轮播图第一张图
                            success: function () {
                                console.log("分享成功");
                            },
                            cancel: function () {
                                console.log('分享失败');// 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareAppMessage({
                            title: floorDetailData[0].PropertyName+' '+floorDetailData[0].AveragePrice+'元/㎡', // 分享标题 楼盘名称和均价
                            link: weixinUrl+'pages/efshare/pro.jsp?propertyID='+propertyId+'&memberId='+memberId,
                            imgUrl: imgUrl+midImgList[0], // 分享图标  当前轮播图第一张图
                            success: function () {
                                console.log("分享成功");
                            },
                            cancel: function () {
                                console.log('分享失败');// 用户取消分享后执行的回调函数
                            }
                        });
                    });
                    //楼盘信息跳转楼盘详情
                    if(!floorDetailData[0].OpenTime){
                        floorDetailData[0].OpenTime='';
                    }
                    if(!floorDetailData[0].FinishTime){
                        floorDetailData[0].FinishTime='';
                    }
                    if(!floorDetailData[0].CheckTime){
                        floorDetailData[0].CheckTime='';
                    }
                    var item1Html=`
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">开盘时间</div>
                        <div class="lpxq-group_value">${floorDetailData[0].OpenTime}</div>
                    </div>
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">竣工时间</div>
                        <div class="lpxq-group_value">${floorDetailData[0].FinishTime}</div>
                    </div>
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">交房时间</div>
                        <div class="lpxq-group_value">${floorDetailData[0].CheckTime}</div>
                    </div>
                    `;
                    $('#item1').html(item1Html);
                    if(!floorDetailData[0].Developer){
                        floorDetailData[0].Developer='';
                    }
                    if(!floorDetailData[0].PropertyCorp){
                        floorDetailData[0].PropertyCorp='';
                    }
                    var item2Html=`
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">开发商</div>
                        <div class="lpxq-group_value">${floorDetailData[0].Developer}</div>
                    </div>
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">物业公司</div>
                        <div class="lpxq-group_value">${floorDetailData[0].PropertyCorp}</div>
                    </div>
                    <div class="lpxq-item">
                        <div class="lpxq-group_name">建筑类型</div>
                        <div class="lpxq-group_value">${buildingType(floorDetailData[0].BuildingType)}</div>
                    </div>
                    `;
                    $('#item2').html(item2Html);
                    if(floorDetailData[0].BuildingTotal==null){
                        floorDetailData[0].BuildingTotal='';
                    }
                    if(floorDetailData[0].Acreage1==null){
                        floorDetailData[0].Acreage1='';
                    }
                    if(floorDetailData[0].Acreage2==null){
                        floorDetailData[0].Acreage2='';
                    }
                    if(!floorDetailData[0].CubageRatio){
                        floorDetailData[0].CubageRatio='';
                    }
                    if(!floorDetailData[0].VirescenceRatio){
                        floorDetailData[0].VirescenceRatio='';
                    }
                    if(!floorDetailData[0].ParkingSpace){
                        floorDetailData[0].ParkingSpace='';
                    }
                    if(floorDetailData[0].OverheadCost==null){
                        floorDetailData[0].OverheadCost='';
                    }
                    if(!floorDetailData[0].Address){
                        floorDetailData[0].Address='';
                    }
                    var item3Html=`
                    <div class="lpxq-item">
                <div class="lpxq-group_name">栋楼总数</div>
                <div class="lpxq-group_value">${floorDetailData[0].BuildingTotal}</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">占地面积</div>
                <div class="lpxq-group_value">${floorDetailData[0].Acreage1}㎡</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">建筑面积</div>
                <div class="lpxq-group_value">${floorDetailData[0].Acreage2}㎡</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">容积率</div>
                <div class="lpxq-group_value">${floorDetailData[0].CubageRatio}</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">绿化率</div>
                <div class="lpxq-group_value">${floorDetailData[0].VirescenceRatio}</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">停车位</div>
                <div class="lpxq-group_value">${floorDetailData[0].ParkingSpace}</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">物业费</div>
                <div class="lpxq-group_value">${floorDetailData[0].OverheadCost}</div>
            </div>
            <div class="lpxq-item">
                <div class="lpxq-group_name">楼盘地址</div>
                <div class="lpxq-group_value">${floorDetailData[0].Address}</div>
            </div>
                    `;
                    $('#item3').html(item3Html);
                }
                //户型图
                if(zlhx.length){
                    var zlhxHtml='';
                    $.each(zlhx,function (i) {
                        if(!zlhx[i].HouseModel){
                            zlhx[i].HouseModel='';
                        }
                        if(zlhx[i].Room1==null){
                            zlhx[i].Room1='';
                        }
                        if(zlhx[i].Room2==null){
                            zlhx[i].Room2='';
                        }
                        if(zlhx[i].Room3==null){
                            zlhx[i].Room3='';
                        }
                        if(zlhx[i].Acreage==null){
                            zlhx[i].Acreage='';
                        }
                        if(!zlhx[i].Remark){
                            zlhx[i].Remark='';
                        }
                        if(!zlhx[i].Decoration){
                            zlhx[i].Decoration='';
                        }
                        if(zlhx[i].SalePrice==null){
                            zlhx[i].SalePrice='';
                        }
                        zlhxHtml+=`
                            <ul class="swiper-slide">
                                <li class="slideImg">
                                  <img src="${!zlhx[i].MainImage?initImg:imgUrl+zlhx[i].MainImage}" alt=""/>
                                  <div></div>
                                </li>
                                <li class="status"><span>${zlhx[i].HouseModel}</span><span>${sellState(floorDetailData[0].SellState)}</span></li>
                                <li>${zlhx[i].Room1}室${zlhx[i].Room2}厅${zlhx[i].Room3}卫·${zlhx[i].Acreage}㎡·${zlhx[i].Remark}·${zlhx[i].Decoration}</li>
                                <li>${zlhx[i].SalePrice}万起</li>
                            </ul>
                            `;
                    });
                    $('#renderings>.items').html(zlhxHtml);
                    $('#renderings').on('click','.slideImg',function () {
                        $('#swiperTitle').css('visibility','hidden');//隐藏头部
                        $('.scrollAuto').css('visibility','hidden');//隐藏导航条
                        var bigImgSrc=$(this).children('img').attr('src');
                        showBigImg(`<img src="${bigImgSrc}" />`);
                    });
                    //点击非目标区域，弹框隐藏
                    $(document).click(function(e){
                        var _con=$('.slideImg');//设置点击，展示目标区域
                        if(!_con.is(e.target)&&_con.has(e.target).length==0){
                            $('.imgModal').hide();
                        }
                    });
                }else{
                    $('#renderings>.items').html(noDataHtml);
                }
                //咨询项目
                if(anChangTuiJian){
                    if(!anChangTuiJian[0].name){
                        anChangTuiJian[0].name='';
                    }
                    if(!anChangTuiJian[0].mobile){
                        anChangTuiJian[0].mobile='';
                        hasConsult=false;
                    }
                    var consultHtml=`
                    <div>${anChangTuiJian[0].name+' '+anChangTuiJian[0].mobile}</div>
                    <div>
                        <div id="cancel">取消</div>
                        <div id="call"><a href="tel:${anChangTuiJian[0].mobile}">呼叫</a></div>
                    </div>
                    `;
                    $('.phoneToast').html(consultHtml);
                    //咨询项目取消
                    $('#cancel').on('click',function () {
                        $('.phoneModal').fadeOut();
                    });
                }else{
                    hasConsult=false;
                }
            },
            error:function () {
                showTips('请求失败');
            }
        });
    }
    //猜你喜欢
    function guess() {
        $.ajax({
            url:floorUrl+'Project/getproject',
            type:'post',
            data:{
                type:1,// 同区位楼盘列表
                memberId:memberId,//	是	string	经纪人id
                pageSize:20,//	是	string	每页显示数
                pageNum:0,//	是	string	当前页
            },
            success:function (data) {
                var projectInf=data.projectInf;//猜你喜欢数据
                if(projectInf.length){
                    var projectInfHtml='';
                    $.each(projectInf,function (i) {
                        if(!projectInf[i].propertyName){
                            projectInf[i].propertyName='';
                        }
                        if(projectInf[i].averagePrice==null){
                            projectInf[i].averagePrice='';
                        }
                        if(!projectInf[i].cityName){
                            projectInf[i].cityName='';
                        }
                        if(!projectInf[i].boroughName){
                            projectInf[i].boroughName='';
                        }
                        if(projectInf[i].commissionMoney==null){
                            projectInf[i].commissionMoney='';
                        }
                        projectInfHtml+=`
                        <ul id="${projectInf[i].id}" class="${projectInf[i].qianYue}">
                           <li>
                               <img src="${!projectInf[i].mainPic?initImg:imgUrl+projectInf[i].mainPic}" alt=""/>
                               <p>${projectInf[i].propertyName}</p>
                           </li>
                           <li>${projectInf[i].averagePrice}元/㎡·${projectInf[i].cityName+projectInf[i].boroughName}</li>
                           <li class="useType">佣金:${projectInf[i].commissionMoney}</li>
                        </ul>
                        `;
                    });
                    $('#guess>.lists').html(projectInfHtml);
                    if(userType!=2){
                        $('#guess .useType').hide();
                    }
                    //楼盘列表事件
                    $('#guess>.lists').on('click','ul',function () {
                        propertyId=$(this).attr('id');
                        sign=$(this).attr('class');
                        PostData(weixinUrl+"weixin/member/demo.html", {url:window.location.href}, weixin);
                        $("html,body").animate({scrollTop:0}, 500);
                    });
                }else{
                    $('#guess>.lists').html(noDataHtml);
                }
            },
            error:function () {
                showTips('请求失败');
            }
        });
    }
    guess();
    //页面底部报备页面跳转
    $('#floorDetail>footer').on('click','.myReport',function () {//我的报备

        if(userType==2){//经纪人
            $(location).attr('href','../weixin2/pages/client-index.jsp');
        }else{
            $('.fhmModal').fadeIn();
            var consultHtml=`
                    <div>您还没有绑定分行码</div>
                    <div>
                        <div class="cancel">算了</div>
                        <div class="call">立即绑定</div>
                    </div>
                    `;
            $('.fhmToast').html(consultHtml);
            //取消
            $('.cancel').on('click',function () {
                $('.fhmModal').fadeOut();
            });
            $('.call').on('click',function () {
                $(location).attr('href','../login/login.jsp?member=1');
            });
            return;
        }
    })
        .on('click','.poster',function () {//制作海报
            showTips('暂未开放此功能');
        })
        .on('click','.consult',function () {//咨询项目
            if(hasConsult){
                $('.phoneModal').fadeIn();
            }else{
                $('.phoneModal').fadeOut();
                showTips('无相关信息');
            }
        });
    $('#report').on('click',function () {
        if(userType==2){//经纪人
            $(location).attr('href',"../weixin2/pages/add-reserve-client.jsp?"+propertyId+ "$" +encodeURI(propertyName));
        }else{
            $('.fhmModal').fadeIn();
            var consultHtml=`
                    <div>您还没有绑定分行码</div>
                    <div>
                        <div class="cancel">算了</div>
                        <div class="call">立即绑定</div>
                    </div>
                    `;
            $('.fhmToast').html(consultHtml);
            //取消
            $('.cancel').on('click',function () {
                $('.fhmModal').fadeOut();
            });
            $('.call').on('click',function () {
                $(location).attr('href','../login/login.jsp?member=1');
            });
            return;
        }
    });
});