function addTargets(targets, receptions, yards) {
  if(!targets)
    return;

  var newTargets = adjustForMissingWeeks(targets, yards, receptions);
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

function cellsEqual(row, cellIndexArray, value) {
  for (var i = 0; i < cellIndexArray.length; i++) {
    if (row.cells[cellIndexArray[i]].innerText !== value)
      return false;
  }
  return true;
}

function adjustForMissingWeeks(targets, yards, receptions) {
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
  return newTargets;
  
}