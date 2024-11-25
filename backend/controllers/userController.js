const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Also send token in response for localStorage
    res.status(200).json({ 
      token,
      user: { 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout =  (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};
// exports.logout = (req, res) => {
//   try {
//     // Clear the auth cookie
//     res.cookie('token', '', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       expires: new Date(0), // Immediate expiration
//       path: '/'
//     });
    
//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Logout failed' });
//   }
// };