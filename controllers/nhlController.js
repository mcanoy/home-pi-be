const axios = require('axios');
const moment = require('moment');
const talker = require('./googleController');
const util = require('util');

const leafUrl = "https://api-web.nhle.com/v1/scoreboard/tor/now";
const jaysUrl = process.env.MLB_GAMES_URL;
const raptorId = "Toronto Raptors";
const leafHook = process.env.MESSAGE_WEBHOOK_URL;
const raptorHook = process.env.MESSAGE_WEBHOOK_URL;

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
          sendWebhook(leafHook, jsonText, "Go Leafs Go")
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
    nextGameText = `The next Leafs game is today at ${gameTime.format('h:mma')} against the ${opponent} ${broadcast}`
    
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
          sendWebhook(raptorHook, jsonText, "Let's Go Raptors");
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

const getNextBlueJayGame = (req, res) => {
  const today = moment(new Date()).format('YYYY-MM-DD');
  const year = moment(new Date()).format('YYYY');

  const jaysTodayUrl = util.format(jaysUrl, year, today, today);

  axios.get(jaysTodayUrl)
    .then(function (response) {
      var jsonText = "";
      if(response.data.totalGames > 0) {  //playing today
        const away = response.data.dates[0].games[0].teams.away.team.teamName;
        const home = response.data.dates[0].games[0].teams.home.team.teamName;
        const gametime = moment(new Date(response.data.dates[0].games[0].gameDate)).format('h:mma');
        jsonText = `The ${away} play the ${home} today at ${gametime}`;
        talker.say(jsonText);
      } else {
        jsonText = "No Blue Jay game today";
        talker.say(jsonText);
      }
      if(res) {
        res.status(200).json({ message: jsonText });
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("BLUE JAY ERROR=============================================");
      if(res) {
        res.status(500).json({ message: error });
      }
    });
}

function sendWebhook(hook, message, title) {
  console.warn(`game hook ${hook}`)
  axios.post(hook, {
    message: message,
    title: title
  })
    .then(function (response) {
      console.warn(`message sent to webhook ${message}`)
    })
    .catch(function (error) {
      console.warn(`failed to send message ${message}`)
      console.error(error.errors);
    });
}


module.exports = { getNextLeafsGame, getNextRaptorGame, getNextBlueJayGame };