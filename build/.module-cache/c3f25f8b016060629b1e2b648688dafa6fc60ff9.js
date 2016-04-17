
// var songs;
// chrome.storage.sync.get(null, function(songs) {
//     console.log(songs);
//     songs = this.songs;


// });

function clearList(){
    chrome.storage.sync.clear(function(){});
};

var SongBox = React.createClass({displayName: "SongBox",
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount: function() {
        var z = this;
        chrome.storage.sync.get(null, function(songs) {
            //console.log(songs);

            s = []
            for (song in songs) { 
                console.log(songs[song]);
                console.log(songs[song].name+songs[song].available);
                if (songs[song].available) {//如果歌曲可用
                    s.push(songs[song]);
                } else {
                    s.push(songs[song].substitute);
                }

            }
            z.setState({ data: s });
        });
    },
    render: function() {
        return (
            React.createElement(SongList, {data: this.state.data})
        );
    }
});


var SongList = React.createClass({displayName: "SongList",

    render: function() {
        var songNodes = this.props.data.map(function(song) {

            attrFrom = song.from;
            return (
                React.createElement(SongInfo, {songFrom: song.from, songId: song.id, songName: song.name, songSinger: song.singer})

            );
        });

        if (songNodes == null) {
            songNodes = "列表空,请打开歌单页面右键添加歌曲";
        }
        return (
            React.createElement("div", null, 
                songNodes
            )
        );
    }
});

var SongInfo = React.createClass({displayName: "SongInfo",
    render: function() {
        return (
            React.createElement("div", {onclick: "playMusic", id: this.props.songId, className: "SongInfo"}, 
                React.createElement("h3", {clasName: "SongName"}, 
                    this.props.songName
                ), 
                this.props.songSinger, 
                React.createElement("p", {className: "songFrom"}, this.props.songFrom)
            )
        );
    }
});


ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('musicList')
);

