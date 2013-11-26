//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

//chrome.webRequest.onCompleted.addListener(
//    function(details) {
//        console.log('completed')
//        console.log(details)
//
//        var xhr = new XMLHttpRequest();
//        xhr.open("GET", 'http://espn.go.com/nfl/player/gamelog/_/id/13934/antonio-brown', true);
//        xhr.onreadystatechange = function() {
//            if (xhr.readyState == 4)  {
//                console.log($("div .mod-content table", xhr.responseText)[1]);
//            }
//        };
//        xhr.send();
//
//    }, {
//        urls: ["http://games.espn.go.com/ffl/format/playerpop/*"]
//    }, []);
//
//chrome.tabs.getSelected(null, function(tab) {
//
//    // Now inject a script onto the page
//    chrome.tabs.executeScript(tab.id, {
//        code: "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { console.log('success'); });"
//    }, function() { console.log('done'); });
//
//});