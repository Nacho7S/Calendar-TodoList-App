import { authenticateUserNextJS, findLatestDataUser } from '../../../controllers/users';
import { authenticateUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    // Call the authentication function in the controller

    const auth = await authenticateUser(request)
    
   if (!auth.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await findLatestDataUser(auth.user.id)

    return Response.json(
      {
        success: result.success,
        ...(result.user && { user: result.user }),
        ...(result.message && { message: result.message })
      },
      { status: result.status }
    );

  } catch (error) {
    console.error('Auth verification error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during verification',
      error: error.message
    }, { status: 500 });
  }
}