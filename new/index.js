window.onload = function () {
//  空挡
    var freeCell = document.querySelector('.free-cell');
    freeCell.determineCell = freeCell.querySelectorAll('.determine-cell');
    callFn(Array.prototype.forEach, freeCell.determineCell, [function (t, i) {
        var left = i * 120;
        t.style.left = left + 'px';
        freeCell.determineCellPos = freeCell.determineCellPos || [];
        freeCell.determineCellPos.push({top: 0, left: left, bottom: 173, right: 120 + left});
        var placeholder = new CellPlaceholder();
        t.appendChild(placeholder.element);
    }]);

//  得分
    var pointCell = document.querySelector('.point-cell');
    pointCell.determineCell = pointCell.querySelectorAll('.determine-cell');
    callFn(Array.prototype.forEach, pointCell.determineCell, [function (t, i, arr) {
        var right = (Core.designIndex - i) * 120;
        t.style.right = right + 'px';
        pointCell.determineCellPos = pointCell.determineCellPos || [];
        pointCell.determineCellPos.push({
            top: 0,
            left: pointCell.offsetLeft + t.offsetLeft,
            bottom: 173,
            right: 120 + pointCell.offsetLeft + t.offsetLeft
        });
        var placeholder = new CellPlaceholder({classList: [Core.designArray[i]]});
        t.appendChild(placeholder.element);
    }]);

//  牌堆
    var initCell = document.querySelector('.init-cell');
    initCell.determineCell = initCell.querySelectorAll('.determine-cell');
    callFn(Array.prototype.forEach, initCell.determineCell, [function (t, i) {
        var left = i * 120 + 10;
        t.style.left = left + 'px';
        initCell.determineCellPos = initCell.determineCellPos || [];
        initCell.determineCellPos.push({
            top: initCell.offsetTop,
            left: left,
            bottom: initCell.offsetTop + t.offsetHeight,
            right: left + 120,
        });
        var placeholder = new CellPlaceholder();
        t.appendChild(placeholder.element);
    }]);

//  创造牌
    Core.initData.forEach(function (t, i) {
        var design = t.design;
        var color = 'red';
        switch (design) {
            case 'spade':
            case 'club':
                color = 'black';
                break;
        }
        t.color = color;
        var card = new CreateCard({design: t.design, points: t.points, color: color, cardIndex: t.cardIndex}).element;
        card.style.top = parseInt(i / 8) * 50 + 'px';
        initCell.determineCell[i % 8].appendChild(card);
    });


//  注册事件
    (function () {
        var container = document.getElementById('container');

        //  激活卡牌
        compatibility.eventListener(container, 'click', compatibilityClick);
        function compatibilityClick(e) {
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            //  先要把上一次被激活的卡牌置为普通
            callFn(Array.prototype.map, Core.activateList, [function (t) {
                t.removeClass('activate');
            }]);
            Core.activateList = [coreCard];                     //  那些牌需要激活的list
            Core.isActivity = true;
            //  筛选激活卡牌
            var coreActivateCard = coreCard;
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
                    continue;
                }
                if (prevCardIndex !== currentCardIndex + 1) {
                    Core.isActivity = false;
                    continue;
                }
                Core.activateList.push(coreActivateCard);
            }
            //  给激活卡牌设置样式
            callFn(Array.prototype.map, Core.activateList, [function (t) {
                t.addClass('activate');
            }]);
//            console.log(Core.activateList);
//            console.log(Core.isActivity);
        }

        //  按住
        compatibility.eventListener(container, 'mousedown', compatibilityMousedown);
        function compatibilityMousedown(e) {
            if (!Core.isActivity) {
                return;
            }
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            console.log(coreCard)

        }

        //  移动卡牌组
        compatibility.eventListener(container, 'mousemove', compatibilityMousemove);
        function compatibilityMousemove(e) {
            if (!Core.isActivity) {
                return;
            }
            var event = compatibility.event(e);
            var target = compatibility.target(event);
            var coreCard = getTargetCore(target);
            if (!coreCard) {
                return;
            }
            //console.log(coreCard)
         }


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
    }());
};