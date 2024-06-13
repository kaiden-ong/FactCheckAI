const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { spawn } = require('node:child_process');

router.use(bodyParser.json());

router.post('/classify', (req, res) => {
    const input = req.body.input;
    
    // Call the Python script with the input
    const python = spawn('python', ['categorize_script.py', input]);
    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...');
        res.send(data.toString());
    });
  
    python.stderr.on('data', (data) => {
        console.error(`Error from python script: ${data}`);
        res.status(500).send('Internal Server Error');
    });
  
    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

module.exports = router;
