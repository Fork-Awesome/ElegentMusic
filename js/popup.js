function my_clock(el){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m=m>=10?m:('0'+m);
    s=s>=10?s:('0'+s);
    el.innerHTML = h+":"+m+":"+s;
    setTimeout(function(){my_clock(el)}, 1000);
}

//var clock_div = document.getElementById('clock_div');
var clock_div = $("#clock_div")[0];
my_clock(clock_div);
$("#musicList").append($('<p>hhh</p>'));
//chrome.storage.sync.clear(function(){});
//chrome.storage.sync.set({"fuck":"cao"},function(){});
chrome.storage.sync.get(null, function(songs) {
  for(song in songs){
      
  }
});
