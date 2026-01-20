import { useState, useMemo } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";

export const RunnerOptionsFormSection = ({ onSelectionChange }) => {
  const {
    data: runnerProfiles,
    error: runnerProfilesError,
    isLoading: runnerProfilesLoading,
  } = autosubmitApiV4.endpoints.getRunnersConfigProfiles.useQuery();

  const {
    data: preferredUsername,
    isLoading: isLoadingPreferredUsername,
    error: preferredUsernameError,
  } = autosubmitApiV4.endpoints.getPreferredUsername.useQuery();

  const activeRunnerProfiles = useMemo(
    () => (runnerProfiles ? Object.keys(runnerProfiles) : []),
    [runnerProfiles]
  );

  const [selectedProfileName, setSelectedProfileName] = useState("");
  const [runnerConfig, setRunnerConfig] = useState({});

  const selectedProfile = useMemo(() => {
    if (!selectedProfileName || !runnerProfiles) return null;
    return runnerProfiles[selectedProfileName];
  }, [selectedProfileName, runnerProfiles]);

  const isSSHRunner = selectedProfile?.RUNNER_TYPE === "SSH";
  const hasModules = selectedProfile?.MODULE_LOADER_TYPE !== "NO_MODULE";

  const handleProfileNameChange = (profileName) => {
    const updatedSelection = { profile_name: profileName, profile_params: {} };
    setSelectedProfileName(updatedSelection.profile_name);
    setRunnerConfig(updatedSelection.profile_params);
    onSelectionChange?.(updatedSelection);
  };

  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...runnerConfig, [field]: value };
    setRunnerConfig(updatedConfig);
    onSelectionChange?.({
      profile_name: selectedProfileName,
      profile_params: updatedConfig,
    });
  };

  const handleSSHChange = (field, value) => {
    const updatedSSH = { ...runnerConfig.SSH, [field]: value };
    const updatedConfig = { ...runnerConfig, SSH: updatedSSH };
    setRunnerConfig(updatedConfig);
    onSelectionChange?.({
      profile_name: selectedProfileName,
      profile_params: updatedConfig,
    });
  };

  // Render loading/error states
  if (runnerProfilesLoading) {
    return <div className="text-gray-500">Loading runner profiles...</div>;
  }

  if (runnerProfilesError) {
    return <div className="text-red-500">Error loading runner profiles</div>;
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2 items-center">
        <label className="font-semibold text-lg">Runner profile:</label>
        <select
          className="px-2 py-1 border rounded text-sm"
          value={selectedProfileName}
          onChange={(e) => handleProfileNameChange(e.target.value)}
        >
          <option value="" disabled>
            Select Runner profile
          </option>
          {activeRunnerProfiles.map((runner) => (
            <option key={runner} value={runner}>
              {runner}
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-500">
          ({activeRunnerProfiles.length} profiles available)
        </div>
      </div>

      {selectedProfile && (
        <div className="flex flex-col border rounded py-4 px-4 gap-3">
          <div className="flex items-center">
            <label className="font-semibold min-w-[150px]">Runner type:</label>
            {selectedProfile.RUNNER_TYPE ? (
              <div className="ml-2">{selectedProfile.RUNNER_TYPE}</div>
            ) : (
              <input
                type="text"
                className="ml-2 px-2 py-1 border rounded text-sm flex-1"
                placeholder="Enter runner type"
                value={runnerConfig.RUNNER_TYPE || ""}
                onChange={(e) =>
                  handleConfigChange("RUNNER_TYPE", e.target.value)
                }
              />
            )}
          </div>

          {isSSHRunner && (
            <div className="flex flex-col border rounded py-3 px-4 gap-3 bg-gray-50 dark:bg-gray-800">
              <div className="font-semibold text-sm">
                SSH Configuration:{" "}
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={300}>
                    <Tooltip.Trigger asChild>
                      <i className="fa-solid fa-circle-question"></i>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center z-[500]"
                      >
                        Using an SSH runner might require adding the API public
                        key to your authorized_keys on the remote host. Visit
                        the{" "}
                        <Link
                          to="/settings"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Settings
                        </Link>{" "}
                        page for more info.
                        <Tooltip.Arrow />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              <div className="flex items-center">
                <label className="font-medium min-w-[120px] text-sm">
                  Host:
                </label>
                {selectedProfile.SSH?.HOST ? (
                  <div className="ml-2">{selectedProfile.SSH.HOST}</div>
                ) : (
                  <input
                    type="text"
                    className="ml-2 px-2 py-1 border rounded text-sm flex-1"
                    placeholder="Enter SSH host"
                    value={runnerConfig.SSH?.HOST || ""}
                    onChange={(e) => handleSSHChange("HOST", e.target.value)}
                  />
                )}
              </div>

              <div className="flex items-center">
                <label className="font-medium min-w-[120px] text-sm">
                  Username:
                </label>
                {selectedProfile.SSH?.USERNAME ? (
                  <div className="ml-2">{selectedProfile.SSH.USERNAME}</div>
                ) : (
                  <>
                    <input
                      type="text"
                      className="ml-2 px-2 py-1 border rounded text-sm flex-1"
                      placeholder="Enter SSH username"
                      value={runnerConfig.SSH?.USERNAME || ""}
                      onChange={(e) =>
                        handleSSHChange("USERNAME", e.target.value)
                      }
                    />
                    {preferredUsername?.preferred_username && (
                      <button
                        className="ml-2 px-3 py-1 text-primary rounded text-sm hover:underline"
                        onClick={() => {
                          handleSSHChange(
                            "USERNAME",
                            preferredUsername.preferred_username
                          );
                        }}
                      >
                        Use {preferredUsername.preferred_username} ?
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center">
                <label className="font-medium min-w-[120px] text-sm">
                  Port:
                </label>
                {selectedProfile.SSH?.PORT ? (
                  <div className="ml-2">{selectedProfile.SSH.PORT}</div>
                ) : (
                  <input
                    type="number"
                    className="ml-2 px-2 py-1 border rounded text-sm w-24"
                    placeholder="22"
                    value={runnerConfig.SSH?.PORT || ""}
                    onChange={(e) => handleSSHChange("PORT", e.target.value)}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <label className="font-semibold min-w-[150px]">
              Module Loader type:
            </label>
            {selectedProfile.MODULE_LOADER_TYPE ? (
              <div className="ml-2">{selectedProfile.MODULE_LOADER_TYPE}</div>
            ) : (
              <input
                type="text"
                className="ml-2 px-2 py-1 border rounded text-sm flex-1"
                placeholder="Enter module loader type"
                value={runnerConfig.MODULE_LOADER_TYPE || ""}
                onChange={(e) =>
                  handleConfigChange("MODULE_LOADER_TYPE", e.target.value)
                }
              />
            )}
          </div>

          {hasModules && (
            <div className="flex items-center">
              <label className="font-semibold min-w-[150px]">Modules:</label>
              {selectedProfile.MODULES ? (
                <div className="ml-2">
                  {Array.isArray(selectedProfile.MODULES)
                    ? selectedProfile.MODULES.join(", ")
                    : selectedProfile.MODULES}
                </div>
              ) : (
                <input
                  type="text"
                  className="ml-2 px-2 py-1 border rounded text-sm flex-1"
                  placeholder="Enter modules to load"
                  value={runnerConfig.MODULES || ""}
                  onChange={(e) =>
                    handleConfigChange("MODULES", e.target.value)
                  }
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
