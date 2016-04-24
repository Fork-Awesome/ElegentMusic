

var MyReactBootstrapButton = React.createClass({displayName: "MyReactBootstrapButton",
    render: function () {

        var ButtonGroup = ReactBootstrap.ButtonGroup,
            Button = ReactBootstrap.Button;

        return (React.createElement("div", null, 
            React.createElement(ButtonGroup, null, 
                React.createElement(Button, {bsStyle: "primary"}, "Left"), 
                React.createElement(Button, null, "Middle"), 
                React.createElement(Button, null, "Right")
            )
        ));
    }
});

React.render(React.createElement(MyReactBootstrapButton, null), document.getElementById("container"));
// ReactDOM.render(
//     <SongBox />,
//     document.getElementById('container')
// );