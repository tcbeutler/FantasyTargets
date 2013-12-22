var teams = { 'FA': '', 'Arizona Cardinals': 'ari', 'Atlanta Falcons': 'atl', 'Baltimore Ravens ': 'bal', 'Buffalo Bills': 'buf', 'Carolina Panthers': 'car', 'Chicago Bears': 'chi', 'Cincinnati Bengals': 'cin', 'Cleveland Browns': 'cle', 'Dallas Cowboys': 'dal', 'Denver Broncos': 'den', 'Detroit Lions': 'det', 'Green Bay Packers': 'gnb', 'Houston Texans': 'hou', 'Indianapolis Colts': 'ind', 'Jacksonville Jaguars': 'jac', 'Kansas City Chiefs': 'kan', 'Miami Dolphins': 'mia', 'Minnesota Vikings': 'min', 'New England Patriots': 'nwe', 'New Orleans Saints': 'nor', 'New York Giants': 'nyg', 'New York Jets': 'nyj', 'Oakland Raiders': 'oak', 'Philadelphia Eagles': 'phi', 'Pittsburgh Steelers': 'pit', 'San Diego Chargers': 'sdg', 'Seattle Seahawks': 'sea', 'San Francisco 49ers': 'sfo', 'St. Louis Rams': 'stl', 'Tampa Bay Buccaneers': 'tam', 'Tennessee Titans': 'ten', 'Washington Redskins': 'was' };

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var team = $('span[title="Team"]').text();
    var playerName = $('div.player-name').text();
    var playerId = request.url.match(/playerId=(\d+)&/)[1];
    var position = $('span[title="Position Eligibility"').text().split(' ')[1];

    if(position === 'RB') {
      addYahooTargets(playerName, team);
      return;
    }
    else {
      addEspnTargets(playerId);
    }
  });

function addEspnTargets(playerId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var targets = getEspnColumn(xhr.responseText, 'TGTS');
        var receptions = getEspnColumn(xhr.responseText, 'REC');
        var yards = getEspnColumn(xhr.responseText, 'YDS');
        console.log('hello');
        addTargets(targets, receptions, yards);
        addEspnNumber(xhr.responseText);
      }
  };
  xhr.send();
}

function addYahooTargets(playerName, team) {
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

function getEspnColumn(res, colName) {
  var headerVals = $.map(
    $("div.mod-player-stats div.mod-content table tbody tr.colhead td", res),
    function(val) { return val.innerText; });
  var index = headerVals.indexOf(colName);
  if (index < 0) return;

  var values = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, .oddrow, .evenrow', res),
    function(row) {
      return row.cells[index].innerText;
    });

  return values;
}

function addTargets(targets, receptions, yards) {
  if(!targets)
    return;

  var newTargets = adjustForMissingWeeks(targets, yards, receptions);
  injectCells(2, newTargets);  
}

function addEspnNumber(xhr) {
  var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function addYahooNumber(xhr) {
  var pnum = $('span.team-info', xhr).text().trim().split(',')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function injectCells(index, values) {
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  for (var i = 0; i < tableRows.length; i++) {

    var newCell = tableRows[i].insertCell(index);
    newCell.setAttribute('width', 100);
    newCell.setAttribute('align', 'right');
    //Set class
    if (i === 0)
      newCell.setAttribute('class', 'pcTanRight');
    else
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');
    newCell.innerText = values[i] || '';
  }
}

function cellsEqual(row, cellIndexArray, value) {
  for (var i = 0; i < cellIndexArray.length; i++) {
    if (row.cells[cellIndexArray[i]].innerText !== value)
      return false;
  }
  return true;
}

function adjustForMissingWeeks(targets, yards, receptions) {
  //Fill in blanks for missing games, byes. etc
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  var newTargets = [];
  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {
    if (cellsEqual(tableRows[i], [1], 'BYE')) {
      newTargets.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '-')) {
     newTargets.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '0') && receptions[iter] !== '0' && yards[iter] !== '0') {
     newTargets.push('0');
    }
    else {
      newTargets.push(targets[iter] || '');
      iter++;
    }
  }  
  return newTargets;
  
}
