//ESPN specific data source functionality.
provide('EspnStatsProvider', function(playerId) {
  var $ = require('jquery');
  var Q = require('q');
  var scheduleUtils = require('NflScheduleUtils')();

  var nflYear = scheduleUtils.currentSeasonYear();
  var playerStatsPageRequest = Q($.ajax('http://www.espn.com/nfl/player/gamelog/_/id/' + playerId + '/year/' + nflYear));

  function parseTargets(gamelogHtml) {
    var targets = getColumn(gamelogHtml, 'Receiving Targets');
    var receptions = getColumn(gamelogHtml, 'Total receptions');
    var yards = getColumn(gamelogHtml, 'Total receiving yards');
    
    if(!targets)
      throw new Error('No targets for player');

    // Fill in blanks for missing games, byes. etc
    var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr').not('.pcStatHead');
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

  function getColumn(gamelogHtml, colName) {
    var headerVals = $.map(
      $("div.mod-player-stats div.mod-content table tbody tr.colhead td", gamelogHtml),
      function(val) { 
          var t = val.getAttribute('title');
          if (!t) {
              t = '';
          }
          return t;
      });
    
    var index = headerVals.indexOf(colName);
    if (index < 0) return;

    var values = $.map(
      $('div.mod-player-stats div.mod-content table tbody tr[class*="team"]', gamelogHtml),
      function(row) {
        return row.cells[index].innerText;
      });

    return values;
  }

  function cellsEqual(row, cellIndexArray, value) {
    for (var i = 0; i < cellIndexArray.length; i++) {
      if (row.cells[cellIndexArray[i]].innerText !== value)
        return false;
    }
    return true;
  }

  function addNumber(gamelogHtml) {
    var pnum = $('ul.general-info li.first', gamelogHtml).text().trim().split(' ')[0];
    $('div.player-name').append(' ' + pnum);
  }


  function getPlayerNumberPromise() {
    return playerStatsPageRequest.then(function(gamelogHtml) {
      return $('ul.general-info li.first', gamelogHtml).text().trim().split(' ')[0];
    })
  }

  function getTargetsPromise() {
    return playerStatsPageRequest.then(parseTargets);
  }

  return {
    getPlayerNumber: getPlayerNumberPromise,
    getTargets: getTargetsPromise
  };
})