const schedule = require('node-schedule');
const nhlController = require("./controllers/nhlController");
const { getNextBirthdays } = require("./controllers/birthdayController");

const doit = () => {
  console.log("Scheduling Leafs");
  schedule.scheduleJob('0 12-18/4 * * *', function() {
    nhlController.getNextLeafsGame();
  });

  console.log("Scheduling Raptors");
  schedule.scheduleJob('5 12-18/4 * * *', function() {
    nhlController.getNextRaptorGame();
  });  

  console.log("Scheduling Blue Jays");
  schedule.scheduleJob('10 12-18/4 * * *', function() {
    nhlController.getNextBlueJayGame()
  });

  console.log("Scheduling Birthdays");
  schedule.scheduleJob('45 7 * * *', function() {
    getNextBirthdays();
  });
}

module.exports = { doit }