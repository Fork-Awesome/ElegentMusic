
var songs = chrome.storage.sync.get(null, function(songs) {
    // for (song in songs) {
        
    // }
});

var SongBox=React.createClass({displayName: "SongBox",
   render:function () {
       return(
         React.createElement("div", {className: "SongBox"}, 
            "i'm songbox"
         )  
       );
   } 
});

ReactDOM.render(
    
    document.getElementById('musicList')
);