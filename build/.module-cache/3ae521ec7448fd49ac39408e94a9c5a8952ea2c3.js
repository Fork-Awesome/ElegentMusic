var nowPlayListName = '优雅音乐'

var MusicBox = React.createClass({displayName: "MusicBox",
    handleSelectList: function (nowPlayList, listName) {
        this.setState({
            nowPlayList: nowPlayList,
            nowPlaySongIndex: 0,
            nowPlayListName: listName
        })
    },
    getInitialState: function () {
        console.log('hhh')
        return {

            nowPlayListName: '优雅音乐',
            nowPlayList: [],
            playListNames: [""],
            nowMusic: {},
            nowPlaySongIndex: 0
        }
    },
    componentDidMount: function () {
        /*
        
                        farewell: "success",
                        playListNames: playListNames,//歌单列表
                        nowPlayList: nowPlayList,//当前歌单里的歌 
                        nowPlayListName: nowPlayListName,//当前歌单名称
                        nowPlaySongIndex: nowPlaySongIndex,//当前歌目index
                        nowPlayState: nowPlayState //当前状态 暂停还是播放
        */
        
        let t = this;
        chrome.extension.sendRequest({ greeting: "getNowPlayingInfo" }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                let playListNames = response.playListNames;
                nowPlayListName = response.nowPlayListName;
                let nowPlayList = response.nowPlayingSongList;
                let nowPlaySongIndex = response.nowPlaySongIndex;
                let nowPlayState = response.nowPlayState;

                if (nowPlaySongIndex > 0) {
                    nowMusic = nowPlayList[nowPlaySongIndex - 1];
                }

                t.setState({
                    nowMusic: nowMusic,
                    nowPlayList: nowPlayList,
                    playListNames: playListNames,
                    nowPlayListName: nowPlayListName,
                    nowPlaySongIndex: nowPlaySongIndex
                })
            }
        });
    },
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}, 
                React.createElement(TitleBar, {nowPlayListName: this.state.nowPlayListName}), 
                React.createElement(AllListNames, {onSelectList: this.handleSelectList, playList: this.state.playListNames}), 
                React.createElement(PlayList, {nowPlayList: this.state.nowPlayList, nowPlaySongIndex: this.state.nowPlaySongIndex}), 
                React.createElement(PlayBar, {nowMusic: this.state.nowMusic})
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
                        this.props.nowPlayListName, 
                        React.createElement("span", {className: "icon icon-caret"})
                    )
                )
            )
        )
    }
});

var AllListNames = React.createClass({displayName: "AllListNames",
    render: function () {
        var onSelectList = this.props.onSelectList;
        console.log(this.props.playListNames)
        var AllListNamesNodes = this.props.playListNames.map(function (list) {
            return (
                React.createElement(ListItem, {onSelectList: onSelectList, listName: list})
            )
        })

        return (
            React.createElement("div", {id: "myPopover", className: "popover"}, 
                React.createElement("header", {className: "bar bar-nav"}, 
                    React.createElement("h1", {className: "title"}, "歌单")
                ), 
                React.createElement("ul", {className: "table-view"}, 
                    AllListNamesNodes
                )
            )
        )
    }
})

var PlayList = React.createClass({displayName: "PlayList",
    render: function () {
        let nowPlaySongIndex = this.props.nowPlaySongIndex;
        var nowPlayListNodes = this.props.nowPlayList.map(function (song) {
            console.log(song)
            return (
                React.createElement(SongItem, {songName: song.name, singer: song.singer, songIndex: song.index, nowPlaySongIndex: nowPlaySongIndex})
            )
        })
        return (
            React.createElement("div", {className: "content"}, 
                React.createElement("ul", {className: "table-view"}, 
                    nowPlayListNodes, 
                    React.createElement("li", null, React.createElement("br", null)), 
                    React.createElement("li", null, React.createElement("br", null))
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
                    this.props.nowMusic.name, 
                    React.createElement("p", null, "  ", this.props.nowMusic.singer, " ")
                ), 
                React.createElement("span", {className: "icon icon-play"}), 
                React.createElement("span", {className: "icon icon-forward"})
            )
        )
    }
})


var SongItem = React.createClass({displayName: "SongItem",
    handleClick: function () {
        let onSelectSong = {
            songName: this.props.songName,
            songSinger: this.props.singer,
            songIndex: this.props.songIndex
        };
        let playSongInfo = {
            wantPlayListName: nowPlayListName,
            wantPlayListIndex: this.props.songIndex
        }
        chrome.extension.sendRequest({ greeting: "play", playSongInfo: playSongInfo }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                // onSelectList(playList, listName);
            }
        });
    },
    render: function () {
        return (
            React.createElement("li", {className: "table-view-cell songLi"}, 
                React.createElement("div", {className: "songItem"}, 
                    (this.props.songIndex == this.props.nowPlaySongIndex) ? React.createElement("div", {className: "isPlaying"}) : React.createElement("div", {className: "isnotPlaying"}), 
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
    handleClick: function () {
        let onSelectList = this.props.onSelectList;
        let listName = this.props.listName
        chrome.extension.sendRequest({ greeting: "getSongsByListName", listName: listName }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                let playList = response.songList;
                console.log(playList)
                onSelectList(playList, listName);
            }
        });
        return;
    },
    render: function () {
        return (
            React.createElement("li", {onClick: this.handleClick.bind(this), className: "table-view-cell"}, this.props.listName)
        )
    }
})

ReactDOM.render(
    React.createElement(MusicBox, null),
    document.getElementById('musicBox')
);