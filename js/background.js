// 查找音乐列表里的音乐
function findMusicList(info, tab) {
    console.log(info.pageUrl);
    console.log(tab.id);


    if (info.pageUrl.search('music.163.com') != -1) {
        console.log("开始查找163");
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/jquery.js" }, function() {
                console.log("注入jquery.");
            }
        );
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/neteaseMusic.js" }, function() {
                console.log("注入网易列表查找js.");
            }
        );

    }
}

chrome.contextMenus.create({
    "title": "查找音乐",
    "onclick": findMusicList
}, function() {
    if (chrome.extension.lastError) {
        console.log("Got expected error: " + chrome.extension.lastError.message);
    }
});



chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        s = [];
        if (request.greeting == "hello") {
            chrome.storage.sync.get(null, function(songs) {
                for (song in songs) {
                    s.push(songs[song]);
                }
                console.log(s);
                sendResponse({ songs: s });
            });
        } else if (request.greeting == "play") {
            console.log(request.from + "!" + request.id);
            playMusic(request.from, request.id);
            sendResponse({ state: "ok" });
        }
        //  sendResponse({ farewell: "goodbye" });
    });

var isPlayTabOpen = false;
var tabId = null;

function playMusic(from, id) {
    var url;
    if (from == 'wangyi_') {
        url = "http://music.163.com/#/song?id=" + id + "&autoplay=true"
    } else if (from == 'xiami_') {
        url = "http://www.xiami.com/play?ids=/song/playlist/id/" + id;
    }
    if (!isPlayTabOpen) {
        isPlayTabOpen = true;
        chrome.windows.create({
            type: 'popup',
            width: 1024,
            height: 768,
            url: url,
        }, function(w) {
            tabId = w.tabs[0].id;
        })
    } else {
        console.log(tabId);
        chrome.tabs.update(tabId, {
            url: url
        }, function() { })
    }

    chrome.tabs.executeScript(
        tabId,
        { file: "js/jquery.js" }, function() {
            console.log("注入jquery.");

            if (from == 'wangyi_') {
                chrome.tabs.executeScript(
                    tabId,
                    {
                        // file: "js/neteasePlayer.js",
                        code: "var script = document.createElement('script');"
                        + "url =chrome.extension.getURL('/js/neteasePlayer.js');script.src = url;document.getElementsByTagName('head')[0].appendChild(script);"
                    }, function() {
                        console.log("注入网易播放器监视器");
                    }
                );
            } else if (from == 'xiami_') {
                chrome.tabs.executeScript(
                    tabId,
                    { file: "js/xiamiPlayer.js" }, function() {
                        console.log("注入虾米播放器监视器");
                    }
                );
            }
        }
    );



}
