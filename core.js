//  核心
function CoreInit(tagName, type) {
	this.element = document.createElement(tagName);
	this.setType('coreType', type);
}

(function () {
	CoreInit.prototype.setType = function (typeName, typeValue) {
		this.element.dataset[typeName] = typeValue;
		return this;
	};
	CoreInit.prototype.getType = function (typeName) {
		return this.element.dataset.typeName;
	};
	//  DOM
	CoreInit.prototype.appendTo = function (aim) {
		if (aim instanceof Element && aim !== this.element) {
			aim.appendChild(this.element);
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.appendTo\n错误原因：错误的DOM目标对象或无法添加自身');
		}
		return this;
	};
	CoreInit.prototype.removeFrom = function (aim) {
		if (aim instanceof Element && aim !== this.element) {
			if (this.element.parentNode === aim) {
				aim.removeChild(this.element);
			} else {
				throw new Error('\n错误记录：CoreInit.prototype.removeFrom\n错误原因：目标对象不为父级元素');
			}
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.removeFrom\n错误原因：错误的DOM目标对象或无法移除自身');
		}
		return this;
	};
	//  CLASS
	CoreInit.prototype.addClass = function (cssName) {
		if (typeof cssName === 'string') {
			this.element.classList.add(cssName)
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.addClass\n错误原因：添加css类名必须为字符串');
		}
		return this;
	};
	CoreInit.prototype.removeClass = function (cssName) {
		if (cssName === undefined) {
			this.element.classList.value = '';
		} else if (typeof cssName === 'string') {
			this.element.classList.remove(cssName)
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.removeClass\n错误原因：删除css类名必须为字符串');
		}
		return this;
	};
	CoreInit.prototype.hasClass = function (cssName) {
		if (typeof cssName === 'string') {
			return Array.prototype.some.call(this.element.classList, function (t) {
				return t === cssName;
			});
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.hasClass\n错误原因：查询css类名必须为字符串');
		}
	};
	//  CSS
	CoreInit.prototype.css = function (cssName, cssValue) {
		if (typeof cssName === 'string') {
			if (typeof cssValue === 'string') {
				this.element.style[cssName] = cssValue;
			} else if (cssValue === undefined) {
				return getComputedStyle(this.element)[cssName];
			} else {
				throw new Error('\n错误记录：CoreInit.prototype.css\n错误原因：参数cssValue错误');
			}
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.css\n错误原因：无法识别的参数');
		}
		return this;
	};
	CoreInit.prototype.designArray = ['spade', 'heart', 'club', 'diamond'];
	CoreInit.prototype.designIndex = 3;
	CoreInit.prototype.pointsArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
}());


//  牌 card
function Card(index) {
	CoreInit.call(this, 'div', 'card');
	this.addClass('card');
	this.drawPoint(index);
}

(function () {
	var Inh = function () {
	};
	Inh.prototype = CoreInit.prototype;
	Card.prototype = new Inh();
	//  洗牌
	Card.prototype.shuffle = function () {
		var arr = [];
		CoreInit.prototype.designArray.forEach(function (dt) {
			CoreInit.prototype.pointsArray.forEach(function (pt) {
				arr.push([pt, dt]);
			})
		});
		for (var i = 0; i < arr.length; i++) {
			var spliceIndex = parseInt(Math.random() * 52);
			var item = arr[i];
			arr[i] = arr[spliceIndex];
			arr[spliceIndex] = item;
		}
		Card.prototype.setTotalCard = arr;
		return arr
	};
	Card.prototype.drawPoint = function (index) {
		var arr = Card.prototype.setTotalCard[index];
		this.setType('point', arr[0]);
		this.setType('design', arr[1]);
		this.addClass(arr[1]);
		var span = new CoreInit('span', 'tag');
		span.element.innerHTML = arr[0];
		span.addClass('tag');
		span.addClass(arr[1]);
		span.appendTo(this.element);
	}
}());

//  位置
function Seat(only, design) {
	CoreInit.call(this, 'div', 'seat');
	this.addClass('seat');
	if (design) {
		this.drawDesign();
	}
	if (only) {
		this.setType('only', true);
	}
}

(function () {
	var Inh = function () {
	};
	Inh.prototype = CoreInit.prototype;
	Seat.prototype = new Inh();
	Seat.prototype.drawDesign = function () {
		var type = this.designArray[CoreInit.prototype.designIndex--];
		this.setType('designType', type);
		this.addClass(type);
	};

}());

