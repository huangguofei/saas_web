$.fn.addressBook = function() {
	var box = this;
	loadPage(box);
	//加载页面
	function loadPage(obj) {
		if($(obj).find(".address-book-page").length == 0) {
			var pageDom = $("<div class='address-book-page'></div>");
			pageDom.append("<div class='page-top'><span>通讯录</span><i class=\"fa fa-times\" aria-hidden=\"true\"></i></div>");
			pageDom.append("<div class='page-search'><input type='text' placeholder='请输入姓名、(单位)部门、电话进行查找'><i class=\"fa fa-search\" aria-hidden=\"true\"></i></div>");
			pageDom.append("<div class='page-content'><ul class='page-nav'><li class='pull-left company-nav select'>企业通讯录</li><li class='pull-left client-nav'>客户通讯录</li></ul>" +
				"<div class='content-box company-address-book'><ul></ul></div><div class='content-box client-address-book hide'><ul></ul></div></div>");
			$(obj).append(pageDom);
		}
	}
	$(this).children("a").unbind("click").click(function() {
		if($(".address-book-page").css("display") == "none") {
			offOrOpenPage("open");
			imOrAddressbookShow("addressbook");
		} else {
			offOrOpenPage("off");
		}
		if($(".company-address-book li").length <= 0) {
			loadData("company");
		}
	});
	$(".address-book-page .page-nav li").click(function(event) {

		changePage(this);
	});
	$(".address-book-page .fa-times").click(function(event) {

		offOrOpenPage("off");
	});
	//搜索
	$(".address-book-page .page-search input").keyup(function() {
		var searchText = $(this).val();
		if($(".company-address-book").hasClass("hide")) {
			clientAddressBooksearch(searchText);
		} else {
			companyAddressBooksearch(searchText);
		}
	});
	$(".address-book-page .page-search i").click(function(event) {

		var searchText = $(".address-book-page .page-search input").val();
		if($(".company-address-book").hasClass("hide")) {
			clientAddressBooksearch(searchText);
		} else {
			companyAddressBooksearch(searchText);
		}
	});
	//滚动条插件
	$(".address-book-page .content-box").mCustomScrollbar({
		theme: "light-3",
		scrollInertia: 1000,
		scrollbarPosition: "outside",
		//		setLeft:"-20px",
		scrollButtons: {
			enable: false
		}
	});
	$(".address-book-page").click(function() {
		imOrAddressbookShow("addressbook");
	});
	//加载数据
	function loadData(type) {
		var companyUrl = BSAPIURL + "/employees?no_paging=1";
		var clientUrl = BSAPIURL + "/crm/client_contacts/linkman?employee_scope=1";
		$.ajaxGet((type == "company" ? companyUrl : clientUrl), function(response) {
			console.log(response)
			if(response.code == 0) {
				showData((type == "company" ? response.data : response.data.rows), type)
			}
		});
	}

	function showData(data, type) {
		var contentDom = (type == "company" ? $(box).find(".company-address-book ul") : $(box).find(".client-address-book ul"));
		var companyLogo = "<img src=\"../resources/images/company.png\">";
		var deparLogo = "<img src=\"../resources/images/depar.png\">";
		for(var i in data) {
			var info = data[i];
			var str = "<li><p class='conten-show'><span><span class='show-name'>{NAME}</span><span class='show-work'>（{WORK}）</span></span><span>{MOBILE}</span>" +
				"<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></p><p class='conten-hide'>" +
				"<span>{LOCH}</span>" +
				"<span><img src=\"../resources/images/phone.png\">{PHONE}</span>" +
				"<span><i class=\"fa fa-envelope\" aria-hidden=\"true\"></i>{EMAIL}</span>" +
				"</p></li>";
			if(type == "company") {
				str = str.replace("{NAME}", info.employee_name).replace("{WORK}", info.post_name).replace("{MOBILE}", info.employee_primary_mobile);
				str = str.replace("{PHONE}", info.employee_office_phone).replace("{EMAIL}", info.employee_email).replace("{LOCH}", deparLogo + info.depa_name);
			} else {
				str = str.replace("{NAME}", info.contact_name).replace("{WORK}", info.contact_job_position_cn||"无").replace("{MOBILE}", info.contact_primary_mobile_number);
				str = str.replace("{PHONE}", info.contact_office_phone_number).replace("{EMAIL}", info.contact_email).replace("{LOCH}", companyLogo + info.client_full_name + "-" + info.depa_name);
			}
			contentDom.append(str);
		}
		if(type == "client")
			changeSearch("client");
		$(".address-book-page .content-box").mCustomScrollbar("update");
		$(".address-book-page .content-box .conten-show").unbind("click").click(function(event) {

			zoom(this);
		});
	}
	//切换通讯录
	function changePage(obj) {
		$(obj).addClass("select").siblings().removeClass("select");
		if($(obj).hasClass("company-nav")) {
			changeSearch("company");
			$(".company-address-book").removeClass("hide").siblings(".client-address-book").addClass("hide");
		} else {
			$(".client-address-book").removeClass("hide").siblings(".company-address-book").addClass("hide");
			if($(".client-address-book li").length == 0) {
				loadData("client");
			} else {
				changeSearch("client");
			}
		}

	}

	function changeSearch(type) {
		console.log(type)
		var seachText = $(".address-book-page .page-search input").val();
		if(type == "company") {
			companyAddressBooksearch(seachText);
		} else {
			clientAddressBooksearch(seachText);
		}
	}
	//上下拉
	function zoom(obj) {
		console.log(obj);
		console.log($(obj).children("i").hasClass("fa-chevron-down"))
		if($(obj).children("i").hasClass("fa-chevron-down")) {
			$(obj).next().slideDown();
			$(obj).children("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		} else {
			$(obj).next().slideUp();
			$(obj).children("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
		}
	}
	//关闭事件
	function offOrOpenPage(type) {
		if(type == "off") {
			$(".address-book-page").animate({
				width: '0px',
				height: '0px',
				opacity: '0'
			}, 300, function() {
				$(".address-book-page").hide();
			});
		} else {
			$(".address-book-page").show();
			$(".address-book-page").animate({
				width: '365px',
				height: '550px',
				opacity: '1'
			}, 300);
		}
	}
	//搜索-企业搜索
	function companyAddressBooksearch(text) {
		console.log(text + "--" + "企业搜索")
		$(".company-address-book li").each(function() {
			if(!pinyinSearch(text, searchTextDispose(this))) {
				$(this).addClass("hide");
			} else {
				$(this).removeClass("hide");
			}
		});
	}

	function clientAddressBooksearch(text) {
		console.log(text + "--" + "客户搜索")
		$(".client-address-book li").each(function() {
			if(!pinyinSearch(text, searchTextDispose(this))) {
				$(this).addClass("hide");
			} else {
				$(this).removeClass("hide");
			}
		});
	}

	function searchTextDispose(obj) {
		var txt = [$(obj).find(".show-name").text(), $(obj).find(".conten-show>span:nth-child(2)").text(), $(obj).find(".conten-hide>span:nth-child(1)").text(), $(obj).find(".conten-hide>span:nth-child(2)").text()];
		return txt;
	}
}