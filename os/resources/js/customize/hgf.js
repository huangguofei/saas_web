//选择员工公共方法----选择共享对象
$.showShareEmployeeSelectPop = function(option) {
	var title = option.right_title;
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-share").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-share hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common\">" +
			"		<div action=\"\" method=\"post\" class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"box\">" +
			"				<div class=\"py\">" +
			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
			"					<input type=\"search\" class=\"search\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
			(!option.isNotNeedDepaSelect ? "<span data-depar='1' class='search-menu select'>我的部门</span><span data-depar=" + (option.type == "1" ? "4" : "2") + " class='search-menu'>" + (option.type == "1" ? "我的下属" : "下属部门") + "</span><span data-depar=" + (option.type == "1" ? "5" : "3") + " class='search-menu'>" + (option.type == "1" ? "我的上级" : "上级部门") + "</span><span data-depar='' class='search-menu'>所有部门</span>" : "") +
			"					<p>" +
			"						<a class=\"active\">A</a>" +
			"					</p>" +
			"				</div>" +
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
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
			"				</p>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>" + (title ? title : "已选员工：") + "</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}

	option.myID
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-share",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
				selectEmployees.push({
					employee_id: $(this).val(),
					employee_name: $(this).data("employee-name"),
					employee_avatar: $(this).data("employee_avatar")
				});
			});
			if(selectEmployees.length == 0 && option.type != 1) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectEmployees);
			}
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .wrap-new label").html(title);
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	var stateText = 1;
	$(formContainerOfEmployee + " .wrap-source .py .search").change(function(event) {
		var keyText = $(this).val();
		//加载员工列表
		$.ajaxGet(SAASAPIS.BS.company.employees + "/simple?key=" + keyText + (!option.isNotNeedDepaSelect ? "&depa_mode=" + stateText : ""), function(response) {
			if(response.code == 0) {
				//success
				var employeeList = response.data.rows;
				var employeesGroupByPY = {};
				var pyArr = [];
				console.log(employeeList);
				for(var i in employeeList) {
					var employeeData = employeeList[i];
					//拼音首字母
					var firstPY = (employeeData.employee_name_first_en || "#").substring(0, 1).toUpperCase();
					if(!employeesGroupByPY[firstPY]) {
						employeesGroupByPY[firstPY] = [];
					}
					employeesGroupByPY[firstPY].push(employeeData);
					if(pyArr.indexOf(firstPY) == -1)
						pyArr.push(firstPY);
				}
				pyArr = pyArr.sort();
				//load py
				$(formContainerOfEmployee + " .wrap-source .py p").empty();
				for(var p in pyArr) {
					if(pyArr[p] == "#") {
						continue;
					}
					$(formContainerOfEmployee + " .wrap-source .py p").append("<a>" + pyArr[p] + "</a>");
				}
				$(formContainerOfEmployee + " .wrap-source .py p").append("<a>#</a>");
				//click event
				$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
					$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
					$(this).addClass("active");
					initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
				});
				//first load employee
				initEmployees4SetDeptLeader(employeeList);
				//已选人员
				if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
					for(var i in option.selectedEmployeeIds) {
						var empId = option.selectedEmployeeIds[i];
						if($(formContainerOfEmployee + " .wrap-new input[value='" + empId + "']").length > 0) continue;
						for(var j in employeeList) {
							var employeeData = employeeList[j];
							if(employeeData.employee_id == empId) {
								var liDom = $("<li></li>");
								liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' data-employee-name=\"" + employeeData.employee_name + "\" value=\"" + employeeData.employee_id + "\"> <span>" +
									employeeData.employee_name + "</span><span>" +
									employeeData.depa_name + "</span><span>" + employeeData.employee_post_cn + "</span></label>");
								$(formContainerOfEmployee + " .wrap-new .list-emp").append(liDom);
							}
						}
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
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
		if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		}
		selectEmpDoms.each(function() {
			var selDom = $(this).parent().parent();
			selDom.find("input").removeAttr("checked");
			//old
			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
			var selEmpId = $(this).val();
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
				$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
		});
		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
		}
	});
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
			$(this).parent().parent().remove();
		});
		//$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
		//	var selDom = $(this).parent().parent();
		//	selDom.find("input").removeAttr("checked");
		//	//selDom.find("label").last().remove();
		//	$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
		//});
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			//			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
			//				continue;
			//			}
			if(employeeData.employee_name == $.cookie("_u_name")) continue;
			var liDom = $("<li></li>");
			liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' data-employee-name=\"" + employeeData.employee_name + "\" data-employee_avatar=\"" + employeeData.employee_avatar + "\" value=\"" + employeeData.employee_id + "\"> <span>" +
				employeeData.employee_name + "</span><span>" +
				employeeData.depa_name + "</span><span>" + employeeData.employee_post_cn + "</span></label>");
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
};

//选择员工公共方法---设置负责人
$.showLinkmanEmployeeSelectPop = function(option) {
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-linkman").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-linkman hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-linkman\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"box\">" +
			"				<div class=\"py\">" +
			"					<input type=\"search\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
			"					<span class='search-menu select'>当前部门/科室</span><span class='search-menu'>全部</span>" +
			"					<p>" +
			"						<a class=\"active\">A</a>" +
			"					</p>" +
			"				</div>" +
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
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
			"				</p>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>共享对象：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;

	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-linkman",
		function(modal) {
			var leader_data = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
				if($(this).parent().next().children("input:radio[name='fei']:checked").val() != null) {
					leader_data.push({
						"contact_id": $(this).val(),
						"leader_type": "1"
					});
				} else {
					leader_data.push({
						"contact_id": $(this).val(),
						"leader_type": "2"
					});
				}
			});
			if(leader_data.length == 0) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(leader_data);
			}
			var infoData = {
					"leader_data": leader_data
				}
				//设置负责人
			var setDepartPrincipalUrl = BSAPIURL + "/crm/offices/" + option.depaId + "/director";
			$.ajaxPost(setDepartPrincipalUrl, infoData, function(response) {
				if(response.code == 0) {
					$.showSuccessGritter("设置负责人成功！");
				} else {
					$.showErrorGritter("设置负责人失败：" + response.msg);
				}
			});
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function() {
		if(event.keyCode == 13) {
			return false;
		}
	});
	//点击换样式
	$(formContainerOfEmployee + " .search-menu").click(function() {
		$(this).addClass("select").siblings().removeClass("select");
	});
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
		if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		}
		selectEmpDoms.each(function() {
			var selDom = $(this).parent().parent();
			selDom.find("input").removeAttr("checked");
			//old
			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
			var selEmpId = $(this).val();
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
				$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
			var checkStr = "<label class='setlinkman' onclick='changeSetLinkman(this)'><input type='radio' name='fei' checked='checked'><span>主负责人</span></label>"
			var str = "<label class='setlinkman' onclick='changeSetLinkman(this)'><input type='radio' name='fei'><span>设为主负责人</span></label>"
			if($(formContainerOfEmployee + " .wrap-new .list-emp>li").length == 1) {
				$(formContainerOfEmployee + " .wrap-new .list-emp>li:first-child").append(checkStr);
			} else {
				$(formContainerOfEmployee + " .wrap-new .list-emp>li:last-child").append(str);
			}
		});
		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
		}
	});
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
			$(this).parent().parent().remove();
		});
		//$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
		//	var selDom = $(this).parent().parent();
		//	selDom.find("input").removeAttr("checked");
		//	//selDom.find("label").last().remove();
		//	$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
		//});
	});
	//加载员工列表
	$.ajaxGet(BSAPIURL + "/crm/contacts/?client_id=" + option.clientId + "&depa_id=" + option.depaId, function(response) {
		if(response.code == 0) {
			//success
			var employeeList = response.data.rows;
			var employeesGroupByPY = {};
			var pyArr = [];
			for(var i in employeeList) {
				var employeeData = employeeList[i];
				//拼音首字母
				var firstPY = (employeeData.contact_name_pinyin || "#").substring(0, 1).toUpperCase();
				if(!employeesGroupByPY[firstPY]) {
					employeesGroupByPY[firstPY] = [];
				}
				employeesGroupByPY[firstPY].push(employeeData);
				if(pyArr.indexOf(firstPY) == -1)
					pyArr.push(firstPY);
			}
			pyArr = pyArr.sort();
			//load py
			$(formContainerOfEmployee + " .wrap-source .py p").empty();
			for(var p in pyArr) {
				if(pyArr[p] == "#") {
					continue;
				}
				$(formContainerOfEmployee + " .wrap-source .py p").append("<a>" + pyArr[p] + "</a>");
			}
			$(formContainerOfEmployee + " .wrap-source .py p").append("<a>#</a>");
			//click event
			$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
				$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
				$(this).addClass("active");
				initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
			});
			//first load employee
			initEmployees4SetDeptLeader(employeeList);
			//已选人员
			if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
				for(var i in option.selectedEmployeeIds) {
					var empId = option.selectedEmployeeIds[i];
					for(var j in employeeList) {
						var employeeData = employeeList[j];
						if(employeeData.contact_id == empId) {
							var liDom = $("<li></li>");
							liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' data-employee-name=\"" + employeeData.contact_name + "\" value=\"" +

								employeeData.contact_id + "\"> <span>" +
								employeeData.employee_name + "</span><span>" +
								employeeData.depa_name + "</span><span>" + employeeData.employee_post_cn + "</span></label>");
							$(formContainerOfEmployee + " .wrap-new .list-emp").append(liDom);
						}
					}
				}
			}
		} else {
			$.showErrorGritter("加载员工列表失败：" + response.msg);
		}
	});

	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
		//alert("ss");
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
				continue;
			}
			var liDom = $("<li></li>");
			liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' data-employee-name=\"" + employeeData.contact_name + "\" value=\"" + employeeData.contact_id + "\"><span > " +
				employeeData.contact_name + "</span><span>" +
				employeeData.depa_name + "</span><span>" + employeeData.contact_positional_titles_cn + "</span></label>");
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
};

//客户单位选择
$.showClientEmployeeSelectPop = function(option) {
	var loadClientUrl = BSAPIURL + "/crm/clients/query?key=";
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-client").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-client hide\">" +
			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-client\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"box\">" +
			"				<div class=\"py\">" +
			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
			"					<input type=\"search\" class=\"search\" placeholder=\"请输入客户名称进行查找\" style=\"width: 100%;\"  onchange=\"searchClient(this)\" />" +
			"				</div>" +
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
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
			"				</p>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>已选择：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;

	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-client",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
				selectEmployees.push($(this).val());
			});
			if(selectEmployees.length == 0) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectEmployees);
			}
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);

	//关键字搜索
	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
		if(event.keyCode == 13 || isLoad == "all") {
			var url = loadClientUrl + $(this).val();
			$.ajaxGet(url, function(response) {
				if(response.code == 0) {
					//success
					var employeeList = response.data;
					//click event
					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
						$(this).addClass("active");
						initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
					});
					//first load employee
					initEmployees4SetDeptLeader(employeeList);
					//已选人员
					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
						var selectedEmployeeIdsObj = {};
						for(var i in option.selectedEmployeeIds) {
							var empId = option.selectedEmployeeIds[i].client_id || (option.selectedEmployeeIds[i].employee_id || option.selectedEmployeeIds[i]);
							selectedEmployeeIdsObj[empId] = empId;
						}
						defaultCheckedIds(selectedEmployeeIdsObj);
					}
				} else {
					$.showErrorGritter("加载员工列表失败：" + response.msg);
				}
			});
		}
	});
	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
		if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		}
		selectEmpDoms.each(function() {
			var selDom = $(this).parent().parent();
			selDom.find("input").removeAttr("checked");
			//old
			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
			var selEmpId = $(this).val();
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
				$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
		});
		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
		}
	});
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
			if(option.onlySingle) {
				$(this).parent().parent().remove();
			} else {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
					var selDom = $(this).parent().parent();
					selDom.find("input").removeAttr("checked");
					//selDom.find("label").last().remove();
					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
				});
			}
		});
	});
	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
		//alert("ss");
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
				continue;
			}
			var liDom = $("<li></li>");
			liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" + employeeData.client_id +
				"\"><span style='margin-left:10px'>" + employeeData.client_full_name + "</span></label>");
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
	//默认选中
	function defaultCheckedIds(ids) {
		$(formContainerOfEmployee + " input").each(function() {
			if(ids[$(this).val()]) {
				$(this).prop("checked", "checked");
			}
		});
		$(formContainerOfEmployee + " .btn-add").click();
	}
};
//选择客户部门、
$.showDeparmentEmployeeSelectPop = function(option) {
	var loadClientUrl = BSAPIURL + "/crm/client_depas/query?key=";
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-deparment").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-deparment hide\">" +
			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-deparment\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"box\">" +
			"				<div class=\"py\">" +
			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
			"					<input type=\"search\" class=\"search\" placeholder=\"请输入客户名称进行查找\" style=\"width: 100%;\" />" +
			"				</div>" +
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
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
			"				</p>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>已选择：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;

	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-deparment",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
				selectEmployees.push($(this).val());
			});
			if(selectEmployees.length == 0) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectEmployees);
			}
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
		if(event.keyCode == 13 || isLoad == "all") {
			var url = loadClientUrl + $(this).val();
			//加载员工列表
			$.ajaxGet(url, function(response) {
				if(response.code == 0) {
					//success
					var employeeList = response.data;
					//click event
					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
						$(this).addClass("active");
						initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
					});
					//first load employee
					initEmployees4SetDeptLeader(employeeList);
					//已选人员
					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
						var selectedEmployeeIdsObj = {};
						for(var i in option.selectedEmployeeIds) {
							var empId = option.selectedEmployeeIds[i].dept_id || (option.selectedEmployeeIds[i].depa_id || option.selectedEmployeeIds[i]);
							selectedEmployeeIdsObj[empId] = empId;
						}
						defaultCheckedIds(selectedEmployeeIdsObj);
					}
				} else {
					$.showErrorGritter("加载员工列表失败：" + response.msg);
				}
			});
		}
	});
	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
		if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		}
		selectEmpDoms.each(function() {
			var selDom = $(this).parent().parent();
			selDom.find("input").removeAttr("checked");
			//old
			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
			var selEmpId = $(this).val();
			var clientName = $(this).parent().parent().parent().prev().children("span").text();
			var clientId = $(this).parent().parent().parent().parent().attr("id");
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0) {
				var copyStr = option.onlySingle ? selDom.clone() : selDom;
				var id = $(copyStr).attr("id");
				$(formContainerOfEmployee + " .wrap-new .list-emp").append(copyStr);
				$(formContainerOfEmployee + " .wrap-new .list-emp #" + id).append("<span id=" + clientId + ">(" + clientName + ")</span>");
			}
		});
		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
		}
	});
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
			if(option.onlySingle) {
				$(this).parent().parent().remove();
			} else {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
					var selDom = $(this).parent().parent();
					selDom.find("input").removeAttr("checked");
					//selDom.find("label").last().remove();
					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
				});
			}
		});
	});

	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
		//alert("ss");
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
				continue;
			}
			var liDom = $("<li id='" + employeeData.client_id + "' style=\"margin-left:10px\"></li>");
			liDom.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span style=\"margin-left: 5px;vertical-align: bottom;\">" + employeeData.client_name + "</span></p><ul></ul>")
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
			if(employeeData.depas.length != 0) {
				for(var j in employeeData.depas) {
					$("#" + employeeData.client_id + ">ul").append("<li style=\"margin-left:30px\" id='" + employeeData.depas[j].depa_id + "'><label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" + employeeData.depas[j].depa_id +
						"\"><span style='margin-left:10px'>" + employeeData.depas[j].depa_name + "</span></label></li>");
				}
			}

		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
	//默认选中
	function defaultCheckedIds(ids) {
		$(formContainerOfEmployee + " input").each(function() {
			if(ids[$(this).val()]) {
				$(this).prop("checked", "checked");
			}
		});
		$(formContainerOfEmployee + " .btn-add").click();
	}
};
//选择客户联系人----------------------------------------------------------------------------
$.showLinkmansEmployeeSelectPop = function(option) {
	var loadClientUrl = BSAPIURL + "/crm/client_contacts/query?key=";
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-linkmans").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-linkmans hide\">" +
			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-linkmans\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"box\">" +
			"				<div class=\"py\">" +
			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
			"					<input type=\"search\" class=\"search\" placeholder=\"请输入客户单位进行查找\" style=\"width: 100%;\" />" +
			"				</div>" +
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
			"				<p>" +
			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
			"				</p>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"wrap wrap-new\">" +
			"			<label>已选择：</label>" +
			"			<div class=\"box\">" +
			"				<ul class=\"list-emp\">" +
			"				</ul>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;

	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-linkmans",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
				selectEmployees.push($(this).val());
			});
			if(selectEmployees.length == 0) {
				$.showErrorGritter("请先选择人员后再确认。");
				return false;
			}
			if(option.okCallback) {
				option.okCallback(selectEmployees);
			}
			modal.modal("hide");
		}
	);
	//model pop id
	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
	//关键字搜索
	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
		if(event.keyCode == 13 || isLoad == "all") {
			var url = loadClientUrl + $(this).val();
			//加载员工列表
			$.ajaxGet(url, function(response) {
				if(response.code == 0) {
					//success
					var employeeList = response.data;
					//click event
					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
						$(this).addClass("active");
						initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
					});
					//first load employee
					initEmployees4SetDeptLeader(employeeList);
					//已选人员
					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
						var selectedEmployeeIdsObj = {};
						for(var i in option.selectedEmployeeIds) {
							var empId = option.selectedEmployeeIds[i].emp_id || (option.selectedEmployeeIds[i].employee_id || option.selectedEmployeeIds[i]);
							selectedEmployeeIdsObj[empId] = empId;
						}
						defaultCheckedIds(selectedEmployeeIdsObj);
					}
				} else {
					$.showErrorGritter("加载员工列表失败：" + response.msg);
				}
			});
		}
	});
	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
		if(option.onlySingle && selectEmpDoms.length > 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
		}
		selectEmpDoms.each(function() {
			var selDom = $(this).parent().parent();
			selDom.find("input").removeAttr("checked");
			//old
			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
			var selEmpId = $(this).val();
			var departName = $(this).parent().parent().parent().prev().children("span").text();
			var clientName = $(this).parent().parent().parent().parent().parent().prev().children("span").text();
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0) {
				var copyStr = option.onlySingle ? selDom.clone() : selDom;
				var id = $(copyStr).attr("id");
				$(formContainerOfEmployee + " .wrap-new .list-emp").append(copyStr);
				$(formContainerOfEmployee + " .wrap-new .list-emp #" + id).append("<span class=\"copy-sp\">(" + clientName + "," + departName + ")</span>");
			}
		});
		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
		}
	});
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
			if(option.onlySingle) {
				$(this).parent().parent().remove();
			} else {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
					var selDom = $(this).parent().parent();
					selDom.find("input").removeAttr("checked");
					//selDom.find("label").last().remove();
					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
				});
			}
		});
	});
	// 

	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
		//alert("ss");
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
				continue;
			}
			var liDom = $("<li id='" + employeeData.client_id + "' style=\"margin-left:10px\"></li>");
			liDom.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span>" + employeeData.client_name + "</span></p><ul></ul>");
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
			if(employeeData.depas.length != 0) {
				for(var j in employeeData.depas) {
					var liDoms = $("<li id='" + employeeData.depas[j].depa_id + "' style=\"margin-left:30px\"></li>");
					liDoms.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span>" + employeeData.depas[j].depa_name + "</span></p><ul></ul>");
					$("#" + employeeData.client_id + ">ul").append(liDoms);
					if(employeeData.depas[j].contacts != 0) {
						for(var h in employeeData.depas[j].contacts) {
							$("#" + employeeData.depas[j].depa_id + ">ul").append("<li style=\"margin-left:30px\" id='" + employeeData.depas[j].contacts[h].contact_id +
								"'><label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" +
								employeeData.depas[j].contacts[h].contact_id +
								"\"><span style='margin-left:10px'>" + employeeData.depas[j].contacts[h].contact_name + "</span></label></li>");
						}
					}

				}
			}

		}
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}
	};
	//默认选中
	function defaultCheckedIds(ids) {
		$(formContainerOfEmployee + " input").each(function() {
			if(ids[$(this).val()]) {
				$(this).prop("checked", "checked");
			}
		});
		$(formContainerOfEmployee + " .btn-add").click();
	}
};

