var pnum;


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var playerId = request.url.match(/playerId=(\d+)&/)[1];
    var xhr = new XMLHttpRequest();
    //xhr.open("GET", "http://espn.go.com/nfl/player/_/id/" + playerId, true);
    xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          AddTargets(xhr.responseText);
          AddNumber(xhr.responseText);
        }
    };
    xhr.send();
  });

function AddNumber(xhr) {
  pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function AddTargets(xhr) {
  var headerVals = $.map(
    $("div.mod-player-stats div.mod-content table tbody tr.colhead td", xhr),
    function(val) { return val.innerText; });
  var tgtIndex = headerVals.indexOf('TGTS');

  if (tgtIndex < 0) return;

  var targetCells = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, .oddrow, .evenrow', xhr),
    function(row) {
      return row.cells[4].innerText;
    });

  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');

  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {

    var newCell = tableRows[i].insertCell(2);
    newCell.setAttribute('width', 100);
    newCell.setAttribute('align', 'right');
    if (tableRows[i].cells[1].innerText === 'BYE') {
      newCell.innerText = '-';
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');
    }
    else if (tableRows[i].cells[3].innerText === '0' &&
    tableRows[i].cells[4].innerText === '0' &&
    tableRows[i].cells[5].innerText === '0' &&
    tableRows[i].cells[6].innerText === '0') {
      newCell.innerText = '0';
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');            
    }
    else if (i === 0) {
      newCell.setAttribute('class', 'pcTanRight');
      newCell.innerText = targetCells[iter]; 
      iter++;
    }
    else {
      console.log('writing cell' + targetCells[iter]);
      newCell.innerText = targetCells[iter] || '';
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');
      iter++;
    }

  }
}
