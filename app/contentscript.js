chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var idLinks = $('div#tabView0 div#moreStatsView0 div.pc a')
    if (idLinks.length < 2) {
        return;
    }
    var idLink = idLinks[1];
    var idHref = idLink.getAttribute('href');
    var playerIds = idHref.match(/playerId=(\d+)/)
    if (!playerIds || playerIds.length < 2) {
        return;
    }
    var playerId = playerIds[1];
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          addTargets(xhr.responseText);
          addTds(xhr.responseText);
          addYds(xhr.responseText);
          addRecs(xhr.responseText);
          addNumber(xhr.responseText);
        }
    };
    xhr.send();
  });

function addNumber(xhr) {
  var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append(' ' + pnum);
}

function addTargets(xhr) {
  var targets = getColumn(xhr, 'Receiving Targets');
  var receptions = getColumn(xhr, 'Total receptions');
  var yards = getColumn(xhr, 'Total receiving yards');

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

function addTds(xhr) {
  var targets = getColumn(xhr, 'Receiving Targets');
  var receptions = getColumn(xhr, 'Total receptions');
  var yards = getColumn(xhr, 'Total receiving yards');
  var tds = getColumn(xhr, 'Receiving touchdowns');

  if(targets || !tds)
    return;

  //Fill in blanks for missing games, byes. etc
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  var newTds = [];
  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {
    if (cellsEqual(tableRows[i], [1], 'BYE')) {
      newTds.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '-')) {
     newTds.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '0') && receptions[iter] !== '0' && yards[iter] !== '0') {
     newTds.push('0');
    }
    else {
      newTds.push(tds[iter] || '');
      iter++;
    }
  }  
  injectCells(2, newTds);
}

function addYds(xhr) {
  var targets = getColumn(xhr, 'Receiving Targets');
  var receptions = getColumn(xhr, 'Total receptions');
  var yards = getColumn(xhr, 'Total receiving yards');

  if(targets || !yards)
    return;

  //Fill in blanks for missing games, byes. etc
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  var newYds = [];
  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {
    if (cellsEqual(tableRows[i], [1], 'BYE')) {
      newYds.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '-')) {
     newYds.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '0') && receptions[iter] !== '0' && yards[iter] !== '0') {
     newYds.push('0');
    }
    else {
      newYds.push(yards[iter] || '');
      iter++;
    }
  }  
  injectCells(2, newYds);
}

function addRecs(xhr) {
  var targets = getColumn(xhr, 'Receiving Targets');
  var receptions = getColumn(xhr, 'Total receptions');
  var yards = getColumn(xhr, 'Total receiving yards');

  if(targets || !receptions)
    return;

  //Fill in blanks for missing games, byes. etc
  var tableRows = $('div#tabView0 div#moreStatsView0 div#pcBorder table tbody tr');
  var newRecs = [];
  var iter = 0;
  for (var i = 0; i < tableRows.length; i++) {
    if (cellsEqual(tableRows[i], [1], 'BYE')) {
      newRecs.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '-')) {
     newRecs.push('-');
    }
    else if (cellsEqual(tableRows[i], [2, 3, 4, 5], '0') && receptions[iter] !== '0' && yards[iter] !== '0') {
     newRecs.push('0');
    }
    else {
      newRecs.push(receptions[iter] || '');
      iter++;
    }
  }  
  injectCells(2, newRecs);
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
    function(val) { 
        var t = val.getAttribute('title');
        if (!t) {
            t = '';
        }
        return t;
    });
  
  var index = headerVals.indexOf(colName);
  if (index < 0) return;

  var values = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, .oddrow, .evenrow', xhr),
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
