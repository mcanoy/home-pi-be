const hitsy = require('../models/Hitting');
const rollupHitsy = require('../models/SeasonHitting');
const rollupTeamHitsy = require('../models/TeamHitting');
const rollupGameHitsy = require('../models/GameHitting');

async function getHitting(req, res) {
  const hitter = req.params.hitter;
  let json;
  if(hitter) {
    json = await hitsy.findAll({where: {player: hitter}});
  } else {
    json = await hitsy.findAll();
  }
  res.status(200).contentType('application/json').json(json);
}

async function getSeasonHitting(req, res) {
  const season = req.params.season;
  const division = req.params.division;
  
  const players = await rollupHitsy.findAll({where: {season: season, division: division }, order: [['games', 'DESC'],['plate_appearances', 'DESC']]});
  const team = await rollupTeamHitsy.findOne({where: {season: season, division: division }});
  const games = await rollupGameHitsy.findAll({where: {season: season, division: division }, order: ['gamedate']});

  const json = { players: players, team: team, games: games, season: season, division: division };
  res.status(200).contentType('application/json').json(json);
}

async function getGameHitting(req, res) {
  const gamedate = req.params.gamedate;
  const division = req.params.division;
  console.log("div", division);

  if(division == "styles.css") {
    res.status(400).contentType('application/json').json({error: 'styles.css is invalid param!!!'});
  } else {
    const boxScore = await hitsy.findAll({where: { gamedate: gamedate, division: division}, order: ['batting_order']});
    const totals = await rollupGameHitsy.findOne({where: { gamedate: gamedate, division: division}});

    const json = [{team: totals, players: boxScore, division: division, season: totals.season, game: gamedate }];
    res.status(200).contentType('application/json').json(json);
  }
}

async function getPlayerCareerHitting(req, res) {
  const player = req.params.player;

  const seasons = await rollupHitsy.findAll({where: {player: player}});
  const games = await hitsy.findAll({where: {player: player}, order: ['gamedate']});
  const output = [];

  sort(seasons);
  seasons.forEach((season) => {
    const ogames = games.filter(game => game.season == season.season && game.division == season.division);
    output.push({team: season, players: ogames, season: season.season, division: season.division});
  });

  res.status(200).contentType('application/json').json(output);
}

function sort(seasons) {
  seasons.sort((a,b) => {
    const ayear = Number(a.season.substring(1));
    const byear = Number(b.season.substring(1));

    const aseason = a.season.replace("F", "Z");
    const bseason = b.season.replace("F", "Z");

    return byear - ayear == 0 ? bseason.localeCompare(aseason) : byear - ayear;
  });
}

async function getAllSeasonHitting(req, res) {
  const teams = await rollupTeamHitsy.findAll();
  const players = await rollupHitsy.findAll();
  const output = [];
  sort(teams);
  teams.forEach((team) => {
    const oplayers = players.filter(player => player.season == team.season && player.division == team.division);
    output.push({team: team, players: oplayers, season: team.season, division: team.division});
  });
  
  res.status(200).contentType('application/json').json(output);
}

async function getTeamHitting(req, res) {
  const season = req.params.season;
  const division = req.params.division;

  if(season && division) {
    console.log('get for season and division');
  } else {
    const json = await rollupTeamHitsy.findAll();
    res.status(200).contentType('application/json').json(json);
  }
}

module.exports = { getHitting, getSeasonHitting, getTeamHitting, getAllSeasonHitting, getPlayerCareerHitting, getGameHitting }