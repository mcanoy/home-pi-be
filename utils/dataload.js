const sqlite3 = require('sqlite3').verbose();
const {google} = require('googleapis');
const fs = require('fs');

const AVG = "cast(sum(hits) as float) / cast(sum(at_bats) as float) ";
const OBP = "cast(sum(hits) + sum(walks) as float) / cast(sum(plate_appearances) as float) "; 
const SLG = "cast(sum(hits) + sum(doubles) + sum(triples*2) + sum(home_runs*3) as float) / cast(sum(at_bats) as floats) ";
const OPS = "cast(sum(hits) + sum(doubles) + sum(triples*2) + sum(home_runs*3) as float) / cast(sum(at_bats) as floats) + cast(sum(hits) + sum(walks) as float) / cast(sum(plate_appearances) as float) ";
const BB_RATE = "cast(sum(walks) as float) / cast(sum(plate_appearances) as float) ";
const K_RATE = "cast(sum(strikeouts) as float) / cast(sum(plate_appearances) as float) ";
const BB_K_RATIO = "cast(sum(walks) as float) / cast(sum(strikeouts) as float) ";
let field = 0;

const sheetMap = new Map([
  ["season", field++],
  ["division", field++],
  ["gamedate", field++],
  ["opponent", field++],
  ["gametype", field++],
  ["result", field++],
  ["rf", field++],
  ["ra", field++],
  ["score", field++],
  ["player", field++],
  ["order", field++],
  ["plate_appearances", field++],
  ["at_bats", field++],
  ["runs", field++],
  ["hits", field++],
  ["doubles", field++],
  ["triples", field++],
  ["home_runs", field++],
  ["walks", field++],
  ["strikeouts", field++],
  ["avg", field++],
  ["obp", field++],
  ["slg", field++],
  ["ops", field++],
  ["bb_rate", field++],
  ["k_rate", field++],
  ["bb_k_ratio", field++]
])

async function loadData(rows) {
  console.log('data load');
  const dataSql = fs.readFileSync(process.env.DDL_FILE).toString().split('||');

  let db = new sqlite3.Database(process.env.DATABASE_NAME, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Loading ddl for ${process.env.DATABASE_NAME} SQlite database.`);
  });

  db.serialize(() => {
    dataSql.forEach((query) => {
      if(query) {
        db.run(query, (err) => {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    rows.forEach((row) => {
      let query = `INSERT into hitting values (null, 
        '${row[sheetMap.get('season')]}', 
        '${row[sheetMap.get('division')]}', 
        '${row[sheetMap.get('gamedate')]}', 
        '${row[sheetMap.get('opponent')]}',
        '${row[sheetMap.get('gametype')]}',
        '${row[sheetMap.get('result')]}',
        ${row[sheetMap.get('rf')]}, 
        ${row[sheetMap.get('ra')]}, 
        '${row[sheetMap.get('score')]}', 
        '${row[sheetMap.get('player')]}', 
        ${row[sheetMap.get('order')]},
        ${row[sheetMap.get('plate_appearances')]}, 
        ${row[sheetMap.get('at_bats')]}, 
        ${row[sheetMap.get('runs')]}, 
        ${row[sheetMap.get('hits')]}, 
        ${row[sheetMap.get('doubles')]}, 
        ${row[sheetMap.get('triples')]}, 
        ${row[sheetMap.get('home_runs')]}, 
        ${row[sheetMap.get('walks')]}, 
        ${row[sheetMap.get('strikeouts')]}, 
        ${row[sheetMap.get('avg')]}, 
        ${row[sheetMap.get('obp')]}, 
        ${row[sheetMap.get('slg')]}, 
        ${row[sheetMap.get('ops')]}, 
        ${row[sheetMap.get('bb_rate')]},
        ${row[sheetMap.get('k_rate')]},
        ${row[sheetMap.get('bb_k_ratio')]});`;
        query.re
      db.run(query.replace(/(\r\n|\n|\r)/gm, ""), (err) => {
        if(err) throw err;
      });
    });

    const rollupQuery = "INSERT INTO rollup_player_hitting SELECT null, season, division, player, count( distinct( gamedate || opponent)), sum(plate_appearances), sum(at_bats), sum(runs), sum(hits), sum(doubles), sum(triples), sum(home_runs), sum(walks), sum(strikeouts), "
      + `${AVG}, ${OBP}, ${SLG}, ${OPS}, ${BB_RATE}, ${K_RATE}, ${BB_K_RATIO}`
      + " from hitting GROUP BY player, season";
    db.run(rollupQuery, (err) => {
      if(err) throw err;
    });

    const rollupDivisionQuery = "INSERT INTO rollup_player_hitting SELECT null, 'Career', division, player, count( distinct( gamedate || opponent)), sum(plate_appearances), sum(at_bats), sum(runs), sum(hits), sum(doubles), sum(triples), sum(home_runs), sum(walks), sum(strikeouts), "
    + `${AVG}, ${OBP}, ${SLG}, ${OPS}, ${BB_RATE}, ${K_RATE}, ${BB_K_RATIO}`
      + " from hitting GROUP BY division, player";
    db.run(rollupDivisionQuery, (err) => {
      if(err) throw err;
    });

    const rollupGameQuery = "INSERT INTO rollup_game_hitting SELECT null, season, division, gamedate, gametype, opponent, result, max(rf), max(ra), score, sum(plate_appearances), sum(at_bats), sum(runs), sum(hits), sum(doubles), sum(triples), sum(home_runs), sum(walks), sum(strikeouts), "
    + `${AVG}, ${OBP}, ${SLG}, ${OPS}, ${BB_RATE}, ${K_RATE}, ${BB_K_RATIO}`
      + " from hitting GROUP BY season, division, gamedate";
    db.run(rollupGameQuery, (err) => {
      if(err) throw err;
    });

    const rollupTeamQuery = "INSERT INTO rollup_team_hitting SELECT null, season, division, count( distinct( gamedate || opponent)), " +
      "sum(plate_appearances), sum(at_bats), sum(runs), sum(hits), sum(doubles), sum(triples), sum(home_runs), sum(walks), sum(strikeouts), "
      + "cast(sum(hits) as float) / cast(sum(at_bats) as float), " 
      + "cast(sum(hits) + sum(walks) as float) / cast(sum(plate_appearances) as float), " 
      + "cast(sum(hits) + sum(doubles) + sum(triples*2) + sum(home_runs*3) as float) / cast(sum(at_bats) as floats), "
      + "cast(sum(hits) + sum(doubles) + sum(triples*2) + sum(home_runs*3) as float) / cast(sum(at_bats) as floats) + cast(sum(hits) + sum(walks) as float) / cast(sum(plate_appearances) as float), "
      + "cast(sum(walks) as float) / cast(sum(plate_appearances) as float), "
      + "cast(sum(strikeouts) as float) / cast(sum(plate_appearances) as float), "
      + "cast(sum(walks) as float) / cast(sum(strikeouts) as float) "
      + "from hitting GROUP BY season, division";
    db.run(rollupTeamQuery, (err) => {
      if(err) throw err;
    });

  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Close the ${process.env.DATABASE_NAME} connection for ddl load.`);
  });
}

async function loadFromSheets() {
  const rows = await readHittingSheet();
  await loadData(rows);
}

const sheetId = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_FILE,
  scopes:['https://www.googleapis.com/auth/spreadsheets.readonly']
});

async function readHittingSheet() {
  
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'All Hitting!A2:AA2000'
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log("google sheet row count", rows.length);
  return rows;
}

module.exports = { loadFromSheets }