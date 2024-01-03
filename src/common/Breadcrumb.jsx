import { Fragment } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const Breadcrumb = () => {
    const navigate = useNavigate()
    const breadcrumb_items = useSelector((state) => state.app.breadcrumb_items)

    return (
        <div className="px-4 pb-4 pt-3 d-flex gap-3 align-items-center text-primary fw-bold">
            <i className="fa-solid fa-house" style={{ cursor: "pointer" }} onClick={() => navigate("/")} />
            {
                breadcrumb_items.map(item => {
                    return (
                        <Fragment key={item.name}>
                            <i className="fa-solid fa-chevron-right text-black"></i>
                            {
                                item.route ?
                                    <span style={{ cursor: "pointer" }} onClick={() => { navigate(item.route) }} >
                                        {item.name}
                                    </span>
                                    :
                                    <span>{item.name}</span>
                            }
                        </Fragment>
                    )
                })
            }

        </div>
    )
}

export default Breadcrumb