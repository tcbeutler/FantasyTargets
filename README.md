FantasyTargets
==============

Lightweight chrome extension to add targets to player stats in ESPN Fantasy Football.

1. javascript:(function(d,s){s=d.createElement('script');s.src='https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.js';(d.head||d.documentElement).appendChild(s)})(document);

2. javascript:(function(d,s){s=d.createElement('script');s.src='https://raw.github.com/padolsey/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js';(d.head||d.documentElement).appendChild(s)})(document);

3. var pnum;

4. $.get('http://espn.go.com/nfl/player/_/id/15168/case-keenum', function(res){
        pnum = $('ul.general-info li.first', res.responseText).text().trim().split(' ')[0]
    });

5. $('div.player-name').append('<p>' + pnum + '</p>');
