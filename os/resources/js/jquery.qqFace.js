// QQ表情插件
var assign;
(function($) {
	$.fn.qqFace = function(options) {
		var defaults = {
			id: 'facebox',
			path: 'face/',
			assign: 'content',
			tip: 'em_f'
		};
		var option = $.extend(defaults, options);
		assign = $('.' + option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;

		if(assign.length <= 0) {
			alert('缺少表情赋值对象。');
			return false;
		}

		$(this).click(function(e) {
			var strFace, labFace;
			if($('#' + id).length <= 0) {
				strFace = '<div id="' + id + '" style="position:absolute;display:none;z-index:1000;top:20px" class="qqFace">' +
					'<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i = 1; i <= 88; i++) {
					var index = i < 10 ? "00" + i : "0" + i;
					labFace = '[' + tip + index + ".gif" + ']';
					strFace += '<td><img style="width:25px;height:25px;" src="' + path + "f" + index + '.gif" onclick="$(\'.' + option.assign + '\').setCaret(this);$(\'.' + option.assign + '\').insertAtCaret(\'' + labFace + '\');" data-labface="' + labFace + '"/></td>';
					if(i % 16 == 0 || i == 88) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
			}
			$(this).parent().append(strFace);
			var offset = $(this).position();
			var top = offset.top + $(this).outerHeight() - 20;
			$('#' + id).css('top', top);
			$('#' + id).css('left', offset.left);
			$('#' + id).show();
			e.stopPropagation();
		});

		$(document).click(function() {
			$('#' + id).hide();
			$('#' + id).remove();
		});
	};

})(jQuery);

jQuery.extend({
	unselectContents: function() {
		if(window.getSelection)
			window.getSelection().removeAllRanges();
		else if(document.selection)
			document.selection.empty();
	}
});
jQuery.fn.extend({
	selectContents: function() {
		$(this).each(function(i) {
			var node = this;
			var selection, range, doc, win;
			if((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
				range = doc.createRange();
				range.selectNode(node);
				if(i == 0) {
					selection.removeAllRanges();
				}
				selection.addRange(range);
			} else if(document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
				range.moveToElementText(node);
				range.select();
			}
		});
	},

	setCaret: function(obj) {
		//if(!$.support.msie) return; 

		//		var initSetCaret = function(){ 
		//			var textObj = $(this).get(0); 
		//			textObj.caretPos = document.selection.createRange().duplicate(); 
		//		}; 
		//		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
			//$(this).append($(obj).clone().removeAttr("onclick"));
		insertHtmlAfterCursor($(this),$(obj).clone().removeAttr("onclick").get(0).outerHTML);
		//$(this).focus();
		//locationCursor($(this),$(obj).clone().removeAttr("onclick"));
	},

	insertAtCaret: function(textFeildValue) {
		var textObj = $(this).get(0);
		console.log(textObj);
		if(document.all && textObj.createTextRange && textObj.caretPos) {
			var caretPos = textObj.caretPos;
			caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ?
				textFeildValue + '' : textFeildValue;
		} else if(textObj.setSelectionRange) {
			var rangeStart = textObj.selectionStart;
			var rangeEnd = textObj.selectionEnd;
			var tempStr1 = textObj.value.substring(0, rangeStart);
			var tempStr2 = textObj.value.substring(rangeEnd);
			textObj.value = tempStr1 + textFeildValue + tempStr2;
			textObj.focus();
			var len = textFeildValue.length;
			textObj.setSelectionRange(rangeStart + len, rangeStart + len);
			textObj.blur();
		} else {
			textObj.value += textFeildValue;

		}
	}
});

function insertHtmlAfterCursor(container, text) {
	console.log(text)
	console.log(container)
	var range, node;
	if(!container.hasfocus) {
		//return false;
		container.focus();
	}
	if(window.getSelection && window.getSelection().getRangeAt) {
		range = window.getSelection().getRangeAt(0);
		range.collapse(false);
		node = range.createContextualFragment(text);
		var c = node.lastChild;
		range.insertNode(node);
		if(c) {
			range.setEndAfter(c);
			range.setStartAfter(c)
		}
		var j = window.getSelection();
		j.removeAllRanges();
		j.addRange(range);

	} else if(document.selection && document.selection.createRange) {
		document.selection.createRange().pasteHTML(text);
	}
}