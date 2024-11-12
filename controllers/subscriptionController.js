const SubscriptionPlan = require('../models/SubscriptionPlan');

// Add a new subscription plan
const addSubscriptionPlan = async (req, res) => {
  try {
    const { planName, price, duration, description } = req.body;

    const newPlan = new SubscriptionPlan({
      planName,
      price,
      duration,
      description,
    });

    await newPlan.save();
    res.status(201).json({ message: 'Subscription Plan added successfully', plan: newPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding subscription plan' });
  }
};

// Get all subscription plans
const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
};

// Edit a subscription plan
const updateSubscriptionPlan = async (req, res) => {
  const { id } = req.query;
  const { planName, price, duration, description } = req.body;

  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { planName, price, duration, description },
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Subscription Plan updated successfully', plan: updatedPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating subscription plan' });
  }
};

// Delete a subscription plan
const deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Subscription Plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting subscription plan' });
  }
};

module.exports = { addSubscriptionPlan, getAllSubscriptionPlans, updateSubscriptionPlan, deleteSubscriptionPlan };
