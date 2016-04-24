var MusicBox = React.createClass({displayName: "MusicBox",
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}
            )
        )
    }
});

var titleBar = React.createClass({displayName: "titleBar",
    render: function () {
        return (
            React.createElement("header", {className: "bar bar-nav"}, 
                React.createElement("a", {href: "#myPopover"}, 
                    React.createElement("h1", {className: "title"}, 
                        "Tap title", 
                        React.createElement("span", {className: "icon icon-caret"})
                    )
                )
            )
        )
    }
});

ReactDOM.render(
    React.createElement(MusicBox, null),
    document.getElementById('musicBox')
);