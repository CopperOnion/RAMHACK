import React, { useState, useEffect, useCallback, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './Main.css'
import Location from '../components/Location'
import {Map, HeatMap, Marker, GoogleApiWrapper} from 'google-maps-react';


var _ = require('lodash');
var states = require('us-state-codes');

const dotenv = require("dotenv");
const Cloudkey = process.env.REACT_APP_GCLOUD_KEY
/**
 *  Initial configuration for google maps
 **/

const containerStyle = {
    width: "40vw",
    height: "80vh",
};

const center = {
    lat: -34.397,
    lng: 150.644,
};

export const Main = () => {
    let positions = [
        
    ];


    const [data, setData] = useState([]);
    const [searchquery, setSearchquery] = useState("");
    const [map, setMap] = React.useState(null)
    const [coviddata, setCoviddata] = useState([])
    const [usCovid, setUsCovid] = useState([])
    const [visitors, setVisitors] = useState(positions)
    const [visitcount, setVisitcount] = useState([])

    const [zoom, setZoom] = useState(2)
    const [markerpos, setMarkerpos] = useState({lat: 37.759703, lng: -122.428093})
    const [centerpos, setCenterpos] = useState({lat:0, lng:0})
    const [radius, setRadius] = useState(5)

    /* Gradient for the heatmap
     */
    
    const gradient = [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
      ];

    /**
     * List of locations from the query
     */

    let locationlist = <ul></ul>;

    /**
     *  Simple API call to retrieve open covid data
     */
    useEffect(() => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const covid = `https://storage.googleapis.com/covid19-open-data/v2/latest/main.json`;
        fetch(proxyurl + covid, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((covid) => {
                for (let e of covid.data) {
                    let temparray = _.pullAt(e, [5, 7, 9, 18, 89]);
                    let tempobject = {
                        country: temparray[0],
                        subregion1: temparray[1],
                        subregion2: temparray[2],
                        newcases: temparray[3],
                        population_density: temparray[4],
                    };
                    coviddata.push(tempobject);
                }
                return _.chain(coviddata)
                    .groupBy("country")
                    .map((value, key) => {
                        value.map((e) => delete e.country);
                        return {
                            country: key,
                            region: value,
                        };
                    })
                    .value();
            })
            .then((data) => {
                //Only looks at United States data
                for (let e of data) {
                    if (e.country === "United States of America") {
                        return _.chain(e.region).groupBy("subregion1").value();
                    }
                }
            })
            .then((normalized) => {
                //returns normalized version with states on the top of US data
                /* usCovid.push(normalized) */
                usCovid.push(
                    _.forEach(normalized, function (value, key) {
                        normalized[key] = _.groupBy(normalized[key], function (
                            item
                        ) {
                            return item.subregion2;
                        });
                    })
                );
            });
    }, []);

    /**
     * Go to that specified geographical location
     */

    const lookup = (e) => {
        setZoom(15)
        setMarkerpos(e);
        setCenterpos(e);
        setRadius(20);
        var heatmap = new window.google.maps.visualization.HeatmapLayer({
            data: visitors
          });
        heatmap.setMap(map);
    }

    /**
     * Hook for changing eatmap
     */
    useEffect(()=>{
        const visitors = []
        for (let elem of data ){
            for (let i = 0; i < 14 ;i++){
                visitors.push(elem.geometry.location)

            }
        }
        if(visitors.length != 0) {
            setVisitors(visitors)
        }
    },[data]);

    const receive = (e) =>{
        visitcount.push(e)
    }

    locationlist = <ul className="locationlist" >
        {data.map((e,i)=>
        (
            <li className="locationelement" key={i}>
                <Location
                    data = {e}
                    action = {lookup}
                    get = {receive}
                />
            </li>
        ))}
    </ul>

    const Handlesearch = (e) =>{
        e.preventDefault()
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchquery}&key=${Cloudkey}`;
        fetch(proxyurl + url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((gmap) => {
                // Obtains the region from the parsed location data and compares it to the covid data to see if the area is safe
                return gmap.results.map((e) => {
                    let address = e.formatted_address
                        .split(",")
                        .map((item) => item.trim());
                    let state = address[address.length - 2]
                        .split(" ")
                        .map((item) => item.trim())[0];
                    e.state = states.getStateNameByStateCode(state);
                    e.region = address[address.length - 3] + " County";

                    if (usCovid[0][e.state] && usCovid[0][e.state][e.region]) {
                        e.covid = usCovid[0][e.state][e.region][0].newcases;
                    }
                    return e;
                });
            })
            .then((normalized) => {
                setData(normalized);
            });

        var element = document.querySelector(".searchbar");
        element.classList.add("searchbar_high")

    }

    
    const Feelingsus =() =>{
        console.log(data)
        setData(data.filter((e,i)=>{
            return visitcount[i] < 6
        }))
    }

    return (
        <div className="main">
            <div className="left">
                <div className="searchbar">
                    <form onSubmit={Handlesearch}>
                        <div className="form-group">
                            <label>
                                <h2>where is your next journey?</h2>
                            </label>

                            <input
                                type="text"
                                value={searchquery}
                                onChange={(e) => setSearchquery(e.target.value)}
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter location"
                            />
                        </div>
                        <Button
                            style={{ float: "left", fontSize: "14px" }}
                            type="submit"
                            className="btn btn-primary"
                        >
                            submit
                        </Button>

                        <Button
                            style={{ float: "left", fontSize: "14px" ,marginLeft:"20px"}}
                            onClick={Feelingsus}
                            className="btn btn-primary"
                        >
                            Feeling sus
                        </Button>
                    </form>
                </div>

                {locationlist}
            </div>

            <div className="right">
                <div>

          
                    <Map 
                        style={{ height: '80vh', width: '40%' }}
                        className="map"
                        google={window.google} 
                        zoom={zoom}
                        center={centerpos}
                        >
                        <Marker
                            name={"You are here !"}
                            position={markerpos} 
                        />
                        <Marker />
                        <HeatMap
                            gradient={gradient}
                            positions={positions}
                            opacity={.5}
                            radius={radius}
                        />
                    </Map>
                </div>
            </div>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: (Cloudkey),
    libraries: ["visualization"]
  })(Main)