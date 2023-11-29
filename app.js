const express = require("express");
const dotenv = require("dotenv").config();
const swaggerFile = require('./swagger-output.json');
const swaggerUi = require("swagger-ui-express");
const scheduler = require("./scheduler");
const router = express.Router();
const app = express();
const port = process.env.PORT || 8181;

app.use(express.json());

const UseCORS  = /^true$/i.test(process.env.CORS);

UseCORS && app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use('/api/google',require("./routes/googleRoute"));
router.use('/api/nhl',require("./routes/nhlRoute"));
router.use('/api/birthday',require("./routes/birthdayRoute"));
router.use('/api/content', require("./routes/contentRoute"));

scheduler.doit();
app.use(router);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})