const { addMedicine, getAllMedicine, getVisibleMedicine } = require("./medicine.service");

module.exports = {
  insertMedicine: (req, res) => {
    const body = req.body;
    const file = req.file;

    // Data to be submitted to the medicine.service.js
    const medicineData = {
      medicine_name: body.medicine_name,
      medicine_price: body.medicine_price,
      medicine_form: body.medicine_form,
      total_medicine: body.total_medicine,
      description: body.description,
      visibility: body.visibility,
      image: file ? `/uploads/medicines/${file.filename}` : null,
    };

    addMedicine(medicineData, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to insert Medicine!",
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
        message: "Medicine inserted!",
      });
    });
  },
  allMedicines: (req, res) => {

    getAllMedicine((error, results) => {
      if (error) {
        return res.status(500).json({
          success: false, 
          message: "Failed to fetch all medicines!"
        })
      } 


      if (!results[0]) {
        return res.status(200).json({
          success: true, 
          message: "No medicine added yet!"
        })
      }

      return res.status(200).json({
        success: true, 
        data: results,
        message: "Medicine Found!!", 
        
      })
    })

  }, 
  visibleMedicines: (req, res) => {

    getVisibleMedicine((error, results) => {
      if (error) {
        return res.status(500).json({
          success: false, 
          message: "Failed to fetch medicines!"
        })
      } 


      if (!results[0]) {
        return res.status(200).json({
          success: true, 
          message: "No medicine added yet!"
        })
      }

      return res.status(200).json({
        success: true, 
        data: results,
        message: "Medicine Found!!", 
        
      })
    })

  }, 

};
