import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import Location from '../components/Location'
const dotenv = require('dotenv');

export const Main = () => {
    const [data, setData] = useState([]);
    let locationlist = <ul></ul>
    /** 
    *  Simple API call to retrieve data on the main page
    */
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
        .then(data => setData(data.results))
        
        
    },[]);

    locationlist = <ul>
        {data.map((e,i)=>
        (
            <li className="locationlist" key={i}>
                <Location
                    data = {e}
                />
            </li>
        ))}
    </ul>
        
  

    return (
        <div className="main">
            Main page
            {locationlist}
            <Button> Testing</Button>
        </div>
    )
}

export default Main