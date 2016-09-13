var EspnStatsProvider = require('EspnStatsProvider');
var FantasyProsStatsProvider = require('FantasyProsStatsProvider');
var DomController = require('DomController');
var $ = require('jquery');

chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
    var position = $("span[title='Position Eligibility']").text().split(' ')[1];
    var dom = new DomController(position);

    // Do nothing on DST or if problem fetching ESPN player ID
    var espnPlayerIdMatch = $('div.mugshot img').attr('src').match(/players\/full\/(\d+)\.png/);
    if (!Array.isArray(espnPlayerIdMatch) || espnPlayerIdMatch.length < 2 || position == 'D/ST') {
      return;
    }

    // Get player number for anyone with a playerID
    var espnPlayerId = espnPlayerIdMatch[1];
    var espnStatsProvider = new EspnStatsProvider(espnPlayerId);
    espnStatsProvider.getPlayerNumber()
          .then(dom.addPlayerNumber)
          .catch(handleError);

    // Add targets from ESPN for WR/TE, otherwise from FantasyPros for RB
    if (position == 'WR' || position == 'TE') {
      espnStatsProvider.getTargets()
          .then(dom.addTargets)
          .catch(handleError);

    } else if (position == 'RB') {
        var playerName = $('div.player-card-player-info div.player-name').text();
        new FantasyProsStatsProvider(playerName).getTargets()
          .then(dom.addTargets)
          .catch(handleError);
    };

    function handleError(err) {
      console.error('FantasyTargets:', err);
    }

  }
);