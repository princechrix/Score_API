const pool = require("../../config/database");

module.exports = {
  addOrders: (data, callback) => {
    pool.query(
      `INSERT INTO orders(order_type, customer_id, address, message, amount, uploads, date_placed) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        data.order_type,
        data.customer_id,
        data.address,
        data.message,
        data.amount,
        data.uploads,
        data.date_placed,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  addCustomers: (data, callback) => {
    pool.query(
      `INSERT INTO customers(fullname, dob, address, phone) VALUES(?, ?, ?, ?)`,
      [data.fullname, data.dob, data.address, data.phone],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  addOrderItems: (data, callback) => {
    pool.query(
      `INSERT INTO order_items(order_id, medicine_id, quantity) VALUES(?, ?, ?)`,
      [data.order_id, data.medicine_id, data.quantity],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getOrders: (callback) => {
    pool.query(
      `SELECT * FROM orders ORDER BY date_placed DESC`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getCustomersById: (data, callback) => {
    pool.query(
      `SELECT * FROM customers WHERE id = ?`,
      [data.id],
      (error, results) => {
        if (error) {
          return callback(error);
        } else {
          return callback(null, results);
        }
      }
    );
  },
  addPrescription: (data, callback) => {
    pool.query(
      `INSERT INTO prescriptions(image, customer_id, order_id) VALUES(?, ?, ?)`,
      [data.image, data.customer_id, data.order_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getOrderItems: (data, callback) => {
    pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [data.order_id],
      (error, results) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getMedicineById: (data, callback) => {
    pool.query(
      `SELECT * FROM medicines WHERE id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  updateOrderStatus: (data, callback) => {
    pool.query(
      `UPDATE orders SET order_status = ? WHERE id = ?`,
      [data.order_status, data.id],
      (error, results) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
};
