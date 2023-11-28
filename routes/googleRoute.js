const express = require("express");
const router = express.Router();
const { speak, translate, getCurrentTime } = require("../controllers/googleController");

router.route('/talk').get(speak);
router.route('/time').get(getCurrentTime);
router.route('/translate').get(translate);

module.exports = router;