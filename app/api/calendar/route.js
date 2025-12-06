// app/api/calendar/route.js
import { NextResponse } from 'next/server';
import { 
  getCalendarEvents, 
  getCalendarEventById, 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent, 
  getCalendarEventsByDateRange,
  toggleEventDone 
} from '../../controllers/calendar.js';
import { authenticateUser } from '../../lib/auth.js';

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Authenticate user
    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Create a mock request object with user info for the controller
    const mockReq = { user: auth.user };
    const mockRes = {}; // Not used by our controller functions

    // If an ID is provided, get a specific event
    if (id) {
      return NextResponse.json(await getCalendarEventById({ ...mockReq, params: { id } }, mockRes));
    } 
    // If startDate and endDate are provided, get events in that date range
    else if (startDate && endDate) {
      return NextResponse.json(await getCalendarEventsByDateRange({ 
        ...mockReq, 
        query: { startDate, endDate } 
      }, mockRes));
    } 
    // Otherwise, get all events for the user
    else {
      return NextResponse.json(await getCalendarEvents(mockReq, mockRes));
    }
  } catch (error) {
    console.error('Error in GET /api/calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authenticate user
    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Create a mock request object with user info and body for the controller
    const mockReq = { 
      user: auth.user,
      body 
    };
    const mockRes = {}; // Not used by our controller functions

    return NextResponse.json(await createCalendarEvent(mockReq, mockRes));
  } catch (error) {
    console.error('Error in POST /api/calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Event ID is required' }, { status: 400 });
    }

    // Authenticate user
    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if this is a toggle operation
    if (Object.keys(body).length === 1 && 'isEventDone' in body) {
      // This is a toggle operation
      const mockReq = { 
        user: auth.user,
        params: { id },
        body 
      };
      const mockRes = {};
      
      return NextResponse.json(await toggleEventDone(mockReq, mockRes));
    }
    
    // Regular update operation
    const mockReq = { 
      user: auth.user,
      params: { id },
      body 
    };
    const mockRes = {}; // Not used by our controller functions

    return NextResponse.json(await updateCalendarEvent(mockReq, mockRes));
  } catch (error) {
    console.error('Error in PUT /api/calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Event ID is required' }, { status: 400 });
    }

    // Authenticate user
    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Create a mock request object with user info and params for the controller
    const mockReq = { 
      user: auth.user,
      params: { id }
    };
    const mockRes = {}; // Not used by our controller functions

    return NextResponse.json(await deleteCalendarEvent(mockReq, mockRes));
  } catch (error) {
    console.error('Error in DELETE /api/calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}