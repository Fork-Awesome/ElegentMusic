var SongBox = React.createClass({displayName: "SongBox",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Title, null)
            )
        );
    }
});

var Title = React.createClass({displayName: "Title",
    render: function () {
        return (
            React.createElement("div", {id: "title"}

            )
        );
    }
});


ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('container')
);

