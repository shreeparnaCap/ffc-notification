// Loading environment specific config file
const env = process.env.NODE_ENV || 'development';
const config = { "env" : env };
 // eslint-disable-line import/no-dynamic-require

// const config = require(`./env/${env}`); // eslint-disable-line import/no-dynamic-require

