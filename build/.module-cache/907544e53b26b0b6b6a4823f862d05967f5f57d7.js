var nowPlayListName = '优雅音乐'
var nowPlayList;
var nowPlayState = ''
var nowPlaySongIndex = 0;
var MusicBox = React.createClass({displayName: "MusicBox",
    handleChangePlayState: function () {
        console.log(nowPlayState)
        this.setState({
            nowPlayState: nowPlayState
        })
        chrome.extension.sendRequest({ greeting: "changeState" });
    },
    handleSelectList: function (nowPlayList, listName) {

        this.setState({
            nowPlayList: nowPlayList,
            nowPlaySongIndex: 0,
            nowPlayListName: listName,
        })
        
        $('#musicBox > div > div.backdrop').click();
    },
    handleSelectMusic: function (nowPlaySongIndex) {
        nowMusic = nowPlayList[nowPlaySongIndex - 1];
        this.setState({
            nowMusic: nowMusic,
            nowPlaySongIndex: nowPlaySongIndex,
            nowPlayState: nowPlayState
        })
    },
    getInitialState: function () {
        return {

            nowPlayListName: '优雅音乐',
            nowPlayList: [],
            playListNames: [],
            nowMusic: {},
            nowPlaySongIndex: 0
        }
    },
    componentDidMount: function () {
        let t = this;
        chrome.extension.sendRequest({ greeting: "getNowPlayingInfo" }, function (response) {
            if (response.farewell == 'success') {
                let playListNames = response.playListNames;
                nowPlayListName = response.nowPlayListName;
                nowPlayList = response.nowPlayList;
                nowPlaySongIndex = response.nowPlaySongIndex;
                nowPlayState = response.nowPlayState;

                if (nowPlaySongIndex > 0) {
                    nowMusic = nowPlayList[nowPlaySongIndex - 1];
                    t.setState({
                        playListNames: playListNames,
                        nowMusic: nowMusic,
                        nowPlayList: nowPlayList,
                        nowPlayState: nowPlayState,
                        nowPlayListName: nowPlayListName,
                        nowPlaySongIndex: nowPlaySongIndex
                    })
                } else {
                    t.setState({
                        playListNames: playListNames
                    })
                }

                $(function () {
                    window.location.hash = "#flag";
                })

            }
        });
    },
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}, 
                React.createElement(TitleBar, {nowPlayListName: this.state.nowPlayListName}), 
                React.createElement(AllListNames, {onSelectList: this.handleSelectList, playListNames: this.state.playListNames}), 
                React.createElement(PlayList, {handleSelectMusic: this.handleSelectMusic, nowPlayList: this.state.nowPlayList, nowPlaySongIndex: this.state.nowPlaySongIndex}), 
                React.createElement(PlayBar, {handleSelectMusic: this.handleSelectMusic, handleChangePlayState: this.handleChangePlayState, nowMusic: this.state.nowMusic, nowPlayState: this.state.nowPlayState})
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
        let handleSelectMusic = this.props.handleSelectMusic
        let nowPlaySongIndex = this.props.nowPlaySongIndex;
        var nowPlayListNodes = this.props.nowPlayList.map(function (song) {
            return (
                React.createElement(SongItem, {handleSelectMusic: handleSelectMusic, songName: song.name, singer: song.singer, songIndex: song.index, nowPlaySongIndex: nowPlaySongIndex})
            )
        })
        console.log(nowPlayListNodes)
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
    changePlayState: function () {
        if (nowPlayState == 'playing') {
            nowPlayState = 'pause'
        } else {
            nowPlayState = 'playing'
        }
        this.props.handleChangePlayState();
    },
    nextSong: function () {
        if (nowPlaySongIndex < nowPlayList.length) {
            nowPlaySongIndex = nowPlaySongIndex + 1;
        } else {
            nowPlaySongIndex = 1;
        }
        nowPlayState='playing';
        this.props.handleSelectMusic(nowPlaySongIndex);
        playMusic();

    },
    render: function () {
        return (
            React.createElement("nav", {id: "playBarNav", className: "bar bar-tab"}, 
                React.createElement("div", {id: "playingSongName", className: "media-body"}, 
                    this.props.nowMusic.name, 
                    React.createElement("p", null, "  ", this.props.nowMusic.singer, " ")
                ), 
                this.props.nowPlayState == 'playing' ? React.createElement("span", {onClick: this.changePlayState, className: "icon icon-pause"}) : React.createElement("span", {onClick: this.changePlayState, className: "icon icon-play"}), 
                React.createElement("span", {onClick: this.nextSong, className: "icon icon-forward"})
            )
        )
    }
})


var SongItem = React.createClass({displayName: "SongItem",
    handleClick: function () {


        nowPlaySongIndex = this.props.songIndex;
        this.props.handleSelectMusic(nowPlaySongIndex);

        let onSelectSong = {
            songName: this.props.songName,
            songSinger: this.props.singer,
            songIndex: this.props.songIndex
        };
        playMusic();

    },
    render: function () {
        return (
            React.createElement("li", {onClick: this.handleClick, className: "table-view-cell songLi"}, 
                React.createElement("div", {className: "songItem"}, 
                    (this.props.songIndex == this.props.nowPlaySongIndex) ? React.createElement("div", {id: "flag", className: "isPlaying"}) : React.createElement("div", {className: "isnotPlaying"}), 
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
        let listName = this.props.listName;
        nowPlayListName = listName;
        chrome.extension.sendRequest({ greeting: "getSongsByListName", listName: listName }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                nowPlayList = response.songList;
                onSelectList(nowPlayList, listName);
            }
        });
        return;
    },
    render: function () {
        return (
            React.createElement("li", {onClick: this.handleClick, className: "table-view-cell"}, this.props.listName)
        )
    }
})

function playMusic() {
    let playSongInfo = {
        wantPlayListName: nowPlayListName,
        wantPlayListIndex: nowPlaySongIndex
    }
    chrome.extension.sendRequest({ greeting: "play", playSongInfo: playSongInfo })
}

ReactDOM.render(
    React.createElement(MusicBox, null),
    document.getElementById('musicBox')
);

