const app = require('./src/app');
const sequelize = require('./src/config/database');
const logger = require('./src/log/logger');
const config = require('./src/config/environment');

const ensureDatabaseExists = async () => {
  const { database, user, password, host, dialect } = config.mysql;

  // Log the config being used for debugging
  logger.info(`Database Config: Database=${database}, User=${user}, Host=${host}`);

  const Sequelize = require('sequelize');
  const adminSequelize = new Sequelize('', user, password, {
    host,
    dialect,
  });

  try {
    const [results] = await adminSequelize.query(`SHOW DATABASES LIKE '${database}'`);
    if (results.length === 0) {
      logger.info(`Database "${database}" not found. Creating it now...`);
      await adminSequelize.query(`CREATE DATABASE ${database}`);
      logger.info(`Database "${database}" created successfully.`);
    } else {
      logger.info(`Database "${database}" already exists.`);
    }
  } catch (error) {
    logger.error('Error ensuring database existence: ', error.message);
    throw error;
  } finally {
    await adminSequelize.close();
  }
};


let server;

const startServer = async () => {
  try {
    await ensureDatabaseExists();

    await sequelize.authenticate();
    logger.info('Database connected...');

    await sequelize.sync();
    logger.info('Models synchronized with database');

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port} ...`);
    });
  } catch (error) {
    logger.error('Error starting server: ', error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});