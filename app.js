"use strict";

// load modules
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const db = require("./models");
const userRoutes = require("./routes/users");
const gameRoutes = require("./routes/games");
const cardRoutes = require("./routes/cards");
const messageRoutes = require("./routes/messages");
const indexRoutes = require("./routes/index");
const { notFound, globalError } = require("./middleware/errors");
const { testConnection } = require("./middleware/utils");

// create the Express app
const app = express();

// Enable All CORS Requests
app.use(cors());

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// adds routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/messages", messageRoutes);
app.use(indexRoutes);

// send 404 if no other route matched
app.use(notFound);

// setup a global error handler
app.use(globalError);

// set our port
app.set("port", process.env.PORT);

// Test the database connection.
testConnection();

// ...

// Sync models with database
// db.sequelize.sync({ force: true }).then(() => { //don't drop existing tables
// // db.sequelize.sync().then(() => {
//   // start listening on our port
//   const server = app.listen(app.get('port'), () => {
//     console.log(`Express server is listening on port ${server.address().port}`);
//   });
// }).catch((error) => {
//   console.error('Unable to connect to the database:', error);
// });

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
