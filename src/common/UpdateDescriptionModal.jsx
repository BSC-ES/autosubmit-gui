import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import CommandPreview from "./CommandPreview";
import Modal from "./Modal";
import { RunnerOptionsFormSection } from "../common/RunnerOptionsFormSection";
import { useCallback, useState, useEffect } from "react";

const UpdateDescriptionModal = ({ expid, show, onHide }) => {
  const { data: endpointConfigData, isFetching: isEndpointConfigFetching } =
    autosubmitApiV4.endpoints.getRunnerEndpointsConfig.useQuery();

  const [
    updateExperimentDescription,
    {
      data: updateDescData,
      isLoading: isUpdateDescLoading,
      isSuccess: isUpdateDescSuccess,
      isError: isUpdateDescError,
    },
  ] = autosubmitApiV4.endpoints.runnerUpdateExperimentDescription.useMutation();

  const [newDescription, setNewDescription] = useState("");

  const [runnerProfileOptions, setRunnerProfileOptions] = useState({
    profile_name: "",
    profile_params: {},
  });

  const handleRunnerSelectionChange = useCallback((selection) => {
    setRunnerProfileOptions(selection);
  }, []);

  const handleSubmit = () => {
    const body = {
      expid,
      description: newDescription,
      profile_name: runnerProfileOptions.profile_name,
      profile_params: runnerProfileOptions.profile_params,
    };
    updateExperimentDescription(body);
  };

  useEffect(() => {
    if (isUpdateDescSuccess) {
      onHide(true);
    }
  }, [isUpdateDescSuccess, onHide]);

  return (
    <Modal show={show} onClose={() => onHide()}>
      <div className="bg-white text-black py-6 px-6 rounded-lg relative w-[40rem] max-w-[95vw]">
        <div
          className="cursor-pointer absolute top-4 right-4"
          onClick={() => onHide()}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center mb-4 mt-4">
            <label htmlFor="new-description" className="font-medium">
              New Description:
            </label>
            <input
              id="new-description"
              type="text"
              className="form-input w-full"
              placeholder="Enter new description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <CommandPreview
            command={
              "autosubmit updatdesc " + expid + ' "' + newDescription + '"'
            }
          />

          {isEndpointConfigFetching ? (
            <div className="text-sm opacity-50 text-center">
              Loading runner endpoints configuration...
            </div>
          ) : (
            endpointConfigData?.UPDATE_EXPERIMENT_DETAILS?.ENABLED !==
              false && (
              <>
                <hr className="mt-6 mb-4" />

                <div className="py-2 flex flex-col items-center">
                  <RunnerOptionsFormSection
                    onSelectionChange={handleRunnerSelectionChange}
                  />

                  {isUpdateDescError && (
                    <div className="text-red-600 mt-2 text-sm">
                      Error updating the description. Please check your
                      configuration and try again.
                    </div>
                  )}

                  <button
                    className="mt-2 bg-success text-white px-4 py-2 rounded hover:bg-success/90 disabled:bg-success/70"
                    disabled={
                      !runnerProfileOptions.profile_name || isUpdateDescLoading
                    }
                    onClick={handleSubmit}
                  >
                    {isUpdateDescLoading ? (
                      <span>
                        <i className="fa fa-spinner fa-spin me-2" /> UPDATING...
                      </span>
                    ) : (
                      "UPDATE DESCRIPTION"
                    )}
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateDescriptionModal;
