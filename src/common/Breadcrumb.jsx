import { Fragment } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


const Breadcrumb = () => {
    const breadcrumb_items = useSelector((state) => state.app.breadcrumb_items)

    return (
        <div className="px-6 pb-6 pt-4 flex items-center gap-4  text-primary font-bold">
            <Link to={"/"}><i className="fa-solid fa-house" /></Link>
            {
                breadcrumb_items.map(item => {
                    return (
                        <Fragment key={item.name}>
                            <i className="fa-solid fa-chevron-right text-dark"></i>
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