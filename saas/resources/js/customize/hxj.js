//比较两个时间相差多少天
$.compareTwoTimeDifference = function(smalerTimeStr, largerTimeStr) {
	console.log(arguments);
	try {
		var smalerTime = new Date(smalerTimeStr.replace(/-/g, "/"));
		var largerTime = new Date(largerTimeStr.replace(/-/g, "/"));
	} catch(e) {
		var smalerTime = new Date(smalerTimeStr);
		var largerTime = new Date(largerTimeStr);
	}
	return(Math.ceil(smalerTime.getTime() / (24 * 60 * 60 * 1000)) - Math.ceil(largerTime.getTime() / (24 * 60 * 60 * 1000)));
};

//时间比较   当前时间是否大于传入    是返回true  
$.isLargerThanCurrTime = function(time) {
	var now = (new Date()).getTime();
	try {
		var compareTime = (new Date(time.replace(/-/g, "/"))).getTime();
	} catch(e) {
		var compareTime = (new Date(time)).getTime();
	}
	return compareTime >= now ? true : false;
};

////鼠标移入移出  加/减  class
function bindTransBackgroundEvent(selector, className, shortJs) {
	$(selector).unbind("mouseover").mouseover(function(e) {
		e.stopPropagation();
		//if(shortJs) eval(shortJs);
		$(selector).each(function() {
			$(this).removeClass(className);
		});
		$(this).addClass(className);
	});
	$(selector).unbind("mouseout").mouseout(function(e) {
		e.stopPropagation();
		//if(shortJs) eval(shortJs);
		$(this).removeClass(className);
	});

}

