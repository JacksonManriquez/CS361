import React from 'react';

const DayEvents = ({ date, events, onEdit, onDelete, onAddEvent, onClose }) => {
  const dayEvents = events.filter(event => event.date === date);

  return (
    <div className="day-events-overlay">
      <div className="day-events-modal">
        <h3>Events for {new Date(date).toLocaleDateString()}</h3>
        {dayEvents.length === 0 ? (
          <p>No events scheduled for this day.</p>
        ) : (
          <ul className="day-events-list">
            {dayEvents.map(event => (
              <li key={event.id} className="day-event-item">
                <span className={`event-category category-${event.category.toLowerCase()}`}>
                  {event.category}
                </span>
                <span className="event-title">{event.title}</span>
                <div className="event-actions">
                  <button onClick={() => onEdit(event)}>Edit</button>
                  <button onClick={() => onDelete(event.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="day-events-actions">
          <button onClick={() => onAddEvent(date)}>Add Event</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DayEvents;