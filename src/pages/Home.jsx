import { useEffect, useRef, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import ExperimentCard from "../common/ExperimentCard";
import Paginator from "../common/Paginator";
import { useWindowSize } from "@uidotdev/usehooks";

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
  const { data, isFetching, isError, refetch } = useGetExperimentsQuery({
    ...filters
  }, {
    skip: !isInitialized
  })

  const { width } = useWindowSize()
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
          <div key={exp.name}>
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

      <div className="grow w-full flex flex-col gap-4">

        <div className="flex w-full gap-2 flex-wrap">
          <form onSubmit={handleSubmit} className="grow flex flex-wrap">
            <input ref={filterRef} id="search-input"
              className="grow form-input rounded-e-none"
              placeholder="Search by expid, description, or owner..." />
            <button id="search-btn" type="submit"
              className="btn btn-dark font-bold px-6 rounded-none">
              Search
            </button>
            <button id="search-clear" type="button"
              className="btn btn-light font-bold px-6 border rounded-s-none"
              onClick={handleClear}>
              Clear
            </button>
          </form>
          <button className="btn btn-success"
            title="Refresh data"
            onClick={() => { refetch() }}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>

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

        <div className="flex gap-x-8 gap-y-3 items-center flex-wrap">
          <div className="flex gap-4 items-center mx-4">
            <label className="text-nowrap">Type:</label>
            <select value={searchParams.get("exp_type") || ""} onChange={handleChangeType}
              className="form-select border border-primary text-primary font-bold text-center">
              <option value="">All</option>
              <option value="experiment">Experiment</option>
              <option value="operational">Operational</option>
              <option value="test">Test</option>
            </select>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <input type="checkbox" className="cursor-pointer"
              checked={isOnlyActive}
              onChange={handleChangeOnlyActive}
            />
            <label className="text-nowrap cursor-pointer" onClick={handleChangeOnlyActive}>Only active</label>
          </div>

          <div className="ms-auto flex gap-4 items-center mx-4">
            <label className="text-nowrap">Order by:</label>
            <select onChange={handleChangeOrder} value={searchParams.get("order") || ""}
              className="form-select border border-primary text-primary font-bold text-center">
              <option value="">Default</option>
              {
                EXP_ORDER_BY.map(item =>
                  <option key={item.key} value={item.key}>{item.name}</option>
                )
              }
            </select>
          </div>
        </div>

        <div className="grow flex flex-col">
          {
            isFetching ?
              <div className="grow w-full flex items-center justify-center">
                <div className="spinner-border" role="status"></div>
              </div>
              :
              <>
                {
                  (isError || data?.error) ?
                    <div className="text-danger w-full grow flex flex-col gap-8 items-center justify-center">
                      <i className="fa-solid fa-x text-9xl"></i>
                      <div className="text-2xl">{"Error while fetching experiments"}</div>
                    </div>
                    :
                    data?.experiments?.length > 0 ?
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {generateExpItems()}
                      </div>
                      :
                      <div className="text-dark w-full grow flex flex-col gap-8 items-center justify-center">
                        <i className="fa-solid fa-ban text-9xl"></i>
                        <div className="text-2xl">No experiments found</div>
                      </div>
                }
              </>
          }
        </div>

        {
          !isFetching && data?.pagination?.total_pages > 0 && currentPage &&
          <div className="flex gap-2 justify-center items-center">
            <Paginator
              currentPage={currentPage}
              onPageClick={handleChangePage}
              totalPages={data.pagination.total_pages}
              siblingSize={width >= 640 ? 2 : 1} />
          </div>
        }


      </div>

    </>
  )
}

export default Home;