//全选按钮事件绑定
function bindSelectAllBtn(clickBtnSelector, beenSelectSelector) {
	////这种方式绑定需要找多个元素不能传$(xxx),$(xxx)只能传过来一个元素，只能传选择器
	/*var inputs = document.getElementsByClassName("email-checkbox");
				 //document.getElementsByClassName("email-checkbox")[0].style.color="red";
				if($(this).attr("checked") == "true") {
					//取消全选
					$(".receive-Email-detail input[name='email-checkbox']").prop("checked",false);
				} else {
					//全选
					$(".receive-Email-detail input[name='email-checkbox']").prop("checked",true);
					//$(".receive-Email-detail input[name='email-checkbox']").attr("checked","checked");
				}*/
	$(clickBtnSelector).unbind("click").click(function() {
		if($(this).is(":checked")) {
			$(beenSelectSelector).prop("checked", true);
		} else {
			$(beenSelectSelector).removeProp("checked");
		}
	});
}
//部门树的封装
function initDeptTree(options) {
	/*options:
		url,//请求地址   string
		isNeedRightPanel,//是否需要右边的面板  boolean
		linkageType: 0 、不需要联动    
					1、向下联动（勾选父级所有子级选中。一个下级取消勾选，上级取消勾选。所有下级勾选，上级不勾选）
					2、上下联动（勾选父级所有子级选中。一个下级取消勾选，上级取消勾选。所有下级勾选，上级勾选）
		
	* * * */
	var modalContainer =
		"<div class=\"pnl-leader-info pnl-employee-select-share hide\">" +
		"	<form class=\"form-horizontal model-leader-info model-employee-select-share\">" +
		"		<div class=\"wrap wrap-source\">" +
		"			<label>请以部门为单位选择公示范围：</label>" +
		"			<div class=\"box\">" +
		"				<div class=\"py\">" +
		"					<input type=\"text\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
		"					<p>" +
		"						<a class=\"active\">A</a>" +
		"					</p>" +
		"				</div>" +
		"				<ul class=\"list-emp\">" +
		"				</ul>" +
		"			</div>" +
		"			<div class='sel-btn-container'>" +
		"				<a class='select-all'>全选</a>" +
		"				<a class='cancel-all'>取消全选</a>" +
		"			</div>" +
		"		</div>" +
		/*"		<div class=\"wrap seg hide\">"+
		"			<div class=\"box\">"+
		"				<p>"+
		"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>"+
		"				</p>"+
		"				<br>"+
		"				<p>"+
		"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>"+
		"				</p>"+
		"			</div>"+
		"		</div>"+
		"		<div class=\"wrap wrap-new hide\">"+
		"			<label>公示范围：</label>"+
		"			<div class=\"box\">"+
		"				<ul class=\"list-emp\">"+
		"				</ul>"+
		"			</div>"+
		"		</div>"+*/
		"	</form>" +
		"</div>";
	if($("body .pnl-employee-select-share").length) {
		$("body .pnl-employee-select-share").replaceWith(modalContainer);
	} else {
		$("body").append(modalContainer);
	}
	var modalIdOfDeptId = $.modal().show("选择共享范围：", ".pnl-dept-select-share",
		function(modal) {
			var tempSelectDeptArr = [];
			$("#" + options.modalId + " .wrap-new .list-emp").empty();
			if(options.linkageType == 0) {
				$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
					var tmpDeptData = {
						dept_id: $(this).val(),
						dept_name: $(this).data("dept-name"),
						parent_dept_id: $(this).attr("pid")
					}
					//console.log(tmpDeptData)
					if(tmpDeptData) {
						tempSelectDeptArr.push(tmpDeptData);
						//console.log(tempSelectDeptArr)
						if(options.isNeedRightPanel) $("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
					}
				});
			} else {
				$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
					var tmpDeptData = {
						dept_id: $(this).val(),
						dept_name: $(this).data("dept-name"),
						parent_dept_id: $(this).attr("pid")
					}
					var hasAddThis = checkDeptOrParentDeptIsAppendInArr(tempSelectDeptArr, tmpDeptData);
					if(tmpDeptData && !hasAddThis) {
						//console.log(tempSelectDeptArr)
						tempSelectDeptArr.push(tmpDeptData);
						if(options.isNeedRightPanel) $("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
					}
				});
			}
			//console.log(tempSelectDeptArr)
			options.clickCallback(tempSelectDeptArr);
			if(options.callback) options.callback();
			$("#" + modalIdOfDeptId).modal("hide");
		}
	);
	options.modalId = modalIdOfDeptId;
	var tempHtml = "<span class=\"item\" data-dept-id=\"{ID}\" data-dept-name=\"{N}\">{N} <i class=\"fa fa-times icon-close\" onclick=\"$(this).parent().remove();\"></i></span> ";
	if(!options.isNeedRightPanel) {
		$("#" + options.modalId + " .seg").remove();
		$("#" + options.modalId + " .wrap-new").remove();
	}
	if(options.leftTitle) $("#" + options.modalId + " .wrap-source>label").html(options.leftTitle);
	if(options.rightTitle) $("#" + options.modalId + " .wrap-new>label").html(options.rightTitle);
	$.ajaxGet(options.url, function(response) {
		//	console.log(response);
		if(response.code == 0) {
			//success
			var deptList = response.data.rows;
			for(var i in deptList) {
				var deptData = deptList[i];
				deptData.depa_tree_code = deptData.depa_id;
				deptData.parent_depa_tree_code = deptData.depa_parent_id;
			}
			appendDeptTreeNode(deptList, 0, $("#" + options.modalId + " .tree-dept"));
			console.log(options.defaultCheckedIds);

			//加载完成
			$("#" + options.modalId + " .tree-dept label input").click(function() {
				var mchecked = this.checked;
				if(mchecked) {
					if(options.linkageType != 0) {
						if(options.linkageType == 2) {
							isAllThisLevelCheck($(this));
							pDeptCheckAllChildDeptCheck($(this));
						} else {
							pDeptCheckAllChildDeptCheck($(this));
						}
					}
				} else {
					var pid = $(this).attr("pid");
					if(options.linkageType != 0) {
						pDeptCancelCheckAllChildDeptCancelCheck($(this));
						cancelParentChecked(pid);
					}
				}

			});
			if(options.defaultCheckedIds) {
				console.log(options.defaultCheckedIds);
				var defaultCheckedIdsObj = {}; //将数组转为对象
				for(var i in options.defaultCheckedIds) {
					var deptId = options.defaultCheckedIds[i].dept_id || (options.defaultCheckedIds[i].depa_id || options.defaultCheckedIds[i]);
					defaultCheckedIdsObj[deptId] = deptId;
				}
				defaultCheckedIDs(defaultCheckedIdsObj);
			}
			console.log("绑定点击事件")

		} else {
			$.showErrorGritter("加载部门失败：" + response.msg);
		}
	});
	var getEffectiveDeptOfChecked = function(checkboxDom) {
		var childrenAlsoChecked = true;
		$(checkboxDom).parent().parent().find("input").each(function() {
			if(!$(this).is(":checked")) {
				childrenAlsoChecked = false;
				return false;
			}
		});
		if(childrenAlsoChecked) {
			var tmpDeptId = checkboxDom.val();
			var tmpDeptName = checkboxDom.data("dept-name");
			var tmpParentDeptId = checkboxDom.attr("pid");
			return {
				dept_id: tmpDeptId,
				dept_name: tmpDeptName,
				parent_dept_id: tmpParentDeptId
			};
		}
		return null;
	};
	//查找部门的所有父级部门id
	function queryDeptParents(depatId, parentIdsArr) {
		if($("#ck" + depatId).attr("pid") != 0) {
			parentIdsArr.push($("#ck" + depatId).attr("pid"));
			queryDeptParents($("#ck" + depatId).attr("pid"), parentIdsArr)
		}
		return parentIdsArr;
	}

	function checkDeptOrParentDeptIsAppendInArr(deptList, deptData) {
		var isAppend = false;
		//找出该部门所有父级部门的id
		var parentsId = [];
		parentsId = queryDeptParents(deptData.dept_id, parentsId);
		//console.log(parentsId);
		for(var i in deptList) {
			if(deptList[i].dept_id == deptData.dept_id || deptList[i].dept_id == deptData.parent_dept_id ||
				deptData.dept_id.indexOf(deptList[i].dept_id) >= 0) {
				isAppend = true;
				return isAppend;
			}
			for(var n in parentsId) {
				if(parentsId[n] == deptList[i].dept_id) {
					isAppend = true;
					return isAppend;
				}
			}
		}
	};

	function appendDeptTreeNode(deptList, parentId, treeDom) {
		for(var i in deptList) {
			var deptData = deptList[i];
			if(deptData.parent_depa_tree_code == parentId) {
				if(deptData.depa_name == "未分配部门")
					continue;
				var childDepts = queryChildDepts(deptList, deptData.depa_tree_code);
				var hasChildDept = childDepts.length > 0;
				var liDom = $("<li></li>");
				liDom.attr("gid", parentId);
				liDom.data("dept", deptData);
				liDom.append("<label> <input type=\"checkbox\" class='form-control-radio' id=\"ck" + deptData.depa_tree_code +
					"\" pid=\"" + parentId + "\" value='" + deptData.depa_tree_code + "' data-dept-name=\"" + deptData.depa_name + "\"> " + deptData.depa_name + " </label>");
				if(childDepts.length > 0) {
					appendChildDeptTreeNode(deptList, childDepts, deptData.depa_tree_code, liDom);
				}
				$(treeDom).append(liDom);
			}
		}
	};

	function queryChildDepts(deptList, parentId) {
		var resDeptList = [];
		for(var i in deptList) {
			var deptData = deptList[i];
			if(deptData.parent_depa_tree_code == parentId) {
				resDeptList.push(deptData);
			}
		}
		return resDeptList;
	};

	function appendChildDeptTreeNode(deptList, childDepts, parentId, treeDom) {
		var ulDom = $("<ul class='items'></ul>");
		for(var i in childDepts) {
			var deptData = childDepts[i];
			if(deptData) {
				if(deptData.depa_type == 1) {
					continue;
				}
				var mchildDepts = queryChildDepts(deptList, deptData.depa_tree_code);
				var hasChildDept = mchildDepts.length > 0;
				var isZhiWu = deptData.depa_type == 1;
				var liDom = $("<li></li>");
				liDom.attr("gid", parentId);
				liDom.data("dept", deptData);
				liDom.append("<label> <input type=\"checkbox\" class='form-control-radio' id=\"ck" + deptData.depa_tree_code +
					"\" pid=\"" + parentId + "\" value='" + deptData.depa_tree_code + "' data-dept-name=\"" + deptData.depa_name + "\"> " + deptData.depa_name + " </label>");
				$(liDom).find(".btn-dept-delete").remove();
			}
			if(hasChildDept) {
				appendChildDeptTreeNode(deptList, mchildDepts, deptData.depa_tree_code, liDom);
			}
			$(ulDom).append(liDom);
		}
		$(treeDom).append(ulDom);
	};
	//选中父级部门，所有子部门选中      向下联动选中
	function pDeptCheckAllChildDeptCheck(checkBoxDom) {
		//console.log("向下联动选中")
		checkBoxDom.parent().parent().find("input").each(function() {
			$(this).prop("checked", true);
		});
	}
	//取消选中父级部门，所有子部门取消选中      向下联动取消
	function pDeptCancelCheckAllChildDeptCancelCheck(checkBoxDom) {
		//console.log("向下联动取消")
		checkBoxDom.parent().parent().find("input").each(function() {
			$(this).removeAttr("checked");
		});
	}
	//选中时判断所有同级部门是否选中，如果是则选中父级部门  向上联动选中
	function isAllThisLevelCheck(checkBoxDom) {
		//console.log("向上联动选中")
		var isAllThisLevelChecked = true;
		checkBoxDom.parent().parent().parent().find(">li>label>input").each(function() {
			if(!$(this).is(":checked")) {
				isAllThisLevelChecked = false;
				return false;
			}
		});
		if(isAllThisLevelChecked) {
			if(checkBoxDom.attr("pid") != "0") {
				$("#ck" + $(checkBoxDom).attr("pid")).prop("checked", true);
				isAllThisLevelCheck($("#ck" + $(checkBoxDom).attr("pid")))
			}
		}
	}
	//取消选中时寻找父级部门取消选中   向上联动取消
	function cancelParentChecked(pid) {
		//console.log("向上联动取消")
		$("#ck" + pid).removeAttr("checked");
		if($("#ck" + pid).attr("pid")) {
			cancelParentChecked($("#ck" + pid).attr("pid"));
		}
	}
	//将选中的加入到右边 
	function addCheckedToRight(options) {
		$("#" + options.modalId + " .list-emp").find("input").each(function() {
			if($(this).is(":checked")) {}
		});
	}
	//默认选中的部门
	function defaultCheckedIDs(ids) {
		$("#" + options.modalId + " .tree-dept label input").each(function() {
			if(ids[$(this).val()]) {
				//$(this).prop("checked", true);
				console.log("触发点击事件")
				$(this).trigger("click");
				try {
					$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
						var tmpDeptData = {
							dept_id: $(this).val(),
							dept_name: $(this).data("dept-name"),
							parent_dept_id: $(this).attr("pid")
						}
						if(tmpDeptData) {
							if(options.isNeedRightPanel && $("#" + options.modalId + " .wrap-new .list-emp span[data-dept-id='" + tmpDeptData.dept_id + "']").length < 1) $("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
						}
					});
				} catch(e) {
					//TODO handle the exception
				}
			}
		});
	}
}
//分两步选择的部门树的封装
function initDeptTreeOfTwoStep(options) {
	/*options:
		url,//请求地址   string
		areaItems:[
						{
							name: 字段名
							text: 显示的文字
						}
					]
		linkageType: 0 、不需要联动    
					1、向下联动（勾选父级所有子级选中。一个下级取消勾选，上级取消勾选。所有下级勾选，上级不勾选）
					2、上下联动（勾选父级所有子级选中。一个下级取消勾选，上级取消勾选。所有下级勾选，上级勾选）
		
	* * * */
	var modalHeight = options.height || $(window).height() - 250;
	var tempSelectDeptArr = [];
	var deptTreeDom = "";
	deptTreeDom +=
		"<div class=\"pnl-leader-info pnl-dept-select-share hide\">" +
		"	<form class=\"form-horizontal model-leader-info model-dept-select-common\" style='position:relative;'>" +
		"		<div class=\"wrap wrap-source step-panel step-panel-1\">" +
		"			<label>请以部门为单位选择统计范围：</label>" +
		"			<div class=\"box\">" +
		"				<ul class=\"list-emp tree tree-dept\">" +
		"				</ul>" +
		"			</div>" +
		"			<div class='sel-btn-container'>" +
		"				<a class='select-all'>全选</a>" +
		"				<a class='cancel-all'>取消全选</a>" +
		"			</div>" +
		"		</div>" +
		"		<div class=\"wrap wrap-new step-panel step-panel-2 hide\" style='padding: 5px 0px;'>" +
		"			<label>已选择的范围：</label>" +
		"			<div class=\"box\" style='padding-top:10px;'>" +
		"				<ul class=\"list-emp list-dept-select-temp\">" +
		"				</ul>" +
		"			</div>" +
		"			<div class='sel-effective-area-container at'>" +
		"				<br><label class='lt'>请选择规则生效范围：</label>" +
		"				<div class='sel-effective-area'></div>" +
		"			</div>" +
		"			<hr>" +
		"		</div>" +
		"		<div class='steps-btn-container' style='position: absolute;bottom: -50px;left: 30%;'>" +
		"			<a data-curr-step='1' href='javascript:;' class='btn btn-info def-btn-info prev-step steps'>上一步</a>" +
		"			<a data-curr-step='1' href='javascript:;' class='btn btn-danger def-btn-danger next-step-or-compelete steps'>下一步</a>" +
		"			<a class='btn btn-primary def-btn-primary sel-dept-cancel' href='javascript:;'>取消</a>" +
		"		</div>" +
		"	</form>" +
		"</div>";
	if($("body .pnl-dept-select-share").length > 0) {
		$("body .pnl-dept-select-share").replaceWith(deptTreeDom);
	} else {
		$("body").append(deptTreeDom);
	}
	var modalIdOfDeptId = $.modal({
		height: modalHeight,
		width: 600,
		showFooter: false
	}).show("选择部门", ".pnl-dept-select-share",
		function(modal) {
			$("#" + modalIdOfDeptId).modal("hide");
		}
	);
	var tempHtml = "<span class=\"item\" data-dept-id=\"{ID}\" data-dept-name=\"{N}\">{N} <img src='../resources/images/item-close-black-icon.png' data-trans-src='../resources/images/item-close-red-icon.png' onclick=\"deleteThisChecked('" + modalIdOfDeptId + "',this)\"/></span> ";
	$("#" + modalIdOfDeptId + " .modal-body").css("min-height", "469px");
	$("#" + modalIdOfDeptId + " .model-leader-info .wrap-source .box").css("width", "565px").css("height", "370px");
	$("#" + modalIdOfDeptId + " .model-leader-info .wrap-new .box").css("width", "545px").css("height", "300px");
	options.modalId = modalIdOfDeptId;
	//加载规则生效范围
	var areaItemsDom = "";
	//var checkedStyleDom = "<img style='position: absolute;left:-7px;top:12px;width: 30px;' class=\"effective-area-checked\" src=\"../resources/images/yes.png\">";
	for(var i in options.areaItems) {
		areaItemsDom += "<div class='area-view' data-check-repeat='" + (options.areaItems[i].notAllowedRepeat || "") + "' data-area-name='" + options.areaItems[i].name + "' data-area-value='" + options.areaItems[i].value + "'><label><input type='radio' name='sel-area' value='" + options.areaItems[i].value + "' /><span>" + options.areaItems[i].text + "</span></label></div>";
	}
	$("#" + options.modalId + " .sel-effective-area").append(areaItemsDom);
	$("#" + options.modalId + " .sel-effective-area .area-view").unbind("click").click(function() {
		//		$("#" + options.modalId + " .sel-effective-area .area-view").each(function() {
		//			$(this).find("img").remove();
		//		});
		if($(this).attr("data-check-repeat")) {
			for(var i in tempSelectDeptArr) {
				var parentsIdsObject = tempSelectDeptArr[i].parentsIdsObj;
				if(booleanHasParentDeptChecked(tempSelectDeptArr, parentsIdsObject)) {
					$.showErrorGritter("您选择的部门中包含上下级关系，不能选择此生效范围");
					return false;
				}
				continue;
			}
		}
		//$(this).html(checkedStyleDom + $(this).html());
	});
	if(options.defaultCheckedArea) $("#" + options.modalId + " .sel-effective-area .area-view input[value='" + options.defaultCheckedArea + "']").click();
	if(options.leftTitle) $("#" + options.modalId + " .wrap-source>label").html(options.leftTitle);
	if(options.rightTitle) $("#" + options.modalId + " .wrap-new>label").html(options.rightTitle);
	//下一步  或者确定
	$("#" + options.modalId + " .next-step-or-compelete").click(function() {
		var currStepNum = $(this).attr("data-curr-step");
		if(currStepNum == 1) {
			if(tempSelectDeptArr.length < 1) {
				$.showErrorGritter("请先选择部门！");
				return false;
			}
			stepController(currStepNum, this);
			$("#" + options.modalId + " .steps").each(function() {
				$(this).attr("data-curr-step", 2);
			});
		} else {
			//确定
			var selectedEffectiveArea = $("#" + options.modalId + " .area-view input:checked").val();
			if(selectedEffectiveArea == undefined) {
				$.showErrorGritter("请先选择规则生效范围");
				return false;
			}
			if(tempSelectDeptArr.length < 1) {
				$.showErrorGritter("请先选择部门");
				return false;
			}
			if(!options.notNeedAutoCloseModal) {
				options.clickCallback({
					selectDepts: tempSelectDeptArr,
					area_value: selectedEffectiveArea,
					area_text: $("#" + options.modalId + " .effective-area-checked").next().text()
				});
				$("#" + modalIdOfDeptId).modal("hide");
			} else {
				options.clickCallback({
					selectDepts: tempSelectDeptArr,
					area_value: selectedEffectiveArea,
					area_text: $("#" + options.modalId + " .effective-area-checked").next().text()
				}, modalIdOfDeptId);
			}
		}
	});
	//取消
	$("#" + options.modalId + " .sel-dept-cancel").click(function() {
		//var currStepNum=$(this).attr("data-curr-step");
		$("#" + modalIdOfDeptId).modal("hide");
	});
	//上一步
	$("#" + options.modalId + " .prev-step").click(function() {
		var currStepNum = $(this).attr("data-curr-step");
		if(currStepNum == 2) {
			stepController(currStepNum, this);
			$("#" + options.modalId + " .steps").each(function() {
				$(this).attr("data-curr-step", 1);
			});
		} else if(currStepNum == 1) {
			$.showErrorGritter("当前已经是第一步");
		}

	});
	//步数控制    负责文字改变和页面显示步数对应的面板
	function stepController(currStepNum, obj) {
		$("#" + options.modalId + " .step-panel").addClass("hide");
		if(currStepNum == 1) {
			$("#" + options.modalId + " .next-step-or-compelete").text("确定");
			$("#" + options.modalId + " .step-panel-" + 2).removeClass("hide");
		} else if(currStepNum == 2) {
			if($(obj).hasClass("prev-step")) {
				$("#" + options.modalId + " .next-step-or-compelete").text("下一步");
				$("#" + options.modalId + " .step-panel-" + 1).removeClass("hide");
			}
		}
	}
	//全选按钮
	$("#" + options.modalId + " .select-all").click(function() {
		letAllInputSelect($("#" + options.modalId + " .list-emp"));
	});
	//全选按钮
	$("#" + options.modalId + " .cancel-all").click(function() {
		letAllInputCancelSelect($("#" + options.modalId + " .list-emp"));
	});
	$.ajaxGet(options.url, function(response) {
		if(response.code == 0) {
			//success
			var deptList = response.data.rows;
			for(var i in deptList) {
				var deptData = deptList[i];
				deptData.depa_tree_code = deptData.depa_id;
				deptData.parent_depa_tree_code = deptData.depa_parent_id;
			}
			appendDeptTreeNode(deptList, 0, $("#" + options.modalId + " .tree-dept"));
			//加载完成
			$("#" + options.modalId + " .tree-dept label input").click(function() {
				tempSelectDeptArr = []; //每次选择发生改变 重新读取数据
				var mchecked = this.checked;
				if(mchecked) {
					if(options.linkageType != 0) {
						if(options.linkageType == 2) {
							isAllThisLevelCheck($(this));
							pDeptCheckAllChildDeptCheck($(this));
						} else {
							pDeptCheckAllChildDeptCheck($(this));
						}
					}
				} else {
					var pid = $(this).attr("pid");
					if(options.linkageType != 0) {
						pDeptCancelCheckAllChildDeptCancelCheck($(this));
						cancelParentChecked(pid);
					}
				}
				$("#" + options.modalId + " .wrap-new .list-emp").empty();
				if(options.linkageType == 0) {
					$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
						var tmpDeptData = {
							dept_id: $(this).val(),
							dept_name: $(this).data("dept-name"),
							parent_dept_id: $(this).attr("pid"),
							parentsIdsObj: getAllParentDeptsIdsObj($(this).val())
						}
						//console.log(tmpDeptData)
						if(tmpDeptData) {
							tempSelectDeptArr.push(tmpDeptData);
							//console.log(tempSelectDeptArr)
							$("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
						}
					});
				} else {
					$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
						var tmpDeptData = {
							dept_id: $(this).val(),
							dept_name: $(this).data("dept-name"),
							parent_dept_id: $(this).attr("pid"),
							parentsIdsObj: getAllParentDeptsIdsObj($(this).val())
						}
						var hasAddThis = checkDeptOrParentDeptIsAppendInArr(tempSelectDeptArr, tmpDeptData);
						if(tmpDeptData && !hasAddThis) {
							//console.log(tempSelectDeptArr)
							tempSelectDeptArr.push(tmpDeptData);
							$("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
						}
					});
				}
				$("#" + options.modalId + " .wrap-new .list-emp .item").unbind("mouseover").mouseover(function() {
					transImgSrc($(this).find("img"));
				}).unbind("mouseout").mouseout(function() {
					transImgSrc($(this).find("img"));
				});
			});
			if(options.defaultCheckedIds && options.defaultCheckedIds.length > 0) {
				//console.log(options.defaultCheckedIds);
				var defaultCheckedIdsObj = {}; //将数组转为对象
				for(var i in options.defaultCheckedIds) {
					var deptId = options.defaultCheckedIds[i].dept_id || (options.defaultCheckedIds[i].depa_id || options.defaultCheckedIds[i]);
					defaultCheckedIdsObj[deptId] = deptId;
				}
				defaultCheckedIDs(defaultCheckedIdsObj);
			}
		} else {
			$.showErrorGritter("加载部门失败：" + response.msg);
		}
	});
	var getEffectiveDeptOfChecked = function(checkboxDom) {
		var childrenAlsoChecked = true;
		$(checkboxDom).parent().parent().find("input").each(function() {
			if(!$(this).is(":checked")) {
				childrenAlsoChecked = false;
				return false;
			}
		});
		if(childrenAlsoChecked) {
			var tmpDeptId = checkboxDom.val();
			var tmpDeptName = checkboxDom.data("dept-name");
			var tmpParentDeptId = checkboxDom.attr("pid");
			return {
				dept_id: tmpDeptId,
				dept_name: tmpDeptName,
				parent_dept_id: tmpParentDeptId
			};
		}
		return null;
	};
	//查找部门的所有父级部门id
	function queryDeptParents(depatId, parentIdsArr) {
		if($("#ck" + depatId).attr("pid") != 0) {
			parentIdsArr.push($("#ck" + depatId).attr("pid"));
			queryDeptParents($("#ck" + depatId).attr("pid"), parentIdsArr)
		}
		return parentIdsArr;
	}

	function checkDeptOrParentDeptIsAppendInArr(deptList, deptData) {
		var isAppend = false;
		//找出该部门所有父级部门的id
		var parentsId = [];
		parentsId = queryDeptParents(deptData.dept_id, parentsId);
		//console.log(parentsId);
		for(var i in deptList) {
			if(deptList[i].dept_id == deptData.dept_id || deptList[i].dept_id == deptData.parent_dept_id ||
				deptData.dept_id.indexOf(deptList[i].dept_id) >= 0) {
				isAppend = true;
				return isAppend;
			}
			for(var n in parentsId) {
				if(parentsId[n] == deptList[i].dept_id) {
					isAppend = true;
					return isAppend;
				}
			}
		}
	};

	function appendDeptTreeNode(deptList, parentId, treeDom) {
		for(var i in deptList) {
			var deptData = deptList[i];
			if(deptData.parent_depa_tree_code == parentId) {
				if(deptData.depa_name == "未分配部门")
					continue;
				var childDepts = queryChildDepts(deptList, deptData.depa_tree_code);
				var hasChildDept = childDepts.length > 0;
				var liDom = $("<li></li>");
				liDom.attr("gid", parentId);
				liDom.data("dept", deptData);
				liDom.append("<label> <input type=\"checkbox\" class='form-control-radio' id=\"ck" + deptData.depa_tree_code +
					"\" pid=\"" + parentId + "\" value='" + deptData.depa_tree_code + "' data-dept-name=\"" + deptData.depa_name + "\"> " + deptData.depa_name + " </label>");
				if(childDepts.length > 0) {
					appendChildDeptTreeNode(deptList, childDepts, deptData.depa_tree_code, liDom);
				}
				$(treeDom).append(liDom);
			}
		}
	};

	function queryChildDepts(deptList, parentId) {
		var resDeptList = [];
		for(var i in deptList) {
			var deptData = deptList[i];
			if(deptData.parent_depa_tree_code == parentId) {
				resDeptList.push(deptData);
			}
		}
		return resDeptList;
	};

	function appendChildDeptTreeNode(deptList, childDepts, parentId, treeDom) {
		var ulDom = $("<ul class='items'></ul>");
		for(var i in childDepts) {
			var deptData = childDepts[i];
			if(deptData) {
				if(deptData.depa_type == 1) {
					continue;
				}
				var mchildDepts = queryChildDepts(deptList, deptData.depa_tree_code);
				var hasChildDept = mchildDepts.length > 0;
				var isZhiWu = deptData.depa_type == 1;
				var liDom = $("<li></li>");
				liDom.attr("gid", parentId);
				liDom.data("dept", deptData);
				liDom.append("<label> <input type=\"checkbox\" class='form-control-radio' id=\"ck" + deptData.depa_tree_code +
					"\" pid=\"" + parentId + "\" value='" + deptData.depa_tree_code + "' data-dept-name=\"" + deptData.depa_name + "\"> " + deptData.depa_name + " </label>");
				$(liDom).find(".btn-dept-delete").remove();
			}
			if(hasChildDept) {
				appendChildDeptTreeNode(deptList, mchildDepts, deptData.depa_tree_code, liDom);
			}
			$(ulDom).append(liDom);
		}
		$(treeDom).append(ulDom);
	};
	//选中父级部门，所有子部门选中      向下联动选中
	function pDeptCheckAllChildDeptCheck(checkBoxDom) {
		//console.log("向下联动选中")
		checkBoxDom.parent().parent().find("input").each(function() {
			$(this).prop("checked", true);
		});
	}
	//取消选中父级部门，所有子部门取消选中      向下联动取消
	function pDeptCancelCheckAllChildDeptCancelCheck(checkBoxDom) {
		//console.log("向下联动取消")
		checkBoxDom.parent().parent().find("input").each(function() {
			$(this).removeAttr("checked");
		});
	}
	//选中时判断所有同级部门是否选中，如果是则选中父级部门  向上联动选中
	function isAllThisLevelCheck(checkBoxDom) {
		//console.log("向上联动选中")
		var isAllThisLevelChecked = true;
		checkBoxDom.parent().parent().parent().find(">li>label>input").each(function() {
			if(!$(this).is(":checked")) {
				isAllThisLevelChecked = false;
				return false;
			}
		});
		if(isAllThisLevelChecked) {
			if(checkBoxDom.attr("pid") != "0") {
				$("#ck" + $(checkBoxDom).attr("pid")).prop("checked", true);
				isAllThisLevelCheck($("#ck" + $(checkBoxDom).attr("pid")))
			}
		}
	}
	//取消选中时寻找父级部门取消选中   向上联动取消
	function cancelParentChecked(pid) {
		//console.log("向上联动取消")
		$("#ck" + pid).removeAttr("checked");
		if($("#ck" + pid).attr("pid")) {
			cancelParentChecked($("#ck" + pid).attr("pid"));
		}
	}
	//将选中的加入到右边 
	function addCheckedToRight(options) {
		$("#" + options.modalId + " .list-emp").find("input").each(function() {
			if($(this).is(":checked")) {}
		});
	}
	//默认选中的部门
	function defaultCheckedIDs(ids) {
		$("#" + options.modalId + " .tree-dept label input").each(function() {
			if(ids[$(this).val()]) {
				$(this).click(); //prop("checked", true);
				try {
					$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
						var tmpDeptData = {
							dept_id: $(this).val(),
							dept_name: $(this).data("dept-name"),
							parent_dept_id: $(this).attr("pid")
						}
						if(tmpDeptData) {
							if(options.isNeedRightPanel && $("#" + options.modalId + " .wrap-new .list-emp span[data-dept-id='" + tmpDeptData.dept_id + "']").length < 1) $("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
						}
					});
				} catch(e) {
					//TODO handle the exception
				}
			}
		});
	}
	//获得一部门的所有父部门
	function getAllParentDeptsIdsObj(id) {
		var obj = {};
		$("#ck" + id).parents("li[gid]").each(function() {
			if($(this).attr("gid")) {
				obj[$(this).attr("gid")] = $(this).attr("gid");
			}
		});
		return obj;
	}
	//	//判断一部门的父部门中已经存在于选中的部门中
	function booleanHasParentDeptChecked(checkedIds, parentsIdsObj) {
		for(var i in checkedIds) {
			if(parentsIdsObj[checkedIds[i].dept_id]) {
				return true;
			}
		}
		return false;
	}
}

