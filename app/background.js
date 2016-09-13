chrome.webRequest.onCompleted.addListener(
  //callback
  function(details) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {url: details.url}, function(response) {
      });
    });
  },
  // filters
  { urls: [
    "http://games.espn.com/ffl/format/playerpop/*",
    "https://games.espn.com/ffl/format/playerpop/*"
    ]
  },
  //permissions
  ["responseHeaders"]
);
