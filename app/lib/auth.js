// app/lib/auth.js
import { verifyToken } from '../helper/jwt.js';

// Middleware to authenticate user based on JWT token
export const authenticateUser = async (req) => {
  try {
    // Get token from cookies
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return { authenticated: false, user: null };
    }

    // Parse cookies
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [key, ...value] = cookie.trim().split('=');
        return [key, value.join('=')];
      })
    );
    
    const token = cookies['auth-token'];
    if (!token) {
      return { authenticated: false, user: null };
    }

    // Verify the JWT token
    try {
      const decoded = await verifyToken(token);
      return { authenticated: true, user: { id: decoded.userId || decoded.id } };
    } catch (error) {
      console.error('Token verification error:', error);
      return { authenticated: false, user: null };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, user: null };
  }
};