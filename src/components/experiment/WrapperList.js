import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";

const WrapperList = () => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const { experiment } = experimentContext;
  const { data, navigateToGroup } = graphContext;
  var packages = {};
  var wrapperTitles = null;
  var wrapperItems = null;
  const Honk = (id) => (e) => {
    e.preventDefault();
    if (packages) {
      //console.log(id["wrapper"]);
      //console.log(packages[id["wrapper"]]);
      navigateToGroup(packages[id["wrapper"]]);
    }

    //navigateToGroup()
  };

  // useEffect(() => {
  //   effect
  //   return () => {
      
  //   }
  // }, [data.packages])

  if (
    experiment &&
    data &&
    data.packages &&
    Object.keys(data.packages).length > 0
  ) {
    // console.log(data.packages);
    packages = data.packages;
    wrapperTitles = Object.keys(packages);
    wrapperItems = wrapperTitles.map((wrapper, index) => (
      <button
        className='btn-warning btn-block'
        type='button'
        key={index}
        onClick={Honk({ wrapper })}
      >
        <small>{wrapper.split("_").slice(1).join("_")}</small>
      </button>
    ));
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
      {experiment && packages && (
        <div className='row'>
          <div className='col-12'>
            <div
              className='card text-white bg-primary scroll'
              style={experimentStyle}
            >
              <div className='card-header text-center p-0' style={headerCard}>
                <div className='mh-100 px-0 mx-0'>
                  <small>
                    <strong>WRAPPERS</strong>
                  </small>
                </div>
              </div>
              <div className='card-body py-0'>
                {wrapperTitles && wrapperItems}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const experimentStyle = {
  height: 713,
};

const headerCard = {
  height: 30,
};

export default WrapperList;
