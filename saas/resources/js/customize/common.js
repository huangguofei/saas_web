//数据变更记录
function openDataUpdateRecordsPop(adcId, title) {
	title = title || "变更记录";
	var isAppendCurrPopWrap = $(".pnl-data-update-records-common").length > 0;
	if(!isAppendCurrPopWrap) {
		$("body").append("<div class=\"pnl-data-update-records-common hide\">" +
			"	<form class=\"form-horizontal model-data-update-records-common\">" +
			"		<table class=\"table table-bordered table-vmiddle\">" +
			"			<tr>" +
			"				<th>操作时间</th>" +
			"				<th>操作</th>" +
			"				<th>更改项</th>" +
			"				<th>更改前</th>" +
			"				<th>更改后</th>" +
			"				<th>变更原因</th>" +
			"				<th>操作人</th>" +
			"			</tr>" +
			"		</table>" +
			"	</form>" +
			"</div>");
	}

	var modalId = $.modal({
		showOKButton: false,
		showButtonIcon: false,
		cancelButtonText: "关 闭"
	}).showOfLarge(title, ".pnl-data-update-records-common",
		function(modal) {

		}
	);
	//model pop id
	var formContainer = "#" + modalId + " .model-data-update-records-common";
	var url = BSAPIURL + "/sign_record/change_logs/" + adcId;
	$.ajaxGet(url, function(response) {
		if(response.code != 0) {
			$.showErrorGritter("加载变更记录失败：" + response.msg)
			return false;
		}
		if(!response.data) {
			$(formContainer + " table").append("<tr><td colspan=7>无变更记录</td></tr>");
			return false;
		}
		for(var i in response.data) {
			var rowData = response.data[i];
			var rowCount = rowData.track_detail.length;
			var trHtml = "<tr>" +
				"				<td rowspan=" + rowCount + ">" + rowData.create_time + "</td>" +
				"				<td rowspan=" + rowCount + ">" + rowData.title + "</td>" +
				"				<td>" + rowData.track_detail[0].change_item + "</td>" +
				"				<td>" + rowData.track_detail[0].before_change + "</td>" +
				"				<td>" + rowData.track_detail[0].after_change + "</td>" +
				"				<td rowspan=" + rowCount + ">" + rowData.reason + "</td>" +
				"				<td rowspan=" + rowCount + ">" + rowData.employee_name + "</td>" +
				"			</tr>";
			for(var j = 1; j < rowCount; j++) {
				trHtml += "<tr>" +
					"				<td>" + rowData.track_detail[j].change_item + "</td>" +
					"				<td>" + rowData.track_detail[j].before_change + "</td>" +
					"				<td>" + rowData.track_detail[j].after_change + "</td>" +
					"			</tr>";
			}
			$(formContainer + " table").append(trHtml);
		}
	});
}