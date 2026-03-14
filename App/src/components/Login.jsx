import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isRegistering ? '/register' : '/authenticate';
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success || data.authorized) {
        setMessage(isRegistering ? 'Registration successful! Please login.' : 'Login successful!');
        if (!isRegistering) {
          // Store user info and notify parent
          localStorage.setItem('user', JSON.stringify({
            client_id: formData.client_id,
            username: formData.username
          }));
          onLogin(formData);
        } else {
          // Switch to login mode after successful registration
          setIsRegistering(false);
          setFormData({ ...formData, password: '' }); // Clear password for security
        }
      } else {
        setMessage(data.error_message || 'An error occurred');
      }
    } catch (error) {
      setMessage('Network error. Please check if the server is running.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              required
              placeholder="Enter your Email"
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <div className="toggle-mode">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage('');
              setFormData({ ...formData, password: '' });
            }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;