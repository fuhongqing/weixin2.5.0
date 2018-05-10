$(function () {
    localStorage.setItem('wxOpenId',weixinOpenId);
    localStorage.setItem('wxUnionId',weixinunionId);
    //根字体大小设置
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px';
    //接收来自楼盘首页绑定分行码的参数
    var member=location.search.slice(8);//member
    var //initUrl='http://weixintest.ehaofang.com/efapp2/',//公众号测试
        initUrl='http://agent2.ehaofang.com/efapp2/',//公众号
        userType,//游客或节经纪人
        jobNum=4,//职位选择时序号
        mobilePhone='',//手机号
        memberId,//经纪人id
        branchId,//分行id
        parentId;//公司id
    //绑定手机返回公众号
    $('#title').on('click','.back',function () {
        history.back();
    });
    //输入框聚焦
    $('#indexPage input').focus(function(){
        //$('#indexPage').animate({'top':'-1.68rem'},500);
        $('#indexPage>header').hide(500);
        $('#title').show(500);
    });
    $('#pnm>input').focus(function(){
        $('#pnm>img').show().click(function () {
            $('#pnm>input').val('');
        });
        $('#pnm>span').show();
    });
    $('#pnm').on('click','span',function(){//获取验证码
        mobilePhone=$('#pnm>input').val();
        if(!(/^1[3456789]\d{9}$/.test(mobilePhone))){
            showTips("手机号无效");
            return;
        }else{
            getRegNum(mobilePhone);
        }
    });
    //职位选择，点击展示选择框
    $('#myJob').on('click',function () {
        $('.jobModal').fadeIn();
    });
    $('.topDiv').on('click','li:not(.title)',function () {
        $(this).addClass('liActive').children('img').show().end().siblings().removeClass('liActive').children('img').hide();
        $('#myJob>span').html($(this).children('span').html()).css('color','#000');
        jobNum=parseFloat($(this).attr('class'));
    });
    //点击非目标区域，弹框隐藏
    $(document).click(function(e){
        var _con=$('#myJob,.title');//设置目标区域
        if(!_con.is(e.target)&&_con.has(e.target).length==0){
            $('.jobModal').hide();
        }
    });
    $('.page_next>header').on('click','.back',function () {
        pageStatus(0);
		$('#login').click(function () {
             phoneInvalid();
        });
    });
    //填写分行码
    function branchCode() {
        var branchCode=$('#branchCode').val();
        var thisPageUrl=localStorage.getItem('pageUrl');
        var thisMemberId=localStorage.getItem('member');
        if(!branchCode){
            showTips('分行码不能为空');
            return;
        }else{
            $.ajax({//分行码查分行
                url: initUrl + 'login/branchcode',
                type: 'post',
                data: {
                    branchcode:branchCode
                },
                success: function (data) {
                    if(data.status=='success'){
                        branchId=data.info.ID;//分行id
                        parentId=data.info.ParentID;//公司id
                        $.ajax({//更新经纪人公司id 分行id接口
                            url:initUrl+'login/registerBranchCode',
                            type:'post',
                            data:{
                                weixinunionid:weixinunionId,//	是	string	微信授权用户唯一标识id //用户的唯一标识
                                branchID:branchId,//	是	string	分行ID
                                parentID:parentId,//	是	string	公司ID
                                memberId:thisMemberId//	是	string	经纪人ID
                            },
                            success:function (data) {
                                if(data.status=='success'){
                                    $(location).attr('href',thisPageUrl);//跳转
                                }else{
                                    showTips('朋友，我偶感不适，建议使用易好房经纪APP');
                                    return;
                                }
                            },
                            error:function () {
                                showTips('绑定失败');
                            }
                        });
                    }else{
                        showTips(data.info||'无相关分行信息');
                        return;
                    }
                },
                error: function () {
                    showTips('请求失败了');
                }
            });
        }
    }
    //提示框显示
    function showTips(text) {
        $('.modal').fadeIn();
        $('.toast').html(text);
        setTimeout(function () {
            $('.modal').fadeOut();
        },1000)
    }
    //创建函数用来标识页面的状态
    function pageStatus(t) {
        switch (t) {
            case 0://验证手机
                $('#indexPage').show();
                $('.page_next').hide();
                //清空输入框数据
                $('#pnm>input').val('');
                $('#pnm>img').hide();
                $('#pnm>span').hide();
                $('#pwd>input').val('');
                break;
            case 1://page_next完善信息页面
                $('#indexPage').hide();
                $('.page_next').show();
                $('#next').html('下一步');
                $('#ignore').css('visibility','hidden');//跳过 不显示
                $('.page_next>footer').hide();
                $('.page_next>section>.container').show();//信息表单
                $('.page_next>section>.row').hide();//分行码输入框
                break;
            case 2://分行码页面
                $('#indexPage').hide();
                $('.page_next').show();
                $('#ignore').css('visibility','visible');
                $('.page_next>footer').show();
                $('.page_next>header>.back').hide();//返回图标隐藏
                $('.page_next>header>.center').html('绑定分行码');
                $('.page_next>section>.container').hide();//信息表单
                $('.page_next>section>.row').show();//分行码输入框
                $('#next').html('完成');
                break;
            default:
                break;
        }
    }
    //获取验证码
    function getRegNum(phone) {
        $.ajax({
            url:initUrl+'login/newGetcode',
            type:'post',
            data:{
                mobilephone:phone
            },
            success:function (data) {
                var self='#pnm>span';
                showTips('验证码已发送');
                var time=60;
                var timeReg=setInterval(function () {
                    time--;
                    $(self).html(time+'s后可重发');
                    if(time<=0){
                        clearInterval(timeReg);
                        timeReg=null;
                        $(self).html('重新获取验证码');
                    }
                },1000);
            },
            error:function (data) {
                showTips('请求失败了');
            }
        });
    }
    //验证手机
    function phoneInvalid() {
        var curCode=$('#pwd>input').val();
        $.ajax({//验证手机验证码
            url:initUrl+'login/newClickcode',
            type:'post',
            data:{
                mobilephone:mobilePhone,
                code:curCode
            },
            success:function (data) {
                if(data.status=='match'){
                    $.ajax({//验证手机是否已存在
                        url:initUrl+'login/isHaveMobilephone',
                        type:'post',
                        data:{
                            mobilephone:mobilePhone
                        },
                        success:function (data) {
                            if(data.status=='success'&&data.data==0){//无
                                pageStatus(1);//完善信息
								$('#next').click(function () {
									if($(this).html()=='下一步'){
										perfect();
									} 
                                });
                            }else{
                                $.ajax({//手机号与微信关联
                                    url:initUrl+'login/mobileLogin',
                                    type:'post',
                                    data:{
                                        mobilephone:mobilePhone,//	是	string	手机
                                        weixinOpenId:weixinOpenId,//	否	string	微信openid 网站页面的openID //网站页面必须参数 app端不需要填
                                        weixinunionid:weixinunionId//	是	string	微信授权用户唯一标识id //用户的唯一标识
                                    },
                                    success:function (data) {
                                        if(data.status=='success'){
                                            memberId=data.data.ID;
                                            pageStatus(2);//分行码页面
                                            $('#ignore').click(function () {
                                                $(location).attr('href','../weixin2/pages/index.jsp');//跳转楼盘首页
                                            });
                                            $('#next').click(function () {
												if($(this).html()=='完成'){
												   branchCode();
												}
											});

                                        }else{
                                            return;
                                        }
                                    },
                                    error:function () {
                                        showTips('请求失败');
                                    }
                                });
                            }
                        },
                        error:function () {
                            showTips('请求失败')
                        }
                    });
                }else if(data.status=='failure'||data.status=='nomatch'){
                    showTips('验证码错误');
                    return;
                }else if(data.status=='Invalid'){
                    showTips('验证码失效');
                    return;
                }else{
                    showTips('验证码超时');
                    return;
                }
            },
            error:function () {
                showTips('请求失败');
            }
        });
    }
    
    //page_next完善信息
    function perfect() {
        var isRight=true;//判断填写条件是否符合要求
        var realName=$('#realName>input').val();
        var pwd=$('#setPwd>input').val();
        var confirmPwd=$('#confirmPwd>input').val();
        if(realName==''){
            showTips('姓名不能为空');
            isRight=false;
        }
        if($('#myJob>span').html()=='请选择'){
            showTips('职位不能为空');
            isRight=false;
        }
        if(pwd==''){
            showTips('密码不能为空');
            isRight=false;
        }
        if(pwd!=confirmPwd){
            showTips('两次输入密码不同');
            isRight=false;
        }
        if(isRight){
            $.ajax({//注册
                url:initUrl+'login/register_2',
                type:'post',
                data:{
                    name:realName,//	是	string	用户名
                    mobilephone:mobilePhone,//	是	string	手机号
                    password:pwd,//	是	string	用户密码
                    weixinOpenId:weixinOpenId,//	否	string	微信openid 网站页面的openID //网站页面必须参数 app端不需要填
                    weixinunionid:weixinunionId,//	是	string	微信授权用户唯一标识id //用户的唯一标识
                    isManager:jobNum//	是	string	[‘0’,’销售顾问’],[‘1’,’分行店长’],[‘2’,’分行经理’],[‘3’,’公司高管’],[‘4’,’其他职位’]
                },
                success:function (data) {
                    showTips(data.data||data.info);
                    if(data.status=='success'){
                        pageStatus(2);//分行码页面
                        $('#ignore').click(function () {
                            $(location).attr('href','../weixin2/pages/index.jsp');//跳转楼盘首页
                        });
                        $('#next').click(function () {
                            if($(this).html()=='完成'){
                                branchCode();
                            }
                        });

                    }else{
                        return;
                    }
                },
                error:function () {
                    showTips('请求失败')
                }
            });
        }else{
            return;
        }
    }
    
    if(member==1){
        pageStatus(2);//跳到分行码
        $('#ignore').click(function () {
            $(location).attr('href','../weixin2/pages/index.jsp');//跳转楼盘首页
        });
        $('#next').click(function () {
            if($(this).html()=='完成'){
                branchCode();
            }
        });

        return;
    }
    //微信登录
    function weixinLogin(url) {
        $.ajax({
            url:initUrl+'login/weixinLogin_2',
            type:'post',
            data:{
                weixinOpenId:weixinOpenId,//	否	string	微信openid 网站页面的openID //网站页面必须参数 app端不需要填
                weixinunionid:weixinunionId,//	是	string	微信授权用户唯一标识id //用户的唯一标识
                type:2//	是	string	为1时，手机App登录; 为2时，网页端登录
            },
            success:function (data) {
                if(data.status=='success'){
                    memberId=data.data.ID;
                    userType=data.data.UserType;
                    localStorage.setItem('member',memberId);
                    localStorage.setItem('pageUrl',pageUrl);
                    localStorage.setItem('userType',userType);
                    if(userType==2){
                        $(location).attr('href',url);//跳转页
                    }else{
                        pageStatus(2);
                        $('#ignore').click(function () {
                            $(location).attr('href','../weixin2/pages/index.jsp');//跳转楼盘首页
                        });
                        $('#next').click(function () {
                            if($(this).html()=='完成'){
                                branchCode();
                            }
						});
                    }
                }else{
                    pageStatus(0);//验证手机页面显示，进入
                    $('#login').click(function () {
                        phoneInvalid();
                    });
                }
            },
            error:function () {
                showTips('请求失败');
            }
        });
    }
    weixinLogin(pageUrl);
});