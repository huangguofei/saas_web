//选择员工公共方法----选择共享对象
$.showShareEmployeeSelectPop = function(option) {
	var title = option.right_title;
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-share").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info model-employee-select-common pnl-employee-select-common pnl-employee-select-common-share hide\">" +
			"	<form onsubmit=\"return false;\" class=\"form-horizontal model-leader-info model-employee-select-common pnl-employee-select-common-share\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"py\">" +
			"				<input type=\"text\" class=\"search\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
			(!option.isNotNeedDepaSelect ? "<span data-depar='' class='search-menu search-all'>所有部门</span>"+"<span data-depar='1' class='search-menu select'>我的部门</span><span data-depar=" + (option.type == "1" ? "4" : "2") + " class='search-menu'>" + (option.type == "1" ? "我的下属" : "下属部门") + "</span><span data-depar=" + (option.type == "1" ? "5" : "3") + " class='search-menu'>" + (option.type == "1" ? "我的上级" : "上级部门") + "</span>" : "") +
			"				<p class='nav-py'>" +
			"					<a class=\"active\">A</a>" +
			"				</p>" +
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
					e.stopPropagation();
					$("#" + modalIdOfEmployee + " .search").trigger("change");
				}
			});
		}
	}).show(option.title, ".pnl-employee-select-common-share",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sCkEmployee4Select]").each(function() {
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
		$.ajaxGet(SAASAPIS.BS.company.employees + "/simple?key=" + keyText + "&filter_account=1&filter_status=" + (option.filter_status == undefined ? "" : option.filter_status) + (!option.isNotNeedDepaSelect ? "&depa_mode=" + stateText : "") +
			"&check_schedule_rule=" + (option.check_schedule_rule || ""),
			function(response) {
				if(response.code == 0) {
					//success
					var employeeList = response.data.rows;
					var employeesGroupByPY = {};
					var pyArr = [];
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
					$(formContainerOfEmployee + " .wrap-source .py p").append("<a>#</a>");
					for(var p in pyArr) {
						if(pyArr[p] == "#") {
							continue;
						}
						$(formContainerOfEmployee + " .wrap-source .nav-py").append("<a>" + pyArr[p] + "</a>");
						if(p == 0) {
							var maxLengthOfACol = parseInt(320 / $(formContainerOfEmployee + " .py a:first-child").outerHeight(true));
							if(pyArr.length >= maxLengthOfACol) $(".wrap-source .nav-py").css("width", "26px");
						}
						if($(formContainerOfEmployee + " .wrap-source .list-emp div[id=nav-py-]"+pyArr[p]).length<1)
						$(formContainerOfEmployee + " .wrap-source .list-emp").append("<div id='nav-py-" + pyArr[p] + "'>" + pyArr[p] + "</div>");
					}
					//click event
					$(formContainerOfEmployee + " .wrap-source .nav-py a").click(function() {
						$(formContainerOfEmployee + " .wrap-source .nav-py a").removeClass("active");
						$(this).addClass("active");
						//initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
						window.location = "#nav-py-" + $(this).text();
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
									liDom.append("<label class='assist-people' data-has-rule='" + employeeData.has_schedule_rule + "'><input type=\"checkbox\" class='form-control-radio' name='sCkEmployee4Select' data-employee-name=\"" + employeeData.employee_name + "\" value=\"" + employeeData.employee_id + "\"> <span>" +
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
//	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(e){
//		if(e.keyCode==13) {
//			e.preventDefault();
//			$(formContainerOfEmployee + " .wrap-source .py .search").trigger("change");
//		}
//	});
	//点击换样式
	$(formContainerOfEmployee + " .search-menu").click(function() {
		$(this).addClass("select").siblings().removeClass("select");
		stateText = $(this).attr("data-depar");
		$(formContainerOfEmployee + " .wrap-source .py .search").trigger("change");
	});
	if(!option.depa_mode) $(formContainerOfEmployee + " .wrap-source .py .search-all").addClass("select").siblings().removeClass("select");
	//移除已选人员
	$(formContainerOfEmployee + " .btn-remove").click(function() {
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sCkEmployee4Select]:checked").each(function() {
			$(this).parent().parent().remove();
		});
	});

	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		var selectedEmployeeIdsObj = {};
		for(var i in option.selectedEmployeeIds) {
			selectedEmployeeIdsObj[option.selectedEmployeeIds[i]] = option.selectedEmployeeIds[i];
		}
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			var firstPY = (employees[i].employee_name_first_en || "#").substring(0, 1).toUpperCase();
			if($("#nav-py-" + firstPY).length < 1) {
				$(formContainerOfEmployee + " .wrap-source .list-emp").append("<div id='nav-py-" + firstPY + "'>" + firstPY + "</div>");
			}
			if(!option.isShowMe && employeeData.employee_name == $.cookie("_u_name")) continue;
			var liDom = $("<li></li>");
			liDom.append("<label class='assist-people' data-has-rule='" + employeeData.has_schedule_rule + "'><input type=\"checkbox\"" + (selectedEmployeeIdsObj[employeeData.employee_id] ? " checked='checked'" : "") + " class='form-control-radio' name='sCkEmployee4Select' data-employee-name=\"" + employeeData.employee_name + "\" data-employee_avatar=\"" + employeeData.employee_avatar + "\" value=\"" + employeeData.employee_id + "\"> <span>" +
				employeeData.employee_name + "</span><span>" +
				employeeData.depa_name + "</span><span>" + employeeData.employee_post_cn + "</span></label>");
			$(formContainerOfEmployee + " .wrap-source .list-emp #nav-py-"+firstPY).after(liDom);
		}
		$(formContainerOfEmployee+ " .wrap-new input").each(function(){
			$(formContainerOfEmployee+ " .wrap-source input[value='"+$(this).val()+"']").prop("checked","checked");
		});
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
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
			if(option.check_schedule_rule) {
				if($(this).parent().attr("data-has-rule") == "false") {
					$(this).removeProp("checked");
					$.showErrorGritter("当前员工无工作计划规则，不能选择！");
					return false;
				}
			}
			if(!$(this).is(":checked")){
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").parent().parent().remove();
				$(this).removeProp("checked");
				return false;
			}
			$(this).prop("checked","checked");
			var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
			if(option.onlySingle) $(formContainerOfEmployee + " .wrap-new .list-emp").empty();
			selectEmpDoms.each(function() {
				var selDom = $(this).parent().parent();
				selDom.append("<img class='btn-remove' onclick='removeSelected(this);' src='../resources/images/filter-close.png'/>");
				var selEmpId = $(this).val();
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
					$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
				$(formContainerOfEmployee + " .wrap-new .list-emp input").addClass("hide");
				selDom.find(".btn-remove").remove();
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").attr("name","sCkEmployee4Select");
			});
			$(this).prop("checked","checked");
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
			}
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

//选择员工公共方法---设置负责人
$.showLinkmanEmployeeSelectPop = function(option) {
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-linkman").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-linkman hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-linkman\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"py\">" +
			"				<input type=\"text\" class=\"search\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
			"				<p class='nav-py'>" +
			"					<a class=\"active\">A</a>" +
			"				</p>" +
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
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
	var url = BSAPIURL + "/crm/contacts/?client_id=" + option.clientId + "&depa_id=" + option.depaId + "&key=";
	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-linkman",
		function(modal) {
			var leader_data = [];
			$(formContainerOfEmployee + " .wrap-new .list-emp li label:first-child input[name=sCkEmployee4Select]").each(function() {
				if($(this).parent().parent().find("input[type='radio'][name='fei']").prop("checked")) {//选中的为主
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
	$(formContainerOfEmployee + " .wrap-source .py input").keydown(function(event) {
		if(event.keyCode == 13) {
			event.preventDefault();
			$.ajaxGet(url + $(this).val(), function(response) {
				if(response.code == 0) {
					$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
					//success
					var employeeList = response.data.rows;
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
					$.showErrorGritter("加载联系人失败：" + response.msg);
				}
			});
		}
	});
	//点击换样式
	$(formContainerOfEmployee + " .search-menu").click(function() {
		$(this).addClass("select").siblings().removeClass("select");

	});
	//添加选中人员到右边列表
	$(formContainerOfEmployee + " .btn-add").click(function() {
		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
//		if(option.onlySingle && selectEmpDoms.length > 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
//		}
		selectEmpDoms.each(function() {
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").length>0) return true;
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
		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sCkEmployee4Select]:checked").each(function() {
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
	$.ajaxGet(url, function(response) {
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
			$(formContainerOfEmployee + " .wrap-source .nav-py").empty();
			for(var p in pyArr) {
				if(pyArr[p] == "#") {
					continue;
				}
				$(formContainerOfEmployee + " .wrap-source .nav-py").append("<a>" + pyArr[p] + "</a>");
				if(p == 0) {
					var maxLengthOfACol = parseInt(320 / $(formContainerOfEmployee + " .py a:first-child").outerHeight(true));
					if(pyArr.length >= maxLengthOfACol) $(".wrap-source .nav-py").css("width", "26px");
				}
			}
			$(formContainerOfEmployee + " .wrap-source .nav-py").append("<a>#</a>");
			//click event
			$(formContainerOfEmployee + " .wrap-source .nav-py a").click(function() {
				$(formContainerOfEmployee + " .wrap-source .nav-py a").removeClass("active");
				$(this).addClass("active");
				//initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
				window.location = "#nav-py-" + $(this).text();
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
							liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='sCkEmployee4Select' data-employee-name=\"" + employeeData.contact_name + "\" value=\"" +

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
	//移除已选人员
	window.removeSelected = function(obj) {
		var thisId = $(obj).parents("li").find("input").val();
		$(formContainerOfEmployee + " .wrap-source input[value='" + thisId + "']").removeProp("checked");
		$(obj).parents("li").remove();
		if($(obj).next().find("span").text()=="主负责人"){
			$(formContainerOfEmployee + " .wrap-new li:first-child input[type='radio']").trigger("click");
		}
	}
	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		console.log(employees)
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		for(var i in employees) {
			var employeeData = employees[i];
			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
				continue;
			}
			//拼音首字母
			var firstPY = (employees[i].contact_name_pinyin || "#").substring(0, 1).toUpperCase();
			if($("#nav-py-" + firstPY).length < 1) {
				$(formContainerOfEmployee + " .wrap-source .list-emp").append("<div id='nav-py-" + firstPY + "'>" + firstPY + "</div>");
			}
			if(option.exceptIds && option.exceptIds.indexOf(employeeData.employee_id) >= 0) continue;
			var liDom = $("<li></li>");
			liDom.append("<label><input type=\"checkbox\" class='form-control-radio' first-py='" + firstPY + "' name='ckEmployee4Select' data-employee-name=\"" + employeeData.contact_name + "\" value=\"" + employeeData.contact_id + "\"> <span class='name-css-overhidden css-overhidden'>" +
				employeeData.contact_name + "</span><span class='dept-css-overhidden css-overhidden'>" +
				employeeData.depa_name + "</span><span class='position-css-overhidden css-overhidden'>" + employeeData.contact_positional_titles_cn + "</span>" + "</label>");
			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
			if(option.rightDefaultShowOwn) {
				if(employeeData.is_self) {
					$(formContainerOfEmployee + " .wrap-new .list-emp").html("");
					$(formContainerOfEmployee + " .wrap-new .list-emp").append(liDom);
				}
			}
		}
		$(formContainerOfEmployee+ " .wrap-new input").each(function(){
			$(formContainerOfEmployee+ " .wrap-source input[value='"+$(this).val()+"']").prop("checked","checked");
		});
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
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
			if(!$(this).is(":checked")){
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").parent().parent().remove();
				$(this).removeProp("checked");
				return false;
			}
			$(this).prop("checked","checked");
			var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
			//$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
			selectEmpDoms.each(function() {
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='"+$(this).val()+"']").length>0) return true;
				var selDom = $(this).parent().parent();
				selDom.append("<img class='btn-remove' onclick='removeSelected(this);' src='../resources/images/filter-close.png'/>");
				//selDom.find("input").removeAttr("checked");
				//old
				//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
				var selEmpId = $(this).val();
				if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
					$(formContainerOfEmployee + " .wrap-new .list-emp").append(selDom.clone());
				var checkStr = "<label style='vertical-align: top;' class='setlinkman' onclick='changeSetLinkman(this)'><input type='radio' name='fei' checked='checked'><span>主负责人</span></label>";
				var str = "<label style='vertical-align: top;' class='setlinkman' onclick='changeSetLinkman(this)'><input type='radio' name='fei'><span>设为主负责人</span></label>";
				if($(formContainerOfEmployee + " .wrap-new .list-emp>li").length == 1) {
					$(formContainerOfEmployee + " .wrap-new .list-emp>li:first-child").append(checkStr);
				} else {
					$(formContainerOfEmployee + " .wrap-new .list-emp>li:last-child").append(str);
				}
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type='checkbox']").addClass("hide");
				selDom.find(".btn-remove").remove();
				$(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").attr("name","sCkEmployee4Select");
			});
			$(this).prop("checked","checked");
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
			}
			if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
				$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
			}
		});
	};
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
};

////客户单位选择
//$.showClientEmployeeSelectPop = function(option) {
//	option.onlySingle = (option.onlySingle ? option.onlySingle : false);
//	option.rowNum = option.rowNum || 20;
//	var loadClientUrl = BSAPIURL + "/crm/clients/query?key=";
//	var isAppendEmployeeWrap = $(".pnl-employee-select-common-client").length > 0;
//	if(!isAppendEmployeeWrap) {
//		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-client hide\">" +
//			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-client\">" +
//			"		<div class=\"wrap wrap-source\">" +
//			"			<label class=\"label-sub-title\"></label>" +
//			(!option.onlySingle ?
//				"			<div style='float: right;margin-top:-10px;'>" +
//				"			<a class='btn btn-default btn-sm select-all' style='margin-right: 20px;margin-bottom: 5px;'>全选</a>" +
//				"			<a class='btn btn-default btn-sm cancel-all' style='margin-right: 20px;margin-bottom: 5px;'>取消全选</a>" +
//				"			</div>" : "") +
//			"			<div class=\"box\">" +
//			"				<div class=\"py\">" +
//			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
//			"					<input type=\"text\" class=\"search\" placeholder=\"请输入客户名称进行查找\" style=\"width: 100%;\" />" +
//			"				</div>" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap seg\">" +
//			"			<div class=\"box\">" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>" +
//			"				</p>" +
//			"				<br>" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
//			"				</p>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap wrap-new\">" +
//			"			<label>已选择：</label>" +
//			"			<div class=\"box\">" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class='pagination'></div>" +
//			"	</form>" +
//			"</div>");
//	}
//	var isFirstInitPagination = true;
//	option.title = option.title || "选择员工";
//	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
//	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
//
//	//选择员工
//	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-client",
//		function(modal) {
//			var selectEmployees = [];
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
//				selectEmployees.push($(this).val());
//			});
//			if(selectEmployees.length == 0) {
//				$.showErrorGritter("请先选择人员后再确认。");
//				return false;
//			}
//			if(option.okCallback) {
//				option.okCallback(selectEmployees);
//			}
//			modal.modal("hide");
//		}
//	);
//	//model pop id
//	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
//	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
//
//	//关键字搜索
//	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
//		if(event.keyCode == 13 || isLoad == "all") {
//			var url = loadClientUrl + $(this).val() + "&rows=" + option.rowNum + "&page=" + (option.pageIndex || 1);
//			$.ajaxGet(url, function(response) {
//				if(response.code == 0) {
//					//success
//					var employeeList = response.data.rows;
//					//click event
//					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
//						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
//						$(this).addClass("active");
//						//initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()],response.data.records);
//					});
//					//first load employee
//					initEmployees4SetDeptLeader(employeeList, response.data.records);
//					//已选人员
//					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
//						var selectedEmployeeIdsObj = {};
//						for(var i in option.selectedEmployeeIds) {
//							var empId = option.selectedEmployeeIds[i].client_id || (option.selectedEmployeeIds[i].employee_id || option.selectedEmployeeIds[i]);
//							selectedEmployeeIdsObj[empId] = empId;
//						}
//						defaultCheckedIds(selectedEmployeeIdsObj);
//					}
//				} else {
//					$.showErrorGritter("加载员工列表失败：" + response.msg);
//				}
//			});
//		}
//	});
//	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//	//添加选中人员到右边列表
//	$(formContainerOfEmployee + " .btn-add").click(function() {
//		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
//		if(option.onlySingle && selectEmpDoms.length > 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
//		}
//		selectEmpDoms.each(function() {
//			var selDom = $(this).parent().parent();
//			selDom.find("input").removeAttr("checked");
//			//old
//			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
//			var selEmpId = $(this).val();
//			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0)
//				$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
//		});
//		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
//		}
//	});
//	//移除已选人员
//	$(formContainerOfEmployee + " .btn-remove").click(function() {
//		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sCkEmployee4Select]:checked").each(function() {
//			if(option.onlySingle) {
//				$(this).parent().parent().remove();
//			} else {
//				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
//					var selDom = $(this).parent().parent();
//					selDom.find("input").removeAttr("checked");
//					//selDom.find("label").last().remove();
//					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
//				});
//			}
//		});
//	});
//	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
//		//alert("ss");
//	});
//
//	//展示员工列表
//	var initEmployees4SetDeptLeader = function(employees, allNum) {
//		console.log(arguments)
//		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
//		if(isFirstInitPagination) {
//			//isFirstInitPagination = false;
//			$(formContainerOfEmployee + " .pagination").empty();
//			$(formContainerOfEmployee + " .pagination").pagination({
//				recordCount: allNum || 0, //总记录数
//				pageSize: option.rowNum || 20, //一页记录数
//				naviCount: 2,
//				onPageChange: function(pageIndex) {
//					option.pageIndex = pageIndex;
//					$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//				}
//			});
//		}
//		for(var i in employees) {
//			var employeeData = employees[i];
//			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
//				continue;
//			}
//			var liDom = $("<li></li>");
//			liDom.append("<label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" + employeeData.client_id +
//				"\"><span style='margin-left:10px'>" + employeeData.client_full_name + "</span></label>");
//			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
//		}
//		if(option.onlySingle) {
//			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
//		}
//	};
//	//默认选中
//	function defaultCheckedIds(ids) {
//		$(formContainerOfEmployee + " input").each(function() {
//			if(ids[$(this).val()]) {
//				$(this).prop("checked", "checked");
//			}
//		});
//		$(formContainerOfEmployee + " .btn-add").click();
//	}
//	//全选按钮
//	$(formContainerOfEmployee + " .select-all").click(function() {
//		letAllInputSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//	//全选按钮
//	$(formContainerOfEmployee + " .cancel-all").click(function() {
//		letAllInputCancelSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//};
////选择客户部门、
//$.showDeparmentEmployeeSelectPop = function(option) {
//	option.onlySingle = (option.onlySingle ? option.onlySingle : false);
//	option.rowNum = option.rowNum || 20;
//	var loadClientUrl = BSAPIURL + "/crm/client_depas/query?key=";
//	var isAppendEmployeeWrap = $(".pnl-employee-select-common-deparment").length > 0;
//	if(!isAppendEmployeeWrap) {
//		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-deparment hide\">" +
//			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-deparment\">" +
//			"		<div class=\"wrap wrap-source\">" +
//			"			<label class=\"label-sub-title\"></label>" +
//			(!option.onlySingle ?
//				"			<div style='float: right;margin-top:-10px;'>" +
//				"			<a class='btn btn-default btn-sm select-all' style='margin-right: 20px;margin-bottom: 5px;'>全选</a>" +
//				"			<a class='btn btn-default btn-sm cancel-all' style='margin-right: 20px;margin-bottom: 5px;'>取消全选</a>" +
//				"			</div>" : "") +
//			"			<div class=\"box\">" +
//			"				<div class=\"py\">" +
//			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
//			"					<input type=\"text\" class=\"search\" placeholder=\"请输入客户名称进行查找\" style=\"width: 100%;\" />" +
//			"				</div>" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap seg\">" +
//			"			<div class=\"box\">" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>" +
//			"				</p>" +
//			"				<br>" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
//			"				</p>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap wrap-new\">" +
//			"			<label>已选择：</label>" +
//			"			<div class=\"box\">" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class='pagination'></div>" +
//			"	</form>" +
//			"</div>");
//	}
//	var isFirstInitPagination = true;
//	option.title = option.title || "选择员工";
//	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
//	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
//
//	//选择员工
//	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-deparment",
//		function(modal) {
//			var selectEmployees = [];
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
//				selectEmployees.push($(this).val());
//			});
//			if(selectEmployees.length == 0) {
//				$.showErrorGritter("请先选择人员后再确认。");
//				return false;
//			}
//			if(option.okCallback) {
//				option.okCallback(selectEmployees);
//			}
//			modal.modal("hide");
//		}
//	);
//	//model pop id
//	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
//	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
//	//关键字搜索
//	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
//		if(event.keyCode == 13 || isLoad == "all") {
//			var url = loadClientUrl + $(this).val() + "&rows=" + option.rowNum + "&page=" + (option.pageIndex || 1);
//			//加载员工列表
//			$.ajaxGet(url, function(response) {
//				if(response.code == 0) {
//					//success
//					var employeeList = response.data.rows;
//					//click event
//					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
//						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
//						$(this).addClass("active");
//						//initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
//					});
//					//first load employee
//					initEmployees4SetDeptLeader(employeeList, response.data.records);
//					//已选人员
//					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
//						var selectedEmployeeIdsObj = {};
//						for(var i in option.selectedEmployeeIds) {
//							var empId = option.selectedEmployeeIds[i].dept_id || (option.selectedEmployeeIds[i].depa_id || option.selectedEmployeeIds[i]);
//							selectedEmployeeIdsObj[empId] = empId;
//						}
//						defaultCheckedIds(selectedEmployeeIdsObj);
//					}
//				} else {
//					$.showErrorGritter("加载员工列表失败：" + response.msg);
//				}
//			});
//		}
//	});
//	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//	//添加选中人员到右边列表
//	$(formContainerOfEmployee + " .btn-add").click(function() {
//		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
//		if(option.onlySingle && selectEmpDoms.length > 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
//		}
//		selectEmpDoms.each(function() {
//			var selDom = $(this).parent().parent();
//			selDom.find("input").removeAttr("checked");
//			//old
//			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
//			var selEmpId = $(this).val();
//			var clientName = $(this).parent().parent().parent().prev().children("span").text();
//			var clientId = $(this).parent().parent().parent().parent().attr("id");
//			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0) {
//				var copyStr = option.onlySingle ? selDom.clone() : selDom;
//				var id = $(copyStr).attr("id");
//				$(formContainerOfEmployee + " .wrap-new .list-emp").append(copyStr);
//				$(formContainerOfEmployee + " .wrap-new .list-emp #" + id).append("<span id=" + clientId + ">(" + clientName + ")</span>");
//			}
//		});
//		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
//		}
//	});
//	//移除已选人员
//	$(formContainerOfEmployee + " .btn-remove").click(function() {
//		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sckEmployee4Select]:checked").each(function() {
//			if(option.onlySingle) {
//				$(this).parent().parent().remove();
//			} else {
//				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=sckEmployee4Select]:checked").each(function() {
//					var selDom = $(this).parent().parent();
//					selDom.find("input").removeAttr("checked");
//					//selDom.find("label").last().remove();
//					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
//				});
//			}
//		});
//	});
//
//	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
//		//alert("ss");
//	});
//
//	//展示员工列表
//	var initEmployees4SetDeptLeader = function(employees, allNum) {
//		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
//		if(isFirstInitPagination) {
//			//isFirstInitPagination = false;
//			$(formContainerOfEmployee + " .pagination").empty();
//			$(formContainerOfEmployee + " .pagination").pagination({
//				recordCount: allNum || 0, //总记录数
//				pageSize: option.rowNum || 20, //一页记录数
//				naviCount: 2,
//				onPageChange: function(pageIndex) {
//					option.pageIndex = pageIndex;
//					$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//				}
//			});
//		}
//		for(var i in employees) {
//			var employeeData = employees[i];
//			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
//				continue;
//			}
//			if(employeeData.client_name) {
//				var liDom = $("<li id='" + employeeData.client_id + "' style=\"margin-left:10px\"></li>");
//				liDom.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span style=\"margin-left: 5px;vertical-align: bottom;\">" + employeeData.client_name + "</span></p><ul></ul>")
//				$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
//				if(employeeData.depas && employeeData.depas.length > 0) {
//					for(var j in employeeData.depas) {
//						$("#" + employeeData.client_id + ">ul").append("<li style=\"margin-left:30px\" id='" + employeeData.depas[j].depa_id + "'><label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" + employeeData.depas[j].depa_id +
//							"\"><span style='margin-left:10px'>" + employeeData.depas[j].depa_name + "</span></label></li>");
//					}
//				}
//			}
//
//		}
//		if(option.onlySingle) {
//			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
//		}
//	};
//	//默认选中
//	function defaultCheckedIds(ids) {
//		$(formContainerOfEmployee + " input").each(function() {
//			if(ids[$(this).val()]) {
//				$(this).prop("checked", "checked");
//			}
//		});
//		$(formContainerOfEmployee + " .btn-add").click();
//	}
//	//全选按钮
//	$(formContainerOfEmployee + " .select-all").click(function() {
//		letAllInputSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//	//全选按钮
//	$(formContainerOfEmployee + " .cancel-all").click(function() {
//		letAllInputCancelSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//};
////选择客户联系人----------------------------------------------------------------------------
//$.showLinkmansEmployeeSelectPop = function(option) {
//	option.rowNum = option.rowNum || 20;
//	option.onlySingle = (option.onlySingle ? option.onlySingle : false);
//	var loadClientUrl = BSAPIURL + "/crm/client_contacts/query?key=";
//	var isAppendEmployeeWrap = $(".pnl-employee-select-common-linkmans").length > 0;
//	if(!isAppendEmployeeWrap) {
//		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-linkmans hide\">" +
//			"	<form action=\"\" method=\"post\" class=\"form-horizontal model-leader-info model-employee-select-common model-employee-select-common-linkmans\">" +
//			"		<div class=\"wrap wrap-source\">" +
//			"			<label class=\"label-sub-title\"></label>" +
//			(!option.onlySingle ?
//				"			<div style='float: right;margin-top:-10px;'>" +
//				"			<a class='btn btn-default btn-sm select-all' style='margin-right: 20px;margin-bottom: 5px;'>全选</a>" +
//				"			<a class='btn btn-default btn-sm cancel-all' style='margin-right: 20px;margin-bottom: 5px;'>取消全选</a>" +
//				"			</div>" : "") +
//			"			<div class=\"box\">" +
//			"				<div class=\"py\">" +
//			"<input type=\"text\" name=\"sdfsdf\" style=\"display:none\"/>" +
//			"					<input type=\"text\" class=\"search\" placeholder=\"请输入客户单位进行查找\" style=\"width: 100%;\" />" +
//			"				</div>" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap seg\">" +
//			"			<div class=\"box\">" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-add\"><i class=\"fa fa-arrow-right\"></i></a>" +
//			"				</p>" +
//			"				<br>" +
//			"				<p>" +
//			"					<a href=\"javascript:;\" class=\"btn-remove\"><i class=\"fa fa-arrow-left\"></i></a>" +
//			"				</p>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class=\"wrap wrap-new\">" +
//			"			<label>已选择：</label>" +
//			"			<div class=\"box\">" +
//			"				<ul class=\"list-emp\">" +
//			"				</ul>" +
//			"			</div>" +
//			"		</div>" +
//			"		<div class='pagination'></div>" +
//			"	</form>" +
//			"</div>");
//	}
//	var isFirstInitPagination = true;
//	option.title = option.title || "选择员工";
//	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
//	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
//
//	//选择员工
//	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-linkmans",
//		function(modal) {
//			var selectEmployees = [];
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]").each(function() {
//				selectEmployees.push($(this).val());
//			});
//			if(selectEmployees.length == 0) {
//				$.showErrorGritter("请先选择人员后再确认。");
//				return false;
//			}
//			if(option.okCallback) {
//				option.okCallback(selectEmployees);
//			}
//			modal.modal("hide");
//		}
//	);
//	//model pop id
//	var formContainerOfEmployee = "#" + modalIdOfEmployee + " .model-employee-select-common";
//	$(formContainerOfEmployee + " .label-sub-title").text(option.subTitle);
//	//关键字搜索
//	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
//		if(event.keyCode == 13 || isLoad == "all") {
//			var url = loadClientUrl + $(this).val() + "&rows=" + option.rowNum + "&page=" + (option.pageIndex || 1);
//			//加载员工列表
//			$.ajaxGet(url, function(response) {
//				if(response.code == 0) {
//					//success
//					var employeeList = response.data.rows;
//					//click event
//					$(formContainerOfEmployee + " .wrap-source .py p a").click(function() {
//						$(formContainerOfEmployee + " .wrap-source .py p a").removeClass("active");
//						$(this).addClass("active");
//						//initEmployees4SetDeptLeader(employeesGroupByPY[$(this).text()]);
//					});
//					//first load employee
//					initEmployees4SetDeptLeader(employeeList, response.data.records);
//					//已选人员
//					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
//						var selectedEmployeeIdsObj = {};
//						for(var i in option.selectedEmployeeIds) {
//							var empId = option.selectedEmployeeIds[i].emp_id || (option.selectedEmployeeIds[i].employee_id || option.selectedEmployeeIds[i]);
//							selectedEmployeeIdsObj[empId] = empId;
//						}
//						defaultCheckedIds(selectedEmployeeIdsObj);
//					}
//				} else {
//					$.showErrorGritter("加载员工列表失败：" + response.msg);
//				}
//			});
//		}
//	});
//	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//	//添加选中人员到右边列表
//	$(formContainerOfEmployee + " .btn-add").click(function() {
//		var selectEmpDoms = $(formContainerOfEmployee + " .wrap-source .list-emp input:checked");
//		if(option.onlySingle && selectEmpDoms.length > 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp").empty();
//		}
//		selectEmpDoms.each(function() {
//			var selDom = $(this).parent().parent();
//			selDom.find("input").removeAttr("checked");
//			//old
//			//$(formContainerOfEmployee + " .wrap-new .list-emp").append(option.onlySingle ? selDom.clone() : selDom);
//			var selEmpId = $(this).val();
//			var departName = $(this).parent().parent().parent().prev().children("span").text();
//			var clientName = $(this).parent().parent().parent().parent().parent().prev().children("span").text();
//			if($(formContainerOfEmployee + " .wrap-new .list-emp input[value='" + selEmpId + "']").length == 0) {
//				var copyStr = option.onlySingle ? selDom.clone() : selDom;
//				var id = $(copyStr).attr("id");
//				$(formContainerOfEmployee + " .wrap-new .list-emp").append(copyStr);
//				$(formContainerOfEmployee + " .wrap-new .list-emp #" + id).append("<span class=\"copy-sp\">(" + clientName + "," + departName + ")</span>");
//			}
//		});
//		if($(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:checked").length == 0) {
//			$(formContainerOfEmployee + " .wrap-new .list-emp input[type=radio]:first").attr("checked", "checked");
//		}
//	});
//	//移除已选人员
//	$(formContainerOfEmployee + " .btn-remove").click(function() {
//		$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
//			if(option.onlySingle) {
//				$(this).parent().parent().remove();
//			} else {
//				$(formContainerOfEmployee + " .wrap-new .list-emp input[name=ckEmployee4Select]:checked").each(function() {
//					var selDom = $(this).parent().parent();
//					selDom.find("input").removeAttr("checked");
//					//selDom.find("label").last().remove();
//					$(formContainerOfEmployee + " .wrap-source .list-emp").append(selDom);
//				});
//			}
//		});
//	});
//	// 
//
//	$(formContainerOfEmployee + " .wrap-new .list-emp .setlinkman").click(function() {
//		//alert("ss");
//	});
//
//	//展示员工列表
//	var initEmployees4SetDeptLeader = function(employees, allNum) {
//		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
//		if(isFirstInitPagination) {
//			//isFirstInitPagination = false;
//			$(formContainerOfEmployee + " .pagination").empty();
//			$(formContainerOfEmployee + " .pagination").pagination({
//				recordCount: allNum || 0, //总记录数
//				pageSize: option.rowNum || 20, //一页记录数
//				naviCount: 2,
//				onPageChange: function(pageIndex) {
//					option.pageIndex = pageIndex;
//					$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
//				}
//			});
//		}
//		for(var i in employees) {
//			var employeeData = employees[i];
//			if(option.onlyOpenedAccount && employeeData.employee_has_account == 0) {
//				continue;
//			}
//			var liDom = $("<li id='" + employeeData.client_id + "' style=\"margin-left:10px\"></li>");
//			liDom.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span>" + employeeData.client_name + "</span></p><ul></ul>");
//			$(formContainerOfEmployee + " .wrap-source .list-emp").append(liDom);
//			if(employeeData.depas.length != 0) {
//				for(var j in employeeData.depas) {
//					var liDoms = $("<li id='" + employeeData.depas[j].depa_id + "' style=\"margin-left:30px\"></li>");
//					liDoms.append("<p onclick=\"treeZoom(this)\"><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i><span>" + employeeData.depas[j].depa_name + "</span></p><ul></ul>");
//					$("#" + employeeData.client_id + ">ul").append(liDoms);
//					if(employeeData.depas[j].contacts != 0) {
//						for(var h in employeeData.depas[j].contacts) {
//							$("#" + employeeData.depas[j].depa_id + ">ul").append("<li style=\"margin-left:30px\" id='" + employeeData.depas[j].contacts[h].contact_id +
//								"'><label><input type=\"checkbox\" class='form-control-radio' name='ckEmployee4Select' value=\"" +
//								employeeData.depas[j].contacts[h].contact_id +
//								"\"><span style='margin-left:10px'>" + employeeData.depas[j].contacts[h].contact_name + "</span></label></li>");
//						}
//					}
//
//				}
//			}
//
//		}
//		if(option.onlySingle) {
//			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
//		}
//	};
//	//默认选中
//	function defaultCheckedIds(ids) {
//		$(formContainerOfEmployee + " input").each(function() {
//			if(ids[$(this).val()]) {
//				$(this).prop("checked", "checked");
//			}
//		});
//		$(formContainerOfEmployee + " .btn-add").click();
//	}
//	//全选按钮
//	$(formContainerOfEmployee + " .select-all").click(function() {
//		letAllInputSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//	//全选按钮
//	$(formContainerOfEmployee + " .cancel-all").click(function() {
//		letAllInputCancelSelect($(formContainerOfEmployee + " .list-emp"));
//	});
//};
//选择员工（树状）----------------------------------------------------------------------------
$.showTreeEmployeeSelectPop = function(option) {
	console.log(arguments)
	var loadClientUrl = BSAPIURL + "/location/employees" + (option.isAll ? "" : "/sub") + "?key=";
	//option.isShowEmptyDepar = (option.isShowEmptyDepar == "" ? true : option.isShowEmptyDepar);
	var isAppendEmployeeWrap = $(".pnl-employee-select-common-linkmans").length > 0;
	if(!isAppendEmployeeWrap) {
		$("body").append("<div class=\"pnl-leader-info pnl-employee-select-common pnl-employee-select-common-linkmans hide\">" +
			"	<form class=\"form-horizontal model-leader-info model-employee-select-common-linkmans model-employee-select-common\">" +
			"		<div class=\"wrap wrap-source\">" +
			"			<label class=\"label-sub-title\"></label>" +
			"			<div class=\"py\">" +
			"				<input type=\"text\" class=\"search\" placeholder=\"可输入“ZS”或“张三”查找\" style=\"width: 100%;\" />" +
			//				"				<p class='nav-py'>" +
			//				"					<a class=\"active\">A</a>" +
			//				"				</p>" +
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
	option.title = option.title || "选择员工";
	option.onlyOpenedAccount = option.onlyOpenedAccount == undefined ? true : option.onlyOpenedAccount;
	option.onlySingle = option.onlySingle == undefined ? false : option.onlySingle;
	//选择员工
	var modalIdOfEmployee = $.modal().showOfLarge(option.title, ".pnl-employee-select-common-linkmans",
		function(modal) {
			var selectEmployees = [];
			$(formContainerOfEmployee + " .wrap-new .box .selected-emp").each(function() {
				selectEmployees.push({
					"id": $(this).attr("data-id"),
					"name": $(this).find(".css-overhidden").text(),
					"emp": (option.isReturnEmp ? $(this).data("empData") : "")
				});
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
	//移除全部
	$(formContainerOfEmployee + " .delete-all").click(function() {
		$(formContainerOfEmployee + " .wrap-new .box").empty();
		$(formContainerOfEmployee + " .wrap-source .list-emp input").removeProp("checked");
	});
	//关键字搜索
	$(formContainerOfEmployee + " .wrap-source .py .search").keydown(function(event, isLoad) {
		if(event.keyCode == 13 || isLoad == "all") {
			event.preventDefault();
			var url = loadClientUrl + $(this).val();
			//加载员工列表
			$.ajaxGet(url, function(response) {
				if(response.code == 0) {
					//success
					var employeeList = response.data;
					//first load employee
					initEmployees4SetDeptLeader(employeeList);
					$(formContainerOfEmployee + " li img[area-hidden]").unbind("click").click(function() {
						if($(this).attr("area-hidden") == "false") {
							$(this).attr("area-hidden", true);
							$(this).parent().find(">li").slideUp();
						} else {
							$(this).attr("area-hidden", false);
							$(this).parent().find(">li").slideDown();
						}
						transImgSrc(this);
					});
					//添加选中人员到右边列表
					$(formContainerOfEmployee + " .wrap-source .list-emp label input").unbind("change").change(function(e) {
						var str = "<span class=\"selected-emp close-icon-container\" data-type=\"{TYPE}\" data-id=\"{ID}\"><span class=\"css-overhidden\">{NAME}</span>{HINT}<img class=\"close-icon\" src=\"../resources/images/item-close-black-icon.png\" data-trans-src=\"../resources/images/item-close-red-icon.png\"></span>";
						var hintStr = "<i class=\"unwork\" style=\"color:#fff;margin-left:5px\">（不包含不考勤及非工作人员）</i>";
						if($(this).is(":checked")) {
							str = str.replace("{ID}", $(this).val()).replace("{NAME}", $(this).next().text()).replace("{TYPE}", $(this).parents("li").eq(0).data("type"))
								.replace("{HINT}", queryIsView($(this).val()) ? hintStr : "");
							var empData = loadDeparEmp($(this).val());
							$(formContainerOfEmployee + " .wrap-new .box").append(str);
							$(formContainerOfEmployee + " .wrap-new .box>span[data-id=\"" + $(this).val() + "\"]").data("empData", empData);
						} else {
							$(formContainerOfEmployee + " .wrap-new .box span[data-id=" + $(this).val() + "]").remove();
						}
						bindClickDelete();
					});
					//已选人员
					if(option.selectedEmployeeIds && option.selectedEmployeeIds.length > 0) {
						var selectedEmployeeIdsObj = {};
						for(var i = 0; i < option.selectedEmployeeIds.length; i++) {
							var empId = option.selectedEmployeeIds[i].emp_id || (option.selectedEmployeeIds[i].employee_id || option.selectedEmployeeIds[i].id || option.selectedEmployeeIds[i]);
							console.log(empId)
							$(formContainerOfEmployee + " .wrap-source input[value=" + empId + "]").trigger("click");
							//selectedEmployeeIdsObj[empId] = empId;
						}
						//defaultCheckedIds(selectedEmployeeIdsObj);
					}
					if(!option.isShowEmptyDepar)
						hideEmptyDepar();
				} else {
					$.showErrorGritter("加载员工列表失败：" + response.msg);
				}
			});
		}
	});
	$(formContainerOfEmployee + " .wrap-source .py .search").trigger("keydown", ["all"]);
	//判断右边是否已存在
	function hasSelect(id) {
		var hasSel = false;
		$(formContainerOfEmployee + " .wrap-new .box>span").each(function() {
			if($(this).data("id") == id) {
				hasSel = true;
			}
		});
		return hasSel;
	}

	function queryIsView(id) { //判断是否存在不考勤或非工作人员
		var parentDom = $(formContainerOfEmployee + " .wrap-source li[id=" + id + "]");
		var returnBoolea = false;
		parentDom.find("input").each(function(i) {
			if($(this).attr("disabled")) {
				returnBoolea = true;
				return false;
			}
		});
		return returnBoolea;
	}

	function bindClickDelete() { //绑定点击删除事件
		$(formContainerOfEmployee + " .wrap-new .close-icon").unbind("click").click(function() {
			var id = $(this).parent().data("id");
			$(formContainerOfEmployee + " .wrap-source input[value=" + id + "]").trigger("click");
			//$(this).parent().remove();
		});
	}
	//展示员工列表
	var initEmployees4SetDeptLeader = function(employees) {
		$(formContainerOfEmployee + " .wrap-source .list-emp").empty();
		showLower(employees, $(formContainerOfEmployee + " .wrap-source .list-emp"), "depar");
		$(formContainerOfEmployee+ " .wrap-new input").each(function(){
			$(formContainerOfEmployee+ " .wrap-source input[value='"+$(this).val()+"']").prop("checked","checked");
		});
		if(option.onlySingle) {
			$(formContainerOfEmployee + " .wrap-source .list-emp input[type='checkbox']").attr("type", "radio");
		}

		bindClickDelete();
	};
	//加载下级
	function showLower(data, container, type) {
		var explainUnworkStr = "<span class=\"explain unwork\">非工作时间</span>";
		var explainUnattendanceStr = "<span class=\"explain unattendance\">不考勤</span>";
		var disabled = "disabled='disabled'";
		var deparStr =
			"<li id=\"{ID}\" data-type=\"1\" style=\"margin-left:10px;\">" +
			"<img src='../resources/images/minus-o-icon.png' area-hidden='false' data-trans-src='../resources/images/plus-o-icon.png' />" +
			"<label><input type='checkbox' value='{ID}'/>" +
			"<span class=\"select\">{NAME}</span></label></li>";
		var employeeStr = "<li id=\"{ID}\" data-type=\"2\">" +
			"<label><input type='checkbox' value='{ID}' {DIS} />" +
			"<span class=\"select\">{NAME}</span></label>{STATE}</li>";
		for(var i in data)
			if(type == "depar") {
				container.append(deparStr.replace(/\{ID\}/g, data[i].depa_id).replace("{NAME}", data[i].depa_name));
				if(data[i].depas) {
					showLower(data[i].depas, $(formContainerOfEmployee + " #" + data[i].depa_id + ""), "depar");
				}
				if(data[i].employees) {
					showLower(data[i].employees, $(formContainerOfEmployee + " #" + data[i].depa_id + ""), "employees");
				}
			} else {
				var stateStr = (data[i].is_worktime ? "" : explainUnworkStr) + (data[i].is_not_attendance ? explainUnattendanceStr : "");
				container.append(employeeStr.replace(/\{ID\}/g, data[i].employee_id).replace("{NAME}", data[i].employee_name).replace("{STATE}", stateStr)
					.replace("{DIS}", stateStr ? disabled : ""));
			}

	}

	function loadDeparEmp(deparId) { //获取部门下级员工信息
		var empData = [];
		if($("#" + deparId + "").data("type") == "2") {
			empData.push(deparId);
			return empData;
		}
		$("#" + deparId + " li[data-type='2']").each(function(i) {
			if($(this).children("label").children("input").attr("disabled")) {
				return true;
			}
			empData.push($(this).attr("id"));
		});
		return empData;
	}

	function hideEmptyDepar() { //隐藏没有员工的部门
		$(formContainerOfEmployee + " .wrap-source li").each(function(i) {
			if($(this).find("li[data-type='2']").length == 0 && $(this).attr("data-type") == "1") $(this).remove();
		});
	}
	//默认选中
	function defaultCheckedIds(ids) {
		$(formContainerOfEmployee + " input").each(function() {
			if(ids[$(this).val()]) {
				$(this).prop("checked", "checked");
			}
		});
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
function treeZoom(obj, type) {
	if(type == "eml") {
		if($(obj).hasClass("fa-caret-down")) {
			$(obj).removeClass("fa-caret-down").addClass("fa-caret-right");
			$(obj).nextAll("ul").slideUp();
		} else {
			$(obj).removeClass("fa-caret-right").addClass("fa-caret-down");
			$(obj).nextAll("ul").slideDown();
		}
	} else {
		if($(obj).children("i").hasClass("fa-caret-down")) {
			$(obj).children("i").removeClass("fa-caret-down").addClass("fa-caret-right");
			$(obj).next().slideUp();
		} else {
			$(obj).children("i").removeClass("fa-caret-right").addClass("fa-caret-down");
			$(obj).next().slideDown();
		}
	}
}