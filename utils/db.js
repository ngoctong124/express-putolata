const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(
      process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD),
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log('DB connection successful!'))
    .catch((error) => console.log(error.message));
};

module.exports = connectDB;
