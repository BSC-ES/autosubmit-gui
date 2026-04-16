import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalContent } from "./Modal";

const RunnerHelpModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onClose={onHide}>
      <ModalHeader>
        <span className="flex items-center gap-2 text-xl">
          <i className="fa-solid fa-circle-question mx-2"></i>
          Runner Profiles Help
        </span>
        <button
          onClick={onHide}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </ModalHeader>
      <ModalContent className="w-[40rem] max-w-[95vw] flex flex-col gap-4">
        <div className="flex gap-3">
          <i className="fa-solid fa-layer-group text-primary mt-0.5 shrink-0"></i>
          <p className="text-sm text-gray-700">
            Runner profiles allow you to define different execution environments
            for your commands. Each profile can have specific parameters that
            customize how the command will be run.
          </p>
        </div>
        <div className="flex gap-3">
          <i className="fa-solid fa-sliders text-primary mt-0.5 shrink-0"></i>
          <p className="text-sm text-gray-700">
            To use a runner profile, select one menu when
            configuring your command. The available profiles are defined by your
            system administrator and may include options for local execution,
            SSH execution on remote machines, or other custom environments.
          </p>
        </div>
        <div className="flex gap-3">
          <i className="fa-solid fa-wrench text-primary mt-0.5 shrink-0"></i>
          <p className="text-sm text-gray-700">
            When you select a runner profile, the corresponding parameters will
            be loaded and can be further customized if needed. Make sure to
            review the parameters for each profile to ensure they are set up
            correctly for your command.
          </p>
        </div>
        <div className="flex gap-3">
          <i className="fa-solid fa-terminal text-primary mt-0.5 shrink-0"></i>
          <p className="text-sm text-gray-700">
            When using an <strong>SSH runner</strong>, the API needs to be able
            to connect to your remote machine. To allow this, add the API&apos;s
            public SSH key to your{" "}
            <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
              ~/.ssh/authorized_keys
            </code>{" "}
            file on the remote host. You can find the public key(s) on the{" "}
            <Link
              to="/settings"
              className="text-primary underline hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              Settings
            </Link>{" "}
            page, under the <em>Runner configuration</em> section.
          </p>
        </div>
        <div className="flex gap-3">
          <i className="fa-solid fa-headset text-primary mt-0.5 shrink-0"></i>
          <p className="text-sm text-gray-700">
            If you encounter any issues with runner profiles or need assistance
            in setting them up, please contact your system administrator or
            refer to the documentation provided by your organization.
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default RunnerHelpModal;
