//查看签到，签退照片
function openAttendancePhotosPop(signinImg, signoutImg) {
	console.log(arguments)
	if(!signinImg && !signoutImg) {
		return false;
	}
	var isAppendCurrPopWrap = $(".pnl-attendance-photos-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-attendance-photos-common hide\">" +
			"	<form class=\"form-horizontal model-attendance-photos-common\">" +
			"		<div class=\"form-group form-inline form-group-signin\">" +
			"			<label>签到照片</label>" +
			"			<div class=\"form-control form-control-noborder form-control-height-auto\">" +
			"				<a class='link-signin' target='_blank' title='点击查看大图'><img class='img-signin' width=\"450px\" style='width:450px;height:250px;' /></a>" +
			"			</div>" +
			"		</div>" +
			"		<div class=\"form-group form-inline form-group-signout\">" +
			"			<label>签退照片</label>" +
			"			<div class=\"form-control form-control-noborder form-control-height-auto\">" +
			"				<a class='link-signout' target='_blank' title='点击查看大图'><img class='img-signout' width=\"450px\" style='width:450px;height:250px;' /></a>" +
			"			</div>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).show("考勤照片", ".pnl-attendance-photos-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-attendance-photos-common";
	$(formContainer + " .form-group-signin").show();
	$(formContainer + " .form-group-signout").show();
	if(!signinImg) {
		$(formContainer + " .form-group-signin").hide();
	} else {
		if(signinImg.indexOf("http") == -1) {
			signinImg = signinImg;
		}
	}
	if(!signoutImg) {
		$(formContainer + " .form-group-signout").hide();
	} else {
		if(signoutImg.indexOf("http") == -1) {
			signoutImg = signoutImg;
		}
	}

	$(formContainer + " .img-signin").attr("src", signinImg);
	$(formContainer + " .img-signout").attr("src", signoutImg);
	$(formContainer + " .link-signin").attr("href", signinImg);
	$(formContainer + " .link-signout").attr("href", signoutImg);
}
//查看请假的图片凭证
function openLeavePhotosPop(imgs) {
	var isAppendCurrPopWrap = $(".pnl-leave-photos-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-leave-photos-common hide\">" +
			"	<div class=\"model-leave-photos-common\">" +
			"		<div class=\"list-imgs\">" +
			"			<div class='item'><img ></div>" +
			"		</div>" +
			"	</div>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).show("查看图片", ".pnl-leave-photos-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-leave-photos-common";
	var imgDom = $(formContainer + " .list-imgs");
	imgDom.empty();
	try {
		var imgArr = imgs.split(",");
	} catch(e) {
		var imgArr = imgs;
	}
	for(var i in imgArr) {
		if(imgArr[i]) imgDom.append("<div class='item'><img src='" + imgArr[i] + "' ></div>");
	}
}

//查看请假记录 type:1-按月;2-按天    
function openLeaveRecordsPop(type, date, empId, empOrDepa) {
	var isAppendCurrPopWrap = $(".pnl-leave-records-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-leave-records-common hide\">" +
			"	<form class=\"form-horizontal model-leave-records-common\">" +
			"		<table class=\"table table-bordered\">" +
			"			<tr>" +
			"				<th>申请日期</th>" +
			//"				<th>工作状态</th>" +
			"				<th>请假类型</th>" +
			"				<th>开始时间</th>" +
			"				<th>请假时长</th>" +
			"				<th>结束时间</th>" +
			"				<th>请假事由</th>" +
			"				<th>工作接手人</th>" +
			"				<th>销假次数</th>" +
			"				<th>图片</th>" +
			"			</tr>" +
			"		</table>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).showOfAuto("请假记录", ".pnl-leave-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-leave-records-common";
	//按月
	var url = BSAPIURL + "/center_attendances/leaves_by_month";
	//按天
	if(type == 2) {
		url = BSAPIURL + "/center_attendances/leaves_by_day";
	}
	$.ajaxGet(url + $.toQueryString({
		attendance_date: date,
		employee_id: empId
	}, true), function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		if(response.data.rows.length == 0) {
			$(formContainer + " table").replaceWith("<p>暂无请假记录</p>")
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			var workReciperArr = [];
			for(var i in rowData.takeover_employees) {
				workReciperArr.push(rowData.takeover_employees[i].employee_name);
			}
			$(formContainer + " table").append("<tr>" +
				(empOrDepa == 2 ?
					"				<td>" + rowData.depa_name + "</td>" +
					"				<td>" + rowData.emp_name + "</td>" : ""
				) +
				"				<td type=1>" + rowData.leave_begin_date + " (" + rowData.leave_week_cn + ")</td>" +
				//"				<td type=1>上午：" + (rowData.attendance_work_status_of_am_cn || "") + "   <br>下午：" + (rowData.attendance_work_status_of_pm_cn || "") + "</td>" +
				"				<td>" + rowData.leave_type_code_cn + "</td>" +
				"				<td>" + (rowData.leave_begin_date + " " + (rowData.leave_begin_slot_cn || "")) + "</td>" +
				"				<td>" + (rowData.leave_limit + " 天" + (rowData.except_holidays != "0" ? "<span class='sign'>（节假日除外）</span>" : "")) + "</td>" +
				"				<td>" + (rowData.leave_end_date + " " + (rowData.leave_end_slot_cn || "")) + "</td>" +
				"				<td style='word-break: break-all;max-width:300px;'>" + (rowData.leave_desc || "-") + "</td>" +
				"				<td style='word-break: break-all;max-width:300px;'>" + (workReciperArr.join("、") || "-") + "</td>" +
				"				<td>" + (rowData.cancels && rowData.cancels.length != 0 ? "<a class='cancels-" + i + "' href='javascript:;' onclick=\"viewCancelsLeave('',this);\">" + rowData.cancels.length + "</a> " : "0") + "</td>" +
				"				<td>" + (rowData.leave_pictures && rowData.leave_pictures.length > 0 ? "<a href=\"javascript:;\" onclick=\"openLeavePhotosPop('" + rowData.leave_pictures + "');\">查看图片</a>" : "无") + "</td>" +
				"			</tr>");
			$(formContainer + " .cancels-" + i).data("cancels-arr", rowData.cancels || "");
		}
		var adcType = $.getQueryObject(url).type;
		//按员工统计时
		if(adcType == 1) {
			//$(formContainer + " table").find("[type=1]").remove();
		}
	});
}

//查看加班记录 type:1-按月;2-按天     
function openOvertimeRecordsPop(type, date, empId, empOrDepa) {
	var isAppendCurrPopWrap = $(".pnl-overtime-records-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-overtime-records-common hide\">" +
			"	<form class=\"form-horizontal model-overtime-records-common\">" +
			"		<table class=\"table table-bordered\">" +
			"			<tr>" +

			"				<th>日期</th>" +
			"				<th>工作状态</th>" +
			"				<th>加班主题</th>" +
			"				<th width='8%'>预估加班时长（小时）</th>" +
			"				<th width='16%'>加班事由</th>" +
			"				<th>加班人员名单</th>" +
			"				<th>实际签到时间</th>" +
			"				<th>实际签退时间</th>" +
			"				<th>加班类型</th>" +
			"				<th width='7%'>实际时长（小时）</th>" +
			"				<th>照片</th>" +
			"			</tr>" +
			"		</table>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭",
		width: 1200
	}).showOfLarge("加班记录", ".pnl-overtime-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-overtime-records-common";
	//按月
	var url = BSAPIURL + "/center_attendances/overtimes_by_month";
	//按天
	if(type == 2) {
		url = BSAPIURL + "/center_attendances/overtimes_by_day";
	}
	$.ajaxGet(url + $.toQueryString({
		attendance_date: date,
		employee_id: empId
	}, true), function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			var overTimeTypeStr = "";
			/*for(var j in rowData.overtime) {
				if(j != rowData.overtime.length - 1) {
					overTimeTypeStr += rowData.overtime[j].overtime_type + "+";
				} else {
					overTimeTypeStr += rowData.overtime[j].overtime_type;
				}
			}*/
			overTimeTypeStr += "上午：" /*+rowData.overtime.am.overtime_type*/ + "<br>下午：" /*+rowData.overtime.pm.overtime_type*/ ;
			var overTimeStaffStr = "";
			for(var j in rowData.overtime_employees) {
				if(j != rowData.overtime_employees.length - 1) {
					overTimeStaffStr += rowData.overtime_employees[j].employee_name + ",";
				} else {
					overTimeStaffStr += rowData.overtime_employees[j].employee_name;
				}
			}
			var overTimeTypeStr = "",
				overTimeLimitStr = "";
			for(var j in rowData.overtime) {
				overTimeTypeStr += "<p class=\"overtime-list\">" + rowData.overtime[j].overtime_type + "</p>";
				overTimeLimitStr += "<p class=\"overtime-list\">" + rowData.overtime[j].overtime_limit + "</p>";
			}
			var hasPicture = rowData.attendance_in_picture || rowData.attendance_out_picture;
			$(formContainer + " table").append("<tr>" +
				"<td>" + rowData.overtime_date + "</td>" +
				"<td>上午：" + rowData.attendance_work_status_of_am_cn + "   <br>下午：" + rowData.attendance_work_status_of_pm_cn + "</td>" +
				"<td>" + rowData.overtime_title + "</td>" + //加班主题
				"<td>" + rowData.overtime_limit + "</td>" + //加班预计时长
				"<td>" + rowData.overtime_desc + "</td>" + //加班事由
				"<td style=\"width:20%\">" + overTimeStaffStr + "</td>" + //加班人员
				"<td>" + rowData.attendance_in_time + "</td>" + //加班实际签到时间
				"<td>" + (rowData.attendance_out_time + isSecondDayAdcOut(rowData.overtime_date, rowData.attendance_out_timestamp)) + "</td>" + //加班实际签退时间
				"<td style=\"padding:0\">" + overTimeTypeStr + "</td>" + //加班类型
				"<td style=\"padding:0\">" + overTimeLimitStr + "</td>" +
				"<td>" + (hasPicture ? "<a href=\"javascript:;\" onclick=\"openAttendancePhotosPop('" + rowData.attendance_in_picture + "','" + rowData.attendance_out_picture + "');\">查看图片</a>" : "无") + "</td>" +
				"			</tr>");
		}
		var adcType = $.getQueryObject(url).type;
	});
}

