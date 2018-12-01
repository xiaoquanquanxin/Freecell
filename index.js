window.onload = function () {
	var app = App();
	if (app.isMobile()) {
		if (app.isLandscape()) {
			// alert('请将屏幕横向翻转')
		} else {

		}
	} else {
		// console.log('pc端');
		var seat = new Seat();
		console.log(seat);

	}

	window.onresize = function () {
		app.mobileResize();
	}
};
