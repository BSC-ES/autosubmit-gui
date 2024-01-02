import { useEffect, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { Link } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";


const Home = () => {
    useASTitle("Home")
    useBreadcrumb([
        {
            name: "Experiments"
        }
    ])
    // const [experiments, setExperiments] = useState([])
    // const [pagination, setPagination] = useState({
    //     page: 1,
    //     totalPages: 1
    // })

    const { data: experiments, isLoading } = useGetExperimentsQuery()

    useEffect(() => {
        console.log(experiments)
    }, [experiments])

    return (
        <>
            <div className="d-flex flex-fill gap-4">
                <div className="rounded-4 bg-info" style={{ width: "16rem" }}>Sidebar placeholder</div>
                <div className="d-flex flex-column">
                    {
                        experiments && experiments.experiments &&
                        experiments.experiments.map(exp => {
                            return (
                                <div key={exp.name}>
                                    <Link to={`/experiment/${exp.name}`}>{exp.name}</Link>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </>
    )
}

export default Home;