import User from '@/app/models/userModel';
import { comparePasswordSync, hashPasswordSync } from '@/app/helper/bcrypt';
import { generateToken, verifyToken } from '@/app/helper/jwt';
import { connectDB } from '../lib/mongodb';
import { cookies } from 'next/headers';

// Login function
export const login = async (req, res) => {
  await connectDB();
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password with hashed password
    const isPasswordValid = comparePasswordSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username,
      theme: user.theme,
      language: user.language
    });

    // Return success response with user data (excluding password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        theme: user.theme || 'light', // Include theme from DB
        language: user.language || 'en' // Include language from DB
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    });
  }
};

// Register function
export const register = async (req, res) => {
  await connectDB();
  try {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and email are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash the password
    const hashedPassword = hashPasswordSync(password);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token for the new user
    const token = await generateToken({
      userId: savedUser._id.toString(),
      username: savedUser.username,
    });

    // Return success response with user data (excluding password)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        theme: savedUser.theme || 'light', // Include theme from DB
        language: savedUser.language || 'en' // Include language from DB
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: error.message
    });
  }
};

// Update user preferences (theme and language)
export const updateUserPreferences = async (req, res) => {
  await connectDB();
  try {
    const { theme, language } = req.body;
    const userId = req.user.userId; // Assuming user info is attached to req after JWT verification
    

    console.log(theme, language);
    

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate and update theme if provided
    if (theme !== undefined) {
      const validThemes = ['light', 'dark', 'oled', 'red', 'pink'];
      if (!validThemes.includes(theme)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid theme selected'
        });
      }
      user.theme = theme;
    }

    // Validate and update language if provided
    if (language !== undefined) {
      const validLanguages = ['en', 'ja', 'es', 'id', 'zh', 'ko', 'de', 'fr'];
      if (!validLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid language selected'
        });
      }
      user.language = language;
    }

    // Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      user: {
        id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        theme: updatedUser.theme,
        language: updatedUser.language
      }
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Function to authenticate user for Next.js API routes
export const findLatestDataUser = async (id) => {
  await connectDB();
    
    try {
      // Find the user in database to get fresh data
      const user = await User.findById(id).select('-password');

      if (!user) {
        return {
          success: false,
          status: 404,
          message: 'User not found',
          user: null
        };
      }

      // Return success with user data
      return {
        success: true,
        status: 200,
        user: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          theme: user.theme || 'light',
          language: user.language || 'en'
        }
      };
    } catch (verificationError) {
      return {
        success: false,
        status: 401,
        message: 'Invalid or expired token',
        user: null
      };
    }
};
