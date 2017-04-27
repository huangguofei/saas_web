(function($) {
	/**
	 * jqGrid English Translation
	 * Tony Tomov tony@trirand.com
	 * http://trirand.com/blog/ 
	 * Dual licensed under the MIT and GPL licenses:
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.gnu.org/licenses/gpl.html
	 **/
	$.jgrid = $.jgrid || {};
	$.extend($.jgrid, {
		defaults: {
			recordtext: "\u5f53\u524d\u0020\u007b\u0030\u007d\u0020\u002d\u0020\u007b\u0031\u007d\u0020\u6761\uff0c\u0020\u5171\u0020\u007b\u0032\u007d\u0020\u6761\u8bb0\u5f55",
			emptyrecords: "\u65e0\u8bb0\u5f55",
			loadtext: "\u6b63\u5728\u52a0\u8f7d\u6570\u636e\u002e\u002e\u002e",
			pgtext: "\u7b2c\u0020\u007b\u0030\u007d\u0020\u002f\u0020\u007b\u0031\u007d\u0020\u9875"
		},
		search: {
			caption: "Search...",
			Find: "Find",
			Reset: "Reset",
			odata: [{
				oper: 'eq',
				text: 'equal'
			}, {
				oper: 'ne',
				text: 'not equal'
			}, {
				oper: 'lt',
				text: 'less'
			}, {
				oper: 'le',
				text: 'less or equal'
			}, {
				oper: 'gt',
				text: 'greater'
			}, {
				oper: 'ge',
				text: 'greater or equal'
			}, {
				oper: 'bw',
				text: 'begins with'
			}, {
				oper: 'bn',
				text: 'does not begin with'
			}, {
				oper: 'in',
				text: 'is in'
			}, {
				oper: 'ni',
				text: 'is not in'
			}, {
				oper: 'ew',
				text: 'ends with'
			}, {
				oper: 'en',
				text: 'does not end with'
			}, {
				oper: 'cn',
				text: 'contains'
			}, {
				oper: 'nc',
				text: 'does not contain'
			}],
			groupOps: [{
				op: "AND",
				text: "all"
			}, {
				op: "OR",
				text: "any"
			}]
		},
		edit: {
			addCaption: "Add Record",
			editCaption: "Edit Record",
			bSubmit: "Submit",
			bCancel: "Cancel",
			bClose: "Close",
			saveData: "Data has been changed! Save changes?",
			bYes: "Yes",
			bNo: "No",
			bExit: "Cancel",
			msg: {
				required: "Field is required",
				number: "Please, enter valid number",
				minValue: "value must be greater than or equal to ",
				maxValue: "value must be less than or equal to",
				email: "is not a valid e-mail",
				integer: "Please, enter valid integer value",
				date: "Please, enter valid date value",
				url: "is not a valid URL. Prefix required ('http://' or 'https://')",
				nodefined: " is not defined!",
				novalue: " return value is required!",
				customarray: "Custom function should return array!",
				customfcheck: "Custom function should be present in case of custom checking!"

			}
		},
		view: {
			caption: "View Record",
			bClose: "Close"
		},
		del: {
			caption: "Delete",
			msg: "Delete selected record(s)?",
			bSubmit: "Delete",
			bCancel: "Cancel"
		},
		nav: {
			edittext: "",
			edittitle: "Edit selected row",
			addtext: "",
			addtitle: "Add new row",
			deltext: "",
			deltitle: "Delete selected row",
			searchtext: "",
			searchtitle: "Find records",
			refreshtext: "",
			refreshtitle: "Reload Grid",
			alertcap: "Warning",
			alerttext: "Please, select row",
			viewtext: "",
			viewtitle: "View selected row"
		},
		col: {
			caption: "Select columns",
			bSubmit: "Ok",
			bCancel: "Cancel"
		},
		errors: {
			errcap: "Error",
			nourl: "No url is set",
			norecords: "No records to process",
			model: "Length of colNames <> colModel!"
		},
		formatter: {
			integer: {
				thousandsSeparator: ",",
				defaultValue: '0'
			},
			number: {
				decimalSeparator: ".",
				thousandsSeparator: ",",
				decimalPlaces: 2,
				defaultValue: '0.00'
			},
			currency: {
				decimalSeparator: ".",
				thousandsSeparator: ",",
				decimalPlaces: 2,
				prefix: "",
				suffix: "",
				defaultValue: '0.00'
			},
			date: {
				dayNames: [
					"Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
					"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
				],
				monthNames: [
					"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
					"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				],
				AmPm: ["am", "pm", "AM", "PM"],
				S: function(j) {
					return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th';
				},
				srcformat: 'Y-m-d',
				newformat: 'n/j/Y',
				parseRe: /[Tt\\\/:_;.,\t\s-]/,
				masks: {
					// see http://php.net/manual/en/function.date.php for PHP format used in jqGrid
					// and see http://docs.jquery.com/UI/Datepicker/formatDate
					// and https://github.com/jquery/globalize#dates for alternative formats used frequently
					// one can find on https://github.com/jquery/globalize/tree/master/lib/cultures many
					// information about date, time, numbers and currency formats used in different countries
					// one should just convert the information in PHP format
					ISO8601Long: "Y-m-d H:i:s",
					ISO8601Short: "Y-m-d",
					// short date:
					//    n - Numeric representation of a month, without leading zeros
					//    j - Day of the month without leading zeros
					//    Y - A full numeric representation of a year, 4 digits
					// example: 3/1/2012 which means 1 March 2012
					ShortDate: "n/j/Y", // in jQuery UI Datepicker: "M/d/yyyy"
					// long date:
					//    l - A full textual representation of the day of the week
					//    F - A full textual representation of a month
					//    d - Day of the month, 2 digits with leading zeros
					//    Y - A full numeric representation of a year, 4 digits
					LongDate: "l, F d, Y", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy"
					// long date with long time:
					//    l - A full textual representation of the day of the week
					//    F - A full textual representation of a month
					//    d - Day of the month, 2 digits with leading zeros
					//    Y - A full numeric representation of a year, 4 digits
					//    g - 12-hour format of an hour without leading zeros
					//    i - Minutes with leading zeros
					//    s - Seconds, with leading zeros
					//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
					FullDateTime: "l, F d, Y g:i:s A", // in jQuery UI Datepicker: "dddd, MMMM dd, yyyy h:mm:ss tt"
					// month day:
					//    F - A full textual representation of a month
					//    d - Day of the month, 2 digits with leading zeros
					MonthDay: "F d", // in jQuery UI Datepicker: "MMMM dd"
					// short time (without seconds)
					//    g - 12-hour format of an hour without leading zeros
					//    i - Minutes with leading zeros
					//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
					ShortTime: "g:i A", // in jQuery UI Datepicker: "h:mm tt"
					// long time (with seconds)
					//    g - 12-hour format of an hour without leading zeros
					//    i - Minutes with leading zeros
					//    s - Seconds, with leading zeros
					//    A - Uppercase Ante meridiem and Post meridiem (AM or PM)
					LongTime: "g:i:s A", // in jQuery UI Datepicker: "h:mm:ss tt"
					SortableDateTime: "Y-m-d\\TH:i:s",
					UniversalSortableDateTime: "Y-m-d H:i:sO",
					// month with year
					//    Y - A full numeric representation of a year, 4 digits
					//    F - A full textual representation of a month
					YearMonth: "F, Y" // in jQuery UI Datepicker: "MMMM, yyyy"
				},
				reformatAfterEdit: false
			},
			baseLinkUrl: '',
			showAction: '',
			target: '',
			checkbox: {
				disabled: true
			},
			idName: 'id'
		}
	});
	var selectListData = [];

	function saveData(obj) {
		var a = JSON.stringify(selectListData);
		var b = JSON.stringify(obj);
		if(a.indexOf(b) == -1) {
			selectListData.push(obj);
			console.log("存数据成功");
		}
	}

	function getLineData(grid_selector, id, name) {
		var data = $(grid_selector).getRowData4JqGrid("","","",id);
		return data;
	}

	function deleteIndexData(obj) {
		//获取obj在arrayNewList数组中的索引值
		for(i = 0; i < selectListData.length; i++) {
			if(JSON.stringify(selectListData[i]) == JSON.stringify(obj)) {
				//根据索引值删除arrayNewList中的数据
				selectListData.splice(i, 1);
				console.log("删除成功");
			}
		}
	}
	//已过期
	$.getSelectRowIdsForjqGrid = function(grid_selector, idName) {
		var grid = $(grid_selector);
		var selRowsIndex = grid.jqGrid('getGridParam', 'selarrrow');
		if(selRowsIndex && selRowsIndex.length > 0) {
			var resRowsIdArr = [];
			selRowsIndex = selRowsIndex.toString();
			selRowsIndex = selRowsIndex.split(',');
			for(var i in selRowsIndex) {
				var selRowData = grid.jqGrid('getRowData', selRowsIndex[i]);
				if(selRowData) {
					resRowsIdArr.push(selRowData[idName]);
				}
			}
			return resRowsIdArr; //.join(',');
		}
		return null;
	};
	//获取选中行的列值
	$.fn.getSelectRowIdsForjqGrid = function(idName) {
		var grid = $(this);
		var selRowsIndex = grid.jqGrid('getGridParam', 'selarrrow');
		if(selRowsIndex && selRowsIndex.length > 0) {
			var resRowsIdArr = [];
			selRowsIndex = selRowsIndex.toString();
			selRowsIndex = selRowsIndex.split(',');
			for(var i in selRowsIndex) {
				var selRowData = grid.jqGrid('getRowData', selRowsIndex[i]);
				if(selRowData) {
					resRowsIdArr.push(selRowData[idName]);
				}
			}
			return resRowsIdArr; //.join(',');
		}
		return null;
	};
	//获取选中第一行行号
	$.fn.getSelectRowIndexsForjqGrid = function() {
		var grid = $(this);
		return grid.jqGrid('getGridParam', 'selarrrow');
	};
	//是否有行选中
	$.fn.isSelectedRowForjqGrid = function() {
		var grid = $(this);
		return grid.jqGrid('getGridParam', 'selrow') || false;
	};
	//是否已多选
	$.fn.isSelectedMultipleRowForjqGrid = function() {
		var grid = $(this);
		return grid.jqGrid('getGridParam', 'selarrrow').length > 1;
	};
	//获取行号
	$.fn.getJqGridRowIndexByField = function(field, val) {
		var grid = $(this);
		var rowIds = grid.jqGrid('getDataIDs');
		for(var i in rowIds) {
			var rowData = grid.jqGrid('getRowData', rowIds[i]);
			if(rowData[field] == val) {
				return rowIds[i];
			}
		}
		return undefined;
	};
	//获取行数据
	$.fn.getRowData4JqGrid = function(fieldName, fieldValue, isAll, index) {
		var grid = $(this);
		var gridSelector = grid.selector;
		gridSelector = "#gbox_" + gridSelector.substring(1);
		var rowId = grid.jqGrid('getGridParam', 'selrow');
		if(fieldName && fieldValue) {
			rowId = grid.getJqGridRowIndexByField(fieldName, fieldValue);
		}
		rowId = index ? index : rowId;
		if(!rowId&&!isAll) {
			return undefined;
		}
		if(isAll) {
			return selectListData;
		} else {
			return $(gridSelector + " .ui-jqgrid-btable tr#" + rowId).data("_data");
		}
	};
	//刷新表格数据
	$.fn.reloadGrid = function(option) {
		if(option) {
			if(!option.page && option.url) {
				option.page = 1;
			}
			$(this).jqGrid('setGridParam', option);
		}
		$(this).trigger("reloadGrid", { height: 200 })
	};
	//初始化表格
	$.fn.initJqGrid = function(option) {
		selectListData = [];
		//grid_selector, pager_selector, url, colNames, colModel, gridHeight
		var grid_selector = option.grid_selector || $(this).selector;
		var gridContainer = "#gbox_" + grid_selector.substring(1);
		option.showPager = option.showPager == undefined ? true : option.showPager;
		//默认高度: pager height 55 + table header 37 + body padding 10 + content margin-top 10;
		option.height = option.height || $(window).height() - $(".search").outerHeight(true) - 135;
		//复选框
		option.multiselect = option.multiselect == undefined ? true : option.multiselect;
		//表头处理
		for(var i in option.colModel) {
			var model = option.colModel[i];
			//默认宽度
			if(option.thDefaultWidth)
				model.width = model.width || option.thDefaultWidth;
			model.index = model.index || model.name;
			model.sortable = model.sortable == undefined ? false : model.sortable;
		}

		function contrlBtns(gridFooterContainer) {
			if($(gridFooterContainer + "_right").find(".grid-footer-btn-container").length > 0) return;
			var fotterBtnContainerWidth = $(gridFooterContainer).outerWidth(true);
			var gridPagerLeftWidth = $(gridFooterContainer + "_left").outerWidth(true);
			var gridPagerCenterWidth = $(gridFooterContainer + "_center").outerWidth(true);
			var gridPagerRightWidth = $(gridFooterContainer + "_right").outerWidth(true);
			var allBtnsWidth = 0;
			$(gridFooterContainer + "_right a").each(function() {
				allBtnsWidth += $(this).outerWidth(true);
			});
			if(allBtnsWidth > gridPagerRightWidth) {
				//var btnsDom=$(gridFooterContainer+"_right").html();
				var divDom = "<a href='javascript:;' class='grid-footer-btn-icon btn btn-info'>更多^</a>" +
					"<div class='grid-footer-btn-container'></div>";
				$(gridFooterContainer + "_right").append(divDom);
				$(gridFooterContainer + "_left")[0].style.width = "285px!important";
				$(".grid-footer-btn-container").css("display", "none");
				$(gridFooterContainer + "_right a").each(function(index) {
					if($(this).hasClass("grid-footer-btn-icon") || $(this).hasClass("grid-footer-btn-container") || $(this).hasClass("lblSelectRowCount")) return true;
					if(index > 0 && $(this).hasClass("btn")) {
						$(".grid-footer-btn-container").append($(this).clone(true));
						$(this).addClass("hide");
					}
				});
				$(".grid-footer-btn-icon").unbind("click").click(function() {
					if($(".grid-footer-btn-container").css("display") == "none") {
						$(".grid-footer-btn-container").slideDown();
					} else {
						$(".grid-footer-btn-container").slideUp();
					}

				});
				$(".grid-footer-btn-container").unbind("mouseleave").mouseleave(function() {
					$(".grid-footer-btn-container").slideUp();
				});
			}
		}

		return $(grid_selector).jqGrid($.extend({
				//url: url,
				mtype: "GET",
				datatype: "json",
				//height: gridHeight || 500,
				autowidth: true,
				//colNames: colNames,
				//colModel: colModel,
				viewrecords: false,
				prmNames: {
					page: "page",
					rows: "rows",
					sort: "sidx",
					order: "sort",
					search: null,
					nd: "nd",
					npage: null
				},
				rowNum: 20,
				rowList: [20, 50, 100],
				//pager: pager_selector,
				//multiselect: true,
				loadonce: false,
				pagerpos: "left",
				gridComplete: function() {
					//reset select
					doSelectRow(gridContainer, grid_selector, "", option.storageIdName);

					//自定义列宽
					for(var i in option.colModel) {
						var model = option.colModel[i];
						if(model.width) {
							var tdIndex = (parseInt(i) + (option.multiselect ? 1 : 0));
							$(gridContainer + " .ui-jqgrid-htable .ui-jqgrid-labels th:eq('" + tdIndex + "')").width(model.width);
							$(gridContainer + " .ui-jqgrid-btable .jqgfirstrow td:eq('" + tdIndex + "')").width(model.width);
						}
					}

					if(option.complete) {
						option.complete();
					}
				},
				loadComplete: function(response) {
					//fail
					if(response.code > 0) {
						$.processFailResponse(response, true);
					}
					//				$(".ui-jqgrid-bdiv").mCustomScrollbar({
					//					//theme: "light-3",
					//					scrollInertia: 1000,
					//					scrollButtons: {
					//						enable: true
					//					},
					//					advanced:{
					//						updateOnBrowserResize:Boolean,
					//						updateOnContentResize:Boolean
					//					},
					//					mouseWheel:{
					//						preventDefault:true
					//					}
					//				});
					var pcount = response.records;
					if(!pcount) {
						try {
							pcount = response.rows.length;
						} catch(e) {
							if(response.data)
								pcount = response.data.rows == undefined ? 0 : response.data.rows.length;
						}
					}
					pcount = pcount || 0;
					updatePagerIcons(grid_selector, option.pager, pcount);
					if(!option.showPager) {
						$(gridContainer + " " + option.pager + "_center .ui-pg-table").hide();
						$(gridContainer + " " + option.pager + "_left .ui-pg-table").hide();
					}
					bindGridFooterLeftButtons(grid_selector, option.pager, option.footerBtnContainer);
					//permission
					initButtonPermission(gridContainer);
					contrlBtns(gridContainer + " " + option.pager);
					if(option.storageIdName)
						if(selectListData.length > 0) {
							var ids = $(grid_selector).getDataIDs();
							for(var j in ids) {
								var rowData = $(grid_selector).getRowData(ids[j]);
								if(JSON.stringify(selectListData).indexOf(JSON.stringify(rowData[option.storageIdName])) > -1) {
									//判断arrayNewList中存在item.code值时，选中前面的复选框，
									$("#jqg_movepubilc-tab_" + ids[j]).trigger("click");
								}
							}
						}
					//数据加载完成回调
					option.afterLoadComplete && option.afterLoadComplete(response);
				},
				loadError: function(xhr, status, error) {
					$.showErrorGritter("加载数据出错：" + status);
				},
				onSelectAll: function(aRowids, status) {
					if(option.storageIdName) {
						if(status == true) {
							//循环aRowids数组，将代码放入arrayNewList数组中
							$.each(aRowids, function(i, item) {
								saveData(getLineData(grid_selector, item, option.storageIdName));
							});
						} else {
							//循环aRowids数组，将代码从arrayNewList中删除
							$.each(aRowids, function(i, item) {
								deleteIndexData(getLineData(grid_selector, item, option.storageIdName));
							});
						}
					}
					doSelectAll(gridContainer, aRowids, status, option.pager, option.storageIdName);
				},
				onSelectRow: function(id, status) {
					if(status == true) {
						if(option.storageIdName) {
							saveData(getLineData(grid_selector, id, option.storageIdName));
						}
					} else {
						if(option.storageIdName)
							deleteIndexData(getLineData(grid_selector, id, option.storageIdName));
					}
					doSelectRow(gridContainer, grid_selector, option.pager, option.storageIdName);
				},
				afterInsertRow: function(rowId, rowData, rowElem) {
					//行数据暂存内存
					if(option.storeRowDataInCache)
						$(gridContainer + " .ui-jqgrid-btable tr#" + rowId).data("_data", rowElem);
				}
			},
			option));
	};
	$.fn.initJqGrid4Local = function(grid_selector, pager_selector, colNames, colModel, gridHeight) {
		var gridContainer = "#gbox_" + grid_selector.substring(1);
		return $(grid_selector).jqGrid({
			datatype: "local",
			//height: gridHeight || $(window).height()- $(".search").height()- 145,
			autowidth: true,
			colNames: colNames,
			colModel: colModel,
			viewrecords: false,
			pager: pager_selector,
			multiselect: true,
			loadonce: true,
			gridComplete: function() {
				if(!pager_selector)
					return;

				//reset select
				doSelectRow(gridContainer, grid_selector, "", option.storageIdName);
			},
			loadComplete: function(a) {
				if(!pager_selector)
					return;
				var pcount = a.records;
				if(!pcount) {
					try {
						pcount = a.rows.length;
					} catch(e) {
						pcount = a.data.rows == undefined ? 0 : a.data.rows.length;
					}
				}
				updatePagerIcons(grid_selector, pcount);
				bindGridFooterLeftButtons(grid_selector, pager_selector, null);
				//permission
				initButtonPermission(gridContainer);
			},
			loadError: function(xhr, status, error) {
				$.showErrorGritter("加载数据出错：" + status);
			},
			onSelectAll: function(aRowids, status) {
				doSelectAll(gridContainer, aRowids, status, "", option.storageIdName);
			},
			onSelectRow: function(id) {
				doSelectRow(gridContainer, grid_selector, "", option.storageIdName);
			}
		});
	};
	//初始按钮权限
	function initButtonPermission(gridContainer) {
		var CURRAUTHS = localStorage["_CURRAUTHS"] == undefined ? "" : JSON.parse(localStorage["_CURRAUTHS"]);
		var btnsSelector = $(gridContainer + " a[role-auth]," + gridContainer + " input[role-auth]," + gridContainer + " button[role-auth]");
		if(!CURRAUTHS) {
			btnsSelector.attr("disabled", "disabled").removeAttr("onclick");
		} else {
			btnsSelector.each(function() {
				var authArr = $(this).attr("role-auth").split('|');
				var cVal = CURRAUTHS[authArr[0]];
				if(!cVal || cVal.indexOf(authArr[1]) < 0) {
					if($(this).attr("isset") != 1) {
						$(this).removeAttr("onclick").click(function() {
							$.showErrorGritter($(this).attr("role-auth-tip") || "你无权限操作该数据。");
						}).attr("disabled", "disabled").attr("isset", 1);
					}
				}
			});
		}
	}

	function doSelectAll(gridContainer, aRowids, status, footerSelector, selectName) {
		//$(gridContainer + " #grid-pager_right").find("[show-on]").hide();
		footerSelector = footerSelector || "#grid-pager";
		var btnParentDom = $(gridContainer + " " + footerSelector + "_right");
		btnParentDom.find("[enable-on]").attr("disabled", "disabled");
		btnParentDom.find(".lblSelectRowCount").text("");

		//btnParentDom.find("[enable-on]").attr("onclick1", btnParentDom.find("[enable-on]").attr("onclick")).removeAttr("onclick");
		setEnableBtnsClick(btnParentDom);
		btnParentDom.find("[enable-on]").unbind("click").click(function() {
			$.showErrorGritter($(this).attr("enable-tip") || "多选时不能进行此操作。", {
				time: 2000
			});
		});
		var selectData = selectName ? selectListData : aRowids;
		if(status) {
			btnParentDom.find("[enable-on='multiselect']").removeAttr("disabled");
			resetEnableBtnsClick(btnParentDom.find("[enable-on='multiselect']"));
			//btnParentDom.find("[enable-on='multiselect']").attr("onclick", btnParentDom.find("[enable-on='multiselect']").attr("onclick1")).unbind("click");
			btnParentDom.find(".lblSelectRowCount").text("已选 " + selectData.length /*+selectListData.length*/ + " 项 ");
		} else {
			btnParentDom.find("[enable-on]").removeAttr("disabled");
			resetEnableBtnsClick(btnParentDom.find("[enable-on]"));
			if(selectData.length != 0)
				btnParentDom.find(".lblSelectRowCount").text("已选 " + selectData.length /*+selectListData.length*/ + " 项 ");
		}
	}

	function doSelectRow(gridContainer, gridSelector, footerSelector, selectName) {
		//$(gridContainer + " #grid-pager_right").find("[show-on]").hide();
		footerSelector = footerSelector || "#grid-pager";
		var btnParentDom = $(gridContainer + " " + footerSelector + "_right");
		btnParentDom.find("[enable-on]").attr("disabled", "disabled");
		btnParentDom.find(".lblSelectRowCount").text("");

		setEnableBtnsClick(btnParentDom);
		//btnParentDom.find("[enable-on]").attr("onclick1", btnParentDom.find("[enable-on]").attr("onclick")).removeAttr("onclick");
		btnParentDom.find("[enable-on]").unbind("click").click(function() {
			$.showErrorGritter($(this).attr("enable-tip") || "多选时不能进行此操作。", {
				time: 2000
			});
		});
		var selIds = $(gridSelector).jqGrid('getGridParam', 'selarrrow');
		var selectData = selectName ? selectListData : selIds;
		if(selectData && selectData.length > 0) {
			var isMultiselect = selectData.length > 1;
			btnParentDom.find(".lblSelectRowCount").text("已选 " + (selectData.length) + " 项 ");
			if(!isMultiselect) {
				btnParentDom.find("[enable-on='singleselect']").removeAttr("disabled");
				resetEnableBtnsClick(btnParentDom.find("[enable-on='singleselect']"));
				//btnParentDom.find("[enable-on='singleselect']").attr("onclick", btnParentDom.find("[enable-on='singleselect']").attr("onclick1")).unbind("click");
			} else {
				btnParentDom.find("[enable-on='multiselect']").removeAttr("disabled");
				resetEnableBtnsClick(btnParentDom.find("[enable-on='multiselect']"));
				//btnParentDom.find("[enable-on='multiselect']").attr("onclick", btnParentDom.find("[enable-on='multiselect']").attr("onclick1")).unbind("click");
			}
		} else {
			btnParentDom.find("[enable-on]").removeAttr("disabled");
			resetEnableBtnsClick(btnParentDom.find("[enable-on]"));
			//btnParentDom.find("[enable-on]").attr("onclick", btnParentDom.find("[enable-on]").attr("onclick1")).unbind("click");
		}
	}

	function setEnableBtnsClick(btnParentDom) {
		btnParentDom.find("[enable-on]").each(function() {
			$(this).attr("onclick1", $(this).attr("onclick")).removeAttr("onclick");
		});
	};

	function resetEnableBtnsClick(btnDoms) {
		btnDoms.each(function() {
			$(this).attr("onclick", $(this).attr("onclick1")).unbind("click");
		});
	};
	//	$(window).triggerHandler('resize.jqGrid');
	//	$(window).on('resize.jqGrid', function() {
	//		var parent_width = $(grid_selector).closest('.user-list').width();
	//		$(grid_selector).jqGrid('setGridWidth', parent_width);
	//	});
})(jQuery);