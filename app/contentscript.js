chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var playerId = request.url.match(/playerId=(\d+)&/)[1];
    var thisYear = new Date().getFullYear();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId + "/year/" + thisYear, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          addTargets(xhr.responseText);
          addNumber(xhr.responseText);
        }
    };
    xhr.send();
  });

function addNumber(xhr) {
  var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function addTargets(xhr) {
  var targets = getColumn(xhr, 'TGTS');
  var receptions = getColumn(xhr, 'REC');
  var yards = getColumn(xhr, 'YDS');

  if(!targets)
    return;

  //Fill in blanks for missing games, byes. etc
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
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
  injectCells(2, newTargets);  
}

function injectCells(index, values) {
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  for (var i = 0; i < tableRows.length; i++) {

    var newCell = tableRows[i].insertCell(index);
    newCell.setAttribute('width', 100);
    newCell.setAttribute('align', 'right');
    //Set class
    if (i === 0)
      newCell.setAttribute('class', 'pcTanRight');
    else
      newCell.setAttribute('class', i%2 ? 'pcEven' : 'pcOdd');
    newCell.innerText = values[i] || '';
  }
}

function getColumn(xhr, colName) {
  var headerVals = $.map(
    $("div.mod-player-stats div.mod-content table tbody tr.colhead td", xhr),
    function(val) { return val.innerText; });
  var index = headerVals.indexOf(colName);
  if (index < 0) return;

  var values = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, tr[class*="team"]', xhr),
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
