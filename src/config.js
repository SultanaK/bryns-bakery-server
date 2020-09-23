module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://bryns_bakery@localhost/bryns_orders',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '4000s',
  MAIN_URL: process.env.MAIN_URL || 'http://localhost:3000/',
  EMAIL: process.env.EMAIL || 'brynssweetcreations@yahoo.com',
  EMAIL_PASS: process.env.EMAIL_PASS
  }
  