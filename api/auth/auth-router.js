const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { validate_registering_user, validate_logging_in_user } = require('../middleware/additional-middleware');
const User = require('./users-model');
const secret = require('../secrets');
const jwt = require('jsonwebtoken');

function generate_token(user) {
  const payload = {
                    subject: user.user_id,
                    username: user.username,  
                  };
  const options = {
                    expiresIn: '1d',
                  };
  return jwt.sign(payload, secret, options);
}



router.post('/register', validate_registering_user, (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

    const hash = bcrypt.hashSync(req.body.password,5);

    req.body.password = hash;

    return User.introduce(req.body)
      .then(result => {
        res.status(201).json(result);
      })

});

router.post('/login', validate_logging_in_user, (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

  User.get_all()
    .then(result => {
      let user = '';
      for (let i = 0; i < result.length; i++) {
        if (result[i].username === req.body.username
            && bcrypt.compareSync(req.body.password,result[i].password)) {
          user = result[i];
        }
      }

      if(!user || user.username !== req.body.username) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      } else {
        const token = generate_token(user);
        res.status(200).json({ 
          message: `Success! Here is your token:`, 
          token, 
        });
      }
    })

});

module.exports = router;
