//加载部门树
var loadDeptTree = function(option) {
	$(option.container).empty();
	//负责的部门
	if(option.responsible == true) {
		option.responsible = true;
	} else {
		option.responsible = false;
	}

	var depaUrl = SAASAPIS.BS.company.departments.replace("{id}", $.uuid());
	if(option.responsible) {
		depaUrl = SAASAPIS.BS.company.department.responsible;
	}

	$.ajaxGet(depaUrl, function(response) {
		if(response.code == 0) {
			//success
			var deptList = response.data.rows;
			for(var i in deptList) {
				var deptData = deptList[i];
				deptData.depa_tree_code = deptData.depa_id;
				deptData.parent_depa_tree_code = deptData.depa_parent_id;

				if(option.responsible)
					deptData.depa_count = deptData.depa_employees_count;
			}
			var treeDom = $(option.container);
			//第一级
			if(option.responsible) {
				var loadedDepaIds = [];
				for(var i in deptList) {
					var deptData = deptList[i];
					var tmpParentDeptId = deptData.depa_parent_id;
					if(getParentDept(deptList, tmpParentDeptId).length == 0 && loadedDepaIds.indexOf(tmpParentDeptId) == -1) {
						loadedDepaIds.push(tmpParentDeptId);
						appendDeptTreeNode(option.responsible, deptList, tmpParentDeptId, treeDom);
					}
				}
			} else
				appendDeptTreeNode(option.responsible, deptList, 0, treeDom);
			//event
			//$(".tree-dept-menu li label").after("&nbsp;&nbsp;<span class=\"btns\"><a href=\"javascript:;\" onclick=\"openSetDeptInfoPop('update',this);\">修改</a> <a href=\"javascript:;\" onclick=\"openSetDeptLeader(this);\">设置负责人</a> <a href=\"javascript:;\" onclick=\"openDeleteDeptPop(this);\">删除</a></span>");
			$(option.container + " li label").click(function(e) {
				$(option.container + " li label").removeClass("active");
				$(this).addClass("active");
				var selectDeptData = $(this).parents("li:first").data("dept");
				if(selectDeptData) {
					var selectData = {};
					selectData.isTopest = $(this).data("istop");
					selectData.deptId = selectDeptData.depa_tree_code;
					selectData.deptType = selectDeptData.depa_type;
					selectData.realDeptId = selectDeptId;
					selectData.deptName = selectDeptData.depa_name;
					selectData.realDeptName = selectDeptName;
					//如果选择的是职务
					if(selectDeptData.depa_type == 1) {
						selectData.realDeptId = selectDeptData.parent_depa_tree_code;
						selectData.realDeptName = $(this).parents("li:first").parents("li:first").data("dept").depa_name;
					}
					//选中
					option.onNodeSelected && option.onNodeSelected(selectData);
				}
			});
			$(option.container + ">li>p>label").click();
			//			.dblclick(function() {
			//				$(this).parents("li:first").find(".items:first").toggleClass("hide");
			//				if($(this).parent().is("p.fa")) {
			//					var isCollapse = $(this).data("collapse") == true;
			//					$(this).parent().removeClass("fa-chevron-down").removeClass("fa-chevron-right").addClass(!isCollapse ? "fa-chevron-right" : "fa-chevron-down");
			//					$(this).data("collapse", !isCollapse);
			//				}
			//			});
			$(".tree-dept-menu li i.fa").click(function(e) {
				$(this).parents("li:first").find(".items:first").toggleClass("hide");
				if($(this).is("i.fa")) {
					var isCollapse = $(this).data("collapse") == true;
					$(this).removeClass("fa-chevron-down").removeClass("fa-chevron-right").addClass(!isCollapse ? "fa-chevron-right" : "fa-chevron-down");
					$(this).data("collapse", !isCollapse);
				}
			});
			$(option.container + " li label[code='" + selectDeptId + "']").click();
		} else {
			$.showErrorGritter("加载部门失败：" + response.msg);
		}
		$.hideLoadingPop();
	});
};
//创建部门树
var appendDeptTreeNode = function(responsible, deptList, parentId, treeDom) {
	for(var i in deptList) {
		var deptData = deptList[i];
		if(deptData.depa_type == 1) {
			//职务
			continue;
		}
		if(deptData.parent_depa_tree_code == parentId) {
			var childDepts = queryChildDepts(deptList, deptData.depa_tree_code);
			var hasChildDept = childDepts.length > 0;
			var liDom = $("<li></li>");
			liDom.data("dept", deptData);
			if(hasChildDept)
				liDom.append("<p><i class=\"fa fa-chevron-down icon-collapse\"></i><label code='" + deptData.depa_tree_code + "' data-istop='true'>" + deptData.depa_name + " (" + deptData.depa_count + ")</label></p>");
			else
				liDom.append("<label code='" + deptData.depa_tree_code + "' data-istop='true'>" + deptData.depa_name + " (" + deptData.depa_count + ")</label>");
			if(childDepts.length > 0) {
				appendChildDeptTreeNode(deptList, childDepts, deptData.depa_tree_code, liDom);
			}
			$(treeDom).append(liDom);
		}
	}
};
//查询自部门
var getParentDept = function(deptList, parentId) {
	var resDeptList = [];
	for(var i in deptList) {
		var deptData = deptList[i];
		if(deptData.depa_tree_code == parentId) {
			resDeptList.push(deptData);
		}
	}
	return resDeptList;
};
//查询自部门
var queryChildDepts = function(deptList, parentId) {
	var resDeptList = [];
	for(var i in deptList) {
		var deptData = deptList[i];
		if(deptData.parent_depa_tree_code == parentId && deptData.depa_type == 0) {
			resDeptList.push(deptData);
		}
	}
	return resDeptList;
};
//创建部门树
var appendChildDeptTreeNode = function(deptList, childDepts, parentId, treeDom) {
	var ulDom = $("<ul class='items'></ul>");
	for(var i in childDepts) {
		var deptData = childDepts[i];
		if(deptData.depa_type == 1) {
			//职务
			continue;
		}
		if(deptData) {
			var mchildDepts = queryChildDepts(deptList, deptData.depa_tree_code);
			var hasChildDept = mchildDepts.length > 0;
			var isZhiWu = deptData.depa_type == 1;
			var liDom = $("<li dept-type='" + deptData.depa_type + "'></li>");
			liDom.data("dept", deptData);
			if(hasChildDept)
				liDom.append("<p><i class=\"fa fa-chevron-down icon-collapse\"></i><label code='" + deptData.depa_tree_code + "'>" + deptData.depa_name + " (" + deptData.depa_count + ")</label></p>");
			else
				liDom.append("<label code='" + deptData.depa_tree_code + "'>" + deptData.depa_name + " (" + deptData.depa_count + ")</label>");

			if(hasChildDept) {
				appendChildDeptTreeNode(deptList, mchildDepts, deptData.depa_tree_code, liDom);
			}
			$(ulDom).append(liDom);
		}
	}
	$(treeDom).append(ulDom);
};