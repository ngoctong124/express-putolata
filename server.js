const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./utils/db');

dotenv.config({ path: './.env' });

connectDB();

const server = app.listen(process.env.PORT, function () {
  console.log(
    `Server listening on port ${process.env.PORT} http://localhost:${process.env.PORT}/`
  );
});
