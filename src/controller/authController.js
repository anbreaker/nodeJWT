const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

const User = require('../models/User');

const secretEnv = process.env.SECRET;

router.post('/signup', async (req, res, next) => {
  const {username, email, password} = req.body;
  const user = new User({
    username,
    email,
    password,
  });

  user.password = await user.encryptPassword(password);
  await user.save();

  const token = jwt.sign({id: user._id}, secretEnv, {
    expiresIn: 60 * 60 * 24, //Time seconds
  });

  res.json({auth: true, token});
});

router.get('/me', verifyToken, async (req, res, next) => {
  const user = await User.findById(req.userId, {password: 0});
  if (!user) return res.status(404).send('No User Found');

  res.json(user);
});

router.post('/signin', async (req, res, next) => {
  const {email, password} = req.body;

  const userEmail = await User.findOne({email: email});
  if (!userEmail) return res.status(404).send('The email does not exists');

  const validPassword = await userEmail.validatePassword(password);
  if (!validPassword) return res.status(401).json({auth: false, token: null});

  const token = jwt.sign({id: userEmail._id}, secretEnv, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({auth: true, token});
});

module.exports = router;
