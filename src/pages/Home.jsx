import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { Link, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { ProgressBar } from "react-bootstrap";

const searchParamsToKeyValue = (searchParams) => {
  let searchParamsObj = {};
  [...searchParams.keys()].forEach(key => {
    searchParamsObj[key] = searchParams.get(key)
  })
  return searchParamsObj;
}

const ExperimentCard = forwardRef(({ experiment }, ref) => {
  const [show, setShow] = useState(true)

  const expand = () => { setShow(true) }
  const collapse = () => { setShow(false) }
  const toggle = () => { setShow(!show) }

  useImperativeHandle(ref, () => {
    return {
      expand,
      collapse
    }
  })

  return (
    <div className="d-flex flex-column w-100 h-100">
      <div className={"d-flex gap-4 align-items-center justify-content-between bg-dark px-5 py-3 " + (show ? "rounded-top-4" : "rounded-4")}>
        <Link to={`/experiment/${experiment.name}/quick`}
          className="text-white fs-3 fw-bold"
          style={{ cursor: "pointer" }}
        >
          {experiment.name}
        </Link>
        <div className="flex-fill">
          <span className="text-white">{experiment.description}</span>
        </div>
        <ProgressBar className="bg-info rounded-pill p-0" style={{ width: "12rem" }}>
          <ProgressBar max={experiment?.total} now={experiment?.completed}
            animated={experiment?.status === "RUNNING"}
            className={
              (experiment?.failed > 0) ? "bg-danger" : (
                (experiment?.queuing > 0 && !(experiment?.running > 0)) ? "bg-queue" : "bg-success"
              )} />
        </ProgressBar>
        <div style={{ width: "1.5rem", height: "1.5rem", minWidth: "1.5rem" }}
          className={"rounded-circle " + (experiment?.status === "RUNNING" ? "bg-success" : "bg-info")}
          title={(experiment?.status === "RUNNING" ? "ACTIVE" : "INACTIVE")}
        />
        <div className="text-white" onClick={toggle}
          style={{ cursor: "pointer" }}>
          <i className={"fs-2 fa-solid " + (show ? "fa-angle-up" : "fa-angle-down")}></i>
        </div>
      </div>
      {
        show &&
        <div className="flex-fill border rounded-bottom-4 py-3 px-4 w-100 d-flex flex-column gap-3">
          <div className="px-4 grid">
            <div className="g-col-3" title="User">
              <i className="fa-solid fa-user me-4" /> {experiment.user || "-"}
            </div>
            <div className="g-col-3" title="HPC">
              <i className="fa-solid fa-computer me-4" /> {experiment.hpc || "-"}
            </div>
            <div className="g-col-3" title="Autosubmit version">
              <i className="fa-solid fa-code-branch me-4" /> {experiment.version || "-"}
            </div>
            <div className="g-col-3" title="Last modified date">
              <i className="fa-solid fa-calendar me-4" /> {experiment.modified || "-"}
            </div>
          </div>
          <div className="grid">
            <Link to={`/experiment/${experiment.name}/quick`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-primary fw-bold px-4 text-white text-nowrap">
                QUICK
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/tree`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-primary fw-bold px-4 text-white text-nowrap">
                TREE
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/graph`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-primary fw-bold px-4 text-white text-nowrap">
                GRAPH
              </button>
            </Link>
          </div>
          {/* <button type="button"
            className="btn btn-primary fw-bold px-4 text-white text-nowrap">
            SUMMARY
          </button> */}
        </div>
      }

    </div>

  )
})


const EXP_ORDER_BY = [
  {
    key: "created_asc",
    name: "Created (asc)",
    order_by: "created",
    order_desc: false,
  },
  {
    key: "created_desc",
    name: "Created (desc)",
    order_by: "created",
    order_desc: true,
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

  const isOnlyActive = ["true", null].includes(searchParams.get("only_active"))
  useEffect(() => {
    if (searchParams.get("query")) {
      filterRef.current.value = searchParams.get("query")
    }

    setFilters({
      page: searchParams.get("page") || undefined,
      page_size: searchParams.get("page_size") || undefined,
      query: searchParams.get("query") || undefined,
      only_active: isOnlyActive,
      exp_type: searchParams.get("exp_type") || undefined,
      order_by: searchParams.get("order_by") || undefined,
      order_desc: searchParams.get("order_desc") !== null ?
        searchParams.get("order_desc") : undefined
    })
    if (!isInitialized) setIsInitialized(true)
  }, [searchParams])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1
    }
    if (filterRef.current.value) {
      newParams["query"] = filterRef.current.value
    }
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
    const selectedOrder = EXP_ORDER_BY.find(
      item => item.key === e.target.value
    )
    const newParams = {
      ...searchParamsToKeyValue(searchParams),
      page: 1,
      order_by: selectedOrder?.order_by,
      order_desc: selectedOrder?.order_desc,
    }
    if (!selectedOrder) {
      delete newParams.order_by;
      delete newParams.order_desc;
    }
    setSearchParams(newParams)
  }

  // Ref Children
  let expListRefs = {}
  const generateExpItems = () => {
    if (Array.isArray(data?.experiments)) {
      let newRefs = {}
      let items = data.experiments.map((exp, index) => {
        return (
          <div key={exp.name} className="g-col-xl-6 g-col-12" style={{ minWidth: "20rem" }}>
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

            <button type="button"
              className="btn btn-primary fw-bold px-4 text-white text-nowrap"
              onClick={handleExpand}>
              Expand all +
            </button>
            <button type="button"
              className="btn btn-secondary fw-bold px-4 text-white text-nowrap"
              onClick={handleCollapse}>
              Collapse all -
            </button>
          </div>

          <div className="d-flex column-gap-5 row-gap-3 align-items-center flex-wrap">
            <div className="d-flex gap-3 align-items-center mx-3">
              <label className="text-nowrap">Type:</label>
              <select value={searchParams.get("exp_type")} onChange={handleChangeType}
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
              <select onChange={handleChangeOrder}
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
                      <div className="grid">
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

          <div className="d-flex gap-3 justify-content-center">
            {
              data?.pagination?.total_pages > 0 &&
              [...(Array(data.pagination.total_pages).keys())].map(item => {
                return (
                  <button key={item} type="button"
                    className={"btn rounded-circle " + (((searchParams.get("page") || 1) == item + 1) ? "btn-primary text-white" : "btn-outline-light text-primary border-primary")}
                    style={{ height: "2.5rem", width: "2.5rem" }}
                    onClick={() => setSearchParams({ ...searchParamsToKeyValue(searchParams), page: item + 1 })}>
                    {item + 1}
                  </button>
                )
              })
            }
          </div>

        </div>

      </div>
    </>
  )
}

export default Home;