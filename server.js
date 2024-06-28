const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const parserRouter = require('./parser'); // import the parser router

const apiRouter = require('./routes/api');

const app = express();
// const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', apiRouter);

app.use('/api', require('./routes/api'));
app.use('/parser', parserRouter);

// Server listening
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

module.exports = app;
