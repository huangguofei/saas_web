//IM聊天
$.fn.chat = function(option) { //点击的jquery对象
	console.log("When I wrote this, only God and I understood what I was doing. Now, God only knows");
	//加载聊天列表
	if($("body .chat-modal").length == 0) {
		var str = "";
		str += "<div class=\"news-left chat-modal pull-left\">";
		str += "<p class=\"chat-page-off hide\"><i class=\"fa fa-minus\" aria-hidden=\"true\"></i><i class=\"fa fa-power-off hide\" aria-hidden=\"true\"></i></p>";
		str += "<div class=\"news-left-top\">";
		str += "<input type=\"text\" class=\"top-search\" placeholder=\"搜索:联系人、讨论组、群\" /><i class=\"fa fa-search btn-top-search\"></i>";
		str += "<div class=\"search-list\">";
		str += "<span class=\"search-title\">联系人</span>";
		str += "<ul class=\"seach-firend\">";
		str += "</ul>";
		str += "<span class=\"search-title\">群组</span>";
		str += "<ul class=\"seach-group\">";
		str += "</ul>";
		str += "</div>";
		str += "<input type=\"button\" value=\"+\" class=\"top-add hide\"/>";
		str += "<input type=\"button\" value=\">\" class=\"top-takeback\" style=\"display:none;\"/>";
		str += "</div>";
		str += "<div class=\"news-left-menu\">";
		str += "<ul>";
		str += "<li class=\"checkstyle\" style=\"position:relative;\" title=\"最近联系列表\">";
		str += "<i class=\"fa fa-commenting\" aria-hidden=\"true\"></i>";
		str += "</li>";
		str += "<li title=\"我的好友列表\">";
		str += "<i class=\"fa fa-user firend-list-ul\" aria-hidden=\"true\"></i>";
		str += "</li>";
		str += "<li title=\"群列表\">";
		str += "<i class=\"fa fa-users group-list-ul\" aria-hidden=\"true\"></i>";
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
		str += "<p class=\"addgroup\"><a href=\"javascript:;\" class=\"top-add\" >创建群组+</a><p>";
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
		str += "<!--个人资料弹窗-->";
		str += "<div class=\"personal-info-page hide\">";
		str += "<div class=\"info-page-top\">";
		str += "<img src=\"../resources/images/case-4.png\" />";
		str += "<p class=\"info-page-data\">";
		str += "<span class=\"info-page-name css-overhidden\" bind=\"employee_name\"></span><br>";
		str += "<span class=\"info-page-post\"><span class=\"css-overhidden\" bind=\"depa_name\"></span><span class=\"css-overhidden\" bind=\"post_title\"></span></span>";
		str += "</p>";
		str += "<i class=\"open-chat\" onclick=\"parent.openChat(this)\"></i>";
		str += "<div class=\"clearfix\"></div>";
		str += "</div>";
		str += "<p class=\"info-page-phone info-list\"><span>办公电话</span><span class=\"phone-number\" bind=\"employee_office_phone\"></span></p>";
		str += "<p class=\"info-page-mobilephone info-list\"><span>手&#12288;&#12288;机</span><span class=\"mobilephone-number\" bind=\"employee_primary_mobile\"></span></p>";
		str += "<p class=\"info-page-E-mail info-list\"><span>邮&#12288;&#12288;箱</span><span class=\"E-mail-number\" bind=\"employee_email\"></span><i class=\"open-email\"></i></p>";
		str += "<p class=\"info-page-QQ info-list\"><span>Q &#12288;&#12288;Q</span><span class=\"QQ-number\" bind=\"employee_qq\"></span>";
		str += "</p>";
		str += "<p class=\"info-page-weixin info-list\"><span>微&#12288;&#12288;信</span><span class=\"weixin-number\" bind=\"employee_wechat\"></span></p>";
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
		str += "<label><input type=\"checkbox\" class=\"informage-bottom-selectall\" />未读同事</label><input type=\"button\" value=\"提醒阅读\" class=\"btn btn-default btn-sm comment-btn btn-remind\" />";
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
		str += "<p class=\"group-set-menu\">群主/管理员</p>";
		str += "<div class=\"group-custodian group-main\">";
		str += "<div class=\"group-custodian-separate\"></div>";
		str += "</div>";
		str += "<p class=\"group-set-menu\">";
		str += "<span class=\"group-man-number\">群成员:15人</span>";
		str += "<span class=\"group-set-change pull-right\">|　转让群主</span>";
		str += "<span class=\"group-set-administrator pull-right\">设置管理员</span>";
		str += "<span class=\"group-set-add pull-right\">添加成员　|</span>";
		str += "</p>";
		str += "<div class=\"group-set-administrator-select\">";
		str += "<span class=\"select-administrator-num select-num\">请选择管理员：";
		//		str += "(<span class=\"already-select\">0</span>/";
		//		str += "<span class=\"all-number\">5</span>)";
		str += "</span>";
		//		str += "<span class=\"select-obj select-num\">请选择转让对象：";
		//str += "</span>";
		str += "<input type=\"button\" value=\"取消\" style=\"color:#999;\" class=\"btn btn-link btn-sm btn-cancel pull-right\" />";
		str += "<input type=\"button\" value=\"保存\" class=\"btn btn-link btn-sm btn-save pull-right\" />";
		str += "<div class=\"clearfix\"></div>";
		str += "</div>";
		str += "<div class=\"group-member group-main\">";
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
	}
	//启动websoket
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
	window.messageChangeRegular = {
		"files": /^\[file_([\s\S]*?)\]$/g,
		"img": /\[img_([\s\S]*?)\]/g,
		"face": /\[em_f([0-9]*).gif\]/g,
		"file": /^([\s\S]+?)\[.*\]$/i
	}
	window.myId = "", myName = "", myAvatar = "", friendData = "", groupData = "", supportStaffData = "";
	var businessId = "BusinessNotifier";
	var type = 1; //？？？？？？？
	window.messageType = {
		"files": 1,
		"txt": 2,
		"video": 3, //视频
		"audio": 4, //语音
		"img": 5
	}
	window.chatObjState = {
		"chat": 1,
		"open": 2,
		"unchat": 3
	}
	window.messageShowType = {
		"objsend": 1,
		"mysend": 2,
		"business": 3
	}
	window.chatPageType = {
		"single": 1,
		"group": 2,
		"other": 3
	}
	var loadMessageMax = 100;
	var chatHistoryPage = 3; //、最近历史消息数量
	var showChatId = "",
		showPage = ""; //打开中的对面id,正在聊天的页面
	var imageStr = "<img class=\"chat-image\" src=\"$1\" border=\"0\" />";
	var faceStr = "<img style=\"width: 20px;height:20px;\" class=\"chat-face\" src=\"../resources/images/face/f$1.gif\" border=\"0\" />";
	var isMinPage = false; //是否被最小化
	var customerServicesData = [];
	$(this).children("a").click(function() {
		if($(".chat-modal").css("display") == "none") {
			$(".chat-modal").show();
			imOrAddressbookShow("im");
			$(".chat-modal").animate({
				width: '300px',
				height: '616px',
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
	$(".chat-modal").unbind("click").click(function() {
		imOrAddressbookShow("im");
	});
	$(".news-left .top-add").unbind("click").click(function(event) {
		var e = window.event || event;
		if(e.stopPropagation) {
			//如果提供了事件对象，则这是一个非IE浏览器
			e.stopPropagation();
		} else {
			//兼容IE的方式来取消事件冒泡 
			window.event.cancelBubble = true;
		}
		addGroup(this);
	});
	//搜索好友群组
	$(".top-search").keyup(function() {
		$(".seach-firend,.seach-group").empty();
		var searchText = $(this).val();
		console.log(searchText)
		var isOnline = "";
		$(".infolist-servicelist li[chat-type]").each(function() {
			var nameText = $(this).find(".tree-name").text();
			var nameId = $(this).attr('data-id');
			var avatar = $(this).find("img").attr('src');
			isOnline = $(this).attr('data-online');
			if(pinyinSearch(searchText, nameText)) {
				$(".seach-firend").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=\"2\" data-id=" + nameId + ">" + nameText + "</li>");

			}
		});
		$(".infolist-grouplist li[chat-type]").each(function() {
			var nameText = $(this).find(".tree-name").text();
			var nameId = $(this).attr('data-id');
			var nameType = $(this).attr('chat-type');
			var avatar = $(this).find("img").attr('src');
			if(pinyinSearch(searchText, nameText)) {
				$(".seach-group").append("<li class=\"search-list-data\" data-avatar='" + avatar + "' chat-type=" + nameType + " data-id=" + nameId + ">" + nameText + "</li>");
			}
		});
		$(".search-list-data").click(function() {
			var data = {
				type: $(this).attr("chat-type"),
				Id: $(this).attr("data-id"),
				Avatar: $(this).attr("data-avatar"),
				Name: $(this).text(),
				Online: isOnline
			};
			openChatPage(data);
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

	window.clickToInfo = function(data) {
		//data = JSON.parse(data);
		var fullName = "同事圈";
		//alert(myId + "," + myName + "," + myAvatar);
		window.parent.openTab(fullName, "views/im-news.html");
	}
	$(".top-takeback,.fa-minus").click(function(event) {
		var e = window.event || event;
		if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
			e.stopPropagation();
		} else {
			//兼容IE的方式来取消事件冒泡 
			window.event.cancelBubble = true;
		}
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
	$(".news-left-menu li").click(function(event) {

		if($(this).index() == 3) {
			clickToInfo();
			//跳转到圈子
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
		//$(".sub-menu-service img").addClass("hide");
		ws.onsend(80, {});
	}
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
				break; //30 - 解散群 （client发起，server再回发）ws.cmdTag.EXITGROUP
			case ws.cmdTag.EXITGROUP:
				exitGroupInform(data);
				break; //31 - 退出群通知 （client发起，server再回发）
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
				break; // 46 - 未读消息数量
			case 50:
				receiveInform(data);
				break; // 41 - 未读消息
			case ws.cmdTag.LINKMANSTICK:
				linkmanStickInform(data);
				break; // 52 - 置顶通知
			case ws.cmdTag.READ_MESSAGE_MY:
				readMessageMy(data);
				break; // 53 - 自己阅读消息
			case 61:
				newFriendDynamicInform(data);
				break; // 61 - 新好友动态
			case 67:
				newMyDynamicInform(data);
				break; // 67 -新与我相关动态
			case 80:
				loadSupportStaff(data);
				break; // 获取客服列表
			case ws.cmdTag.CUSTOMERONLINE:
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
					(data.data.topic_closed_by.employee_id == myId ? "我" : data.data.topic_closed_by.employee_name) + "关闭了讨论<a href=\"javascript:;\" data-title=" +
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

	function linkmanStickInform(data) { //消息置顶
		ws.onsend(ws.cmdTag.LATESTCHARTLIST, {});
	}

	function readMessageMy(data) { //自己阅读消息推送
		if(data) {
			var objType = 1;
			if(isSupportStaff(data.data.session_id)) {
				objType = 4;
			}
			if(isBusiness(data.data.session_id)) {
				objType = 5;
			}
			messageTypeHandle(data.data.session_id, objType, "-", 0);
		}
	}

	function newFriendDynamicInform(data) { //新圈子通知
		mainPublisher.publisheMsg({
			action: data.action,
			msg: data
		});

		hasOpenChatPage(data, "6");
	}

	function newMyDynamicInform(data) { //新动态通知
		mainPublisher.publisheMsg({
			action: data.action,
			msg: data
		});
		hasOpenChatPage(data, "7");
		if($(".chat-open>.all-num").length == 0) {
			$(".chat-open").append("<span class=\"info-num all-num\">1</span>");
		} else {
			var noReadNum = parseInt($(".chat-open>.all-num").text());
			$(".chat-open>.all-num").text(noReadNum + 1);
		}
	}
	//发生错误时的回调
	function onerrorCallback(data) {
		ws = $.webSoket({
			wsServer: WSSERVER,
			protocal: WSPORT,
			isClientCustomer: true,
			onopenCallback: onopenCallback,
			onmessageCallback: onmessageCallback,
			onerrorCallback: onerrorCallback,
			oncloseCallback: oncloseCallback
		});
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
	function loadNoReadInfoNum(data) {
		console.log(data.data);
		if(data.data.unread_notify_num != 0) { //未读业务消息
			$("#msg .icon-animated-bell").remove();
			$("#msg").append("<span class=\"badge badge-danger icon-animated-bell\">" + messageNumShow(data.data.unread_notify_num) + "</span>");
			saveData("#msg .icon-animated-bell", "num", data.data.unread_notify_num);
		}
		var str = "";
		if(data.data.unread_feeds_num == 0) { //没有关于我的动态消息
			if(data.data.unread_moments_num != 0) { //有好友的动态
				str = "<span class=\"info-num new-info-reminder\"></span>";
			}
		} else {
			str = "<span class=\"info-num all-friend-dynamic-num\">" + messageNumShow(data.data.unread_feeds_num) + "</span>";
		}
		$(".news-left-menu li .fa-chrome").append(str);
		saveData(".news-left-menu li .fa-chrome .all-friend-dynamic-num", "num", data.data.unread_feeds_num);
		var allNum = parseInt(data.data.unread_messages_num) + parseInt(data.data.unread_feeds_num);
		if(allNum != 0) { //总共的消息数量（消息+动态）
			$(".chat-open>.info-num").remove();
			$(".chat-open").append('<span class=\"info-num all-num \">' + messageNumShow(allNum) + '</span>');
			saveData(".chat-open>.info-num", "num", allNum);
		}
		//消息数量
		if(data.data.unread_messages_num != 0) {
			$(".news-left-menu li .fa-commenting").append('<span class=\"info-num message-num \">' + messageNumShow(data.data.unread_messages_num) + '</span>');
			saveData(".news-left-menu li .fa-commenting .message-num", "num", data.data.unread_messages_num);
		}
	}
	//滚动条插件
	$(".news-left-infolist>ul").mCustomScrollbar({
		theme: "light-3",
		scrollInertia: 1000,
		scrollButtons: {
			enable: true
		}
	});
	//最近联系人列表
	function loadLatelyFirendList(data) {
		var latelyFirendListData = data.data;
		//清除
		$(".infolist-chatlist .mCSB_container").empty();
		for(var i in latelyFirendListData) {
			var type = latelyFirendListData[i].msg_session_type == '2' ? '1' : '2';
			if(latelyFirendListData[i].group_type == groupCode.businessGroup) {
				type = 6;
			}
			var strsContentText = "";
			if(latelyFirendListData[i].last_message != null) {
				var chatInfo = latelyFirendListData[i].last_message;
				var chatContent = chatInfo.message_content;
				console.log(chatContent)
				if(chatInfo.message_type == 1) {
					if(latelyFirendListData[i].msg_session_type == 2) {
						strsContentText = chatContent.replace(messageChangeRegular.file, '$1[文件]');
					} else {
						strsContentText = "[文件]";
					}
				} else if(chatInfo.message_type == 2) {
					chatContent = chatContent.replace(messageChangeRegular.img, '[图片]').replace(/<br>/g, "");
					chatContent = chatContent.replace(messageChangeRegular.face, faceStr);
					if(latelyFirendListData[i].group_at_num != 0) {
						strsContentText = "<span class=\"at-me\" style=\"color:red;display:inline\">[" + latelyFirendListData[i].last_at_message_from + "@我]</span>" + chatContent;
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
				} else if(chatInfo.message_type == 5) {
					strsContentText = "[图片]";
					if(latelyFirendListData[i].group_type)
						strsContentText = chatInfo.message_send_by_employee_name + ":[图片]";
				}
			}
			console.log(strsContentText)
			var str = "";
			str += "<li onclick=\"openChat(this)\" class=\"" + (latelyFirendListData[i].is_top ? "topstyle" : "") + "\" data-istop=" +
				latelyFirendListData[i].is_top + " data-avatar='" + latelyFirendListData[i].avatar + "' chat-type=" + type + " data-id=" + latelyFirendListData[i].msg_session_id + " data-online=" + latelyFirendListData[i].is_online + ">";
			str += "<img src='" + (latelyFirendListData[i].avatar == "undefined" ? "" : latelyFirendListData[i].avatar) +
				"' class=\"" + (latelyFirendListData[i].msg_session_type == 1 ? "avatar-img" + (latelyFirendListData[i].is_online ? "" : " underline") : "") + " infolist-left pull-left\" />";
			str += "<div class=\"infolist-right pull-right\">";
			str += "<p class=\"infolist-right-top\">";
			str += "<span class=\"tree-name css-overhidden\" title=" + latelyFirendListData[i].title + ">" + latelyFirendListData[i].title + "</span>";
			str += "<span class=\"infolist-time\">" + isTodayOrYesterday(changeDate(latelyFirendListData[i].recent_time)) + "</span>";
			str += "</p>";
			str += "<p class=\"infolist-right-newinfo \"><span class=\"news-info-text\">" + strsContentText + "</span>" +
				(latelyFirendListData[i].unread_num != 0 ? "<span class=\"info-num list-num\">" + latelyFirendListData[i].unread_num + "</span>" : "") + "</p>"; //<span class=\"info-num list-detele\">×</span>
			str += "</div>";
			str += "</li>";
			$(".infolist-chatlist .mCSB_container").append(str);
			saveData(".infolist-chatlist li[data-id=" + latelyFirendListData[i].msg_session_id + "] .list-num", "num", latelyFirendListData[i].unread_num);
			saveData(".infolist-chatlist li[data-id=" + latelyFirendListData[i].msg_session_id + "]", "readMessageId", (latelyFirendListData[i].last_readed_message_id ? latelyFirendListData[i].last_readed_message_id : latelyFirendListData[i].last_message.message_id));
			//			//删除事件
			//			$(".infolist-right-newinfo .list-detele").unbind("click").click(function(event) {
			//				var e = window.event || event;
			//				if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
			//					e.stopPropagation();
			//				} else {
			//					//兼容IE的方式来取消事件冒泡 
			//					window.event.cancelBubble = true;
			//				}
			//
			//			});
			//右键置顶与删除
			$(".infolist-chatlist li").unbind("mousedown").mousedown(function(e) {
				if(e.which == 3) {
					$(this).css("position", "relative");
					if($(this).children(".right-key-menu").length == 0) {
						$(".infolist-chatlist li .right-key-menu").remove();

						if($(this).data("istop")) {
							$(this).append("<ul class=\"right-key-menu\"><li class=\"set-top\">取消置顶</li><li class=\"set-delete\">删除</li></ul>");
						} else {
							$(this).append("<ul class=\"right-key-menu\"><li class=\"set-top\">置顶</li><li class=\"set-delete\">删除</li></ul>");
						}
						if($(this).index() == $(".infolist-chatlist li[data-id]").length - 1)
							$(".infolist-chatlist li .right-key-menu").css("top", 0);
						//置顶点击事件
						$(".infolist-chatlist li .right-key-menu li").unbind("click").click(function(event) {
							var e = window.event || event;
							if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
								e.stopPropagation();
							} else {
								//兼容IE的方式来取消事件冒泡 
								window.event.cancelBubble = true;
							}
							if($(this).hasClass("set-top"))
								setTop(this);
							else
								setDelete(this);

						});
					} else {
						$(this).children(".right-key-menu").remove();
					}
				}
			});

		}
		$(".infolist-chatlist li").bind("contextmenu", function() {
			return false;
		})
		//判断是否是讨论群
		$(".infolist-chatlist>li").each(function(index) {
			var groupId = $(this).attr("data-id");
			if(findIsGroupType(groupId)) {
				$(this).attr("chat-type", "6");
			}
		});
	}

	function setTop(obj) { //置顶
		var data = {
			"msg_session_id": $(obj).parent().parent().attr('data-id'),
			"msg_session_type": judgeType($(obj).parent().parent().attr("chat-type"))
		}
		ws.onsend(ws.cmdTag.LINKMANSTICK, data, function(data) {
			if(data.action == 200)
				ws.onsend(ws.cmdTag.LATESTCHARTLIST, {});
			if(data.action == 500) return false;
		});
	}

	function setDelete(obj) { //删除
		var num = parseInt($(obj).parent().prev().find(".list-num").text());
		var chatId = $(obj).parent().parent().attr('data-id');
		var chatTypes = judgeType($(obj).parent().parent().attr("chat-type"));
		ws.onsend(37, {
			"msg_session_id": chatId,
			"msg_session_type": chatTypes
		}, function(data) {
			if(data.action == 200) {
				informNumChange("reduce", chatId, num);
				$(obj).parent().parent().remove();
				$("#" + chatId + " .list-detele").trigger("click");
			}
		});
	}
	//获取好友列表
	function loadFirendList(data) {
		console.log(data.data)
		friendData = data.data;
		$(".infolist-servicelist .mCSB_container").empty(); //清除
		var companyManNumber = 0;
		loadFirendTree(friendData, ".infolist-servicelist .mCSB_container", "1", "1");
		$(".infolist-servicelist").mCustomScrollbar("update");
	}

	function loadFirendTree(data, parentId, type, level) { //加载好友树据
		if(data.action == 200) return false;
		if(type == 1) { //好友列表
			var treeStr = "<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>";
			var numStr = "<span class=\"tree-num\">{NUMBER}人</span>";
			var addGroupStr = "<span class=\"tree-add\">+</span>"; //onclick=\"addGroup(event,this)\"
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
					if(!data[i].employee_enabled || data[i].employee_id == myId) continue;
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
			$(".infolist-servicelist li .tree-add").unbind("click").click(function(event) {
				var e = window.event || event;
				if(e.stopPropagation) {
					//如果提供了事件对象，则这是一个非IE浏览器
					e.stopPropagation();
				} else {
					//兼容IE的方式来取消事件冒泡 
					window.event.cancelBubble = true;
				}
				addGroup(this);
			});
		} else if(type == 2 || type == 3) { //添加群成员
			var treeStr = "<i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i>";
			var typeStr = "data-type=1";
			var isShowSelf = $(parentId).parents(".tree-list-a").attr("showself");
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
					if(data[i].employee_id == myId) {
						if(isShowSelf)
							isSelectEmp(data[i], $(parentId).parents(".modal-body-main").find(".modal-body-right .body-left-content"));
						continue;
					}
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

	function isSelectEmp(data, container) { //已选人员--默认群主自己
		console.log("要选自己");
		console.log(arguments)
		if(data && container) {
			container.append("<p class=\"list-box my-info\" data-type='1' data-id=" + data.employee_id + ">" + data.employee_name +
				"<span class=\"detele-list-box\" style=\"visibility: hidden;\">×</span></p>");
			container.prev().find(".select-num").text(1);
		}
	}

	function loadGroupList(data) { //获取群组
		console.log(data);
		$(".infolist-grouplist li[data-grouptype]>ul").empty(); //清空
		groupData = data.data;
		for(var i in groupData) {
			var str = "";
			str += "<li onclick=\"openChat(this,event)\" data-depaid=" + groupData[i].group_depa_id + " data-avatar='" + groupData[i].group_avatar + "' chat-type=" + (groupData[i].group_type == 3 ? "6" : "1") + " data-id=" + groupData[i].group_id + ">";
			str += "<img src=" + (groupData[i].group_avatar == "undefined" ? "" : groupData[i].group_avatar) + ">";
			str += "<span class=\"tree-name css-overhidden\">" + groupData[i].group_desc + "</span>";
			str += "</li>";
			$(".infolist-grouplist li[data-grouptype=" + groupData[i].group_type + "]>ul").append(str);
			if(groupData[i].topic) {
				groupData[i].topic.id = groupData[i].group_discussing_data_id;
				groupData[i].topic["type"] = groupData[i].group_discussing_data_type;
			}
			$(".infolist-grouplist li[data-id=" + groupData[i].group_id + "]").data("theme", groupData[i].topic);
		}
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
		//if(!) return false;
		if(!hasOpenChatPage(data, "2")) return false; //是否被打开
		var openPage = ".chat-page-modal-content[data-id=" + (data.data.to_employee ? data.data.to_employee.employee_id : data.data.message_send_by.employee_id) + "]";
		if(data.data.to_employee) {
			data.data.message_send_by_me = true;
		}
		receiveMessage(data, openPage); //消息处理
		rollBottom(data.data.to_employee ? data.data.to_employee.employee_id : data.data.message_send_by.employee_id); //滚动底部
	}
	//接收消息--群发
	function receiveGroupChart(data) {
		console.log("收到一条群消息：");
		console.log(data);
		if(!hasOpenChatPage(data, "1")) return false;
		var openPage = ".chat-page-modal-content[data-id=" + data.data.group_id + "]";
		if(data.data.message_send_by.employee_id == myId) {
			data.data.message_send_by_me = true;
		}
		receiveMessage(data, openPage); //消息处理
		rollBottom(data.data.group_id); //滚动底部
	}
	//接收客服消息
	function receiveLeaderChart(data) {
		console.log("收到一条客服消息：");
		console.log(data);
		if(!hasOpenChatPage(data, "4")) return false;
		var openPage = ".chat-page-modal-content[data-id=" + data.data.message_send_by.user_id + "]";
		receiveMessage(data, openPage); //消息处理
		rollBottom(data.data.message_send_by.user_id); //滚动底部
	}
	//接收消息集中处理
	function receiveMessage(data, content) {
		console.log(arguments)
		var starTime = $(content + " .chat-info>div").last().attr("data-time");
		var changeData = messageChange(data.data); //转换消息
		var str = "";
		if(changeData.message_type == messageType.files) {
			str += messageFile(changeData, $(content).attr("data-chat-type"));
		} else if(changeData.message_type == messageType.txt) {
			str += messageText(changeData, $(content).attr("data-chat-type"));
		} else if(changeData.message_type == messageType.video) {
			str += messageVideo(changeData, $(content).attr("data-chat-type"));
		} else if(changeData.message_type == messageType.audio) {
			str += messageAudio(changeData, $(content).attr("data-chat-type"));
		} else if(changeData.message_type == messageType.img) {
			str += messageImage(changeData, $(content).attr("data-chat-type"));
		}
		$(content + " .chat-info").append(chatTimeShow(starTime, changeDate(changeData.message_time), isFirstChat(changeData.group_id ? changeData.group_id : changeData.message_send_by.employee_id)));
		$(content + " .chat-info").append(str);
		if(changeData.message_type == messageType.files)
			$("#" + changeData.message_id).data("filedata", changeData.message_content);
		bindIncident(); //绑定事件
		$(content + " .chat-info .chat-page-inform-nonews").remove(); //删除无更多历史消息
	}
	//客服上线通知
	function supportStaffOnLineInform(data) {
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
	}

	//-----------重构部分 
	//我发送的消息(tppe:发送的消息类型)
	function sendMessage(msg_content, type, otherData) {
		console.log(msg_content)
		if(msg_content && type) {
			var objType = $(showPage).attr("data-chat-type");
			if(objType == "2") { //发送单人
				sendSingleMessage(msg_content, type, showChatId, otherData);
			} else if(objType == "1" || objType == "6") { //发送群
				sendGroupMessage(msg_content, type, showChatId, otherData);
			} else if(objType == "4") { //发送客服
				sendServiceMessage(msg_content, type, showChatId, otherData);
			}
		}
		//删除无更多历史消息
		$(showPage + " .chat-page-inform-nonews").remove();
	}
	//发送单人消息（type：msg类型）
	function sendSingleMessage(messageContent, type, id, otherData) {
		console.log(arguments)
		ws.onsend(ws.cmdTag.SIGNLECHART, {
			"message": messageContent,
			"message_type": type,
			"to_employee": id
		}, function(data) {
			if(data.action == 200) return false;
			if(data.action == 500) {
				$.showErrorGritter("发送消息失败：" + data.data.message);
				return false;
			}
			data.data.message_content = messageContent;
			sendMessageShow(data.data, "2", type, id, otherData);
		});
	}
	//发送群消息
	function sendGroupMessage(messageContent, type, id, otherData) {
		ws.onsend(ws.cmdTag.GROUPCHART, {
			"at_info": otherData.atData,
			"message": messageContent,
			"message_type": type,
			"to_group": id
		}, function(data) {
			if(data.action == 200) return false;
			if(data.action == 500) {
				$.showErrorGritter("发送消息失败：" + data.data.message);
				return false;
			}
			data.data.message_content = messageContent;
			sendMessageShow(data.data, findIsGroupType(id) ? "6" : "1", type, id, otherData);

		});
	}
	//发送客服消息
	function sendServiceMessage(messageContent, type, id, otherData) {
		ws.onsend(ws.cmdTag.CUSTOMERSINGLECHART, {
			"message": messageContent,
			"message_type": type,
			"to_user": id
		}, function(data) {
			if(data.action == 200) return false;
			if(data.action == 500) {
				$.showErrorGritter("发送消息失败：" + data.data.message);
				return false;
			}
			data.data.message_content = messageContent;
			sendMessageShow(data.data, "4", type, id, otherData);

		});
	}
	//我发送消息显示
	function sendMessageShow(data, objType, msgType, toObjId, otherData) {
		console.log(arguments)
		if(data && objType) {
			var isFirst = isFirstChat(toObjId);
			var msgTime = changeDate(data.timestamp);
			var str = chatTimeShow($(".chat-page-modal-content[data-id=" + toObjId + "] .chat-info>div").last().attr("data-time"), msgTime, isFirst) + messageFormat(messageShowType.objsend);
			var msgMenu = dialogMenu(((objType == "1" && msgType == messageType.txt) ? "1" : "0") + (objType != 4 ? "1" : "0") + ((msgType == messageType.txt || msgType == messageType.img) ? "1" : "0") + (msgType == messageType.files ? "11" : "00"));
			var msgContent = "";
			if(msgType == messageType.files) {
				msgContent = "<img class=\"chat-file-icos\" src=\"" + BASEAPIURL + "/icons/" + (otherData.fileData.ext == "7z" ? "zip" : otherData.fileData.ext == "jpeg" ? "jpg" : otherData.fileData.ext) + ".png\">" + otherData.fileData.name;
				str = str.replace("{PATH}", otherData.fileData.path)
			} else if(msgType == messageType.txt) {
				msgContent = messageChange(data, msgType).message_content;
			} else if(msgType == messageType.video) {
				msgContent = "<video width=\"320\" height=\"240\" controls src=" + data.message_content + "></video>";
			} else if(msgType == messageType.audio) {
				msgContent = "<audio controls><source src=" + data.message_content + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio>";
			} else if(msgType == messageType.img) {
				msgContent = "";
			}
			var msgRead = messageRead("", objType, toObjId);
			var msgEmpInfo = "";
			str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", myId).replace("{INFO}", msgEmpInfo);
			str = str.replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
			$(".chat-page-modal-content[data-id=" + toObjId + "] .chat-info").append(str);
			if(msgType == messageType.files) //存数据
				saveData("#" + data.message_id, "filedata", otherData.fileData);
			rollBottom(toObjId);
			bindIncident(); //绑定事件
			ws.onsend(22, {});
			//updataNewInformation(toObjId, messageSimplify(otherData.msg_content, myName, objType, msgType), isTodayOrYesterday(msgTime));
		}
	}
	//文件消息
	function messageFile(data, type) {
		var str = messageFormat(data.message_send_by_me ? messageShowType.objsend : messageShowType.mysend);
		var msgTime = changeDate(data.message_time);
		var msgMenu = dialogMenu("0" + ((data.message_send_by_me && type != 4) ? "1" : "0") + "011");
		var msgContent = "<img class=\"chat-file-icos\" src=\"" + BASEAPIURL + "/icons/" + (data.message_content.ext == "7z" ? "zip" : data.message_content.ext == "jpeg" ? "jpg" : data.message_content.ext) + ".png\">" + data.message_content.name;
		var msgRead = messageRead(data, type);
		var msgEmpInfo = "<img data-id=" + data.message_send_by.employee_id + " src='" + (data.message_send_by.employee_avatar ? data.message_send_by.employee_avatar : "") + "' class=\"pull-left\" " + (type != 4 ? "onclick=\"openPersonageInfo(this)\"" : "") + ">" +
			"<p class=\"chat-info-name\">" + data.message_send_by.employee_name + "</p>";
		str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", data.message_send_by.employee_id).replace("{INFO}", msgEmpInfo);
		str = str.replace("{PATH}", data.message_content.path).replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
		return str;
	}
	//文字类型（兼图片）
	function messageText(data, type) {
		console.log(data);
		var str = messageFormat(data.message_send_by_me ? messageShowType.objsend : messageShowType.mysend);
		var msgTime = changeDate(data.message_time);
		var msgMenu = dialogMenu(((type == 1 && data.message_send_by_me) ? "1" : "0") + ((data.message_send_by_me && type != 4) ? "1" : "0") + "100");
		var msgContent = data.message_content;
		var msgRead = messageRead(data, type);
		var msgEmpInfo = "<img data-id=" + data.message_send_by.employee_id + " src='" + (data.message_send_by.employee_avatar ? data.message_send_by.employee_avatar : "") + "' class=\"pull-left\" " + (type != 4 ? "onclick=\"openPersonageInfo(this)\"" : "") + ">" +
			"<p class=\"chat-info-name\">" + data.message_send_by.employee_name + "</p>";
		str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", data.message_send_by.employee_id).replace("{INFO}", msgEmpInfo);
		str = str.replace("{PATH}", data.message_content.path).replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
		return str;
	}
	//语音类型
	function messageAudio(data, type) {
		var str = messageFormat(data.message_send_by_me ? messageShowType.objsend : messageShowType.mysend);
		var msgTime = changeDate(data.message_time);
		var msgMenu = dialogMenu("0" + ((data.message_send_by_me && type != 4) ? "1" : "0") + "000");
		var msgContent = "<audio controls><source src=" + data.message_content + " type=\"audio/ogg\">您的浏览器不支持 audio 元素。</audio>";
		var msgRead = messageRead(data, type);
		var msgEmpInfo = "<img data-id=" + data.message_send_by.employee_id + " src='" + (data.message_send_by.employee_avatar ? data.message_send_by.employee_avatar : "") + "' class=\"pull-left\" " + (type != 4 ? "onclick=\"openPersonageInfo(this)\"" : "") + ">" +
			"<p class=\"chat-info-name\">" + data.message_send_by.employee_name + "</p>";
		str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", data.message_send_by.employee_id).replace("{INFO}", msgEmpInfo);
		str = str.replace("{PATH}", data.message_content.path).replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
		return str;
	}
	//视频类型（待完善）
	function messageVideo(data, type) {
		var str = messageFormat(data.message_send_by_me ? messageShowType.objsend : messageShowType.mysend);
		var msgTime = changeDate(data.message_time);
		var msgMenu = dialogMenu("0" + ((data.message_send_by_me && type != 4) ? "1" : "0") + "000");
		var msgContent = "<video width=\"320\" height=\"240\" controls src=" + data.message_content + "></video>";
		var msgRead = messageRead(data, type);
		var msgEmpInfo = "<img data-id=" + data.message_send_by.employee_id + " src='" + (data.message_send_by.employee_avatar ? data.message_send_by.employee_avatar : "") + "' class=\"pull-left\" " + (type != 4 ? "onclick=\"openPersonageInfo(this)\"" : "") + ">" +
			"<p class=\"chat-info-name\">" + data.message_send_by.employee_name + "</p>";
		str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", data.message_send_by.employee_id).replace("{INFO}", msgEmpInfo);
		str = str.replace("{PATH}", data.message_content.path).replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
		return str;
	}
	//图片类型
	function messageImage(data, type) {
		console.log(data)
		var str = messageFormat(data.message_send_by_me ? messageShowType.objsend : messageShowType.mysend);
		var msgTime = changeDate(data.message_time);
		var msgMenu = dialogMenu("0" + ((data.message_send_by_me && type != 4) ? "1" : "0") + "100");
		var msgContent = "<img class=\"chat-image\" src=\"" + data.message_content + "\" border=\"0\">";
		var msgRead = messageRead(data, type);
		var msgEmpInfo = "<img data-id=" + data.message_send_by.employee_id + " src='" + (data.message_send_by.employee_avatar ? data.message_send_by.employee_avatar : "") + "' class=\"pull-left\" " + (type != 4 ? "onclick=\"openPersonageInfo(this)\"" : "") + ">" +
			"<p class=\"chat-info-name\">" + data.message_send_by.employee_name + "</p>";
		str = str.replace("{ID}", data.message_id).replace("{TIME}", msgTime).replace("{OBJID}", data.message_send_by.employee_id).replace("{INFO}", msgEmpInfo);
		str = str.replace("{PATH}", data.message_content).replace("{ACTION}", msgMenu).replace("{MESSAGE}", msgContent).replace("{READSTATE}", msgRead);
		return str;
	}

	function bindFileClickRead() {
		$(".chat-page-modal .chat-info>div[data-path] .article").unbind('click').click(function() {
			if($(this).children().is(".chat-file-icos")) {
				var filePath = $(this).parents(".message-info").data("path");
				console.log(filePath != "undefined")
				if(filePath != "undefined") {
					var fileData = $(this).parents(".message-info").data("filedata");
					console.log(fileData)
					onlineRead(fileData.name, fileData.path_code);
				}
			}
		});
	}
	//业务消息
	function businessMessage(data) {

	}
	//数据填充
	function dataFill(str, data) {
		if(str && data) {
			str = str.replace(/(\{[\S]*?\})/g, "|")
		}
	}
	//dom存数据
	function saveData(content, name, data) {
		$(content).data(name, data);
	}
	//聊天消息格式获取
	function messageFormat(type) {
		if(type) {
			if(type == messageShowType.objsend) { //我发送的-1
				return "<div class=\"chat-info-send message-info\" id=\"{ID}\" data-time=\"{TIME}\" data-from-id=\"{OBJID}\" data-path=\"{PATH}\">{ACTION}" +
					"<div class=\"demo clearfix fr pull-left\">" +
					"<span class=\"triangle right\"></span>" +
					"<div class=\"article\">{MESSAGE}</div>" +
					"<span class=\"chat-info-send-num pull-right\">{READSTATE}</span></div>" +
					"<img src=" + myAvatar + " class=\"pull-right\">" +
					"<div class=\"clearfix\"></div></div>";
			} else if(type == messageShowType.mysend) { //别人发送的-2
				return "<div class=\"chat-info-receive message-info\" id=\"{ID}\" data-time=\"{TIME}\" data-from-id=\"{OBJID}\" data-path=\"{PATH}\">{ACTION}{INFO}" +
					//					"{AVATAR}<p class=\"chat-info-name\">{NAME}</p>" +
					"<div class=\"demo clearfix\">" +
					"<span class=\"triangle\"></span>" +
					"<div class=\"article\">{MESSAGE}</div>" +
					"</div></div>";
			} else { //业务消息
				return "<div class=\"chat-info-receive\" id=\"{ID}\" data-time=\"{TIME}\" data-type=\"{MESSAGETYPE}\" data-info-type=\"{BUSINESSTYPE}\">" +
					"<img src=\"{AVATAR}\" class=\"pull-left\">" +
					"<div class=\"demo clearfix\">" +
					"<p class=\"chat-time\" style=\"margin: 0;text-align: left;font-size: 12px;\">{SHOWTIME}</p>" +
					"<div class=\"thing-box article\" data-toid=\"{TOID}\" data-date=\"{DATE}\" {DATATYPE}>" +
					"<p class=\"thing-name\">\"{TITLE}\"</p>" +
					"<p class=\"thing-theme shrink\" title=\"{BUSINESTITLE}\" >{MESSAGE}</p>" +
					"</div></div></div>";
			}
		}
	}
	//聊天语句菜单
	function dialogMenu(index) {
		var menu = ["<span class=\"stick-discussion\">置顶讨论</span>", "<span class=\"mgroupmember\">M Ta们</span>", "<span class=\"chat-copy\">复制</span>", "<span class=\"file-download\">下载</span>", "<span class=\"file-transmit\">转发</span>"];
		var str = "";
		for(var i in index) {
			if(index[i] == 1) {
				str += ((str ? "|" : "") + menu[i]);
			}
		}
		return "<p class=\"chat-menu\">" + str + "</P>";
	}
	//聊天对象状态（1正在聊天、2打开但为聊天、3未打开)
	function chatObjectState(id) {
		if(id) {
			if($("#" + id).length > 0) {
				if($("#" + id).hasClass("selectstyle")) {
					return chatObjState.chat; //正在聊天
				} else {
					return chatObjState.open; //打开未聊天
				}
			} else {
				return chatObjState.unchat; //未打开
			}
		} else {
			$.showErrorGritter("对方ID为空！");
		}
	}
	//消息转换
	function messageChange(data, type) {
		if(data) {
			if((data.message_type ? data.message_type : type) == messageType.files) { //文件转换
				data.message_content = data.message_content.replace(messageChangeRegular.files, "$1");
				data.message_content = JSON.parse(data.message_content);
			} else if((data.message_type ? data.message_type : type) == messageType.txt) { //文本图片表情转换
				data.message_content = data.message_content.replace(messageChangeRegular.img, imageStr);
				data.message_content = data.message_content.replace(messageChangeRegular.face, faceStr);
			} else if((data.message_type ? data.message_type : type) == messageType.img) {
				data.message_content = data.message_content.replace(messageChangeRegular.img, imageStr);
			}
			return data;
		} else {
			$.showErrorGritter("转换消息失败！");
		}
	}
	//是不是我发送的
	function isMySend(id) {
		if(id) {
			if(id == myId) {
				return true;
			} else {
				return false;
			}
		}
	}

	function isFirstChat(id) { //是否是第一次聊天
		if(id) {
			var messageNum = $(".chat-page-modal-content[data-id=" + id + "] .chat-info>div").length;
			if(messageNum == 0)
				return true;
			else
				return false;
		}
	}
	//消息数量显示处理
	function messageNumShow(num) {
		var messageNumber = parseInt(num);
		if(num > 99) {
			num = "99+";
		}
		return num;
	}
	//消息简化
	function messageSimplify(data, sendName, objType, msgType) {
		console.log(arguments);
		if(objType) {
			var sender = "";
			if(objType == "1" || objType == "6") {
				sender = sendName + ":";
			}
			if(msgType == messageType.files) {
				sender += "[文件]";
			} else if(msgType == messageType.txt) {
				sender += data.replace(/\[img_([\s\S]*?)\]/g, '[图片]').replace(/\[em_f([0-9]*).gif\]/g, faceStr);
			} else if(msgType == messageType.video) {
				sender += "[视频]";
			} else if(msgType == messageType.audio) {
				sender += "[语音]";
			} else if(msgType == messageType.img) {
				sender += "[图片]";
			}
			console.log(sender);
			return sender;
		}
	}
	//无更多消息
	function noMessage(data) {
		if(data.length == 0 && $(showPage + " .chat-page-inform-nonews").length == 0) {
			$(showPage + " .chat-info").prepend("<p class=\"chat-page-inform-nonews\">无更多历史消息！</p>")
			chatHistoryLoading("end");
			return false;
		}
	}
	//消息阅读情况
	function messageRead(data, type, toObjId) {
		console.log(arguments);
		//获取未读数量
		var isReadStr = "";
		if(data) {
			if(data.message_send_by_me) { //是我发送的
				if(type == 2) {
					if(data.read_status && data.read_status.unread.num == 0) {
						isReadStr = "已读";
					} else {
						isReadStr = "未读";
					}
				} else if(type != 4) {
					if(data.read_status && data.read_status.unread.num == 0) {
						isReadStr = "全部已读";
					} else {
						//alert(parseInt($(".chat-page-modal-content[data-id=" + data.group_id + "] .info-nums").text().replace(/\D+/, "")) - 1)
						isReadStr = "<span>" + (data.read_status ? (parseInt(data.read_status.unread.num)) : (parseInt($(".chat-page-modal-content[data-id=" + data.group_id + "] .info-nums").text().replace(/\D+/, "")) - 1)) + "</span>人未读";
					}
				}
			}
		} else {
			isReadStr = (type == "1" || type == "6") ? "<span>" + (parseInt($(".chat-page-modal-content[data-id=" + toObjId + "] .info-nums").text().replace(/\D+/, "")) - 1) + "</span>人未读" : (type == "4" ? "" : "未读");
		}
		return isReadStr;
	}
	//查看更多
	function viewMore(i, length) {
		if(i == length - 1) {
			return "<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa-clock-o-s\"></i>查看更多消息</a>";
		} else {
			return "";
		}

	}
	//时间显示
	function chatTimeShow(startTime, endTime, isFrist) {
		console.log(arguments)
		if(isFrist)
			return "<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(startTime ? startTime : endTime, true) + "</p>";
		if(!isDifferTime(startTime, endTime, 180)) {
			return "<p class=\"chat-page-main-toptime\">" + isTodayOrYesterday(endTime ? endTime : startTime, true) + "</p>";
		} else {
			return "";
		}
	}
	//加载到最大消息数量目前为100条
	function messageLoadUpperLimit() {
		if($(showPage + " .chat-info>div").length >= loadMessageMax) {
			if($(showPage + " .view-all-chat-history").length == 0) {
				$(showPage + " .chat-info").prepend("<p class='view-all-chat-history'>更多消息请在<a href='javascript:;' onclick=\"$('.char-info-record').trigger('click');\">聊天消息</a>中查看</p>");
			}
			$(showPage + " .chat-page-main-loadmore").remove();
			return false;
		} else {
			return true;
		}
	}
	//滚动到底部
	function rollBottom(id) {
		if(id) {
			if($(".chat-page-modal-content[data-id=" + id + "]" + " .chat-info").length != 0)
				$(".chat-page-modal-content[data-id=" + id + "]" + " .chat-info").scrollTop($(".chat-page-modal-content[data-id=" + id + "]" + " .chat-info")[0].scrollHeight);
		} else {
			$(showPage + " .chat-info").scrollTop($(showPage + " .chat-info")[0].scrollHeight);
		}
	}
	//滚动到指定位置
	function rollLocation(id) {
		if(id) {
			var container = (showPage + " .chat-info");
			var scrollTo = ("#" + id);
			$(container).animate({
				scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
			}, 1);
		}
	}
	//好友最近历史加载
	function loadChatRecord(data, type) {
		console.log(data);
		var chatRecordData = data.data.reverse();
		noMessage(chatRecordData); //判断是否无消息
		var showMessageNum = $(showPage + " .chat-info>div").length;
		var isFirst = "";
		if(showMessageNum == 0 && chatRecordData.length == 1)
			isFirst = true;
		for(var i = 0; i < chatRecordData.length; i++) {
			var chatTime = changeDate(chatRecordData[i].message_time);
			console.log(chatRecordData[i + 1])
			var chatTimes = chatRecordData[i + 1] ? changeDate(chatRecordData[i + 1].message_time) : "";
			var str = viewMore(i, chatRecordData.length); //查看更多；
			var changeData = messageChange(chatRecordData[i]); //转换消息
			//$(showPage + " .chat-info>div").first().attr("data-time")
			str += chatTimeShow(chatTime, chatTimes, isFirst); //时间显示
			if(chatRecordData[i].message_type == messageType.files) {
				str += messageFile(changeData, $(showPage).attr("data-chat-type"));
			} else if(chatRecordData[i].message_type == messageType.txt) {
				str += messageText(changeData, $(showPage).attr("data-chat-type"));
			} else if(chatRecordData[i].message_type == messageType.video) {
				str += messageVideo(changeData, $(showPage).attr("data-chat-type"));
			} else if(chatRecordData[i].message_type == messageType.audio) {
				str += messageAudio(chatRecordData[i], $(showPage).attr("data-chat-type"));
			} else if(chatRecordData[i].message_type == messageType.img) {
				str += messageImage(chatRecordData[i], $(showPage).attr("data-chat-type"));
			}
			oneMessageRead(chatRecordData);
			str += messageNewBoundary(showChatId, changeData);
			if(messageLoadUpperLimit()) {
				$(showPage + " .chat-info").prepend(str);
				bindIncident(); //绑定事件
			}
			chatHistoryLoading("end");
			if(chatRecordData[i].message_type == messageType.files)
				$("#" + chatRecordData[i].message_id).data("filedata", changeData.message_content);
		}
		if($(showPage + " .view-all-chat-history").length == 0)
			if(chatRecordData[0])
				rollLocation(chatRecordData[0].message_id); //滚动到指定位置

	}
	//业务最近消息
	function loadBusinessInform(data) {
		chatHistoryLoading("end");
		console.log(data);
		chatRecordData = data.data.reverse();
		if(chatRecordData.length == 0 && $(showPage + " .chat-page-inform-nonews").length == 0) {
			$(showPage + " .chat-info").prepend("<p class=\"chat-page-inform-nonews\">无更多历史消息！</p>")
			return false;
		}
		for(var i in chatRecordData) {
			var infoData = chatRecordData[i];
			oneMessageRead(chatRecordData);
			infoShow(infoData, true);
			if(i == chatRecordData.length - 1) {
				$(showPage + " .chat-info").prepend("<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa-clock-o-s\"></i>查看更多消息</a>");
			}
			var container = (showPage + " .chat-info");
			var scrollTo = ("#" + chatRecordData[0].message_id);
			//			$(container).animate({
			//				scrollTop: $(scrollTo).offset().top - $(container).offset().top + $(container).scrollTop()
			//			}, 1);
			rollLocation(chatRecordData[0].message_id);
			bindIncident();
		}
	}
	//第一条是否已读
	function oneMessageRead(data) {
		if($(showPage + " .chat-info").children().length == 0) { //判断是否是最新一条消息
			var newInfoId = data[0].message_id;
			infoIsRead(newInfoId, openPageType());
			//}
		}
	}

	function isSupportStaff(id) { //判断是否是客服
		if(id) {
			if(JSON.stringify(supportStaffData).indexOf(id) == -1) {
				return false;
			} else {
				return true;
			}
		}
	}

	function isBusiness(id) { //判断是否是业务
		if(id) {
			if(id == businessId) {
				return true;
			} else {
				return false;
			}
		}
	}
	//以上是历史消息(对象Id，消息ID)
	function messageNewBoundary(objId, data) {
		console.log(arguments);
		if(objId && data) {
			var str = "";
			if(!data.message_send_by_me) {
				var lastReadMessageId = $(".infolist-chatlist li[data-id=" + objId + "]").data("readMessageId");
				if($(".infolist-chatlist li[data-id=" + objId + "]").length == 0)
					lastReadMessageId = $(".sub-menu-service a[data-id=" + objId + "]").data("readMessageId");
				console.log(data.message_id + "===" + lastReadMessageId)
				if(data.message_id == lastReadMessageId && $(".chat-page-modal-content[data-id=" + objId + "] .chat-info .message-boundary").length == 0) {
					str = "<p class=\"chat-time message-boundary\">————————————以上是历史消息————————————</p>";
				} else {
					str = "";
				}
			} else if(isFirstNoReadInfo && $(".chat-page-modal-content[data-id=" + objId + "] .chat-info .message-boundary").length == 0) { //我发的
				isFirstNoReadInfo = false;
				str = "<p class=\"chat-time message-boundary\">————————————以上是历史消息————————————</p>";
			}
			return str;
		}
	}
	//消息已读通知
	function infoReadInform(data) {
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
		if($(".chat-page-modal-content[data-id=" + data.data.group_id + "] .discussion-buttom .off-theme").length == 0) {
			$(".chat-page-modal-content[data-id=" + data.data.group_id + "] .discussion-buttom").append("<span class=\"off-theme\">关闭</span>");
			bindIncident();
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

	function exitGroupInform(data) {
		console.log("退出群通知");
		var peopleNum = $(".chat-page-modal-content[data-id='" + data.data.group_id + "'] .chat-page-top .info-nums");
		peopleNum.text((parseInt(peopleNum.text()) - 1) + "人");
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
	function findIsGroupType(groupId) {
		for(var i in groupData) {
			if(groupId == groupData[i].group_id) {
				if(groupData[i].group_type == 3) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
	//添加群
	function addGroup(obj) {
		if($(obj).hasClass("top-add")) {
			groupEstablish("1");
		} else {
			var otherInfo = {};
			otherInfo.deparId = $(obj).parent().attr("data-id");
			var groupName = $(obj).prevAll(".tree-name").text();
			groupEstablish("2", groupName, otherInfo);
		}

	}
	//function is
	//添加群：type:1-普通群,2-部门群，3-讨论群，groupName:默认群名字(type为2和3时必传),isAddgroop:是否添加群，默认添加-true
	window.groupEstablish = function(type, groupName, otherInfo, isAddGroup) {
		console.log(arguments)
		if(!ws) {
			$.showErrorGritter("请先登录聊天！");
			return false;
		}
		console.log("群类型:" + type);
		isAddGroup = isAddGroup == undefined ? true : isAddGroup;
		console.log(isAddGroup);
		addGroupPage();
		var titleText = (type == "1" ? "普通" : (type == "2" ? "部门" : "讨论"));
		//titleText = isAddGroup ? titleText : "/添加群成员";
		var modalId = $.modal({
			showFooter: false
		}).showOfLarge("创建" + titleText + "群组", ".group-establish-page", function() {});
		var contentBody = "#" + modalId + " .modal-body";
		if(type != 2) { //不是部门群
			$(contentBody + " .add-group-member-btn").attr("value", "下一步");
			ws.onsend(20, {
				"show_disabled": false
			}, function(data) { //加载列表
				console.log(data)
				var infoData = data.data;
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载好友失败！");
					return false;
				}
				$(contentBody + " .tree-list-a").empty();
				$(contentBody + " .tree-list-a").attr("showself", true);
				loadFirendTree(infoData, contentBody + " .tree-list-a", "2", "1");
				if(!isAddGroup) {
					$(contentBody + " .modal-body-right .body-left-content").empty();
					$(contentBody + " .modal-body-right .select-num").text(0);
				}
				addClick(contentBody);
			});
		} else {
			var depaId = $(".infolist-grouplist li[data-id=" + otherInfo.groupId + "]").attr('data-depaid');
			loadDeparEmp(depaId, contentBody);
		}
		//搜索
		if(!isAddGroup) { //只添加群成员
			showGroupMember(modalId, contentBody, otherInfo);
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
			$(contentBody + " .add-group-member-btn").click(function() { //确认
				if($(contentBody + " .add-group-name").val() == "") {
					$.showErrorGritter("群名称不能为空！请重新输入");
					return false;
				}
				groupName = $(contentBody + " .add-group-name").val();
				ws.onsend(ws.cmdTag.HAS_REPEAT_GROUP_NAME, {
					"group_desc": groupName,
					"group_type": type
				}, function(data) {
					console.log(data)
					if(data.action == 500) {
						$.showErrorGritter(data.data.message);
						return false;
					} else {
						if(data.action == 200)
							return false;
						if(type != groupCode.deparGroup) { //创建普通群、讨论群
							if($(contentBody + " .load-group-member-list").hasClass("hide")) { //下一步添加成员
								$(contentBody + " .back-btn").val("上一步");
								$(contentBody + " .add-group").addClass("hide").siblings().removeClass("hide");
							} else { //创建群和添加成员
								var groupId = [];
								$(contentBody + " .list-box").each(function(index) {
									if($(this).hasClass("my-info")) return true;
									groupId.push($(this).attr("data-id"));
								});
								if(groupId.length == 0) {
									$.showErrorGritter("群成员数不能小于2人，请重新选择！");
									return false;
								}
								var infoData = {};
								if(type == groupCode.commonGroup) {
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
										"discussing_data_type": otherInfo.type
									}
								}
								createGroup(infoData, titleText, modalId, groupId, addGroupMember);
							}
						} else { //部门群
							var infoData = {
								"department_id": (otherInfo.deparId ? otherInfo.deparId : ""),
								"group_type": type,
								"group_name": groupName,
							}
							createGroup(infoData, titleText, modalId);
						}
					}
				});

			});
		}
	}

	function createGroup(sendData, title, modalId, empIds, callBack) { //创建群
		ws.onsend(ws.cmdTag.CREATEGROUP, sendData, function(data) {
			if(data.action == 500) {
				$.showErrorGritter(data.data.message);
				return false;
			}
			if(data.action == 200)
				return false;
			callBack && callBack({ //添加群成员
				"employee_ids": empIds,
				"member_exist_success": 1,
				"group_id": data.data.group_id
			}, modalId, "创建" + title + "群成功！");
			if(!empIds) {
				$.showSuccessGritter("创建" + title + "群成功！");
				$("#" + modalId).modal("hide");
			}

		});
	}

	function addGroupMember(sendData, modalId, title, callback) { //添加群成员
		console.log(arguments)
		ws.onsend(ws.cmdTag.ADDGROUPMEMBER, sendData, function(data) {
			if(data.action == 200) {
				callback && callback();
				$("#" + modalId).modal("hide");
				ws.onsend(21, {});
				$.showSuccessGritter(title);
			}
			if(data.action == 500) {
				$.showErrorGritter("添加群成员失败:" + data.data.message);
				return false;
			}
		});
	}

	function showGroupMember(modalId, contentBody, otherInfo) {
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
			addGroupMember({
				"employee_ids": groupId,
				"member_exist_success": 1,
				"group_id": otherInfo.groupId
			}, modalId, "添加成员成功", function() {
				loadGroupSet(otherInfo.modaName);
			});

		});
	}

	function defaultSelect(ids, container) {
		if(ids.length > 0)
			for(var i in ids)
				$(container).append("<p class=\"list-box my-info\" data-type=\"1\" data-id=\"\"><span class=\"detele-list-box\" style=\"visibility: hidden;\">×</span></p>")
	}

	function loadDeparEmp(id, contentBody) { //加载部门以下的人和负责人
		var departmentUrl = SAASAPIS.BS.company.employees + "/simple?depa_mode=7&depa_id=" + id + "&filter_account=1";
		$.ajaxGet(departmentUrl, function(response) {
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
	//添加群弹窗
	function addGroupPage() {
		if($("body .group-establish-page").length == 0) {
			str += "<div class=\"group-establish-page\">";
			str += "<div class=\"group-main\">";
			str += "<label class=\"add-group\">群名称：<input type=\"text\" class=\"add-group-name\" maxlength=\"20\"></label>";
			str += "<!--添加群成员弹窗-->";
			str += "<div class=\"load-group-member-list hide\">";
			str += "<div class=\"modal-body-main\">";
			str += "<div class=\"modal-body-left pull-left\">";
			str += "<p class=\"body-left-menu\">请选择群成员:</p>";
			str += "<div class=\"body-left-content\">";
			str += "<div class=\"body-left-content-top\">";
			str += "<input type=\"text\" class=\"body-left-content-top-search\" value=\"\" placeholder=\"搜索姓名\" /></div>";
			str += "<div class=\"body-left-content-list\">";
			str += "<ul class=\"tree-list-a\"></ul></div></div></div>";
			str += "<div class=\"modal-body-right pull-right\">";
			str += "<p class=\"body-left-menu\">已选群成员:<span class=\"pull-right\">已选<span class=\"select-num\">0</span>人</span></p>";
			str += "<div class=\"body-left-content\"></div></div>";
			str += "<div class=\"clearfix\"></div></div></div></div>";
			str += "<div class=\"modal-body-buttom\">";
			str += "<input type=\"button\" class=\"btn btn-default add-group-member-btn\" value=\"确认\" />";
			str += "<input type=\"button\" class=\"btn btn-default back-btn\" value=\"取消\" /></div></div>";
			$("body").append(str);
		}
	}

	function addClick(contentBody) {
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
		$(contentBody + " .tree-bottom").unbind("click").click(function() {
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
					"<span class=\"detele-list-box\" onclick=\"var selectNum=parseInt($(this).parents('.modal-body-right').find('.select-num').text())-1;" +
					"$(this).parents('.modal-body-right').find('.select-num').html(selectNum);$(this).parent().remove();\">×</span></p>");
			}
		});
		$(contentBody + " .body-left-content-top-search").unbind("keyup").keyup(function(event) {
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
					if(pinyinSearch(searchText, name) && $(contentBody + " .search-list .friend-list li[data-id=" + id + "]").length == 0) { //存在
						$(contentBody + " .search-list .friend-list").append("<li data-type=" + chatObjType + " data-id=" + id + " class=\"tree-bottom\"><span class=\"tree-name\">" + name + "</span></li>");
					}
				});
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
					if(pinyinSearch(searchText, name)) {
						if($(this).parents().is(".group-chat-list")) {
							$(contentBody + " .search-list .group-list").append("<li style='width:180px' data-type=" + chatObjType + " data-id=" + id + " class=\"single-apostrophe tree-bottom\"><span class=\"tree-name\">" + name + "</span></li>");
						} else {
							$(contentBody + " .search-list .friend-list").append("<li data-type=" + chatObjType + " data-id=" + id + " class=\"tree-bottom single-apostrophe\"><span class=\"tree-name\">" + name + "</span></li>");
						}
					}
				});
			}
			addClick(contentBody);
			$(this).focus();
		});
		$("body").unbind("click").click(function(event) {
			if($(event.target).parents(".body-left-content-top").length == 0) {
				$(contentBody + ".search-list").remove();
			}
		});
	}
	//聊天列表y击
	window.openChat = function(obj, event) {
		var data = {};
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
					data = {
						type: $(obj).attr("chat-type"),
						Id: $(obj).attr("data-id"),
						Avatar: avatar,
						Name: name,
						Online: isOnline
					};
				}
			} else if($(obj).parents().is(".infolist-grouplist")) {
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
					data = {
						type: $(obj).attr("chat-type"),
						Id: $(obj).attr("data-id"),
						Avatar: avatar,
						Name: name
					};
				}
			} else if($(obj).parent().is(".info-page-top")) {
				$("#" + $(obj).attr("data-bdy")).modal('hide');
				data = {
					type: "2",
					Id: $(obj).attr("data-id"),
					Avatar: $(obj).attr("data-avatar"),
					Name: $(obj).attr("data-name"),
					Online: $(obj).attr("data-online")
				};
			} else {
				//$(obj).addClass("selectstyle").siblings().removeClass("selectstyle");
				var avatar = $(obj).attr("data-avatar");
				var name = $(obj).find(".tree-name").text();
				var isOnline = $(obj).attr("data-online");
				console.log($(obj).attr("data-id"));
				data = {
					type: $(obj).attr("chat-type"),
					Id: $(obj).attr("data-id"),
					Avatar: avatar,
					Name: name,
					Online: isOnline
				};
			}
		} else { //客服
			data = {
				type: $(obj).attr("chat-type"),
				Id: $(obj).attr("data-id"),
				Avatar: $(obj).find("img").attr("src"),
				Name: $(obj).find(".css-overhidden").text(),
				Online: $(obj).attr("data-online")
			};
		}
		if($(obj).find(".list-num").length != 0) {
			var noReadNum = parseInt($(obj).find(".list-num").text());
			console.log(noReadNum);
			//informNumChange("reduce", $(obj).attr("data-id"), noReadNum);
			messageTypeHandle($(obj).attr("data-id"), data.type, "-", noReadNum);
		}
		if(!isNullArry(data))
			openChatPage(data);

	}
	//判断是否是空对象
	function isNullArry(obj) {
		for(var i in obj)
			return false;
		return true;
	}

	//收消息判断是否打开，没打开未读消息+1,并返回false
	//type:1-单人，2-群，3-新圈子，4-新动态，5-客服
	//1群，2单人，3通知。4客服、5业务。6新圈子。7新动态
	function hasOpenChatPage(data, type) {
		console.log(data)
		if(type != 6 && type != 7) { //除圈子
			var objId = "";
			objId = data.data.message_send_by.employee_id;
			if(type == 1 || type == 2) { //更新聊天列表
				var showTetxStr = "";
				if(type == 2) {
					objId = (data.data.to_employee ? data.data.to_employee.employee_id : data.data.message_send_by.employee_id);
				} else {
					objId = data.data.group_id;
				}
				//判断是否在最近聊天会话列表里面，不存在则刷新
				if($(".infolist-chatlist li[data-id=" + objId + "]").length == 0) {
					ws.onsend(22, {});
					ws.onsend(46, {});
				}
				showTetxStr = messageSimplify(data.data.message_content, data.data.message_send_by.employee_name, type, data.data.message_type);
				console.log(showTetxStr)
				if(type == 1) { //群//@我
					var atMyStr = "<span class=\"at-me\" style=\"color:red;display:inline\">[" + data.data.message_send_by.employee_name + "@我]</span>";
					//if(data.data.message_at_info.length != 0) {
					var isAtMy = false;
					for(var i in data.data.message_at_info) {
						if(myId == data.data.message_at_info[i]) {
							isAtMy = true;
						}
					}
					if(!isAtMy) {
						if($(".infolist-chatlist li[data-id=" + objId + "] .at-me").length != 0) {
							atMyStr = $(".infolist-chatlist li[data-id=" + objId + "] .at-me").clone()[0].outerHTML;
						} else {
							atMyStr = "";
						}
					}
					showTetxStr = atMyStr + showTetxStr;
				}
				console.log(data.data.message_send_by.employee_id + "==" + myId);
				//ws.onsend(22, {});
				updataNewInformation(objId, showTetxStr, isTodayOrYesterday(changeDate(data.data.message_time)));
				informTop(objId);
			}
			if(data.data.message_send_by.employee_id != myId)
				messageTypeHandle(objId, type, "+", 1);
			//消息数量处理
			if(chatObjectState(objId) == chatObjState.unchat) { //未打开
				return false;
			} else if(chatObjectState(objId) == chatObjState.chat) { //聊天
				infoIsRead(data.data.message_id, openPageType()); //消息已读
				return true;
			} else { //打开未聊天
				return true;
			}
		} else if(type == 6) { //新圈子
			if($(".news-left-menu .all-friend-dynamic-num").length == 0) {
				$(".news-left-menu span").remove();
				$(".news-left-menu .fa-chrome").append("<span class=\"info-num new-info-reminder\"></span>");
			}
		} else if(type == 7) { //新动态all-friend-dynamic-num
			if($(".news-left-menu .all-friend-dynamic-num").length == 0) {
				$(".news-left-menu .fa-chrome span").remove();
				$(".news-left-menu .fa-chrome").append("<span class=\"info-num all-friend-dynamic-num\">0</span>");
				saveData(".news-left-menu .all-friend-dynamic-num", "num", 0);
			}
			messageNumDom(".news-left-menu .all-friend-dynamic-num", "+", 1);

		}
	}
	//最近列表上升第一
	function informTop(id) {
		var copyDom = $(".infolist-chatlist li[data-id=" + id + "]").clone(true);
		$(".infolist-chatlist li[data-id=" + id + "]").remove();
		$(".infolist-chatlist li:first-child").before(copyDom);

	}
	//消息已读
	function infoIsRead(infoId, type) {
		console.log(arguments);
		if($(showPage).attr("data-chat-type") != 4) {
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
	//个人资料弹窗打开
	window.openPersonageInfo = function(obj, modId) {
		//if($(obj).hasClass("group-member-boxs")) return false;
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
				var str = "<a href=\"tencent://message/?uin=" + infoData.employee_qq + "&amp;Site=有事Q我&amp;Menu=yes\"><i class=\"open-qq\"></i></a>";
				$(contentLocation + " .info-page-QQ").append(str);
			}
			$("#" + modalId + " .open-email").unbind("click").click(function() {
				var toEmailUrl = $(this).prev(".E-mail-number").text();
				if(toEmailUrl == "") {
					$.showErrorGritter("该员工当前未绑定邮箱");
					return false;
				}
				var fullName = "我的邮箱";
				window.parent.openTab(fullName, "views/e-mail.html?email=" + toEmailUrl + "&name=" + infoData.employee_name + "");
				$("#" + modalId).modal("hide");
				$("#" + modId).modal("hide");
				$(".minimize").trigger("click");
			});
			$("#" + modalId + " .open-chat").click(function() {
				$("#" + modId).modal("hide");
			});
			$(contentLocation + " .open-chat").attr({
				"data-id": infoData.employee_id,
				"data-avatar": infoData.employee_avatar,
				"data-name": infoData.employee_name,
				"data-online": infoData.is_online,
				"data-bdy": modalId
			});
		});

	}
	//加载群话题
	function loadGroupDiscussionList(data, type, title) {
		console.log("加载主题");
		console.log(data);
		$(showPage + " .discussion-content").remove()
		if(type == "1") { //获取的主题
			var str = "<div class=\"discussion-content\" id=" + data.topic_id + ">";
			str += "<p class=\"discussion-top\" title='" + data.topic_title + "'><span>讨论主题:</span><span>" + data.topic_title + "</span></p>";
			str += "<p class=\"discussion-buttom\">" + data.topic_creator.employee_name + "添加于" + data.topic_create_date + (data.topic_can_modify ? "<span title=\"关闭讨论主题\" class=\"off-theme\">关闭</span>" : "") + "</p>";
			str += "</div>";
			$(showPage + " .chat-page-main").prepend(str);
			$(showPage + " .chat-page-main .discussion-top").data({
				"id": data.id,
				"type": data.type
			});
			$(showPage + " .chat-info").css("height", "380px");
		} else if(type == "2") { //新增主题
			var str = "<div class=\"discussion-content\" id=" + data.topic_id + ">";
			str += "<p class=\"discussion-top\" title='" + data.topic_title + "'><span>讨论主题:</span><span>" + data.topic_title + "</span></p>";
			str += "<p class=\"discussion-buttom\">" + data.topic_creator.employee_name + "添加于" + data.topic_create_date + (data.topic_can_modify ? "<span title=\"关闭讨论主题\" class=\"off-theme\">关闭</span>" : "") + "</p>";
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
				rollBottom(data.group_id);
			}
		} else {

		}
		$.zoom({
			container: $(showPage + " .chat-page-main .discussion-top"),
			showText: "off，open",
			firstState: 0,
			height: 40,
			changeCallback: function(state) {

			}
		});
		bindIncident();
	}
	//数据更新（最近聊天的文字，时间更新。是否是第一次聊天等）
	function updataNewInformation(id, chatText, chatTime) {
		console.log(arguments)
		//判断是否第一次聊天
		if($(".infolist-chatlist li[data-id=" + id + "]").length == 0) {
			//刷新表格
			ws.onsend(22, {});
		} else { //更新数据
			$(".infolist-chatlist li[data-id=" + id + "] .news-info-text").html(chatText.replace(/<br>/g, ""));
			$(".infolist-chatlist li[data-id=" + id + "] .infolist-time").text(chatTime);
		}

	}
	//客服系统
	function loadSupportStaff(data) {
		$(".sub-menu-service a").remove();
		//获取客服列表
		console.log(data);
		var noReadInfo = 0;
		supportStaffData = data.data;
		for(var i in supportStaffData) {
			noReadInfo += parseInt(supportStaffData[i].unread_num);
			var str = "";
			str += "<a href=\"javascript:;\" onclick=\"openChat(this)\" data-online=" + supportStaffData[i].is_online + " chat-type=\"4\" data-id=" +
				supportStaffData[i].user_id + " class=\"avatar-img\">" + (supportStaffData[i].unread_num != 0 ? "<span class=\"info-num list-num\">" + messageNumShow(supportStaffData[i].unread_num) + "</span>" : "") +
				"<img src=" + supportStaffData[i].user_avatar + " class=\"" + (supportStaffData[i].is_online ? "" : "underline") + "\"> <span class=\"css-overhidden\" style=\"max-width:89px\">" +
				supportStaffData[i].user_name + "</span></a>";
			$(".sub-menu-service").append(str);
			saveData(".sub-menu-service a[data-id=" + supportStaffData[i].user_id + "]", "readMessageId", supportStaffData[i].last_message_readed_id);
			if(supportStaffData[i].unread_num != 0)
				saveData(".sub-menu-service a[data-id=" + supportStaffData[i].user_id + "] .list-num", "num", supportStaffData[i].unread_num);
		}
		$(".sub-menu-service img").removeClass("hide");
		if(noReadInfo > 0) {
			$(".bottom-menu").append("<span class=\"info-num customer-all-num\">" + messageNumShow(noReadInfo) + "</span>");
			saveData(".bottom-menu .customer-all-num", "num", noReadInfo);
		}
	}
	//业务通知
	//接收业务通知
	$("#msg").attr({
		"data-id": businessId,
		"chat-type": "5",
		"data-avatar": "http://www.saas.com/resources/images/logo.png",
		"data-online": "true"
	});
	$("#msg").click(function() {
		var data = {
			type: $(this).attr("chat-type"),
			Id: $(this).attr("data-id"),
			Avatar: $(this).attr("data-avatar"),
			Name: "业务通知",
			Online: $(this).attr("data-online")
		};
		openChatPage(data);
		$(this).find('.badge').remove();

	});

	function receiveInform(data) {
		console.log("收到一条" + (data.data.message_type == "1" ? "业务" : "系统") + "消息：");
		console.log(data);
		var infoData = data.data;
		try {
			var messageInfo = JSON.parse(infoData.message_content);
		} catch(e) {
			//return false;
		}
		if(infoData.message_type == 10) { //系统通知指令
			var messageInfo = JSON.parse(infoData.message_content);
			mainPublisher.publisheMsg({
				action: "refresh",
				routin_id: messageInfo.business_data_id,
				msg: "审批完成，请刷新CRM页面表格！"
			});
			return false;
		}
		if(infoData.message_type == 1 && messageInfo.business_type == businessInformCode.weekPlanApvInform) {
			try {
				var otherInfoData = JSON.parse(messageInfo.message);
			} catch(e) {

			}
			mainPublisher.publisheMsg({
				action: "refresh-plan",
				schedule_id: otherInfoData.schedule_id,
				msg: "审批完成，请刷新周计划！"
			});
		}
		if(!hasOpenChatPage(data, "5")) return false;
		if(infoData.message_type == 1) { //收到业务消息
			if(messageInfo.business_type == businessInformCode.weekPlanApvInform) {
				try {
					var otherInfoData = JSON.parse(messageInfo.message);
				} catch(e) {

				}
				mainPublisher.publisheMsg({
					action: "refresh-plan",
					schedule_id: otherInfoData.schedule_id,
					msg: "审批完成，请刷新周计划！"
				});
			}
			infoShow(infoData);
		} else if(infoData.message_type == 5) { //收到系统消息

		}
		//滚动到底部
		rollBottom(infoData.message_send_by.employee_id);
	}
	//业务通知消息显示
	function infoShow(infoData, addType) {
		try {
			var messageInfo = JSON.parse(infoData.message_content);
		} catch(e) {
			console.log("报错：")
			console.log(infoData.message_content)
			return false;
		}
		if(infoData.message_type == 10) { //系统通知指令
			return false;
		}
		console.log(infoData.message_content)
		var infoShowText = messageInfo.business_type == businessInformCode.MTa ? messageInfo.message.msg_content : messageInfo.message;
		var otherInfoData = "";
		if(isChangeBusinessMessag(messageInfo.business_type)) {
			try {
				otherInfoData = JSON.parse(messageInfo.message);
				messageInfo.message = otherInfoData;
				infoShowText = otherInfoData.content;
			} catch(e) {

			}
		}
		var str = "<div class=\"chat-info-receive\" data-time='" + changeDate(infoData.message_time) + "' id=" +
			infoData.message_id + " data-type=" + infoData.message_type + " data-info-type=" + messageInfo.business_type + ">";
		str += businessInformAvatar(messageInfo.business_type);
		str += "<div class=\"demo clearfix\">";
		str += "<p class=\"chat-time\" style=\"margin: 0;text-align: left;font-size: 12px;\">" + isTodayOrYesterday(changeDate(infoData.message_time), true) + "</p>";
		str += "<div class=\"thing-box article\">";
		str += "<p class=\"thing-name\">" + messageInfo.business_type_cn + "</p>";
		str += "<p class=\"thing-theme shrink\" style=\"-webkit-line-clamp:" + (messageInfo.business_type == businessInformCode.MTa ? "2" : "inherit") + "\" title=" +
			(messageInfo.business_type == businessInformCode.MTa ? messageInfo.message.msg_content : infoShowText.replace(/<br>/g, "")) + " >" + infoShowText + "</p>";
		str += "</div></div></div>";
		if(addType) {
			$(".chat-page-modal-content[data-id=" + infoData.message_send_by.employee_id + "] .chat-info").prepend(str);
		} else {
			$(".chat-page-modal-content[data-id=" + infoData.message_send_by.employee_id + "] .chat-info").append(str);
		}
		$("#" + infoData.message_id).data("info", messageInfo);
		$(".thing-box").unbind("click").click(function() {
			//if($(this).parents(".chat-info-receive").attr("data-type") == 1) {
			var index = $(this).parents(".chat-info-receive").attr("data-info-type");
			var data = $(this).parents(".chat-info-receive").data("info");
			gotoPage(index, data);
		});
	}

	function isChangeBusinessMessag(type) {
		if(type == businessInformCode.weekPlanChangeInform || type == businessInformCode.weekPlanNotifier)
			return true;
		if(type == businessInformCode.weekPlanApv || type == businessInformCode.weekPlanApvInform)
			return true;
		if(type == businessInformCode.weekPlanAssist || type == businessInformCode.workPlanOverTime)
			return true;
		if(type == businessInformCode.workSummaryOverTime || type == businessInformCode.noLogin)
			return true;
		if(type == businessInformCode.workSummaryDetail)
			return true;
		return false;
	}
	//业务跳转指定页面
	function gotoPage(index, data) {
		console.log(arguments)
		if(index && data) {
			if(index == businessInformCode.approveing) //待审批
				parent.openTab("审批内容", "views/apv-approval-detail.html?action=apv&apvId=" + data.business_data_id);
			if(index == businessInformCode.approveed) //审批完成
				parent.openTab("审批内容", "views/apv-approval-detail.html?action=my&apvId=" + data.business_data_id);
			if(index == businessInformCode.announcement) //公告发布
				parent.openTab('公告详情', 'views/announcement-detail.html?id=' + data.business_data_id + "&status=2&im=true");
			if(index == businessInformCode.visitApv) //拜访特批
				if(!pageIsLoad("update", "ws-client-visit-indicators-specialapproval", "", ""))
					parent.openTab('拜访指标特批', 'views/ws-client-visit-indicators-specialapproval.html');
			if(index == businessInformCode.MTa) {
				var type = data.message.msg_type;
				if(type == MtaCode.im) { //Im消息MT
					$(".news-left-infolist li[data-id=" + data.business_data_id + "]").trigger("click");
				} else if(type == MtaCode.approve) { //审批MT
					parent.openTab("审批内容", "views/apv-approval-detail.html?action=apv&apvId=" + data.business_data_id);
				} else if(type == MtaCode.announcement) { //公告提醒阅读
					parent.openTab("公告详情", "views/announcement-detail.html?id=" + data.business_data_id + "&status=2&im=true");
				} else if(type == MtaCode.information) { //资讯提醒阅读
					parent.openTab("资讯详情", "views/information-details.html?id=" + data.business_data_id + "&information_is_publisher=false&im=true");
				} else if(type == MtaCode.documenttion) { //文档提醒阅读
					parent.openTab('文档详情', 'views/documentation-detail.html?id=' + data.business_data_id + '&status=3&im=true');
				}
			}
			if(index == businessInformCode.weekPlanApv) {
				//				if(!pageIsLoad("change", "ws-one-work-plan-detail.html", "planDetails", data))
				parent.openTab('第' + data.message.work_schedule_week_number + '周工作计划（' + data.message.employee_name + '）', 'views/ws-one-work-plan-detail.html?' + $.toQueryString(creatuUrlData(data)));
			}
			if(index == businessInformCode.weekPlanApvInform) {
				//				if(!pageIsLoad("change", "ws-one-work-plan-detail.html", "planDetails", data))
				parent.openTab('第' + data.message.work_schedule_week_number + '周工作计划', 'views/ws-one-work-plan-detail.html?' + $.toQueryString(creatuUrlData(data)));
			}
			if(index == businessInformCode.weekPlanAssist) { //      work-plan-and-summer.html
				//				if(!pageIsLoad("change", "ws-one-work-plan-detail.html", "planDetails", data))
				parent.openTab('第' + data.message.work_schedule_week_number + '周工作计划', 'views/ws-one-work-plan-detail.html?' + $.toQueryString(creatuUrlData(data)));
			}
			if(index == businessInformCode.workSummaryDetail) {
				parent.openTab('计划、总结提交明细', 'views/workplan-summary-submit-details.html?' + $.toQueryString(creatuUrlData(data)));
			}
			if(index == businessInformCode.noLogin) {
				openNoLoginPage(data); //未登录通知
			}
		} else {
			$.showErrorGritter("index或data为空!");
		}
	}
	//判断页面是否已加载（type：刷新还是加载数据）
	function pageIsLoad(type, urlTxt, action, data) {
		console.log(arguments)
		var isOpen = false;
		if(urlTxt) {
			$("#tab-menu li[url]").each(function(i) {
				var urlStr = $(this).attr("url");
				if(urlStr.indexOf(urlTxt) != -1) { //一打开
					console.log("一打开")
					if(type == "update") {
						//document.frames(urlStr).location.reload();
						$("body iframe[name='" + urlStr + "']").attr("src", urlStr).ready();
					} else {
						mainPublisher.publisheMsg({
							action: action,
							msg: data
						});
					}
					$(this).find("a").trigger("click");
					isOpen = true;
					return false;
				}
			});
			return isOpen;
		}
	}

	function creatuUrlData(data) { //跳转数据组装
		console.log(data);
		var retuData = {};
		if(data) {
			if(data.business_type == businessInformCode.workSummaryDetail) {
				retuData = {
					month: data.message.month,
					year: data.message.year,
					week_num: data.message.week_num
				}
			} else {
				retuData = {
					is_curr_week: data.message.is_current_week,
					is_next_week: data.message.is_next_week,
					schdule_year: data.message.work_schedule_year,
					schedule_week_num: data.message.work_schedule_week_number
				}
				if(data.business_type != businessInformCode.weekPlanAssist)
					if(data.message.employee_id) {
						retuData.employee_id = data.message.employee_id;
					}
			}
		}
		console.log(retuData)
		return retuData;
	}

	function businessInformAvatar(type) {
		//审批
		var av = [businessInformCode.approveing, businessInformCode.approveed, businessInformCode.visitInform, businessInformCode.visitApv];
		//工作计划总结
		var wp = [businessInformCode.weekPlanChangeInform, businessInformCode.weekPlanNotifier, businessInformCode.weekPlanApv,
			businessInformCode.weekPlanApvInform, businessInformCode.weekPlanAssist, businessInformCode.workPlanOverTime,
			businessInformCode.workSummaryOverTime, businessInformCode.workSummaryDetail
		];
		//公海
		var pc = [businessInformCode.publicApvInform];
		//考勤
		var ad = [businessInformCode.attendanceRule];
		//公告
		var am = [businessInformCode.announcement];
		//生日
		//var bd=[businessInformCode.]
		//邮件
		var em = [businessInformCode.newEmail];
		var mta = [businessInformCode.MTa]; //
		var nl = [businessInformCode.noLogin];
		//放假
		var rc = [businessInformCode.recess];
		var dome = "<div class=\"business-avatar pull-left\" style=\"background:{BGC}\"><img src=\"{AVATAR}\"></div>";
		if(av.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#a37dea").replace("{AVATAR}", "../resources/images/av-icon.png");
		} else if(wp.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#ff9c01").replace("{AVATAR}", "../resources/images/wp-icon.png");
		} else if(pc.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#3db7ff").replace("{AVATAR}", "../resources/images/pc-icon.png");
		} else if(ad.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#33c536").replace("{AVATAR}", "../resources/images/ad-icon.png");
		} else if(am.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#fe4929").replace("{AVATAR}", "../resources/images/am-icon.png");
		} else if(em.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#fe4929").replace("{AVATAR}", "../resources/images/em-icon.png");
		} else if(mta[0] == type) {
			dome = dome.replace("{BGC}", "#ca192b").replace("{AVATAR}", "../resources/images/Mta-icon.png");
		} else if(nl.indexOf(type) != -1) {
			dome = dome.replace("{BGC}", "#fe4929").replace("{AVATAR}", "../resources/images/nl-icon.png");
		}
		return dome;
	}

	function openNoLoginPage(data) { //未登录人员弹窗
		if(data) {
			var len = $("body .no-login-page").length;
			if(len == 0) {
				$("body").append("<div class='no-login-page hide'><p class='no-login-time lead' style='border-bottom:1px solid #aaa'></p><div class='no-login-list'></div></div>");
			}
			var modalId = $.modal({
				showOKButton: false
			}).show("未登录列表", " .no-login-page", function() {});
			$("#" + modalId + " .no-login-time").text(data.message.not_login_employees[0].not_login_date);
			var str = "";
			for(var i in data.message.not_login_employees) {
				var empData = data.message.not_login_employees[i];
				str += empData.employee_name;
				if(i != data.message.not_login_employees.length - 1) str += "、";
			}
			$("#" + modalId + " .no-login-list").text(str);
		}
	}

	//消息加减
	function informNumChange(type, id, num) {
		console.log(type + "，" + id + "," + num);
		if(isNaN(num)) {
			return false;
		}
		num = parseInt(num);
		//消息-1
		console.log("消息减少" + num);
		messageNumDom("#" + id, "-", num);
		messageNumDom(".infolist-chatlist li[data-id=" + id + "] .list-num", "-", num);
		messageNumDom(".news-left-menu ul li:first-child .message-num", "-", num);
		messageNumDom(".chat-open>.all-num", "-", num);

	}
	//消息处理(type:处理类型，handleType：消息加减)
	function messageTypeHandle(objId, type, handleType, num) {
		console.log(arguments)
		if(num == 0) {
			num = getMessageNum(objId, type);
		}
		if(type && handleType && !isNaN(num)) {
			console.log("打开状态：" + chatObjectState(objId));
			if(chatObjectState(objId) != chatObjState.chat) { //未被打开
				if(type == 1 || type == 2 || type == 6) { //单人消息
					if(handleType == "+" && $(".chat-open>.all-num").length == 0) { //-整体
						$(".chat-open").append("<span class=\"info-num all-num\">0</span>");
						saveData(".chat-open>.all-num", "num", 0);
					}
					messageNumDom(".chat-open>.all-num", handleType, num);
					if(handleType == "+" && $(".news-left-menu .fa-commenting .message-num").length == 0) { //-全部
						$(".news-left-menu .fa-commenting").append("<span class=\"info-num message-num\">0</span>");
						saveData(".news-left-menu .fa-commenting .message-num", "num", 0);
					}
					messageNumDom(".news-left-menu .fa-commenting .message-num", handleType, num);
					if(handleType == "+" && $(".infolist-chatlist li[data-id=" + objId + "] .list-num").length == 0) {
						$(".infolist-chatlist li[data-id=" + objId + "] .infolist-right-newinfo").append("<span class=\"info-num list-num\">0</span>");
						saveData(".infolist-chatlist li[data-id=" + objId + "] .list-num", "num", 0);
					}
					messageNumDom(".infolist-chatlist li[data-id=" + objId + "] .list-num", handleType, num);
				}
				if(type == 4) { //客服消息
					if(handleType == "+" && $(".bottom-menu>.customer-all-num").length == 0) { //-整体
						$(".bottom-menu").append("<span class=\"info-num customer-all-num\">0</span>");
						saveData(".bottom-menu>.customer-all-num", "num", 0);
					}
					messageNumDom(".bottom-menu>.customer-all-num", handleType, num);
					if(handleType == "+" && $(".sub-menu-service a[data-id=" + objId + "] .list-num").length == 0) { //-单人
						$(".sub-menu-service a[data-id=" + objId + "]").append("<span class=\"info-num list-num\">0</span>");
						saveData(".sub-menu-service a[data-id=" + objId + "] .list-num", "num", 0);
					}
					messageNumDom(".sub-menu-service a[data-id=" + objId + "] .list-num", handleType, num);
				}
				if(type == 5) { //业务消息
					if(handleType == "+" && $("#msg .icon-animated-bell").length == 0) {
						$("#msg").append("<span class=\"badge badge-danger icon-animated-bell\">0</span>");
						saveData("#msg .icon-animated-bell", "num", 0);
					}
					messageNumDom("#msg .icon-animated-bell", handleType, num);
				}
				if(chatObjectState(objId) == chatObjState.open) { //打开未聊天
					if(handleType == "+" && $("#" + objId + " .list-num").length == 0) {
						$("#" + objId).append("<span class=\"info-num list-num\">0</span>");
						saveData("#" + objId + " .list-num", "num", 0);
					}
					messageNumDom("#" + objId + " .list-num", handleType, num);
				}
			}
		}
	}

	function getMessageNum(id, type) {
		if(id && type) {
			var num = 0;
			if(type == 4) { //客服
				if($(".sub-menu-service a[data-id=" + id + "] .list-num").length != 0) {
					num = parseInt($(".sub-menu-service a[data-id=" + id + "] .list-num").text());
				}

			} else if(type == 5) { //业务
				if($("#msg .icon-animated-bell").length != 0) {
					num = parseInt($("#msg .icon-animated-bell").text());
				}
			} else {
				if($(".infolist-chatlist li[data-id=" + id + "] .list-num").length != 0) {
					num = parseInt($(".infolist-chatlist li[data-id=" + id + "] .list-num").text());
				}
			}
			return num;
		}
	}
	//消息加减处理
	function messageNumDom(content, type, num) {
		console.log(arguments)
		if(content && type && num) {
			num = parseInt(num);
			console.log($(content).data("num"));
			if(type == "+") {
				var nowNum = parseInt($(content).data("num")) + num;
				$(content).text(messageNumShow(nowNum));
				$(content).data("num", nowNum);
			} else {
				var nowNum = parseInt($(content).data("num")) - num;
				if(nowNum <= 0) {
					$(content).remove();
				} else {
					$(content).text(messageNumShow(nowNum));
				}
				$(content).data("num", nowNum);
			}
		}
	}
	//最近聊天加载中
	window.chatHistoryLoading = function(state) {
		if(state == "begin") {
			if($(showPage + " .chat-info .chat-loadind").length == 0)
				$(showPage + " .chat-info").prepend('<img class="chat-loadind" src="/resources/images/loading.gif">');
		} else {
			$(showPage + " .chat-info .chat-loadind").remove();
		}
	}
	//事件添加
	window.bindIncident = function() {
		//向上滚动加载
		$(".chat-info").unbind("scroll").scroll(function() {
			var scrollTop = $(this).scrollTop();
			if(scrollTop == 0) {
				if($(showPage).data("chat-type") == "5") {
					if($(showPage + " .chat-info .chat-page-main-loadmore").length == 0)
						$(showPage + " .chat-info").append("<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa-clock-o-s\"></i>查看更多消息</a>");
					bindIncident();
					return false;
				}
				$(showPage + " .chat-page-main-loadmore").trigger("click");
			}
		});
		//鼠标移入移出
		$(".message-info").unbind("hover").hover(function() {
			if($(this)[0].offsetTop >= $(this).parent().scrollTop() + 101 && $(this)[0].offsetTop < $(this).parent().scrollTop() + $(this).parent().height() + 20) {
				$(this).children(".chat-menu").show();
			} else {
				$(this).children(".chat-menu").css({
					"top": "52px",
					"z-index": "10"
				});
				$(this).children(".chat-menu").show();
			}

		}, function() {
			$(this).children(".chat-menu").hide();
		});
		//文件下载
		$(".file-download").unbind("click").click(function() {
			filesDownload(this);
		});
		//图片放大
		$(".chat-image").unbind("click").click(function() {
			var srcs = [$(this).attr("src")];
			$(this).siblings("img").each(function() {
				srcs.push($(this).attr("src"));
			});
			magnifyImage(srcs);
		});

		//关闭讨论主题
		$(".off-theme").unbind("click").click(function(event) {
			var e = window.event || event;
			if(e.stopPropagation) {
				//如果提供了事件对象，则这是一个非IE浏览器
				e.stopPropagation();
			} else {
				//兼容IE的方式来取消事件冒泡 
				window.event.cancelBubble = true;
			}
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
						//								$(showPage + " .chat-info").append("<p class=\"chat-annunciate\"><span>我关闭了讨论<a href=\"javascript:;\" data-title=" + topicTitle + " class=\"discussion-again-add\">重新添加</a></span></p>");
						//滚动到底部
						rollBottom();
						$(showPage + " .discussion-content").remove();
						$(showPage + " .chat-info").height("455");
						bindIncident();
					}
				}
			});
		});
		bindFileClickRead(); //文件点击在线预览
		//添加重新添加事件
		//$(".discussion-again-add").unbind("click").click(function() {ws.onsend(25, {"group_id": showChatId,"topic_title": $(this).attr("data-title")}, function(data) {
		//if(data.action == 500) {$.showErrorGritter(data.data.message);} else {
		//$(showPage + " .chat-info").append("<p class=\"chat-annunciate\"><span>我发起了讨论</span></p>");}bindIncident();});});
		//聊天----M他们()
		$(".mgroupmember").unbind('click').click(function() {
			var infoId = $(this).parents(".chat-info-send").attr("id");
			var newText = $(this).parents(".chat-info-send").find(".article").html().replace(/(\<img\s.*?\>)/g, "[图片]");
			if($(this).parents(".chat-info-send").find("img").hasClass("chat-file-icos")) {
				newText = $(this).parents(".chat-info-send").find(".article").html().replace(/(\<img\s.*?\>)/g, "[文件]");
			}
			var msgId = $(this).parents(".chat-info-send").attr("id");
			var type = openPageType();
			console.log(messageID)
			ws.onsend(ws.cmdTag.MESSAGE_READ_DETAILS, {
				"message_id": msgId,
				"message_type": type
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载阅读详情失败！");
					return false;
				}
				if(type == 2) {
					remindReadMesssage(data, newText);
				} else {
					var list = (data.data.has_read.list.length != 0 ? data.data.has_read.list : data.data.unread.list)
					var name = list[0].employee_name;
					var modalId = $.modal().confirm("是否提醒" + name + "阅读？", function() {
						var infoData = {};
						infoData.data_id = myId;
						infoData.business_type = 30;
						var oppositeType = 0;
						infoData.employee_id = list[0].employee_id;
						infoData.business_type_cn = "M一下：消息";
						infoData.message = {};
						infoData.message.msg_content = myName + ":" + newText;
						infoData.message.msg_type = MtaCode.im; //消息MTa							infoData.message.msg_data = {
						infoData.message.isGrounpID = oppositeType;
						infoData.message.avatar = $(".infolist-chatlist li[data-id = " + showChatId + "]").attr("data-avatar");
						infoData.message.name = $(".infolist-chatlist li[data-id=" + showChatId + "] .tree-name").text();
						console.log(infoData.showChatId + "消息提醒内容：" + infoData.message.msg_content + "，" + infoData.message.msg_type + "，头像：" + infoData.message.avatar + "，姓名：" + infoData.message.name);
						sendMtaMessage(infoData, modalId);
					});
					//$(formContainer+" .modal-body").empty().append("<h5>是否提醒"++"阅读？</h5>");
				}
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
					str += "<p class=\"discussion-buttom\">" + myName + "添加于" + $.timeNow().Format("yyyy-MM-dd hh:mm:ss") + "<span title=\"关闭讨论主题\" class=\"off-theme\">关闭</span></p>";
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
			$(showPage + " .inform-buttom .search-time").datepicker({
				autoclose: true,
				clearBtn: true,
				weekStart: "0",
				format: "yyyy-mm-dd",
				pickerPosition: 'bottom-left'
			}).on("show", function() {
				setDatepickerLocation();
			});
		});
		//聊天----转发
		$(".file-transmit").unbind("click").click(function() {
			filestransmit(this);
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
			try {
				if(document.execCommand('copy', false, null)) {
					//success info
					$.showSuccessGritter("复制成功");
				} else {
					//fail info
					$.showErrorGritter("复制失败！浏览器暂不支持该功能，请手动选择复制");
				}
			} catch(err) {
				$.showErrorGritter("复制失败！请手动选择复制");
			}
			// 删除创建元素
			document.body.removeChild(aux);
		});
		//加载更多历史记录
		$(".chat-page-main-loadmore").unbind("click").click(function() {
			$(this).remove();
			chatHistoryLoading("begin");
			chatHistoryPage = 10;
			var type = $(showPage).attr("data-chat-type");
			loadRecentlyHistoryMessage(showChatId, type);
		});
		$(".discussion-content").unbind("click").click(function() {
			businessGroupDetails($(this).children(".discussion-top").data("id"), $(this).children(".discussion-top").data("type"));
		});
	}

	window.filestransmit = function(obj) {
		if(!isUnline()) return false;
		var fileData = $(obj).parents(".message-info").data("filedata");
		console.log(fileData)
		var modalId = $.modal().showOfLarge("转发", ".load-transpond-list", function() {
			//转发的消息Id
			$(contentBody + " .body-left-content .list-box").each(function(index) {
				console.log(fileData);
				var fileDataText = JSON.stringify(fileData);
				//判断是否被打开的
				var chatObjId = $(this).attr("data-id");
				var chatObjType = $(this).attr("data-type");
				fileDataText = "[file_" + fileDataText + "]"; //发送服务器内容
				if(chatObjType == "1") { //发送单人
					sendSingleMessage(fileDataText, messageType.files, chatObjId, {
						"fileData": fileData
					});
				} else if(chatObjType == "2") { //发送群
					sendGroupMessage(fileDataText, messageType.files, chatObjId, {
						"fileData": fileData
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
				if(infoData[i].msg_session_id == businessId) {
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
			loadFirendTree(infoData, contentBody + " .tree-list-a", "3", "1", false);
			addClick(contentBody);
		});
	}
	//提醒阅读
	function remindReadMesssage(data, newText) {
		var modalId = $.modal({
			showFooter: false
		}).show("阅读状态", ".informage-read",
			function(modal) {}
		);
		var formContainer = "#" + modalId;
		var deptListNoRead, deptListRead;
		deptListNoRead = data.data.unread.list;
		deptListRead = data.data.has_read.list;
		$(formContainer + " .informage-main-list:first-child .informage-main-list-top-sp").html(deptListNoRead.length);
		$(formContainer + " .informage-main-list:nth-child(2) .informage-main-list-top-sp").html(deptListRead.length);
		var isStopStr = "class=\"filter\"";
		for(var i = 0; i < deptListNoRead.length; i++) {
			if(deptListNoRead[i].employee_id == myId) continue;
			var Strs = '<li id="' + deptListNoRead[i].employee_id + '" data-isoff="' + deptListNoRead[i].employee_enabled + '" ' + (!deptListNoRead[i].employee_enabled ? "title=\"该用户账号已被停用，不能提醒\" " + isStopStr : "") + '>';
			//Strs += '<a href="javascript:;">';
			Strs += '<img src="' + deptListNoRead[i].employee_avatar + '" alt="" />';
			Strs += '<p class=\"css-overhidden\" title=' + deptListNoRead[i].employee_name + '>' + deptListNoRead[i].employee_name + '</p>';
			//Strs += '</a>';
			Strs += '</li>';
			$(formContainer + " .informage-main-list:first-child ul").append(Strs);

		}
		for(var i = 0; i < deptListRead.length; i++) {
			var Strs = '<li>';
			//Strs += '<a href="javascript:;">';
			Strs += '<img src="' + deptListRead[i].employee_avatar + '" alt="" />';
			Strs += '<p class=\"css-overhidden\" title=' + deptListRead[i].employee_name + '>' + deptListRead[i].employee_name + '</p>';
			//Strs += '</a>';
			Strs += '</li>';
			$(formContainer + " .informage-main-list:nth-child(2) ul").append(Strs);
		}
		//单个选中
		$(formContainer).on("click", ".informage-main-list:nth-child(1) li", function() {
			if($(this).attr("data-isoff") == "false") return false;
			if(!$(this).hasClass("active")) {
				$(this).addClass("active");
			} else {
				$(this).removeClass("active");
				$(formContainer + " .informage-bottom-selectall").removeAttr("checked");
			}
		});
		//全部选中
		$(formContainer + " .informage-bottom-selectall").unbind("change").change(function(e) {
			var isSelect = $(this).is(":checked");
			if(isSelect) {
				$(formContainer + " .informage-main-list:first-child li").addClass("active");
			} else {
				$(formContainer + " .informage-main-list:first-child li").removeClass("active");
			}
		});
		var infoRemindList = [];
		//提醒阅读点击事件
		$(formContainer + " .btn-remind").unbind("click").click(function() {
			$(formContainer + " .informage-main-list:first-child li.active").each(function(index) {
				infoRemindList.push($(this).attr("id"));
			});
			if(infoRemindList.length == 0) {
				$.showErrorGritter("提醒人员不能为空！");
				return false;
			}
			var infoData = {};
			infoData.data_id = myId;
			infoData.business_type = 30;
			var oppositeType = 0;
			if($(showPage).attr("data-chat-type") != 2) {
				infoData.data_id = showChatId;
				oppositeType = 1;
			}
			infoData.employee_id = infoRemindList.join(',');
			infoData.business_type_cn = "M一下：消息";
			infoData.message = {};
			infoData.message.msg_content = myName + ":" + newText;
			infoData.message.msg_type = MtaCode.im; //消息MTa							infoData.message.msg_data = {
			infoData.message.isGrounpID = oppositeType;
			infoData.message.avatar = $(".infolist-chatlist li[data-id = " + showChatId + "]").attr("data-avatar");
			infoData.message.name = $(".infolist-chatlist li[data-id=" + showChatId + "] .tree-name").text();
			console.log(infoData.showChatId + "消息提醒内容：" + infoData.message.msg_content + "，" + infoData.message.msg_type + "，头像：" + infoData.message.avatar + "，姓名：" + infoData.message.name);
			sendMtaMessage(infoData, modalId);
		});
	}
	//判断聊天类型并返回
	function judgeType(index) {
		if(index) {
			if(index == 1 || index == 6) {
				index = 2;
			} else {
				index = 1;
			}
		} else {
			$.showSuccessGritter("聊天类型出错！");
			return false;
		}
		return index;
	}

	function openPageType(id) { //判断聊天对象的类型，如果id为空则默认显示的聊天对象，type返回的数据类型：1群聊。2私聊。3。系统通知。4。客服。5业务通知。5.讨论组
		//		console.log(id);
		var type = $(showPage).attr("data-chat-type");
		if(id) type = $(".chat-page-modal-content[data-id=" + id + "]").attr("data-chat-type");
		if(type == 2 || type == 3 || type == 4 || type == 5) {
			str = "1";
		} else if(type == 1 || type == 6) {
			str = "2";
		} else {
			str = "3";
		}
		return str;
	}
	//加载聊天弹窗
	function loadchatPage(wid, hei) {
		if($(".chat-page").length <= 0) {
			var str = "<div class=\"chat-page border-shadow\" style=\"width:750px\">";
			str += "<div class=\"chat-page-left pull-left hide\">";
			str += "<!--聊天框列表-->";
			str += "<ul class=\"chat-page-list\">";
			str += "</ul>";
			str += "</div>";
			str += "<!--聊天模板-->";
			str += "<div class=\"chat-page-modal pull-right\">";
			str += "</div>";
			str += "<!--聊天记录-->";
			str += "<div class=\"view-chart-history-container hide\">";
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
			str += "</div>";
			str += "<!--尾部-->";
			str += "<div class=\"key-word-search hide\">";
			str += "<input type=\"text\" placeholder=\"请输入关键字查找\" style=\"width: 96%;\" />";
			str += "<i class=\"fa fa-search btn-key-word-search\"></i>";
			//str += "<a href=\"#\" class=\"btn btn-default btn-sm btn-key-word-search\">搜索</a>";
			str += "</div>";
			str += "<div class=\"view-chart-history-content-footer\">";
			str += "<!--关键字查找-->";
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
			str += "<a href=\"javascript:;\" class=\"search-chart-history\"><i class=\"fa fa-search\"></i>搜索</a>";
			str += "<div class=\"view-chart-history-sel-time\" style=\"float:right;margin-right: 10px;\">";
			//			str += "<i class=\"fa fa-search\"></i>";
			str += "<i class=\"fa fa-calendar pull-right search-ico fa-x\" aria-hidden=\"true\"  style=\"color:#999;margin-left:0!important;padding-right: 5px;margin-top:6px!important\"></i>";
			str += "<input type=\"text\" class=\"date-picker\" placeholder=\"年/月/日\" style=\"border-right:0;float:right;margin-top:6px;width:120px;color:#999\";font-size: 12px;height: 28px; />";
			str += "</div>";
			str += "</div>";
			str += "</div>";
			str += "</div>";
			str += "<div class=\"clearfix\"></div>";
			str += "</div>";
			$("body").append(str);
			$(".chat-page").css({
				"width": wid,
				"height": hei
			});
		}
	}
	//添加到左侧列表
	function loadChatPageLeftList(chatId, chatType, isOnline, chatObjName, chatObjAvatar) {
		var str = "<li class=\"selectstyle\" data-chattype=\"" + chatType + "\" id=\"" + chatId + "\">";
		str += "<img class=\"avatar-img " + (isOnline ? "" : " underline") + "\" src=" + chatObjAvatar + " />";
		str += "<span class=\"chat-list-name\" title=" + chatObjName + ">" + chatObjName + "</span>";
		str += "<span class=\"info-num list-detele\">×</span>";
		str += "</li>";
		$(".chat-page-list").append(str);
		if($(".chat-page-list li").length >= 2) {
			$(".chat-page-list").parent().removeClass("hide");
			$(".chat-page").css("width", "900px");
		}
	}
	//加载聊天弹窗主体
	function loadChatPageMain(chatId, chatType, isOnline, chatObjName, chatObjAvatar) {
		var str = "";
		str += "<div class=\"chat-page-modal-content\" data-id=\"" + chatId + "\" data-chat-type=" + chatType + ">";
		//头部
		var chatPageTopImgStr = "<img src=" + chatObjAvatar + " {CLICK} class=\"pull-left\" />";
		var chatPageTopNumStr = "<p class=\"info-nums\"></p>";
		var chatPageTopChatStr = "<li class=\"pitchon\"><i class=\"chat-icon\"></i>聊天</li>";
		var chatPageTopFileStr = "<li><i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i>文件</li>";
		var chatPageTopThemeStr = "<li><i class=\"fa fa-hashtag\" aria-hidden=\"true\"></i><span><i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></span><ul class=\"discussion-menu\"><li class=\"add-discussion\">添加讨论</li><li class=\"discussion-history\">历史讨论</li></ul></li>";
		var chatPageTopSetStr = "<i class=\"fa fa-cog\" aria-hidden=\"true\"></i>";
		var chatPageTopAddStr = "<i class=\"fa fa-user-plus\" aria-hidden=\"true\"></i>";
		var chatpageTopClickStr = "";
		if(chatType == 6) {
			chatPageTopThemeStr = "";
		} else if(chatType == 2) {
			chatPageTopNumStr = "";
			chatPageTopThemeStr = "";
			chatpageTopClickStr = " data-id=\"" + chatId + "\" onclick=\"openPersonageInfo(this);\"";
			chatPageTopImgStr = chatPageTopImgStr.replace("{CLICK}", chatpageTopClickStr);
			chatPageTopSetStr = "", chatPageTopAddStr = "";
		} else if(chatType == 3 || chatType == 5) {
			chatPageTopImgStr = "";
			chatPageTopNumStr = "";
			chatPageTopChatStr = "";
			chatPageTopFileStr = "";
			chatPageTopThemeStr = "";
			chatPageTopSetStr = "", chatPageTopAddStr = "";
		} else if(chatType == 4) {
			//chatPageTopImgStr = "";
			chatPageTopNumStr = "";
			chatPageTopThemeStr = "";
			chatPageTopSetStr = "", chatPageTopAddStr = "";
		}
		str += "<div class=\"chat-page-top\">";
		str += "<span class=\"chat-page-info pull-left\">" + chatPageTopImgStr;
		str += "<p class=\"info-name css-overhidden\" " + chatpageTopClickStr + "  title=" + chatObjName + ">" + chatObjName + "</p>" + chatPageTopNumStr;
		str += "</span>";
		str += "<ul class=\"chat-page-nav pull-left\">" + chatPageTopChatStr;
		str += "<li><i class=\"fa fa-volume-down\" aria-hidden=\"true\"></i></li>" + chatPageTopFileStr + chatPageTopThemeStr;
		str += "<div class=\"clearfix\"></div>";
		str += "</ul>" + chatPageTopSetStr;
		str += "<div class=\"chat-off pull-right\">";
		str += "<a href=\"javascript:;\" class=\"minimize\">－</a>";
		str += "<a href=\"javascript:;\" class=\"off-page\">×</a>";
		str += "</div>";
		str += "<div class=\"clearfix\"></div>";
		str += "</div>";
		//头部结束
		str += "<div class=\"chat-page-content\">";
		str += "<!--聊天界面-->";
		//中部开始
		str += "<div class=\"chat-page-main\">";
		str += "<div class=\"chat-info\" " + (chatType == 5 ? "style=\"height:100%;\"" : "") + ">";
		//str += "<div class=\"chat-info\">";//通知消息样式
		//str += "<a class=\"chat-page-main-loadmore\" href=\"javascript:;\"><i class=\"fa fa-clock-o-s\" aria-hidden=\"true\"></i>查看更多消息</a>";
		//str += "<p class=\"chat-page-main-toptime\">08-17 12:24</p>";
		//str += "<div class=\"chat-info-receive\">";
		//str += "<img src=\"../resources/images/case-4.png\" class=\"pull-left\">";
		//str += "<div class=\"demo clearfix\">";
		//str += "<span class=\"triangle\"></span>";
		//str += "<div class=\"article\">我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了我发短信给你了</div>";
		//str += "</div>";
		//str += "</div>";
		//中部结束
		str += "</div>";
		//下部
		if(chatType != 5) {
			var atStr = "";
			if(chatType == 1 || chatType == 6) {
				atStr = "<i class=\"fa fa-at\" aria-hidden=\"true\" unselectable=\"on\" onmousedown=\"return false;\"></i>";
			}
			str += "<div class=\"chat-tool-list\">";
			str += "<div class=\"chat-file-uploaded hide\"></div>";
			str += "<i class=\"fa fa-folder-o\" aria-hidden=\"true\"></i>";
			str += "<i class=\"fa fa-file-image-o\" aria-hidden=\"true\" unselectable=\"on\" onmousedown=\"return false;\" title=\"支持jpg、png、gif，jpeg格式\"></i>";
			str += "<i class=\"fa fa-smile-o\" aria-hidden=\"true\" unselectable=\"on\" onmousedown=\"return false;\"></i>" + atStr;
			str += "<a href=\"javascript:;\" class=\"char-info-record pull-right\"><i class=\"fa-clock-o-s\"></i>聊天记录</a>";
			str += "</div>";
			str += "<div class=\"chat-text\" data-location=\"0\" contenteditable=\"true\" id=" + chatId + "chatText></div>";
			str += "<input type=\"button\" name=\"\" class=\"btn btn-default btn-send\" value=\"发送\" />";
			//			str += "<input type=\"button\" name=\"\" class=\"btn btn-default off-page\" value=\"关闭\" />";
			str += "</div>";
		}
		var groupInformStr = "<!--群通知页面-->";
		groupInformStr += "<div class=\"chat-page-inform\">";
		groupInformStr += "<div class=\"inform-top\">";
		groupInformStr += "<span class=\"inform-title pull-left\">群公告</span>";
		groupInformStr += "<a href=\"javascript:;\" class=\"btn btn-default pull-right\" onclick=\"releaseInform()\">+发布新公告</a>";
		groupInformStr += "<div class=\"clearfix\"></div></div>";
		groupInformStr += "<div class=\"inform-content\">";
		groupInformStr += "<div class=\"inform-list-box\">";
		groupInformStr += "<div class=\"inform-box-top\">";
		groupInformStr += "<span class=\"inform-name pull-left\">公告一</span>";
		groupInformStr += "<i class=\"fa fa-trash pull-right\" aria-hidden=\"true\" onclick=\"deleteInform(this)\"></i>";
		groupInformStr += "<div class=\"clearfix\"></div></div>";
		groupInformStr += "<p class=\"inform-text shrink\">";
		groupInformStr += "	公告，是指政府、团体对重大事件当众正式公布或者公开宣告，宣布。</p>";
		groupInformStr += "<a href=\"javascript:;\" class=\"inform-flexible\">展开</a>";
		groupInformStr += "<p class=\"inform-release\">";
		groupInformStr += "<span class=\"inform-release-name\">张三</span>";
		groupInformStr += "<span class=\"inform-release-time\">2016-09-11 16:00</span>";
		groupInformStr += "</p></div></div></div>";
		var groupFileStr = "<!--群文件界面-->";
		groupFileStr += "<div class=\"chat-page-file\">";
		groupFileStr += "<div class=\"inform-top\">";
		groupFileStr += "<span class=\"inform-title pull-left\">聊天文件</span>";
		groupFileStr += "<span class=\"file-num\">(共<span></span>个文件)</span>";
		groupFileStr += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
		groupFileStr += "<input type=\"text\" name=\"\" class=\"file-search-text\" placeholder=\"输入文件名进行查找\" /></div>";
		groupFileStr += "<div class=\"file-content\">";
		groupFileStr += "<table class=\"file-list\"><tbody>";
		groupFileStr += "<tr><td style=\"width:36%\">文件名</td><td style=\"width:20%\" onclick=\"fileUploadingTimeRank(this)\">发布时间<i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i></td><td  style=\"width:15%\">大小</td><td style=\"width:15%\">发布人</td><td style=\"width:15%\">操作</td></tr><tr>";
		groupFileStr += "<td colspan=\"5\">";
		groupFileStr += "<div class=\"file-list-data\">";
		groupFileStr += "<table></table></div></td></tr></tbody></table></div></div>";
		var groupDiscussStr = "<!--群讨论历史-->";
		groupDiscussStr += "<div class=\"chat-page-discussion-history\">";
		groupDiscussStr += "<div class=\"inform-top\">";
		groupDiscussStr += "<span class=\"inform-title pull-left\">历史讨论</span>";
		groupDiscussStr += "<div class=\"clearfix\"></div></div>";
		groupDiscussStr += "<div class=\"inform-content\">";
		groupDiscussStr += "<p class=\"discussion-history-time\"><span>---------------------------------------</span>09-11<span>---------------------------------------</span></p>";
		groupDiscussStr += "<div class=\"inform-list-box\">";
		groupDiscussStr += "<div class=\"inform-box-top\">";
		groupDiscussStr += "<span class=\"inform-name pull-left\"><span>08：00</span>-<span>18：00</span></span>";
		groupDiscussStr += "<span class=\"release-info pull-right\">张三，销售部</span>";
		groupDiscussStr += "<div class=\"clearfix\"></div></div>";
		groupDiscussStr += "<p class=\"inform-text shrink\">";
		groupDiscussStr += "	#西南医院如果继续开发新客户，维护老客户，西南医院如果继续开发新客户，维护老客户。</p></div></div>";
		groupDiscussStr += "<div class=\"inform-buttom\">";
		groupDiscussStr += "<i class=\"fa fa-step-backward\" aria-hidden=\"true\"></i>";
		groupDiscussStr += "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>|";
		groupDiscussStr += "第<input type=\"text\" value=\"1\" maxlength=\"2\"  class=\"page-num\" />";
		groupDiscussStr += "/<span class=\"page-all-num\"></span>页，";
		groupDiscussStr += "<span class=\"record-number\"></span>条|";
		groupDiscussStr += "<i class=\"fa fa-forward\" aria-hidden=\"true\"></i>";
		groupDiscussStr += "<i class=\"fa fa-step-forward\" aria-hidden=\"true\"></i>";
		groupDiscussStr += "<input type=\"text\" placeholder=\"输入关键字\" style=\"margin-left:125px\" class=\"search-keytext\"/>";
		groupDiscussStr += "<input type=\"text\" placeholder=\"年/月/日\" class=\"search-time pull-right\"/>";
		groupDiscussStr += "<i class=\"fa fa-search pull-right\" aria-hidden=\"true\"style=\"line-height:26px\"></i>";
		groupDiscussStr += "</div></div>";
		if(chatType == 1) {
			str += groupInformStr + groupFileStr + groupDiscussStr;
		} else if(chatType == 6) {
			str += groupInformStr + groupFileStr;
		} else if(chatType == 2) {
			str += groupInformStr + groupFileStr + groupDiscussStr;
		} else if(chatType == 3) {} else if(chatType == 4) {
			str += groupFileStr;
		}
		str += "</div>";
		$(".chat-page-modal").append(str);
		groupMemberNum(chatId);
		$("#" + chatId).trigger("click");
	}
	//加载最近聊天历史记录
	function loadRecentlyHistoryMessage(chatId, chatType) {
		console.log(arguments);
		var msgId = $(showPage + " .chat-info>div").first().attr("id");
		//var chatType=
		if(chatType != 4) {
			//单人私人除客服以外聊天记录加载
			if(chatType == 5) { //业务通知
				ws.onsend(ws.cmdTag.READ_LATEST_CHART, {
					"base_msg_id": msgId,
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
					loadBusinessInform(data, chatType);
				});
			} else {
				ws.onsend(ws.cmdTag.READ_LATEST_CHART, {
					"base_msg_id": msgId,
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
			}
		} else {
			ws.onsend(ws.cmdTag.CUSTOMER_HISTORY, {
				"base_msg_id": msgId,
				"to_user": chatId,
				"limit": chatHistoryPage
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载聊天记录失败!");
					return false;
				}
				loadChatRecord(data);
			});
		}
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
	//可拖动
	function dragPage() {
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
	}
	//页面弹窗事件绑定
	function pageAddEvent(chatId, chatType, isOnline, chatObjName, chatObjAvatar) {
		$(".chat-page-list .list-detele").unbind("click").click(function() {
			//关闭聊天记录
			$(".view-chart-history-content-header .fa-close").trigger("click");
			var id = $(this).parent().attr("id");
			updataLastReadMessageId([id]);
			//判断是否是最后一个(是则关闭,不是则关闭当前窗口)
			if($(".chat-page-list li").length <= 1) {
				$(".chat-page").remove();
				showChatId = "";
				showPage = "";
			} else {
				//列表删除
				$(this).parent().remove();
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
		$(".off-page").unbind("click").click(function() {
			var obj = this;
			if($(".chat-page-list li").length <= 1) {
				var id = $(obj).parents(".chat-page-modal-content").attr("data-id");
				updataLastReadMessageId([id]); //更新数据
				$(".chat-page").remove();
				showChatId = "";
				showPage = "";
			} else {
				var modalId = $.modal({
					showFooter: false
				}).show("关闭会话", ".offpage-page", function() {

				});
				var formContainer = "#" + modalId + " .modal-body";
				//关闭所有
				$(formContainer + " .btn-off-all-page").click(function() {
					var objIds = [];
					$(".chat-page-list li").each(function() {
						objIds.push($(this).attr("id"));
					});
					updataLastReadMessageId(objIds); //更新数据
					$(".chat-page").remove();
					$("#" + modalId).modal('hide');
					showChatId = "";
					showPage = "";
				});
				//关闭当前
				$(formContainer + " .btn-off-single-page").click(function() {
					var id = $(obj).parents(".chat-page-modal-content").attr("data-id");
					updataLastReadMessageId([id]); //更新数据
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
		$(".chat-page-list").unbind("click").on("click", "li", function() {
			//关闭历史记录
			$(".view-chart-history-content-header .fa-close").trigger("click");
			var num = parseInt($(this).children(".list-num").text());
			messageTypeHandle($(this).attr("id"), $(this).attr("data-chattype"), "-", num);
			$(this).addClass("selectstyle").siblings().removeClass("selectstyle");
			//对应切换
			$(".chat-page-modal>div").eq($(this).index()).show().siblings().hide();
			//显示id更换
			showChatId = $(this).attr("id");
			showPage = ".chat-page-modal-content[data-id=" + showChatId + "]";
			//消息已读
			if($(showPage + " .chat-info>div").last().hasClass("chat-info-receive")) {
				var infoId = $(showPage + " .chat-info>.chat-info-receive").last().attr("id");
				infoIsRead(infoId, openPageType());
			}
			rollBottom(); //滚动底部
		});
		//聊天顶部切换
		$(".chat-page-nav>li").unbind("click").click(function() {
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
			if($(this).children().is(".fa-folder-o")) {
				$(showPage + " .chat-page-content .chat-page-file").show().siblings().hide();
				$(showPage + " .file-list tr div table").empty();
				var sessionType = $(showPage).attr("data-chat-type");
				console.log(sessionType);
				if(sessionType != 4) {
					chatFilePage(judgeType(sessionType));
					console.log(judgeType(sessionType));
				} else {
					chatFilePage(3);
				}
			}
		});
		$(".fa-cog").unbind("click").click(function() {
			loadGroupSet();
		});
		//@功能
		$(".fa-at").unbind("click").click(function(e) {
			var obj = this;
			if(!$(this).next().is(".friend-at")) {
				ws.onsend(24, {
					"group_id": showChatId
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
		//粘贴过滤
		$(".chat-text").unbind("paste").bind("paste", function(e) {
			e.preventDefault();
			catchScreenShot(this, event, insertHtmlAfterCursor);
			var pastedText = undefined;
			if(window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
				console.log(window.clipboardData);
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
				console.log(e.originalEvent);
			}
			console.log("粘贴内容：" + pastedText);
			//$(this).html(pastedText.replace(/(^\s+)/g, "").replace(/(\s)+/g, "<br>"));
			if(pastedText.indexOf("chat-image") != -1) {
				var dom = $("<div></div>").html(pastedText);
				dom.children(".chat-image").each(function(i) {
					$(this).replaceWith($(this)[0].outerHTML.replace("chat-image\"", "chat-image\" data-labface=\"[img_" + $(this).attr("src") + "]\""));
				});
				pastedText = dom.html();
			}
			if(pastedText.indexOf("/face/") != -1) {
				var dom = $("<div></div>").html(pastedText);
				dom.children(".chat-face").each(function(i) {
					var thisHtml = $(this)[0].outerHTML;
					var num = thisHtml.match(/\/face\/(\S*)"/)[1];
					$(this).replaceWith(thisHtml.replace("gif\"", "gif\" data-labface=\"[em_" + num + "]\""));
				});
				pastedText = dom.html();
			} else
				pastedText = pastedText.replace(/(^\s+)/g, "").replace(/(\s)+/g, "<br>");
			insertHtmlAfterCursor($(this), pastedText);
			bindDblclick($(this));
		});

		//聊天记录
		$(".char-info-record").unbind("click").click(function() {
			//清空输入的历史
			$(".view-chart-history-content-footer").data({
				"page": 1,
				"limit": 20
			});
			$(".key-word-search").addClass("hide");
			$(".key-word-search input[type=text]").val("");
			//绑定关闭事件
			$('.fa-close').unbind("click").click(function() {
				$(".view-chart-history-container").animate({
					right: "-540px"
				}, 500, function() {
					$(this).addClass("hide");
				});
			});
			loadChatHistory(); //初始加载
			//聊天记录底部筛选
			//跳转到第n页
			$(".view-chart-history-content-footer>div:lt(4) i").unbind("click").click(function() {
				var page = parseInt($(".view-chart-history-content-footer").data("page"));
				var allpage = parseInt($(".view-chart-history-content-footer").data("allpage"));
				if($(this).hasClass("fa-fast-backward")) { //跳转到第一页
					$(".view-chart-history-content-footer").data("page", 1);
				} else if($(this).hasClass("fa-backward")) { //跳转到前一页
					if(page == 1) {
						$.showErrorGritter("已经是第一页了");
						return false;
					}
					$(".view-chart-history-content-footer").data("page", page - 1);
				} else if($(this).hasClass("fa-forward")) { //跳转到后一页
					if(page == allpage) {
						$.showSuccessGritter("已经是最后一页");
						return false;
					}
					$(".view-chart-history-content-footer").data("page", page + 1);
				} else { //跳转到最后一页
					$(".view-chart-history-content-footer").data("page", allpage);
				}
				loadChatHistory();
			});
			////聊天记录关键字搜索
			$(".view-chart-history-container .search-chart-history").unbind("click").click(function(e) {
				if($(".key-word-search").hasClass("hide")) {
					$(".key-word-search").removeClass("hide");
					$(".view-chart-history-content-body").css("height", "84%");
				} else {
					$(".key-word-search").addClass("hide");
					$(".view-chart-history-content-body").css("height", "88%");
				}
				$(".key-word-search input").val("");
			});
			//聊天记录确认按钮
			$(".key-word-search .btn-key-word-search").unbind("click").click(function() {
				$(".view-chart-history-content-footer").data({
					"page": 1,
					"limit": 20
				});
				loadChatHistory();
			});
			//选择日期查询聊天记录
			$(".view-chart-history-sel-time .date-picker").unbind("change").change(function(e) {
				loadChatHistory();
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
		});
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
		$(formContainers + " .fa-folder-o").attr("id", chatId + "file");
		$("#" + chatId + "file").initUploader({
			url: SAASAPIS.BS.IMupload.document,
			isDownload: true,
			up_container: formContainers + " .chat-file-uploaded",
			FilesAdded: function(up, files) {
				console.log(up.files);
				if(up.files.length > 1) {
					$.showErrorGritter("文件正在上传中。。请稍后再试！");
					up.splice(1, 99999);
					console.log(up.files);

				} else {
					$(formContainers + " .chat-file-uploaded").removeClass("hide");
					return true;
				}

			},
			FileUploaded: function(up, file, response) {
				$(formContainers + " .chat-file-uploaded").addClass("hide");
				if(!isUnline()) return false;
				var resp = JSON.parse(response.response);
				var changeFileData = JSON.stringify(resp.data);
				if(resp.code == 0) {
					console.log(SAASAPIS.BS.IMupload.document)
					var filesPath = resp.data.path;
					var filesName = resp.data.name;
					changeFileData = "[file_" + changeFileData + "]";
					var data = {
						"fileData": resp.data
					}
					sendMessage(changeFileData, messageType.files, data);
				} else {
					$.showErrorGritter("上传失败：" + resp.msg);
				}
				up.splice(0, 99999);
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
					var chatText = $(showPage + " .chat-text").html();
					var filesPath = resp.data.path;
					var imgStr = "<img src=" + filesPath + " class=\"chat-image\" data-labface=\"[img_" + filesPath + "]\" />";
					insertHtmlAfterCursor($(showPage + " .chat-text"), imgStr);
					bindDblclick($(showPage + " .chat-text"));
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
		$(".btn-send").unbind("click").click(function() {
			sendMessageMake();
		});
		$(".chat-text").unbind("keydown").keydown(function(e) {
			if(!e.shiftKey && e.keyCode == 13) { //发送
				e.preventDefault();
				if($(".input-at-list").length != 0) {
					$(".input-at-list .active").trigger("click");
					return false;
				}
				sendMessageMake();
			}
			if(e.shiftKey && e.keyCode == 13) { //换行
				e.stopPropagation();
			}
		});
		$(".chat-text").unbind("keyup").keyup(function(e) {
			console.log("2")
			if(openPageType() == "2") {
				if(e.keyCode == 38) { //up
					moveSelect(1);
					return false;
				} else if(e.keyCode == 40) {
					moveSelect(-1);
					return false;
				}
				catchInputAt(this);
			}
		});

	}

	function catchInputAt(obj) { //输入@弹出@功能
		var val = $(obj).text();
		//var lastWord = $(obj).val().substring(valLength - 1, valLength);
		var atAll = val.match(/@/g);
		var atEmpLength = $(obj).children("span").length;
		var le = 1;
		if(atAll) {
			le = atAll.length - atEmpLength;
		}
		console.log(le);
		if(val.lastIndexOf("@") != -1 && le != 0) {
			//showAtPage(obj);
			if($(".input-at-list").length == 0) {
				$("body").append("<ul class='input-at-list' unselectable=\"on\" onmousedown=\"return false;\"></ul>");
			} //定位
			resetOffset($(obj));
			loadAtEmp(obj);
		} else {
			$('.input-at-list').remove();
		}
	}

	function loadAtEmp(obj) {
		if(!$(obj).data("member")) {
			ws.onsend(ws.cmdTag.REQUESTDROUPMEMBER, {
				"group_id": showChatId
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载群成员失败：" + data.data.message);
					return false;
				}
				$(obj).data("member", data.data);
				searchAtEmp(obj, data.data);
			});
		} else {
			searchAtEmp(obj, $(obj).data("member"));
		}
	}

	function searchAtEmp(obj, data) {
		$(".input-at-list li").remove();
		var txtAry = $(obj).text().split("@");
		var search_txt = txtAry[txtAry.length - 1];
		for(var i = 0; i < data.length; i++) {
			if(pinyinSearch(search_txt, data[i].employee_name)) {
				if($(".input-at-list").children("li").length < 6) {
					var dom = "<li class=\"" + (i == 0 ? "active" : "") + "\" data-id=\"" + data[i].employee_id + "\">" + data[i].employee_name + "</li>";
					$(".input-at-list").append(dom);
				}
			}
		}
		if($(".input-at-list li").length == 0)
			$(".input-at-list").remove();
		$("body").unbind("click").click(function() {
			if($(event.target).parents(".input-at-list").length == 0) {
				$(".input-at-list").remove();
			}
		});

		$(".input-at-list li").click(function() {
			insertHtmlAfterCursor($(showPage + " .chat-text"), "<span contenteditable=\"false\" class=\"at-list\" data-id=" + $(this).data("id") + ">@" + $(this).text() + "<span>");
			$(obj).html($(obj).html().replace("@<span", "<span"));
			$(".input-at-list").remove();
		});
		$(obj).unbind("click").click(function() {
			$(".input-at-list").remove();
		});
	}

	function moveSelect(code) { //@上下移动
		if(code == 1) { //向上
			console.log("up")
			if($(".input-at-list .active").index() == 0) {
				$(".input-at-list li:last-child").addClass("active").siblings().removeClass("active");
				return false;
			}
			$(".input-at-list .active").removeClass("active").prev().addClass("active");
		} else { //下
			console.log("down")
			if($(".input-at-list .active").index() == $(".input-at-list li").length - 1) {
				$(".input-at-list li:first-child").addClass("active").siblings().removeClass("active");
				return false;
			}
			$(".input-at-list .active").removeClass("active").next().addClass("active");
		}
	}

	function showAtPage(obj) {
		if($(".input-at-list").length == 0) {
			$("body").append("<ul class='input-at-list'></ul>");
		} //定位
		resetOffset($(obj));
	}

	function resetOffset($textField) {
		var offset = $textField.caret('offset');
		var position = $textField.caret('position');
		$(".input-at-list").css({
			"top": offset.top,
			"left": offset.left
		});
		return offset
	}

	//请求聊天记录
	function loadChatHistory() {
		var type = $(showPage).attr("data-chat-type");
		if(type != 4) {
			ws.onsend(ws.cmdTag.READCHARTHISTORY, {
				msg_limit: $(".view-chart-history-content-footer").data("limit"),
				msg_page: $(".view-chart-history-content-footer").data("page"),
				msg_session_id: showChatId,
				msg_begin_time: $(".view-chart-history-sel-time .date-picker").val(),
				msg_end_time: $(".view-chart-history-sel-time .date-picker").val(),
				msg_keyword: $(".key-word-search input").val(),
				msg_session_type: openPageType()
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载聊天记录失败：" + data.data.message);
					return false;
				}
				receiveHistoryChart(data);
			});
		} else {
			ws.onsend(ws.cmdTag.CUSTOMER_LATELY_HISTORY, {
				"msg_begin_time": $(".view-chart-history-sel-time .date-picker").val(),
				"to_user": showChatId,
				"msg_page": $(".view-chart-history-content-footer").data("page"),
				"msg_limit": $(".view-chart-history-content-footer").data("limit"),
				"msg_end_time": $(".view-chart-history-sel-time .date-picker").val(),
				"msg_keyword": $(".key-word-search input").val()
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载聊天记录失败：" + data.data.message);
					return false;
				}
				receiveHistoryChart(data);
			});
		}
	}
	//处理收到的历史聊天记录信息
	function receiveHistoryChart(data) {
		if(data.action == 500) {
			$.showErrorGritter("获取历史记录失败！");
			return false;
		}
		if(data.action == 200) return false;
		data.data.data.length > 0 && data.data.data.reverse();
		$(".view-chart-history-content .history-total-record").html(data.data.total_num);
		var nums = Math.ceil(data.data.total_num / parseInt($(".view-chart-history-content-footer").data("limit")));
		var nowPage = (nums == 0 ? "1" : nums);
		$(".view-chart-history-content-footer").data("allpage", nowPage);
		$(".view-chart-history-content .view-chart-history-content-body").html("");
		var allMessageDom = "";
		$.each(data.data.data, function(i, item) {
			var oneMessage = "";
			if(i == 0 || $.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time) >= 1) {
				oneMessage += //时间
					"<div class=\"this-chart-record-history-time\">" +
					"<i></i>" +
					"<span style='color:#999;'>" + (new Date(changeDate(item.message_time))).format("yyyy-MM-dd") + "</span>" +
					"<i></i>" +
					"</div>";
			}
			oneMessage += //消息
				"<div class=\"view-chart-historyone-message\">" +
				"<span class=\"message-name\" style='color:" + (item.message_send_by.employee_id == myId ? "#42B475" : "#009ED8") + "'>" + item.message_send_by.employee_name + "</span>" +
				"<span class=\"message-time\" style='color:" + (item.message_send_by.employee_id == myId ? "#42B475" : "#009ED8") + "'>" + changeDate(item.message_time) + "</span><br>" +
				"<span style='' class=\"message-detail history-message-detail " + (item.message_type == 1 ? "history-message-detail-file" : "") + "\">" + dealMessage(item) + "</span>" +
				"</div>";
			allMessageDom += oneMessage;
		});
		if(!allMessageDom) {
			allMessageDom = "没有该条件下的聊天记录信息！";
		}
		$(".view-chart-history-content .view-chart-history-content-body").html(allMessageDom);
		$(".view-chart-history-container").removeClass("hide");
		$(".view-chart-history-container").animate({
			right: "0px"
		}, 300, function() {});
		parent.bindIncident();
	}

	//发送数据收集
	function sendMessageMake() {
		var chatDom = $(showPage + " .chat-text");
		var sendText = "";
		chatDom.children("img").each(function() {
			var chatData = $(this).attr("data-labface");
			$(this).replaceWith(chatData);
		});
		var atData = [];
		chatDom.children("span").each(function() {
			atData.push($(this).attr("data-id"));
			$(this).replaceWith($(this).text());
		});
		sendText = chatDom.text();
		if(!isUnline()) return false; //是否在线
		var changeMessage = sendText.replace(/\[img_([\s\S]*?)\]/g, "图");
		if(changeMessage.length >= 500) {
			$.showErrorGritter("消息字数不能超过500个字，请重新输入！");
			return false;
		}
		if(messageFilter(sendText)) {
			$.showErrorGritter("消息不能为空，请重新输入！");
			return false;
		}
		chatDom.html("");
		var data = {
			"atData": atData,
			"msg_content": sendText
		}
		sendMessage(sendText, messageType.txt, data);
	}
	//查看聊天记录
	function viewAllChatHistory() {
		$(".char-info-record").trigger("click");
	}

	//加载聊天文件
	function chatFilePage(type) {
		$(showPage + " .chat-page-file").data({
			"page": 1,
			"limit": 14
		});
		loadChatFile();
		//滚动加载
		$(showPage + " .file-list-data").unbind("scroll").scroll(function() {
			var nScrollHight = $(this)[0].scrollHeight;
			var nScrollTop = $(this)[0].scrollTop;
			var nDivHight = $(this).height();
			if(nScrollTop + nDivHight >= nScrollHight) {
				var page = parseInt($(showPage + " .chat-page-file").data("page"));
				$(showPage + " .chat-page-file").data("page", ++page);
				loadChatFile();
			}
		});
		//聊天文件搜索
		$(showPage + " .search-ico").unbind("click").click(function() {
			$(showPage + " .file-list-data table").empty();
			$(showPage + " .chat-page-file").data("page", 1);
			loadChatFile();
		});
	}
	//聊天文件加载
	function loadChatFile() {
		var type = $(showPage).attr("data-chat-type");
		if(type != 4) {
			ws.onsend(ws.cmdTag.REQUEST_CHART_FILE, {
				"file_keyword": $(showPage + " .chat-page-file .file-search-text").val(),
				"msg_session_id": showChatId,
				"msg_session_type": openPageType(),
				"msg_type": messageType.files,
				"page": $(showPage + " .chat-page-file").data("page"),
				"page_num": $(showPage + " .chat-page-file").data("limit")
			}, function(data) {
				if(data.action == 200) return false;;
				if(data.action == 500) {
					$.showErrorGritter("加载聊天文件失败!");
					return false;
				}
				showChatFile("1", data);
			});
		} else {
			ws.onsend(ws.cmdTag.CUSTOMER_CHAT_FILE, {
				"file_keyword": $(showPage + " .chat-page-file .file-search-text").val(),
				"to_user": showChatId,
				"msg_type": messageType.files,
				"page": $(showPage + " .chat-page-file").data("page"),
				"limit": $(showPage + " .chat-page-file").data("limit")
			}, function(data) {
				if(data.action == 200) return false;;
				if(data.action == 500) {
					$.showErrorGritter("加载聊天文件失败!");
					return false;
				}
				showChatFile("2", data);
			});
		}
	}
	//加载聊天文件
	function showChatFile(type, data) {
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
			try {
				fileData = JSON.parse(fileData);
			} catch(e) {
				//TODO handle the exception
				continue;
			}
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
			str += "<td width=\"36%\"><img class=\"file-ico\" src=\"" + BASEAPIURL + "/icons/" + fileType + ".png\"><span class=\"file-name\" title=" + fileData.name + ">" + fileData.name + "</span></td>";
			str += "<td width=\"20%\">" + fileTime + "</td>";
			str += "<td width=\"15%\">" + fileSize + "MB</td>";
			str += "<td width=\"15%\">" + (type == "1" ? (chatFileDataList[i].message_send_by.employee_name) : (chatFileDataList[i].message_send_by.user_name)) + "</td>";
			str += "<td width=\"15%\" data-path=" + fileData.path + ">";
			str += "<a href=\"javascript:;\" class=\"view-files\" onclick=\"onlineRead('" + fileData.name + "','" + (fileData.path_code ? fileData.path_code : "") + "')\">预览</a>|";
			str += "<a class=\"files-download\" href=\"javascript:;\">下载</a>";
			str += "</td>";
			str += "</tr>";
			$(showPage + " .file-list div.file-list-data table").append(str);
			$("#" + fileData.id).data("code", fileData.path_code);
		}
		//添加下载事件
		$(showPage + " .file-list .files-download").unbind("click").click(function() {
			var src = $(this).parent().attr("data-path");
			console.log(src)
			var code = $(this).parent().parent().data("code");
			var fileName = $(this).parent().parent().find(".file-name").text();
			$.downloadFile("", code, fileName);
		});
	}
	//加载群会话主题列表
	function loadHistoryDiscussion(searchDate, searchKeyText, searchPage, searchLimit) {
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
				str += "<span class=\"inform-name pull-left\"><span>" + isTodayOrYesterday(discussData[i].topic_create_date, true, false) + "</span>—<span>" + (discussData[i].topic_close_date ? isTodayOrYesterday(discussData[i].topic_close_date, true, false) : "至今") + "</span></span>";
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
	function loadGroupSet(modaId) {
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
		var groupSrc = $(showPage + " .chat-page-top img").attr("src");
		var groupName = $(showPage + " .info-name").text();
		$(formContainer + " .group-set-info>a img").attr("src", groupSrc);
		$(formContainer + " .group-set-name").html(groupName);
		//加载群员和管理员群主
		loadGroupSetMember(formContainer, modalId, function() {
			//踢出群成员
			$(formContainer + " .group-member .list-detele").unbind("click").click(function(event) {
				var obj = this;
				var e = window.event || event;
				if(e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器 
					e.stopPropagation();
				} else {
					//兼容IE的方式来取消事件冒泡 
					window.event.cancelBubble = true;
				}
				removeGroupMeber(modalId, obj);
			});
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
			var groupName = $(formContainer + " .group-set-name-text").val();
			var groupSrc = $(formContainer + " .group-set-info img").attr("data-path");
			var obj = this;
			if($(this).hasClass("fa-check")) {
				console.log({
					"group_desc": groupName,
					"except_group_id": showChatId
				})
				ws.onsend(ws.cmdTag.HAS_REPEAT_GROUP_NAME, {
					"group_desc": groupName,
					"except_group_id": showChatId
				}, function(data) {
					console.log(data)
					if(data.action == 500) {
						$.showErrorGritter(data.data.message);
						return false;
					} else {
						if(data.action == 200)
							return false;
						$(obj).hide().siblings().hide();
						$(formContainer + " .fa-pencil").show();
						$(formContainer + " .group-set-info a span").animate({
							bottom: '-20px'
						}, 100);
						//确认
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
					}
				});
			} else {
				//取消
				$(obj).hide().siblings().hide();
				$(formContainer + " .fa-pencil").show();
				$(formContainer + " .group-set-info a span").animate({
					bottom: '-20px'
				}, 100);
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
			$(formContainer + " .group-member>div.active").removeClass("active");
			//权限判断
			var empLevel = $(formContainer + " .group-member>div[data-id=" + myId + "]").attr("data-member-type");
			if(empLevel == 1) {
				$(formContainer + " .group-member>div[data-member-type=1]").siblings().removeClass("group-member-boxs");
			} else if(empLevel == 2) {
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
			showGroupSet('admin');
			//添加点击选中事件(限制：最多设置五名，不能选择群主)
			$(formContainer + " .group-member>div").unbind("click").click(function() {
				selectGroupClick(this, 'admin');
			});
			//保存
			$(formContainer + " .btn-save").unbind("click").click(function() {
				saveGroupSet("admin");
			});
		});
		//转让群主
		$(formContainer + " .group-set-change").click(function() {
			//还原
			showGroupSet('transfer');
			//添加点击选中事件
			$(formContainer + " .group-member>div").unbind("click").click(function() {
				selectGroupClick(this, "transfer");
			});
			//保存
			$(formContainer + " .btn-save").unbind("click").click(function() {
				saveGroupSet("transfer");
			});
		});
		$(formContainer + " .btn-cancel").unbind("click").click(function() {
			cancelGroupSet();
		});

		function removeGroupMeber(modalId, obj) {
			$.modal().confirm("确定踢出该成员？", function() {
				var emysId = $(obj).parent().attr('data-id');
				ws.onsend(39, {
					"employee_id": emysId,
					"group_id": showChatId
				}, function(data) {
					if(data.action == 200) {
						$(obj).parent().remove();
						loadGroupSet(modalId);
						$.showSuccessGritter("移出成员成功");
					}
					if(data.action == 500) {
						$.showErrorGritter("移出失败！");
						return false;
					}
				});
			});
		}

		function selectGroupClick(obj, type) { //点击选中事件
			if(type) {
				if(type == "admin") {
					var selectNum = parseInt($(formContainer + " .already-select").text());
					if($(obj).hasClass("active")) { //已选中
						$(obj).removeClass("active");
						$(formContainer + " .already-select").html(selectNum - 1);
					} else {
						if($(obj).parent().find(".active").length >= 5) {
							$.showErrorGritter("最多只能设置5名管理员！");
							return false;
						}
						if($(obj).attr("data-member-type") == "1") {
							return false;
						}
						$(obj).addClass("active");
						$(formContainer + " .already-select").html(selectNum + 1);
					}
				} else {
					$(formContainer + " .group-member>div").removeClass("active");
					$(obj).addClass("active");
				}
			}
		}

		function showGroupSet(type) { //打开群设置（设置管理员和转让群主）
			if(type) {
				cancelGroupSet();
				//取消删除群成员的hover动作
				$(formContainer + " .group-member>div").addClass("group-member-boxs");
				$(formContainer + " .group-set-administrator-select").show();
				if(type == "admin") { //--设置管理员
					var selectGroupNum = $(formContainer + " .group-member>div[data-member-type=2]").length;
					$(formContainer + " .group-set-administrator-select .select-administrator-num").html("请选择管理员：(<span class=\"already-select\">" + selectGroupNum + "</span>/<span class=\"all-number\">5</span>)");
					//选中管理员成员加样式
					$(formContainer + " .group-member>div").each(function(index) {
						if($(this).attr("data-member-type") == 2) {
							$(this).addClass("active");
						}
					});
				} else { //--转让群主
					$(formContainer + " .group-set-administrator-select .select-administrator-num").html("请选择转让对象：");
					$(formContainer + " .group-member>div").each(function(index) {
						if($(this).attr("data-member-type") == 1) {
							$(this).addClass("active");
						}
					});
				}
			}
		}

		function saveGroupSet(type) { //保存群设置（设置管理员和转让群主）
			if(type) {
				var selectData = [];
				$(formContainer + " .group-member .active").each(function(index) {
					selectData.push($(this).attr("data-member-id"));
				});
				console.log(selectData)
				if(type == "admin") {
					ws.onsend(ws.cmdTag.SETGROUPADMIR, {
						"group_id": showChatId,
						"group_members": selectData
					}, function(data) {
						if(data.action == 200) loadGroupSet(modalId);
						if(data.action == 500) {
							$.showErrorGritter("设置管理员失败!");
							return false;
						}
					});
				} else {
					ws.onsend(ws.cmdTag.GROUPTRANSFER, {
						"group_member": selectData
					}, function(data) {
						if(data.action == 200) {
							loadGroupSet(modalId);
							ws.onsend(21, {});
							$.showSuccessGritter("转让成功");
							//判断是否是讨论组。是否是话题创建人
							if($(".infolist-grouplist li[data-id=" + showChatId + "]").parents("li").attr("data-grouptype") != 3) { //不是讨论组
								var groupThemeData = $(".infolist-grouplist li[data-id=" + showChatId + "]").data("theme")
								if(groupThemeData.topic_creator.employee_id != myId) {
									$(showPage + " .discussion-buttom .off-theme").remove();
								}
							} else {
								$(showPage + " .discussion-buttom .off-theme").remove();
							}
						}
						if(data.action == 500) {
							$.showErrorGritter("转让失败！");
							return false;
						}
					});
				}
			}
		}

		function cancelGroupSet() { //清除群设置（设置管理员和转让群主）
			$(formContainer + " .group-set-administrator-select").hide();
			$(formContainer + " .group-member .active").removeClass('active');
			$(formContainer + " .group-member>div").unbind("click");
			$(formContainer + " .group-member>div").removeClass("group-member-boxs");
		}
		//退出群聊
		$(formContainer + " .btn-exit-group").click(function() {
			if($(".group-custodian-main").attr("data-id") == myId) {
				$.showErrorGritter("请转让群主后操作！");
				return false;
			}
			ws.onsend(ws.cmdTag.EXITGROUP, {
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
	}
	//更新群资料
	function heavyLoadGroupData(objData, data) {
		ws.onsend(21, {});
		ws.onsend(22, {});
		console.log("修改群名称及头像：");
		console.log(objData);
		$("#" + showChatId + " img").attr("src", objData[1]);
		$("#" + showChatId + " .chat-list-name").attr("title", objData[0]);
		$("#" + showChatId + " .chat-list-name").html(objData[0]);
		$(showPage + " .chat-page-top img").attr("src", objData[1]);
		$(showPage + " .info-name").html(objData[0]);
	}

	function loadGroupSetMember(container, modalId, callback) {
		ws.onsend(ws.cmdTag.REQUESTDROUPMEMBER, {
			"group_id": showChatId
		}, function(data) {
			if(data.action == 200) return false;
			if(data.action == 500) {
				$.showErrorGritter("加载成员失败!");
				return false;
			}
			//清空
			$(container + " .group-custodian-separate").siblings("div").remove();
			$(container + " .group-member").empty();
			var groupMember = data.data;
			//加载群管理及群主
			$(container + " .group-man-number").html("群成员<span style='color:#9A9A9A;font-size:12px'>（" + groupMember.length + "人）</span>");
			var groupMemberData = [];
			var isDeteleJurisdiction = true,
				isDeteleAllJurisdiction = true;
			for(var i in groupMember) {
				if(groupMember[i].member_type == 1) {
					var str = "";
					str += "<div class=\"group-custodian-main group-member-box\" onclick=\"openPersonageInfo(this,'" + modalId + "')\" data-state=" + groupMember[i].employee_enabled + " data-id=" + groupMember[i].employee_id + " data-member-id=" + groupMember[i].member_id + " data-member-type=" + groupMember[i].member_type + ">";
					str += "<img src=" + groupMember[i].employee_avatar + ">";
					str += "<span class=\"group-custodian-main-name css-overhidden\" title=" + groupMember[i].employee_name + ">" + groupMember[i].employee_name + "</span>";
					str += "</div>";
					$(container + " .group-custodian-separate").before(str);
					$(container + " .group-member").prepend(str);
					//查看是否是群主
					if(myId == groupMember[i].employee_id) {
						console.log("是群主");
						$(container + " .group-set-menu span").show();
						$(container + " .group-set .fa-pencil").show();
						$(container + " .btn-dissolve-group").show();
					}
				} else if(groupMember[i].member_type == 2) {
					var str = "";
					str += "<div class=\"group-custodian-assistant group-member-box\" onclick=\"openPersonageInfo(this,'" + modalId + "')\" data-state=" + groupMember[i].employee_enabled + " data-id=" + groupMember[i].employee_id + " data-member-id=" + groupMember[i].member_id + " data-member-type=" + groupMember[i].member_type + ">";
					str += "<img src=" + groupMember[i].employee_avatar + ">";
					str += "<span class=\"group-custodian-assistant-name css-overhidden\" title=" + groupMember[i].employee_name + ">" + groupMember[i].employee_name + "</span>";
					str += "<span class=\"info-num list-detele\">×</span>";
					str += "</div>";
					$(container + " .group-custodian-separate").after(str);
					$(container + " .group-member").append(str);
					if(myId == groupMember[i].employee_id) {
						console.log("是管理员");
						isDeteleAllJurisdiction = false; //不能删除群管理
						$(container + " .group-set-add").show();
						$(container + " .group-set .fa-pencil").show();
					}
				} else {
					if(myId == groupMember[i].employee_id) {
						isDeteleJurisdiction = false; //没有删除成员权限
					}
					groupMemberData.push(groupMember[i]);
				}
			}
			for(var i in groupMemberData) { //加载群成员
				var strs = "";
				strs += "<div class=\"group-member-box\" onclick=\"openPersonageInfo(this,'" + modalId + "')\" data-state=" + groupMemberData[i].employee_enabled + " data-id=" + groupMemberData[i].employee_id + " data-member-id=" + groupMemberData[i].member_id + " data-member-type=" + groupMemberData[i].member_type + ">";
				strs += "<img src=" + groupMemberData[i].employee_avatar + ">";
				strs += "<span class=\"group-custodian-assistant-name css-overhidden\" title=" + groupMemberData[i].employee_name + ">" + groupMemberData[i].employee_name + "</span>";
				strs += "<span class=\"info-num list-detele\">×</span>";
				strs += "</div>";
				$(container + " .group-member").append(strs);
			}
			if(!isDeteleAllJurisdiction) {
				console.log('群管理1');
				$(container + " .group-member>div[data-member-type=1]").addClass("group-member-boxs");
				$(container + " .group-member>div[data-member-type=2]").addClass("group-member-boxs");
			}
			if(!isDeteleJurisdiction) {
				console.log('群成员')
				$(container + " .group-member>div").addClass("group-member-boxs");
			}
			//判断是否异常，异常则加非正常状态
			$(container + " .group-member>div").each(function(index) {
				if($(this).attr("data-state") == "false") {
					$(this).addClass("filter");
					$(this).attr("title", "该群成员账号已被停用")
				}
			});
			callback && callback();
		});
	}
	//获取群人员
	function groupMemberNum(id) {
		if(id) {
			ws.onsend(24, {
				"group_id": id
			}, function(data) {
				if(data.action == 200) return false;
				if(data.action == 500) {
					$.showErrorGritter("加载群成员失败！");
					return false;
				}
				$(".chat-page-modal-content[data-id=" + id + "] .info-nums").text(data.data.length + "人");
			});
		}
	}
	//读取群成员
	function searchGroupMember(typeObj, data) {
		window.groupMember = data.data;
		var groupNumber = groupMember.length;
		if(typeObj.type == "@") {
			var str = "<div class=\"at-page friend-at\">";
			str += "<div class=\"at-top\">";
			str += "<i class=\"fa fa-search pull-right search-ico\" aria-hidden=\"true\"></i>";
			str += "<input type=\"text\" placeholder=\"请输入姓名进行查找\" />";
			str += "</div>";
			str += "<div class=\"at-group-list\">";
			str += "<ul>";
			for(var i in groupMember) {
				if(groupMember[i].employee_id == myId) {
					continue;
				}
				str += "<li data-id=" + groupMember[i].employee_id + " unselectable=\"on\" onmousedown=\"return false;\">";
				str += "<img src=" + groupMember[i].employee_avatar + " />";
				str += "<span class=\"at-group-list-name\">" + groupMember[i].employee_name + "</span>";
				str += "(<span class=\"at-group-list-depart\">" + groupMember[i].depa_name + "</span>)";
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
				//$(showPage + " .chat-text").html(text + "<span contenteditable=\"true\"><b contenteditable=\"false\" class=\"at-list\" data-id=" + id + ">@" + name + "</b><span>");
				insertHtmlAfterCursor($(showPage + " .chat-text"), "<span contenteditable=\"false\" class=\"at-list\" data-id=" + id + ">@" + name + "<span>");
				$(showPage + " .chat-text").focus();
				$(showPage + " .at-page").remove();
			});
			//搜索
			$(".at-page input").keyup(function() {
				var searchText = $(this).val();
				if(searchText == "") {
					$(".at-page li").show();
				} else {
					$(".at-page li").each(function(index) {
						var contrastText = $(this).children(".at-group-list-name").text();
						if(!pinyinSearch(searchText, contrastText)) {
							$(this).hide();
						} else {
							$(this).show();
						}
					});
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
	//获取或保存群主题
	function groupDispose(data) {

	}
	//更新最后阅读消息ID
	function updataLastReadMessageId(objids) {
		console.log(objids);
		if(objids) {
			for(var i = 0; i < objids.length; i++) {
				var lastMessageId = $(".chat-page-modal-content[data-id=" + objids[i] + "] .chat-info>div").last().attr("id");
				if($(".sub-menu-service a[data-id=" + objids[i] + "]").length == 0) {
					saveData(".infolist-chatlist li[data-id=" + objids[i] + "]", "readMessageId", lastMessageId);
				} else {
					saveData(".sub-menu-service a[data-id=" + objids[i] + "]", "readMessageId", lastMessageId);
				}
			}
		}
	}
	var isFirstNoReadInfo = true;
	//打开聊天弹窗
	function openChatPage(data) {
		//聊天模板类型(1-群聊、2-私聊、3-通知、4-客服、5-业务、6-群聊（讨论群）)
		var chatType = data.type;
		var chatId = data.Id;
		var chatObjName = data.Name;
		var chatObjAvatar = data.Avatar;
		var width = data.width == "" ? "900px" : data.width;
		var height = data.height == "" ? "650px" : data.height;
		var isOnline = (data.Online == "false" ? false : true);
		chatHistoryPage = 3;
		isMinPage = false;
		showChatId = chatId;
		showPage = ".chat-page-modal-content[data-id=" + showChatId + "]";
		//群聊删除@我
		if((data.type == 1 || data.type == 6) && $(".infolist-chatlist li[data-id=" + data.Id + "] .at-me").length != 0) {
			$(".infolist-chatlist li[data-id=" + data.Id + "] .at-me").remove();
		}
		if(!isUnline() || chatId == myId) return false; //掉线不可操作、过滤自己
		$(".chat-page").show(); //最小化则显示出来
		//关闭历史记录
		$(".view-chart-history-content-header .fa-close").trigger("click");
		loadchatPage(width, height); //加载聊天窗口
		if(!isExist(chatId)) { //是否已经存在
			loadChatPageLeftList(chatId, chatType, isOnline, chatObjName, chatObjAvatar); //加载左边列表
			loadChatPageMain(chatId, chatType, isOnline, chatObjName, chatObjAvatar); //加载主体
			isFirstNoReadInfo = true;
			loadRecentlyHistoryMessage(chatId, chatType); //加载最近消息
			pageAddEvent(chatId, chatType, isOnline, chatObjName, chatObjAvatar); //页面弹窗初始事件绑定；
			if(chatType == 1 || chatType == 6) {
				var groupThemeData = $(".infolist-grouplist li[data-id=" + showChatId + "]").data("theme");
				if(groupThemeData)
					loadGroupDiscussionList(groupThemeData, "1"); //显示群主题
			}
		}
		dragPage(); //页面可拖动
		$(".chat-page-nav .fa-volume-down").parent().hide(); //群公告暂时隐藏
	}

}
//im和通讯录层次设置
function imOrAddressbookShow(type) {
	if(type == "im") {
		$(".address-book-page").css("z-index", "1");
		$(".chat-modal").css("z-index", "5");
	} else {
		$(".address-book-page").css("z-index", "5");
		$(".chat-modal").css("z-index", "1");
	}
}

function bindDblclick(obj) {
	//添加双击放大事件
	obj.find(".chat-image").unbind("dblclick").dblclick(function() {
		var src = [$(this).attr("src")];
		$(this).siblings(".chat-image").each(function() {
			src.push($(this).attr("src"));
		});
		magnifyImage(src);
	});
}
//图片放大
function magnifyImage(src) {
	console.log(src)
	if($(".magnify-image").length < 1) {
		//添加弹窗
		var str = "";
		str += "<div class=\"magnify-image-bg\">";
		str += "</div>";
		str += "<div class=\"magnify-image\">";
		str += "<a href=\"javascript:;\" class=\"img-icon magnify-off\"><img src=\"../resources/images/img-off.png\"></a>";
		str += "<a href=\"javascript:;\" class=\"img-icon magnify-left\"><img src=\"../resources/images/img-left.png\"></a>";
		str += "<div class=\"view-image\">";
		str += "<img data-index='0' src=\"" + src[0] + "\" class=\"big-image\">";
		str += "</div>";
		str += "<a href=\"javascript:;\" class=\"img-icon magnify-right\"><img src=\"../resources/images/img-right.png\"></a>";
		str += "</div>";
		$("body").append(str);
		$(".view-image").height($(window).outerHeight(true));
		$(".view-image").width($(window).outerWidth(true));
	}
	$(".img-icon").hover(function() {
		var src = $(this).children().attr("src");
		$(this).children().attr("src", src.replace(".png", "-hover.png"));
	}, function() {
		var src = $(this).children().attr("src");
		$(this).children().attr("src", src.replace("-hover", ""));
	});
	//last
	$(".magnify-left").click(function() {
		var i = $(".view-image img").attr("data-index");
		console.log(i)
		if(i == 0) {
			$.showErrorGritter("已经是第一张了!");
			return false;
		}
		i = parseInt(i) - 1;
		showImg(i);
	});
	//next
	$(".magnify-right").click(function() {
		var i = $(".view-image img").attr("data-index");
		console.log(i)
		if(i == src.length - 1) {
			$.showErrorGritter("已经是最后一张了!");
			return false;
		}
		i = parseInt(i) + 1;
		showImg(i);
	});

	function showImg(i) {
		$(".view-image img").attr({
			"src": src[i],
			"data-index": i
		});
	}
	//关闭事件
	$(".magnify-off").click(function() {
		$(".magnify-image,.magnify-image-bg").remove();
	});
	//	var modalId = $.modal({
	//		showFooter: false
	//	}).showOfLarge("查看图片", ".magnify-image", function() {});
	//	$("#" + modalId【 + " img").attr("src", src);
}
//判断是否相差1分钟
function isDifferTime(starTime, endTime, scopeNun) {
	if(starTime && endTime) {
		if(Math.abs(deteChangeTimestamp(endTime) - deteChangeTimestamp(starTime)) >= 60) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}
//消息去格式化
function messageImgFormat(message, type) {
	if(message && type) {
		if(type == 1) { //去标签[img除外]
			message.replace(/[<img(/s/S)>]/g, "[图片]");
		} else if(type == 2) {

		}
	}
}
//子页面历史记录查询
function chatHistory(id, type) {
	if(id && type) {
		if(!parent.ws) {
			$.showErrorGritter("请先登录聊天！");
			return false;
		}
		parent.ws.onsend(parent.ws.cmdTag.QUERY_GROUPID, {
			"discussing_data_id": id,
			"discussing_data_type": type
		}, function(data) {
			if(data.action == 500) {
				$.showErrorGritter("获取群失败！");
				return false;
			}
			if(data.action == 200) return false;
			if(!data.data.group_id) {
				$.showErrorGritter("当前无历史讨论");
				return false;
			}
			if($("body .history-discussion").length == 0)
				$("body").append("<div class=\"history-discussion hide\">" +
					"<!--聊天记录-->" +
					"<div class=\"view-chart-history-container\">" +
					"<div class=\"view-chart-history-content\">" +
					"<!--内容-->" +
					"<div class=\"view-chart-history-content-body\">" +
					"</div>" +
					"<!--尾部-->" +
					"<!--关键字查找-->" +
					"<div class=\"key-word-search hide\">" +
					"<input type=\"text\" placeholder=\"请输入关键字查找\" style=\"width: 95%;\" />" +
					"<a href=\"javascript:;\" class=\"btn-key-word-search\"><i class=\"fa fa-search\"></i></a>" +
					"</div>" +
					"<div class=\"view-chart-history-content-footer\">" +
					"<div class=\"view-chart-history-before\" style=\"float:left;\">" +
					"<i style=\"color: #999;display: inline-block;margin-right: 8px;\" class=\"fa fa-fast-backward fa-x\"></i>" +
					"<i style=\"color: #999;display: inline-block;margin-right: 4px;\" class=\"fa fa-backward fa-x\"></i>" +
					"</div>" +
					"<div style=\"border-left: 2px solid #ccc;border-right: 2px solid #ccc;padding: 0 5px;float:left;\">" +
					"第<span style=\"display: inline-block;width: 20px;line-height:20px;text-align:center;border: 1px solid #ccc;\" class=\"history-curr-pager\" contenteditable=\"true\">1</span>/" +
					"<span class=\"history-total-pager\"></span>页，" +
					"<span class=\"history-total-record\"></span>条" +
					"</div>" +
					"<div class=\"view-chart-history-after\" style=\"float:left;\">" +
					"<i style=\"color: #999;display: inline-block;margin-left: 4px;\" class=\"fa fa-forward fa-x\"></i>" +
					"<i style=\"color: #999;display: inline-block;margin-left: 8px;\" class=\"fa fa-fast-forward fa-x\"></i>" +
					"</div>" +
					"<div class=\"view-chart-history-sel-time\" style=\"float:right;margin-right: 20px;\">" +
					"<i class=\"fa fa-search fa-x\" style=\"color:#999;width: 18px;height:18px;\"></i>" +
					"<input type=\"text\" class=\"date-picker\" placeholder=\"年/月/日\" />" +
					"</div>" +
					"</div>" +
					"</div>" +
					"</div>" +
					"</div>");
			var keyWord = "";
			var msgLimit = 50;
			var currPage = 1;
			var historyChartTime = "";
			var modalId = $.modal({
				showFooter: false
			}).show("历史讨论", ".history-discussion", function() {});
			var contentLocation = "#" + modalId;
			$(contentLocation + " .modal-body").css("overflow", "initial");
			var chatId = data.data.group_id;
			var msgSeeionId = $(contentLocation + " .view-chart-history-content").attr("data-msg-session-id");
			historyChartTime = $(contentLocation + " .view-chart-history-sel-time .date-picker").val();
			parent.ws.onsend(43, {
				msg_limit: msgLimit,
				msg_page: currPage,
				msg_session_id: chatId,
				msg_session_type: "2",
				msg_begin_time: historyChartTime,
				msg_end_time: historyChartTime,
				msg_keyword: keyWord
			}, function(data) {
				receiveHistoryChart(chatId, data);
			});
			////聊天记录关键字搜索
			$(contentLocation + " .fa-search").click(function(e) {
				if($(contentLocation + " .key-word-search").hasClass("hide")) {
					$(contentLocation + " .key-word-search").removeClass("hide");
					$(contentLocation + " .view-chart-history-content-body").css("height", "85%");
				} else {
					$(contentLocation + " .key-word-search").addClass("hide");
					$(contentLocation + " .view-chart-history-content-body").css("height", "93%");
					keyWord = "";
				}
			});
			//聊天记录确认按钮
			$(contentLocation + " .key-word-search .btn-key-word-search").click(function() {
				keyWord = $(this).prev().val();
				var msgSeeionId = $(this).parent("").attr("data-msg-session-id");
				var historyChartTime = $(contentLocation + " .view-chart-history-sel-time .date-picker").val();
				currPage = $(contentLocation + " .history-curr-pager").html();
				parent.ws.onsend(43, {
					msg_limit: msgLimit,
					msg_page: currPage,
					msg_session_id: chatId,
					msg_session_type: 2,
					msg_begin_time: historyChartTime,
					msg_end_time: historyChartTime,
					msg_keyword: keyWord
				}, function(data) {
					receiveHistoryChart(chatId, data);
				});
			});
			//聊天记录底部筛选
			//跳转到第n页
			$(contentLocation + " .view-chart-history-content-footer>div:lt(4) i").click(function() {
				var currPage;
				if($(this).hasClass("fa-fast-backward")) { //跳转到第一页
					currPage = 1;
				} else if($(this).hasClass("fa-backward")) { //跳转到前一页
					if(parseInt($(contentLocation + " .history-curr-pager").html()) <= 1) {
						$.showErrorGritter("当前页已经是第一页！");
						return false;
					}
					currPage = parseInt($(contentLocation + " .history-curr-pager").html()) - 1;
				} else if($(this).hasClass("fa-forward")) { //跳转到后一页
					if(parseInt($(contentLocation + " .history-curr-pager").html()) >= parseInt($(".history-total-pager").html())) {
						$.showErrorGritter("当前页已经是最后一页！");
						return false;
					}
					currPage = parseInt($(contentLocation + " .history-curr-pager").html()) + 1;
				} else { //跳转到最后一页
					currPage = $(contentLocation + " .history-total-pager").html();
				}
				$(contentLocation + " .history-curr-pager").html(currPage);
				var messageSessionId = $(this).parent().parent().parent().attr("data-msg-session-id");
				//$(".history-curr-pager").html()
				var historyChartTime = $(contentLocation + " .view-chart-history-sel-time .date-picker").val();
				parent.ws.onsend(43, {
					msg_limit: msgLimit,
					msg_page: currPage,
					msg_session_id: chatId,
					msg_session_type: 2,
					msg_begin_time: historyChartTime,
					msg_end_time: historyChartTime,
					msg_keyword: keyWord
				}, function(data) {
					receiveHistoryChart(chatId, data);
				});
			});
			//手动输入页数查询
			$(contentLocation + " .view-chart-history-content-footer .history-curr-pager").keydown(function(e) {
				if(e.keyCode != 8) {
					if($(this).text().length >= 2) {
						$(this).text($(this).text().substring(0, $(this).text().length));
					}
					if(e.keyCode == 13) {
						e.preventDefault();
						if(parseInt($(this).html()) < 1) {
							$.showErrorGritter("页数不能小于1，请重新输入！");
						} else if(parseInt($(this).html()) > parseInt($(".history-total-pager").html())) {
							$.showErrorGritter("页数不能大于最大页数，请重新输入！");
						} else {
							var currPage = $(this).html();
							var messageSessionId = $(this).parent().parent().parent().attr("data-message-session-id");
							//$(".history-curr-pager").html()
							var historyChartTime = $(contentLocation + " .view-chart-history-sel-time .date-picker").val();
							parent.ws.onsend(43, {
								msg_limit: msgLimit,
								msg_page: currPage,
								msg_session_id: chatId,
								msg_session_type: 2,
								msg_begin_time: historyChartTime,
								msg_end_time: historyChartTime,
								msg_keyword: keyWord
							}, function(data) {
								receiveHistoryChart(chatId, data);
							});
						}
					}
				}
			});
			//选择日期查询聊天记录
			$(contentLocation + " .view-chart-history-sel-time .date-picker").change(function(e) {
				//if(e.keyCode!==13) return false;
				var currPageContainer = $(contentLocation + " .view-chart-history-content-footer .history-curr-pager");
				if(parseInt(currPageContainer.html()) < 1) {
					$.showErrorGritter("页数不能小于1，请重新输入！");
				} else if(parseInt(currPageContainer.html()) > parseInt($(".history-total-pager").html())) {
					$.showErrorGritter("页数不能大于最大页数，请重新输入！");
				} else {
					var currPage = currPageContainer.html();
					//$(".history-curr-pager").html()
					var historyChartTime = $(this).val();
					parent.ws.onsend(43, {
						msg_limit: msgLimit,
						msg_page: currPage,
						msg_session_id: chatId,
						msg_begin_time: historyChartTime,
						msg_end_time: historyChartTime,
						msg_keyword: keyWord,
						msg_session_type: 2
					}, function(data) {
						receiveHistoryChart(chatId, data);
					});
				}
			});
			//处理收到的历史聊天记录信息
			function receiveHistoryChart(userId, data) {
				if(data.action == 500) {
					$.showErrorGritter("获取历史记录失败！");
					return false;
				}
				var myId = parent.myId;
				if(data.action == 200) return false;
				data.data.data.length > 0 && data.data.data.reverse();
				$(".view-chart-history-content .history-total-record").html(data.data.total_num);
				var nums = Math.ceil(data.data.total_num / msgLimit);
				var nowPage = (nums == 0 ? "1" : nums);
				$(".view-chart-history-content .history-total-pager").html(nowPage);
				$(".view-chart-history-content .view-chart-history-content-body").html("");
				var allMessageDom = "";
				$.each(data.data.data, function(i, item) {
					////console.log(i);
					////console.log(item)
					var oneMessage = "";
					//i > 0 && //console.log($.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time))
					if(i == 0 || $.getTwoDaysDistance(data.data.data[i - 1].message_time, item.message_time) >= 1) {
						oneMessage += //时间
							"<div class=\"this-chart-record-history-time\">" +
							"<i></i>" +
							"<span style='color:#999;'>" + (new Date(changeDate(item.message_time))).format("yyyy-MM-dd") + "</span>" +
							"<i></i>" +
							"</div>";
					}
					oneMessage += //消息
						"<div class=\"view-chart-historyone-message\">" +
						"<span class=\"message-name\" style='color:" + (item.message_send_by.employee_id == myId ? "#42B475" : "#009ED8") + "'>" + item.message_send_by.employee_name + "</span>" +
						"<span class=\"message-time\" style='color:" + (item.message_send_by.employee_id == myId ? "#42B475" : "#009ED8") + "'>" + changeDate(item.message_time) + "</span><br>" +
						"<span style='' class=\"message-detail history-message-detail " + (item.message_type == 1 ? "history-message-detail-file" : "") + "\">" + dealMessage(item, true) + "</span>" +
						"</div>";
					allMessageDom += oneMessage;
				});
				if(!allMessageDom) {
					allMessageDom = "没有该条件下的聊天记录信息！";
				}
				$(".view-chart-history-content .view-chart-history-content-body").html(allMessageDom);
				parent.bindIncident();
			}
			//日期选择
			$(".date-picker").datepicker({
				autoclose: true,
				clearBtn: true,
				weekStart: "0",
				format: "yyyy-mm-dd",
				pickerPosition: 'bottom-left'
			}).on("show", function() {
				setDatepickerLocation();
			});
			//时间插件定位
			var setDatepickerLocation = function() {
				$(".datepicker-dropdown").css(
					"top", "312px"
				);
			}
		});
	} else {
		$.showErrorGritter("历史记录查询失败！")
	}
};

function catchScreenShot(obj, event, callback) { //截屏
	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
	console.log(items)
	for(index in items) {
		var item = items[index];
		console.log(item)
		if(item.kind === 'file') {
			var blob = item.getAsFile();
			var reader = new FileReader();
			reader.onload = function(event) {
				//粘贴转换完成，开始上传
				$.ajaxPost("http://api.saas.com/im/image/base64", {
					data: event.target.result
				}, function(response) {
					if(response.code > 0) {
						$.showErrorGritter("粘贴出错:" + response.msg);
						return;
					}
					callback && callback($(obj), "<img src='" + response.data.path + "' class=\"chat-image\" data-labface=\"[img_" + response.data.path + "]\"/>");
					bindDblclick($(obj));
					//$(obj).append("<img src='" + response.data.path + "'/>");
				});
			};
			reader.readAsDataURL(blob);
		}
	}
}

function messageFilter(message) {
	if(message == null) return true;
	if(message == "") return true;
	message = $.trim(message);
	if(message.length == 0) {
		return true;
	}
}

function dealMessage(data, isOutside) {
	var messageContent = "";
	if(!messageFilter(data.message_content)) {
		//console.log(data)
		//console.log((data.data && data.data.type) || data.message_type || data.data.message_type)
		if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 1) {
			var messageContentData = ((data.data && data.data.content) || data.message_content || data.data.message_content).replace(/^\[file_([\s\S]*?)\]$/g, "$1");
			var fileDataStr = messageContentData;
			var bindTransmitClick = isOutside ? "onclick=\"parent.filestransmit(this)\"" : "";
			var bindDownloadClick = isOutside ? "onclick=\"filesDownload(this);\"" : "";
			messageContentData = JSON.parse(messageContentData);
			var fileType = messageContentData.ext;
			if(fileType == "7z") fileType = "zip";
			if(fileType == "jpeg") fileType = "jpg";
			messageContent += "<span  data-filedata=" + fileDataStr + " class=\"uploaded-file-container message-info\" data-path=" + messageContentData.path + ">" +
				"<img style='width: 50px;height: 50px;' src='" + BASEAPIURL + "/icons/" + fileType + ".png'>" +
				"<span data-file-id=" + messageContentData.id + " data-path=\"" + messageContentData.path + "\">" + messageContentData.name + "</span><br>" +
				"<span class=\"uploaded-file-operaters\">" +
				"<a class=\"view-uploaded-file\" onclick=\"onlineRead('" + messageContentData.name + "','" + messageContentData.path_code + "');\">查看</a>" +
				"<a>|</a>" +
				"<a class=\"file-download\" " + bindDownloadClick + ">下载</a>" +
				"<a>|</a><a class=\"file-transmit\" " + bindTransmitClick + ">转发</a>" +
				"<a></a></span><a><span></span></a></span>";
		} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 2) {
			messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
			//console.log(messageContent)
			messageContent = messageContent.replace(/\[img_([\s\S]*?)\]/g, '<img class=\"clickToLargePicture chat-image\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
				.replace(/\[em_f([0-9]*).gif\]/g, "<img style=\"width: 20px;height:20px;\" src=\"../resources/images/face/f$1.gif\" border=\"0\" />");
		} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == messageType.video) {
			messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
			messageContent = messageContent.replace(/^\[radio_([\s\S]*?)\]$/g, '<img class=\"clickToLargePicture\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
		} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == messageType.audio) {
			messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
			messageContent = "<audio controls=\"controls\"><source src=\"" + messageContent + "\" type=\"audio/ogg\">\"您的浏览器不支持音频播放!\"</audio>";
			console.log(messageContent)
		} else if(((data.data && data.data.type) || data.message_type || data.data.message_type) == 5) {
			messageContent = (data.data && data.data.content) || data.message_content || data.data.message_content;
			messageContent = messageContent.replace(/\[img_([\s\S]*?)\]/g, '<img class=\"clickToLargePicture chat-image\" style="max-width: 200px;max-height:200px;" src="$1" border="0" />')
		}
	}
	//console.log(messageContent)
	return messageContent;
}
//文件下载
function filesDownload(obj) {
	var fileData = $(obj).parent().parent().data("filedata");
	if(!fileData) {
		fileData = $(obj).parent().parent().data("filedata");
	}
	var code = fileData.path_code;
	var filename = fileData.name;
	//console.log('文件下载（路径：' + src + "）");
	$.downloadFile("", code, filename);
}
//群操作
function groupHandle(container) {
	container.css("z-index", 11);
	if(container) {
		if(container.children(".group-list").length == 0) {
			container.append("<ul class='group-list group-handle-menu'>" +
				"<li class='addgroup'>添加群组</li><li class='chat-history'>历史记录</li></ul>");
			$(".group-list").addClass("hide");
		}
		if(container.children(".group-list").hasClass("hide"))
			container.children(".group-list").removeClass("hide");
		else
			container.children(".group-list").addClass("hide");
		console.log("群名称：" + container.data("name") + ",群业务Id：" + container.data("id") + ",群主题：" + changeGroupName(container.data("name"), container.data("type")) + "，群类型：" + container.data("type"));
		container.data("title", changeGroupName(container.data("name"), container.data("type")));
		$(".group-list li.addgroup").unbind("click").click(function() {
			var otherInfo = {
				"title": $(this).parent().parent().data("title"),
				"clientId": $(this).parent().parent().data("id"),
				"type": $(this).parent().parent().data("type") //chatpack
			}
			var groupName = $(this).parent().parent().data("name");
			console.log(otherInfo);
			parent.ws.onsend(parent.ws.cmdTag.QUERY_GROUPID, {
				"discussing_data_id": $(this).parent().parent().data("id"),
				"discussing_data_type": $(this).parent().parent().data("type")
			}, function(data) {
				console.log(data)
				if(data.action == 500) {
					$.showErrorGritter(data.data.message);
					return false;
				}
				if(data.action == 200)
					return false;
				if(data.data.enable_topic) {
					$.showErrorGritter("该业务群已存在！");
					return false;
				} else {
					parent.groupEstablish(groupCode.businessGroup, groupName, otherInfo);
				}
			});
		});
		$(".group-list li.chat-history").unbind("click").click(function() {
			chatHistory($(this).parent().parent().data("id"), $(this).parent().parent().data("type"));
		});
	} else {
		$.showErrorGritter("群操作失败！");
	}
	clickBody(".group-handle-menu", container);
}

function clickBody(offDom, dom) {
	$("body").unbind("click").click(function(event) {
		console.log(dom.parent()[0]); //.context.className
		var isExist = false;
		$(event.target).parents().each(function(i) {
			console.log($(this)[0])
			if($(this)[0] == dom.parent()[0])
				isExist = true;
		});
		if(!isExist)
			$(offDom).remove();
		//		if($(event.target).parents(parent).length == 0) {
		//			$(offDom).remove();
		//		}
	});
}

function changeGroupName(groupName, type) {
	if(type == businessGroupCode.client || type == businessGroupCode.depar || type == businessGroupCode.linkman) {
		groupName = "CRM:" + groupName;
	} else if(type == businessGroupCode.announcement) {
		groupName = "公告:" + groupName;
	} else if(type == businessGroupCode.publics) {
		groupName = "公海:" + groupName;
	} else {
		//groupName="工作计划:《"+groupName+"》";
		//if()
	}
	return groupName;
}
//讨论组主题详情
function businessGroupDetails(id, type) {
	if(id && type) {
		ws.onsend(ws.cmdTag.LOADTHEMEDETAILS, {
			"discussing_data_id": id,
			"discussing_data_type": type
		}, function(data) {
			if(data.action == 500) {
				$.showErrorGritter("公告已删除！");
				return false;
			}
			if(data.action == 200) return false;
			if($("body .theme-details-page").length == 0)
				$("body").append("<div class=\"theme-details-page hide\"><div class='theme-details-container'></div></div>");
			var modalId = $.modal({
				"width": "90%",
				showOKButton: false,
				showCancelButton: false,
				buttons: [{
					name: "关闭",
					class: "btn-primary",
					onClick: function(modal) {
						modal.modal("hide");
					}
				}]
			}).showOfAuto("主题详情", ".theme-details-page", function() {
				$("#" + modalId).modal("hide");
			});
			var content = JSON.parse(data.data.content);
			console.log(content);
			var container = "#" + modalId;
			if(type == businessGroupCode.client) { //客户
				loadClientPage(content, container);
			} else if(type == businessGroupCode.announcement) { //公告
				loadAnnouncementPage(content.data.announcement_info, container);
			} else if(type == businessGroupCode.plan) { //工作计划
				loadPlanPage(content, container);
			} else if(type == businessGroupCode.publics) { //公海
				loadPublicPage(content, container);
			} else if(type == businessGroupCode.depar) { //部门
				loadClientPage(content, container);
			} else { //联系人
				loadClientPage(content, container);
			}
		});
	} else {

	}
}
//加载主题客户详情
function loadClientPage(data, container) {
	if(data && container) {
		var str = "<div class=\"content\">";
		str += "<ul class=\"content-menu nav nav-tabs\">";
		str += "<li class=\"active\"><a href=\"#\">单位档案</a></li>";
		str += (data.data.depa_id ? "<li class=\"\"><a href=\"#\">部门档案</a></li>" : "");
		str += (data.data.contact_id ? "<li class=\"\"><a href=\"#\">联系人档案</a></li>" : "");
		str += "</ul>";
		str += "<div class=\"main-page\">";
		str += "<div class=\"client-page\">";
		str += "<div class=\"page-info info-basics\" style=\"position:relative\">";
		str += "<p class=\"info-title list-group-item active\">基本信息</p>";
		str += "<p class=\"info-content list-group-item\" style=\"width:60%\"><label>单位名称：<span bind=\"client_full_name\"></span></label><label>单位简称：<span bind=\"client_short_names\"></span></label>";
		str += "<label>单位类型：<span bind=\"client_type_cn\"></span></label><label>单位等级：<span bind=\"client_level_cn\"></span></label></p>";
		str += "<p class=\"info-content list-group-item\" style=\"width:60%\"><label>重要等级：<span bind=\"client_important_level_cn\"></span></label><label>跟进联系人：<span>" + loadPrincipal(data.data.client_responsible_employees) + "</span></label>";
		str += "<label>单位状态：<span bind=\"client_status_cn\"></span></label><label>通讯地址：<span bind=\"client_addr\"></span></label></p>";
		str += "<p class=\"info-content list-group-item\" style=\"width:60%;min-height:165px;\"><label style=\"width:100%;word-break: break-all;word-wrap: break-word;\">单位简介：<span bind=\"client_desc\">无</span></label></p>";
		str += "<div id=\"client-Carousel\" class=\"client-page-image carousel slide\">" + loadImgs(data.data.client_images, "client-Carousel") + "</div>";
		str += "</div>";
		str += "<div class=\"page-info info-contact\">";
		str += "<p class=\"info-title list-group-item active\">联系方式</p>";
		str += "<p class=\"info-content list-group-item\"><label>联系电话：<span bind=\"client_tel\"></span></label><label>网址：<span bind=\"client_website\"></span></label>";
		str += "<label>微信公众号：<span bind=\"client_weixin_public_number\"></span></label></p>";
		str += "</div>";
		str += "<div class=\"page-info info-detail\">";
		str += "<p class=\"info-title list-group-item active\">详细信息</p>";
		str += "<p class=\"info-content list-group-item\"><label>单位负责人：<span bind=\"client_primary_person\"></span></label><label>次要负责人：<span bind=\"client_secondary_person\"></span></label>";
		str += "<label>床位数：<span bind=\"client_sickbeds_count\"></span></label><label>门诊量：<span bind=\"depa_outpatients_count\"></span></label></p>";
		str += "</div>";
		str += "<div class=\"page-info info-other\">";
		str += "<p class=\"info-title list-group-item active\">其他信息</p>" + loadOtherInfo(data.data.client_extend_data);
		str += "</div>";
		str += "<div class=\"page-info info-creator\">";
		str += "<p class=\"info-title list-group-item active\">创建信息</p>";
		str += "<p class=\"info-content list-group-item\"><label>创建人：<span bind=\"client_created_employee.depa_name\"></span>，<span bind=\"client_created_employee.employee_name\"></span></label><label>创建时间：<span bind=\"client_create_time\"></span></label>";
		str += "<label>最近更改时间：<span bind=\"client_update_time\"></span></label></p>";
		str += "</div>";
		str += "</div>";
		if(data.data.depa_id) {
			str += "<div class=\"depar-page\" style=\"display:none\">";
			str += "<div class=\"page-info info-basics\" style=\"position:relative\">";
			str += "<p class=\"info-title list-group-item active\">基本信息</p>";
			str += "<p class=\"info-content list-group-item\" style=\"width:60%\"><label>部门/科室名称：<span bind=\"depa_name\"></span></label><label>部门/科室等级：<span bind=\"depa_important_level_cn\"></span></label>";
			str += "<label>部门/科室状态：<span bind=\"depa_status_cn\"></span></label><label>跟进联系人：<span>" + loadPrincipal(data.data.depa_responsible_employees) + "</span></label></p>";
			str += "<p class=\"info-content list-group-item\" style=\"width:60%\"><label>门诊地址：<span bind=\"depa_outpatient_location\"></span></label><label>住院部地址：<span bind=\"depa_resident_location\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\" style=\"width:60%;min-height:170px;\"><label style=\"width:100%;word-break: break-all;word-wrap: break-word;\">部门/科室简介：<span bind=\"depa_desc\">无</span></label></p>";
			str += "<div id=\"depar-Carousel\" class=\"depar-page-image carousel slide\">" + loadImgs(data.data.depa_images, "depar-Carousel") + "</div>";
			str += "</div>";
			str += "<div class=\"page-info info-detail\">";
			str += "<p class=\"info-title list-group-item active\">详细信息</p>";
			str += "<p class=\"info-content list-group-item\"><label>部门/科室负责人：<span>" + loadDeparPrincipal(data.data.depa_leaders, "1") + "</span></label><label>次要负责人：<span>" + loadDeparPrincipal(data.data.depa_leaders, "2") + "</span></label>";
			str += "<label>部门/科室电话：<span bind=\"depa_phone_number\"></span></label><label>部门/科室总人数：<span bind=\"depa_doctor_count\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label>床位数：<span bind=\"depa_sickbeds_count\"></span></label><label>门诊量：<span bind=\"depa_outpatients_count\"></span></label>";
			str += "<label>联系人总数：<span bind=\"department_count\"></span></label><label>联系人覆盖率：<span>" + (data.data.department_count * 100 / data.data.depa_doctor_count).toFixed(2) + "%</span></label></p>";
			str += "</div>";
			str += "<div class=\"page-info info-other\">";
			str += "<p class=\"info-title list-group-item active\">其他信息</p>" + loadOtherInfo(data.data.depa_extend_data);
			str += "</div>";
			str += "<div class=\"page-info info-creator\">";
			str += "<p class=\"info-title list-group-item active\">创建信息</p>";
			str += "<p class=\"info-content list-group-item\"><label>创建人：<span bind=\"depa_created_employee.depa_name\"></span>，<span bind=\"depa_created_employee.employee_name\"></span></label><label>创建时间：<span bind=\"depa_create_time\"></span></label>";
			str += "<label>最近更改时间：<span bind=\"depa_update_time\"></span></label></p>";
			str += "</div>";
			str += "</div>";
		}
		if(data.data.contact_id) {
			var workTimeStr = "";
			if(data.data.contact_work_time)
				for(var i in data.data.contact_work_time) {
					var weekNum = parseInt(data.data.contact_work_time[i].weekday);
					var dayNum = data.data.contact_work_time[i].am_or_pm;
					switch(weekNum) {
						case 1:
							workTimeStr += "周一";
							break;
						case 2:
							workTimeStr += "周二";
							break;
						case 3:
							workTimeStr += "周三";
							break;
						case 4:
							workTimeStr += "周四";
							break;
						case 5:
							workTimeStr += "周五";
							break;
						case 6:
							workTimeStr += "周六";
							break;
						case 7:
							workTimeStr += "周日";
							break;
						default:
							workTimeStr += "";
					}
					workTimeStr += i == data.data.contact_work_time.length - 1 ? (dayNum == 1 ? "(上午)" : "(下午)") : (dayNum == 1 ? "(上午)," : "(下午),");
				}
			var contactFamilyStr = "";
			if(data.data.contact_family_relations)
				for(var i in data.data.contact_family_relations) {
					var familyData = data.data.contact_family_relations[i];
					contactFamilyStr += "<tr><td>" + familyData.family_name + "</td><td>" + familyData.family_sex_cn + "</td><td>" + familyData.family_relationship_cn + "</td><td>" + familyData.family_birthday + "</td><td>" + familyData.family_interest + "</td><td>" + familyData.family_other_desc + "</td></tr>";
				}
			//计算年龄
			var bornTime = parseInt(data.data.contact_born_date.substring(0, 4));
			var newdate = parseInt($.timeNow().getFullYear());
			str += "<div class=\"contact-page\"  style=\"display:none;\">";
			str += "<div class=\"page-info info-basics\">";
			str += "<p class=\"info-title list-group-item active\">基本信息</p>";
			str += "<p class=\"info-content list-group-item\"><label>姓名：<span bind=\"contact_name\"></span></label><label>性别：<span bind=\"contact_sex_cn\"></span></label>";
			str += "<label>等级：<span bind=\"contact_important_level_cn\"></span></label><label>状态：<span bind=\"contact_status_cn\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label>跟进联系人：<span>" + loadPrincipal(data.data.contact_responsible_employees) + "</span></label><label>单位部门：<span bind=\"client_full_name\"></span>，<span bind=\"depa_name\"></span></label>";
			str += "<label>年龄：<span>" + (newdate - bornTime) + "</span></label><label>身份证号：<span bind=\"contact_id_number\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label>出生日期：<span bind=\"contact_born_date\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label style=\"width: 100%;\">兴趣爱好：<span bind=\"contact_interest\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label style=\"width: 100%;\">擅长领域：<span bind=\"contact_skilled_field\"></span></label></p>";
			str += "</div>";
			str += "<div class=\"page-info info-contact\">";
			str += "<p class=\"info-title list-group-item active\">联系方式</p>";
			str += "<p class=\"info-content list-group-item\"><label>手机（主）：<span bind=\"contact_primary_mobile_number\"></span></label><label>手机（次）：<span bind=\"contact_secondary_mobile_number\"></span></label>";
			str += "<label>办公电话：<span bind=\"contact_office_phone_number\"></span></label><label>邮箱：<span bind=\"contact_email\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label>微信：<span bind=\"contact_weixin\"></span></label><label>QQ：<span bind=\"contact_qq_number\"></span></label>";
			str += "<label style=\"width: 50%;\">家庭住址：<span bind=\"contact_home_address\"></span></label></p>";
			str += "</div>";
			str += "<div class=\"page-info info-work\">";
			str += "<p class=\"info-title list-group-item active\">工作信息</p>";
			str += "<p class=\"info-content list-group-item\"><label>职务：<span bind=\"contact_positional_titles_cn\"></span></label><label>职称：<span bind=\"contact_job_position_cn\"></span></label>";
			str += "<label style=\"width: 50%;\">办公地址：<span bind=\"contact_work_address\"></span></label></p>";
			str += "<p class=\"info-content list-group-item\"><label style=\"width: 100%;\">出诊时间：<span>" + workTimeStr + "</span></label></p>";
			str += "</div>";
			str += "<div class=\"page-info info-family\">";
			str += "<p class=\"info-title list-group-item active\">家庭信息</p>";
			str += "<table class=\"table table-bordered contact-family-table\"><tr><th>姓名</th><th>性别</th><th>关系</th><th>出生日期</th><th>兴趣爱好</th><th>其他</th></tr>" + contactFamilyStr + "</table>";
			str += "</div>";
			str += "<div class=\"page-info info-other\">";
			str += "<p class=\"info-title list-group-item active\">其他信息</p>" + loadOtherInfo(data.data.contact_extend_data);
			str += "</div>";
			str += "<div class=\"page-info info-creator\">";
			str += "<p class=\"info-title list-group-item active\">创建信息</p>";
			str += "<p class=\"info-content list-group-item\"><label>创建人：<span bind=\"contact_created_employee.depa_name\"></span>，<span bind=\"contact_created_employee.employee_name\"></span></label><label>创建时间：<span bind=\"depa_create_time\"></span></label>";
			str += "<label>最近更改时间：<span bind=\"depa_update_time\"></span></label></p>";
			str += "</div>";
			str += "</div>";
		}
		str += "</div>";
		str += "</div>";
		$(container).find(".theme-details-container").append(str);
		var comController = new Controller(container);
		comController.set(data.data);
		//初始化轮播
		if($("#client-Carousel").children().length != 0) {
			$("#client-Carousel").carousel({
				interval: 2000
			});
		}
		if($("#depar-Carousel").children().length != 0) {
			$("#depar-Carousel").carousel({
				interval: 2000
			});
		}
		//切换事件
		$(container + " .content-menu>li").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(container + " .main-page>div").eq($(this).index()).show().siblings().hide();
		});
	}
	//加载其他信息
	function loadOtherInfo(data, type) {
		var str = "";
		if(data.length != 0) {
			for(var i in data) {
				str += "<p class=\"info-content list-group-item\"><label style=\"width:100%;\">" + data[i].label + "：<span>" + data[i].value + "</span></label></p>";
			}
		} else {
			str = "<p class=\"info-content list-group-item\"><label>无</label></p>";
		}
		return str;
	}
	//加载轮播部分
	function loadImgs(data, name) {
		var str = "暂无图片";
		if(data.length != 0) {
			var dotStr = "",
				imgStr = "";
			for(var i = 0; i < data.length; i++) {
				dotStr += "<li data-target=\"#" + name + "\" data-slide-to=\"" + i + "\" " + (i == 0 ? "class=\"active\"" : "") + "></li>";
				imgStr += "<div class=\"item " + (i == 0 ? "active" : "") + "\"><img src=\"" + data[i] + "\" alt=\"企业图片\"></div>";
			}
			str = "<!-- 轮播（Carousel）指标 -->";
			str += "<ol class=\"carousel-indicators\">";
			str += dotStr;
			str += "</ol>";
			str += "<!-- 轮播（Carousel）项目 -->";
			str += "<div class=\"carousel-inner\">";
			str += imgStr;
			str += "</div>";
		}
		return str;
	}
	//拼接负责人数组
	function loadPrincipal(data) {
		var str = "";
		for(var i in data) {
			str += data[i].employee_name;
			if(i != data.length - 1) {
				str += ",";
			}
		}
		return str;
	}

	function loadDeparPrincipal(data, type) {
		var str = "无";
		var datas = [];
		if(data.length != 0)
			for(var i in data) {
				if(data[i].leader_type == type) {
					datas.push(data[i].contact_name);
				}
			}
		return datas.length == 0 ? "无" : datas.join(",");
	}
}
//加载公告详情
function loadAnnouncementPage(data, container) {
	if(data && container) {
		var str = "<div class=\"content\">";
		str += "<div class=\"item-announcement\">";
		str += "<div class=\"header\">";
		str += "<p style=\"text-align: center; margin-bottom: 20px;\">";
		str += "<span bind=\"announcement_title\" style=\"font-size: 20px;\"></span>";
		str += "</p>";
		str += "<div class=\"info\">";
		str += "<span class=\"row-left\">";
		str += "<span class=\"label-level\">【<span bind=\"announcement_level_cn\"></span>】</span>";
		str += "</span>";
		str += "<span class=\"row-center\">";
		str += "<span class=\"label-publish-dept\" bind=\"announcement_publish_department_cn\"></span>";
		str += "<span class=\"label-publish-name\" bind=\"announcement_publish_by_cn\"></span>";
		str += "<span style=\"margin: 0 10px;\">发布于</span>";
		str += "<span class=\"label-time\" bind=\"announcement_publish_time_cn\"></span>";
		str += "</span>";
		str += "<span class=\"row-right zindex-can-click\">";
		str += "</span>";
		str += "</div>";
		str += "<hr>";
		str += "</div>";
		str += "<div class=\"summary\" bind=\"announcement_content_html\"></div>";
		str += "<div class=\"footer\">";
		str += "<div class=\"annex\">";
		str += "<div class=\"bar-annex\">";
		str += "<span>附件 (<span class=\"label-count-anx\">0</span>个)</span>";
		str += "</div>";
		str += "<ul class=\"list-annex\">";
		str += "<li>";
		str += "<span class=\"title\"> 无附件</span>";
		str += "</li>";
		str += "</ul>";
		str += "<hr>";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		str += "</div>";
		$(container).find(".theme-details-container").append(str);
		var comController = new Controller(container);
		comController.set(data);
		//附件
		$(container).find(".label-count-anx").text(data.attachment_arr.length);
		if(data.attachment_arr.length != 0) {
			$(container).find(".list-annex").empty();
			for(var i in data.attachment_arr) {
				$(container).find(".list-annex").append("<li><span class=\"title\"><i class=\"fa fa-file-excel-o\"></i> " +
					data.attachment_arr[i].file_display_name + " </span><a href=\"javascript:;\" onclick=\"onlineRead('" + data.attachment_arr[i].file_display_name + "','" +
					data.attachment_arr[i].path + "')\" style=\"margin-left: 10px;\" class=\"preview\">预览</a></li>");
			}
		}
	} else {
		$.showErrorGritter("主题详情加载失败！");
	}
}
//加载工作计划详情
function loadPlanPage(data, container) {
	console.log(data)
	if(data && container) {
		var weekName = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
		var workPlanStartTime = new Date(data.data.work_schedule_start_date);
		var workPlanEndTime = new Date(data.data.work_schedule_end_date);
		var workPlanTitle = workPlanStartTime.getFullYear() + "年第" + data.data.work_schedule_week_number + "周";
		var workPlanTimeInterval = "（" + (workPlanStartTime.getMonth() + 1) + "月" + workPlanStartTime.getDate() + "日-" + (workPlanEndTime.getMonth() + 1) + "月" + workPlanEndTime.getDate() + "日）";
		//是否是本周
		var isNowWeek = false;
		var workPlanInfoStr = "<span class=\"plan-info-plan\">计划：应提交" + data.data.work_schedule_should_submit_time + ",实际提交<strong>" + data.data.work_schedule_status_cn + "</strong></span>";
		var workPlanTableAddMenuStr = "";
		if((workPlanStartTime.getFullYear() == new Date().getFullYear()) && ($.getCurrTimeWeekNumInAllYear() == data.data.work_schedule_week_number)) {
			//本周
			isNowWeek = true;
			workPlanInfoStr += "<span class=\"plan-info-summary\" style=\"margin-left:20px;\">总结：应提交" + data.data.work_summary_should_submit_time + ",实际提交<strong>" + data.data.work_summary_submit_status_cn + "</strong></span>";
			workPlanTableAddMenuStr = "<th>完成状态</th><th>位置</th><th>总结</th><th>跟踪对象</th>";
		}
		var str = "<div class=\"work-plan\">";
		str += "<p style=\"font-weight: bold;font-size: 16px;text-align:center;\" class=\"work-plan-title\">" + workPlanTitle + workPlanTimeInterval + "</p>";
		str += "<p class=\"work-plan-info\" style=\"text-align:center;margin:10px 0px;\">" + workPlanInfoStr + "<span class=\"\"></span></p>";
		str += "<table class=\"table table-bordered work-plan-table\">";
		str += "<tr><th>日期</th><th>上/下午</th><th>工作类型</th><th>客户</th><th>产品</th><th>工作目的</th><th>工作内容</th><th>协助人</th><th>知会对象</th>" + workPlanTableAddMenuStr + "</tr>";
		str += "</table>";
		str += "</div>";
		$(container).find(".theme-details-container").append(str);
		//填表
		for(var i in data.data.items) {
			var dayData = data.data.items[i];
			if(dayData.am.length == 0) {
				dayData.am.push({
					"isNull": true
				})
			}
			if(dayData.pm.length == 0) {
				dayData.pm.push({
					"isNull": true
				})
			}
			var rowData = dayData.am.concat(dayData.pm);
			console.log(rowData);
			for(var j in rowData) {
				$(container + " .work-plan-table").append(loadRowData(dayData, rowData[j]));
			}
		}
	} else {

	}

	function loadRowData(data, rowData) {
		if(data && rowData) {
			var dayInfoList = data.am.length + data.pm.length;
			var oneColStr = "",
				twoColStr = "",
				str = "";
			if(j == 0) {
				oneColStr = "<td style=\"text-align:center;display: table-cell;vertical-align: middle;\" rowspan=" + dayInfoList + "><span>" + weekName[i] + "</span></td>";
			}
			if(j == 0 || j == data.am.length) {
				twoColStr = "<td style=\"text-align:center;display: table-cell;vertical-align: middle;\" rowspan=" + (j == 0 ? data.am.length : data.pm.length) + "><span>" + (j == 0 ? "上午" : "下午") + "</span></td>";
			}
			//协助对象
			var helpEmployeeStr = "";
			//知会对象
			var informEmployeeStr = "";
			//客户
			var clientStr = "";
			//产品
			var productStr = "";
			//本周后四列
			var nowWeekStr = "";
			if(!rowData.isNull) {
				if(rowData.relations.helper || rowData.relations.by_helper) {
					var isHelpStr = (rowData.relations.helper ? true : false); //是否协助
					var helpEmployeeData = (rowData.relations.helper ? rowData.relations.helper : rowData.relations.by_helper);
					for(var k in helpEmployeeData) {
						helpEmployeeStr += helpEmployeeData[k].employee_name;
						if(k != helpEmployeeData.length - 1) {
							helpEmployeeStr += "，";
						}
					}
				}
				if(rowData.relations.notifier) { //知会
					for(var k in rowData.relations.notifier) {
						informEmployeeStr += rowData.relations.notifier[k].employee_name;
						if(k != rowData.relations.notifier.length - 1) {
							informEmployeeStr += "，";
						}
					}
				}
				if(rowData.relations.crm_clients_tree) { //客户
					clientStr = clientInfoCompose(rowData.relations.crm_clients_tree, 1);
				}
			}
			if(isNowWeek) {
				nowWeekStr = "<td>" + (rowData.isNull ? "" : rowData.work_schedule_item_completion_status_cn) + "</td><td>位置（待完善）</td><td>" + (rowData.isNull ? "" : rowData.work_schedule_item_summary_content) +
					"</td><td>" + (rowData.isNull ? "" : rowData.work_schedule_item_follow_up_content) + "</td>";
			}
			//客户信息组装
			str = "<td>" + (rowData.isNull ? "" : rowData.work_schedule_item_work_type_cn) + "</td><td>" + clientStr + "</td><td>产品（待完善)</td><td>" + (rowData.isNull ? "" : rowData.work_schedule_item_purpose) + "</td><td>" + (rowData.isNull ? "" : rowData.work_schedule_item_content) +
				"</td><td>" + (rowData.isNull ? "" : ((isHelpStr ? "(协助)" : "(被协助)")) + helpEmployeeStr) + "</td><td>" + informEmployeeStr + "</td>" + nowWeekStr;

		}
		return "<tr>" + oneColStr + twoColStr + str + "</tr>";
	}
	//客户数据组装
	function clientInfoCompose(data, type) {
		var str = "";
		for(var k in data) {
			str += data[k].client_full_name + ">";
			for(var m in data[k].departments) {
				var deparData = data[k].departments[m];
				str += deparData.depa_name + ">";
				for(var n in deparData.contacts) {
					str += deparData.contacts[n].contact_name;
					if(n != deparData.contacts.length - 1) {
						str += "，";
					}
				}
			}
		}
		return str;
	}

}
//加载主题公海包详情
function loadPublicPage(data, container) {
	console.log(data)
	if(data && container) {
		var str = "<div class=\"client-info-top\">";
		str += "<p class=\"client-info-top-menu\">";
		str += "<span class=\"info-name\" bind=\"client_full_name\"></span>";
		str += "<span class=\"info-type\" bind=\"client_type_cn\"></span>";
		str += "<span class=\"info-state\" bind=\"client_important_level_cn\"></span>";
		str += "<span class=\"\" bind=\"client_level_cn\"></span>";
		str += "<span class=\"\" bind=\"client_administrative_division_cn\"></span>";
		str += "</p>";
		str += "<div class=\"client-info-top-tab\">";
		str += "<p class=\"\">";
		str += "<span class=\"\">门诊量</span>";
		str += "<span class=\"\" bind=\"client_outpatients_count\">0</span>";
		str += "<span>床位数</span>";
		str += "<span class=\"\" bind=\"client_sickbeds_count\">0</span>";
		str += "</p>";
		str += "<p class=\"\">";
		str += "<span class=\"\">年销量（万元）</span>";
		str += "<span bind=\"annual_sale_count\">0</span>";
		str += "<span>最近拜访数</span>";
		str += "<span bind=\"recent_visit_count\">0</span>";
		str += "</p>";
		str += "</div>";
		str += "</div>";
		str += "<div class=\"client-info-bottom\">";
		str += "<ul class=\"movepubilc-nav\">";
		str += "<li onclick=\"changClienttab(this)\" class=\"chenkstyle\">部门</li>";
		str += "<li onclick=\"changClienttab(this)\">联系人</li>";
		str += "</ul>";
		str += "<div class=\"client-info-tab\">";
		str += "<table class=\"table table-bordered client-deparyinfo-tabs\">";
		str += "<tr><th>科室/部门名称</th><th>重要等级</th><th>门诊量</th><th>床位数</th><th>年销量（万元）</th><th>最近拜访量</th></tr>";
		str += "</table>";
		str += "<table class=\"table table-bordered client-linkmaninfo-tabs hide\">";
		str += "<tr><th>姓名</th><th>重要等级</th><th>科室部门</th><th>职务</th><th>职称</th><th>年销量</th><th>最近拜访量</th></tr>";
		str += "</table>";
		str += "</div>";
		str += "</div>";
		//str += "<input type=\"button\" name=\"\" class=\"btn btn-default btn-sm client-info-offbtn\" value=\"关闭\" data-dismiss=\"modal\" />";
		str += "</div>";
		$(container).find(".theme-details-container").append(str);
		var comController = new Controller(container);
		comController.set(data.data.client_info);
		//填表
		for(var i in data.data.department_arr) {
			var deparInfo = data.data.department_arr[i];
			$(container + " .client-deparyinfo-tabs").append("<tr><td>" + deparInfo.depa_name + "</td><td>" + deparInfo.depa_important_level_cn + "</td><td>" + deparInfo.depa_outpatients_count +
				"</td><td>" + deparInfo.depa_sickbeds_count + "</td><td>" + deparInfo.annual_sale_count + "</td><td>" + deparInfo.recent_visit_count + "</td></tr>");
		}
		for(var i in data.data.contact_arr) {
			var contactInfo = data.data.contact_arr[i];
			$(container + " .client-linkmaninfo-tabs").append("<tr><td>" + contactInfo.contact_name + "</td><td>" + contactInfo.contact_important_level_cn + "</td><td>" + contactInfo.depa_name +
				"</td><td>" + contactInfo.contact_positional_titles + "</td><td>" + contactInfo.contact_job_position + "</td><td>" + contactInfo.annual_sale_count + "</td><td>" + contactInfo.recent_visit_count + "</td></tr>");
		}
		//切换事件
		$(container + " .movepubilc-nav li").click(function() {
			$(this).addClass("chenkstyle").siblings().removeClass("chenkstyle");
			$(container + " .client-info-tab table").eq($(this).index()).removeClass("hide").siblings().addClass("hide");
		});
	} else {
		$.showErrorGritter("主题详情加载失败！");
	}
}
//点击除聊天窗口以外的地方最小化聊天窗口