const Customer = require("../models/customerModel");

const authController = {
  createCustomer: async (req, res) => {
    try {
      const {
        customer_id,
        first_name,
        middle_name,
        last_name,
        customer_email,
        phone_no,
        dob,
      } = req.body;

      // Check if customer id is available
      if (!customer_id) {
        return res.json({
          error: "Customer ID is required.",
        });
      }

      //  Check customer is unique or not
      const exist = await Customer.findOne({ customer_id });
      if (exist) {
        return res.json({
          error: "This customer already exists.",
        });
      }

      // Check if first_name was entered
      if (!first_name) {
        return res.json({
          error: "First name is required.",
        });
      }

      // Check if last_name was entered
      if (!last_name) {
        return res.json({
          error: "Last name is required.",
        });
      }

      const newCustomer = new Customer({
        customer_id,
        first_name,
        middle_name,
        last_name,
        customer_email,
        phone_no,
        dob,
      });

      //Save mongodb
      await newCustomer.save();

      res.json({
        msg: "Customer added successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },

  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const customerId = req.params.id;

      const deletedCustomer = await Customer.findOneAndDelete({
        customer_id: customerId,
      });
      if (!deletedCustomer)
        return res.status(404).json({ msg: "Customer not found." });
      res.json({ msg: "Customer deleted successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const {
        first_name,
        middle_name,
        last_name,
        customer_email,
        phone_no,
        dob,
      } = req.body;
      const customerId = req.params.id;

      //  Check customer is unique or not
      const exist = await Customer.findOne({ customer_id: customerId });
      if (!exist) {
        return res.json({
          error: "Invalid customer ID.",
        });
      }

      // Check if first_name was entered
      if (!first_name) {
        return res.json({
          error: "First name is required.",
        });
      }

      // Check if last_name was entered
      if (!last_name) {
        return res.json({
          error: "Last name is required.",
        });
      }

      await Customer.findOneAndUpdate(
        { customer_id: customerId },
        {
          first_name,
          middle_name,
          last_name,
          customer_email,
          phone_no,
          dob,
        }
      );

      res.json({ msg: "Updated the customer data." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = authController;
