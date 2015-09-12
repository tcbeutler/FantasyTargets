//Yahoo specific data source functionality.
var yahooStatsProvider = function(team, playerName) {
  var teams = { 'FA': '', 'Arizona Cardinals': 'ari', 'Atlanta Falcons': 'atl', 'Baltimore Ravens ': 'bal', 'Buffalo Bills': 'buf', 'Carolina Panthers': 'car', 'Chicago Bears': 'chi', 'Cincinnati Bengals': 'cin', 'Cleveland Browns': 'cle', 'Dallas Cowboys': 'dal', 'Denver Broncos': 'den', 'Detroit Lions': 'det', 'Green Bay Packers': 'gnb', 'Houston Texans': 'hou', 'Indianapolis Colts': 'ind', 'Jacksonville Jaguars': 'jac', 'Kansas City Chiefs': 'kan', 'Miami Dolphins': 'mia', 'Minnesota Vikings': 'min', 'New England Patriots': 'nwe', 'New Orleans Saints': 'nor', 'New York Giants': 'nyg', 'New York Jets': 'nyj', 'Oakland Raiders': 'oak', 'Philadelphia Eagles': 'phi', 'Pittsburgh Steelers': 'pit', 'San Diego Chargers': 'sdg', 'Seattle Seahawks': 'sea', 'San Francisco 49ers': 'sfo', 'St. Louis Rams': 'stl', 'Tampa Bay Buccaneers': 'tam', 'Tennessee Titans': 'ten', 'Washington Redskins': 'was' };


  return (function(team, playerName) {
    var Q = require('q');
    var $ = require('jquery');

    var addNumber = function(res) {
      var pnum = $('span.team-info', res).text().trim().split(',')[0];
      $('div.player-name').append('<p>' + pnum + '</p>');
    };

    var getStats = function() {
      var stats = Q.defer();
      getPlayerFromTeam().then(function(url) {
        getDataForPlayer(url).then(function(data) {
          stats.resolve({
            targets: extractColumn(data, 'nfl-stat-type-310.targets', 'YAH'),
            receptions: extractColumn(data, 'nfl-stat-type-302.receptions', 'REC'),
            yards: extractColumn(data, 'nfl-stat-type-303.yards', 'YDS'),
          });
        });
      });
      return stats.promise
    };

    var getPlayerFromTeam = function() {
      var playerPage = Q.defer();
      var url = 'http://sports.yahoo.com/nfl/teams/' + teams[team] + '/roster';
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var result = $('a[title="' + playerName + '"]', xhr.responseText);
          playerPage.resolve(result[0].attributes.href.value + '/gamelog');
        }
      };
      xhr.send();
      return playerPage.promise;
    };

    var getDataForPlayer = function(playerUrl) {
      var data = Q.defer();
      var xhr = new XMLHttpRequest();
      xhr.open("GET", playerUrl, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          addNumber(xhr.responseText);
          data.resolve(xhr.responseText);
        }
      };
      xhr.send();
      return data.promise;
    };

    var extractColumn = function(res, colClass, colName) {
      var playerTargets = $('div#mediasportsplayergamelog td.' + colClass, res);
      var results = $.map(
        $(playerTargets, res),
        function(cell) {
          return cell.innerText;
        }).reverse();
      return [colName].concat(results);
    };

    return {
      getStats: getStats,
      name: 'yahoo'
    };

  }(team, playerName));

};