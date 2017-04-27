/*
前端 Controller
*/
function Model(value) {
	this._value = typeof value === 'undefined' ? '' : value;
	this._listeners = [];
}
Model.prototype.set = function(value) {
	var self = this;
	self._value = value;
	setTimeout(function() {
		self._listeners.forEach(function(listener) {
			listener.call(self, value);
		});
	});
};
Model.prototype.watch = function(listener) {
	this._listeners.push(listener);
};
Model.prototype.bind = function(node) {
	this.watch(function(value) {
		//设置值到页面     
		var tagName = node.tagName;
		if (tagName == "INPUT" || tagName == "SELECT") {
			var typeName = node.getAttribute("type");
			if (typeName == "checkbox") {
				node.checked = value;
			} else if (typeName == "radio") {
				var radioes = document.getElementsByName(node.name);
				for (var i = 0; i < radioes.length; i++) {
					radioes[i].checked = (radioes[i].value == value);
				}
			} else
				node.value = value;
		} else {
			node.innerHTML = value;
		}
	});

	//Listen change Event
	var mPrototype = this;
	if (node) {
		mPrototype._value = node.value;
		node.addEventListener("change", function() {
			var typeName = this.getAttribute("type");
			if (typeName == "checkbox") {
				mPrototype._value = this.checked;
			} else
				mPrototype._value = this.value;
		});
	}
};

function Controller(container, callback) {
	var models = {};
	var views = Array.prototype.slice.call(document.querySelectorAll((container || '') + ' [bind]'), 0);
	views.forEach(function(view) {
		var modelName = view.getAttribute('bind');
		(models[modelName] = models[modelName] || new Model()).bind(view);
	});
	if (callback)
		callback.call(this, models);

	//return JSON object
	models.getJSON = function() {
		var resJson = {};
		for (var p in this) {
			if (typeof(this[p]) == "object") {
				resJson[p] = this[p]._value;
			}
		}
		return resJson;
	};

	//set value
	models.set = function(model) {
		for (p in model) {
			if (!p || p == "") {
				continue;
			}
			if (!models[p]) {
				models[p] = models[p] || new Model();
			}
			models[p].set(model[p]);
		}
		return models;
	};
	return models;
}