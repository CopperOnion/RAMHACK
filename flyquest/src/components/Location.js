import React from 'react'

function Location({...props}) {
    console.log(props.data.name)
    return (
        <div>
            {props.data.name}
        </div>
    )
}

export default Location
