import React, { Fragment } from 'react';
import Search from '../experiment/Search';
import Experiments from '../experiment/Experiments';
import queryString from 'query-string';

const Home = (props) => {

    //let specificSearchUser = null;
    const values = queryString.parse(props.location.search);
    // if (values.user){
    //     specificSearchUser = true;
    // }
    return (
        <Fragment>
            <Search specificSearch={values.user} />
            <Experiments />
        </Fragment>
    )
}

export default Home
