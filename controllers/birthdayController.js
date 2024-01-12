const content = require('./contentController');
const talker = require('./googleController');
const moment = require('moment');

const getAllBirthdays = (req, res) => {
  console.log(content.getBirthdays());
  
  res.status(200).json(content.getBirthdays());
}

//Broadcasts a birthday message if within a person's set range or today or tomorrow
const getNextBirthday = (req, res) => {
  getNextBirthdays();
  res.status(200).json({ messsage: "ok"});
}

function getNextBirthdays() {
  console.log("next birthdays");
    bdays = content.getBirthdays();
    bdays.forEach(function(birthday) {
      var nextBirthday = moment(birthday.date);
      nextBirthday.year(moment().year());

      daysDiff = nextBirthday.diff(moment(), 'days');
      if(daysDiff < 0) { //this year's birthday has passed. Check next year
        nextBirthday.year(nextBirthday.year()+1);
        daysDiff = nextBirthday.diff(moment(), 'days');
      }

      if(daysDiff == 0) {
        talker.say(`Happy Birthday ${birthday.person}`);
      } else if (daysDiff == 1) {
        talker.say(`It's ${birthday.person}'s birthday tomorrow`);
      } else if(daysDiff < birthday.notifyDays) {
        nextBirthdayMessage = 
        talker.say(`${birthday.person} has a birthday in ${daysDiff} days`);
      }
    });
}

module.exports = { getAllBirthdays, getNextBirthday, getNextBirthdays }