//删除当前选中的部门
function deleteThisChecked(modalId, obj) {
	$("#" + modalId + " #ck" + $(obj).parent().attr("data-dept-id")).click();
	$(obj).parent().remove();
}

//查看拜访指标     type:1->单位   2->部门   3->联系人
function openVistPop(type, id) {
	var vistTabDom = "";
	vistTabDom +=
		"<div class='vist-quote hide'>" +
		"<table class='vist-quote-tab'>" +
		"<thead>" +
		"<tr>" +
		"<td>姓名</td>" +
		"<td>拜访(协访)/指标</td>" +
		"</tr>" +
		"</thead>" +
		"<tbody>" +
		"</tbody>" +
		"</table>" +
		"</div>";
	if($("body .vist-quote").length < 1) $("body").append(vistTabDom);
	var vistQuoteModalId = $.modal({
		showFooter: false
	}).showOfMini("本月拜访/协访指标", ".vist-quote", function(modal) {
		$("#" + vistQuoteModalId).modal('hide');
	});
	var url = BSAPIURL + "/crm/customer/visit_quota/sub_employees?data_id=" + id + "&data_type=" + type;
	$.ajaxGet(url, function(resp) {
		//console.log(resp)
		var vistTrDoms = "";
		for(var i in resp.data) {
			vistTrDoms +=
				"<tr>" +
				"<td>" + resp.data[i].employee_name + "</td>" +
				"<td>" + (resp.data[i].visit_quota.has_quota_change ? "<img src='../resources/images/special-approval.png'>" : "") + resp.data[i].visit_quota.real_visit_quota + "/" + resp.data[i].visit_quota.target_visit_quota + "</td>" +
				"</tr>";
		}
		$("#" + vistQuoteModalId + " table tbody").html(vistTrDoms);
	});
}

