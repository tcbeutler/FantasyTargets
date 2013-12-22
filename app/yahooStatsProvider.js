//Yahoo specific data source functionality.
var yahooStatsProvider = function(team, playerName) {

  return (function(team, playerName) {

    var addNumber = function(res) {
      var pnum = $('span.team-info', res).text().trim().split(',')[0];
      $('div.player-name').append('<p>' + pnum + '</p>');
    };

    var getStats = function() {
      var stats = Q.defer();
      getPlayerFromTeam().done(function(url) {
        getDataForPlayer(url).done(function(data) {
          stats.resolve({
            targets: extractColumn(data, 'nfl-stat-type-310.targets', 'TGTS'),
            receptions: extractColumn(data, 'nfl-stat-type-302.receptions', 'REC'),
            yards: extractColumn(data, 'nfl-stat-type-303.yards', 'YDS'),
          });
        });
      });
      return stats.promise;
    };

    var getPlayerFromTeam = function() {
      var playerPage = Q.defer();
      var url = 'http://sports.yahoo.com/nfl/teams/' + teams[team] + '/roster';
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var result = $('a[title="' + playerName + '"]', xhr.responseText);
          playerPage.resolve('http://sports.yahoo.com' + result[0].attributes.href.value + '/gamelog');
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
    };

  }(team, playerName));

};