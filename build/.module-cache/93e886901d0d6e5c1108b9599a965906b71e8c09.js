var MusicBox=React.createClass({displayName: "MusicBox",
    render:function () {
       return(
           React.createElement("div", {className: "container"}, 
            React.createElement(TitleBar, null), 
            React.createElement(PlayBar, null)
           )
       ) 
    }
})

var TitleBar=React.createClass({displayName: "TitleBar",
    render:function () {
        React.createElement("div", {className: "titleBar"}, 
            React.createElement("p", {href: "#"}, "返回 "), 
            React.createElement("p", null, "优雅音乐")
        )
    }
})

React.render(
    React.createElement(MusicBox, null),
    document.getElementById('container')
);