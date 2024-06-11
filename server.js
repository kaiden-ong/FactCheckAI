const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 4000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/classify', (req, res) => {
  const input = req.body.input;
  console.log(input)
  // Call the Python script with the input
  const pythonProcess = spawn('python', ['categorize_script.py', input]);

  pythonProcess.stdout.on('data', (data) => {
    res.send(data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
