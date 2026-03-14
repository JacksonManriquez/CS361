import React, { useState, useEffect, useCallback } from 'react';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ status: '', message: '' });
  const [passwordTimeout, setPasswordTimeout] = useState(null);

  // Debounced password validation
  const validatePassword = useCallback(async (password) => {
    if (!password || password.length < 3) {
      setPasswordValidation({ status: '', message: '' });
      return;
    }

    try {
      const response = await fetch('/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // zxcvbn returns a score from 0-4
        const score = data.score;
        let status, message;

        switch (score) {
          case 0:
            status = 'very-weak';
            message = 'Very weak - easily guessable';
            break;
          case 1:
            status = 'weak';
            message = 'Weak - very guessable';
            break;
          case 2:
            status = 'fair';
            message = 'Fair - somewhat guessable';
            break;
          case 3:
            status = 'good';
            message = 'Good - safely unguessable';
            break;
          case 4:
            status = 'strong';
            message = 'Strong - very unguessable';
            break;
          default:
            status = 'unknown';
            message = 'Password strength: Unknown';
        }

        setPasswordValidation({
          score: score,
          status: status,
          message: message
        });
      } else {
        setPasswordValidation({
          status: 'error',
          message: data.error_message || 'Password validation failed'
        });
      }
    } catch (error) {
      console.warn('Password validation error:', error);
      setPasswordValidation({
        status: 'error',
        message: 'Unable to validate password'
      });
    }
  }, [formData.client_id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
    };
  }, [passwordTimeout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Handle password validation with debouncing
    if (name === 'password' && isRegistering) {
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }

      const timeout = setTimeout(() => {
        validatePassword(value);
      }, 500); // 500ms delay after user stops typing

      setPasswordTimeout(timeout);
    }
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

          // Call microservice on port 3002 with dummy data
          try {
            const microserviceResponse = await fetch('/email/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event: 'user_login',
                user_id: `${formData.client_id}_${formData.username}`,
                email: formData.client_id,
                subject: "Sign In Alert",
                message: "You have successfully signed in.",
              }),
            });

            if (microserviceResponse.ok) {
              console.log('Microservice notification sent successfully');
            } else {
              console.warn('Microservice notification failed:', microserviceResponse.status);
            }
          } catch (error) {
            console.warn('Failed to contact microservice:', error);
            // Don't fail login if microservice is unavailable
          }

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
            {isRegistering && passwordValidation.message && (
              <div className={`password-validation ${passwordValidation.status}`}>
                Score: {passwordValidation.score}/4 - {passwordValidation.message}
              </div>
            )}
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