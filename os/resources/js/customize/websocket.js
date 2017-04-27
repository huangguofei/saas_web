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
var checkSendIsOvertimeInterval;//检查消息是否发送超时  超过10s，算为超时
checkSendIsOvertimeInterval = setInterval(function() {
	for(var i in receiveMsgCallback) {
		if(receiveMsgCallback[i].hasReceiveServer200){
			continue;
			//delete receiveMsgCallback[i];
		}
		var thisMsgSendTime = (parseInt((new Date()).getTime()) - parseInt(receiveMsgCallback[i].createTime)) / (1000);
		if(thisMsgSendTime >= 10&&receiveMsgCallback[i].errorCallback) {
			receiveMsgCallback[i].errorCallback();
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
	$.showLoadingPop("正在建立连接...");
	var reconnectCounter = 0;
	var msgCounter = 0;
	var sessionId = sessionStorage["session_id"];
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
	} catch(e) {
		throw new Error("不能连接到该地址:" + e);
	}
	////状态异常重连函数
	function reconnectWebSocket(options, sendDataBefore) {
		if(donotReconnect) {
			clearTimeout(reconnectInterval);
			return false;
		}
		if(wsHeartBeat) clearInterval(wsHeartBeat);
		if(isConnecting) return false;
		isConnecting = true;
		reconnectInterval = setTimeout(function() {
			if(ws.readyState != ws.OPEN) {
				ws = $.webSoket(options);
				reconnectIntervalTime = (reconnectIntervalTime > maxReconnectIntervalTime) ? maxReconnectIntervalTime : (reconnectIntervalTime + reconnectIntervalAddTime);
				clearTimeout(reconnectInterval);
				isConnecting = false;
				reconnectWebSocket(options, sendDataBefore);
			} else {
				clearTimeout(reconnectInterval);
			}
		}, reconnectIntervalTime);

	}
	ws.cmdTag = {
			CONFIG: 1, // 配置信息（登录成功后，server发送配置信息到client，包含心跳频率及其他配置）
			SESSION_EXPIRED: 7, //客户端session过期 ，过期后将不能做任何业务操作，客户端收到该消息后退出
			BEEN_LOGOUT: 11,//登录被弹出
			GET_FRIEND_LIST: 80,//获取好友列表
			CUSTOMER_ONLINE: 81, //客服  用户上线
			CUSTOMER_SINGLE_CHART: 82, //客服收发消息
			CUSTOMER_UNDERLINE: 83, //客服收到下线消息
			LATEST_CHART_LIST: 84,//获取最近会话列表
			READ_LATEST_CHART: 85, //查看最近聊天记录
			READ_CHART_HISTORY: 86, //查看聊天记录
			CLIENT_READ_MESSAGE: 87, //客户阅读消息
			REQUEST_CHART_FILE: 88, //查询聊天文件
			DELETE_LATEST: 89,//删除最近会话
			LET_IT_TOP: 91,//置顶会话
			PING: 90,//心跳包（client通过收到的发送频率主动发送心跳包到server）
			REQUEST_OK: 200, //成功，请求服务器处理成功
			ERROR: 500 // 错误，客户端发送消息错误时会收到此消息（协议错误、JSON错误...）
		}
		////手动退出
	ws.manualLeave = function() {
			donotReconnect = true;
			if(options.isCustomerService) {
				ws.onsend(ws.cmdTag.CUSTOMER_UNDERLINE, {
					session_id: sessionId
						//message_id: messageID
				});
			}
		}
		////定义发送数据的函数
	ws.onsend = function(type, data, callback, errorCallback) {
		var currMessageId = messageID;
		sessionId = sessionStorage["session_id"];
		console.log(arguments);
		try {
			data.session_id = sessionId;
		} catch(e) {
			throw new Error("data类型错误！应该为object");
		}
		receiveMsgCallback[currMessageId] = {
			"callback": callback,
			errorCallback: errorCallback,
			"type": type,
			hasReceiveServer200:false,
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
				clearInterval(wsHeartBeat);
				reconnectWebSocket(options);
				return false;
			}

			ws.onsend(ws.cmdTag.PING, {
				"session_id": sessionId
			}, function(data) {
				if(data.action == ws.cmdTag.ERROR && data.data.cmd == ws.cmdTag.PING) {
					$.showErrorGritter("服务器返回失败：" + data.data.message);
				}
			}); //发送心跳包，证明客户端还处于连接状态
			console.log("发送心跳包" + messageID);
		}, recvData.data.client_ping_interval);

	}
	ws.binaryType = 'arraybuffer'; //设置返回数据的类型为Arraybuffer
	ws.onopen = function(evt) { //已经建立连接
		$.hideLoadingPop();
		if(options.isCustomerService) {
			ws.onsend(ws.cmdTag.CUSTOMER_ONLINE, {
				session_id: sessionId,
				user_type: "1"
			});
		} else if(options.isClientCustomer) {
			ws.onsend(ws.cmdTag.CUSTOMER_ONLINE, {
				session_id: sessionId,
				user_type: "2"
			});
			
		} 
		if(options.onopenCallback) {
			options.onopenCallback(evt);
		}
		
		ws.onmessage = function(evt) {
			//收到服务器消息，使用evt.data提取
			var recvData = decodeDataPack(evt.data, []);
			for(var i in recvData) {
				console.log(recvData[i])
					//维护messageID
				if(recvData[i].data.message_id > messageID) {
					messageID = recvData[i].data.message_id;
				}
				//如果action=1，心跳包间隔时间
				if(recvData[i].action == ws.cmdTag.CONFIG) {
					ws.heartBeatFun(recvData[i]);
				}
				if(recvData[i].action == ws.cmdTag.SESSION_EXPIRED) {
					//$.showErrorGritter();
					ws.close();
					donotReconnect = true; //不再重连
					ws.manualLeave();
					parent.logout("登录过期，请重新登录！");
					return false;
				} else if(recvData[i].action == ws.cmdTag.BEEN_LOGOUT) {
					ws.close();
					donotReconnect = true; //不再重连
					ws.manualLeave();
					parent.logout("登录被弹出！");
					return false;
				}else if(recvData[i].action == ws.cmdTag.ERROR){
					$.showErrorGritter(recvData[i].data.message);
					if(receiveMsgCallback[recvData[i].msg_id]&&receiveMsgCallback[recvData[i].msg_id].errorCallback){
						receiveMsgCallback[recvData[i].msg_id].errorCallback(recvData[i]);
					}
					return false;
				}
				//messageID回调
				if( recvData[i]&&recvData[i].msg_id && receiveMsgCallback[recvData[i].msg_id]) {
					if(recvData[i].action == ws.cmdTag.REQUEST_OK) {
						receiveMsgCallback[recvData[i].msg_id].hasReceiveServer200=true;
					}
					if(receiveMsgCallback[recvData[i].msg_id].callback){
						receiveMsgCallback[recvData[i].msg_id].callback(recvData[i]);
						return;
					}
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
			ws.onsend(ws.cmdTag.CUSTOMER_UNDERLINE, {
				session_id: sessionId
			});
			ws.close();
			wsHeartBeat = null;
			ws = null;
			if(options.onerrorCallback) {
				options.onerrorCallback(evt.data);
			}
		};
	};
	ws.onclose = function(evt) {
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
	ws.selfReconnect = function(options) {
			$.webSoket(options);
		}
	function ieSlice(type, buffer, starti, endi) {
		var tmpArr = [];
		var buf = new Uint8Array(buffer);
		for(var i = 0; i < buf.length; i++) {
			if(i >= starti && i < endi) {
				tmpArr.push(buf[i]);
			}
		}
		var dataView = new DataView(buffer);
		if(type == 16) dataView.setInt16(0, tmpArr.join(""));
		if(type == 32) dataView.setInt32(0, tmpArr.join(""));
		return(dataView.buffer); 
	}
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
	};
	////发送消息的函数	
	function encodeDataPack(type, data, currMessageId) {
		//console.log(arguments)
		if(typeof data == "object")
			//data =JSON.stringify(data);
			data = encodeURIComponent(JSON.stringify(data));
		var s;
		s = data.match(/([\u2000-\uffff]+)/gi);
		if(s && s.length > 0) {
			s = s.join("");
			for(var i = 0; i < s.length; i++) {
				data = data.replace(s[i], escape(s[i]));
			}
		}

		//消息协议
		var u8_protocol_ver = new Uint8Array(2);
		set_protocol_int16_value(u8_protocol_ver.buffer, 1);
		var protocol_ver = u8_protocol_ver;
		//console.dir(u8_protocol_ver);

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

		data = string2Bin(data);
		
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
		return u8_pack.buffer;
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
		return data;

	}

	function loadingState(order) {
		if(order == "start") {
			if($(".chat-open .loading-img").length == 0) {
				$(".chat-open").append("<img class='loading-img' src='../resources/images/loading.gif'>");
				$(".chat-open .loading-img").attr("title", "正在加载登录。。。");
			}
		} else {
			$(".chat-open .loading-img").remove();
		}
	}
	//console.log(ws)
	return ws;

}