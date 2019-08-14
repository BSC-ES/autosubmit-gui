import React, { Fragment } from 'react';
import Search from '../experiment/Search';
import Experiments from '../experiment/Experiments';

const Home = () => {
    return (
        <Fragment>
            <Search />
            <Experiments />
        </Fragment>
    )
}

export default Home
