import { useState } from "react";


const Home = () => {
    const [experiments, setExperiments] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1
    })

    return (
        <>
            <div>Hello sans source</div>
        </>
    )
}

export default Home;