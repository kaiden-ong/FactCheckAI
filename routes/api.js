const express = require('express');
const router = express.Router();

const predictionRouter = require('./controllers/predict');
const parserRouter = require('./controllers/parser');

router.use('/predict', predictionRouter);
router.use('/parser', parserRouter);

module.exports = router;