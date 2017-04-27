//比较两个时间相差多少天
$.compareTwoTimeDifference = function(smalerTimeStr, largerTimeStr) {
	var smalerTime = new Date((smalerTimeStr).replace(/-/g,"/"));
	var largerTime = new Date((largerTimeStr).replace(/-/g,"/"));
	return parseInt(smalerTime.getTime() / (24 * 60 * 60 * 1000) - largerTime.getTime() / (24 * 60 * 60 * 1000));
}

////鼠标移入移出  加/减  class
function bindTransBackgroundEvent(selector, className, shortJs) {
	selector.mouseover(function() {
		//if(shortJs) eval(shortJs);
		$(this).addClass(className);
	});
	selector.mouseout(function() {
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
	$(clickBtnSelector).click(function() {
		if($(this).is(":checked")) {
			$(beenSelectSelector).prop("checked", true);
		} else {
			$(beenSelectSelector).removeAttr("checked");
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
	if(!options.isNeedRightPanel) $("#"+options.modalId+" .wrap-new").remove();
	if(options.leftTitle) $("#"+options.modalId+" .wrap-source>label").html(options.leftTitle);
	if(options.rightTitle) $("#"+options.modalId+" .wrap-new>label").html(options.rightTitle);
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
				var tempSelectDeptArr = [];
				$("#" + options.modalId + " .wrap-new .list-emp").empty();
				var tempHtml = "<span class=\"item\" data-dept-id=\"{ID}\" data-dept-name=\"{N}\">{N} <i class=\"fa fa-times icon-close\" onclick=\"$(this).parent().remove();\"></i></span> ";
				if(options.linkageType == 0) {
					$("#" + options.modalId + " .wrap-source .list-emp").find("input:checked").each(function(i) {
						var tmpDeptData = {
							dept_id: $(this).val(),
							dept_name: $(this).data("dept-name"),
							parent_dept_id: $(this).attr("pid")
						}
						console.log(tmpDeptData)
						if(tmpDeptData) {
							tempSelectDeptArr.push(tmpDeptData);
							console.log(tempSelectDeptArr)
							if(options.isNeedRightPanel)$("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
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
							console.log(tempSelectDeptArr)
							tempSelectDeptArr.push(tmpDeptData);
							if(options.isNeedRightPanel)$("#" + options.modalId + " .wrap-new .list-emp").append(tempHtml.replace(/{N}/g, tmpDeptData.dept_name).replace("{ID}", tmpDeptData.dept_id));
						}
					});
				}
				console.log(tempSelectDeptArr)
				options.clickCallback(tempSelectDeptArr);
			});
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
			if($(this).is(":checked")) {

			}
		});
	}

}