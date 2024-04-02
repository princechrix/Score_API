const pool = require("../../config/database");

module.exports = {
  addMedicine: (data, callback) => {
    pool.query(
      `INSERT INTO medicines(medicine_name, medicine_price, medicine_form, total_medicine, description, visibility, medicineImage) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        data.medicine_name,
        data.medicine_price,
        data.medicine_form,
        data.total_medicine,
        data.description,
        data.visibility,
        data.image,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getAllMedicine: (callback) => {
    pool.query(`SELECT * FROM medicines`, [], (error, results, field) => {
      if (error) {
        return callback(error);
      }

      return callback(null, results);
    });
  },
  getVisibleMedicine: (callback) => {
    pool.query(
      `SELECT * FROM medicines WHERE visibility = 'show' ORDER BY id DESC`,
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
