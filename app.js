const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const usersRoutes = require('./routes/users');
const errorRoutes = require('./routes/error');
const auth = require('./middlewares/auth');
const serverErrorHandler = require('./middlewares/serverErrorHandler');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(requestLogger);

app.use('/', authRoutes);
app.use('/users', auth, usersRoutes);
app.use('/movies', auth, moviesRoutes);
app.use('/', errorRoutes);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
