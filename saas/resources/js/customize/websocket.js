/*
 *封装webSoket类
 * 
 * Package Len         4bytes
	Header Len           2bytes
	Protocol ver         2bytes
	Command tag     4bytes
	Message ID          4bytes
	Body  data            Package len - Heaer Len ,其中Header是指除Body以外的所有项，Body内的值的格式根据Protocol来定义，见说明
说明：
1、Protocol ver，协议版本号，不同的协议版本，encode和decoce方式会不一样，见下：
    1.0 -  Json key-value
    2.0 - .......
2、Command tag，表示消息的类型，见下：
    1 - 配置信息（登录成功后，server发送配置信息到client，包含心跳频率及其他配置）
    2 - 心跳包（client通过收到的发送频率主动发送心跳包到server）
    3 - 登录 （client主动发起）
    4 - 登出 （手动退出，或能捕获的异常退出时，client主动发起） 
    5 - 新用户上线 （server主动推送到client）
    6 - 用户下线 （server->client）
  	20 - 好友列表 （client发起，server再回发）
3、MessageID，是用来标识每一个消息的，消息ID由发送方生成，如下：
    1、Message发送了以后，需要接收方回应是否收到；即消息从Sending -> Sended的过程，要确认是否发送成功；
    2、Message如果是交互性的(即需要接收方回复的)，可通过Message进行判断；
 * 
 * 
 * //客户端类型
	client_type:
	1:IOS
	5:ANDROID
	9:WEB
	13:WINFORM

 * */
//IE  slice
/*Buffer.prototype.ie_slice = function(start, end) {
	var len = this.length;
	start = ~~start;
	end = util.isUndefined(end) ? len : ~~end;
	if(start < 0) {
		start += len;
		if(start < 0)
			start = 0;
	} else if(start > len) {
		start = len;
	}
	if(end < 0) {
		end += len;
		if(end < 0)
			end = 0;
	} else if(end > len) {
		end = len;
	}
	if(end < start)
		end = start;
	var buf = new NativeBuffer();
	sliceOnto(this, buf, start, end);
	buf.length = end - start;
	if(buf.length > 0)
		buf.parent = util.isUndefined(this.parent) ? this : this.parent;
	return buf;
};*/
////messageID
var oncloseCounter = 0,
	messageID = 1,
	ws;
var donotReconnect = false; //不再重连
var receiveMsgCallback = {}; //发送请求时如果收到数据需要处理就必须在onsend传一个回调
var receiveMessageCallbackClearInterval; //清除发送请求时如果收到数据需要处理的回调，每3分钟清一次
receiveMessageCallbackClearInterval = setInterval(function() {
	for(var i in receiveMsgCallback) {
		var thisCallbackCreatedTime = (parseInt((new Date()).getTime()) - parseInt(receiveMsgCallback[i].createTime)) / (1000 * 60);
		if(thisCallbackCreatedTime >= 3) {
			delete receiveMsgCallback[i];
		}
	}
}, 180000);
var checkSendIsOvertimeInterval; //检查消息是否发送超时  超过10s，算为超时
checkSendIsOvertimeInterval = setInterval(function() {
	for(var i in receiveMsgCallback) {
		if(receiveMsgCallback[i].hasReceiveServer200) {
			continue;
			//delete receiveMsgCallback[i];
		}
		var thisMsgSendTime = (parseInt((new Date()).getTime()) - parseInt(receiveMsgCallback[i].createTime)) / (1000);
		if(thisMsgSendTime >= 10 && receiveMsgCallback[i].defeatCallback) {
			receiveMsgCallback[i].defeatCallback();
			//delete receiveMsgCallback[i];
		}
	}
}, 10000);

