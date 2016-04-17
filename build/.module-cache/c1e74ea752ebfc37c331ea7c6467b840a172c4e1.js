
var songs = chrome.storage.sync.get(null, function(songs) {
    // for (song in songs) {
        
    // }
});

var SongList=React.createClass({displayName: "SongList",
   render:function () {
       return(
         React.createElement("div", {className: "SongList"}, 
            "i'm songbox", 
            React.createElement(SongInfo, {songName: "红豆", songSinger: "王菲"})
         )  
       );
   } 
});

var SongInfo=React.createClass({displayName: "SongInfo",
   render:function () {
       return(
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
    React.createElement(SongList, null),
    document.getElementById('musicList')
);