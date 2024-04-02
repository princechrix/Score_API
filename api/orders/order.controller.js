const {
  addOrders,
  addCustomers,
  addOrderItems,
  getCustomersById,
  getOrders,
  addPrescription,
  getOrderItems,
  getMedicineById,
  updateOrderStatus,
} = require("./order.service");

module.exports = {
  insertOrder: async (req, res) => {
    const body = req.body;
    const file = req.file;

    const customerData = {
      fullname: body.fullname,
      dob: body.dob,
      address: body.address,
      phone: body.phone,
    };

    addCustomers(customerData, async (error, CustomerResults) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to add Customer!",
          error: error,
        });
      }

      //   If customer has been added! then place the order
      const CustomerId = CustomerResults.insertId;

      if (body.uploads === "true") {
        let newDate = new Date();
        let Year = newDate.getFullYear();
        let month = newDate.getMonth();
        let day = newDate.getDate();

        let currentDate = `${Year}-${month + 1}-${day}`;

        const OrderData = {
          order_type: body.order_type,
          customer_id: CustomerResults.insertId,
          address: body.address,
          message: body.message,
          amount: body.amount,
          uploads: true,
          date_placed: currentDate,
        };

        addOrders(OrderData, async (error, OrderResults) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Failed to place Order!",
              error: error,
            });
          }

          // if the order has been placed then add the prescription
          const prescriptionData = {
            image: file ? `/uploads/prescriptions/${file.filename}` : null,
            customer_id: CustomerId,
            order_id: OrderResults.insertId,
          };

          addPrescription(prescriptionData, (error, prescriptionResults) => {
            if (error) {
              return res.status(500).json({
                success: false,
                message: "Failed to upload prescription!",
                error: error,
              });
            }

            // return res.status(200).json({
            //   success: true,
            //   message: "Prescription sent Successfully!!",
            //   // data: prescriptionResults,
            // });
          });

          return res.status(200).json({
            success: true,
            message: "Your Order has been Placed!",
          });
        });
      } else {
        let newDate = new Date();
        let Year = newDate.getFullYear();
        let month = newDate.getMonth();
        let day = newDate.getDate();

        let currentDate = `${Year}-${month + 1}-${day}`;

        const OrderData = {
          order_type: body.order_type,
          customer_id: CustomerResults.insertId,
          address: body.address,
          message: body.message,
          amount: body.amount,
          date_placed: currentDate,
          uploads: false,
        };

        await addOrders(OrderData, async (error, OrderResults) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Failed to place Order!",
              error: error,
            });
          }

          // if the order has been placed then add the order items

          const order_items = body.order_items;

          // For each item in item's array add item to db table

          order_items.forEach((item) => {
            addOrderItems(
              {
                order_id: OrderResults.insertId,
                medicine_id: item.item_id,
                quantity: item.quantity,
              },
              (error, results) => {
                if (error) {
                  return res.status(500).json({
                    success: false,
                    message: "Failed to insert Order Item",
                    error: error,
                  });
                }
              }
            );
          });

          return res.status(200).json({
            success: true,
            message: "Your Order has been Placed!",
          });
        });
      }
    });
  },
  insertCustomer: (req, res) => {
    const body = req.body;

    addCustomers(body, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to add Customer!",
          error: error,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customer was added Successfully",
      });
    });
  },
  insertOrderItem: (req, res) => {
    const body = req.body;

    addOrderItems(body, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to insert Order Item",
          error: error,
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
      });
    });
  },
  // retrieveOrders: async (req, res) => {

  //   getOrders((error, results) => {
  //     if (error) {
  //       return res.status(500).json({
  //         success: false,
  //         message: "Failed to fetch Orders",
  //         error: error,
  //       });
  //     }

  //     if (!results[0]) {
  //       return res.status(200).json({
  //         success: true,
  //         message: "There are no recent orders!",
  //       });
  //     }

  //     let response = [];

  //     results.forEach((order) => {
  //       getCustomersById({ id: order.customer_id }, (error, customers) => {
  //         if (error) {
  //           return res.status(500).json({
  //             success: false,
  //             message: "Failed to fetch customers!",
  //           });
  //         }
  //         // if(!result[0]) {
  //         //   return res.status(200).json({
  //         //     success: true,
  //         //     message: "No customers was found!"
  //         //   })
  //         // }

  //         response.push({
  //           fullname: customers.fullname,
  //           phone: customers.phone,
  //           address: customers.address,
  //           date: results.date_placed,
  //           uploads: results.uploads,
  //         });
  //       });
  //       console.log();
  //     });

  //     // console.log(results)
  //     return res.status(200).json({
  //       success: true,
  //       message: "Orders was found!",
  //       data: response,
  //     });
  //   });
  // },

  retrieveOrders: async (req, res) => {
    try {
      // Retrieve orders
      const orders = await new Promise((resolve, reject) => {
        getOrders((error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      if (!orders.length) {
        return res.status(200).json({
          success: true,
          message: "There are no recent orders!",
          data: [], // Return empty array if no orders found
        });
      }

      // Fetch associated customer and medicines for each order
      const data = await Promise.all(
        orders.map(async (order) => {
          // Fetch customer
          const customer = await new Promise((resolve, reject) => {
            getCustomersById({ id: order.customer_id }, (error, customers) => {
              if (error) {
                reject(error);
              } else {
                resolve(customers);
              }
            });
          });

          // Fetch medicines associated with the order
          const items = await new Promise((resolve, reject) => {
            getOrderItems({ order_id: order.id }, (error, items) => {
              if (error) {
                reject(error);
              } else {
                // Map over items and fetch medicines for each item
                Promise.all(
                  items.map(
                    (item) =>
                      new Promise((resolve, reject) => {
                        getMedicineById(
                          { id: item.medicine_id },
                          (error, medicine) => {
                            if (error) {
                              reject(error);
                            } else {
                              console.log(medicine);
                              resolve({
                                medicine_id: medicine[0].id,
                                medicine_name: medicine[0].medicine_name,
                              });
                            }
                          }
                        );
                      })
                  )
                )
                  .then((medicines) => resolve(medicines))
                  .catch((error) => reject(error));
              }
            });
          });

          // Return formatted data for the order
          return {
            id: order.id,
            fullname: customer[0].fullname,
            phone: customer[0].phone,
            address: customer[0].address,
            date: order.date_placed,
            uploads: order.uploads,
            order_status: order.order_status,
            medicines: items,
          };
        })
      );

      return res.status(200).json({
        success: true,
        message: "Orders were found!",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders or customers!",
        error: error,
      });
    }
  },

  changeOrderStatus: (req, res) => {
    const body = req.body;

    updateOrderStatus(body, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: error,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order status was updated to ${body.order_status}`,
      });
    });
  },
};
