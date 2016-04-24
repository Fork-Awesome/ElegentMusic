console.log('xiamiPlayer开始监控');


window.setInterval(function () {
    console.log('xiami');
}, 1000);



var intervalId = window.setInterval(function () {
	var sta = "";
	if ($('.pause-btn')[0] == null) {
		sta = 'pause';

	} else {
		sta = 'playing';
		
        var process =Number( $('#J_playerDot').attr('style').split('left: ')[1].split('%')[0]);
        console.log(process)
		if (process>99) {
			sta = 'end';
		}
	}


	chrome.extension.sendRequest({ greeting: "playing", state: sta }, function (response) {

		if (response.farewell == 'stopInterval') {
			window.clearInterval(intervalId);
		}
	});
}, 1000);

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.greeting == 'changeState') {
			$('#J_playBtn')[0].click();
		}
		sendResponse({ farewell: "success" });
	});