//查看考勤记录 (1-半天旷工,2-旷工一天,3-出差,4-正常签到,5-迟到,6-正常签退,7-早退,8-未签)
function openAttendanceRecordsPop(url, status) {
	$(".pnl-attendance-records-common").remove();
	var isAppendCurrPopWrap = $(".pnl-attendance-records-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-attendance-records-common hide\">" +
			"	<form class=\"form-horizontal model-attendance-records-common\">" +
			"		<table class=\"table table-bordered\">" +
			"			<tr>" +
			"				<th type=1>部门</th>" +
			"				<th type=1>姓名</th>" +
			"				<th>日期</th>" +
			"				<th>工作状态</th>" +
			"				<th>考勤类型</th>" +
			(status == 8 ? "" : "<th>考勤时间</th>") +
			"				<th>考勤结果</th>" +
			"			</tr>" +
			"		</table>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).showOfLarge("考勤记录", ".pnl-attendance-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-attendance-records-common";
	$.ajaxGet(url, function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			$(formContainer + " table").append("<tr>" +
				"				<td type=1>" + rowData.depa_name + "</td>" +
				"				<td type=1>" + rowData.employee_name + "</td>" +
				"				<td>" + rowData.attendance_date + "</td>" +
				"				<td>上午：" + rowData.attendance_work_status_of_am + "</br>下午：" + rowData.attendance_work_status_of_pm + "</td>" +
				"				<td>" + ((rowData.attendance_in_type ? (rowData.attendance_in_type) : "") + (rowData.attendance_out_type ? ("<br>" + rowData.attendance_out_type) : "")) + "</td>" +
				(status == 8 ? "" :
					"<td>" + ((rowData.attendance_in_type ? rowData.attendance_in_time : "") +
						(rowData.attendance_out_type ? "<br>" + rowData.attendance_out_time + isSecondDayAdcOut(rowData.attendance_date, rowData.attendance_out_timestamp) : "")) +
					"</td>") +
				"				<td>" + ((rowData.attendance_in_type ? (rowData.attendance_in_status) : "") + (rowData.attendance_out_type ? ("</br>" + rowData.attendance_out_status) : "")) + "</td>" +
				"			</tr>");
		}
		var adcType = $.getQueryObject(url).type;
		//按员工统计时
		if(adcType == 1) {
			$(formContainer + " table").find("[type=1]").remove();
		}
	});
}
//员工签到详情
function openEmployeeSigninRecordsPop(dateStart, dateEnd, empId, signinTime) {
	var isAppendCurrPopWrap = $(".pnl-attendance-signin-records-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-attendance-signin-records-common hide\">" +
			"	<form class=\"form-horizontal model-attendance-signin-records-common\">" +
			"		<table class=\"table table-bordered\">" +
			"			<tr>" +
			"				<th>日期</th>" +
			"				<th>工作状态</th>" +
			"				<th>考勤类型</th>" +
			"				<th>考勤时间</th>" +
			"				<th>考勤结果</th>" +
			"				<th>照片</th>" +
			"			</tr>" +
			"		</table>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).showOfLarge("考勤记录", ".pnl-attendance-signin-records-common",
		function(modal) {

		}
	);
	/*if(dateEnd){
		dateEnd=dateStart;
	}*/
	//model pop id
	var formContainer = "#" + modalId + " .model-attendance-signin-records-common";
	var url = BSAPIURL + "/center_attendances/attendance_in_by_employee";
	$.ajaxGet(url + $.toQueryString({
		attendance_begin_date: dateStart,
		attendance_end_date: dateEnd || dateStart,
		employee_id: empId,
		in_time: signinTime
	}, true), function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			//签到图片
			var siginImgDom = "-";
			if(rowData.attendance_in_picture) {
				siginImgDom = "<a href=\"javascript:;\" onclick=\"openAttendancePhotosPop('" + rowData.attendance_in_picture + "');\">查看图片</a>";
			}
			$(formContainer + " table").append("<tr>" +
				"				<td>" + rowData.attendance_date + "</td>" +
				"				<td>上午：" + rowData.attendance_work_status_of_am_cn + "&nbsp;&nbsp;&nbsp;&nbsp;下午：" + rowData.attendance_work_status_of_pm_cn + "</td>" +
				"				<td>签到</td>" +
				"				<td>" + (rowData.attendance_in_time || "-") + "</td>" +
				"				<td>" + rowData.attendance_in_status_cn + "</td>" +
				"				<td>" + siginImgDom + "</td>" +
				"			</tr>");
		}
		var adcType = $.getQueryObject(url).type;
	});
}

