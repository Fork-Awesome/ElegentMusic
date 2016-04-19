var isPlayTabOpen = false;
var tabId = null;

// 查找音乐列表里的音乐
function findMusicList(info, tab) {
    console.log(info.pageUrl);
    console.log(tab.id);


    if (info.pageUrl.search('music.163.com') != -1) {
        console.log("backgroud:开始查找163");
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/jquery.js" },
            function () {
                console.log("注入jquery.");
            }
        );
        // chrome.tabs.executeScript(
        //     tab.id,
        //     { file: "js/bootstrap.js" },
        //     function () {
        //         console.log("注入bootstrap.");
        //     }
        // );
        // chrome.tabs.insertCSS(
        //     tab.id,
        //     { file: "css/bootstrap.css" },
        //     function () {
        //         console.log("注入bootstrapCSS.");
        //     }
        // );
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/neteaseMusic.js" }, function () {
                console.log("注入网易列表查找js.");
            }
        );

    }
}

//添加右键菜单
chrome.contextMenus.create({
    "title": "查找音乐",
    "onclick": findMusicList
}, function () {
    if (chrome.extension.lastError) {
        console.log("Got expected error: " + chrome.extension.lastError.message);
    }
});


//监听器
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        s = [];
        //popup 想要播放列表
        if (request.greeting == "getPlayList") {
            chrome.storage.sync.get(null, function (songs) {
                for (song in songs) {
                    s.push(songs[song]);
                }
                console.log(s);
                sendResponse({ songs: s });
            });
        }
        //popup 想要播放歌曲
        else if (request.greeting == "play") {
            console.log(request.from + "!" + request.id);
            playMusic(request.from, request.id);
            sendResponse({ state: "ok" });
        }
        // content script 传递播放的状态 
        else if (request.greeting == "playing") {
            if (sender.tab.id != tabId) {
                sendResponse({ farewell: "stopInterval" });
            }
            console.log(request.state);
            sendResponse({ farewell: "msg from backgroud" });
        }
    });


//播放指定的音乐
function playMusic(from, id) {
    var url;
    if (from == 'wangyi_') {
        url = "http://music.163.com/#/song?id=" + id + "&autoplay=true"
    } else if (from == 'xiami_') {
        url = "http://www.xiami.com/play?ids=/song/playlist/id/" + id;
    }
    //第一次打开播放窗口 或者 播放窗口被关闭
    if (!isPlayTabOpen) {
        isPlayTabOpen = true;
        chrome.windows.create({
            type: 'popup',
            width: 1024,
            height: 768,
            url: url,
        }, function (w) {
            tabId = w.tabs[0].id;
            console.log(tabId);
        });
    } else {
        chrome.tabs.update(tabId, {
            url: url
        }, function (tab) {
        });
    }
}

chrome.tabs.onRemoved.addListener(function (removeInfo) {
    if (removeInfo == tabId) {
        isPlayTabOpen = false;
    }
})
