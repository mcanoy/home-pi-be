const express = require("express");
const router = express.Router();
const { getStandings } = require("../controllers/tolucaController");

router.route('/').get( getStandings );
router.route('/standings').get( getStandings );

module.exports = router;