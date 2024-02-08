import useASTitle from "../hooks/useASTitle"


const NotFound = () => {
    useASTitle(`404 Not Found`)

    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center gap-6'>
            <h1 className='font-extrabold text-6xl'>
                404 Not Found
            </h1>
            <button className='btn btn-primary' onClick={() => window.history.back()} href=''>Go back</button>
        </div>
    )
}

export default NotFound