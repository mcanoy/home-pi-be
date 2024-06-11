const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

class SeasonHitting extends Model {};

SeasonHitting.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    season: DataTypes.STRING,
    division: DataTypes.STRING,
    games: DataTypes.STRING,
    player: DataTypes.STRING,
    plate_appearances: DataTypes.TINYINT,
    at_bats: DataTypes.TINYINT,
    runs: DataTypes.TINYINT,
    hits: DataTypes.TINYINT,
    doubles: DataTypes.TINYINT,
    triples: DataTypes.TINYINT,
    home_runs: DataTypes.TINYINT,
    walks: DataTypes.TINYINT,
    strikeouts: DataTypes.TINYINT,
    avg: DataTypes.FLOAT,
    obp: DataTypes.FLOAT,
    slg: DataTypes.FLOAT,
    ops: DataTypes.FLOAT,
    bb_rate: DataTypes.FLOAT,
    k_rate: DataTypes.FLOAT,
    bb_k_ratio: DataTypes.FLOAT,
  }, 
  {
    sequelize,
    modelName: 'rollup_player_hitting',
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = SeasonHitting;