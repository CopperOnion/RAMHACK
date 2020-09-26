import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import Location from '../components/Location'
import Search from '../components/Search'

const dotenv = require('dotenv');

export const Main = () => {
    const [data, setData] = useState([]);
    const [searchquery, setSearchquery] = useState("Museum in newyork");

    let locationlist = <ul></ul>
    /** 
    *  Simple API call to retrieve data on the main page
    */
    useEffect(() => {
        const GCLOUD = process.env.REACT_APP_GCLOUD_KEY
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchquery}&key=${GCLOUD}`;
        fetch(proxyurl+url,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(res=> res.json())
        .then(data => setData(data.results))
        
        
    },[searchquery]);

    const lookup = (e) =>{
        e.preventDefault()
        setSearchquery(e.target.value)
    }

    locationlist = <ul className="locationlist" >
        {data.map((e,i)=>
        (
            <li className="locationelement" key={i}>
                <Location
                    data = {e}
                />
            </li>
        ))}
    </ul>
        
  

    return (
        <div className="main">
            <div className="temp">
                <div className="searchbar">
                    
                    <form onSubmit= {lookup}>
                    <div className="form-group">

                            <label >Search for places to go! </label>

                            <input 
                                type="text" 
                                value={searchquery}
                                onChange={e => setSearchquery(e.target.value)}
                                className="form-control" 
                                id="exampleInputEmail1" 
                                aria-describedby="emailHelp" 
                                placeholder="Enter location"/>
                            </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>


            {locationlist}
        </div>
    )
}

export default Main