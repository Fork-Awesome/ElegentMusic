var isPlayTabOpen = false;
var tabId = null;
var tmpListID = ''
var tmpListName = ''

var nowPlayListName = '';
var nowPlaySongIndex = 0;
var nowPlayList = [];
var nowPlayingMode = 'order'; // order cirle random
var nowPlayState = 'pause'; //playing pause

// 查找音乐列表里的音乐
function findMusicList(info, tab) {
    // console.log(info.pageUrl);
    // console.log(tab.id);

    if (info.pageUrl.search('music.163.com') != -1) {

        tmpListID = getParameterByNameNetease(info.pageUrl, 'id');
        console.log("backgroud:开始查找163");
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/jquery.js" },
            function () {
                console.log("注入jquery.");
            }
        );
        chrome.tabs.executeScript(
            tab.id,
            { file: "js/neteaseMusic.js" }, function () {
                console.log("注入网易列表查找js.");
            }
        );

    } 
    // else if (info.pageUrl.search('xiami.com/collect') != -1) {

    //     tmpListID = getParameterByNameXiami(info.pageUrl);
    //     console.log("backgroud:开始查找xiami");
    //     chrome.tabs.executeScript(
    //         tab.id,
    //         { file: "js/jquery.js" },
    //         function () {
    //             console.log("注入jquery.");
    //         }
    //     );
    //     chrome.tabs.executeScript(
    //         tab.id,
    //         { file: "js/xiamiMusic.js" }, function () {
    //             console.log("注入虾米列表查找js.");
    //         }
    //     );

    // }
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
        //popup 想要播放歌曲
        if (request.greeting == "play") {

            var wantPlayListName = request.playSongInfo.wantPlayListName;
            var wantPlayListIndex = request.playSongInfo.wantPlayListIndex;
            console.log(wantPlayListName + wantPlayListIndex)
            let from;
            let id;


            if (wantPlayListName != nowPlayListName) {
                nowPlayListName = wantPlayListName;
                nowPlaySongIndex = wantPlayListIndex;
                getSongsInDb(nowPlayListName, function () {
                    from = nowPlayList[nowPlaySongIndex - 1].available;
                    if (from == undefined || from == null || from == '') {
                        //
                    } else if (from == 'wangyi_') {
                        id = nowPlayList[nowPlaySongIndex - 1].wangyi_id;
                    } else if (from == 'xiami_') {
                        id = nowPlayList[nowPlaySongIndex - 1].xiami_id;
                    }
                    playMusic(from, id)
                });
            } else {
                nowPlaySongIndex = wantPlayListIndex;
                from = nowPlayList[wantPlayListIndex - 1].available;
                if (from == undefined || from == null || from == '') {
                    //
                } else if (from == 'wangyi_') {
                    id = nowPlayList[nowPlaySongIndex - 1].wangyi_id;
                } else if (from == 'xiami_') {
                    id = nowPlayList[nowPlaySongIndex - 1].xiami_id;
                }
                playMusic(from, id);
            }
            sendResponse({ farewell: "success" });
        }
        // content script 传递播放的状态 
        else if (request.greeting == "playing") {
            if (sender.tab.id != tabId) {
                sendResponse({ farewell: "stopInterval" });
            }
            console.log(request.state);
            if (request.state == 'playing') {
                nowPlayState = 'playing'
            } else if (request.state == 'pause') {
                nowPlayState = 'pause'
            } else if (request.state == 'end') {
                nowPlayState = 'playing'
                if (nowPlaySongIndex < nowPlayList.length) {
                    nowPlaySongIndex++;
                } else {
                    nowPlaySongIndex = 1;
                }
                let id;
                let from = nowPlayList[nowPlaySongIndex - 1].available;
                if (from == undefined || from == null || from == '') {
                    //
                } else if (from == 'wangyi_') {
                    id = nowPlayList[nowPlaySongIndex - 1].wangyi_id;
                } else if (from == 'xiami_') {
                    id = nowPlayList[nowPlaySongIndex - 1].xiami_id;
                }
                playMusic(from, id)
            }
            sendResponse({ farewell: "msg from backgroud" });
        }
        // content script 要存歌单
        else if (request.greeting == "savaSongsInDB") {
            console.log(request.listName);

            saveSongsInDB(request.listName, request.songs);
            chrome.notifications.create({ type: 'basic', iconUrl: 'images/icon.png', title: '解析完成', message: request.listName }, function (id) {
                timer = setTimeout(function () { chrome.notifications.clear(id); }, 2000);
            })
            sendResponse({ farewell: "success" });
        }
        //
        else if (request.greeting == 'getListId') {
            //弹 notification
            chrome.notifications.create({ type: 'basic', iconUrl: 'images/icon.png', title: '正在解析歌单', message: request.listName }, function (id) {
                timer = setTimeout(function () { chrome.notifications.clear(id); }, 1000);
            })
            sendResponse({ farewell: "success", list_id: tmpListID });

        }
        // popup 要现在的播放信息
        else if (request.greeting == 'getNowPlayingInfo') {
            let playListNames = [];
            chrome.storage.sync.get(null, function (lists) {
                for (key in lists) {
                    playListNames.push(lists[key].listName);
                }
                console.log(playListNames)
                sendResponse(
                    {
                        farewell: "success",
                        playListNames: playListNames,//歌单列表
                        nowPlayList: nowPlayList,//当前歌单里的歌 
                        nowPlayListName: nowPlayListName,//当前歌单名称
                        nowPlaySongIndex: nowPlaySongIndex,//当前歌目index
                        nowPlayState: nowPlayState //当前状态 暂停还是播放
                    });
            });
        }
        else if (request.greeting == 'getSongsByListName') {
            let db;
            let dBrequest = indexedDB.open("songsDB");
            dBrequest.onerror = function (event) {
                console.log("Why didn't you allow my web app to use IndexedDB?!");
            };
            dBrequest.onsuccess = function (event) {
                db = dBrequest.result;
                let transaction = db.transaction([request.listName]);
                let objectStore = transaction.objectStore(request.listName);

                objectStore.getAll().onsuccess = function (event) {
                    songList = event.target.result;
                    sendResponse(
                        {
                            farewell: "success",
                            songList: songList,//歌单里的歌  
                        });

                };
            };
        }
        else if (request.greeting == 'changeState') {
            changeState();
            sendResponse({ farewell: "success" });
        }

    });

