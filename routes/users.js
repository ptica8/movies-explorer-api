const router = require('express').Router();
const { celebrate } = require('celebrate');

const { getUser, updateUserInfo } = require('../controllers/users');
const { updateUserData } = require('../middlewares/validation');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate(updateUserData), updateUserInfo);

module.exports = router;
