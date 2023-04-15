
const http = require('http');
const express = require("express");
const logger = require('morgan');
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const MemoryStore = require('memorystore')(session)


require('dotenv').config()

const authRoute = require('./route/auth');
const userRoute = require('./route/user');
const errHandler = require('./route/error');

const {sequelize, ping} = require('./model');

const {useStrategy} = require('./controller');
useStrategy();

const app = express();
app.use(cors({
  origin:true,
  credentials:true
}));

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
}));


app.use(helmet.hidePoweredBy());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use(errHandler);

const server = http.createServer(app);

async function main(){
  console.debug('Initializing DB');
  await sequelize.sync({force:true});
	console.debug(`App served as port ${process.env.PORT}`);
	server.listen(process.env.PORT);
}

main();
