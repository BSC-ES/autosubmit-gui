import { Modal } from "react-bootstrap"
import { useGetJobLogQuery } from "../services/autosubmitApiV3"

const LogModal = ({ logFile, show, onHide }) => {

    const { data } = useGetJobLogQuery(logFile);

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton
                bsPrefix="modal-header bg-dark text-white">
                <Modal.Title>
                    <i className="fa-solid fa-terminal mx-2"></i> Log File: {logFile}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data &&
                    data.found === true &&
                    data.logcontent &&
                    data.logcontent.length > 0 && (
                        <pre className='bash bash-data mb-0 scroll'>
                            <ul style={{ listStyleType: "none" }} className='p-1 mb-0 ul-2'>
                                {data.logcontent.map((item) => (
                                    <li key={item.index}>
                                        <span className="small">{item.content}</span>
                                    </li>
                                ))}
                            </ul>
                        </pre>
                    )}
                {data &&
                    data.found === true &&
                    data.logcontent &&
                    data.logcontent.length === 0 && <p>The log is empty.</p>}
                {data && data.found === false && (
                    <p>The log was not found.</p>
                )}
                <div className='text-center'>
                    <span>Showing last 150 lines.</span>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LogModal