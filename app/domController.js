provide('DomController', function() {

  var $ = require('jquery');

  function addPlayerNumber(pnum) {
    $('div.player-name').append(' ' + pnum);
  }

  function addTargets(values) {
    if (!Array.isArray(values)) return;
    values.unshift('TGTS'); //Add header

    addColumn(2, values);
  }

  function addColumn(index, values) {
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
      newCell.innerText = values[i] || '-';
    }
  }

  return {
    addTargets: addTargets,
    addPlayerNumber: addPlayerNumber
  };

});