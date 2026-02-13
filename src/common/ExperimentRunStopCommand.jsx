import { usePrevious } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { cn } from "../services/utils";
import { showToast } from "../store/toastSlice";
import ConfirmModal from "./ConfirmModal";
import Modal, { ModalContent, ModalHeader } from "./Modal";
import { RunnerOptionsFormSection } from "./RunnerOptionsFormSection";

const RunCommandModal = ({ show, onClose, onSuccess, expid }) => {
  const [runnerProfileOptions, setRunnerProfileOptions] = useState({
    profile_name: "",
    profile_params: {},
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const [
    runExperiment,
    {
      isLoading: runExperimentLoading,
      isSuccess: isRunExperimentSuccess,
      isError: isRunExperimentError,
    },
  ] = autosubmitApiV4.endpoints.runnerRunExperiment.useMutation();

  // Hide modal on successful mutation
  useEffect(() => {
    if (isRunExperimentSuccess) {
      onSuccess();
      onClose();
    }
  }, [isRunExperimentSuccess]);

  const handleRunnerSelectionChange = useCallback((selection) => {
    setRunnerProfileOptions(selection);
  }, []);

  const handleSubmitCommand = () => {
    const body = {
      expid,
      profile_name: runnerProfileOptions.profile_name,
      profile_params: runnerProfileOptions.profile_params,
    };
    runExperiment(body);
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <ModalHeader>
          <div className="text-lg font-semibold flex items-center px-4">
            <span className="flex items-center justify-center w-6 aspect-square bg-white text-dark rounded-full text-sm me-2">
              <i className="fa-solid fa-play"></i>
            </span>{" "}
            Run {expid} experiment
          </div>
        </ModalHeader>
        <ModalContent>
          <div className="py-2 flex flex-col items-center">
            <RunnerOptionsFormSection
              onSelectionChange={handleRunnerSelectionChange}
            />

            {isRunExperimentError && (
              <div className="text-red-600 mt-2 text-sm">
                Error running the experiment. Please check your configuration
                and try again.
              </div>
            )}

            <button
              className="mt-2 bg-success text-white px-4 py-2 rounded hover:bg-success/90 disabled:bg-success/70"
              disabled={
                !runnerProfileOptions.profile_name || runExperimentLoading
              }
              onClick={() => setShowConfirm(true)}
            >
              {runExperimentLoading ? (
                <span>
                  <i className="fa fa-spinner fa-spin me-2" /> RUNNING...
                </span>
              ) : (
                "RUN EXPERIMENT"
              )}
            </button>
          </div>
        </ModalContent>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
        }}
        onConfirm={() => {
          handleSubmitCommand();
          setShowConfirm(false);
        }}
        message={`Are you sure you want to run the ${expid} experiment?`}
      />
    </>
  );
};

const StopCommandModal = ({ show, onClose, onSuccess, expid }) => {
  const [
    stopExperiment,
    {
      isLoading: stopExperimentLoading,
      isSuccess: isStopExperimentSuccess,
      isError: isStopExperimentError,
    },
  ] = autosubmitApiV4.endpoints.runnerStopExperiment.useMutation();

  // Hide modal on successful mutation
  useEffect(() => {
    if (isStopExperimentSuccess) {
      onSuccess();
      onClose();
    }
  }, [isStopExperimentSuccess]);

  const handleSubmitCommand = () => {
    const body = {
      expid,
    };
    stopExperiment(body);
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <ModalHeader className="bg-danger text-white px-6">
          <div className="text-lg font-semibold flex items-center">
            <span className="flex items-center justify-center w-6 aspect-square bg-white text-danger rounded-full text-sm me-2">
              <i className="fa-solid fa-stop"></i>
            </span>{" "}
            Stop {expid} experiment
          </div>
        </ModalHeader>
        <ModalContent>
          <div className="flex flex-col">
            {stopExperimentLoading ? (
              <div className="flex flex-col items-center gap-4 mx-24">
                <i className="spinner-border border-danger border-b-transparent dark:border-danger dark:border-b-transparent h-16 w-16" />
                <div className="text-sm text-center">
                  <p>Stopping the experiment</p>
                  <p>It could take some time</p>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2">
                  Are you sure you want to stop the <strong>{expid}</strong>{" "}
                  experiment?
                </p>

                <p className="text-sm text-gray-600">
                  (Stopping an experiment might take a while)
                </p>

                {isStopExperimentError && (
                  <div className="text-red-600 mt-2 text-sm">
                    Error stopping the experiment. Please try again.
                  </div>
                )}

                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="text-white bg-gray-400 px-8 py-2 rounded hover:bg-gray-500 transition"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-danger text-white px-8 py-2 rounded hover:bg-danger/90 disabled:bg-danger/70"
                    disabled={stopExperimentLoading}
                    onClick={() => handleSubmitCommand()}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

const ExperimentRunStopCommand = ({ expid }) => {
  const dispatch = useDispatch();
  const [showRunCmdModal, setShowRunCmdModal] = useState(false);
  const [showStopCmdModal, setShowStopCmdModal] = useState(false);

  const { data: expInfoData, refetch: refetchExpInfo } =
    autosubmitApiV4.endpoints.runnerRunStatusCheck.useQuery(
      { expid },
      {
        pollingInterval: 10000,
      },
    );

  const prevExpInfoData = usePrevious(expInfoData);

  useEffect(() => {
    if (
      prevExpInfoData?.status === "ACTIVE" &&
      expInfoData?.status !== "ACTIVE"
    ) {
      // Experiment has stopped
      if (expInfoData?.status === "COMPLETED") {
        dispatch(
          showToast({
            message: `Experiment ${expid} has completed successfully.`,
            type: "success",
            duration: 10000,
          }),
        );
      } else {
        dispatch(
          showToast({
            message: `Experiment ${expid} has stopped with status: ${expInfoData?.status}. If this was unexpected, please check the experiment logs for more details.`,
            type: "info",
            duration: 10000,
          }),
        );
      }
    }
  }, [expInfoData]);

  const isRunning = expInfoData?.status === "ACTIVE" || false;

  const toggleRunCmdModal = () => {
    setShowRunCmdModal(!showRunCmdModal);
  };

  const toggleStopCmdModal = () => {
    setShowStopCmdModal(!showStopCmdModal);
  };

  const onSuccessChangeCommand = () => {
    refetchExpInfo();
  };

  return (
    <>
      <RunCommandModal
        show={showRunCmdModal}
        onClose={toggleRunCmdModal}
        onSuccess={onSuccessChangeCommand}
        expid={expid}
      />
      <StopCommandModal
        show={showStopCmdModal}
        onClose={toggleStopCmdModal}
        onSuccess={onSuccessChangeCommand}
        expid={expid}
      />
      {isRunning ? (
        <button
          className={cn(
            "btn rounded-full aspect-square w-8 flex items-center justify-center btn-danger",
          )}
          onClick={toggleStopCmdModal}
        >
          <i className="fa-solid fa-stop" />
        </button>
      ) : (
        <button
          className={cn(
            "btn rounded-full aspect-square w-8 flex items-center justify-center btn-success",
          )}
          onClick={toggleRunCmdModal}
        >
          <i className="fa-solid fa-play" />
        </button>
      )}
    </>
  );
};

export default ExperimentRunStopCommand;
