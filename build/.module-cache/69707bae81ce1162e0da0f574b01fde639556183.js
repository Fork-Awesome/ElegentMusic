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
            React.createElement("div", {id: "title"}, 
                React.createElement("p", null, "优雅音乐"), 
                React.createElement("select", null, 
                    React.createElement("option", {value: "volvo"}, "Volvo"), 
                    React.createElement("option", {value: "saab"}, "Saab"), 
                    React.createElement("option", {value: "opel"}, "Opel"), 
                    React.createElement("option", {value: "audi"}, "Audi")
                )
            )
        );
    }
});


ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('container')
);

