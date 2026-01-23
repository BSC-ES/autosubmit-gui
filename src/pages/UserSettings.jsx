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
              : "fa-floppy-disk",
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
            copied ? "fa-solid fa-check text-success" : "fa-regular fa-copy",
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
            copied ? "fa-solid fa-check text-success" : "fa-regular fa-copy",
          )}
        />
      </button>
    </div>
  );
};

const RunnerProfileDetails = ({ profileName, profileConfig }) => {
  const isSSHRunner = profileConfig.RUNNER_TYPE === "SSH";
  const hasModules = profileConfig.MODULE_LOADER_TYPE !== "NO_MODULE";

  const ConfigRow = ({ label, value, isUserProvided = false }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[140px]">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-mono",
          isUserProvided && "italic text-gray-500 dark:text-gray-500",
        )}
      >
        {isUserProvided ? `<${value}>` : value}
      </span>
    </div>
  );

  const renderModules = (modules) => {
    if (Array.isArray(modules)) {
      return modules.join(", ");
    }
    return String(modules);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 overflow-auto">
      <h3 className="text-lg font-semibold mb-3">{profileName}</h3>
      <div className="space-y-2">
        <ConfigRow
          label="Runner Type"
          value={profileConfig.RUNNER_TYPE || "any runner type"}
          isUserProvided={!profileConfig.RUNNER_TYPE}
        />
        <ConfigRow
          label="Module Loader"
          value={profileConfig.MODULE_LOADER_TYPE || "any module loader"}
          isUserProvided={!profileConfig.MODULE_LOADER_TYPE}
        />
        {hasModules && (
          <ConfigRow
            label="Modules"
            value={
              profileConfig.MODULES
                ? renderModules(profileConfig.MODULES)
                : "modules to load"
            }
            isUserProvided={!profileConfig.MODULES}
          />
        )}
        {isSSHRunner && (
          <>
            <div className="pt-1 pb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SSH:
              </span>
            </div>
            <div className="ml-4 space-y-2">
              <ConfigRow
                label="Host"
                value={
                  profileConfig.SSH?.HOST
                    ? profileConfig.SSH.HOST
                    : "your SSH host"
                }
                isUserProvided={!profileConfig.SSH?.HOST}
              />
              <ConfigRow
                label="Username"
                value={
                  profileConfig.SSH?.USERNAME
                    ? profileConfig.SSH.USERNAME
                    : "your SSH username"
                }
                isUserProvided={!profileConfig.SSH?.USERNAME}
              />
              {profileConfig.SSH?.PORT && (
                <ConfigRow label="Port" value={profileConfig.SSH.PORT} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RunnerConfigSection = () => {
  const {
    data: runnerProfiles,
    error: runnerProfilesError,
    isLoading: runnerProfilesLoading,
  } = autosubmitApiV4.endpoints.getRunnersConfigProfiles.useQuery();

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

        {/* SSH Keys */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Public SSH Keys</h3>

          <div className="mb-4 text-sm ml-2 text-gray-700 dark:text-gray-300">
            Include these public SSH keys your authorized_keys file to allow SSH
            access to runners. Example command:{" "}
            <code className="border p-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-red-600">
              echo $API_PUBLIC_KEY &gt;&gt; ~/.ssh/authorized_keys
            </code>{" "}
            where{" "}
            <code className="border p-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-red-600">
              $API_PUBLIC_KEY
            </code>{" "}
            is any of the keys below. Note that by adding these keys, you are
            allowing the Autosubmit API to access your runner machines via SSH.
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

          {publicSSHKeys && publicSSHKeys.length === 0 && (
            <div className="px-4 py-4 text-gray-500">
              No public SSH keys found
            </div>
          )}

          {publicSSHKeys && publicSSHKeys.length > 0 && (
            <div className="px-4 flex flex-col gap-4">
              {publicSSHKeys.map((key, idx) => {
                return <SSHKeyBox key={idx} keyValue={key} />;
              })}
            </div>
          )}
        </div>

        {/* Runner Profiles */}
        <h3 className="text-2xl font-semibold mb-4">Available profiles</h3>

        {runnerProfilesLoading && (
          <div className="px-4 text-center py-8">
            <i className="fa-solid fa-spinner fa-spin me-2" />
            Loading runner profiles...
          </div>
        )}

        {runnerProfilesError && (
          <div className="px-4 text-center py-8 text-red-500">
            <i className="fa-solid fa-exclamation-triangle me-2" />
            Error loading runner profiles
          </div>
        )}

        {runnerProfiles && Object.keys(runnerProfiles).length === 0 && (
          <div className="px-4 pt-4 pb-2 text-gray-500">
            No runner configuration profiles found
          </div>
        )}

        {runnerProfiles && (
          <div className="px-4 flex flex-col gap-8">
            {Object.entries(runnerProfiles).map(
              ([runnerProfileName, runnerProfileConfig]) => (
                <RunnerProfileDetails
                  key={runnerProfileName}
                  profileName={runnerProfileName}
                  profileConfig={runnerProfileConfig}
                />
              ),
            )}
          </div>
        )}
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
              <span className="font-semibold me-4">
                Token{" "}
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={300}>
                    <Tooltip.Trigger>
                      <i className="fa-solid fa-info-circle opacity-70" />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="right"
                      align="center"
                      className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
                    >
                      This Bearer token is used to authenticate requests made to
                      the Autosubmit API. Add it to the Authorization header of
                      your HTTP requests with the format: <br />
                      <code className="font-mono text-xs p-1 text-red-600">
                        Authorization: Bearer &lt;token&gt;
                      </code>
                      <br />
                      Keep it secure and do not share it with unauthorized
                      parties.
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>{" "}
                :
              </span>

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
