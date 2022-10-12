require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const PORT = 3000 || process.env.PORT;
const { NODE_ENV, DB_PATH } = process.env;

const moviesRoutes = require('./routes/movies');
const usersRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { createUserValidation, loginValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const serverErrorHandler = require('./middlewares/serverErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimiter } = require('./middlewares/limiter');
const NotFoundError = require('./errors/NotFoundError');
const { mongoServer } = require('./configs/index');

const app = express();
app.use(cors());
app.use(helmet());

mongoose
  .connect('mongodb://127.0.0.1:27017/moviesdb')
 // .connect(NODE_ENV === 'production' ? DB_PATH : mongoServer, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.post('/signup', celebrate(createUserValidation), createUser);
app.post('/signin', celebrate(loginValidation), login);

app.use(auth, usersRoutes);
app.use(auth, moviesRoutes);

app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Cтраница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
