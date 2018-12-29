//npm run dev

const app = require('./app');
const database = require('./database');
const config = require('./config');

database()
  .then(info => {
    if (info)
      console.log(
        `\nConnected to MongoDB\nhost: ${info[0].host}\nport: ${
          info[0].port
        }\nuser: ${info[0].user}\n`
      );
    app.listen(config.PORT, () =>
      console.log(`Example app listening on port ${config.PORT}!\n`)
    );
  })
  .catch(() => {
    console.error('Unable to connect to database');
    process.exit(1);
  });
