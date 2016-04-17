
// var songs;
// chrome.storage.sync.get(null, function(songs) {
//     console.log(songs);
//     songs = this.songs;


// });

var SongList = React.createClass({displayName: "SongList",
    getInitialState: function() {
        return { songs: [] };
    },
    render: function() {
        this.props.songs.map(function(song) {
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

ReactDOM.render(
    React.createElement(SongList, {data: songs}),
    document.getElementById('musicList')
);