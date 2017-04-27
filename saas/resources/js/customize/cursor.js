var posPrev = 0;

if(window.attachEvent) {
	document.onselectionchange = function(e) {
		//判断是否支持document.selection属性
		if(document.selection) {
			var pos = 0;
			var range = document.selection.createRange();
			var srcele = range.parentElement();
			//新建一个range，焦点在开头
			var copy = document.body.createTextRange();
			copy.moveToElementText(srcele);
			//判断copy的焦点起始部分是否在range的焦点起始部分的后面
			for(pos = 0; copy.compareEndPoints("StartToStart", range) < 0; pos++) {
				//copy的焦点向后移动一个字符
				copy.moveStart("character", 1);
			}
			posPrev = pos;
		}
	}
} else {
	//绑定文本焦点改变事件 注意：firefox不支持document.onselectionchange，可以换成别的事件来触发比如mouseup什么的
	document.onselectionchange = function(e) {
		//判断是否支持document.selection属性
		if(window.getSelection) {
			//获取Selection对象
			var se = window.getSelection();
			//获取起始位置，这个是字符的序号位置，而不是坐标
			var start = se.anchorOffset;
			//获取结束位置
			var end = se.focusOffset;
			//获取起始的dom元素
			var startEl = se.anchorNode.parentElement;
			//获取结束的dom元素
			var endEl = se.focusNode.parentElement;
			//获取起始dom元素的文本内容
			var startText = startEl.innerText;
			var txt = '';
			if(startEl == endEl) {
				txt = startText.substring(start, end);
			}
			posPrev = start;
		}
	}
}

$("#s1").click(function() {
	//console.log(51465)
	if(window.attachEvent) {
		//	console.log(1)
		$("#d1").focus();
		var pos = posPrev;
		var range = document.selection.createRange();
		var srcele = range.parentElement();
		//新建一个range，焦点在开头
		var copy = document.body.createTextRange();
		copy.moveToElementText(srcele);
		//判断copy的焦点起始部分是否在range的焦点起始部分的后面
		for(pos = 0; copy.compareEndPoints("StartToStart", range) < 0; pos++) {
			//copy的焦点向后移动一个字符
			copy.moveStart("character", 1);
		}
		insertHtmlAfterCursor($("#d1"), "我去");
		//		document.getElementById('i1').value = pos;
		//		posPrev=pos;	
		//		document.getElementById('i2').value = range.htmlText;
	} else {
		dingwei(posPrev);
		insertHtmlAfterCursor($("#d1"), "谷歌");
	}
});

function dingwei(index) {
	console.log(index)
	var a = document.getElementById("d1");
	a.selectionStart = index;
	a.focus();
}