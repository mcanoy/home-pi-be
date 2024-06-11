drop table if exists hitting; 

||

create table hitting (
  id INTEGER PRIMARY KEY autoincrement,
  season varchar(5),
  division varchar(10),
  gamedate text,
  opponent varchar(20),
  gametype varchar(20),
  result varchar(8),
  rf int,
  ra int,
  score varchar(8),
  player varchar(55) NOT NULL,
  batting_order int,
  plate_appearances int,
  at_bats int,
  runs int,
  hits int,
  doubles int,
  triples int,
  home_runs int,
  walks int,
  strikeouts int,
  avg float,
  obp float,
  slg float,
  ops float,
  bb_rate float,
  k_rate float,
  bb_k_ratio float
);

||

drop table if exists rollup_player_hitting;

||

create table rollup_player_hitting (
  id INTEGER PRIMARY KEY autoincrement,
  season varchar(5),
  division varchar(10),
  player varchar(55),
  games int, 
  plate_appearances int,
  at_bats int,
  runs int,
  hits int,
  doubles int,
  triples int,
  home_runs int,
  walks int,
  strikeouts int,
  avg float,
  obp float,
  slg float,
  ops float,
  bb_rate float,
  k_rate float,
  bb_k_ratio float
);

||

drop table if exists rollup_team_hitting;

||

create table rollup_team_hitting (
  id INTEGER PRIMARY KEY autoincrement,
  season varchar(5),
  division varchar(10),
  games int,
  plate_appearances int,
  at_bats int,
  runs int,
  hits int,
  doubles int,
  triples int,
  home_runs int,
  walks int,
  strikeouts int,
  avg float,
  obp float,
  slg float,
  ops float,
  bb_rate float,
  k_rate float,
  bb_k_ratio float
);

||

drop table if exists rollup_game_hitting;

||

create table rollup_game_hitting (
  id INTEGER PRIMARY KEY autoincrement,
  season varchar(5),
  division varchar(10),
  gamedate text,
  gametype varchar(20),
  opponent varchar(20),
  result varchar(8),
  rf int,
  ra int,
  score varchar(8),
  plate_appearances int,
  at_bats int,
  runs int,
  hits int,
  doubles int,
  triples int,
  home_runs int,
  walks int,
  strikeouts int,
  avg float,
  obp float,
  slg float,
  ops float,
  bb_rate float,
  k_rate float,
  bb_k_ratio float
);