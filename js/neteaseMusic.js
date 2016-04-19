console.log('解析网易歌单');

//Tool trim
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

var Song = {
    index: "",
    name: "",
    singer: "",
    album: "",
    wangyi_id: "",
    xiami_id: "",
    available: ""
}

//获取iframe框架
var iframe = $('#g_iframe').contents();

//歌单名称
var listName = $('h2.f-ff2:first', iframe).text();



// 遍历网易云音乐列表的每一首歌
var songs = {};
var trs = $('tr', iframe);
trs.each(function () {
    if (typeof ($(this).attr('class')) != 'undefined') {
        var song = Object.create(Song);
        //获取歌曲info
        song.index=$('span.num',this).text();
        song.name=$('b',this).text();
        song.singer = $($('td', this)[3].children[0].children[0].children[0]).text();
        song.album = $($('td', this)[4].children[0].children[0]).text();
        song.wangyi_id = $('a',$('td',this)[1]).attr('href').slice(9)
        

        // //如果歌曲网易没版权
        if ($(this).attr('class').search("js-dis") != -1) {
            var tempSong = Object.create(Song);
            var flag = true;
            // 
            var xiamiQuerryUrl = "http://www.xiami.com/search?key=" + song.name + " " + song.singer + " " + song.album;
            $.ajax({
                async: false,
                url: xiamiQuerryUrl,
                success: function (data) {
                    data = $.parseHTML(data);
                    // 遍历一首歌的所有虾米有版权的结果
                    $(data).find("[checked='checked']").each(function () {
                        tempSong.xiami_id = $(this).attr('value');
                        let index = 0;
                        $(this).parent().parent().find("[target='_blank']").each(function () {
                            switch (index) {
                                case 0:
                                    tempSong.name = $.trim($(this).text());
                                    index++;
                                    break;
                                case 1:
                                    tempSong.singer = $.trim($(this).text());
                                    index++;
                                    break;
                                case 2:
                                    let txt_album = $.trim($(this).text());
                                    tempSong.album = txt_album.substring(1, txt_album.length - 1);
                                    if (flag) {
                                        flag = false;
                                        //覆盖信息
                                        song.name=tempSong.name;
                                        song.singer=tempSong.singer;
                                        song.album=tempSong.album;
                                        song.xiami_id=tempSong.xiami_id;
                                        song.available='xiami_';
                                    }
                                    break;
                            }
                        });
                    });

                }
            });
        }else{  //如果歌曲网易有版权
            song.available='wangyi_'
        }
        //console.log(song);

        // //存储歌曲
        // let key=(song.id).toString();
        // chrome.storage.sync.set({key: song},function(){

        // });
        var key = song.from + song.id;
       // console.log(key);
        // songs.push({[key]:song});
        songs[key] = song;
    }


})


if (!$.isEmptyObject(songs)) {
    var timestamp = Date.parse(new Date());
    var list = {[timestamp]:listName}
    chrome.storage.sync.set(list, function () {
        console.log("list存入sync");
    });
}
