const db = require('../../data/dbConfig');

function get_all() {
  return db('users');
}

function get_by_id(user_id) {
  return db('users')
    .where({ id: user_id })
    .first();
}

function introduce(user) {
  return db('users')
    .insert(user)
    .then(feedback => {
      return db('users');
    });
}
