// var i=0;
// var ss =setInterval(function() {
//     console.log(i);
//     i++;
// }
// ,1000);

function sayHi(info,tab) {
    console.log(info.pageUrl);
    console.log(tab.id);
 
    
    if(info.pageUrl.search('music.163.com')!=-1){
        console.log("开始查找163");
        chrome.tabs.executeScript(
            tab.id,
         {file: "js/jquery.js"},function () {
             console.log("done");
         }
         );
        chrome.tabs.executeScript(
            tab.id,
         {file: "js/neteaseMusic.js"},function () {
             console.log("done");
         }
         );
    
    }
}
//     chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript(null,
//                            {code:"$('#g-topbar > div.m-top')"});
// });


chrome.contextMenus.create({
    "title":"查找音乐",
    "onclick":sayHi
},function() {
     if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
}
});