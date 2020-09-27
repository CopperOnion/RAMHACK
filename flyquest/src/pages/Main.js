import React, { useState, useEffect, useCallback} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './Main.css'
import Location from '../components/Location'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const dotenv = require('dotenv');

/**
 *  Initial configuration for google maps
 **/ 
 
const containerStyle = {
    width: '40vw',
    height: '80vh'
};
   
const center = {
    lat: -34.397,
    lng: 150.644,
};
 
  
export const Main = () => {
    const [data, setData] = useState([]);
    const [searchquery, setSearchquery] = useState("Museum in newyork");
    const [Cloudkey, SetCloudkey] = useState(process.env.REACT_APP_GCLOUD_KEY)
    const [map, setMap] = React.useState(null)

    /**
     * Functions for loading and unloading the map 
     */
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
      }, [])

    const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
    }, [])

    /**
     * List of locations from the query
     */

    let locationlist = <ul></ul>

    /** 
    *  Simple API call to retrieve data on the main page
    */
    useEffect(() => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchquery}&key=${Cloudkey}`;
        const covid = `https://bigquery.googleapis.com/bigquery/v2/projects/plated-mechanic-290713/datasets/bigquery-public-data:covid19_open_data/tables/bigquery-public-data:covid19_open_data.covid19_open_data`
        fetch(proxyurl+url,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(res=> res.json())
        .then(data => setData(data.results))
        
        
    },[searchquery]);

    /**
     * Go to that specified geographical location
     */

    const lookup = (e) =>{
        console.log(e)
        map.panTo(e)
        map.setZoom(17)
    }

    locationlist = <ul className="locationlist" >
        {data.map((e,i)=>
        (
            <li className="locationelement" key={i}>
                <Location
                    data = {e}
                    action = {lookup}
                />
            </li>
        ))}
    </ul>
        
  

    return (
        <div className="main">
            <div className="left">
                <div className="searchbar">
                    
                    <form >
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
                    </form>

                    <Button onClick={lookup}></Button>
                </div>

                {locationlist}

            </div>

            <div className="right">
                <LoadScript
                    googleMapsApiKey={Cloudkey}
                    >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={1}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    )
}

export default Main