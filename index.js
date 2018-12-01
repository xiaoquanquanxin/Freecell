var app = App();
if (app.isMobile()) {
    if (app.isLandscape()) {
        alert('请将屏幕横向翻转')
    } else {
        app.mobileResize();

    }
} else {

}

