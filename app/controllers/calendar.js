import Calendar from '../models/calendarModel.js';
import {connectDB} from '../lib/mongodb.js'

export const getCalendarEvents = async (req, res) => {
  await connectDB()
  try {
    const userId = req.user.id;
    const events = await Calendar.find({ userId }).sort({ date: 1 });
    return { success: true, data: events };
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return { success: false, message: 'Error fetching calendar events' };
  }
};

export const getCalendarEventById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Calendar.findOne({ _id: id, userId });
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    return { success: true, data: event };
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    return { success: false, message: 'Error fetching calendar event' };
  }
};

export const createCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, description, endDate, timeDue, timestart, title, type, isEventDone } = req.body;

    if (!date || !endDate || !timeDue || !timestart || !title || !type) {
      return {
        success: false,
        message: 'Missing required fields: date, endDate, timeDue, timestart, title, type'
      };
    }

    const newEvent = new Calendar({
      userId,
      date: new Date(date),
      description,
      endDate: new Date(endDate),
      timeDue,
      timestart,
      title,
      type,
      isEventDone: isEventDone || false
    });

    const savedEvent = await newEvent.save();
    return { success: true, data: savedEvent };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, message: 'Error creating calendar event' };
  }
};

export const updateCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, description, endDate, timeDue, timestart, title, type, isEventDone } = req.body;

    const updates = {};
    if (date) updates.date = new Date(date);
    if (description !== undefined) updates.description = description;
    if (endDate) updates.endDate = new Date(endDate);
    if (timeDue) updates.timeDue = timeDue;
    if (timestart) updates.timestart = timestart;
    if (title) updates.title = title;
    if (type) updates.type = type;
    if (isEventDone !== undefined) updates.isEventDone = isEventDone;

    const updatedEvent = await Calendar.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return { success: false, message: 'Event not found' };
    }

    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return { success: false, message: 'Error updating calendar event' };
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedEvent = await Calendar.findOneAndDelete({ _id: id, userId });
    if (!deletedEvent) {
      return { success: false, message: 'Event not found' };
    }

    return { success: true, message: 'Event deleted successfully' };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return { success: false, message: 'Error deleting calendar event' };
  }
};

export const toggleEventDone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Calendar.findOne({ _id: id, userId });
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    event.isEventDone = !event.isEventDone;
    await event.save();

    return { success: true, data: event };
  } catch (error) {
    console.error('Error toggling event done status:', error);
    return { success: false, message: 'Error toggling event done status' };
  }
};

export const getCalendarEventsByDateRange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return {
        success: false,
        message: 'startDate and endDate query parameters are required'
      };
    }

    const events = await Calendar.find({
      userId,
      $or: [
        { date: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        {
          $and: [
            { date: { $lte: new Date(startDate) } },
            { endDate: { $gte: new Date(endDate) } }
          ]
        }
      ]
    }).sort({ date: 1 });

    return { success: true, data: events };
  } catch (error) {
    console.error('Error fetching calendar events by date range:', error);
    return { success: false, message: 'Error fetching calendar events' };
  }
};