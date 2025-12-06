import { NextResponse } from 'next/server';
import { updateUserPreferences as updatePrefsController } from '@/app/controllers/users';
import { authenticateUser } from '../../../lib/auth';

export async function PUT(request) {
  try {
    const auth = await authenticateUser(request)


    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
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

    await updatePrefsController(mockReq, mockRes);

    return NextResponse.json(responseJson, { status: responseStatus });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}