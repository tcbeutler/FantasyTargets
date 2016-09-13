var EspnStatsProvider = require('EspnStatsProvider');
var FantasyProsStatsProvider = require('FantasyProsStatsProvider');
var DomController = require('DomController');
var $ = require('jquery');

chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
    var position = $("span[title='Position Eligibility']").text().split(' ')[1];
    var dom = new DomController(position);

     switch(position) {
      case 'WR':
      case 'TE':

        var espnPlayerId = $('div.mugshot img').attr('src').match(/players\/full\/(\d+)\.png/)[1];
        var statsProvider = new EspnStatsProvider(espnPlayerId);
        statsProvider.getPlayerNumber()
          .then(dom.addPlayerNumber)
          .catch(handleError);

        statsProvider.getTargets()
          .then(dom.addTargets)
          .catch(handleError);

        break;

      case 'RB':
        var espnPlayerId = $('div.mugshot img').attr('src').match(/players\/full\/(\d+)\.png/)[1];
        new EspnStatsProvider(espnPlayerId).getPlayerNumber()
          .then(dom.addPlayerNumber)
          .catch(handleError);

        var playerName = $('div.player-card-player-info div.player-name').text();
        new FantasyProsStatsProvider(playerName).getTargets()
          .then(dom.addTargets)
          .catch(handleError);
     }

    function handleError(err) {
      console.error('FantasyTargets:', err);
    }

  }
);