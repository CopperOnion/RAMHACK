import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

require("dotenv").config();


function App() {
  const [data, setData] = useState({ hits: [] });


  useEffect(() => {
    const GCLOUD = process.env.GCLOUD_KEY
    console.log(GCLOUD)
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Museum+in+New+york&key=AIzaSyA9AAUYT6sm1_2znZwljF2ddRQyFBKGx-M`;
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
