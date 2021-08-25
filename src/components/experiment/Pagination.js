import React, { useContext } from 'react';
import ExperimentContext from "../context/experiment/experimentContext";
import { pageSize } from "../context/vars";
import { generateArrayOfNumbers } from "../context/utils";


const Pagination = () => {
  //const numberPages = numberPages;
  const experimentContext = useContext(ExperimentContext);
  const { numberPages, currentPage, setCurrentPage, experiments } = experimentContext;  
  const contentNavigation = generateArrayOfNumbers(numberPages + 1);
  const totalCount = experiments ? experiments.filter(x => x.hidden === false).length : 0;
  const onSubmit = (number) => (e) => {
    e.preventDefault();
    setCurrentPage(number);
    // setPaginatedResult();
  }

  const showingText = "From " + String(pageSize*(currentPage - 1)+1) + " to " + String(pageSize*(currentPage) > totalCount ? totalCount : pageSize*(currentPage));

  return (
    <div className="item-hl">
      {numberPages && numberPages > 1 ? (
      <nav aria-label="Navigation">
        <ul className="pagination pagination-sm pt-1">
          {contentNavigation.map((item, index) => {
            if (item === currentPage){
              return <li className="page-item active" key={index}><button className="page-link" onClick={onSubmit(item)}>{item}</button></li>;
            } else {
              return <li className="page-item" key={index}><button className="page-link" onClick={onSubmit(item)}>{item}</button></li>;
            }            
          })} 
          <li className="page-item disabled"><button className="page-link">{showingText}</button></li>
        </ul>               
      </nav>
      
      ) : ( 
        null
      )}
    </div>
  )
}

export default Pagination
