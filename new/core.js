function CoreElement(options) {
	options = options || {};
	var tagName = options.tagName || 'div';
	this.element = document.createElement(tagName);
	this.classList = this.element.classList;
	var _this = this;
	(options.classList || []).forEach(function (t) {
		_this.classList.add(t);
	});
	this.element.core = this;
}

//  DOM
CoreElement.prototype.appendTo = function (aim) {
	if (aim instanceof Element && aim !== this.element) {
		aim.appendChild(this.element);
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.appendTo\n错误原因：错误的DOM目标对象或无法添加自身');
	}
	return this;
};
CoreElement.prototype.removeFrom = function (aim) {
	if (aim instanceof Element && aim !== this.element) {
		if (this.element.parentNode === aim) {
			aim.removeChild(this.element);
		} else {
			throw new Error('\n错误记录：CoreElement.prototype.removeFrom\n错误原因：目标对象不为父级元素');
		}
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.removeFrom\n错误原因：错误的DOM目标对象或无法移除自身');
	}
	return this;
};
CoreElement.prototype.getNextElement = function () {
	return this.element.nextElementSibling;
};
CoreElement.prototype.getParentElement = function () {
	return this.element.parentNode;
};
CoreElement.prototype.isLastChildren = function () {
	return this.element.parentNode.lastChild === this.element;
};
//  CLASS
CoreElement.prototype.addClass = function (cssName) {
	if (typeof cssName === 'string') {
		this.element.classList.add(cssName)
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.addClass\n错误原因：添加css类名必须为字符串');
	}
	return this;
};
CoreElement.prototype.removeClass = function (cssName) {
	if (cssName === undefined) {
		this.element.classList.value = '';
	} else if (typeof cssName === 'string') {
		this.element.classList.remove(cssName)
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.removeClass\n错误原因：删除css类名必须为字符串');
	}
	return this;
};
CoreElement.prototype.hasClass = function (cssName) {
	if (typeof cssName === 'string') {
		return Array.prototype.some.call(this.element.classList, function (t) {
			return t === cssName;
		});
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.hasClass\n错误原因：查询css类名必须为字符串');
	}
};
//  CSS
CoreElement.prototype.css = function (cssName, cssValue) {
	if (typeof cssName === 'string') {
		if (typeof cssValue === 'string') {
			this.element.style[cssName] = cssValue;
		} else if (cssValue === undefined) {
			return getComputedStyle(this.element)[cssName];
		} else {
			throw new Error('\n错误记录：CoreElement.prototype.css\n错误原因：参数cssValue错误');
		}
	} else {
		throw new Error('\n错误记录：CoreElement.prototype.css\n错误原因：无法识别的参数');
	}
	return this;
};


/**
 * designPlaceholder
 * */
function CellPlaceholder(options) {
	options = options || {};
	CoreElement.call(this, options);
	this.classList.add('cell');
}

(function () {
	function Temp() {
	}

	Temp.prototype = CoreElement.prototype;
	CellPlaceholder.prototype = new Temp();

}());


/**
 * card
 * */
function CreateCard(options) {
	options = options || {};
	CoreElement.call(this, options);
	this.classList.add('card');
	this.classList.add('abs');
	this.classList.add(options.color);
	this.classList.add('index-' + options.cardIndex);
	this.element.innerHTML = options.points + '<br>' + options.designLogo;
	this.design = options.design;
	this.cardIndex = options.cardIndex;
	this.color = options.color;
	var cardPlaceholder = new CreateCardPlaceholder(options);
	this.element.appendChild(cardPlaceholder.element);
}

(function () {
	function Temp() {
	}

	Temp.prototype = CoreElement.prototype;
	CreateCard.prototype = new Temp();

}());

function CreateCardPlaceholder(options) {
	options = options || {};
	options.classList = options.classList || [];
	options.classList.push('abs');
	options.classList.push('card-design');
	options.classList.push(options.design);
	CoreElement.call(this, options);
}

(function () {
	function Temp() {
	}

	Temp.prototype = CoreElement.prototype;
	CreateCardPlaceholder.prototype = new Temp();

}());

/**
 * initData
 * */
(function (w) {
	w.Core = {};
	Core.designArray = ['spade', 'heart', 'club', 'diamond'];
	Core.designLogoArray = ['♠', '♥', '♣', '♦'];
	Core.designIndex = 3;
	Core.pointsArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
	Core.initData = [];         //  所有牌的数据
	for (var j = Core.pointsArray.length - 1; j >= 0; j--) {
		for (var i = 0; i < Core.designArray.length; i++) {
			Core.initData.push({
				design: Core.designArray[i],
				designLogo: Core.designLogoArray[i],
				color: (i % 2) ? 'red' : 'black',
				points: Core.pointsArray[j],
				cardIndex: j
			});
		}
	}
	Core.activateList = [];     //  被激活牌的list
	Core.isActivity = false;    //  是否可以移动了
	Core.isMoved = false;       //  上一步操作了移动
	Core.activateHead = {};     //  被激活列表里第一个DOM的信息:position,index,color
	Core.determineCell = {
		/********空当*********/
		freeCell: [],           //  左上角
		pointCell: [],          //  得分位
		initCell: [],           //  初始位置
	};
	Core.determineCellPos = {
		/*********空当的位置***********/
		freeCell: [],           //  左上角
		pointCell: [],          //  得分位
		initCell: [],           //  初始位置
	};
}(window));
