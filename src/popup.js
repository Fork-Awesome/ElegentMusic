var nowPlayListName = '优雅音乐'
var nowPlayList;
var nowPlayState = ''
var nowPlaySongIndex = 0;
var MusicBox = React.createClass({
    handleChangePlayState: function () {
        console.log(nowPlayState)
        this.setState({
            nowPlayState: nowPlayState
        })
        chrome.extension.sendRequest({ greeting: "changeState" });
    },
    handleSelectList: function (nowPlayList, listName) {

        this.setState({
            nowPlayList: nowPlayList,
            nowPlaySongIndex: 0,
            nowPlayListName: listName,
        })
        
        $('#musicBox > div > div.backdrop').click();
    },
    handleSelectMusic: function (nowPlaySongIndex) {
        nowMusic = nowPlayList[nowPlaySongIndex - 1];
        this.setState({
            nowMusic: nowMusic,
            nowPlaySongIndex: nowPlaySongIndex,
            nowPlayState: nowPlayState
        })
    },
    getInitialState: function () {
        return {

            nowPlayListName: '优雅音乐',
            nowPlayList: [],
            playListNames: [],
            nowMusic: {},
            nowPlaySongIndex: 0
        }
    },
    componentDidMount: function () {
        let t = this;
        chrome.extension.sendRequest({ greeting: "getNowPlayingInfo" }, function (response) {
            if (response.farewell == 'success') {
                let playListNames = response.playListNames;
                nowPlayListName = response.nowPlayListName;
                nowPlayList = response.nowPlayList;
                nowPlaySongIndex = response.nowPlaySongIndex;
                nowPlayState = response.nowPlayState;

                if (nowPlaySongIndex > 0) {
                    nowMusic = nowPlayList[nowPlaySongIndex - 1];
                    t.setState({
                        playListNames: playListNames,
                        nowMusic: nowMusic,
                        nowPlayList: nowPlayList,
                        nowPlayState: nowPlayState,
                        nowPlayListName: nowPlayListName,
                        nowPlaySongIndex: nowPlaySongIndex
                    })
                } else {
                    t.setState({
                        playListNames: playListNames
                    })
                }

                $(function () {
                    window.location.hash = "#flag";
                })

            }
        });
    },
    render: function () {
        return (
            <div className='musicBox'>
                <TitleBar nowPlayListName={this.state.nowPlayListName} />
                <AllListNames onSelectList={this.handleSelectList} playListNames={this.state.playListNames}  />
                <PlayList handleSelectMusic={this.handleSelectMusic} nowPlayList={this.state.nowPlayList} nowPlaySongIndex={this.state.nowPlaySongIndex}/>
                <PlayBar handleSelectMusic={this.handleSelectMusic} handleChangePlayState={this.handleChangePlayState} nowMusic={this.state.nowMusic} nowPlayState={this.state.nowPlayState}/>
            </div>
        )
    }
});

var TitleBar = React.createClass({
    render: function () {
        return (
            <header className='bar bar-nav'>
                <a href="#myPopover">
                    <h1 className="title">
                        {this.props.nowPlayListName}
                        <span className="icon icon-caret"></span>
                    </h1>
                </a>
            </header>
        )
    }
});

var AllListNames = React.createClass({
    render: function () {
        var onSelectList = this.props.onSelectList;
        var AllListNamesNodes = this.props.playListNames.map(function (list) {
            return (
                <ListItem onSelectList={onSelectList} listName={list}/>
            )
        })

        return (
            <div  id="myPopover" className="popover">
                <header className="bar bar-nav">
                    <h1 className="title">歌单</h1>
                </header>
                <ul className="table-view">
                    {AllListNamesNodes}
                </ul>
            </div>
        )
    }
})

var PlayList = React.createClass({
    render: function () {
        let handleSelectMusic = this.props.handleSelectMusic
        let nowPlaySongIndex = this.props.nowPlaySongIndex;
        var nowPlayListNodes = this.props.nowPlayList.map(function (song) {
            return (
                <SongItem handleSelectMusic={handleSelectMusic} songName={song.name} singer={song.singer} songIndex={song.index} nowPlaySongIndex={nowPlaySongIndex}/>
            )
        })
        return (
            <div className="content">
                <ul className="table-view">
                    {nowPlayListNodes}
                    <li><br/></li>
                    <li><br/></li>
                </ul>
            </div>
        )
    }
})

var PlayBar = React.createClass({
    changePlayState: function () {
        if (nowPlayState == 'playing') {
            nowPlayState = 'pause'
        } else {
            nowPlayState = 'playing'
        }
        this.props.handleChangePlayState();
    },
    nextSong: function () {
        if (nowPlaySongIndex < nowPlayList.length) {
            nowPlaySongIndex = nowPlaySongIndex + 1;
        } else {
            nowPlaySongIndex = 1;
        }
        nowPlayState='playing';
        this.props.handleSelectMusic(nowPlaySongIndex);
        playMusic();

    },
    render: function () {
        return (
            <nav id='playBarNav' className="bar bar-tab">
                <div id='playingSongName' className="media-body">
                    {this.props.nowMusic.name}
                    <p>  {this.props.nowMusic.singer} </p>
                </div>
                {this.props.nowPlayState == 'playing' ? <span onClick={this.changePlayState } className="icon icon-pause"></span> : <span onClick={this.changePlayState }  className="icon icon-play"></span>}
                <span onClick={this.nextSong } className="icon icon-forward"></span>
            </nav>
        )
    }
})


var SongItem = React.createClass({
    handleClick: function () {


        nowPlaySongIndex = this.props.songIndex;
        this.props.handleSelectMusic(nowPlaySongIndex);

        let onSelectSong = {
            songName: this.props.songName,
            songSinger: this.props.singer,
            songIndex: this.props.songIndex
        };
        playMusic();

    },
    render: function () {
        return (
            <li onClick={this.handleClick } className="table-view-cell songLi">
                <div className='songItem'>
                    {(this.props.songIndex == this.props.nowPlaySongIndex) ? <div id='flag' className='isPlaying'></div> : <div className='isnotPlaying'></div>}
                    <div className='nameItem'>
                        {this.props.songName}
                        <p> {this.props.singer} </p>
                        <p className='hide'> {this.props.songIndex} </p>
                    </div>
                </div>
            </li>
        )
    }
})

var ListItem = React.createClass({
    handleClick: function () {
        let onSelectList = this.props.onSelectList;
        let listName = this.props.listName;
        nowPlayListName = listName;
        chrome.extension.sendRequest({ greeting: "getSongsByListName", listName: listName }, function (response) {
            console.log(response.farewell);
            if (response.farewell == 'success') {
                nowPlayList = response.songList;
                onSelectList(nowPlayList, listName);
            }
        });
        return;
    },
    render: function () {
        return (
            <li onClick={this.handleClick } className="table-view-cell">{this.props.listName}</li>
        )
    }
})

function playMusic() {
    let playSongInfo = {
        wantPlayListName: nowPlayListName,
        wantPlayListIndex: nowPlaySongIndex
    }
    chrome.extension.sendRequest({ greeting: "play", playSongInfo: playSongInfo })
}

ReactDOM.render(
    <MusicBox />,
    document.getElementById('musicBox')
);

