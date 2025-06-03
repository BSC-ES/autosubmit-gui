import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { creationDateToId } from "../components/context/utils";
import Modal from "./Modal";
import { Dialog } from "@headlessui/react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "./Table";

const RunsModal = ({ expid, show, onHide, onRunSelect }) => {
  const { data, isFetching } = autosubmitApiV3.endpoints.getRuns.useQuery(
    expid,
    {
      skip: !show,
    }
  );

  return (
    <Modal show={show} onClose={onHide}>
      <Dialog.Title
        className={
          "bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"
        }
      >
        <span>
          <i className="fa-solid fa-clock-rotate-left mx-2"></i> Runs of{" "}
          <strong>{expid}</strong>
        </span>
        <div className="cursor-pointer" onClick={onHide}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </Dialog.Title>
      <div className="bg-white text-black py-6 px-6 rounded-b-lg">
        {isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="spinner-border m-5" role="status"></div>
          </div>
        ) : (
          <div className="max-h-[75vh] overflow-auto custom-scrollbar">
            <Table className="text-sm">
              <TableHead className="sticky top-0 bg-white">
                <TableRow>
                  {[
                    "Select",
                    "RunId",
                    "Created",
                    "Finish",
                    "Submitted",
                    "Queuing",
                    "Running",
                    "Failed",
                    "Suspended",
                    "Completed",
                    "Total",
                    "SYPD",
                    "PSYPD",
                    "ChunkUnit",
                    "ChunkSize",
                  ].map((item) => (
                    <TableHeader>{item}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.runs &&
                  data.runs.map((item) => (
                    <TableRow key={item.run_id}>
                      <TableCell className="text-center">
                        <button
                          className={
                            "rounded text-xs px-2 btn btn-sm btn-primary text-white"
                          }
                          type="button"
                          onClick={() => onRunSelect(item)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </TableCell>
                      <TableCell>
                        {creationDateToId(String(item.created), item.run_id)}{" "}
                        <span className="bg-primary text-white rounded px-1">
                          {item.run_id}
                        </span>
                      </TableCell>
                      <TableCell>{item.created}</TableCell>
                      <TableCell>{item.finish}</TableCell>
                      <TableCell>{item.submitted}</TableCell>
                      <TableCell>{item.queuing}</TableCell>
                      <TableCell>{item.running}</TableCell>
                      <TableCell>{item.failed}</TableCell>
                      <TableCell>{item.suspended}</TableCell>
                      <TableCell>{item.completed}</TableCell>
                      <TableCell className="font-bold">{item.total}</TableCell>
                      <TableCell>{item.SYPD}</TableCell>
                      <TableCell>{item.PSYPD}</TableCell>
                      <TableCell>{item.chunk_unit}</TableCell>
                      <TableCell>{item.chunk_size}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RunsModal;
