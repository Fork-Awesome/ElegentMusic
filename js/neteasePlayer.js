console.log('neteasePlay开始监控');


var intervalId = window.setInterval(function () {
	var sta = "";
	if ($('#g_player > div.btns > a.ply.j-flag.pas')[0] == null) {
		sta = 'pause';

	} else {
		sta = 'playing';
		var musicTime = $('#g_player > div.play > div.m-pbar > span').text().split(' / ');
		var cur = musicTime[0].split(':');
		cur = Number(cur[0]) * 60 + Number(cur[1]);
		var total = musicTime[1].split(':');
		total = Number(total[0]) * 60 + Number(total[1]);
		console.log(cur + ' ' + total);
		if (total - cur <= 1 && musicTime[0] != "00:00") {
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
			$('#g_player > div.btns > a.ply.j-flag')[0].click();
		}
		sendResponse({ farewell: "success" });
	});

