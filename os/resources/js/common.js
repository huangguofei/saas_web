// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"w": "日一二三四五六".charAt(this.getDay()), //星期
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
Date.prototype.addDay = function(value) {
	return new Date(this.setDate(this.getDate() + value));
}
Date.prototype.addMonth = function(value) {
	return new Date(this.setMonth(this.getMonth() + value));
}
Date.prototype.addHour = function(value) {
	return new Date(this.setHours(this.getHours() + value));
}

/*
*  方法:Array.remove(val)
*  功能:根据元素值删除数组元素.
*  参数:元素值
*  返回:在原数组上修改数组
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return i;
        }
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
*/

function removeArray(array, val) {
	var index = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i] == val) {
			index = i;
			break;
		}
	}
	if (index >= 0) {
		array.splice(index, 1);
	}
}

//url 参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

//默认图片设置
var defImgPath = "/Resources/Images/def.jpg";

function SetDefImg(obj) {
	$(obj).attr("src", defImgPath);
}

//自定义Ajax提交
var currAjaxIsPosting = false;

function CustomAjax(url, data, successcallback, btn) {
	if (currAjaxIsPosting) {
		return;
	}
	var oldBtnValue = $(btn).val();

	$(btn).val("提交中...");

	currAjaxIsPosting = true;
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		success: function(response) {
			currAjaxIsPosting = false;
			$(btn).val(oldBtnValue);
			if (successcallback)
				successcallback(response);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$(btn).val(oldBtnValue);
			currAjaxIsPosting = false;
			alert("错误代码：" + textStatus);
		}
	});
}

//Grid Pager icons replace
function updatePagerIcons(table) {
	var replacement = {
		'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
		'ui-icon-seek-prev': 'icon-angle-left bigger-140',
		'ui-icon-seek-next': 'icon-angle-right bigger-140',
		'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
	};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function() {
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
	})
}
//添加表格底部左侧菜单
function bindGridFooterLeftButtons() {
	var gridfootercontainer = $("#grid-footer-container");
	if (gridfootercontainer) {
		$("#grid-pager_left").append($(gridfootercontainer).html());
		$(gridfootercontainer).html("");
	}
}

//表单输入验证
function inputValidation(container) {
	container = container || $("body");
	//tiptemplate = tiptemplate || "请录入{0}。";
	var inputRes = true;
	$(container).find("[nulltip]").each(function() {
		var resSet = setErrorLabelAfterInput4Validation(this);
		inputRes = inputRes ? resSet : false;
		$(this).unbind("blur").blur(function() {
			setErrorLabelAfterInput4Validation(this);
		});
	});
	return inputRes;
}

function setErrorLabelAfterInput4Validation(obj) {
	var cValue = $(obj).val();
	var cTip = $(obj).attr("nulltip");
	var hasError = $(obj).parent().hasClass("has-error");
	if (!cValue) {
		if (!hasError) {
			$(obj).parent().addClass("has-error");
			$(obj).after("<span class=\"label-error\">请录入" + cTip + "</span>");
			//$.modal().alert(tiptemplate.replace("{0}", cTip));
		}

		//inputRes = false;
		return false;
	} else {
		if (hasError) {
			$(obj).parent().removeClass("has-error");
			$(obj).parent().find(".label-error").remove();
		}
	}

	return true;
}

//QueryString to Object
(function($) {
	//获取 url 参数值
	$.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	};
	//获取 url 参数对象
	$.getQueryObject = function(url) {
		url = url == null ? window.location.href : url;
		var search = url.substring(url.lastIndexOf("?") + 1);
		var obj = {};
		var reg = /([^?&=]+)=([^?&=]*)/g;
		search.replace(reg, function(rs, $1, $2) {
			var name = decodeURIComponent($1);
			var val = decodeURIComponent($2);
			val = String(val);
			obj[name] = val;
			return rs;
		});
		return obj;
	};
	//对象转 url 参数
	$.toQueryString = function(obj) {
		if (!obj) {
			return "";
		}
		var resQS = "";
		for (p in obj) {
			if (p) {
				resQS += "&" + p + "=" + obj[p];
			}
		}
		resQS = resQS || "&";
		//resQS += "&ts=" + (new Date()).getTime(); ;
		return resQS.substring(1);
	};
	//提示成功（绿色）
	$.showSuccessGritter = function(text, option) {
		var gOption = {
			title: "",
			text: text,
			time: 2000,
			position: "top-right",
			class_name: "gritter-success"
		};
		if (option) {
			gOption = $.extend({}, gOption, option);
		}
		$.gritter.add(gOption);
	};
	//提示错误（红色）
	$.showErrorGritter = function(text, option) {
		var gOption = {
			title: "",
			text: text,
			time: 3000,
			position: "top-right",
			class_name: "gritter-error"
		};
		if (option) {
			gOption = $.extend({}, gOption, option);
		}
		$.gritter.add(gOption);
	};
	//模态框（无按钮）
	var modalIdNo = 0;
	$.modal = function() {
		modalIdNo++;
		var modalId = "cModal" + modalIdNo;
		var modalDoc = $("<div id=\"" + modalId + "\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog modal-sm\" style=\"margin-top:" + ($(document).height() / 4) + "px;\"></div></div>");
		var modalContentDoc = $("<div class=\"modal-content\"></div>");
		var modalHeaderDoc = $("<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">系统提示</h4></div>");
		var modalBodyDoc = $("<div class=\"modal-body\"></div>");
		$(modalContentDoc).append(modalHeaderDoc);
		$(modalContentDoc).append(modalBodyDoc);
		$(modalDoc).find(".modal-dialog").append(modalContentDoc);
		$("body").append(modalDoc);
		//destroy
		$(modalDoc).on('hidden.bs.modal', function(e) {
			$(this).remove();
		});

		modalDoc.alert = function(text) {
			$(this).find(".modal-body").text(text);
			$(this).modal('show');
		};
		modalDoc.confirm = function(text, okcallback, cancelcallback) {
			var modalFooterDoc = $("<div class=\"modal-footer\"></div>");
			var modelBtnOk = $("<button type=\"button\" class=\"btn btn-sm btn-primary\" data-dismiss=\"modal\"> &nbsp;&nbsp;确 定&nbsp;&nbsp; </button>");
			$(modelBtnOk).click(function() {
				if (okcallback) {
					okcallback.call(this, null);
				}
			});
			$(modalFooterDoc).append(modelBtnOk);
			var modelBtnCancel = $("<button type=\"button\" class=\"btn btn-sm btn-default\" data-dismiss=\"modal\"> &nbsp;&nbsp;取 消&nbsp;&nbsp; </button>");
			$(modelBtnCancel).click(function() {
				if (cancelcallback) {
					cancelcallback.call(this, null);
				}
			});
			$(modalFooterDoc).append(modelBtnCancel);
			$(this).find(".modal-content").append(modalFooterDoc);
			$(this).find(".modal-body").text(text);
			//remove header
			$(this).find(".modal-header").remove();

			$(this).modal('show');
		};
		modalDoc.remote = function(title, path) {
			$(this).find(".modal-dialog").removeClass("modal-sm");
			$(this).find(".modal-title").text(title + " （正在打开...）");
			$(this).find(".modal-body").append("<iframe frameborder=\"0\" width=\"100%\" height=\"500\" scrolling=\"auto\" src=\"" + path + "\"></iframe>");
			$(this).modal('show');
			var cModal = $(this);
			$(cModal).find(".modal-body iframe").on("load", function() {
				$(cModal).find(".modal-title").text(title);
			});
		};

		return modalDoc;
	};
})(jQuery);