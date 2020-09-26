import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';

/**
 * Takes
 * 
 * @TODO: make it look pretty / interactable
 */
function Location({...props}) {
    console.log()
   return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{props.data.name}</h5>
                    <p className="card-text">{props.data.formatted_address}</p>
                    <p className="card-text">Business Status: {props.data.business_status}</p>

                    <Button onClick={()=>props.action(props.data.geometry.location)}>Go somewhere</Button>
                </div>
            </div>
        </div>
    )
}

export default Location
