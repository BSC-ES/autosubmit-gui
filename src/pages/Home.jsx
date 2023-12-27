import { useEffect, useState } from "react";
import { useGetExperimentsQuery } from "../services/autosubmitApiV4";
import { Link } from "react-router-dom";


const Home = () => {
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
            <div className="d-flex flex-fill py-4">
                <div className="rounded bg-info" style={{ width: "250px" }}>Sidebar placeholder</div>
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