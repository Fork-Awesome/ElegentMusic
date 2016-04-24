var MusicBox = React.createClass({displayName: "MusicBox",
    render: function () {
        return (
            React.createElement("div", {className: "musicBox"}, 
                React.createElement(TitleBar, null)
            )
        )
    }
});

var TitleBar = React.createClass({displayName: "TitleBar",
    render: function () {
        return (
            React.createElement("header", {class: "bar bar-nav"}, 
                React.createElement("a", {href: "#myPopover"}, 
                    React.createElement("h1", {class: "title"}, 
                        "Tap title", 
                        React.createElement("span", {class: "icon icon-caret"})
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