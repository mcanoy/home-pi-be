const dotenv = require("dotenv").config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
      version: "1.0.0",
      title: "McAnoy Internals",
      description: "Just goofing around with some home automation.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
  },
  host: `${process.env.HOSTNAME || "localhost" }:${process.env.PORT}`,
  basePath: "/",
  servers: [
    {
      url: `http://${process.env.HOSTNAME || "localhost" }:${process.env.PORT}`,
    },
  ],
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
}

const outputFile = './swagger-output.json';
//const routes = ['./routes/birthdayRoute.js', './routes/contentRoute.js', './routes/googleRoute.js', './routes/nhlRoute.js'];
const endpointsFiles = ["./app.js"]
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

console.log(`port ${process.env.PORT}`);
swaggerAutogen(outputFile, endpointsFiles, doc);

