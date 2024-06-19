const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { spawn } = require('node:child_process');

router.use(bodyParser.json());

router.get('/classify', (req, res) => {
    const input = req.query.input;
    // Call the Python script with the input
    const python = spawn('python', ['scripts/categorize_script.py', input]);
    let dataToSend = '';
    python.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Error from python script: ${data}`);
        res.status(500).send('Internal Server Error');
    });

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            try {
                const result = JSON.parse(dataToSend);
                res.json(result);
            } catch (error) {
                res.status(500).send('Error parsing JSON response from Python script.');
            }
        } else {
            res.status(500).send(`Python script exited with code ${code}`);
        }
    });
});

module.exports = router;
