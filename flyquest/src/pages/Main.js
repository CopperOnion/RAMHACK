import React, { useState, useEffect } from 'react';
const dotenv = require('dotenv');

export const Main = () => {
    const [data, setData] = useState({ hits: [] });

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
        .then(data => console.log(data.results))
        
    },[]);
  

    return (
        <div>
            Main page
        </div>
    )
}

export default Main