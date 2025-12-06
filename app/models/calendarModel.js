import mongoose, { Schema } from 'mongoose';

const calendarSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  endDate: {
    type: Date,
    required: true
  },
  timeDue: {
    type: String, // Format: "HH:MM"
    required: true
  },
  timestart: {
    type: String, // Format: "HH:MM"
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['meet', 'task', 'event', 'reminder'] // You can add more types as needed
  },
  isEventDone: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true 
});

const Calendar = mongoose.models.Calendar || mongoose.model('Calendar', calendarSchema);

export default Calendar;