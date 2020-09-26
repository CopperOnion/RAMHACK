import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
const dotenv = require('dotenv');


function App() {
  const [data, setData] = useState({ hits: [] });


  useEffect(() => {
    const GCLOUD = process.env.REACT_APP_GCLOUD_KEY
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Museum+in+New+york&key=${GCLOUD}`;
    fetch(proxyurl+url,{
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      }    
    })
    .then(res=> res.json())
    .then(data => console.log(data.results))
    
  },[]);
  
  return (
    <div className="App">
       Hello teammates !
    </div>
  );
}

export default App;
