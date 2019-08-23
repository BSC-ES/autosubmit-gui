import React, { Fragment } from 'react';

function Footer() {
    return (
        <Fragment>            
            <div className='row' style={footerStyle}></div>
            {/* <div className='row'>            
                <div className='col-12'>            
                    <footer className='page-footer'>
                        <p>Autosubmit Experiment Monitor</p>
                        <p>2019</p>
                    </footer>
                </div>
            </div>         */}
        </Fragment>
        
    )
}

const footerStyle = {
    height: 200
  };

export default Footer
