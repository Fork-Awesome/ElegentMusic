
// var songs;
// chrome.storage.sync.get(null, function(songs) {
//     console.log(songs);
//     songs = this.songs;


// });

var SongBox =React.createClass({displayName: "SongBox",
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount:function () {
        var z =this;
        chrome.storage.sync.get(null, function(songs) {
            console.log(songs);
            s=[]
            for(song in songs){
                console.log(songs.get(song));
                s.push(song);
            }
            z.setState({data: s});
        });
    },
    render:function () {
        return(
            React.createElement(SongList, {data: this.state.data})
        );
    }
});


var SongList = React.createClass({displayName: "SongList",
    
    render: function() {
        var songNodes =this.props.data.map(function(song) {
            return (
                React.createElement("div", {className: "SongList"}, 
                    "i'm songbox", 
                    React.createElement(SongInfo, {songName: song.name, songSinger: song.singer})
                )
            );
        });
        
        return(
          React.createElement("p", null, "列表为空")
        );
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
    React.createElement(SongBox, null),
    document.getElementById('musicList')
);

