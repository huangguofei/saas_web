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
	$.fn.getSelectRowIndexsForjqGrid = function() {
		var grid = $(this);
		return grid.jqGrid('getGridParam', 'selarrrow');
	};
	$.fn.isSelectedRowForjqGrid = function() {
		var grid = $(this);
		return grid.jqGrid('getGridParam', 'selrow') || false;
	};
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
	$.fn.getRowData4JqGrid = function(fieldName, fieldValue) {
		var grid = $(this);
		var gridSelector = grid.selector;
		gridSelector = "#gbox_" + gridSelector.substring(1);
		var rowId = grid.jqGrid('getGridParam', 'selrow');
		if(fieldName && fieldValue) {
			rowId = grid.getJqGridRowIndexByField(fieldName, fieldValue);
		}
		if(!rowId) {
			return undefined;
		}
		return $(gridSelector + " .ui-jqgrid-btable tr#" + rowId).data("_data");
	};
	//Ë¢ÐÂ±í¸ñÊý¾Ý
	$.fn.reloadGrid = function(option) {
		if(option) {
			if(!option.page && option.url) {
				option.page = 1;
			}
			$(this).jqGrid('setGridParam', option);
		}
		$(this).trigger("reloadGrid", { height: 200 })
	};
	$.fn.reloadGrid = function() {
		$(this).trigger("reloadGrid", {});
	};
	$.fn.initJqGrid = function(option) {
		//grid_selector, pager_selector, url, colNames, colModel, gridHeight
		var grid_selector = option.grid_selector || $(this).selector;
		var gridContainer = "#gbox_" + grid_selector.substring(1);
		option.showPager = option.showPager == undefined ? true : option.showPager;
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
				search: "_search",
				nd: "nd",
				npage: null
			},
			rowNum: 20,
			rowList: [20, 50, 100],
			//pager: pager_selector,
			multiselect: true,
			loadonce: false,
			gridComplete: function() {

				//reset select
				doSelectRow(gridContainer, grid_selector);

				if(option.complete) {
					option.complete();
				}
			},
			loadComplete: function(response) {
				//fail
				if(response.code > 0) {
					$.processFailResponse(response);
				}

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
				}
				bindGridFooterLeftButtons(grid_selector, option.pager, option.footerBtnContainer);
				//permission
				initButtonPermission(gridContainer);
				//数据加载完成回调
				option.afterLoadComplete && option.afterLoadComplete(response);
			},
			loadError: function(xhr, status, error) {
				$.showErrorGritter("加载数据出错：" + status);
			},
			onSelectAll: function(aRowids, status) {
				doSelectAll(gridContainer, aRowids, status);
			},
			onSelectRow: function(id) {
				doSelectRow(gridContainer, grid_selector);
			},
			afterInsertRow: function(rowId, rowData, rowElem) {
				if(option.storeRowDataInCache)
					$(gridContainer + " .ui-jqgrid-btable tr#" + rowId).data("_data", rowElem);
			}
		}, option));
	};
	$.fn.initJqGrid4Local = function(grid_selector, pager_selector, colNames, colModel, gridHeight) {
		var gridContainer = "#gbox_" + grid_selector.substring(1);
		return $(grid_selector).jqGrid({
			datatype: "local",
			height: gridHeight || 500,
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
				doSelectRow(gridContainer, grid_selector);
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
				doSelectAll(gridContainer, aRowids, status);
			},
			onSelectRow: function(id) {
				doSelectRow(gridContainer, grid_selector);
			}
		});
	};

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

	function doSelectAll(gridContainer, aRowids, status) {
		$(gridContainer + " #grid-pager_right").find("[show-on]").hide();
		$(gridContainer + " #grid-pager_right").find(".lblSelectRowCount").text("");
		if(status) {
			$(gridContainer + " #grid-pager_right").find("[show-on='multiselect']").show();
			$(gridContainer + " #grid-pager_right").find(".lblSelectRowCount").text("已选 " + aRowids.length.toString() + " 项 ");
		}
	}

	function doSelectRow(gridContainer, grid_selector) {
		$(gridContainer + " #grid-pager_right").find("[show-on]").hide();
		$(gridContainer + " #grid-pager_right").find(".lblSelectRowCount").text("");

		setTimeout(function() {
			var selIds = $(grid_selector).jqGrid('getGridParam', 'selarrrow');
			if(selIds && selIds.length > 0) {
				var isMultiselect = selIds.length > 1;
				$(gridContainer + " #grid-pager_right").find(".lblSelectRowCount").text("已选 " + selIds.length.toString() + " 项 ");
				if(isMultiselect)
					$(gridContainer + " #grid-pager_right").find("[show-on='multiselect']").show();
				else
					$(gridContainer + " #grid-pager_right").find("[show-on]").show();
			}
		}, 100);
	}
	//	$(window).triggerHandler('resize.jqGrid');
	//	$(window).on('resize.jqGrid', function() {
	//		var parent_width = $(grid_selector).closest('.user-list').width();
	//		$(grid_selector).jqGrid('setGridWidth', parent_width);
	//	});
})(jQuery);