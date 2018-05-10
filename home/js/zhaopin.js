function GetUrlParms() {
    var args = new Object();
    var query = location.search.substring(1);//获取查询串
    var pairs = query.split("&");//在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');//查找name=value
        if (pos == -1) return;//如果没有找到就跳过
        var argname = pairs[i].substring(0, pos);//提取name
        var value = pairs[i].substring(pos + 1);//提取value
        args[argname] = decodeURI(value);//存为属性
    }
    return args;
}

var popLayer = {
    option: {},
    init: function (option) {
        this.initOptions(option);
        this.initElement();
        this.ensuer_Func();
        this.cancel_Func();
    },
    initOptions: function (option) {
        this.option = option;
    },
    closeLayer: function () {
        document.getElementsByClassName("j-pop1")[0].parentNode.removeChild(document.getElementsByClassName("j-pop1")[0]);
    },
    ensuer_Func: function () {
        var _this = this;
        document.getElementsByClassName("ensuer")[0].onclick = function () {
            return _this.option.ensuerFunc();
        };
    },
    cancel_Func: function () {
        var _this = this;
        document.getElementsByClassName("cancel")[0].onclick = function () {
            return _this.option.cancelFunc();
        };
    },
    initElement: function () {
        var ele = "<div style='display: table-cell;vertical-align: middle;text-align: center'>" +
            "<div class='j-pop-cont'>" +
            "<div class='j-pop-cont-detail'>" +
            "<div class='j-pop-txt'>" +
            "<span class='text'>" + this.option.text + "</span>" +
            "</div>" +
            "</div>" +
            "<div class='j-pop-btn'>" +
            "<span class='cancel' style='display: " + (this.option.showCancel === false ? "none" : "") + "'>" +
            this.option.cancelText + "</span>" + "<span class='ensuer'>" + this.option.ensuerText + "</span>" +
            "</div>" +
            "</div>" +
            "</div>";
        var createElement = document.createElement("div");
        createElement.className = "j-pop1";
        createElement.innerHTML = ele;
        document.body.appendChild(createElement);
    },
};
var BallWithTime = {
    option: {},
    init: function (option) {
        this.initOptions(option);
        this.initElement();
        this.closeLayer();
    },
    initOptions: function (option) {
        this.option = option
    },
    initElement: function () {
        var ele = "<div style='display: table-cell;vertical-align: middle;text-align: center'>" +
            "<div class='j-pop-cont'>" +
            "<div class='j-pop-cont-detail'>" +
            "<div class='j-pop-txt'>" +
            "<span class='text'>" + this.option.text + "</span>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        var createElement = document.createElement("div");
        createElement.className = "j-pop1";
        createElement.innerHTML = ele;
        document.body.appendChild(createElement);
    },
    closeLayer: function () {
        setTimeout(function () {
            document.getElementsByClassName("j-pop1")[0].parentNode.removeChild(document.getElementsByClassName("j-pop1")[0]);
        }, this.option.delay || 1500)
    }
};
var flag = true;
var getcity = function (data) {
    var data = data.cityname;
    var city_lists = [];
    for (var i = 0, l = data.length; i < l; i++) {
        var city_list = "<option value='" + data[i]["ID"] + "'>" + data[i]["CityName"] + "</option>";
        city_lists.push(city_list)
    }
    city_lists.unshift("<option>市</option>");
    city_lists = city_lists.join("");
    document.getElementById("AreaCityID").innerHTML = city_lists;
};
var getBorough = function (data) {
    var data = data.Borough;
    var city_lists = [];
    for (var i = 0, l = data.length; i < l; i++) {
        var city_list = "<option value='" + data[i]["AreaBoroughId"] + "'>" + data[i]["BoroughName"] + "</option>";
        city_lists.push(city_list)
    }
    city_lists.unshift("<option>区</option>");
    city_lists = city_lists.join("");
    document.getElementById("AreaBoroughid").innerHTML = city_lists;
};
var getPlate = function (data) {
    var data = data.Plate;
    var city_lists = [];
    for (var i = 0, l = data.length; i < l; i++) {
        var city_list = "<option value='" + data[i]["PlateId"] + "'>" + data[i]["PlateName"] + "</option>";
        city_lists.push(city_list)
    }
    city_lists.unshift("<option>板块</option>");
    city_lists = city_lists.join("");
    document.getElementById("PlateId").innerHTML = city_lists;
};
var testEmail = function (email) {
    var reg = /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(email)
};
var SendmailforZP = function (data) {
    $("#SendmailforZP").hide();
    if (data.status === "success") {
        $("#result_success").show();
    } else {
        $("#result_faile").show();
    }
};
var ensuerFunc = function () {
    popLayer.closeLayer();
};
var cancelFunc = function () {
    flag = false;
    popLayer.closeLayer();
};
var zhaopin = function (data) {
    console.log(data)
};

