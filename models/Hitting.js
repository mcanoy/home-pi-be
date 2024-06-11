const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

class Hitting extends Model {};

Hitting.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    season: DataTypes.STRING,
    division: DataTypes.STRING,
    gamedate: DataTypes.DATEONLY,
    opponent: DataTypes.STRING,
    result: DataTypes.STRING,
    rf: DataTypes.TINYINT,
    ra: DataTypes.TINYINT,
    score: DataTypes.STRING,
    player: DataTypes.STRING,
    batting_order: DataTypes.TINYINT,
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
    modelName: 'Hitting',
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Hitting;