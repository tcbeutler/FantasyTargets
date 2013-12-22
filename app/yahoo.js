function addYahooNumber(xhr) {
  var pnum = $('span.team-info', xhr).text().trim().split(',')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function addYahooTargets() {
  var url = 'http://sports.yahoo.com/nfl/teams/' + teams[team] + '/roster';
  //Get player url frmo team page
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var result = $('a[title="' + playerName + '"]', xhr.responseText);
      var playerUrl = 'http://sports.yahoo.com' + result[0].attributes.href.value + '/gamelog';
      addYahooTargetsFromPlayer(playerUrl);
    }
  };
  xhr.send();
}

function addYahooTargetsFromPlayer(playerUrl) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", playerUrl, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var targets = getYahooColumn(xhr.responseText, 'nfl-stat-type-310.targets', 'TGTS');
      var receptions = getYahooColumn(xhr.responseText, 'nfl-stat-type-302.receptions', 'REC');
      var yards = getYahooColumn(xhr.responseText, 'nfl-stat-type-303.yards', 'YDS');
      addTargets(targets, receptions, yards);
      addYahooNumber(xhr.responseText);
    }
  };
  xhr.send();
}

function getYahooColumn(res, colClass, colName) {
  var playerTargets = $('div#mediasportsplayergamelog td.' + colClass, res);
  var results = $.map(
    $(playerTargets, res),
    function(cell) {
      return cell.innerText;
    }).reverse();
  return [colName].concat(results);
}