////员工考勤汇总
//查看请假记录 withLower:是否包含下属部门   统计类型：empOrDepa：1-emp或不传；2-depa
function openAdcTotalLeaveRecordsPop(withLower, adcDateBegain, adcDateEnd, id, empOrDepa) {
	var isAppendCurrPopWrap = $(".pnl-leave-records-common").length > 0;
	var leaveRecordsPopDom = "<div class=\"pnl-leave-records-common hide\">" +
		"	<form class=\"form-horizontal model-leave-records-common\">" +
		"		<table class=\"table table-bordered\">" +
		"			<tr>" +
		(empOrDepa == 2 ?
			("				<th>部门</th>" +
				"				<th>姓名</th>") : ""
		) +
		"				<th>申请日期</th>" +
		//"				<th>工作状态</th>" +
		"				<th>请假类型</th>" +
		"				<th>开始时间</th>" +
		"				<th>请假时长</th>" +
		"				<th>结束时间</th>" +
		"				<th>销假次数</th>" +
		"				<th>请假事由</th>" +
		"				<th>工作接手人</th>" +
		"				<th>图片</th>" +
		"			</tr>" +
		"		</table>" +
		"	</form>" +
		"</div>";
	if(!isAppendCurrPopWrap) {
		$("body").append(leaveRecordsPopDom);
	} else {
		$("body .pnl-leave-records-common").replaceWith(leaveRecordsPopDom);
	}
	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).showOfAuto("请假记录", ".pnl-leave-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-leave-records-common";
	var url = BSAPIURL + "/center_attendances/leaves_by_month?attendance_begin_date=" + adcDateBegain + "&attendance_end_date=" + adcDateEnd;
	if(empOrDepa == 1) {
		url += "&employee_id=" + id;
	} else {
		url += "&depa_id=" + id;
	}
	$.ajaxGet(url + "&with_lowers=" + withLower, function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			var workReciperArr = [];
			for(var n in rowData.takeover_employees) {
				workReciperArr.push(rowData.takeover_employees[n].employee_name);
			}
			$(formContainer + " table").append("<tr>" +
				(empOrDepa == 2 ?
					("				<td>" + rowData.depa_name + "</td>" +
						"				<td>" + rowData.employee_name + "</td>") : ""
				) +
				"				<td type=1>" + rowData.leave_add_time_cn + " <br>(" + rowData.leave_week_cn + ")</td>" +
				//"				<td type=1>上午：" + (rowData.attendance_work_status_of_am_cn || "") + "   <br>下午：" + (rowData.attendance_work_status_of_pm_cn || "") + "</td>" +
				"				<td>" + rowData.leave_type_code_cn + "</td>" +
				"				<td>" + (rowData.leave_begin_date + "<br>" + rowData.leave_begin_slot_cn) + "</td>" +
				"				<td>" + rowData.leave_limit + " 天</td>" +
				"				<td>" + (rowData.leave_end_date + "<br>" + rowData.leave_end_slot_cn) + "</td>" +
				"				<td>" + (rowData.cancels && rowData.cancels.length != 0 ? "<a class='cancels-" + i + "' href='javascript:;' onclick=\"viewCancelsLeave('',this);\">" + rowData.cancels.length + "</a> " : "0") + "</td>" +
				"				<td><span class='leave-or-overtime-reason'>" + (rowData.leave_desc || "") + "</span></td>" +
				"				<td><span class='work-reciper'>" + (workReciperArr.length > 0 ? workReciperArr.join(",") : "无") + "</span></td>" +
				"				<td>" + (rowData.leave_pictures && rowData.leave_pictures.length > 0 ? "<a href=\"javascript:;\" onclick=\"openLeavePhotosPop('" + rowData.leave_pictures + "');\">查看图片</a>" : "无") + "</td>" +
				"			</tr>");
			console.log(rowData.cancels)
			$(formContainer + " .cancels-" + i).data("cancels-arr", rowData.cancels || "");
		}
		alert("")
		$.zoom({
			container: $(formContainer + " .leave-or-overtime-reason"),
			height: 200,
			firstState: 0
		});
		var adcType = $.getQueryObject(url).type;
		//按员工统计时
		if(adcType == 1) {
			//$(formContainer + " table").find("[type=1]").remove();
		}
	});
}

