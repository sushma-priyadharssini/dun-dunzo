const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

//setup express app
const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//initialize routes
app.use('', routes);

//listen for requests
app.listen(process.env.port || 4000, function () {
  console.log('listening for requests...');
});
