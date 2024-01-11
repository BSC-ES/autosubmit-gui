import { Fragment } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


const Breadcrumb = () => {
    const breadcrumb_items = useSelector((state) => state.app.breadcrumb_items)

    return (
        <div className="px-4 pb-4 pt-3 d-flex gap-3 align-items-center text-primary fw-bold">
            <Link to={"/"}><i className="fa-solid fa-house" /></Link>
            {
                breadcrumb_items.map(item => {
                    return (
                        <Fragment key={item.name}>
                            <i className="fa-solid fa-chevron-right text-black"></i>
                            {
                                item.route ?
                                    <Link to={item.route}>{item.name}</Link>
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