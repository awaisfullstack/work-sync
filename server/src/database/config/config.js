require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    autoLoadModels: true,
    synchronize: false,

    // logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  production: {
    use_env_variable: 'DATABASE_URL_DIRECT', // separate var, non-pooled
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
