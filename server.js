const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('node:child_process');
const app = express();
const port = 4000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/classify', (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
