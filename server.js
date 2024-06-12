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
  // const pythonProcess = spawn('python', ['categorize_script.py', input]);

  const python = spawn('python', ['models.py', input]);
  python.stdout.on('data', (data) => {
    console.log('Pipe data from python script ...');
    res.send(data.toString());
  });

  python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
