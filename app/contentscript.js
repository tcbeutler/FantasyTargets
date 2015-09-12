var FantasyProsStatsProvider = require('FantasyProsStatsProvider');
var EspnStatsProvider = require('EspnStatsProvider');
var dom = require('DomController')();
var $ = require('jquery');

chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
    var playerName = $('div.player-name').text();
    console.log(request.url)
    var espnPlayerId = request.url.match(/playerId=(\d+)&/)[1];
    console.log(espnPlayerId)

    new FantasyProsStatsProvider(playerName)
      .getStats()
      .then(dom.addTargets, handleError)

    new EspnStatsProvider(espnPlayerId)
      .getPlayerNumber()
      .then(dom.addPlayerNumber, handleError)

    function handleError(err) {
      console.error('Error', err);
    }
  }
);