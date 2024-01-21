const content = require('./contentController');
const talker = require('./googleController');
const moment = require('moment');
const axios = require('axios');

const birthdayHook = process.env.MESSAGE_WEBHOOK_URL;

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

    var message = "";
    var atLeastOneMessage = false;
    bdays.forEach(function(birthday) {
      var nextBirthday = moment(birthday.date);
      nextBirthday.year(now.year());

      daysDiff = nextBirthday.diff(now, 'days');
      if(daysDiff < 0) { //this year's birthday has passed. Check next year
        nextBirthday.year(nextBirthday.year()+1);
        daysDiff = nextBirthday.diff(now, 'days');
      }

      if(daysDiff == 0) {
        message = atLeastOneMessage ? `${message} and ` : ""
        message +=  `Happy Birthday ${birthday.person} `
        atLeastOneMessage = true
      } else if (daysDiff == 1) {
        message = atLeastOneMessage ? `${message} and ` : ""
        message += `It's ${birthday.person}'s birthday tomorrow `
        atLeastOneMessage = true
      } else if(daysDiff < birthday.notifyDays) {
        message = atLeastOneMessage ? `${message} and ` : ""
        message += `${birthday.person} has a birthday in ${daysDiff} days `
        atLeastOneMessage = true
      }
    });

    if(message.length > 0) {
      talker.say(message);
      sendWebhook(message);
    }

    console.log(message);
    return message;
}

function sendWebhook(message) {
  console.warn(`birthday hook ${birthdayHook}`)
  axios.post(birthdayHook, {
    message: message,
    title: "Birthday!"
  })
    .then(function (response) {
      console.warn(`message sent to webhook ${message}`)
    })
    .catch(function (error) {
      console.warn(`failed to send message ${message}`)
      console.error(error.errors);
    });
}

module.exports = { getAllBirthdays, getNextBirthday, getNextBirthdays }