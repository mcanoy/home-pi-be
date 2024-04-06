
const cheerio = require('cheerio');
const axios = require('axios');

const baseballUrl = process.env.BASEBALL_HOST_URL;
const divisions = process.env.DIVISIONS.split(' ')

const divisionMap = new Map();
divisions.forEach(div => {
  const nameValuePair = div.split('/');
  divisionMap.set(nameValuePair[1], div);
});

const fields = [ "place", "team", "pct", "wins", "losses", "ties", "runs_for", "runs_against", "streak"];
const scheduleFields = ["date", "time", "home", "away", "location"]

const getStandings = (req, res) => {
  console.log("get standings");

  const url = baseballUrl + divisionMap.get(req.query.league);
  if(!url) {
    res.status(200).contentType('application/json').json({standings: [], schedule: []});
  }

  const standings = [];
  const schedule = [];

  axios.get(url)
    .then(function (response) {
      
      const $ = cheerio.load(response.data);
        const byid = $('#ctl00_ContentPlaceHolder1_StandingsResultsControl_standingsGrid_ctl00 tr');
        
        $(byid).each(function (i, e) {
            var jso = {}
            $(this).find("td").each(function (i, e) {
              jso[fields[i]] = $(this).text().trim()
            });
            if(jso.place) {
              standings.push(jso);
            }
        });

        const scheduleId = $('#ctl00_ContentPlaceHolder1_StandingsResultsControl_ScheduleGrid_ctl00 tr');
        $(scheduleId).each(function (i, e) {
          var jso = {}
          $(this).find("td").each(function (i, e) {
            if(i == 2) {
              jso[scheduleFields[i]] = $(this).text().trim().split(')')[0] + ')';
              jso.homeScore = $(this).text().trim().split(')')[1].trim();
            } else if(i == 3) {
              jso[scheduleFields[i]] = $(this).text().trim().split(')')[0] + ')';
              jso.awayScore = $(this).text().trim().split(')')[1].trim();
            } else {
              jso[scheduleFields[i]] = $(this).text().trim()
            }
          });
          if(jso.location) {
            schedule.push(jso);
          }
      });

      res.status(200).contentType('application/json').json({standings: standings, schedule: schedule});
    })
    .catch(function (error) {
      console.log(error);
      console.log("ERROR=============================================");
      if(res) {
        res.status(500).json({ message: error });
      }
    });

    
}


module.exports = { getStandings }