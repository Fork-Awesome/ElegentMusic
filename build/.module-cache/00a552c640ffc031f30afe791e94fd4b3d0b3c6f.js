var buttonGroupInstance = (
  React.createElement(ButtonGroup, null, 
    React.createElement(DropdownButton, {bsStyle: "success", title: "Dropdown"}, 
      React.createElement(MenuItem, {key: "1"}, "Dropdown link"), 
      React.createElement(MenuItem, {key: "2"}, "Dropdown link")
    ), 
    React.createElement(Button, {bsStyle: "info"}, "Middle"), 
    React.createElement(Button, {bsStyle: "info"}, "Right")
  )
);

ReactDOM.render(buttonGroupInstance, document.getElementById('container'));
// ReactDOM.render(
//     <SongBox />,
//     document.getElementById('container')
// );