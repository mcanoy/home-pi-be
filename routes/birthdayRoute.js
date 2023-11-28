const express = require("express");
const router = express.Router();
const { getAllBirthdays, getNextBirthday } = require("../controllers/birthdayController");

router.route('/').get( getAllBirthdays );
router.route('/next').get( getNextBirthday );

module.exports = router;