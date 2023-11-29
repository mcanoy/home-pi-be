const GoogleHome = require('google-home-push');
const axios = require('axios');
const moment = require('moment');
const googleIP = process.env.GOOGLE_IP || '10.0.1.1'
const myHome = new GoogleHome(googleIP);
const voices = [ "en-IN", "en-GB", "en-US", "en-AU" ];

const speak = (req, res) => {
  const text = req.query.text;
  let accent = req.query.accent;
  say(text, accent);
  res.status(200).json({ said: text, accent: accent });
}

function say(text, accent) {
  if(!accent) {
    accent = voices[Math.floor(Math.random() * voices.length)];
  }
  console.log(`saying: ${text} with accent ${accent}`);
  myHome.speak(text, accent);
}

const translate = (req, res) => {
  const words = req.query.words;
  const language = req.query.language;

  const url="https://api.funtranslations.com/translate/" + language + ".json";

  axios.post(url, { text: words }, {
    headers: {'Content-Type': 'multipart/form-data'
    }})
  .then(function (response) {
    console.log(response.data);
    say(response.data.contents.translated, "en-US");
    res.status(200).json({ words: words, translation: response.data.contents.translated, language: language})
  })
  .catch(function (error) {
    console.log(error);
    console.log("ERROR=============================================");
    res.status(500).json({ error_message: error });
  });
}


const getCurrentTime = (req, res) => {
  const time = moment();

  if(time.minutes() == 0) {
    talk = `The time is ${time.format("h a")}`;
  } else if(time.minutes() < 10) {
    const h = time.hours() > 12 ? time.hours() - 12 : time.hours();
    talk = `The time is ${h} O ${time.minutes()}`;
  } else {
    talk = `The time is ${time.format("h mm")}`;
  }

  say(talk);

  if(res) {
    res.status(200).json({ time: talk });
  }
}

module.exports = { speak, translate, say, getCurrentTime }