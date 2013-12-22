var teams = { 'FA': '', 'Arizona Cardinals': 'ari', 'Atlanta Falcons': 'atl', 'Baltimore Ravens ': 'bal', 'Buffalo Bills': 'buf', 'Carolina Panthers': 'car', 'Chicago Bears': 'chi', 'Cincinnati Bengals': 'cin', 'Cleveland Browns': 'cle', 'Dallas Cowboys': 'dal', 'Denver Broncos': 'den', 'Detroit Lions': 'det', 'Green Bay Packers': 'gnb', 'Houston Texans': 'hou', 'Indianapolis Colts': 'ind', 'Jacksonville Jaguars': 'jac', 'Kansas City Chiefs': 'kan', 'Miami Dolphins': 'mia', 'Minnesota Vikings': 'min', 'New England Patriots': 'nwe', 'New Orleans Saints': 'nor', 'New York Giants': 'nyg', 'New York Jets': 'nyj', 'Oakland Raiders': 'oak', 'Philadelphia Eagles': 'phi', 'Pittsburgh Steelers': 'pit', 'San Diego Chargers': 'sdg', 'Seattle Seahawks': 'sea', 'San Francisco 49ers': 'sfo', 'St. Louis Rams': 'stl', 'Tampa Bay Buccaneers': 'tam', 'Tennessee Titans': 'ten', 'Washington Redskins': 'was' };

var team;
var playerName;
var position;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var playerId = request.url.match(/playerId=(\d+)&/)[1];
    team = $('span[title="Team"]').text();
    playerName = $('div.player-name').text();
    position = $('span[title="Position Eligibility"').text().split(' ')[1];

    if(position === 'RB') {
      addYahooTargets();
      return;
    }
    else {
      addEspnTargets(playerId);
    }
  });
















