//清空sync存储
function clearList() {
    chrome.storage.sync.clear(function() {
        console.log('sync以清空');
    });
};


var SongBox = React.createClass({
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount: function() {

        var songBox = this;
        var songs = [];
        chrome.extension.sendRequest({ greeting: "getPlayList" }, function(response) {
            console.log(response.songs);
            songBox.setState({ data: response.songs });
        });

    },
    render: function() {
        return (
            <SongList data={this.state.data} />
        );
    }
});


var SongList = React.createClass({

    render: function() {
        var songNodes = this.props.data.map(function(song) {
            return (
                <SongInfo  songFrom={song.from} songId={song.id} songName={song.name} songSinger={song.singer} />
            );
        });
        console.log(songNodes);
        if (songNodes == null || songNodes == undefined || songNodes.length == 0) {
            songNodes = "列表空,请打开歌单页面右键添加歌曲";
        }
        return (
            <div>
                {songNodes}
            </div>
        );
    }
});

var SongInfo = React.createClass({
    playMusic: function(songFrom, songId) {
        chrome.extension.sendRequest({ greeting: "play", from: songFrom, id: songId }, function(response) {
            console.log("播放成功");
        });
    },
    render: function() {
        return (
            <div  onClick={this.playMusic.bind(this, this.props.songFrom, this.props.songId) }  id={this.props.songId} className='SongInfo'>
                <h4 clasName="SongName">
                    {this.props.songName}
                </h4>
                {this.props.songSinger}
            </div>
        );
    }
});

 

ReactDOM.render(
    <SongBox />,
    document.getElementById('musicList')
);

