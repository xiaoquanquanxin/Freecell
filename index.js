window.onload = function () {
	var app = App();
	app.mobileResize();
	window.onresize = function () {
		app.mobileResize();
	}
	if (app.isMobile()) {
		if (app.isLandscape()) {
			// alert('请将屏幕横向翻转')
		} else {

		}
	} else {
		// console.log('pc端');

	}
	//  创造位置
	(function () {
		//  空挡牌位
		var spaceSeat = document.getElementById('spaceSeat');
		for (var i = 0; i < 4; i++) {
			var seat = new Seat('only');
			// console.log(seat.element.dataset);
			seat.addClass('spaceSeat');
			seat.addClass('fl');
			seat.appendTo(spaceSeat);
		}
		//  安置区
		var placementSeat = document.getElementById('placementSeat');
		for (var i = 0; i < 4; i++) {
			var seat = new Seat('only', 'design');
			seat.addClass('placementSeat');
			seat.addClass('fr');
			seat.appendTo(placementSeat);
		}
		//  操作区
		var operatingSeat = document.getElementById('operatingSeat');
		for (var i = 0; i < 8; i++) {
			var seat = new Seat();
			seat.addClass('fl');
			seat.appendTo(operatingSeat);
		}
	}());
	//  创造牌
	(function () {
		var operatingSeat = document.getElementById('operatingSeat');
		var seats = operatingSeat.getElementsByClassName('seat');
		var totalCard = Card.prototype.shuffle();
		var index = 0;
		while (index < totalCard.length) {
			var seatDiv = seats[index % 8];
			var card = new Card(index);
			card.appendTo(seatDiv);
			card.css('top', parseInt(index / 8) * 0.48 + 'rem');
			index++;
		}
	}());
};
