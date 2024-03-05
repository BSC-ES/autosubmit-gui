import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { creationDateToId } from "../components/context/utils";
import Modal from "./Modal";
import { Dialog } from "@headlessui/react";



const RunsModal = ({ expid, show, onHide, onRunSelect }) => {

  const { data, isFetching } = autosubmitApiV3.endpoints.getRuns.useQuery(expid, {
    skip: !show
  })

  return (
    <Modal show={show} onClose={onHide}>
      <Dialog.Title className={"bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"}>
        <span>
          <i className="fa-solid fa-clock-rotate-left mx-2"></i> Runs of <strong>{expid}</strong>
        </span>
        <div className="cursor-pointer" onClick={onHide}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </Dialog.Title>
      <div className="bg-white text-black py-6 px-6 rounded-b-lg">
        {
          isFetching ?
            <div className="w-full h-full flex items-center justify-center">
              <div className="spinner-border m-5" role="status"></div>
            </div>
            :
            <div className="text-sm scroll">
              <table className="table table-bordered">
                <thead className="bg-dark text-white">
                  <tr>
                    <th scope='col' className='border'></th>
                    <th scope='col' className='ps-2'>
                      RunId
                    </th>
                    <th scope='col' className='ps-2'>
                      Created
                    </th>
                    <th scope='col' className='ps-2'>
                      Finish
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Submitted
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Queuing
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Running
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Failed
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Suspended
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Completed
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      Total
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      SYPD
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      ASYPD
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      ChunkUnit
                    </th>
                    <th scope='col' className='text-right pe-2'>
                      ChunkSize
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    data?.runs &&
                    data.runs.map(item => (
                      <tr key={item.run_id}>
                        <td className='text-center'>
                          <button
                            className={"rounded-full btn btn-sm btn-primary text-white"}
                            type='button'
                            onClick={() => onRunSelect(item)}
                          >
                            <i className='fas fa-eye'></i>
                          </button>
                        </td>
                        <td className='ps-1 runIdtd'>
                          {creationDateToId(
                            String(item.created),
                            item.run_id
                          )}{" "}
                          <span className='bg-primary text-white rounded px-1'>
                            {item.run_id}
                          </span>
                        </td>
                        <td className='ps-1'>{item.created}</td>
                        <td className='ps-1'>{item.finish}</td>
                        <td className='text-right pe-1'>
                          {item.submitted}
                        </td>
                        <td className='text-right pe-1'>{item.queuing}</td>
                        <td className='text-right pe-1'>{item.running}</td>
                        <td className='text-right pe-1'>{item.failed}</td>
                        <td className='text-right pe-1'>
                          {item.suspended}
                        </td>
                        <td className='text-right pe-1'>
                          {item.completed}
                        </td>
                        <td className='text-right pe-1'>
                          <strong>{item.total}</strong>
                        </td>
                        <td className='text-right pe-1'>{item.SYPD}</td>
                        <td className='text-right pe-1'>{item.ASYPD}</td>
                        <td className='text-right pe-1'>
                          {item.chunk_unit}
                        </td>
                        <td className='text-right pe-1'>
                          {item.chunk_size}
                        </td>
                      </tr>

                    ))
                  }
                </tbody>
              </table>
            </div>
        }
      </div>
    </Modal>
  )
}

export default RunsModal;