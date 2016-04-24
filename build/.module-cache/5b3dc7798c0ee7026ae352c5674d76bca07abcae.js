var MusicBox = React.createClass({displayName: "MusicBox",
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}, 
                React.createElement(TitleBar, null), 
                React.createElement(PlayLists, {playList: this.props.playList}), 
                React.createElement(SongsList, {nowSongList: this.props.nowSongList}), 
                React.createElement(PlayBar, {nowMusic: this.props.nowMusic})
            )
        )
    }
});

var TitleBar = React.createClass({displayName: "TitleBar",
    render: function () {
        return (
            React.createElement("header", {className: "bar bar-nav"}, 
                React.createElement("a", {href: "#myPopover"}, 
                    React.createElement("h1", {className: "title"}, 
                        "优雅音乐", 
                        React.createElement("span", {className: "icon icon-caret"})
                    )
                )
            )
        )
    }
});

var PlayLists = React.createClass({displayName: "PlayLists",
    render: function () {
        var playListsNodes = this.props.playList.map(function (list) {
            return (
                React.createElement(ListItem, {listName: list})
            )
        })

        return (
            React.createElement("div", {id: "myPopover", className: "popover"}, 
                React.createElement("header", {className: "bar bar-nav"}, 
                    React.createElement("h1", {className: "title"}, "歌单")
                ), 
                React.createElement("ul", {className: "table-view"}, 
                    playListsNodes
                )
            )
        )
    }
})

var SongsList = React.createClass({displayName: "SongsList",
    render: function () {
        var nowSongListNodes = this.props.nowSongList.map(function (song) {
            console.log(song)
            return (
                React.createElement(SongItem, {songName: song.songName, singer: song.singer, songIndex: song.songIndex})
            )
        })
        return (
            React.createElement("div", {className: "content"}, 
                React.createElement("ul", {className: "table-view"}, 
                    nowSongListNodes
                )
            )
        )
    }
})

var PlayBar = React.createClass({displayName: "PlayBar",
    render: function () {
        return (
            React.createElement("nav", {id: "playBarNav", className: "bar bar-tab"}, 
                React.createElement("div", {id: "playingSongName", className: "media-body"}, 
                    "生活不止眼前的苟且", 
                    React.createElement("p", null, " 许巍 ")
                ), 
                React.createElement("span", {className: "icon icon-play"}), 
                React.createElement("span", {className: "icon icon-forward"})
            )
        )
    }
})


var SongItem = React.createClass({displayName: "SongItem",
    render: function () {
        return (
            React.createElement("li", {className: "table-view-cell songLi"}, 
                React.createElement("div", {className: "songItem"}, 
                    React.createElement("div", {className: "isPlaying"}), 
                    React.createElement("div", {className: "nameItem"}, 
                        this.props.songName, 
                        React.createElement("p", null, " ", this.props.singer, " "), 
                        React.createElement("p", {className: "hide"}, " ", this.props.songIndex, " ")
                    )
                )
            )
        )
    }
})

var ListItem = React.createClass({displayName: "ListItem",
    render: function () {
        return (
            React.createElement("li", {className: "table-view-cell"}, this.props.listName)
        )
    }
})
var nowMusic = {
    nowPlayingSongName: 'hello world',
    nowPlayingSongSinger: 'hhh',
    nowPlayingState: 'playing'
}
var playList = [
    'list1',
    'list2',
    'list3'
]

var nowSongList = [
    { songName: 'song1', singer: 'singer1', songIndex: '1' },
    { songName: 'song2', singer: 'singer2', songIndex: '2' },
    { songName: 'song3', singer: 'singer3', songIndex: '3' }
]

var nowMusicListName = '正能量音乐';
var nowMusicIndex = 0;

chrome.extension.sendRequest({ greeting: "getNowPlayingInfo" }, function (response) {
    console.log(response.farewell);
    if (response.farewell == 'success') {
        playList = response.playList;
        console.log(playList)
        ReactDOM.render(
            React.createElement(MusicBox, {nowMusic: nowMusic, nowSongList: nowSongList, playList: playList, 
                nowMusicListName: nowMusicListName, nowMusicIndex: nowMusicIndex}),
            document.getElementById('musicBox')
        );
    }
});
