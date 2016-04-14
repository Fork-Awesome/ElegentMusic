console.log('neteaseMusic解析执行');

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
var Song = {
    name: "",
    singer: "",
    album: "",
    time: "",
    from: "",
    id: "",
    available: true,
    substitute: null
}
var iframe = $('#g_iframe').contents();
var songs ={};
var trs = $('tr', iframe);
// 遍历网易云音乐列表的每一首歌
trs.each(function() {
    if (typeof ($(this).attr('class')) != 'undefined') {
        var song = Object.create(Song);

        //获取歌曲info
        var trSongIdInfo = $('td', this)[1].children[0].children[0].children[0].children[0].children[0];
        song.id = $(trSongIdInfo).attr('href').slice(9);
        song.name = $('b', trSongIdInfo).text();
        song.time = $($('td', this)[2].children[0]).text();
        song.singer = $($('td', this)[3].children[0].children[0].children[0]).text();
        song.album = $($('td', this)[4].children[0].children[0]).text();
        song.available = true;
        song.from = "wangyi_";

        //如果歌曲不可用
        if ($(this).attr('class').search("js-dis") != -1) {
            var flag = true;
            song.available = false;
            var xiamiQuerryUrl = "http://www.xiami.com/search?key=" + song.name + " " + song.singer + " " + song.album;
            var subSong = Object.create(Song);
            $.get({
                dataType: 'html',
                url: xiamiQuerryUrl,
                success: function(data) {
                    // 遍历一首歌的所有搜索结果
                    $(data).find("[checked='checked']").each(function() {
                        var tempSong = Object.create(Song);
                        tempSong.available = true;
                        tempSong.from = "xiami_";
                        tempSong.id = $(this).attr('value');
                        let index = 0;
                        $(this).parent().parent().find("[target='_blank']").each(function() {
                            switch (index) {
                                case 0:
                                    tempSong.name = $(this).text().trim();
                                    index++;
                                    break;
                                case 1:
                                    tempSong.singer = $(this).text().trim();
                                    index++;
                                    break;
                                case 2:
                                    let txt_album = $(this).text().trim();
                                    tempSong.album = txt_album.substring(1,txt_album.length-1);
                                    if (flag) {
                                        subSong = tempSong;
                                        flag = false;
                                        song.subSong = subSong;
                                        //console.log(subSong);
                                    }
                                    //console.log(tempSong);
                                    break;
                            }
                        });
                    });

                }
            });
        }
        // console.log(song);

        // //存储歌曲
        // let key=(song.id).toString();
        // chrome.storage.sync.set({key: song},function(){
            
        // });
        var key= song.from+song.id;
        console.log(key);
        // songs.push({[key]:song});
        songs[key]=song;
    }
    

})

console.log(songs);
chrome.storage.sync.set(songs,function(){
    console.log("存入sync");
});