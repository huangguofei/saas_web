//查看审批详情
function openApprovalRecordPop(sessionId, showOkBtn, cancelCallback) {
	var isAppendCurrPopWrap = $(".pnl-apv-approval-record-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-apv-approval-record-common hide\">" +
			"	<form class=\"form-horizontal model-apv-approval-record-common\">" +
			"		<div class=\"form-group steps\">" +
			"			状态：<span class=\"label-status\">-</span>" +
//			"			<ul class=\"list-step\">" +
//			"				<li class=\"item-step hide\">" +
//			"					<label class=\"num\">0</label>" +
//			"					<div class=\"item hide\">" +
//			"						<label>审批部门：</label>" +
//			"						<span>行政部</span>" +
//			"						<span class=\"time\"><a href='javascript:;' class='btn btn-info btn-sm MTa-btn'>M一下</a></span>" +
//			"					</div>" +
//			"					<div class=\"item\">" +
//			"						<label>审批人：</label>" +
//			"						<span>总经理</span>" +
//			"					</div>" +
//			"				</li>" +
//			"			</ul>" +
			"		</div>" +
			"	</form>" +
			"</div>");
	}
	var modalId = $.modal({
		showButtonIcon: false,
		okButtonText: "撤 销",
		showOKButton: showOkBtn,
		cancelButtonText: "关 闭",
		width: 500
	}).show("审批记录", ".pnl-apv-approval-record-common",
		function(modal) {
			$.modal().confirm("你将撤销此次审批，确认撤销吗？", function() {
				doApprovalWithdrawn(sessionId, function() {
					cancelCallback && cancelCallback();
					modal.modal("hide");
				});
			});
		},
		function(modal) {

		}
	);
	//MTa
	var toEmployeeId = [];
	//model pop id
	var formContainer = "#" + modalId + " .model-apv-approval-record-common";
	$.ajaxGet(BSAPIURL + "/approvals/" + sessionId, function(response) {
		if(response.code == 0) {
			var stepsDom = $(formContainer + " .steps");
			//审批中
			if(response.data.apv_sessions_status != 1) {
				$("#" + modalId + " .modal-footer .modal-btnOk-container").remove();
			}
			$(formContainer + " .label-status").text(response.data.apv_sessions_status_cn);
			var apv_sessions_status = response.data.apv_sessions_status;
			//审批记录
			var apvStepsData = response.data.approval_step_data;
			if(apvStepsData) {
				stepsDom.empty();
				//发起人
				stepsDom.append(
					"<div class=\"step approval-creator approval-mini\">"
					+"	<div class=\"user at\">"
					+"		<div class='head-container lt'>"
					+"			<img class=\"head\" src=\"" + response.data.employee_avatar + "\">"
					+"		</div>"
					+"		<div class='name-and-time lt'>"
					+"			<span title='" + response.data.employee_name + "' class=\"user-name css-overhidden\">" + response.data.employee_name + "</span>"
					+"			<span class=\"approval-time note-font-type\">" + new Date((response.data.session_start_time||"").replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm") + "</span>"
					+"		</div>"
					+"		<div class=\"approval-status rt\">"
					+"			<span class=\"status\">发起审批</span>"
					+"		</div>"
					+"	</div>"
					+"</div>"
					+"<div class='steps-forward'><i class=\"fa fa-arrow-down\"></i></div>");
				var mTaDomIsAppended = false;
				var isState = true;
				var APV_WAIT_HANDLE=1;
				var APV_REFUSE= 3;
				var hasAppendMta=false;
				for(var i in apvStepsData) {
					var stepData = apvStepsData[i];
					var empNames = "",
						deptName = "";
					var stepData = apvStepsData[i];
					var empNames = "",titleNames="",
						deptName = "",realApprover="";
					var headImg = "";	
					if(stepData.approvers) {
						for(var j in stepData.approvers) {
							var apprData = stepData.approvers[j];
							toEmployeeId.push(apprData.employee_id);
							if(!apprData.employee_name) continue;
							if(empNames) {
								empNames += "、";
								titleNames+= "、";
							}
							//多个审批人 由谁审批的 突出显示
							if(stepData.approvers.length > 0 && apprData.employee_id == stepData.step_apv_employee_id) {
								realApprover=apprData.employee_name;
							}
							empNames += apprData.employee_name;
							titleNames+= apprData.employee_name;
							deptName = apprData.department_name;
							if(j < 3) {
								/*var styleStr = "";
								if(stepData.approvers.length == 3 && j == 0) {
									styleStr = "margin:0 20px";
								} else if(stepData.approvers.length == 1) {
									styleStr = "width:100%;height:auto;";
								} else if(stepData.approvers.length == 2) {
									styleStr = "width:42.5%;height:auto;";
								}*/
								headImg += "<img class=\"head\" src=\"" + (apprData.employee_avatar ? apprData.employee_avatar : "../resources/images/default.jpg") + "\">";
							}
						}
					}
					//指定人审批无部门
					if(stepData.step_type == 4) {
						//deptName = "-";
					}
					//stepData.step_apv_status_cn,stepData.step_apv_comment
					var mTaDom = stepData.step_apv_status == 1 ? "<span class=\"time\"><a href='javascript:;' class='btn btn-info def-btn-info btn-sm MTa-btn'>M一下</a></span>" : "";
					if(mTaDomIsAppended) {
						mTaDom = "";
					} else {
						mTaDomIsAppended = stepData.step_apv_status == 1;
					}
					var oneStepDom=$("<div class=\"step "+(stepData.step_apv_status == APV_WAIT_HANDLE ?"approval-mini":"")+"\">"
						+"	<div class=\"user at\">"
						+"		<div class=\"head-container lt\">" + headImg
						//+"		<img class=\"head\" src=\"" + selfHeadImg + "\">"
						+"		</div>"
						+"		<div class=\"name-and-time lt\">"
						//+"			<span class=\"dept hide\">" + deptName + "</span>"
						+"			<span title='" + titleNames + "' class=\"user-name css-overhidden\">" + empNames + "</span>"
						//+"			<span class='approval-time'>"+stepData.step_apv_time+"</span>"
						+"		</div>"
						+"		<div class='approval-status "+(stepData.step_apv_status == APV_WAIT_HANDLE? "status-Mta":"")+" rt'>"
						+			(stepData.step_apv_status == APV_WAIT_HANDLE && response.data.create_by_self &&!hasAppendMta ? "<a data-id=" + stepData.session_id + " class='btn btn-info def-btn-info btn-mta-approval btn-sm MTa-btn btn-mta'>M一下</a>" : "")
						+"			<span class=\"status "+((stepData.step_apv_status == APV_WAIT_HANDLE||stepData.step_apv_status == APV_REFUSE)? "status-red":"")+"\">" + (stepData.step_apv_status_cn || "待处理") + "</span>"
						+"		</div>"
						+"	</div>"
						+(stepData.step_apv_status == APV_WAIT_HANDLE?""
						:"	<div class=\"approver-and-note-container at\">"
						+"		<span class=\"note note-font-type lt\" title='"+stepData.step_apv_comment+"'>" + stepData.step_apv_comment + "</span>"
						+"		<div class='approval-real rt'>"
						+"			<span class='real-approver css-overhidden' title='"+("实际审批人："+realApprover)+"'>实际审批人："+realApprover+"</span>"
						+"			<span class='real-approval-time note-font-type'>"+new Date((stepData.step_apv_time||"").replace(/-/g,"/")).Format("yyyy-MM-dd hh:mm")+"</span>"
						+"		</div>"
						+"	</div>")
						+"</div>"
						+(apvStepsData.length>i+1?"<div class='steps-forward'><i class=\"fa fa-arrow-down\"></i></div>":""));
					//stepsDom.append($.format(stepItemTPL1, (parseInt(i) + 2), deptName, stepData.step_apv_time, empNames, stepData.step_apv_status_cn, stepData.step_apv_comment, mTaDom));
					stepsDom.append(oneStepDom);
					stepsDom.children('.item-step').last().find(".text-info").hide();
					if(isState || stepData.step_apv_status == 2) {
						stepsDom.children('.item-step').last().find(".text-info").show();
						isState = false;
					}
					if(stepData.step_apv_status == APV_WAIT_HANDLE) hasAppendMta=true;
					if(stepData.step_apv_status == 3) {
						$("#" + modalId + " .modal-footer .modal-btnOk-container").hide();
					}
				}
				//已撤销
				if(apv_sessions_status == 4) {
					//stepsDom.append($.format(stepItemTPL2, apvStepsData.length + 2, response.data.department_cn, response.data.session_end_time, response.data.employee_name));
					//
				}
				stepsDom.append("<li class=\"clear\"></li>");
				stepsDom.find(".direction").last().remove();

			}
		} else {
			$.showErrorGritter("加载审批事项失败：" + response.msg);
		}
		$("#" + modalId + " .MTa-btn").unbind("click").click(function() {
			console.log(toEmployeeId)
			var infoData = {};
			infoData.business_type = 30;
			infoData.data_id = sessionId;
			infoData.employee_id = toEmployeeId.join(',');
			infoData.message = {};
			infoData.message.msg_content = response.data.requested_subject;
			infoData.message.msg_type = MtaCode.approve;
			infoData.business_type_cn = "M一下：审批";
			sendMtaMessage(infoData, modalId);
		});
	});
}
//撤销审批
function doApprovalWithdrawn(apvSessionId, successCallback) {
	$.ajaxDelete(BSAPIURL + "/approvals/" + apvSessionId, {}, function(response) {
		if(response.code == 0) {
			$.showSuccessGritter("当前审批已撤销。");
			//回调
			successCallback && successCallback();
		} else {
			$.showErrorGritter("撤销失败：" + response.msg);
		}
	});
}