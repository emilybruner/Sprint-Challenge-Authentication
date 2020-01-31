const router = require('express').Router();
const Users = require('./auth-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secrets.js')



router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        const token = signToken(user); // <<<<<<<<<<<

        res.status(200).json({ token }); // <<<<<<<<<<
      } else {
        res.status(401).json({ message: 'You shall not pass' });
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
  
});

function signToken(user) {
  const payload = {
    userId: user.id,
    department: user.department
  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
