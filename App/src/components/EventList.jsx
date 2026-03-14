import React from 'react';

const EventList = ({ events, onEdit, onDelete }) => {

  return (

    <div className="event-list">

      <h2>Upcoming Events</h2>

      <ul>

        {events.map(event => (
          <li key={event.id}>
            <span className={`event-category category-${event.category.toLowerCase()}`}>{event.category}</span>
            {event.title} on {event.date}
            <button onClick={() => onEdit(event)}>Edit</button>
            <button onClick={() => onDelete(event.id)}>Delete</button>
          </li>
        ))}

      </ul>

    </div>

  );

};

export default EventList;