import { useParams, useSearchParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useEffect, useRef, useState } from "react"
import { useGetExperimentStatsQuery } from "../services/autosubmitApiV3"
import { calculateStatistics } from "../components/context/utils"


const ExperimentStats = () => {
  const routeParams = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [stats, setStats] = useState()
  const [filteredStats, setFilteredStats] = useState()
  const sectionRef = useRef()
  const hourRef = useRef()
  useASTitle(`Experiment ${routeParams.expid}`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Statistics`,
      route: `/experiment/${routeParams.expid}/stats`
    }
  ])
  const { data, isFetching } = useGetExperimentStatsQuery({
    expid: routeParams.expid,
    section: searchParams.get("section") || "Any",
    hours: searchParams.get("hours") || "0"
  }, {
    skip: (!searchParams.get("section") && !searchParams.get("hours"))
  })

  useEffect(() => {
    sectionRef.current.value = searchParams.get("section")
    hourRef.current.value = searchParams.get("hours")
  }, [searchParams])

  useEffect(()=>{
    if(data && data.Statistics && data.Statistics.JobStatistics){
      let newStats = calculateStatistics(data.Statistics.JobStatistics)
      setStats(newStats)
    }
  }, [data])

  const handleGetStats = (e) => {
    e.preventDefault()
    sectionRef.current.value = sectionRef.current.value || "Any"
    hourRef.current.value = hourRef.current.value || "0"
    setSearchParams({
      section: sectionRef.current.value,
      hours: hourRef.current.value
    })
  }

  return (
    <div className="w-100 d-flex flex-column">
      <form onSubmit={handleGetStats}>
        <div className="input-group">
          <input type="text" className="form-control" ref={sectionRef} />
          <input type="integer" className="form-control" ref={hourRef} />
          <button className="btn btn-dark" onClick={handleGetStats}>Get Stats</button>
        </div>
      </form>


      {searchParams.get("section")}
      {searchParams.get("hours")}

      <div className="card">
        {
          isFetching ?
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
            :

            JSON.stringify(data)
        }
      </div>

    </div>
  )
}

export default ExperimentStats