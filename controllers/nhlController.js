const axios = require('axios');
const moment = require('moment');
const talker = require('./googleController');

const leafUrl = "https://api-web.nhle.com/v1/scoreboard/tor/now";
const raptorId = "Toronto Raptors";

//@desc get next leaf game
//@route GET /api/nextgame
//@access public
const getNextLeafsGame = (req, res) => {
  // #swagger.summary = 'Gets the next scheduled Leafs game. Announces on speaker.
  axios.get(leafUrl)
    .then(function (response) {
      var jsonText ="";

      for(games in response.data.gamesByDate) {
        var nextgame = response.data.gamesByDate[games].games[0];
        if(nextgame.gameState != "OFF") {
          jsonText = nextGameDetails(nextgame);
          talker.say(jsonText);
          break;
        }
      }
      if(res) {
        res.status(200).json({ message: jsonText });
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("ERROR=============================================");
      if(res) {
        res.status(500).json({ message: error });
      }
    });
}

function nextGameDetails(game) {
  console.log("Next Game", game.gameDate);
  var broadcast = getBroadcast(game);

  const now = moment.now();
  const gameDate = moment(game.gameDate);
  var nextGameText;
  
  if(gameDate.isSame(now, 'day')) { // Today
    const gameTime = moment(game.startTimeUTC);
    const opponent = getOpponent(game);
    nextGameText = `The next Leafs game is today at ${gameTime.format('H:mma')} against the ${opponent} ${broadcast}`
    
  } else {
    nextGameText =`The next Leafs game is on ${gameDate.format('dddd')} ${broadcast}`;
  }

  console.log(nextGameText);
  return nextGameText;
}

function getBroadcast(game) {
  for(broad in game.tvBroadcasts) {
    br = game.tvBroadcasts[broad];
    if(br.countryCode == "US" && br.market == "N") {
      return `on ${br.network}`;
    }
  }

  return "";
}

function getOpponent(game) {
  return game.awayTeam.id == 10 ? game.homeTeam.name.default : game.awayTeam.name.default
}

const getNextRaptorGame = (req, res) => {
  const year = moment(new Date());
  if(year.isBefore(`${year.format('YYYY')}-07-01`)) {
    year.subtract(1, 'years');
  }
  const raptorUrl = `https://fixturedownload.com/feed/json/nba-${year.format('YYYY')}/toronto-raptors`;

  axios.get(raptorUrl)
    .then(function (response) {
      var jsonText = "";
      for(games in response.data) {
        var nextgame = response.data[games];
        if(!nextgame.HomeTeamScore) {
          jsonText = getNextRaptorGameDetails(nextgame);
          talker.say(jsonText);
          break;
        }
      }
      if(res) {
        res.status(200).json({ message: jsonText });
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("RAPTOR ERROR=============================================");
      if(res) {
        res.status(500).json({ message: error });
      }
    });
}

function getNextRaptorGameDetails(game) {
  const gameDate = moment(game.DateUtc);
  const now = moment.now();
  const opponent = (raptorId === game.HomeTeam) ? game.AwayTeam : game.HomeTeam;
  var nextGameText;

  if(gameDate.isSame(now, 'day')) { // Today
    nextGameText = `The next Raptors game is today at ${gameDate.format('h:mma')} against the ${opponent}`;
  } else if(gameDate.startOf('day').diff(moment().startOf('day'), 'days')  > 7) {
    //More than a week away
    nextGameText = `The next Raptors game is on ${gameDate.format('MMMM Do')}`;
  } else {
    nextGameText = `The next Raptors game is on ${gameDate.format('dddd')}`;
  }

  return nextGameText;
}


module.exports = { getNextLeafsGame, getNextRaptorGame };