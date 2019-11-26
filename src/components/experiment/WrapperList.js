import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';


const WrapperList = () => {
    const experimentContext = useContext(ExperimentContext);
    const { data, experiment, navigateToGroup } =  experimentContext;
    var packages = {}
    var wrapperTitles = null;
    var wrapperItems = null;
    const Honk = id => e => {
        e.preventDefault();
        if (packages){  
            //console.log(id["wrapper"]);            
            //console.log(packages[id["wrapper"]]);
            navigateToGroup(packages[id["wrapper"]]);
        }
        
        //navigateToGroup()
    }
    if (experiment && data && data.packages && Object.keys(data.packages).length > 0){        
        packages = data.packages;
        wrapperTitles = Object.keys(packages);
        wrapperItems = wrapperTitles.map((wrapper, index) =>             
            <button className="btn-sm btn-warning btn-block" type="button" key={index} onClick={Honk({wrapper})}><small>{wrapper.split("_").slice(1,).join("_")}</small></button>
        );
        // for(var key in packages){
        //     map += "<span>" + key + "</span>";
        // }
        // map = packages.map(x => x)
        // console.log(map)
        // for(var key in packages){
        //     var value = packages[key]
        //     console.log(key + " : " + value);
        // }
    }

    return (
        <div>
            {experiment && packages  && 
                <div className="row">
                    <div className="col-12">
                        <div className="card text-white bg-info scroll" style={experimentStyle}>
                            <div className="card-header text-center p-0" style={headerCard}>
                                <div className="mh-100 px-0 mx-0">
                                    <small><strong>WRAPPERS</strong></small>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                    {wrapperTitles && 
                                            wrapperItems
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
                
    )    
}

const experimentStyle = {
    height: 660
  };

const headerCard = {
    height: 30
}

export default WrapperList
