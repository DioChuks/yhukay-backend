const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const config = require('./config/environment')
const morgan = require('./log/morgan')
const authLimiter = require('./utils/rateLimiter')
const { errorConverter, errorHandler } = require('./errors/error')
const ApiError = require('./errors/ApiError')
const { StatusCodes } = require('http-status-codes')
const authRoutes = require('./routes/auths');

const url = process.env.CLIENT_URL

const app = express()

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

const whitelist = [url, 'http://localhost:5173']
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors(corsOption))
app.options('*', cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (config.env === 'production') {
  app.use('/api', authLimiter)
}
// Serve static video files
app.use('/videos', express.static('videos'));


app.get('/v1/health-check', (request, response) => {
  response.send({
    status: StatusCodes.OK,
    method: request.method,
    payload: request.body,
    message: 'Running...',
    date: new Date()
  });
})

app.use('/api/auth', authRoutes);

// API route to get the video URL
app.get('/api/video-url/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Check if the file exists
  const filePath = `videos/${filename}.m3u8`;
  if (fs.existsSync(filePath)) {
    res.json({ url: `http://your-backend-domain.com/videos/courses/${filename}.m3u8` });
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});


// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

module.exports = app
