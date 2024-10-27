const express = require("express");
const router = express.Router();
const { reloadStats, getHitting, getSeasonHitting, getAllSeasonHitting, getTeamHitting, getPlayerCareerHitting, getGameHitting } = require("../controllers/baseballController");

router.route('/').get( getHitting );
router.route('/team').get( getTeamHitting );
router.route('/hitter/:hitter').get( getHitting );
router.route('/season/:season/division/:division').get( getSeasonHitting );
router.route('/seasons').get( getAllSeasonHitting );
router.route('/career/:player').get( getPlayerCareerHitting );
router.route('/game/:gamedate/division/:division').get( getGameHitting );
router.route('/reload').get( reloadStats );



module.exports = router;