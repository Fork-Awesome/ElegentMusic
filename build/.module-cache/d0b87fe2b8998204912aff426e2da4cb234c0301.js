var SongBox = React.createClass({displayName: "SongBox",
    render: function () {
        return (
            React.createElement("div", null, 
                  React.createElement("button", {className: "btn btn-default"}, "click me"), 
                React.createElement(SongList, {data: this.state.data})
            )
        );
    }
});

var Title=React.createClass({displayName: "Title",
   render:function () {
       return(
         React.createElement("div", {className: "playBar"}
          
         )  
       );
   } 
});


ReactDOM.render(
    React.createElement(SongBox, null),
    document.getElementById('container')
);

