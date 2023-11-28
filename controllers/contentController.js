const fs = require('fs');
const fileLocation = process.env.fileStore + "/content.json";
const { say } = require('./googleController');
var contentData;

try {
  contentData = JSON.parse(fs.readFileSync(fileLocation));
} catch(e) {
  console.error("Unable to find content file " + fileLocation);
  contentData = { "school": [], "birthdays" : [] };
}

const getAllData = () => {
  return contentData;
}

const getBirthdays = () => {
  return contentData.birthdays;
}

const getRandom = (req, res) => {
  const quoteIndex = Math.floor(Math.random() * contentData.quotes.length);
  const quote = contentData.quotes[quoteIndex];
  say(quote.quote);
  res.status(200).json({ quote: quote })
}

const getQuotes = (req, res) => {
  res.status(200).json({ quotes: contentData.quotes })
}

const getReminders = () => {
  return contentData;
}

const reload = () => {
  console.log("reloading content.json");
  contentData = JSON.parse(fs.readFileSync(filesLocation));
}

module.exports = { getAllData, getBirthdays, getReminders, reload, getQuotes, getRandom }