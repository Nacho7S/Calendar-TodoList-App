"use client"

import React, { useState } from "react";
import Modal from './Modal';
import AddEventForm from './AddEventForm';

export default function EventsModal({
  isOpen,
  onClose,
  editingEvent = null,
  events = [],
  setEvents,
  selectedDate
}) {
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("task");
  const [newEventTimeStart, setNewEventTimeStart] = useState("");
  const [newEventTimeDue, setNewEventTimeDue] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [endDate, setEndDate] = useState(new Date());

  // Initialize form with editing event data if provided
  React.useEffect(() => {
    if (editingEvent) {
      setNewEventTitle(editingEvent.title || "");
      setNewEventType(editingEvent.type || "task");
      setNewEventTimeStart(editingEvent.timestart || "");
      setNewEventTimeDue(editingEvent.timeDue || "");
      setNewEventDescription(editingEvent.description || "");
      setEndDate(new Date(editingEvent.endDate) || new Date());
    } else {
      // Reset form when not editing
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventTimeStart("");
      setNewEventTimeDue("");
      setNewEventType("task");
      setEndDate(new Date());
    }
  }, [editingEvent]);

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
          editingEvent ? `/api/calendar?id=${editingEvent._id || editingEvent.id}` : '/api/calendar', 
          {
            method: editingEvent ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
          }
        );

        const result = await response.json();
        
        if (result.success) {
          // Update events in parent component
          if (editingEvent) {
            setEvents(prevEvents => 
              prevEvents.map(e => 
                (e._id === result.data._id || e.id === result.data.id) ? result.data : e
              )
            );
          } else {
            setEvents(prevEvents => [...prevEvents, result.data]);
          }
          onClose();
        } else {
          console.error('Error saving event:', result.message);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/calendar?id=${eventId}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          setEvents(prevEvents => 
            prevEvents.filter(e => (e._id !== eventId && e.id !== eventId))
          );
          onClose();
        } else {
          console.error('Error deleting event:', result.message);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventTimeStart("");
    setNewEventTimeDue("");
    setNewEventType("task");
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={resetForm} 
      title={editingEvent ? "Edit Event" : "Add Event"}
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
        setSelectedDate={() => {}} // This won't be used since date is set from parent
        endDate={endDate}
        setEndDate={setEndDate}
        editingEventId={editingEvent?._id || editingEvent?.id || null}
        handleAddEvent={handleAddEvent}
        resetForm={resetForm}
        handleDeleteEvent={editingEvent ? () => handleDeleteEvent(editingEvent._id || editingEvent.id) : null}
      />
    </Modal>
  );
}