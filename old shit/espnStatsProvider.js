//ESPN specific data source functionality.
var espnStatsProvider = function(playerId) {

  return (function(playerId) {

    function addNumber(xhr) {
      var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
      $('div.player-name').append('<p>' + pnum + '</p>');
    }

    var getStats = function() {
      var stats = Q.defer();
      getDataForPlayer(playerId).done(function(data) {
        stats.resolve({
          targets: extractColumn(data, 'TGTS'),
          receptions: extractColumn(data, 'REC'),
          yards: extractColumn(data, 'YDS'),
        });
      });
      return stats.promise;
    };

    function getDataForPlayer(playerId) {
      var data = Q.defer();
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          addNumber(xhr.responseText);
          data.resolve(xhr.responseText);
        }
      };
      xhr.send();
      return data.promise;
    }

    function extractColumn(res, colName) {
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

    return {
      getStats: getStats,
      print: print
    };

  }(playerId));
};