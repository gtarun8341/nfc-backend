const User = require('../models/userModel');
const UserPlan = require('../models/UserPlan');

const getUsersWithPlans = async (req, res) => {
    try {
        const users = await User.find({});
        const userPlans = await UserPlan.find({
            userId: { $in: users.map((user) => user._id) },
        });

        const userWithPlans = users.map((user) => {
            const plan = userPlans.find((p) => p.userId.toString() === user._id.toString());
            return {
                ...user.toObject(),
                plan: plan || null,
            };
        });

        res.status(200).json(userWithPlans);
    } catch (error) {
        console.error("Error fetching user plans:", error);
        res.status(500).json({ message: 'Server error while fetching user plans' });
    }
};

const getUserPlans = async (req, res) => {
    try {
        // Fetch plans for the authenticated user
        const userPlans = await UserPlan.find({ userId: req.user._id });
        
        res.status(200).json(userPlans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve user plans' });
    }
};

module.exports = { getUsersWithPlans,getUserPlans };
