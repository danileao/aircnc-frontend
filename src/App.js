import React, { useState } from 'react';

import './App.css';

import logo from './assets/logo.svg';

import Routes from './routes';

function App() {

  

  return (
    <div className="App">
      <div className="container">
        <img src={logo} alt="AirCnC"/>

        <div className="content">
          <Routes/>
          
        </div>
      </div>

      <footer className="footer">
      <p>Desenvolvido por  © <strong>Daniele Leão Evangelista</strong></p>
      </footer>
    </div>
  );
}

export default App;