//查看拜访指标     type:1->单位   2->部门   3->联系人
function openVistDetailPop(type, id) {
	var vistTabDom = "";
	vistTabDom +=
		"<div class='vist-detail hide'>" +
		"<table class='vist-detail-tab'>" +
		"<thead>" +
		"<tr>" +
		"<td>姓名</td>" +
		"<td>拜访指标</td>" +
		"<td>计划拜访</td>" +
		"<td>计划内已拜访</td>" +
		"<td>计划外已拜访</td>" +
		"</tr>" +
		"</thead>" +
		"<tbody>" +
		"</tbody>" +
		"</table>" +
		"</div>";
	if($("body .vist-detail").length < 1) $("body").append(vistTabDom);
	var vistDetailModalId = $.modal({
		showFooter: false
	}).show("拜访信息", ".vist-detail", function(modal) {
		$("#" + vistDetailModalId).modal('hide');
	});
	var url = BSAPIURL + "/crm/customer/visit_quota/sub_employees?data_id=" + id + "&data_type=" + type;
	$.ajaxGet(url, function(resp) {
		var vistTrDoms = "";
		for(var i in resp.data) {
			vistTrDoms +=
				"<tr>" +
				"<td>" + resp.data[i].employee_name + "</td>" +
				"<td>" + (resp.data[i].visit_quota.has_quota_change ? "<img src='../resources/images/special-approval.png'>" : "") + resp.data[i].visit_quota.real_visit_quota + "/" + resp.data[i].visit_quota.target_visit_quota + "</td>" +
				"<td>" + resp.data[i].employee_name + "</td>" +
				"<td>" + resp.data[i].employee_name + "</td>" +
				"<td>" + resp.data[i].employee_name + "</td>" +
				"</tr>"
		}
		$("#" + vistDetailModalId + " table tbody").html(vistTrDoms);
	});
}

