import React, { useState, useEffect, useCallback} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './Main.css'
import Location from '../components/Location'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
var _ = require('lodash');
var states = require('us-state-codes');

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
    const [searchquery, setSearchquery] = useState("");
    const [Cloudkey, SetCloudkey] = useState(process.env.REACT_APP_GCLOUD_KEY)
    const [map, setMap] = React.useState(null)
    const [coviddata, setCoviddata] = useState([])
    const [usCovid, setUsCovid] = useState([])
 
    let marker;

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
    *  Simple API call to retrieve open covid data
    */
    useEffect(()=>{
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
        const covid = `https://storage.googleapis.com/covid19-open-data/v2/latest/main.json`
        fetch(proxyurl+covid,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(res=> res.json())
        .then(covid => {
            for (let e of covid.data){
                let temparray = (_.pullAt(e, [5,7,9,18,89]))
                let tempobject = {
                    country : temparray[0],
                    subregion1: temparray[1],
                    subregion2: temparray[2],
                    newcases : temparray[3],
                    population_density: temparray[4]
                }
                coviddata.push(tempobject)
            };
            return _.chain(coviddata)
            .groupBy('country')
            .map((value, key) => {
                value.map((e)=> delete e.country)
                return { 
                  country : key,
                  region: value
                }
              })
            .value()

        })
        .then(data =>{
            //Only looks at United States data
            for (let e of data){
                if (e.country ==="United States of America"){
                    return _.chain(e.region)
                    .groupBy("subregion1")
                    .value()
                }
            } 
        })
        .then(normalized=>{
            //returns normalized version with states on the top of US data
            /* usCovid.push(normalized) */
            usCovid.push( _.forEach(normalized, function(value, key) {
                normalized[key] = _.groupBy(normalized[key], function(item) {
                    return item.subregion2
                });
            }))
        })
    },[]);

    /**
     * Go to that specified geographical location
     */

    const lookup = (e) =>{
        console.log(e)
        if (marker){
            marker.setMap(null);
        }

        map.panTo(e)
        map.setZoom(12)
        marker = new window.google.maps.Marker({
            position: e,
            map: map,
            title: 'Here!'
          });
        marker.setMap(map);
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

    const Handlesearch = (e) =>{
        e.preventDefault()
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchquery}&key=${Cloudkey}`;
        fetch(proxyurl+url,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(res=> res.json())
        .then(gmap => {
            // Obtains the region from the parsed location data and compares it to the covid data to see if the area is safe
            return (gmap.results.map((e)=>{
                let address = e.formatted_address.split(",").map(item => item.trim())
                let state = address[address.length- 2].split(" ").map(item => item.trim())[0]
                e.state = states.getStateNameByStateCode(state)
                e.region = address[address.length-3] + " County"

                if (usCovid[0][e.state] && usCovid[0][e.state][e.region]) {
                    e.covid = (usCovid[0][e.state][e.region][0].newcases)
                }
                return e
                }   
            ))
        })
        .then(normalized =>{
            setData(normalized)
        })
    }
        
  

    return (
        <div className="main">
            <div className="left">
                <div className="searchbar">
                    
                    <form onSubmit = {Handlesearch} >
                        <div className="form-group">

                            <label ><h2>where is your next journey?</h2></label>

                            <input 
                                type="text" 
                                value={searchquery}
                                onChange={e => setSearchquery(e.target.value)}
                                className="form-control" 
                                id="exampleInputEmail1" 
                                aria-describedby="emailHelp" 
                                placeholder="Enter location"/>
                            </div>
                            <Button style={{float:"left" , fontSize:"20px"}} type="submit" class="btn btn-primary">submit</Button>


                    </form>
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