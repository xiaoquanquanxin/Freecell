window.onload = function () {
//  空挡
	var freeCell = document.querySelector('.free-cell');
	freeCell.determineCell = freeCell.querySelectorAll('.determine-cell');
	Core.determineCell.freeCell = freeCell.determineCell;
	compatibility.callFn(compatibility.forEach, freeCell.determineCell, [function (t, i) {
		var left = i * 120;
		t.style.left = left + 'px';
		var placeholder = new CellPlaceholder();
		t.appendChild(placeholder.element);
	}]);

//  得分
	var pointCell = document.querySelector('.point-cell');
	pointCell.determineCell = pointCell.querySelectorAll('.determine-cell');

	Core.determineCell.pointCell = pointCell.determineCell;

	compatibility.callFn(compatibility.forEach, pointCell.determineCell, [function (t, i, arr) {
		var right = (Core.designIndex - i) * 120;
		t.style.right = right + 'px';
		var placeholder = new CellPlaceholder({classList: [Core.designArray[i]]});
		t.appendChild(placeholder.element);
	}]);

//  牌堆
	var initCell = document.querySelector('.init-cell');
	initCell.determineCell = initCell.querySelectorAll('.determine-cell');
	Core.determineCell.initCell = initCell.determineCell;
	compatibility.callFn(compatibility.forEach, initCell.determineCell, [function (t, i) {
		var left = i * 120 + 10;
		t.style.left = left + 'px';
		var placeholder = new CellPlaceholder();
		t.appendChild(placeholder.element);
	}]);

//  创造牌
	Core.initData.forEach(function (t, i) {
		var card = new CreateCard({
			design: t.design,
			designLogo: t.designLogo,
			points: t.points,
			color: t.color,
			cardIndex: t.cardIndex
		}).element;
		card.style.top = parseInt(i / 8) * 50 + 'px';
		initCell.determineCell[i % 8].appendChild(card);
	});


	//  获得上一个dom的实例
	function getTargetCore(target) {
		var coreTarget = target.core;                       //  点击DOM元素实例
		if (!coreTarget) {
			return null;
		}
		var card = coreTarget.getParentElement();
		var coreCard = card.core;                           //  牌实例
		if (!coreCard || !coreCard.hasClass('card')) {
			return null;
		}
		return coreCard;
	}

	//  注册事件
	(function () {
		var documentBody = document.body;

		//  激活卡牌
		compatibility.eventListener(documentBody, 'click', compatibilityClick);

		function compatibilityClick(e) {
			var event = compatibility.event(e);
			// console.log('top:', event.clientY, 'left:', event.clientX);
			var target = compatibility.target(event);
			var coreCard = getTargetCore(target);
			if (!coreCard) {
				return;
			}
			//  先要把上一次被激活的卡牌置为普通
			compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
				t.removeClass('activate');
			}]);
			Core.activateList = [coreCard];                     //  那些牌需要激活的list
			Core.isActivity = true;
			//  筛选激活卡牌
			var coreActivateCard = coreCard;
			// debugger
			while (1) {
				var next = coreActivateCard.getNextElement();
				if (!next) {
					break;
				}
				Core.isActivity = true;
				var prevColorIsRed = coreActivateCard.hasClass('red');
				var prevCardIndex = coreActivateCard.cardIndex;
				coreActivateCard = next.core;
				var currentColorIsRed = coreActivateCard.hasClass('red');
				var currentCardIndex = coreActivateCard.cardIndex;
				if (prevColorIsRed === currentColorIsRed) {
					Core.isActivity = false;
					break
				}
				if (prevCardIndex !== currentCardIndex + 1) {
					Core.isActivity = false;
					break
				}
				Core.activateList.push(coreActivateCard);
			}
			//  给激活卡牌设置样式
			compatibility.callFn(compatibility.map, Core.activateList, [function (t) {
				t.addClass('activate');
			}]);
//            console.log(Core.activateList);
//            console.log(Core.isActivity);
		}

		//  按住
		compatibility.eventListener(documentBody, 'mousedown', compatibilityMousedown);

		function compatibilityMousedown(e) {
			Core.isMoved = false;                                           //  按住的上一步一定不是移动,至少是鼠标弹起,点击事件等
			if (!Core.isActivity) {
				return;
			}
			var event = compatibility.event(e);
			var target = compatibility.target(event);
			var coreCard = getTargetCore(target);
			if (!coreCard) {
				return;
			}
			Core.isActivity = coreCard.hasClass('activate');
			if (!Core.isActivity) {
				return;
			}
			//  如果移动的不是头部
			if (Core.activateList[0] !== coreCard) {
				return
			}
			//  第一张牌左上角顶点的位置
			Core.activateHead.mouseCardAbsX = e.clientX - e.offsetX;
			Core.activateHead.mouseCardAbsY = e.clientY - e.offsetY;


			//  鼠标点击的位置
			Core.activateHead.clientX = e.clientX;
			Core.activateHead.clientY = e.clientY;

			//  卡牌原来的位置
			Core.activateHead.offsetLeft = coreCard.element.offsetLeft;
			Core.activateHead.offsetTop = coreCard.element.offsetTop;
			Core.activateHead.element = coreCard;
			//console.log('注册mousemove');
			compatibility.eventListener(documentBody, 'mousemove', compatibilityMousemove);
		}

		//  移动卡牌组
		function compatibilityMousemove(e) {
			//  如果未激活
			if (!Core.isActivity) {
				return;
			}
			var event = compatibility.event(e);
			var target = compatibility.target(event);
			var coreCard = getTargetCore(target);
			if (!coreCard) {
				return;
			}
			//console.log(Core.activateHead.relativeX);
			var mouseClientX = e.clientX;
			var mouseClientY = e.clientY;

			// console.clear();
			compatibility.callFn(compatibility.map, Core.activateList, [function (t, i) {
				t.addClass('z-index');
				var diffX = mouseClientX - Core.activateHead.clientX;
				var diffY = mouseClientY - Core.activateHead.clientY + Core.activateHead.offsetTop;
				t.css('left', diffX + 'px');
				t.css('top', diffY + i * 50 + 'px');
				// console.log(Core.activateHead.clientY, diffY, i * 50);
			}]);
			Core.isMoved = true;
		}

		//  鼠标弹起
		compatibility.eventListener(documentBody, 'mouseup', function (e) {
			Core.isActivity = false;
			//console.log('移除');
			compatibility.removeListener(documentBody, 'mousemove', compatibilityMousemove);
			if (!Core.isMoved) {
				return;
			}
			var event = compatibility.event(e);
			//console.log(event.clientX);

			var clientX = event.clientX;
			var clientY = event.clientY;


			// console.log(clientX, clientY);
			var isPlaced = false;
			//  左 , 右 , 下 三个循环
			//  可以扔到哪儿
			//  被激活的队列里有几个dom
			var _len = Core.activateList.length;
			var target = Core.activateHead.element;
			if (_len === 1) {
				compatibility.callFn(compatibility.forEach, Core.determineCellPos.freeCell, [function (t, i) {
					if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
						// console.log('鼠标释放位置对了,freecell');
						var _freecell = Core.determineCell.freeCell[i];
						var hasCard = _freecell.querySelector('.card');
						//  如果已经被占用了
						if (hasCard && hasCard !== target) {
							return
						}
						isPlaced = true;
						target.appendTo(_freecell);
						target.css('top', '0');
						target.css('left', '0');
					}
				}]);
				compatibility.callFn(compatibility.forEach, Core.determineCellPos.pointCell, [function (t, i) {
					if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
						// console.log('鼠标释放位置对了，pointcell');
						var _pointCell = Core.determineCell.pointCell[i];
						/**
						 *
						 * 这个地方的判断有严重的漏洞,这是由于最开始考虑不周造成的
						 *
						 * **/
						var pointDesign = _pointCell.querySelectorAll('.cell')[0].classList[0];
						var targetDesign = target.element.querySelectorAll('.card-design')[0].classList[2];
						//  判断花色
						if (pointDesign !== targetDesign) {
							return;
						}
						//  判断点数
						var cardList = _pointCell.querySelectorAll('.card');
						//var card

						//  已经存了 多 张牌
						if (cardList.length) {
							if (cardList[cardList.length - 1].core.cardIndex + 1 === target.cardIndex) {
								isPlaced = true;
							}
						} else {
							if (target.cardIndex === 0) {
								isPlaced = true;
							}
						}
						if (isPlaced) {
							target.appendTo(_pointCell);
							target.css('top', '0');
							target.css('left', '0');
						}
					}
				}]);
			}
			compatibility.callFn(compatibility.forEach, Core.determineCellPos.initCell, [function (t, i) {
				if (clientX >= t.left && clientX <= t.right && clientY >= t.top && clientY <= t.bottom) {
					var _initCell = Core.determineCell.initCell[i];
					// console.log('鼠标释放位置对了', initCell);
					if (_len > getMaxMoveCount()) {
						alert('无法同时移动这么多牌,你只能移动左上角空格个数+牌堆空格数');
						return;
					}
					var cardList = _initCell.querySelectorAll('.card');
					//  最后一个
					var coreListLastOne = cardList[cardList.length - 1].core;
					// console.log(coreListLastOne);
					//  判断点数                            当前牌的点数
					if (coreListLastOne.cardIndex - 1 !== target.cardIndex) {
						// console.log('点数不匹配');
						return
					}
					if (coreListLastOne.color === target.color) {
						// console.log('颜色不匹配');
						return
					}
					console.log('成了');
					isPlaced = true;
					if (_len === 1) {
						target.appendTo(_initCell);
						target.css('top', 50 + coreListLastOne.element.offsetTop + 'px');
						target.css('left', '0');
					} else {
						compatibility.callFn(compatibility.map, Core.activateList, [function (t, i) {
							t.appendTo(_initCell);
							t.css('top', 50 * (i + 1) + coreListLastOne.element.offsetTop + 'px');
							t.css('left', '0');
						}]);
					}
				}
			}]);

			//  移动失败
			compatibility.callFn(compatibility.map, Core.activateList, [function (t, i) {
				t.removeClass('z-index');
				t.removeClass('activate');
				if (!isPlaced) {
					if (t === Core.activateHead.element) {
						t.css('top', Core.activateHead.offsetTop + 'px');
					}
					else {
						t.css('top', 50 * i + Core.activateHead.offsetTop + 'px');
					}
				}
				t.css('left', '0');
			}]);

			Core.activateHead = {};
		});

		//  页面缩放
		compatibility.eventListener(window, 'resize', function () {
			resetDetermineCellPos();
		});
	}());

	//  每当window resize 的时候都要调用
	function resetDetermineCellPos() {
		var containerLeft = container.offsetLeft;
		var containerTop = container.offsetTop;
		//  左面、
		Core.determineCellPos.freeCell = [];
		compatibility.callFn(compatibility.forEach, freeCell.determineCell, [function (t, i) {
			var left = t.offsetLeft + containerLeft;
			var top = 0 + containerTop;
			setDetermineCellPos(Core.determineCellPos.freeCell, top, left, left + t.offsetWidth, top + t.offsetHeight);
		}]);
		//  右面
		Core.determineCellPos.pointCell = [];
		compatibility.callFn(compatibility.forEach, pointCell.determineCell, [function (t, i, arr) {
			var top = 0 + containerTop;
			var left = pointCell.offsetLeft + t.offsetLeft + containerLeft;
			setDetermineCellPos(Core.determineCellPos.pointCell, top, left, left + t.offsetWidth, top + t.offsetHeight);
		}]);
		//  下面
		Core.determineCellPos.initCell = [];
		compatibility.callFn(compatibility.forEach, initCell.determineCell, [function (t, i) {
			var top = initCell.offsetTop + containerTop;
			var left = t.offsetLeft + containerLeft;
			setDetermineCellPos(Core.determineCellPos.initCell, top, left, left + t.offsetWidth, top + t.offsetHeight);
		}]);
		// console.log(Core.determineCellPos);
	}

	//  写入位置
	function setDetermineCellPos(obj, top, left, right, bottom) {
		obj.push({
			top: top,
			left: left,
			right: right,
			bottom: bottom
		});
	}

	resetDetermineCellPos();

//  最大移动数量
	function getMaxMoveCount() {
		return 1 + (4 - document.querySelectorAll('.free-cell .card').length) + compatibility.callFn(compatibility.reduce, document.querySelectorAll('.init-cell .determine-cell'), [function (prev, current, index, arr) {
			return prev + ( current.querySelector('.card') ? 0 : 1);
		}, 0]);
	}
};