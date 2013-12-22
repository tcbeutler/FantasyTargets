function addEspnNumber(xhr) {
  var pnum = $('ul.general-info li.first', xhr).text().trim().split(' ')[0];
  $('div.player-name').append('<p>' + pnum + '</p>');
}

function addEspnTargets(playerId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://espn.go.com/nfl/player/gamelog/_/id/" + playerId, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var targets = getEspnColumn(xhr.responseText, 'TGTS');
        var receptions = getEspnColumn(xhr.responseText, 'REC');
        var yards = getEspnColumn(xhr.responseText, 'YDS');
        addTargets(targets, receptions, yards);
        addEspnNumber(xhr.responseText);
      }
  };
  xhr.send();
}

function getEspnColumn(res, colName) {
  var headerVals = $.map(
    $("div.mod-player-stats div.mod-content table tbody tr.colhead td", res),
    function(val) { return val.innerText; });
  var index = headerVals.indexOf(colName);
  if (index < 0) return;

  var values = $.map(
    $('div.mod-player-stats div.mod-content table tbody tr.colhead, .oddrow, .evenrow', res),
    function(row) {
      return row.cells[index].innerText;
    });

  return values;
}