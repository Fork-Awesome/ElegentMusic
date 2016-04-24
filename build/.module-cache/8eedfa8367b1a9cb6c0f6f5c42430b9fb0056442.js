var MusicBox = React.createClass({displayName: "MusicBox",
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}, 
                React.createElement(TitleBar, null), 
                React.createElement(PlayLists, {playList: this.props.playList}), 
                React.createElement(SongsList, null), 
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
        return (
            React.createElement("div", {id: "myPopover", className: "popover"}, 
                React.createElement("header", {className: "bar bar-nav"}, 
                    React.createElement("h1", {className: "title"}, "歌单")
                ), 
                React.createElement("ul", {className: "table-view"}

                )
            )
        )
    }
})

var SongsList = React.createClass({displayName: "SongsList",
    render: function () {
        return (
            React.createElement("div", {className: "content"}, 
                React.createElement("ul", {className: "table-view"}, 
                    React.createElement(SongItem, null)
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

var PlayListItem;
var SongItem = React.createClass({displayName: "SongItem",
    render: function () {
        return (
            React.createElement("li", {className: "table-view-cell songLi"}, 
                React.createElement("div", {className: "songItem"}, 
                    React.createElement("div", {className: "isPlaying"}), 
                    React.createElement("div", {className: "nameItem"}, 
                        "不浪漫罪名", 
                        React.createElement("p", null, " 王杰 ")
                    )
                )
            )
        )
    }
})

var ListItem = React.createClass({displayName: "ListItem",
    render: function () {
        return (
            React.createElement("li", {className: "table-view-cell"}, "Item2")
        )
    }
})
var nowMusic={
    nowListName:'跑步音乐',
    nowPlayingSongName:'hello world',
    nowPlayingSongSinger:'hhh',
    nowPlayingState:'playing'
}
var playList=[
    'list1',
    'list2',
    'list3'
]
ReactDOM.render(
    React.createElement(MusicBox, {nowMusic: nowMusic, playList: playList}),
    document.getElementById('musicBox')
);