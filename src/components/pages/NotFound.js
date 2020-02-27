import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h1>Oops!</h1>
            <p>Looks like you are lost. Better go back home.</p>
            <Link to='/projects/earthscience/autosubmitapp/' className='btn btn-light'>
                Back Home
            </Link>  
        </div>
    )
}

export default NotFound
