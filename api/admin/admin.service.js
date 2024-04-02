const pool = require("../../config/database");

module.exports = {
  signupAdmin: (data, callback) => {
    pool.query(
      `INSERT INTO admin(username, password) VALUES(?, ?)`,
      [data.username, data.password],
      (err, results, field) => {
        if (err) {
          return callback(err);
        }

        return callback(null, results);
      }
    );
  },
  getAdminByName: (username, callback) => {
    pool.query(
      `SELECT * FROM admin WHERE username = ?`,
      [username],
      (error, results, field) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
};
