const express = require('express');
const router = express.Router();
const { spawn } = require('node:child_process');

router.get('/classify', (req, res) => {
    const input = req.query.input;
    const model = req.query.model;

    if (!input || !model) {
        return res.status(400).json({ error: 'Input and model parameters are required.' });
    }

    const python = spawn('python', ['scripts/categorize_script.py', input, model], {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let dataToSend = '';
    let responseSent = false;

    python.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data.toString()}`);
        if (!responseSent) {
            res.status(500).json({ error: 'Error from Python script', details: data.toString() });
            responseSent = true;
        }
    });

    python.on('close', (code) => {
        if (!responseSent) {
            if (code === 0) {
                try {
                    const result = JSON.parse(dataToSend);
                    res.json(result);
                } catch (error) {
                    console.error('Error parsing JSON:', error.message);
                    res.status(500).json({ error: 'Error parsing JSON response from Python script.' });
                }
            } else {
                res.status(500).json({ error: `Python script exited with code ${code}` });
            }
            responseSent = true;
        }
    });

    python.on('error', (error) => {
        console.error('Failed to start Python script:', error.message);
        if (!responseSent) {
            res.status(500).json({ error: 'Failed to start Python script', details: error.message });
            responseSent = true;
        }
    });
});

module.exports = router;