//添加水印的方法
var waterPrint = function() {
	$("html").css("height", "100%");
	$("body").css({
		"margin-top": "-20px",
		"min-height": "100%"
	});
	$("html,body").addClass("noselect");
	var name = unescape($.cookie("_u_name"));
	$("body>div:first-child").before("<div id='waterPrint'></div>");
	$("#waterPrint").append("<span class='name-style'>" + name + "</span>");
	//var width = $("#waterPrint").outerWidth(true);
	var width = $("body").outerWidth(true);
	//console.log(document.getElementsByTagName("body")[0]);
	//var height = $("#waterPrint").outerHeight(true);
	var height = $("body").height();
	$("#waterPrint").css("height", height);
	//$("#waterPrint").css("width",width);
	var spanWidth = $(".name-style").outerWidth(true);
	var spanHeight = $(".name-style").outerHeight(true);
	$(".name-style").css("display", "none");
	//console.log("width:" + width + "height:" + height + "spanWidth:" + spanWidth + "spanHeight:" + spanHeight)
	var lenW = parseInt(width / spanWidth);
	var lenH = parseInt(height / spanHeight);
	//console.log(lenW + "+++" + lenH)
	for(var i = 0; i < lenH; i++) {
		$("#waterPrint").append("<div id='name-container-" + i + "'></div>");
		for(var n = 0; n <= lenW + 5; n++) {
			//console.log(n)
			$("#waterPrint #name-container-" + i + "").append("<span class='name-style'>" + name + "</span>");
		}
	}

}

