const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'pindo',
  password: 'password',
  port: 5432,
});
client.connect(function(err) {
  //if (err) err.send(JSON.stringify({'status': false, 'message': err.message, 'payload': null}));
  if (err) throw err;
  console.log('Connected!');
});

module.exports = client;