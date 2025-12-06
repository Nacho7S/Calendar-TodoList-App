import User from '@/app/models/userModel';
import Calendar from '../models/calendarModel';
import { comparePasswordSync, hashPasswordSync } from '@/app/helper/bcrypt';
import { generateToken, verifyToken } from '@/app/helper/jwt';
import { connectDB } from '../lib/mongodb';

export const login = async (req, res) => {
  await connectDB();
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = comparePasswordSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username,
      theme: user.theme,
      language: user.language
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        theme: user.theme || 'light',
        language: user.language || 'en'
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

export const register = async (req, res) => {
  await connectDB();
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and email are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const hashedPassword = hashPasswordSync(password);

    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    const savedUser = await newUser.save();

    const token = await generateToken({
      userId: savedUser._id.toString(),
      username: savedUser.username,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        theme: savedUser.theme || 'light',
        language: savedUser.language || 'en'
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

export const updateUserPreferences = async (req, res) => {
  await connectDB();
  try {
    const { theme, language } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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


export const findLatestDataUser = async (id) => {
  await connectDB();

    try {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return {
          success: false,
          status: 404,
          message: 'User not found',
          user: null
        };
      }

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

export const changePasswordUser = async (req,res) => {
   await connectDB();
  try {

    const userId = req.user.userId;

    const { currentPassword, newPassword } = req.body


    if (!currentPassword || !newPassword) {
          return res.status(400).json(
            { success: false, message: 'Current password and new password are required' },
          );
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json(
        { success: false, message: 'New password must be at least 6 characters long' },
      );
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = comparePasswordSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json(
        { success: false, message: 'Current password is incorrect' },
      );
    }
    

    const hashedNewPassword = hashPasswordSync(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (err) {
    console.error('Error changing password:', err);
    
    return {
        success: false,
        status: 500,
        message: 'Internal server error',
        user: null
      };
  }
}

export const deleteCurrentUser = async (req, res) => {
  await connectDB()
  try {
    
    const user = await User.findById(req.user.id);
    

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await 

    await Calendar.deleteMany({ userId: user.id });
    await User.findByIdAndDelete(user.id);
    
    

    return res.status(200).json({
          success: true,
          message: 'Account deleted successfully'
    });

  } catch (err) {
    return {
        success: false,
        status: 500,
        message: 'Internal server error',
        user: null
      };
  }

}