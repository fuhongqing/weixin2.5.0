    <%@ page pageEncoding="utf-8" %>
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>易招聘</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <link href="http://www.ehaofang.com/img/ef.ico" type="image/x-icon" rel="icon">
    <link href="http://www.ehaofang.com/img/ef.ico" type="image/x-icon" rel="shortcut icon">
    <link rel="stylesheet" href="less/zhaopin.css">
    <style>
        #cnzz_stat_icon_1273316153 a{
            display: none;
        }
    </style>
    <script src="js/setting.js?v=201804090937"></script>
    <script src="static/fastclick.js?v=201804090937"></script>
</head>
<body>
<div class="header">
    <div class="title">易招聘</div>
    <div class="back" onclick="history.go(-1)">
    </div>
</div>
<div class="bg">
    <div class="button-next">立即申请</div>
</div>
<div class="container" style="display: none" id="SendmailforZP">
    <form>
        <div class="content">
            <div class="input-group">
                <div class="input-group-box">
                    <label>职级：</label>
                    <select name="IsManager" class="input-group-input" id="IsManager">
                        <option value="0">销售顾问</option>
                        <option value="1">分行店长</option>
                        <option value="2">分行经理</option>
                        <option value="3">公司高管</option>
                        <option value="4">其他职位</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <div class="input-group-box">
                    <label>人数</label>
                    <input name="Number" type="number" class="input-group-input" id="Number" step="1" min="1">
                </div>
            </div>
            <div class="input-group">
                <div class="input-group-box">
                    <label>上班地区：</label>
                    <select name="AreaBoroughid" class="input-group-input width50" id="PlateId">
                        <option>板块</option>
                    </select>
                    <select name="AreaBoroughid" class="input-group-input width50" id="AreaBoroughid">
                        <option>区</option>
                    </select>
                    <select name="AreaCityID" class="input-group-input width50" id="AreaCityID">
                    </select>
                </div>
            </div>
            <div class="input-group">
                <div class="input-group-box">
                    <label>详细地址：</label>
                    <input type="text" name="Address" class="input-group-input" placeholder="非必填" id="Address">
                </div>
            </div>
            <div class="input-group">
                <div class="input-group-box">
                    <label>简历接收邮箱：</label>
                    <input type="email" name="Email" class="input-group-input" id="Email">
                </div>
            </div>
        </div>
        <div class="content">
            <div class="input-group">
                <div class="input-group-box">
                    <input type="checkbox" id="IsShare" class="input-group-input" name="IsShare">
                    <label for="IsShare" class="input-group-label"><span>独享岗位：</span><i></i></label>
                </div>
            </div>
            <div class="input-group">
                <div class="input-group-box">
                    <input id="IsReservation" type="checkbox" class="input-group-input" name="IsReservation">
                    <label for="IsReservation" class="input-group-label"><span>代约面试：</span><i></i></label>
                </div>
            </div>
        </div>
    </form>
    <div class="button submit">提交</div>
</div>
<div class="container" style="display: none;text-align: center" id="result_success">
    <img src="img/img_success.png" alt="" style="width: 2.3rem;margin-top: 60px;margin-bottom: 20px;">
    <p style="font-size: .8rem;margin-top: 0">提交成功</p>
    <button class="button" onclick="window.history.go(-1)"
            style="width: 12rem;height: 2.3rem;line-height: 2.3rem;margin: 0 auto;" id="to_index">返回首页
    </button>
</div>
<div class="container" style="display: none;text-align: center" id="result_faile">
    <img src="img/img_failed.png" alt="" style="width: 2.3rem;margin-top: 60px;margin-bottom: 20px;">
    <p style="font-size: .8rem;margin-top: 0">操作失败！</p>
    <div class="button" style="width: 12rem;height: 2.3rem;line-height: 2.3rem;margin: 0 auto;"
         onclick="document.getElementById('result_faile').style.display='none';document.getElementById('SendmailforZP').style.display='block'">
        重新填写
    </div>
</div>
<script src="static/jquery.min.js"></script>
<script src="js/zhaopin.js?v=201804121244" charset="UTF-8" type="text/javascript"></script>
<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1273316153'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s22.cnzz.com/z_stat.php%3Fid%3D1273316153' type='text/javascript'%3E%3C/script%3E"));</script>
</body>
</html>