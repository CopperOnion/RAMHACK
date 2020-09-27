import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import firebase from "./Firestore";
import "./Location.css";

const dotenv = require("dotenv");

/**
 * Takes
 *
 * @TODO: make it look pretty / interactable
 */
function Location({ ...props }) {
    const [photoref, setPhotoref] = useState("");
    const [visitors, setVisitors] = useState(0);

    const db = firebase.firestore();
    const placesRef = db.collection("places");
    //creates new document with address location, initialized to 0 visitors when new
    useEffect(() => {
        placesRef
            .doc(`${props.data.formatted_address}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    placesRef.doc(`${props.data.formatted_address}`).set(
                        {
                            visitors: 0,
                        },
                        { merge: true }
                    );
                }
            })
            //fetches database values of visitors, and updates vistorsNum
            .then(() => {
                placesRef
                    .doc(`${props.data.formatted_address}`)
                    .get()
                    .then((doc) => {
                        const docData = doc.data();
                        setVisitors(docData.visitors);
                        //sends the visitor information back to the parent element
                        props.get(docData.visitors)
                    })
            })
            
    }, [props.data.formatted_address]);
    const increment = firebase.firestore.FieldValue.increment(1);

    
    /**
     * obtains image reference from props.data
     */
    useEffect(() => {
        if (props.data.photos) {
            setPhotoref(props.data.photos[0].photo_reference);
        }
    }, [props.data]);

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoref}&key=${process.env.REACT_APP_GCLOUD_KEY}`;

    /*     fetch(proxyurl + url).then(res=> console.log(res))
     */ return (
        <div>
            <div className="card" style={{ textAlign: "left", border: "none" }}>
                <div class="row no-gutters">
                    <div class="col-md-5">
                        <img
                            style={{ height: "100%" }}
                            src={url}
                            class="card-img"
                            alt="..."
                        />
                    </div>
                    <div class="col-md-7">
                        <div className="card-body">
                            <h6 className="card-title">{props.data.name}</h6>
                            <p className="card-text">
                                {props.data.formatted_address}
                            </p>
                            <p className="card-text">
                                Rating: {props.data.rating} out of{" "}
                                {props.data.user_ratings_total}
                            </p>
                            <p className="card-text">
                                Business Status: {props.data.business_status}
                            </p>
                            <p className="card-text">
                                new covid cases in region: {props.data.covid}
                            </p>
                            <p className="card-text visitcount">
                                visitor count: {visitors}
                            </p>

                            <Button
                                onClick={() =>
                                    props.action(props.data.geometry.location)
                                }
                            >
                                Go here !
                            </Button>
                            <Button
                                style={{marginLeft:"10px"}}
                                onClick={() => {
                                    placesRef
                                        .doc(`${props.data.formatted_address}`)
                                        .update({ visitors: increment });
                                    setVisitors(visitors + 1);
                                }}
                            >
                                Check In
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Location;
