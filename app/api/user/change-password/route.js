import { NextResponse } from 'next/server';
import { authenticateUser } from '../../../lib/auth';
import { changePasswordUser } from '../../../controllers/users';

export async function PUT(request) {
  try {

    const auth = await authenticateUser(request);

    if (!auth.authenticated) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const body = await request.json();

    const mockReq = {
      body: body,
      user: { userId: auth.user.id }
    };

    let responseJson;
    let responseStatus = 200;
    
     const mockRes = {
      status: (status) => {
        responseStatus = status;
        return mockRes;
      },
      json: (data) => {
        responseJson = data;
        return mockRes;
      }
    };

    await changePasswordUser(mockReq, mockRes)

   return NextResponse.json(responseJson, { status: responseStatus });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during password change' },
      { status: 500 }
    );
  }
}