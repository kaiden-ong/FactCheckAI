const express = require('express');
const router = express.Router();
const { spawn } = require('node:child_process');

router.get('/classify', (req, res) => {
    const input = req.query.input;
    const model = req.query.model;
    
    // Call the Python script with the input
    const python = spawn('python', ['scripts/categorize_script.py', input, model]);
    let dataToSend = '';
    let responseSent = false;
    python.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Error from python script: ${data}`);
        if (!responseSent) {
            res.status(500).send('Internal Server Error');
            responseSent = true;
        }
    });

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (!responseSent) {
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
            responseSent = true;
        }
    });
});

module.exports = router;
