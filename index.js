window.onload = function () {
	var app = App();
	if (app.isMobile()) {
		if (app.isLandscape()) {
			// alert('请将屏幕横向翻转')
		} else {

		}
	} else {
		// console.log('pc端');
		//  空挡牌位

	}
	var spaceSeat = document.getElementById('spaceSeat');
	for (var i = 0; i < 4; i++) {
		var seat = new Seat('only');
		seat.addClass('spaceSeat');
		seat.addClass('fl');
		seat.appendTo(spaceSeat);
	}
	var placementSeat = document.getElementById('placementSeat');

	for (var i = 0; i < 4; i++) {
		var seat = new Seat('only','design');
		console.log(seat.element.dataset);
		seat.addClass('placementSeat');
		seat.addClass('fr');
		seat.appendTo(placementSeat);
	}

	app.mobileResize();
	window.onresize = function () {
		app.mobileResize();
	}
};
