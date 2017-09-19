//Fantasy Pros data source functionality
provide('FantasyProsStatsProvider', function(playerName) {
  var Q = require('q');
  var $ = require('jquery');
  var _ = require('lodash');
  var scheduleUtils = require('NflScheduleUtils')();
  var ROOTURL = 'https://www.fantasypros.com';

  var playerStatsPageRequest = Q()
      .then(executeSearch)
      .then(getPage)
      .then(extractPlayerLink)
      .then(fetchPlayerStats);

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
    var url = ROOTURL + '/nfl/games/' + playerLink + '.php';
    return $.ajax(url);
  }

  function validateYear(statsPage) {
      var nflYear = scheduleUtils.currentSeasonYear().toString();
      var selectedYear = $('#scoring_select', statsPage).find(":selected").text();
      if (nflYear !== selectedYear) {
        throw new Error('FantasyPros data for year ' + selectedYear + ' is not for current year ' + nflYear);
      }
    }

  function parseTargets(statsPage) {
    //Get header index
    var headers = $('.mobile-table thead tr:last th', statsPage);
    headers = _.map(headers, 'innerText');
    var targetIndex = headers.indexOf('Tgt');

    //Get targets from table body
    var targets = $('.mobile-table tbody tr', statsPage)
      .map(function(i, row) {
        return $('td:eq(' + targetIndex + ')', row).text();
      })
      .toArray();

    targets.pop(); //Last row is season aggregate
    return targets;
  }

  function trimAll(targetsArr) {
    return targetsArr.map(_.trim);
  }

  return {
    getTargets: function() {
      return playerStatsPageRequest.tap(validateYear)
        .then(parseTargets)
        .then(trimAll);
    }
  };

});