//查看加班记录 type:1-部门;2-员工  统计类型：empOrDepa：1-emp或不传；2-depa
function openAdcTotalOvertimeRecordsPop(withLower, adcDateBegain, adcDateEnd, id, empOrDepa) {
	var isAppendCurrPopWrap = $(".pnl-overtime-records-common").length > 0;
	var overtimeRecordsPopDom = "<div class=\"pnl-overtime-records-common hide\">" +
		"	<form class=\"form-horizontal model-overtime-records-common\">" +
		"		<table class=\"table table-bordered\">" +
		"			<tr>" +
		(empOrDepa == 2 ?
			("				<th>部门</th>" +
				"				<th>姓名</th>") : ""
		) +
		"				<th>日期</th>" +
		"				<th>工作状态</th>" +
		"				<th>加班主题</th>" +
		"				<th style='width: 89px;'>预估加班时长（小时）</th>" +
		"				<th>加班事由</th>" +
		"				<th>加班人员名单</th>" +
		"				<th>实际签到时间</th>" +
		"				<th>实际签退时间</th>" +
		"				<th>加班类型</th>" +
		"				<th>实际时长（小时）</th>" +
		"				<th>照片</th>" +
		"			</tr>" +
		"		</table>" +
		"	</form>" +
		"</div>"
	if(!isAppendCurrPopWrap) {
		$("body").append(overtimeRecordsPopDom);
	} else {
		$("body .pnl-overtime-records-common").replaceWith(overtimeRecordsPopDom);
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭",
		width: 1200
	}).showOfLarge("加班记录", ".pnl-overtime-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-overtime-records-common";
	url = BSAPIURL + "/center_attendances/overtimes_by_month?attendance_begin_date=" + adcDateBegain + "&attendance_end_date=" + adcDateEnd;
	if(empOrDepa == 1) {
		url += "&employee_id=" + id;
	} else {
		url += "&depa_id=" + id;
	}
	$.ajaxGet(url + "&with_lowers=" + withLower, function(response) {
		console.log(response);
		if(response.code != 0) {
			$.showErrorGritter("加载考勤信息失败：" + response.msg)
			return false;
		}
		for(var i in response.data.rows) {
			var rowData = response.data.rows[i];
			var overTimeTypeStr = "",
				overTimeLimitStr = "";
			for(var j in rowData.overtime) {
				if(j != rowData.overtime.length - 1) {
					overTimeTypeStr += rowData.overtime[j].overtime_type + "<br>";
					overTimeLimitStr += rowData.overtime[j].overtime_limit + "<br>";
				} else {
					overTimeTypeStr += rowData.overtime[j].overtime_type;
					overTimeLimitStr += rowData.overtime[j].overtime_limit;
				}
			}
			//overTimeTypeStr += "上午：" /*+rowData.overtime.am.overtime_type*/ + "<br>下午：" /*+rowData.overtime.pm.overtime_type*/ ;
			var hasPicture = rowData.attendance_in_picture || rowData.attendance_out_picture;
			var overTimeEmps = [];
			for(var e in rowData.employees) {
				overTimeEmps.push(rowData.employees[e].employee_name);
			}
			$(formContainer + " table").append("<tr>" +
				(empOrDepa == 2 ?
					("<td>" + rowData.depa_name + "</td>" +
						"<td>" + rowData.employee_name + "</td>") : ""
				) +
				"<td>" + rowData.overtime_date + "<br>" + rowData.overtime_week_cn + "</td>" +
				"<td>上午：" + (rowData.attendance_work_status_of_am_cn || "") + "   <br>下午：" + (rowData.attendance_work_status_of_pm_cn || "") + "</td>" +
				"<td>" + (rowData.overtime_title || "") + "</td>" +
				"<td>" + (rowData.overtime_limit || "") + "</td>" +
				"				<td type=1>" + (rowData.overtime_desc || "") + "</td>" +
				"				<td type=1>" + (overTimeEmps.length > 0 ? overTimeEmps.join(",") : "") + "</td>" +
				"				<td>" + (rowData.attendance_in_time || "") + "</td>" +
				"				<td>" + (rowData.attendance_out_time + isSecondDayAdcOut(rowData.overtime_date, rowData.attendance_out_timestamp) || "") + "</td>" +
				"				<td>" + (overTimeTypeStr || "") + "</td>" +
				"				<td>" + (overTimeLimitStr || "") + "</td>" +
				"				<td>" + (hasPicture ? "<a href=\"javascript:;\" onclick=\"openAttendancePhotosPop('" + rowData.attendance_in_picture + "','" + rowData.attendance_out_picture + "');\">查看图片</a>" : "无") + "</td>" +
				"			</tr>");
		}
		var adcType = $.getQueryObject(url).type;
	});
}
//判断是否是第二日签退
function isSecondDayAdcOut(adcDate, adcOutTime) {
	console.log()
	if(!adcOutTime) return "";
	if(new Date(changeDate(adcOutTime).replace(/-/g, "/")).Format("yyyy-MM-dd") == new Date(adcDate.replace(/-/g, "/")).Format("yyyy-MM-dd")) return "";
	else return "次日";
}

