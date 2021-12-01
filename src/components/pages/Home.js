import React, { Fragment, useEffect, useContext } from "react";
import Search from "../experiment/Search";
import Experiments from "../experiment/Experiments";
import queryString from "query-string";
import ExperimentContext from "../context/experiment/experimentContext";

const Home = (props) => {
  const experimentContext = useContext(ExperimentContext);
  const { testToken, loggedUser } = experimentContext;

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token && loggedUser) {
      testToken();
    }
    // eslint-disable-next-line
  }, [loggedUser]);
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
  );
};

export default Home;
