import { Dialog } from "@headlessui/react";
import { useGetJobLogQuery } from "../services/autosubmitApiV3"
import Modal from "./Modal";

const LogModal = ({ logFile, show, onHide }) => {

  const { data } = useGetJobLogQuery(logFile, {
    skip: !show
  });

  return (
    <Modal show={show} onClose={onHide}>
      <Dialog.Title className={"bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"}>
        <span className="truncate">
          <i className="fa-solid fa-terminal me-4"></i> Log File: {logFile}
        </span>
        <div className="cursor-pointer" onClick={onHide}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </Dialog.Title>
      <div className="bg-white py-6 px-6 rounded-b-lg">
        {data &&
          data.found === true &&
          data.logcontent &&
          data.logcontent.length > 0 && (
            <pre className='bash bash-data mb-0 scroll'>
              <ul style={{ listStyleType: "none" }} className='p-1 mb-0 ul-2'>
                {data.logcontent.map((item) => (
                  <li key={item.index}>
                    <span className="text-sm">{item.content}</span>
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
      </div>
    </Modal>
  )
}

export default LogModal