function viewCancelsLeave(data, obj) {
	if(!data) data = $(obj).data("cancels-arr");
	if($(".view-cancels-leave").length == 0) {
		var str = "<div class=\"view-cancels-leave hide\">";
		str += "<p class=\"view-cancels-leave-top\">";
		str += "<a href=\"javascript:;\" class=\"list-last\">上一个</a>";
		str += "<a href=\"javascript:;\" class=\"list-next\">下一个</a>";
		str += "</p>";
		str += "<div class=\"view-cancels-leave-content\">";
		str += "<p class=\"\">状态：";
		str += "<a href=\"javascript:;\" class=\"content-state\"></a>";
		str += "</p>";
		str += "<p class=\"\">发起时间：";
		str += "<span class=\"content-time\"></span>";
		str += "</p>";
		str += "<p class=\"\">销假日期：";
		str += "<span class=\"content-cancels-leave\"></span>";
		str += "</p>";
		str += "<p class=\"\">销假原因：";
		str += "<span class=\"content-reason\"></span>";
		str += "</p>";
		str += "</div>";
		str += "</div>";
		$("body").append(str);
	}
	var rowData = data;
	console.log(rowData);
	var i = 0;
	var infoLength = rowData.length;
	var modalId = $.modal({
		showFooter: false
	}).show("销假申请", ".view-cancels-leave", function() {

	});
	var externalContainer = "#" + modalId;
	if(i == infoLength - 1) {
		$(externalContainer + " .list-next").hide();
	}
	loadCancelsLeaveInfo(i);
	//加载数据
	function loadCancelsLeaveInfo(i) {
		$(externalContainer + " .content-state").text(rowData[i].cancel_status_cn);
		$(externalContainer + " .content-state").attr("id", rowData[i].approval_session_id);
		$(externalContainer + " .content-time").text(rowData[i].cancel_add_time);
		var cancelsDate = "";
		for(var j in rowData[i].cancel_dates) {
			if(j < rowData[i].cancel_dates.length - 1) {
				cancelsDate += rowData[i].cancel_dates[j].date.replace(/-/g, ".") + (rowData[i].cancel_dates[j].slot == 1 ? "(上午)," : "(下午),");
			} else {
				cancelsDate += rowData[i].cancel_dates[j].date.replace(/-/g, ".") + (rowData[i].cancel_dates[j].slot == 1 ? "(上午)" : "(下午)");
			}
		}
		$(externalContainer + " .content-cancels-leave").text(cancelsDate);
		$(externalContainer + " .content-reason").text(rowData[i].cancel_desc);
	}
	//上一条
	$(externalContainer + " .list-last").click(function() {
		i--;
		loadCancelsLeaveInfo(i);
		if(i == 0) {
			$(this).hide();
		}
		console.log(i + "——————" + (infoLength - 2));
		if(i != infoLength - 1) {
			$(externalContainer + " .list-next").show();
		}
	});
	//下一条
	$(externalContainer + " .list-next").click(function() {
		i++;
		loadCancelsLeaveInfo(i);
		if(i > 0) {
			$(externalContainer + " .list-last").show();
		}
		console.log(i + "——————" + (infoLength - 1));
		if(i == infoLength - 1) {
			$(this).hide();
		}

	});
	//查看审批
	$(externalContainer + " .content-state").click(function() {
		var approvaliId = $(this).attr("id");
		if(approvaliId == "") {
			$.showErrorGritter("暂无审批流程!");
			return false;
		}
		openApprovalRecordPop(approvaliId, true);
	});
}
//查看剩余年假/可调休天数更改记录
function viewAnnualleaveOrRestChangeRecord(data, type) {
	if(data) {
		if(typeof data == "string")
			data = JSON.parse(data);
		var actiontext = (type == "overtime" ? "剩余调休" : "年假");
		var isLoadPage = $(".annualleave-Rest-Change-Record").length;
		if(isLoadPage == 0) {
			var $domTab = $("<div class=\"annualleave-Rest-Change-Record hide\"></div>");
			$domTab.append("<table class='table table-bordered'><tr><th>操作时间</th><th>更改前</th><th>更改后</th><th>变更原因</th><th>操作人员</th></tr></table>");
			$("body").append($domTab);
		}
		var modalId = $.modal({
			//showFooter: false
			showOKButton: false,
			cancelButtonText: "关闭"
		}).show(actiontext + "变更记录", ".annualleave-Rest-Change-Record", function() {});
		var content = "#" + modalId;
		for(var i in data) {
			var str = "";
			if(type == "overtime") { //调休
				str = "<tr><td>" + data[i].olh_add_time + "</td><td>" + data[i].olh_before_num + "</td><td>" + data[i].olh_after_num + "</td><td>" +
					data[i].olh_desc + "</td><td>" + data[i].oper_employee_name + "</td></tr>";
			} else { //年假
				str = "<tr><td>" + data[i].alh_add_time + "</td><td>" + data[i].alh_before_num + "</td><td>" + data[i].alh_after_num + "</td><td>" +
					data[i].alh_desc + "</td><td>" + data[i].oper_employee_name + "</td></tr>";
			}
			$(content + " table").append(str);
		}
	}
}