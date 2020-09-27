import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import './Location.css'

const dotenv = require('dotenv');

/**
 * Takes
 * 
 * @TODO: make it look pretty / interactable
 */
function Location({...props}) {
    console.log(props.data)
    const [photoref, setPhotoref] = useState("")
    
    /**
     * obtains image reference from props.data
     */
    useEffect(() => {
        if (props.data.photos){
            setPhotoref(props.data.photos[0].photo_reference)
        }
    
    },[]);

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoref}&key=${process.env.REACT_APP_GCLOUD_KEY}`

/*     fetch(proxyurl + url).then(res=> console.log(res))
 */   return (
       
        <div>
            <div className="card" style={{textAlign: "left", border:"none"}}>
                <div class="row no-gutters">

                    <div class="col-md-5">
                        <img  style={{height: "100%"}}src={url} class="card-img" alt="..."/>
                    </div>
                    <div class="col-md-7">
                        <div className="card-body">
                            <h6 className="card-title">{props.data.name}</h6>
                            <p className="card-text">{props.data.formatted_address}</p>
                            <p className="card-text">Rating: {props.data.rating} out of {props.data.user_ratings_total}</p>
                            <p className="card-text">Business Status: {props.data.business_status}</p>
                            <p className="card-text">new covid cases in region: {props.data.covid}</p>
                            <p className="card-text">visitor count: 14</p>

                            <Button onClick={()=>props.action(props.data.geometry.location)}>Go here !</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Location
