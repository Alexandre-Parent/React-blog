import http from 'http'
import express from 'express'
import logging from './config/logging'
import config from './config/config'
import mongoose from 'mongoose'
import firebaseAdmin from 'firebase-admin'

import userRoutes from './routes/userRoutes'
import blogRoutes from './routes/blogRoutes'

const app = express()

/** Server Handling */
const httpServer = http.createServer(app)

/** Connect to Firebase */
let serviceAccount = require('./config/serviceAccountKey.json')

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
})

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info('Mongo Connected')
    })
    .catch((error) => {
        logging.error(error)
    })

/** Log the request */
app.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`)
    })

    next()
})

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next()
})

/** Routes */
app.use('/users', userRoutes)
app.use('/blogs', blogRoutes)

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found')

    res.status(404).json({
        message: error.message
    })
})

/** Listen */
httpServer.listen(config.server.port, () => logging.info(`Server is running ${config.server.host}:${config.server.port}`))