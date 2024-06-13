const express = require('express');
const router = express.Router();

const predictionRouter = require('./controllers/predict');

router.use('/predict', predictionRouter);

module.exports = router;