$.webSoket = function(options) {
	//管理员账号不能登录IM、
	if($.cookie("_u_is_admin") == 1) {
		return false;
	}
	//正在建立连接
	//$.showLoadingPop("正在建立连接...");
	loadingState("start");
	var reconnectCounter = 0;
	var msgCounter = 0;
	var sessionId="";
	////console.log($.cookie())
	////console.log(sessionId)
	var wsHeartBeat; //保存发送心跳包的定时器
	var isConnecting = false; //是否正在重连
	var reconnectIntervalTime = 3000, //初始重连间隔时间
		reconnectIntervalAddTime = 1000, //每次重连增加间隔时间
		maxReconnectIntervalTime = 30000; //最大重连间隔时间
	var reconnectInterval; //重连定时器
	//已经建立连接， 可以进行通讯；

	try {
		if(ws) {
			ws.close();
			ws = "";
		}
		ws = new WebSocket("ws://" + options.wsServer + ":" + options.protocal); //创建WebSocket对象
		//$("#output").html("正在连接，请稍候......");
	} catch(e) {
		throw new Error("不能连接到该地址:" + e);
	}
	////状态异常重连函数
	function reconnectWebSocket(options, type, data) {
		console.log("重连开始")
		loadingState("start");
		if(donotReconnect) {
			clearTimeout(reconnectInterval);
			return false;
		}
		if(wsHeartBeat) clearInterval(wsHeartBeat);
		if(isConnecting) return false;
		isConnecting = true;
		reconnectInterval = setTimeout(function() {
			////console.log(ws.readyState != ws.OPEN)
			if(ws.readyState != ws.OPEN) {
				console.log("失败" + ws.readyState)
				ws = $.webSoket(options);
				reconnectIntervalTime = (reconnectIntervalTime > maxReconnectIntervalTime) ? maxReconnectIntervalTime : (reconnectIntervalTime + reconnectIntervalAddTime);
				clearTimeout(reconnectInterval);
				isConnecting = false;
				////console.log("定时器重连"+reconnectIntervalTime)
				reconnectWebSocket(options, type, data);
			} else {
				console.log("成功" + ws.readyState);
				clearTimeout(reconnectInterval);
				oncloseCounter = 0;
				//if(type && data) ws.onsend(type, data);
			}
		}, reconnectIntervalTime);

	}
	//ws.cmdTag.QUERY_GROUPID
	ws.cmdTag = {
			CONFIG: 1, // 配置信息（登录成功后，server发送配置信息到client，包含心跳频率及其他配置）
			HEART: 2, //心跳包（client通过收到的发送频率主动发送心跳包到server）
			LOGIN: 3, //登录 （client主动发起）
			HANDEXIT: 4, //登出 （手动退出，或能捕获的异常退出时，client主动发起） 
			NEWUSERONLINE: 5, // 新用户上线 （server主动推送到client）
			USERUNDERLINE: 6, // 用户下线 （server->client）
			SESSIONEXPIRED: 7, //客户端session过期 ，过期后将不能做任何业务操作，客户端收到该消息后退出
			ACK: 10, //ACK消息回执，此消息表示服务器已收到客户端发送的请求，消息头Message ID与请求时的Message ID对应（场景：客户端聊天时，此消息用于判断消息是否发送成功）
			FRIENDLIST: 20, //好友列表 （client发起，server再回发）
			GROUPLIST: 21, //群组列表 
			LATESTCHARTLIST: 22, //最近会话列表
			CREATEGROUP: 23, // 创建群组 
			REQUESTDROUPMEMBER: 24, //查询群成员
			CREATEGROUPTOPIC: 25, //创建群话题
			CLOSEGROUPTOPIC: 26, // 关闭群话题
			OPENGROUPTOPIC: 27, // 打开群话题
			REQUESTGROUPTOPICLIST: 28, // 获取群话题列表
			GROUPTRANSFER: 29, //群转让
			DISSOLVEGROUP: 30, //解散群
			EXITGROUP: 31, //退出群
			SETGROUPADMIR: 32, //设置管理员
			UPDATEGROUPDATA: 33, //修改群资料
			ADDGROUPMEMBER: 34, //添加 群成员
			QUERY_GROUPID:36,//根据业务id查询群id
			MESSAGE_READ_DETAILS:38,//消息阅读详情
			SIGNLECHART: 40, // 聊天 单聊（server<-->client ，server也会主动推送新消息到client）
			GROUPCHART: 41, //聊天 群聊（同上）
			READMSG: 42, // 阅读消息
			READCHARTHISTORY: 43, //查看聊天记录
			READ_LATEST_CHART: 44, //查看最近聊天记录
			REQUEST_CHART_FILE: 45, //查询聊天文件
			NOREADINFONUM: 46, //获取未读消息
			LOADTHEMEDETAILS: 49, //主题详情
			HAS_REPEAT_GROUP_NAME:51,//群名是否存在
			READ_MESSAGE_MY:53,//自己阅读消息推送
			LINKMANSTICK: 52, //最近联系人置顶
			CUSTOMERONLINE: 81, //客服  用户上线
			CUSTOMERSINGLECHART: 82, //客服收发消息
			CUSTOMER_HISTORY:85,//客服最近历史记录
			CUSTOMER_LATELY_HISTORY:86,//客服历史记录
			CUSTOMER_CHAT_FILE:88,//客服聊天文件
			REQUESTOK: 200, //成功，请求服务器处理成功
			ERROR: 500 // 错误，客户端发送消息错误时会收到此消息（协议错误、JSON错误...）
		}
		////手动退出
	ws.manualLeave = function() {
			//loadingState("end");
			//			if(options.isCustomerService) {
			//				ws.onsend("83", {
			//					session_id: sessionId
			//						//message_id: messageID
			//				});
			//			} else {
			//				////console.log("手动退出");
			//				ws.onsend("4", {
			//					session_id: sessionId
			//						//message_id: messageID
			//				});
			//				
			//			}
			donotReconnect = true;
		}
		////定义发送数据的函数
	ws.onsend = function(type, data, callback, defeatCallback) {
		sessionId = sessionStorage["session_id"];
		var currMessageId = messageID;
		//console.log(currMessageId+"--sedMsg|_id----------------------------------")
		try {
			data.session_id = sessionId;
			//data.message_id = messageID;
		} catch(e) {
			throw new Error("data类型错误！应该为object");
		}
		receiveMsgCallback[currMessageId] = {
			"callback": callback,
			defeatCallback: defeatCallback,
			"type": type,
			hasReceiveServer200: false,
			createTime: (new Date()).getTime()
		};
		var sendData = encodeDataPack(type, data, currMessageId);
		messageID++;
		/////状态异常
		if(ws.readyState != ws.OPEN) {
			reconnectWebSocket(options, sendData);
		} else {
			ws.send(sendData);
		}
	}
	ws.heartBeatFun = function(recvData) {
		if(wsHeartBeat) return;
		//心跳包间隔时间数据
		wsHeartBeat = setInterval(function() {
			if(ws.readyState != ws.OPEN) {
				//$.webSoket(options);
				clearInterval(wsHeartBeat);
				reconnectWebSocket(options);
				return false;
			}
			ws.onsend("2", {
				"session_id": sessionId
					//"message_id": messageID
			}, function(data) {
				if(data.action == 500 && data.data.cmd == 2) {
					$.showErrorGritter("服务器返回失败：" + data.data.message);
				}
			}); //发送心跳包，证明客户端还处于连接状态
		}, recvData.data.client_ping_interval);

	}
	ws.binaryType = 'arraybuffer'; //设置返回数据的类型为Arraybuffer
	ws.onopen = function(evt) { //已经建立连接
		//$.hideLoadingPop();
		$.showSuccessGritter("登录成功！");
		loadingState("end");
		//登录    cmd:3  client-type:9
		////console.log(messageID)
		if(options.isCustomerService) {
			//	//console.log(sessionId)
			ws.onsend("81", {
				session_id: sessionId,
				user_type: "1"
					//client_type: 9
					//message_id: messageID
			});
		} else if(options.isClientCustomer) {
			ws.onsend("81", {
				session_id: sessionId,
				user_type: "2"
					//client_type: 9
					//message_id: messageID
			}, function(data) {
				if(data.action == 500) {
					$(".bottom-menu li:first-child").click(function() {
						$.showErrorGritter("未开通客服权限，请联系管理员开通！");
					});
				}
			});
			ws.onsend("3", {
				session_id: sessionId,
				client_type: 9
					//message_id: messageID
			});
		} else {
			ws.onsend("3", {
				session_id: sessionId,
				client_type: 9
					//message_id: messageID
			});
		}
		if(options.onopenCallback) {
			options.onopenCallback(evt);
		}
		//$("#output").html("已经建立连接");
		////页面关闭或者刷新事件   关闭连接
		/*window.onbeforeunload = function() {
			var n = window.event.screenX - window.screenLeft;
			var b = n > document.documentElement.scrollWidth - 20;
			if(b && window.event.clientY < 0 || window.event.altKey) {
				//关闭操作
				ws.manualLeave();
			} else {
				//刷新操作
				ws.manualLeave();
			}
		}*/
		ws.onmessage = function(evt) {
			//收到服务器消息，使用evt.data提取
			var recvData = decodeDataPack(evt.data, []);
			for(var i in recvData) {
				if(recvData[i].data.cmd != ws.cmdTag.HEART) {
					console.log("收到服务器返回消息：");
					console.log(recvData[i])
				}

				//维护messageID
				if(recvData[i].data.message_id > messageID) {
					messageID = recvData[i].data.message_id;
				}
				//如果action=1，心跳包间隔时间
				if(recvData[i].action == 1) {
					ws.heartBeatFun(recvData[i]);
				}
				//异常
				if(recvData[i].action == 7 || recvData[i].action == 11 || recvData[i].action == 500) receiveServerError(recvData[i]);
				//messageID回调
				if(recvData[i] && recvData[i].msg_id && receiveMsgCallback[recvData[i].msg_id]) {
					//console.log(recvData[i]);
					//console.log(receiveMsgCallback)
					//if(recvData[i].action == receiveMsgCallback[recvData[i].msg_id].type) {
					//					if(recvData[i].action == 200) {
					//
					//						if(receiveMsgCallback[recvData[i].msg_id].needCmdOf200) {
					//							if(receiveMsgCallback[recvData[i].msg_id].definedCallbackParameter != "") {
					//								receiveMsgCallback[recvData[i].msg_id].callback(receiveMsgCallback[recvData[i].msg_id].definedCallbackParameter, recvData[i]);
					//							} else {
					//								receiveMsgCallback[recvData[i].msg_id].callback(recvData[i]);
					//							}
					//						}
					//					} else {
					//						if(receiveMsgCallback[recvData[i].msg_id].definedCallbackParameter != "") {
					//							receiveMsgCallback[recvData[i].msg_id].callback(receiveMsgCallback[recvData[i].msg_id].definedCallbackParameter, recvData[i]);
					//						} else {
					if(recvData[i].action == 200) {
						receiveMsgCallback[recvData[i].msg_id].hasReceiveServer200 = true;
					}
					if(receiveMsgCallback[recvData[i].msg_id].callback) {
						receiveMsgCallback[recvData[i].msg_id].callback(recvData[i]);
						return;
					}

					//						}
					//					}

					//}

				}
				if(options.onmessageCallback) {
					options.onmessageCallback(recvData[i]);
				}
			}

			////状态异常
			if(ws.readyState != ws.OPEN) {
				reconnectWebSocket(options);
			}
		};
		ws.onerror = function(evt) {
			//产生异常
			console.log("产生异常" + JSON.stringify(evt));
			$.showErrorGritter("产生了一个异常，请联系客服或者管理员解决！");
			ws.close();
			wsHeartBeat = null;
			ws = null;
			if(options.onerrorCallback) {
				options.onerrorCallback(evt.data);
			}
		};
	};
	ws.onclose = function(evt) {
		console.log("服务器断开连接。" + JSON.stringify(evt.reason));
		$.showErrorGritter("服务器断开连接！");
		//$.hideLoadingPop();
		//$("#output").html("服务器断开连接。" + JSON.stringify(evt.reason));
		////console.log(evt);
		ws.close();
		if(wsHeartBeat) {
			clearInterval(wsHeartBeat);
		}
		if(options.oncloseCallback) {
			options.oncloseCallback(evt.data);
		}
		//如果连接失败，重新进行连接
		if(oncloseCounter == 0) reconnectWebSocket(options);
		oncloseCounter++;
	};

	function ieSlice(type, buffer, starti, endi) {
		var tmpArr = [];
		//var buf=new ArrayBuffer(buffer.byteLength);
		//var bufDV=new DataView(buf)
		var buf = new Uint8Array(buffer);
		for(var i = 0; i < buf.length; i++) {
			if(i >= starti && i < endi) {
				tmpArr.push(buf[i]);
			}
		}
		var dataView = new DataView(buffer);
		if(type == 16) dataView.setInt16(0, tmpArr.join(""));
		if(type == 32) dataView.setInt32(0, tmpArr.join(""));
		return(dataView.buffer); //(bufDV.setUint8(tmpArr.join("")));
		//	if(type==32) return ;//(bufDV.setUint8(tmpArr.join("")));
	}
	ws.selfReconnect = function(options) {
			$.webSoket(options);
		}
		////
	var get_protocol_int16_value = function(buffer, startIndex, length) {
		try {
			var view = new DataView(buffer.slice(startIndex, startIndex + length));
		} catch(e) {
			var view = new DataView(ieSlice(16, buffer, startIndex, startIndex + length));
		}
		return view.getInt16(0);
	};
	var get_protocol_int32_value = function(buffer, startIndex, length) {
		try {
			var view = new DataView(buffer.slice(startIndex, startIndex + length));
		} catch(e) {
			var view = new DataView(ieSlice(32, buffer, startIndex, startIndex + length));
		}
		return view.getInt32(0);
	};
	var set_protocol_int16_value = function(buffer, data) {
		var view = new DataView(buffer);
		view.setInt16(0, data);
	};
	var set_protocol_int32_value = function(buffer, data) {
		var view = new DataView(buffer);
		view.setInt32(0, data);
	};
	var string2Bin = function(str) {
		var result = [];
		for(var i = 0; i < str.length; i++) {
			result.push(str.charCodeAt(i));
		}
		return result;
	};

	var bin2String = function(dataArr) {
		var res = "";
		for(var i in dataArr) {
			res += String.fromCharCode(dataArr[i]);
		}
		return res;
		//return String.fromCharCode.apply(String, dataArr);
	};

	////发送消息的函数	
	function encodeDataPack(type, data, currMessageId) {
		if(typeof data == "object")
			data = encodeURIComponent(JSON.stringify(data));
		var s;
		s = data.match(/([\u2000-\uffff]+)/gi);
		if(s && s.length > 0) {
			s = s.join("");
			for(var i = 0; i < s.length; i++) {
				data = data.replace(s[i], escape(s[i]));
			}
		}
		////console.log(arguments)
		//data = data.replace(/([\u2000-\uffff]+)/gi, escape('$1'));

		//消息协议
		var u8_protocol_ver = new Uint8Array(2);
		set_protocol_int16_value(u8_protocol_ver.buffer, 1);
		var protocol_ver = u8_protocol_ver;
		////console.dir(u8_protocol_ver);

		//消息类型
		var u8_cmd = new Uint8Array(4);
		set_protocol_int32_value(u8_cmd.buffer, type);
		var cmd = u8_cmd;

		//消息ID
		var u8_msg_id = new Uint8Array(4);
		set_protocol_int32_value(u8_msg_id.buffer, currMessageId);
		var msg_id = u8_msg_id;

		//消息头长
		var header = (protocol_ver.length + cmd.length + msg_id.length);
		var u8_header_len = new Uint8Array(2);
		set_protocol_int16_value(u8_header_len.buffer, header);
		var header_len = u8_header_len;

		//包长
		var pack_len_val = header + data.length + 6;
		var u8_pack_len = new Uint8Array(4);
		set_protocol_int32_value(u8_pack_len.buffer, pack_len_val);
		var pack_len = u8_pack_len;

		//		for(var i in data) {
		//			data[i] = escape(data[i])
		//		}

		//if(data.message) data.message = escape(data.message);
		data = string2Bin(data);
		////console.dir(data);

		var u8_pack = new Uint8Array(pack_len.length + header_len.length + protocol_ver.length + cmd.length + msg_id.length + data.length);
		u8_pack.set(pack_len);
		var pos = pack_len.length;
		u8_pack.set(header_len, pos);
		pos += header_len.length;
		u8_pack.set(protocol_ver, pos);
		pos += protocol_ver.length;
		u8_pack.set(cmd, pos);
		pos += cmd.length;
		u8_pack.set(msg_id, pos);
		pos += msg_id.length;
		u8_pack.set(data, pos);

		////console.dir(u8_pack);
		//massageID增加
		//messageID++;
		return u8_pack.buffer;
		//socket.send(u8_pack.buffer);
	};

	////接收到消息的处理函数
	function decodeDataPack(receiveData, data) {
		////console.log(receiveData)
		var buf = new Uint8Array(receiveData);
		////console.dir(buf);

		var buffer = receiveData;
		//解析
		var offset = 0;
		var total_pack_len = 0;
		//while(total_pack_len < buf.byteLength) {
		//包长
		var pack_len = get_protocol_int32_value(buffer, offset, 4);
		//console.log("包长："+pack_len);
		offset += 4;

		//消息头长
		var header_len = get_protocol_int16_value(buffer, offset, 2);
		//console.log("消息头长："+header_len);
		offset += 2;

		//消息协议
		var protocol_ver = get_protocol_int16_value(buffer, offset, 2);
		//console.log("消息协议："+protocol_ver);
		offset += 2;

		//消息类型
		var cmd = get_protocol_int32_value(buffer, offset, 4);
		//console.log("消息类型："+cmd);
		offset += 4;

		//消息ID
		var msg_id = get_protocol_int32_value(buffer, offset, 4);
		//console.log("消息ID："+msg_id);
		offset += 4;

		var dataArr = [];
		for(var i = offset; i < buf.byteLength; i++) {
			dataArr.push(buf[i]);
		}
		total_pack_len += pack_len;
		offset = total_pack_len;
		var data_json = bin2String(dataArr);
		//console.log(data_json);
		var recvData = JSON.parse(data_json);
		data.push({
			action: cmd,
			msg_id: msg_id,
			data: recvData
		});
		//}
		return data;

	}
	//是否在线
	window.isUnline = function() {
		if(!ws || ws.readyState == 3) {
			$.showErrorGritter("您已经掉线，请稍后再试！");
			return false;
		} else {
			return true;
		}

	}

	function loadingState(order) {
		//console.log(order);
		if(order == "start") {
			if($(".chat-open .loading-img").length == 0) {
				$(".chat-open").append("<img class='loading-img' src='../resources/images/loading.gif'>");
				$(".chat-open .loading-img").attr("title", "正在加载登录。。。");
			}
		} else {
			$(".chat-open .loading-img").remove();
		}
	}

	function receiveServerError(data) {
		if(data.action == 7) {
			$.showErrorGritter("登录过期，请重新登录！");
			ws.close();
			donotReconnect = true; //不再重连
			ws.manualLeave();
			logout("登录过期或者被弹出，请重新登录！");
			return false;
		}
		if(data.action == 11) {
			ws.onsend(ws.cmdTag.HANDEXIT, {

			});
			ws.close();
			donotReconnect = true; //不再重连
			ws.manualLeave();
			logout("被弹出或者账户被禁用，请联系管理员！");
			return false;
		} else if(data.action == 500) {
			$.showErrorGritter(data.data.message);
			if(receiveMsgCallback[data.msg_id]&&receiveMsgCallback[data.msg_id].defeatCallback) {
				receiveMsgCallback[data.msg_id].defeatCallback(data);
			}
		}
	}
	////console.log(ws)
	return ws;

}