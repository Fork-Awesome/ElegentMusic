
var songs = chrome.storage.sync.get(null, function(songs) {
    for (song in songs) {
       console.log(typeof(song));
    }
});

console.log(typeof(songs));

var SongList = React.createClass({displayName: "SongList",
    render: function() {
        this.props.data.map(function(song) {
            return (
                React.createElement("div", {className: "SongList"}, 
                    "i'm songbox", 
                    React.createElement(SongInfo, {songName: song.name, songSinger: song.singer})
                )
            );
        })

    }
});

var SongInfo = React.createClass({displayName: "SongInfo",
    render: function() {
        return (
            React.createElement("div", {className: "SongInfo"}, 
                React.createElement("h3", {clasName: "SongName"}, 
                    this.props.songName
                ), 
                this.props.songSinger
            )
        );
    }
});

ReactDOM.render(
    React.createElement(SongList, {data: songs}),
    document.getElementById('musicList')
);