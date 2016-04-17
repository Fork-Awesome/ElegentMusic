
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

ReactDOM.render(
    React.createElement(SongList, null),
    document.getElementById('musicList')
);