const express = require("express");
const router = express.Router();
const { getQuotes, getRandom } = require("../controllers/contentController");


router.route('/quotes').get(getQuotes);
router.route('/quotes/random').get(getRandom);

module.exports = router;