function getListsInSync() {
    chrome.storage.sync.get(null, function (lists) {
        for (i in lists) {
            console.log(lists[i])
        }
        return lists;
    });
}

function getSongsInDb(listName, callBack) {

    let db;
    let request = indexedDB.open("songsDB");
    request.onerror = function (event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function (event) {
        db = request.result;
        let transaction = db.transaction([listName]);
        let objectStore = transaction.objectStore(listName);

        objectStore.getAll().onsuccess = function (event) {
            nowPlayList = event.target.result;
            console.log(nowPlayList)
            callBack();
        };
    };



}
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

//判断播放页面是否被用户手动关闭
chrome.tabs.onRemoved.addListener(function (removeInfo) {
    if (removeInfo == tabId) {
        isPlayTabOpen = false;
        nowPlayState = 'pause';
    }
})

//工具函数 根据 url 和 parameter 的key获取 value
function getParameterByNameNetease(queryString, name) {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || '';
}

function getParameterByNameXiami(url) {
    return url.split('http://www.xiami.com/collect/')[1].split('?')[0];
}

//首次安装应用或版本更新
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        console.log("This is a first install!");
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

//安装后第一次启动
chrome.runtime.onStartup.addListener(function () {

    console.log('first startUp');

})

// 创建歌单 objectStore
function saveSongsInDB(listName, songs) {
    let request = indexedDB.open('songsDB');
    request.onsuccess = function (e) {
        let database = e.target.result;
        let version = parseInt(database.version);
        console.log(version);
        database.close();
        let secondRequest = indexedDB.open('songsDB', version + 1);
        secondRequest.onupgradeneeded = function (e) {
            let database = e.target.result;
            let objectStore = database.createObjectStore(listName, { keyPath: "index" });
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("singer", "singer", { unique: false });
            objectStore.createIndex("album", "album", { unique: false });
            objectStore.createIndex("wangyi_id", "wangyi_id", { unique: false });
            objectStore.createIndex("xiami_id", "xiami_id", { unique: false });
            objectStore.createIndex("available", "available", { unique: false });

            for (var i in songs) {
                objectStore.add(songs[i]);
            }
            console.log(objectStore);
        };
        secondRequest.onsuccess = function (e) {
            e.target.result.close();
        }
    }
}
function changeState() {


    chrome.tabs.sendMessage(tabId, { greeting: 'changeState' }, function (response) {
        console.log(response.farewell);
    });

}