function GetDateStr(AddDayCount, bsDate) {
	try {
		var dd = new Date(bsDate.replace(/-/g, "/"));
	} catch(e) {
		var dd = new Date(bsDate);
	}
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	return y + "-" + (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);
}
/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getPreMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中月的天数
	var year2 = year;
	var month2 = parseInt(month) - 1;
	if(month2 == 0) {
		year2 = parseInt(year2) - 1;
		month2 = 12;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if(day2 > days2) {
		day2 = days2;
	}
	if(month2 < 10) {
		month2 = '0' + month2;
	}
	var t2 = year2 + '-' + month2; // + '-' + day2;
	return t2;
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getNextMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中的月的天数
	var year2 = year;
	var month2 = parseInt(month) + 1;
	if(month2 == 13) {
		year2 = parseInt(year2) + 1;
		month2 = 1;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if(day2 > days2) {
		day2 = days2;
	}
	if(month2 < 10) {
		month2 = '0' + month2;
	}
	var t2 = year2 + '-' + month2 + '-' + day2;
	return t2;
}

//选择区域选择
function openAreaSelectPop(option){
	var isAppendEmployeeWrap = $(".pnl-area-select-common").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-area-select-common hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common model-area-select-common\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"py\">" +
			"				<input type=\"text\" class=\"search\" placeholder=\"可输入“BJ”或“北京”查找\" style=\"width: 100%;\" />" +
//			"				<p class='nav-py'>" +
//			"					<a class=\"active\">A</a>" +
//			"				</p>" +
			"			</div>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap seg\">" +
			"			<div class=\"box\">" +
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>" +
			"				</p>" +
			"				<br>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>已选区域：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			(!option.onlySingle ?
				"			<div class='sel-panel-container'>" +
				"				<a class='delete-all'>移除全部</a>" +
				"			</div>" : "") +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	//option.isIncludeSelf = (option.isIncludeSelf ? option.isIncludeSelf : false);
	option.title = option.title || "选择行政区域";
	//option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
	//选择员工
	var modalIdOfArea = $.modal({
		height: 490,
		width: 900
	}).show(option.title, ".pnl-employee-select-common",
		function(modal) {
			var selectAreasData = {};
			selectAreasData.selectAreas=[];
			selectAreasData.areaLength=$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").length;
			$(formContainerOfEmployee + " .wrap-source .list-emp input[name=ckEmployee4Select]:checked").each(function() {
				selectAreasData.selectAreas.push({
					area_id: $(this).val(),
					area_name: $(this).attr("data-code-name")
				});
			});
			if(selectAreasData.selectAreas.length == 0) {
				$.showErrorGritter("请先选择区域后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectAreasData, modalIdOfArea);
			}
			modal.modal("hide");
			removeSelected = null;
		},
		function() {
			removeSelected = null;
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfArea + " .model-employee-select-common";
	if(option.isNotNeedDepaSelect) {
		$(formContainerOfEmployee + " .search-menu").remove();
	}
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	//		$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function() {
	//			if(event.keyCode == 13) {
	//				return false;
	//			}
	//		});
	//移除已选人员
	window.removeSelected = function(obj) {
		var thisId = $(obj).parents("li").find("input").val();
		$(formContainerOfEmployee + " .wrap-source input[value='" + thisId + "']").removeProp("checked");
		$(obj).parents("li").remove();
	}
	//加载员工列表
	var url = option.url;
	$.ajaxGet(url, function(response) {
		if(response.code == 0) {
			//success
			console.log(response)
			var areaTreeData = response.data;
			//关键字搜索
			$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event) {
				//event.preventDefault();
				if(event.keyCode == 13) {
					event.preventDefault();
					var sKey = $(this).val();
					$.ajaxGet(url + "&key=" + encodeURIComponent(sKey), function(resp) {
						if(response.code == 0) {
							initEmployees4SetDeptLeader(resp.data);
							bindEvents();
						}
					});
					return false;
				}
			});
			//first load employee
			initEmployees4SetDeptLeader(areaTreeData);
			bindEvents();
		} else {
			$.showErrorGritter("加载员工列表失败：" + response.msg);
		}
	});
	//展示员工列表
	var initEmployees4SetDeptLeader = function(areas) {
		//console.log(employees)
		//$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in areas) {
			var areaData = areas[i];
			var liDom = $("<li></li>");
			liDom.append((areaData.codes?"<img src='../resources/images/minus-o-icon.png' data-trans-src='../resources/images/plus-o-icon.png' area-hidden='false'>":"")+"<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' data-code-name=\"" +(areaData.code_parent_tree?areaData.code_name:"全国") + "\" value=\"" + areaData.code_tree + "\">"+
				"<span class='name-css-overhidden css-overhidden'>" +(areaData.code_parent_tree?areaData.code_name:"全国") + "</span></label>");
			if(areaData.code_parent_tree&&$(formContainerOfEmployee + " .wrap-source .list-emp input[value='"+areaData.code_parent_tree+"']").length>0){
				$(formContainerOfEmployee + " .wrap-source .list-emp input[value='"+areaData.code_parent_tree+"']").parent().parent().append(liDom);
			}else{
				$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
			}
			if(areaData.codes){
				initEmployees4SetDeptLeader(areaData.codes);
			}
		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
	function bindEvents(){
		//展开收起
		$(formContainerOfEmployee + " .wrap-source li img").unbind("click").click(function() {
			if($(this).attr("area-hidden")=="false"){
				$(this).parent().find("img").attr("area-hidden",true);
				$(this).parent().find("li").slideUp();
				transImgSrc($(this).parent().find("img"));
			}else{
				$(this).attr("area-hidden",false);
				//$(this).parent().find(">li>img").attr("area-hidden",false);
				$(this).parent().find(">li").slideDown();
				transImgSrc($(this));
			}
		});
		//添加选中人员到右边列表
		$(formContainerOfEmployee + " .wrap-source .list-emp input").unbind("change").change(function(e) {
			if($(this).prop("checked")){
				$(this).parent().parent().find("input").prop("checked","checked");
			}else{
				$(this).parent().parent().find("input").removeProp("checked");
			}
			var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
			//if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
			//}
			selectEmpDoms.each(function() {
				if($(this).parent().parent().parent().find(">label>input").prop("checked")) return true;
				var selDom = $(this).parent().parent();
				selDom.append("<img class='btn-remove' onclick='removeSelected(this);' src='../resources/images/filter-close.png'/>");
				//selDom.find("input").removeAttr("checked");
				//old
				//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
				var selEmpId = $(this).val();
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
					$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
				$(formContainerOfEmployee + " .wrap-new .list-emp input").addClass("hide");
				$(formContainerOfEmployee + " .wrap-new .list-emp li>img:first-child").remove();
				$(formContainerOfEmployee + " .wrap-new .list-emp>li li").remove();
				selDom.find(".btn-remove").remove();
			});
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
			}
		});
		//已选人员
		if(option.selectAreaIds && option.selectAreaIds.length > 0) {
			var selectedAreaIdsObj = {};
			for(var i in option.selectAreaIds) {
				var areaId = option.selectAreaIds[i].area_id || (option.selectAreaIds[i].area_id || option.selectAreaIds[i]);
				selectedAreaIdsObj[areaId] = areaId;
			}
			defaultCheckedIds(selectedAreaIdsObj);
		}
	}
	//默认选中
	function defaultCheckedIds(ids) {
		$(formContainerOfEmployee + " input").each(function() {
			if(ids[$(this).val()]) {
				$(this).click();
			}
		});
		//$(formContainerOfEmployee + " .btn-add").click();
	}
	//全选按钮
	$(formContainerOfEmployee + " .select-all").click(function() {
		letAllInputSelect($(formContainerOfEmployee + " .list-emp"));
	});
	//全选按钮
	$(formContainerOfEmployee + " .cancel-all").click(function() {
		letAllInputCancelSelect($(formContainerOfEmployee + " .wrap-source .list-emp"));
	});
	//移除全部
	$(formContainerOfEmployee + " .delete-all").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		$(formContainerOfEmployee + " .wrap-source .list-emp input").removeProp("checked");
	});
}

