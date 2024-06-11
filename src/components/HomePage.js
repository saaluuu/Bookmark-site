import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Personal Bookmark Site</h1>
      <Link to="/login" className="login-link">Click here to login</Link>
    </div>
  );
};

export default HomePage;
