const Order = require('../models/Order');
const User = require('../models/userModel');
const moment = require('moment');

exports.getSalesData = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'productTemplateId',  // Refers to the User model
                select: 'name email phone'  // Select specific fields
            })
            .exec(); // Execute the query

        res.json(orders);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: "Error fetching sales data" });
    }
};

exports.getUserSalesData = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ productTemplateId: userId })
            .populate({
                path: 'productTemplateId',
                select: 'name email phone'
            })
            .select('products totalAmount status trackingNumber invoiceNumber paymentSettledToTemplateOwner gstOnPurchase') // Ensure these fields are selected
            .exec();

        res.json(orders);
    } catch (error) {
        console.error("Error fetching user sales data:", error);
        res.status(500).json({ error: "Error fetching user sales data" });
    }
};

exports.getUserSalesgraphData = async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Get date range from query params
      const userId = req.user.id; // Get userId from token
  console.log(startDate,endDate)
      // Parse the dates, if no date is provided, we default to the entire history
      const start = startDate ? moment(startDate).startOf('day').toDate() : new Date(0); // Default to all time if no start date
      const end = endDate ? moment(endDate).endOf('day').toDate() : new Date(); // Default to now if no end date
  
      // Find orders for the user within the date range or all orders if no date range is given
      const orders = await Order.find({
        productTemplateId: userId,
        createdAt: { $gte: start, $lte: end }, // Filter by date range
      })
      .populate('productTemplateId', 'name') // Populating user fields if necessary
      .exec();
  console.log(orders)
      res.json(orders); // Send the orders back to the frontend
    } catch (error) {
      console.error("Error fetching user sales data:", error);
      res.status(500).json({ error: "Error fetching user sales data" });
    }
  };
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;
        await order.save();
        res.json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Error updating order status" });
    }
};

exports.updateSaleField = async (req, res) => {
    const { id } = req.params;
    const { field, value } = req.body;
  
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order[field] = field === "gstOnPurchase" ? parseFloat(value) : value;
      await order.save();
      res.status(200).json({ message: 'Field updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating field', error });
    }
  };