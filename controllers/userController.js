const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register New User
// Register New User
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const user = await User.create({
      name,
      email,
      password,
      phone  // Save phone number
  });

  if (user) {
      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token: generateToken(user._id)
      });
  } else {
      res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
      // Prepare the user response object
      const userResponse = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone, // Include phone number in the response
      };

      if (!user.hasActivePlan) {
          // If user doesn't have an active plan, return user details with a message
          return res.status(200).json({
              ...userResponse,
              message: 'Please purchase a plan to fully access your account.'
          });
      }

      // If the user has an active plan, return user details and token
      res.json({
          ...userResponse,
          token: generateToken(user._id) // Include token only if the user has an active plan
      });
  } else {
    console.log("Invalid email or password");
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


// Get user profile (protected route example)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone, // Include phone number in the response
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
// Update user profile
const updateUserProfile = async (req, res) => {
    console.log(req.body)
    const { name, email } = req.body; // You can add other fields here if necessary

    // Find the user by ID and update the details
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = name || user.name; // Update name if provided, else keep the current value
        user.email = email || user.email; // Update email if provided, else keep the current value

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    if (!(await user.matchPassword(currentPassword))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // This will trigger the hashing middleware
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
};

const updateUser = async (req, res) => {
    const { name } = req.body;
  
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        user.name = name || user.name;
        const updatedUser = await user.save();
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile,changePassword,getAllUsers,deleteUser,updateUser };

