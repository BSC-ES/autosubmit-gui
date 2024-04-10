import { useMemo } from "react"

const Paginator = ({ totalPages, currentPage = 1, siblingSize = 1, onPageClick }) => {

  const pages = useMemo(() => {
    let rangeSize = Math.min(totalPages, siblingSize * 2 + 1)
    let start = Math.max(1, Math.min(currentPage - siblingSize, totalPages - rangeSize + 1))
    const newPages = [...(Array(rangeSize).keys())].map(item => {
      return (item + start)
    })
    return newPages
  }, [totalPages, currentPage, siblingSize])

  return (
    <>
      {
        totalPages > 0 &&
        <>
          <button
            className={"h-10 w-10 btn btn-light bg-transparent rounded-full text-primary"}
            disabled={(currentPage <= 1)}
            onClick={() => onPageClick({ selected: currentPage - 1 })}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          {
            !pages.includes(1) &&
            <button type="button"
              className={"h-10 w-10 btn rounded-full btn-light bg-transparent text-primary"}
              onClick={() => onPageClick({ selected: 1 })}>
              <span className="text-sm">1</span>
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
                  className={"h-10 w-10 btn rounded-full " + ((currentPage === item) ? "btn-primary" : "btn-light bg-transparent text-primary")}
                  onClick={() => onPageClick({ selected: item })}>
                  <span className="text-sm">{item + 0}</span>
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
              className={"h-10 w-10 btn rounded-full btn-light bg-transparent text-primary"}
              onClick={() => onPageClick({ selected: totalPages })}>
              <span className="text-sm">{totalPages}</span>
            </button>
          }
          <button
            className={"h-10 w-10 btn btn-light bg-transparent rounded-full text-primary"}
            disabled={(currentPage >= totalPages)}
            onClick={() => onPageClick({ selected: currentPage + 1 })}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </>
      }
    </>
  )
}

export default Paginator