const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/signup', async (req, res, next) => {
  const {username, email, password} = req.body;
  const user = new User({
    username,
    email,
    password,
  });

  user.password = await user.encryptPassword(password);
  await user.save();

  const configSecret = process.env.SECRET;
  const token = jwt.sign({id: user._id}, configSecret, {
    expiresIn: 60 * 60 * 24,
  });

  res.json({auth: true, token});
});

router.post('/signin', (req, res, next) => {
  res.json('signin');
});

router.get('/me', (req, res, next) => {
  res.json('me');
});

module.exports = router;
