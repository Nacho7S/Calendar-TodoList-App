// app/api/user/preferences/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateUserPreferences as updatePrefsController } from '@/app/controllers/users';
import { authenticateUser } from '../../../lib/auth';

export async function PUT(request) {
  try {
    // Get token from cookies or authorization header

    const auth = await authenticateUser(request)
    
    
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Create a mock request object to pass to the controller
    const mockReq = {
      body: body,
      user: { userId: auth.user.id }
    };

    // Create a mock response object to capture controller response
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

    // Call the controller function
    await updatePrefsController(mockReq, mockRes);

    return NextResponse.json(responseJson, { status: responseStatus });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}