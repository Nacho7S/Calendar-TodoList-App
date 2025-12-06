"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '../providers/themeProvider';
import Modal from './Modal';
import AddEventForm from './AddEventForm';

// Helper functions
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getDaysInPreviousMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0).getDate();

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("task");
  const [newEventTimeStart, setNewEventTimeStart] = useState("");
  const [newEventTimeDue, setNewEventTimeDue] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [editingEventId, setEditingEventId] = useState(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  const { theme, t } = useTheme();

  const months = [
    t('calendar.months.january') || "January",
    t('calendar.months.february') || "February",
    t('calendar.months.march') || "March",
    t('calendar.months.april') || "April",
    t('calendar.months.may') || "May",
    t('calendar.months.june') || "June",
    t('calendar.months.july') || "July",
    t('calendar.months.august') || "August",
    t('calendar.months.september') || "September",
    t('calendar.months.october') || "October",
    t('calendar.months.november') || "November",
    t('calendar.months.december') || "December"
  ];

  const weekdays = [
    t('calendar.weekdays.sunday') || "Sunday",
    t('calendar.weekdays.monday') || "Monday",
    t('calendar.weekdays.tuesday') || "Tuesday",
    t('calendar.weekdays.wednesday') || "Wednesday",
    t('calendar.weekdays.thursday') || "Thursday",
    t('calendar.weekdays.friday') || "Friday",
    t('calendar.weekdays.saturday') || "Saturday"
  ];

  // Load events on mount
  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  // Set endDate to selectedDate when selectedDate changes
  useEffect(() => {
    setEndDate(selectedDate);
  }, [selectedDate]);


  // Fetch events from API
  const fetchCalendarEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/calendar');
      const data = await response.json();


      if (data.success) setEvents(data.data);
      else console.error('Error fetching events:', data.message);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle event done status
  const toggleEventDone = async (event) => {
    try {
      const response = await fetch(`/api/calendar?id=${event._id || event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEventDone: !event.isEventDone }),
      });

      const result = await response.json();

      if (result.success) {
        setEvents(prevEvents =>
          prevEvents.map(e => e._id === result.data._id ? result.data : e)
        );
      } else {
        console.error('Error toggling event done status:', result.message);
      }
    } catch (error) {
      console.error('Error toggling event done status:', error);
    }
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const daysInPrevMonth = getDaysInPreviousMonth(currentDate);

    const days = [];

    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i),
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      });
    }

    // Add next month's leading days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      });
    }

    return days;
  };

  // Navigation
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1);
      return newDate;
    });
  };

  // Event handling
  const handleDateClick = (date) => setSelectedDate(date);

  const handleAddEvent = async () => {
    if (selectedDate && newEventTitle.trim() && newEventTimeStart && newEventTimeDue) {
      try {
        const eventData = {
          date: selectedDate,
          endDate: endDate,
          timestart: newEventTimeStart,
          timeDue: newEventTimeDue,
          title: newEventTitle,
          type: newEventType,
          description: newEventDescription,
          isEventDone: false,
        };

        const response = await fetch(
          editingEventId ? `/api/calendar?id=${editingEventId}` : '/api/calendar',
          {
            method: editingEventId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
          }
        );

        const result = await response.json();

        if (result.success) {
          fetchCalendarEvents();
          resetForm();
        } else {
          console.error('Error saving event:', result.message);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const handleEditEvent = (event) => {
    setNewEventTitle(event.title);
    setNewEventType(event.type);
    setNewEventTimeStart(event.timestart);
    setNewEventTimeDue(event.timeDue);
    setNewEventDescription(event.description || "");
    setSelectedDate(new Date(event.date));
    setEndDate(new Date(event.endDate));
    setEditingEventId(event._id || event.id);
    setShowAddEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/calendar?id=${eventId}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) fetchCalendarEvents();
        else console.error('Error deleting event:', result.message);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventTimeStart("");
    setNewEventTimeDue("");
    setNewEventType("task");
    setShowAddEventModal(false);
    setEditingEventId(null);
  };

  // Filter events for a specific date
  const getEventsForDate = (date) => {


    return events.filter((event) => {
      // Convert event dates to Date objects if they're strings
      const eventStart = typeof event.date === 'string' ? new Date(event.date) : event.date;
      const eventEnd = typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate || eventStart;

      // Normalize all dates to midnight for comparison
      const compareDate = new Date(date.toDateString());
      const start = new Date(eventStart.toDateString());
      const end = new Date(eventEnd.toDateString());

      // Check if the date falls within the event's date range (inclusive)
      return compareDate >= start && compareDate <= end;
    });
  };

  // Check if date is today or selected
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen w-screen bg-[var(--bg-primary)] p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-[100vw] mx-auto flex flex-col lg:flex-row gap-3 sm:gap-5">
        {/* Calendar Grid */}
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 md:mb-6 flex-1 border border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <select
                value={currentDate.getMonth()}
                onChange={(e) => {
                  const newMonth = parseInt(e.target.value);
                  setCurrentDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(newMonth);
                    return newDate;
                  });
                }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-[var(--text-primary)]"
              >
                {months.map((month, index) => (
                  <option key={month} value={index} className="text-[var(--text-primary)] bg-[var(--bg-primary)]">
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  const newYear = parseInt(e.target.value);
                  setCurrentDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setFullYear(newYear);
                    return newDate;
                  });
                }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-[var(--text-primary)]"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year} className="text-[var(--text-primary)] bg-[var(--bg-primary)]">
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-1 ml-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="bg-[var(--accent-color)] text-[var(--text-primary)] px-3 py-2 sm:px-4 rounded hover:bg-[color:var(--accent-color)]/[0.8] transition-colors text-sm sm:text-base"
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="bg-[var(--accent-color)] text-[var(--text-primary)] px-3 py-2 sm:px-4 rounded hover:bg-[color:var(--accent-color)]/[0.8] transition-colors text-sm sm:text-base"
              >
                →
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="hidden sm:grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {weekdays.map((day) => (
              <div key={day} className="text-center font-semibold text-[var(--text-secondary)] py-1 sm:py-2 text-xs sm:text-sm">
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Mobile Weekday Headers */}
          <div className="sm:hidden grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center font-semibold text-[var(--text-secondary)] py-1 text-xs">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day.fullDate);

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.fullDate)}
                  className={`
                    relative pt-1 h-[15vh] max-sm:h-[10vh] border text-center cursor-pointer rounded transition-all
                    ${day.isCurrentMonth ? "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]" : "text-[var(--text-secondary)]"}
                    ${isToday(day.fullDate) ? "bg-[color:var(--accent-color)]/[0.2] border border-[var(--accent-color)]" : ""}
                    ${isSelected(day.fullDate) ? "bg-[var(--accent-color)] text-white" : ""}
                    border-[var(--border-color)]
                  `}
                >
                  <div className="text-xs sm:text-sm md:text-base font-medium">
                    {day.date}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center mt-0 sm:mt-1">
                      <div className="flex flex-col gap-1 sm:gap-2 max-h-24 overflow-y-auto">
                        {dayEvents.slice(0, 5).map((event) => (
                          <div
                            key={event._id || event.id}
                            className={`sm:ps-2 sm:pe-2 bg-[color:var(--accent-color)]/[0.1] rounded border text-xs cursor-pointer hover:bg-[color:var(--accent-color)]/[0.2] ${
                              event.isEventDone ? 'line-through opacity-75' : ''
                            } border-[var(--border-color)]`}
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   handleEditEvent(event);
                            // }}
                          >
                            <h3 className="font-medium text-[var(--text-primary)] max-sm:text-ellipsis max-sm:truncate max-sm:max-w-[100px]">
                              {event.title}
                            </h3>
                          </div>
                        ))}
                        {dayEvents.length > 5 && (
                          <div className="text-xs text-[var(--text-secondary)] text-center">
                            +{dayEvents.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Panel */}
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-3 sm:p-4 md:p-6 lg:w-80 xl:w-96 border border-[var(--border-color)]">
          {selectedDate && (
            <>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[var(--text-primary)]">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </h2>

              {/* Desktop Add Event Button - Only visible on larger screens */}
              <button
                onClick={() => {
                  setEditingEventId(null);
                  setShowAddEventModal(true);
                }}
                className="bg-[var(--accent-color)] text-[var(--text-primary)] px-3 py-2 sm:px-4 rounded hover:bg-[color:var(--accent-color)]/[0.8] mb-3 md:mb-4 text-sm sm:text-base w-full hidden sm:block"
              >
                + {t('calendar.addEvent') || "Add Event"}
              </button>

              <Modal
                isOpen={showAddEventModal}
                onClose={resetForm}
                title={editingEventId ? t('calendar.editEvent') || "Edit Event" : t('calendar.addEvent') || "Add Event"}
              >
                <AddEventForm
                  newEventTitle={newEventTitle}
                  setNewEventTitle={setNewEventTitle}
                  newEventType={newEventType}
                  setNewEventType={setNewEventType}
                  newEventTimeStart={newEventTimeStart}
                  setNewEventTimeStart={setNewEventTimeStart}
                  newEventTimeDue={newEventTimeDue}
                  setNewEventTimeDue={setNewEventTimeDue}
                  newEventDescription={newEventDescription}
                  setNewEventDescription={setNewEventDescription}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  editingEventId={editingEventId}
                  handleAddEvent={handleAddEvent}
                  resetForm={resetForm}
                  handleDeleteEvent={handleDeleteEvent}
                />
              </Modal>

              <div className="space-y-1 sm:space-y-2 max-h-60 overflow-y-auto">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event._id || event.id}
                    className={`p-2 md:p-3 bg-[color:var(--accent-color)]/[0.1] rounded border text-sm flex justify-between items-start ${
                      event.isEventDone ? 'bg-green-500/[0.2] opacity-75' : ''
                    } border-[var(--border-color)]`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={event.isEventDone}
                          onChange={() => toggleEventDone(event)}
                          className="h-4 w-4 rounded accent-[var(--accent-color)]"
                        />
                        <h3 className={`font-medium text-[var(--text-primary)] text-sm ${
                          event.isEventDone ? 'line-through' : ''
                        }`}>
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {event.timestart} - {event.timeDue}
                      </p>
                      {event.description && (
                        <p className="text-xs text-[var(--text-primary)] mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                      className="ml-2 text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                    >
                      {t('calendar.edit') || "Edit"}
                    </button>
                  </div>
                ))}
                {getEventsForDate(selectedDate).length === 0 && !isLoading && (
                  <p className="text-[var(--text-secondary)] text-center py-2 text-sm">
                    {t('calendar.noEvents') || "No events"}
                  </p>
                )}
                {isLoading && (
                  <p className="text-[var(--text-secondary)] text-center py-2 text-sm">
                    {t('calendar.loading') || "Loading..."}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Add Event Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 mb-2 bg-[var(--bg-primary)] rounded-lg shadow-xl p-2 w-48 border border-[var(--border-color)]">
            <button
              onClick={() => {
                setEditingEventId(null);
                setShowAddEventModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded flex items-center"
            >
              <span className="mr-2">📅</span> {t('calendar.addEvent') || "Add Event"}
            </button>
            <button
              onClick={() => {
                // You can add more options here if needed
                setShowFloatingMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded flex items-center"
            >
              <span className="mr-2">📋</span> {t('calendar.addTask') || "Add Task"}
            </button>
            <button
              onClick={() => {
                // You can add more options here if needed
                setShowFloatingMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded flex items-center"
            >
              <span className="mr-2">🔔</span> {t('calendar.addReminder') || "Add Reminder"}
            </button>
          </div>
        )}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            showFloatingMenu ? 'bg-red-500' : 'bg-green-500'
          } text-white hover:bg-green-600 focus:outline-none`}
        >
          {showFloatingMenu ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
