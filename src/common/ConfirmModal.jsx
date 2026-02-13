import { cn } from "../services/utils";
import Modal from "./Modal";

const ConfirmModal = ({
  show,
  onConfirm,
  onCancel,
  message,
  variation = "success",
}) => {
  return (
    <Modal show={show} onClose={onCancel}>
      <div className="bg-white text-black py-6 px-6 rounded-lg w-96">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={cn(
              "text-white px-4 py-2 rounded hover:bg-opacity-90",
              variation === "danger" ? "bg-danger" : "bg-success",
            )}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
