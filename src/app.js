
import envConfig from './config/env.config.js';
import express from "express"
import __root from "./utils/utils.js";
import handlebars from "express-handlebars";
import appRouter from "./routes/app.router.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import setupSocket from "./chat/socket.js";
import cors from 'cors'
import compression from "express-compression";

const PORT = envConfig.server.PORT
const app = express()
app.use(cors())
const httpserver = app.listen(PORT, () => console.log("Server up."))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.set('strictQuery', false) 
const connection = mongoose.connect(envConfig.mongo.URL,
    { useNewUrlParser: true, useUnifiedTopology: true }) 

app.use(session({
    store: MongoStore.create({
        mongoUrl: envConfig.mongo.URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 5000
    }),
    secret: envConfig.sessions.SECRET,
    resave: true,
    saveUninitialized: false
}))

app.use(compression({ brotli: { enabled: true, zlib: {} } })); 
app.use("/", appRouter)

app.engine('handlebars', handlebars.engine()) 
app.set('views', __root + '/views') 
app.set('view engine', 'handlebars') 
app.use(express.static(__root + '/public')) 

initPassport()
app.use(passport.initialize())
app.use(passport.session())

setupSocket(httpserver)

