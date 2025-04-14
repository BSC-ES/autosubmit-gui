import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { Modal, ModalHeader, ModalContent } from "./Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import {
  creationDateToId,
  formatNumberMoney,
  statusAlertInHistory,
} from "../components/context/utils";
import { exportToCSV, parseLogPath } from "../services/utils";
import { useState } from "react";
import LogModal from "./LogModal";

const JobHistoryModal = ({ expid, jobName, show, onHide }) => {
  const { data, isFetching } = autosubmitApiV3.endpoints.getJobHistory.useQuery(
    {
      expid: expid,
      jobName: jobName,
    },
    { skip: !show }
  );

  const [selectedLog, setSelectedLog] = useState(null);

  const handleExportJobHistory = () => {
    const exportableData = data?.history?.map((item) => {
      return [
        creationDateToId(String(item.run_created), item.run_id),
        item.counter,
        item.job_id,
        item.submit,
        item.start,
        item.finish,
        item.queue_time,
        item.run_time,
        item.status,
        formatNumberMoney(item.energy, true),
        item.SYPD,
        item.PSYPD,
        item.wallclock,
        formatNumberMoney(item.ncpus, true),
        formatNumberMoney(item.nodes, true),
      ];
    });
    exportToCSV(
      [
        "RunId",
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
        "PSYPD",
        "Wallclock",
        "NCpus",
        "NNodes",
      ],
      exportableData,
      `${new Date().toISOString()}_${jobName}_history.csv`
    );
  };

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
          <div className="flex flex-col gap-2">
            <div className="overflow-auto max-h-[75vh] custom-scrollbar">
              <Table className="text-sm">
                <TableHead className="sticky top-0 bg-white">
                  <TableRow>
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
                      "PSYPD",
                      "Wallclock",
                      "NCpus",
                      "NNodes",
                    ].map((item) => (
                      <TableHeader key={item} className="p-2 text-left">
                        {item}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.history?.map((item) => (
                    <TableRow key={item.run_id}>
                      <TableCell>
                        {creationDateToId(
                          String(item.run_created),
                          item.run_id
                        )}{" "}
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
                          item.PSYPD
                        ) : (
                          <span
                            className="badge badge-warning"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="This register is not associated to a run Id because it ran with an old version of the database, PSYPD cannot be calculated."
                          >
                            !
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{item.wallclock}</TableCell>
                      <TableCell>
                        {formatNumberMoney(item.ncpus, true)}
                      </TableCell>
                      <TableCell>
                        {formatNumberMoney(item.nodes, true)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="text-right">
              <button
                onClick={handleExportJobHistory}
                className="btn btn-light text-sm border"
              >
                Export to CSV
              </button>
            </div>
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
