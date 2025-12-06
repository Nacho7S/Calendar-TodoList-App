import { register } from '../../../controllers/users';

// Create a mock response object for the controller function
const createResponse = (data, status = 200) => {
  return Response.json(data, { status });
};

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Create mock request and response objects
    const mockReq = { body };
    let responseData = null;
    let responseStatus = 200;
    
    const mockRes = {
      status: function(code) {
        responseStatus = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        return createResponse(data, responseStatus);
      }
    };

    // Call the controller function
    const result = await register(mockReq, mockRes);
    
    // If the result is a Response object, return it directly
    if (result instanceof Response) {
      return result;
    }
    
    // Otherwise, create and return a response
    return createResponse(responseData, responseStatus);
    
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during registration',
      error: error.message
    }, { status: 500 });
  }
}