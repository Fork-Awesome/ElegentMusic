console.log('解析虾米精选集');


var Song = {
    index: 0,//integer
    name: "",
    singer: "",
    album: "",
    wangyi_id: "",
    xiami_id: "",
    available: ""
}

var SongList = {
    listName: "",
    list_id: '',
    list_from: ''
}


var songList = Object.create(SongList);



//歌单名称
listName = $('h2').text();

if (listName == null || listName == '') {
    throw new Error("不是歌单页面");
}



//发送 歌单名称给 backGround 顺便获取url
chrome.extension.sendRequest({ greeting: "getListId", listName: listName }, function (response) {
    console.log(response.farewell);
    if (response.farewell == 'success') {
        songList.listName = listName;   //歌单名称
        songList.list_id = response.list_id;  //歌单id
        songList.list_from = 'xiami_'; //歌单from
    } else {
        throw new Error("获取url错误");
    }
});


// 遍历虾米音乐列表的每一首歌
var songs = [];

//var song = Object.create(Song);
$('.s_info').each(function () {
    let song = Object.create(Song);
    let flag = true;
    $('.song_name > a', this).each(function () {
        if (flag) {
            flag = false;
            song.name = $.trim(this.text);
        } else {
            song.singer = $.trim(this.text);
        }
    })
    // console.log($('a',this)[0].attr('href'))
    song.id = Number($($('a', this)[0]).attr('href').split('/song/')[1]);
    song.album = '';
    song.index = Number($('.trackid', this).text());
    //虾米有版权
    if ($('.song_play', this).length == 1) {
        song.available = 'xiami_'
    } else {
        let neteaseQuerryUrl = 'http://music.163.com/';
        console.log(neteaseQuerryUrl)
        fetch(neteaseQuerryUrl, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer":"http://music.163.com/search/",
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko)"
            }
        }).then(function (res) {
            fetch(neteaseQuerryUrl)
        })
    }
    console.log(song)
})

// //所有ajax结束再执行
// $(document).ajaxStop(function () {
//     console.log(songs);


//     if (!$.isEmptyObject(songs)) {
//         var timestamp = Date.parse(new Date());
//         var list = { [timestamp]: songList }
//         //判断sync是否已存在歌单
//         chrome.storage.sync.get(null, function (lists) {
//             for (key in lists) {
//                 if (lists[key] == songList) {
//                     console.log('歌单已存在')
//                     chrome.storage.sync.remove(key); //删除 sync 中的list
//                 }
//             }

//         });
//         //要求background将songs存入数据库
//         chrome.extension.sendRequest({ greeting: "savaSongsInDB", listName: listName, songs: songs }, function (response) {
//             console.log(response.farewell);
//             if (response.farewell == 'success') {
//                 console.log('songs存入数据库');
//                 chrome.storage.sync.set(list, function () {
//                     console.log("list存入sync");
//                 });
//             }
//         });

//     }

// });


