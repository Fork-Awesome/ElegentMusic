
var songs = chrome.storage.sync.get(null, function(songs) {
    // for (song in songs) {
        
    // }
});

var SongList=React.createClass({displayName: "SongList",
   render:function () {
       return(
         React.createElement("div", {className: "SongList"}, 
            "i'm songbox"
         )  
       );
   } 
});

var SongInfo=React.createClass({displayName: "SongInfo",
   render:function () {
       return(
           React.createElement("div", {className: "SongInfo"}, 
            "i'm songinfo"
           )
       );
   } 
});

ReactDOM.render(
    React.createElement(SongList, null),
    document.getElementById('musicList')
);