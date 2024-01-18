import { useEffect, useState } from "react"

const Paginator = ({ totalPages, currentPage = 1, siblingSize = 1, onPageClick }) => {

  const [pages, setPages] = useState([])

  useEffect(() => {
    let rangeSize = Math.min(totalPages, siblingSize * 2 + 1)
    let start = Math.max(1, Math.min(currentPage - siblingSize, totalPages - rangeSize + 1))
    const newPages = [...(Array(rangeSize).keys())].map(item => {
      return (item + start)
    })
    setPages(newPages)
  }, [totalPages, currentPage, siblingSize])

  return (
    <>
      {
        totalPages > 0 &&
        <>
          <button
            className={"btn rounded-circle border-0 btn-outline-light text-primary " + ((currentPage <= 1) ? "disabled" : "")}
            style={{ height: "2.5rem", width: "2.5rem" }}
            onClick={() => onPageClick({ selected: currentPage - 1 })}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          {
            !pages.includes(1) &&
            <button type="button"
              className={"btn rounded-circle btn-outline-light text-primary border-primary"}
              style={{ height: "2.5rem", minWidth: "2.5rem" }}
              onClick={() => onPageClick({ selected: 1 })}>
              <span className="small">1</span>
            </button>
          }
          {
            pages[0] > 2 &&
            <i className="fa-solid fa-ellipsis text-primary"></i>
          }
          {
            pages.map(item => {
              return (
                <button key={item} type="button"
                  className={"btn rounded-circle " + ((currentPage === item) ? "btn-primary text-white" : "btn-outline-light text-primary border-primary")}
                  style={{ height: "2.5rem", minWidth: "2.5rem" }}
                  onClick={() => onPageClick({ selected: item })}>
                  <span className="small">{item + 0}</span>
                </button>
              )
            })
          }
          {
            pages[pages.length - 1] < totalPages - 1 &&
            <i className="fa-solid fa-ellipsis text-primary"></i>
          }
          {
            !pages.includes(totalPages) &&
            <button type="button"
              className={"btn rounded-circle btn-outline-light text-primary border-primary"}
              style={{ height: "2.5rem", minWidth: "2.5rem" }}
              onClick={() => onPageClick({ selected: totalPages })}>
              <span className="small">{totalPages}</span>
            </button>
          }
          <button
            className={"btn rounded-circle border-0 btn-outline-light text-primary " + ((currentPage >= totalPages) ? "disabled" : "")}
            style={{ height: "2.5rem", width: "2.5rem" }}
            onClick={() => onPageClick({ selected: currentPage + 1 })}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </>
      }
    </>
  )
}

export default Paginator