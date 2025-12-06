import { login } from '../../../controllers/users';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Create mock request and response objects
    console.log(body);
    
    const mockReq = { body };
    let responseData = null;
    let responseStatus = 200;
    let hasToken = false;
    let tokenValue = null;
    
    const mockRes = {
      status: function(code) {
        responseStatus = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        
        // Check if this is a successful login with a token
        if (data.success && data.token) {
          hasToken = true;
          tokenValue = data.token;
        }
        
        return data; // Return the data for further processing
      }
    };

    // Call the controller function
    await login(mockReq, mockRes);
    
    // Create response with the JSON data
    const response = Response.json(responseData, { status: responseStatus });
    
    // Set HTTP-only cookie if there's a token
    if (hasToken && tokenValue) {
      const cookieStore = await cookies();
      cookieStore.set('auth-token', tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'strict',
        path: '/',
      });
    }
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    }, { status: 500 });
  }
}