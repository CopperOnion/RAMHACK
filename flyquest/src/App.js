import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Main from './pages/Main'
import About from './pages/About'

function App() {
  
  return (
    <Router>

    <div className="App">
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>

        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