function $ajax(url, data, callBack) {
    $.ajax({
        type: "POST",
        url: rootURL + url,
        data: data,
        dataType: "json",
        success: function (data) {
            // alert(JSON.stringify(data));
            callBack(data)
        },
        error: function (error) {
            // alert(JSON.stringify(error));
            console.log(error);
        }
    });
}

// 独享岗位
document.getElementById("IsShare").onclick = function () {
    if (this.checked && flag) {
        var layerOptions = {
            text: "已开启！应聘者的简历只会发到您的邮箱！",
            showCancel: true,
            ensuerFunc: ensuerFunc,
            cancelFunc: cancelFunc,
            ensuerText: "好的",
            cancelText: "不再提醒"
        };
        popLayer.init(layerOptions);
    }
};
//选择市 初始化区
document.getElementById("AreaCityID").onchange = function () {
    if (this.value != "市") {
        $ajax("Project/getBorough", {CityID: this.value}, getBorough);
    } else {
        document.getElementById("AreaBoroughid").innerHTML = "<option>区</option>";
    }
};
//选择区 初始话板块
document.getElementById("AreaBoroughid").onchange = function () {
    if (this.value != "区") {
        $ajax("Project/getPlate", {BoroughID: this.value}, getPlate);
    } else {
        document.getElementById("AreaBoroughid").innerHTML = "<option>板块</option>";
    }
};
document.getElementsByClassName("button-next")[0].onclick = function () {
    this.parentNode.style.display = "none";
    document.getElementById("SendmailforZP").style.display = "";
};
$(function () {
    // 初始化市
    $ajax("Project/getcity", {}, getcity);
});
//提交
$(".submit").on("click", function () {
    if (!$("#Number").val()) {
        BallWithTime.init({text: "请输入人数"});
        return
    }
    if ($("#AreaCityID").val() === "市") {
        BallWithTime.init({text: "请选择城市"});
        return
    }
    if ($("#AreaBoroughid").val() === "区") {
        BallWithTime.init({text: "请选择区域"});
        return
    }
    if ($("#PlateId").val() === "板块") {
        BallWithTime.init({text: "请选择板块"});
        return
    }
    if (!testEmail($("#Email").val())) {
        BallWithTime.init({text: "请输入有效的邮件地址"});
        return
    }
    var text = $("#AreaCityID option:selected").html() + $("#AreaBoroughid option:selected").html() +
        $("#PlateId option:selected").html() + "、" +
        $("#IsManager option:selected").html() + "、" + $("#Number").val() + "人、" +
        ($("#IsShare").prop("checked") ? "独享、" : "不独享、") + ($("#IsReservation").prop("checked") ? "代约" : "不代约");
    var text_json = {
        MemberID: GetUrlParms().memberID,
        AreaCityID: $("#AreaCityID").val(),
        AreaBoroughid: $("#AreaBoroughid").val(),
        IsManager: $("#IsManager").val(),
        Number: $("#Number").val(),
        AreaPlateID: $("#PlateId").val(),
        Address: $("#Address").val(),
        Email: $("#Email").val(),
        IsShare: $("#IsShare").prop("checked") ? "1" : "0",
        IsReservation: $("#IsReservation").prop("checked") ? "1" : "0",
    };
    $ajax("Project/zhaopin", text_json, zhaopin);
    $ajax("login/SendmailforZP", {
        text: text,
        memberId: GetUrlParms().memberID,
        Email: $("#Email").val()
    }, SendmailforZP);
});

document.getElementById("Number").oninput = function () {
    this.value = parseInt(this.value)
};