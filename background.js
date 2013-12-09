console.log('hi');
// chrome.webRequest.onCompleted.addListener(function(details) {
// 	console.log('completed' + details);
// }, {urls: ["http://*/*"]}, ["responseHeaders"]);
chrome.webRequest.onCompleted.addListener(
function(details) {
    //if (details.url.substring(0, 23) == "https://www.google.com/") // I know I do not need this
    //{
        console.info("URL :" + details.url);
        FindData("http://www.altavista.com");
    //}
},
// filters
{
    urls: [
	    "http://games.espn.go.com/ffl/format/playerpop/*",
    ]
},
["responseHeaders"]);

function FindData(str) {
	console.log('im here');
}