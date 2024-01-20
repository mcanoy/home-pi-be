const content = require('./contentController');
const talker = require('./googleController');
const moment = require('moment');

const getAllBirthdays = (req, res) => {
  console.log(content.getBirthdays());
  
  res.status(200).json(content.getBirthdays());
}

//Broadcasts a birthday message if within a person's set range or today or tomorrow
const getNextBirthday = (req, res) => {
  message = getNextBirthdays();
  res.status(200).json({ messsage: message});
}

function getNextBirthdays() {
  console.log("next birthdays");
    bdays = content.getBirthdays();
    now = moment().startOf('day');

    var message = "Calendar is empty";
    bdays.forEach(function(birthday) {
      var nextBirthday = moment(birthday.date);
      nextBirthday.year(now.year());

      daysDiff = nextBirthday.diff(now, 'days');
      if(daysDiff < 0) { //this year's birthday has passed. Check next year
        nextBirthday.year(nextBirthday.year()+1);
        daysDiff = nextBirthday.diff(now, 'days');
      }

      if(daysDiff == 0) {
        message = `Happy Birthday ${birthday.person}`
        talker.say(message);
      } else if (daysDiff == 1) {
        message = `It's ${birthday.person}'s birthday tomorrow`
        talker.say(message);
      } else if(daysDiff < birthday.notifyDays) {
        message = `${birthday.person} has a birthday in ${daysDiff} days`
        talker.say(message);
      }
    });

    return message;
}

module.exports = { getAllBirthdays, getNextBirthday, getNextBirthdays }