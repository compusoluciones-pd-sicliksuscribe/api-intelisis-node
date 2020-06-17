const joi = require('joi');


const envDatabaseVarsSchema = joi.object({
  DB_HOST: joi.string().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_DATE_STRINGS: joi.string().default('date'),
  DB_DEBUG: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(false),
  DB_SHOW_QUERIES: joi.boolean()
    .truthy('TRUE')
    .truthy('true')
    .falsy('FALSE')
    .falsy('false')
    .default(false),
  DB_CONNECTION_LIMIT: joi.number().default(10),
}).unknown().required();

const { error, value: envDatabaseVars } = joi.validate(process.env, envDatabaseVarsSchema);
if (error) throw new Error(`Database Config validation error: ${error.message}`);

const config = {
  connectionLimit: envDatabaseVars.DB_SICLICK_ORDENES_CONNECTION_LIMIT,
  host: envDatabaseVars.DB_SICLICK_ORDENES_HOST,
  user: envDatabaseVars.DB_SICLICK_ORDENES_USER,
  password: envDatabaseVars.DB_SICLICK_ORDENES_PASSWORD,
  database: envDatabaseVars.DB_SICLICK_ORDENES_NAME,
  dateStrings: envDatabaseVars.DB_SICLICK_ORDENES_DATE_STRINGS,
  debug: envDatabaseVars.DB_SICLICK_ORDENES_DEBUG,
  showQueries: envDatabaseVars.DB_SICLICK_ORDENES_SHOW_QUERIES,
};

module.exports = config;
