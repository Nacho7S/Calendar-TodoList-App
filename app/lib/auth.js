import { verifyToken } from '../helper/jwt.js';

export const authenticateUser = async (req) => {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return { authenticated: false, user: null };
    }

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