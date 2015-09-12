//ESPN specific data source functionality.
provide('EspnStatsProvider', function(playerId) {
  var $ = require('jquery');

  function getPlayerNumber() {
    return $.ajax('http://espn.go.com/nfl/player/gamelog/_/id/' + playerId)
    .then(function(response) {
      return $('ul.general-info li.first', response).text().trim().split(' ')[0];
    })
  }

  return {
    getPlayerNumber: getPlayerNumber
  };
})