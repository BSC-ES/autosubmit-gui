import { useParams } from "react-router-dom";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { Modal, ModalHeader, ModalContent } from "./Modal";
import { Table, TableCell } from "./Table";
import {
  creationDateToId,
  formatNumberMoney,
  statusAlertInHistory,
} from "../components/context/utils";
import { parseLogPath } from "../services/utils";
import { useState } from "react";
import LogModal from "./LogModal";

const JobHistoryModal = ({ expid, jobName, show, onHide }) => {
  const routeParams = useParams();
  const { data, isFetching } = autosubmitApiV3.endpoints.getJobHistory.useQuery(
    {
      expid: routeParams.expid,
      jobName: jobName,
    },
    { skip: !show }
  );

  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <Modal show={show} onClose={onHide}>
      <ModalHeader>
        <span>
          <i className="fa-solid fa-clock-rotate-left mx-2"></i> History of Job:{" "}
          <strong>{jobName}</strong>
        </span>
        <div className="cursor-pointer" onClick={onHide}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalContent>
        {isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="spinner-border m-5" role="status"></div>
          </div>
        ) : (
          <div className="overflow-auto max-h-[80vh]">
            <Table className="text-sm">
              <thead className="sticky top-0 bg-white">
                <tr>
                  {[
                    "RunId",
                    "out",
                    "err",
                    "Counter",
                    "JobId",
                    "Submit",
                    "Start",
                    "Finish",
                    "Queue",
                    "Run",
                    "Status",
                    "Energy",
                    "SYPD",
                    "ASYPD",
                    "Wallclock",
                    "NCpus",
                    "NNodes",
                  ].map((item) => (
                    <th key={item} className="p-2 text-left">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.history?.map((item) => (
                  <tr key={item.run_id}>
                    <TableCell>
                      {creationDateToId(String(item.run_created), item.run_id)}{" "}
                      <span className="bg-primary text-white rounded px-1">
                        {item.run_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        className="btn btn-dark text-xs px-2"
                        onClick={() => {
                          setSelectedLog(item.out);
                        }}
                      >
                        <i className="fa-solid fa-terminal"></i>
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        className="btn btn-dark text-xs px-2"
                        onClick={() => {
                          setSelectedLog(item.err);
                        }}
                      >
                        <i className="fa-solid fa-terminal"></i>
                      </button>
                    </TableCell>
                    <TableCell>{item.counter}</TableCell>
                    <TableCell>{item.job_id}</TableCell>
                    <TableCell>{item.submit}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.finish}</TableCell>
                    <TableCell>{item.queue_time}</TableCell>
                    <TableCell>
                      {item.run_time}{" "}
                      {item.run_time === "0:00:00" && (
                        <span
                          className="badge badge-warning"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="This running time value usually means that there has been some error either on the completion of the job or in the historical database storage process."
                        >
                          !
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.status}
                      {statusAlertInHistory(
                        item.submit,
                        item.start,
                        item.finish,
                        item.status
                      )}
                    </TableCell>
                    <TableCell>
                      {formatNumberMoney(item.energy, true)}
                    </TableCell>
                    <TableCell>
                      {item.run_id ? (
                        item.SYPD
                      ) : (
                        <span
                          className="badge badge-warning"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="This register is not associated to a run Id because it ran with an old version of the database, SYPD cannot be calculated."
                        >
                          !
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.run_id ? (
                        item.ASYPD
                      ) : (
                        <span
                          className="badge badge-warning"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="This register is not associated to a run Id because it ran with an old version of the database, ASYPD cannot be calculated."
                        >
                          !
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.wallclock}</TableCell>
                    <TableCell>{formatNumberMoney(item.ncpus, true)}</TableCell>
                    <TableCell>{formatNumberMoney(item.nodes, true)}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <LogModal
          logFile={parseLogPath(`${data?.path_to_logs}/${selectedLog}`)}
          show={Boolean(selectedLog)}
          onHide={() => setSelectedLog(null)}
        />
      </ModalContent>
    </Modal>
  );
};

export default JobHistoryModal;
