import React, { useState } from 'react';

const Calendar = ({ selectedDay, onDaySelect, events = [] }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push('');
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getEventsForDay = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const handleDayClick = (day) => {
    if (day) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onDaySelect(day, dateString);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{monthName} {currentYear}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map(day => <div key={day} className="day-header">{day}</div>)}
      </div>
      <div className="calendar-grid">
        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : [];
          return (
            <div 
              key={index} 
              className={`day ${day && isToday(day) ? 'today' : ''} ${day && selectedDay === day ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="event-indicators">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className={`event-dot category-${event.category.toLowerCase()}`}
                      title={event.title}
                    ></div>
                  ))}
                  {dayEvents.length > 3 && <div className="event-dot more">+{dayEvents.length - 3}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;