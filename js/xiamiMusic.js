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

//防止全部有版权 不触发存入数据库函数
$.ajax({
    url:'http://www.xiami.com'
})
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
    song.xiami_id = Number($($('a', this)[0]).attr('href').split('/song/')[1]);
    song.album = '';
    song.index = Number($('.trackid', this).text());
    //虾米有版权
    if ($('.song_play', this).length == 1) {
        song.available = 'xiami_'
    } else {
        let body = 's=' + song.name + song.singer + '&limit=20&type=1&offset=0';
        // fetch('http://music.163.com/api/search/get/',{
        //     method:'POST',
        //     body:body,

        // }).then(function(res){
        //     if(res.ok){
        //         res.json().then(function(data){
        //             data.result
        //         })
        //     }
        // })
        $.ajax({
            url: 'http://music.163.com/api/search/get/',
            type: 'POST',
            data: body,
            success: function (data) {
                data = $.parseJSON(data);
                for (i in data.result.songs) {
                    if (i == 0) {
                        song.available='wangyi_'
                        song.name=data.result.songs[i].name;
                        song.wangyi_id=data.result.songs[i].id;
                        song.singer=data.result.songs[i].artists[0].name;
                        song.album=data.result.songs[i].album.name;
                      
                        
                    }
                }
            }

        })
    }
    songs.push(song)
})

//所有ajax结束再执行
$(document).ajaxStop(function () {
    console.log(songs);


    if (!$.isEmptyObject(songs)) {
        var timestamp = Date.parse(new Date());
        var list = { [timestamp]: songList }
        //判断sync是否已存在歌单
        chrome.storage.sync.get(null, function (lists) {
            for (key in lists) {
                if (lists[key] == songList) {
                    console.log('歌单已存在')
                    chrome.storage.sync.remove(key); //删除 sync 中的list
                }
            }

        });
        //要求background将songs存入数据库
        chrome.extension.sendRequest({ greeting: "savaSongsInDB", listName: listName, songs: songs }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                console.log('songs存入数据库');
                chrome.storage.sync.set(list, function () {
                    console.log("list存入sync");
                });
            }
        });

    }

});


