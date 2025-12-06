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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const mockReq = { user: auth.user };
    const mockRes = {};

    if (id) {
      return NextResponse.json(await getCalendarEventById({ ...mockReq, params: { id } }, mockRes));
    }
    else if (startDate && endDate) {
      return NextResponse.json(await getCalendarEventsByDateRange({
        ...mockReq,
        query: { startDate, endDate }
      }, mockRes));
    }
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
    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const mockReq = {
      user: auth.user,
      body
    };
    const mockRes = {};

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

    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (Object.keys(body).length === 1 && 'isEventDone' in body) {
      const mockReq = {
        user: auth.user,
        params: { id },
        body
      };
      const mockRes = {};

      return NextResponse.json(await toggleEventDone(mockReq, mockRes));
    }

    const mockReq = {
      user: auth.user,
      params: { id },
      body
    };
    const mockRes = {};

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

    const auth = await authenticateUser(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const mockReq = {
      user: auth.user,
      params: { id }
    };
    const mockRes = {};

    return NextResponse.json(await deleteCalendarEvent(mockReq, mockRes));
  } catch (error) {
    console.error('Error in DELETE /api/calendar:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}