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

var PlayLists = React.createClass({displayName: "PlayLists",
    render: function () {
        return (
            React.createElement("div", {id: "myPopover", className: "popover"}, 
                React.createElement("header", {className: "bar bar-nav"}, 
                    React.createElement("h1", {className: "title"}, "Popover title")
                ), 
                React.createElement("ul", {className: "table-view"}, 
                    React.createElement("li", {className: "table-view-cell"}, "Item2"), 
                    React.createElement("li", {className: "table-view-cell"}, "Item3"), 
                    React.createElement("li", {className: "table-view-cell"}, "Item4")
                   
                )
            )
        )
    }
})

ReactDOM.render(
    React.createElement(MusicBox, null),
    document.getElementById('musicBox')
);