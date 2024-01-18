import { useEffect, useRef, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import ExperimentCard from "../common/ExperimentCard";
import Paginator from "../common/Paginator";

const searchParamsToKeyValue = (searchParams) => {
  let searchParamsObj = {};
  [...searchParams.keys()].forEach(key => {
    searchParamsObj[key] = searchParams.get(key)
  })
  return searchParamsObj;
}


const EXP_ORDER_BY = [
  {
    key: "created_desc",
    name: "Created (desc)",
    order_by: "created",
    order_desc: true,
  },
  {
    key: "created_asc",
    name: "Created (asc)",
    order_by: "created",
    order_desc: false,
  },
]

const Home = () => {
  useASTitle("Home")
  useBreadcrumb([
    {
      name: "Experiments"
    }
  ])

  const [searchParams, setSearchParams] = useSearchParams({})
  const [filters, setFilters] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)
  const { data, isFetching } = useGetExperimentsQuery({
    ...filters
  }, {
    skip: !isInitialized
  })

  const filterRef = useRef()

  // State Transforms
  const isOnlyActive = ["true", null].includes(searchParams.get("only_active"))
  const currentPage = parseInt(searchParams.get("page") || 1)

  // Search Params to Query Filter
  useEffect(() => {
    filterRef.current.value = searchParams.get("query")

    let selectedOrder = EXP_ORDER_BY.find(
      item => item.key === searchParams.get("order")
    )

    setFilters({
      page: searchParams.get("page") || undefined,
      page_size: searchParams.get("page_size") || undefined,
      query: searchParams.get("query") || undefined,
      only_active: isOnlyActive,
      exp_type: searchParams.get("exp_type") || undefined,
      order_by: selectedOrder?.order_by || undefined,
      order_desc: selectedOrder?.order_desc || undefined
    })
    if (!isInitialized) setIsInitialized(true)
  }, [searchParams])

  // Form Handlers
  const handleSubmit = (e) => {
    e?.preventDefault()
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      query: filterRef.current.value
    }
    if (!filterRef.current.value) delete newParams.query;
    setSearchParams(newParams)
  }

  const handleClear = () => {
    filterRef.current.value = ""
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1
    }
    delete newParams.query;
    setSearchParams(newParams)
  }

  const handleChangeOnlyActive = () => {
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      only_active: !isOnlyActive
    }
    setSearchParams(newParams)
  }

  const handleChangeType = (e) => {
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      exp_type: e.target.value
    }
    if (!e.target.value) delete newParams.exp_type;
    setSearchParams(newParams)
  }

  const handleChangeOrder = (e) => {
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      order: e.target.value
    }
    if (!e.target.value) {
      delete newParams.order;
    }
    setSearchParams(newParams)
  }

  const handleChangePage = (e) => {
    const nextPage = e.selected;
    if ((nextPage <= data?.pagination?.total_pages) && (nextPage > 0)) {
      setSearchParams({
        ...searchParamsToKeyValue(searchParams),
        page: nextPage
      })
    }
  }

  // Ref Children
  let expListRefs = {}
  const generateExpItems = () => {
    if (Array.isArray(data?.experiments)) {
      let newRefs = {}
      let items = data.experiments.map((exp, index) => {
        return (
          <div key={exp.name} className="g-col-xxl-4 g-col-lg-6 g-col-12" style={{ minWidth: "20rem" }}>
            <ExperimentCard experiment={exp}
              ref={(instance) => { newRefs[index] = instance }} />
          </div>
        )
      })
      expListRefs = newRefs
      return items
    }
    return <></>
  }

  // Children methods
  const handleExpand = () => {
    Object.keys(expListRefs).forEach(key => {
      expListRefs[key].expand()
    })
  }

  const handleCollapse = () => {
    Object.keys(expListRefs).forEach(key => {
      expListRefs[key].collapse()
    })
  }

  return (
    <>
      <div className="d-flex flex-fill gap-4 w-100">

        <div className="flex-fill d-flex flex-column gap-3 w-100">
          <div className="d-flex gap-2 flex-wrap">
            <div className="flex-fill">
              <form className="input-group" onSubmit={handleSubmit}>
                <input ref={filterRef}
                  className="form-control" placeholder="Search by expid, description, or owner..." />
                <button type="submit" className="btn btn-dark fw-bold px-4">
                  Search
                </button>
                <button type="button" className="btn btn-info fw-bold px-4"
                  onClick={handleClear}>
                  Clear
                </button>
              </form>
            </div>

            {/* <button type="button"
              className="btn btn-primary fw-bold px-4 text-white text-nowrap"
              onClick={handleExpand}>
              Expand all +
            </button>
            <button type="button"
              className="btn btn-secondary fw-bold px-4 text-white text-nowrap"
              onClick={handleCollapse}>
              Collapse all -
            </button> */}
          </div>

          <div className="d-flex column-gap-5 row-gap-3 align-items-center flex-wrap">
            <div className="d-flex gap-3 align-items-center mx-3">
              <label className="text-nowrap">Type:</label>
              <select value={searchParams.get("exp_type") || ""} onChange={handleChangeType}
                className="form-select bg-primary text-white border-0 fw-bold text-center select-white-caret">
                <option value="">All</option>
                <option value="experiment">Experiment</option>
                <option value="operational">Operational</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div className="flex-fill d-flex gap-3 align-items-center mx-3">
              <input className="form-check-input" type="checkbox"
                checked={isOnlyActive}
                onChange={handleChangeOnlyActive}
              />
              <label className="text-nowrap">Only active</label>
            </div>

            <div className="d-flex gap-3 align-items-center mx-3">
              <label className="text-nowrap">Order by:</label>
              <select onChange={handleChangeOrder} value={searchParams.get("order") || ""}
                className="form-select bg-primary text-white border-0 fw-bold text-center select-white-caret">
                <option value="">Default</option>
                {
                  EXP_ORDER_BY.map(item =>
                    <option key={item.key} value={item.key}>{item.name}</option>
                  )
                }
              </select>
            </div>
          </div>

          <div className="flex-fill">
            {
              isFetching ?
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="spinner-border" role="status"></div>
                </div>
                :
                <>
                  {
                    data?.experiments?.length > 0 ?
                      <div className="grid gap-3">
                        {generateExpItems()}
                      </div>
                      :
                      <div className="w-100 h-100 d-flex flex-column gap-4 align-items-center justify-content-center">
                        <i className="fa-solid fa-ban" style={{ fontSize: "8rem" }}></i>
                        <div className="fs-4">No experiments found</div>
                      </div>
                  }
                </>
            }
          </div>

          {
            !isFetching && data?.pagination?.total_pages > 0 && currentPage &&
            <div className="d-flex gap-3 justify-content-center align-items-center">
              <Paginator currentPage={currentPage} onPageClick={handleChangePage} totalPages={data.pagination.total_pages}></Paginator>
            </div>
          }


        </div>

      </div>
    </>
  )
}

export default Home;