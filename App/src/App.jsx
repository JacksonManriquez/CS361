import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventList from './components/EventList'
import EventForm from './components/EventForm'
import DayEvents from './components/DayEvents'
import Login from './components/Login'
import './App.css'

function App() {
  // Load events from localStorage or use default events
  const loadEvents = () => {
    try {
      const savedEvents = localStorage.getItem('calendarEvents');
      return savedEvents ? JSON.parse(savedEvents) : [
        { id: 1, title: 'Club Meeting', date: '2023-10-01', category: 'Academic' },
        { id: 2, title: 'Sports Day', date: '2023-10-05', category: 'Sports' },
      ];
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      return [
        { id: 1, title: 'Club Meeting', date: '2023-10-01', category: 'Academic' },
        { id: 2, title: 'Sports Day', date: '2023-10-05', category: 'Sports' },
      ];
    }
  };

  const [events, setEvents] = useState(loadEvents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [dayEventsDate, setDayEventsDate] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing login on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
    setShowAddForm(false);
    setSelectedDay(null);
    setSelectedDate(null);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setEditingEvent(null);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleAddEventFromDay = (date) => {
    setSelectedDate(date);
    setShowDayEvents(false);
    setShowAddForm(true);
  };

  const handleCloseDayEvents = () => {
    setShowDayEvents(false);
    setDayEventsDate(null);
    setSelectedDay(null);
  };

  const handleDaySelect = (day, dateString) => {
    setSelectedDay(day);
    setDayEventsDate(dateString);
    setShowDayEvents(true);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <div className="app">
        <h1>Students Activity Calendar</h1>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Students Activity Calendar</h1>
        <div className="user-info">
          
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      <Calendar selectedDay={selectedDay} onDaySelect={handleDaySelect} events={events} />
      <EventList events={events} onEdit={setEditingEvent} onDelete={deleteEvent} />
      <div className="crud-controls">
        <button onClick={() => setShowAddForm(true)}>Add Event</button>
      </div>
      {showAddForm && (
        <EventForm 
          selectedDate={selectedDate} 
          onSave={addEvent} 
          onCancel={() => { setShowAddForm(false); setSelectedDay(null); setSelectedDate(null); }} 
        />
      )}
      {editingEvent && (
        <EventForm event={editingEvent} onSave={updateEvent} onCancel={() => setEditingEvent(null)} />
      )}
      {showDayEvents && dayEventsDate && (
        <DayEvents 
          date={dayEventsDate}
          events={events}
          onEdit={setEditingEvent}
          onDelete={deleteEvent}
          onAddEvent={handleAddEventFromDay}
          onClose={handleCloseDayEvents}
        />
      )}
    </div>
  );
}

export default App
