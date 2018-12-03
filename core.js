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
	}
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
		for (var i = 0; i < arr.length; i++) {
			var spliceIndex = parseInt(Math.random() * 52);
			var item = arr[i];
			arr[i] = arr[spliceIndex];
			arr[spliceIndex] = item;
		}
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
		this.element.addEventListener('click', Card.prototype.mouseClick, false);
	};
	//   鼠标按下
	CoreInit.prototype.mouseDown = function (e) {
		var target = this;
		// console.log(this);
		// if (index === this.cardCount() - 1) {
		// 	document.addEventListener('mousemove', Card.prototype.mouseMove, false);
		// }
		e.preventDefault();
	};
	//  鼠标点击
	CoreInit.prototype.mouseClick = function (e) {
		//  清空激活
		map.call(document.getElementsByClassName('active-list'), function (t) {
			t.classList.remove('active-list');
		});
		map.call(document.getElementsByClassName('active-list'), function (t) {
			t.getElementsByClassName('card-active')
		});


		//  this === 实例的element
		//  instance === 实例
		var instance = this.getInstance();
		var parentElement = instance.getParentElement();
		parentElement.getInstance().addClass('active-list');
		// //  当前列每一个卡牌
		// var siblingElement = parentElement.getElementsByClassName('card');
		// //  当前列的每一个卡牌的实例
		// var siblingElementInstanceArr = map.call(siblingElement, function (t) {
		// 	return t.getInstance();
		// });
		// console.log(siblingElementInstanceArr);


		// console.log(color, point);
		// var nextElement = instance.getNextElement();
		var currentElement = this;
		//  对于选中的卡牌，要向下验证的卡牌list
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
		// console.log(checkArray);

		forEach.call(checkArray, function (t) {
			// console.log(t.point, t.color);
		});
		reduce.call(checkArray, function (prev, cur, index, arr) {
			if ((prev.color !== cur.color ) && (prev.point - 1 === cur.point)) {
				cur.ci.addClass('card-active');
				return cur;
			}
			return false;
		}, {point: (checkArray[0].point + 1)});
		// console.log(_arr);

		// if (nextElement) {
		// 	var nextInstance = nextElement.getInstance();
		// 	var nIC = nextInstance.getColor();
		// 	var nIP = nextInstance.getPoint();
		// 	if (nIC !== color && nIP === point - 1) {
		// 		console.log('合格的nextInstance', nextInstance);
		// 	}
		// }

		// instance.addClass('card-active');
	};
	//      鼠标移动
	CoreInit.prototype.mouseMove = function (e) {
		console.log(e)
		console.log(e.target)
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