//设置负责人
function changeSetLinkman(obj) {
	if($(obj).children("input:radio[name='fei']:checked").val() != null) {
		$(obj).children('span').html('主负责人');
		$(obj).parent().siblings().find(".setlinkman").children("span").html("设为负责人")
	}
}
//搜索
function searchClient(obj) {
	if($(obj).parentAll().hasClass(".model-employee-select-common-client")) {

	} else if($(obj).parentAll().hasClass(".model-employee-select-common-deparment")) {

	} else {

	}
}
//树下拉上收
function treeZoom(obj) {
	if($(obj).children("i").hasClass("fa-caret-down")) {
		$(obj).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
		$(obj).next().slideUp();
	} else {
		$(obj).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
		$(obj).next().slideDown();
	}
}
//IM聊天----------------------------------------------------------------------start--------
$.fn.chat = function(option) { //点击的jquery对象
		console.log("When I wrote this, only God and I understood what I was doing. Now, God only knows");
		//加载聊天列表
		if($("body .chat-modal").length == 0) {
			var str = "";
			str += "<div class=\"news-left chat-modal pull-left\">";
			str += "<p class=\"chat-page-off\"><i class=\"fa fa-minus\" aria-hidden=\"true\"></i><i class=\"fa fa-power-off\" aria-hidden=\"true\"></i></p>";
			str += "<div class=\"news-left-top\">";
			str += "<input type=\"text\" class=\"top-search\" placeholder=\"搜索\" />";
			str += "<div class=\"search-list\">";
			str += "<span class=\"search-title\">联系人</span>";
			str += "<ul class=\"seach-firend\">";
			str += "</ul>";
			str += "<span class=\"search-title\">群组</span>";
			str += "<ul class=\"seach-group\">";
			str += "</ul>";
			str += "</div>";
			str += "<input type=\"button\" value=\"+\" class=\"top-add\" onclick=\"addGroup(event,this)\" />";
			str += "<input type=\"button\" value=\">\" class=\"top-takeback\" style=\"display:none;\"/>";
			str += "</div>";
			str += "<div class=\"news-left-menu\">";
			str += "<ul>";
			str += "<li class=\"checkstyle\" title=\"最近联系列表\">";
			str += "<i class=\"fa fa-commenting\" aria-hidden=\"true\"></i>";
			str += "</li>";
			str += "<li title=\"我的好友列表\">";
			str += "<i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i>";
			str += "</li>";
			str += "<li title=\"群列表\">";
			str += "<i class=\"fa fa-users\" aria-hidden=\"true\"></i>";
			str += "</li>";
			str += "<li style=\"position:relative;\" title=\"圈子\">";
			str += "<i class=\"fa fa-chrome\" aria-hidden=\"true\"></i>";
			str += "</li>";
			str += "</ul>";
			str += "</div>";
			str += "<div class=\"news-left-infolist\">";
			str += "<!--聊天-->";
			str += "<ul class=\"infolist-chatlist\">";
			str += "</ul>";
			str += "<!--好友-->";
			str += "<ul class=\"infolist-servicelist\">";
			str += "</ul>";
			str += "<!--群聊-->";
			str += "<ul class=\"infolist-grouplist\">";
			str += "<!--默认群-->";
			str += "<li data-grouptype=\"1\">";
			str += "<div onclick=\"openChat(this)\">";
			str += "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
			str += "<span class=\"tree-name\">普通群</span>";
			str += "<span class=\"tree-num\"></span>";
			str += "</div>";
			str += "<ul>";
			str += "</ul>";
			str += "</li>";
			str += "<!--部门群-->";
			str += "<li data-grouptype=\"2\">";
			str += "<div onclick=\"openChat(this)\">";
			str += "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
			str += "<span class=\"tree-name\">部门群</span>";
			str += "<span class=\"tree-num\"></span>";
			str += "</div>";
			str += "<ul>";
			str += "</ul>";
			str += "</li>";
			str += "<!--业务讨论群-->";
			str += "<li data-grouptype=\"3\">";
			str += "<div onclick=\"openChat(this)\">";
			str += "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
			str += "<span class=\"tree-name\">业务讨论组</span>";
			str += "<span class=\"tree-num\"></span>";
			str += "</div>";
			str += "<ul>";
			str += "</ul>";
			str += "</li>";
			str += "</ul>";
			str += "</div>";
			str += "</div>";
			$(this).append(str);
			$(this).css("position", 'relative');
			str = "";
			//			str += "<div class=\"add-group-page hide\">";
			//			str += "<label class=\"add-group\">群名称：<input type=\"text\" class=\"add-group-name\" ></label>";
			//			str += "</div>";
			//			str += "<!--添加群成员弹窗-->";
			//			str += "<div class=\"load-group-member-list hide\">";
			//			str += "<div class=\"modal-body-main\">";
			//			str += "<div class=\"modal-body-left pull-left\">";
			//			str += "<p class=\"body-left-menu\">请选择联系人:</p>";
			//			str += "<div class=\"body-left-content\">";
			//			str += "<div class=\"body-left-content-top\">";
			//			str += "<input type=\"text\" class=\"body-left-content-top-search\" value=\"\" placeholder=\"搜索姓名\" />";
			//			str += "</div>";
			//			str += "<div class=\"body-left-content-list\">";
			//			str += "<ul class=\"tree-list-a\">";
			//			str += "</ul>";
			//			str += "</div>";
			//			str += "</div>";
			//			str += "</div>";
			//			str += "<div class=\"modal-body-right pull-right\">";
			//			str += "<p class=\"body-left-menu\">群成员:<span class=\"pull-right\">已选<span class=\"select-num\">0</span>人</span>";
			//			str += "</p>";
			//			str += "<div class=\"body-left-content\">";
			//			str += "</div>";
			//			str += "</div>";
			//			str += "<div class=\"clearfix\"></div>";
			//			str += "</div>";
			//			str += "<div class=\"modal-body-buttom\">";
			//			str += "<input type=\"button\" class=\"btn btn-default add-group-member-btn\" value=\"确认\" />";
			//			str += "<input type=\"button\" class=\"btn btn-default back-btn\" value=\"上一步\" />";
			//			str += "</div>";
			//			str += "</div>";
			str += "<!--个人资料弹窗-->";
			str += "<div class=\"personal-info-page hide\">";
			str += "<div class=\"info-page-top\">";
			str += "<img src=\"../resources/images/case-4.png\" />";
			str += "<p class=\"info-page-data\">";
			str += "<span class=\"info-page-name\" bind=\"employee_name\"></span><br>";
			str += "<span class=\"info-page-post\"><span bind=\"depa_name\"></span><span bind=\"post_title\"></span></span>";
			str += "</p>";
			str += "<i class=\"fa fa-commenting-o\" aria-hidden=\"true\" onclick=\"parent.openChat(this)\"></i>";
			str += "<div class=\"clearfix\"></div>";
			str += "</div>";
			str += "<p class=\"info-page-phone info-list\"><span>办公电话</span><span class=\"phone-number\" bind=\"employee_office_phone\"></span></p>";
			str += "<p class=\"info-page-mobilephone info-list\"><span>手&#12288;&#12288;机</span><span class=\"mobilephone-number\" bind=\"employee_primary_mobile\"></span></p>";
			str += "<p class=\"info-page-E-mail info-list\"><span>邮&#12288;&#12288;箱</span><span class=\"E-mail-number\" bind=\"employee_email\"></span><i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i></p>";
			str += "<p class=\"info-page-QQ info-list\"><span>Q&#12288;&#12288;Q</span><span class=\"QQ-number\" bind=\"employee_qq\"></span>";
			str += "</p>";
			str += "<p class=\"info-page-weixin info-list\"><span>微&#12288;&#12288;信</span><span class=\"weixin-number\" bind=\"employee_wechat\"></span></p>";
			str += "</div>";
			$("body").append(str);
		}
		$(this).children("a").click(function() {
			//$(this).siblings(".list-num").remove();
			if($(".chat-modal").css("display") == "none") {
				$(".chat-modal").show();
				$(".chat-modal").animate({
					width: '300px',
					height: '646px',
					opacity: '1'
				}, 300);
				$(this).addClass("selectstyles");
			} else {
				$(".chat-modal").animate({
					width: '0px',
					height: '0px',
					opacity: '0'
				}, 300, function() {
					$(".chat-modal").hide();
					$(this).removeClass("selectstyles");
				});
			}
		});
		//搜索好友群组
		$(".top-search").keyup(function() {
			$(".seach-firend,.seach-group").empty();
			var searchText = $(this).val();
			var isOnline = "";
			$(".infolist-servicelist li[chat-type]").each(function() {
				var nameText = $(this).find(".tree-name").text();
				var nameId = $(this).attr('data-id');
				var avatar = $(this).find("img").attr('src');
				isOnline = $(this).attr('data-online');
				if(isConform(searchText, nameText)) {
					$(".seach-firend").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=\"2\" data-id=" + nameId + ">" + nameText + "</li>");

				}
				//				if(nameText.indexOf(searchText) >= 0) {
				//					$(".seach-firend").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=\"2\" data-id=" + nameId + ">" + nameText + "</li>");
				//				}
			});
			$(".infolist-grouplist li[chat-type]").each(function() {
				var nameText = $(this).find(".tree-name").text();
				var nameId = $(this).attr('data-id');
				var nameType = $(this).attr('chat-type');
				var avatar = $(this).find("img").attr('src');
				if(isConform(searchText, nameText)) {
					$(".seach-group").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=" + nameType + " data-id=" + nameId + ">" + nameText + "</li>");
				}
				//				if(nameText.indexOf(searchText) >= 0) {
				//					$(".seach-group").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=" + nameType + " data-id=" + nameId + ">" + nameText + "</li>");
				//				}
			});
			$(".search-list-data").click(function() {
				$.chatPage({
					type: $(this).attr("chat-type"),
					Id: $(this).attr("data-id"),
					Avatar: $(this).attr("data-avatar"),
					Name: $(this).text(),
					Online: isOnline
				});
			});
			$(".search-list").show();
			$("body").click(function(event) {
				if($(event.target).parents(".neparent.ws-left-top").length == 0) {
					$(".search-list").hide();
				}
			});
		});
		$(".infolist-chatlist").show().siblings().hide();
		//默认不登录IM
		//$(".chat-open").append("<i class=\"fa fa-exclamation\" aria-hidden=\"true\" title=\"已离线，点击重新登录！\"></i>");
		//var ws;
		ws = $.webSoket({
			wsServer: WSSERVER,
			protocal: WSPORT,
			isClientCustomer: true,
			onopenCallback: onopenCallback,
			onmessageCallback: onmessageCallback,
			onerrorCallback: onerrorCallback,
			oncloseCallback: oncloseCallback
		});

		window.regImgStr = /\[img_([\s\S]*?)\]/g;
		window.regFileStr = /^([\s\S]+?)\[.*\]$/i;
		window.regFaceStr = /\[em_f([0-9]*).gif\]/g;
		window.myId = "";
		window.myName = "";
		window.myAvatar = "";
		var addGroupName = "";
		var type = 1;
		window.isMinPage = false; //是否被最小化
		window.clickToInfo = function(data) {
			//data = JSON.parse(data);
			var fullName = "同事圈";
			//alert(myId + "," + myName + "," + myAvatar);
			window.parent.openTab(fullName, "views/im-news.html");
		}
		$(".top-takeback,.fa-minus").click(function() {
			$(".news-left").animate({
				width: '0px',
				height: '0px',
				opacity: '0'
			}, 300, function() {
				$(".chat-modal").hide();
			});
		});
		//退出IM
		$(".fa-power-off").click(function() {
			$(".news-left").animate({
				width: '0px',
				height: '0px',
				opacity: '0'
			}, 300, function() {
				$(".chat-modal").hide();
				//ws.onsend(83, {});
				ws.onsend(4, {}, function(data) {
					if(data.action == 500) {
						$.showErrorGritter("退出失败！");
						return false;
					}
					underLine(data);
				});

			});
			//圈子关闭
			$("#tab-menu li a[title=同事圈] i").trigger('click');
			$(".chat-open .fa-exclamation").unbind('click').click(function() {
				$(this).remove();
				//启动websocket
				ws = $.webSoket({
					wsServer: WSSERVER,
					protocal: WSPORT,
					isClientCustomer: true,
					onopenCallback: onopenCallback,
					onmessageCallback: onmessageCallback,
					onerrorCallback: onerrorCallback,
					oncloseCallback: oncloseCallback
				});
				$(".chat-modal").show();
				$(".chat-modal").animate({
					width: '300px',
					height: '646px',
					opacity: '1'
				}, 300);
			});
		});
		$(".news-left-menu li").click(function() {
			if($(this).index() == 3) {
				clickToInfo();
				//跳转到圈子
				//				if($(this).find(".all-friend-dynamic-num").length != 0) {
				//					var infoNum = parseInt($(".chat-open>.list-num").text()) - parseInt($(this).find(".all-friend-dynamic-num").text());
				//					if(infoNum != 0) {
				//						$(".chat-open .list-num").text(infoNum);
				//					} else {
				//						$(".chat-open .list-num").remove();
				//					}
				//				}
				if($(this).find(".all-friend-dynamic-num").length != 0) nuReadNum = $(this).find(".all-friend-dynamic-num").text();
				$(this).find(".new-info-reminder").remove();
			} else {
				$(this).addClass("checkstyle");
				$(this).siblings().removeClass("checkstyle");
				$(".news-left-infolist>ul").eq($(this).index()).show().siblings().hide();
				if($(this).index() == 0) {
					//查询最近好友
					ws.onsend(22, {});
				} else if($(this).index() == 1) {
					//查询企业好友
					ws.onsend(20, {});
				} else {
					//查询群组
					ws.onsend(21, {});
				}
			}

		});

		function onopenCallback(data) {
			console.log("启动成功");
			ws.onsend(20, {});
			ws.onsend(21, {});
			ws.onsend(22, {});
			ws.onsend(46, {});
			ws.onsend(80, {});
		}
		//------------消息队列相关-----------------------
		var publisher = parent.HHMQ.createPublisher('接收消息', 'main');
		//页面关闭事件
		context.onPageClose = function() {
			publisher.dispose();
		};
		//------------消息队列相关 end -------------------
		////收到消息的回调
		function onmessageCallback(data) {
			switch(data.action) {
				case 1:
					//receiveConfig(data);
					break; //1 - 配置信息（登录成功后，server发送配置信息到client，包含心跳频率及其他配置）
				case 2:
					//receiveHeartBeat(data);
					break; //2 - 心跳包（client通过收到的发送频率主动发送心跳包到server）
				case 3:
					onLine(data);
					break; // 3 - 用户上线 （client主动发起）
				case 4:
					underLine(data);
					break; //  4 - 用户下线 （手动退出，或能捕获的异常退出时，client主动发起）
				case 5:
					receiveNewUserOnline(data);
					break; // 5 - 新用户上线 （server主动推送到client）
				case 6:
					receiveUserUnderline(data);
					break; //6 - 用户下线 （server->client）
				case 7:
					receiveClientSessionExpired(data);
					break; // 7 - 客户端session过期 ，过期后将不能做任何业务操作，客户端收到该消息后退出IM（server->client）
				case 11:
					forcedOffline(data);
					break; //被挤下去通知
				case 20:
					loadFirendList(data);
					break; //20 - 好友列表 （client发起，server再回发）
				case 21:
					loadGroupList(data);
					break; //21 - 群组列表 （client发起，server再回发）
				case 22:
					loadLatelyFirendList(data);
					break; //22 - 最近联系人列表 （client发起，server再回发）
				case 23:
					addGroupInform(data);
					break; //23 - 创建群 （client发起，server再回发）
				case 24:
					break; //24 - 查询群成员 （client发起，server再回发）
				case 25:
					addGroupThemeInform(data);
					break; //新建群话题通知
				case 26:
					deteleGroupThemeInform(data);
					break; //关闭群话题通知
				case 29:
					transferGroupInform(data);
					break; //转让群通知
				case 30:
					dissolveGroupInform(data);
					break; //30 - 解散群 （client发起，server再回发）
				case 32:
					setGroupAdministrator(data);
					break; //设置群管理员
				case 34:
					joinGroupInform(data);
					break; //34 - 添加群成员 （client发起，server再回发）
				case 39:
					outGroupInform(data);
					break; //被踢出群通知
				case 40:
					receiveSingleChart(data);
					break; // 40 - 聊天 单聊
				case 41:
					receiveGroupChart(data);
					break; // 41 - 聊天 群聊
				case 42:
					infoReadInform(data);
					break; //消息已读通知
				case 46:
					loadNoReadInfoNum(data);
					break; // 41 - 未读消息receiveInform
				case 50:
					receiveInform(data);
					break; // 41 - 未读消息
				case 61:
					newFriendDynamicInform(data);
					break; // 61 - 新好友动态
				case 67:
					newMyDynamicInform(data);
					break; // 67 -新与我相关动态
				case 80:
					loadSupportStaff(data);
					break; // 获取客服列表
				case 81:
					supportStaffOnLineInform(data);
					break; //客服上线通知
				case 82:
					receiveLeaderChart(data);
					break; //接收客服信息
				case 83:
					supportStaffUnlineInform(data);
					break; //客服下线通知
				case 87:
					supportStaffInfoRead(data);
					break; //客服消息已读通知
				default:
					//receiveSingleChart(data);
			}
		}
		//用户上线
		function onLine(data) {
			var firendData = data.data;
			console.log(firendData);
			myId = data.data.employee_id;
			myName = data.data.employee_name;
			myAvatar = data.data.employee_avatar;
			$(".chat-open .fa-exclamation").remove();
		}

		function underLine(data) { //手动退出
			console.log("退出成功")
			console.log(data.data);
			//ws.close();
			wsHeartBeat = null;
			ws = null;
			$(".bottom-menu li:first-child").append("<i class=\"fa fa-exclamation\" aria-hidden=\"true\" title=\"已离线，点击重新登录！\"></i>");
			$("#msg").append("<i class=\"fa fa-exclamation\" aria-hidden=\"true\" title=\"已离线，点击重新登录！\"></i>");
			$(".chat-open").append("<i class=\"fa fa-exclamation\" aria-hidden=\"true\" title=\"已离线，点击重新登录！\"></i>");
			$(".chat-page").remove();
			$(".menu-bar .fa-exclamation").unbind('click').click(".chat-open .fa-exclamation", function(event) {
				var e = window.event || event;
				if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
					e.stopPropagation();
				} else {
					//兼容IE的方式来取消事件冒泡 
					window.event.cancelBubble = true;
				}
				$(".menu-bar .fa-exclamation").remove();
				//启动websocket
				ws = $.webSoket({
					wsServer: WSSERVER,
					protocal: WSPORT,
					isClientCustomer: true,
					onopenCallback: onopenCallback,
					onmessageCallback: onmessageCallback,
					onerrorCallback: onerrorCallback,
					oncloseCallback: oncloseCallback
				});
				$(".chat-modal").show();
				$(".chat-modal").animate({
					width: '300px',
					height: '646px',
					opacity: '1'
				}, 300);
			});
		}
		//		$(document).ready(function(){
		//ws.onsend(4, {}, "", true);
		//			ws.manualLeave();
		//		});
		function addGroupInform(data) {
			console.log("收到一条新建群");
			console.log(data);
			ws.onsend(21, {});
		}

		function addGroupThemeInform(data) { //群话题修改新增通知
			console.log(data);
			loadGroupDiscussionList(data.data, "2");
			//群话题更新到最新
			$(".infolist-grouplist li[data-id=" + data.data.group_id + "]").removeData("theme").data("theme", data.data);
		}

		function deteleGroupThemeInform(data) {
			console.log(data);
			//清除data
			$(".infolist-grouplist li[data-id=" + data.data.group_id + "]").removeData("theme");
			if($(".infolist-grouplist li[data-id=" + data.data.group_id + "]").parents("li").attr("data-grouptype") != 3) {
				if($("#" + data.data.group_id).length != 0) {
					$(".chat-page-modal-content[data-id=" + data.data.group_id + "] .discussion-content").remove();
					$(".chat-page-modal-content[data-id=" + data.data.group_id + "] .chat-info").css("height", "455px");
					//页面显示通知
					$(".chat-page-modal-content[data-id=" + data.data.group_id + "] .chat-info").append("<p class=\"chat-annunciate\"><span>" +
						data.data.topic_closed_by.employee_name + "关闭了讨论<a href=\"javascript:;\" data-title=" +
						data.data.topic_title + " class=\"discussion-again-add\">重新添加</a></span></p>");
					$(".chat-page-modal-content[data-id=" + data.data.group_id + "] .chat-info").scrollTop($(".chat-page-modal-content[data-id=" + data.data.group_id + "] .chat-info")[0].scrollHeight);
				}
			} else {
				if($("#" + data.data.group_id).length != 0) {
					$("#" + data.data.group_id + " .list-detele").trigger("click");
				}
				var num = parseInt($(".infolist-chatlist li[data-id=" + data.data.group_id + "] .list-num").text());
				//删除该群的最近列表和群列表
				$(".infolist-chatlist li[data-id=" + data.data.group_id + "]").remove();
				ws.onsend(21, {});
				//关闭弹窗
				$(".modal[data-id=" + data.data.group_id + "]").modal("hide");
				informNumChange("reduce", data.data.group_id, num);
			}
		}

		function newFriendDynamicInform(data) { //新圈子通知
			publisher.publisheMsg({
				action: data.action,
				msg: data
			});
			hasOpenChatPage(data, "3");
		}

		function newMyDynamicInform(data) { //新动态通知
			publisher.publisheMsg({
				action: data.action,
				msg: data
			});
			hasOpenChatPage(data, "4");
			if($(".chat-open>.list-num").length == 0) {
				$(".chat-open").append("<span class=\"info-num list-num\">1</span>");
			} else {
				var noReadNum = parseInt($(".chat-open>.list-num").text());
				$(".chat-open>.list-num").text(noReadNum + 1);
			}
		}
		//发生错误时的回调
		function onerrorCallback(data) {

		}
		//关闭时的回调
		function oncloseCallback(data) {

		}
		//登录过期
		function receiveClientSessionExpired(data) {
			$.showErrorGritter("登录过期，请重新登录！");
		}

		function forcedOffline(data) { //强制下线通知
			console.log(data);
			//关闭操作
			$(".chat-page-modal").remove();
			$(".news-left").animate({
				width: '0px',
				height: '0px',
				opacity: '0'
			}, 300, function() {
				$(".chat-modal").hide();
				$(".chat-open").append("<i class=\"fa fa-exclamation\" aria-hidden=\"true\" title=\"已离线，点击重新登录！\"></i>");

			});

		}
		//好友下线6
		function receiveUserUnderline(data) {
			console.log(data.data);
			var onlineData = data.data;
			$("li[data-id=" + onlineData.employee_id + "] .avatar-img").addClass("underline");
			$("li[data-id=" + onlineData.employee_id + "]").attr("data-online", false);
			$("li[id=" + onlineData.employee_id + "] .avatar-img").addClass("underline");
			$("li[id=" + onlineData.employee_id + "]").attr("data-online", false);
			$(".chat-page-modal-content[data-id=" + onlineData.employee_id + "] .avatar-img").addClass("underline");
		}
		//好友上线5
		function receiveNewUserOnline(data) {
			console.log(data.data);
			var onlineData = data.data;
			$("li[data-id=" + onlineData.employee_id + "] .avatar-img").removeClass("underline");
			$("li[data-id=" + onlineData.employee_id + "]").attr("data-online", true);
			$("li[id=" + onlineData.employee_id + "] .avatar-img").removeClass("underline");
			$("li[id=" + onlineData.employee_id + "]").attr("data-online", true);
			$(".chat-page-modal-content[data-id=" + onlineData.employee_id + "] .avatar-img").removeClass("underline");
		}
		//获取未读消息和未读动态消息
		window.nuReadNum = 0;

		function loadNoReadInfoNum(data) {
			if(data.data.unread_notify_num != 0)
				$("#msg a").append("<span class=\"badge badge-danger icon-animated-bell\">" + data.data.unread_notify_num + "</span>");
			console.log(data.data);
			var noReadInfoAllNum = data.data.unread_feeds_num + data.data.unread_messages_num + data.data.unread_moments_num;
			var str = "";
			if(data.data.unread_feeds_num == 0) { //没有关于我的动态消息
				if(data.data.unread_moments_num != 0) { //有好友的动态
					str = "<span class=\"info-num new-info-reminder\"></span>";
				}
			} else {
				nuReadNum = data.data.unread_feeds_num;
				str = "<span class=\"info-num all-friend-dynamic-num\">" + data.data.unread_feeds_num + "</span>";
			}
			$(".news-left-menu li .fa-chrome").after(str);
			var allNum = parseInt(data.data.unread_messages_num) + parseInt(data.data.unread_feeds_num);
			if(allNum != 0) {
				$(".chat-open>.info-num").remove();
				$(".chat-open").append('<span class=\"info-num list-num \">' + allNum + '</span>');
			}

		}
		$(".news-left-infolist>ul").mCustomScrollbar({
			theme: "light-3",
			scrollInertia: 1000,
			scrollButtons: {
				enable: true
			}
		});
		//最近联系人列表
		function loadLatelyFirendList(data) {
			//			$(".infolist-chatlist").mCustomScrollbar({
			//				theme: "light-3",
			//				scrollButtons: {
			//					enable: true
			//				}
			//			});
			var latelyFirendListData = data.data;
			//清除
			$(".infolist-chatlist .mCSB_container").empty();
			for(var i in latelyFirendListData) {
				var type = "";
				if(latelyFirendListData[i].msg_session_id == "BusinessNotifier") {
					type = "5";
				}
				var strsContentText = "";
				if(latelyFirendListData[i].last_message != null) {
					var chatInfo = latelyFirendListData[i].last_message;
					var chatContent = chatInfo.message_content;
					if(chatInfo.message_type == 1) {
						if(latelyFirendListData[i].msg_session_type == 2) {
							strsContentText = chatContent.replace(regFileStr, '$1[文件]');
						} else {
							strsContentText = "[文件]";
						}
					} else if(chatInfo.message_type == 2) {

						chatContent = chatContent.replace(regImgStr, '[图片]');
						chatContent = chatContent.replace(regFaceStr, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
						if(latelyFirendListData[i].group_at_num != 0) {
							strsContentText = "<span class=\"at-me\" style=\"color:red;display:inline\">[有人@我]</span>" + chatContent;
						} else {
							strsContentText = chatContent;
						}

					} else if(chatInfo.message_type == 3) {
						if(latelyFirendListData[i].msg_session_type == 2) {
							strsContentText = chatContent.replace(/[\S]+$/g, '[视频]');

						} else {
							strsContentText = "[视频]";
						}

					} else if(chatInfo.message_type == 4) {
						if(latelyFirendListData[i].msg_session_type == 2) {
							strsContentText = chatContent.replace(/[\S]+$/g, '[语音]');
						} else {
							strsContentText = "[语音]";
						}
					}
				}
				var str = "";
				str += "<li onclick=\"openChat(this)\" data-avatar='" + latelyFirendListData[i].avatar + "' chat-type=" + (type == "" ? (latelyFirendListData[i].msg_session_type == '2' ? '1' : '2') : type) + " data-id=" + latelyFirendListData[i].msg_session_id + " data-online=" + latelyFirendListData[i].is_online + ">";
				str += "<img src='" + (latelyFirendListData[i].avatar == "undefined" ? "" : latelyFirendListData[i].avatar) + "' class=\"" + (latelyFirendListData[i].msg_session_type == 1 ? "avatar-img" + (latelyFirendListData[i].is_online ? "" : " underline") : "") + " infolist-left pull-left\" />";
				str += "<div class=\"infolist-right pull-right\">";
				str += "<p class=\"infolist-right-top\">";
				str += "<span class=\"tree-name css-overhidden\" title=" + latelyFirendListData[i].title + ">" + latelyFirendListData[i].title + "</span>";
				str += "<span class=\"infolist-time\">" + isTodayOrYesterday(changeDate(latelyFirendListData[i].recent_time)) + "</span>";
				str += "</p>";
				str += "<p class=\"infolist-right-newinfo \"><span class=\"news-info-text\">" + strsContentText + "</span>" + (latelyFirendListData[i].unread_num != 0 ? "<span class=\"info-num list-num\">" + latelyFirendListData[i].unread_num + "</span>" : "") + "<span class=\"info-num list-detele\">×</span></p>";
				str += "</div>";
				str += "</li>";
				$(".infolist-chatlist .mCSB_container").append(str);
				//删除事件
				$(".infolist-right-newinfo .list-detele").unbind("click").click(function(event) {
					var e = window.event || event;
					if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
						e.stopPropagation();
					} else {
						//兼容IE的方式来取消事件冒泡 
						window.event.cancelBubble = true;
					}
					var obj = this;
					var num = parseInt($(this).siblings(".list-num").text());
					var chatId = $(this).parent().parent().parent().attr('data-id');
					var chatTypes = ($(this).parent().parent().parent().attr("chat-type") == "1" ? "2" : "1");
					ws.onsend(37, {
						"msg_session_id": chatId,
						"msg_session_type": chatTypes
					}, function(data) {
						if(data.action == 200) {
							informNumChange("reduce", chatId, num);
							$(obj).parent().parent().parent().remove();
							$("#" + chatId + " .list-detele").trigger("click");
						}
					});
				});
			}
			//判断是否是讨论群
			ws.onsend(21, {}, function(data) {
				if(data.action == 200) return false;
				var groupData = data.data;
				$(".infolist-chatlist>li").each(function(index) {
					var groupId = $(this).attr("data-id");
					for(var i in groupData) {
						if(groupData[i].group_id == groupId && groupData[i].group_type == "3") {
							$(this).attr("chat-type", "6");
						}
					}
				});
			});
		}
		window.isConform = function(keyWord, name) {
			console.log("关键字：" + keyWord + "，姓名：" + name);
			keyWord = keyWord.toLocaleLowerCase();
			console.log("转换过后的搜索关键字：" + keyWord)
			var allStr = pinyin.getFullChars(name).toLocaleLowerCase(); //全拼
			console.log("姓名全拼：" + allStr);
			var shortStr = pinyin.getCamelChars(name).toLocaleLowerCase(); //首拼
			console.log("姓名首拼：" + shortStr);
			if(name.indexOf(keyWord) >= 0 || allStr.indexOf(keyWord) >= 0 || shortStr.indexOf(keyWord) >= 0) {
				console.log("检索结果：正确");
				return true;
			}
			console.log("检索结果：错误");
			return false;
		}

		//获取好友列表
		function loadFirendList(data) {
			console.log(data.data)
			var firendListData = data.data;
			$(".infolist-servicelist .mCSB_container").empty(); //清除
			var companyManNumber = 0;
			loadFirendTree(firendListData, ".infolist-servicelist .mCSB_container", "1", "1");
			$(".infolist-servicelist").mCustomScrollbar("update");
		}

		window.loadFirendTree = function(data, parentId, type, level) { //加载好友树据
			if(data.action == 200) return false;
			if(type == 1) { //好友列表
				var treeStr = "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
				var numStr = "<span class=\"tree-num\">{NUMBER}人</span>";
				var addGroupStr = "<span class=\"tree-add\" onclick=\"addGroup(event,this)\">+</span>";
				var avatarStr = "<img src=\"{AVATAR_SRC}\" class=\"avatar-img {AVATAR_STYPE}\">";
				var clickStr = "onclick=\"openChat(this)\"";
				var avatarDataStr = "data-avatar=\"{AVATAR_SRC}\"";
				var isJianStr = "<img src=\"../resources/images/jianzhi.png\" class=\"jian\" title=\"此人是兼职管理本部门\">";
				for(var i in data) {
					var str = "";
					str += "<li data-id={ID} {MAN_CLICK} {DATA_AVATAE} {TYPE} {ONLINE}>";
					str += "<div {DEPAR_CLICK} data-id={ID}>{TREE}{AVATAR}";
					str += "<span class=\"tree-name css-overhidden\">{NAME}</span>{JIAN}";
					str += "{NUM}{ADD}</div>";
					str += "<ul>";
					str += "</ul>";
					str += "</li>";

					if(level == "1") { //单位部门
						str = str.replace(/{ID}/g, data[i].depa_id);
						str = str.replace(/{NAME}/, data[i].depa_name);
						str = str.replace(/{TREE}/, treeStr);
						str = str.replace(/{NUM}/, numStr);
						str = str.replace(/{NUMBER}/, data[i].employee_num);
						str = str.replace(/{DEPAR_CLICK}/, clickStr);
						str = str.replace(/{AVATAR}/, "");
						str = str.replace(/{JIAN}/, "");
						if(data[i].is_leader) {
							str = str.replace(/{ADD}/, addGroupStr);
						} else {
							str = str.replace(/{ADD}/, "");
						}
					} else { //人
						if(!data[i].employee_enabled) continue;
						var onlineDataStr = "data-online=" + data[i].is_online + "";
						str = str.replace(/{ID}/g, data[i].employee_id);
						str = str.replace(/{NAME}/, data[i].employee_name);
						str = str.replace(/{MAN_CLICK}/, clickStr);
						str = str.replace(/{TYPE}/, "chat-type=2");
						str = str.replace(/{ONLINE}/, onlineDataStr);
						str = str.replace(/{DATA_AVATAE}/, avatarDataStr);
						str = str.replace(/{AVATAR}/, avatarStr);
						str = str.replace(/{AVATAR_SRC}/g, data[i].employee_avatar == "" ? "" : data[i].employee_avatar);
						str = str.replace(/{AVATAR_STYPE}/, data[i].is_online ? "" : "underline");
						str = str.replace(/{TREE}/, "").replace(/{NUM}/, "").replace(/{ADD}/, "");
						if(data[i].is_part_time_leader) {
							str = str.replace(/{JIAN}/, isJianStr);
						} else {
							str = str.replace(/{JIAN}/, "");
						}
						//$(".infolist-servicelist li[data-id=" + parentId + "]>ul").append(str);
					}
					if(level == 2 && data[i].is_part_time_leader) {
						$(parentId).prepend(str);
					} else {
						$(parentId).append(str);
					}
					if(data[i].sub_departments && data[i].sub_departments.length != 0) {
						loadFirendTree(data[i].sub_departments, ".infolist-servicelist li[data-id=" + data[i].depa_id + "]>ul", "1", "1");
					}
					if(data[i].employees && data[i].employees.length != 0) {
						loadFirendTree(data[i].employees, ".infolist-servicelist li[data-id=" + data[i].depa_id + "]>ul", "1", "2");
					}

				}
			} else if(type == 2 || type == 3) { //添加群成员
				var treeStr = "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
				var typeStr = "data-type=1";
				for(var i in data) {
					var str = "";
					str = "<li class=\"\" data-id={ID}>";
					str += "<div class=\"tree-info {CLASS}\" {TYPE} data-id={ID}>{TREE}";
					//str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
					str += "<span class=\"tree-name\">{NAME}</span>";
					str += "</div>";
					str += "<ul>";
					str += "</ul>";
					str += "</li>";
					if(level == 1) { //单位部门
						str = str.replace(/{ID}/g, data[i].depa_id).replace(/{NAME}/, data[i].depa_name);
						str = str.replace(/{TREE}/, treeStr).replace(/{CLASS}/, "tree-menu");

					} else { //人
						if(!data[i].employee_enabled) continue;
						str = str.replace(/{ID}/g, data[i].employee_id).replace(/{NAME}/, data[i].employee_name);
						str = str.replace(/{TREE}/, "").replace(/{CLASS}/, "tree-bottom").replace(/{TYPE}/, typeStr);
					}
					$(parentId).append(str);
					if(data[i].sub_departments && data[i].sub_departments.length != 0) {
						loadFirendTree(data[i].sub_departments, parentId + " li[data-id=" + data[i].depa_id + "]>ul", "2", "1");
					}
					if(data[i].employees && data[i].employees.length != 0) {
						loadFirendTree(data[i].employees, parentId + " li[data-id=" + data[i].depa_id + "]>ul", "2", "2");
					}
				}
			} else { //转发好友列表

			}

		}
		window.groupListData = "";

		function loadGroupList(data) { //获取群组
			console.log(data);
			$(".infolist-grouplist li[data-grouptype]>ul").empty(); //清空
			groupListData = data.data;
			for(var i in groupListData) {
				var str = "";
				str += "<li onclick=\"openChat(this)\" data-depaid=" + groupListData[i].group_depa_id + " data-avatar='" + groupListData[i].group_avatar + "' chat-type=" + (groupListData[i].group_type == 3 ? "6" : "1") + " data-id=" + groupListData[i].group_id + ">";
				str += "<img src=" + (groupListData[i].group_avatar == "undefined" ? "" : groupListData[i].group_avatar) + ">";
				str += "<span class=\"tree-name css-overhidden\">" + groupListData[i].group_desc + "</span>";
				str += "</li>";
				$(".infolist-grouplist li[data-grouptype=" + groupListData[i].group_type + "]>ul").append(str);
				$(".infolist-grouplist li[data-id=" + groupListData[i].group_id + "]").data("theme", groupListData[i].topic);
			}
			console.log($(".news-left-infolist>ul li").length);
			$(".infolist-grouplist li").each(function(index) {
				var num = $(this).find("li[chat-type]").length;
				$(this).children("div").children(".tree-num").html(num + "个");
			});
			$(".infolist-grouplist").mCustomScrollbar("update");
		}
		//接收消息---单人
		function receiveSingleChart(data) {
			console.log("收到一条单人消息：");
			console.log(data);
			var isload = hasOpenChatPage(data, "1");
			if(!isload) return false;
			var temporaryInfoText = "";
			if($(".chat-page-modal").length != 0) {
				var receiveChatMainData = unescape(data.data.message_content);
				console.log(receiveChatMainData);
				var openPage = ".chat-page-modal-content[data-id=" + data.data.message_send_by.employee_id + "]";
				var starTime = $(openPage + " .chat-info>div").last().attr("data-time");
				!isDifferTime(starTime, changeDate(data.data.message_time)) ? $(openPage + " .chat-info").append("<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(changeDate(data.data.message_time), true) + "</p>") : "";
				if(data.data.message_type == 1) { //文件
					receiveChatMainData = receiveChatMainData.replace(/^\[file_([\s\S]*)\]$/g, "$1");
					temporaryInfoText = "[文件]";
					receiveChatMainData = JSON.parse(receiveChatMainData);
					console.log(receiveChatMainData);
					var fileType = receiveChatMainData.ext;
					if(fileType == "7z") fileType = "zip";
					if(fileType == "jpeg") fileType = "jpg";
					var str = "";
					str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.employee_id + " data-path=" + receiveChatMainData.path + ">";
					str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
					str += "<img src='" + avatarSrc + "' class=\"pull-left\">";
					str += "<p class=\"chat-info-name\">" + $(showPage + " .info-name").text() + "</p>";
					str += "<div class=\"demo clearfix\">";
					str += "<span class=\"triangle\"></span>";
					str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + receiveChatMainData.name + "</div>";
					str += "</div>";
					str += "</div>";
					//判断时间是否超过1min--
					$(openPage + " .chat-info").append(str);
					$("#" + data.data.message_id).data("fileData", receiveChatMainData);
				} else if(data.data.message_type == 2) { //文本图片
					//receiveChatMainData = receiveChatMainData.replace(/\[txt_([\S]*)\]/g, "$1");
					receiveChatMainData = receiveChatMainData.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
					receiveChatMainData = receiveChatMainData.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
					temporaryInfoText = receiveChatMainData.replace(/\[img_([\s\S]*?)\]/g, '[图片]');
					temporaryInfoText = temporaryInfoText.replace(/\[em_f([0-9]*).gif\]/g, '[表情]');
					console.log(receiveChatMainData)
					var str = "";
					str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.employee_id + ">";
					if($(openPage).attr("data-chat-type") != 2) {
						str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
					}
					str += "<img src='" + avatarSrc + "' class=\"pull-left\">";
					str += "<p class=\"chat-info-name\">" + $(openPage + " .info-name").text() + "</p>";
					str += "<div class=\"demo clearfix\">";
					str += "<span class=\"triangle\"></span>";
					str += "<div class=\"article\">" + receiveChatMainData + "</div>";
					str += "</div>";
					str += "</div>";

					$(openPage + " .chat-info").append(str);
				} else if(data.data.message_type == 3) { //视频
					temporaryInfoText = "[视频]";
					var str = "";
					str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.employee_id + ">";
					//					if($(showPage).attr("data-chat-type") != 2) {
					//						str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"chat-copy\">复制</span>|<span class=\"chat-transpond\">转发</span></p>";
					//					}
					str += "<img src='" + avatarSrc + "' class=\"pull-left\">";
					str += "<p class=\"chat-info-name\">" + $(openPage + " .info-name").text() + "</p>";
					str += "<div class=\"demo clearfix\">";
					str += "<span class=\"triangle\"></span>";
					str += "<div class=\"article\"><video width=\"320\" height=\"240\" controls src=" + receiveChatMainData + "></video></div>";
					str += "</div>";
					str += "</div>";
					$(openPage + " .chat-info").append(str);
				} else if(data.data.message_type == 4) { //音频
					temporaryInfoText = "[语音]";
					var str = "";
					str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.employee_id + " data-path=" + receiveChatMainData[0].path + ">";
					//str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
					str += "<img src='" + avatarSrc + "' class=\"pull-left\">";
					str += "<p class=\"chat-info-name\">" + $(openPage + " .info-name").text() + "</p>";
					str += "<div class=\"demo clearfix\">";
					str += "<span class=\"triangle\"></span>";
					str += "<div class=\"article\"><audio controls><source src=" + receiveChatMainData + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
					str += "</div>";
					str += "</div>";
					//判断时间是否超过1min
					$(openPage + " .chat-info").append(str);
				} else if(data.data.message_type == 5) { //图片--app专享
					receiveChatMainData = '<img class="chat-image" src="'+BASEAPIURL + receiveChatMainData + '" border="0" />';
					temporaryInfoText = "[图片]";
					console.log(receiveChatMainData)
					var str = "";
					str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.employee_id + ">";
					if($(openPage).attr("data-chat-type") != 2) {
						str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
					}
					str += "<img src='" + avatarSrc + "' class=\"pull-left\">";
					str += "<p class=\"chat-info-name\">" + $(openPage + " .info-name").text() + "</p>";
					str += "<div class=\"demo clearfix\">";
					str += "<span class=\"triangle\"></span>";
					str += "<div class=\"article\">" + receiveChatMainData + "</div>";
					str += "</div>";
					str += "</div>";
					$(openPage + " .chat-info").append(str);
				}
				//滚动到底部
				$(openPage + " .chat-info").scrollTop($(openPage + " .chat-info")[0].scrollHeight);

				console.log(temporaryInfoText);
				bindIncident(); //绑定事件
			}
		}
		//接收消息--群发
		function receiveGroupChart(data) {
			console.log("收到一条群消息：");
			console.log(data);
			var isload = hasOpenChatPage(data, "2");
			if(!isload) return false;
			var temporaryInfoText = "";
			var receiveChatMainData = unescape(data.data.message_content);
			var openPage = ".chat-page-modal-content[data-id=" + data.data.group_id + "]";
			var starTime = $(openPage + " .chat-info>div").last().attr("data-time");
			!isDifferTime(starTime, changeDate(data.data.message_time)) ? $(openPage + " .chat-info").append("<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(changeDate(data.data.message_time)) + "</p>") : "";
			console.log(showChatId + "|" + data.data.from_group);
			if(data.data.message_type == 1) { //文件
				receiveChatMainData = receiveChatMainData.replace(/^\[file_([\s\S]*)\]$/g, "$1");
				receiveChatMainData = JSON.parse(receiveChatMainData);
				temporaryInfoText = "[文件]";
				console.log(receiveChatMainData);
				var fileType = receiveChatMainData.ext;
				if(fileType == "7z") fileType = "zip";
				if(fileType == "jpeg") fileType = "jpg";
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.group_id + " data-path=" + receiveChatMainData.path + ">";
				str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
				str += "<img src='" + data.data.message_send_by.employee_avatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + data.data.message_send_by.employee_name + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + receiveChatMainData.name + "</div>";
				str += "</div>";
				str += "</div>";
				//判断时间是否超过1min
				$(openPage + " .chat-info").append(str);
				$("#" + data.data.message_id).data("fileData", receiveChatMainData);
			} else if(data.data.message_type == 2) { //文本图片
				//receiveChatMainData = receiveChatMainData.replace(/\[txt_([\S]*)\]/g, "$1");
				receiveChatMainData = receiveChatMainData.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
				receiveChatMainData = receiveChatMainData.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
				console.log(receiveChatMainData)
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.group_id + ">";
				if($(openPage).attr("data-chat-type") != 2) {
					str += "<p class=\"chat-menu\">" + (findIsGroupType(data.data.group_id) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
				}
				str += "<img src='" + data.data.message_send_by.employee_avatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + data.data.message_send_by.employee_name + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\">" + receiveChatMainData + "</div>";
				str += "</div>";
				str += "</div>";
				$(openPage + " .chat-info").append(str);
			} else if(data.data.message_type == 3) { //语音
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.group_id + ">";
				if($(openPage).attr("data-chat-type") != 2) {
					str += "<p class=\"chat-menu\">" + (findIsGroupType(data.data.group_id) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
				}
				str += "<img src='" + data.data.message_send_by.employee_avatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + data.data.message_send_by.employee_name + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\"><video width=\"320\" height=\"240\" controls src=" + receiveChatMainData + "></video></div>";
				str += "</div>";
				str += "</div>";
				$(openPage + " .chat-info").append(str);
			} else if(data.data.message_type == 4) {
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.group_id + ">";
				if($(openPage).attr("data-chat-type") != 2) {
					str += "<p class=\"chat-menu\">" + (findIsGroupType(data.data.group_id) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span>|<span class=\"chat-transpond\">转发</span></p>";
				}
				str += "<img src='" + data.data.message_send_by.employee_avatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + data.data.message_send_by.employee_name + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\"><audio controls><source src=" + receiveChatMainData + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
				str += "</div>";
				str += "</div>";
				$(openPage + " .chat-info").append(str);
			} else if(data.data.message_type == 5) {
				receiveChatMainData = '<img class="chat-image" src="'+BASEAPIURL + receiveChatMainData + '" border="0" />';
				console.log(receiveChatMainData);
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" data-time=\"" + changeDate(data.data.message_time) + "\" id=" + data.data.message_id + " data-from-id=" + data.data.group_id + ">";
				if($(openPage).attr("data-chat-type") != 2) {
					str += "<p class=\"chat-menu\">" + (findIsGroupType(data.data.group_id) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
				}
				str += "<img src='" + data.data.message_send_by.employee_avatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + data.data.message_send_by.employee_name + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\">" + receiveChatMainData + "</div>";
				str += "</div>";
				str += "</div>";
				$(openPage + " .chat-info").append(str);
			}
			if($(openPage).length != 0) {
				//滚动到底部
				$(openPage + " .chat-info").scrollTop($(openPage + " .chat-info")[0].scrollHeight);
			}
			bindIncident(); //绑定事件
		}

		//k客服上线通知
		function supportStaffOnLineInform(data) {
			console.log(data);
			//			myId = data.data.user_id;
			//			myName = data.data.user_name;
			//			myAvatar =  data.data.user_avatar;
			$(".sub-menu-service a[data-id=" + data.data.user_id + "] img").removeClass("underline");
			$(".sub-menu-service a[data-id=" + data.data.user_id + "]").attr("data-online", true);
			$("li[id=" + data.data.user_id + "] .avatar-img").removeClass("underline");
			$("li[id=" + data.data.user_id + "]").attr("data-online", true);
		}
		//客服下线通知
		function supportStaffUnlineInform(data) {
			console.log(data);
			$(".sub-menu-service a[data-id=" + data.data.user_id + "] img").addClass("underline");
			$(".sub-menu-service a[data-id=" + data.data.user_id + "]").attr("data-online", false);
			$("li[id=" + data.data.user_id + "] .avatar-img").addClass("underline");
			$("li[id=" + data.data.user_id + "]").attr("data-online", false);
		}

		function supportStaffInfoRead(data) {
			console.log("收到客服消息已读通知：");
			console.log(data);
			var mesgData = data.data;
			//找到对应Id消息处理
			//			if(mesgData.message.session_type == 1) { //单人消息
			//				//网上翻，知道已读位置为止
			//				$("#" + mesgData.message.message_id).prevAll(".chat-info-send").each(function(index) {
			//					if($(this).find(".chat-info-send-num").text() == "未读") {
			//						$(this).find(".chat-info-send-num").text("已读");
			//					} else {
			//						return false;
			//					}
			//				});
			//				$("#" + mesgData.message.message_id + " .chat-info-send-num").text("已读");
			//			}
		}

		function receiveLeaderChart(data) { //接收客服消息
			console.log("收到一条客服消息：");
			console.log(data);
			var isload = hasOpenChatPage(data, "5");
			var toObjAvatar = data.data.message_send_by.user_avatar;
			if(!isload) return false;
			var openPage = ".chat-page-modal-content[data-id=" + data.data.message_send_by.user_id + "]";
			var starTime = $(openPage + " .chat-info>div").last().attr("data-time");
			var receiveChatMainData = unescape(data.data.message_content);
			console.log(receiveChatMainData);
			!isDifferTime(starTime, changeDate(data.data.message_time)) ? $(openPage + " .chat-info").append("<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(changeDate(data.data.message_time)) + "</p>") : "";
			if(data.data.message_type == 1) { //文件
				receiveChatMainData = receiveChatMainData.replace(/^\[file_([\s\S]*)\]$/g, "$1");
				receiveChatMainData = JSON.parse(receiveChatMainData);
				console.log(receiveChatMainData);
				var fileType = receiveChatMainData.ext;
				if(fileType == "7z") fileType = "zip";
				if(fileType == "jpeg") fileType = "jpg";
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" id=" + data.data.message_id + " data-time=\"" + changeDate(data.data.message_time) + "\" data-message-id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.user_id + " data-path=" + receiveChatMainData.path + ">";
				str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
				str += "<img src='" + toObjAvatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + $(showPage + " .info-name").text() + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + receiveChatMainData.name + "</div>";
				str += "</div>";
				str += "</div>";
				//判断时间是否超过1min
				$(openPage + " .chat-info").append(str);
			} else if(data.data.message_type == 2) { //文本图片
				//receiveChatMainData = receiveChatMainData.replace(/\[txt_([\S]*)\]/g, "$1");
				receiveChatMainData = receiveChatMainData.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
				receiveChatMainData = receiveChatMainData.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
				console.log(receiveChatMainData)
				var str = "";
				str += "<div class=\"chat-info-receive message-info\" id=" + data.data.message_id + " data-time=\"" + changeDate(data.data.message_time) + "\" data-message-id=" + data.data.message_id + " data-from-id=" + data.data.message_send_by.user_id + ">";
				//					if($(showPage).attr("data-chat-type") != 2) {
				//						str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
				//					}
				str += "<img src='" + toObjAvatar + "' class=\"pull-left\">";
				str += "<p class=\"chat-info-name\">" + $(showPage + " .info-name").text() + "</p>";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\">" + receiveChatMainData + "</div>";
				str += "</div>";
				str += "</div>";
				console.log(str);
				$(openPage + " .chat-info").append(str);
			} else { //音频

			}
			//滚动到底部
			$(openPage + " .chat-info").scrollTop($(openPage + " .chat-info")[0].scrollHeight);

			bindIncident(); //绑定事件
		}
		//		//是否在线
		//		window.isUnline = function() {
		//				console.log(ws)
		//				console.log(ws.readyState);
		//				if(ws.readyState == 3) {
		//					$.showErrorGritter("您已经掉线，请稍后再试！");
		//					return false;
		//				} else {
		//					return true;
		//				}
		//			}
		//消息已读通知
		function infoReadInform(data) {
			//alert("收到消息已读")
			console.log("收到消息已读通知：");
			console.log(data);
			var mesgData = data.data;
			//找到对应Id消息处理
			for(var i in mesgData) {
				if($("#" + mesgData[i].message.message_id).length == 0) continue;
				if(mesgData[i].message.session_type == 1) { //单人消息
					if($("#" + mesgData[i].message.message_id).find(".chat-info-send-num").text() == "未读") {
						$("#" + mesgData[i].message.message_id).find(".chat-info-send-num").text("已读");
					} else {
						return false;
					}
				} else {
					if($("#" + mesgData[i].message.message_id).find(".chat-info-send-num").children().is("span")) {
						var noReadNum = parseInt($("#" + mesgData[i].message.message_id).find(".chat-info-send-num span").text()) - 1;
						if(noReadNum == 0) {
							$("#" + mesgData[i].message.message_id).find(".chat-info-send-num").html("全部已读");
						} else {
							$("#" + mesgData[i].message.message_id).find(".chat-info-send-num span").text(noReadNum);
						}
					} else {
						return false;
					}
				}
			}
		}
		//转让群通知
		function transferGroupInform(data) {
			console.log("收到转让群通知：");
			console.log(data);
			ws.onsend(21, {});
			if($(".chat-page-modal-content[data-id=" + data.data.grouo_id + "] .discussion-buttom .off-theme").length == 0) {
				$(".chat-page-modal-content[data-id=" + data.data.grouo_id + "] .discussion-content .discussion-buttom i").before("<span class=\"off-theme\">关闭</span>");
			}

		}
		//解散群通知
		function dissolveGroupInform(data) {
			console.log(data);
			if($("#" + data.data.group_id).length != 0) {
				$("#" + data.data.group_id + " .list-detele").trigger("click");
			}
			var num = parseInt($(".infolist-chatlist li[data-id=" + data.data.group_id + "] .list-num").text());
			//删除该群的最近列表和群列表
			$(".infolist-chatlist li[data-id=" + data.data.group_id + "]").remove();
			ws.onsend(21, {});
			//删除未读的消息
			console.log(num);
			//关闭弹窗
			$(".modal[data-id=" + data.data.group_id + "]").modal("hide");
			informNumChange("reduce", data.data.group_id, num);
			//业务通知（未完善）
		}
		//设置群管理员通知
		function setGroupAdministrator(data) {
			console.log("设置管理员通知");
			console.log(data);
			ws.onsend(21, {});
		}
		//加入群通知
		function joinGroupInform(data) {
			console.log("收到一条被加群通知");
			console.log(data);
			ws.onsend(21, {})
		}
		//被踢出群通知
		function outGroupInform(data) {
			console.log(data);
			if($("#" + data.data.group_id).length != 0) {
				$("#" + data.data.group_id + " .list-detele").trigger("click");
			}
			//删除该群的最近列表和群列表
			var num = $(".infolist-chatlist li[data-id=" + data.data.group_id + "] .list-num").text();
			$(".infolist-chatlist li[data-id=" + data.data.group_id + "]").remove();
			ws.onsend(21, {});
			//关闭弹窗
			$(".modal[data-id=" + data.data.group_id + "]").modal("hide");
			informNumChange("reduce", data.data.group_id, num);
			//业务通知（未完善）

		}
		//查找是否是讨论组
		window.findIsGroupType = function(groupId) {
				//console.log(groupListData.length == 0)
				for(var i in groupListData) {
					if(groupId == groupListData[i].group_id) {
						if(groupListData[i].group_type == 3) {
							return true;
						} else {
							return false;
						}
					}
				}
			}
			//添加群
		window.addGroup = function(event, obj) {
				var e = window.event || event;
				if(e.stopPropagation) {
					//如果提供了事件对象，则这是一个非IE浏览器
					e.stopPropagation();
				} else {
					//兼容IE的方式来取消事件冒泡 
					window.event.cancelBubble = true;
				}
				if($(obj).hasClass("top-add")) {
					groupEstablish("1");
				} else {
					var otherInfo = {};
					otherInfo.deparId = $(obj).parent().attr("data-id");
					var groupName = $(obj).prevAll(".tree-name").text();
					groupEstablish("2", groupName, otherInfo);
				}

			}
			//添加群：type:1-普通群,2-部门群，3-讨论群，groupName:默认群名字(type为2和3时必传),isAddgroop:是否添加群，默认添加-true
		window.groupEstablish = function(type, groupName, otherInfo, isAddGroup) {
			console.log("群类型:" + type);
			isAddGroup = isAddGroup == undefined ? true : isAddGroup;
			console.log(isAddGroup);
			if($("body .group-establish-page").length == 0) {
				str += "<div class=\"group-establish-page\">";
				str += "<div class=\"group-main\">";
				str += "<label class=\"add-group\">群名称：<input type=\"text\" class=\"add-group-name\" maxlength=\"20\"></label>";
				str += "<!--添加群成员弹窗-->";
				str += "<div class=\"load-group-member-list hide\">";
				str += "<div class=\"modal-body-main\">";
				str += "<div class=\"modal-body-left pull-left\">";
				str += "<p class=\"body-left-menu\">请选择联系人:</p>";
				str += "<div class=\"body-left-content\">";
				str += "<div class=\"body-left-content-top\">";
				str += "<input type=\"text\" class=\"body-left-content-top-search\" value=\"\" placeholder=\"搜索姓名\" />";
				str += "</div>";
				str += "<div class=\"body-left-content-list\">";
				str += "<ul class=\"tree-list-a\">";
				str += "</ul>";
				str += "</div>";
				str += "</div>";
				str += "</div>";
				str += "<div class=\"modal-body-right pull-right\">";
				str += "<p class=\"body-left-menu\">群成员:<span class=\"pull-right\">已选<span class=\"select-num\">0</span>人</span>";
				str += "</p>";
				str += "<div class=\"body-left-content\">";
				str += "</div>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "</div>";
				str += "</div>";
				str += "<div class=\"modal-body-buttom\">";
				str += "<input type=\"button\" class=\"btn btn-default add-group-member-btn\" value=\"确认\" />";
				str += "<input type=\"button\" class=\"btn btn-default back-btn\" value=\"取消\" />";
				str += "</div>";
				str += "</div>";
				$("body").append(str);
			}
			var titleText = (type == "1" ? "普通" : (type == "2" ? "部门" : "讨论"));
			//titleText = isAddGroup ? titleText : "/添加群成员";
			var modalId = $.modal({
				showFooter: false
			}).showOfLarge("创建" + titleText + "群组", ".group-establish-page", function() {});
			var contentBody = "#" + modalId + " .modal-body";
			//加载成员
			//				if((showChatId)) {
			//
			//				}
			if(type != 2) { //不是部门群
				ws.onsend(20, {}, function(data) { //加载列表
					console.log(data)
					var infoData = data.data;
					if(data.action == 200) return false;
					if(data.action == 500) {
						$.showErrorGritter("加载好友失败！");
						return false;
					}
					$(contentBody + " .tree-list-a").empty();
					loadFirendTree(infoData, contentBody + " .tree-list-a", "2", "1");
					addClick(contentBody);
				});
			} else {
				var depaId = $(".infolist-grouplist li[data-id=" + otherInfo.groupId + "]").attr('data-depaid');
				var departmentUrl = SAASAPIS.BS.company.employees + "/simple?depa_mode=7&depa_id=" + depaId;
				//部门以下的人
				$.ajaxGet(departmentUrl, function(response) {
					console.log(response);
					var emlyData = response.data.rows;
					var typeStr = "data-type=1";
					for(var i in emlyData) {
						//判断是否存在
						if($(contentBody + " .tree-list-a li[data-id=" + emlyData[i].employee_id + "]").length == 0) {
							str = "<li class=\"\" data-id={ID}>";
							str += "<div class=\"tree-info {CLASS}\" {TYPE} data-id={ID}>{TREE}";
							//str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
							str += "<span class=\"tree-name\">{NAME}</span>";
							str += "</div>";
							str += "<ul>";
							str += "</ul>";
							str += "</li>";
							str = str.replace(/{ID}/g, emlyData[i].employee_id).replace(/{NAME}/, emlyData[i].employee_name);
							str = str.replace(/{TREE}/, "").replace(/{CLASS}/, "tree-bottom").replace(/{TYPE}/, typeStr);
							$(contentBody + " .tree-list-a").append(str);
						}
					}
					addClick(contentBody);
				});
			}
			//搜索
			if(!isAddGroup) { //只添加群成员
				$("#" + modalId + " .modal-title").text("添加群成员");
				$(contentBody + " .add-group").addClass("hide").siblings().removeClass("hide");
				$(contentBody + " .back-btn").val("取消");
				$(contentBody + " .back-btn").click(function() {
					$("#" + modalId).modal("hide");
				});
				$(contentBody + " .add-group-member-btn").click(function() {
					var groupId = [];
					$(contentBody + " .list-box").each(function(index) {
						groupId.push($(this).attr("data-id"));
					});
					if(groupId.length == 0) {
						$.showErrorGritter("添加群成员为空！");
						return false;
					}
					ws.onsend(34, {
						"employee_ids": groupId,
						"group_id": otherInfo.groupId
					}, function(data) {
						console.log(data);
						if(data.action == 200) {
							console.log('群添加成员成功');
							$.showSuccessGritter("添加成员成功！");
							$("#" + modalId).modal("hide");
							loadGroupSet(otherInfo.modaName);
						}
						if(data.action == 500) {
							$.showErrorGritter("添加群成员失败！");
							return false;
						}
					});
				});
			} else { //添加群和成员
				if(groupName != "") {
					$(contentBody + " .add-group-name").val(groupName);
				}
				//取消（上一步）
				$(contentBody + " .back-btn").click(function() {
					if($(this).val() == "取消") {
						$("#" + modalId).modal("hide");
					} else {
						$(contentBody + " .load-group-member-list").addClass("hide").siblings().removeClass("hide");
						$(this).val("取消");
					}
				});
				//确认
				$(contentBody + " .add-group-member-btn").click(function() {
					if($(contentBody + " .add-group-name").val() == "") {
						$.showErrorGritter("群名称不能为空！请重新输入");
						return false;
					}
					groupName = $(contentBody + " .add-group-name").val();
					if(type != 2) { //创建普通群、讨论群
						if($(contentBody + " .load-group-member-list").hasClass("hide")) { //下一步添加成员
							$(contentBody + " .back-btn").val("上一步");
							$(contentBody + " .add-group").addClass("hide").siblings().removeClass("hide");

						} else { //创建群和添加成员
							var groupId = [];
							$(contentBody + " .list-box").each(function(index) {
								groupId.push($(this).attr("data-id"));
							});
							if(groupId.length == 0) {
								$.showErrorGritter("添加群成员为空！");
								return false;
							}
							var infoData = {};
							if(type == 1) {
								infoData = {
									"group_type": type,
									"group_name": groupName
								}
							} else {
								infoData = {
									"group_type": type,
									"group_name": groupName,
									"discussing_data_ids": (otherInfo.clientId ? otherInfo.clientId : ""),
									"topic_title": (otherInfo.title ? otherInfo.title : ""),
									"discussing_data_type": 1
								}
							}
							console.log("创建群名称：" + groupName + "," + titleText);
							console.log(infoData)
							ws.onsend(23, infoData, function(data) {
								if(data.action == 500) {
									$.showErrorGritter("添加群成员失败!");
									return false;
								} else {
									if(data.action == 200) return false;
									ws.onsend(34, {
										"employee_ids": groupId,
										"group_id": data.data.group_id
									}, function(data) {
										if(data.action == 200) {
											console.log('群添加成员成功');
											$.showSuccessGritter("创建" + titleText + "群成功！");
											$("#" + modalId).modal("hide");
											ws.onsend(21, {});
										}
										if(data.action == 500) {
											$.showErrorGritter("添加群成员失败！");
											return false;
										}
									});
								}
							});
						}
					} else { //部门群
						var infoData = {
							"department_id": (otherInfo.deparId ? otherInfo.deparId : ""),
							"group_type": type,
							"group_name": groupName,
						}
						ws.onsend(23, infoData, function(data) {
							if(data.action == 500) {
								console.log(data.data.message);
								$.showErrorGritter("创建群：" + titleText + "失败!");
								return False;
							} else {
								$.showSuccessGritter("创建" + titleText + "群成功！");
							}
							$("#" + modalId).modal("hide");
						});
					}
				});
			}
		}

		window.addClick = function(contentBody) {
				//树收缩
				$(".tree-menu").unbind("click").click(function() {
					if($(this).children().is(".fa-plus-square")) {
						//打开
						$(this).children("i").removeClass("fa-plus-square").addClass("fa-minus-square");
						$(this).next().slideDown();
					} else {
						$(this).children("i").removeClass("fa-minus-square").addClass("fa-plus-square");
						$(this).next().slideUp();
					}
				});
				//点击事件
				$(".tree-bottom").unbind("click").click(function() {
					var treeId = $(this).attr("data-id");
					var treeName = $(this).children(".tree-name").text();
					var treeType = $(this).attr("data-type");
					//判断是否已存在
					var isExist = false;
					$(contentBody + " .modal-body-right .list-box").each(function(index) {
						if($(this).attr("data-id") == treeId) {
							isExist = true;
							return false;
						}
					});
					if(!isExist) {
						var selectNum = parseInt($(contentBody + " .select-num").text()) + 1;
						$(contentBody + " .select-num").html(selectNum);
						$(contentBody + " .modal-body-right .body-left-content").append("<p class=\"list-box\" data-type=" + treeType + " data-id=" + treeId + ">" + treeName +
							"<span class=\"detele-list-box\" onclick=\"var selectNum=parseInt($(this).parents('.modal-body-right').find('.select-num').text())-1;$(this).parents('.modal-body-right').find('.select-num').html(selectNum);$(this).parent().remove();\">×</span></p>");
					}
				});
				$(contentBody + " .body-left-content-top-search").keydown(function(event) {
					console.log($(this).parents(".modal-body-left").children(".body-left-menu").text())
					if(event.keyCode == 13 && $(this).parents(".modal-body-left").children(".body-left-menu").text() == "请选择联系人:") {
						if(!$(this).next().is(".search-list")) {
							$(this).after("<ul class=\"search-list\">" +
								"<li><span class=\"group-list-menu\">好友</span>" +
								"<ul class=\"friend-list\"></ul></li></ul>");
						} else {
							$(contentBody + " .search-list").show();
						}
						var searchText = $(this).val();
						$(contentBody + " .search-list ul").empty();
						$(contentBody + " .tree-list-a").find(".tree-bottom").each(function(index) {
							var name = $(this).children(".tree-name").text();
							var id = $(this).attr("data-id");
							var chatObjType = $(this).attr("data-type");
							if(isConform(searchText, name) && $(contentBody + " .search-list .friend-list li[data-id=" + id + "]").length == 0) { //存在
								$(contentBody + " .search-list .friend-list").append("<li data-type=" + chatObjType + " data-id=" + id + " class=\"tree-bottom\"><span class=\"tree-name\">" + name + "</span></li>");
							}
						});
						addClick(contentBody);
					} else if(event.keyCode == 13 && $(this).parents(".modal-body-left").children(".body-left-menu").text() == "请选择转发对象:") {
						if(!$(this).next().is(".search-list")) {
							$(this).after("<ul class=\"search-list\">" +
								"<li><span class=\"group-list-menu\">群组</span><ul class=\"group-list\">" +
								"</ul></li><li><span class=\"group-list-menu\">好友</span>" +
								"<ul class=\"friend-list\"></ul></li></ul>");
						}
						var searchText = $(this).val();
						$(contentBody + " .search-list ul").empty();
						$(contentBody + " .recently-chat-list").siblings().find(".tree-bottom").each(function(index) {
							var name = $(this).children(".tree-name").text();
							var id = $(this).attr("data-id");
							var chatObjType = $(this).attr("data-type");
							if(isConform(searchText, name)) {
								if($(this).parents().is(".group-chat-list")) {
									$(contentBody + " .search-list .group-list").append("<li data-type=" + chatObjType + " data-id=" + id + " class=\"f\"><span class=\"tree-name\">" + name + "</span></li>");
								} else {
									$(contentBody + " .search-list .friend-list").append("<li data-type=" + chatObjType + " data-id=" + id + " class=\"tree-bottom\"><span class=\"tree-name\">" + name + "</span></li>");
								}
							}
						});
					}
					$(this).focus();
				});
				$("body").unbind("click").click(function(event) {
					if($(event.target).parents(".body-left-content-top").length == 0) {
						$(contentBody + ".search-list").remove();
					}
				});
			}
			//聊天列表y击
		window.openChat = function(obj) {
				if(!$(obj).is("a")) {
					if($(obj).parents().is(".infolist-servicelist")) {
						//好友列表
						//$(obj).parents(".infolist-servicelist").find(".selectstyle").removeClass("selectstyle");
						//$(obj).addClass("selectstyle");
						if($(obj).children().is("i")) {
							if($(obj).children("i").hasClass("fa-caret-right")) {
								$(obj).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
								$(obj).next().slideDown();
							} else {
								$(obj).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
								$(obj).next().slideUp();
							}
						}
						if($(obj).attr("chat-type")) {
							var avatar = $(obj).find("img").attr("src");
							var name = $(obj).find(".tree-name").text();
							var isOnline = $(obj).attr("data-online");
							if($(obj).attr("data-id") == myId) {
								return false;
							}

							$.chatPage({
								type: $(obj).attr("chat-type"),
								Id: $(obj).attr("data-id"),
								Avatar: avatar,
								Name: name,
								Online: isOnline
							});
						}
					} else if($(obj).parents().is(".infolist-grouplist")) {
						//$(obj).parents(".infolist-grouplist").find(".selectstyle").removeClass("selectstyle");
						//$(obj).addClass("selectstyle");
						if($(obj).children().is("i")) {
							if($(obj).children("i").hasClass("fa-caret-right")) {
								$(obj).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
								$(obj).next().slideDown();
							} else {
								$(obj).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
								$(obj).next().slideUp();
							}
						}
						if($(obj).attr("chat-type")) {
							var avatar = $(obj).find("img").attr("src");
							var name = $(obj).find(".tree-name").text();
							$.chatPage({
								type: $(obj).attr("chat-type"),
								Id: $(obj).attr("data-id"),
								Avatar: avatar,
								Name: name
							});
						}
					} else if($(obj).parent().is(".info-page-top")) {
						$("#" + $(obj).attr("data-bdy")).modal('hide');
						$.chatPage({
							type: "2",
							Id: $(obj).attr("data-id"),
							Avatar: $(obj).attr("data-avatar"),
							Name: $(obj).attr("data-name"),
							Online: $(obj).attr("data-online")
						});
					} else {
						//$(obj).addClass("selectstyle").siblings().removeClass("selectstyle");
						var avatar = $(obj).attr("data-avatar");
						var name = $(obj).find(".tree-name").text();
						var isOnline = $(obj).attr("data-online");
						console.log($(obj).attr("data-id"));
						$.chatPage({
							type: $(obj).attr("chat-type"),
							Id: $(obj).attr("data-id"),
							Avatar: avatar,
							Name: name,
							Online: isOnline
						});
					}
					var noReadNum = parseInt($(obj).find(".list-num").text());
					console.log(noReadNum);
					informNumChange("reduce", $(obj).attr("data-id"), noReadNum);
				} else { //客服
					$.chatPage({
						type: $(obj).attr("chat-type"),
						Id: $(obj).attr("data-id"),
						Avatar: $(obj).find("img").attr("src"),
						Name: $(obj).find(".css-overhidden").text(),
						Online: $(obj).attr("data-online")
					});
					var noReadNum = parseInt($(obj).find(".list-num").text());
					informNumChange("reduce", $(obj).attr("data-id"), noReadNum);
					//					if($(obj).find(".list-num").length != 0) {
					//						var noReadNum = parseInt($(obj).find(".list-num").text());
					//						$(".link-service>.info-num").text(parseInt($(".link-service>.info-num").text())-noReadNum);
					//					}
					//					$(obj).find(".list-num").remove();
				}
			}
			//收消息判断是否打开，没打开未读消息+1,并返回false
			//type:1-单人，2-群，3-新圈子，4-新动态，5-客服
		function hasOpenChatPage(data, type) {
			console.log(data)
			if(type == 1 || type == 2) {
				var showTetxStr = "";
				var searchId = "";
				if(type == 1) {
					searchId = data.data.message_send_by.employee_id;
				} else {
					searchId = data.data.group_id;
				}
				//判断是否在最近聊天会话列表里面，不存在则刷新
				if($(".infolist-chatlist li[data-id=" + searchId + "]").length == 0) {
					ws.onsend(22, {});
					ws.onsend(46, {});
				}
				//消息内容提取
				if(data.data.message_type == 1) {
					showTetxStr = (type == 2 ? data.data.message_send_by.employee_name + ":" : "") + "[文件]";
				} else if(data.data.message_type == 2) {
					var chatTextStr = data.data.message_content;
					chatTextStr = chatTextStr.replace(/\[img_([\s\S]*?)\]/g, '[图片]').replace(/\[em_f([0-9]*).gif\]/g, '[表情]');
					showTetxStr = (type == 2 ? data.data.message_send_by.employee_name + ":" : "") + chatTextStr;
				} else if(data.data.message_type == 3) {
					showTetxStr = (type == 2 ? data.data.message_send_by.employee_name + ":" : "") + "[视频]";
				} else if(data.data.message_type == 4) {
					showTetxStr = (type == 2 ? data.data.message_send_by.employee_name + ":" : "") + "[语音]";
				} else if(data.data.message_type == 5) {
					showTetxStr = (type == 2 ? data.data.message_send_by.employee_name + ":" : "") + "[图片]";
				}
				if(type == 2) {
					//@我
					var atMyStr = "<span class=\"at-me\" style=\"color:red;display:inline\">[有人@我]</span>";
					var isAtMy = false;
					for(var i in data.data.message_at_info) {
						if(myId == data.data.message_at_info[i]) {
							isAtMy = true;
						}
					}
					console.log("长度：" + $(".infolist-chatlist li[data-id=" + data.data.group_id + "] .at-me").length);
					console.log("是否AT我：" + isAtMy);
					if($(".infolist-chatlist li[data-id=" + data.data.group_id + "] .at-me").length != 0 || isAtMy) {
						$(".infolist-chatlist li[data-id=" + data.data.group_id + "] .news-info-text").html(atMyStr + showTetxStr);
					} else {
						$(".infolist-chatlist li[data-id=" + data.data.group_id + "] .news-info-text").html(showTetxStr);
					}
					//时间更新
					$(".infolist-chatlist li[data-id=" + data.data.group_id + "] .infolist-time").text(isTodayOrYesterday(changeDate(data.data.message_time)));
				} else {

					$(".infolist-chatlist li[data-id=" + data.data.message_send_by.employee_id + "] .news-info-text").text(showTetxStr);
					//时间更新
					$(".infolist-chatlist li[data-id=" + data.data.message_send_by.employee_id + "] .infolist-time").text(isTodayOrYesterday(changeDate(data.data.message_time)));
				}
				informTop(searchId);
				if(typeof(showChatId) == "undefined" || showChatId != searchId || isMinPage) {
					console.log("未被打开");
					var str = "<span class=\"info-num list-num\">1</span>";
					//判断是否存在于聊天框左侧未打开。存在未打开则消息+1
					if($("#" + searchId + " span").is(".list-num")) {
						$("#" + searchId).find(".list-num").text(parseInt($("#" + searchId).find(".list-num").text()) + 1);
					} else {
						$("#" + searchId).append(str);
					}
					//聊天列表未读+1
					if($(".infolist-chatlist li[data-id=" + searchId + "] .list-num").length == 0) {
						$(".infolist-chatlist li[data-id=" + searchId + "] .infolist-right-newinfo").append(str);
					} else {
						var noReadNum = parseInt($(".infolist-chatlist li[data-id=" + searchId + "] .list-num").text());
						$(".infolist-chatlist li[data-id=" + searchId + "] .list-num").text(noReadNum + 1);
					}
					//整体消息+1
					if($(".chat-open>.list-num").length == 0) {
						$(".chat-open").append(str);
					} else {
						var noReadNum = parseInt($(".chat-open>.list-num").text());
						$(".chat-open>.list-num").text(noReadNum + 1);
					}
					if($("#" + searchId).length == 0) {
						return false;
					} else {
						console.log("被打开但是未显示");
						return true;
					}
				} else {
					console.log("被打开");
					//消息已读
					infoIsRead(data.data.message_id, type);
					return true;
				}

			} else if(type == 5) { //客服
				searchId = data.data.message_send_by.user_id;
				if(typeof(showChatId) == "undefined" || showChatId != searchId || isMinPage) {
					console.log("未被打开");
					var str = "<span class=\"info-num list-num\">1</span>";
					//判断是否存在于聊天框左侧未打开。存在未打开则消息+1
					if($("#" + searchId + " span").is(".list-num")) {
						$("#" + searchId).find(".list-num").text(parseInt($("#" + searchId).find(".list-num").text()) + 1);
					} else {
						$("#" + searchId).append(str);
					}
					//聊天列表未读+1
					if($(".sub-menu-service a[data-id=" + searchId + "] .list-num").length == 0) {
						$(".sub-menu-service a[data-id=" + searchId + "]").append(str);
					} else {
						var noReadNum = parseInt($(".sub-menu-service a[data-id=" + searchId + "] .list-num").text());
						$(".sub-menu-service a[data-id=" + searchId + "] .list-num").text(noReadNum + 1);
					}
					//整体消息+1
					if($(".link-service>.info-num").length == 0) {
						$(".link-service").append(str);
					} else {
						var noReadNum = parseInt($(".link-service>.info-num").text());
						$(".link-service>.info-num").text(noReadNum + 1);
					}
					if($("#" + searchId).length == 0) {
						return false;
					} else {
						console.log("被打开但是未显示");
						return true;
					}

				} else {
					console.log("客服被打开");
					//消息已读
					infoIsRead(data.data.message_id, "5");
					return true;
				}
			} else if(type == 3) { //新圈子
				if($(".news-left-menu .all-friend-dynamic-num").length == 0) {
					$(".news-left-menu span").remove();
					$(".news-left-menu li:last-child").append("<span class=\"info-num new-info-reminder\"></span>");
				}
			} else { //新动态all-friend-dynamic-num
				if($(".news-left-menu .all-friend-dynamic-num").length != 0) {
					$(".news-left-menu .all-friend-dynamic-num").text(parseInt($(".news-left-menu .all-friend-dynamic-num").text()) + 1);
				} else {
					$(".news-left-menu span").remove();
					$(".news-left-menu li:last-child").append("<span class=\"info-num all-friend-dynamic-num\">1</span>");
				}
			}
		}
		window.informTop = function(id) {
				var copyDom = $(".infolist-chatlist li[data-id=" + id + "]").clone(true);
				$(".infolist-chatlist li[data-id=" + id + "]").remove();
				$(".infolist-chatlist li:first-child").before(copyDom);
			}
			//个人资料弹窗打开
		window.openPersonageInfo = function(obj) {
				if($(obj).hasClass("group-member-boxs")) return false;
				var personageId = $(obj).attr("data-id");
				var modalId = $.modal({
					showFooter: false
				}).show("详细信息", ".personal-info-page", function() {});
				var contentLocation = "#" + modalId;
				ws.onsend(47, {
					"employee_id": personageId
				}, function(data) {
					if(data.action == 200) return false;
					if(data.action == 500) {
						$.showErrorGritter("获取资料失败！");
						return false;
					}
					var infoData = data.data;
					var departmentoption = contentLocation + " .modal-body";
					var comController = new Controller(departmentoption);
					comController.set(infoData);
					$(contentLocation + " .info-page-top img").attr("src", infoData.employee_avatar);
					//$(contentLocation+" .info-page-name").html(infoData.employee_name);
					if(infoData.employee_qq) {
						var str = "<a href=\"tencent://message/?uin=" + infoData.employee_qq + "&amp;Site=有事Q我&amp;Menu=yes\"><i class=\"fa fa-qq\" aria-hidden=\"true\"></i></a>";
						$(contentLocation + " .info-page-QQ").append(str);
					}
					$("#" + modalId + " .fa-envelope-o").unbind("click").click(function() {

						var toEmailUrl = $(this).prev(".E-mail-number").text();
						if(toEmailUrl == "") {
							$.showErrorGritter("该员工当前未绑定邮箱");
							return false;
						}
						var fullName = "我的邮箱";
						window.parent.openTab(fullName, "views/e-mail.html?email=" + toEmailUrl + "&name=" + infoData.employee_name + "");
						$("#" + modalId).modal("hide");
						$(".minimize").trigger("click");
					});
					$(contentLocation + " .fa-commenting-o").attr({
						"data-id": infoData.employee_id,
						"data-avatar": infoData.employee_avatar,
						"data-name": infoData.employee_name,
						"data-online": infoData.is_online,
						"data-bdy": modalId
					});
				});

			}
			//加载群话题
		window.loadGroupDiscussionList = function(data, type, title) {
				console.log("加载主题");
				console.log(data);
				$(showPage + " .discussion-content").remove()
				if(type == "1") { //获取的主题
					var str = "<div class=\"discussion-content\" id=" + data.topic_id + ">";
					str += "<p class=\"discussion-top\" title='" + data.topic_title + "'><span>讨论主题:</span><span>" + data.topic_title + "</span></p>";
					str += "<p class=\"discussion-buttom\">" + data.topic_creator.employee_name + "添加于" + data.topic_create_date + (data.topic_can_modify ? "<span class=\"off-theme\">关闭</span>" : "") + "</p>";
					str += "</div>";
					$(showPage + " .chat-page-main").prepend(str);
					$(showPage + " .chat-info").css("height", "380px");
				} else if(type == "2") { //新增主题
					var str = "<div class=\"discussion-content\" id=" + data.topic_id + ">";
					str += "<p class=\"discussion-top\" title='" + data.topic_title + "'><span>讨论主题:</span><span>" + data.topic_title + "</span></p>";
					str += "<p class=\"discussion-buttom\">" + data.topic_creator.employee_name + "添加于" + data.topic_create_date + (data.topic_can_modify ? "<span class=\"off-theme\">关闭</span>" : "") + "</p>";
					str += "</div>";
					if($("#" + data.group_id).length != 0) {
						$(".chat-page-modal-content[data-id=" + data.group_id + "] .discussion-content").remove();
						$(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-page-main").prepend(str);
						$(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-info").css("height", "380px");
						console.log("群ID：" + data.group_id);
						if(data.topic_creator.employee_id == myId) {
							//页面显示通知
							$(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-info").append("<p class=\"chat-annunciate\"><span>我发起了讨论</span></p>");
						} else {
							$(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-info").append("<p class=\"chat-annunciate\"><span>" + data.topic_creator.employee_name + "发起了讨论</span></p>");
						}
						//滚动到底部
						$(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-info").scrollTop($(".chat-page-modal-content[data-id=" + data.group_id + "] .chat-info")[0].scrollHeight);
					}
				} else {

				}
				bindIncident();
			}
			//数据更新（最近聊天的文字，时间更新。是否是第一次聊天等）
		window.updataNewInformation = function(id, chatText, chatTime) {
				//判断是否第一次聊天
				if($(".infolist-chatlist li[data-id=" + id + "]").length == 0) {
					//刷新表格
					ws.onsend(22, {});
				} else { //更新数据
					$(".infolist-chatlist li[data-id=" + id + "] .news-info-text").text(chatText);
					$(".infolist-chatlist li[data-id=" + id + "] .infolist-time").text(chatTime);
				}

			}
			//客服系统
		function loadSupportStaff(data) {
			$(".sub-menu-service").empty();
			//获取客服列表
			console.log(data);
			var noReadInfo = 0;
			var supportStaffData = data.data;
			for(var i in supportStaffData) {
				noReadInfo += parseInt(supportStaffData[i].unread_num);
				var str = "";
				str += "<a href=\"javascript:;\" onclick=\"openChat(this)\" data-online=" + supportStaffData[i].is_online + " chat-type=\"4\" data-id=" + supportStaffData[i].user_id + " class=\"avatar-img\">" + (supportStaffData[i].unread_num != 0 ? "<span class=\"info-num list-num\">" + supportStaffData[i].unread_num + "</span>" : "") + "<img src=" +
					supportStaffData[i].user_avatar + " class=\"" + (supportStaffData[i].is_online ? "" : "underline") + "\"> <span class=\"css-overhidden\" style=\"max-width:89px\">" + supportStaffData[i].user_name + "</span></a>";
				$(".sub-menu-service").append(str);
			}
			if(noReadInfo != 0)
				$(".bottom-menu li:first-child>a").append("<span class=\"info-num\">" + noReadInfo + "</span>");
		}
		//业务通知
		//接收业务通知
		$("#msg").attr({
			"data-id": "BusinessNotifier",
			"chat-type": "5",
			"data-avatar": "http://www.saas.com/resources/images/logo.png",
			"data-online": "true"
		});
		$("#msg").click(function() {
			$.chatPage({
				type: $(this).attr("chat-type"),
				Id: $(this).attr("data-id"),
				Avatar: $(this).attr("data-avatar"),
				Name: "业务通知",
				Online: $(this).attr("data-online")
			});
			$(this).find('.badge').remove();

		});

		function receiveInform(data) {
			console.log("收到一条" + (data.data.message_type == "1" ? "业务" : "系统") + "消息：");
			console.log(data);
			var infoData = data.data;
			if(infoData.message_type == 1) { //收到业务消息
				if($("#" + infoData.message_send_by.employee_id).length != 0) { //打开
					console.log("业务页面打开");
					//onclick=\"parent.openTab('审批内容','views/apv-approval-detail.html?action=my&apvId=" + rowObject.session_id + "');\"
					infoShow(infoData);
					if(showChatId == infoData.message_send_by.employee_id) {
						infoIsRead(infoData.message_id, 1); //已读标记
					} else {
						if($("#" + infoData.message_send_by.employee_id + " .list-num").length != 0) {
							$("#" + infoData.message_send_by.employee_id + " .list-num").text(parseInt($("#" + infoData.message_send_by.employee_id + " .list-num").text()) + 1);
						} else {
							$("#" + infoData.message_send_by.employee_id).append('<span class=\"info-num list-num\">1</span>');
						}
					}
					if(isMinPage) { //被最小化
						if($("#msg").find("span").length != 0) {
							$("#msg span").text(parseInt($("#msg span").text()) + 1);
						} else {
							$("#msg a").append("<span class=\"badge badge-danger icon-animated-bell\">1</span>");
						}
					}
				} else {
					if($("#msg").find("span").length != 0) {
						$("#msg span").text(parseInt($("#msg span").text()) + 1);
					} else {
						$("#msg a").append("<span class=\"badge badge-danger icon-animated-bell\">1</span>");
					}
				}
			} else if(infoData.message_type == 5) { //收到系统消息

			}
			//滚动到底部
			$(".chat-page-modal-content[data-id=" + infoData.message_send_by.employee_id + "] .chat-info").scrollTop($(showPage + " .chat-info")[0].scrollHeight);

		}
		window.infoShow = function(infoData, addType) {
			try {
				var messageInfo = JSON.parse(infoData.message_content);
			} catch(e) {
				//return false;
			}
			console.log(messageInfo);
			var str = "<div class=\"chat-info-receive\" data-time=" + changeDate(infoData.message_time) + " id=" + infoData.message_id + " data-type=" + infoData.message_type + " data-info-type=" + messageInfo.business_type + ">";
			str += "<img src=\"" + infoData.message_send_by.employee_avatar + "\" class=\"pull-left\">";
			str += "<div class=\"demo clearfix\">";
			str += "<p class=\"chat-time\" style=\"margin: 0;text-align: left;font-size: 12px;\">" + isTodayOrYesterday(changeDate(infoData.message_time)) + "</p>";
			str += "<div class=\"thing-box article\" data-toid=" + messageInfo.business_data_id + " " + (messageInfo.business_type == 30 ? "data-type=" + messageInfo.message.msg_type + "" : "") + ">";
			str += "<p class=\"thing-name\">" + messageInfo.business_type_cn + "</p>";
			str += "<p class=\"thing-theme shrink\" style=\"-webkit-line-clamp:2\" title=" + (messageInfo.business_type == 30 ? messageInfo.message.msg_content : messageInfo.message) + ">" + (messageInfo.business_type == 30 ? messageInfo.message.msg_content : messageInfo.message) + "</p>";
			str += "</div></div></div>";
			if(addType) {
				console.log("历史加载");
				$(".chat-page-modal-content[data-id=" + infoData.message_send_by.employee_id + "] .chat-info").prepend(str);
			} else {
				$(".chat-page-modal-content[data-id=" + infoData.message_send_by.employee_id + "] .chat-info").append(str);
			}
			$(".thing-box").unbind("click").click(function() {
				//if($(this).parents(".chat-info-receive").attr("data-type") == 1) {
				if($(this).parents(".chat-info-receive").attr("data-info-type") == 1) //待审批
					parent.openTab("审批内容", "views/apv-approval-detail.html?action=apv&apvId=" + $(this).attr("data-toid"));
				if($(this).parents(".chat-info-receive").attr("data-info-type") == 2) //审批完成
					parent.openTab("审批内容", "views/apv-approval-detail.html?action=my&apvId=" + $(this).attr("data-toid"));
				if($(this).parents(".chat-info-receive").attr("data-info-type") == 3)
					parent.openTab('公告详情', 'views/announcement-detail.html?id=' + $(this).attr("data-toid") + "&status=2");
				if($(this).parents(".chat-info-receive").attr("data-info-type") == 30) {
					if($(this).attr("data-type") == 1) { //Im消息MT
						$(".news-left-infolist li[data-id=" + $(this).attr("data-toid") + "]").trigger("click");
					} else if($(this).attr("data-type") == 2) { //审批MT
						parent.openTab("审批内容", "views/apv-approval-detail.html?action=apv&apvId=" + $(this).attr("data-toid"));
					} else if($(this).attr("data-type") == 3) { //公告提醒阅读
						parent.openTab("公告详情", "views/announcement-detail.html?id=" + $(this).attr("data-toid") + "&status=2");
					} else if($(this).attr("data-type") == 4) { //资讯提醒阅读
						parent.openTab("资讯详情", "views/information-details.html?id=" + $(this).attr("data-toid") + "&information_is_publisher=false");
					} else if($(this).attr("data-type") == 5) { //文档提醒阅读
						parent.openTab('文档详情', 'views/documentation-detail.html?id=' + $(this).attr("data-toid") + '&status=3');
					}
				}

			});
		}
		window.openPageType = function(id, types) { //判断聊天对象的类型，如果id为空则默认显示的聊天对象，type返回的数据类型：1群聊。2私聊。3。系统通知。4。客服。5业务通知。5.讨论组
			console.log(id + "////" + types)
			var type = $(showPage).attr("data-chat-type");
			var str = type;
			if(id) type = $(".chat-page-modal-content[data-id=" + id + "]").attr("data-chat-type");

			if(types) { //返回数据库所需类型
				if(type == 2 | type == 3 | type == 5) {
					str = "1";
				} else if(type == 1 || type == 6) {
					str = "2";
				} else {
					str = "3";
				}
			}
			return str;
		}
		window.informNumChange = function(type, id, num) {
				console.log(type + "，" + id + "," + num);
				if(isNaN(num)) {
					return false;
				}
				num = parseInt(num);
				if($(".chat-page-modal-content[data-id=" + id + "]").attr("data-chat-type") != 4) {
					if(type == "add") { //消息+1
						//$("#"+id+" .")
						console.log('消息+1');
					} else { //消息-1
						console.log("消息减少" + num);
						$("#" + id).find(".list-num").text(parseInt($("#" + id).find(".list-num").text()) - num);
						if($("#" + id).find(".list-num").text() == "0") {
							$("#" + id).find(".list-num").remove();
						}
						$(".infolist-chatlist li[data-id=" + id + "] .list-num").text(parseInt($(".infolist-chatlist li[data-id=" + id + "] .list-num").text()) - num);
						if($(".infolist-chatlist li[data-id=" + id + "] .list-num").text() == "0") {
							$(".infolist-chatlist li[data-id=" + id + "] .list-num").remove();
						}
						console.log(parseInt($(".chat-open>.list-num").text()));
						console.log(num);
						console.log(parseInt($(".chat-open>.list-num").text()) - num);
						$(".chat-open>.list-num").text(parseInt($(".chat-open>.list-num").text()) - num);
						if($(".chat-open>.list-num").text() == "0") {
							$(".chat-open>.list-num").remove();
						}
					}
				} else { //客服
					$("#" + id).find(".list-num").text(parseInt($("#" + id).find(".list-num").text()) - num);
					if($("#" + id).find(".list-num").text() == "0") {
						$("#" + id).find(".list-num").remove();
					}
					$(".sub-menu-service>a[data-id=" + id + "] .list-num").text(parseInt($(".sub-menu-service>a[data-id=" + id + "] .list-num").text()) - num);
					if($(".sub-menu-service>a[data-id=" + id + "] .list-num").text() == "0") {
						$(".sub-menu-service>a[data-id=" + id + "] .list-num").remove();
					}
					$(".link-service>.info-num").text(parseInt($(".link-service>.info-num").text()) - num);
					if($(".link-service>.info-num").text() == "0") {
						$(".link-service>.info-num").remove();
					}

				}

			}
			//事件添加
		var beforHeight = "";
		window.bindIncident = function() {
				//向上滚动加载
				$(".chat-info").unbind("scroll").scroll(function() {
					var scrollTop = $(this).scrollTop();
					if(scrollTop == 0) {
						$(showPage + " .chat-page-main-loadmore").remove();
						if(openPageType() != 4) {
							var msgId = $(this).children("div").first().attr("id");
							if(openPageType() == 5) {
								ws.onsend(44, {
									"base_msg_id": msgId,
									"msg_session_id": showChatId,
									"msg_session_type": 1,
									"limit": chatHistoryPage,
									"with_employees": 1
								}, function(data) {
									if(data.action == 200) return false;
									if(data.action == 500) {
										$.showErrorGritter("加载最近聊天记录失败！");
										return false;
									}
									loadBusinessInform(data);
								});
							} else {
								ws.onsend(44, {
									"base_msg_id": msgId,
									"msg_session_id": showChatId,
									"limit": chatHistoryPage,
									"msg_session_type": openPageType('', true),
									"with_employees": 1
								}, function(data) {
									if(data.action == 200) return false;
									if(data.action == 500) {
										$.showErrorGritter("加载最近聊天记录失败！");
										return false;
									}
									loadChatRecord(data);
								});
							}
						} else {
							var msgId = $(this).children("div").first().attr("id");
							ws.onsend(85, {
								"base_msg_id": msgId,
								"to_user": showChatId,
								"limit": chatHistoryPage
							}, function(data) {
								if(data.action == 200) return false;
								if(data.action == 500) {
									$.showErrorGritter("加载最近聊天记录失败！");
									return false;
								}
								loadChatRecords(data);
							});
						}
					}
				});
				//鼠标移入移出
				$(".message-info").unbind("hover").hover(function() {
					if($(this)[0].offsetTop >= $(this).parent().scrollTop() + 20 && $(this)[0].offsetTop < $(this).parent().scrollTop() + $(this).parent().height()) {
						$(this).children(".chat-menu").show();
					} else {
						$(this).children(".chat-menu").css({
							"top": "50px",
							"z-index": "10"
						});
						$(this).children(".chat-menu").show();
					}

				}, function() {
					$(this).children(".chat-menu").hide();
				});
				//文件下载
				$(".file-download").unbind("click").click(function() {

					var src = $(this).parent().parent().attr("data-path");
					console.log('文件下载（路径：' + src + "）");
					$.downloadFile(src);
				});
				//图片放大
				$(".chat-image").unbind("click").click(function() {
					var src = $(this).attr("src");
					magnifyImage(src);
				});
				//				//讨论主题收起
				//				$(".discussion-buttom>i").unbind('click').click(function() {
				//					if($(this).hasClass("fa-sort-asc")) { //收起
				//						beforHeight = $(this).parents(".discussion-content").outerHeight(true);
				//						console.log("all:" + $(this).parents(".discussion-content").outerHeight(true) + "-" + $(this).parents(".discussion-content").find(".discussion-buttom").outerHeight(true));
				//						console.log(beforHeight);
				//						$(this).removeClass("fa-sort-asc").addClass("fa-sort-desc");
				//						$(this).attr("title", "展开主题");
				//						$(this).parents(".discussion-content").animate({
				//							"top": -(beforHeight) + 'px'
				//						}, 300);
				//						$(this).parents(".discussion-content").animate({
				//							"top": -(beforHeight) + 'px'
				//						}, 300);
				//					} else { //放下
				//						$(this).removeClass("fa-sort-desc").addClass("fa-sort-asc");
				//						$(this).attr("title", "收起主题");
				//						$(this).parents(".discussion-content").animate({
				//							"top": 0
				//						}, 300);
				//					}
				//				});
				//关闭讨论主题
				$(".off-theme").unbind("click").click(function() {
					var topicId = $(this).parents(".discussion-content").attr("id");
					var topicTitle = $(this).parents(".discussion-content").find('.discussion-top span:last-child').text();
					ws.onsend(26, {
						"topic_id": topicId
					}, function(data) {
						if(data.action == 500) {
							$.showErrorGritter("关闭群话题失败！");
							return false;
						}
						if(data.action == 200) {
							$.showSuccessGritter("关闭话题成功！");
							//是否是讨论群
							if($(".infolist-grouplist li[data-id=" + showChatId + "]").parents("li").attr("data-grouptype") == 3) {
								$(".news-left-infolist li[data-id=" + showChatId + "]").remove();
								$(".infolist-chatlist li[data-id=" + showChatId + "]").remove();
								$("#" + showChatId + " .list-detele").trigger("click");

								ws.onsend(21, {});
							} else {
								$(".infolist-grouplist li[data-id=" + showChatId + "]").removeData("theme")
									//页面显示通知
								$(showPage + " .chat-info").append("<p class=\"chat-annunciate\"><span>我关闭了讨论<a href=\"javascript:;\" data-title=" + topicTitle + " class=\"discussion-again-add\">重新添加</a></span></p>");
								//滚动到底部
								$(showPage + " .chat-info").scrollTop($(showPage + " .chat-info")[0].scrollHeight);
								$(showPage + " .discussion-content").remove();
								$(showPage + " .chat-info").height("455");
								bindIncident();
							}
						}
					});

				});
				//添加重新添加事件
				$(".discussion-again-add").unbind("click").click(function() {
					console.log("重新添加主题标题：" + $(this).attr("data-title") + "群ID：" + showChatId);
					ws.onsend(25, {
						"group_id": showChatId,
						"topic_title": $(this).attr("data-title")
					}, function(data) {
						//						if(data.action == 500) {
						//							$.showErrorGritter(data.data.message);
						//						} else {
						//							//$(showPage + " .chat-info").append("<p class=\"chat-annunciate\"><span>我发起了讨论</span></p>");
						//						}
						bindIncident();
					});

				});
				//聊天----M他们()
				$(".mgroupmember").unbind('click').click(function() {
					var infoId = $(this).parents(".chat-info-send").attr("id");
					var newText = $(this).parents(".chat-info-send").find(".article").text();
					var deptListNoRead, deptListRead;
					var modalId = $.modal({
						showFooter: false
					}).show("阅读状态", ".informage-read",
						function(modal) {}
					);
					var formContainer = "#" + modalId;
					var msgId = $(this).parents(".chat-info-send").attr("id");
					var type = $(".chat-page-modal-content[data-id=" + showChatId + "]").attr("data-chat-type") == 1 ? 2 : 1;
					console.log(messageID)
					ws.onsend(38, {
						"message_id": msgId,
						"message_type": type
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载阅读详情失败！");
							return false;
						}
						deptListNoRead = data.data.unread.list;
						deptListRead = data.data.has_read.list;
						$(formContainer + " .informage-main-list:first-child .informage-main-list-top-sp").html(deptListNoRead.length);
						$(formContainer + " .informage-main-list:nth-child(2) .informage-main-list-top-sp").html(deptListRead.length);
						var isStopStr = "class=\"filter\"";
						for(var i = 0; i < deptListNoRead.length; i++) {
							if(deptListNoRead[i].employee_id == myId) continue;
							var Strs = '<li id="' + deptListNoRead[i].employee_id + '" data-isoff="' + deptListNoRead[i].employee_enabled + '" ' + (!deptListNoRead[i].employee_enabled ? "title=\"该用户账号已被停用，不能提醒\" " + isStopStr : "") + '>';
							Strs += '<a href="#">';
							Strs += '<img src="' + deptListNoRead[i].employee_avatar + '" alt="" />';
							Strs += '<p class=\"css-overhidden\" title=' + deptListNoRead[i].employee_name + '>' + deptListNoRead[i].employee_name + '</p>';
							Strs += '</a>';
							Strs += '</li>';
							$(formContainer + " .informage-main-list:first-child ul").append(Strs);

						}
						for(var i = 0; i < deptListRead.length; i++) {
							var Strs = '<li>';
							Strs += '<a href="#">';
							Strs += '<img src="' + deptListRead[i].employee_avatar + '" alt="" />';
							Strs += '<p class=\"css-overhidden\" title=' + deptListRead[i].employee_name + '>' + deptListRead[i].employee_name + '</p>';
							Strs += '</a>';
							Strs += '</li>';
							$(formContainer + " .informage-main-list:nth-child(2) ul").append(Strs);
						}
						//单个选中
						$(formContainer).on("click", ".informage-main-list:nth-child(1) li", function() {
							if($(this).attr("data-isoff") == "false") return false;
							if($(this).find("i").length == 0) {
								$(this).find("img").after("<i class='fa fa-check-circle' aria-hidden='true'></i>");
							} else {
								$(this).find("i").remove();
								$(formContainer + " .informage-bottom-selectall input").removeAttr("checked");
							}
						});
						//全部选中
						$(formContainer + " .informage-bottom-selectall").click(function() {
							if($(this).children("input").prop("checked")) {

								$(this).parent().prev().children().eq(0).find("li[data-isoff=false]").siblings().find("img").after("<i class='fa fa-check-circle' aria-hidden='true'></i>");
							} else {
								$(this).parent().prev().children().eq(0).find("i").remove();
							}
						});
						var infoRemindList = [];
						//提醒阅读点击事件
						$(formContainer + " .btn-remind").click(function() {
							$(formContainer + " .informage-main-list:first-child li").each(function(index) {
								if($(this).find("i").length > 0) {
									infoRemindList.push($(this).attr("id"));
								}
							});
							var infoData = {};
							infoData.data_id = myId;
							infoData.business_type = 30;
							if($(showPage).attr("data-chat-type") != 2)
								infoData.data_id = showChatId;
							infoData.employee_id = infoRemindList.join(',');
							infoData.message = {};
							infoData.message.msg_content = myName + ":" + newText;
							infoData.message.msg_type = 1; //消息MTa
							console.log("消息提醒内容：" + infoData.message.msg_content + "，" + infoData.message.msg_type)
							$.ajaxPost(BSAPIURL + "/mta", infoData, function(response) {
								console.log(response);
								if(response.code == 0) {
									$("#" + modalId).modal("hide");
									$.showSuccessGritter('提醒成功！');
								}
							});
							console.log(infoRemindList);
						});
					});
				});
				//聊天----置顶讨论(添加讨论)
				$(".stick-discussion").unbind("click").click(function() {
					var discussionTitle = $(this).parent().parent().find(".article").text();
					$(showPage + " .add-discussion").trigger("click", [discussionTitle]);
					$(showPage + " .add-discussion").parent().hide();

				});
				//添加讨论
				$(".add-discussion").unbind("click").click(function(event, title) {
					$(this).parent().css("display", "none");
					if($(showPage + " .discussion-content").length != 0) {
						$.showErrorGritter("已有群话题，请先关闭");
						return false;
					}
					var chatId = $(this).parents(".chat-page-modal-content").attr('data-id');
					var obj = this;
					//								var e = window.event || event;
					//								if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
					//									e.stopPropagation();
					//								} else {
					//									//兼容IE的方式来取消事件冒泡 
					//									window.event.cancelBubble = true;
					//								}
					if(title == undefined) {
						title = "";
					}
					//创建弹窗
					if($(".discussion-page").length < 1) {
						var str = "";
						str += "<div class=\"discussion-page hide\">";
						str += "<p>请输入讨论主题:</p>";
						str += "<textarea class=\"discussion-theme\"></textarea>";
						str += "</div>";
						$("body").append(str);
					}
					var modalId = $.modal().show("讨论主题", ".discussion-page", function() {
						var discussionTitle = $("#" + modalId + " .discussion-theme").val();
						if(discussionTitle == "") {
							$.showErrorGritter("讨论主题不能为空！");
							return false;
						}
						console.log("字数：" + discussionTitle.length);
						if(discussionTitle.length >= 500) {
							$.showErrorGritter("讨论主题字数不能超过500字！");
							return false;
						}
						$(obj).parent().hide();
						$("#" + modalId).modal('hide');
						$(showPage + " .discussion-content").remove();

						//切换到聊天页面
						$(obj).parents(".chat-page-top").next().children("div").eq(0).show().siblings().hide();
						$(obj).parents(".chat-page-top").find("li").eq(0).addClass("pitchon").siblings().removeClass("pitchon");
						console.log("创建群话题：" + discussionTitle);
						ws.onsend(25, {
							"group_id": showChatId,
							"topic_title": discussionTitle
						}, function(data) {
							if(data.action == 200) return false;
							offGroupDiscussion(data);
						});
					});
					$("#" + modalId + " .discussion-theme").val(title);

					function offGroupDiscussion(data) {
						console.log(data);
						if(data.action == 500) {
							console.log(data.data.message);
							$.showErrorGritter("新建群话题失败");
							return false;
						} else {
							var str = "<div class=\"discussion-content\" id=" + data.data.topic_id + ">";
							str += "<p class=\"discussion-top\" title=" + discussionTitle + "><span>讨论主题:</span>" + discussionTitle + "</p>";
							str += "<p class=\"discussion-buttom\">" + myName + "添加于" + $.timeNow().Format("yyyy-MM-dd hh:mm:ss") + "<span class=\"off-theme\">关闭</span></p>";
							str += "</div>";
							//根据id找位置
							$(obj).parents(".chat-page-modal-content").find(".chat-page-main").prepend(str);
							//$(showPage + " .discussion-content").attr("id", );
						}
						bindIncident();
					}
				});
				//讨论历史
				$(".discussion-history").unbind("click").click(function(event) {
					var e = window.event || event;
					if(e.stopPropagation) {
						//如果提供了事件对象，则这是一个非IE浏览器
						e.stopPropagation();
					} else {
						//兼容IE的方式来取消事件冒泡 
						window.event.cancelBubble = true;
					}
					$(this).parents(".chat-page-top").next().children("div").hide();
					$(this).parents(".chat-page-top").next().children("div").eq(3).show();
					$(this).parent().hide();
					var searcgDate = "",
						searchKeyText = "",
						searchLimit = 10,
						searchPage = 1;
					//搜索
					//到第一页
					$(showPage + " .inform-buttom .fa-step-backward").unbind("click").click(function() {
						searchPage = 1;
						loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
					});
					//上一页
					$(showPage + " .inform-buttom .fa-backward").unbind("click").click(function() {
						if(searchPage != 1) {
							searchPage--;
							loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
						}
					});
					//下一页
					$(showPage + " .inform-buttom .fa-forward").unbind("click").click(function() {
						if($(showPage + " .inform-buttom .page-all-num").text() > searchPage) {
							searchPage++;
							loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
						}
					});
					//最后一页
					$(showPage + " .inform-buttom .fa-step-forward").unbind("click").click(function() {
						searchPage = $(showPage + " .inform-buttom .page-all-num").text();
						loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
					});
					//页数搜索
					$(showPage + " .inform-buttom .page-num").keyup(function(event) {
						if(event.keyCode == 13) {
							var searchPageNum = $(this).val();
							var pageAllNum = $(this).siblings(".page-all-num").text();
							if(searchPageNum > pageAllNum) {
								$.showErrorGritter("当前最多" + pageAllNum + "页");
								return false;
							}
							searchPage = searchPageNum;
							loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
						}
					});
					//时间搜索
					$(showPage + " .inform-buttom .search-time").change(function(event) {
						searcgDate = $(this).val();
						loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
					});
					//关键字搜索
					$(showPage + " .inform-buttom .fa-search").click(function() {
						if($(this).prevAll(".search-keytext").css("display") == "none") {
							$(this).prevAll(".search-keytext").show();
						} else {
							$(this).prevAll(".search-keytext").hide();
						}
					});
					$(showPage + " .inform-buttom .search-keytext").keyup(function(event) {
						if(event.keyCode == 13) {
							searchKeyText = $(this).val();
							searchPage = 1;
							loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);
						}
					});
					//验证---------未完待续
					loadHistoryDiscussion(searcgDate, searchKeyText, searchPage, searchLimit);

				});
				//聊天----转发
				$(".file-transmit").unbind("click").click(function() {
					if(!isUnline()) return false;
					var obj = this;
					var modalId = $.modal().showOfLarge("转发", ".load-transpond-list", function() {
						//转发的消息Id
						var infoId = $(obj).parents(".message-info").attr("id");
						var fileData = $(obj).parents(".message-info").data("fileData");
						if($(obj).parents(".message-info").hasClass("uploaded-file-container")) {
							infoId = $(obj).parent().prev().attr("data-file-id");
							fileData = JSON.parse($(obj).parents(".message-info").attr("data-file"));
						}
						console.log(fileData);
						var infoType = ($(showPage).attr("data-chat-type") == "2" ? "1" : "2");
						var filesPath = fileData.path;
						var filesName = fileData.name;
						$(contentBody + " .body-left-content .list-box").each(function(index) {
							var fileDataText = JSON.stringify(fileData);
							//判断是否被打开的
							var chatObjId = $(this).attr("data-id");
							var chatObjType = $(this).attr("data-type");
							fileDataText = "[file_" + fileDataText + "]"; //发送服务器内容
							window.sendFileId = "";
							if(chatObjType == 1) { //单发文件
								ws.onsend(40, {
									"message": fileDataText,
									"message_type": 1,
									"to_employee": chatObjId
								}, function(data) {
									if(data.action == 200) fileSend(data, fileData, chatObjId, chatObjType);
									if(data.action == 500) {
										$.showErrorGritter("转发失败！");
										return false;
									}
									//if($("#" + chatObjId).lenth != 0)
									//$(".infolist-chatlist li[data-id=" + chatObjId + "] .news-info-text").text("[文件]");
								});
							} else { //群发文件
								ws.onsend(41, {
									"message": fileDataText,
									"message_type": 1,
									"to_group": chatObjId
								}, function(data) {
									if(data.action == 200) fileSend(data, fileData, chatObjId, chatObjType);
									if(data.action == 500) {
										$.showErrorGritter("转发失败！");
										return false;
									}
									//if($("#" + chatObjId).lenth != 0)

									//$(".infolist-chatlist li[data-id]=" + chatObjId + "] .news-info-text").text(myName + ":[文件]");
								});
							}
						});

						$("#" + modalId).modal("hide");
					});
					var contentBody = "#" + modalId + " .modal-body-main";
					//加载最近联系人
					ws.onsend(22, {}, function(data) {
						var infoData = data.data;
						if(data.action == 200) return false;
						for(var i in infoData) {
							if(infoData[i].msg_session_id == "BusinessNotifier") {
								continue;
							}
							var str = "<li>";
							str += "<div class=\"tree-info tree-bottom\" data-type=" + infoData[i].msg_session_type + " data-id=" + infoData[i].msg_session_id + ">";
							//str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
							str += "<span class=\"tree-name\">" + infoData[i].title + "</span>";
							str += "</div>";
							str += "</li>";
							$(contentBody + " .recently-chat-list>ul").append(str);
						}
						addClick(contentBody);
					});
					//加载群组
					ws.onsend(21, {}, function(data) {
						var infoData = data.data;
						if(data.action == 200) return false;
						for(var i in infoData) {
							var str = "<li>";
							str += "<div class=\"tree-info tree-bottom\" data-type=\"2\" data-id=" + infoData[i].group_id + ">";
							//str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
							str += "<span class=\"tree-name\">" + infoData[i].group_desc + "</span>";
							str += "</div>";
							str += "</li>";
							$(contentBody + " .group-chat-list>ul").append(str);
						}
						addClick(contentBody);
					});
					//加载好友
					ws.onsend(20, {}, function(data) {
						var infoData = data.data;
						if(data.action == 200) return false;
						loadFirendTree(infoData, contentBody + " .tree-list-a", "3", "1");
						addClick(contentBody);
					});

				});
				//复制
				$(".chat-copy").unbind("click").click(function() {
					var copyText = $(this).parent().parent().find(".article").html();
					console.log(copyText);
					var aux = document.createElement("input");
					// 获取复制内容
					var content = copyText;
					// 设置元素内容
					aux.setAttribute("value", content);
					// 将元素插入页面进行调用
					document.body.appendChild(aux);
					// 复制内容
					aux.select();
					// 将内容复制到剪贴板
					document.execCommand("copy");
					// 删除创建元素
					document.body.removeChild(aux);
				});
				//加载更多历史记录
				$(".chat-page-main-loadmore").unbind("click").click(function() {
					$(this).remove();
					chatHistoryPage = 10;
					var type = $(showPage).attr("data-chat-type");
					var msgId = $(showPage + " .chat-info>div").first().attr("id");

					if(type == 1 || type == 2) {

						$(this).remove();
						ws.onsend(44, {
							"base_msg_id": msgId,
							"msg_session_id": showChatId,
							"msg_session_type": (type == 2 ? 1 : 2),
							"limit": chatHistoryPage,
							"with_employees": 1
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("获取消息失败！");
								return false;
							}
							loadChatRecord(data);
						});
					} else if(type == 5) {
						console.log(msgId)
						ws.onsend(44, {
							"base_msg_id": msgId,
							"msg_session_id": showChatId,
							"msg_session_type": 1,
							"limit": chatHistoryPage,
							"with_employees": 1
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("获取最近消息失败！");
								return false;
							}
							loadBusinessInform(data);
						});
					} else {
						var msgId = $(showPage + " .chat-info>div").first().attr("id");
						console.log(msgId);
						$(this).remove();
						ws.onsend(85, {
							"base_msg_id": msgId,
							"to_user": showChatId,
							"limit": chatHistoryPage
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("获取最近消息失败！");
								return false;
							}
							loadChatRecords(data);
						});
					}
				});

			}
			//是否在线
		window.isUnline = function() {
			if(ws.readyState == 3) {
				$.showErrorGritter("您已经掉线，请稍后再试！");
				return false;
			} else {
				return true;
			}
		}
	}
	//IM聊天----------------------------------------------------------------------end--------
	//IM聊天弹窗
$.chatPage = function(option) {
		isMinPage = false;
		console.log(option)
			//群聊删除@我
		if((option.type == 1 || option.type == 6) && $(".infolist-chatlist li[data-id=" + option.Id + "] .at-me").length != 0) {
			$(".infolist-chatlist li[data-id=" + option.Id + "] .at-me").remove();
		}
		if(!isUnline()) return false;
		$(".chat-page").show();
		//关闭历史记录
		$(".view-chart-history-content-header .fa-close").trigger("click");
		//聊天模板类型(1-群聊、2-私聊、3-通知、4-客服、5-事项处理、6-群聊（讨论群）)
		var chatType = option.type;
		var chatId = option.Id;
		var chatObjName = option.Name;
		var chatObjAvatar = option.Avatar;
		var width = option.width == "" ? "900px" : option.width;
		var height = option.height == "" ? "650px" : option.height;
		var isOnline = (option.Online == "false" ? false : true);
		window.chatHistoryPage = 3;
		//过滤自己
		if(chatId == myId) return false;
		//打开状态的聊天对象id
		window.showChatId = chatId;
		window.showPage = ".chat-page-modal-content[data-id=" + showChatId + "]";
		console.log("是否在线：" + isOnline)
		if($(".chat-page").length <= 0) {
			var str = "<div class=\"chat-page border-shadow\" style=\"width:750px\">";
			str += "<div class=\"chat-page-left pull-left hide\">";
			str += "<!--聊天框列表-->";
			str += "<ul class=\"chat-page-list\">";
			//		str += "<li data-chattype=\"" + chatType + "\" id=\"" + chatId + "\" class=\"selectstyle\">";
			//		str += "<img src=\"../resources/images/case-4.png\" />";
			//		str += "<span class=\"chat-list-name\">技术交流群</span>";
			//		str += "<span class=\"info-num list-num\">2</span>";
			//		str += "<span class=\"info-num list-detele\">×</span>";
			//		str += "</li>";
			str += "</ul>";
			str += "</div>";
			str += "<!--聊天模板-->";
			str += "<div class=\"chat-page-modal pull-right\">";
			str += "</div>";
			str += "<!--聊天记录-->";
			str += "<div class=\"view-chart-history-container\">";
			str += "<div class=\"view-chart-history-content\">";
			str += "<!--标题-->";
			str += "<div class=\"view-chart-history-content-header\">";
			str += "<span>聊天记录</span>";
			str += "<i class=\"fa fa-close fa-x\"></i>";
			str += "</div>";
			str += "<!--内容-->";
			str += "<div class=\"view-chart-history-content-body\">";
			str += "<!--时间-->";
			str += "<div class=\"this-chart-record-history-time\">";
			str += "<i></i>";
			str += "<span>08-27 12:24</span>";
			str += "<i></i>";
			str += "</div>";
			str += "<!--一条消息-->";
			str += "<div class=\"view-chart-historyone-message\">";
			str += "<span class=\"message-name\">张三</span>";
			str += "<span class=\"message-time\">11:48:14</span><br />";
			str += "<span class=\"message-detail\">老师：学习委员：老师都不认真</span>";
			str += "</div>";
			str += "</div>";
			str += "<!--尾部-->";
			str += "<div class=\"view-chart-history-content-footer\">";
			str += "<!--关键字查找-->";
			str += "<div class=\"key-word-search hide\">";
			str += "<input type=\"text\" placeholder=\"请输入关键字查找\" style=\"width: 70%;\" />";
			str += "<a href=\"#\" class=\"btn btn-default btn-sm btn-key-word-search\">搜索</a>";
			str += "</div>";
			str += "<div class=\"view-chart-history-before\">";
			str += "<i style=\"color: #999;display: inline-block;margin-right: 8px;\" class=\"fa fa-fast-backward fa-x\"></i>";
			str += "<i style=\"color: #999;display: inline-block;margin-right: 4px;\" class=\"fa fa-backward fa-x\"></i>";
			str += "</div>";
			str += "<div style=\"border-left: 2px solid #ccc;border-right: 2px solid #ccc;padding: 0 5px;display:none\">";
			str += "第";
			str += "<input type=\"text\" style=\"width: 45px;line-height:16px;text-align:center;\" class=\"history-curr-pager\" maxlength=\"3\" value=\"1\">";
			str += "/<span class=\"history-total-pager\">2</span>页，";
			str += "<span class=\"history-total-record\">40</span>条";
			str += "</div>";
			str += "<div class=\"view-chart-history-after\">";
			str += "<i style=\"color: #999;display: inline-block;margin-left: 4px;\" class=\"fa fa-forward fa-x\"></i>";
			str += "<i style=\"color: #999;display: inline-block;margin-left: 8px;\" class=\"fa fa-fast-forward fa-x\"></i>";
			str += "</div>";
			str += "<a href=\"javascript:;\" class=\"search-chart-history\">查找</a>";
			str += "<div class=\"view-chart-history-sel-time\" style=\"float:right;margin-right: 10px;\">";
			//			str += "<i class=\"fa fa-search\"></i>";
			str += "<i class=\"fa fa-search pull-right search-ico  fa-x\" aria-hidden=\"true\"  style=\"color:#999;margin-left:0!important;margin-top:6px!important\"></i>";
			str += "<input type=\"text\" class=\"date-picker\" placeholder=\"年/月/日\" style=\"border-right:0;float:right;margin-top:6px;width:120px\" />";
			str += "</div>";
			str += "</div>";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"clearfix\"></div>";
			str += "</div>";
			str += "<!--发布新公告弹窗-->";
			str += "<div class=\"release-inform-page hide\">";
			str += "<div class=\"release-inform-top\">";
			str += "<label><span class=\"important\">*</span>公告标题：</label>";
			str += "<input type=\"text\" placeholder=\"请输入公告标题\" class=\"inform-title-text\" />";
			str += "</div>";
			str += "<div class=\"release-inform-centent\">";
			str += "<label><span class=\"important\">*</span>公告内容：</label>";
			str += "<textarea placeholder=\"请输入公告内容\" class=\"inform-content-text\" /></textarea>";
			str += "</div>";
			str += "</div>";
			str += "<!--M Ta们弹窗-->";
			str += "<div class=\"informage-popup informage-read m-ta hide\">";
			str += "<div class=\"informage-main\">";
			str += "<div class=\"informage-main-list\">";
			str += "<span class=\"informage-main-list-top\">未读<span class=\"informage-main-list-top-sp\"></span>人</span>";
			str += "<ul>";
			//			str += "<li>";
			//			str += "<a href=\"#\">";
			//			str += "<img src=\"../resources/images/case-4.png\" alt=\"\" />";
			//			str += "<p>吴芳</p>";
			//			str += "</a>";
			//			str += "</li>";
			str += "</ul>";
			str += "</div>";
			str += "<div class=\"informage-main-list\">";
			str += "<span class=\"informage-main-list-top\">已读<span class=\"informage-main-list-top-sp\"></span>人</span>";
			str += "<ul>";

			str += "<div class=\"clear\"></div>";
			str += "</ul>";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"informage-bottom\">";
			str += "<label class=\"informage-bottom-selectall\"><input type=\"checkbox\" class=\"informage-bottom-selectall\" />未读同事</label><input type=\"button\" value=\"提醒阅读\" class=\"btn btn-default btn-sm comment-btn btn-remind\" />";
			str += "</div>";
			str += "</div>";
			str += "<!--群设置弹窗-->";
			str += "<div class=\"group-set-page hide\">";
			str += "<div class=\"group-set-top group-main\">";
			str += "<div class=\"group-set-info\">";
			str += "<a href=\"javascript:;\">";
			str += "<img src=\"../resources/images/case-4.png\" />";
			str += "<span>更换头像</span>";
			str += "</a>";
			str += "<p class=\"group-set-name\">技术讨论群";
			str += "<p>";
			str += "</div>";
			str += "<p class=\"group-set\">";
			str += "<i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>";
			str += "<i class=\"fa fa-check\" aria-hidden=\"true\"></i>";
			str += "<i class=\"fa fa-times\" aria-hidden=\"true\"></i>";
			str += "</p>";
			str += "</div>";
			str += "<p class=\"group-set-menu\">群主|管理员</p>";
			str += "<div class=\"group-custodian group-main\">";
			//		str += "<div class=\"group-custodian-main group-member-box\">";
			//		str += "<img src=\"../resources/images/case-4.png\">";
			//		str += "<span class=\"group-custodian-main-name\">群主</span>";
			//		str += "</div>";
			str += "<div class=\"group-custodian-separate\"></div>";
			//		str += "<div class=\"group-custodian-assistant group-member-box\">";
			//		str += "<img src=\"../resources/images/case-4.png\">";
			//		str += "<span class=\"group-custodian-assistant-name\">群管理</span>";
			//		str += "</div>";
			//		str += "<div class=\"group-custodian-assistant group-member-box\">";
			//		str += "<img src=\"../resources/images/case-4.png\">";
			//		str += "<span class=\"group-custodian-assistant-name\">群管理</span>";
			//		str += "</div>";
			str += "</div>";
			str += "<p class=\"group-set-menu\">";
			str += "<span class=\"group-man-number\">群成员:15人</span>";
			str += "<span class=\"group-set-change pull-right\">转让群主</span>";
			str += "<span class=\"group-set-administrator pull-right\">设置管理员</span>";
			str += "<span class=\"group-set-add pull-right\">添加成员</span>";
			str += "</p>";
			str += "<div class=\"group-set-administrator-select\">";
			str += "<span class=\"select-administrator-num select-num\">请选择管理员：";
			str += "(<span class=\"already-select\">0</span>/";
			str += "<span class=\"all-number\">5</span>)";
			str += "</span>";
			str += "<span class=\"select-obj select-num\">请选择转让对象：";
			str += "</span>";
			str += "<input type=\"button\" value=\"取消\" class=\"btn btn-default btn-sm btn-cancel pull-right\" />";
			str += "<input type=\"button\" value=\"保存\" class=\"btn btn-default btn-sm btn-save pull-right\" />";
			str += "<div class=\"clearfix\"></div>";
			str += "</div>";
			str += "<div class=\"group-member group-main\">";
			//		str += "<div class=\"group-member-box\">";
			//		str += "<img src=\"../resources/images/case-4.png\">";
			//		str += "<span class=\"group-custodian-assistant-name\">群管理</span>";
			//		str += "</div>";
			str += "</div>";
			str += "<div class=\"group-set-buttom\">";
			str += "<input type=\"button\" value=\"退出群聊\" class=\"btn btn-default btn-exit-group\" />";
			str += "<input type=\"button\" value=\"解散该群\" class=\"btn btn-default btn-dissolve-group\" />";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"offpage-page hide\">";
			str += "<p class=\"offpage-warn\"><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>关闭当前会话还是关闭所有会话？<p>";
			str += "<div class=\"offpage-page-bottom\"><input type=\"botton\" class=\"btn btn-default btn-sm btn-off-all-page\" value=\"关闭所有\"><input type=\"botton\" class=\"btn btn-default btn-sm btn-off-single-page\" value=\"关闭当前\"></div>";
			str += "</div>";
			str += "<!--转发弹窗-->";
			str += "<div class=\"load-transpond-list hide\">";
			str += "<div class=\"modal-body-main\">";
			str += "<div class=\"modal-body-left pull-left\">";
			str += "<p class=\"body-left-menu\">请选择转发对象:</p>";
			str += "<div class=\"body-left-content\">";
			str += "<div class=\"body-left-content-top\">";
			str += "<input type=\"text\" class=\"body-left-content-top-search\" placeholder=\"搜索姓名\" />";
			str += "</div>";
			str += "<div class=\"body-left-content-list\">";
			str += "<ul class=\"tree-list-a\">";
			str += "<li class=\"recently-chat-list\">";
			str += "<div class=\"tree-info tree-menu\">";
			str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
			str += "<span class=\"tree-name\">最近联系人</span>";
			str += "</div>";
			str += "<ul>";
			str += "</ul>";
			str += "</li>";
			str += "<li class=\"group-chat-list\">";
			str += "<div class=\"tree-info tree-menu\">";
			str += "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
			str += "<span class=\"tree-name\">群组</span>";
			str += "</div>";
			str += "<ul>";
			str += "</ul>";
			str += "</li>";
			str += "</ul>";
			str += "</div>";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"modal-body-right pull-right\">";
			str += "<p class=\"body-left-menu\">转发给以下联系人:<span class=\"pull-right\">已选<span class=\"select-num\">0</span>人</span></p>";
			str += "<div class=\"body-left-content\">";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"clearfix\"></div>";
			str += "</div>";
			str += "</div>";
			$("body").append(str);
			$(".chat-page").css({
				"width": width,
				"height": height
			});
		}
		//已添加弹窗

		//判断是否已存在
		var isloadText = isExist(chatId);
		if(!isloadText) {
			//添加聊天框左侧列表
			var str = "<li data-chattype=\"" + chatType + "\" id=\"" + chatId + "\">";
			str += "<img class=\"avatar-img " + (isOnline ? "" : " underline") + "\" src=" + chatObjAvatar + " />";
			str += "<span class=\"chat-list-name\" title=" + chatObjName + ">" + chatObjName + "</span>";
			//str += "<span class=\"info-num list-num\">2</span>";
			str += "<span class=\"info-num list-detele\">×</span>";
			str += "</li>";
			$(".chat-page-list").append(str);
			if($(".chat-page-list li").length == 2) {
				$(".chat-page-list").parent().removeClass("hide");
				$(".chat-page").css("width", "900px");
			}
			//添加聊天框
			var str = "";
			str += "<div class=\"chat-page-modal-content\" data-id=\"" + chatId + "\" data-chat-type=" + chatType + ">";
			//头部
			if(chatType == 1) {
				str += "<div class=\"chat-page-top\">";
				str += "<img src=" + chatObjAvatar + " class=\"pull-left\" />";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\" title=" + chatObjName + ">" + chatObjName + "</p>";
				str += "<p class=\"info-nums\">2人</p>";
				str += "</span>";
				str += "<ul class=\"chat-page-nav pull-left\">";
				str += "<li class=\"pitchon\"><i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-volume-down\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-folder\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-hashtag\" aria-hidden=\"true\"></i><span><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></span><ul class=\"discussion-menu\"><li class=\"add-discussion\">添加讨论</li><li class=\"discussion-history\">历史讨论</li></ul></li>";
				str += "<li><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></li>";
				str += "<div class=\"clearfix\"></div>";
				str += "</ul>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			} else if(chatType == 6) {
				str += "<div class=\"chat-page-top\">";
				str += "<img src=" + chatObjAvatar + " class=\"pull-left\" />";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\" title=" + chatObjName + ">" + chatObjName + "</p>";
				str += "<p class=\"info-nums\">2人</p>";
				str += "</span>";
				str += "<ul class=\"chat-page-nav pull-left\">";
				str += "<li class=\"pitchon\"><i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-volume-down\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-folder\" aria-hidden=\"true\"></i></li>";
				//str += "<li><i class=\"fa fa-hashtag\" aria-hidden=\"true\"></i><span><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></span><ul class=\"discussion-menu\"><li class=\"add-discussion\">添加讨论</li><li class=\"discussion-history\">历史讨论</li></ul></li>";
				str += "<li><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></li>";
				str += "<div class=\"clearfix\"></div>";
				str += "</ul>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			} else if(chatType == 2) {
				str += "<div class=\"chat-page-top\">";
				str += "<img src=\"" + chatObjAvatar + "\" class=\"avatar-img pull-left " + (isOnline ? "" : " underline") + "\" onclick=\"openPersonageInfo(this)\" data-id=" + chatId + " />";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\" title=" + chatObjName + ">" + chatObjName + "</p>";
				str += "</span>";
				str += "<ul class=\"chat-page-nav pull-left\">";
				str += "<li class=\"pitchon\"><i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-folder\" aria-hidden=\"true\"></i></li>";
				str += "<div class=\"clearfix\"></div>";
				str += "</ul>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			} else if(chatType == 3) {
				str += "<div class=\"chat-page-top\">";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\">业务通知</p>";
				str += "</span>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			} else if(chatType == 4) {
				str += "<div class=\"chat-page-top\">";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\" title=" + chatObjName + ">" + chatObjName + "</p>";
				str += "</span>";
				str += "<ul class=\"chat-page-nav pull-left\">";
				str += "<li class=\"pitchon\"><i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i></li>";
				str += "<li><i class=\"fa fa-folder\" aria-hidden=\"true\"></i></li>";
				str += "<div class=\"clearfix\"></div>";
				str += "</ul>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			} else {
				str += "<div class=\"chat-page-top\">";
				str += "<span class=\"chat-page-info  pull-left\">";
				str += "<p class=\"info-name css-overhidden\" title=" + chatObjName + ">" + chatObjName + "</p>";
				str += "</span>";
				str += "<div class=\"chat-off pull-right\">";
				str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
				str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
				str += "</div>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
			}
			//头部结束
			str += "<div class=\"chat-page-content\">";
			str += "<!--聊天界面-->";
			//中部开始
			str += "<div class=\"chat-page-main\">";
			if(chatType == 1) {
				str += "<div class=\"chat-info\">";

			} else if(chatType == 6) {
				str += "<div class=\"chat-info\">";

			} else if(chatType == 2) {
				str += "<div class=\"chat-info\">";

			} else if(chatType == 3) {
				str += "<div class=\"chat-inform chat-info\">";
				//str += "<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>查看更多消息</a>";
				//str += "<p class=\"chat-page-main-toptime\">08-17 12:24</p>";
				str += "<div class=\"chat-info-receive\">";
				str += "<img src=\"../resources/images/case-4.png\" class=\"pull-left\">";
				str += "<div class=\"demo clearfix\">";
				str += "<span class=\"triangle\"></span>";
				str += "<div class=\"article\">我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了</div>";
				str += "</div>";
				str += "</div>";
			} else if(chatType == 4) {
				str += "<div class=\"chat-info\">";

			} else {
				str += "<div class=\"chat-inform chat-info\">";

			}
			//中部结束
			str += "</div>";
			//下部
			if(chatType == 1 || chatType == 6) {
				str += "<div class=\"chat-tool-list\">";
				str += "<div class=\"uploaded hide\"></div>";
				str += "<i class=\"fa fa-folder\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-file-image-o\" aria-hidden=\"true\" title=\"支持jpg、png、gif，jpeg格式\"></i>";
				str += "<i class=\"fa fa-smile-o\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-at\" aria-hidden=\"true\"></i>";
				str += "<a href=\"javascript:;\" class=\"char-info-record pull-right\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>聊天记录</a>";
				str += "</div>";
				str += "<div class=\"chat-text\" data-location=\"0\" id=\"" + chatId + "dchat-text\" contenteditable=\"true\" id=" + chatId + "chatText></div>";
				str += "<input type=\"button\" name=\"\" class=\"btn btn-default btn-send\" value=\"发送\" />";
			} else if(chatType == 2) {
				str += "<div class=\"chat-tool-list\">";
				str += "<div class=\"uploaded hide\"></div>";
				str += "<i class=\"fa fa-folder\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-file-image-o\" aria-hidden=\"true\" title=\"支持jpg、png、gif，jpeg格式\"></i>";
				str += "<i class=\"fa fa-smile-o\" aria-hidden=\"true\"></i>";
				str += "<a href=\"javascript:;\" class=\"char-info-record pull-right\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>聊天记录</a>";
				str += "</div>";
				str += "<div class=\"chat-text\" data-location=\"0\" contenteditable=\"true\" id=" + chatId + "chatText></div>";
				str += "<input type=\"button\" name=\"\" class=\"btn btn-default btn-send\" value=\"发送\" />";
			} else if(chatType == 3) {

			} else if(chatType == 4) {
				str += "<div class=\"chat-tool-list\">";
				str += "<div class=\"uploaded hide\"></div>";
				str += "<i class=\"fa fa-folder\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-file-image-o\" aria-hidden=\"true\" title=\"支持jpg、png、gif，jpeg格式\"></i>";
				str += "<i class=\"fa fa-smile-o\" aria-hidden=\"true\"></i>";
				str += "<a href=\"javascript:;\" class=\"char-info-record pull-right\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>聊天记录</a>";
				str += "</div>";
				str += "<div class=\"chat-text\" data-location=\"0\" contenteditable=\"true\" id=" + chatId + "chatText></div>";
				str += "<input type=\"button\" name=\"\" class=\"btn btn-default btn-send\" value=\"发送\" />";
			} else {

			}
			str += "</div>";
			if(chatType == 1) {
				str += "<!--群通知页面-->";
				str += "<div class=\"chat-page-inform\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">群公告</span>";
				str += "<a href=\"javascript:;\" class=\"btn btn-default pull-right\" onclick=\"releaseInform()\">+发布新公告</a>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<div class=\"inform-content\">";
				str += "<div class=\"inform-list-box\">";
				str += "<div class=\"inform-box-top\">";
				str += "<span class=\"inform-name pull-left\">公告一</span>";
				str += "<i class=\"fa fa-trash pull-right\" aria-hidden=\"true\" onclick=\"deleteInform(this)\"></i>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<p class=\"inform-text shrink\">";
				str += "	公告，是指政府、团体对重大事件当众正式公布或者公开宣告，宣布。";
				str += "</p>";
				str += "<a href=\"javascript:;\" class=\"inform-flexible\">展开</a>";
				str += "<p class=\"inform-release\">";
				str += "<span class=\"inform-release-name\">张三</span>";
				str += "<span class=\"inform-release-time\">2016-09-11 16:00</span>";
				str += "</p>";
				str += "</div>";
				str += "</div>";
				str += "</div>";
				str += "<!--群文件界面-->";
				str += "<div class=\"chat-page-file\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">聊天文件</span>|";
				str += "<span class=\"file-num\">共<span></span>个文件</span>";
				str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
				str += "<input type=\"text\" name=\"\" class=\"file-search-text\" placeholder=\"输入文件名进行查找\" />";
				str += "</div>";
				str += "<div class=\"file-content\">";
				str += "<table class=\"file-list\">";
				str += "<tbody>";
				str += "<tr><th style=\"width:36%\">文件名</th><th style=\"width:20%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></th><th  style=\"width:15%\">大小</th><th style=\"width:15%\">发布人</th><th style=\"width:15%\">操作</th></tr>";
				str += "<tr>";
				str += "<td colspan=\"5\">";
				str += "<div class=\"file-list-data\">";
				str += "<table>";
				str += "</table>";
				str += "</div>";
				str += "</td>";
				str += "</tr>";
				str += "</tbody>";
				str += "</table>";
				str += "</div>";
				str += "</div>";
				str += "<!--群讨论历史-->";
				str += "<div class=\"chat-page-discussion-history\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">历史讨论</span>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<div class=\"inform-content\">";
				str += "<p class=\"discussion-history-time\"><span>---------------------------------------</span>09-11<span>---------------------------------------</span></p>";
				str += "<div class=\"inform-list-box\">";
				str += "<div class=\"inform-box-top\">";
				str += "<span class=\"inform-name pull-left\"><span>08：00</span>-<span>18：00</span></span>";
				str += "<span class=\"release-info pull-right\">张三，销售部</span>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<p class=\"inform-text shrink\">";
				str += "	#西南医院如果继续开发新客户，维护老客户，西南医院如果继续开发新客户，维护老客户。";
				str += "</p>";
				str += "</div>";
				str += "</div>";
				str += "<div class=\"inform-buttom\">";
				str += "<i class=\"fa fa-step-backward\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>";
				str += "|";
				str += "第<input type=\"text\" value=\"1\" maxlength=\"2\"  class=\"page-num\" />";
				str += "/<span class=\"page-all-num\"></span>页，";
				str += "<span class=\"record-number\"></span>条";
				str += "|";
				str += "<i class=\"fa fa-forward\" aria-hidden=\"true\"></i>";
				str += "<i class=\"fa fa-step-forward\" aria-hidden=\"true\"></i>";
				str += "<input type=\"text\" placeholder=\"输入关键字\" style=\"margin-left:125px\" class=\"search-keytext\"/>";
				str += "<input type=\"text\" placeholder=\"年/月/日\" class=\"search-time pull-right\"/>";
				str += "<i class=\"fa fa-search pull-right\" aria-hidden=\"true\"style=\"line-height:26px\"></i>";
				str += "</div>";
				str += "</div>";
			} else if(chatType == 6) {
				str += "<!--群通知页面-->";
				str += "<div class=\"chat-page-inform\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">群公告</span>";
				str += "<a href=\"javascript:;\" class=\"btn btn-default pull-right\" onclick=\"releaseInform()\">+发布新公告</a>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<div class=\"inform-content\">";
				str += "<div class=\"inform-list-box\">";
				str += "<div class=\"inform-box-top\">";
				str += "<span class=\"inform-name pull-left\">公告一</span>";
				str += "<i class=\"fa fa-trash pull-right\" aria-hidden=\"true\" onclick=\"deleteInform(this)\"></i>";
				str += "<div class=\"clearfix\"></div>";
				str += "</div>";
				str += "<p class=\"inform-text shrink\">";
				str += "	公告，是指政府、团体对重大事件当众正式公布或者公开宣告，宣布。";
				str += "</p>";
				str += "<a href=\"javascript:;\" class=\"inform-flexible\">展开</a>";
				str += "<p class=\"inform-release\">";
				str += "<span class=\"inform-release-name\">张三</span>";
				str += "<span class=\"inform-release-time\">2016-09-11 16:00</span>";
				str += "</p>";
				str += "</div>";
				str += "</div>";
				str += "</div>";
				str += "<!--群文件界面-->";
				str += "<div class=\"chat-page-file\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">聊天文件</span>|";
				str += "<span class=\"file-num\">共<span></span>个文件</span>";
				str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
				str += "<input type=\"text\" name=\"\" class=\"file-search-text\" placeholder=\"输入文件名进行查找\" />";
				str += "</div>";
				str += "<div class=\"file-content\">";
				//			str += "<ul class=\"file-nav\">";
				//			str += "<li style=\"width:40%\">文件名</li>";
				//			str += "<li style=\"width:25%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></li>";
				//			str += "<li style=\"width:10%\">大小</li>";
				//			str += "<li style=\"width:10%\">发布人</li>";
				//			str += "<li style=\"width:10%\">操作</li>";
				//			str += "</ul>";
				str += "<table class=\"file-list\">";
				str += "<tbody>";
				str += "<tr><th style=\"width:36%\">文件名</th><th style=\"width:20%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></th><th  style=\"width:15%\">大小</th><th style=\"width:15%\">发布人</th><th style=\"width:15%\">操作</th></tr>";
				str += "<tr>";
				str += "<td colspan=\"5\">";
				str += "<div class=\"file-list-data\">";
				str += "<table>";
				str += "</table>";
				str += "</div>";
				str += "</td>";
				str += "</tr>";
				//			<tr>
				//				<td width=\"50%\"><span class=\"file-name\">这是文本文件</span></td>
				//				<td width=\"20%\">2016-08-30 16:03</td>
				//				<td width=\"10%\">1.5MB</td>
				//				<td width=\"10%\">徐娇</td>
				//				<td width=\"10%\">
				//					<i class=\"fa fa-eye\" aria-hidden=\"true\" title=\"预览\"></i>
				//					<i class=\"fa fa-download\" aria-hidden=\"true\" title=\"下载\"></i>
				//				</td>
				//			</tr>
				//			<tr>
				//				<td width=\"50%\"><span class=\"file-name\">这是图片文件</span></td>
				//				<td width=\"20%\">2016-08-30 16:03</td>
				//				<td width=\"10%\">1.5MB</td>
				//				<td width=\"10%\">徐娇</td>
				//				<td width=\"10%\">
				//					<i class=\"fa fa-eye\" aria-hidden=\"true\" title=\"预览\"></i>
				//					<i class=\"fa fa-download\" aria-hidden=\"true\" title=\"下载\"></i>
				//				</td>
				//			</tr>
				str += "</tbody>";
				str += "</table>";
				str += "</div>";
				str += "</div>";
			} else if(chatType == 2) {
				str += "<!--群文件界面-->";
				str += "<div class=\"chat-page-file\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">聊天文件</span>|";
				str += "<span class=\"file-num\">共<span></span>个文件</span>";
				str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
				str += "<input type=\"text\" name=\"\" class=\"file-search-text\" placeholder=\"输入文件名进行查找\" />";
				str += "</div>";
				str += "<div class=\"file-content\">";
				//			str += "<ul class=\"file-nav\">";
				//			str += "<li style=\"width:40%\">文件名</li>";
				//			str += "<li style=\"width:25%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></li>";
				//			str += "<li style=\"width:10%\">大小</li>";
				//			str += "<li style=\"width:10%\">发布人</li>";
				//			str += "<li style=\"width:10%\">操作</li>";
				//			str += "</ul>";
				str += "<table class=\"file-list\">";
				str += "<tbody>";
				str += "<tr><th style=\"width:36%\">文件名</th><th style=\"width:20%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></th><th  style=\"width:15%\">大小</th><th style=\"width:15%\">发布人</th><th style=\"width:15%\">操作</th></tr>";
				str += "<tr>";
				str += "<td colspan=\"5\">";
				str += "<div class=\"file-list-data\">";
				str += "<table>";
				str += "</table>";
				str += "</div>";
				str += "</td>";
				str += "</tr>";
				//			<tr>
				//				<td width=\"50%\"><span class=\"file-name\">这是图片文件</span></td>
				//				<td width=\"20%\">2016-08-30 16:03</td>
				//				<td width=\"10%\">1.5MB</td>
				//				<td width=\"10%\">徐娇</td>
				//				<td width=\"10%\">
				//					<i class=\"fa fa-eye\" aria-hidden=\"true\" title=\"预览\"></i>
				//					<i class=\"fa fa-download\" aria-hidden=\"true\" title=\"下载\"></i>
				//				</td>
				//			</tr>
				str += "</tbody>";
				str += "</table>";
				str += "</div>";
				str += "</div>";
			} else if(chatType == 3) {

			} else if(chatType == 4) {
				str += "<!--群文件界面-->";
				str += "<div class=\"chat-page-file\">";
				str += "<div class=\"inform-top\">";
				str += "<span class=\"inform-title pull-left\">聊天文件</span>|";
				str += "<span class=\"file-num\">共<span></span>个文件</span>";
				str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
				str += "<input type=\"text\" name=\"\" class=\"file-search-text\" placeholder=\"输入文件名进行查找\" />";
				str += "</div>";
				str += "<div class=\"file-content\">";
				//			str += "<ul class=\"file-nav\">";
				//			str += "<li style=\"width:40%\">文件名</li>";
				//			str += "<li style=\"width:25%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></li>";
				//			str += "<li style=\"width:10%\">大小</li>";
				//			str += "<li style=\"width:10%\">发布人</li>";
				//			str += "<li style=\"width:10%\">操作</li>";
				//			str += "</ul>";
				str += "<table class=\"file-list\">";
				str += "<tbody>";
				str += "<tr><th style=\"width:36%\">文件名</th><th style=\"width:20%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></th><th  style=\"width:15%\">大小</th><th style=\"width:15%\">发布人</th><th style=\"width:15%\">操作</th></tr>";
				str += "<tr>";
				str += "<td colspan=\"5\">";
				str += "<div class=\"file-list-data\">";
				str += "<table>";
				str += "</table>";
				str += "</div>";
				str += "</td>";
				str += "</tr>";
				//			<tr>
				//				<td width=\"50%\"><span class=\"file-name\">这是图片文件</span></td>
				//				<td width=\"20%\">2016-08-30 16:03</td>
				//				<td width=\"10%\">1.5MB</td>
				//				<td width=\"10%\">徐娇</td>
				//				<td width=\"10%\">
				//					<i class=\"fa fa-eye\" aria-hidden=\"true\" title=\"预览\"></i>
				//					<i class=\"fa fa-download\" aria-hidden=\"true\" title=\"下载\"></i>
				//				</td>
				//			</tr>
				str += "</tbody>";
				str += "</table>";
				str += "</div>";
				str += "</div>";
			} else {

			}
			str += "</div>";
			$(".chat-page-modal").append(str);
			if($(".chat-page-list>li").length == 1) {
				$(".chat-page-list>li:first-child").addClass("selectstyle");
			}
			$("#" + chatId).trigger("click");
			if(chatType != 2) {
				//获取群人员
				ws.onsend(24, {
					"group_id": chatId
				}, function(data) {
					if(data.action == 200) return false;
					if(data.action == 500) {
						$.showErrorGritter("加载群成员失败！");
						return false;
					}
					searchGroupMember({
						"type": "num",
						"other": ""
					}, data);
				});

			}
			//客服历史记录
			var isOneLoad = true;
			window.loadChatRecords = function(data) {
				console.log("客服:");
				console.log(data);
				var chatRecordData = data.data;
				chatRecordData = chatRecordData.reverse();
				window.avatarSrc = $(showPage + " .avatar-img").attr("src");
				if(chatRecordData.length == 0 && $(showPage + " .chat-page-inform-nonews").length == 0) {
					$(showPage + " .chat-info").prepend("<p class=\"chat-page-inform-nonews\">无更多历史消息！</p>")
					return false;
				}
				for(var i in chatRecordData) {
					//转码
					var newsText = unescape(chatRecordData[i].message_content);
					//conversionChatMain(, chatRecordData[i].message_type);
					var chatTime = changeDate(chatRecordData[i].message_time);
					var str = "";
					if(isOneLoadChatRecord) {
						if(i == chatRecordData.length - 1) {
							isOneLoadChatRecord = false;
							str += "<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>查看更多消息</a>";
						}
					}
					if(chatRecordData[i].message_send_by_me) {
						//我发送的
						if(chatRecordData[i].message_type == 1) {
							newsText = newsText.replace(/^\[file_([\s\S]*?)\]$/g, "$1");
							newsText = JSON.parse(newsText);
							console.log(chatTime);
							var fileType = newsText.ext;
							if(fileType == "7z") fileType = "zip";
							if(fileType == "jpeg") fileType = "jpg";
							str += "<div id=" + chatRecordData[i].message_id + " class=\"chat-info-send message-info\" data-time=\"" + chatTime + "\" data-path=" + newsText.path + ">";
							str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText.name + "</div>";
							//str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 2) {
							//图片文字
							//newsText = newsText.replace(/\[txt_([\S]*)\]/g, "$1");
							newsText = newsText.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
							newsText = newsText.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');

							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							//							if($(showPage).attr("data-chat-type") != 2) {
							//								str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
							//							}
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							//str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 4) {
							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							//							if($(showPage).attr("data-chat-type") != 2) {
							//								str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
							//							}
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\"><audio controls><source src=" + newsText + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
							//str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else {

						}
						//$(showPage + " .chat-info").append(str);
					} else {
						//对面发送的
						if(chatRecordData[i].message_type == 1) {
							newsText = newsText.replace(/^\[file_([\s\S]*?)\]$/g, "$1");
							newsText = JSON.parse(newsText);
							var fileType = newsText.ext;
							if(fileType == "7z") fileType = "zip";
							if(fileType == "jpeg") fileType = "jpg";
							str += "<div class=\"chat-info-receive  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + " data-path=" + newsText.path + ">";
							str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
							str += "<img src=" + chatRecordData[i].message_send_by.user_avatar + " class=\"pull-left\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.user_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText.name + "</div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 2) {
							//图片文字
							//newsText = newsText.replace(/\[txt_([\S]*)\]/g, "$1");
							newsText = newsText.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
							newsText = newsText.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							//							if($(showPage).attr("data-chat-type") != 2) {
							//								str += "<p class=\"chat-menu\"><span class=\"chat-copy\">复制</span></p>";
							//							}
							str += "<img src=" + chatRecordData[i].message_send_by.user_avatar + " class=\"pull-left\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.user_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "</div>";
							str += "</div>";

						} else if(chatRecordData[i].message_type == 3) {
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							str += "<img src=" + chatRecordData[i].message_send_by.user_avatar + " class=\"pull-left\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.user_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><video width=\"320\" height=\"240\" controls src=" + newsText + "></video></div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 4) {
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";

							str += "<img src=" + chatRecordData[i].message_send_by.user_avatar + " class=\"pull-left\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.user_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><audio controls><source src=" + newsText + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
							str += "</div>";
							str += "</div>";
						} else {

						}
					}
					if($(showPage + " .chat-info").children().length == 0) { //判断是否是最新一条消息
						//if(!chatRecordData[0].message_send_by_me) { //对方发送的
						//已读消息
						var newInfoId = chatRecordData[0].message_id;
						infoIsRead(newInfoId, 5);
						//}
					}
					console.log(chatRecordData[i].message_send_by_me + "，" + chatRecordData[i].message_is_readed + "," + isOneLoad)
					if(chatRecordData[i].message_send_by_me && isOneLoad) {
						str += "<p class=\"chat-time\">————————————以上是历史消息————————————</p>";
						isOneLoad = false;
					} else if(chatRecordData[i].message_is_readed && isOneLoad) { //我已读
						str += "<p class=\"chat-time\">————————————以上是历史消息————————————</p>";
						isOneLoad = false;

					}

					if(i == 0) {
						if($(showPage + " .chat-info").children().length == 0) {
							console.log("------------------------------------------------ssssssssssssss")
							if(!chatRecordData[0].message_send_by_me) {
								//已读消息
								var newInfoId = chatRecordData[0].message_id;
							}
						}
					}
					if(!isDifferTime(chatTime, $(showPage + " .chat-info>div").first().attr("data-time"), 180)) {
						str += "<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday($(showPage + " .chat-info>div").first().attr("data-time"), true, true) + "</p>";
					}
					if(chatRecordData[i].message_type == 1)
						$("#" + chatRecordData[i].message_id).data("fileData", newsText);
					if($(showPage + " .chat-info>div").length >= 100) {
						if($(showPage + " .view-all-chat-history").length == 0)
							$(showPage + " .chat-info").prepend("<p class='view-all-chat-history'>更多消息请在<a href='javascript:;' onclick=\"viewAllChatHistory()\">聊天消息</a>中查看</p>");
						return false;
					} else {
						$(showPage + " .chat-info").prepend(str);
						var container = (showPage + " .chat-info");
						var scrollTo = ("#" + chatRecordData[0].message_id);
						$(container).animate({
							scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
						}, 1);
					}

				}
				if($(showPage + " .view-all-chat-history").length == 0)
					if(chatRecordData[0]) {
						var container = (showPage + " .chat-info");
						var scrollTo = ("#" + chatRecordData[0].message_id);
						$(container).animate({
							scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
						}, 1);
					}
				console.log("data.data.length：" + data.data.length + "，chatHistoryPage：" + chatHistoryPage + "，" + $(showPage + " .view-all-chat-history").length)
				bindIncident(); //绑定事件
				//锚点跳转
				//var skipId = chatRecordData[0].message_id;
				//console.log("----------------------------------" + skipId);
				//window.location.href = "#" + skipId;
			}
			window.loadBusinessInform = function(data) { //业务最近消息
				console.log(data);
				chatRecordData = data.data.reverse();
				if(chatRecordData.length == 0 && $(showPage + " .chat-page-inform-nonews").length == 0) {
					$(showPage + " .chat-info").prepend("<p class=\"chat-page-inform-nonews\">无更多历史消息！</p>")
					return false;
				}
				for(var i in chatRecordData) {
					var infoData = chatRecordData[i];
					if($(showPage + " .chat-info").children().length == 0) { //判断是否是最新一条消息
						//if(!chatRecordData[0].message_send_by_me) { //对方发送的
						//已读消息
						var newInfoId = infoData.message_id;
						var type = 1;
						infoIsRead(newInfoId, type);
					}
					infoShow(infoData, true);
					if(isOneLoadChatRecord) {
						if(i == chatRecordData.length - 1) {
							isOneLoadChatRecord = false;
							$(showPage + " .chat-info").prepend("<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>查看更多消息</a>");
						}
					} else if(i == data.data.length - 1) {
						$(showPage + " .chat-info").prepend("<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(changeDate(infoData.message_time), true, true) + "</p>");
					}
					//window.location.href ="#"+chatRecordData[0].message_id;
					var container = (showPage + " .chat-info");
					var scrollTo = ("#" + chatRecordData[0].message_id);
					$(container).animate({
						scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
					}, 1);
					bindIncident();
				}
			}
			window.loadChatRecord = function(data) {
				console.log("非客服");
				console.log(data);
				var chatRecordData = data.data.reverse();
				window.avatarSrc = $(showPage + " .avatar-img").attr("src");
				if(chatRecordData.length == 0 && $(showPage + " .chat-page-inform-nonews").length == 0) {
					$(showPage + " .chat-info").prepend("<p class=\"chat-page-inform-nonews\">无更多历史消息！</p>")
					return false;
				}
				for(var i in chatRecordData) {
					//转码
					var newsText = unescape(chatRecordData[i].message_content);
					//conversionChatMain(, chatRecordData[i].message_type);
					var chatTime = changeDate(chatRecordData[i].message_time);
					var str = "";
					if(isOneLoadChatRecord) {
						if(i == chatRecordData.length - 1) {
							isOneLoadChatRecord = false;
							str += "<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>查看更多消息</a>";
						}
					}
					//获取未读数量
					var isReadStr = "";
					if($(showPage).attr("data-chat-type") == 2) {
						if(chatRecordData[i].read_status.unread.num == 0) {
							isReadStr = "已读";
						} else {
							isReadStr = "未读";
						}
					} else {
						if(chatRecordData[i].read_status.unread.num == 0) {
							isReadStr = "全部已读";
						} else {
							isReadStr = "<span>" + (parseInt(chatRecordData[i].read_status.unread.num)) + "</span>人未读";
						}
					}
					if(chatRecordData[i].message_send_by_me) {
						//我发送的
						if(chatRecordData[i].message_type == 1) {
							newsText = newsText.replace(/^\[file_([\s\S]*?)\]$/g, "$1");
							newsText = JSON.parse(newsText);
							console.log(chatTime);
							var fileType = newsText.ext;
							if(fileType == "7z") fileType = "zip";
							if(fileType == "jpeg") fileType = "jpg";
							str += "<div id=" + chatRecordData[i].message_id + " class=\"chat-info-send message-info\" data-time=\"" + chatTime + "\" data-path=" + newsText.path + ">";
							str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText.name + "</div>";
							str += "<span class=\"chat-info-send-num pull-right\">" + isReadStr + "</span>";
							str += "</div>";
							str += "<img src='" + myAvatar + "' class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 2) {
							//图片文字
							//newsText = newsText.replace(/\[txt_([\S]*)\]/g, "$1");
							newsText = newsText.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
							newsText = newsText.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');

							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>" + ($(showPage).attr("data-chat-type") != 2 ? (findIsGroupType(showChatId) ? "" : "|<span class=\"stick-discussion\">置顶讨论</span>") : "") + "|<span class=\"chat-copy\">复制</span></p>";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "<span class=\"chat-info-send-num pull-right\">" + isReadStr + "</span>";
							str += "</div>";
							str += "<img src='" + myAvatar + "' class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 3) {
							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>" + (findIsGroupType(showChatId) ? "" : "|<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\"><audio controls><source src=" + newsText + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
							str += "<span class=\"chat-info-send-num pull-right\">" + isReadStr + "</span>";
							str += "</div>";
							str += "<img src='" + myAvatar + "' class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 4) {
							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>" + (findIsGroupType(showChatId) ? "" : "|<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\"><audio controls><source src=" + newsText + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
							str += "<span class=\"chat-info-send-num pull-right\">" + isReadStr + "</span>";
							str += "</div>";
							str += "<img src='" + myAvatar + "' class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 5) {
							newsText = '<img class="chat-image" src="'+BASEAPIURL + newsText + '" border="0" />';
							str += "<div class=\"chat-info-send  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>" + (findIsGroupType(showChatId) ? "" : "|<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "<span class=\"chat-info-send-num pull-right\">" + isReadStr + "</span>";
							str += "</div>";
							str += "<img src='" + myAvatar + "' class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
						}
						//$(showPage + " .chat-info").append(str);
					} else {
						//对面发送的
						if(chatRecordData[i].message_type == 1) {
							newsText = newsText.replace(/^\[file_([\s\S]*?)\]$/g, "$1");
							newsText = JSON.parse(newsText);
							var fileType = newsText.ext;
							if(fileType == "7z") fileType = "zip";
							if(fileType == "jpeg") fileType = "jpg";
							str += "<div class=\"chat-info-receive  message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + " data-path=" + newsText.path + ">";
							str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
							str += "<img data-id=" + chatRecordData[i].message_send_by.employee_id + " src='" + (chatRecordData[i].message_send_by.employee_avatar == "undefined" ? "" : chatRecordData[i].message_send_by.employee_avatar) + "' class=\"pull-left\" onclick=\"openPersonageInfo(this)\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.employee_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText.name + "</div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 2) {
							//图片文字
							//newsText = newsText.replace(/\[txt_([\S]*)\]/g, "$1");
							newsText = newsText.replace(/\[img_([\s\S]*?)\]/g, '<img class="chat-image" src="$1" border="0" />');
							newsText = newsText.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\">" + (findIsGroupType(showChatId) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<img data-id=" + chatRecordData[i].message_send_by.employee_id + " src='" + (chatRecordData[i].message_send_by.employee_avatar == "undefined" ? "" : chatRecordData[i].message_send_by.employee_avatar) + "' class=\"pull-left\" onclick=\"openPersonageInfo(this)\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.employee_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 3) {
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\">" + (findIsGroupType(showChatId) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<img data-id=" + chatRecordData[i].message_send_by.employee_id + " src='" + chatRecordData[i].message_send_by.employee_avatar + "' class=\"pull-left\" onclick=\"openPersonageInfo(this)\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.employee_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><video width=\"320\" height=\"240\" controls src=" + newsText + "></video></div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 4) {
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\">" + (findIsGroupType(showChatId) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<img data-id=" + chatRecordData[i].message_send_by.employee_id + " src='" + chatRecordData[i].message_send_by.employee_avatar + "' class=\"pull-left\" onclick=\"openPersonageInfo(this)\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.employee_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\"><audio controls><source src=" + newsText + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio></div>";
							str += "</div>";
							str += "</div>";
						} else if(chatRecordData[i].message_type == 5) {
							newsText = '<img class="chat-image" src="'+BASEAPIURL + newsText + '" border="0" />';
							str += "<div class=\"chat-info-receive message-info\" data-time=\"" + chatTime + "\" id=" + chatRecordData[i].message_id + ">";
							if($(showPage).attr("data-chat-type") != 2) {
								str += "<p class=\"chat-menu\">" + (findIsGroupType(showChatId) ? "" : "<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							}
							str += "<img data-id=" + chatRecordData[i].message_send_by.employee_id + " src='" + (chatRecordData[i].message_send_by.employee_avatar == "undefined" ? "" : chatRecordData[i].message_send_by.employee_avatar) + "' class=\"pull-left\" onclick=\"openPersonageInfo(this)\">";
							str += "<p class=\"chat-info-name\">" + chatRecordData[i].message_send_by.employee_name + "</p>";
							str += "<div class=\"demo clearfix\">";
							str += "<span class=\"triangle\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "</div>";
							str += "</div>";
						}
					}

					if($(showPage + " .chat-info").children().length == 0) { //判断是否是最新一条消息
						//if(!chatRecordData[0].message_send_by_me) { //对方发送的
						//已读消息
						var newInfoId = chatRecordData[0].message_id;
						var type = $(showPage).attr("data-chat-type") == 2 ? 1 : 2;
						infoIsRead(newInfoId, type);
						//}
					}
					console.log(isFirstNoReadInfo);
					if(!isFirstNoReadInfo) {
						var isNoRead = false;
						for(var j in chatRecordData[i].read_status.unread.list) {
							var unReadData = chatRecordData[i].read_status.unread.list[j];
							if(unReadData.employee_id == myId) {
								isNoRead = true;
							}
						}
						if(!isNoRead) {
							str += "<p class=\"chat-time\">————————————以上是历史消息————————————</p>";
							//str += "<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(changeDate(chatTime), true, true) + "</p>";
							isFirstNoReadInfo = true;
						}
					}
					if(!isDifferTime(chatTime, $(showPage + " .chat-info>div").first().attr("data-time"), 180)) {
						str += "<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday($(showPage + " .chat-info>div").first().attr("data-time"), true, true) + "</p>";
					}
					if($(showPage + " .chat-info>div").length >= 100) {
						if($(showPage + " .view-all-chat-history").length == 0)
							$(showPage + " .chat-info").prepend("<p class='view-all-chat-history'>更多消息请在<a href='javascript:;' onclick=\"viewAllChatHistory()\">聊天消息</a>中查看</p>");
						return false;
					} else {
						$(showPage + " .chat-info").prepend(str);
						bindIncident(); //绑定事件
					}
					//已读未读人数数据存入节点
					if(chatRecordData[i].message_type == 1)
						$("#" + chatRecordData[i].message_id).data("fileData", newsText);
				}
				if($(showPage + " .view-all-chat-history").length == 0)
					if(chatRecordData[0]) {
						var container = (showPage + " .chat-info");
						var scrollTo = ("#" + chatRecordData[0].message_id);
						$(container).animate({
							scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
						}, 1);
					}
				console.log("data.data.length：" + data.data.length + "，chatHistoryPage：" + chatHistoryPage + "，" + $(showPage + " .view-all-chat-history").length)

				//锚点跳转
				//var skipId = chatRecordData[0].message_id;
				//console.log("----------------------------------" + skipId);
				//window.location.href = "#" + skipId;
			}

			$(".chat-text").unbind("blur").blur(function() {
				window.pos = $(this).data("location");
				$(this).attr("data-location", pos);
				if(window.attachEvent) {
					//判断是否支持document.selection属性
					if(document.selection) {
						var range = document.selection.createRange();
						var srcele = range.parentElement();
						//新建一个range，焦点在开头
						var copy = document.body.createTextRange();
						copy.moveToElementText(srcele);
						//判断copy的焦点起始部分是否在range的焦点起始部分的后面
						for(pos = 0; copy.compareEndPoints("StartToStart", range) < 0; pos++) {
							//copy的焦点向后移动一个字符
							copy.moveStart("character", 1);
						}
						//document.getElementById('i1').value = pos;
						//							alert(pos);
						//							oldPos=pos;
						$(showPage + " .chat-text").attr("data-location", pos);
					}
				} else {
					if(window.getSelection) {
						//获取Selection对象
						var se = window.getSelection();
						//获取起始位置，这个是字符的序号位置，而不是坐标
						var start = se.anchorOffset;
						//获取结束位置
						var end = se.focusOffset;
						//获取起始的dom元素
						var startEl = se.anchorNode.parentElement;
						//获取结束的dom元素
						var endEl = se.focusNode.parentElement;
						//获取起始dom元素的文本内容
						var startText = startEl.innerText;
						var txt = '';
						if(startEl == endEl) {
							txt = startText.substring(start, end);
						}
						console.log(start);
						console.log(end);
						pos = end;
						$(showPage + " .chat-text").attr("data-location", pos);
						//$(obj).attr("data-location",start);
					}
				}
			});
			//window.pos = 0;
			//			if(window.attachEvent) {
			//				document.onselectionchange = function(e) {
			//					//判断是否支持document.selection属性
			//					if(document.selection) {
			//						var range = document.selection.createRange();
			//						var srcele = range.parentElement();
			//						//新建一个range，焦点在开头
			//						var copy = document.body.createTextRange();
			//						copy.moveToElementText(srcele);
			//						//判断copy的焦点起始部分是否在range的焦点起始部分的后面
			//						for(pos = 0; copy.compareEndPoints("StartToStart", range) < 0; pos++) {
			//							//copy的焦点向后移动一个字符
			//							copy.moveStart("character", 1);
			//						}
			//						//document.getElementById('i1').value = pos;
			//						//							alert(pos);
			//						//							oldPos=pos;
			//						$(showPage + " .chat-text").attr("data-location", pos);
			//						//document.getElementById('i2').value = range.htmlText;
			//					}
			//				}
			//			} else {
			//				//绑定文本焦点改变事件 注意：firefox不支持document.onselectionchange，可以换成别的事件来触发比如mouseup什么的
			//				document.onselectionchange = function(e) {
			//					//判断是否支持document.selection属性
			//					if(window.getSelection) {
			//						//获取Selection对象
			//						var se = window.getSelection();
			//						//获取起始位置，这个是字符的序号位置，而不是坐标
			//						var start = se.anchorOffset;
			//						//获取结束位置
			//						var end = se.focusOffset;
			//						//获取起始的dom元素
			//						var startEl = se.anchorNode.parentElement;
			//						//获取结束的dom元素
			//						var endEl = se.focusNode.parentElement;
			//						//获取起始dom元素的文本内容
			//						var startText = startEl.innerText;
			//						var txt = '';
			//						if(startEl == endEl) {
			//							txt = startText.substring(start, end);
			//						}
			//						console.log(start);
			//						console.log(end);
			//						pos = end;
			//						$(showPage + " .chat-text").attr("data-location", pos);
			//						//$(obj).attr("data-location",start);
			//					}
			//				}
			//			}

			window.locationCursor = function(container, dom) {
				var posPrev = $(this).data(location);
				if(window.attachEvent) {
					//	console.log(1)
					container.focus(function() {

					});
					var range = document.selection.createRange();
					var srcele = range.parentElement();
					//新建一个range，焦点在开头
					var copy = document.body.createTextRange();
					copy.moveToElementText(srcele);
					//判断copy的焦点起始部分是否在range的焦点起始部分的后面
					for(posPrev = 0; copy.compareEndPoints("StartToStart", range) < 0; posPrev++) {
						//copy的焦点向后移动一个字符
						copy.moveStart("character", 1);
					}
					insertHtmlAfterCursor(container, dom, posPrev);
				} else {
					var a = container[0];
					a.selectionStart = posPrev;
					a.focus();
					insertHtmlAfterCursor(container, dom, posPrev);
				}
			}

			function insertHtmlAfterCursor(container, text, posPrev) {
				var obj = container;
				if(container.setSelectionRange) {
					// IE Support
					container.focus();
					container.setSelectionRange(pos, pos);
				} else if(container.createTextRange) {
					// Firefox support
					var range = container.createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}

				var range, node;
				if(!obj.hasfocus) {
					//return false;
					obj.focus();
				}
				if(window.getSelection && window.getSelection().getRangeAt) {
					range = window.getSelection().getRangeAt(0);
					range.collapse(false);
					node = range.createContextualFragment(text);
					var c = node.lastChild;
					range.insertNode(node);
					if(c) {
						range.setEndAfter(c);
						range.setStartAfter(c)
					}
					var j = window.getSelection();
					j.removeAllRanges();
					j.addRange(range);

				} else if(document.selection && document.selection.createRange) {
					document.selection.createRange().pasteHTML(text);
				}
			}

			function insertAfterText(textDom, value) {
				var selectRange;
				if(document.selection) {
					// IE Support
					textDom.focus();
					selectRange = document.selection.createRange();
					selectRange.text = value;
					textDom.focus();
				} else if(textDom.selectionStart || textDom.selectionStart == '0') {
					// Firefox support
					var startPos = textDom.selectionStart;
					var endPos = textDom.selectionEnd;
					var scrollTop = textDom.scrollTop;
					textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
					textDom.focus();
					textDom.selectionStart = startPos + value.length;
					textDom.selectionEnd = startPos + value.length;
					textDom.scrollTop = scrollTop;
				} else {
					textDom.value += value;
					textDom.focus();
				}
			}

			console.log("是不是客服:" + $(showPage).attr("data-chat-type"));
			if(chatType != 4) {
				//单人私人除客服以外聊天记录加载
				if(chatType == 5) { //业务通知
					ws.onsend(44, {
						"base_msg_id": "",
						"msg_session_id": chatId,
						"msg_session_type": openPageType("", true),
						"limit": chatHistoryPage,
						"with_employees": 1
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天记录失败！");
							return false;
						}
						loadBusinessInform(data);
					});
				} else {
					//窗口打开事件
					ws.onsend(44, {
						"base_msg_id": "",
						"msg_session_id": chatId,
						"msg_session_type": openPageType("", true),
						"limit": chatHistoryPage,
						"with_employees": 1
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天记录失败!");
							return false;
						}
						loadChatRecord(data);
					});
					var isOneLoadChatRecord = true; //是否是第一次加载
					var isFirstNoReadInfo = false; //已读消息是否是加载完毕（未读消息是否开始加载）

				}

			} else {
				ws.onsend(85, {
					"base_msg_id": "",
					"to_user": chatId,
					"limit": chatHistoryPage
				}, function(data) {
					if(data.action == 200) return false;
					if(data.action == 500) {
						$.showErrorGritter("加载聊天记录失败!");
						return false;
					}
					loadChatRecords(data);
				});
			}
			var isOneLoadChatRecord = true;

			console.log(chatId + "|" + (chatType == 2 ? 1 : 2));
			if(chatType == 1 || chatType == 6) {
				//获取正在讨论的主题
				//				ws.onsend(28, {
				//					"group_id": showChatId
				//				}, loadGroupDiscussionList, "");
				var groupThemeData = $(".infolist-grouplist li[data-id=" + showChatId + "]").data("theme");
				console.log("当前群话题：");
				console.log(groupThemeData);
				if(groupThemeData)
					loadGroupDiscussionList(groupThemeData, "1");
			}
			$(".chat-text").unbind("paste").bind("paste", function(e) {
				e.preventDefault();
				var pastedText = undefined;
				if(window.clipboardData && window.clipboardData.getData) { // IE
					pastedText = window.clipboardData.getData('Text');
					console.log(window.clipboardData);
				} else {
					pastedText = e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
					console.log(e.originalEvent);
				}

				console.log("粘贴内容：" + pastedText);
				//$(this).text(pastedText);
				insertHtmlAfterCursor($(this), pastedText);
			});
			//消息已读
			window.infoIsRead = function(infoId, type) {
					//alert("发送已读通知")
					if(type != 5) {
						ws.onsend(42, {
							"message_id": infoId,
							"message_type": type
						}, function(data) {
							if(data.action == 200) console.log("ID:" + infoId + "，Type:" + (type == "1" ? "单人" : "群") + "，消息已读");
							if(data.action == 500) {
								$.showErrorGritter("阅读消息失败!");
								return false;
							}

						});
					} else {
						ws.onsend(87, {
							"msg_id": infoId
						}, function(data) {
							if(data.action == 200) console.log("ID:" + infoId + "，客服消息已读");
							if(data.action == 500) {
								$.showErrorGritter("阅读消息失败!");
								return false;
							}
						});
					}
				}
				//事件区	--------------------------------------------------------------------------------------------
				//聊天列表删除
			$(".chat-page-list .list-detele").unbind("click");
			$(".chat-page-list .list-detele").click(function() {
				//关闭聊天记录
				$(".view-chart-history-content-header .fa-close").trigger("click");
				//判断是否是最后一个(是则关闭,不是则关闭当前窗口)
				if($(".chat-page-list li").length <= 1) {
					$(".chat-page").remove();
					showChatId = "";
				} else {
					//列表删除
					$(this).parent().remove();
					var id = $(this).parent().attr("id");
					//根据id删除对应聊天窗口
					$(".chat-page-modal>div[data-id=" + id + "]").remove();
					//把焦点默认给第一个
					$(".chat-page-list>li:first-child").trigger('click');
				}

				if($(".chat-page-list li").length <= 1) {
					$(".chat-page-left").addClass("hide");
					$(".chat-page").css("width", "750px");
				}
			});
			//关闭聊天页面
			$(".off-page").unbind("click");
			$(".off-page").click(function() {
				var obj = this;
				if($(".chat-page-list li").length <= 1) {
					$(".chat-page").remove();
					showChatId = "";
				} else {
					var modalId = $.modal({
						showFooter: false
					}).show("关闭会话", ".offpage-page", function() {

					});
					var formContainer = "#" + modalId + " .modal-body";
					//关闭所有
					$(formContainer + " .btn-off-all-page").click(function() {
						$(".chat-page").remove();
						$("#" + modalId).modal('hide');
						showChatId = "";
					});
					//关闭当前
					$(formContainer + " .btn-off-single-page").click(function() {
						var id = $(obj).parents(".chat-page-modal-content").attr("data-id");
						$("#" + id).remove();
						//根据id删除对应聊天窗口
						$(obj).parents(".chat-page-modal-content").remove();
						//把焦点默认给第一个
						$(".chat-page-list>li:first-child").trigger('click');
						if($(".chat-page-list>li").length <= 1) {
							$(".chat-page-left").addClass("hide");
							$(".chat-page").css("width", "750px");
						}
						$("#" + modalId).modal('hide');
					});
				}
			});
			//最小化
			$(".minimize").click(function() {
				$(".chat-page").hide();
				isMinPage = true;
			});
			//复制
			$(".chat-copy").unbind("click").click(function() {
				var copyText = $(this).parent().parent().find(".article").html();
				console.log(copyText);
				var aux = document.createElement("input");
				// 获取复制内容
				var content = copyText;
				// 设置元素内容
				aux.setAttribute("value", content);
				// 将元素插入页面进行调用
				document.body.appendChild(aux);
				// 复制内容
				aux.select();
				// 将内容复制到剪贴板
				document.execCommand("copy");
				// 删除创建元素
				document.body.removeChild(aux);
			});

			//聊天弹窗列表点击切换
			$(".chat-page-list").unbind("click").on("click", "li", function() {
				//关闭历史记录
				$(".view-chart-history-content-header .fa-close").trigger("click");
				$(this).addClass("selectstyle").siblings().removeClass("selectstyle");
				//删除未读条数提示
				//$(this).children(".list-num").remove();
				var num = parseInt($(this).children(".list-num").text());
				informNumChange("reduce", $(this).attr("id"), num);
				//对应切换
				$(".chat-page-modal>div").eq($(this).index()).show().siblings().hide();
				//显示id更换
				showChatId = $(this).attr("id");
				showPage = ".chat-page-modal-content[data-id=" + showChatId + "]";
				//消息已读
				if($(showPage + " .chat-info>div").last().hasClass("chat-info-receive")) {
					var infoId = $(showPage + " .chat-info>.chat-info-receive").last().attr("id");
					var type = $(showPage).attr("data-chat-type") == "1" ? "2" : "1";
					type = $(showPage).attr("data-chat-type") == "4" ? "5" : type;
					infoIsRead(infoId, type);
				}
			});
			//群公告暂时隐藏
			$(".chat-page-nav .fa-volume-down").parent().hide();
			//聊天顶部切换
			$(".chat-page-nav>li").unbind("click");
			$(".chat-page-nav>li").click(function() {
				var gropuId = $(this).parents(".chat-page-modal-content").attr("data-id");
				if($(this).children('i').hasClass("fa-cog")) {
					loadGroupSet();
				} else {
					$(this).addClass("pitchon").siblings('li').removeClass("pitchon");
					if($(this).index() == 3) {
						if($(this).children("ul").css("display") == "none") {
							$(this).children("ul").show();
						} else {
							$(this).children("ul").hide();
						}
					} else {
						$(".discussion-menu").hide();
						$(this).parents(".chat-page-top").next().children("div").eq($(this).index()).show().siblings().hide();
					}
				}
				//加载群文件
				if($(this).children().is(".fa-folder")) {
					$(showPage + " .file-list tr div table").empty();
					var sessionType = $(this).parents(".chat-page-modal-content").attr("data-chat-type");
					if(sessionType != 4) {
						chatFilePage(sessionType == 2 ? 1 : 2)
					} else {
						chatFilePage(3);
					}
				}
			});

			function chatFilePage(type) {
				var loadNum = 1;
				var searchText = "";
				if(type == 1 || type == 2) {
					console.log(showChatId, type);
					ws.onsend(45, {
						"file_keyword": searchText,
						"msg_session_id": showChatId,
						"msg_session_type": type,
						"msg_type": 1,
						"page": loadNum,
						"page_num": 14
					}, function(data) {
						if(data.action == 200) return false;;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天文件失败!");
							return false;
						}
						loadChatFile("1", data);
					});
					//滚动加载
					$(showPage + " .file-list-data").unbind("scroll").scroll(function() {
						var nScrollHight = $(this)[0].scrollHeight;
						var nScrollTop = $(this)[0].scrollTop;
						var nDivHight = $(this).height();
						if(nScrollTop + nDivHight >= nScrollHight) {
							//alert("滚动条到底部了");
							loadNum++;
							console.log("第" + loadNum + "页");
							ws.onsend(45, {
								"file_keyword": searchText,
								"msg_session_id": showChatId,
								"msg_session_type": type,
								"msg_type": 1,
								"page": loadNum,
								"page_num": 14
							}, function(data) {
								if(data.action == 200) return false;;
								if(data.action == 500) {
									$.showErrorGritter("加载聊天文件失败!");
									return false;
								}
								loadChatFile("1", data);
							});
						}
					});
					//聊天文件搜索
					$(showPage + " .search-ico").unbind("click").click(function() {
						searchText = $(this).next().val();
						console.log("file_keyword:" + searchText + "|" +
							"msg_session_id:" + showChatId + "|" +
							"msg_session_type:" + type)
						loadNum = 1;
						$(showPage + " .file-list-data table").empty();
						ws.onsend(45, {
							"file_keyword": searchText,
							"msg_session_id": showChatId,
							"msg_session_type": type,
							"msg_type": 1,
							"page": loadNum,
							"page_num": 14
						}, function(data) {
							if(data.action == 200) return false;;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天文件失败!");
								return false;
							}
							loadChatFile("1", data);
						});
					});
				} else {
					ws.onsend(88, {
						"file_keyword": searchText,
						"to_user": showChatId,
						"msg_type": 1,
						"page": loadNum,
						"limit": 14
					}, function(data) {
						if(data.action == 200) return false;;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天文件失败!");
							return false;
						}
						loadChatFile("2", data);
					});
					//滚动加载
					$(showPage + " .file-list-data").unbind("scroll").scroll(function() {
						var nScrollHight = $(this)[0].scrollHeight;
						var nScrollTop = $(this)[0].scrollTop;
						var nDivHight = $(this).height();
						if(nScrollTop + nDivHight >= nScrollHight) {
							//alert("滚动条到底部了");
							loadNum++;
							console.log("第" + loadNum + "页");
							ws.onsend(88, {
								"file_keyword": searchText,
								"to_user": showChatId,
								"msg_type": 1,
								"page": loadNum,
								"limit": 14
							}, function(data) {
								if(data.action == 200) return false;;
								if(data.action == 500) {
									$.showErrorGritter("加载聊天文件失败!");
									return false;
								}
								loadChatFile("2", data);
							});
						}

					});
					//聊天文件搜索
					$(showPage + " .search-ico").unbind("click").click(function() {
						var searchText = $(this).next().val();
						console.log("file_keyword:" + searchText + "|" +
							"msg_session_id:" + showChatId + "|" +
							"msg_session_type:" + type)
						loadNum = 1;
						$(showPage + " .file-list-data table").empty();
						ws.onsend(88, {
							"file_keyword": searchText,
							"to_user": showChatId,
							"msg_type": 1,
							"page": loadNum,
							"limit": 14
						}, function(data) {
							if(data.action == 200) return false;;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天文件失败!");
								return false;
							}
							loadChatFile("2", data);
						});
					});
				}
			}
			//加载群会话主题列表
			window.loadHistoryDiscussion = function(searchDate, searchKeyText, searchPage, searchLimit) {
					$(showPage + " .inform-content").empty();
					console.log(searchDate);
					console.log("searchKeyText：" + searchKeyText + "，searchPage：" + searchPage + "，searchLimit：" + searchLimit);
					$(showPage + " .inform-buttom .page-num").val(searchPage);
					ws.onsend(28, {
						"group_id": showChatId,
						"topic_date": searchDate,
						"topic_keyword": searchKeyText,
						"topic_page_num": searchPage,
						"topic_page_limit": searchLimit
					}, function(data) {
						if(data.action == 200) return false;;
						if(data.action == 500) {
							$.showErrorGritter("加载群历史主题失败!");
							return false;
						}
						var discussData = data.data.list.reverse();
						for(var i in discussData) {
							str = "<div class=\"inform-list-box\" id=" + discussData[i].topic_id + ">";
							str += "<div class=\"inform-box-top\">";
							str += "<span class=\"inform-name pull-left\"><span>" + isTodayOrYesterday(discussData[i].topic_create_date, true, false) + "</span>—<span>" + (isTodayOrYesterday(discussData[i].topic_close_date, true, false)) + "</span></span>";
							str += "<span class=\"release-info pull-right\">" + discussData[i].topic_creator.employee_name + "，" + discussData[i].topic_creator.depa_name + "</span><div class=\"clearfix\"></div></div>";
							str += "<p class=\"inform-text shrink\">" + discussData[i].topic_title + "</p></div>";
							$(showPage + " .inform-content").prepend(str);
						}
						$(showPage + " .inform-buttom .record-number").text(data.data.total_num);
						var allPage = 1;
						if(data.data.total_num / searchLimit > 1) {
							allPage = Math.ceil(data.data.total_num / searchLimit);
						}
						$(showPage + " .inform-buttom .page-all-num").text(allPage);
					});
				}
				//加载群设置
			window.loadGroupSet = function(modaId) {
				if(!isUnline()) return false;
				if(modaId != "") {
					$("#" + modaId).modal("hide");
				}
				//群设置弹窗
				var modalId = $.modal({
					showFooter: false
				}).show("群设置", ".group-set-page", function() {

				});
				$("#" + modalId).attr("data-id", showChatId);
				//获取头像及名字
				var formContainer = "#" + modalId + " .modal-body";
				var groupSrc = $(showPage + " .chat-page-top>img").attr("src");
				var groupName = $(showPage + " .info-name").text();
				$(formContainer + " .group-set-info>a img").attr("src", groupSrc);
				$(formContainer + " .group-set-name").html(groupName);
				//加载群员和管理员群主
				ws.onsend(24, {
					"group_id": showChatId
				}, function(data) {
					if(data.action == 200) return false;
					if(data.action == 500) {
						$.showErrorGritter("加载成员失败!");
						return false;
					}
					searchGroupMember({
						"type": "member",
						"other": formContainer
					}, data);
				});
				//修改群头像及名字
				$(formContainer + " .fa-pencil").click(function() {
					$(this).hide().siblings().show();
					$(formContainer + " .group-set-info a span").animate({
						bottom: '0px'
					}, 100);
					var srcText = $(formContainer + " .group-set-info a img").attr("src");
					$(formContainer + " .group-set-info a img").attr("data-src", srcText);
					var groupName = $(formContainer + " .group-set-name").text();
					$(formContainer + " .group-set-name").replaceWith("<input type=\"text\" maxlength=20 class=\"group-set-name-text\" value=" + groupName + " data-val=" + groupName + ">");

				});
				$(formContainer + " .group-set-info a span").attr("id", "upGroupImg" + modalId);
				$("#upGroupImg" + modalId).unbind('click');
				//上传群头像
				$("#upGroupImg" + modalId).initUploader({
					url: SAASAPIS.BS.IMupload.image,
					//up_container: formContainer + " .group-set-info",
					FilesAdded: function(up, files) {
						return true;
					},
					FileUploaded: function(up, file, response) {
						var resp = JSON.parse(response.response);
						if(resp.code == 0) {
							var filesPath = resp.data.path;
							var filesName = resp.data.name;
							$(formContainer + " .group-set-info a img").attr("src", filesPath);
							$(formContainer + " .group-set-info a img").attr("data-path", filesPath);
						} else {
							$.showErrorGritter("上传失败：" + resp.msg);
						}
					}
				});
				//确认或取消群头像及资料
				$(formContainer + " .fa-check," + formContainer + " .fa-times").click(function() {
					$(this).hide().siblings().hide();
					$(formContainer + " .fa-pencil").show();
					$(formContainer + " .group-set-info a span").animate({
						bottom: '-20px'
					}, 100);
					if($(this).hasClass("fa-check")) {
						//确认
						var groupName = $(formContainer + " .group-set-name-text").val();
						var groupSrc = $(formContainer + " .group-set-info img").attr("data-path");
						$(formContainer + " .group-set-name-text").replaceWith("<p class=\"group-set-name\">" + groupName + "</p>");
						ws.onsend(33, {
							"group_avatar": groupSrc,
							"group_desc": groupName,
							"group_id": showChatId
						}, function(data) {
							if(data.action == 200) {
								$.showSuccessGritter("修改成功");
								heavyLoadGroupData([groupName, groupSrc], data);
							}
							if(data.action == 500) {
								$.showErrorGritter("修改群资料失败!");
								return false;
							}

						});

					} else {
						//取消
						//还原群名设置
						var groupName = $(formContainer + " .group-set-name-text").attr("data-val");
						$(formContainer + " .group-set-name-text").replaceWith("<p class=\"group-set-name\">" + groupName + "</p>");
						//还原群头像
						var srcText = $(formContainer + " .group-set-info a img").attr("data-src");
						$(formContainer + " .group-set-info a img").attr("src", srcText);
					}

				});
				//添加群成员
				$(formContainer + " .group-set-add").click(function() {
					//还原
					$(formContainer + " .group-set-administrator-select").hide();
					$(formContainer + " .group-set-administrator-select>span").hide();
					$(formContainer + " .group-member>div i").remove();
					//权限判断
					if($(formContainer + " .group-member>div[data-id=" + myId + "]").attr("data-member-type") == 2) {
						$(formContainer + " .group-member>div[data-member-type=3]").removeClass("group-member-boxs");
					}

					var otherInfo = {};
					otherInfo.groupId = showChatId;
					otherInfo.modaName = modalId;
					if($(".infolist-grouplist li[data-id=" + showChatId + "]").parents("li").attr("data-grouptype") == 2) {
						groupEstablish("2", "", otherInfo, false);
					} else {
						groupEstablish("1", "", otherInfo, false);
					}
				});
				//设置管理员
				$(formContainer + " .group-set-administrator").click(function() {
					//还原
					$(formContainer + " .group-set-administrator-select").hide();
					$(formContainer + " .group-set-administrator-select>span").hide();
					$(formContainer + " .group-member>div i").remove();
					//取消删除群成员的hover动作
					$(formContainer + " .group-member>div").addClass("group-member-boxs");
					$(this).parent().next().show();
					$(this).parent().next().children().show();
					$(".select-obj").hide();
					$(formContainer + " .already-select").html($(formContainer + " .group-member>div[data-member-type=2]").length);
					//选中管理员成员加样式
					$(formContainer + " .group-member>div").each(function(index) {
						if($(this).attr("data-member-type") == 2) {
							$(this).append("<i class='fa fa-check-circle' aria-hidden='true'></i>");
						}
					});
					//添加点击选中事件(限制：最多设置五名，不能选择群主)
					$(formContainer + " .group-member>div").unbind("click");
					$(formContainer + " .group-member>div").click(function() {
						var selectNum = parseInt($(formContainer + " .already-select").text());
						if($(this).children().is("i")) {
							//已选中
							$(this).children("i").remove();
							$(formContainer + " .already-select").html(selectNum - 1);
						} else {
							if($(this).parent().find("i").length >= 5) {
								$.showErrorGritter("最多只能设置5名管理员！");
								return false;
							}
							if($(this).attr("data-member-type") == "1") {
								return false;
							}
							$(this).append("<i class='fa fa-check-circle' aria-hidden='true'></i>");
							$(formContainer + " .already-select").html(selectNum + 1);
						}
					});
					//保存、取消
					$(formContainer + " .btn-save," + formContainer + " .btn-cancel").unbind("click");
					$(formContainer + " .btn-save," + formContainer + " .btn-cancel").click(function() {
						$(this).parent().hide();
						var checkGroupMenberList = [];
						if($(this).hasClass("btn-save")) {
							//保存
							$(formContainer + " .group-member>div").each(function(index) {
								if($(this).children().is("i")) {
									checkGroupMenberList.push($(this).attr("data-member-id"));
								}
							});
							console.log(checkGroupMenberList);
							ws.onsend(32, {
								"group_id": showChatId,
								"group_members": checkGroupMenberList
							}, function(data) {
								if(data.action == 200) loadGroupSet(modalId);
								if(data.action == 500) {
									$.showErrorGritter("设置管理员失败!");
									return false;
								}

							});
						} else {
							//取消
							$(formContainer + " .group-member>div").removeClass("group-member-boxs");
						}
						$(formContainer + " .group-member>div").unbind("click");
						$(formContainer + " .group-member>div").children("i").remove();
						//loadGroupSet(modalId);
					});

				});
				//转让群主
				$(formContainer + " .group-set-change").click(function() {
					//还原
					$(formContainer + " .group-set-administrator-select").hide();
					$(formContainer + " .group-set-administrator-select>span").hide();
					$(formContainer + " .group-member>div i").remove();
					$(formContainer + " .group-member>div").addClass("group-member-boxs");
					$(this).parent().next().show();
					$(this).parent().next().children().show();
					$(".select-administrator-num").hide();
					//选中管理员成员加样式
					$(formContainer + " .group-member>div").each(function(index) {
						if($(this).attr("data-member-type") == 1) {
							$(this).append("<i class='fa fa-check-circle' aria-hidden='true'></i>");
						}
					});
					//添加点击选中事件
					$(formContainer + " .group-member>div").unbind("click");
					$(formContainer + " .group-member>div").click(function() {
						$(this).parent().find("i").remove();
						$(this).append("<i class='fa fa-check-circle' aria-hidden='true'></i>");

					});
					//保存、取消
					$(formContainer + " .btn-save," + formContainer + " .btn-cancel").unbind("click");
					$(formContainer + " .btn-save," + formContainer + " .btn-cancel").click(function() {
						$(this).parent().hide();
						if($(this).hasClass("btn-save")) {
							//保存
							var checkGroupMenberList = "";
							$(formContainer + " .group-member>div").each(function(index) {
								if($(this).children().is("i")) {
									checkGroupMenberList = $(this).attr("data-member-id");
								}
							});
							console.log(showChatId + "|" + checkGroupMenberList);
							ws.onsend(29, {
								"group_member": checkGroupMenberList
							}, function(data) {
								console.log(data);
								if(data.action == 200) {
									loadGroupSet(modalId);
									ws.onsend(21, {});
									$.showSuccessGritter("转让成功");
									//判断是否是讨论组。是否是话题创建人
									if($(".infolist-grouplist li[data-id=" + showChatId + "]").parents("li").attr("data-grouptype") != 3) {
										$(showPage + " .discussion-buttom .off-theme").remove();
									} else {
										var groupThemeData = $(".infolist-grouplist li[data-id=" + showChatId + "]").data("theme")
										if(groupThemeData.topic_creator.employee_id != myId) {
											$(showPage + " .discussion-buttom .off-theme").remove();
										}
									}
								}
								if(data.action == 500) {
									$.showErrorGritter("转让失败！");
									return false;
								}
							});
						} else {
							//取消
							$(formContainer + " .group-member>div").removeClass("group-member-boxs");
						}
						$(formContainer + " .group-member>div").unbind("click");
						$(formContainer + " .group-member>div").children("i").remove();
						//loadGroupSet(modalId);
					});

				});
				//退出群聊
				$(formContainer + " .btn-exit-group").click(function() {
					if($(".group-custodian-main").attr("data-id") == myId) {
						$.showErrorGritter("请转让群主后操作！");
						return false;
					}
					ws.onsend(31, {
						"group_id": showChatId
					}, function(data) {
						if(data.action = 200) {
							$("#" + modaId).modal("hide");
							//列表删除
							$(".news-left-infolist li[data-id=" + showChatId + "]").remove();
							ws.onsend(21, {});
							//删除群
							$("#" + showChatId + " .list-detele").trigger("click");
							$("#" + modalId).modal("hide");
							$.showSuccessGritter("退出群：" + chatObjName + "成功");
						}
						if(data.action == 500) {
							$.showErrorGritter("退出群失败！");
							return false;
						}
					});
				});
				//解散该群
				$(formContainer + " .btn-dissolve-group").click(function() {
					$.modal().confirm("确认解散该群？", function() {
						//是否是讨论群
						if($(".infolist-grouplist li[data-id=" + showChatId + "]").parents("li").attr("data-grouptype") == 3) {
							var titleId = $(showPage + " .discussion-content").attr("id");
							ws.onsend(26, {
								topic_id: titleId
							}, function(data) {
								if(data.action == 200) {
									$(".news-left-infolist li[data-id=" + showChatId + "]").remove();
									$("#" + showChatId + " .list-detele").trigger("click");
									ws.onsend(21, {});
									$.showSuccessGritter("解散成功！");
									$("#" + modalId).modal("hide");
								}
								if(data.action == 500) {
									$.showErrorGritter("解散群失败！");
									return false;
								}
							});
							//("#" + showChatId + " .list-detele").trigger("click");
							$(".news-left-infolist li[data-id=" + showChatId + "]").remove();
							ws.onsend(21, {});
						} else {
							ws.onsend(30, {
								"group_id": showChatId
							}, function(data) {
								if(data.action == 200) {
									ws.onsend(21, {});
									$.showSuccessGritter("解散成功！");
									$("#" + modalId).modal("hide");
								}
								if(data.action == 500) {
									$.showErrorGritter("解散群失败！");
									return false;
								}
							});
							//删除解散的群聊页面
							$("#" + showChatId + " .list-detele").trigger("click");
							//删除该群的最近列表和群列表
							$(".infolist-chatlist li[data-id=" + showChatId + "]").remove();
							ws.onsend(21, {});
						}
					});
				});
				//踢出群成员
				$(formContainer).unbind("click").on("click", ".group-member .list-detele", function(event) {
					var obj = this;
					var e = window.event || event;
					if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
						e.stopPropagation();
					} else {
						//兼容IE的方式来取消事件冒泡 
						window.event.cancelBubble = true;
					}
					$.modal().confirm("确定踢出该成员？", function() {
						var emysId = $(obj).parent().attr('data-id');
						console.log("确认踢出群ID：" + showChatId + "的人ID：" + emysId);
						ws.onsend(39, {
							"employee_id": emysId,
							"group_id": showChatId
						}, function(data) {
							console.log(data);
							if(data.action == 200) {
								$(obj).parent().remove();
								loadGroupSet(modalId);
								$.showSuccessGritter("移出该成员成功");
							}
							if(data.action == 500) {
								$.showErrorGritter("移出失败！");
								return false;
							}
						});
					});

				});
				var reloadInfo = function() {
					ws.onsend(24, {
						"group_id": showChatId
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载群成员失败！");
							return false;
						}
						searchGroupMember({
							"type": "member",
							"other": formContainer
						}, data);
					});
				}
			}

			//加载聊天文件
			function loadChatFile(type, data) {
				console.log(type);
				console.log(data);
				if(type == 1) {
					var chatFileDataList = data.data.list;
					$(showPage + ' .file-num span').text((data.data.total == 0 ? "0" : data.data.total));
				} else {
					var chatFileDataList = data.data.rows;
					$(showPage + ' .file-num span').text((data.data.total_num == 0 ? "0" : data.data.total_num));
				}
				if(chatFileDataList.length == 0) {
					return false;
				}
				console.log(chatFileDataList);
				for(var i in chatFileDataList) {
					var fileData = chatFileDataList[i].message_content;
					if(!fileData) continue;
					fileData = fileData.replace(/^\[file_([\s\S]*)\]$/g, "$1");
					fileData = JSON.parse(fileData);
					var fileSize = parseInt(fileData.size) / (1024 * 1024);
					fileSize = Math.round(fileSize * 1000) / 1000;
					var fileType = fileData.ext.toLowerCase();
					if(fileType == "7z") fileType = "zip";
					if(fileType == "jpeg") fileType = "jpg";
					if(type == 2) {
						var fileTime = chatFileDataList[i].message_time;
					} else {
						var fileTime = changeDate(chatFileDataList[i].message_time);
					}
					fileTime = fileTime.substring(0, fileTime.length - 3);
					var str = "";
					str += "<tr id=" + fileData.id + ">";
					str += "<td width=\"36%\"><img class=\"file-ico\" src=\""+BASEAPIURL+"/icons/" + fileType + ".png\"><span class=\"file-name\" title=" + fileData.name + ">" + fileData.name + "</span></td>";
					str += "<td width=\"20%\">" + fileTime + "</td>";
					str += "<td width=\"15%\">" + fileSize + "MB</td>";
					str += "<td width=\"15%\">" + (type == "1" ? (chatFileDataList[i].message_send_by.employee_name) : (chatFileDataList[i].message_send_by.user_name)) + "</td>";
					str += "<td width=\"15%\" data-path=" + fileData.path + ">";
					str += "<i class=\"fa fa-eye\" aria-hidden=\"true\" title=\"预览\"></i>";
					str += "<i class=\"fa fa-download\" aria-hidden=\"true\" title=\"下载\"></i>";
					str += "</td>";
					str += "</tr>";
					$(showPage + " .file-list div.file-list-data table").append(str);
				}
				//添加下载事件
				$(showPage + " .file-list .fa-download").click(function() {
					var src = $(this).parent().attr("data-path");
					console.log(src)
					$.downloadFile(src);
				});
				//滚动加载
				//				$(window).scroll(function() {
				//					var scrollTop = $(this).scrollTop();
				//					var scrollHeight = $(document).height();
				//					var windowHeight = $(this).height();
				//					if(scrollTop + windowHeight == scrollHeight) {}
				//				});
				//搜索

			}
			//群公告展开和收回
			$(".inform-flexible").click(function() {
				if($(this).prev().hasClass("shrink")) {
					$(this).prev().removeClass("shrink");
					$(this).html("收起");
				} else {
					$(this).prev().addClass("shrink");
					$(this).html("展开");
				}
			});
			//上传文件
			var formContainers = ".chat-page-modal-content[data-id=" + chatId + "] .chat-page-main";
			$(formContainers + " .fa-folder").attr("id", chatId + "file");
			$("#" + chatId + "file").initUploader({
				url: SAASAPIS.BS.IMupload.document,
				isDownload: true,
				up_container: formContainers + " .upload",
				FilesAdded: function(up, files) {
					return true;
				},
				FileUploaded: function(up, file, response) {
					if(!isUnline()) return false;
					var resp = JSON.parse(response.response);
					var fileData = JSON.stringify(resp.data);
					if(resp.code == 0) {
						console.log(SAASAPIS.BS.IMupload.document)
						var filesPath = resp.data.path;
						var filesName = resp.data.name;
						//发送文件
						fileData = "[file_" + fileData + "]";
						console.log(fileData);
						window.sendFileId = "";
						if($(showPage).attr("data-chat-type") == 2) { //单发文件
							ws.onsend(40, {
								"message": fileData,
								"message_type": 1,
								"to_employee": showChatId
							}, function(data) {
								sendFileId = data.data.message_id;
								if(data.action == 200) return false;
								if(data.action == 500) {
									$.showErrorGritter("发送文件失败：" + data.data.message);
									return false;
								}
								var fileDatas = {
									"path": filesPath,
									"time": changeDate(data.data.timestamp)
								};
								sendInformation(["file", fileDatas, resp.data], filesName, "", $(formContainers).find(".chat-info"));
							});
						} else if($(showPage).attr("data-chat-type") == 4) { //客服
							ws.onsend(82, {
								"message": fileData,
								"message_type": 1,
								"to_user": showChatId
							}, function(data) {
								if(data.action == 200) return false;
								if(data.action == 500) {
									$.showErrorGritter("发送文件失败：" + data.data.message);
									return false;
								}
								sendFileId = data.data.message_id;
								var fileDatas = {
									"path": filesPath,
									"time": changeDate(data.data.timestamp)
								};
								sendInformation(["file", fileDatas, resp.data], filesName, "", $(formContainers).find(".chat-info"));
							});
						} else { //群发文件
							ws.onsend(41, {
								"message": fileData,
								"message_type": 1,
								"to_group": showChatId
							}, function(data) {
								if(data.action == 200) return false;
								if(data.action == 500) {
									$.showErrorGritter("加载群成员失败：" + data.data.message);
									return false;
								}
								sendFileId = data.data.message_id;
								var fileDatas = {
									"path": filesPath,
									"time": changeDate(data.data.timestamp)
								};
								sendInformation(["file", fileDatas, resp.data], filesName, "", $(formContainers).find(".chat-info"));
							});
						}
					} else {
						$.showErrorGritter("上传失败：" + resp.msg);
					}
				}
			});

			//发送图片
			var formContainers = ".chat-page-modal-content[data-id=" + chatId + "] .chat-page-main";
			$(formContainers + " .fa-file-image-o").attr("id", chatId + "img");
			$("#" + chatId + "img").initUploader({
				url: SAASAPIS.BS.IMupload.image,
				up_container: formContainers + " .upload",
				FilesAdded: function(up, files) {
					return true;
				},
				FileUploaded: function(up, file, response) {
					var resp = JSON.parse(response.response);
					if(resp.code == 0) {
						var filesPath = resp.data.path;
						var filesName = resp.data.name;
						//sendInformation(["image", filesPath], filesName, $(formContainers).find(".chat-info"));
						var chatText = $(showPage + " .chat-text").html();
						$(showPage + " .chat-text").html(chatText + "<img src=" + filesPath + " class=\"chat-image\" data-labface=\"[img_" + filesPath + "]\" />");
						//添加双击放大事件
						$(showPage + " .chat-text .chat-image").dblclick(function() {
							var src = $(this).attr("src");
							magnifyImage(src);
						});
					} else {
						$.showErrorGritter("上传失败：" + resp.msg);
					}
				}
			});
			if(chatType != "3" && chatType != "5")
			//发送表情
				$('.fa-smile-o').qqFace({
				assign: showPage.replace(".", "") + ' .chat-text', //给输入框赋值 
				path: '../resources/images/face/' //表情图片存放的路径 
			});
			//信息发送
			$(".btn-send").click(function() {
				var showChatText = $(this).prev().html();
				var sendText = "";
				$(this).prev().children("img").each(function() {
					var chatData = $(this).attr("data-labface");
					$(this).replaceWith(chatData);
				});
				var atData = [];
				$(this).prev().children("span").each(function() {
					atData.push($(this).attr("data-id"));
					$(this).replaceWith($(this).text());
				});
				sendText = $(this).prev().html();
				if(!isUnline()) return false;
				if(showChatText.length >= 500) {
					$.showErrorGritter("消息字数不能超过500个字，请重新输入！");
					return false;
				}
				sendInformation(["text", ""], showChatText, sendText, $(this).parents(".chat-page-modal-content").find(".chat-info"), atData);
				$(this).prev().html("");

			});
			$(".chat-text").keydown(function(e) {
				if(!e.shiftKey && e.keyCode == 13) { //发送
					e.preventDefault();
					var showChatText = $(this).html();
					var sendText = "";
					$(this).children("img").each(function() {
						var chatData = $(this).attr("data-labface");
						$(this).replaceWith(chatData);
					});
					var atData = [];
					$(this).children("span").each(function() {
						atData.push($(this).attr("data-id"));
						$(this).replaceWith($(this).text());
					});
					sendText = $(this).html();
					if(!isUnline()) return false;
					if(showChatText.length >= 500) {
						$.showErrorGritter("消息字数不能超过500个字，请重新输入！");
						return false;
					}
					sendInformation(["text", ""], showChatText, sendText, $(this).parents(".chat-page-modal-content").find(".chat-info"), atData);
					$(this).html("");
				}
				if(e.shiftKey && e.keyCode == 13) { //换行
					e.stopPropagation();
				}
			});

			function heavyLoadGroupData(objData, data) {
				ws.onsend(21, {});
				ws.onsend(22, {});
				console.log("修改群名称及头像：");
				console.log(objData);
				$("#" + showChatId + " img").attr("src", objData[1]);
				$("#" + showChatId + " .chat-list-name").attr("title", objData[0]);
				$("#" + showChatId + " .chat-list-name").html(objData[0]);
				$(showPage + " .chat-page-top>img").attr("src", objData[1]);
				$(showPage + " .info-name").html(objData[0]);
			}
			//发送消息
			function sendInformation(typeObj, newsText, showChatText, container, atInfoData) {
				console.log("@的人Id：" + JSON.stringify(atInfoData))
				var starTime = $(showPage + " .chat-info>div").last().attr("data-time");
				if($(showPage).attr("data-chat-type") == 2) { //单人发送
					if(typeObj[0] == "text") {
						if(newsText == "")
							return false;
						//发送
						console.log(showChatText + "|" + showChatId);
						ws.onsend(40, {
							"message": showChatText,
							"message_type": 2,
							"to_employee": showChatId
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("发送聊天消息失败：" + data.data.message);
								return false;
							}
							console.log(data);
							if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
								container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
							}
							var str = "";
							str += "<div id=" + data.data.message_id + " class=\"chat-info-send message-info\" data-time=\"" + changeDate(data.data.timestamp) + "\">";
							str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"chat-copy\">复制</span></p>";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
							container.append(str);
							//滚动到底部
							$(container).scrollTop($(container)[0].scrollHeight);
							//图片点击放大
							$(".chat-image").unbind("click");
							$(showPage + " .chat-image").click(function() {
								var src = $(this).attr("src");
								magnifyImage(src);
							});
							bindIncident(); //绑定事件
							showChatText = showChatText.replace(/\[img_([\s\S]*?)\]/g, '[图片]').replace(/\[em_f([0-9]*).gif\]/g, '[表情]');
							updataNewInformation(showChatId, showChatText, isTodayOrYesterday(changeDate(data.data.timestamp)));
						});

					} else if(typeObj[0] == "file") {
						if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
							container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
						}
						var fileType = typeObj[2].ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						fileType = fileType.toLowerCase();
							var str = "";
						str += "<div id=" + sendFileId + " class=\"chat-info-send message-info\" data-time=\"" + typeObj[1].time + "\" data-path=" + typeObj[1].path + ">";
						str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
						str += "<div class=\"demo clearfix fr pull-left\">";
						str += "<span class=\"triangle right\"></span>";
						str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText + "</div>";
						str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
						str += "</div>";
						str += "<img src=" + myAvatar + " class=\"pull-right\">";
						str += "<div class=\"clearfix\"></div>";
						str += "</div>";
						//if(container.children("div").)
						container.append(str);
						$("#" + sendFileId).data("fileData", typeObj[2]);
						//滚动到底部
						$(container).scrollTop($(container)[0].scrollHeight);
						bindIncident(); //绑定事件
						updataNewInformation(showChatId, "[文件]", isTodayOrYesterday(typeObj[1].time));
					}
				} else if($(showPage).attr("data-chat-type") == 4) { //客服发送
					if(typeObj[0] == "text") {
						if(newsText == "")
							return false;
						//发送
						console.log(showChatText + "|" + showChatId);
						ws.onsend(82, {
							"message": showChatText,
							"message_type": 2,
							"to_user": showChatId
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("发送聊天消息失败：" + data.data.message);
								return false;
							}
							console.log(data);
							if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
								container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
							}
							//if(data.msg_id == messageID) {
							var str = "";
							str += "<div class=\"chat-info-send message-info\" id=" + data.data.message_id + " data-time=\"" + changeDate(data.data.timestamp) + "\">";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							//str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
							container.append(str);
							//滚动到底部
							$(container).scrollTop($(container)[0].scrollHeight);

							bindIncident(); //绑定事件
							//							updataNewInformation(showChatId,showChatText);
							//							showChatText = showChatText.replace(/\[img_([\s\S]*?)\]/g, '[图片]').replace(/\[em_f([0-9]*).gif\]/g, '[表情]');
							//							$(".infolist-chatlist li[data-id=" + showChatId + "] .news-info-text").text(showChatText);
							//}
						});

					} else if(typeObj[0] == "file") {
						if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
							container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
						}
						var fileType = typeObj[2].ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						fileType = fileType.toLowerCase();
							var str = "";
						str += "<div id=" + sendFileId + " class=\"chat-info-send message-info\" data-time=\"" + typeObj[1].time + "\" data-path=" + typeObj[1].path + ">";
						str += "<p class=\"chat-menu\"><span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
						str += "<div class=\"demo clearfix fr pull-left\">";
						str += "<span class=\"triangle right\"></span>";
						str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText + "</div>";
						//str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
						str += "</div>";
						str += "<img src=" + myAvatar + " class=\"pull-right\">";
						str += "<div class=\"clearfix\"></div>";
						str += "</div>";
						//if(container.children("div").)
						container.append(str);
						$("#" + sendFileId).data("fileData", typeObj[2]);
						//滚动到底部
						$(container).scrollTop($(container)[0].scrollHeight);
						bindIncident(); //绑定事件
						//$(".infolist-chatlist li[data-id=" + showChatId + "] .news-info-text").text("[文件]");
					}
				} else { //群发发送
					var groupNum = parseInt($(showPage + " .info-nums").text().replace(/\D+/, "")) - 1; //获取群人数
					if(typeObj[0] == "text") {
						if(newsText == "")
							return false;
						//发送
						console.log(showChatText + "|" + showChatId + "|" + JSON.stringify(atInfoData));
						ws.onsend(41, {
							"at_info": atInfoData,
							"message": showChatText,
							"message_type": 2,
							"to_group": showChatId
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("发送聊天消息失败：" + data.data.message);
								return false;
							}
							console.log(data);
							if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
								container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
							}
							var str = "";
							str += "<div id=" + data.data.message_id + " class=\"chat-info-send message-info\" data-time=\"" + changeDate(data.data.timestamp) + "\">";
							str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>" + (findIsGroupType(showChatId) ? "" : "|<span class=\"stick-discussion\">置顶讨论</span>") + "|<span class=\"chat-copy\">复制</span></p>";
							str += "<div class=\"demo clearfix fr pull-left\">";
							str += "<span class=\"triangle right\"></span>";
							str += "<div class=\"article\">" + newsText + "</div>";
							str += "<span class=\"chat-info-send-num pull-right\"><span>" + groupNum + "</span>人未读</span>";
							str += "</div>";
							str += "<img src=" + myAvatar + " class=\"pull-right\">";
							str += "<div class=\"clearfix\"></div>";
							str += "</div>";
							container.append(str);
							$("#" + data.data.message_id).data("fileData", typeObj[2]);
							//滚动到底部
							$(container).scrollTop($(container)[0].scrollHeight);
							bindIncident(); //绑定事件
							showChatText = showChatText.replace(/\[img_([\s\S]*?)\]/g, '[图片]').replace(/\[em_f([0-9]*).gif\]/g, '[表情]');
							updataNewInformation(showChatId, myName + ":" + showChatText, isTodayOrYesterday(changeDate(data.data.timestamp)));
							//$(".infolist-chatlist li[data-id=" + showChatId + "] .news-info-text").text(myName + ":" + showChatText);
							//$(".infolist-chatlist li[data-id=" + showChatId + "] .infolist-time").text(isTodayOrYesterday(changeDate(data.data.timestamp)));

						});

					} else if(typeObj[0] == "file") {
						if($(showPage + " .chat-info>div").length <= 3 || !isDifferTime(starTime, changeDate(data.data.timestamp))) {
							container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>")
						}
						var fileType = typeObj[2].ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						fileType = fileType.toLowerCase();
							var str = "";
						str += "<div id=" + sendFileId + " class=\"chat-info-send message-info\" data-time=\"" + typeObj[1].time + "\" data-path=" + typeObj[1].path + ">";
						str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
						str += "<div class=\"demo clearfix fr pull-left\">";
						str += "<span class=\"triangle right\"></span>";
						str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + newsText + "</div>";
						str += "<span class=\"chat-info-send-num pull-right\"><span>" + groupNum + "</span>人未读</span>";
						str += "</div>";
						str += "<img src=" + myAvatar + " class=\"pull-right\">";
						str += "<div class=\"clearfix\"></div>";
						str += "</div>";
						//if(container.children("div").)
						container.append(str);
						$("#" + sendFileId).data("fileData", typeObj[2]);
						//滚动到底部
						$(container).scrollTop($(container)[0].scrollHeight);
						bindIncident(); //绑定事件
						updataNewInformation(showChatId, myName + ":[文件]", isTodayOrYesterday(typeObj[1].time));
						//						$(".infolist-chatlist li[data-id=" + showChatId + "] .news-info-text").text(myName + ":[文件]");
						//						$(".infolist-chatlist li[data-id=" + showChatId + "] .infolist-time").text(isTodayOrYesterday(typeObj[1].time));
					}
				}
				informTop(showChatId);
			}
			//文件发送--转发
			window.fileSend = function(data, fileData, toObjId, type) {
					var chatText = "";
					var starTime = $(".chat-page-modal-content[data-id=" + toObjId + "] .chat-info>div").last().attr("data-time");
					var container = $(".chat-page-modal-content[data-id=" + toObjId + "] .chat-info");
					if(type == 1) {
						!isDifferTime(starTime, changeDate(data.data.timestamp)) ? container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>") : "";
						var fileType = fileData.ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						fileType = fileType.toLowerCase();
						var str = "";
						str += "<div id=" + data.data.message_id + " class=\"chat-info-send message-info\" data-time=\"" + changeDate(data.data.timestamp) + "\" data-path=" + fileData.path + ">";
						str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
						str += "<div class=\"demo clearfix fr pull-left\">";
						str += "<span class=\"triangle right\"></span>";
						str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + fileData.name + "</div>";
						str += "<span class=\"chat-info-send-num pull-right\">未读</span>";
						str += "</div>";
						str += "<img src=" + myAvatar + " class=\"pull-right\">";
						str += "<div class=\"clearfix\"></div>";
						str += "</div>";
						container.append(str);
						$("#" + data.data.message_id).data("fileData", fileData);
						//滚动到底部
						//$(container).scrollTop($(container)[0].scrollHeight);

						bindIncident(); //绑定事件
						chatText = "[文件]";
						//$(".infolist-chatlist li[data-id=" + toObjId + "] .news-info-text").text("[文件]");
					} else {
						var groupNum = $(".chat-page-modal-content[data-id=" + toObjId + "] .info-nums").text().replace(/\D+/, "");
						var numStr = (parseInt(groupNum) - 1) == 0 ? "全部已读" : (parseInt(groupNum) - 1) + "人未读";
						!isDifferTime(starTime, changeDate(data.data.timestamp)) ? container.append("<p class=\"chat-page-main-toptime\">" + $.timeNow().Format("hh:mm:ss") + "</p>") : "";
						var fileType = fileData.ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						fileType = fileType.toLowerCase();
						var str = "";
						str += "<div id=" + data.data.message_id + " class=\"chat-info-send message-info\" data-time=\"" + changeDate(data.data.timestamp) + "\" data-path=" + fileData.path + ">";
						str += "<p class=\"chat-menu\"><span class=\"mgroupmember\">M Ta们</span>|<span class=\"file-view\">查看</span>|<span class=\"file-transmit\">转发</span>|<span class=\"file-download\">下载</span></p>";
						str += "<div class=\"demo clearfix fr pull-left\">";
						str += "<span class=\"triangle right\"></span>";
						str += "<div class=\"article\"><img src=\""+BASEAPIURL+"/icons/" + fileType + ".png\">" + fileData.name + "</div>";
						str += "<span class=\"chat-info-send-num pull-right\">" + numStr + "</span>";
						str += "</div>";
						str += "<img src=" + myAvatar + " class=\"pull-right\">";
						str += "<div class=\"clearfix\"></div>";
						str += "</div>";
						//if(container.children("div").)
						container.append(str);
						//滚动到底部
						//$(container).scrollTop($(container)[0].scrollHeight);

						bindIncident(); //绑定事件
						chatText = myName + ":[文件]";
						//$(".infolist-chatlist li[data-id=" + showChatId + "] .news-info-text").text(myName + ":[文件]");
					}
					updataNewInformation(toObjId, chatText, isTodayOrYesterday(changeDate(data.data.timestamp)));
					informTop(toObjId);
				}
				//发送传值
				//function 
				//@功能
			$(".fa-at").unbind("click");
			$(".fa-at").click(function(e) {
				var obj = this;
				if(!$(this).next().is(".friend-at")) {
					ws.onsend(24, {
						"group_id": chatId
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载群成员失败：" + data.data.message);
							return false;
						}
						searchGroupMember({
							"type": "@",
							"other": ""
						}, data);
					});

				} else {
					$(this).next().remove();
				}
				$("body").click(function(event) {
					if($(event.target).parents(".chat-tool-list").length == 0) {
						$(".at-page").remove();
					}
				});

			});
			window.viewAllChatHistory = function() {
					$(".char-info-record").trigger("click");
				}
				//聊天记录
			$(".char-info-record").unbind("click").click(function() {
				//清空输入的历史
				var keyWord = "";
				$(".history-curr-pager").val("1");
				$(".key-word-search").addClass("hide");
				$(".key-word-search input[type=text]").val("");
				if($(showPage).attr("data-chat-type") != 4) { //非客服聊天记录
					console.log("非客服聊天记录加载，ID：" + showChatId);
					var msgSeeionId = $(".view-chart-history-content").attr("data-msg-session-id");
					var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
					var type = $(showPage).attr("data-chat-type") == 2 ? 1 : 2;
					console.log((type == 2 ? 1 : 2) + "," + showChatId)
					ws.onsend(43, {
						"msg_session_type": type,
						"msg_session_id": showChatId,
						"msg_page": 1,
						"msg_limit": 20
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天记录失败：" + data.data.message);
							return false;
						}
						receiveHistoryChart("1", data);
					});
					//绑定关闭事件
					$('.fa-close').unbind("click").click(function() {
						$(".view-chart-history-container").animate({
							right: "-540px"
						}, 500);
					});
					////聊天记录关键字搜索
					$(".view-chart-history-container .view-chart-history-sel-time .search-chart-history").unbind("click").click(function(e) {
						//console.log(currDialogContainer.find(".key-word-search").html())
						if($(".key-word-search").hasClass("hide")) {
							$(".key-word-search").removeClass("hide");
						} else {
							$(".key-word-search").addClass("hide");
							keyWord = "";
						}
					});
					//聊天记录确认按钮
					$(".key-word-search .btn-key-word-search").unbind("click").click(function() {
						keyWord = $(this).prev().val();
						var msgSeeionId = $(this).parent("").attr("data-msg-session-id");
						var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
						$(".history-curr-pager").val("1");
						var currPage = $(".history-curr-pager").val();
						console.log(msgLimit + "条" + currPage + "页" + showChatId + "，" + ($(showPage).attr("data-chat-type") == 2 ? 1 : 2) + keyWord)
						ws.onsend(43, {
							msg_limit: msgLimit,
							msg_page: currPage,
							msg_session_id: showChatId,
							msg_session_type: ($(showPage).attr("data-chat-type") == 2 ? 1 : 2),
							msg_begin_time: historyChartTime,
							msg_keyword: keyWord
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("1", data);
						});
					});
					//聊天记录底部筛选
					//跳转到第n页
					$(".view-chart-history-content-footer>div:lt(4) i").unbind("click").click(function() {
						var currPage;
						if($(this).hasClass("fa-fast-backward")) { //跳转到第一页
							currPage = $(".history-total-pager").html();
						} else if($(this).hasClass("fa-backward")) { //跳转到前一页
							if(parseInt($(".history-curr-pager").val()) >= parseInt($(".history-total-pager").html())) {
								$.showErrorGritter("当前页已经是最后一页！");
								return false;
							}
							currPage = parseInt($(".history-curr-pager").val()) + 1;
						} else if($(this).hasClass("fa-forward")) { //跳转到后一页
							if(parseInt($(".history-curr-pager").val()) <= 1) {
								$.showErrorGritter("当前页已经是第一页！");
								return false;
							}
							currPage = parseInt($(".history-curr-pager").val()) - 1;
						} else { //跳转到最后一页
							currPage = 1;
						}
						$(".history-curr-pager").val(currPage);
						var messageSessionId = $(this).parent().parent().parent().attr("data-msg-session-id");
						//$(".history-curr-pager").html()
						var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
						console.log("跳转到：" + currPage + "页，有：" + msgLimit + "条，开始时间：" + historyChartTime + "，搜索字段" + keyWord);
						ws.onsend(43, {
							msg_limit: msgLimit,
							msg_page: currPage,
							msg_session_id: showChatId,
							msg_session_type: ($(showPage).attr("data-chat-type") == 2 ? 1 : 2),
							msg_begin_time: historyChartTime,
							msg_keyword: keyWord
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("1", data);
						});
					});
					//手动输入页数查询
					$(".view-chart-history-content-footer .history-curr-pager").unbind("keydown").keydown(function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							if(parseInt($(this).val()) < 1) {
								$(this).val("");
								$.showErrorGritter("页数不能小于1，请重新输入！");
							} else if(parseInt($(this).val()) > parseInt($(".history-total-pager").html())) {
								$(this).val("");
								$.showErrorGritter("页数不能大于" + $(".history-total-pager").html() + "，请重新输入！");
							} else {
								var currPage = $(this).val();
								var messageSessionId = $(this).parent().parent().parent().attr("data-message-session-id");
								//$(".history-curr-pager").html()
								var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
								ws.onsend(43, {
									msg_limit: msgLimit,
									msg_page: currPage,
									msg_session_id: showChatId,
									msg_session_type: ($(showPage).attr("data-chat-type") == 2 ? 1 : 2),
									msg_begin_time: historyChartTime,
									msg_keyword: keyWord
								}, function(data) {
									if(data.action == 200) return false;
									if(data.action == 500) {
										$.showErrorGritter("加载聊天记录失败：" + data.data.message);
										return false;
									}
									receiveHistoryChart("1", data);
								});
							}
						}
					});
					//选择日期查询聊天记录
					$(".view-chart-history-sel-time .date-picker").unbind("change").change(function(e) {
						//if(e.keyCode!==13) return false;
						var currPageContainer = $(".view-chart-history-content-footer .history-curr-pager");
						//					if(parseInt(currPageContainer.val()) < 1) {
						//						$.showErrorGritter("页数不能小于1，请重新输入！");
						//					} else if(parseInt(currPageContainer.val()) > parseInt($(".history-total-pager").html())) {
						//						$.showErrorGritter("页数不能大于最大页数，请重新输入！");
						//					} else {
						currPageContainer.val("1");
						var currPage = currPageContainer.val();
						//$(".history-curr-pager").html()
						var historyChartTime = $(this).val();
						console.log(historyChartTime);
						console.log("日期搜索：日期-" + historyChartTime + "，第" + currPage + "页，搜索字段：" + keyWord);
						ws.onsend(43, {
							msg_limit: msgLimit,
							msg_page: currPage,
							msg_session_id: showChatId,
							msg_begin_time: historyChartTime,
							msg_end_time: historyChartTime,
							msg_keyword: keyWord,
							msg_session_type: ($(showPage).attr("data-chat-type") == 2 ? 1 : 2)
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("1", data);
						});
						//					}
					});
					////日期选择
					$(".date-picker").datepicker({
						autoclose: true,
						clearBtn: true,
						weekStart: "0",
						format: "yyyy-mm-dd",
						pickerPosition: 'bottom-left'
					}).on("show", function() {
						setDatepickerLocation();
					});
					//查找事件
					$(".search-chart-history").unbind('click').click(function() {
						if($(".key-word-search").hasClass("hide")) {
							$(".key-word-search").removeClass("hide");
						} else {
							$(".key-word-search").addClass("hide")
						}
					});
				} else { //客服聊天记录
					console.log("非客服聊天记录加载");
					var msgSeeionId = $(".view-chart-history-content").attr("data-msg-session-id");
					var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
					ws.onsend(86, {
						"msg_begin_time": "",
						"to_user": showChatId,
						"msg_page": 1,
						"msg_limit": 20,
						"msg_keyword": "",
						"msg_end_time": ""
					}, function(data) {
						if(data.action == 200) return false;
						if(data.action == 500) {
							$.showErrorGritter("加载聊天记录失败：" + data.data.message);
							return false;
						}
						receiveHistoryChart("2", data);
					});
					//绑定关闭事件
					$('.fa-close').unbind("click").click(function() {
						$(".view-chart-history-container").animate({
							right: "-540px"
						}, 500);
					});
					////聊天记录关键字搜索
					$(".view-chart-history-container .view-chart-history-sel-time .search-chart-history").unbind("click").click(function(e) {
						//console.log(currDialogContainer.find(".key-word-search").html())
						if($(".key-word-search").hasClass("hide")) {
							$(".key-word-search").removeClass("hide");
						} else {
							$(".key-word-search").addClass("hide");
							keyWord = "";
						}
					});
					//聊天记录确认按钮
					$(".key-word-search .btn-key-word-search").unbind("click").click(function() {
						keyWord = $(this).prev().val();
						var msgSeeionId = $(this).parent("").attr("data-msg-session-id");
						var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
						$(".history-curr-pager").val("1");
						var currPage = $(".history-curr-pager").val();
						console.log(showChatId + "时间：" + historyChartTime + "页：" + currPage + "条：" + msgLimit + "text:" + keyWord)
						ws.onsend(86, {
							"msg_begin_time": historyChartTime,
							"to_user": showChatId,
							"msg_page": currPage,
							"msg_limit": msgLimit,
							"msg_end_time": historyChartTime,
							"msg_keyword": keyWord
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("2", data);
						});
					});
					//聊天记录底部筛选
					//跳转到第n页
					$(".view-chart-history-content-footer>div:lt(4) i").unbind("click").click(function() {
						var currPage;
						if($(this).hasClass("fa-fast-backward")) { //跳转到第一页
							currPage = $(".history-total-pager").html();
						} else if($(this).hasClass("fa-backward")) { //跳转到前一页
							if(parseInt($(".history-curr-pager").val()) >= parseInt($(".history-total-pager").html())) {
								$.showErrorGritter("当前页已经是最后一页！");
								return false;
							}
							currPage = parseInt($(".history-curr-pager").val()) + 1;
						} else if($(this).hasClass("fa-forward")) { //跳转到后一页
							if(parseInt($(".history-curr-pager").val()) <= 1) {
								$.showErrorGritter("当前页已经是第一页！");
								return false;
							}
							currPage = parseInt($(".history-curr-pager").val()) - 1;
						} else { //跳转到最后一页

							currPage = 1;
						}
						$(".history-curr-pager").val(currPage);
						var messageSessionId = $(this).parent().parent().parent().attr("data-msg-session-id");
						//$(".history-curr-pager").html()
						var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
						console.log("跳转到：" + currPage + "页，有：" + msgLimit + "条，开始时间：" + historyChartTime + "，搜索字段" + keyWord);
						ws.onsend(86, {
							"msg_begin_time": historyChartTime,
							"to_user": showChatId,
							"msg_page": currPage,
							"msg_limit": msgLimit,
							"msg_end_time": historyChartTime,
							"msg_keyword": keyWord
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("2", data);
						});
					});
					//手动输入页数查询
					$(".view-chart-history-content-footer .history-curr-pager").unbind("keydown").keydown(function(e) {
						if(e.keyCode == 13) {
							e.preventDefault();
							if(parseInt($(this).val()) < 1) {
								$(this).val("");
								$.showErrorGritter("页数不能小于1，请重新输入！");
							} else if(parseInt($(this).val()) > parseInt($(".history-total-pager").html())) {
								$(this).val("");
								$.showErrorGritter("页数不能大于" + $(".history-total-pager").html() + "，请重新输入！");
							} else {
								var currPage = $(this).val();
								var messageSessionId = $(this).parent().parent().parent().attr("data-message-session-id");
								//$(".history-curr-pager").html()
								var historyChartTime = $(".view-chart-history-sel-time .date-picker").val();
								ws.onsend(86, {
									"msg_begin_time": historyChartTime,
									"to_user": showChatId,
									"msg_page": currPage,
									"msg_limit": msgLimit,
									"msg_end_time": historyChartTime,
									"msg_keyword": keyWord
								}, function(data) {
									if(data.action == 200) return false;
									if(data.action == 500) {
										$.showErrorGritter("加载聊天记录失败：" + data.data.message);
										return false;
									}
									receiveHistoryChart("2", data);
								});
							}
						}
					});
					//选择日期查询聊天记录
					$(".view-chart-history-sel-time .date-picker").unbind("change").change(function(e) {
						//if(e.keyCode!==13) return false;
						var currPageContainer = $(".view-chart-history-content-footer .history-curr-pager");
						//					if(parseInt(currPageContainer.val()) < 1) {
						//						$.showErrorGritter("页数不能小于1，请重新输入！");
						//					} else if(parseInt(currPageContainer.val()) > parseInt($(".history-total-pager").html())) {
						//						$.showErrorGritter("页数不能大于最大页数，请重新输入！");
						//					} else {
						currPageContainer.val("1");
						var currPage = currPageContainer.val();
						//$(".history-curr-pager").html()
						var historyChartTime = $(this).val();
						console.log(historyChartTime);
						console.log("日期搜索：日期-" + historyChartTime + "，第" + currPage + "页，搜索字段：" + keyWord);
						ws.onsend(86, {
							"msg_begin_time": historyChartTime,
							"to_user": showChatId,
							"msg_page": currPage,
							"msg_limit": msgLimit,
							"msg_end_time": historyChartTime,
							"msg_keyword": keyWord
						}, function(data) {
							if(data.action == 200) return false;
							if(data.action == 500) {
								$.showErrorGritter("加载聊天记录失败：" + data.data.message);
								return false;
							}
							receiveHistoryChart("2", data);
						});
						//					}
					});
					////日期选择
					$(".date-picker").datepicker({
						autoclose: true,
						clearBtn: true,
						weekStart: "0",
						format: "yyyy-mm-dd",
						pickerPosition: 'bottom-left'
					}).on("show", function() {
						setDatepickerLocation();
					});
					//查找事件
					$(".search-chart-history").unbind('click').click(function() {
						if($(".key-word-search").hasClass("hide")) {
							$(".key-word-search").removeClass("hide");
						} else {
							$(".key-word-search").addClass("hide")
						}
					});
				}
			});
			////日期选择
			$(".search-time").datepicker({
				autoclose: true,
				clearBtn: true,
				weekStart: "0",
				format: "yyyy-mm-dd",
				pickerPosition: 'bottom-left'
			}).on("show", function() {
				setDatepickerLocation();
			});
			//处理收到的历史聊天记录信息
			function receiveHistoryChart(type, data) {
				console.log(data);
				window.msgLimit = 20;
				if(data.action == 200) return false;
				console.log(data.data);
				$(".view-chart-history-content .history-total-record").html(data.data.total_num);
				var nums = Math.ceil(data.data.total_num / msgLimit);
				var nowPage = (nums == 0 ? "1" : nums);
				$(".view-chart-history-content .history-total-pager").html(nowPage);
				//console.log(data.data.data.length > 0 && data.data.data.reverse())
				$(".view-chart-history-content .view-chart-history-content-body").html("");
				var allMessageDom = "";
				$.each(data.data.data, function(i, item) {
					//console.log(i);
					//console.log(item)
					var oneMessage = "";
					//i > 0 && console.log($.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time))
					if(i == 0 || $.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time) >= 1) {
						oneMessage += //时间
							"<div class=\"this-chart-record-history-time\">" +
							"<i></i>" +
							"<span style='color:#999;'>" + (new Date(changeDate(item.message_time.replace(/-/g,"/")))).format("yyyy-MM-dd") + "</span>" +
							"<i></i>" +
							"</div>";
						oneMessage += //消息
							"<div class=\"view-chart-historyone-message\">" +
							"<span class=\"message-name\" style='color:" + ((type == 1 ? item.message_send_by.employee_id : item.message_send_by.user_id) == showChatId ? "#42B475" : "#006EFE") + "'>" + (type == 1 ? item.message_send_by.employee_name : item.message_send_by.user_name) + "</span>" +
							"<span class=\"message-time\" style='color:" + ((type == 1 ? item.message_send_by.employee_id : item.message_send_by.user_id) == showChatId ? "#42B475" : "#006EFE") + "'>" + changeDate(item.message_time) + "</span><br>" +
							"<span style='' class=\"message-detail history-message-detail " + (item.message_type == 1 ? "history-message-detail-file" : "") + "\">" + dealMessage(item) + "</span>" +
							"</div>";
					} else if($.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time) < 1) {
						oneMessage += //消息
							"<div class=\"view-chart-historyone-message\">" +
							"<span class=\"message-name\" style='color:" + ((type == 1 ? item.message_send_by.employee_id : item.message_send_by.user_id) == showChatId ? "#42B475" : "#006EFE") + "'>" + (type == 1 ? item.message_send_by.employee_name : item.message_send_by.user_name) + "</span>" +
							"<span class=\"message-time\" style='color:" + ((type == 1 ? item.message_send_by.employee_id : item.message_send_by.user_id) == showChatId ? "#42B475" : "#006EFE") + "'>" + changeDate(item.message_time) + "</span><br>" +
							"<span style='' class=\"message-detail history-message-detail " + (item.message_type == 1 ? "history-message-detail-file" : "") + "\">" + dealMessage(item) + "</span>" +
							"</div>";
					}
					allMessageDom += oneMessage;
				});
				if(allMessageDom == "") {
					allMessageDom = "没有该条件下的聊天记录信息！";
				}
				$(".view-chart-history-content .view-chart-history-content-body").html(allMessageDom);
				$(".view-chart-history-container").animate({
					right: "0px"
				}, 300, function() {});
				bindIncident();
			}

			function dealMessage(data) {
				var messageContent = "";
				//console.log(data)
				//console.log((data.data && data.data.type) || data.message_type || data.data.message_type)
				if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 1) {
					var messageContentData = ((data.data && data.data.content) || data.message_content || data.data.message_content).replace(/^\[file_([\s\S]*?)\]$/g, "$1");
					var fileDataStr = messageContentData;
					try {
						messageContentData = JSON.parse(messageContentData);
						//console.log(messageContentData);
						///console.log(messageContentData.name)
						//messageContent=messageContentData.name;
						var fileType = messageContentData.ext;
						if(fileType == "7z") fileType = "zip";
						if(fileType == "jpeg") fileType = "jpg";
						messageContent += "<span  data-file=" + fileDataStr + " class=\"uploaded-file-container message-info\" data-path=" + messageContentData.path + ">" +
							"<img style='width: 50px;height: 50px;float: left;' src='"+BASEAPIURL+"/icons/" + fileType + ".png'>" +
							"<span data-file-id=" + messageContentData.id + " data-path=\"" + messageContentData.path + "\">" + messageContentData.name + "</span><br>" +
							"<span class=\"uploaded-file-operaters\">" +
							"<a class=\"view-uploaded-file\" onclick=\"clickToLargePicture('file'," + messageContentData.path + ");\">查看</a>" +
							"<a>|</a>" +
							"<a class=\"file-download\">下载</a>" +
							"<a>|</a><a class=\"file-transmit\">转发</a>" +
							"<a></a></span><a><span></span></a></span>";
					} catch(e) {
						console.log("错误！！！！！！！");
						console.log(messageContentData);
					}

				} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 2) {
					messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
					//console.log(messageContent)
					messageContent = messageContent.replace(/\[img_([\s\S]*?)\]/g, '<img class=\"clickToLargePicture\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
						.replace(/\[em_f([0-9]*).gif\]/g, '<img style="width: 20px;height:20px;" src="../resources/images/face/f$1.gif" border="0" />');
				} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 3) {
					messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
					messageContent = messageContent.replace(/^\[radio_([\s\S]*?)\]$/g, '<img class=\"clickToLargePicture\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
				} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 4) {
					messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
					messageContent = messageContent.replace(/^\[audio_([\s\S]*?)\]$/g, '<img class=\"clickToLargePicture\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
					messageContent =
						"<audio src=\"" + messageContent + "\" controls=\"controls\">" +
						"您的浏览器不支持音频播放!" +
						"</audio>";
					console.log(messageContent)
				}
				//console.log(messageContent)
				return messageContent;
			}
			//读取群成员
			function searchGroupMember(typeObj, data) {
				window.groupData = data.data;
				var groupNumber = groupData.length;
				if(typeObj.type == "@") {
					var str = "<div class=\"at-page friend-at\">";
					str += "<div class=\"at-top\">";
					str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
					str += "<input type=\"text\" placeholder=\"请输入姓名进行查找\" />";
					str += "</div>";
					str += "<div class=\"at-group-list\">";
					str += "<ul>";
					for(var i in groupData) {
						if(groupData[i].employee_id == myId) {
							continue;
						}
						str += "<li data-id=" + groupData[i].employee_id + ">";
						str += "<img src=" + groupData[i].employee_avatar + " />";
						str += "<span class=\"at-group-list-name\">" + groupData[i].employee_name + "</span>";
						str += "(<span class=\"at-group-list-depart\">" + groupData[i].depa_name + "</span>)";
						str += "</li>";
					}
					str += "</ul>";
					str += "</div>";
					str += "</div>";
					$(showPage + " .fa-at").after(str);
					//添加点击事件
					$(showPage + " .at-page li").click(function() {
						var id = $(this).attr("data-id");
						var name = $(this).children(".at-group-list-name").text();
						//中间插入方法未写默认在后面
						var text = $(showPage + " .chat-text").html();
						$(showPage + " .chat-text").html(text + "<span contenteditable=\"false\" class=\"at-list\" data-id=" + id + ">@" + name + "  </span>");
						$(showPage + " .at-page").remove();
					});
					//搜索
					$(".at-page input").keydown(function() {
						var searchText = $(this).val();
						if(searchText == "") {
							$(".at-page li").show();
						} else {
							$(".at-page li").each(function(index) {
								var contrastText = $(this).children(".at-group-list-name").text();
								if(!isConform(searchText, contrastText)) {
									$(this).hide();
								} else {
									$(this).show();
								}
							});
						}
					});
				} else if(typeObj.type == "member") {
					//清空
					$(typeObj.other + " .group-custodian-separate").siblings("div").remove();
					$(typeObj.other + " .group-member").empty();
					//加载群管理及群主
					$(typeObj.other + " .group-man-number").html("群成员" + groupNumber + "人");
					var groupMemberData = [];
					console.log(groupData);
					var isDeteleJurisdiction = true,
						isDeteleAllJurisdiction = true;
					for(var i in groupData) {
						if(groupData[i].member_type == 1) {
							console.log(groupData[i].employee_id + "==" + myId)
							var str = "";
							str += "<div class=\"group-custodian-main group-member-box\" onclick=\"openPersonageInfo(this)\" data-state=" + groupData[i].employee_enabled + " data-id=" + groupData[i].employee_id + " data-member-id=" + groupData[i].member_id + " data-member-type=" + groupData[i].member_type + ">";
							str += "<img src=" + groupData[i].employee_avatar + ">";
							str += "<span class=\"group-custodian-main-name css-overhidden\" title=" + groupData[i].employee_name + ">" + groupData[i].employee_name + "</span>";
							str += "</div>";
							$(typeObj.other + " .group-custodian-separate").before(str);
							$(typeObj.other + " .group-member").prepend(str);
							//查看是否是群主
							if(myId == groupData[i].employee_id) {
								console.log("是群主");
								$(typeObj.other + " .group-set-menu span").show();
								$(typeObj.other + " .group-set .fa-pencil").show();
								$(typeObj.other + " .btn-dissolve-group").show();
							}
						} else if(groupData[i].member_type == 2) {
							var str = "";
							str += "<div class=\"group-custodian-assistant group-member-box\" onclick=\"openPersonageInfo(this)\" data-state=" + groupData[i].employee_enabled + " data-id=" + groupData[i].employee_id + " data-member-id=" + groupData[i].member_id + " data-member-type=" + groupData[i].member_type + ">";
							str += "<img src=" + groupData[i].employee_avatar + ">";
							str += "<span class=\"group-custodian-assistant-name css-overhidden\" title=" + groupData[i].employee_name + ">" + groupData[i].employee_name + "</span>";
							str += "<span class=\"info-num list-detele\">×</span>";
							str += "</div>";
							$(typeObj.other + " .group-custodian-separate").after(str);
							$(typeObj.other + " .group-member").append(str);
							if(myId == groupData[i].employee_id) {
								console.log("是管理员");
								isDeteleAllJurisdiction = false; //不能删除群管理
								$(typeObj.other + " .group-set-add").show();
								$(typeObj.other + " .group-set .fa-pencil").show();
							}
						} else {
							if(myId == groupData[i].employee_id) {
								isDeteleJurisdiction = false; //没有删除成员权限
							}
							groupMemberData.push(groupData[i]);
						}
					}
					for(var i in groupMemberData) { //加载群成员
						var strs = "";
						strs += "<div class=\"group-member-box\" onclick=\"openPersonageInfo(this)\" data-state=" + groupMemberData[i].employee_enabled + " data-id=" + groupMemberData[i].employee_id + " data-member-id=" + groupMemberData[i].member_id + " data-member-type=" + groupMemberData[i].member_type + ">";
						strs += "<img src=" + groupMemberData[i].employee_avatar + ">";
						strs += "<span class=\"group-custodian-assistant-name css-overhidden\" title=" + groupMemberData[i].employee_name + ">" + groupMemberData[i].employee_name + "</span>";
						strs += "<span class=\"info-num list-detele\">×</span>";
						strs += "</div>";
						$(typeObj.other + " .group-member").append(strs);
					}
					if(!isDeteleAllJurisdiction) {
						console.log('群管理1');
						$(typeObj.other + " .group-member>div[data-member-type=1]").addClass("group-member-boxs");
						$(typeObj.other + " .group-member>div[data-member-type=2]").addClass("group-member-boxs");
					}
					if(!isDeteleJurisdiction) {
						console.log('群成员')
						$(typeObj.other + " .group-member>div").addClass("group-member-boxs");
					}
					//判断是否异常，异常则加非正常状态
					$(typeObj.other + " .group-member>div").each(function(index) {
						if($(this).attr("data-state") == "false") {
							$(this).addClass("filter");
							$(this).attr("title", "该群成员账号已被停用")
						}
					});
				} else {
					$(showPage + " .info-nums").html(groupNumber + "人");
				}
				$(showPage + " .info-nums").text(groupNumber + "人");
			} //时间插件定位
			var setDatepickerLocation = function() {
					var left = $(".date-picker").offset().left - 130;
					var top = $(".date-picker").offset().top - 260;
					console.log("left:" + left + "top:" + top);
					$(".datepicker-dropdown").css({
						"top": top
					}, {
						"left": left
					});
				}
				//发布新公告
			function releaseInform() {
				var modalId = $.modal().show("发布公告", ".release-inform-page", function() {

				});
			}
			//删除公告
			function deleteInform(obj) {
				$.modal().confirm("确定删除这条公告？", function() {
					$(obj).parents(".inform-list-box").remove();
					$.showSuccessGritter("删除成功");
				});
			}
			//群聊天文件上传时间排序
			function fileUploadingTimeRank(obj) {
				//默认升序
				if($(obj).children("i").hasClass("fa-sort-desc")) {
					//倒叙
					$(obj).children("i").removeClass("fa-sort-desc").addClass("fa-sort-asc");
				} else {
					$(obj).children("i").removeClass("fa-sort-asc").addClass("fa-sort-desc");
				}

			}

			//可拖动
			var _move = false; //移动标记
			var _x, _y; //鼠标离控件左上角的相对位置
			var maxWidth = window.innerWidth - $(".chat-page").outerWidth();
			var maxHeight = window.innerHeight - $(".chat-page").outerHeight();
			console.log("maxleft：" + maxWidth + "，maxtop：" + maxHeight);
			$(document).ready(function() {
				$(".chat-page-top,.chat-page-left").click(function() {
					//alert("click");//点击（松开后触发）
				}).mousedown(function(e) {
					_move = true;
					_x = e.pageX - parseInt($(".chat-page").css("left"));
					_y = e.pageY - parseInt($(".chat-page").css("top"));
					//$(".chat-page").fadeTo(20, 0.25); //点击后开始拖动并透明显示
				});
				$(document).mousemove(function(e) {
					if(_move) {
						var x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
						var y = e.pageY - _y;
						if(y < -95) {
							y = -95;
						}
						if(x < 0) {
							x = 0;
						}
						if(y > maxHeight - 100) {
							y = maxHeight - 100;
						}
						if(x > maxWidth) {
							x = maxWidth;
						}
						$(".chat-page").css({
							top: y,
							left: x
						}); //控件新位置
					}
				}).mouseup(function() {
					_move = false;
					//$(".chat-page").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
				});
			});

		} else {
			//若已存在

		}
		//判断是否存在，若存在则返回true，并列表获得样式，显示该聊天页面
		function isExist(id) {
			var hasThisId = false;
			$(".chat-page-list li").each(function(index) {
				if($(this).attr("id") == id) {
					hasThisId = true;
					$(this).trigger("click");
				}
			});
			return hasThisId;
		}
		countTimeDifference("2016-9-27 12:00:00", "2016-9-27 16:15:11");
		//计算时差
		function countTimeDifference(starDate, endDate) {
			starDate = new Date(starDate.replace(/-/g,"/")); //开始时间
			endDate = new Date(endDate.replace(/-/g,"/")); //结束时间
			var date3 = endDate.getTime() - starDate.getTime() //时间差的毫秒数

			//计算出相差天数
			var days = Math.floor(date3 / (24 * 3600 * 1000))
				//计算出小时数
			var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
			var hours = Math.floor(leave1 / (3600 * 1000))
				//计算相差分钟数
			var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
			var minutes = Math.floor(leave2 / (60 * 1000))

			//计算相差秒数
			var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
			var seconds = Math.round(leave3 / 1000)
				//alert(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
		}

		//返回对应文件的图标如：ping、word、ppt、jpg、excel、zip等
		//	function findIcon(fileName) {
		//		var fileType = fileName.split(".")[1].toLowerCase();
		//		if(fileType == "jpg" || fileType == "png" || fileType == "gif" || fileType == "psd" || fileType == "bmp" || fileType == "jpe" || fileType == "jpeg") {
		//			return "<i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>";
		//		} else {
		//			switch(fileType) {
		//				case "doc":return <
		//			}
		//		}
		//
		//	}
	}
	//图片放大
function magnifyImage(src) {
	if($(".magnify-image").length < 1) {
		//添加弹窗
		var str = "";
		str += "<div class=\"magnify-image hide\">";
		str += "<div class=\"view-image\">";
		str += "<img src=\"\" class=\"big-image\">";
		str += "</div>";
		str += "</div>";
		$("body").append(str);
	}
	var modalId = $.modal({
		showFooter: false
	}).showOfLarge("查看图片", ".magnify-image", function() {});
	$("#" + modalId + " img").attr("src", src);
}
//判断是否相差1分钟
function isDifferTime(starTime, endTime, scopeNun) {
	//	console.log(scopeNun)
	//	scopeNun = (scopeNun == undefined ? 120 : scopeNun);

	console.log("startime：" + starTime + "|endtime:" + endTime + "|范围：" + scopeNun + "|相差：" + (changeDate(endTime) - changeDate(starTime) >= 60));
	if(changeDate(endTime) - changeDate(starTime) >= 120) {
		return false;
	} else {
		return true;
	}
}