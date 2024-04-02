const pool = require("../../config/database");

module.exports = {
  signup: (data, callback) => {
    pool.query(
      `INSERT INTO users(fullname, email, phone, password) VALUES(?, ?, ?, ?)`,
      [data.fullname, data.email, data.phone, data.password],
      (error, results, fielda) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getUserByPhone: (phone, callback) => {
    pool.query(
      `SELECT * FROM users WHERE phone = ?`,
      [phone],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results[0]);
      }
    );
  },
  allUsers: (callback) => {
    pool.query(
      `SELECT fullname, email, phone FROM users`,
      [],
      (error, results, field) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
