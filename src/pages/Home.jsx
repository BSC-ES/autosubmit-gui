import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { Link, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";

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
        <div className="bg-info rounded-pill" style={{ width: "12rem", height: "1.25rem" }}>

        </div>
        <div className="bg-success rounded-circle" style={{ width: "1.5rem", height: "1.5rem", minWidth: "1.5rem" }}>

        </div>
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
          <button type="button"
            className="btn btn-primary fw-bold px-4 text-white text-nowrap">
            SUMMARY
          </button>
        </div>
      }

    </div>

  )
})


const Home = () => {
  useASTitle("Home")
  useBreadcrumb([
    {
      name: "Experiments"
    }
  ])

  const [searchParams, setSearchParams] = useSearchParams()
  let expListRefs = {}

  // const [filters, setFilters] = useState({
  //   page: 1,
  //   page_size: 3
  // })

  const { data, isFetching } = useGetExperimentsQuery({
    page: searchParams.get("page") || undefined,
    page_size: searchParams.get("page_size") || undefined
  })

  // useEffect(() => {
  //   const newFilters = { ...filters };
  //   ["page", "page_size"].forEach(key => {
  //     if (searchParams.get(key)) {
  //       newFilters[key] = searchParams.get(key)
  //     }
  //   })
  //   console.log(newFilters)
  //   setFilters(newFilters)
  // }, [searchParams])

  useEffect(() => {
    if (data && data.experiments) {

    }
  }, [data])

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

  const generateExpItems = () => {
    if (Array.isArray(data.experiments)) {
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

  return (
    <>
      <div className="d-flex flex-fill gap-4 w-100">

        <div className="flex-fill d-flex flex-column gap-3 w-100">
          <div className="d-flex gap-2">
            <form className="input-group">
              <input
                className="form-control" placeholder="Search by expid, description, or owner..." />
              <button type="submit" className="btn btn-dark fw-bold px-4">
                Search
              </button>
              <button type="button" className="btn btn-info fw-bold px-4">
                Clear
              </button>
            </form>
            <button type="button"
              className="btn btn-primary fw-bold px-4 text-white text-nowrap"
              onClick={handleExpand}>
              Expand all +
            </button>
            <button type="button"
              className="btn btn-secondary fw-bold px-4 text-white text-nowrap"
              onClick={handleCollapse}>
              Collapse all +
            </button>
          </div>

          {
            isFetching ?
              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status"></div>
              </div>
              :
              <div className="grid">
                {generateExpItems()}
              </div>
          }

          <div className="d-flex gap-3 justify-content-center">
            {
              data && data.pagination && data.pagination.total_pages &&
              [...(Array(data.pagination.total_pages).keys())].map(item => {
                return (
                  <button key={item}
                    className={"btn rounded-circle " + (((searchParams.get("page") || 1) == item + 1) ? "btn-primary text-white" : "btn-outline-primary")}
                    style={{ height: "2.5rem", width: "2.5rem" }}
                    onClick={() => setSearchParams({ ...searchParams, page: item + 1 })}>
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