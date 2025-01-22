const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const { ConnectSessionKnexStore } = require("connect-session-knex");

const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");
/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

const Store = new ConnectSessionKnexStore({
  knex: require("../data/db-config.js"), // Pass the Knex instance
  tablename: "sessions",
  sidfieldname: "sid",
  createtable: true,
  clearInterval: 1000 * 60 * 60,
});

const server = express();

server.use(
  session({
    name: "chocolatechip",
    secret: "it's top secret",
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: false,
    },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: Store, // Use the instantiated store
  })
);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;

/*
  LECTURE QUESTIONS:

    I was trying to use { const Store = require('connect-session-knex')(session) } today, and I kept getting and error telling me that require(...) is not a function, it kept pointing to this same line, what is a way to work aroud this?
    const session = require('express-session')
    
*/
