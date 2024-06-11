import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = { username, password };

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the username is already taken
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      alert('Username already exists');
      return;
    }

    // Add the new user to the users array
    users.push(newUser);

    // Save the updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    navigate('/login');
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
