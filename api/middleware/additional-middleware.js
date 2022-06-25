const User = require('../auth/users-model');

function validate_registering_user(req, res, next) {

  if (req.body.length !== 2
      || !req.body.hasOwnProperty('username')
      || !req.body.hasOwnProperty('password')) {
    res.status(400).json({ message: 'Registering users must have a username and a password, and ONLY a username and a password [???]' });
    return;
  }

  User.get_by_id(req.params.id)
    .then(result => {
      if (result) {
        res.status(400).json({ message: 'Aaaaa sorry that username is taken' });
        return;
      } else {
        next();
      }
    })
}

function validate_logging_in_user(req, res, next) {
  
  if (req.body.length !== 2
      || !req.body.hasOwnProperty('username')
      || !req.body.hasOwnProperty('password') ) {
    res.status(400).json({ message: 'Registering users must provide a username and a password, and ONLY a username and a password [???]' });
    return;
  }

  User.get_by_id(req.params.id)
    .then(result => {
      if (!result) {
        res.status(404).json({ message: 'Sorry, that user does not exist' });
        return;
      } else {
        next();
      }
    })
}

module.exports = { validate_registering_user, validate_logging_in_user };