const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

const apiRouter = require("./routes/api");

app.use(cors()); // Enable CORS
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
