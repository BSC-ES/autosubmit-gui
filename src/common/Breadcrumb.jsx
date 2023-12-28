import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";


const Breadcrumb = () => {
    return (
        <div className="px-4 pb-4 pt-3 d-flex gap-4 align-items-center text-primary fw-bold">
            <i className="fa-solid fa-house" />
            <i className="fa-solid fa-chevron-right text-black"></i>
            <span>Experiment</span>
        </div>
    )
}

export default Breadcrumb