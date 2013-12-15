chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var playerId = request.url.match(/playerId=(\d+)&/)[1];
    var xhr = new XMLHttpRequest();
    //xhr.open("GET", "http://espn.go.com/nfl/player/_/id/" + playerId, true);
    xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var targets = getTargets(xhr.responseText);
          if (targets)
            injectCells(2, targets);
          addNumber(xhr.responseText);
        }
    };
    xhr.send();
  });

function addNumber(xhr) {
  var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function injectCells(index, values) {
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');

  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {

    var newCell = tableRows[i].insertCell(index);
    newCell.setAttribute('width', 100);
    newCell.setAttribute('align', 'right');
    //Set class
    if (i === 0)
      newCell.setAttribute('class', 'pcTanRight');
    else
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');
      
    //Set text
    if (cellsEqual(tableRows[i], [1], 'BYE')) {
      newCell.innerText = '-';
    }
    else if (cellsEqual(tableRows[i], [3, 4, 5, 6], '0'))
      newCell.innerText = '0';
    else {
      newCell.innerText = values[iter] || '';
      iter++;
    }
  }
}

function getTargets(xhr) {
  var headerVals = $.map(
    $("div.mod-player-stats div.mod-content table tbody tr.colhead td", xhr),
    function(val) { return val.innerText; });
  var tgtIndex = headerVals.indexOf('TGTS');

  if (tgtIndex < 0) return;

  var targets = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, .oddrow, .evenrow', xhr),
    function(row) {
      return row.cells[4].innerText;
    });

  return targets
}

function cellsEqual(row, cellIndexArray, value) {
  for (var i = 0; i < cellIndexArray.length; i++) {
    if (row.cells[cellIndexArray[i]].innerText !== value)
      return false;
  }
  return true;
}
