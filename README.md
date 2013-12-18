###FantasyTargets  

#####[Chrome Web Store](https://chrome.google.com/webstore/detail/fantasy-targets/abmbpdhchbhhecbjhnhlnobeiihhjfpa?utm_campaign=en&utm_source=en-ha-na-us-bk-webstr&utm_medium=ha)
==============

####Lightweight chrome extension to add targets to player stats in ESPN Fantasy Football.

####Idea log: 
* **BUG FIX: IF ALL 0'S ACROSS THE BOARD FOR A WEEK, DONT SKIP THE ROW**
* Show collective injury data  from previous year(P, Q, O, IR designations) Maybe next to week column.
        http://fftoday.com/nfl/13_injury_wk14.html
* Data storage - player notes.
        http://developer.chrome.com/extensions/storage.html
* Links to Yahoo player pages. Way more information.
* QBR? Completion percentage? 


####Possible scrape sites:  

######YAHOO  
-----  
1. http://sports.yahoo.com/nfl/teams/atl/roster/ => $('a[title="Roddy White"]')  
        Possibly cache this using storage.
2. http://sports.yahoo.com/nfl/players/7203/ => $('div#mediasportsplayergamelog td.nfl-stat-type-310.targets')  


fftoday.com/stats/players  
http://www.kffl.com/player/{id}/nfl/utilization  




