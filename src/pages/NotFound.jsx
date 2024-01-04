import useASTitle from "../hooks/useASTitle"


const NotFound = () => {
    useASTitle(`404 Not Found`)

    return (
        <div className='vw-100 vh-100 d-flex flex-column align-items-center justify-content-center'>
            <h1 className='fw-bolder'>
                404 Not Found
            </h1>
            <button className='btn btn-primary text-white' onClick={() => window.history.back()} href=''>Go back</button>
        </div>
    )
}

export default NotFound