const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.use(express.json());

app.listen(PORT);
