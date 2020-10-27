const app = require('./app');

const port = 3000;

const server = app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});
