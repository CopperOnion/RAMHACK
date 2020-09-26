import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(() => {
 
    axios.get('http://api.reimaginebanking.com/atms?key=77d04e4dddfe94c57249580f5463ce18')
      .then(res => {
          console.log(res.data)
      })
      .catch(err => {
          console.log(err)
      })

  },[]);
  
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
