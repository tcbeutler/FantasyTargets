console.log('hi');
$("body").append('Test');

var pnum;


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://espn.go.com/nfl/player/_/id/15168/case-keenum", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            pnum = $('ul.general-info li.first', xhr.responseText).text().trim().split(' ')[0];
            $('div.player-name').append('<p>' + pnum + '</p>');
          console.log('SUP ' + pnum + ' SON');
      }
    };
    xhr.send();
    console.log('end of  listener');
  });