import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome to the Task Management System</h1>
      <p>Manage your tasks efficiently and collaborate with your team.</p>
    </div>
  );
};

export default Home;