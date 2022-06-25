const User = require('../auth/users-model');

function validate_registering_user(req, res, next) {
  User.get_all()
    .then(result => {
      if (result.some(x => x.username === req.body.username)) {
        res.status(422).json({ message: 'Aaaaa sorry that username is taken' });
        return;
      } else {

        if (Object.entries(req.body).length !== 2
            || !req.body.hasOwnProperty('username')
            || !req.body.hasOwnProperty('password')) {
          res.status(400).json({ message: ' [ username and password required ] Registering users must have a username and a password, and ONLY a username and a password [???]' });
          return;
        }

        next();
      }
    })
}

function validate_logging_in_user(req, res, next) {
  
  User.get_all()
    .then(result => {
      if (!result.some(x => x.username === req.body.username)) {
        res.status(404).json({ message: ' [ invalid credentials ] Sorry, that user does not exist' });
        return;
      } else {

          if (Object.entries(req.body).length !== 2
              || !req.body.hasOwnProperty('username')
              || !req.body.hasOwnProperty('password') ) {
            res.status(400).json({ message: ' [ username and password required ] Registering users must provide a username and a password, and ONLY a username and a password [???]' });
            return;
          }

        next();
      }
    })
}

module.exports = { validate_registering_user, validate_logging_in_user };
