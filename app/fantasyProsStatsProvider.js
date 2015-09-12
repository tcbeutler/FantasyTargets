//Fantasy Pros data source functionality
provide('FantasyProsStatsProvider', function(playerName) {
  var Q = require('q');
  var $ = require('jquery');
  var _ = require('lodash');
  var ROOTURL = 'http://www.fantasypros.com';

  function getStats() {
    var start = new Date();
    return Q()
    .then(executeSearch)
    .then(getPage)
    .then(extractPlayerLink)
    .then(fetchPlayerStats)
    .then(parseStats)

    function executeSearch() {
      var url = ROOTURL + '/ajax/search-nfl.php?term=';
      url += playerName.split(' ').join('+');
      return $.ajax(url);
    }

    function getPage(results) {
      results = JSON.parse(results); //server responds with text
      var id = results[0].id;
      var url = ROOTURL + '/nfl/players/';
      return $.ajax({
        url: url,
        method: 'post',
        data: 'playersearch=' + id
      })
    }

    function extractPlayerLink(page) {
      var link = /fantasypros.com\/nfl\/players\/(.+).php/.exec(page);
      return link[1];
    }

    function fetchPlayerStats(playerLink) {
      var url = ROOTURL + '/nfl/stats/' + playerLink + '.php';
      return $.ajax(url);
    }

    function parseStats(statsPage) {
      //Get header index
      var headers = $('.stats-table thead tr:last th', statsPage);
      headers = _.pluck(headers, 'innerText');
      var targetIndex = headers.indexOf('TAR');

      //Get targets from table body
      var targets = $('.stats-table tbody tr', statsPage)
        .map(function(i, row) {
          return $('td:eq(' + targetIndex + ')', row).text();
        })
        .toArray();

      targets.pop(); //Last row is season aggregate
      return targets;
    }

  }

  return {
    getStats: getStats
  };

});