//选择员工公共方法----选择共享对象
$.showContactsSelectPop = function(option) {
	var title = option.right_title;
	var isAppendEmployeeWrap = $(".pnl-contacts-select-common").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info model-employee-select-common pnl-employee-select-common pnl-contacts-select-common pnl-employee-select-common-share hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common model-contacts-select-common pnl-employee-select-common-share\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"py\">" +
			"				<input type=\"text\" class=\"search\" placeholder=\"输入关键字查找\" style=\"width: 100%;\" />" +
			//(!option.isNotNeedDepaSelect ? "<span data-depar='' class='search-menu search-all'>所有部门</span>"+"<span data-depar='1' class='search-menu select'>我的部门</span><span data-depar=" + (option.type == "1" ? "4" : "2") + " class='search-menu'>" + (option.type == "1" ? "我的下属" : "下属部门") + "</span><span data-depar=" + (option.type == "1" ? "5" : "3") + " class='search-menu'>" + (option.type == "1" ? "我的上级" : "上级部门") + "</span>" : "") +
//			"				<p class='nav-py'>" +
//			"					<a class=\"active\">A</a>" +
//			"				</p>" +
			"			</div>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap seg\">" +
			"			<div class=\"box\">" +
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>" +
			"				</p>" +
			"				<br>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>已选人员：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			(!option.onlySingle ?
				"			<div class='sel-panel-container'>" +
				"				<a class='delete-all'>移除全部</a>" +
				"			</div>" : "") +
			"		</div>" +
			"	</form>" +
			"</div>");
	}

	option.myID
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
	//选择员工
	var modalIdOfEmployee = $.modal({
		height: 490,
		width: 900,
		shownCallback: function() {
			$("form").keydown(function(e) {
				if(e.keyCode == 13) {
					e.preventDefault();
					$("#" + modalIdOfEmployee + " .search").trigger("change");
				}
			});
		}
	}).show(option.title, ".pnl-contacts-select-common",
		function(modal) {
			var selectContacts = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sContactForWorkPlan]").each(function() {
				selectContacts.push({
					contact_id: $(this).val(),
					contact_name: $(this).attr("data-contact-name")//,
					//employee_avatar: $(this).data("employee_avatar")
				});
			});
			if(selectContacts.length < 1 ) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectContacts);
			}
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .wrap-new label").html(title);
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	var stateText = option.depa_mode ? option.depa_mode : "";
	//移除已选人员
	window.removeSelected = function(obj) {
		var thisId = $(obj).parents("li").find("input").val();
		$(formContainerOfEmployee + " .wrap-source input[value='" + thisId + "']").removeProp("checked");
		$(obj).parents("li").remove();
	}
	$(formContainerOfEmployee + " .wrap-source .py .search").change(function(event) {
		var keyText = $(this).val();
		//加载员工列表
		$.ajaxGet(option.url+"&key="+keyText,
			function(response) {
				if(response.code == 0) {
					//success
					$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
					var clientList = response.data;
					for(var i in clientList) {
						var client = clientList[i];
						addOneClientHtml(client);
					}
					$(formContainerOfEmployee + " .wrap-source .client-li>label").trigger("click");
					$(formContainerOfEmployee + " .wrap-source .depa-li>label").trigger("click");
					//load py
					$(formContainerOfEmployee + " .wrap-source .py p").empty();
					//first load employee
					//initEmployees4SetDeptLeader(clientList);
					//已选人员
					$(formContainerOfEmployee+ " .wrap-new input").each(function(){
						$(formContainerOfEmployee+ " .wrap-source input[value='"+$(this).val()+"']").prop("checked","checked");
					});
					if(option.selectedClientIds && option.selectedClientIds.length > 0) {
						for(var i in option.selectedClientIds) {
							var clientId = option.selectedClientIds[i];
							if($(formContainerOfEmployee + " .wrap-new input[value='" + clientId + "']").length <1) {
								$(formContainerOfEmployee + " .wrap-source input[value='" + clientId + "']").trigger("click");
							};
						}
					}
				} else {
					$.showErrorGritter("加载员工列表失败：" + response.msg);
				}
			});
	});
	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("change");
	//点击换样式
	$(formContainerOfEmployee + " .search-menu").click(function() {
		$(this).addClass("select").siblings().removeClass("select");
		stateText = $(this).attr("data-depar");
		$(formContainerOfEmployee + " .wrap-source .py .search").trigger("change");
	});
	if(!option.depa_mode) $(formContainerOfEmployee + " .wrap-source .py .search-all").addClass("select").siblings().removeClass("select");
	//展示员工列表
	var addOneClientHtml = function(client) {
		//$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		var clientLiDom = $("<li class='client-li'></li>");
			clientLiDom.append(
			"<label class='assist-people'>"+
			"	<img src='../resources/images/minus-o-icon.png' area-hidden='false' data-trans-src='../resources/images/plus-o-icon.png' class=\"icon-collapse\"/>"+
			"	<span title='" +client.client_name + "'>" +client.client_name + "</span>"+
			"</label>");
		clientLiDom.attr("data-client-id",client.client_id);
		$(formContainerOfEmployee + " .wrap-source .list-emp ").append(clientLiDom);
		for(var i in client.departments) {
			var depa = client.departments[i];
			var depaLiDom = $("<li class='depa-li'></li>");
			depaLiDom.append(
				"<label class='assist-people'>"+
				"	<img src='../resources/images/minus-o-icon.png' area-hidden='false' data-trans-src='../resources/images/plus-o-icon.png' class=\"icon-collapse\"/>"+
				"	<span title='" +depa.department_name + "'>" +depa.department_name + "</span>"+
				"</label>");
			depaLiDom.attr("data-depa-id",depa.department_id);
			clientLiDom.append(depaLiDom);
			for(var c in depa.contacts) {
				var contact = depa.contacts[c];
				var contactLiDom = $("<li class='contact-li'></li>");
				contactLiDom.append(
					"<label class='assist-people'>"+
					//"	<img src='../resources/images/plus-o-icon.png' area-hidden='true' data-trans-src='../resources/images/minus-o-icon.png' class=\"icon-collapse\"/>"+
					"	<input data-contact-name='"+contact.contact_name+"' type='"+(option.onlySingle?"radio":"checkbox")+"' name='contactForWorkPlan' value='"+contact.contact_id+"'/>"+
					"	<span title='" +contact.contact_name + "'>" +contact.contact_name + "</span>"+
					"</label>");
				contactLiDom.attr("data-depa-id",depa.department_id);
				contactLiDom.attr("data-depa-name",depa.department_name);
				contactLiDom.attr("data-client-id",client.client_id);
				contactLiDom.attr("data-client-name",client.client_name);
				contactLiDom.data("can_save_schedule",contact.can_save_schedule);
				depaLiDom.append(contactLiDom);
			}
		}
		//添加选中人员到右边列表
		$(formContainerOfEmployee + " .wrap-source .list-emp input").unbind("change").change(function() {
			if(option.max) {
				var selectLength = $(formContainerOfEmployee + " .wrap-new li").length;
				if(selectLength >= option.max) {
					$.showErrorGritter("人数不能超过" + option.max + "人");
					return false;
				}
			}
			if(!$(this).is(":checked")) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").parent().parent().remove();
				$(this).removeProp("checked");
				return false;
			}
			$(this).prop("checked","checked");
			var can_save_schedule=$(this).parent().parent().data("can_save_schedule");
			if(!can_save_schedule.result) {
				$(this).removeProp("checked");
				$.showErrorGritter(can_save_schedule.reason+",不能选择！");
				return false;
			}
			var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
			if(option.onlySingle) $(formContainerOfEmployee + " .wrap-new .list-emp").empty();
			selectEmpDoms.each(function() {
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").length>0) return true;
				var selDom = $(this).parent().parent();
				selDom.append("<img class='btn-remove' onclick='removeSelected(this);' src='../resources/images/filter-close.png'/>");
				//selDom.find(">label").append("<a class='note-font-type'>（<span class='wrap-new-tip css-overhidden' title='"+(selDom.attr("data-depa-name")+"，"+selDom.attr("data-client-name"))+"'>"+(selDom.attr("data-depa-name")+"，"+selDom.attr("data-client-name"))+"</span>）</a>");
				var selEmpId = $(this).val();
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
					$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
				$(formContainerOfEmployee + " .wrap-new .list-emp input").addClass("hide");
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").attr("name","sContactForWorkPlan")
				selDom.find(".btn-remove").remove();
				//selDom.find(".wrap-new-tip").remove();
			});
			$(this).prop("checked","checked");
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
			}
		});
		//展开收起
		$(formContainerOfEmployee + " .wrap-source .client-li label").unbind("click").click(function() {
			if($(this).find(">img").attr("area-hidden")=="false") {
				$(this).find(">img").attr("area-hidden",true);
				$(this).parent().find(">li").slideUp();
			}else{
				$(this).find(">img").attr("area-hidden",false);
				$(this).parent().find(">li").slideDown();
			}
			transImgSrc($(this).find(">img"));
		});
		//展开收起
		$(formContainerOfEmployee + " .wrap-source .depa-li label").unbind("click").click(function() {
			if($(this).find(">img").attr("area-hidden")=="false") {
				$(this).find(">img").attr("area-hidden",true);
				$(this).parent().find(">li").slideUp();
			}else{
				$(this).find(">img").attr("area-hidden",false);
				$(this).parent().find(">li").slideDown();
			}
			transImgSrc($(this).find(">img"));
		});
	};
	//全选按钮
	$(formContainerOfEmployee + " .select-all").click(function() {
		letAllInputSelect($(formContainerOfEmployee + " .list-emp"));
	});
	//全选按钮
	$(formContainerOfEmployee + " .cancel-all").click(function() {
		letAllInputCancelSelect($(formContainerOfEmployee + " .list-emp"));
	});
	//移除全部
	$(formContainerOfEmployee + " .delete-all").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		$(formContainerOfEmployee + " .wrap-source .list-emp input").removeProp("checked");
	});
};
