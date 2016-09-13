provide('NflScheduleUtils', function() {
    var moment = require('moment');

    return {
        // Uses Sept 1 as cutoff for new season (ex: Aug 31, 2017 is 2016 season)
        currentSeasonYear: function currentSeasonYear() {
            return moment().subtract(8, 'month').year();
        }
    }
});