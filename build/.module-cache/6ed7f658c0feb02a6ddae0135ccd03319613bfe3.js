var MusicBox = React.createClass({displayName: "MusicBox",
    render: function () {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement(TitleBar, null), 
                React.createElement(PlayBar, null)
            )
        )
    }
});

var TitleBar = React.createClass({displayName: "TitleBar",
    render: function () {
        return (
            React.createElement("div", {className: "titleBar"}, 
                React.createElement("div", {id: "backList"}, 
                    React.createElement("a", {href: "#"}, React.createElement("img", {src: "/images/back.png"}))
                ), 
                React.createElement("p", {id: "listName"}, "优雅音乐")
            )
        )
    }
});

var PlayBar = React.createClass({displayName: "PlayBar",
    render: function () {
        return (
            React.createElement("div", {className: "playBar"}, 
                "playBar"
            )
        )
    }
});

ReactDOM.render(
    React.createElement(MusicBox, null),
    document.getElementById('container')
);