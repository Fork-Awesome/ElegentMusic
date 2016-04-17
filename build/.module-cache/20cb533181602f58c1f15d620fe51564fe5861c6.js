//清空sync存储
function clearList(){
    chrome.storage.sync.clear(function(){
        console.log('sync以清空');
    });
};



var SongBox = React.createClass({displayName: "SongBox",
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount: function() {
        var z = this;
        chrome.storage.sync.get(null, function(songs) {
            s = []
            for (song in songs) {  
                 s.push(songs[song]);
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
            return (
                React.createElement(SongInfo, {songFrom: song.from, songId: song.id, songName: song.name, songSinger: song.singer})
            );
        });
        if (songNodes == null || songNodes ==undefined) {
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
    playMusic:function (songId) {
      console.log(songId);  
    },
    render: function() {
        return (
            React.createElement("div", {onClick: this.playMusic.bind(this,this.props.songFrom,this.props.songId), id: this.props.songId, className: "SongInfo"}, 
                React.createElement("h3", {clasName: "SongName"}, 
                    this.props.songName
                ), 
                this.props.songSinger
            )
        );
    }
});


ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('musicList')
);

function playMusic(id) {
    id.innerHTML='hello!';
    console.log("播放音乐");
}