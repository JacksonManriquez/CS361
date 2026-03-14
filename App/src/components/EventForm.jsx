import React, { useState, useEffect } from 'react';

const EventForm = ({ event, selectedDate, onSave, onCancel }) => {
  const [title, setTitle] = useState(event ? event.title : '');
  const [date, setDate] = useState(event ? event.date : (selectedDate || ''));
  const [category, setCategory] = useState(event ? event.category : 'Academic');

  const categories = ['Academic', 'Sports', 'Social', 'Club', 'Holiday', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && date) {
      onSave(event ? { ...event, title, date, category } : { title, date, category });
    }
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;