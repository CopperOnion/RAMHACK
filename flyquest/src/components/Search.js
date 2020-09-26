import React from 'react'

function Search({...props}) {
    return (
        <div className="searchbar">
            <form onsubmit= {props.action}>
                <div className="form-group">
                    <label >Search for places to go!</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter location"/>
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Search
