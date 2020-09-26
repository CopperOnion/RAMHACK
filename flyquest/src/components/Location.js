import React from 'react'

/**
 * Takes
 * 
 * @TODO: make it look pretty / interactable
 */
function Location({...props}) {
    console.log(props.data)
    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{props.data.name}</h5>
                    <p className="card-text">{props.data.formatted_address}</p>
                    <p className="card-text">Business Status: {props.data.business_status}</p>
                    <p className="card-text">Ratings: {props.data.user_ratings_total}</p>

                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
    )
}

export default Location
