require('dotenv').config()
module.exports = {
  "development": {
    "username": process.env.POSTGRES_DEVELOPMENT_USERNAME,
    "password": process.env.POSTGRES_DEVELOPMNET_PASSWORD,
    "database": process.env.POSTGRES_DEVELOPMENT_DATABASE,
    "host": process.env.POSTGRES_DEVELOPMENT_HOST,
    "dialect": process.env.POSTGRES_DEVELOPMENT_DIALECT
  },
  "test": {
    "username": process.env.POSTGRES_TEST_USERNAME,
    "password": process.env.POSTGRES_TEST_PASSWORD,
    "database": process.env.POSTGRES_TEST_DATABASE,
    "host": process.env.POSTGRES_TEST_HOST,
    "dialect": process.env.POSTGRES_TEST_DIALECT
  },
  "production": {
    "username": process.env.POSTGRES_PRODUCTION_USERNAME,
    "password": process.env.POSTGRES_PRODUCTION_PASSWORD,
    "database": process.env.POSTGRES_PRODUCTION_DATABASE,
    "host": process.env.POSTGRES_PRODUCTION_HOST,
    "dialect": process.env.POSTGRES_PRODUCTION_DIALECT
  }
}
