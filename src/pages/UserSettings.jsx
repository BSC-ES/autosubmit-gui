import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cn } from "../services/utils";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import * as Tooltip from "@radix-ui/react-tooltip";

const PreferredUsernameInput = () => {
  const {
    data,
    isLoading: isLoadingPreferredUsername,
    error: preferredUsernameError,
  } = autosubmitApiV4.endpoints.getPreferredUsername.useQuery();

  const [preferredUsername, setPreferredUsernameInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isNotAvailable, setIsNotAvailable] = useState(false);

  const [
    updatePreferredUsername,
    {
      isLoading: isUpdatingPreferredUsername,
      isSuccess: isUpdatedPreferredUsername,
      isError: isUpdatePreferredUsernameError,
      error: updatePreferredUsernameError,
    },
  ] = autosubmitApiV4.endpoints.updatePreferredUsername.useMutation();

  useEffect(() => {
    if (data && data.preferred_username !== undefined) {
      setPreferredUsernameInput(data.preferred_username);
      setIsDirty(false);
    }
    console.log("preferredUsernameError", preferredUsernameError || "none");
    if (preferredUsernameError && preferredUsernameError.status === 404) {
      setIsNotAvailable(true);
    } else {
      setIsNotAvailable(false);
    }
  }, [data, preferredUsernameError]);

  const handlePreferredUsernameChange = (e) => {
    setPreferredUsernameInput(e.target.value);
    setIsDirty(true);
  };

  const handlePreferredUsernameSave = (e) => {
    e.preventDefault();
    updatePreferredUsername({ preferred_username: preferredUsername });
    setIsDirty(false);
  };

  return (
    <form
      className="flex items-center min-w-0 grow"
      onSubmit={handlePreferredUsernameSave}
      style={{ minWidth: 0 }}
    >
      <input
        className="min-w-0 grow px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition-all duration-150 bg-neutral-50 dark:bg-neutral-900 text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        type="text"
        value={preferredUsername}
        onChange={handlePreferredUsernameChange}
        disabled={
          isLoadingPreferredUsername ||
          isUpdatingPreferredUsername ||
          isNotAvailable
        }
        placeholder="Enter preferred username"
        maxLength={128}
        style={{ minWidth: "100px", maxWidth: "220px" }}
        readOnly={isLoadingPreferredUsername || isUpdatingPreferredUsername}
      />
      <button
        type="submit"
        className="ml-2 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-base transition disabled:opacity-50"
        disabled={
          isLoadingPreferredUsername ||
          isUpdatingPreferredUsername ||
          !isDirty ||
          preferredUsername.trim() === "" ||
          isNotAvailable
        }
        title="Save preferred username"
        style={{
          minWidth: 32,
          minHeight: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className={cn(
            "fa-solid",
            isUpdatingPreferredUsername
              ? "fa-spinner fa-spin"
              : "fa-floppy-disk"
          )}
        ></i>
      </button>
      {isUpdatedPreferredUsername && !isUpdatingPreferredUsername && (
        <span className="text-success ms-2 text-sm">Saved!</span>
      )}
      {isUpdatePreferredUsernameError && (
        <span className="text-danger ms-2 text-sm">
          {updatePreferredUsernameError?.data?.detail || "Error saving"}
        </span>
      )}
      {isNotAvailable && (
        <span className="text-danger ms-2 text-sm">
          The preferred username option is not available.
        </span>
      )}
    </form>
  );
};

const TokenBox = ({ token }) => {
  const [tokenHide, setTokenHide] = useState(true);
  const copyToClipboard = useCopyToClipboard()[1];
  const [copied, setCopied] = useState(false);

  const censorToken = (token) => {
    // replace all the characters to •
    return "•".repeat(token.length);
  };

  const handleCopy = () => {
    copyToClipboard(token);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex border rounded grow overflow-hidden">
      <input
        className="grow px-2 truncate min-w-0"
        type="text"
        value={tokenHide ? censorToken(token) : token}
        readOnly
        disabled
      />
      <button
        title={tokenHide ? "Show" : "Hide"}
        className="border-l dark:border-l-neutral-600 px-2 opacity-70"
        onClick={() => setTokenHide(!tokenHide)}
      >
        <i className={cn("fa-solid", tokenHide ? "fa-eye-slash" : "fa-eye")} />
      </button>
      <button
        title="Copy to clipboard"
        className="border-l dark:border-l-neutral-600 px-2 opacity-70"
        onClick={handleCopy}
      >
        <i
          className={cn(
            copied ? "fa-solid fa-check text-success" : "fa-regular fa-copy"
          )}
        />
      </button>
    </div>
  );
};

const SSHKeyBox = ({ keyValue }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = useCopyToClipboard()[1];
  const handleCopy = () => {
    copyToClipboard(keyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800 flex items-start justify-between gap-2">
      <div className="font-mono break-all text-xs flex-1">{keyValue}</div>
      <button
        title="Copy to clipboard"
        className="ml-2 px-2 py-1 text-xs border rounded opacity-70 hover:opacity-100 transition"
        onClick={handleCopy}
      >
        <i
          className={cn(
            copied ? "fa-solid fa-check text-success" : "fa-regular fa-copy"
          )}
        />
      </button>
    </div>
  );
};

const RunnerConfigSection = () => {
  const {
    data: runnersConfig,
    error: runnersConfigError,
    isLoading: runnersConfigLoading,
  } = autosubmitApiV4.endpoints.getRunnersConfig.useQuery();

  const {
    data: publicSSHKeys,
    error: publicSSHKeysError,
    isLoading: publicSSHKeysLoading,
  } = autosubmitApiV4.endpoints.getPublicSSHKeys.useQuery();

  return (
    <div className="border rounded-2xl px-8 pt-8 pb-12">
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Runner configuration</h2>

        <hr className="mt-2 mb-8" />

        {runnersConfigLoading && (
          <div className="px-4 text-center py-8">
            <i className="fa-solid fa-spinner fa-spin me-2" />
            Loading runner configuration...
          </div>
        )}

        {runnersConfigError && (
          <div className="px-4 text-center py-8 text-red-500">
            <i className="fa-solid fa-exclamation-triangle me-2" />
            Error loading runner configuration
          </div>
        )}

        {runnersConfig && (
          <div className="px-4 flex flex-col gap-8">
            {Object.entries(runnersConfig).map(([runnerName, runnerConfig]) => (
              <div key={runnerName}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{runnerName}</h3>
                  <span
                    className={cn(
                      "text-sm",
                      runnerConfig.ENABLED
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {runnerConfig.ENABLED ? "● Enabled" : "○ Disabled"}
                  </span>
                </div>

                {runnerConfig.MODULE_LOADERS && (
                  <div className="ml-6 space-y-3">
                    {Object.entries(runnerConfig.MODULE_LOADERS).map(
                      ([loaderName, loaderConfig]) => (
                        <div key={loaderName}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-800 dark:text-gray-300">
                              {loaderName}
                            </span>
                            <span
                              className={cn(
                                "text-sm",
                                loaderConfig.ENABLED
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400 dark:text-gray-500"
                              )}
                            >
                              {loaderConfig.ENABLED
                                ? "● Enabled"
                                : "○ Disabled"}
                            </span>
                          </div>

                          {loaderConfig.MODULES_WHITELIST &&
                            loaderConfig.MODULES_WHITELIST.length > 0 && (
                              <div className="ml-4 mt-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Whitelisted modules:
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5 ml-4">
                                  {loaderConfig.MODULES_WHITELIST.map(
                                    (module, idx) => (
                                      <div key={idx}>- {module}</div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {loaderConfig.MODULES_WHITELIST &&
                            loaderConfig.MODULES_WHITELIST.length === 0 && (
                              <div className="ml-4 mt-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  No modules whitelisted (all modules allowed)
                                </div>
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SSH Keys */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Public SSH Keys</h3>

          <div className="mb-4 text-sm ml-2 text-gray-700 dark:text-gray-300">
            Include these public SSH keys your authorized_keys file to allow SSH
            access to runners
          </div>

          {publicSSHKeysLoading && (
            <div className="px-4 text-center py-8">
              <i className="fa-solid fa-spinner fa-spin me-2" />
              Loading public SSH keys...
            </div>
          )}

          {publicSSHKeysError && (
            <div className="px-4 text-center py-8 text-red-500">
              <i className="fa-solid fa-exclamation-triangle me-2" />
              Error loading public SSH keys
            </div>
          )}

          {publicSSHKeys?.ssh_public_keys &&
            publicSSHKeys.ssh_public_keys.length === 0 && (
              <div className="px-4 py-4 text-gray-500">
                No public SSH keys found
              </div>
            )}

          {publicSSHKeys?.ssh_public_keys &&
            publicSSHKeys.ssh_public_keys.length > 0 && (
              <div className="px-4 flex flex-col gap-4">
                {publicSSHKeys.ssh_public_keys.map((key, idx) => {
                  return <SSHKeyBox key={idx} keyValue={key} />;
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const UserSettings = () => {
  useASTitle(`Settings`);
  useBreadcrumb([
    {
      name: `Settings`,
    },
  ]);

  const token = (localStorage.getItem("token") || "").replace("Bearer ", "");

  const authState = useSelector((state) => state.auth);

  useEffect(() => {});

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-2xl px-8 pt-8 pb-12">
        <div className="flex flex-col">
          <h2 className="text-3xl font-semibold">User settings</h2>

          <hr className="mt-2 mb-8" />

          <div className="px-4 flex flex-col gap-6 w-full">
            <div className="flex">
              <span className="font-semibold me-4">Username:</span>
              {authState.user_id}
            </div>

            <div className="flex flex-wrap items-center">
              <span className="font-semibold me-4">
                Preferred username{" "}
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={300}>
                    <Tooltip.Trigger>
                      <i className="fa-solid fa-info-circle opacity-70" />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
                    >
                      This username will be suggested when you are about to
                      submit any command through a Runner
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>{" "}
                :
              </span>
              <PreferredUsernameInput />
            </div>

            <div className="flex flex-wrap">
              <span className="font-semibold me-4">Token: </span>
              <TokenBox token={token} />
            </div>
          </div>
        </div>
      </div>

      <RunnerConfigSection />
    </div>
  );
};

export default UserSettings;
