import { NextResponse } from 'next/server';
import { authenticateUser } from '../../../lib/auth';
import { deleteCurrentUser } from '../../../controllers/users';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    const auth = await authenticateUser(request);
    
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const mockReq = {
      user: { id: auth.user.id }
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
    
    await deleteCurrentUser(mockReq, mockRes);

    const cookieStore = await cookies();
    cookieStore.delete('auth-token')

    return NextResponse.json(responseJson, { status: responseStatus });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during account deletion' },
      { status: 500 }
    );
  }
}