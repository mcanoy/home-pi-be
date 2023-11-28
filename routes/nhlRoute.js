const express = require("express");
const router = express.Router();
const { getNextLeafsGame, getNextRaptorGame } = require("../controllers/nhlController");

router.route('/next/leafs').get(getNextLeafsGame);
router.route('/next/raptor').get(getNextRaptorGame);


module.exports = router;