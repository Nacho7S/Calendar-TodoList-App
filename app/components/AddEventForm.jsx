import React, { useEffect, useState } from 'react';
import { useTheme } from '../providers/themeProvider';

const AddEventForm = ({
  newEventTitle,
  setNewEventTitle,
  newEventType,
  setNewEventType,
  newEventTimeStart,
  setNewEventTimeStart,
  newEventTimeDue,
  setNewEventTimeDue,
  newEventDescription,
  setNewEventDescription,
  selectedDate,
  setSelectedDate,
  endDate,
  setEndDate,
  editingEventId,
  handleAddEvent,
  resetForm,
  handleDeleteEvent
}) => {
  const { theme, t } = useTheme();
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

 
  useEffect(() => {
    if (!editingEventId) {
      
      const newEndDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setEndDate(newEndDate);
    }
  }, [selectedDate, editingEventId]);

  
  useEffect(() => {
    
    const startDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (endDateOnly < startDateOnly) {
      setDateError(t('calendar.endDateBeforeStartDate') || 'End date cannot be before start date');
    } else {
      setDateError('');
    }

    
    if (startDateOnly.getTime() === endDateOnly.getTime()) {
      const [startHours, startMinutes] = newEventTimeStart.split(':').map(Number);
      const [endHours, endMinutes] = newEventTimeDue.split(':').map(Number);
      const startTime = new Date(0, 0, 0, startHours, startMinutes);
      const endTime = new Date(0, 0, 0, endHours, endMinutes);

      if (endTime < startTime) {
        setTimeError(t('calendar.endTimeBeforeStartTime') || 'End time cannot be before start time on the same day');
      } else {
        setTimeError('');
      }
    } else {
      
      setTimeError('');
    }
  }, [selectedDate, endDate, newEventTimeStart, newEventTimeDue, t]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder={t('calendar.eventTitle') || "Event title"}
        value={newEventTitle}
        onChange={(e) => setNewEventTitle(e.target.value)}
        className="w-full p-2 border border-[var(--border-color)] rounded mb-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">{t('calendar.startDate') || "Start Date"}</label>
          <div className="relative">
            <input
              type="date"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`} // YYYY-MM-DD format
              onChange={(e) => {
                const dateStr = e.target.value;
                
                const [year, month, day] = dateStr.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                setSelectedDate(date);
              }}
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all"
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-secondary)]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">{t('calendar.endDate') || "End Date"}</label>
          <div className="relative">
            <input
              type="date"
              value={`${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`}
              onChange={(e) => {
                const dateStr = e.target.value;
                const [year, month, day] = dateStr.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                setEndDate(date);
              }}
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all"
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-secondary)]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error messages */}
      {(dateError || timeError) && (
        <div className="mt-2">
          {dateError && (
            <div className="text-red-500 text-sm mb-1">{dateError}</div>
          )}
          {timeError && (
            <div className="text-red-500 text-sm">{timeError}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">{t('calendar.from') || "From"}</label>
          <div className="relative">
            <input
              type="time"
              value={newEventTimeStart}
              onChange={(e) => setNewEventTimeStart(e.target.value)}
              className={`w-full p-3 border ${
                timeError ? 'border-red-500' : 'border-[var(--border-color)]'
              } rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all`}
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-secondary)]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">{t('calendar.to') || "To"}</label>
          <div className="relative">
            <input
              type="time"
              value={newEventTimeDue}
              onChange={(e) => setNewEventTimeDue(e.target.value)}
              className={`w-full p-3 border ${
                timeError ? 'border-red-500' : 'border-[var(--border-color)]'
              } rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all`}
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-secondary)]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs font-medium text-[var(--text-primary)] mb-2">{t('calendar.type') || "Type:"}</p>
        <div className="flex flex-row gap-2">
          {['task', 'meet', 'event'].map((type) => (
            <p
              key={type}
              className={`px-3 py-2 rounded-xl cursor-pointer ${
                newEventType === type
                  ? "bg-[var(--accent-color)] text-[var(--text-primary)]"
                  : "bg-[color:var(--accent-color)]/[0.2] text-[var(--text-primary)]"
              }`}
              onClick={() => setNewEventType(type)}
            >
              {t(`calendar.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
          ))}
        </div>
      </div>

      <textarea
        placeholder={t('calendar.eventDescription') || "Event description (optional)"}
        value={newEventDescription}
        onChange={(e) => setNewEventDescription(e.target.value)}
        className="w-full p-2 border border-[var(--border-color)] rounded mb-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)]"
        rows={2}
      />

      <div className="flex gap-2">
        <button
          onClick={handleAddEvent}
          disabled={!!dateError || !!timeError}
          className={`${
            !!dateError || !!timeError
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[var(--accent-color)] hover:bg-[color:var(--accent-color)]/[0.8]'
          } text-[var(--text-primary)] px-3 py-1 sm:px-4 rounded text-sm flex-1`}
        >
          {editingEventId ? t('calendar.update') || 'Update' : t('calendar.save') || 'Save'}
        </button>
        <button
          onClick={resetForm}
          className="bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-1 sm:px-4 rounded hover:bg-[var(--hover-bg)] text-sm flex-1 border border-[var(--border-color)]"
        >
          {t('calendar.cancel') || 'Cancel'}
        </button>
        {editingEventId && (
          <button
            onClick={() => handleDeleteEvent(editingEventId)}
            className="bg-red-500 text-white px-3 py-1 sm:px-4 rounded hover:bg-red-600 text-sm flex-1"
          >
            {t('calendar.delete') || 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEventForm;