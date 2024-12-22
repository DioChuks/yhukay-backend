const app = require('./src/app')
const sequelize = require('./src/config/database');
const logger = require('./src/log/logger')
const config = require('./src/config/appConfig');

let server

sequelize
  .authenticate()
  .then(() => logger.info('Database connected...'))
  .catch((err) => logger.info('Error connecting: ' + err));

sequelize
  .sync()
  .then(() => logger.info('Models synchronized with database'))
  .then(() => server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port} ...`)
    }))
  .catch((err) => logger.info('Error synchronizing models: ' + err));


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = error => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
