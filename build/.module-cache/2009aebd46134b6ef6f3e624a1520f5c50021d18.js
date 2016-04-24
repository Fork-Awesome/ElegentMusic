//清空sync存储
function clearList() {
    chrome.storage.sync.clear(function () {
        console.log('sync以清空');
    });
};


var SongBox = React.createClass({displayName: "SongBox",
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {

        // var songBox = this;
        // var songs = [];
        // chrome.extension.sendRequest({ greeting: "getPlayList", }, function (response) {
        //     console.log(response.songs);
        //     songBox.setState({ data: response.songs });
        // });

    },
    render: function () {
        return (
            React.createElement("div", null, 
                  React.createElement("button", null, "click me"), 
                React.createElement(SongList, {data: this.state.data})
            )
        );
    }
});


var SongList = React.createClass({displayName: "SongList",

    render: function () {
        var songNodes = this.props.data.map(function (song) {
            return (
                React.createElement(SongInfo, {songFrom: song.from, songId: song.id, songName: song.name, songSinger: song.singer})
            );
        });
        console.log(songNodes);
        if (songNodes == null || songNodes == undefined || songNodes.length == 0) {
            songNodes = "咦,这个列表怎么是空的";
        }
        return (
            React.createElement("div", null, 
                songNodes
            )
        );
    }
});

var SongInfo = React.createClass({displayName: "SongInfo",
    playMusic: function (songFrom, songId) {
        chrome.extension.sendRequest({ greeting: "play", from: songFrom, id: songId }, function (response) {
            console.log("播放成功");
        });
    },
    render: function () {
        return (
            React.createElement("div", {onClick: this.playMusic.bind(this, this.props.songFrom, this.props.songId), id: this.props.songId, className: "SongInfo"}, 
                React.createElement("h4", {clasName: "SongName"}, 
                    this.props.songName
                ), 
                this.props.songSinger
            )

        );
    }
});



ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('playList')
);

