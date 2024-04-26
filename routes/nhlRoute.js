const express = require("express");
const router = express.Router();
const { getNextLeafsGame, getNextRaptorGame, getNextBlueJayGame } = require("../controllers/nhlController");

router.route('/next/leafs').get(getNextLeafsGame);
router.route('/next/raptor').get(getNextRaptorGame);
router.route('/next/jays').get(getNextBlueJayGame);

module.exports = router;