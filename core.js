//  核心
function CoreInit(tagName, type) {
	this.element = document.createElement(tagName);
	this.setType('coreType', type);
	this.element.getInstance = (function (t) {
		return function () {
			return t;
		}
	}(this));
}

(function () {
	CoreInit.prototype.setType = function (typeName, typeValue) {
		this.element.dataset[typeName] = typeValue;
		return this;
	};
	CoreInit.prototype.getType = function (typeName) {
		if (typeName === undefined) {
			return this.element.dataset;
		} else if (typeof  typeName === 'string') {
			return this.element.dataset[typeName];
		} else {
			throw new Error('\n错误记录：CoreInit.prototype.removeFrom\n错误原因：目标对象不为父级元素');
		}
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
	CoreInit.prototype.getNextElement = function () {
		return this.element.nextElementSibling;
	};
	CoreInit.prototype.getParentElement = function () {
		return this.element.parentNode;
	};
	CoreInit.prototype.isLastChildren = function () {
		return this.element.parentNode.lastChild === this.element;
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
	this.initEvent(index);
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
		(function () {
			return;
			for (var i = 0; i < arr.length; i++) {
				var spliceIndex = parseInt(Math.random() * 52);
				var item = arr[i];
				arr[i] = arr[spliceIndex];
				arr[spliceIndex] = item;
			}
		}());
		Card.prototype.setTotalCard = arr;
		return arr
	};
	Card.prototype.cardCount = function () {
		return CoreInit.prototype.designArray.length * CoreInit.prototype.pointsArray.length;
	};
	Card.prototype.drawPoint = function (index) {
		var arr = Card.prototype.setTotalCard[index];
		this.setType('point', CoreInit.prototype.pointsArray.indexOf(arr[0]));
		this.setType('design', arr[1]);
		var color = !(CoreInit.prototype.designArray.indexOf(arr[1]) % 2) ? 'red' : 'black';
		this.setType('color', color);
		this.addClass(color);
		this.addClass(arr[1]);
		var span = new CoreInit('span', 'tag');
		span.element.innerHTML = arr[0];
		span.addClass('tag');
		span.addClass(arr[1]);
		span.appendTo(this.element);
	};
	Card.prototype.getDesign = function () {
		return this.getType('design');
	};
	Card.prototype.getColor = function () {
		return this.getType('color');
	};
	Card.prototype.getPoint = function () {
		return Number(this.getType('point'));
	};
	//  注册事件
	CoreInit.prototype.initEvent = function (index) {
		this.element.addEventListener('mousedown', Card.prototype.mouseDown, false);
		this.element.addEventListener('touchstart', Card.prototype.mouseDown, false);
		this.element.addEventListener('click', Card.prototype.mouseClick, false);
		this.element.addEventListener('mouseup', function () {
			document.removeEventListener('mousemove', Card.prototype.mouseMove, false);
		}, false);
	};
	//  鼠标点击
	CoreInit.prototype.mouseClick = function (e) {
		debugger
		//  清空激活
		var al = document.getElementsByClassName('active-list');
		al[0] && al[0].getInstance().removeClass('active-list');
		var ac = document.getElementsByClassName('active-card');
		while (ac.length) {
			ac[0].getInstance().removeClass('active-card');
		}

		//  this === 实例的element
		//  instance === 实例
		var instance = this.getInstance();
		var parentElement = instance.getParentElement();
		var currentElement = this;

		parentElement.getInstance().addClass('active-list');
		var checkArray = [];
		do {
			var currentInstance = currentElement.getInstance();
			checkArray.push({
				color: currentInstance.getColor(),
				point: currentInstance.getPoint(),
				ci: currentInstance
			});
			currentElement = currentInstance.getNextElement();
		} while (currentElement);

		reduce.call(checkArray, function (prev, cur, index, arr) {
			if ((prev.color !== cur.color ) && (prev.point - 1 === cur.point)) {
				cur.ci.addClass('active-card');
				if (cur.ci.isLastChildren()) {
					checkArray.forEach(function (t) {
						t.ci.addClass('out-line');
					});
					checkArray[0].ci.setType('active', true);
				}
				return cur;
			}
			return false;
		}, {point: (checkArray[0].point + 1)});
		CoreInit.prototype.moveHeadCard = checkArray[0].ci;
	};
	//   鼠标按下
	CoreInit.prototype.mouseDown = function (e) {
		var instance = this.getInstance();
		if (instance.getType('active')) {
			instance.setType('offsetX', e.offsetX);
			instance.setType('offsetY', e.offsetY);
			instance.setType('clientX', e.clientX);
			instance.setType('clientY', e.clientY);
			instance.setType('originX', instance.element.offsetLeft);
			instance.setType('originY', instance.element.offsetTop);
			document.addEventListener('mousemove', Card.prototype.mouseMove, false);
			window.addEventListener('touchmove', Card.prototype.mouseMove, false);
		}
		// e.preventDefault();
	};
	//      鼠标移动
	CoreInit.prototype.mouseMove = function (e) {
		debugger;
		var instance = CoreInit.prototype.moveHeadCard;
		var diffY = e.clientY - instance.getType('clientY');
		var diffX = e.clientX - instance.getType('clientX');
		instance.css('top', diffY + Number(instance.getType('originY')) + 'px');
		instance.css('left', diffX + Number(instance.getType('originX')) + 'px');
		// CoreInit.prototype.checkArray.forEach(function (t) {
		// console.log(t.ci.css('position', 'absolute').css('top', e.clientX + 'px').css('left', e.clientY + 'px'));
		// })
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